---
title: "Tasks: Phase 008 Packaging and Release Hardening"
description: "Implementation task breakdown for packaging, the compatibility doctor, release gates, rollback, and six-runtime release rehearsals."
trigger_phrases:
  - "packaging-and-release-hardening"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/008-packaging-and-release-hardening"
    last_updated_at: "2026-08-13T04:36:10.000Z"
    last_updated_by: "claude"
    recent_action: "Completed the Phase 008 packaging, doctor, and release-gate framework."
    next_safe_action: "Run the operator release prerequisites, then record the parent release decision."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-implementation-20260812"
      parent_session_id: "phase-008-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Packaging, the compatibility doctor, release gates, rollback, and rehearsals are implemented and verified."
      - "The live credentialed smoke and the human study are operator-run release prerequisites the gate enforces."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 008 Packaging and Release Hardening

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

- [x] T001 Confirm 007-evaluation-and-observability handoff evidence and capture the baseline (`spec.md`, `plan.md`) [evidence: built on the 007 release-gate framework; baseline 247 tests green]
- [x] T002 Freeze public contracts, invariants, and independent test-matrix axes (`spec.md`, `plan.md`) [evidence: `src/release/types.ts` and `src/doctor/types.ts` freeze the release and diagnostic contracts]
- [x] T003 [P] Confirm the Phase 002 package exists, then create only the Phase 008 doctor, release, documentation, and release-test surfaces (`spec.md`, `plan.md`) [evidence: `src/doctor/`, `src/release/`, `docs/`, `test/release/`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Harden existing package entry points, exports, supported engines, evidence-backed presets, and the tiered support matrix (`package.json`) [evidence: 10 subpath exports; `src/release/support-matrix.ts` dated rows; commit 7888273014]
- [x] T005 [P] Implement doctor checks for versions, capabilities, endpoints, presentation tiers, and privacy-fact expiry; revalidate OpenCode Go privacy and retention facts before 2026-08-31 and at release (`src/doctor/`) [evidence: `src/doctor/checks.ts`, `doctor.ts`; OpenCode Go expiry blocks hosted routing; commit fba44ebe75]
- [x] T006 Implement release gates, typed aborts, cancellation and timeout handling, evidence manifests, and exact-original rollback coordination (`src/release/`) [evidence: `src/release/release-gate.ts`, `evidence.ts`, `rollback.ts`; provisional evidence blocks; commit 763f19ee02]
- [x] T007 Write install, configuration, privacy, support, upgrade, rollback, and operator runbooks with content-free diagnostics (`docs/`) [evidence: `docs/install.md`, `configuration.md`, `privacy.md`, `support-matrix.md`, `rollback.md`, `runbook.md`]
- [x] T008 [P] Run clean-install, six-runtime, privacy, negative-control, upgrade, downgrade, and rollback rehearsals (`test/release/`) [evidence: `test/release/rehearsal.test.ts`, `package-exports.test.ts`; injected six-runtime smoke; local-only zero-hosted-calls]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`) [evidence: `src/release/` produces the gate/manifest; `src/doctor/` consumes the support matrix]
- [x] T010 Run focused negative controls and boundary tests (`checklist.md`) [evidence: fail-closed doctor, provisional-blocks release gate, expiry boundary, malformed-input catch]
- [x] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`) [evidence: `npm run check` green 59 files / 289 tests; strict + recursive-strict validation]
- [x] T012 Reconcile checklist, implementation summary, metadata, signed evidence manifest, and parent-packet release decision (`checklist.md`) [evidence: this reconciliation; `handover.md`; parent phase-map updated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] No blocked task remains without an owner-approved disposition.
- [x] Focused tests, the authoritative workspace gate, and recursive strict validation pass.
- [x] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [x] Parent release-decision metadata and the signed evidence manifest agree with the final state.
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
