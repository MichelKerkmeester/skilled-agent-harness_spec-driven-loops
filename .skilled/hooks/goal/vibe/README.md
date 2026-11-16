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

`.skilled/hooks/goal/vibe/` holds the Vibe goal adapter for the packet slice. `goal-inject.mjs` exports `renderVibeGoalSlice`, which reads the packet path from `VIBE_SPEC_FOLDER`. It returns exactly the `chat_slice` that `node .skilled/hooks/goal/bin/goal.cjs packet <folder>` prints.

A session started from a manual hand-over claim has no `VIBE_SPEC_FOLDER`. The adapter then reads `SESSION_HANDOVER_GOAL_PACKET`, the packet `skilled-loop` exported from the claimed note. An operator-named `VIBE_SPEC_FOLDER` always wins, and neither variable means no goal text.

The adapter has no hook entry of its own in `.vibe/hooks.toml`. `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` imports it and puts the returned text in the one `session_start` reply. The goal arrives in the first turn without a second registration. `session_start` fires for a main session, not a subagent.

Vibe is injection-only, with no goal object, no `/goal` command and no goal tool. Nothing refreshes the slice on every turn. The turn-start hook adds it back only after a compaction.

Vibe has no compaction hook, so the compaction detector reads the session journal to spot a compaction and then renders the slice again from the packet. `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` imports the adapter too, and re-injects the slice once per compaction. It compares the journal's compaction entries with a per-session watermark. `turn-start.mjs` and `compaction-post-tool.mjs` run it at the next message or tool call.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `goal-inject.mjs` | Exports `renderVibeGoalSlice`. Reads `VIBE_SPEC_FOLDER`, or `SESSION_HANDOVER_GOAL_PACKET` when that is unset, resolves the packet through `../lib/goal-core.cjs` and returns its `chat_slice`. |
| `goal-vibe.test.mjs` | Runs the `node --test` cases: a bound packet, a hand-over-claimed packet, a named packet winning over a claimed one, no packet and malformed input. |

`renderVibeGoalSlice` takes an optional environment, workspace and goal core, each with a default. The defaults are `process.env`, `process.cwd()` and the goal core at `../lib/goal-core.cjs`. A blank or non-string `VIBE_SPEC_FOLDER` returns an empty string, never an error. So does a packet whose `chat_slice` is missing, and so does any thrown error. The session-start hook skips a failing part and still emits the rest of its context.

The test builds a fixture packet under `.skilled/skills/.state`, which is gitignored. It runs `goal.cjs packet` and compares the hook's `hook_specific_output.additional_context` with the core's `chatSlice`. The test sets `SYSTEM_SESSION_LIFECYCLE_DISABLED`, `SYSTEM_DIST_FRESHNESS_DISABLED` and `SYSTEM_SESSION_CLEANUP_DISABLED` to `1` for every run. Only the goal part contributes, so a stray warning cannot mask the slice.

---

## 3. VALIDATION

Run the suite from the repository root with `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` and read the exit status.

Expected result: every case passes and the exit status is `0`. A failed assertion fails the test process with a nonzero status.

---

## 4. RELATED

- [`../README.md`](../README.md): the goal concern index, with the per-runtime capability matrix and the state layout.
- [`./goal-inject.mjs`](./goal-inject.mjs): the slice renderer that the session-start and compaction hooks import.
- [`../bin/goal.cjs`](../bin/goal.cjs): the `packet` action whose `chat_slice` this adapter reproduces exactly.
- [`../../session-lifecycle/vibe/session-start.mjs`](../../session-lifecycle/vibe/session-start.mjs): the hook that imports the adapter and injects the slice.
- [`../../session-lifecycle/vibe/compaction-context.mjs`](../../session-lifecycle/vibe/compaction-context.mjs): the detector that re-injects the slice after a compaction.
- [`../../../../.vibe/hooks.toml`](../../../../.vibe/hooks.toml): the one `session_start` entry, which runs that hook at session start.
