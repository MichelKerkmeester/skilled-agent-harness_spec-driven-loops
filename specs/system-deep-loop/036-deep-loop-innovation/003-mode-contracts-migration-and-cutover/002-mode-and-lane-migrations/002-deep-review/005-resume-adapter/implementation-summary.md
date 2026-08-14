---
title: "Implementation Summary: Deep Review Resume Adapter"
description: "Delivered an additive-dark Deep Review resume decision layer over offline-verified certificates, typed reducer state, authenticated migration facts, and descriptor-bound effect evidence."
trigger_phrases:
  - "deep review resume adapter implementation"
  - "deep-review resume decision"
  - "deep review continuity projection"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
    last_updated_at: "2026-07-27T21:58:58Z"
    last_updated_by: "codex"
    recent_action: "Implemented certificate-bound deterministic resume decisions"
    next_safe_action: "Shadow parity can consume the closed resume evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The offline certificate verifier owns prior-run acceptance"
      - "Compatibility is derived from real fingerprints and a digest-pinned migration registry"
      - "Only the shared seven-fact confirmation binding can prove an effect applied"
      - "The adapter remains dark and never imports another mode resume adapter"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-resume-adapter |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Evidence reconciliation** | Reinstated by 021 on 2026-07-31 with fresh suite evidence; completion remains supported. |
| **Posture** | Additive-dark with unchanged legacy authority |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`runtime/lib/deep-review-resume-adapter` now exports the closed Deep Review recovery boundary. `DeepReviewResumeAdapter`
reconstructs the certificate-covered typed stream from `AppendOnlyLedger`, folds it through `foldDeepReviewEvents`, invokes
`verifyDeepReviewCertificateOffline`, validates checkpoints, recomputes canonical resume fingerprints, and emits one
authorized `deep_review.run_resumed` event. Duplicate requests retain one semantic event and dispatch remains disabled unless
the explicit dark option is enabled.

`DeepReviewResumeDecision` records an adapter-owned compatibility classification, exact reuse or migration disposition,
stable logical pass decisions, descriptor-bound effect recovery, invalidation, the persisted lease, and verified certificate,
receipt-chain, and artifact-set digests. `DeepReviewContinuityProjection` maps initialization, scope, dimension passes,
finding and evidence work, convergence, review-report, and continuity-save state to reducer-owned fields. Downstream
consumers must preserve these closed shapes.

Compatibility never accepts a request verdict. The only supplied migration data is a closed registry whose full contents,
authority epoch, and configured trusted digest must agree. State-bearing target, manifest, reducer, adapter, schema, codec,
policy, and replay drift cannot be downgraded to compatible reuse. Current runtime constants and policy versions are checked
against the installed fingerprint before a decision can progress.

Effect recovery reads the real shared effect ledger and rebuilds its projection. A confirmation proves application only when
`effectConfirmationBindsIntent` verifies confirmation identity, effect identity, intent event identity, stored intent digest,
idempotency key, adapter descriptor, and expected postcondition. Bare effect identity, forged intent digest, forged
postcondition, or an uncorroborated applied reconciliation remains recovery-required.

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-review-resume-adapter/types.ts` | Created | Closed fingerprints, registry, decisions, continuity, lease, and result contracts |
| `runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts` | Created | Verified reconstruction, classification, effect recovery, append, and dark dispatch |
| `runtime/lib/deep-review-resume-adapter/index.ts` | Created | Stable public export surface for successor consumers |
| `runtime/tests/unit/deep-review-resume-adapter.vitest.ts` | Created | Decision matrix, fingerprint, registry, certificate-failure, effect-forgery, and idempotency coverage |
| Leaf packet docs | Updated | Implemented status, completed evidence, and shadow-parity handoff |

## Contract for Shadow Parity

The successor consumes `DeepReviewResumeAdapter`, `DeepReviewResumeDecision`,
`DeepReviewContinuityProjection`, `DeepReviewResumeAdapterResult`, and the exported parse and digest functions. It should
compare the dark decision and continuity projection without widening them, moving authority, or importing another mode's
resume adapter.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module imports the landed Deep Review ledger schema, reducers, sealed-artifact store, certificate verifier, authorized
ledger, replay registry, and effect-recovery substrate. It does not reproduce their hashes, stores, evaluators, reducers,
or verification logic. All dispatch remains dark by default and every decision carries unchanged legacy authority and false
production completion.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Reason |
|----------|--------|
| Recompute both resume fingerprints | A request digest cannot establish the ordered tool, model, policy, target, schema, replay, and certificate facts it claims |
| Authenticate the complete migration registry | Per-entry booleans or caller verdicts cannot authorize compatibility |
| Promote state-bearing compatible claims to migrate | Target and runtime state cannot inherit completion through a label-only compatibility assertion |
| Require the shared confirmation binding for applied effects | Effect identity alone leaves six binding facts unproven |
| Keep the adapter additive-dark | Shadow parity, rollback, gate, and authority cutover belong to successor concerns |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target Vitest suite | PASS with 1 file and 12 tests; suite sha256 `1eec9d35355da517a42385a1960293567b16af19d7ce4e113e1c4bcc0ad33917`; candidate SHA `dd07cb1f52ed2ebaca7d152d0a088366b2958b32` |
| Resume matrix | PASS for exact reuse, compatible, migrate, blocked, and rebuild-required |
| Forged confirmation | PASS with unknown application state and blocked recovery |
| Compatibility ownership | PASS for promoted state-bearing migration and rejected unauthenticated registry |
| Fingerprint recomputation | PASS for tool, model, policy, target, and schema changes |
| Idempotency and dark posture | PASS with one semantic append and zero default dispatches |
| New-module TypeScript grep | PASS with zero diagnostics under `runtime/lib/deep-review-resume-adapter/` |
| Whole-runtime TypeScript | Historical claim not rerun here; clean-checkout npm wiring is not reproducible because runtime `package.json` files are ignored |
| Strict packet validation | Recorded in the delivery handoff |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The focused adapter suite controls the offline-verifier verdict so decision branches remain deterministic; the landed
certificate suite separately exercises issuance and real offline verification. The production adapter always imports and
invokes `verifyDeepReviewCertificateOffline`. Only the Deep Review resume module, its focused unit test, and this leaf's
documentation were changed. No schema, reducer, sealed-artifact, certificate, shared-substrate, golden, sibling-lane,
parity, gate, or legacy-authority implementation was modified. Rollback removes the new dark module and test while leaving
all prior ledger and certificate evidence intact.
<!-- /ANCHOR:limitations -->
