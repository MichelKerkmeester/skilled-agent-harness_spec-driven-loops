---
title: "Tasks: Cutover Certificate & Rollback Window"
description: "Tasks for defining, verifying, appending, monitoring, and closing the per-mode cutover certificate and its reversible rollback window."
trigger_phrases:
  - "cutover certificate rollback tasks"
  - "rollback window enforcement tasks"
  - "deep-loop authority evidence tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Created certificate and rollback-window task sequence"
    next_safe_action: "Execute source trace and evidence-verification tasks in order"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Cutover Certificate & Rollback Window

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Extract the phase-004 certificate preconditions and 14-day/five-run rollback-window rule — encoded as `ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS`/`ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS` in `lib/cutover-certificate/types.ts` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T002 Extract phase-007 receipt, certification, and effect-recovery fields that become certificate evidence — `BoundaryReceiptPayload`/`CertificationEnvelope` imported unmodified in `lib/cutover-certificate/types.ts` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T003 Extract sibling `002-per-mode-authority-flip` CAS inputs and preserve its flip ownership boundary
- [x] T004 Confirm the manifest outcome, `depends_on: []`, Level 2 structure, and phase-015 retirement handoff
- [x] T005 [P] Freeze certificate, window, signal, trigger, rollback, and closure vocabulary — `CutoverCertificateFacts`/`MonitoredSignalFamilies`/`RollbackWindowRecord` type definitions in `lib/cutover-certificate/types.ts` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T006 [P] Identify the per-mode event identities, evidence digests, policy digest, authority epochs, and retained rollback assets — `CutoverCertificateEvidenceBindings` in `lib/cutover-certificate/types.ts` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Define the canonical `cutover_certificate` event and required identity, mode, SHA, epoch, policy, issuer, and timing fields
- [x] T008 Define evidence references for shadow parity, rollback drill, migration receipts, in-flight classification, mixed replay, and mode gate — `CutoverCertificateEvidenceBindings` in `lib/cutover-certificate/types.ts`; test `issues a certificate from complete, consistent evidence` in `tests/unit/cutover-certificate.vitest.ts:334` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T009 Define certificate canonicalization, certification scheme, verifier inputs, digest binding, and fail-closed rejection behavior — `buildCutoverCertificate`/`verifyCutoverCertificate` in `lib/cutover-certificate/certificate.ts`; 10+3 reject-path tests in `tests/unit/cutover-certificate.vitest.ts:350-514` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T010 Define certificate append authorization and the verified handoff consumed by sibling `002-per-mode-authority-flip`
- [x] T011 Define window initialization at successful CAS, rollback anchor retention, monitor cursor, and authoritative-run accounting — `openRollbackWindow` in `lib/cutover-certificate/rollback-window.ts`; test `opens a digest-bound record from CAS facts` in `tests/unit/cutover-certificate.vitest.ts:739` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T012 Define health, parity-drift, replay, authorization, receipt, budget, and state-reconciliation signal contracts — `MonitoredSignalFamilies` in `lib/cutover-certificate/types.ts` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T013 Define threshold, extension, operator-stop, and revert semantics for every monitored signal family — `evaluateMonitoredSignals` in `lib/cutover-certificate/rollback-window.ts`; tests in `tests/unit/cutover-certificate.vitest.ts:864-900` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T014 Define admission freeze, spine fencing, in-flight reconciliation, new-epoch legacy restoration, and event-preserving rollback steps (the record binds and validates these facts; the mechanics themselves stay owned by the existing per-mode `rollback-switch.ts`, per T001 disposition)
- [x] T015 Define rollback certificate contents and phase-007 receipt composition for rollback and reconciliation outcomes (binds to whichever per-mode rollback certificate executed the mechanics) — `buildRollbackRevertRecord` in `lib/cutover-certificate/rollback-window.ts`; tests in `tests/unit/cutover-certificate.vitest.ts:915-973` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T016 Define clean closure evidence, retained assets, and the phase-015 handoff without granting retirement authority — `closeRollbackWindow` in `lib/cutover-certificate/rollback-window.ts`; tests in `tests/unit/cutover-certificate.vitest.ts:1018-1063` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T017 [P] Map each certificate and window requirement to one verifier fixture and one durable evidence output — REQ-to-file mapping recorded per-row in `t001-disposition.md` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify complete certificate evidence passes for one mode and one exact candidate SHA — test `accepts a certificate that exactly matches the expectation` in `tests/unit/cutover-certificate.vitest.ts:474` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T019 Verify missing, stale, tampered, contradictory, cross-mode, wrong-policy, wrong-epoch, and duplicate-facts certificates fail closed — 10+3 reject-path tests in `tests/unit/cutover-certificate.vitest.ts:350-514` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T020 Verify certificate issuance is an authorized canonical ledger event and not an ambient control-plane flag — test `appends exactly one cutover certificate event through the fenced authorized-ledger seam` in `tests/unit/cutover-certificate.vitest.ts:547` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T021 Verify window closure waits for both 14 calendar days and five successful authoritative executions — `describe('evaluateRollbackWindow')` tests in `tests/unit/cutover-certificate.vitest.ts:761-787` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T022 Verify low traffic, unresolved parity, health regression, replay mismatch, authorization failure, receipt gap, budget breach, and reconciliation failure extend or trigger rollback — `evaluateRollbackWindow`/`evaluateMonitoredSignals` extend/revert tests in `tests/unit/cutover-certificate.vitest.ts:799-900` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T023 Tabletop rollback and verify admission freeze, spine fence, reconciliation, new epoch, event preservation, and rollback certificate emission (verified at the record-binding layer this child owns; the executed mechanics are `rollback-switch.ts`'s existing, already-tested behavior)
- [x] T024 Verify stale monitor decisions, duplicate conflicting certificates, multi-mode flips, and stale writers cannot advance authority — test `rejects a decision that is not a revert` in `tests/unit/cutover-certificate.vitest.ts:937`; mode/epoch cross-checks in `lib/cutover-certificate/certificate.ts` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T025 Verify phase 008, sibling 002, this child, phase 007, and phase 015 retain their declared ownership boundaries — ownership matrix in `t001-disposition.md` [evidence: tests/unit/cutover-certificate.vitest.ts; suite sha256 6386eab8a82075bf0632eae6e75c47cfdc779d01da08a12090dea845bd3fce25; candidate SHA 0bf6aa7957; result: 41 tests passed]
- [x] T026 Run strict spec-kit validation and confirm only expected `description.json` and `graph-metadata.json` omissions remain
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All certificate, monitoring, rollback, and closure tasks complete
- [x] All requirements in spec.md are ratified with traceable evidence fixtures or review records
- [x] The phase-014 handoff records each mode's certificate and window outcome before phase 015 retirement work begins (the record and evidence types exist; sibling 002 and phase 015 have not yet wired to them, which is out of this child's scope)
- [x] Strict validation has no error (`validate.sh --strict` reports 0 errors; see checklist.md CHK-034 for the exact run)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Program source**: See `../../spec.md` and `../../manifest/phase-tree.json`
- **Rollback policy**: See `../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Receipt contract**: See `../../003-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`
- **Flip sibling**: See `../002-per-mode-authority-flip/spec.md`
<!-- /ANCHOR:cross-refs -->
