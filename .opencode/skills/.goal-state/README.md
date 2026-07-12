---
title: Goal Runtime State
description: Stores session goal state, continuation decisions and archived goal snapshots for the mk-goal plugin.
trigger_phrases:
  - "goal runtime state"
  - "active session goals"
  - "goal state archive"
version: 1.0.0.1
---

# Goal Runtime State

> Runtime storage for active and archived session goals managed by `mk-goal.js`.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-goal.js`](../../plugins/mk-goal.js) plugin. The plugin reads and writes goal records for each OpenCode session, records continuation decisions and archives inactive goals.

The state gives an OpenCode session a durable completion objective across turns. The plugin can reload the objective for each system-prompt transform, update usage and verifier evidence from lifecycle events and decide whether an idle session should continue. Keeping this information in a session-keyed file lets the plugin preserve goal progress without placing runtime state in command markdown, spec documents or a shared memory database.

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

The plugin encodes each session ID as hexadecimal for the JSON filename. It serializes mutations for each session and writes goal files atomically through temporary files before renaming them into place. The active file therefore remains the single plugin-owned record for that session.

---

## 3. PLUGIN WORKFLOW

The [`/goal` command](../../commands/goal_opencode.md) is a state-free router. It sends `set`, `clear`, `complete`, `pause`, `resume`, `history`, `doctor` and `health` actions to the plugin's `mk_goal` tool. Empty arguments and `show` use `mk_goal_status`. The command does not read or edit this folder directly because plugin tool context supplies the current session ID.

When a caller sets a goal, the plugin sanitizes the objective, creates a model-facing `goalPrompt` and stores prompt-enhancement metadata with the new active record. Setting the same active or paused objective refreshes the record. Setting a different objective, or reusing an objective from a terminal state, replaces it with a fresh goal record. Optional token budgets remain part of the per-session state.

For every chat system transform, the plugin reads the current session record and appends one bounded `[active_goal:<goal-id>]` block when the goal is active. The block carries the objective, generated goal prompt, latest verifier result, usage counters and a continuation directive. Paused, blocked, limited and complete goals do not produce this active-goal block.

The plugin's event hook keeps the record current during the session:

| Event or action | State effect |
|---|---|
| `session.created` | Restores an active goal when one exists and may sweep stale active files. |
| `message.updated` and `message.part.updated` | Record available usage and assistant evidence for the current goal. |
| `permission.asked` and `question.asked` | Mark the session as blocked by a prompt so continuation does not bypass required input. |
| `permission.replied`, `question.replied` and `question.rejected` | Clear the persisted prompt-blocked flag. |
| `session.idle` | Runs the completion verifier, applies a compare-safe result and evaluates guarded continuation. |
| `session.deleted` | Clears volatile locks and moves the session goal file into `.archive/`. |

The idle verifier marks a verified goal complete, marks a blocked verdict as blocked or leaves a not-met goal available for further work. Guarded continuation is disabled unless `MK_GOAL_AUTONOMY` selects `active` or `smoke`. Before sending another prompt, the plugin checks the active status, verifier result, prompt blockers, session status, cooldown, auto-turn cap, wall-clock cap and token budget. It records non-quiet decisions in `.continuation.log` whether the result is suppression, a smoke-mode `would_fire` decision or a sent continuation.

---

## 4. STATE LIFECYCLE

### 4.1 GOAL SET

`mk_goal` creates the active JSON file for the tool context's session. A new record starts with `active` status, zeroed usage and continuation counters, timestamps, verifier fields and a generated goal prompt. Later mutations increment the stored revision and update the record through the same per-session write queue.

### 4.2 GOAL UPDATED

Tool actions can refresh, replace, pause, resume, complete or clear the current goal. Lifecycle events can add usage, evidence, blocker state, verifier results and continuation state. `clear` deletes the active file immediately. `complete` keeps the record with terminal status, while `pause` keeps it available for a valid `resume` transition.

### 4.3 GOAL ARCHIVED

The plugin archives an active goal when its session is deleted. A periodic sweep also archives active state that has remained untouched beyond the active retention period.

Archive records use the same normalized goal shape as active records. The `history` action reads `.archive/`, skips invalid entries and returns valid records in newest-file-first order. Archive pruning and log pruning use the archive retention window, so this folder is bounded runtime storage rather than permanent project history.

---

## 5. RETENTION AND DIAGNOSTICS

| Setting | Default | Purpose |
|---|---|---|
| `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive goal files move into `.archive/`. |
| `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and log retention. |
| `MK_GOAL_STATE_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_GOAL_JSONL_MAX_BYTES` | `5242880` bytes | Controls when owned JSON Lines logs rotate. |
| `MK_GOAL_DEBUG` | Disabled | Enables `.goal-events.log` records and debug diagnostics. |

The plugin prunes expired archive files and old log segments. It retains one active log plus timestamped rotated segments.

The `doctor` and `health` actions inspect active and archived file counts, owned log sizes, the last sweep time and stale active-file candidates. `MK_GOAL_DEBUG=1` enables bounded `.goal-events.log` entries and debug diagnostics. The plugin otherwise keeps that debug log inactive.

---

## 6. SYSTEM BOUNDARIES

`mk-goal.js` is a standalone local OpenCode plugin. It is not a Spec Kit Memory MCP tool and does not use a daemon-backed plugin bridge. The plugin owns its file store, event hook, system transform and tools directly.

The goal block participates in OpenCode's runtime system-injection layer, but it does not replace repository instructions, Spec Kit gates or saved continuity. A goal objective steers the current session. Spec documents and memory records remain separate persistence surfaces and require their own workflows.

Other skills can invoke the plugin tools through the command surface, but they do not own these files. The plugin remains the only writer, while `mk_goal_status`, `history`, `doctor` and `health` provide supported read paths for operators and workflows.

---

## 7. RELATED

- [`mk-goal.js`](../../plugins/mk-goal.js) reads, writes, archives and cleans this state.
- [`/goal` command](../../commands/goal_opencode.md) routes user actions to the plugin tools without handling state.
- [OpenCode Goal Plugin Contract](../system-spec-kit/references/hooks/goal_plugin.md) documents the operator contract, environment controls and verification surfaces.
- [System Spec Kit](../system-spec-kit/) documents the wider runtime-injection and continuity system while keeping goal state outside Spec Kit Memory.
