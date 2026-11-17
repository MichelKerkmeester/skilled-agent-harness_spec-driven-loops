---
title: "Cursor Goal: sessionStart Adapter"
description: "The Cursor sessionStart hook that renders the bound packet goal and the resend reminder into an agent_message, with no mid-session management surface."
trigger_phrases:
  - "cursor goal injection"
  - "sessionstart goal brief"
  - "resend reminder"
version: 1.0.0.0
---

# Cursor Goal: sessionStart Adapter

---

## 1. OVERVIEW

`.skilled/hooks/goal/cursor/` holds the Cursor adapter for the goal concern. It runs at `sessionStart` and returns the session's active goal in an `agent_message`.

`.cursor/hooks.json` registers the adapter under `sessionStart` with a 10-second timeout. The entry runs `node .skilled/hooks/goal/cursor/goal-inject.mjs`. A shell fallback covers a command that fails, with one drift line on stderr and an allow envelope that names the rebuild. Each runtime with an adapter keeps it in a sibling folder. The goal folder README has a row for every runtime.

The adapter reads the JSON payload on stdin first. A payload that is not JSON returns `{ permission: "allow" }` at once. It then checks the goal switch through `isPluginDisabled`, which calls `isHookEnabled` with the `goal` key in `.skilled/hooks/shared/hook-flags.cjs`. `OPENCODE_GOAL_DISABLED` turns this concern off. `SYSTEM_HOOKS_DISABLED` is the master switch.

The workspace comes from `workspace_roots[0]`, with the process working directory as the fallback. The session id comes from `session_id`, with `conversation_id` as the fallback. A session that holds no goal of its own binds the packet named by `SESSION_HANDOVER_GOAL_PACKET`, unless `SESSION_HANDOVER_GOAL` is off. A session running with `AI_SESSION_CHILD=1` never binds. Neither does a packet path that escapes the workspace.

The adapter then reads the session record. A missing record returns `{ permission: "allow" }` with no message. A record that is not `active` returns the same. An active goal renders the brief with the `Cursor` role label, records the turn and appends the resend reminder while the packet slice differs from the last one resent. The reminder names the `goal.cjs resent` command, filled in with this session's own identity and workspace.

Cursor's command surface carries no native session identity, so the Cursor goal command allows the session-free `packet` read and the `packet-log` append. Every management action fails closed with `code=UNSUPPORTED_SESSION_BINDING`.

Every failure ends in an allow. A disabled switch returns `{ permission: "allow" }` with no message. A thrown core error returns the same envelope. The process exits 0 on every path, so the hook never blocks a turn. A hand-over packet that is invalid or fails to bind writes one `[goal] hand-over packet not bound: <reason>` line to stderr, which the session never reads.

---

## 2. DIRECTORY TREE

The folder is flat, so the table names every file beside this README.

| File | Responsibility |
|---|---|
| `goal-inject.mjs` | The `sessionStart` adapter. It reads the payload and binds a hand-over packet. It renders the brief with the resend reminder and records the turn. |
| `goal-cursor.test.mjs` | The `node --test` suite. It spawns the adapter as a real process against a temp state directory. |

`goal-cursor.test.mjs` points `OPENCODE_GOAL_STATE_DIR` at a fresh temp directory, so the suite never touches the real state tree.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/cursor/goal-cursor.test.mjs
```

Expected result: every test passes, with `fail 0` in the summary. The command exits 0.

The suite covers the injected brief, the no-goal and paused cases, the disabled switch, malformed stdin, the hand-over bind and the resend reminder.

---

## 4. RELATED

- [`../README.md`](../README.md): the goal concern, with the runtime coverage table and the state layout.
- [`./goal-inject.mjs`](./goal-inject.mjs): the adapter itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core it calls for reads, rendering, the hand-over bind and the turn record.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the Cursor registration.
- [`../../../../.cursor/commands/goal-cursor.md`](../../../../.cursor/commands/goal-cursor.md): the Cursor command that allows the session-free packet read.
