---
title: "Vibe Session Lifecycle: Session Start, Turn Start, Turn End and Post Tool Adapters"
description: "The Vibe session_start, pre_agent, post_agent and post_tool adapters. One entry composes the goal slice, the session-prime context, the startup guards and the stale-dist warning. One composes the pending advisory, the compaction context, the advisor brief, the save reminder and the hand-over context. One runs the turn-end completion, ask-surface and hand-over parts. One runs the compaction detector and the hand-over part after a tool call."
trigger_phrases:
  - "vibe session lifecycle"
  - "vibe session start context"
  - "vibe session_start hook"
  - "vibe turn start composer"
  - "vibe turn end composer"
version: 1.3.0.0
---

# Vibe Session Lifecycle: Session Start, Turn Start, Turn End and Post Tool Adapters

---

## 1. OVERVIEW

`.skilled/hooks/session-lifecycle/vibe/` holds the Vibe adapters for the session-lifecycle concern. Each adapter runs at its own event: `session-start.mjs` at `session_start`, `turn-start.mjs` at `pre_agent`, `turn-end.mjs` at `post_agent` and `compaction-post-tool.mjs` at `post_tool`.

`.vibe/hooks.toml` registers each one in its own `[[hooks]]` table. Every command is `node` on a path built from `git rev-parse --show-toplevel`. None of these entries has a fallback clause. `turn-start` and `turn-end` carry `match = "main"` and `timeout = 20.0`. `compaction-post-tool` carries `timeout = 10.0`. The `session_start` entry carries neither a match nor a timeout.

Every adapter reads one JSON payload from stdin before it does anything else. A payload that is not JSON prints nothing and exits 0. Each part inside an adapter sits in its own `try`/`catch`, so a part that throws contributes no text and the other parts still land. The context reaches the session as one `hook_specific_output.additional_context` line. `turn-end.mjs` writes nothing unless a part denies. When a part denies, it prints one deny object.

`session-start.mjs` and `turn-start.mjs` import `isHookEnabled` from `.skilled/hooks/shared/hook-flags.mjs`. The parts `turn-end.mjs` calls import the same resolver. That makes `SYSTEM_HOOKS_DISABLED` the master switch for the parts that call the resolver. Most parts also check their own concern switch, so one part can go quiet while the rest keep working. The session-prime part checks the `session-lifecycle` concern, whose switch is `SYSTEM_SESSION_LIFECYCLE_DISABLED`. The hand-over parts stay off for Vibe until `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED` or `SYSTEM_SESSION_HANDOVER_ENABLED` is set. The compaction detector checks no switch at all.

`compaction-context.mjs` is a module, not a registered entry. `turn-start.mjs` imports `buildCompactionPart` from it and `compaction-post-tool.mjs` imports `buildPostToolPart`. Both reach the same detector, which reads the Vibe journal because Vibe fires no compaction event and runs no `session_start` after an automatic one. That is where the goal slice and the open handoff pointer come back.

---

## 2. DIRECTORY TREE

```text
vibe/
+-- README.md
+-- compaction-context.mjs
+-- compaction-context.test.mjs
+-- compaction-post-tool.mjs
+-- compaction-post-tool.test.mjs
+-- fixtures/    compaction-journal/
+-- session-start.mjs
+-- session-start.test.mjs
+-- turn-end.mjs
+-- turn-end.test.mjs
+-- turn-start.mjs
`-- turn-start.test.mjs
```

`fixtures/compaction-journal/` holds a recorded Vibe journal under `journal/` beside the `meta.json` the reader loads, so the detector tests replay a compaction Vibe wrote.

| File | Responsibility |
|---|---|
| `compaction-context.mjs` | The compaction detector and the body of the `post_tool` part. |
| `compaction-context.test.mjs` | The detector suite, run on a temporary state folder and the recorded journal. |
| `compaction-post-tool.mjs` | The `post_tool` binding. It measures the journal, then runs the detector and the hand-over part. |
| `compaction-post-tool.test.mjs` | The binding suite, driven through the `post_tool` payload on stdin. |
| `fixtures/` | The recorded compaction journal the detector tests replay. |
| `session-start.mjs` | The `session_start` hook. It composes the session-start parts in a fixed order. |
| `session-start.test.mjs` | The session-start suite, with a runner injected for every part that shells out. |
| `turn-end.mjs` | The `post_agent` composer. It runs the completion part, then the ask-surface part, then the hand-over part. It stops at the first deny. |
| `turn-end.test.mjs` | The turn-end suite, run on copies of a recorded `post_agent` journal. |
| `turn-start.mjs` | The `pre_agent` composer. It runs the withdraw step and the text parts in order. |
| `turn-start.test.mjs` | The turn-start suite, driving the composer through stdin and the save nudge through a throwaway queue. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs .skilled/hooks/session-lifecycle/vibe/compaction-post-tool.test.mjs .skilled/hooks/session-lifecycle/vibe/session-start.test.mjs .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs
```

Expected result: every test passes, the summary reads `fail 0` and the exit status is 0.

The session-start suite injects a runner for every part that shells out. The goal part and the spawned hook are covered by the concern's `goal-vibe` suite, which lives under `.skilled/hooks/goal/vibe/`.

---

## 4. RELATED

- [`../README.md`](../README.md): the session-lifecycle concern folder and its per-runtime matrix.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the switch resolver the adapters and parts call.
- [`../../../../.vibe/hooks.toml`](../../../../.vibe/hooks.toml): the registrations and their timeouts.
- [`../../../hooks/session-handover/vibe/handover-parts.mjs`](../../../hooks/session-handover/vibe/handover-parts.mjs): the hand-over parts the adapters call.
- [`../../../hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`](../../../hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs): the part that can deny a turn end.
- [`../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`](../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs): the completion part and the advisory it leaves for the next turn.
- [`../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`](../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs): the advisor part the turn-start composer calls.
- [`../../../hooks/goal/vibe/goal-inject.mjs`](../../../hooks/goal/vibe/goal-inject.mjs): the slice renderer the session-start hook and the detector import.
- [`../../../../.vibe/plugins/repo-guards/session-cleanup.mjs`](../../../../.vibe/plugins/repo-guards/session-cleanup.mjs): the startup guards and the session-end cleanup.
