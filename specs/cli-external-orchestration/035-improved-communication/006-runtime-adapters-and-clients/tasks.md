---
title: "Tasks: Phase 006 Runtime Adapters and Clients"
description: "Implementation task breakdown for integrate the projection core with six clis through their safest supported event and presentation boundaries."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Phase 006 task breakdown."
    next_safe_action: "Obtain project-owner approval, then start T001 after the Phase 005 handoff is confirmed."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 006 Runtime Adapters and Clients

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

- [ ] T001 Confirm 005-provider-adapters-and-privacy handoff evidence and capture the baseline (`spec.md`, `plan.md`)
- [ ] T002 Freeze runtime, version, presentation-tier, degradation, and independent test-matrix contracts (`spec.md`, `plan.md`)
- [ ] T003 [P] Create the proposed Phase 006 package surfaces and focused test harness (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T004 Implement adapter contract and shared conformance harness. (packages/cli-communication-projection/src/runtimes/)
- [ ] T005 [P] Implement six runtime mappings, full-projection clients, and safe-native append, sidecar, or original-only paths (`packages/cli-communication-projection/src/runtimes/`, `src/clients/`)
- [ ] T006 Implement typed incompatibility, failure, cancellation, timeout, disconnect, tier-downgrade, and exact-original outcomes (`packages/cli-communication-projection/src/runtimes/`, `src/clients/`)
- [ ] T007 Emit content-free runtime, capability, presentation-tier, and degradation reason events (`packages/cli-communication-projection/src/runtimes/`, `src/clients/`)
- [ ] T008 [P] Run pinned fixture replay, atomic-render proof, disconnect, cancellation, tier-downgrade, and degraded-mode smoke tests (`packages/cli-communication-projection/test/runtimes/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`)
- [ ] T010 Run focused negative controls and boundary tests (`checklist.md`)
- [ ] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`)
- [ ] T012 Reconcile checklist, implementation summary, metadata, and 007-evaluation-and-observability handoff (`checklist.md`)
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
