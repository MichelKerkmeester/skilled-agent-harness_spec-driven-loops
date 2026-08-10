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

Every runtime this repo dispatches to (Claude Code, Cursor, Devin, Codex, OpenCode, Pi) wires the same handful of shared guard cores into its own lifecycle-hook or plugin-hook API. Each core can add text to a session in one of a few distinct ways, and those ways have very different visibility to the human operator. This reference catalogs every injection point by content, not by file, since several files across runtimes point at the same core and inject identical text.

---

## 1. OVERVIEW

### Purpose

Answer, for any hook or plugin in this repo: what does it actually add to the session, on what trigger, and can a human watching the terminal see it without special tooling?

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

**Injects:** `Advisor: {live|stale}; use {skill} {confidence}/{uncertainty} pass.` (or the ambiguous two-skill variant), followed by three fixed directives appended to every brief regardless of the recommendation: the **comment-hygiene HARD BLOCK** reminder, the **model-agnostic governor** directive, and the **proof-over-appearance** directive.

```text
Advisor: stale; use cli-pi 0.95/0.20 pass.
Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code
comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit
gate blocks violations.
Governor: reason about the problem and the person, not yourself; lead with the
result and act rather than narrate...
Proof over appearance: only real command output counts. Encode every requirement
as an objective pass-or-fail check...
```

- **Trigger:** every user prompt submission.
- **Canonical owner:** `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` (`renderAdvisorBrief`, `HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE`) owns the shared directive text used by runtime adapters. The OpenCode plugin bridge (`.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`) is the fallback emitter: it mirrors the same three directives locally and delegates to the canonical renderer when the compiled module is available.
- **Channel per runtime:** Claude Code `[SYS]` (`user-prompt-submit.js` -> `hookSpecificOutput.additionalContext`). Cursor/Devin `[SYS]` (same shim, re-wrapped into each CLI's own envelope). Codex `[SYS]` (mirror of the Claude shim). OpenCode `[SYS]` (`mk-skill-advisor.js` via `experimental.chat.system.transform`). Pi `[MSG]` (`prompt-advisor.ts` forwards the shared context onto the visible prompt via the `input` event's `{action:"transform"}`).
- **Pi-only directive ownership:** `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` owns `PI_SUBAGENT_DISPATCH_DIRECTIVE`, appending the native pi-subagents default and explicit `cli-*` override policy after the forwarded advisor context in the same visible `[MSG]` transform. The Pi adapter is a forwarder, not an owner, of the three shared directives; this Pi-only directive is not emitted by `render.ts` or the OpenCode bridge.
- **See also:** [`skill-advisor-hook.md`](../skills/system-skill-advisor/hooks/skill-advisor-hook.md) for setup and validation. This file only documents the injected content.

### Spec-Gate Gate-3 Question

**Injects:** the A/B/C/D/E spec-folder documentation question, appended to the user's own turn when the shared classifier flags the prompt as a likely mutation.

```text
SPEC FOLDER QUESTION: this turn looks like it will mutate a file. Before any Write/Edit,
pick one:
A) Use an existing spec folder (name it)
B) Create a new spec folder
...
```

- **Trigger:** a user prompt the classifier scores as a probable file mutation, once per session until answered.
- **Owning module:** `system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` (`classifyIntent`).
- **Channel per runtime:** Claude/Cursor/Devin/Codex `[SYS]` (`spec-gate-classify.mjs` -> `additionalContext`). OpenCode `[SYS]` (`mk-spec-gate.js` via `experimental.chat.system.transform`). Pi `[MSG]` (`spec-gate-classify.ts` appends the question onto the visible prompt via the same `input`-transform mechanism as the advisor brief, and the two chain additively, so both appear in the same visibly-modified prompt).

### Spec Memory / Goal / Dist-Freshness Context (OpenCode only)

**Injects:** a deduplicated continuity brief, active-goal guidance, or a stale-dist warning, each bounded and each appended independently.

- **Trigger:** `session.created` (continuity/goal) or before a risky Bash command (dist-freshness).
- **Owning modules:** `mk-spec-memory.js`, `mk-goal.js`, `mk-dist-freshness-guard.js` (see their own entries in [`../plugins/README.md`](../plugins/README.md) §5).
- **Channel:** `[SYS]` only. All three use `experimental.chat.system.transform`, never `chat.message`'s mutable `parts`, so none of this is rendered as a visible chat bubble in OpenCode today (see §5 below for what would make it visible).

### Cross-Runtime Active-Goal Brief (Cursor / Pi)

**Injects:** the passive session-goal steering block, marker- and field-compatible with mk-goal's OpenCode injection but rendered by the runtime-neutral core (`.opencode/hooks/goal/lib/goal-core.cjs` `renderGoalBrief`) with the `goalPrompt` Role line relabeled to the reading runtime. Verbatim shape:

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

- **Trigger per runtime:** Cursor `sessionStart` only (its `beforeSubmitPrompt` never delivers, `stop` never fires); Pi `input` (every turn, operator-visible transform) + `session_start` (restore) + `turn_end` (verify + `recordTurn`).
- **Owning modules:** the shared core `.opencode/hooks/goal/lib/goal-core.cjs` plus the per-runtime adapters under `.opencode/hooks/goal/{cursor,pi}/`. Each read resolves workspace, runtime, and native session id to an opaque per-session state file. The legacy `active-goal.json` is never an injection fallback.
- **Channel per runtime:** Cursor `[SYS]` (`sessionStart` `agent_message`). Pi `[MSG]` — its `input`-event transform appends the block onto the visible prompt, the one runtime where the operator sees the active-goal text themselves (same mechanism as the advisor brief and Gate-3 question, and they chain additively). The `usage:` token count is honestly `n/a` outside OpenCode (turn count is the accounting primitive; `usageSource` is always `turn-count-estimate`).

---

## 3. TOOL-TIME INJECTIONS

Fire around a specific tool call, not the whole turn.

### Spec-Gate Enforcement Denial

**Injects:** nothing proactively, but when it denies a write/edit/bash call, the denial reason is the content the model receives back in place of a successful tool result.

- **Trigger:** a mutating tool call (`bash`/`write`/`edit`) the shared gate evaluates as denied.
- **Owning module:** `spec-gate-core.mjs` (`evaluateMutation`).
- **Channel:** `[BLOCK]` everywhere. Claude/Cursor/Devin/Codex return `hookSpecificOutput.permissionDecision: "deny"` plus `permissionDecisionReason`. Pi's `spec-gate-enforce.ts` returns `{block: true, reason}`. OpenCode's `mk-spec-gate.js` denies via `tool.execute.before`.

### Dispatch Preflight Lint

**Injects:** either a **block** reason (a hard-rule violation) or a **warn-only advisory** (soft finding, call proceeds).

```text
Dispatch blocked by cli-opencode hard-rule(s):
  • [stdin-redirect-required] Ad-hoc `opencode run` MUST close/redirect stdin (</dev/null)...
```

- **Trigger:** a bash tool call matching a known CLI-dispatch shape (`opencode run`, `claude -p`, etc.).
- **Owning module:** `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`, relocated from `cli-external-orchestration/cli-opencode/scripts/lib/` since it has no real dependency on `cli-opencode`'s other content.
- **Channel:** the block path is `[BLOCK]`. The warn-only path is `[SYS]` (`additionalContext`) on Claude/Cursor/Devin/Codex/Pi, or a bounded system-transform append on OpenCode.

### MCP Route Guard

**Injects:** a warning that a native `mcp_*` tool call should have routed through an available Code Mode manual instead.

- **Trigger:** a native (non-Code-Mode) MCP tool call matching a manual Code Mode already covers.
- **Owning module:** `.opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`, relocated from `mcp-code-mode/runtime/lib/`.
- **Channel:** `[SYS]` on Claude/Cursor/Devin/Codex/Pi (`additionalContext`/`reason`). `[LOG]`-only on OpenCode: `mk-mcp-route-guard.js`'s own README entry says explicitly it "writes advisory logs only and never rejects a call," so this is the one guard genuinely invisible to the OpenCode model, not just invisible to the human.

### Dispatch Audit

**Injects:** nothing. Records a completed CLI dispatch (command, runtime, session id, output) to `.opencode/logs/cli-dispatch-audit.log`.

- **Channel:** `[LOG]` on every runtime. This is a pure telemetry hook. It has no `additionalContext` path at all.

### Task Dispatch Guard

**Injects:** an allow/deny decision (with reason on deny) for a subagent/sub-task dispatch.

- **Trigger:** a `run_subagent`/Task-tool dispatch.
- **Owning module:** `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs`, relocated from `system-deep-loop/runtime/lib/deep-loop/`.
- **Channel:** `[BLOCK]` on deny (same envelope shape as spec-gate enforcement). Not wired for Pi (no distinguishable pi-subagent tool name to match on, per phase 008's documented deferral).

### Post-Edit Quality

**Injects:** a plain-text block of quality findings for the file just edited/written (comment-hygiene violations, checker findings).

```text
COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.
These references are unstable and will rot. Replace each with the durable WHY.
Violations in src/foo.ts:
  ...
```

- **Trigger:** a completed `edit`/`write` tool call.
- **Owning module:** `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs`, relocated from `sk-code/sk-code-quality/scripts/lib/`.
- **Channel, read this one carefully:** Claude Code's and Devin's own adapters (`claude-posttooluse.cjs`, `devin/post-edit-quality.cjs`) write this text to **plain stdout and always exit 0**, with no `hookSpecificOutput`/`systemMessage` field at all. Per Claude Code's documented `PostToolUse` contract, exit-0 stdout is "shown in transcript," the debug/verbose transcript view, not the normal conversation the assistant reasons over. **These two adapters' findings likely never reach the assistant's context at all in normal use**, unlike every other `[SYS]`-tagged hook in this document. This is confirmed for Claude Code from its own hook documentation. Devin's exact handling of plain (non-JSON) `PostToolUse` stdout is not independently verified in this repo. Pi's `post-edit-quality.ts` and OpenCode's `mk-post-edit-quality.js` both use their runtime's real context-injection channel instead (`ToolResultEventResult.content` for Pi, `experimental.chat.system.transform` for OpenCode), so only those two are confirmed to reach the model.

---

## 4. SESSION-LIFECYCLE INJECTIONS

Fire on session start, stop, or compaction, not tied to a single turn or tool call.

### Session Start Context

**Injects:** a startup or resume brief: constitutional-memory reminders on cold start, or a cached compaction/resume payload.

- **Trigger:** `session_start` (Pi) / `SessionStart` (Claude/Cursor/Devin/Codex).
- **Owning module:** `system-spec-kit/mcp-server/hooks/claude/session-prime.ts`. Emits **plain text**, not a JSON envelope. Every proxy that wraps it (`emitDevinContext`, Pi's `session-start-context.ts`) constructs the envelope on the way out. `session-prime.js` itself does not.
- **Channel:** `[SYS]` on Claude/Cursor/Devin/Codex (SessionStart context is not rendered as a chat bubble by default). Pi's bridge delivers it via `pi.sendMessage()`, which is confirmed live-visible to the model (a live session's reply referenced content only present in this injected text), but rendered with `display: false`, so it is **not** visible to the human by default either. Pi's `[MSG]` behavior is specific to the `input`-event transform, not every injection path.

### Session Stop / Cleanup

**Injects:** nothing. `session-stop.js` performs autosave and state-cleanup side effects and writes no stdout content at all.

- **Channel:** `[NONE]`.

### Pre-Compact Cache

**Injects:** nothing immediately. `compact-inject.js` computes and caches a recovery payload for the *next* `SessionStart(source=compact)` to inject via Session Start Context above. Its own header comment states this directly: "stdout is NOT injected on PreCompact, we only cache here."

- **Channel:** `[NONE]` at fire time. Becomes `[SYS]` one event later, through Session Start Context.

### Post-Compaction Recovery (Devin/Pi)

**Injects:** a composed recovery block: retained summary, active spec-folder pointer, and a bounded `memory_context(mode=resume)` fallback when no summary exists.

- **Trigger:** `PostCompaction` (Devin) / `session_compact` (Pi). Devin's `PostCompaction` fires *after* compaction with only `session_id` and a possibly-null summary, a materially different contract from Claude's `PreCompact`-then-cached-`SessionStart` chain, per `post-compaction.cjs`'s own header comment.
- **Owning module:** `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs`. Pi's `session-compact-context.ts` is a native port of the same recovery chain, not a proxy.
- **Channel:** `[SYS]` (Devin's `hookSpecificOutput.additionalContext`). Pi via `pi.sendMessage({display: false})`, same invisible-to-human caveat as Session Start Context.

### Completion Evidence Sentinel

**Injects:** nothing into the model context today. `completion-evidence-stop.cjs` and OpenCode's `mk-completion-sentinel.js` both log an advisory finding to a file/stderr when a completion claim looks unsupported by spec evidence, but neither ever sets `systemMessage`/`additionalContext`, by explicit design: "Advisory only for the entire v1 rollout, never `{decision:"block"}`."

- **Channel:** `[LOG]`.

### Permission Request Policy (Devin only)

**Injects:** an allow/deny decision with reason for a `PermissionRequest` event, composing the same `spec-gate-core`/`dispatch-rule-checks` cores the tool-time hooks already use.

- **Channel:** `[BLOCK]`. Not applicable to Pi/OpenCode/Claude/Cursor/Codex. None of them expose a distinct approval-gate event separate from the tool-call-time hooks above. See [`../skills/cli-external-orchestration/cli-pi/references/pi-tools.md`](../skills/cli-external-orchestration/cli-pi/references/pi-tools.md) for why this is a confirmed non-gap rather than a missing bridge.

### Session-Start Advisories (worktree/git-hooks/dist-staleness/codex-hooks checks)

**Injects:** nothing into the model. Four warn-only CLI checks run at session start and write a one-line warning to **stderr only**, always exiting 0.

- **Channel:** `[LOG]`-equivalent. Visible to a human watching the terminal interactively, or in a runtime's own startup log, but never delivered to the assistant. Pi's bridge (`session-start-advisories.ts`) calls `ctx.ui.notify()`, which is a confirmed no-op in print/headless mode, so even the human-terminal visibility disappears for non-interactive dispatches.

---

## 5. RUNTIME QUICK REFERENCE: HOW TO ACTUALLY SEE THIS

| Runtime | How to inspect injected content |
|---|---|
| **Claude Code** | The raw session transcript is a JSONL file at `~/.claude/projects/<project-slug>/<session-id>.jsonl` and contains every injected `[SYS]` block verbatim, per turn. Grep it directly. `claude --debug` shows hook registration, execution, and input/output JSON live as it happens. |
| **Cursor / Devin** | No known `--debug`/`--verbose` flag for either CLI. Fall back to the shared audit log (`.opencode/logs/cli-dispatch-audit.log`) and each hook's own state files, or re-run the adapter script standalone with a captured stdin payload (the method used throughout this repo's own hook verification work). |
| **Codex** | Same mirror scripts as Claude. Inspect via the same JSONL-transcript method if Codex persists one, otherwise the standalone-replay method above. |
| **OpenCode** | `opencode --log-level DEBUG --print-logs` writes to `~/.local/share/opencode/log/`. `opencode export <sessionID>` exists as an export-to-JSON path, but its exact content shape (whether it includes the assembled `system` array) is not verified in this repo. Treat it as unconfirmed until checked live. |
| **Pi** | The one runtime where `[MSG]`-tagged content (skill-advisor brief, Gate-3 question) is visible directly in the normal chat, because the `input`-event transform rewrites the visible prompt itself. `[SYS]`-tagged content (session-start/compact context via `pi.sendMessage`) is not visible even here. |

---

## 6. RELATED

- [`skill-advisor-hook.md`](../skills/system-skill-advisor/hooks/skill-advisor-hook.md): setup, validation, and operator states for the advisor hook this doc's §2 cites.
- [`goal-plugin.md`](./goal/goal-plugin.md): the `/goal` plugin's own injection contract, referenced in §2, not duplicated here.
- [`../plugins/README.md`](../plugins/README.md): full OpenCode plugin inventory and hook-event model this doc's OpenCode column cites.
- [`../../.pi/extensions/README.md`](../../.pi/extensions/README.md): Pi's own extension inventory, including the `session_compact`-untraced caveat this doc's §4 repeats.
- [`../../.claude/hooks/README.md`](../../.claude/hooks/README.md), [`../../.cursor/hooks/README.md`](../../.cursor/hooks/README.md), [`../../.devin/hooks/README.md`](../../.devin/hooks/README.md), [`../../.codex/hooks/README.md`](../../.codex/hooks/README.md): per-runtime discovery mirrors this doc cross-links from.
- [`README.md`](./README.md): why `dispatch`, `mcp-route-guard`, `post-edit-quality`, and `task-dispatch` live outside `.opencode/skills/` while every other hook in this doc stays inside its owning skill.
