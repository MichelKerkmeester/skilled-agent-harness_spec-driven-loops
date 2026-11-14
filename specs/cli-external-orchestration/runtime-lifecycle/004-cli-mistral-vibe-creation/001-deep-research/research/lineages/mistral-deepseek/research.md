# Mistral Vibe as a Governed cli-external-orchestration Runtime

> Merged synthesis of the `mistral-deepseek` fan-out lineage: eight research angles, eight iterations, one per angle. Every claim cites a Vibe source file, a repository file, a captured command output, or is marked as inference.
>
> Runtime under study: `vibe 3.1.2`, installed at `/Users/michelkerkmeester/.local/bin/vibe` (uv tool venv, Python source at `.../uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe`, 517 Python modules plus a bundled 28 MB `vibe-rs` binary).
>
> Comparison target: this repository's `cli-opencode` runtime packet and the `.opencode/` surfaces it serves.

---

## 1. Executive Summary

Mistral Vibe is a viable governed runtime mode, and it is closer to `cli-opencode` on the surfaces that matter than the plugin count suggests. Three of the four hard requirements a dispatch needs are already native: a closed exit-code taxonomy, a machine-readable run export, and a strict pre-tool hook that can block a call. The fourth — a goal object — does not exist, but a `session_start` hook can inject context into the next user message, which is enough to carry a goal slice.

The gaps are concentrated and named. There is no user-authored slash-command format, no in-process plugin event API, no turn-stopping hook, and no reasoning-effort CLI flag. Everything else in the parity table is either equivalent or a mechanical transform.

The recommended posture is **print mode as the dispatch surface, ACP as an optional control channel**, with a generated `.vibe/` mirror following the same hand-authored / derived / generated taxonomy the seven existing runtime mirrors use.

---

## 2. Scope and Method

Eight angles, one per iteration, in the order fixed by `research-angles.md`:

| Iteration | Angle | Iteration file |
|---|---|---|
| 1 | Headless dispatch contract | `iterations/iteration-001.md` |
| 2 | Providers, models and the subscription | `iterations/iteration-002.md` |
| 3 | Configuration and the repo-local runtime folder | `iterations/iteration-003.md` |
| 4 | Feature parity with cli-opencode | `iterations/iteration-004.md` |
| 5 | Skills, slash commands and subagents | `iterations/iteration-005.md` |
| 6 | Hooks and safety | `iterations/iteration-006.md` |
| 7 | Deep-loop executor support | `iterations/iteration-007.md` |
| 8 | ACP and other integration seams | `iterations/iteration-008.md` |

Evidence rules applied throughout: every claim cites a file and line, a captured command output, or is marked `[INFERENCE: ...]`. Live `vibe` commands were read-only with stdin closed; exactly one live smoke dispatch was spent, in iteration 1, and it exercised the unauthenticated failure path. No credential was read or printed, and the operator's `~/.vibe/` was not written except by the CLI's own log bootstrap on that one invocation.

---

## 3. The Headless Dispatch Contract

Vibe's non-interactive surface is `-p/--prompt`, and it accepts the prompt three ways: as the flag argument, from stdin when the flag carries no value, or from `--prompt-file <PATH>`. `--workdir` (env `VIBE_CWD`) sets the working directory and `--output` selects `text` (default), `json` or `streaming`.

Four limits are headless-only and independent: `--max-turns`, `--max-price` (cumulative dollars across the root session *and* subagents), `--max-tokens`, and `--time-limit <SECONDS>`, which writes the export and exits 3.

The exit-code taxonomy is closed and explicit:

| Code | Meaning | Outcomes |
|---|---|---|
| 0 | Finished | `finished` |
| 1 | Could not start as asked | `usage_error`, `config_error` |
| 2 | Infrastructure failed under the agent | `infrastructure_failure` |
| 3 | Stopped without finishing | `turn_limit`, `token_limit`, `price_limit`, `deadline`, `terminated`, `length`, `refusal` |
| 4 | Aborted by the `--agent-socket` server | `aborted` |

`--output-dir <DIR>` writes `export.json` on **every** exit — version, effective config, token usage, cost, stop reason, outcome — plus the session journal under `session/` and each subagent's under `subagents/<session ID>/`. That export, not stdout, is the record a governed dispatch should read.

An unauthenticated live dispatch confirmed the failure channel: exit 1, empty stdout, and `Error: Missing MISTRAL_API_KEY environment variable for mistral provider` on stderr, preceded by a keychain notice.

**Consequence for the runtime:** parse `export.json`; never parse stdout text. A denial does not change the exit code, because a denied tool call is returned to the model as a tool error and the turn continues.

---

## 4. Authentication, Models and Cost

Authentication resolves in a fixed order: the run's session credential, the provider's environment variable, the OS keyring, then the CLI OIDC session. On macOS the keyring step is the login keychain, and its notice is printed to stderr on every dispatch unless the key arrives as an environment variable.

A provider is a first-class config object — `api_base`, `api_key_env_var`, `api_style` (default `openai`), `backend` (`mistral` or `generic`), `reasoning_field_name`, extra headers — so a bring-your-own endpoint needs no plugin. Models are a name-keyed map of `ModelConfig` with `provider`, `alias`, `thinking` and pricing fields.

`deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` are therefore pinnable **only** by adding a provider and a model entry that names them; the built-in catalog is Mistral's and will not contain those ids. `allowed_models` then closes the roster with glob or `re:` regex patterns.

Reasoning effort is a six-level ladder — `off`, `low`, `medium`, `high`, `xhigh`, `max` — but it has **no CLI flag**. It is set per session through the app server or statically through a model's `thinking` config. This is the single most consequential asymmetry between print mode and ACP.

Two usage counters exist and they are different things: the Mistral plan's monthly Vibe Code allowance with optional pay-as-you-go overflow, and ordinary per-token API billing from each model's `input_price` / `output_price` / `cached_input_price`. A key-based dispatch draws on the API counter; a signed-in plan dispatch draws on the allowance first.

---

## 5. Configuration Surface and the `.vibe/` Mirror

Project config discovery looks for `.vibe/config.toml` from the working directory upward, nearest first, stopping at `VIBE_HOME`'s parent, and a discovered file applies **only when its directory is trusted**. The trust store is a gate, not a formality.

The project-local directory set is fixed and root-only:

```
.vibe/tools/     .vibe/skills/    .vibe/plugins/
.vibe/agents/    .vibe/prompts/   .vibe/config.toml
.agents/skills/  .agents/
```

The global home mirrors it: `$VIBE_HOME/{tools,skills,plugins,agents,prompts,skills-registry-cache}`, `$VIBE_HOME/AGENTS.md`, `$VIBE_HOME/config.toml`, plus `~/.agents/skills`. `VIBE_HOME` is environment-overridable, which is what lets a governed dispatch leave the operator's `~/.vibe/` untouched.

`AGENTS.md` is read twice over: the global `$VIBE_HOME/AGENTS.md`, and every `AGENTS.md` from the working directory up to its trust root, outermost-first so nearer entries win. A subdirectory `AGENTS.md` is additionally injected lazily when a file below the project root is read. This repository's root `AGENTS.md` would load with no extra wiring.

### Proposed `.vibe/` mirror

| Surface | Mechanism | Source | Drift check |
|---|---|---|---|
| `agents/<name>.toml` | generated TOML profile | `.skilled/agents/*.md` | `sync-agents-vibe.cjs --check` |
| `skills/<name>` | generated relative symlink | `.skilled/skills/**/SKILL.md` | `sync-skills-vibe.cjs --check` |
| `plugins/repo-guards/` | hand-authored hooks bundle | `.skilled/hooks/`, `.skilled/skills/*/runtime/hooks/` | hook smoke run |
| `prompts/*.md` | generated pointer stubs | `.skilled/commands/**/*.md` | `sync-prompts-vibe.cjs --check` |
| `config.toml` | hand-authored | none | `vibe config schema` diff |
| `AGENTS.md` | not mirrored | repository root already loads | none |
| `SYNC.md` | hand-authored | none | none |

---

## 6. Parity with cli-opencode

| Surface | OpenCode mechanism in this repo | Vibe mechanism | Parity | Porting |
|---|---|---|---|---|
| Plugins | 24 JS event-handler modules | `plugin.json` declarative bundle (skills, MCP, connectors, hooks) | Partial | Re-express as hooks or skills; no in-process argument rewriting |
| Spec gate | `system-spec-gate.js` | `pre_tool` strict hook | Partial | Author one hook command |
| Dispatch preflight | `cli-dispatch-audit.js`, dist-freshness guard | `pre_tool` / `pre_agent` strict hooks | Partial | Author hook commands |
| Session relaunch | `session-relaunch.js` | `--continue`, `--resume`, `session/fork`, `--worktree` | Partial | Outer driver over repeated dispatches |
| Goal bridge | `opencode-goal.js` | `session_start` `additional_context` | Partial | Inject a goal slice at session start; no goal object |
| Context bridge | `session-history-lookup.js` | session history API + `AGENTS.md` + project context | Partial | Protocol client for history reads |
| Slash commands | `.skilled/commands/*.md` symlinked | 10 built-ins + user-invocable skills | Partial | Commands become skills |
| Custom agents | `.opencode/agents/*.md` | `.vibe/agents/*.toml` | Equivalent | Mechanical transform |
| Skills | `.skilled/skills/**/SKILL.md` | same Agent Skills frontmatter | Equivalent | Symlink farm |
| MCP | `.utcp_config.json` + code-mode skill | `mcp_servers` + `vibe mcp` | Equivalent | Config translation |
| Code Mode | MCP code-mode launcher | `run_typescript` + `tools.<group>` | Equivalent | None |
| Permissions | per-tool allow/ask/deny matrix | safety levels + per-tool config + `outside_workdir` + path grants | Partial | Translate the matrix |
| Self-invocation guard | repo plugin | none built in | None | `pre_tool` strict hook |

**Score: 4 equivalent, 8 partial, 1 none.** The one "none" is the self-invocation guard, and it is expressible as a strict `pre_tool` hook, so the real count of surfaces with no mechanism at all is zero.

---

## 7. Skills, Commands and Subagents

A skill is a directory holding `SKILL.md` with Agent Skills frontmatter: `name` (lowercase-hyphen, ≤64), `description` (≤1024), `license`, `compatibility`, `metadata`, `allowed-tools`, `user-invocable`, `disable-model-invocation`. The repository's `.skilled/skills/**/SKILL.md` files already match.

Discovery order is `skill_paths`, then project `.vibe/skills` and `.agents/skills`, then user skill directories, then plugin skills, then registry skills. **The first claimant of a name wins and every later one is shadowed**, so a generated farm must keep names unique across scopes.

`user-invocable` (default true) is the entire slash-command mechanism: when false the skill is model-only and hidden from the slash menu. There is no user-authored command file format — the built-in set is `help`, `compact`, `reload`, `log`, `mcp`, `proxy-setup`, `retry`, `leanstall`, `unleanstall`, `data-retention`, and everything else is a skill.

A subagent is an agent profile with `agent_type = "subagent"`, invoked through the `task` tool whose `agent` argument defaults to `explore` and is gated by an allowlist (default `[explore]`) plus a glob denylist. Concurrency is config-bounded: `enable_subagents` (default true), `max_subagents` 32 alive, `max_concurrent_subagents` 32 running turns.

---

## 8. Hooks and Safety

Vibe fires seven hook events: `pre_agent`, `post_agent`, `pre_tool`, `post_tool`, `notification`, `session_start`, `session_end`. Blocking is deliberately narrow — `strict = true` is accepted only on `pre_tool`, `post_tool` and `pre_agent`, and the validator rejects it elsewhere.

A hook is declarative TOML: `name`, `type`, `command`, `match`, `timeout` (default 60 s), `strict`, `description`. Six sources (host, project, project plugin, global, global plugin, client) and three protocols: `vibe`, `claude_code`, `kimi_code`. **The `claude_code` protocol is the porting lever** — an existing Claude Code hook configuration can be consumed as-is.

Host-hook timing differs by event: `notification` and `session_end` run in the background with output ignored; `session_start` runs synchronously and its `additional_context` is added, out of the user's sight, to the session's next user message, which waits for the hook. On close the server waits at most 5 s.

Against the DeepSeek Harness repo-guards bundle — 25 adapters over seven DSH event classes — Vibe can host four: `tools/pre-execute` → `pre_tool`, `tools/post-execute` → `post_tool`, `agent/created` → `session_start`, `agent/disposed` → `session_end`. The six deny-capable guards (`spec-gate-enforce`, `env-secret-guard`, `overlay-guard`, `mcp-route-guard`, `dispatch-preflight-lint`, `git-message-gate`) all become strict `pre_tool` hooks. The two turn-stopping guards (`completion-evidence`, `ask-surface-guard`) have no Vibe event and cannot be expressed.

Safety is two independent layers: a `SandboxConfig` (`type` local or managed, `image`, `size`, `network_access`, `env`, `options`) with a `SandboxAccess` level of `none`, `files` or `full`; and `PermissionRule` rows matching stable tool IDs by glob with a behaviour.

---

## 9. Deep-Loop Executor Requirements

A `cli-mistral-vibe` executor kind needs nine edits, each with a named home:

| # | Requirement | Where |
|---|---|---|
| 1 | `EXECUTOR_KINDS` tuple entry | `executor-config.ts` |
| 2 | `EXECUTOR_KIND_FLAG_SUPPORT` row — `model`, `timeoutSeconds`, `liveTools`; **no** `reasoningEffort` | `executor-config.ts` |
| 3 | `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` row — `false`, Vibe has no OS confinement flag | `executor-config.ts` |
| 4 | `VIBE_SUPPORTED_MODELS` + `VIBE_DEFAULT_MODEL` + `isVibeSupportedModel` | `executor-config.ts` |
| 5 | `buildVibeLineageCommand` adapter — PATH preflight, roster check, arg assembly, `finalizeLineageCommand` | `fanout-run.cjs` |
| 6 | `LINEAGE_COMMAND_ADAPTERS` entry | `fanout-run.cjs` |
| 7 | Env allowlist — `VIBE_` prefix **plus** `MISTRAL_API_KEY` as an explicit key | `executor-audit.ts` |
| 8 | Recursion-guard basenames — both `vibe` and `vibe-rs` | `executor-audit.ts` |
| 9 | Stress file + `live-contracts.json` + `matrix-manifest.ts` + an `if_cli_mistral_vibe` branch in all four deep-loop YAMLs | `tests/stress/cli-adapter/`, workflow assets |

Two rules are non-negotiable because the runtime already enforces them on existing kinds: a kind that cannot honor a requested sandbox mode must **fail closed**, never downgrade with an advisory label (the `cli-opencode` precedent); and a field the kind does not declare must be rejected by the unsupported-field scan rather than silently dropped.

---

## 10. ACP Versus Print Mode

`vibe-acp` accepts only `-h`, `-v` and `--setup`; everything else is negotiated over the protocol. It advertises `load_session`, embedded-context and image prompt capabilities (no audio), and session close, list and fork. It routes approvals to the client through `request_permission`, exposes three session config options (mode, model, thinking), streams usage and cost, and supports turn-level cancel that settles the waiting prompt with a `cancelled` stop reason.

It has no `export.json`.

| Axis | Print mode | ACP |
|---|---|---|
| Fit to one-process-per-lineage | Native | Needs a long-lived client |
| Exit code | Closed taxonomy 0–4 | Protocol stop reasons |
| Durable outcome | `export.json` on every exit | None; client must persist |
| Reasoning effort | No flag | Config option |
| Approvals | Pre-authorized only | Per-call |
| Mid-run cancel | Kill the process | Protocol cancel |
| Session fork | No | Yes |

**Recommendation: print mode for dispatch, ACP as an optional second mode.** ACP is the richer protocol; it is not the better dispatch surface for a runner that spawns, waits and audits one process per lineage.

---

## 11. Recommendations

1. **Adopt print mode as the `cli-mistral-vibe` dispatch surface**, with `--output-dir` set to a packet-local directory and `export.json` as the outcome record. Do not parse stdout.
2. **Redirect `VIBE_HOME` into the packet** on every dispatch, and pass `MISTRAL_API_KEY` through the environment allowlist. This is the difference between a governed dispatch and one that reads the operator's keychain and writes the operator's home.
3. **Generate the `.vibe/` mirror** with the hand-authored / derived / generated taxonomy from `.dsh/SYNC.md`, and pin `enabled_skills`, `enabled_agents` and `allowed_models` so the runtime has closed rosters rather than open discovery.
4. **Port the six deny-capable guards as strict `pre_tool` hooks first**, because they are the ones that change behaviour; the context guards can follow as `session_start` hooks.
5. **Reclassify the 24 OpenCode plugins before porting any of them.** A Vibe plugin cannot run code on an event, so each plugin is either a hook, a skill, or has no home.
6. **Do not attempt a goal object.** Inject a goal slice from a `session_start` hook and accept that lifecycle belongs to the orchestrator.
7. **Keep ACP out of the first build phase.** It buys reasoning-effort control and per-call approvals, and it costs a protocol client plus an outcome-persistence layer.

### Ranked build phases

| Rank | Phase | Why this rank | Depends on |
|---|---|---|---|
| 1 | `.vibe/` mirror: config, agents, skills, prompts | Without it there is no repo-local runtime at all; every later phase assumes it | nothing |
| 2 | Print-mode dispatch wrapper: `VIBE_HOME`, key, `--output-dir`, export parsing | Turns the mirror into a dispatch and produces the first real evidence | 1 |
| 3 | Guard hooks: spec gate, env-secret, overlay, MCP route, dispatch preflight, git message | The six deny-capable guards; highest behavioural value per line | 2 |
| 4 | `cli-mistral-vibe` executor kind: three tables, roster, adapter, env, recursion guard | Makes Vibe a first-class deep-loop executor | 2 |
| 5 | Stress and branch-contract coverage: per-kind stress file, live contracts, YAML branches | Required before the kind can be trusted in a fan-out | 4 |
| 6 | Context hooks: goal slice, session-start context, decision capture | Quality-of-life; no blocking behaviour | 3 |
| 7 | ACP client: config options, per-call approvals, cancel, fork | Optional control channel; only worthwhile once print mode is proven | 2, 4 |

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Recovering the `--output json` schema from the Rust binary with `strings` | Serde emits no literal JSON field names; only two generic fragments were found | `strings` over `vibe-rs` | 1 |
| Treating `vibe --help` as the whole dispatch contract | The help lists flags but is silent on exit codes and the export contract | `run_export.py` | 1 |
| Looking for a `--reasoning-effort` CLI flag | No such flag exists; every call site is protocol- or config-level | Rust flag table + Python call sites | 2 |
| Assuming the built-in catalog can name an OpenCode model id | The catalog is Mistral's; a foreign id needs a provider entry | `vibe-config-schema.json` | 2 |
| Assuming Vibe reads a repo-root config by default | Discovery walks up to the trust root; an untrusted `.vibe/config.toml` does not apply | `project.py` | 3 |
| Assuming `.vibe/` is recursive like `.opencode/` | Discovery examines only the project root | `_local_config_files.py` | 3 |
| Treating Vibe plugins as an OpenCode plugin port target | A `plugin.json` bundle cannot run code on runtime events | `_catalog.py` | 4 |
| Assuming slash commands port one-to-one | No user-authored command format exists | `acp/commands/registry.py` | 4 |
| Mirroring `.skilled/commands/` into `.vibe/commands/` | No such directory is read anywhere | `_local_config_files.py` | 5 |
| Assuming a same-name skill merges across scopes | The manager shadows the later claimant | `skills/manager.py` | 5 |
| Expressing `completion-evidence` or `ask-surface-guard` as Vibe hooks | Both bind to a turn-stopping moment Vibe does not expose | `.dsh/plugins/repo-guards/README.md` + `hooks/models.py` | 6 |
| Assuming `strict` works on every hook type | The validator rejects it outside three events | `hooks/models.py` | 6 |
| Declaring `reasoningEffort` for `cli-mistral-vibe` | No flag exists and the unsupported-field scan would reject it | `executor-config.ts` | 7 |
| Reusing the `cli-opencode` adapter with a different binary | The argument grammar differs on every axis | `fanout-run.cjs` | 7 |
| Replacing print-mode dispatch with ACP now | Needs a protocol client and outcome persistence first, and loses the export the audit reads | `acp/agent.py` + `run_export.py` | 8 |
| Treating `vibe-acp` as a thin wrapper over `vibe -p` | Separate entrypoint, own capability negotiation, no flag surface | `acp/entrypoint.py` | 8 |

## Divergence Map

- **Completed pivots:** 0
- **Failed pivots:** 0
- **Audited overrides:** 0
- **Saturated directions:** none — each angle was worked once and produced new material
- **Pivot lineage:** none
- **Remaining frontier:** the four open questions below; no angle was abandoned

---

## 12. Open Questions

1. **`--output json` and `--output streaming` payload shapes.** Rust-side and not mirrored in the Python package. Needs either an authenticated dispatch or an upstream source read.
2. **The hook payload contract.** What JSON a hook receives and whether it answers by exit code, stdout JSON, or both. The models file names the sections but the bodies live in the Rust harness.
3. **`vibe` versus `vibe-rs` in the ancestor walk.** The launcher `execvpe`s the binary, so the process image is `vibe-rs` while the command is `vibe`. Both must be in the recursion guard's match set; a live dispatch would confirm which appears.
4. **ACP startup and per-turn latency versus print mode.** Needs an authenticated client and a live session.
5. **Whether a generated `.vibe/agents/*.toml` can carry this repository's agent personas** without losing frontmatter fields Vibe does not model.
6. **Whether a `pre_tool` hook sees enough of a tool call** (path, command, agent name) to express the spec gate and the self-invocation guard without a wrapper.

---

## 13. Threats to Validity

- **No authenticated dispatch.** The single live smoke exercised the failure path only, so every success-path claim is a source read, not an observation. The exit-code taxonomy and the export contract are read from the code that implements them, which is strong but not the same as a green run.
- **No hook executed.** The blocking semantics are read from the model validator, not demonstrated.
- **No ACP session.** Every ACP claim is a capability-surface read.
- **Single-lens risk.** One lineage read the sources; the parent merge should treat the parity table as a claim to re-check, not a settled fact.
- **Version pin.** All findings are for `vibe 3.1.2`. A minor release could add a reasoning-effort flag or a command format and invalidate rows 7 and 12 of the parity table.

---

## 14. References

- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research-angles.md`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/` — `cli/launcher.py`, `app_server/run_export.py`, `app_server/protocol.py`, `app_server/_host_hooks.py`, `app_server/_billing.py`, `app_server/_unified_permissions.py`, `core/config/layers/project.py`, `core/paths/_local_config_files.py`, `core/config/harness_files/_harness_manager.py`, `core/agents/models.py`, `core/skills/models.py`, `core/skills/manager.py`, `core/hooks/models.py`, `core/tools/builtins/task.py`, `acp/agent.py`, `acp/commands/registry.py`, `plugins/builtins/vibe/plugin.json`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts`
- `.dsh/SYNC.md`, `.dsh/plugins/repo-guards/README.md`
- `resource-map.md` (lineage-local, generated from the converged deltas)

---

## 15. Convergence Report

- **Stop reason:** all_questions_answered
- **Total iterations:** 8
- **Questions answered:** 8 / 8
- **Remaining questions:** 0 strategy questions; 6 open questions carried in §12
- **Last 3 iteration summaries:** run 6: hooks and safety (0.94) → run 7: deep-loop executor support (1.00) → run 8: ACP and integration seams (1.00)
- **Convergence threshold:** 0.05
- **Divergence summary:** no divergent pivots recorded; each angle was worked once and produced new material
- **newInfoRatio trend:** 1.00, 1.00, 1.00, 1.00, 1.00, 0.94, 1.00, 1.00 — the single dip is the iteration that corrected a prior finding rather than adding new surface

The loop stopped because the question set was exhausted, not because novelty decayed. That is the honest reading: eight angles were assigned and eight were worked, so remaining_questions reached zero at the same iteration the cap did. A ninth iteration would have had to invent a question.

---

## 16. Deliverables Map

| Deliverable | Location | Status |
|---|---|---|
| Iteration narratives | `iterations/iteration-001.md` … `iteration-008.md` | 8 written |
| Structured deltas | `deltas/iter-001.jsonl` … `iter-008.jsonl` | 8 written |
| Canonical state log | `deep-research-state.jsonl` | gateway-owned, 8 iteration records |
| Strategy | `deep-research-strategy.md` | reducer-owned |
| Registry and dashboard | `findings-registry.json`, `deep-research-dashboard.md` | reducer-owned |
| Resource map | `resource-map.md` | generated |
| Merged synthesis | `research.md` | this file |
| Captured evidence | `evidence/vibe-config-schema.json`, `scratch/smoke1/` | captured |

---

## 17. Handoff Notes for the Parent Merge

- **The parity table in §6 supersedes the iteration-4 table** where they disagree: the goal-bridge row moved from "None" to "Partial" after iteration 6 found the `session_start` `additional_context` path.
- **`research/phase-plan.md` is not written by this lineage** because it lives outside the lineage write surface. §11's ranked build phases are the content that file should carry.
- **The four highest-value next actions** are: capture `vibe config schema` into the runtime packet as a checked artifact; write the `.vibe/` mirror; author the six deny-capable hooks; and spend one authenticated dispatch to close open questions 1, 2 and 3 at once.
- **Do not treat "8 of 8 answered" as "8 of 8 verified."** The questions are answered from primary sources; the success path was never exercised.
