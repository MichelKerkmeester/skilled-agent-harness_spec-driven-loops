---
title: "DeepSeek Harness - Guards and Hooks"
description: "Which harness seams a repository guard can use, how the repo-local Cordis bundle loads, which adapters it registers in an interactive session and a fan-out leaf, and what the saved runs confirmed."
trigger_phrases:
  - "dsh guards"
  - "dsh hooks"
  - "dsh repo-guards plugin"
  - "dsh cordis plugin"
  - "dsh hook bridge"
importance_tier: normal
contextType: implementation
version: 1.2.2.0
---

# DeepSeek Harness - Guards and Hooks

Open this file before relying on any repository guard inside a dsh run. One repo-local plugin carries the guard cores into a dsh session, and the adapters a fan-out leaf leaves off are named here so you never assume them.

---

## 1. OVERVIEW

### Purpose

Explains how the repository's guard cores reach a dsh run, which seams they attach to and which adapter binds each guard.

### When to Use

- Deciding whether a repository guard runs inside a dsh child.
- Reviewing or extending the repo-guards plugin.
- Explaining why goal and plan mode are off in a dispatch.

### Status

Twenty adapters are registered by `.dsh/plugins/repo-guards/index.mjs`, and `.dsh/patches/guards.patch.yml` inserts the bundle into every dsh lineage the deep-loop runner builds and into an operator's interactive session. Four of them are interactive-only: the lineage patch inserts a marker row, `repo-guards-lineage-leaf`, and those four check it at event time (section 4).

Keyless boots of both compositions reached `MISSING_CREDENTIAL` with no `did not activate` or `patch: entry not found` line. The interactive boot carried the advisor brief, the worktree advisory and the `dsh_goal` tool. The lineage boot carried none of them and kept the session-prime context (`specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity/evidence/keyless-boot-interactive.txt` and `keyless-boot-lineage.txt`). The 2026-11-06 Gateway run and the clean second lineage completed without a `did not activate` line. These runs confirm loading and composition, not every guard decision on real model tool calls. See `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.stderr.txt` and `fanout-lineage.md`.

### Workspace confinement

The saved `workspace-write` probe denied a write under `$HOME` outside the cwd, but allowed a sibling path under the OS temp directory. A lineage can therefore write inside another lineage's disposable `DSH_HOME` when both homes are under that temp directory. Keep the observed preventive boundary qualified by this exception, and do not treat separate temp homes as an enforced boundary between lineages. Evidence: `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/confinement.md`.

---

## 2. HARNESS SEAMS

The harness raises these events, and a plugin can attach to them (research synthesis section 9.6):

| Seam | What a guard can do there |
|---|---|
| `tools/pre-execute` | Deny or ask before a tool call |
| `tools/post-execute` | Block with feedback or attach context after a tool call |
| `tools/result` | Read a call's final outcome, including the live answer value |
| `agent/pre-step` | Add messages to a model step |
| `agent/turn-stopping` | Force another step before the turn ends |
| `agent/status` | Act when the agent goes idle |
| `agent/created`, `agent/disposed` | Session start and end work |
| `session/event` | Read each committed session entry, such as `compaction/end` or a steered user message |
| `fs/write-intent`, `fs/edit-intent`, `fs/delete-intent` | File-intent checks |

Tool arguments cannot be rewritten at `tools/pre-execute`, so a guard denies, it never edits. Harness tool names are lowercase (`bash`, `write`, `edit`, `subagent`), so a matcher written for capitalized tool names selects nothing. The harness's own guard package is loop hygiene, not repository policy.

---

## 3. DELIVERY: ONE REPO-LOCAL PLUGIN

Guards ship as one hand-authored Cordis bundle under `.dsh/plugins/repo-guards/`, inserted by `.dsh/patches/guards.patch.yml` with a relative plugin name. The bundle calls the same shared guard cores the Pi extensions bridge, and each adapter pins its error policy explicitly.

The bundle uses Pi's layout. Each file in `.dsh/plugins/repo-guards/adapters/` is a relative link to the real adapter in `.skilled/hooks/<concern>/dsh/`, or in the owning skill's `hooks/dsh/` folder with an index link in the hook library. Node resolves the link before it resolves the adapter's imports, so each adapter's imports are written for its real folder. `/doctor:runtime-mirrors` checks the links through `sync-runtime-mirrors.cjs --check`.

**Observed:** relative plugin loading works before any provider call. A stub plugin inserted by relative path wrote its marker file in the temp cwd during the keyless run that then failed on the missing key (`specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/plugin-boot.txt`). The real bundle loads the same way: the keyless guards boot reached `MISSING_CREDENTIAL` with zero `did not activate` lines, so a guard loaded by this patch is active before the model is asked anything.

**Not proven by that boot:** that any adapter's verdict on a live tool call is right. The bundle suite exercises the adapters against fixtures, and no keyed dispatch has run a model against them.

### Why Not the Claude Hook Bridge

The experimental `dsh-hooks-claude-code` bridge would reuse the hook scripts as they are. It stays a fallback, for three reasons from the research:

- It is not in the installed package, so a per-dispatch `$DSH_HOME` would need a package install per dispatch.
- An unreadable or unparsable hook config makes it log a warning and run no hooks while the agent still starts, which is fail-open for every guard.
- It has no `PreCompact` or `SessionEnd` event.

---

## 4. THE ADAPTER SET

Every adapter below is registered by `index.mjs`. `.dsh/plugins/repo-guards/README.md` section 4 owns this table, and it is repeated here because a dispatch decision needs it beside the seam list.

| Adapter | DSH event | Scope | Error policy |
|---|---|---|---|
| `dispatch-audit` | `tools/post-execute` | `bash` | Log and continue |
| `dispatch-preflight-lint` | `tools/pre-execute` | `bash` | Log and deny on core failure |
| `spec-gate-classify` | `agent/pre-step` | Latest operator prompt | Log and continue |
| `spec-gate-enforce` | `tools/pre-execute` | `write`, `edit`, `apply_patch`, `bash` | Log and deny on core failure |
| `completion-evidence` | `agent/turn-stopping` | Current assistant turn | Log and continue |
| `task-dispatch-guard` | `tools/pre-execute` | `subagent`, `subagent_fork` | Log and continue |
| `post-edit-quality` | `tools/post-execute` | `write`, `edit`, `apply_patch` | Log and continue |
| `mcp-route-guard` | `tools/pre-execute` | `mcp__*` | Log and deny on core failure, and deny a `code_mode` tool outside the four-tool allowlist |
| `classifier-injection-screen` | `tools/post-execute` | `web_fetch`, `web_search`, `mcp__*` | Log and continue |
| `goal-context` | `agent/created` | `DSH_SPEC_FOLDER` chat slice | Log and continue |
| `session-start-context` | `agent/created` | Session-prime output | Log and continue |
| `prompt-advisor` | `agent/pre-step` | Latest operator prompt | Log and continue, interactive only |
| `git-preflight-advisory` | `tools/post-execute` | Bash Git commands | Log and continue, add context |
| `git-message-gate` | `tools/pre-execute` | Bash commands covered by the message contract | Log unexpected errors and continue, deny on `ContractError` |
| `overlay-guard` | `tools/pre-execute` | `write`, `edit`, `apply_patch` | Log and allow, deny only a path an overlay owns |
| `session-compact-context` | `session/event` (`compaction/end`) | Session-prime `compact` output | Log and continue |
| `decision-capture` | `tools/result`, `session/event`, `agent/status` | `ask_user_question` answers and late timed replies | Log and continue |
| `goal-manage` | `agent/created`, `agent/pre-step`, `agent/turn-stopping`, `agent/status` | `/goal-dsh`, `dsh_goal`, goal brief, verify note | Log and continue, interactive only |
| `session-start-advisories` | `agent/created` (`startup`) | The six warn-only session-start guards | Log each failing guard and continue, interactive only |
| `session-stop-context` | `agent/disposed` | `session-stop.js` autosave | Log and continue, interactive only |

Five of these can refuse a call: `dispatch-preflight-lint`, `spec-gate-enforce`, `mcp-route-guard`, `git-message-gate` and `overlay-guard`. The rest inject context, attach an advisory, record a row or ask for another step. Context adapters call `agent.inject` or return `additionalContexts`, and a core error in one of them never blocks a tool call.

`dispatch-audit`, `dispatch-preflight-lint`, `git-preflight-advisory`, `mcp-route-guard` and `session-start-advisories` resolve the checkout from the adapter file, not the session cwd. A dsh session runs in a lineage or scratch folder, where a cwd-relative rule tree would be empty and the lint would allow every command. `git-message-gate` is a policy gate, so a contract violation or an unreadable contract returns `deny`.

`goal-context` injects only the packet's `chatSlice`, and only when `DSH_SPEC_FOLDER` names the packet. `session-start-context` runs the compiled `session-prime.js` and injects its stdout, and `session-compact-context` runs it again with the `compact` source after a completed compaction, because dsh never raises `agent/created` for one.

### Interactive and Fan-Out Leaf

The guards patch sets `promptAdvisor: true`. The lineage patch cannot override that row, because the runner applies it before the guards patch inserts the bundle, and a patch for a row that does not exist yet is dropped with a `patch: entry "repo-guards" not found` warning. So the lineage patch inserts its own marker plugin, and the bundle reads the marker when an event fires, since plugin `apply` order is not awaited across rows.

A fan-out leaf leaves four adapters off:

- `prompt-advisor`: the leaf's prompt is a fixed task, so a route suggestion is noise.
- `goal-manage`: the leaf's goal is the packet slice `goal-context` injects, and it must never write the operator's goal record.
- `session-start-advisories`: live follow and primary reconcile start background git work in the operator's checkout.
- `session-stop-context`: the autosave writes packet continuity.

The leaf keeps every guard and context adapter. The runner's `SYSTEM_SPEC_GATE_DISABLED=1` still turns the spec gate off for a leaf.

`session-relaunch` has no adapter. The outer runner owns a leaf's restarts, and `skilled-loop` launches no DSH session, so an interactive session gets the `/speckit:handoff` prompt only.

---

## 5. NATIVE SURFACES THAT STAY OFF

- **Goal.** The native goal service holds one goal per session and reads no `goal.md`. Its round driver keeps an active goal running while the agent is idle. The lineage patch disables `goal-round-driver`, `command-goal` and `tool-goal`, so a leaf has no `get_goal`, `create_goal` or `update_goal` tool, and a packet goal reaches the child through the `goal-context` guard or the prompt.
- **Plan mode.** Its exit tool fails closed when no review channel exists, and headless has none. The lineage patch disables `plan-mode`.
- **Ask-user tools.** Headless has no answer channel, so a question to the user cannot be answered. Write prompts that need no answer. In an interactive session, `decision-capture` queues each answer for the next `/speckit:save`.

The composed config shows `goal-round-driver`, `command-goal` and `plan-mode` disabled under the lineage patch (`specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/dump-config-llmgateway.txt`), and `tool-goal` disabled with a 20-tool lineage boot (`specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity/evidence/leaf-goal-tools-off.txt`).

---

## 6. RELATED

- [runtime-folder-and-sync.md](./runtime-folder-and-sync.md) - where the plugin and its patch live.
- [mcp.md](./mcp.md) - the MCP route guard's precondition.
- [repo-guards README](../../../../../.dsh/plugins/repo-guards/README.md) - the adapter inventory and error policies this section restates.
- [../hard-rules.json](../hard-rules.json) - the dispatch-time rules, which run before any in-run guard.
