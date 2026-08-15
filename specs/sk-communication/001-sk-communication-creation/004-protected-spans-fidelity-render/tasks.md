---
title: "Tasks: Phase 004 Protected Spans, Fidelity, and Render"
description: "Implementation task breakdown for protect non-negotiable content, validate rewritten candidates deterministically, and choose a safe presentation mode."
trigger_phrases:
  - "protected-spans-fidelity-render"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/004-protected-spans-fidelity-render"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Completed the implementation and all code, performance, privacy and packaging checks."
    next_safe_action: "Use handover.md to begin Phase 005 after owner approval."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The project owner approved the Phase 004 architecture and implementation."
      - "All Phase 004 tasks have observed evidence and the final gates pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 004 Protected Spans, Fidelity, and Render

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

- [x] T001 Confirm 003-core-normalization-and-assembly handoff evidence and capture the baseline (`spec.md`, `plan.md`) [evidence: Phase 003 handover plus `npm run check`, 12 files and 47 tests]
- [x] T002 Freeze public contracts, invariants, and independent test-matrix axes (`spec.md`, `plan.md`) [evidence: producer and consumer inventory plus the failing five-export negative control]
- [x] T003 [P] Create the proposed Phase 004 package surfaces and focused test harness (`spec.md`, `plan.md`) [evidence: `src/fidelity/`, `src/render/`, and four focused test files]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Pin the dialect and implement collision-safe bijection. (packages/cli-communication-projection/src/fidelity/) [evidence: `ProtectedMarkdownDialect`, immutable span table and 128-case generated corpus]
- [x] T005 [P] Implement deterministic vetoes and capability-aware render decisions (`packages/cli-communication-projection/src/fidelity/`, `src/render/`) [evidence: named structural, semantic, CAS and capability tests]
- [x] T006 Implement typed validator failure, cancellation, timeout, reject-only judge, and exact-original fallback behavior (`packages/cli-communication-projection/src/fidelity/`, `src/render/`) [evidence: outage, timeout, cancellation, exception and malformed-input tests]
- [x] T007 Emit content-free validation and render reason events through the shared evidence boundary (`packages/cli-communication-projection/src/render/`) [evidence: schema-valid telemetry and raw-content canary tests]
- [x] T008 [P] Implement bijection, corruption, render-decision, exact-fallback, and negative-control tests (`packages/cli-communication-projection/test/fidelity/`) [evidence: 4 files and 23 tests pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`) [evidence: `implementation-summary.md` records producers, consumers and unchanged canonical-state boundary]
- [x] T010 Run focused negative controls and boundary tests (`checklist.md`) [evidence: focused suite passes 23/23 and benchmark p95 is 24.83 ms]
- [x] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`) [evidence: `npm run check` passes 70/70 and strict Phase 004 validation reports 0 errors and 0 warnings]
- [x] T012 Reconcile checklist, implementation summary, metadata, and 005-provider-adapters-and-privacy handoff (`checklist.md`) [evidence: `handover.md`, parent phase map and generated metadata identify Phase 005 as next]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] No blocked task remains without an owner-approved disposition.
- [x] Focused tests, the authoritative workspace gate, and recursive strict validation pass.
- [x] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [x] Parent and successor handoff metadata agree with the final state. [evidence: parent map marks Phase 004 complete and Phase 005 records the incoming handover]
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
