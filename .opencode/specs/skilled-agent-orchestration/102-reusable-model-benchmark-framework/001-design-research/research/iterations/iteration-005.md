# Iteration 5: Model-agnostic dispatch (executor/provider/reasoning sweep, cost/latency)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 120,553

---

## Codex findings (verbatim)

**Bottom Line**
`dispatch-model.cjs` is a decent executor router today, but not yet a universal benchmark dispatcher. It parameterizes executor/model/agent/variant/state/timeout and handles retry/pause/mock, but it does not normalize metrics, parse OpenCode JSON events, model provider/quota routing, or expose an executable capability table.

**1. Current Dispatcher Completeness**
`dispatch-model.cjs` declares the intended interface as `dispatch({ prompt_file, executor, model, agent, variant, state_dir, mock, mock_mode, cwd, timeout_ms })` returning `{ ok, exit_code, stdout, stderr, attempts, paused?... }` in [.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:13).

Executors it supports:

- `cli-opencode`: known executor at lines 105-111. Builds `opencode run --model <model> --dir <dir>`, conditionally adds non-general `--agent`, conditionally adds `--variant`, then passes prompt text as positional args, lines 190-201. The important lines are: `const args = ['run', '--model', model, '--dir', dir];`, `if (agent && agent !== 'general') args.push('--agent', agent);`, `if (variant) args.push('--variant', variant);`.

- `cli-claude-code`: builds `claude -p <prompt> --model <model> --permission-mode <plan|acceptEdits> --output-format text`, then maps `variant` to `--effort`, lines 203-209.

- `cli-codex`: builds `codex exec --model <model> -c approval_policy=never --sandbox <read-only|workspace-write>`, then maps `variant` to `-c model_reasoning_effort=<variant>`, and sends prompt via stdin, lines 211-218.

- `cli-gemini`: builds `gemini <prompt> -m <model> -o text`, optionally `-y` only for write-capable mode, lines 220-225. No reasoning/variant mapping.

- `cli-devin`: builds `devin --print --prompt-file <file> --model <model> --permission-mode <auto|dangerous>`, lines 227-234. No reasoning/variant mapping.

What it does not capture:

- No token/cost fields: success returns only `{ ok, exit_code, stdout, stderr, attempts }`, line 284.
- No latency: it does not wrap spawn with `Date.now()`.
- No normalized `{output, tokens_in, tokens_out, cost_usd, latency_ms, exit_code}` envelope.
- No OpenCode `--format json` parsing: the opencode builder omits `--format json`, lines 197-200.
- No provider routing as a first-class field: provider is embedded in the model string, e.g. default `minimax-coding-plan/MiniMax-M2.7-highspeed`, line 256.
- No executable capability table. Agent omission is hard-coded for `cli-opencode` at lines 193-199, not profile-driven.
- `agent` only affects `cli-opencode`; the other executor builders ignore it.

**2. What The Rolled Dispatchers Capture**
The MiMo harness captures useful benchmark data that `dispatch-model.cjs` lacks. In [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:69), dispatch wraps `opencode run` in `gtimeout`, passes `--format json`, closes stdin, and records elapsed `ms`, lines 69-94. It parses assistant text from newline JSON events where `ev.type === 'text'` and `ev.part.text` exists, lines 48-64. It persists `exit`, `ms`, `prompt`, `assistant_text`, and stderr, lines 141-164, and result rows include `output_chars`, `output_words`, and `ms`, lines 193-213.

`runner-child.cjs` adds the subprocess isolation pattern: it receives one JSON payload on `argv[2]`, evaluates the candidate function with `new Function`, runs one test, and emits one JSON result, lines 29-65. That pattern is reusable for deterministic fixture verification, not dispatch itself.

The older MiniMax dispatcher hard-codes `opencode run --model MODEL --agent AGENT --dir dir promptText`, lines 83-89 of [dispatch-minimax.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/dispatch-minimax.cjs:83), and explicitly says `--variant` is intentionally not passed, lines 12-13. SWE 1.6 hard-codes Devin with `--print --model swe-1.6 --permission-mode auto --prompt-file`, lines 72-77 of [dispatch-swe16.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/dispatch-swe16.cjs:72).

**3. Cost/Latency Capture**
Latency is clear: MiMo records `Date.now()` before spawn and returns `ms`, [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:70).

Tokens/cost are not proven in the read files. OpenCode docs here say `--format json` is a newline-delimited event stream with `type`, `timestamp`, `session_id`, `payload`, [.opencode/skills/cli-opencode/references/cli_reference.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/references/cli_reference.md:273). They also list `opencode stats` as “Token and cost statistics”, but not invoked by cli-opencode, line 70. The MiMo harness does not parse tokens/cost; it parses assistant text only, [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:48).

So the normalized envelope should be:

```js
{
  ok,
  output,
  stdout,
  stderr,
  tokens_in: parsedOrNull,
  tokens_out: parsedOrNull,
  cost_usd: parsedOrNull,
  latency_ms,
  exit_code,
  attempts,
  executor,
  provider,
  model,
  variant
}
```

For OpenCode, parse JSONL when `--format json` is enabled: concatenate text events like MiMo does, inspect `session.completed.payload` for usage/cost if present, otherwise null. For non-OpenCode executors, use executor-specific parsers if their output formats expose usage; otherwise return nulls honestly.

**4. Sweep Design**
Profile shape should separate logical model id, executor path, provider, concrete model slug, and reasoning variants:

```json
{
  "models": ["mimo-v2.5-pro", "minimax-2.7"],
  "executors": ["cli-opencode", "cli-codex"],
  "variants": ["low", "medium", "high"],
  "include": [
    {
      "model": "mimo-v2.5-pro",
      "executor": "cli-opencode",
      "provider": "xiaomi-token-plan-ams",
      "model_slug": "xiaomi-token-plan-ams/mimo-v2.5-pro",
      "quota_pool": "xiaomi-token-plan",
      "variants": ["high"]
    }
  ]
}
```

Mapping:

- OpenCode: `variant -> --variant <level>`, supported by cli reference lines 93-103 and default lines 121-124.
- Codex: `variant -> -c model_reasoning_effort=<level>`, [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:215).
- Claude Code: `variant -> --effort <level>`, line 208.
- Gemini: currently UNKNOWN from repo evidence; dispatcher ignores variant, lines 220-225.
- Devin: currently UNKNOWN from repo evidence; dispatcher ignores variant, lines 227-234.

The registry already has model/executor/provider/quota rows in [.opencode/skills/sk-prompt/assets/model-profiles.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/assets/model-profiles.json:3), but quirks/default variants are prose notes, not machine-readable fields.

**5. `--agent` Omission**
Current `dispatch-model.cjs` handles this only for `cli-opencode`: it defaults `agent` to `general`, line 257, but only pushes `--agent` if `agent !== 'general'`, lines 197-199. The reason is documented in comments: `general` warns/falls back and token-plan providers may reject it, lines 193-196.

That should move into config:

```json
{
  "executor": "cli-opencode",
  "provider": "xiaomi-token-plan-ams",
  "flags": {
    "agent": { "mode": "omit_if_default", "default": "general" },
    "variant": { "flag": "--variant", "default": "high" },
    "format": { "flag": "--format", "default": "json" }
  }
}
```

Evidence for the quirk exists in cli-opencode docs: MiniMax says omit `--agent`, [.opencode/skills/cli-opencode/assets/prompt_templates.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/assets/prompt_templates.md:453); MiMo says omit `--agent` and always pass `--variant high`, line 500. The SKILL routing table repeats MiniMax omit-agent at [.opencode/skills/cli-opencode/SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/SKILL.md:208) and MiMo omit-agent at line 217.

**6. Token-Plan / Quota Provider Modeling**
Provider routing should be profile metadata, not inferred from model string. The model registry already says each model declares executor paths with provider and quota pool, [.opencode/skills/sk-prompt/assets/model-profiles.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/assets/model-profiles.json:3).

Concrete evidence:

- MiniMax M3 Token Plan: provider `minimax-coding-plan`, quota pool `minimax-token-plan`, lines 193-200.
- MiniMax 2.7 has both Token Plan and Direct API executor paths, lines 221-235.
- MiMo: provider `xiaomi-token-plan-ams`, quota pool `xiaomi-token-plan`, lines 253-266.
- cli-opencode auth docs list configured providers including `minimax-coding-plan`, `minimax`, and `xiaomi-token-plan-ams`, [.opencode/skills/cli-opencode/SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/SKILL.md:178).

**Proposals**
1. Add a dispatcher profile schema with executable `executor/provider/model_slug/quota_pool/flags/default_variant/agent_policy`.
2. Make `dispatch-model.cjs` always return a normalized envelope with latency and nullable token/cost fields.
3. Add OpenCode JSON mode to the `cli-opencode` builder and parse JSONL using the MiMo `extractAssistantText` pattern.
4. Move `--agent` omission and `--variant` defaults out of code comments/prose notes into provider capability config.
5. Add a sweep runner that expands `models × executors × variants`, then filters by capability/profile include rules.
6. Keep scorer/test isolation separate: reuse `runner-child.cjs` style for fixture validation, not for dispatch.

```json
[
  {
    "priority": "P0",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs",
    "change": "Return normalized dispatch envelopes with output, stdout, stderr, latency_ms, exit_code, attempts, tokens_in, tokens_out, cost_usd, executor, provider, model, variant.",
    "confidence": 0.93
  },
  {
    "priority": "P0",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs",
    "change": "For cli-opencode, support --format json and parse newline JSON events for assistant output and any available usage/cost fields; leave missing usage as null.",
    "confidence": 0.86
  },
  {
    "priority": "P0",
    "target": ".opencode/skills/sk-prompt/assets/model-profiles.json",
    "change": "Promote provider quirks from prose notes into machine-readable fields: model_slug, default_variant, variant_flag, agent_policy, format_mode, quota_pool.",
    "confidence": 0.91
  },
  {
    "priority": "P1",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark",
    "change": "Add a sweep runner/profile loader that expands models[], executors[], variants[] and filters invalid combinations through the capability table.",
    "confidence": 0.88
  },
  {
    "priority": "P1",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs",
    "change": "Add executor-specific metric parsers for Claude, Codex, Gemini, and Devin where their CLIs expose usage; otherwise preserve nulls with parser_status.",
    "confidence": 0.72
  },
  {
    "priority": "P2",
    "target": ".opencode/skills/cli-opencode/references/cli_reference.md",
    "change": "Document whether OpenCode session.completed payload includes token/cost fields in the current binary; current repo evidence only proves event stream shape, not usage fields.",
    "confidence": 0.80
  }
]
```
