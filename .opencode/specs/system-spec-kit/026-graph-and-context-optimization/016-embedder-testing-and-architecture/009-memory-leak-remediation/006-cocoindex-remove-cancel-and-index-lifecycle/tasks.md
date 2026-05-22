---
title: "Tasks: CocoIndex Remove, Cancel, and Index Lifecycle"
description: "Task list for CocoIndex Remove, Cancel, and Index Lifecycle."
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
      - "Phase work is limited to CocoIndex lifecycle modules, daemon/client/server wiring, tests, and phase evidence docs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CocoIndex Remove, Cancel, and Index Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Replace generic `plan.md` with active-work registry, cancel protocol, remove barrier, daemon task registry, and threadpool shutdown design. (`plan.md`)
- [x] T002 Replace generic `tasks.md` with file-scoped execution tasks. (`tasks.md`)
- [x] T003 Read existing CocoIndex source layout before adding lifecycle modules. (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`)
- [x] T004 Confirm current pytest/build invocation. (`.opencode/skills/mcp-coco-index/pyproject.toml`, pytest config)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Add `ActiveWorkRegistry`, `ActiveWorkRow`, `DrainResult`, and a process-wide singleton. (`mcp_server/cocoindex_code/lifecycle/active_work_registry.py`)
- [x] T006 [P] Add `CancelRequest`, `CancelStatus`, response helpers, and active-row identity matching. (`mcp_server/cocoindex_code/lifecycle/cancel_protocol.py`)
- [x] T007 [P] Add `DaemonTaskRegistry`, singleton registry, bounded shutdown drain, atexit hook, and SIGTERM hook helper. (`mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py`)
- [x] T008 Add package exports for lifecycle modules. (`mcp_server/cocoindex_code/lifecycle/__init__.py`)

### Runtime Wiring

- [x] T009 Extend existing `remove_project()` to set removing flag, cancel active rows, await drain, log timeout evidence, pop registry, and call `Project.close()` without changing its signature. (`mcp_server/cocoindex_code/daemon.py`)
- [x] T010 Add cancel protocol request/response structs while preserving existing protocol messages. (`mcp_server/cocoindex_code/core/protocol.py`)
- [x] T011 Add daemon client `index_cancel`/cancel method. (`mcp_server/cocoindex_code/core/client.py`)
- [x] T012 Add daemon request handler for cancel identities and typed statuses. (`mcp_server/cocoindex_code/daemon.py`)
- [x] T013 Add MCP `index_cancel` tool surface if a tool registry exists. (`mcp_server/cocoindex_code/server.py`)
- [x] T014 Wire `DaemonTaskRegistry` into daemon load-time and queued background index spawn sites. (`mcp_server/cocoindex_code/daemon.py`)
- [x] T015 Wire `DaemonTaskRegistry` into MCP/CLI background index spawn sites and visible error handling. (`mcp_server/cocoindex_code/server.py`, `mcp_server/cocoindex_code/cli.py`)
- [x] T016 Ensure MCP threadpool shutdown uses explicit future cancellation and `cancel_futures=True` where available. (`mcp_server/cocoindex_code/server.py` or existing threadpool owner)

- [x] T017 [P] Add pytest coverage for active-work add/cancel/await/timeout/concurrent-add-during-drain. (`mcp_server/tests/lifecycle/test_active_work_registry.py`)
- [x] T018 [P] Add pytest coverage for `CancelRequest` validity, reqId match, indexId match, stale, and not-found. (`mcp_server/tests/lifecycle/test_cancel_protocol.py`)
- [x] T019 Add pytest coverage for remove-during-index, load-time cancel, stale cancel identity, threadpool shutdown, and post-remove search/index usability. (`mcp_server/tests/lifecycle/test_remove_project_lifecycle.py`)
- [x] T020 Run targeted pytest for lifecycle tests and record the actual command/output summary. (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run Python syntax validation against the MCP server files and new lifecycle modules.
- [x] T022 Run mypy/ruff on the new lifecycle package if available; document missing tools or existing baselines.
- [x] T023 Fill `implementation-summary.md` with completed metadata, decisions, verification evidence, limitations, continuity frontmatter, and `## Commit Handoff`.
- [x] T024 Update parent remediation map or parent implementation evidence for Phase 006 completion.
- [x] T025 Strict-validate the Phase 006 folder.
- [x] T026 Strict-validate the parent arc folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001: `remove_project()` cannot close project resources under active explicit, load-time, or queued index work.
- [x] REQ-002: Clients can cancel a specific index request without whole-daemon stop.
- [x] SC-001 fixtures pass as real tests.
- [x] SC-002 parent evidence is updated.
- [x] No process termination calls are added.
- [x] `remove_project(project_root: str)` signature is unchanged.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: ../spec.md
- **Remediation map items**: #7, #8, #9 in `../001-research-synthesis-and-remediation-map/research/remediation-map.md`
- **Source packet 024 findings**: F-005, F-010, F-017, F-018, F-019, F-020, F-021, F-022, F-026
- **Phase 005 policy**: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`
<!-- /ANCHOR:cross-refs -->
