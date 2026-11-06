---
title: "DeepSeek Harness - Guards and Hooks"
description: "Which harness seams a repository guard can use, how the repo-local Cordis bundle loads, which adapters it registers and defers, and what the saved Gateway run confirmed."
trigger_phrases:
  - "dsh guards"
  - "dsh hooks"
  - "dsh repo-guards plugin"
  - "dsh cordis plugin"
  - "dsh hook bridge"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# DeepSeek Harness - Guards and Hooks

Open this file before relying on any repository guard inside a dsh run. One repo-local plugin carries the guard cores into a dsh child, and the guards it leaves out are named here so you never assume them.

---

## 1. OVERVIEW

### Purpose

Explains how the repository's guard cores reach a dsh run, which seams they attach to and which adapter binds each guard.

### When to Use

- Deciding whether a repository guard runs inside a dsh child.
- Reviewing or extending the repo-guards plugin.
- Explaining why goal and plan mode are off in a dispatch.

### Status

Fourteen adapters are registered by `.dsh/plugins/repo-guards/index.mjs`, one of them behind an off-by-default flag, and `.dsh/patches/guards.patch.yml` inserts the bundle into every dsh lineage the deep-loop runner builds. A keyless boot with that patch printed no `did not activate` line and reached the provider call, so the bundle loads by relative path and resolves its shared-core imports from outside the installation (`specs/cli-external-orchestration/085-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge/evidence/keyless-guards-boot.txt`). Four adapters stay deferred (section 4). The 2026-11-06 Gateway run and the clean second lineage completed without a `did not activate` line. These runs confirm loading and completion, not every guard decision on real model tool calls. See `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.stderr.txt` and `fanout-lineage.md`.

### Workspace confinement

The saved `workspace-write` probe denied a write under `$HOME` outside the cwd, but allowed a sibling path under the OS temp directory. A lineage can therefore write inside another lineage's disposable `DSH_HOME` when both homes are under that temp directory. Keep the observed preventive boundary qualified by this exception, and do not treat separate temp homes as an enforced boundary between lineages. Evidence: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/confinement.md`.

---

## 2. HARNESS SEAMS

The harness raises these events, and a plugin can attach to them (research synthesis section 9.6):

| Seam | What a guard can do there |
|---|---|
| `tools/pre-execute` | Deny or ask before a tool call |
| `tools/post-execute` | Block with feedback or attach context after a tool call |
| `agent/pre-step` | Inject context before a model step |
| `agent/turn-stopping` | Force another step before the turn ends |
| `agent/created`, `agent/disposed` | Session start and end work |
| `fs/write-intent`, `fs/edit-intent`, `fs/delete-intent` | File-intent checks |
| `compaction/summary` | Compaction context |

Tool arguments cannot be rewritten at `tools/pre-execute`, so a guard denies, it never edits. Harness tool names are lowercase (`bash`, `write`, `edit`, `subagent`), so a matcher written for capitalized tool names selects nothing. The harness's own guard package is loop hygiene, not repository policy.

---

## 3. DELIVERY: ONE REPO-LOCAL PLUGIN

Guards ship as one hand-authored Cordis bundle under `.dsh/plugins/repo-guards/`, inserted by `.dsh/patches/guards.patch.yml` with a relative plugin name. The bundle calls the same shared guard cores the Pi extensions bridge, and each adapter pins its error policy explicitly.

**Observed:** relative plugin loading works before any provider call. A stub plugin inserted by relative path wrote its marker file in the temp cwd during the keyless run that then failed on the missing key (`specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/plugin-boot.txt`). The real bundle loads the same way: the keyless guards boot reached `MISSING_CREDENTIAL` with zero `did not activate` lines, so a guard loaded by this patch is active before the model is asked anything.

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
| `spec-gate-classify` | `agent/pre-step` | Latest user message | Log and continue |
| `spec-gate-enforce` | `tools/pre-execute` | `write`, `edit`, `apply_patch`, `bash` | Log and deny on core failure |
| `completion-evidence` | `agent/turn-stopping` | Current assistant turn | Log and continue |
| `task-dispatch-guard` | `tools/pre-execute` | `subagent`, `subagent_fork` | Log and continue |
| `post-edit-quality` | `tools/post-execute` | `write`, `edit`, `apply_patch` | Log and continue |
| `mcp-route-guard` | `tools/pre-execute` | `mcp__*` | Log and deny on core failure, and deny a `code_mode` tool outside the four-tool allowlist |
| `classifier-injection-screen` | `tools/post-execute` | `web_fetch`, `web_search`, `mcp__*` | Log and continue |
| `goal-context` | `agent/created` | `DSH_SPEC_FOLDER` chat slice | Log and continue |
| `session-start-context` | `agent/created` | Session-prime output | Log and continue |
| `prompt-advisor` | `agent/pre-step` | Latest user message | Log and continue, off unless the patch flag is `true` |
| `git-preflight-advisory` | `tools/post-execute` | Bash Git commands | Log and continue, add context |
| `git-message-gate` | `tools/pre-execute` | Bash commands covered by the message contract | Log unexpected errors and continue, deny on `ContractError` |

Four of these can refuse a call: `dispatch-preflight-lint`, `spec-gate-enforce`, `mcp-route-guard` and `git-message-gate`. The rest inject context, attach an advisory, record a row or ask for another step. Context adapters call `agent.inject` or return `additionalContexts`, and a core error in one of them never blocks a tool call.

`dispatch-audit` and `dispatch-preflight-lint` resolve the checkout from the plugin file, not the session cwd. A dsh session runs in a lineage or scratch folder, where a cwd-relative rule tree would be empty and the lint would allow every command. `git-message-gate` is a policy gate, so a contract violation or an unreadable contract returns `deny`.

`goal-context` injects only the packet's `chatSlice`, and only when `DSH_SPEC_FOLDER` names the packet. `session-start-context` runs the compiled `session-prime.js` and injects its stdout. `prompt-advisor` stays off because `.dsh/patches/guards.patch.yml` sets `promptAdvisor: false`, and setting that flag to `true` registers it.

### Deferred Adapters

Four adapters from the Pi set stay unported, each for a reason the source has not settled:

- `session-compact-context`: `compaction/summary` is UNKNOWN in the source event index, which lists only `compaction/summary-error`.
- `session-stop-context`: `agent/disposed` exists, but its source contract does not confirm session shutdown semantics.
- `session-start-advisories`: `agent/created` exists, but the Pi implementation runs several scripts instead of one plain shared function.
- `decision-capture`: `agent/turn-stopping` exists, but its DSH answer-channel semantics are UNKNOWN because no saved run exercised this adapter on that event.

`session-relaunch` has no adapter because the outer runner owns restarts, and a one-shot run never relaunches.

---

## 5. NATIVE SURFACES THAT STAY OFF

- **Goal.** The native goal service holds one goal per session and reads no `goal.md`. Its round driver keeps an active goal running while the agent is idle. The lineage patch disables `goal-round-driver` and `command-goal`, and a packet goal reaches the child through the `goal-context` guard or the prompt.
- **Plan mode.** Its exit tool fails closed when no review channel exists, and headless has none. The lineage patch disables `plan-mode`.
- **Ask-user tools.** Headless has no answer channel, so a question to the user cannot be answered. Write prompts that need no answer.

The composed config shows `goal-round-driver`, `command-goal` and `plan-mode` disabled under the lineage patch (`specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/dump-config-llmgateway.txt`).

---

## 6. RELATED

- [runtime-folder-and-sync.md](./runtime-folder-and-sync.md) - where the plugin and its patch live.
- [mcp.md](./mcp.md) - the MCP route guard's precondition.
- [repo-guards README](../../../../../.dsh/plugins/repo-guards/README.md) - the adapter inventory and error policies this section restates.
- [../hard-rules.json](../hard-rules.json) - the dispatch-time rules, which run before any in-run guard.
