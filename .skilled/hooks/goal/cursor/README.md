---
title: "Goal (Cursor): sessionStart Injection"
description: "The Cursor sessionStart hook that renders the bound packet goal and the resend reminder into an agent_message, with no mid-session management surface."
trigger_phrases:
  - "cursor goal injection"
  - "sessionstart goal brief"
  - "resend reminder"
version: 1.0.0.0
---

# Goal (Cursor): sessionStart Injection

---

## 1. OVERVIEW

`goal/cursor/` holds the Cursor goal adapter. `goal-inject.mjs` runs on `sessionStart` only. Cursor in this repository has no prompt command that carries a native session identity, so the adapter injects and records the turn but offers no `set`, `bind` or `show` path. The goal is bound on a runtime whose command does carry that identity, and the record is shared through the same core.

The hook reads `session_id`, falls back to `conversation_id` and takes the workspace from `workspace_roots[0]`. It binds a hand-over packet when one was exported, reads the active record and renders the brief. While the operator copy is behind the packet, the reminder names the exact `goal.cjs resent` line for this session. The result is `{ permission: 'allow', agent_message }`. Model visibility for this field is recorded evidence, not a proven end-to-end guarantee.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `goal-inject.mjs` | `sessionStart` | Reads the payload, binds a hand-over packet, renders the brief plus the resend reminder and writes `{ permission: "allow", agent_message }`. Records one turn on the bound record. | Fails open to `{ permission: "allow" }` on malformed stdin, a disabled plugin or any core error. An unusable hand-over packet writes one stderr line and the session continues. |
| `goal-cursor.test.mjs` | `node --test` | Spawns the hook as a real process with `OPENCODE_GOAL_STATE_DIR` pointed at a fresh temp directory. Covers injection when active, no output when none or paused, the disabled switch and malformed stdin. | A failed assertion fails the test process with a nonzero status. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime capability matrix and the state layout.
- [`./goal-inject.mjs`](./goal-inject.mjs): the hook itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core it imports for reads, rendering and the hand-over bind.
