---
title: Goal Runtime State
description: Stores session goal state, continuation decisions and archived goal snapshots for the mk-goal plugin.
trigger_phrases:
  - "goal runtime state"
  - "active session goals"
  - "goal state archive"
version: 1.0.0.0
---

# Goal Runtime State

> Runtime storage for active and archived session goals managed by `mk-goal.js`.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-goal.js`](../../plugins/mk-goal.js) plugin. The plugin reads and writes goal records for each OpenCode session, records continuation decisions and archives inactive goals.

Raw runtime data is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving local session data.

---

## 2. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.json` | Formatted JSON object | Stores one session goal. Fields include `sessionId`, `goalId`, `objective`, `goalPrompt`, `promptEnhancement`, `status`, budget and usage counters, timestamps, continuation state and verifier results. |
| `.continuation.log` | JSON Lines | Records continuation decisions with `ts`, `sid`, `goalId`, `decision`, `reason` and `autoTurnsUsed`. |
| `.goal-events.log` | JSON Lines | Records debug and persistence events when goal debugging is enabled. |
| `.continuation.log.<timestamp>-<uuid>` | JSON Lines | Rotated continuation-log segment. |
| `.goal-events.log.<timestamp>-<uuid>` | JSON Lines | Rotated debug-log segment. |
| `.archive/<session-id-hex>.json` | Formatted JSON object | Stores a past goal snapshot using the same shape as an active goal file. |

The plugin encodes each session ID as hexadecimal for the JSON filename. It writes goal files atomically through temporary files before renaming them into place.

---

## 3. LIFECYCLE

The plugin archives an active goal when its session is deleted. A periodic sweep also archives active state that has remained untouched beyond the active retention period.

| Setting | Default | Purpose |
|---|---|---|
| `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive goal files move into `.archive/`. |
| `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and log retention. |
| `MK_GOAL_STATE_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_GOAL_JSONL_MAX_BYTES` | `5242880` bytes | Controls when owned JSON Lines logs rotate. |
| `MK_GOAL_DEBUG` | Disabled | Enables `.goal-events.log` records and debug diagnostics. |

The plugin prunes expired archive files and old log segments. It retains one active log plus timestamped rotated segments.

---

## 4. RELATED

- [`mk-goal.js`](../../plugins/mk-goal.js) reads, writes, archives and cleans this state.
- [Skills directory](../) contains the runtime systems that use this storage.
