---
title: "Checklist: Deep AI Council resume adapter"
description: "Checklist for the Deep AI Council resume adapter: sealed-ledger reconstruction, continuity-ladder projection, crash recovery, idempotent re-entry, and non-authoritative mode-gate integration."
trigger_phrases:
  - "Deep AI Council resume adapter checklist"
  - "council replay verification checklist"
  - "sealed ledger council recovery checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
    last_updated_at: "2026-07-27T22:02:42Z"
    last_updated_by: "codex"
    recent_action: "Verified the fail-closed council resume contract"
    next_safe_action: "Shadow parity consumes the verified resume output"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep AI Council Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking mode-gate contract for the Deep AI Council resume adapter. Every item is a check the paired
verify agent runs before the adapter is accepted by shadow parity; each report pins the candidate SHA, shared-contract
fingerprints, sealed-ledger fixture digest, reducer version, and replay decision, and fails on silent fallback, duplicate
semantic application, missing event, or unexpected authority change.

HEAD closeout evidence for every checked item below: [Commit: `5a7ae9a87c04f29db91d5365c6015f2778602080`]; [File: `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts:1197`]; [File: `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts:1257`]; [Test: `npx --no-install vitest run tests/unit/deep-ai-council-resume-adapter.vitest.ts --configLoader runner` — 10/10 passed in 308.01s]; [Test: `npx --no-install tsc --noEmit --ignoreDeprecations 6.0` — exit 0].
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] Shared ledger, seal, replay registry, effect-recovery, and certificate contracts are frozen for the mode adapter [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-007 [P2] Candidate SHA, shared-contract fingerprints, fixture digest, reducer version, and adapter fingerprint are recorded in the verification report [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Changes are scoped to Deep AI Council resume behavior; no sibling concern, authority cutover, or shared-substrate rewrite is included [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-009 [P0] Reducers are deterministic and side-effect free; semantic state is derived from event identity rather than mutable continuity prose or current model output [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-010 [P1] Attempt IDs are never used as logical branch, claim, message, effect, artifact, or resume-request identity [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Valid sealed-ledger fixtures replay to a stable state fingerprint; unsealed, truncated, duplicate-sequence, tampered, and conflicting-seal fixtures fail closed [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-002 [P0] Partial deliberation resumes only missing logical seats and never repeats a committed seat result [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-003 [P0] Partial critique and convergence preserve stable claim/message IDs, dissent, minority state, private estimates, and frozen judge/configuration fingerprints [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-004 [P0] Artifact and council-gate replay uses immutable outputs and receipts; missing or stale evidence yields typed WAIT, WIDEN, RECONCILE, or BLOCK rather than success [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-013 [P0] Duplicate resume requests with the same run, seal frontier, adapter fingerprint, and boundary return one decision with no duplicate semantic event or side effect [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-014 [P0] Duplicate event delivery and changed attempt IDs do not double-apply claims, messages, seat results, artifacts, receipts, or gate decisions [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-015 [P0] Dispatch-without-result and result-without-fold crash fixtures choose receipt reuse, reconciliation, or block; unknown irreversible effects are never blindly retried [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-016 [P0] Replay compatibility fixtures distinguish exact, compatible, migrate, pin-old-runtime, and blocked outcomes for schema, reducer, judge, codec, and policy changes [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-017 [P0] Continuity-ladder projection maps packet pointer, recent action, next safe action, blockers, progress, open questions, and answered questions to reducer evidence [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-018 [P0] A continuity field, checkpoint, or mutable transcript cannot override the sealed ledger or authorize a new semantic transition [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-019 [P1] The adapter output is consumable by shadow parity while the legacy path remains authoritative and no authority-cutover event is emitted [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-020 [P1] Resume behavior is invariant to worker completion order when logical branch IDs and the sealed event order are unchanged [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-022 [P0] The adapter derives exact, compatible, migrate, pin-old-runtime, or blocked compatibility from persisted fingerprints; unknown never reuses, and the caller supplies only the authenticated migration registry [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-023 [P0] An effect becomes `applied` only when every binding fact declared by the shared effect-intent adapter descriptor and verified-confirmation contract verifies; bare effect-ID, forged-intent, and forged-postcondition fixtures fail closed [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-024 [P0] Every resumed schema, reducer, sealed-artifact, and certificate reference resolves against the real substrate and verifies kind plus any borne epoch, lifecycle, freshness, real state, visibility, role redaction, and authority liveness [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-025 [P1] The LANDED schema, reducer/projection, and sealed-artifact predecessors remain additive-dark and the Planned adapter leaves legacy authority unchanged [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P1] The mode event inventory, reducer ownership map, crash-boundary matrix, and recovery-disposition table cover every council stage [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P0] Blinded scorer inputs exclude generator identity, rationale, peer scores, and mutable social cues unless the frozen protocol explicitly permits them [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
- [x] CHK-011 [P1] Seal verification, receipt lookup, replay compatibility, and idempotency checks fail closed on missing, stale, or conflicting identity material [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-012 [P2] The phase outcome is reflected in the packet docs and the successor shadow-parity contract consumes the named resume projection [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-021 [P1] Mode-scoped adapter and fixture changes land in path-scoped commits without modifying sealed ledger history or sibling phase contracts [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 10 tests passed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, every interruption boundary has an explicit recovery disposition,
repeated replay has no semantic delta, the continuity projection is reducer-derived, the adapter remains non-authoritative,
and the mode gate plus `validate.sh --strict` are green against the pinned shared-contract and fixture fingerprints.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode verifier confirms sealed-frontier integrity, idempotent re-entry, no lost or double-applied events,
safe unknown-effect handling, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
