---
title: Deep Loop Guard Runtime State
description: Stores per-session dispatch counts, warning logs and archived state for the deep-loop guard.
trigger_phrases:
  - "deep loop guard state"
  - "loop dispatch warnings"
  - "loop guard archive"
version: 1.0.0.0
---

# Deep Loop Guard Runtime State

> Runtime storage for deep-loop dispatch enforcement managed by `mk-deep-loop-guard.js`.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-deep-loop-guard.js`](../../plugins/mk-deep-loop-guard.js) plugin. The plugin reads and writes per-session dispatch counts so it can detect repeated handoffs to command-owned loop executors. It also records warnings and degraded enforcement audits.

Raw runtime data is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving local session data.

---

## 2. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.json` | Formatted JSON object | Stores `sessionId` and a `dispatches` object keyed by target agent. Each target entry contains `count`, `lastCommandDriven` and `lastTimestamp`. |
| `guard-warnings.log` | Plain-text log | Stores timestamped warning and audit lines from `mk-deep-loop-guard`. |
| `guard-warnings.log.1` | Plain-text log | Stores the previous rotated warning-log generation. |
| `.archive/<session-id-hex>.json` | Formatted JSON object | Stores stale per-session guard state using the same shape as an active state file. |
| `.sweep.lock/` | Temporary lock directory | Prevents concurrent cleanup passes across OpenCode processes. |

The plugin encodes each session ID as hexadecimal for the JSON filename. It updates state atomically through a temporary JSON file and rename.

---

## 3. LIFECYCLE

A session-start sweep moves stale active JSON files into `.archive/`, removes expired archive files and maintains the warning log. The sweep uses a temporary directory lock and fails open if state maintenance cannot run.

| Setting | Default | Purpose |
|---|---|---|
| `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive session state moves into `.archive/`. |
| `MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and warning-log retention. |
| `MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES` | `262144` bytes | Controls warning-log rotation. |

Rotation keeps the active warning log and one `.1` backup. Cleanup also removes stale temporary JSON files left by interrupted atomic writes.

---

## 4. RELATED

- [`mk-deep-loop-guard.js`](../../plugins/mk-deep-loop-guard.js) connects OpenCode events to the shared guard.
- [`dispatch-guard.cjs`](../system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs) defines the state shape, logging rules and cleanup lifecycle.
