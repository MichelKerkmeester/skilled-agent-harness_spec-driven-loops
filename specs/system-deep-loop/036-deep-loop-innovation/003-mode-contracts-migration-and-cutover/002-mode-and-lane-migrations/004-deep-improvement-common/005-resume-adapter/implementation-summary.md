---
title: "Implementation Summary: Deep Improvement Common Resume Adapter"
description: "Delivered an additive-dark decision adapter that verifies prior common-run evidence, recomputes compatibility, and recovers in-flight effects without becoming runtime authority."
trigger_phrases:
  - "deep improvement common resume adapter implementation"
  - "deep improvement common resume decision"
  - "deep improvement common effect recovery"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
    last_updated_at: "2026-08-15T14:24:52Z"
    last_updated_by: "claude"
    recent_action: "Verified resume adapter closeout; suite 23/23 passed, exit 0"
    next_safe_action: "Deep-improvement-common complete; close benchmark variant modes next"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Compatibility is derived from verified persisted facts and an authenticated migration registry"
      - "Effect application requires the shared seven-fact intent binding"
      - "The resume fingerprint is recomputed over ordered real inputs"
      - "Unverified prior certificates fail closed before reconstruction"
      - "Checkpoint and frontier state rederive from authenticated history"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-resume-adapter |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy state, writers, and authority remain unchanged |
| **Base SHA** | `fbf3c7291eb432ca541666397b95bf5da7bc500b` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The common deep-improvement lane now exposes one closed resume-decision boundary over the landed ledger schema, reducer,
sealed-artifact, certificate, replay, and effect-recovery contracts. `DeepImprovementCommonResumeAdapter` first invokes
`verifyDeepImprovementCommonCertificateOffline`, folds the verified event range through the common reducer, and reads the
candidate and evaluator facts through `readDeepImprovementCommonArtifact`. It does not duplicate any verifier, store,
reducer, certificate, or authority logic.

Before deriving compatibility, the adapter independently reconstructs the requested authorized-ledger range, requires the
typed run genesis and one causally contiguous run stream, compares the projection input bytes with that authenticated history,
and checks the certificate start and final heads against the real replay frontier. A non-null checkpoint is accepted only when
its cursor resolves inside that history and a prefix fold reproduces both its projection and integrity commitment.

The adapter derives ordered tool, model, policy, target, and schema facts from verified prior evidence. It recomputes both
persisted and current versioned resume fingerprints and classifies each component as `exact`, `compatible`, `migrate`,
`pin-old-runtime`, or `incompatible`. Only entries in a canonical migration registry whose digest is trusted by the adapter
can authorize non-exact compatibility. Caller-authored compatibility fields are outside the closed request shape.

Transition receipts become typed branch decisions. Verified effect-ledger events become typed effect decisions, and an
effect is `applied` only when `effectConfirmationBindsIntent` verifies the derived confirmation identity, effect identity,
intent event identity and stored digest, idempotency key, adapter descriptor digest, and expected postcondition digest.
Unknown or forged outcomes remain visible and route to `reexecute`, `reconcile`, `compensate`, or `blocked` according to
the frozen descriptor and recovery evidence.

### Frozen successor contract

The three extension lanes import the same exports unchanged:

- `DeepImprovementCommonResumeAdapter`
- `DeepImprovementCommonResumeRequest`
- `DeepImprovementCommonResumeDecision`
- `DeepImprovementCommonResumeResult`
- `DeepImprovementCommonAuthenticatedTail`
- `DeepImprovementCommonResumeRebuildReasonCode`
- `DeepImprovementCommonCompatibilityComponentDecision`
- `DeepImprovementCommonEffectResumeDecision`
- `DeepImprovementCommonBranchResumeDecision`
- `DeepImprovementCommonInvalidationDecision`
- `DeepImprovementCommonPersistedRunLease`
- `DEEP_IMPROVEMENT_COMMON_CONTINUITY_LADDER`
- `DEEP_IMPROVEMENT_COMMON_RESUME_ADAPTER_VERSION`
- `deepImprovementCommonMigrationRegistryDigest`
- `deepImprovementCommonResumeFingerprintDigest`
- `parseDeepImprovementCommonMigrationRegistry`
- `parseDeepImprovementCommonResumeDecision`
- `parseDeepImprovementCommonResumeRequest`

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-improvement-common-resume-adapter/types.ts` | Created | Closed request, fingerprint, compatibility, branch, effect, invalidation, lease, decision, continuity, and result types |
| `runtime/lib/deep-improvement-common-resume-adapter/deep-improvement-common-resume-adapter.ts` | Created | Verified reconstruction, compatibility classification, effect recovery, invalidation, and dark decision logic |
| `runtime/lib/deep-improvement-common-resume-adapter/index.ts` | Created | Stable exports for all three extension lanes and shadow parity |
| `runtime/tests/unit/deep-improvement-common-resume-adapter.vitest.ts` | Created | Real certificate, artifact, reducer, ledger, receipt, compatibility, fingerprint, and effect-binding proof |
| Leaf packet docs | Updated | Implemented status, completion evidence, and successor handoff |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module mirrors the landed deep-research resume-adapter layout and depth while substituting the common lane's real event,
projection, artifact, certificate, and transition contracts. Tests issue and offline-verify a production-shaped common run
certificate, rebuild authenticated history from the shipped ledger, resolve its sealed artifact closure, and replay an
independently authorized effect ledger. No fixture verdict is copied into the adapter output.

The implementation is additive-dark. It creates no production writer, never invokes an effect adapter, and returns
`productionCompletion: false`. Removing the component comparison would make the changed-input tests silently reuse; removing
the shared confirmation binder would make the forged confirmation tests report applied; removing checkpoint or frontier
validation makes their fixtures resume or block for the wrong reason. Focused mutation checks observed each intended red.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verify the prior bundle before deriving any reusable fact | Certificate shape or caller ownership cannot establish trusted completion |
| Derive compatibility inside the adapter | A caller verdict can otherwise convert drift into silent reuse |
| Authenticate the migration registry by canonical digest | Registry entries are policy inputs and need an explicit trust boundary |
| Recompute the resume fingerprint | A request-supplied digest cannot prove the current tool, model, policy, target, or schema |
| Use the shared confirmation binder | A bare effect ID proves only one of seven binding facts |
| Reconstruct authenticated history before reuse | Projection arrays cannot prove causal order, stream ownership, or the real ledger frontier |
| Re-fold non-null checkpoints from their cursor | A self-consistent checkpoint digest can otherwise skip authenticated events |
| Preserve the frozen reducers and stores | This layer decides recovery and must not become a second evaluator or authority |
| Keep every result dark-only | Shadow parity, rollback, and cutover belong to successor leaves |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Target Vitest suite | PASS, 1 file and 23 tests |
| Resume matrix | PASS, exact-reuse, compatible, migrate, rebuild-required, and blocked |
| Compatibility ownership | PASS, caller-added verdict is rejected and an unauthenticated registry blocks |
| Fingerprint recomputation | PASS, changed tool, model, policy, target, or schema facts cannot reuse |
| Version commitments | PASS, reducer, adapter, schema, and codec versions are committed |
| Forged effect confirmation | PASS, intent, postcondition, and adapter mismatches remain unknown and blocked |
| Genuine effect confirmation | PASS, the shared seven-fact binder yields applied and reuse |
| Checkpoint integrity | PASS, a self-consistent wrong cursor returns checkpoint-digest-mismatch |
| Authenticated history | PASS, causal cursor gaps and stream splits fail closed |
| Frontier integrity | PASS, a certificate final head that differs from the replayed tail returns frontier-mismatch |
| Prior-run integrity | PASS, mutated and process-local certificate evidence is refused |
| Runtime TypeScript compile | PASS, exit 0 with zero adapter-path diagnostics |
| Strict packet validation | PASS, exit 0 with zero errors and zero warnings |
| Scope audit | PASS, only the new module, unit test, and this leaf's docs appear in the scoped status |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The adapter is intentionally a deterministic decision layer. It does not append an authoritative resume event, execute or
compensate an external effect, mutate a certificate, or replace the common reducers. It reports the recovery action that
the three extension lanes and later authority phases consume.
<!-- /ANCHOR:limitations -->
