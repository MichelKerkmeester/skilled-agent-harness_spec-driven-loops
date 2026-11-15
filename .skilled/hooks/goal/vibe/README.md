---
title: "Goal (Vibe): Session-Start Packet Slice"
description: "The Vibe goal adapter: renderVibeGoalSlice reads the packet named by VIBE_SPEC_FOLDER and returns the exact chat_slice that goal.cjs packet prints, for the one session_start hook to inject."
trigger_phrases:
  - "vibe goal injection"
  - "vibe packet slice"
  - "vibe session start goal"
version: 1.0.0.0
---

# Goal (Vibe): Session-Start Packet Slice

---

## 1. OVERVIEW

`goal/vibe/` holds the Vibe goal adapter. `goal-inject.mjs` exports `renderVibeGoalSlice`. It reads the packet path from `VIBE_SPEC_FOLDER` and returns exactly the `chat_slice` that `node .skilled/hooks/goal/bin/goal.cjs packet <folder>` prints. A session started from a manual handover claim has no `VIBE_SPEC_FOLDER`, so the adapter then reads `SESSION_HANDOVER_GOAL_PACKET`, the packet `skilled-loop` exported from the claimed note. An operator-named `VIBE_SPEC_FOLDER` always wins. Neither variable means no goal text.

The adapter has no hook entry of its own. `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` imports it and puts the returned text in the one `session_start` reply, so the goal arrives in the first turn without a second registration.

Vibe is injection-only. There is no goal object, no `/goal` command and no goal tool. Nothing refreshes the slice per turn, and nothing re-injects it after compaction, because Vibe has no idle or compaction event. `session_start` fires for a main session, not a subagent.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `goal-inject.mjs` | `session_start`, through the session-start hook | Reads `VIBE_SPEC_FOLDER`, or `SESSION_HANDOVER_GOAL_PACKET` when that is unset, resolves the packet slice and returns the same `chat_slice` text `goal.cjs packet` prints. Returns no text when both are unset, empty or unusable. | Returns no goal text. The session-start hook still emits the rest of its context. |
| `goal-vibe.test.mjs` | `node --test` | Covers a bound packet, a handover-claimed packet, a named packet winning over a claimed one, no packet and malformed input. | A failed assertion fails the test process with a nonzero status. |

Run the test with `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs`.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime capability matrix and the state layout.
- [`./goal-inject.mjs`](./goal-inject.mjs): the slice renderer.
- [`../bin/goal.cjs`](../bin/goal.cjs): the `packet` action whose `chat_slice` this adapter matches.
- [`../../session-lifecycle/vibe/session-start.mjs`](../../session-lifecycle/vibe/session-start.mjs): the hook that imports the adapter.
- [`../../../../.vibe/hooks.toml`](../../../../.vibe/hooks.toml): the one `session_start` entry.
