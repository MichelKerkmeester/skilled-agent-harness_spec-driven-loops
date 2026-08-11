---
title: "Tasks: Phase 003 Core Normalization and Assembly"
description: "Implementation task breakdown for build the runtime-neutral core that normalizes events and assembles one deterministic message without changing canonical state."
trigger_phrases:
  - "core-normalization-and-assembly"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/003-core-normalization-and-assembly"
    last_updated_at: "2026-08-11T17:06:26Z"
    last_updated_by: "codex"
    recent_action: "Completed all Phase 003 implementation and verification tasks."
    next_safe_action: "Begin Phase 004 from the completed handover."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "All twelve tasks have final-state evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 003 Core Normalization and Assembly

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

- [x] T001 Confirm 002-contracts-and-fixtures handoff evidence and capture the baseline (`spec.md`, `plan.md`) [evidence: Phase 002 package passed 30 tests. Phase 003 exports were absent before implementation]
- [x] T002 Freeze normalization, assembly, bounded-context, content-free evidence, and independent test-matrix invariants (`spec.md`, `plan.md`) [evidence: requirements and objective proof plan recorded before edits]
- [x] T003 [P] Create the proposed Phase 003 package surfaces and focused test suite (`spec.md`, `plan.md`) [evidence: `src/core/`, `src/context/`, `src/observability/` and `test/core/` exist]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Implement normalization and ordering invariants. (`packages/cli-communication-projection/src/core/normalizer.ts`) [evidence: 30-fixture deterministic replay and three-order-domain tests pass]
- [x] T005 [P] Implement the bounded generation state machine. (`packages/cli-communication-projection/src/core/assembler.ts`) [evidence: generation isolation, deduplication, terminal and bound tests pass]
- [x] T006 Implement bounded context selection plus typed failure, cancellation, timeout, and exact-original fallback behavior (`packages/cli-communication-projection/src/context/selector.ts`, `src/core/`) [evidence: four context tests and terminal fallback matrix pass]
- [x] T007 Implement content-free lifecycle evidence at core boundaries (`packages/cli-communication-projection/src/observability/emitter.ts`) [evidence: schema, allowlist, keyed-correlation and sink-suppression tests pass]
- [x] T008 [P] Replay adversarial assembly, context, privacy, evidence, and cleanup matrices (`packages/cli-communication-projection/test/core/`) [evidence: 5 files and 17 focused tests pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`) [evidence: source, public export, package-script and test surfaces inventoried]
- [x] T010 Run focused negative controls and boundary tests (`checklist.md`) [evidence: malformed input, conflict, timeout, cancellation, overflow, corrupt encoding, empty output and telemetry canaries pass]
- [x] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`) [evidence: `npm run check` and parent `validate.sh --recursive --strict` both exit 0]
- [x] T012 Reconcile checklist, implementation summary, metadata, and 004-protected-spans-fidelity-render handoff (`checklist.md`) [evidence: final packet reconciliation and `handover.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] No blocked task remains without an owner-approved disposition.
- [x] Focused tests, the authoritative workspace gate and recursive strict validation pass. [evidence: 17/17 focused tests, 47/47 package tests and parent `validate.sh --recursive --strict` exit 0]
- [x] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [x] Parent and successor handoff metadata agree with the final state.
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
