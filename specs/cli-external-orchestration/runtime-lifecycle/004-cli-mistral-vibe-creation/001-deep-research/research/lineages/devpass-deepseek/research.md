# Mistral Vibe as a cli-external-orchestration runtime: synthesis

**Lineage**: `devpass-deepseek` · **Run**: `fanout-devpass-deepseek-1794658946949-yw45xe` · **Vibe under test**: 3.1.2 (local install, `/Users/michelkerkmeester/.local/bin/vibe`) · **Iterations**: 8 of 8

## Executive Summary

Mistral Vibe can become a governed runtime mode, and the cheapest path is a print-mode executor kind plus a generated `.vibe/` mirror, not a plugin port. Vibe's headless contract is stronger than most CLIs this repository wraps: a typed `export.json`, a fixed 0-4 exit taxonomy, per-run cost, and an explicit `--output json|streaming`. Its extension model is the constraint, not its dispatch model: OpenCode's JavaScript plugins are deliberately refused, slash commands have no directory, and the session events the repository's relaunch and turn-stopping guards depend on do not exist. What does port is substantial: skills are the same YAML-frontmatter format, agents are a TOML render, MCP is config, permissions have a real model, and hooks can block at the three events that matter for tool guards.

The recommended order is: executor kind first, mirror second, guard wave third, commands fourth, and ACP last.

## Method and Evidence

Eight iterations, one per angle in `research-angles.md`, in order. Evidence is the installed package source under `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/` (version 3.1.2), the captured CLI contract at `research/evidence/vibe-help.txt`, binary strings from the bundled `vibe-rs`, this repository's runtime trees (`.opencode/`, `.dsh/`, `.skilled/skills/`, deep-loop runtime), and the config schema captured at `evidence/vibe-config-schema.json`. Documentation-only claims are marked `documented, unconfirmed`; guesses are `UNKNOWN`.

No live dispatch was run: the install has no `~/.vibe/config.toml` and no credential, so a smoke run would have exercised the `config_error` (exit 1) branch. The two live smoke dispatches the angle brief allows remain unused and are the first build-phase action.

## Angle 1: Headless dispatch contract

Vibe runs one task non-interactively with `-p/--prompt`, taking the prompt from the argument, stdin or `--prompt-file`. Model, agent profile, permissions, workdir and limits are all flags: `--model`, `--agent`, `--auto-approve`/`--yolo`, `--smart-approve`, `--trust`, `--enabled-tools`, `--disabled-tools`, `--workdir` (`VIBE_CWD`), `--add-dir`, `--max-turns`, `--max-price`, `--max-tokens`, `--time-limit`. Output is `text` (default), `json` or `streaming`, and `--output-dir` writes `export.json` plus a session journal on every exit.

`export.json` is a typed `RunExport`: `vibe_version`, `outcome`, `stop_reason`, `error`, `session_id`, `usage`, `cost_usd`, `steps`, redacted `config`, `warnings`, `limits`, `subagents[]` and a computed `exit_code`. Exit codes are the five-value `RunOutcome` taxonomy: `0` finished, `1` usage/config, `2` infrastructure, `3` limit/termination/refusal, `4` agent-socket abort. A denied tool has **no** exit code: headless runs cannot prompt, so denial is a tool result and a run can finish `0`.

Architecturally `vibe` is a launcher for the bundled Rust `vibe-rs`, which talks to `vibe-app-server`. That split matters for Angles 6-8: the app server owns the journal and export, the Rust side owns the loop, and the server can also multiplex runs.

Open: the stdin prompt source is documented but contradicted by the binary's "Pass either -p TEXT or --prompt-file".

[SOURCE: research/evidence/vibe-help.txt:17-67] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:32-84,117-247] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/cli/launcher.py:8-29,43-103]

## Angle 2: Providers, models and the subscription

Two credential families: a first-party `mistral` provider that accepts browser sign-in (OIDC through `console.mistral.ai`) or `MISTRAL_API_KEY`, and BYOK `[[providers]]` rows with their own `api_base`, `api_key_env_var`, `api_style` (default `openai`), `backend` (`mistral`/`generic`), and Vertex ADC via `api_style = "vertex-anthropic"`. First-party code never sends a third-party credential to a first-party endpoint.

Models are declarative rows (`name`, `provider`, `alias`, `temperature`, `thinking`, `thinking_levels`, per-million prices, context length). Pinning `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` is a provider row plus a model row each; Vibe compiles in no roster beyond one default `mistral-medium-3.5` row, and the Mistral catalogue is fetched from `<api_base>/model-catalog?surface=vibe-code` with a 5s cap and 30-day TTL.

Reasoning effort has **no dispatch flag**: it is the model's `thinking` field plus its offered `thinking_levels`. A governed executor must pin reasoning in the model row.

Usage: a first-party turn draws on the org's monthly Vibe Code allowance, read from `/v1/billing/budget`, with plan and pay-as-you-go from `/v1/billing/subscription`. Plan labels come from `/whoami` (chat Free/Pro/Student/Team; Mistral Code Free Codestral/Code Enterprise; API Free API/PAYG API). Per-run cost is locally computable from `export.json`.

UNKNOWN: whether an OpenCode turn on the same key debits the same counter. That attribution is server-side. The settling measurement is a `/whoami` plus billing read immediately before and after one identical turn in each client.

[SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:137-204,522-616] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/_defaults.py:9-19] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_billing.py:1-46] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/setup/auth/whoami.py:346-390]

## Angle 3: Configuration and the repo-local runtime folder

Project config is `.vibe/config.toml`, discovered by walking up parents to a **trusted** file; untrusted project config is ignored without `--trust`. Project discovery is non-recursive and covers `.vibe/tools/`, `.vibe/skills/`, `.vibe/plugins/`, `.vibe/agents/`, `.vibe/prompts/`, `.vibe/config.toml` and `.agents/skills/`. There is no `.vibe/commands/`.

Config layers are `user-toml`, `user-supplied`, `project-toml`, `environment` (`VIBE_*`) and `overrides`, plus an agent-profile layer barred from overriding the three credential-routing base URLs. `AGENTS.md` is two-level: `$VIBE_HOME/AGENTS.md` as the user doc, project `AGENTS.md` collected up the tree outermost-first, and subdirectory `AGENTS.md` injected lazily on reads.

The global home is fixed: `config.toml`, `AGENTS.md`, `.env`, `logs/`, `logs/session/`, `worktrees/`, `trusted_folders.toml`, caches and history. A repo mirror must therefore live in `.vibe/`, and its contents would be `config.toml`, `agents/*.toml`, `skills/`, `plugins/`, `prompts/`, `tools/`.

[SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py:28-104] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/project.py:14-70] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/agent_profile.py:20-44] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/system_prompt.py:278-321]

## Angle 4: Feature parity with cli-opencode

The decisive fact: Vibe's plugin unit is a declarative `plugin.json` package, and its OpenCode adapter imports only portable Agent Skills and declarative MCP servers. OpenCode executables and custom tools "are never imported or evaluated". The repository's 21 JavaScript plugins cannot be packaged and run; each guard must be rewritten as a Vibe artifact. Full table in the next section.

[SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_foreign.py:53-129,293-340] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_native.py:924-947]

## Parity Table

| OpenCode surface | Vibe equivalent | Verdict | Porting cost |
|---|---|---|---|
| JS plugins (`tool.execute.*`, `session.*`) | declarative `plugin.json`; OpenCode adapter imports skills+MCP only | none | high: rewrite each guard |
| Spec gate | strict `pre_tool` hook | partial | medium |
| Dispatch preflight | `pre_tool` / `pre_agent` | partial | medium |
| Session-relaunch loop | no idle/compact/resume events | none | high; needs external supervisor |
| Goal and context bridges | `AGENTS.md` + `.vibe/prompts`; no goal state | partial | medium / high |
| Slash commands | user-invocable skills as `/skill-name`; no command markdown | partial | medium: no `$ARGUMENTS` |
| Custom agents | TOML profiles + `agent_paths` | partial | low-medium |
| Skills | same YAML-frontmatter markdown | equivalent | low |
| MCP | stdio/HTTP + OAuth config | equivalent | low |
| Code Mode | `run_typescript` harness program tool | equivalent | low-medium |
| Permissions | per-tool settings + approval agents | partial | low |
| Self-invocation guard | strict `pre_tool` hook | partial | medium |

The command row and the Code Mode row were corrected after the first pass: user-invocable skills are the slash surface, and `run_typescript` is a real program tool whose nested calls carry `parent_call_id`.

[SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:72-90] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_session_peers.py:40-70] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/protocol.py:1074-1093]

## Angle 5: Skills, slash commands and subagents

Skills are YAML frontmatter plus markdown: `name` (lowercase-hyphen, ≤64), `description` (≤1024), optional `license`, `compatibility`, `metadata`, `allowed-tools`, `user-invocable`, `disable-model-invocation`. They are model-invoked through the `skill` tool and user-invoked as `/skill-name`; `user-invocable: false` hides from the slash menu, `disable-model-invocation: true` makes a skill user-only. Discovery is `skill_paths`, then project `.vibe/skills` and `.agents/skills`, then user dirs, deduped by resolved path with first claimant winning.

Subagents are the `task(task, agent="explore")` tool returning `{response, turns_used, completed}`, with a permission allowlist defaulting to `explore`, and a roster of `agent_type = "subagent"` profiles bounded by `max_subagents` and `max_concurrent_subagents` (32 each).

Repository mapping: skills are near-free (`skill_paths` → `.skilled/skills`); agents need a markdown→TOML renderer with the body as `instructions`; commands become skills but lose `$ARGUMENTS`.

UNRESOLVED: skill precedence. The manager keeps the first claimant with `skill_paths` first, while the registry-skill text says project skills win over global ones. Smallest check: a two-skill collision fixture.

[SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:45-135] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py:228-275] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py:15-60]

## Angle 6: Hooks and safety

Hooks are declared in `.vibe/hooks.toml` or `~/.vibe/hooks.toml` as `[[hooks]]` entries with `name`, `type`, `command`, `match`, `timeout` (60s default), `strict` and `description`. Seven events exist; only `pre_tool`, `post_tool` and `pre_agent` accept `strict`, which is where a failing hook may block instead of letting through. Hook provenance includes project/global/plugin/client sources and the protocol accepts `VIBE`, `CLAUDE_CODE` and `KIMI_CODE`, so Claude-format hook scripts are reusable.

The eight enforcement guards map cleanly: seven run before a named tool (`pre_tool` + strict) and post-edit quality runs after (`post_tool` + strict). Each needs a payload adapter and a state directory. The two turn-stopping guards do **not** map: `post_agent` has no strict mode, and the goal/session adapters have no Vibe event at all.

Safety: approval modes are agent safety levels `SAFE`/`NEUTRAL`/`DESTRUCTIVE`/`SMART`/`YOLO` with builtin `ask`, `accept-edits`, `smart-approve`, `auto-approve`, `explore`, `lean`; per-tool permission is `ALWAYS`/`NEVER`/`ASK`. `outside_workdir` is `ask` (default) or `deny`, per-tool overridable. Writes to `.vibe` config, `.git/hooks`, `.git/config` and shell startup files escalate to a human, and the module says it is a heuristic, not a boundary. There is **no user-facing sandbox mode**: no schema field, no CLI flag; the harness has a sandbox adapter, so confinement is a deployment choice.

[SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:19-128] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:813-822,900-932] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/vibe/_protected_paths.py:1-40]

## Angle 7: Deep-loop executor support

A `cli-mistral-vibe` kind needs, in order: registration in `EXECUTOR_KINDS` and `EXECUTOR_KIND_FLAG_SUPPORT` (`model`, `sandboxMode`, `timeoutSeconds`, `liveTools`; **not** `reasoningEffort`); a `buildVibeLineageCommand` entry in `LINEAGE_COMMAND_ADAPTERS`; env prefixes `VIBE_` and `MISTRAL_`; a closed `VIBE_SUPPORTED_MODELS` roster; dispatch-audit entries (sandbox boundary `false`, web-search `inherit`, no guessed session env); the recursion-guard stamp; and a stress fixture.

The roster must pair alias with expected thinking level: with no reasoning flag, honouring the repository's DeepSeek/GLM `max` pin means a model row that already carries `thinking = "max"`, and the executor should reject an alias whose row does not.

Exit mapping: `0` success, `1` caller error, `2` dispatch failure, `3` stopped-without-finishing (score as partial, not success), `4` abort.

[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-310] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:121-200] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3099-3121,3746-3765]

## Angle 8: ACP and other integration seams

ACP is a stdio JSON-RPC agent with `initialize`, `authenticate`, `new_session`, `load_session`, `prompt`, `cancel`, `close_session`; `vibe-acp` has no flags beyond `--setup`. It supports permission round-trips (`allow_once`, `allow_always`, `reject_once`, `reject_always`), session persistence and cancellation, and has no per-run exit taxonomy or `export.json`.

Print mode fits the existing executor contract with no new supervisor: one process per iteration, exit codes, `export.json`, receipts and post-hoc write containment. ACP would need a persistent per-lineage client, a protocol-derived completion signal, a permission answerer, cancellation semantics and session-anchored receipts.

Recommendation: print mode first; ACP second, once a supervisor can answer permissions and resume. `run-server` (many headless runs over JSON-RPC) waits until it leaves experimental. Additional seams: `--output streaming`, `--agent-socket` (abort → exit 4), `vibe-app-server --multiplex`.

[SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py:475-600,810-1014] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/utils.py:28-120] [SOURCE: research/evidence/vibe-help.txt:30-31,69-95]

## Corrections and Live Contradictions

1. **Code Mode (Angle 4 → Angle 5)**: iteration 4 recorded "none"; iteration 5 found `run_typescript`, a harness program tool whose nested calls carry `parent_call_id`. Verdict corrected to "equivalent, low-medium".
2. **Slash commands (Angle 4 → Angle 5)**: iteration 4 recorded "none" on the absence of `.vibe/commands`; user-invocable skills are the slash surface, so the verdict is "partial: commands become skills, `$ARGUMENTS` is lost".
3. **Hook count**: the binary changelog says "three types", the model declares seven. Resolution: stable core three (`post_agent`, `pre_tool`, `post_tool`) plus `pre_agent` and the host-fired `notification`/`session_start`/`session_end`.
4. **Skill precedence**: manager first-claimant order versus the registry-collision sentence. Unresolved; fixture named.

## Late Finding (verification, outside the iteration stream)

A second live observation is recorded here rather than in an iteration, because the loop closed at eight. Running the read-only `vibe config schema` caused the CLI to create `$VIBE_HOME` state: `~/.vibe/logs/vibe.log` (empty), `~/.vibe/logs/vibe-rs.log` (empty) and `~/.vibe/vibehistory` ("Hello Vibe!"). Two consequences:

- **Executor requirement**: a `cli-mistral-vibe` kind must set `VIBE_HOME` to a lineage-local directory, exactly as the DSH runner gives each lineage a fresh home. Otherwise every dispatch writes into the operator's home and two concurrent lineages share history and logs.
- **Scope disclosure**: these three files were created outside this lineage's write surface by the CLI's own bootstrap and were left in place rather than deleted. No credential or prompt was written. Recorded in `iterations/iteration-002.md` under `## SCOPE VIOLATIONS`.

## Eliminated Alternatives

- Packaging `.opencode/plugins/*.js` as a Vibe plugin and expecting execution.
- Mapping `session.compacted`/`session.idle` onto `post_agent`.
- ACP as the first executor surface.
- `run-server` in the first build phase.
- A `reasoningEffort` flag mapping.
- Treating `--auto-approve` as a sandbox.
- A `.vibe/commands/` mirror.
- Guessing a `VIBE_SESSION_ID` env var.

## Divergence Map

No divergent pivots were taken. The only direction change was corrective, not divergent: the Code Mode verdict was reversed when the harness package was read (iteration 5). Saturated: none. Remaining frontier: the ACP wire payloads (`new_session` fields) and the hook decision wire format, both listed under Open Questions.

## Phase Plan

Merge target: `research/phase-plan.md` (written by the merge owner; this lineage cannot write outside its directory).

**Phase A - Executor kind (print mode).** Build `cli-mistral-vibe` in `executor-config.ts` and `fanout-run.cjs`, with env prefixes, a lineage-local `VIBE_HOME`, closed roster, exit mapping and stress fixture. *Handoff check*: a lineage runs one research iteration end to end with `vibe -p`, `export.json` is captured, `$VIBE_HOME` holds only that lineage's logs and history, a `3` exit is scored partial, and the audit receipt exists. Cost: low-medium. Why first: every other phase needs a way to dispatch Vibe.

**Phase B - Generated `.vibe/` mirror.** Render `config.toml` (providers, model rows with `thinking`, `default_agent`), `agents/*.toml` from `.opencode/agents` + `.skilled/agents`, and point `skill_paths` at `.skilled/skills`; add `.vibe/prompts`. *Handoff check*: `vibe config schema` accepts the rendered config, `/skill-name` lists a repository skill, and a custom agent appears in the agent roster. Cost: low-medium. Why second: skills and agents are near-free parity and make later dispatches useful.

**Phase C - Guard wave 1.** Port the seven `pre_tool` guards plus post-edit quality as `hooks.toml` commands with one shared payload adapter and a `.vibe/state` directory. *Handoff check*: each guard blocks a crafted violating call and allows a clean one, with the spec gate neutralized for child sessions. Cost: medium. Why third: it is the largest parity gain that is actually expressible.

**Phase D - Command conversion.** Convert the highest-value commands into user-invocable skills, documenting `$ARGUMENTS` loss; keep argument-taking flows in the orchestrator. *Handoff check*: a converted command runs from the slash menu and produces the same artifact as the OpenCode path. Cost: medium.

**Phase E - Goal and context bridge.** Context is covered by `AGENTS.md` and prompts; goal state needs a scoped tool or an external bridge. *Handoff check*: a goal packet round-trips through a Vibe dispatch or the gap is accepted explicitly. Cost: medium-high.

**Phase F - ACP supervisor.** A persistent per-lineage client with permission answers, resume and cancellation. *Handoff check*: one lineage runs two iterations over one ACP process, a permission prompt is answered by policy, and a cancel leaves the lineage resumable. Cost: high.

**Deferred / blocked**: session-relaunch loop and turn-stopping guards (no Vibe events); `run-server` (experimental); sandbox mode (no CLI exposure).

## Open Questions

1. Does an OpenCode turn on the same key debit the same Vibe Code budget? Measure `/whoami` + `/billing/budget` around one identical turn per client.
2. Skill precedence between `skill_paths` and `.vibe/skills` on a name collision. Fixture check.
3. Hook decision wire format for a strict hook. Capture one blocking hook's stdout/stderr.
4. ACP `new_session` payload fields for model, workdir and permissions. Capture an `initialize` + `new_session` handshake.
5. Whether stdin is a supported prompt source in 3.1.2. Probe `vibe -p` with stdin only.

## References

- `research/evidence/vibe-help.txt` (captured `vibe`, `vibe-acp`, `vibe-app-server` help, 3.1.2)
- `evidence/vibe-config-schema.json` (captured `vibe config schema`, 3.1.2)
- Installed package: `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/`, version 3.1.2
- Harness package: `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/`
- Repository runtime: `.opencode/`, `.dsh/plugins/repo-guards/`, `.skilled/skills/`, `.skilled/skills/system-deep-loop/runtime/`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research-angles.md`

## Convergence Report

- Stop reason: maxIterationsReached (8 of 8 angles complete)
- Total iterations: 8
- Questions answered: 5 / 5
- Remaining questions: 0 strategy questions; 5 open items recorded above are follow-ups, not coverage gaps
- Last 3 iteration summaries: run 6: hooks and safety (1.0); run 7: executor support (1.0); run 8: ACP and seams (1.0)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Notes: newInfoRatio stayed high because each angle opened a distinct surface; convergence was bounded by the angle count, not by saturation. The merge should treat the Code Mode and command rows from iteration 4 as superseded.
