---
title: "Tasks: Investigation P2 Cleanup Sweep"
description: "Task ledger for 68 P2 cleanup findings across embedder module surfaces."
trigger_phrases:
  - "arc 010 003 005 tasks"
  - "embedder p2 cleanup tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "completed-task-ledger"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0100030050100030050100030050100030050100030050100030050100030050"
      session_id: "010-003-005-p2-cleanup"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Investigation P2 Cleanup Sweep

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read sibling 010/003/001 canonical-anchor packet.
- [x] T002 Read 010/001 findings registry for all requested F-IDs.
- [x] T003 [P] Read full source files before editing.
- [x] T004 Scaffold 005 packet docs and pass strict validation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Batch 1 reindex cleanup and deferral classification.
- [x] T006 Batch 2 sidecar-client cleanup and deferral classification.
- [x] T007 Batch 3 ensure-rerank-sidecar cleanup and deferral classification.
- [x] T008 Batch 4 execution-router cleanup and deferral classification.
- [x] T009 Batch 5 sidecar-worker cleanup and deferral classification.
- [x] T010 Batch 6 barrel/schema cleanup and deferral classification.
- [x] T011 Preserve behavior by deferring runtime-policy/security/public-shape changes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run embedder vitest regression; rerun passed after one random-id flake.
- [x] T013 Run CJS launcher vitest through installed binary/config path.
- [x] T014 Run MCP server typecheck.
- [x] T015 Update checklist, decision record, and implementation summary.
- [x] T016 Run final strict spec validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual classification and regression verification complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Decision Record**: See `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
