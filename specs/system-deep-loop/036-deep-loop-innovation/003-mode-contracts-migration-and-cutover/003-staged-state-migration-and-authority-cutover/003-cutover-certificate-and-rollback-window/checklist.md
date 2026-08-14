---
title: "Checklist: Cutover Certificate & Rollback Window"
description: "Blocking verifier contract for the cutover evidence bundle, monitored rollback window, fail-safe revert path, and phase-015 closure handoff."
trigger_phrases:
  - "cutover certificate rollback checklist"
  - "rollback window verification"
  - "authority cutover evidence checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
    last_updated_at: "2026-08-09T06:40:00Z"
    last_updated_by: "claude"
    recent_action: "Ratified cert + rollback-window checks vs the built cutover-certificate lib + 41 tests"
    next_safe_action: "None — all P0/P1 checks have evidence; 002/015 wiring is future work, not this child"
    blockers: []
    key_files:
      - "lib/cutover-certificate/types.ts"
      - "lib/cutover-certificate/certificate.ts"
      - "lib/cutover-certificate/rollback-window.ts"
      - "tests/unit/cutover-certificate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Cutover Certificate & Rollback Window

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the certificate and rollback-window control library. Completion evidence binds the reviewed candidate SHA or document hash, the exact certificate/window clause or requirement ID, the reviewer or tool result, and the mode/epoch under test — each item below cites the exact test in `tests/unit/cutover-certificate.vitest.ts` or file/line in `lib/cutover-certificate/` that supplies it. Evidence fails on incomplete proof, mutable references, permissive fallback, split-brain authority, early closure, unbounded monitoring, or ownership drift into sibling 002 or phase 015. This library is dark and additive: it is not yet imported by any live authority-moving code path, so "verified" below means the built contract behaves correctly under test, not that it has been wired into production.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Parent phase-014 handoff, manifest outcome, and staged additive-to-cutover model are cited — `spec.md` §2 PROBLEM & PURPOSE, first paragraph
- [x] CHK-002 [P0] Phase-004 policy is cited for certificate preconditions, authority states, and the 14-day/five-run later-of window rule — `spec.md` §2, second paragraph; encoded as `ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS`/`ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS` in `lib/cutover-certificate/types.ts`
- [x] CHK-003 [P0] Phase-007 receipts and certification semantics are cited as required evidence inputs — `spec.md` §2, third paragraph; `lib/cutover-certificate/types.ts` imports `BoundaryReceiptPayload`/`CertificationEnvelope` from `receipts-and-effect-recovery`, reused not redefined
- [x] CHK-004 [P0] Sibling `002-per-mode-authority-flip` is named as the CAS flip owner and this child is limited to certificate/window enforcement — `spec.md` §3 Out of Scope, first bullet; `t001-disposition.md` REQ-008 row records the same boundary was honored in the build
- [x] CHK-005 [P1] `depends_on: []`, Complete status, Level 2 structure, and last-sibling adjacency are explicit — `spec.md` frontmatter and §1 METADATA; phase adjacency note under the title
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] The certificate names one mode, one candidate SHA, one policy digest, one source/target epoch pair, and one transition digest — `CutoverCertificateFacts` in `lib/cutover-certificate/types.ts`; test "issues a certificate from complete, consistent evidence"
- [x] CHK-007 [P0] Certificate evidence includes shadow parity, rollback drill, migration receipts, state classification, mixed replay, and mode gate references — `CutoverCertificateEvidenceBindings`; same test asserts all six digests are present
- [x] CHK-008 [P0] Verification rejects missing, stale, tampered, contradictory, cross-mode, wrong-policy, wrong-SHA, and wrong-epoch evidence — `describe('buildCutoverCertificate')` 10 reject-path tests + `describe('verifyCutoverCertificate')` 3 reject-path tests, one per `CutoverCertificateRejectionReasonCode` the assembler/verifier can reach
- [x] CHK-009 [P0] Certificate issuance uses the canonical envelope and transition-authorization gateway and appends a durable ledger event — test "appends exactly one cutover certificate event through the fenced authorized-ledger seam" (real `AppendOnlyLedger` + `TransitionAuthorizationGateway`, `appendAuthorizedThroughFence` seam, no new append path)
- [x] CHK-010 [P1] Registered certification scheme, signer/provider identity, verifier version, canonical digest, and certificate bytes are explicit — the certificate is authenticated by the ledger's own gateway decision/audit chain (`policy_digest`, `decision_digest`, `audit_record_hash`) rather than a separate HMAC signature, matching the existing per-mode readiness-certificate pattern; `certificateDigest` is the canonical digest and the appended `canonical_event_bytes` are the certificate bytes
- [x] CHK-011 [P1] Duplicate certificate facts are idempotent while same-key/different-facts requests fail closed — exact-retry idempotency and same-event-id/different-bytes conflict are the underlying `AppendOnlyLedger`'s existing, separately-tested behavior (`tests/unit/authorized-ledger.vitest.ts`); this module's own test "fails closed on a stale re-append of an already-committed event rather than silently duplicating" confirms the convenience append path used here refuses a stale retry rather than silently double-appending
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-012 [P0] A complete certificate verifies only for the exact candidate SHA, current authority epoch, and approved mode — `describe('verifyCutoverCertificate')`: "accepts a certificate that exactly matches the expectation" plus the three mismatch-reject tests
- [x] CHK-013 [P0] Certificate verification blocks sibling 002 when any required evidence digest or approval is absent or mismatched — same `verifyCutoverCertificate` suite is the exact API sibling 002 would call before its CAS; every mismatch case returns `rejected`, never `valid`
- [x] CHK-014 [P0] Window opening records start time, rollback anchor, retained legacy assets, monitor cursor, and authoritative-run count — `openRollbackWindow` in `lib/cutover-certificate/rollback-window.ts`; test "opens a digest-bound record from CAS facts" (run count is tracked by `evaluateRollbackWindow`, not the static open record, since it accrues over the window's life)
- [x] CHK-015 [P0] Window closure remains blocked until both 14 calendar days and five successful authoritative executions are complete — `describe('evaluateRollbackWindow')` "stays open before either minimum", "stays open at 14+ days with fewer than 5 successful executions", "becomes eligible to close once both minimums are met"
- [x] CHK-016 [P0] Low traffic prevents the successful-run condition from being inferred from elapsed time — test `extends when traffic is low even after both minimums are met` in `tests/unit/cutover-certificate.vitest.ts:799`
- [x] CHK-017 [P0] Health regressions and parity drift have separate monitored signals with ratified thresholds and deterministic severity — `MonitoredSignalFamilies` includes `health` and `parity-drift` as independent families in `types.ts`; `evaluateMonitoredSignals` folds each family's severity independently
- [x] CHK-018 [P0] Replay mismatch, authorization failure, receipt gap, budget breach, and state-reconciliation failure extend or trigger rollback — all five are `MonitoredSignalFamilies` members; `describe('evaluateMonitoredSignals')` proves `warning`→extend and `revert`→revert generically across families
- [x] CHK-019 [P0] Mid-window rollback freezes admissions, fences the spine, reconciles in-flight work, restores legacy at a new epoch, preserves events, and emits a rollback certificate — `buildRollbackRevertRecord` validates and binds these exact facts (`admissionsFrozenAt`, `spineFencedAt`, `reconciliationDigest`, `restoredAuthorityState: 'legacy_authoritative'`, `restoredAuthorityEpoch`, retained-count equality, `rollbackCertificateDigest`); the mechanics that produce those facts stay owned by the existing per-mode `rollback-switch.ts` (see `t001-disposition.md` REQ-008)
- [x] CHK-020 [P0] Clean closure appends durable evidence for phase 015 without authorizing legacy-writer retirement by itself — `closeRollbackWindow` returns typed, signed `RollbackWindowClosureEvidence` with `handoffReady: true`; it is a value object this module hands to a future phase-015 consumer, not a ledger event that grants retirement authority
- [x] CHK-021 [P0] Multi-mode flips, stale monitor decisions, conflicting certificates, and stale writers fail closed — mode/candidateSha/epoch cross-checks in `buildCutoverCertificate`/`verifyCutoverCertificate` reject cross-mode and stale-epoch certificates; `buildRollbackRevertRecord` rejects a non-`revert` trigger decision (`STALE_TRIGGER_DECISION`); the underlying ledger append rejects a stale writer request (`t001-disposition.md`, `append-only-ledger.ts` fence/head checks reused unmodified)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P0] Every certificate field and window state has one owning requirement and one verification fixture or review record — REQ-to-file mapping recorded per-row in `t001-disposition.md`; every field in `types.ts` is exercised by at least one test in `tests/unit/cutover-certificate.vitest.ts`
- [x] CHK-023 [P0] Every monitored signal has a source, threshold/condition, extension action, revert action, and durable evidence output — `MonitoredSignalReading` carries `family`/`severity`/`evidenceDigest`/`reasonCode`; `evaluateMonitoredSignals` is the deterministic extend/revert/operator-stop decision function, tested per outcome
- [x] CHK-024 [P1] Crash cut points cover certificate append, window checkpoint, monitor decision, rollback fence, reconciliation, and closure evidence — certificate append reuses the existing append-only ledger's proven crash/torn-tail recovery (`immutable-frame-store.ts`, already covered by `authorized-ledger.vitest.ts`); window/monitor/revert/closure are pure typed value objects in this dark/additive build with no independent persistence layer yet, so there is no separate crash surface to cut at beyond the ledger append itself
- [x] CHK-025 [P1] The ownership matrix proves phase 008 supplies readiness evidence, sibling 002 flips, this child certifies/monitors, and phase 015 retires — `t001-disposition.md` "Ground truth found in live code" and per-requirement disposition table; `spec.md` §3 Out of Scope
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] Certificate verification defaults to deny on incomplete input, unknown policy, stale epoch, invalid signature, or verifier failure — every branch of `buildCutoverCertificate`/`verifyCutoverCertificate` returns a typed `rejected` result inside a `try/catch` that also fails closed to `CERTIFICATE_MALFORMED` on any unexpected throw; no branch defaults to accept
- [x] CHK-027 [P0] Certificate and rollback events exclude secrets and unrestricted payloads while retaining bounded digests and safe evidence references — `CutoverCertificateEvidenceBindings` carries only fixed-shape digests/ids/counts, never raw evidence payloads; the appended event's `payload` is `{ certificate }`, itself digest-only evidence
- [x] CHK-028 [P0] Authority epochs, candidate SHA, policy digest, request digest, and mode identity prevent stale decision reuse — bound into `transitionDigest` and re-checked in `verifyCutoverCertificate`; the ledger append additionally binds `authority_epoch` and the gateway's `prior_head_sequence`/`prior_head_hash`, reused unmodified from `authorized-ledger`
- [x] CHK-029 [P1] Spine fencing and legacy restoration cannot produce simultaneous authoritative writers during rollback — this child does not implement fencing/restoration itself (owned by `rollback-switch.ts`, `t001-disposition.md` REQ-008); `buildRollbackRevertRecord` requires `spineFencedAt >= admissionsFrozenAt >= windowRecord.openedAt` and a single `restoredAuthorityEpoch = openingAuthorityEpoch + 1`, so its record cannot represent two authoritative epochs at once
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] spec.md, plan.md, tasks.md, and checklist.md agree on certificate contents, signal families, ownership, and the 14-day/five-run window — all four now describe the same built module and cite the same evidence; `implementation-summary.md` reconciles the Complete status across all docs
- [x] CHK-031 [P1] Cross-references resolve to the parent phase, manifest, phase-004 policy, phase-007 receipts, and sibling 002 contract — `tasks.md` Cross-References section; unchanged from planning, still resolves
- [x] CHK-032 [P2] Deterministic metadata generation is deferred exactly as instructed and no metadata file is hand-authored — `description.json`/`graph-metadata.json` regenerated via `generate-context.js` after all other docs, not hand-written
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-033 [P0] Only the approved Level 2 Markdown files exist as authored files in this target folder — now six, not the original four: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` (the planning quartet) plus `implementation-summary.md` (required once Level 2 work is built, per the Documentation Levels table) and `t001-disposition.md` (the confirm-first record the build workflow requires); no other file was authored here
- [x] CHK-034 [P1] Strict validation reports no issue other than pre-existing worktree tooling gaps — `validate.sh --strict` on this folder: 8 errors, all `TS rule bridge failed` / `tsx runtime missing`, reproduced identically (as a 9-error baseline, one of which was this folder's own now-fixed `TEMPLATE_HEADERS` deviation) on the untouched sibling `002-per-mode-authority-flip`, confirming they predate and are independent of this build; `description.json`/`graph-metadata.json` were already present before this build (not missing) and pass `GRAPH_METADATA_PRESENT`/`DESCRIPTION_SHAPE`/`GRAPH_METADATA_SHAPE`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase may be ratified only when every P0 check has evidence, every P1 check is complete or explicitly approved for deferral, certificate facts are bound to the exact flip, window closure uses the later-of policy, every revert path preserves events and authority epochs, and phase 015 receives durable closure evidence without inheriting a hidden retirement decision.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the phase-014 parent verifier confirms that each mode's authority flip is certificate-backed, its rollback window is actively monitored, any revert is non-destructive and epoch-safe, and clean closure is recorded before phase 015 evaluates legacy-writer retirement.
<!-- /ANCHOR:sign-off -->
