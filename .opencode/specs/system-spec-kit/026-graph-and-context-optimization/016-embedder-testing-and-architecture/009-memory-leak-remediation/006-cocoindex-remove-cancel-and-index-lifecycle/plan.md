---
title: "Plan: CocoIndex Remove, Cancel, and Index Lifecycle"
description: "Implementation plan for CocoIndex Remove, Cancel, and Index Lifecycle."
trigger_phrases:
  - "cocoindex-remove-cancel-and-index-lifecycle"
  - "memory leak 6"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle"
    last_updated_at: "2026-05-22T13:31:36Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-006-cocoindex-lifecycle"
    next_safe_action: "start-007-code-graph-launcher"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0606060606060606060606060606060606060606060606060606060606060606"
      session_id: "009-memory-leak-remediation-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cancel identity uses reqId, daemon indexId, or both; at least one is required."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: CocoIndex Remove, Cancel, and Index Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python, asyncio, threading, MCP server, CocoIndex daemon |
| **Framework** | CocoIndex Code daemon/client protocol plus Spec Kit phase validation |
| **Storage** | In-memory lifecycle registries plus existing project registry/index files |
| **Testing** | Targeted pytest lifecycle fixtures, Python syntax checks, strict spec validation |

### Overview
Phase 006 fixes CocoIndex lifecycle correctness before any memory-relief claim. The design adds explicit active index work tracking, a typed cancel identity, bounded remove-project quiescence, and daemon/MCP background task ownership. It aligns with Phase 005's preservation rule: cleanup may only act on resources with exact identity and must never terminate unrelated processes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Remediation map items #7, #8, and #9 are the only implementation scope.
- [x] Source findings F-005, F-010, F-017, F-018, F-019, F-020, F-021, F-022, and F-026 are mapped to this phase.
- [x] Phase 005 process-sweep policy is preserved: exact identity is required before any cleanup action.

### Definition of Done
- [x] REQ-001: `remove_project()` blocks new index entries, cancels active work, bounded-awaits drain, then pops registry state and calls `Project.close()`.
- [x] REQ-002: clients can cancel a specific index request without stopping the daemon.
- [x] SC-001 fixtures pass: remove-during-index, load-time cancel, stale cancel identity, threadpool shutdown, post-remove search/index usability.
- [x] SC-002 docs are updated with implementation evidence and next-phase handoff.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cooperative cancellation with exact request identity and bounded quiescence before resource teardown.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `lifecycle/active_work_registry.py` | Thread-safe per-project active index registry keyed by project key, storing `{reqId, indexId, startedAt, status, cancel_event}` rows. |
| `lifecycle/cancel_protocol.py` | `CancelRequest` dataclass, status enum, and row-matching helper. |
| `lifecycle/daemon_task_registry.py` | Process-wide ownership for daemon and MCP background tasks, shutdown cancellation, bounded await, and error surfacing. |
| `ProjectRegistry.remove_project()` | Sets removing flag, cancels and drains active work, times out safely, then pops registry and calls `Project.close()`. |
| MCP/daemon cancel surface | Accepts `{reqId: str | None, indexId: str | None}` and returns `cancelled`, `already-complete`, `stale`, `not-found`, or `remove-in-progress`. |

### Per-Project Active-Work Registry

Rows are kept in memory and keyed by project key. Each row records `reqId`, optional daemon `indexId`, `startedAt`, `status`, a `threading.Event` for sync cancellation, and the owning project key. Registry mutation uses `threading.RLock`.

Lifecycle:
1. `add(row)` rejects new rows when the project is marked removing.
2. `cancel(CancelRequest)` marks matching running rows as `cancelling` and sets their cancel event.
3. `mark_complete()` transitions rows to `complete`.
4. `await_drain(project_key, timeout_seconds)` waits until no running/cancelling rows remain or the timeout expires.
5. `clear_project(project_key)` removes completed or force-removed rows after registry teardown.

### `remove_project(key)` Contract

Before tearing down a project:
1. Set the project's removing flag to block new index entries.
2. Iterate active-work rows for this key and call cancel for each row.
3. Bounded-await up to `REMOVE_PROJECT_TIMEOUT_SECONDS` for in-flight work to complete or acknowledge cancel.
4. On timeout, log evidence with PID, `reqId`, and `indexId`; mark the drain result as force-removed but do not terminate threads or processes.
5. Only after the bounded wait, pop the project registry entry and call `Project.close()`.

The default timeout is `REMOVE_PROJECT_TIMEOUT_SECONDS=30.0`, overridable by environment variable for tests and operator tuning.

### Cancel Request Identity

`CancelRequest = { reqId: str | None, indexId: str | None }`; at least one field must be set. Matching succeeds if either supplied identity matches the active row. The cancel response status is:

| Status | Meaning |
|--------|---------|
| `cancelled` | A running row was moved to cancelling and its cancellation event was set. |
| `already-complete` | The matching row exists but has already completed. |
| `stale` | The identity refers to a completed row retained only for stale-cancel reporting. |
| `not-found` | No active or recently completed row matches. |
| `remove-in-progress` | The project is already in its remove barrier and no new cancel ownership can be established. |

### Daemon Task Registry and MCP Threadpool Shutdown

Every daemon background task is registered with a process-wide `daemon_task_registry`, including load-time index work and queued index work. Shutdown hooks run through both `atexit.register` and the daemon SIGTERM path:
1. Mark registry shutdown in progress.
2. Cancel each registered task or future.
3. Bounded-await completion.
4. Log errors and incomplete rows without killing processes.

For `concurrent.futures.ThreadPoolExecutor`, shutdown uses `cancel_futures=True` where available and explicitly cancels registered futures before `shutdown(wait=True)`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Project registry, index dispatch, daemon shutdown | Wire remove barrier, active-work rows, cancel request handler, and shutdown drain. | Lifecycle pytest fixtures. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py` | Client/daemon message schema | Add cancel request/response structs without removing existing messages. | Protocol tests and lifecycle tests. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py` | Daemon client methods | Add cancel method while preserving existing public API. | Client/protocol tests. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | MCP tool surface and background index task spawn | Add `index_cancel`, register background tasks, and surface errors. | MCP lifecycle fixture. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | CLI background index spawn | Register background index tasks. | Syntax and lifecycle tests. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/` | New fixture surface | Add targeted tests for SC-001. | `python3 -m pytest mcp_server/tests/lifecycle/ -v`. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Documentation Lock
- [x] Replace generic `plan.md` with the active-work/cancel/shutdown design.
- [x] Replace generic `tasks.md` with file-scoped implementation tasks.
- [x] Strict-validate the phase docs before runtime edits.

### Phase 2: Lifecycle Modules
- [x] Add `active_work_registry.py`, `cancel_protocol.py`, and `daemon_task_registry.py`.
- [x] Keep modules thread-safe and additive to public behavior.
- [x] Unit-test registry and cancel protocol behavior directly.

### Phase 3: Daemon, Client, and MCP Wiring
- [x] Extend `remove_project()` without changing its signature.
- [x] Add daemon/client cancel request handling.
- [x] Register daemon and MCP background tasks and ensure shutdown drains them.

### Phase 4: Verification and Handoff
- [x] Run targeted lifecycle pytest.
- [x] Run syntax/build checks and optional new-file mypy/ruff if available.
- [x] Update implementation summary, parent remediation evidence, and commit handoff.
- [x] Strict-validate both the phase folder and parent arc.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test | Scope | Expected Evidence |
|------|-------|-------------------|
| `test_active_work_registry.py` | add, cancel, await drain, timeout, concurrent-add-during-drain | Remove barrier blocks new work and drain is bounded. |
| `test_cancel_protocol.py` | validity, reqId match, indexId match, stale/not-found | Cancel identity is precise and typed. |
| `test_remove_project_lifecycle.py` | SC-001 fixtures | Remove cannot close under active explicit/load-time/queued index work; post-remove reuse works. |
| Python syntax check | First 50 MCP server Python files and new lifecycle modules | No syntax errors. |
| Strict spec validation | Phase folder and parent arc | Docs remain valid for continuation. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 process-sweep policy | Internal implementation evidence | Available | Cleanup must preserve unless exact identity is owned. |
| CocoIndex daemon/project registry | Runtime code | Available | Remove/cancel wiring depends on current registry shape. |
| Existing protocol structs | Runtime code | Available | Cancel additions must be backward-compatible. |
| Existing pytest layout | Test harness | Available | New lifecycle tests should run without network access. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Lifecycle tests fail, remove-project blocks indefinitely, cancel identity breaks existing protocol compatibility, or shutdown handling masks background errors.
- **Procedure**: Revert Phase 006 changes in `.opencode/skills/mcp-coco-index/` and this phase's docs, preserve failing pytest output in `handover.md`, and restore the prior daemon remove behavior before rerunning strict validation.
- **Safety Boundary**: Rollback and implementation never use `os.kill` or terminate processes. Any incomplete active work is surfaced through logs and test evidence only.
<!-- /ANCHOR:rollback -->
