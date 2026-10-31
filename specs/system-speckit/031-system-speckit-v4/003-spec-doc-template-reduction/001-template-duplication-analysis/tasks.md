---
title: "Tasks: Phase 1: analysis"
description: "Map the research-backed template-reduction recommendations to concrete requirements, contract surfaces, and child-phase gates."
trigger_phrases:
  - "analysis tasks"
  - "template reduction requirements"
  - "recommendation mapping"
  - "spec-kit contract"
importance_tier: "important"
contextType: "general"
---
# Tasks: Phase 1: analysis

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

**Task Format**: `T### [P?] Description (file path); done when ...`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [REQ-001] Map R1 to checklist and decision-record deduplication evidence (`001-analysis/research/research.md`); done when the child scope preserves byte identity and the shared ADR body.
- [ ] T002 [REQ-002] Map R2 to guidance sidecars and marker preservation (`001-analysis/research/research.md`); done when the scope names removable instructional comments, retained markers, and the snapshot gate.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [REQ-003] Map R3 to the merged document and all reader surfaces (`001-analysis/spec.md`); done when the scope includes level gates, anchors, priority tags, AC coverage, and the legacy checklist read path.
- [ ] T004 [REQ-004] Map R4 to validator-first continuity consolidation (`001-analysis/research/research.md`); done when the scope identifies implementation-summary as canonical and names validator and fleet compatibility gates.
- [ ] T005 [REQ-005] Map R5 to research taxonomy neutralization or deferral (`001-analysis/research/research.md`); done when the scope preserves the research_finding anchor contract and states the coupling decision.
- [ ] T006 [REQ-006] Map R6 to measured rendered-byte budgets (`001-analysis/spec.md`); done when the three baselines and integer upper limits are carried into an additive verification task.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 [REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006] Cross-check the recommendation matrix (`001-analysis/spec.md`); done when every requirement has one concrete scope, one dependency path, and one objective gate.
- [ ] T008 [REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006] Confirm the ordered child-phase handoff (`001-analysis/research/research.md`); done when R1, R6, R2, R3, R4, then R5 is recorded with no phantom requirement ids or unresolved blocking assumptions.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every REQ-001 through REQ-006 is mapped to a task with a done-condition
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Research**: See `research/research.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
