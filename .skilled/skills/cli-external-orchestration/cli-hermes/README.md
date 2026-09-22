---
title: cli-hermes
description: Cross-AI dispatcher for Hermes Agent with quiet oneshot chat, LLM Gateway model routing, project skills and plugins, and read-only review workflows.
trigger_phrases:
  - "hermes cli"
  - "hermes agent"
  - "delegate to hermes"
  - "nous hermes"
  - "hermes chat"
version: 1.0.0.0
---

# cli-hermes

> Dispatch a scoped task to Hermes Agent's quiet oneshot chat and return validated code, analysis, or review findings to the calling runtime.

---

## 1. OVERVIEW

Hermes Agent is Nous Research's open-source Python agent CLI, installed as a git checkout under `~/.hermes` and reached through the `hermes` binary. This packet is the seventh mode of the `cli-external-orchestration` hub and makes Hermes available to any runtime that can shell out to it.

The packet owns three things: the routing contract, the availability and provider probes, and prompt construction. It owns no spawn path. Process construction belongs to the shared deep-loop runtime, where `cli-hermes` is the eighth `ExecutorKind` and `buildHermesLineageCommand` emits every dispatch, so a `/deep:research` or `/deep:review` lineage runs on `--executor=cli-hermes` without a packet-local wrapper.

Two traits separate Hermes from the six sibling runtimes, and both shape how you use this mode.

**Hermes has no agent flag.** Its profiles are whole-home islands and its sub-agents receive a goal and context rather than a file, so there is nothing to point at. A persona therefore reaches a session two ways at once: the generator mirrors each shared agent as the preloadable skill `agent-<name>`, which carries the whole text, and an environment variable names it so the repo plugin binds it for the session. Inlining the persona at the top of the prompt stays the fallback for a run without the plugin or the mirror, which keeps every dispatch `{persona + task}` and never a bare task.

**Its repo surface is narrow on purpose.** Hermes reads exactly two things from a project's `.hermes/` folder, `skills/` after a trust grant and `plugins/` behind an opt-in variable. The provider block, shell hooks and MCP servers are user-level config in `~/.hermes/config.yaml` and no repo file can carry them, so they appear here as operator steps.

### Key Statistics

| Metric | Value |
|---|---|
| Hub position | Seventh `cli-external-orchestration` mode |
| Deep-loop position | Eighth `ExecutorKind`, dispatched by `buildHermesLineageCommand` |
| Model roster | Closed at seven ids: `deepseek-v4.1-flash`, `glm-5.3-flash`, `gpt-5.6-luna`, `gpt-5.6-sol`, `minimax-m3`, `mimo-v2.6-pro` and `qwen3.8-max` |
| Provider | `llmgateway`, an operator-declared custom provider block |
| Agents directory | None. Personas are inlined into the prompt |
| Repo surface | `.hermes/skills/`, `.hermes/plugins/repo-guards/`, `.hermes/prompts/`, `.hermes/SYNC.md` |

---

## 2. QUICK START

```bash
# 1. Probe the binary and the provider. Both must pass before any dispatch.
command -v hermes
hermes config get providers.llmgateway.base_url </dev/null

# 2. Dispatch a write task.
hermes chat -Q --oneshot --query-file prompt.md --provider llmgateway --model deepseek-v4.1-flash \
  --reasoning max --ignore-rules --source tool --max-turns 200 --run-budget 840 \
  -t terminal,file,skills,todo,web --yolo --in "$PWD" </dev/null
```

Expected result: the provider probe prints `https://api.llmgateway.io/v1`. The dispatch prints the final response on stdout, `session_id: <id>` on stderr, and exits 0 on success, 1 on a failed result, 130 on an interrupt.

Read the exit code first, then stdout, then stderr. Validate any workspace changes with the repository's code and test gates before handing the result back.

---

## 3. FEATURES

| Feature | What it does |
|---|---|
| Quiet oneshot dispatch | `chat -Q --oneshot` returns the final response only, with the session id on stderr and hard exit codes. It is the auditable headless form, and `hermes -z` is never used because it drops the session id |
| Prompt on stdin | `--query-file -` reads the prompt verbatim from stdin, which is how the fan-out builder passes it. Argv `-q` stays for short prompts |
| Read-only review | Omit `--yolo`, narrow the toolset to `-t file,todo` and set `SPECKIT_HERMES_READ_ONLY=1` so the repo plugin refuses the write tools; Hermes has no read-only file toolset and no OS sandbox |
| Closed model roster | The seven ids in `HERMES_SUPPORTED_MODELS` only. `isHermesModelAllowed` rejects any other id in the fan-out, and a manual dispatch must not use one either |
| Session isolation | `--ignore-rules` keeps `SOUL.md`, Hermes memories, session search and the CWD instruction files out of the leaf prompt |
| Bounded toolsets | An explicit `-t` list excludes `delegation` and `memory`, which the stock roster enables and which would let a leaf spawn sub-agents outside the runner's boundary |
| Agent personas | `.hermes/agents/` links the shared agent files and each is mirrored as the skill `agent-<name>`; dispatch with `-s agent-<name>` plus `HERMES_AGENT_PERSONA=<name>` (repo plugin), inline otherwise |
| Project skills | Every canonical `SKILL.md` mirrored as a generated markdown-only copy under `.hermes/skills/<name>/` (`sync-skills-hermes.cjs`), preloaded with `-s <name>` after `hermes skills trust` |
| Project plugin | `.hermes/plugins/repo-guards` bridges the repo's shared guard cores into Hermes hooks, and every hook fails open |
| Generated prompt templates | `.hermes/prompts/*.md` mirror `.skilled/commands/**`, regenerated by `sync-prompts-hermes.cjs` |
| Self-invocation guard | A Hermes session never dispatches `cli-hermes`. `HERMES_AGENT=true`, `HERMES_SESSION_ID` and process ancestry each refuse the route |

### The `--yolo` Flag

`--yolo` lifts Hermes's dangerous-action approval gate, the one that covers its dangerous-command patterns such as `rm -rf` and writes whose immediate parent directory is `.hermes`. Headless, no user is present to approve, so a flagged call is denied and the leaf fails on a step it never announced. Ordinary writes and ordinary commands need no flag and run either way.

The rule that follows: a dispatch given a write or terminal toolset passes `--yolo` so a flagged step cannot silently fail it, and a read-only dispatch does not. `--yolo` is an approval bypass, never confinement, so read-only safety is the narrowed `-t` list.

---

## 4. REQUIREMENTS

| Requirement | Minimum | Notes |
|---|---|---|
| `hermes` binary | On `PATH` | `command -v hermes` gates the route. A missing binary refuses the dispatch before any command is built |
| Inference provider | `llmgateway` configured | `hermes config get providers.llmgateway.base_url` printing nothing means the route is unusable (`hermes status` does not show custom providers). Report it to the operator |
| LLM Gateway credential | `LLMGATEWAY_API_KEY` | Read from `~/.hermes/.env` through the provider block's `key_env` |
| Caller timeout | `timeoutSeconds` 900 or more for research | One live research iteration with `deepseek-v4.1-flash` at `max` reasoning finished at 1042 seconds; the runner's ceiling is twice `iterations × timeoutSeconds` and `--run-budget` stays one margin under the setting |

---

## 5. STRUCTURE

```text
.skilled/skills/cli-external-orchestration/cli-hermes/
+-- SKILL.md                    # Routing contract, hard rules, dispatch shape, gotchas
+-- README.md                   # This file
+-- references/                 # CLI, providers, tools, patterns, delegation, hooks, MCP
+-- assets/                     # Prompt quality card and prompt templates
+-- manual-testing-playbook/    # Playbook root, symlinked into .hermes/
+-- benchmark/                  # Benchmark index for playbook-derived reports
+-- feature-catalog/            # Per-feature inventory of the shipped surface
|   +-- feature-catalog.md      # Canonical current-state inventory for the shipped surface
|   +-- dispatch-guards/        # Hard-rule preflight checks and dispatch-shape recognition
|   +-- fanout-dispatch/        # Executor kind, closed roster, run budget and toolset policy
|   +-- hub-registration/       # Hub mode registration
|   +-- prompt-contract/        # Prompt card and improver eligibility
|   `-- runtime-surface/        # The .hermes/ runtime folder and the repo-guards plugin
`-- changelog/                  # Packet-local changelog
```

| Path | Purpose |
|---|---|
| `SKILL.md` | The routing contract, eight hard rules, dispatch shape and gotchas |
| `references/cli-reference.md` | Flags, headless forms, exit codes, isolation flags, environment |
| `references/providers-and-models.md` | The `llmgateway` provider contract and the closed roster |
| `references/hermes-tools.md` | Toolsets, project skills and plugins, the `.hermes/` write guard |
| `references/integration-patterns.md` | Conductor and executor patterns, cross-validation, anti-patterns |
| `references/agent-delegation.md` | Persona inlining, persona skills, `delegate_task`, command templates |
| `references/hook-contract.md` | Shell hooks versus the project plugin, the guard-core hook map |
| `references/mcp-policy.md` | Operator steps for MCP and deny-by-default per tool |
| `assets/prompt-quality-card.md` | Thin delegator to the canonical prompt-models card |
| `assets/prompt-templates.md` | Write, read-only, generation and fan-out scaffolds |
| `feature-catalog/feature-catalog.md` | Canonical current-state inventory for the shipped surface |
| `feature-catalog/dispatch-guards/` | Hard-rule preflight checks and dispatch-shape recognition |
| `feature-catalog/fanout-dispatch/` | Executor kind, closed roster, run budget and toolset policy |
| `feature-catalog/hub-registration/` | Hub mode registration |
| `feature-catalog/prompt-contract/` | Prompt card and improver eligibility |
| `feature-catalog/runtime-surface/` | The `.hermes/` runtime folder and the repo-guards plugin |

The repo-root `.hermes/` folder is the runtime surface Hermes itself reads.

| Path | What it holds |
|---|---|
| `.hermes/skills/<name>/` | One generated markdown-only `SKILL.md` per canonical skill, all 56, naming its canonical directory. Never a symlink: Hermes's static scanner walks everything it reaches, costs ten minutes per session start and quarantines every hub |
| `.hermes/plugins/repo-guards/` | The hand-authored project plugin bridging the repo's guard cores into Hermes hooks |
| `.hermes/prompts/*.md` | Generated pointer stubs, one per `.skilled/commands/**` file, named by the flattened command path |
| `.hermes/SYNC.md` | The sync manifest: what derives from `.skilled`, what can drift and how to regenerate it |

There is no `.hermes/agents/`, because Hermes has no flag that loads an agent file.

---

## 6. CONFIGURATION

Four steps are the operator's and live in the user-level `~/.hermes/`. No repo file performs them and no dispatch should claim otherwise.

| Step | Command or setting | Why it is user-level |
|---|---|---|
| Provider | A `providers:` block named `llmgateway` in `~/.hermes/config.yaml` with `key_env: LLMGATEWAY_API_KEY` | Hermes reads provider config only from the user home |
| Skill trust | `hermes skills trust`, run once from the repo root | The trust grant is recorded per project in the user config |
| Project plugins | `HERMES_ENABLE_PROJECT_PLUGINS=1` in the session environment, plus `repo-guards` under `plugins.enabled` in `~/.hermes/config.yaml` | `hermes plugins enable` refuses project keys, so the line is added by hand |
| MCP servers | `hermes mcp add <name> --command <cmd> --args <args>`, then `hermes tools enable <name>:<tool>` | MCP server definitions live in the user config only |

A configured MCP server is still invisible to a session unless its name appears in that session's `-t` list.

---

## 7. USAGE EXAMPLES

Read-only review. The narrowed toolset is the boundary, and the missing `--yolo` keeps the dangerous-action gate closed.

```bash
hermes chat -Q --oneshot --query-file review-prompt.md --provider llmgateway --model glm-5.3-flash \
  --reasoning max --ignore-rules --source tool --run-budget 600 \
  -t file,todo --in "$PWD" </dev/null
```

Result: findings on stdout with `file:line` citations, no workspace changes. Open every citation before repeating it.

Deep-loop fan-out. The runtime builds the command, so pass the executor and the model rather than flags.

```bash
# Example shape. The loop command owns the full flag set.
/deep:research --executor=cli-hermes --model=deepseek-v4.1-flash
```

Result: a lineage whose iterations run through `buildHermesLineageCommand`. Give it `timeoutSeconds` 900 or more per iteration, and name any MCP server it needs in `liveTools.mcpServers`.

---

## 8. TROUBLESHOOTING

| What you see | Cause | Fix |
|---|---|---|
| Exit 1, `No inference provider configured` on stdout, stderr empty, no session id | No provider in `~/.hermes/config.yaml` | Report it to the operator. The provider block is an operator step |
| The dispatch hangs with no output | Stdin inherited from a terminal | Feed the prompt through `--query-file -` or close stdin with `</dev/null` |
| A step failed quietly and the leaf reported less than it did | A dangerous-action call hit the approval gate with nobody to approve it | Pass `--yolo` on any dispatch carrying a write or terminal toolset |
| Prior-session content shows up in the leaf's reasoning | `--ignore-rules` was omitted, so `SOUL.md`, memories and the CWD instruction files were injected | Pass `--ignore-rules` on every dispatch |
| A leaf spawned sub-agents or wrote memories | The stock toolset roster enables `delegation` and `memory` | Pass an explicit `-t` list that excludes both |
| Session start takes ten minutes and every hub is quarantined | The whole `.skilled/skills` tree is linked under `.hermes/skills` | Link one skill directory at a time and preload it with `-s <name>` |
| The fan-out reverted a worktree the leaf created | `--worktree` runs `git worktree add` inside the repository | Never pass `--worktree` |
| Reasoning text appears before the answer on stdout | `-Q` can emit the model's reasoning first, observed with `deepseek-v4.1-flash` | Read the tail for the answer. The fan-out validates artifacts, not stdout |

---

## 9. RELATED RESOURCES

### Related Skills

| Skill | Relationship | Use when |
|---|---|---|
| [`cli-external-orchestration`](../README.md) | Parent hub | Picking between the seven external CLI runtimes |
| [`cli-pi`](../cli-pi/README.md) | Sibling mode | The task wants Pi's guarded headless print or RPC surface |
| [`cli-codex`](../cli-codex/README.md) | Sibling mode | The task wants an OpenAI-backed review or research pass |
| [`sk-prompt`](../../sk-prompt/SKILL.md) | Dependency | Composing the dispatch prompt against the canonical quality card |
| [`sk-code`](../../sk-code/SKILL.md) | Dependency | Verifying the code a Hermes dispatch returned |
| [`system-deep-loop`](../../system-deep-loop/SKILL.md) | Execution owner | Running a `cli-hermes` lineage or any fan-out dispatch |

### Related Documents

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The routing contract this README summarizes |
| [`.hermes/SYNC.md`](../../../../.hermes/SYNC.md) | What the repo's Hermes surface derives from and how to resync it |
| [Hermes Agent repository](https://github.com/NousResearch/hermes-agent) | Upstream source and documentation |
