---
title: "Tasks: Single-writer / durability cluster (coordinated)"
description: "Implementation task tracker for the coordinated single-writer/durability cluster. Design is complete; implementation is pending the precondition gate + per-finding HEAD re-validation."
trigger_phrases:
  - "single writer durability cluster tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/009-single-writer-durability-cluster"
    last_updated_at: "2026-05-29T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Design captured; implementation tasks enumerated (pending)"
    next_safe_action: "Phase 1 re-validation + precondition gate"
    blockers: ["Family-3 precondition gate on adjacent launcher WIP"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003193"
      session_id: "031-009-tasks"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: Single-writer / durability cluster (coordinated)

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Capture coordinated design (4 families), concurrency-test design (Harness A/B), apply ordering
- [x] T002 Re-validate finding STATES at HEAD (OR-R-01 already O_EXCL; DR-012 = root-exclusion; rest confirmed-open)
- [x] T003 Precondition gate: OR-R-01 already O_EXCL; Family-3 limited to daemon-detect.ts (not the frozen code-graph launcher)
- [x] T004 Per-finding HEAD re-validation by symbol immediately before editing each family

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Family 1 — DR-005 (liveness-bounded respawn-lock staleness) + DR-006 (re-arm listener on launch fail) (model-server-supervision.cjs)
- [x] T006 Family 2 — DR-012 (reap the root pid on idle eviction via the shared authority) (model-server-supervision.cjs)
- [x] T007 Family 4 — DR-011 (confirm-then-delete marker) (vector-index-store.ts)
- [x] T008 Family 4 — DR-020 (staging-shard atomic swap) + DR-001-P1-002 (reindex cancel re-read) (reindex.ts)
- [x] T009 Family 4 — DR-001-P2-001 (direct-startup perimeter guard) + DR-002-P1-001 (tcp loopback/auth) (hf-model-server.cjs)
- [x] T010 Family 3 — DR-016 (honor live childPid) (daemon-detect.ts); OR-R-01 re-validated (already O_EXCL)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Harness A realized as launcher-model-server-single-writer-cluster.vitest.ts + daemon-detect.vitest.ts (single-owner / no-orphan / live-childPid) — pass
- [x] T012 Harness B realized as vector-index-store-durability + reindex-durability-cancel + hf-model-server-perimeter vitest suites — pass
- [x] T013 mcp+shared+scripts build (exit 0) + node --check 2 .cjs + 26 new + 29 regression + 9 leases tests; committed aa6860d835

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All families implemented together (no piecemeal landing)
- [ ] Harness A + B green; builds + node --check pass
- [ ] Landed after the precondition gate; one coordinated, revertable commit

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings source**: ../review/review-report.md
- **Predecessor**: ../008-deep-review-correctness-edges

<!-- /ANCHOR:cross-refs -->
