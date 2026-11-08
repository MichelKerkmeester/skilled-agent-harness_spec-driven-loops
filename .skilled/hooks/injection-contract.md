---
title: "Hook & Plugin Injection Contract"
description: "What every lifecycle hook and OpenCode plugin actually injects into a session, on which event, through which channel, and whether that content is visible to the human by default in each runtime."
trigger_phrases:
  - "hook injection contract"
  - "what does this hook inject"
  - "additionalContext contents"
  - "systemMessage contents"
  - "advisor brief contents"
  - "is hook output visible"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.0
---

# Hook & Plugin Injection Contract

Every runtime this repo dispatches to (Claude Code, Cursor, Devin, Codex, OpenCode, Pi and DeepSeek Harness) wires the same handful of shared guard cores into its own lifecycle-hook or plugin-hook API. Each core can add text to a session in one of a few distinct ways, and those ways have very different visibility to the human operator. This reference catalogs every injection point by content, not by file, since several files across runtimes point at the same core and inject identical text.

**Kill-switches.** Every concern except `git-message-gate` honors the master `SYSTEM_HOOKS_DISABLED` switch plus its canonical `SYSTEM_<CONCERN>_DISABLED` switch, and every concern except session relaunch is default-on. Session relaunch ships off: a runtime's `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` turns it on or off for that runtime when it holds a value, and `SYSTEM_SESSION_RELAUNCH_ENABLED` decides otherwise. Guard resolution is fail-open, so a resolver failure does not block the underlying runtime event. The single source for concern names, aliases, effects, and wiring status is the [`README.md` kill-switch index](./README.md#kill-switch-index). This contract does not duplicate it.

---

## 1. OVERVIEW

### Purpose

Answer, for any hook or plugin in this repo: what does it add to the session, on what trigger, and can a human watching the terminal see it without special tooling?

### Why this exists

`additionalContext`, `systemMessage`, and `experimental.chat.system.transform`'s `system` array are all **model-context-only** by default. The text reaches the assistant, but it is not rendered as a chat bubble. Pi's `input`-event transform is the one mechanism in this repo's whole hook surface that visibly rewrites the text the human sees themselves send, which is why the same skill-advisor brief that is invisible in Claude Code becomes visible mid-prompt in Pi. Nothing was broken. The runtimes genuinely differ, and this doc makes that difference explicit instead of leaving it to be rediscovered per runtime.

### Visibility Legend

| Tag | Meaning |
|---|---|
| **[SYS]** | Model-context-only. Delivered as `additionalContext`, `systemMessage`, or an appended system-prompt string. The assistant sees it every time. A human watching the normal chat/TUI does not, by default. |
| **[MSG]** | Rendered as visible chat content. Currently true only for Pi's `input`-event transform, which appends text directly onto the user's own visible prompt. |
| **[BLOCK]** | A permission/tool-call denial with a reason. Model-visible because the assistant's next turn has to react to the failed call. A human sees it indirectly, through the assistant's response, not as separate injected text. |
| **[LOG]** | Written to a file only (audit log, advisory log, state file). Invisible to both the assistant and the human unless someone opens the file. |
| **[NONE]** | No content is added anywhere. The hook does only side effects (state writes, cache writes, process cleanup). |

---

## 2. PROMPT-TIME INJECTIONS

Fire once per user turn, before the model call.

### Skill Advisor Brief

**Injects:** `Advisor: {live|stale}; use {skill} {confidence}/{uncertainty} pass.` (or the ambiguous two-skill variant), followed by one fixed directive appended to every brief regardless of the recommendation: the **comment-hygiene HARD BLOCK** reminder.

The governor and proof-over-appearance directives were retired: both restated a disposition every turn, which is what the system prompt and AGENTS.md already carry, so they spent context re-asserting what was not in dispute. The hygiene directive stays because it is not a disposition. It names a specific prohibition a pre-commit gate enforces, and the gate is what makes it load-bearing.

```text
Advisor: stale; use cli-pi 0.95/0.20 pass.
Directives:
- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code
comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit
gate blocks violations.
```

- **Trigger:** every user prompt submission. The **constant directive** is delivered in full on the first proven message and after lifecycle boundaries. Route-only delivery requires confirmed primitive identity, valid transcript evidence, a matching versioned record, stable generation/epoch state, and an atomically advanced transcript high-water mark. Registered session/compaction owners advance the durable epoch through the boundary bridge. Unidentified or failed boundaries poison older receipts until a successful reset clears the fail-safe marker. The file-backed store uses a directory-descriptor-anchored helper and defers full-delivery receipts until stdout handoff. `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` restores always-full delivery. Missing evidence, contention, insecure state, helper/platform failure, fallback policy, or any error also stays full. Canonical rule: `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`. Durable state is in `directive-lifecycle-file-store.ts` plus `directive-lifecycle-store.py`. OpenCode mirrors the in-process semantics.
- **Canonical owner:** `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` (`renderAdvisorBrief`, `HYGIENE_DIRECTIVE`) owns the shared directive text used by runtime adapters. The OpenCode plugin (`.opencode/plugins/system-skill-advisor.js`) is the fallback emitter: it mirrors the same directive locally and delegates to the canonical renderer when the compiled module is available.
- **Channel per runtime:** Claude Code `[SYS]` (`user-prompt-submit.js` -> `hookSpecificOutput.additionalContext`). Cursor/Devin `[SYS]` (same shim, re-wrapped into each CLI's own envelope). Codex `[SYS]` (mirror of the Claude shim). OpenCode `[SYS]` (`system-skill-advisor.js` via `experimental.chat.system.transform`). Pi `[MSG]` (`prompt-advisor.ts` forwards the shared context onto the visible prompt via the `input` event's `{action:"transform"}`). DSH `[SYS]` (`agent/pre-step`, interactive only, as an appended `repo-guards` message).
- **Pi-only directive ownership:** the Pi adapter forwards the shared advisor context onto the visible prompt but injects no Pi-only directive of its own. The current-turn `cli-*` override policy is enforced at the tool-call boundary by `dispatch-preflight-lint.ts`, which never writes into the prompt. The Pi adapter is a forwarder, not an owner, of the shared directive. It is not emitted by `render.ts` or the OpenCode bridge.
- **See also:** [`skill-advisor-hook.md`](../skills/system-skill-advisor/hooks/skill-advisor-hook.md) for setup and validation. This file only documents the injected content.

### Spec-Gate Mutation-Time Delivery

**Injects:** the A/B/C/D spec-folder menu is delivered at the first file mutation, once per session. It is never appended to a write-intent turn, so the turn proceeds instead of stalling on a question. The turn-time text is a deferral. The mutation-time text is a notice the model relays to the operator.

```text
SPEC GATE: this session needs a spec-folder decision, but only at the first file mutation.
Do not stop to ask it now; ask it once when you are about to write, then continue.
```

- **Trigger:** a user prompt the classifier scores as a probable file mutation opens the session gate. The menu itself reaches the operator at the first non-exempt Write/Edit, or through Pi's interactive dialog, and not again for that session unless the gate re-arms.
- **Owning module:** `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (`classifyIntent` opens the gate. `evaluateMutation` composes `GATE_3_MUTATION_NOTICE`. `recordGate3NoticeDelivered` persists the once-per-session marker).
- **Channel per runtime:** Claude/Codex/Devin `[SYS]` (`spec-gate-enforce.mjs` -> `additionalContext` on the first in-gate advise. A deny reason is `GATE_3_DENY_DETAIL`, which embeds the same notice). Cursor `[SYS]` (`agent_message` on advise, `user_message` on deny). OpenCode `[SYS]` (`system-spec-gate.js` pushes the deferral instruction through `experimental.chat.system.transform` once. Its thrown deny reason carries `GATE_3_DENY_DETAIL`). Pi `[MSG]` only when the session has no UI (`spec-gate-classify.ts` appends the deferral instruction to the visible prompt). A dialog-capable Pi session gets an interactive dialog instead of any text, and its one blocked call carries the notice in the retry reason. DSH classifies at `agent/pre-step`, and `tools/pre-execute` returns an `ask` verdict with the menu on the first undelivered write, or a `deny` under enforcement.

### Goal / Dist-Freshness Context (OpenCode only)

**Injects:** active-goal guidance or a stale-dist warning, each bounded and each appended independently.

- **Trigger:** `session.created` (goal) or before a risky Bash command (dist-freshness).
- **Owning modules:** `opencode-goal.js`, `system-dist-freshness-guard.js` (see their own entries in [`../../.opencode/plugins/README.md`](../../.opencode/plugins/README.md) §5).
- **Channel:** `[SYS]` only. Both use `experimental.chat.system.transform`, never `chat.message`'s mutable `parts`, so none of this is rendered as a visible chat bubble in OpenCode today (see §5 below for how it could become visible).

### Cross-Runtime Active-Goal Brief (Cursor / Pi / Devin / DSH)

**Injects:** the passive session-goal steering block, marker- and field-compatible with opencode-goal's OpenCode injection but rendered by the runtime-neutral core (`.skilled/hooks/goal/lib/goal-core.cjs` `renderGoalBrief`) with the `goalPrompt` Role line relabeled to the reading runtime. When the session is bound to a packet, the `objective:` and `goal_prompt:` content is projected from that packet's `goal.md` durable slice on every turn (frontmatter never included), and one `[goal_resend_pending] ...` line follows the block while the operator copy is behind the file. Verbatim shape:

```text
[active_goal:<goalId>]
status: active
objective: <objective>
goal_prompt:
Role: Focused <Cursor|Pi> execution agent operating under the active session goal.
Objective: <objective summary>
Context: ...
Method:
- ...
Success Criteria:
- ...
Stop Conditions:
- ...
last_check: <verdict> ; reason: <reason>
usage: tokens n/a/<tokenBudget>; time <seconds>s; iteration <turnsUsed> (source: turn-count-estimate)
directive: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.
[/active_goal]
```

- **Trigger per runtime:** Cursor `sessionStart` only (its `beforeSubmitPrompt` never delivers, `stop` never fires). Pi `input` (every turn, operator-visible transform) + `session_start` (restore) + `turn_end` (verify + `recordTurn`). Devin `SessionStart` and `UserPromptSubmit`. DSH `agent/pre-step` (the brief, on each operator turn, interactive only) and `agent/created` (the packet slice).
- **Owning modules:** the shared core `.skilled/hooks/goal/lib/goal-core.cjs`, the slice module `lib/goal-slice.cjs`, plus the per-runtime adapters under `.skilled/hooks/goal/{cursor,devin,pi,dsh}/`. Each read resolves workspace, runtime, and native session id to an opaque per-session state file. The legacy `active-goal.json` is never an injection fallback.
- **Channel per runtime:** Cursor `[SYS]` (`sessionStart` `agent_message`). Devin `[SYS]` (`SessionStart` and `UserPromptSubmit` `hookSpecificOutput.additionalContext`). Pi `[MSG]`. Its `input`-event transform appends the block onto the visible prompt, which makes it the one runtime where the operator sees the active-goal text themselves (same mechanism as the advisor brief and Gate-3 deferral instruction, and they chain additively). The `usage:` token count is `n/a` outside OpenCode (turn count is the accounting primitive. `usageSource` is always `turn-count-estimate`). DSH `[SYS]`: `agent.inject` delivers the packet slice at `agent/created` and the brief at `agent/pre-step`, and the verify and status notes at `agent/turn-stopping` and `agent/status` (interactive only).

---

### Session Relaunch Context Nudge

| Concern | Events | Payload | Frequency |
|---|---|---|---|
| Session relaunch | Claude Code: PostToolUse and UserPromptSubmit | hookSpecificOutput.additionalContext | Once per reached threshold level in a session |
| Session relaunch | Codex: PostToolUse and UserPromptSubmit | hookSpecificOutput.additionalContext | Once per reached threshold level in a session |
| Session relaunch | Pi: `message_end` decides and `agent_end` delivers the held nudge | `pi.sendMessage` with `display: false` | Once per reached threshold level in a session |
| Session relaunch | OpenCode: `experimental.chat.system.transform` pushes the pending nudge, fed by message events | an entry in the system array | Once per reached threshold level in a session |

The Codex nudge reads its fill from the transcript rollout's latest `token_count` record and emits the same `[SYS]` envelope the Claude adapter uses, so it is model-context-only by default. Neither the arming nor the usage records inject content: both are `[NONE]` side effects. Cursor, Devin and DSH carry no adapter, so `/speckit:handoff` is the only trigger on those runtimes and this table adds no row for them.

---

## 3. TOOL-TIME INJECTIONS

Fire around a specific tool call, not the whole turn.

### Spec-Gate Enforcement Denial

**Injects:** the denial reason is `GATE_3_DENY_DETAIL`. It holds the DENIED sentence, the same mutation notice the advised path carries, and `Then retry the same call.` It is delivered in place of a successful tool result. An *advised* first mutation (enforcement off) is not a block: it carries `GATE_3_MUTATION_NOTICE` as ordinary tool-time context.

- **Trigger:** a mutating tool call (`write`/`edit`) the shared gate evaluates as denied. `bash` is never denied, only advised.
- **Owning module:** `spec-gate-core.mjs` (`evaluateMutation`).
- **Channel:** `[BLOCK]` everywhere. Claude/Cursor/Devin/Codex return `hookSpecificOutput.permissionDecision: "deny"` plus `permissionDecisionReason`. Pi's `spec-gate-enforce.ts` returns `{block: true, reason}`. OpenCode's `system-spec-gate.js` denies via `tool.execute.before`, and DSH's `spec-gate-enforce` returns a `deny` verdict at `tools/pre-execute`.

### Dispatch Preflight Lint

**Injects:** either a **block** reason (a hard-rule violation) or a **warn-only advisory** (soft finding, call proceeds).

```text
Dispatch blocked by cli-opencode hard-rule(s):
  • [stdin-redirect-required] Ad-hoc `opencode run` MUST close/redirect stdin (</dev/null)...
```

- **Trigger:** a bash tool call matching a known CLI-dispatch shape (`opencode run`, `claude -p`, etc.).
- **Owning module:** `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, relocated from `cli-external-orchestration/cli-opencode/scripts/lib/` since it has no real dependency on `cli-opencode`'s other content.
- **Channel:** the block path is `[BLOCK]`. The warn-only path is `[SYS]` (`additionalContext`) on Claude/Cursor/Devin/Codex/Pi, or a bounded system-transform append on OpenCode. DSH's `dispatch-preflight-lint` returns a `deny` at `tools/pre-execute` for a blocking rule.

### MCP Route Guard

**Injects:** a warning that a native `mcp_*` tool call should have routed through an available Code Mode manual instead.

- **Trigger:** a native (non-Code-Mode) MCP tool call matching a manual Code Mode already covers.
- **Owning module:** `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`, relocated from `mcp-code-mode/runtime/lib/`.
- **Channel:** `[SYS]` on Claude/Cursor/Devin/Codex/Pi (`additionalContext`/`reason`). `[LOG]`-only on OpenCode: `mcp-route-guard.js`'s own README entry says explicitly it "writes advisory logs only and never rejects a call," so this is the one guard genuinely invisible to the OpenCode model, not just invisible to the human. DSH `[BLOCK]` at `tools/pre-execute`: a routing warning becomes the deny reason, because a dsh pre-execute hook has no advisory channel, a Code Mode tool outside the mount allowlist is denied, and so is a core failure.

### Dispatch Audit

**Injects:** nothing. Records a completed CLI dispatch (command, runtime, session id, output) to `.skilled/logs/cli-dispatch-audit.log`.

- **Channel:** `[LOG]` on every runtime. This is a pure telemetry hook. It has no `additionalContext` path at all.

### Task Dispatch Guard

**Injects:** an allow/deny decision (with reason on deny) for a subagent/sub-task dispatch.

- **Trigger:** a `run_subagent`/Task-tool/`subagent` dispatch.
- **Owning module:** `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, relocated from `system-deep-loop/runtime/lib/deep-loop/`.
- **Channel:** `[BLOCK]` on deny (same envelope shape as spec-gate enforcement). Pi's `.pi/extensions/task-dispatch-guard.ts` is wired on the native `subagent` tool and returns the guard's text as an advisory reason, never a block (`~ partial`: direct `subagent` calls only. Workflow-nested `runs.run` dispatches are not covered). DSH's `task-dispatch-guard` is `[LOG]` only: it writes warnings and audits to the guard's state folder and always calls `next()`, so it never denies.

### Injection Screen

**Injects:** one advisory line naming how many sections of a just-fetched page read as instructions aimed at an agent, the strongest section's position and its probability.

- **Trigger:** a completed fetch tool call: `WebFetch` (Claude Code), `webfetch` (Devin, OpenCode), `fetch_content` (Pi), and `web_fetch`, `web_search` and `mcp__*` results (DSH). The fetch result itself always reaches the model unchanged.
- **Owning module:** `.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs`, over `lib/classifier-screen-fetched-text.mjs`. Each runtime adapter keeps only its own event, its fetch tool's name and its delivery channel.
- **Channel per runtime:** Claude Code `[SYS]` (`PostToolUse` -> `hookSpecificOutput.additionalContext`). Devin `[SYS]` (matcher `^webfetch$` -> `additionalContext`). OpenCode `[SYS]` (`tool.execute.after` on `webfetch` buffers the line. The next `experimental.chat.system.transform`, the model call that reads the fetch result, drains it). Pi `[SYS]` (the advisory text block is appended to the `fetch_content` tool result). DSH `[SYS]` (`additionalContexts` on the tool result at `tools/post-execute`).
- **Why Cursor and Codex are absent:** Cursor's `postToolUse` payload for the `Fetch` tool carries only `url`, `status_code` and `content_length`, so no page text ever reaches a hook. Codex's only web tool is the provider-hosted `web_search`, which runs on the model provider's side, so no local hook ever sees a fetched page.
- **Kill-switch:** `SYSTEM_INJECTION_SCREEN_DISABLED`, plus the master `SYSTEM_HOOKS_DISABLED`. The Jev feature switches also turn it off: `JEV_FEATURE_INJECTION_SCREEN=0` and `JEV_FEATURES=0`. It stays silent until `jev auth status` passes, and any error exits 0 with no output.

### Post-Edit Quality

**Injects:** a plain-text block of quality findings for the file just edited/written (comment-hygiene violations, checker findings).

```text
COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.
These references are unstable and will rot. Replace each with the durable WHY.
Violations in src/foo.ts:
  ...
```

- **Trigger:** a completed `edit`/`write` tool call.
- **Owning module:** `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, relocated from `sk-code/sk-code-quality/scripts/lib/`.
- **Channel:** `[SYS]` on Claude and Devin: `claude-posttooluse.cjs` and `devin/post-edit-quality.cjs` return the findings in a `PostToolUse` envelope as `hookSpecificOutput.additionalContext`, and a clean edit stays silent. Pi's `post-edit-quality.ts` appends them to the tool result (`ToolResultEventResult.content`) and OpenCode's `sk-code-post-edit-quality.js` drains them on the next `experimental.chat.system.transform`. Cursor's `post-tool-use.mjs` proxies the Claude check for `Write`, and DSH returns `additionalContexts` at `tools/post-execute`. Codex's `post-edit-quality.cjs` still writes plain stdout, and its `PostToolUse` stdout handling is not independently verified in this repo. Every other adapter's findings are confirmed to reach the assistant.

---

## 4. SESSION-LIFECYCLE INJECTIONS

Fire on session start, stop, or compaction, not tied to a single turn or tool call.

### Session Start Context

**Injects:** a startup or resume brief: a session-context surface on cold start, or a cached compaction/resume payload.

- **Trigger:** `session_start` (Pi) / `SessionStart` (Claude/Cursor/Devin/Codex) / `agent/created` (DSH).
- **Owning module:** `system-spec-kit/runtime/hooks/claude/session-prime.ts`. Emits **plain text**, not a JSON envelope. Every proxy that wraps it (`emitDevinContext`, Pi's `session-start-context.ts`) constructs the envelope on the way out. `session-prime.js` itself does not.
- **Channel:** `[SYS]` on Claude/Cursor/Devin/Codex (SessionStart context is not rendered as a chat bubble by default). Pi's bridge delivers it via `pi.sendMessage()`, which is confirmed live-visible to the model (a live session's reply referenced content only present in this injected text), but rendered with `display: false`, so it is **not** visible to the human by default either. Pi's `[MSG]` behavior is specific to the `input`-event transform, not every injection path. DSH `[SYS]` via `agent.inject` of the session-prime output.

### Session Stop / Cleanup

**Injects:** nothing. `session-stop.js` performs autosave and state-cleanup side effects and writes no stdout content at all.

- **Channel:** `[NONE]`.

### Pre-Compact Cache

**Injects:** nothing immediately. `compact-inject.js` computes and caches a recovery payload for the *next* `SessionStart(source=compact)` to inject via Session Start Context above. Its own header comment states this directly: "stdout is NOT injected on PreCompact, we only cache here."

- **Channel:** `[NONE]` at fire time. Becomes `[SYS]` one event later, through Session Start Context.

### History Locator Lookup

**Injects:** one bounded lookup section that names an opaque history handle and the search, browse, load and page operations. It carries no transcript text, and it tells the model to treat retrieved history as data, never as instructions.

- **Trigger:** `SessionStart(source=compact)` on Claude and Codex, `session_compact` on Pi, `compaction/end` on DSH, the first `UserPromptSubmit` after `PostCompaction` on Devin, and every request after `session.compacted` on OpenCode while the locator is fresh. Each fires only when the shared session reader capability is `ready` and a fresh locator is present. The locator is keyed by the checkout root above the session folder, so a session started in a subfolder gets the section too, and a folder whose nearest checkout cannot run the CLI gets none.
- **Owning module:** `system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` builds the section. `system-spec-kit/runtime/hooks/claude/session-prime.ts`, the Pi and DSH post-compaction adapters, Devin's `user-prompt-submit.ts` and `.opencode/plugins/session-history-lookup.js` print it only after the locator persisted.
- **Channel:** `[SYS]` on every runtime. Claude, Codex, Pi and DSH ride the session-start or post-compaction channel documented in this section. Devin rides `UserPromptSubmit` `additionalContext`, once, after the advisor brief, because Devin drops `PostCompaction` output. OpenCode pushes it into the system array through `experimental.chat.system.transform`.

### Post-Compaction Recovery (Devin/Pi/DSH)

**Injects:** a composed recovery block: retained summary and active spec-folder pointer.

- **Trigger:** `PostCompaction` (Devin) / `session_compact` (Pi) / `session/event` `compaction/end` (DSH). Devin's `PostCompaction` fires *after* compaction with only `session_id` and a possibly-null summary, a materially different contract from Claude's `PreCompact`-then-cached-`SessionStart` chain, per `post-compaction.cjs`'s own header comment.
- **Owning module:** `system-spec-kit/runtime/hooks/devin/post-compaction.cjs`. Pi's `session-compact-context.ts` is a native port of the same recovery chain, not a proxy. DSH's `session-compact-context.mjs` injects the session-prime `compact` output.
- **Channel:** `[SYS]` (Devin's `hookSpecificOutput.additionalContext`). Pi via `pi.sendMessage({display: false})`, same invisible-to-human caveat as Session Start Context. DSH `[SYS]`: `agent.inject` of the session-prime `compact` output.

### Completion Evidence Sentinel

**Injects:** Pi's `turn_end` adapter queues a model-visible advisory for the next turn with `pi.sendMessage`, `display: false`, and `{ deliverAs: "nextTurn" }`. It stays hidden from human display and does not start a turn immediately. DSH's `completion-evidence` calls `agent.inject` at `agent/turn-stopping`, so the advisory reaches the model. The other adapters record the advisory through their runtime's log and/or stderr channel. All adapters remain advisory-only and never block a turn.

- **Channel:** Pi model context on the next turn. DSH `agent.inject` reaches the model as the turn stops. Other adapters use advisory logs and/or stderr, depending on the runtime.

### Permission Request Policy (Devin only)

**Injects:** an allow/deny decision with reason for a `PermissionRequest` event, composing the same `spec-gate-core`/`dispatch-rule-checks` cores the tool-time hooks already use.

- **Channel:** `[BLOCK]`. Not applicable to Pi/OpenCode/Claude/Cursor/Codex/DSH. Claude's `PermissionRequest` is already covered by its `PreToolUse` deny, Codex fires no permission event, and Pi, OpenCode, Cursor and DSH decide in their tool-call hooks. DSH's `approval/request` carries no tool arguments to judge. See [`../skills/cli-external-orchestration/cli-pi/references/pi-tools.md`](../skills/cli-external-orchestration/cli-pi/references/pi-tools.md) for why this is a confirmed non-gap rather than a missing bridge.

### Session-Start Advisories (worktree/git-hooks/dist-staleness/codex-hooks checks)

**Injects:** nothing into the model on Claude, Cursor, Devin or Codex. The warn-only CLI checks run at session start and write a one-line warning to **stderr only**, always exiting 0. The live-sync scripts also run there and act without touching the model. DSH's `session-start-advisories` collects the warnings and calls `agent.inject` on `agent/created` for a fresh interactive session, so they reach the model.

- **Channel:** `[LOG]`-equivalent on the CLI runtimes. Visible to a human watching the terminal interactively, or in a runtime's own startup log, but never delivered to the assistant. Pi's bridge (`session-start-advisories.ts`) calls `ctx.ui.notify()`, which is a confirmed no-op in print/headless mode, so even the human-terminal visibility disappears for non-interactive dispatches.

### DeepSeek Harness Channels

The `repo-guards` bundle in `.dsh/plugins/repo-guards/` carries the shared cores into DeepSeek Harness (`dsh`) sessions. DSH has no `additionalContext` envelope. A context adapter calls `agent.inject` with a user-role message whose source is `repo-guards`, appends that message to the step at `agent/pre-step` or returns `additionalContexts` on a tool result. Each of these reaches the model. Whether `dsh web` shows them to the operator is not verified in this repo.

A fan-out leaf, marked by the lineage patch, keeps every guard and skips the four adapters marked interactive only.

| Concern | DSH event | Channel |
|---|---|---|
| Skill advisor brief | `agent/pre-step` | Appended `repo-guards` message, interactive only |
| Spec-gate classification | `agent/pre-step` | Appended `repo-guards` message |
| Spec-gate enforcement, dispatch preflight lint, MCP route guard, overlay guard and the sk-git message gate | `tools/pre-execute` | `[BLOCK]`, a `deny` with its reason |
| Task dispatch guard | `tools/pre-execute` | `[LOG]`. Warnings and audits go to the guard's state folder, and the call is never denied |
| Dispatch audit | `tools/post-execute` | `[LOG]` |
| Injection screen, post-edit quality and the sk-git preflight advisory | `tools/post-execute` | `additionalContexts` on the tool result |
| Packet goal slice | `agent/created` | `agent.inject` of the `DSH_SPEC_FOLDER` chat slice |
| Goal surface: `/goal-dsh`, the `dsh_goal` tool, the goal brief and the verify note | `agent/created`, `agent/pre-step`, `agent/turn-stopping` and `agent/status` | `agent.inject`, interactive only |
| Session start context | `agent/created` | `agent.inject` of the session-prime output |
| Session-start advisories, the six warn-only checks | `agent/created` | `agent.inject` of the warnings, interactive only |
| Post-compaction recovery | `session/event` on `compaction/end` | `agent.inject` of the session-prime `compact` output |
| Session stop autosave | `agent/disposed` | `[NONE]`. It runs `session-stop.js`, interactive only |
| Completion evidence | `agent/turn-stopping` | `agent.inject` of the sentinel's advice |
| Decision capture | `tools/result`, `session/event` and `agent/status` | `[LOG]` queue of answers, plus one `agent.inject` reminder at idle while answers wait |

The bundle README, [`../../.dsh/plugins/repo-guards/README.md`](../../.dsh/plugins/repo-guards/README.md), holds each adapter's scope and error policy.

---

## 5. RUNTIME QUICK REFERENCE: HOW TO ACTUALLY SEE THIS

| Runtime | How to inspect injected content |
|---|---|
| **Claude Code** | The raw session transcript is a JSONL file at `~/.claude/projects/<project-slug>/<session-id>.jsonl` and contains every injected `[SYS]` block verbatim, per turn. Grep it directly. `claude --debug` shows hook registration, execution, and input/output JSON live as it happens. |
| **Cursor / Devin** | No known `--debug`/`--verbose` flag for either CLI. Fall back to the shared audit log (`.skilled/logs/cli-dispatch-audit.log`) and each hook's own state files, or re-run the adapter script standalone with a captured stdin payload (the method used throughout this repo's own hook verification work). |
| **Codex** | Same mirror scripts as Claude. Inspect via the same JSONL-transcript method if Codex persists one, otherwise the standalone-replay method above. |
| **OpenCode** | `opencode --log-level DEBUG --print-logs` writes to `~/.local/share/opencode/log/`. `opencode export <sessionID>` exists as an export-to-JSON path, but its exact content shape (whether it includes the assembled `system` array) is not verified in this repo. Treat it as unconfirmed until checked live. |
| **Pi** | The one runtime where `[MSG]`-tagged content (skill-advisor brief, Gate-3 deferral instruction) is visible directly in the normal chat, because the `input`-event transform rewrites the visible prompt itself. `[SYS]`-tagged content (session-start/compact context via `pi.sendMessage`) is not visible even here. |
| **DeepSeek Harness** | `dsh --dump-config` with the dispatch's patches prints the resolved plugin rows, so it shows whether the `repo-guards-lineage-leaf` marker row is present. The session log under `$DSH_HOME/sessions` records each injected notice as a `user/message` whose source is `repo-guards`. An adapter failure reaches the plugin logger as a `repo-guards <adapter>:` warning. |

---

## 6. RELATED

- [`skill-advisor-hook.md`](../skills/system-skill-advisor/hooks/skill-advisor-hook.md): setup, validation, and operator states for the advisor hook this doc's §2 cites.
- [`goal-plugin.md`](./goal/goal-plugin.md): the `/goal` plugin's own injection contract, referenced in §2, not duplicated here.
- [`../../.opencode/plugins/README.md`](../../.opencode/plugins/README.md): full OpenCode plugin inventory and hook-event model this doc's OpenCode column cites.
- [`../../.pi/extensions/README.md`](../../.pi/extensions/README.md): Pi's own extension inventory, including the `session_compact`-untraced caveat this doc's §4 repeats.
- [`../../.claude/hooks/README.md`](../../.claude/hooks/README.md), [`../../.cursor/hooks/README.md`](../../.cursor/hooks/README.md), [`../../.devin/hooks/README.md`](../../.devin/hooks/README.md), [`../../.codex/hooks/README.md`](../../.codex/hooks/README.md): per-runtime discovery mirrors this doc cross-links from.
- [`README.md`](./README.md): why the real cores of `dispatch`, `mcp-route-guard`, `overlay-guard`, `post-edit-quality`, `task-dispatch`, `classifier-injection-screen`, `goal`, `decision-capture` and `session-relaunch` live under `.skilled/hooks/` instead of `.skilled/skills/`, while every skill-owned hook in this doc stays inside its owning skill.
