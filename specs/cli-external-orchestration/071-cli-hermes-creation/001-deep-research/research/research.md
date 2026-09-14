---
title: "Consolidated Research: Hermes Agent as the seventh cli-external-orchestration runtime"
description: "Two-lineage forced-depth deep-research synthesis (DeepSeek V4 Flash Max, 10 iterations, and SWE-2 Max, 5 iterations, both via cli-devin) on what Hermes Agent v0.21.1 can do as a headless dispatch target, how it compares with the six existing runtimes, whether it is fit for deep-loop fan-out, and the phase plan the integration should follow."
lineages:
  - deepseek (cli-devin, deepseek-v4-flash-max, 10 iterations, maxIterationsReached)
  - swe2 (cli-devin, swe-2-max, 5 iterations, maxIterationsReached)
verdict: integrate, gated on a live contract pin
convergence: strong on the dispatch contract, fan-out posture and phase order; three named disagreements resolved against the source below
created: 2026-09-14
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/001-deep-research"
    last_updated_at: "2026-09-14T19:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Consolidated two-lineage synthesis authored after citation verification"
    next_safe_action: "Present findings; scaffold confirmed phases"
    blockers: []
    key_files:
      - "research/lineages/deepseek/research.md"
      - "research/lineages/swe2/research.md"
      - "research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-001-deep-research"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
trigger_phrases:
  - "hermes research synthesis"
  - "cli-hermes findings"
  - "hermes versus six runtimes"
---

# Consolidated Research: Hermes Agent as the seventh cli-external-orchestration runtime

> **Method.** One fan-out, two independent forced-depth lineages, both through `cli-devin` with `stop_policy: max-iterations`: `deepseek` (`deepseek-v4-flash-max`, 10 iterations, one per angle) and `swe2` (`swe-2-max`, 5 iterations, angles grouped). Both read the installed Hermes source at `~/.hermes/hermes-agent` (v0.21.1, upstream `dc90a75a`), ran read-only `hermes` commands with stdin closed, and cited file and line. Neither ran a smoke dispatch: `hermes status` shows no configured provider on this machine. The orchestrating session opened eleven citations across the two syntheses; all eleven resolve (recorded in section 7). Per-lineage syntheses: `lineages/deepseek/research.md`, `lineages/swe2/research.md`. Merged registry: `findings-registry.json` (90 key findings).

---

## 1. Executive verdict

**Integrate Hermes as `cli-hermes`, the seventh runtime, and as a fan-out executor kind, after one live contract pin.** Both lineages reached this independently. Hermes meets every hard requirement the six existing runtimes meet: a deterministic headless form, a write-permitting flag, a per-run wall-clock budget, model and reasoning knobs that map one-to-one onto the executor schema, a real state-directory override, an inherited self-invocation marker, and exit codes that cannot be flipped after the turn ends.

Two things gate the build, and both belong to the first integration phase:

1. **No provider is configured in the local Hermes install.** Every dispatch finding is source-verified, not live-verified. One credential step and one smoke dispatch come before any executor code.
2. **Hermes keeps config, hooks and MCP at the user level** (`~/.hermes/config.yaml`), unlike all six runtimes, which carry them in a repo dotfolder. The repo-root `.hermes/` folder can carry skills and plugins only. The packet must document the operator steps as operator steps.

The dispatch shape is settled by source reading and is the same in both lineages:

```
hermes chat -Q --query-file <prompt-file> --yolo --ignore-rules --run-budget <S> --max-turns <N> \
  -t <explicit toolset list> --source tool --in <repo root> </dev/null
```

Response text on stdout; `session_id: <id>` and `Error: ...` on stderr; exit 0 on success, 1 on `result.failed`, 130 on interrupt.

---

## 2. Findings by angle

### Angle 1: headless dispatch contract

- Hermes has two headless entry points with different semantics. `hermes -z "<prompt>"` bypasses the CLI object, auto-sets `HERMES_YOLO_MODE=1` and `HERMES_ACCEPT_HOOKS=1`, and prints only the final response with no session id. `hermes chat -q ...` on a non-TTY implies `--oneshot`; with `-Q` it prints the response to stdout and `session_id:` to stderr. Both lineages reject `-z` for lineages: it is the un-auditable form. [`hermes_cli/oneshot.py:200-207`, `cli.py:4085-4117`, verified]
- Without `--yolo`, `chat -q` takes the deterministic single-query approval path, which **defaults to deny** and denies on an unreadable config. A headless `chat -q` with no `--yolo` refuses writes rather than hanging. [`tools/approval_context.py:260-277`, verified]
- Exit codes: `chat -Q` 0 or 1 (1 only on `result.failed`), 130 on interrupt; `-z` adds 2 for usage errors and failed-with-empty-response. Process ends in `os._exit(rc)`, so late handlers cannot change the code. **Gap:** run-budget exhaustion has no distinct exit code; a partial answer with a response exits 0.
- `--query-file PATH` reads the prompt verbatim with no shell interpretation (`-` reads stdin); it is the safe carrier for long iteration briefs, and it removes the argv length risk that `-q` carries.
- Isolation flags: `--ignore-rules` skips `AGENTS.md`, `SOUL.md`, `.cursorrules`, memory and preloaded skills; `--ignore-user-config` skips `config.yaml` but still loads `.env`; `--safe-mode` also disables plugins and MCP. [`hermes_cli/_parser.py:165-170`]

### Angle 2: providers, models and reasoning

- Hermes ships a broad provider catalog (the lineages count 35 to 45 canonical entries, including `deepseek`, `zai` for GLM, `xiaomi` for MiMo, `minimax`, `xai`, `openai-codex` OAuth, `ai-gateway`, `custom` OpenAI-compatible, and local servers). `--reasoning` accepts exactly the repo's `REASONING_EFFORTS` enum (`none minimal low medium high xhigh max ultra`), so the executor's `reasoningEffort` flag maps without translation.
- **Live:** `hermes status` reports `Model: (not set)`, `Provider: Auto`, every API-key provider not set and every OAuth provider not logged in. `~/.hermes/.env` holds only tool and debug settings. This is why no smoke dispatch ran.
- Two credential paths need no new secret: the DevPass LLM Gateway key already used by cli-pi and opencode (`custom` provider with `key_env`), and the Codex OAuth import, which reads `~/.codex/auth.json` once at login and then keeps its own session in `~/.hermes/auth.json`. The lineages disagreed on whether Codex auth is "portable"; the source shows a one-time bootstrap read, never a shared store. [`hermes_cli/auth_codex.py:3,387,679`, verified]
- Recommended starting roster, fail-closed: `deepseek-v4.1-flash` and `glm-5.3-flash` through the LLM Gateway route, with the effort-name mapping through the gateway pinned live.

### Angle 3: the repo-root `.hermes/` folder and instruction files

- From the working directory Hermes injects exactly `AGENTS.md`, `CLAUDE.md` and `.cursorrules`; `SOUL.md` is user-level. [`agent/coding_context.py:35,38`; `agent/prompt_builder.py:1465-1578`]
- Repo-local skills load only from `./.hermes/skills` and `./.agents/skills`, and only after `hermes skills trust`, which writes `skills.trusted_project_dirs` into the **user-level** config. The repo cannot carry the trust grant. [`agent/skill_utils.py:410,490`; `hermes_cli/main_agent_cmds.py:180-223`, verified]
- A symlink from `./.hermes/skills` to `.opencode/skills` is followed and **flattened**: the walk uses `os.walk(..., followlinks=True)`, so every one of the repo's 174 `SKILL.md` files (hubs and modes alike) loads as a peer skill. The parent-hub single-advisor identity does not survive the crossing. [`agent/skill_utils.py:745`, verified]
- Per-file symlinks are worse than a whole-directory symlink: the static scanner flags a symlink resolving outside a skill directory as a critical traversal. Quarantine is per skill directory and fail-closed.
- Repo-local plugins exist too: `./.hermes/plugins/<name>/`, opt-in through `HERMES_ENABLE_PROJECT_PLUGINS`. [`hermes_cli/plugins.py:5`, `plugins_discovery.py:154`, verified]
- **Disagreement resolved:** swe2 wrote that Hermes has "no repo-local `.hermes/` config surface". That is true for config, hooks and MCP and false for skills and plugins. The `.hermes/` folder this packet creates carries skills, plugins, prompt templates, `SYNC.md` and the playbook symlink; everything else is an operator step.

### Angle 4: skill format compatibility

- All 174 repo `SKILL.md` files pass Hermes's hard validator (name, description, body, name matches directory). None is hard-rejected.
- All 174 descriptions exceed Hermes's 60-character prompt budget and are truncated to 57 characters plus an ellipsis in the skill listing. Routing signal is lost, not loading. A retrofit is optional; the lineage recommends against a mass frontmatter change.
- Advisory lint warnings (missing `version`, `author`, `license`, `metadata.hermes.*`) fire almost everywhere and never block.
- Hermes honors the agentskills.io convention structurally and is stricter on description length (60 versus 1024 characters). [agentskills.io specification, fetched 2026-09-14]

### Angle 5: agents, commands and persona

- Profiles are whole-home islands (own `config.yaml`, `.env`, `auth.json`, sessions), not personas. Thirteen profiles for thirteen agents is the wrong tool.
- `delegate_task` children receive goal and context only; they cannot consume `.claude/agents/*.md`.
- `hermes import-agent claude-code` maps `CLAUDE.md` or `AGENTS.md` into memory entries, copies skills into `~/.hermes/skills`, and imports MCP config and memories. It does not import agent files, it bypasses the trust and quarantine path, and it copies repo state into the user home. Do not use it for this integration.
- Persona routes that work: inline the persona into the dispatch prompt (the `cli-codex` and `cli-pi` precedent), or preload a persona skill with `-s`. Nested commands have no Hermes equivalent; flatten them into prompt templates carried by `--query-file`, as packet 031 did for Pi.

### Angle 6: hooks and plugins

- Shell hooks are declared only in user-level `config.yaml`, gated by a per-command consent allowlist at `~/.hermes/shell-hooks-allowlist.json`; `--accept-hooks` or `HERMES_ACCEPT_HOOKS=1` bypasses the prompt on headless runs. None is configured today.
- The native plugin hook list covers every guard core the repo has: `pre_tool_call`, `pre_verify` (block or continue, the match for completion-evidence stop), `on_session_start`, `on_session_end`, `subagent_start`, `subagent_stop`, `pre_gateway_dispatch` and more. [`hermes_cli/plugins.py:117`, verified]
- A repo-carried project plugin under `./.hermes/plugins/repo-guards/` that shells out to the existing `.mjs` and `.sh` guard cores is the smallest bridge. Agent Plugins v1 portable packages are deferred; their hook surface is unsettled.

### Angle 7: MCP

- `mcp_servers:` lives in user-level config only. The repo cannot carry MCP registration, which differs from all six runtimes. [`hermes_cli/mcp_config.py:55-60`, verified]
- The repo's code-mode stdio launcher fits `hermes mcp add --command/--args/--env` on paper (documented, unconfirmed). Deny-by-default per tool is `hermes tools disable server:tool`. `hermes mcp serve` (Hermes as an MCP server) has no consumer here.
- The `chat` path waits for MCP cold start before its only tool snapshot; with no servers configured it is a no-op, and any future `hermes mcp add` adds startup latency to every lineage unless `--safe-mode` or a profile scopes it.

### Angle 8: deep-loop fan-out fitness

- Every capability finds a named slot in the runtime tables: `EXECUTOR_KINDS` gains `cli-hermes`; `EXECUTOR_KIND_FLAG_SUPPORT` gets `model`, `reasoningEffort`, `configDir` (mapped to `HERMES_HOME` or `--profile`), `timeoutSeconds`, `liveTools`, and no `sandboxMode`; the preventive-sandbox map records `false`, the same posture as devin, pi and opencode; the web-search matrix records `live: true` because `-t web` forces the toolset per dispatch; state env `SPECKIT_HERMES_STATE_DIR` plus `HERMES_HOME`; env prefix `HERMES_` plus rostered provider prefixes.
- Self-invocation markers exist and are inherited by child processes: `HERMES_AGENT=true` and `HERMES_SESSION_ID`. [`hermes_cli/main.py:3145`, `agent/agent_init.py:1117`, verified] `HERMES_TURN_AUTHOR` is deliberately scrubbed from children. [`agent/turn_author.py:83-90`, verified] **Disagreement resolved:** deepseek concluded an ancestry marker was required because it looked only at the scrubbed variable; swe2 found the inherited pair. Use `HERMES_AGENT` like `CURSOR_AGENT=1`.
- `cli-hermes` must not join `SELF_PRESENCE_EXEMPT_KINDS`: that exemption exists because Pi has no in-process delegation, and Hermes has `delegate_task`.
- `--profile` exists and sets `HERMES_HOME` before imports, but a fresh profile has a fresh `.env` and `auth.json`, so a fan-out profile is logged out of every provider. Phase one posture: shared home plus `--ignore-rules` plus `--source tool`; a seeded profile is a later hardening step. [`hermes_cli/_parser.py:14`, verified]
- `--worktree` runs `git worktree add`, which writes `.git/worktrees/` inside the repository and would trip write containment. Never pass it from the builder.
- The stock toolset roster has `delegation` enabled; leaf lineages must pass an explicit `-t` list that excludes `delegation` and `memory`.
- Writes to `~/.hermes` (sessions database, memories, logs, checkpoints) are outside the repository and invisible to the containment guard.
- Pair `--run-budget` slightly below the runner's `timeoutSeconds` so the in-agent wrap-up wins the race; treat exit 0 with an empty response as a soft failure.

### Angle 9: constraints and differences versus the six runtimes

- Startup measured at 0.86 seconds for `hermes --version` (a lower bound for a real dispatch). The install is a git checkout that `hermes update` can move; pin v0.21.1 in the packet.
- Curator, gateway and cron are off by default; `chat` spawns none of them. `hermes pause` stops cron, kanban and gateway turns only; it does not stop a CLI dispatch, so the runner's kill is the emergency stop. [`agent/estop.py:4`, verified]
- Ambient injection is the heaviest of the seven runtimes: `SOUL.md`, memories, session search and the CWD instruction files all inject unless `--ignore-rules` is passed.
- Terminal backends (docker, ssh, modal, daytona, singularity) are config-level, not per-run, and are the only route to a real sandbox; optional hardening.
- Hard rules the packet needs: `stdin-redirect-required`, `hermes-availability-required`, `yolo-required-for-writes`, `ignore-rules-required`, `explicit-toolsets-required`, `no-worktree-flag`, `mcp-config-operator-required`, `hooks-user-level`.

### Angle 10: recommendation

Both lineages keep the parent's phase order and shrink the middle. See section 4.

---

## 3. Capability comparison

| Capability | Hermes | cli-opencode | cli-claude-code | cli-codex | cli-cursor | cli-devin | cli-pi |
|---|---|---|---|---|---|---|---|
| Headless form | `chat -Q --query-file` | `opencode run` | `claude -p` | `codex exec` | `cursor-agent -p` | `devin -p` | `pi -p` |
| Write-permitting flag | `--yolo` (explicit) | `--dangerously-skip-permissions` | `--permission-mode acceptEdits` | `--sandbox workspace-write` | `--force` | `--permission-mode dangerous` | tool allowlist |
| Exit codes | 0/1/130, hard exit; no budget code | 0/non-zero | 0/non-zero | 0/non-zero | always 0 | 0/non-zero | unreliable |
| Machine-readable stdout | text; session id on stderr; `--usage-file` JSON | `--format json` | `--output-format json` | text | `--output-format json` | text | `--mode json` |
| Preventive OS sandbox | none | none | tool gate | real | real | none | none |
| Web search forcing | `-t web`, live | live | inherit | live | inherit | inherit | toolset flags |
| State isolation | `HERMES_HOME` or `--profile` | `OPENCODE_HOME` | `CLAUDE_CONFIG_DIR` | `CODEX_HOME` | repo var only | repo var only | `--session-dir` |
| Self-invocation marker | `HERMES_AGENT=true` | `OPENCODE_*` | `CLAUDE_CODE_*` | `CODEX_*` | `CURSOR_AGENT=1` | `DEVIN_*` | none (exempt) |
| Repo-local config | skills and plugins only; config, hooks, MCP user-level | `opencode.json` | `.claude/` | `.codex/` | `.cursor/` | `.devin/` | `.pi/` |
| Skill discovery | flattens symlinked tree, needs trust | native | native | none | native | native | native, hub-aware after 031 |
| Persona surface | inline or `-s` persona skill | `--agent` | `--agent` | inline | `.cursor/agents` | `.devin/agents` | inline |
| Sub-agents | `delegate_task` (strip for leaves) | native | Task tool | none | none | `run_subagent` | third-party |
| Hooks | user-level shell hooks; project plugin | plugins | hooks | hooks | hooks | hooks | extensions |
| MCP | user-level only | repo | repo | repo | repo | repo | repo |
| Runtime and install | Python, git checkout | Node binary | Node | Rust binary | Node | cloud SDK | Node |
| Ambient injection | heaviest (`SOUL.md`, memory, rules) | light | light | light | light | light | light |
| Emergency stop | runner kill (`hermes pause` excludes CLI) | runner kill | runner kill | runner kill | runner kill | runner kill | runner kill |

---

## 4. Recommended phase plan

Both lineages keep the parent's order and merge the thin middle phases. Required items first.

| # | Phase | Status | Change | Failure prevented |
|---|---|---|---|---|
| R1 | `002-hermes-contract-pin` | required | Operator configures one provider (LLM Gateway key or Codex OAuth import); run the sanctioned smoke; live-verify `--yolo` on a non-TTY, `-Q` stdout purity, `session_id:` on stderr, exit codes, the run-budget expiry signature, `--query-file` round trip; run `hermes skills trust` on the repo and record the scan verdict for the symlinked tree; grep for any other project-level `.hermes/` reader | Building later phases on code-read claims |
| R2 | `003-deep-loop-executor-support` | required | Seventh `ExecutorKind`; `buildHermesLineageCommand` with the section 1 shape; `HERMES_SUPPORTED_MODELS` fail-closed; flag-support, sandbox, web-search, state-env and env-prefix maps; dispatch-audit regex row; combo-matrix tests | An unavailable or off-roster Hermes becoming routable |
| R3 | `004-cli-hermes-skill-packet` | required, absorbs candidates 006 and 008 | `sk-create-skill` packet with the eight hard rules; references for the CLI, providers and models, agent delegation (inline persona and persona skills), prompt templates for the nested commands, hook and plugin contract, MCP operator policy; hub registration on all six surfaces | A seventh mode with no documented contract |
| R4 | `005-hermes-runtime-folder` | required | Repo-root `.hermes/`: whole-directory `skills -> ../.opencode/skills` symlink with the flattening caveat documented, `prompts/`, `plugins/repo-guards/`, `SYNC.md`, playbook symlink; no per-file symlinks | Repo-local skills and prompts with no carrier |
| R5 | `007-hermes-hook-and-plugin-layer` | required, narrowed | Project plugin `repo-guards`: `pre_verify` to completion-evidence, `pre_tool_call` to dispatch audit and preflight, `on_session_*` to context hooks; shells out to the existing cores; documents `HERMES_ENABLE_PROJECT_PLUGINS` | Unguarded Hermes dispatches |
| R6 | `009-hermes-model-registry-and-routing` | required, gated on R1 | Prompt-models profiles; roster enforcement at both dispatch entry points; effort-name map for the gateway route | Off-roster dispatch and effort mismatch |
| R7 | `010-hermes-playbook-and-catalog` | optional | Manual-testing playbook and feature catalog with their create modes | Untested packet claims |
| R8 | `011-docs-governance-and-closeout` | optional | READMEs, roster docs, `REPO RULES.md` and `AGENTS.md` check, recursive strict validation | Roster drift |

Merges: 006 into 004; 008 into 004. Narrowed: 007. Dropped: none. Deferred hardening, not a phase: a seeded `cli-hermes-fanout` profile, a docker or ssh terminal backend as a real sandbox, non-leaf `delegate_task` semantics, a 60-character description retrofit.

---

## 5. Where the lineages disagreed, and what settled it

| Question | deepseek | swe2 | Settled by |
|---|---|---|---|
| Self-invocation marker | `HERMES_TURN_AUTHOR` is scrubbed, so ancestry is required | `HERMES_AGENT=true` and `HERMES_SESSION_ID` are inherited | Source: both are true; `main.py:3145` and `agent_init.py:1117` set inherited markers, `turn_author.py:90` scrubs the other. Use `HERMES_AGENT`. |
| Repo-local `.hermes/` | skills and plugins load from the repo | "no repo-local config surface" | Source: `skill_utils.py:410`, `plugins.py:5`. Skills and plugins yes; config, hooks, MCP no. |
| Codex OAuth reuse | not portable | zero-secret import path | Source: `auth_codex.py:387,679` reads `~/.codex/auth.json` once at login; the live session is Hermes's own. Both right; it is an import, not a shared store. |
| Starting roster | LLM Gateway two-model roster | Codex OAuth first | Operator decision; the gateway key exists on this machine for other runtimes, the Codex import is one command. Either satisfies R1. |
| Isolation posture | `HERMES_HOME` per lineage | shared home plus `--ignore-rules` first | Source: a fresh profile drops credentials. Shared home first; profile later. |

---

## 6. Open questions for the contract pin

1. `chat -Q` exit code and stderr signature on run-budget exhaustion (code-read: partial with a response exits 0).
2. The skill scan verdict for the symlinked tree after `hermes skills trust` (needs the trust mutation).
3. Effort-name mapping through the LLM Gateway custom route.
4. The code-mode MCP server end to end through `hermes mcp add` (env handling, tool discovery).
5. Real dispatch byte shape and latency with a configured provider.
6. `delegate_task` internals (auto-approve, child timeout, flag inheritance) for any non-leaf use.
7. Whether plugin-supplied MCP servers still load under `--safe-mode`.

---

## 7. Verification record

Citations opened by the orchestrating session against `~/.hermes/hermes-agent` on 2026-09-14, all resolving: `hermes_cli/oneshot.py:200-207` (yolo and accept-hooks auto-set), `cli.py:4085-4117` (stderr session id, exit codes), `tools/approval_context.py:260-277` (single-query default deny), `agent/skill_utils.py:745` (`followlinks=True`), `hermes_cli/plugins.py:5` and `plugins_discovery.py:154` (project plugins gate), `hermes_cli/mcp_config.py:55-60` (user-level `mcp_servers`), `agent/turn_author.py:83-90` (scrub), `hermes_cli/main_agent_cmds.py:180-223` (trust store), `hermes_cli/plugins.py:117` (`pre_verify` in the hook list), `agent/estop.py:4` (pause scope), `hermes_cli/main.py:3145` (`HERMES_AGENT`), `agent/agent_init.py:1117` (`HERMES_SESSION_ID`), `hermes_cli/_parser.py:14` (`--profile`), `hermes_cli/auth_codex.py:3,387,679` (Codex import). Two lineage line numbers were off by a few lines from the resolving location; the claims held.

Run evidence: `orchestration-summary.json` reports 2 of 2 lineages succeeded, no retries, no salvage misses. Iteration files on disk: 10 for `deepseek`, 5 for `swe2`; both terminal synthesis records carry `stopReason: maxIterationsReached`. The runner's containment advisory names paths under a neighbouring fan-out in another session, not this run. Both lineages fabricated ISO timestamps inside their state logs (the runner flagged 8 anomalies); ordering is proven by file modification times, not by those fields.

## 8. References

- `lineages/deepseek/research.md`, `lineages/deepseek/iterations/iteration-001.md` to `iteration-010.md`
- `lineages/swe2/research.md`, `lineages/swe2/iterations/iteration-001.md` to `iteration-005.md`
- `findings-registry.json` (merged, 90 findings), `fanout-attribution.md`, `orchestration-summary.json`
- `../research-angles.md`, `../resource-map.md` (seed inputs)
- Installed Hermes source `~/.hermes/hermes-agent` (v0.21.1, upstream `dc90a75a`); live `hermes` help and status output, 2026-09-14
- https://agentskills.io/specification.md (fetched by the deepseek lineage, 2026-09-14)
