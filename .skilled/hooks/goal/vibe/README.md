---
title: "Vibe Goal: Session Start, Pre-Agent and Post-Tool Adapters"
description: "Vibe adapter that injects a bound packet's chat slice at session start and restores it after a compaction for the goal concern."
trigger_phrases:
  - "vibe goal injection"
  - "vibe packet slice"
  - "vibe session start goal"
version: 1.0.0.0
---

# Vibe Goal: Session Start, Pre-Agent and Post-Tool Adapters

---

## 1. OVERVIEW

`.skilled/hooks/goal/vibe/` holds the Vibe adapter for the goal concern. `goal-inject.mjs` exports `renderVibeGoalSlice`, which reads a packet and returns its chat slice. The function writes nothing.

Vibe registers no entry for this file in `.vibe/hooks.toml`. The file registers the hooks that import it. Its `session-start` entry runs at `type = "session_start"`. Its `turn-start` entry runs at `type = "pre_agent"` with `match = "main"` and `timeout = 20.0`. Its `compaction-post-tool` entry runs at `type = "post_tool"` with `timeout = 10.0`. The session-start composer puts the slice in `hook_specific_output.additional_context`. After a compaction, the detector restores it under the heading `Context restored after a compaction.`

The adapter reads `VIBE_SPEC_FOLDER` from the environment first. When that value is blank it reads `SESSION_HANDOVER_GOAL_PACKET`, the packet a hand-over claim exported. Each name must hold a non-blank string to count.

The concern key is `goal`. The adapter checks no switch of its own. It calls `describePacketGoal` in `../lib/goal-core.cjs`, which asks `isHookEnabled('goal')` in `.skilled/hooks/shared/hook-flags.cjs`. `OPENCODE_GOAL_DISABLED` turns the concern off, and `SYSTEM_HOOKS_DISABLED` is the master switch. Every failure ends as an empty string. If the concern is disabled, or the packet cannot be read, the adapter returns `''`. The session-start composer drops that part and still prints the rest of its context. With nothing to say, the hook prints nothing and exits 0.

---

## 2. DIRECTORY TREE

The folder is flat. It holds two files beside this README.

| File | Responsibility |
|---|---|
| `goal-inject.mjs` | The adapter. `renderVibeGoalSlice` resolves the packet path, calls `describePacketGoal` and returns `chatSlice`, or an empty string. |
| `goal-vibe.test.mjs` | The `node --test` suite. It drives the session-start hook with a fixture packet and checks the named packet, the hand-over fallback, which packet wins, the no-packet case and malformed input. |

---

## 3. VALIDATION

Run the adapter's test from the repository root.

```bash
node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs
```

Expected result: every test passes, the run prints `fail 0` and the exit status is 0.

---

## 4. RELATED

- [Goal concern](../README.md): the folder this adapter belongs to, with its runtime table and its switch table.
- [Goal core](../lib/goal-core.cjs): the session-free packet reader the adapter calls. Its `describePacketGoal` returns the chat slice that `.skilled/hooks/goal/lib/goal-slice.cjs` builds.
- [Goal CLI](../bin/goal.cjs): the `packet` action, which reports the same slice as `chat_slice`.
- [Session-start composer](../../session-lifecycle/vibe/session-start.mjs): the hook that puts the slice in its context.
- [Compaction detector](../../session-lifecycle/vibe/compaction-context.mjs): the hook part that restores the slice after a compaction.
- [Vibe hooks file](../../../../.vibe/hooks.toml): the entries that run those hooks.
- [Shared hook flags](../../shared/hook-flags.cjs): the resolver that answers the goal switch.
