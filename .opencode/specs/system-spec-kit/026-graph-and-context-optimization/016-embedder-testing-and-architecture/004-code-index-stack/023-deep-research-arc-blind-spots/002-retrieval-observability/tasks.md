---
title: "Tasks: 023C Retrieval Observability"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval observability tasks"
  - "diagnostic counters tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed packet tasks"
    next_safe_action: "Review checklist evidence"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_observability.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_fingerprint.py"
    session_dedup:
      fingerprint: "sha256:023c000000000000000000000000000000000000000000000000000000000002"
      session_id: "023-deep-research-arc-blind-spots/002-retrieval-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 023C Retrieval Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read the nine listed source files.
- [x] T002 Read existing observability, daemon, reranker, and test patterns.
- [x] T003 [P] Confirm pre-bound 023C spec packet.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add diagnostics and fingerprint carriers in `observability.py`.
- [x] T005 Add additive payload structs in `protocol.py`.
- [x] T006 Instrument query-stage counters in `query.py`.
- [x] T007 Record fallback reasons in `reranker.py` and `rerankers_jina_v3.py`.
- [x] T008 Persist and compare fingerprints through `daemon.py` and `indexer.py`.
- [x] T009 Surface diagnostics/fingerprints through `server.py` and `cli.py`.
- [x] T010 Add tests for observability, fingerprints, and pytest-cov tooling.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run targeted new tests.
- [x] T012 Run full pytest suite.
- [x] T013 Run ruff.
- [x] T014 Run coverage report command.
- [x] T015 Write packet docs and strict-validate.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
