# Iteration 2: Fixture taxonomy + anti-saturation

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 86,034

---

## Codex findings (verbatim)

**Quantification**

The current two-code-fixture rig is saturated on correctness. In the high runs, MiMo scored `50/50` assertions across `10/10` dispatches, and MiniMax scored `50/50` across `10/10`; I verified that with `jq` against the result JSONs. The synthesis says the same across all four cells: `40/40` scored dispatches and every captured response at `100%` hidden-assertion pass rate, so ranking was “entirely format/length-driven” rather than correctness-driven ([synthesis-high-reasoning.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:84)).

The concrete split: MiMo high had all correctness passes but only `9/10` format adherence because `cidi__parseRange` passed all assertions while failing format as “prose outside code” ([results-mimo-high.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results-mimo-high.json:222)). MiniMax high had all correctness passes and all format adherence, with the only anomaly being a transient first-attempt timeout that retried successfully ([results-minimax-high.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results-minimax-high.json:438)). So correctness separated nothing; format and word count did.

**Evidence Base**

The current artifact-contract fixtures are schema-light: `requiredHeadings`, `requiredPatterns`, `forbiddenPatterns`, and `content` ([fixture-baseline.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-baseline.json:5), [fixture-improved.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-improved.json:5), [fixture-edge.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-edge.json:5)). That is good for format contracts, weak for behavioral discrimination.

The two MiMo fixtures hide their tests from the prompt by keeping `tests` inside `fixtures.cjs`; `chunk` and `parseRange` each have five assertions, including extra edge checks not stated as examples ([fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/fixtures.cjs:1), [fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/fixtures.cjs:20)). The harness extracts one function and separately checks “code only” format ([extract.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/extract.cjs:20), [extract.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/extract.cjs:66)). It also isolates each test case in a child process with a timeout, which is the right primitive for harder fixtures ([runtests.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/runtests.cjs:1)).

The older seven-fixture rig already points toward the missing taxonomy: hallucinated CLI flags, wrong CWD paths, bundle smoke run, multi-file scope boundary, strict deep equality, adversarial path traversal, and a baseline pure function ([seed-fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/seed-fixtures.cjs:23)). Its task descriptors include `cluster`, `task_description`, scoped `allowed_writes`, deterministic `acceptance`, `grounded_in`, and `allowlist` fields ([fix-001 task.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/fixtures/fix-001-hallucinated-cli-flag/task.json:1)).

**Reusable Taxonomy**

| Category | Why it discriminates | Existing grounding / extension |
|---|---|---|
| `algorithmic` | Separates only when hidden cases are rich enough; simple pure functions saturate. | `chunk` / `parseRange` prove the current weak form ([fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/fixtures.cjs:8)); `deepEqual` is the stronger form with circular refs, Date, NaN, undefined-key semantics ([fix-005 task.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/fixtures/fix-005-acceptance-strict/task.json:1)). |
| `bug-fix-in-context` | Forces diagnosis from surrounding code instead of generating a fresh answer. | Wrong-CWD and bundle smoke-run fixtures test contextual failure modes ([fix-002 task.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/fixtures/fix-002-wrong-cwd-paths/task.json:1), [fix-003 task.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/fixtures/fix-003-bundle-gate-smoke-run/task.json:1)). |
| `refactor` | Tests behavior preservation and scope control, not just final output. | Multi-file rename fixture explicitly rejects sed-style global rename ([fix-004 task.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/fixtures/fix-004-multi-file-scope-boundary/task.json:1)). |
| `ambiguous-spec` | Rewards asking/limiting scope when the prompt is underspecified or adversarially tempting. | Existing `allowed_writes` gives a scope oracle; extend with expected “no-op / ask / constrained edit” outcomes ([fix-004 task.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/fixtures/fix-004-multi-file-scope-boundary/task.json:5)). |
| `multi-file` | Requires tracing imports/callers and avoiding unrelated same-name symbols. | Directly grounded in `a.ts/b.ts/c.ts` allowed writes versus `d.ts/e.ts` forbidden changes ([seed-fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/seed-fixtures.cjs:89)). |
| `long-context` | Separates retrieval and instruction priority under noise. | UNKNOWN: I did not see a true large-context fixture in the requested files; add `contextFiles`, `needle`, and `distractorPolicies` to the schema. |
| `tool-use/agentic` | Separates models that inspect, run, retry, and validate from models that answer once. | The scorer already has deterministic commands, extraction, snapshot/restore, and hard-gate scoring hooks ([score-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/score-variant.cjs:55), [score-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/score-variant.cjs:138)). |
| `format-adherence` | Useful as a secondary axis, but it should not masquerade as correctness. | Current artifact fixtures and `extract.cjs` already cover this axis ([fixture-edge.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-edge.json:5), [extract.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/extract.cjs:66)). |

**Difficulty Tiers**

T1 trivial: expected frontier pass rate >=95%; one file; no adversarial hidden cases. Current `chunk` / `parseRange` belong here after observed saturation.

T2 moderate: expected pass rate 70-95%; one or two edge cases; deterministic tests; limited context. `formatBytes` baseline is probably T2 at most ([fix-007 task.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/fixtures/fix-007-baseline-pure-function/task.json:1)).

T3 hard: expected pass rate 40-70%; multi-file scope, adversarial input, or real smoke-run oracle. `deepEqual`, path traversal, and multi-file rename fit here.

T4 frontier-separating: expected pass rate 20-60% across frontier models, with partial-credit structure. Requires at least two of: long context, hidden adversarial tests, multi-file causal tracing, ambiguous spec, required tool iteration, or security boundary.

Tier assignment should be empirical: start from estimated tier, run across at least `N >= 3` model/framework cells, then reclassify by observed correctness distribution. If everyone gets 100%, demote or retire; if everyone fails, reduce ambiguity or split the fixture.

**Hidden-Test Anti-Overfitting**

The 126 rig’s core anti-overfit move is sound: dispatch only the task statement, keep `tests` in harness data, and run the extracted answer against held-out assertions ([fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/fixtures.cjs:1)). Generalize it with three pools: visible examples, hidden fixed tests, and generated adversarial tests. For code, use deterministic property generators with a seed recorded in results. For file-edit tasks, use hidden diff/path checks plus smoke commands. For agentic tasks, score evidence of iteration: command run, failure observed, fix applied, final check passed.

**Reusable Fixture-Pack Schema**

Use JSON plus optional sidecar seed files. Existing fields map cleanly: `cluster -> category`, `task_description -> prompt`, `scope.allowed_writes -> scope`, `acceptance -> scoring.hooks`, artifact `requiredPatterns` into `format.requiredPatterns`.

```json
{
  "id": "fix-xxx",
  "category": "multi-file",
  "tier": "T3",
  "expectedDifficulty": { "frontierPassBand": [0.4, 0.7], "rationale": "same-name symbols outside scope" },
  "prompt": "User-facing task text",
  "visibleSpec": {
    "examples": [],
    "constraints": [],
    "format": { "requiredHeadings": [], "requiredPatterns": [], "forbiddenPatterns": [] }
  },
  "scope": {
    "cwd": "fixtures/fix-xxx/seed",
    "allowedWrites": [],
    "forbiddenWrites": [],
    "contextFiles": []
  },
  "oracle": {
    "visibleTests": [],
    "hiddenTests": [],
    "generatedTests": { "kind": "property", "seed": 12345, "count": 50 },
    "adversarialCases": []
  },
  "scoring": {
    "primary": "correctness",
    "hooks": [{ "type": "deterministic", "command": "npm test", "expectedExit": 0 }],
    "formatWeight": 0.1,
    "lengthWeight": 0.0,
    "partialCredit": true
  },
  "saturation": {
    "retireIfPerfectAcross": { "models": 3, "frameworks": 5, "runs": 2 },
    "promoteIfPassBandAbove": 0.95
  }
}
```

**Automatic Saturation Detection**

Flag fixture saturation when `>= N` independent model/framework cells score `100%` correctness and the variance is zero. For this repo, a practical rule is: if `3+` frontier models or `15+` model-framework dispatches all hit `assertion_pass_rate = 1`, mark `saturation.status = saturated`. Then either promote the fixture by adding adversarial hidden cases, move it to T1 smoke coverage, or retire it from correctness ranking. The synthesis already names the failure mode: two deterministic pure functions made correctness useless, leaving only format and length ([synthesis-high-reasoning.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:111)).

**Proposals**

1. Keep `format-adherence` as a separate benchmark lane. Do not include it in “correctness winner” claims once correctness saturates.

2. Promote the 120 seven-fixture shape into the canonical fixture-pack schema: category, tier, prompt, scope, seed sidecars, hidden oracle, deterministic hooks, format hooks, saturation policy.

3. Replace `chunk` and `parseRange` as ranking fixtures with T3/T4 fixtures: `deepEqual`, path traversal, multi-file rename, wrong-CWD, and bundle smoke-run are already grounded precedents.

4. Add generated hidden tests for algorithmic fixtures. Pure fixed assertions are too easy to infer; seeded property tests make pattern matching less effective while staying reproducible.

5. Add long-context and agentic fixtures. UNKNOWN from the requested files: I did not find a true long-context fixture or a tool-call-required scoring contract, so those are new schema extensions rather than current repo behavior.

6. Add a saturation report to result synthesis: per fixture, show correctness variance, perfect-pass count, format variance, and action: `keep`, `promote`, `smoke-only`, or `retire`.

```json
[
  {
    "priority": "P0",
    "target": "fixture taxonomy",
    "change": "Separate correctness categories from format-adherence; keep format as a secondary lane so saturated correctness cannot produce misleading winners.",
    "confidence": 0.95
  },
  {
    "priority": "P0",
    "target": "fixture schema",
    "change": "Adopt JSON+sidecar fixture packs with category, tier, prompt, visibleSpec, scope, hidden oracle, scoring hooks, expectedDifficulty, and saturation policy.",
    "confidence": 0.9
  },
  {
    "priority": "P0",
    "target": "correctness fixture mix",
    "change": "Retire chunk/parseRange from ranking use or demote them to T1 smoke fixtures; replace with T3/T4 bug-in-context, multi-file, adversarial, and strict-acceptance fixtures.",
    "confidence": 0.95
  },
  {
    "priority": "P1",
    "target": "hidden tests",
    "change": "Generalize the 126 hidden tests into fixed held-out tests plus seeded randomized/property cases and adversarial edge pools.",
    "confidence": 0.85
  },
  {
    "priority": "P1",
    "target": "saturation detection",
    "change": "Auto-flag fixtures where multiple model/framework cells all score 100% correctness with zero variance; require promote, demote-to-smoke, or retire action.",
    "confidence": 0.9
  },
  {
    "priority": "P2",
    "target": "new fixture categories",
    "change": "Add explicit long-context and tool-use/agentic fixtures; current requested files show scoring primitives but not a true long-context or required-tool-use fixture.",
    "confidence": 0.75
  }
]
```
