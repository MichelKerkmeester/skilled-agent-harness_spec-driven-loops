---
title: Code Graph Freshness Runtime State
description: Stores shared debounce state, freshness logs, scan locks and archived snapshots for automatic code graph refreshes.
trigger_phrases:
  - "code graph freshness state"
  - "incremental scan debounce"
  - "freshness state archive"
version: 1.0.0.1
---

# Code Graph Freshness Runtime State

> Runtime storage for incremental code graph refresh scheduling, shared by the `mk-code-graph-freshness.js` OpenCode plugin and a Claude Code hook.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-code-graph-freshness.js`](../../plugins/mk-code-graph-freshness.js) OpenCode plugin. The plugin observes successful mutating tool calls, tracks edited source files by session, debounces edit bursts and dispatches a warm-only incremental graph scan when the existing graph and daemon are ready. This state lets separate edit events contribute to one bounded refresh decision without blocking the edit that produced them.

A Claude Code `PostToolUse` hook, [`code-graph-freshness.cjs`](../system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs), is the second owner of this folder. Its registration in [`.claude/settings.json`](../../../.claude/settings.json) runs it after `Write` and `Edit` calls. Both runtime adapters call the same [`freshness-core.cjs`](../system-code-graph/runtime/lib/code-graph/freshness-core.cjs), so they use one state directory, one debounce format, one freshness log and one scan lock.

Raw runtime data is git-ignored. The folder and this `README.md` are tracked while the runtime data inside remains ignored, so external readers can understand the storage contract without receiving local session data.

---

## 2. RESPONSIBILITIES

The OpenCode plugin is a transport adapter over the runtime-neutral core. It correlates a mutating tool call with its file path, evaluates the edit after the tool finishes and owns an in-memory timer for the trailing edge of an edit burst. It also starts the detached scan process and keeps the shared scan lock until that child exits or reports an error.

The Claude Code hook reads the `PostToolUse` payload from standard input, accepts only `Write` and `Edit` events and passes the file path, session ID and project directory to the same core. The hook is a short-lived process, so it cannot hold an in-memory trailing-edge timer. When the core returns a scan decision, the hook starts the same detached warm-only scan. It releases the scan lock synchronously because its process exits immediately and cannot retain the lock for the child lifetime.

The shared core owns the behavior that must remain identical across runtimes:

- It classifies whether an edited path can affect the configured structural index scope.
- It reads graph readiness and the daemon owner heartbeat before permitting a scan.
- It persists per-session debounce state with an atomic temporary-file rename.
- It prevents overlapping dispatches with the shared scan lock.
- It returns transport-free decisions and a fixed CLI dispatch specification.
- It redacts, bounds and rotates freshness log entries.
- It archives inactive state and prunes expired runtime artifacts.
- It fails open, which means freshness errors skip or defer a scan instead of blocking the original edit.

---

## 3. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.json` | Formatted JSON object | Stores a `pending` array of edited file paths plus `firstPendingAt` and `lastEditAt` timestamps. |
| `freshness.log` | Plain-text log | Stores timestamped, redacted freshness decisions, warnings and audit details. |
| `freshness.log.1` | Plain-text log | Stores the previous rotated freshness-log generation. |
| `.scan.lock` | Two-line text file | Stores the scan owner's process ID and acquisition timestamp while an adapter coordinates a detached scan. |
| `.archive/<session-id-hex>.json` | Formatted JSON object | Stores stale debounce snapshots using the same shape as an active state file. |
| `.sweep.lock/` | Temporary lock directory | Prevents concurrent cleanup passes. |

The core encodes each session ID as hexadecimal for the JSON filename. It deduplicates pending paths, retains the most recent paths when the configured cap is exceeded and writes debounce state atomically through a temporary JSON file and rename.

---

## 4. REFRESH LIFECYCLE

1. A runtime adapter receives a completed file mutation and sends the path to `evaluateEdit()`.
2. The core skips known non-source extensions, always-excluded directories and OpenCode-owned directories that the index scope has not enabled.
3. The core reads `.code-graph-readiness.json`. A missing readiness file or an empty graph defers automatic refresh unless bootstrap behavior is explicitly enabled.
4. The core merges the path into the session state. It waits for the quiet period or the maximum wait before moving to scan eligibility.
5. The core reads `.code-graph-owner.json` and requires a fresh daemon heartbeat. It also checks `.scan.lock` to avoid dispatching while another scan is in flight.
6. An eligible decision clears the pending set and returns a dispatch for `code_graph_scan` with `{"incremental":true}` and `--warm-only`.
7. The adapter starts [`code-index.cjs`](../../bin/code-index.cjs) as a detached process with ignored standard streams. The warm-only flag remains a backstop if daemon readiness changes between the heartbeat probe and process start.

The OpenCode plugin arms a real timer after each qualifying edit. When the burst becomes quiet, the timer calls `drainPending()` for that session. On `session.created`, the plugin also sweeps stale state and drains pending edits left by an earlier process. On disposal, it clears its in-memory timers.

The Claude hook evaluates one event per process. It can reach the quiet or maximum-wait threshold when a later edit invokes it, but it does not keep a timer after the hook exits. The persisted session file keeps pending work available to the shared policy and to later drains.

---

## 5. SETTINGS

| Setting | Default | Purpose |
|---|---|---|
| `MK_CODE_GRAPH_FRESHNESS_QUIET_MS` | `4000` | Sets the debounce quiet period. |
| `MK_CODE_GRAPH_FRESHNESS_MAX_WAIT_MS` | `20000` | Limits how long pending edits can wait. |
| `MK_CODE_GRAPH_FRESHNESS_MAX_PENDING` | `200` | Caps the retained pending file paths per session. |
| `MK_CODE_GRAPH_FRESHNESS_LOCK_TTL_MS` | `30000` | Defines how long an existing scan lock counts as active. |
| `MK_CODE_GRAPH_FRESHNESS_HEARTBEAT_TTL_MS` | `60000` | Supplies the daemon heartbeat fallback TTL when the owner marker has no positive `ttlMs`. |
| `MK_CODE_GRAPH_FRESHNESS_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive debounce state moves into `.archive/`. |
| `MK_CODE_GRAPH_FRESHNESS_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and freshness-log retention. |
| `MK_CODE_GRAPH_FRESHNESS_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_CODE_GRAPH_FRESHNESS_LOG_MAX_BYTES` | `262144` bytes | Controls freshness-log rotation. |
| `MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP` | Disabled | Allows the policy to proceed past an empty graph when set to a recognized true value. |
| `MK_CODE_GRAPH_FRESHNESS_DISABLED` | Disabled | Makes both runtime adapters inactive when set to `1`. |

Rotation keeps the active freshness log and one `.1` backup. Cleanup removes stale temporary files, moves inactive session files into `.archive/` and prunes archived files after their retention window. The OpenCode plugin removes its scan lock when the detached child exits or reports an error. The short-lived Claude hook releases its lock immediately after spawning.

---

## 6. RELATED SKILL LOGIC

The [`system-code-graph` skill](../system-code-graph/SKILL.md) owns the structural code index and its readiness rules. Its graph stores AST-derived files, symbols, calls, imports and definitions in SQLite. Read tools check readiness before answering structural questions and return a blocked response instead of silently using a stale, empty or scope-mismatched graph.

This freshness state supports the write side of that contract. After an established graph becomes soft-stale because source files changed, the adapters request a bounded incremental scan against the warm daemon. The scan refreshes the same graph used by the `mk-code-index` MCP tools and the daemon-backed CLI. The freshness path does not cold-start the daemon and does not establish an initial graph by default. Session startup or an operator scan owns initial scope establishment.

The skill exposes structural work through MCP tools such as `code_graph_status`, `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_verify` and `detect_changes`. Hooks and prompt-time integrations use the daemon-backed CLI when they need a non-MCP transport. The freshness adapters use that CLI directly with `--warm-only`, which keeps post-edit maintenance separate from interactive MCP calls while targeting the same daemon and index.

---

## 7. LOGGING AND CLEANUP

The core writes freshness diagnostics to `freshness.log` instead of standard output or standard error. This keeps OpenCode plugin output away from the interactive prompt line and gives both runtime adapters one audit location. Before appending, the core redacts recognized credential patterns and truncates detail beyond its fixed bound.

The OpenCode plugin starts maintenance on `session.created`. A sweep lock prevents concurrent cleanup passes. The sweep interval throttles repeated work, active retention controls archival and archive retention controls pruning plus log expiration. The system keeps one rotated log generation.

---

## 8. RELATED RESOURCES

- [`mk-code-graph-freshness.js`](../../plugins/mk-code-graph-freshness.js) observes OpenCode edits, owns the in-memory debounce timer and dispatches detached scans.
- [`freshness-core.cjs`](../system-code-graph/runtime/lib/code-graph/freshness-core.cjs) defines shared state persistence, scope classification, scan eligibility, logging and cleanup.
- [`code-graph-freshness.cjs`](../system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs) runs as the Claude Code `PostToolUse` adapter and shares this state through the same core module.
- [`.claude/settings.json`](../../../.claude/settings.json) registers the Claude hook for `Write|Edit` events.
- [`system-code-graph`](../system-code-graph/SKILL.md) documents the structural index, readiness contract, MCP surface and daemon-backed CLI workflow.
