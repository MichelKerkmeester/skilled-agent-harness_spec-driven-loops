# Mistral Vibe as a Governed cli-external-orchestration Runtime

> Merged synthesis of two fan-out lineages over the eight angles in `research-angles.md`: `mistral-deepseek` (DeepSeek V4.1 Flash via Mistral) and `devpass-deepseek` (the same model via DevPass), eight iterations each. Lineage files: `lineages/<label>/research.md` and `lineages/<label>/iterations/`. Runtime under study: `vibe 3.1.2` (uv tool install). Where the lineages disagreed, the merge owner re-read the Vibe source; those rulings are marked **[merge-verified]**.

---

## 1. Executive Summary

Mistral Vibe can become a governed runtime mode. Both lineages reached that verdict independently, and both chose the same shape: **print mode (`vibe -p`) as the dispatch surface**, a lineage-local `VIBE_HOME`, `export.json` as the outcome record, and a generated `.vibe/` mirror. ACP comes later, if at all.

Vibe's dispatch contract is stronger than most CLIs this repository wraps: a typed `export.json` written on every exit, a closed 0 to 4 exit taxonomy, per-run cost, and headless budget flags (`--max-turns`, `--max-price`, `--max-tokens`, `--time-limit`).

The extension model is the constraint. Vibe will not run OpenCode's JavaScript plugins, so each of the repository's 21 OpenCode plugins must be re-expressed as a Vibe hook, a skill or nothing. Skills, MCP and Code Mode port at low cost, and the six deny-capable guards map to strict `pre_tool` hooks. The session-relaunch loop and the two turn-stopping guards have no Vibe event and cannot be ported.

---

## 2. Scope and Method

Two lineages ran the same eight angles, one per iteration, on the same model through two providers. Evidence is the installed package source (`~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/` and `mistralai_vibe_local_harness/`), the captured help at `evidence/vibe-help.txt`, the captured `vibe config schema` in each lineage's `evidence/`, and this repository's runtime trees.

No authenticated Vibe dispatch ran. Lineage `mistral-deepseek` spent one unauthenticated smoke run, which exited 1 with `Missing MISTRAL_API_KEY`. Every success-path claim is therefore a source reading, not an observation.

---

## 3. Headless Dispatch Contract

- **Prompt:** `-p TEXT`, or `--prompt-file PATH`. Stdin is documented as a source, but the binary's message reads "Pass either -p TEXT or --prompt-file", so stdin stays an open question.
- **Flags:** `--model ALIAS`, `--agent NAME`, `--auto-approve`, `--smart-approve`, `--trust`, `--enabled-tools`, `--disabled-tools`, `--workdir` (`VIBE_CWD`), `--add-dir`, `--worktree`, and the four budgets above. `--output text|json|streaming`.
- **Outcome record:** `--output-dir DIR` writes `export.json` on every exit (`vibe_version`, `outcome`, `stop_reason`, `error`, `session_id`, `usage`, `cost_usd`, `steps`, redacted `config`, `limits`, `subagents[]`, `exit_code`) plus the session journal ([SOURCE: vibe/app_server/run_export.py:32-84]).
- **Exit codes:** `0` finished; `1` usage or config error; `2` infrastructure failure; `3` stopped without finishing (turn, token, price or time limit, termination, length, refusal); `4` aborted by the agent socket.
- **Denials:** a denied tool call returns to the model as a tool error, so a run with denials can still exit `0`. The audit must read `export.json`, never stdout.
- **Architecture:** `vibe` is a Python launcher that execs the bundled Rust `vibe-rs`, which talks to `vibe-app-server`. A recursion guard must match both `vibe` and `vibe-rs`.

---

## 4. Providers, Models, Reasoning and Billing

- **Providers** are config rows: `api_base`, `api_key_env_var`, `api_style` (default `openai`), `backend` (`mistral` or `generic`), `reasoning_field_name`. The first-party `mistral` provider takes browser sign-in or `MISTRAL_API_KEY`.
- **Models** are rows with `name`, `provider`, `alias`, `thinking`, `thinking_levels`, prices and context. The catalog for the first-party provider is fetched from Mistral (`/model-catalog?surface=vibe-code`), so whether `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` appear there without a hand-written row is UNKNOWN until an authenticated run. A hand-written model row pins them either way, and `allowed_models` closes the roster.
- **Reasoning effort has no CLI flag** ([merge-verified]: absent from `vibe --help`). It lives in the model row's `thinking` field, so the repository's DeepSeek and GLM `max` pin means a model row with `thinking = "max"`, and the executor must reject an alias whose row does not carry it.
- **Billing:** Vibe reads the plan's Vibe Code allowance from `/v1/billing/budget` and the plan from `/v1/billing/subscription`. The lineages disagree on whether a key-based turn draws on that allowance; lineage `devpass-deepseek` marks it UNKNOWN and is right to. Mistral's docs describe one pool shared across Studio, the API and Vibe Code. The settling check is a budget read before and after one identical turn per client.

---

## 5. Configuration and the `.vibe/` Mirror

- Project config is `.vibe/config.toml`, found by walking up from the working directory, and it applies **only in a trusted folder** (`--trust` for one run, or `trusted_folders.toml`).
- Project discovery is root-only and non-recursive: `.vibe/{tools,skills,plugins,agents,prompts}/`, `.vibe/config.toml`, `.vibe/hooks.toml`, `.agents/skills/`. There is no `.vibe/commands/`.
- `AGENTS.md` loads from `$VIBE_HOME` and from the project tree, outermost first, so this repository's root `AGENTS.md` loads with no wiring.
- **`VIBE_HOME` must be isolated per dispatch.** [merge-verified]: during this run, Vibe commands created `~/.vibe/logs/`, `~/.vibe/vibehistory` and `~/.vibe/trusted_folders.toml` in the operator's home.

Proposed mirror, following `.dsh/SYNC.md`'s hand-authored, derived and generated split:

- `config.toml`: hand-authored. Providers, model rows with `thinking`, `allowed_models`, `skill_paths`, `default_agent`.
- `agents/<name>.toml`: generated from `.skilled/agents/*.md`, body as `instructions`.
- `skills/`: generated symlinks, or `skill_paths` pointing at `.skilled/skills`.
- `prompts/`: generated pointer stubs for commands.
- `hooks.toml` and `plugins/repo-guards/`: hand-authored guard bundle.
- `SYNC.md`: hand-authored inventory with `--check` drift commands.

---

## 6. Parity with cli-opencode

The lineages agreed on eight rows and split on four; the merged verdicts below settle the splits.

| Surface | OpenCode in this repo | Vibe | Verdict | Porting |
|---|---|---|---|---|
| Plugins | 21 JavaScript modules in `.opencode/plugins/` | Declarative `plugin.json` bundles; OpenCode JS and TS "never imported or evaluated" ([merge-verified], `vibe/core/plugins/_foreign.py:310`) | None as code; each plugin re-expressed | High: classify all 21 first |
| Spec gate | `system-spec-gate.js` | Strict `pre_tool` hook | Partial | Medium |
| Dispatch preflight | `cli-dispatch-audit.js` | Strict `pre_tool` and `pre_agent` hooks | Partial | Medium |
| Env, overlay, MCP-route, git-message guards | Four JS plugins | Strict `pre_tool` hooks | Partial | Medium |
| Post-edit quality | `sk-code-post-edit-quality.js` | Strict `post_tool` hook | Partial | Medium |
| Session relaunch | `session-relaunch.js` | `--continue`, `--resume`, `--worktree`; no idle or compaction event | None in process | High: outer supervisor only |
| Completion and ask-surface guards | Turn-stopping JS plugins | `post_agent` cannot be strict | None | Not portable |
| Goal bridge | `opencode-goal.js` | `session_start` hook `additional_context` | Partial | Medium |
| Context bridge | `session-history-lookup.js` | `AGENTS.md`, project context, session history | Partial | Medium |
| Slash commands | `.skilled/commands/*.md` | User-invocable skills; no command file, no `$ARGUMENTS` | Partial | Medium |
| Custom agents | `.opencode/agents/*.md` | `.vibe/agents/*.toml` profiles | Partial: TOML render may drop frontmatter Vibe does not model | Low to medium |
| Skills | `.skilled/skills/**/SKILL.md` | Same Agent Skills frontmatter | Equivalent | Low |
| MCP | `.utcp_config.json` | `mcp_servers` config, `vibe mcp` | Equivalent | Low |
| Code Mode | MCP code-mode launcher | `run_typescript` program tool | Equivalent | Low to medium |
| Permissions | allow, ask, deny matrix | Safety levels, per-tool `ALWAYS`/`NEVER`/`ASK`, `outside_workdir` | Partial | Low |
| Sandbox | None enforced | No CLI or config-schema field; a `SandboxConfig` exists only in the harness session API ([merge-verified]) | Partial | Treat as no sandbox, fail closed |
| Self-invocation guard | Repo plugin | Strict `pre_tool` hook | Partial | Medium |

Hooks [merge-verified] (`vibe/core/hooks/models.py:20-34,96-98`): seven types, `post_agent`, `pre_tool`, `post_tool`, `pre_agent`, `notification`, `session_start`, `session_end`. `strict` is accepted only on `pre_tool`, `post_tool` and `pre_agent`, and the validator raises on any other. Hook protocols include `claude_code`, so this repository's Claude-format hook scripts are a porting source.

---

## 7. Skills, Commands and Subagents

Skill frontmatter (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`, `user-invocable`, `disable-model-invocation`) matches this repository's `SKILL.md` files. A same-name skill is shadowed by the first claimant, and the lineages disagree on whether `skill_paths` or project `.vibe/skills` claims first, so a generated farm must keep names unique until a collision fixture settles it. Subagents are profiles with `agent_type = "subagent"`, reached through the `task` tool, allowlisted (default `explore`) and capped by `max_subagents` and `max_concurrent_subagents` (32 each).

---

## 8. Deep-Loop Executor Requirements

A `cli-mistral-vibe` kind needs:

1. `EXECUTOR_KINDS` and `EXECUTOR_KIND_FLAG_SUPPORT` rows in `executor-config.ts`: `model`, `timeoutSeconds`, `liveTools`; no `reasoningEffort`; a sandbox request fails closed.
2. `VIBE_SUPPORTED_MODELS` with the model rows that pin `thinking`, and `isVibeSupportedModel`.
3. `buildVibeLineageCommand` in `LINEAGE_COMMAND_ADAPTERS` (`fanout-run.cjs`): PATH and version preflight, roster check, `--output-dir`, lineage-local `VIBE_HOME`, `--trust`.
4. Environment allowlist in `executor-audit.ts`: the `VIBE_` prefix and `MISTRAL_API_KEY`.
5. Recursion-guard names `vibe` and `vibe-rs`.
6. Exit mapping: `3` scores as partial, never success.
7. Stress fixture, `live-contracts.json`, matrix manifest and the deep-loop YAML branches.

---

## 9. ACP Versus Print Mode

`vibe-acp` is a stdio JSON-RPC agent with session load, fork, cancel and per-call permission round-trips, and it can set thinking per session. It writes no `export.json` and has no exit taxonomy. Print mode fits the fan-out's one-process-per-iteration model now; ACP needs a persistent client, a permission answerer and outcome persistence. Both lineages: print mode first, ACP optional and last.

---

## 10. Recommendations

1. Pin the contract with one authenticated dispatch before building: it settles the `--output json` shape, the hook decision wire format, stdin, and which process name the recursion guard sees.
2. Dispatch through print mode with `VIBE_HOME`, `--output-dir` and `--trust` set per run, and read `export.json`.
3. Generate `.vibe/` with closed rosters (`allowed_models`, enabled skills and agents).
4. Classify the 21 OpenCode plugins into hook, skill or not-portable before porting any.
5. Port the deny-capable guards as strict `pre_tool` hooks first.
6. Inject the goal slice from a `session_start` hook; do not build a goal object.
7. Leave ACP, the relaunch loop and the turn-stopping guards out of the first build.

The ranked phases are in `phase-plan.md`.

---

## Eliminated Alternatives

| Approach | Why eliminated | Evidence |
|---|---|---|
| Packaging `.opencode/plugins/*.js` as a Vibe plugin | Vibe never imports or evaluates OpenCode JS or TS | `vibe/core/plugins/_foreign.py:310,338` |
| A `reasoningEffort` flag mapping | No such flag | `evidence/vibe-help.txt` |
| A `.vibe/commands/` mirror | No such directory is read | `vibe/core/paths/_local_config_files.py` |
| Mapping compaction or idle events onto `post_agent` | Vibe has no such events, and `post_agent` cannot block | `vibe/core/hooks/models.py` |
| Expressing completion-evidence or ask-surface guards as hooks | No turn-stopping strict event | `vibe/core/hooks/models.py:96-98` |
| ACP as the first dispatch surface | Needs a client and outcome persistence, and loses `export.json` | `vibe/acp/agent.py`, `run_export.py` |
| Reusing the cli-opencode adapter with another binary | Argument grammar differs on every axis | `fanout-run.cjs` |
| Treating `--auto-approve` as a sandbox | It only skips prompts | lineage `devpass-deepseek` §6 |
| Parsing stdout for outcomes | `export.json` is the typed record; denials do not change the exit code | `run_export.py` |

## Divergence Map

- **Pivots:** none in either lineage.
- **Corrections inside lineages:** `devpass-deepseek` reversed its iteration-4 Code Mode and slash-command rows in iteration 5; `mistral-deepseek` moved the goal bridge from none to partial in iteration 6.
- **Cross-lineage disagreements settled at merge:** plugin count (21, not 24); plugins as code (none); sandbox (harness-only config, treat as none); custom agents (partial, not equivalent).
- **Remaining frontier:** the open questions below.

---

## 11. Open Questions

1. The `--output json` and `streaming` payload shapes.
2. The hook decision wire format: what a hook receives and how it answers.
3. Whether stdin is a prompt source in 3.1.2.
4. Whether the recursion guard sees `vibe` or `vibe-rs` in the ancestor walk.
5. Skill precedence between `skill_paths` and `.vibe/skills` on a name collision.
6. Whether a Vibe turn and an OpenCode turn on the same key draw on the same usage pool.
7. Whether the Mistral catalog lists `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` for Vibe without a hand-written row.

Questions 1 to 4 and 7 close with one authenticated dispatch, the first task of phase 004.

---

## 12. Threats to Validity

- No authenticated dispatch; success paths are source reads.
- No hook executed; blocking semantics come from the validator.
- No ACP session.
- Both lineages ran the same model, so agreement between them is two readings by one model family, not two families.
- All findings pin `vibe 3.1.2`.

---

## 13. References

- `research-angles.md`, `research/evidence/vibe-help.txt`
- `lineages/mistral-deepseek/research.md`, `lineages/devpass-deepseek/research.md`, and each lineage's `iterations/`, `evidence/vibe-config-schema.json`
- Vibe source: `vibe/app_server/run_export.py`, `vibe/core/hooks/models.py`, `vibe/core/plugins/_foreign.py`, `vibe/core/paths/_local_config_files.py`, `vibe/core/config/layers/project.py`, `vibe/core/skills/manager.py`, `vibe/core/tools/builtins/task.py`, `vibe/acp/agent.py`, `mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py`
- Repository: `.opencode/plugins/`, `.dsh/SYNC.md`, `.dsh/plugins/repo-guards/`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, `runtime/scripts/fanout-run.cjs`
- `resource-map.md`, `fanout-attribution.md`

---

## 14. Convergence Report

- Stop reason: maxIterationsReached in both lineages (8 of 8 angles each)
- Total iterations: 16 (8 per lineage)
- Questions answered: 8 / 8 angles
- Remaining questions: 7 open questions above, follow-ups rather than coverage gaps
- newInfoRatio stayed near 1.0 in both lineages: the stop was bounded by the angle count, not by saturation
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
