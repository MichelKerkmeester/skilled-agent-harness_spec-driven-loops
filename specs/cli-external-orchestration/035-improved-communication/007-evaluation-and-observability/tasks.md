---
title: "Tasks: Phase 007 Evaluation and Observability"
description: "Implementation task breakdown for measure whether output feels 1:1 with the reference while proving fidelity, latency, cost, privacy, and operational behavior."
trigger_phrases:
  - "evaluation-and-observability"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/007-evaluation-and-observability"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Repaired the Phase 007 task sequence around pre-registration and powered evaluation."
    next_safe_action: "Obtain project-owner approval, then start T001 after the Phase 006 handoff is confirmed."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 007 Evaluation and Observability

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Confirm 006-runtime-adapters-and-clients handoff evidence and capture the baseline (`spec.md`, `plan.md`)
- [ ] T002 Freeze public contracts, invariants, and independent test-matrix axes (`spec.md`, `plan.md`)
- [ ] T003 [P] Create the Phase 007 evaluation, observability-aggregation, and focused-test surfaces (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T004 Build the versioned corpus, reference/original baselines, three-sample variance pilot, and reproducible run manifest. (packages/cli-communication-projection/src/evaluation/)
- [ ] T005 Freeze release-critical strata, the powered sample plan, reviewer assignment, randomization, per-dimension margins, and stop rules before candidate scoring. (packages/cli-communication-projection/src/evaluation/)
- [ ] T006 Implement deterministic fidelity vetoes, masked review packets, confidence intervals, and per-dimension non-inferiority decisions. (packages/cli-communication-projection/src/evaluation/)
- [ ] T007 Implement aggregation and export over earlier lifecycle events using rotating keyed digests and content-free allowlists. (packages/cli-communication-projection/src/observability/)
- [ ] T008 [P] Test pilot/release separation, statistical decisions, presentation-tier stratification, identity masking, sample-cap failure, and redaction canaries. (packages/cli-communication-projection/test/evaluation/)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`)
- [ ] T010 Run focused negative controls and boundary tests (`checklist.md`)
- [ ] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`)
- [ ] T012 Reconcile checklist, implementation summary, metadata, and 008-packaging-and-release-hardening handoff (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and checklist blockers have observed evidence.
- [ ] No blocked task remains without an owner-approved disposition.
- [ ] Focused tests, the authoritative workspace gate, and recursive strict validation pass.
- [ ] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [ ] Parent and successor handoff metadata agree with the final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Research basis**: `../001-research-strategy/research/research.md`
<!-- /ANCHOR:cross-refs -->
