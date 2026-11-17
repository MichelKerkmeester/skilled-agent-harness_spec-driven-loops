---
title: "Devin Goal: SessionStart and UserPromptSubmit Adapters"
description: "The Devin goal adapter that renders the bound packet goal and the resend reminder as additionalContext on session start and on each submitted prompt."
trigger_phrases:
  - "devin goal injection"
  - "userpromptsubmit goal brief"
  - "additional context envelope"
version: 1.0.0.0
---

# Devin Goal: SessionStart and UserPromptSubmit Adapters

---

## 1. OVERVIEW

`.skilled/hooks/goal/devin/` holds the Devin adapter for the goal concern. The concern key is `goal` and its switch is `OPENCODE_GOAL_DISABLED`. The adapter runs at `SessionStart` and at `UserPromptSubmit`. It adds the session's active goal to the turn as `additionalContext`. One file serves both events. The reads, the rendering, the hand-over bind and the turn record come from `.skilled/hooks/goal/lib/goal-core.cjs`.

`.devin/hooks.v1.json` registers the adapter under `SessionStart` and under `UserPromptSubmit`. Both entries hold an empty matcher and a 10-second timeout. Both run `node .skilled/hooks/goal/devin/goal-inject.mjs` inside `bash -c`, which changes to `${DEVIN_PROJECT_DIR:-$PWD}` first. A `||` fallback covers a node command that exits nonzero. It prints one `mk-hook-drift` line on stderr and returns an envelope that names the rebuild command for the spec-kit runtime package.

The adapter reads the JSON payload on stdin first. Text that is not JSON returns `{}` at once. It then checks the goal switch through `isPluginDisabled`, which calls `isHookEnabled` with the `goal` key in `.skilled/hooks/shared/hook-flags.cjs`. `SYSTEM_HOOKS_DISABLED` is the master switch and turns every repository hook off.

The workspace comes from `cwd` in the payload. When the payload gives no `cwd`, it comes from `DEVIN_PROJECT_DIR`. A blank value falls back to the process working directory. The session id comes from `session_id`. A session that holds no goal of its own binds the packet named by `SESSION_HANDOVER_GOAL_PACKET`, unless `SESSION_HANDOVER_GOAL` is off. A session running with `AI_SESSION_CHILD=1` never binds. Neither does a packet path that escapes the workspace. Devin has no command folder in this repository, so the hook is its only goal surface. It binds the handed-over packet itself, because the payload carries `session_id`. The record is shared through the same core.

The adapter then reads the session record. A missing record returns `{}`. A record that is not `active` returns `{}`. An active goal renders the brief with the `Devin` role label, records the turn and appends the resend reminder while the durable slice differs from the one last resent. The reminder names the `goal.cjs resent` command, filled in with this session's identity and workspace. The envelope holds `hookSpecificOutput.hookEventName` and `hookSpecificOutput.additionalContext`. The event name is the one the payload carries, with `UserPromptSubmit` as the default.

Every failure ends in `{}` on stdout and exit status 0. A disabled switch and a thrown core error end the same way, so the hook never blocks a turn. A hand-over packet that is invalid or fails to bind writes one `[goal] hand-over packet not bound: <reason>` line to stderr, which the session never reads.

---

## 2. DIRECTORY TREE

The folder is flat, so the table names every file beside this README.

| File | Responsibility |
|---|---|
| `goal-inject.mjs` | The adapter for both events. It reads the payload, binds a hand-over packet, renders the brief and the reminder, records the turn and writes the envelope. |
| `goal-devin.test.mjs` | The `node --test` suite. It spawns the adapter as a real process against a temp state directory and a temp workspace. |

The suite points `OPENCODE_GOAL_STATE_DIR` at a fresh temp directory, so it never touches the real state tree.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/devin/goal-devin.test.mjs
```

Expected result: every test passes with `fail 0` in the summary. The command exits 0.

The suite covers the brief and the event name it keeps, the resend reminder until a resend is recorded, the empty object for a missing goal, a paused goal, the disabled switch and malformed stdin. It also covers the hand-over bind on a first turn and a later turn that keeps the bound record. A child session binds nothing. One case checks the hand-over switch, an empty packet variable, a missing packet and a packet path that escapes the workspace.

---

## 4. RELATED

- [the goal concern](../README.md): the runtime coverage table and the state layout.
- [the adapter](./goal-inject.mjs): the file itself.
- [the goal core](../lib/goal-core.cjs): the reads, the rendering, the hand-over bind and the turn record.
- [the shared stdin reader](../../shared/hook-adapter-shared.cjs): `readStdin` and the byte limit it applies.
- [the goal command](../bin/goal.cjs): the `resent` action the reminder names.
- [the Devin registration](../../../../.devin/hooks.v1.json): the two event entries for this adapter.
