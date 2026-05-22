---
title: "Implementation Summary: CocoIndex Remove, Cancel, and Index Lifecycle"
description: "Completed state for CocoIndex Remove, Cancel, and Index Lifecycle."
trigger_phrases:
  - "cocoindex-remove-cancel-and-index-lifecycle"
  - "memory leak 6"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/006-cocoindex-remove-cancel-and-index-lifecycle"
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
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/"
    session_dedup:
      fingerprint: "sha256:0606060606060606060606060606060606060606060606060606060606060606"
      session_id: "009-memory-leak-remediation-arc-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cancel identity accepts reqId, indexId, or both; at least one is required."
      - "remove_project keeps its public signature unchanged and delegates async daemon dispatch to a bounded drain path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CocoIndex Remove, Cancel, and Index Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/006-cocoindex-remove-cancel-and-index-lifecycle` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 006 added CocoIndex lifecycle ownership for active index work, targeted cancellation, and background task shutdown.

- Added `mcp_server/cocoindex_code/lifecycle/active_work_registry.py` with `ActiveWorkRegistry`, `ActiveWorkRow`, drain results, remove barriers, stale identity tracking, and bounded remove-project drain helpers.
- Added `mcp_server/cocoindex_code/lifecycle/cancel_protocol.py` with `CancelRequest`, `CancelStatus`, and identity matching by `reqId` or `indexId`.
- Added `mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py` with daemon/MCP task and future ownership, cooperative cancellation, bounded shutdown, `atexit` cleanup, and threadpool shutdown using `cancel_futures=True`.
- Extended daemon protocol/client handling with `index_cancel` request/response structs and `DaemonClient.index_cancel()`.
- Extended `ProjectRegistry._run_index()` to register active work rows, set cancellation events, propagate `asyncio.CancelledError`, and mark rows complete in all exit paths.
- Extended `ProjectRegistry.remove_project(project_root: str)` without changing its signature. It now marks the project as removing, cancels active rows, bounded-awaits drain, logs timeout evidence with PID/`reqId`/`indexId`, then pops the registry and calls `Project.close()`.
- Added MCP `index_cancel` tool and registered MCP/CLI background index work with the daemon task registry.
- Made `cocoindex_code.__init__` lazy-load `server.main` so lightweight lifecycle imports do not require MCP dependencies.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation uses cooperative cancellation only. No process termination or `os.kill` cleanup path was added.

Threading model:
- `ActiveWorkRegistry` protects row and remove-barrier mutation with `threading.RLock` and a condition variable.
- Sync callers use `remove_project_with_drain()` / `await_drain()`.
- Daemon dispatch uses `remove_project_async()` / `async_remove_project_with_drain()` so the event loop remains able to let active index tasks acknowledge cancellation.
- Sync index work receives a `threading.Event`; async index work propagates `asyncio.CancelledError`.

Shutdown model:
- Daemon load-time and explicit index tasks are registered with `daemon_task_registry`.
- MCP and CLI background index futures use a shared `ThreadPoolExecutor`.
- Shutdown cancels registered tasks/futures, bounded-awaits completion, logs task/future exceptions, and shuts down the MCP threadpool with `cancel_futures=True`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `REMOVE_PROJECT_TIMEOUT_SECONDS` defaults to 30 seconds | Gives active indexing a bounded cooperative drain window while preventing indefinite remove hangs. |
| Cancel identity is `reqId` OR `indexId` | Clients can use their own request id or daemon-generated index id; requiring both would make stale/load-time cancellation harder. |
| `remove_project()` keeps its public signature | Preserves the existing API while daemon dispatch uses an async wrapper for event-loop safety. |
| Completed rows are bounded and later remembered as stale identities | Enables `already-complete` and `stale` responses without keeping unbounded active rows. |
| No process termination | Aligns with Phase 005 preserve-unless-owned policy and the Phase 006 scope. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Step 1 plan strict validation | Passed: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/006-cocoindex-remove-cancel-and-index-lifecycle --strict` |
| Step 2 tasks strict validation | Passed: same phase strict validation command after task replacement |
| Targeted lifecycle pytest | Passed: `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache python3 -m pytest tests/lifecycle/ -v` from `.opencode/skills/mcp-coco-index/mcp_server`; 15 passed in 0.08s |
| Python syntax check | Passed: `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache /opt/homebrew/bin/python3.11 -m py_compile $(find mcp_server -name "*.py" \| head -50)` from `.opencode/skills/mcp-coco-index` |
| Ruff on new files | Not run: `python3 -m ruff` and `ruff` are unavailable in this sandbox |
| Mypy on new files | Not run: `python3 -m mypy` and `mypy` are unavailable in this sandbox |
| Existing full pytest sweep | Blocked by environment: `python3 -m pytest tests/ -q` fails during collection because the sandbox Python lacks project dependencies including `cocoindex`, `msgspec`, `numpy`, `mcp`, `typer`, and `httpx`; system `python3` is 3.9 while the package declares Python >=3.11 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Cancellation is cooperative. If the underlying CocoIndex update call does not yield from `handle.watch()`, cancellation is acknowledged at the next watch iteration rather than by terminating work.
2. The daemon now registers load-time, explicit, MCP, and CLI background index work, but other future index producers must opt into the same registry if added later.
3. Full existing pytest coverage could not be run in this sandbox because dependencies are not installed and network install was unavailable.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Suggested commit:

`feat(009/006): cocoindex remove-cancel safety + cancel protocol + daemon task lifecycle`

Changed paths:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/__init__.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/006-cocoindex-remove-cancel-and-index-lifecycle/`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/remediation-map.md`
