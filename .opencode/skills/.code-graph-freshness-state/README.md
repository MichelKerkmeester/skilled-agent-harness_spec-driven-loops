---
title: Code Graph Freshness Runtime State
description: Stores debounce state, freshness logs, scan locks and archived snapshots for code graph refreshes.
trigger_phrases:
  - "code graph freshness state"
  - "incremental scan debounce"
  - "freshness state archive"
version: 1.0.0.0
---

# Code Graph Freshness Runtime State

> Runtime storage for incremental code graph refresh scheduling, shared by the `mk-code-graph-freshness.js` OpenCode plugin and a Claude Code hook.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-code-graph-freshness.js`](../../plugins/mk-code-graph-freshness.js) plugin. The plugin tracks edited source files by session, debounces edit bursts and dispatches a warm-only incremental graph scan when the existing graph and daemon are ready.

A Claude Code `PostToolUse` hook, [`code-graph-freshness.cjs`](../system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs), shares this folder. It calls the same `freshness-core.cjs` module, so the OpenCode plugin and the Claude Code hook both append the debounce state, the freshness log and the scan lock here.

Raw runtime data is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving local session data.

---

## 2. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.json` | Formatted JSON object | Stores a `pending` array of edited file paths plus `firstPendingAt` and `lastEditAt` timestamps. |
| `freshness.log` | Plain-text log | Stores timestamped, redacted freshness decisions, warnings and audit details. |
| `freshness.log.1` | Plain-text log | Stores the previous rotated freshness-log generation. |
| `.scan.lock` | Two-line text file | Stores the scan owner's process ID and acquisition timestamp while a detached scan runs. |
| `.archive/<session-id-hex>.json` | Formatted JSON object | Stores stale debounce snapshots using the same shape as an active state file. |
| `.sweep.lock/` | Temporary lock directory | Prevents concurrent cleanup passes. |

The plugin encodes each session ID as hexadecimal for the JSON filename. It writes debounce state atomically through a temporary JSON file and rename.

---

## 3. LIFECYCLE

Each qualifying edit updates its session's pending file list. After the configured quiet period, the plugin drains pending work and may start one warm-only incremental scan. A maximum wait prevents continuous edits from postponing the scan indefinitely.

A session-start sweep moves stale debounce files into `.archive/`, removes expired archive files and maintains the freshness log.

| Setting | Default | Purpose |
|---|---|---|
| `MK_CODE_GRAPH_FRESHNESS_QUIET_MS` | `4000` | Sets the debounce quiet period. |
| `MK_CODE_GRAPH_FRESHNESS_MAX_WAIT_MS` | `20000` | Limits how long pending edits can wait. |
| `MK_CODE_GRAPH_FRESHNESS_MAX_PENDING` | `200` | Caps the retained pending file paths. |
| `MK_CODE_GRAPH_FRESHNESS_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive debounce state moves into `.archive/`. |
| `MK_CODE_GRAPH_FRESHNESS_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and freshness-log retention. |
| `MK_CODE_GRAPH_FRESHNESS_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_CODE_GRAPH_FRESHNESS_LOG_MAX_BYTES` | `262144` bytes | Controls freshness-log rotation. |
| `MK_CODE_GRAPH_FRESHNESS_DISABLED` | Disabled | Makes the freshness system inactive when set to `1`. |

Rotation keeps the active freshness log and one `.1` backup. The scan lock is removed when the detached scan exits or reports an error.

---

## 4. RELATED

- [`mk-code-graph-freshness.js`](../../plugins/mk-code-graph-freshness.js) observes OpenCode edits and owns the in-memory debounce timer.
- [`freshness-core.cjs`](../system-code-graph/runtime/lib/code-graph/freshness-core.cjs) defines state persistence, scan eligibility, logging and cleanup.
- [`code-graph-freshness.cjs`](../system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs) runs as a Claude Code `PostToolUse` hook and shares this state through the same core module.
