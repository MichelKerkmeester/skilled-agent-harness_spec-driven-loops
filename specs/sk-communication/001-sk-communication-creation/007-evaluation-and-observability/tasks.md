---
title: "Tasks: Phase 007 Evaluation and Observability"
description: "Implementation task breakdown for the evaluation and observability release-gate framework."
trigger_phrases:
  - "evaluation-and-observability"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/007-evaluation-and-observability"
    last_updated_at: "2026-08-12T09:40:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the Phase 007 evaluation framework and a live LLM-judge demo."
    next_safe_action: "Approve the Phase 008 packaging architecture, then execute its T001."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-implementation-20260812"
      parent_session_id: "phase-007-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The evaluation framework and observability aggregation are implemented and verified."
      - "The powered blind human non-inferiority study is the operator-run release gate the framework executes."
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

- [x] T001 Confirm 006-runtime-adapters-and-clients handoff evidence and capture the baseline (`spec.md`, `plan.md`) [evidence: built on the 006 tier-honest telemetry; baseline 202 tests green]
- [x] T002 Freeze public contracts, invariants, and independent test-matrix axes (`spec.md`, `plan.md`) [evidence: `src/evaluation/types.ts`, `preregistration.ts` freeze the strata and decision contract]
- [x] T003 [P] Create the Phase 007 evaluation, observability-aggregation, and focused-test surfaces (`spec.md`, `plan.md`) [evidence: `src/evaluation/`, `src/observability/`, `test/evaluation/`, `test/observability/`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Build the versioned corpus, reference/original baselines, three-sample variance pilot, and reproducible run manifest (`src/evaluation/`) [evidence: `corpus.ts`, `baselines.ts`, `pilot.ts`, `run-manifest.ts`; commit 65e814fae1]
- [x] T005 Freeze release-critical strata, the powered sample plan, reviewer assignment, randomization, per-dimension margins, and stop rules before candidate scoring (`src/evaluation/`) [evidence: `preregistration.ts` (digest-stamped, tamper-refused), `power.ts` sized for the margin; commit a8149a8d2c]
- [x] T006 Implement deterministic fidelity vetoes, masked review packets, confidence intervals, and per-dimension non-inferiority decisions (`src/evaluation/`) [evidence: `fidelity-veto.ts`, `blinding.ts`, `noninferiority.ts`, `gate.ts`]
- [x] T007 Implement aggregation and export over earlier lifecycle events using rotating keyed digests and content-free allowlists (`src/observability/`) [evidence: `aggregation.ts`, `correlation.ts`, `export.ts`, `redaction.ts`; commit d2d4adb1e4]
- [x] T008 [P] Test pilot/release separation, statistical decisions, presentation-tier stratification, identity masking, sample-cap failure, and redaction canaries (`test/evaluation/`) [evidence: focused evaluation and observability suites; end-to-end integration test]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`) [evidence: evaluation produces the gate/report; observability consumes lifecycle events]
- [x] T010 Run focused negative controls and boundary tests (`checklist.md`) [evidence: fidelity veto, inconclusive-at-cap failure, canary scans, tamper refusal]
- [x] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`) [evidence: `npm run check` green 52 files / 247 tests; strict + recursive-strict validation]
- [x] T012 Reconcile checklist, implementation summary, metadata, and 008-packaging-and-release-hardening handoff (`checklist.md`) [evidence: this reconciliation; `handover.md`; parent phase-map updated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] No blocked task remains without an owner-approved disposition.
- [x] Focused tests, the authoritative workspace gate, and recursive strict validation pass.
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
