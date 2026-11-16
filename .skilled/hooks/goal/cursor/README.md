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

`goal-inject.mjs` runs on `sessionStart` only. Cursor registers it in `.cursor/hooks.json` with a 10-second timeout. The runtime mirror `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` holds the same binding under the id `goal-inject`. No other runtime runs this adapter.

The hook reads `session_id`, falls back to `conversation_id` and takes the workspace from `workspace_roots[0]`. It binds a hand-over packet when one was exported, reads the active record and renders the brief. While the operator copy is behind the packet, the reminder names the exact `goal.cjs resent` line for this session. The result is `{ permission: 'allow', agent_message }`.

Cursor has no prompt command that carries a native session identity. The adapter therefore injects and records the turn, and offers no `set`, `bind` or `show` path. A runtime whose command does carry that identity binds the goal, and the record is shared through the same core.

Model visibility for this field is recorded evidence, not a proven end-to-end guarantee.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `goal-inject.mjs` | The `sessionStart` hook. It binds a hand-over packet, renders the brief and the resend reminder, and records the turn. |
| `goal-cursor.test.mjs` | The `node --test` suite. It spawns the hook as a real process against a temp state directory. |

`goal-inject.mjs` writes `{ permission: "allow", agent_message }` with the brief and the reminder. It fails open to `{ permission: "allow" }` on malformed stdin, a disabled plugin or any core error. An unusable hand-over packet writes one stderr line and the session continues.

`goal-cursor.test.mjs` points `OPENCODE_GOAL_STATE_DIR` at a fresh temp directory. It covers injection when active, a bare `{ permission: "allow" }` when no goal is set or the goal is paused, the disabled switch and malformed stdin. A failed assertion fails the test process with a nonzero status.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/cursor/goal-cursor.test.mjs
```

Expected result: every test passes and the process exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the goal concern, with the runtime coverage table and the state layout.
- [`./goal-inject.mjs`](./goal-inject.mjs): the hook itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core it imports for reads, rendering and the hand-over bind.
