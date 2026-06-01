---
title: "CocoIndex Remove Cancel Index Lifecycle"
description: "Remove/close could race active indexing while index operations lacked a cancel surface. Phase 006 shipped a thread-safe ActiveWorkRegistry, a typed cancel protocol, a DaemonTaskRegistry with atexit plus SIGTERM hooks, then wired bounded-drain teardown into remove_project without changing its public signature."
trigger_phrases:
  - "cocoindex remove cancel lifecycle"
  - "active work registry cocoindex"
  - "daemon task registry shutdown"
  - "memory leak remediation phase 006"
  - "remove project cancel index"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

The code-index audit found that `remove_project()` could close resources while active indexing was still running. Index operations lacked a real protocol cancel surface. Background indexing tasks were unowned or weakly reported, making teardown unsafe.

Phase 006 introduced a `lifecycle/` package with three new modules: `ActiveWorkRegistry` for thread-safe per-project tracking of running index rows, `cancel_protocol` for typed `CancelRequest` plus `CancelStatus` cancel identity, `DaemonTaskRegistry` for process-wide background task ownership with bounded shutdown plus `atexit` plus SIGTERM hooks. The existing `remove_project()` was extended to mark the project as removing, cancel active rows, bounded-await drain with a 30-second timeout, log PID plus identity evidence on timeout, then pop the registry and call `Project.close()`. An MCP `index_cancel` tool plus a `DaemonClient.index_cancel()` transport path let clients cancel a specific index request without stopping the whole daemon.

### Added

- `lifecycle/active_work_registry.py` with `ActiveWorkRegistry`, `ActiveWorkRow`, drain results, remove barriers, stale identity tracking, bounded remove-project drain helpers (NEW)
- `lifecycle/cancel_protocol.py` with `CancelRequest`, `CancelStatus`, identity matching by `reqId` or `indexId` (NEW)
- `lifecycle/daemon_task_registry.py` with daemon/MCP task and future ownership, cooperative cancellation, bounded shutdown, `atexit` cleanup, threadpool shutdown using `cancel_futures=True` (NEW)
- `lifecycle/__init__.py` exporting the three lifecycle modules (NEW)
- MCP `index_cancel` tool registered in `server.py`
- `DaemonClient.index_cancel()` transport path in `core/client.py` plus `core/protocol.py`
- Lifecycle test suite under `mcp_server/tests/lifecycle/` covering active-work registry, cancel protocol, remove-project lifecycle (NEW)

### Changed

- `remove_project()` in `core/project.py` extended to mark removing, cancel active rows, bounded-await drain, log timeout evidence, pop registry, call `Project.close()` without altering its public signature
- `daemon.py` wired `DaemonTaskRegistry` into load-time plus queued background index spawn sites
- `server.py` wired `DaemonTaskRegistry` into MCP background index spawn sites plus MCP threadpool shutdown with explicit future cancellation
- `cli.py` added `index_cancel` CLI surface
- `cocoindex_code/__init__.py` made lazy-loading `server.main` so lightweight lifecycle imports do not pull in MCP dependencies

### Fixed

- `remove_project()` could close resources while active index work was still running. Bounded-drain teardown with `ActiveWorkRegistry` eliminates the race.
- Index operations had no cancel surface. The typed `CancelRequest` plus `CancelStatus` protocol gives clients per-request identity-based cancellation.
- Background index tasks were unregistered. `DaemonTaskRegistry` gives load-time, explicit, MCP, CLI index tasks a process-wide owner with visible error reporting.

### Verification

| Check | Result |
|-------|--------|
| Step 1 plan strict validation | Passed. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on the packet folder |
| Step 2 tasks strict validation | Passed. Same strict validation after task replacement |
| Targeted lifecycle pytest | Passed. `python3 -m pytest tests/lifecycle/ -v` from `mcp_server`. 15 passed in 0.08s |
| B5 lifecycle replay | Passed. `python3 -m pytest mcp_server/tests/lifecycle/ -q`. 25 tests passed. Covers queued-index remove cancellation before close. Typed `DaemonClient.index_cancel()` transport covered. |
| Python syntax check | Passed. `python3.11 -m py_compile` on all `mcp_server` Python files |
| Ruff on new files | Not run. `ruff` unavailable in this sandbox |
| Mypy on new files | Not run. `mypy` unavailable in this sandbox |
| Full pytest sweep | Blocked by environment. Sandbox Python 3.9 lacks `cocoindex`, `msgspec`, `numpy`, `mcp`, `typer`, `httpx`. Package requires Python >=3.11 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/cocoindex_code/lifecycle/active_work_registry.py` | Added (NEW) | Thread-safe per-project registry tracking active index rows with `reqId`, `indexId`, status, cancel event |
| `mcp_server/cocoindex_code/lifecycle/cancel_protocol.py` | Added (NEW) | Typed `CancelRequest` plus `CancelStatus` with identity matching by `reqId` or `indexId` |
| `mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py` | Added (NEW) | Process-wide background task registry with bounded shutdown, `atexit`, SIGTERM hooks |
| `mcp_server/cocoindex_code/lifecycle/__init__.py` | Added (NEW) | Package exports for the three lifecycle modules |
| `mcp_server/tests/lifecycle/test_active_work_registry.py` | Added (NEW) | Unit tests for `ActiveWorkRegistry` |
| `mcp_server/tests/lifecycle/test_cancel_protocol.py` | Added (NEW) | Unit tests for cancel protocol identity matching |
| `mcp_server/tests/lifecycle/test_remove_project_lifecycle.py` | Added (NEW) | Integration tests for remove-project drain and cancellation before close |
| `mcp_server/cocoindex_code/core/project.py` | Modified | `remove_project()` extended with bounded-drain teardown and removing flag |
| `mcp_server/cocoindex_code/core/client.py` | Modified | `DaemonClient.index_cancel()` transport method added |
| `mcp_server/cocoindex_code/core/protocol.py` | Modified | `index_cancel` request and response structs added |
| `mcp_server/cocoindex_code/daemon.py` | Modified | `DaemonTaskRegistry` wired to load-time and queued index tasks |
| `mcp_server/cocoindex_code/server.py` | Modified | `index_cancel` MCP tool registered. `DaemonTaskRegistry` wired to MCP index futures and threadpool shutdown |
| `mcp_server/cocoindex_code/cli.py` | Modified | `index_cancel` CLI surface added |
| `mcp_server/cocoindex_code/__init__.py` | Modified | Lazy-load `server.main` to avoid pulling MCP dependencies on lightweight lifecycle imports |

### Follow-Ups

- Cancellation is cooperative. If the underlying CocoIndex update call does not yield from `handle.watch()`, cancellation is acknowledged at the next watch iteration rather than by terminating work in-place.
- Future index producers added to the daemon must opt into `DaemonTaskRegistry` explicitly. The registry does not auto-discover new spawn sites.
- Full existing pytest coverage could not be run in this sandbox. Once a Python 3.11 environment with project dependencies is available, run the full suite to confirm no regressions.
