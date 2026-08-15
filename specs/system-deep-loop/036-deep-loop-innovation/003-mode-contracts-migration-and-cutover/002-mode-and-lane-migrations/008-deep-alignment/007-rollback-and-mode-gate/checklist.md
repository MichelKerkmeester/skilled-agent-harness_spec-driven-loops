---
title: "Checklist: Deep Alignment - Rollback & Mode Gate"
description: "Checklist for the Deep Alignment rollback switch and independent mode gate: verify fail-closed authority control, bounded rollback, per-lane lifecycle parity, applicability closure, sealed evidence, certificate integrity, and a non-authoritative phase-014 handoff."
trigger_phrases:
  - "Deep Alignment rollback and mode gate checklist"
  - "deep-alignment rollback readiness checklist"
  - "deep-alignment mode gate verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-15T16:12:18Z"
    last_updated_by: "codex"
    recent_action: "Verified the cited suite and reconciled closeout evidence"
    next_safe_action: "No leaf-local closeout action remains"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Alignment - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Alignment mode gate. Every item is checked against a pinned BASE,
phase-012 shared review-loop digest, write-set fence, phase-014 handoff revision, mode-contract digest, lane configuration, authority
capsule and verifier digests, fixture manifest, event and reducer versions, artifact seal manifest, applicability coverage, parity
receipt, run certificate, receipt root, replay fingerprint, rollback-window record, and candidate SHA. The report records commands,
exit codes, lane counts, coverage edges, event and projection fingerprints, gate decisions, rollback reasons, and unexpected tracked
mutation. A mode-gate PASS certifies `MIGRATED_SHADOW_READY` only; it never authorizes authority cutover or automatic remediation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] BASE, the parent 036 invariant, `manifest/phase-tree.json`, phase-012 shared review-loop digest, write-set fence, phase-014 handoff revision, and phase-006 authorization digest are pinned in the candidate report [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-002 [P0] LANDED additive-dark siblings `001` through `006` are inventory-bound with their ownership boundaries; no sibling responsibility is redefined here [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-003 [P0] The legacy Deep Alignment lifecycle is inventoried for lane resolution, discovery, applicability, each artifact check, live re-probe, known deviation, convergence, report, resume, continuity, and remediation exclusion [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-004 [P1] The authority-control schema, rollback trigger matrix, healthy anchor, dual window bounds, expiry rule, lane evidence rows, and phase-014 handoff fields are frozen before fixture execution [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Every caller-input digest and validator is guarded; circular, non-finite, forbidden-prototype, non-plain, wrong-shape, stale, or absent evidence returns a typed denial and `legacy_authoritative` without throwing [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-006 [P0] A closed request schema authenticates every field, rejects unknown or inert fields, snapshots validated values, and permits rollback only through the real gateway with a re-verified certificate anchor [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-007 [P1] The rollback window has both a deadline and logical-operation or attempt bound; expiry and renewal cannot silently widen the window [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-008 [P0] Deep Alignment consumes the phase-012 shared review-loop and Deep Review mode 002 fence without a local scope, coverage, lineage, convergence, report, resume, or write-set fork [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-009 [P0] The phase emits no authority flip, self-clearing rollback, window close, automatic remediation, legacy-writer removal, or canonical state mutation [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Lane resolution and every per-lane lifecycle boundary produce matching legacy and ledger event order, logical identities, causal links, authority epochs, payload digests, and projection fingerprints [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-011 [P0] Applicability fixtures cover applicable, not-applicable, unresolved, unsupported, and stale target states without coercing unknown evidence to pass or fail [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-012 [P0] Detector candidates, live re-probes, known deviations, counterevidence, severity, confidence, evidence strength, conformance, and lifecycle fields remain orthogonal and typed [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-013 [P0] Convergence, coverage, stability, per-lane worst verdict, report synthesis, resume, and continuity fixtures match without terminal-report parity shortcuts [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-014 [P0] The required phase-009 receipt verifies integrity and mode/frontier/manifest binding, but its `exitStatus` is never adopted; readiness is independently re-derived through the real `TransitionAuthorizationGateway` and deterministic ledger replay without re-running the harness [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-015 [P0] Every authority capsule, rule IR, source anchor, applicability profile, target, observation, finding, counterevidence, known-deviation, report, and resume reference resolves through the real substrate with expected kind, epoch/lifecycle/freshness/state, visibility/redaction, authority-liveness, seal, and content digest [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-016 [P0] Missing, changed, truncated, substituted, wrong-kind, unsupported, expired, or descriptor-drifted artifacts release no bytes and produce a typed gate failure [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-017 [P0] The run certificate binds the pinned authority epoch, lane configuration, event range, declared outcome, unresolved or blocked findings, per-lane reports, replay fingerprint, and receipt-set root [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-018 [P0] Every required transition receipt closes with authorization, causal links, input/output digests, append position, effect state, and explicit unknown handling [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-019 [P0] Independent verification reproduces the authority, verifier, certificate, and receipt result without live model, tool, network, or mutable workspace access [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-020 [P0] Authority drift, applicability drift, parity mismatch, replay mismatch, seal or receipt gap, unknown effect, contract drift, integrity alarm, health quarantine, or a predecessor token not strictly below the coordinator's durable high-water mark and new rollback token each produce typed rollback or block evidence; the request anchor must equal the re-verified migration-certificate anchor [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-021 [P0] Rollback fixtures at before dispatch, after effect start, after provider acceptance, after receipt append, after projection refresh, and before report commit introduce no duplicate finding, effect, report, adjudication, or authority transition [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-022 [P0] Deadline expiry and logical-operation exhaustion close the rollback window safely; stale-window renewal, invalid authority, and unavailable-checkpoint cases fail closed [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-023 [P0] The Deep Alignment gate remains blocked when Deep Review, a generic dashboard, a final report, aggregate coverage, or a convergence score is green but Deep Alignment evidence is absent [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P1] The gate matrix covers every resolved lane from `INIT` and `SCOPE` through discovery, applicability, verify-first findings, known deviations, convergence, report, resume, continuity, and phase-014 handoff [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-025 [P1] The mode-gate certificate records `PASS`, `BLOCKED`, or `INDETERMINATE`, per-lane outcomes, `MIGRATED_SHADOW_READY`, all authority and evidence digests, rollback result, and non-authoritative posture [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] No process-local flag, environment fallback, lane-owned lineage, failing verifier, or quarantined run can authorize, clear, or select its own rollback or cutover [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-027 [P1] Raw failed tails, authority and verifier references, sealed artifacts, parity differences, known-deviation assertions, unknown effects, gate refusals, and restoration receipts remain append-only and content-bound [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-028 [P1] The phase docs identify the phase-012 shared review-loop contract, Deep Review mode 002 boundary, LANDED additive-dark predecessors, sibling ownership limits, authority capsule, rollback switch, dual bounds, per-lane gate evidence, phase-014 handoff, and provenance limits cited from the golden 007 decision record [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-029 [P2] Every tolerated volatility exception, unresolved disposition, known-deviation assertion, and approved non-PASS result has a durable owner, reason, expiry, and invalidation condition [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P1] Candidate gate output, authority snapshots, lane parity reports, seals, certificates, rollback fixtures, and receipts remain isolated from canonical Deep Alignment runtime state [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] CHK-031 [P1] The final diff is limited to this phase folder and the verifier records no unexpected tracked mutation [Test: rollback window, mode gate, and rollback switch suites, 87/87 PASS (101.73s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 check passes, every resolved Deep Alignment lane has complete applicability and green shadow
parity, every required authority, artifact, and receipt is verified, the run and mode-gate certificates close, rollback is proven
within both bounds, invalid control states fail closed, and the handoff emits only `MIGRATED_SHADOW_READY` with legacy authority
unchanged. A generic mode result, Deep Review result, final report, aggregate coverage, or numeric convergence score cannot satisfy
this checklist.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 mode-gate contract, attaches authority, applicability, parity, seal, certificate,
receipt, and rollback evidence to the candidate report, and proves the isolated run made no canonical-state, authority, or
automatic-remediation mutation.
<!-- /ANCHOR:sign-off -->
