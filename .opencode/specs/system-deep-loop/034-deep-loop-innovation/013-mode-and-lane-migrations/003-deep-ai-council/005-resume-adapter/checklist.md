---
title: "Checklist: Deep AI Council resume adapter"
description: "Checklist for the Deep AI Council resume adapter: sealed-ledger reconstruction, continuity-ladder projection, crash recovery, idempotent re-entry, and non-authoritative mode-gate integration."
trigger_phrases:
  - "Deep AI Council resume adapter checklist"
  - "council replay verification checklist"
  - "sealed ledger council recovery checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Added planned P0 checks for council replay and re-entry safety"
    next_safe_action: "Verify the sealed-frontier and duplicate-delivery matrix"
    blockers: []
    key_files: []
    completion_pct: 0
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
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] Shared ledger, seal, replay registry, effect-recovery, and certificate contracts are frozen for the mode adapter
- [ ] CHK-007 [P2] Candidate SHA, shared-contract fingerprints, fixture digest, reducer version, and adapter fingerprint are recorded in the verification report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are scoped to Deep AI Council resume behavior; no sibling concern, authority cutover, or shared-substrate rewrite is included
- [ ] CHK-009 [P0] Reducers are deterministic and side-effect free; semantic state is derived from event identity rather than mutable continuity prose or current model output
- [ ] CHK-010 [P1] Attempt IDs are never used as logical branch, claim, message, effect, artifact, or resume-request identity
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Valid sealed-ledger fixtures replay to a stable state fingerprint; unsealed, truncated, duplicate-sequence, tampered, and conflicting-seal fixtures fail closed
- [ ] CHK-002 [P0] Partial deliberation resumes only missing logical seats and never repeats a committed seat result
- [ ] CHK-003 [P0] Partial critique and convergence preserve stable claim/message IDs, dissent, minority state, private estimates, and frozen judge/configuration fingerprints
- [ ] CHK-004 [P0] Artifact and council-gate replay uses immutable outputs and receipts; missing or stale evidence yields typed WAIT, WIDEN, RECONCILE, or BLOCK rather than success
- [ ] CHK-013 [P0] Duplicate resume requests with the same run, seal frontier, adapter fingerprint, and boundary return one decision with no duplicate semantic event or side effect
- [ ] CHK-014 [P0] Duplicate event delivery and changed attempt IDs do not double-apply claims, messages, seat results, artifacts, receipts, or gate decisions
- [ ] CHK-015 [P0] Dispatch-without-result and result-without-fold crash fixtures choose receipt reuse, reconciliation, or block; unknown irreversible effects are never blindly retried
- [ ] CHK-016 [P0] Replay compatibility fixtures distinguish exact, compatible, migrate, pin-old-runtime, and blocked outcomes for schema, reducer, judge, codec, and policy changes
- [ ] CHK-017 [P0] Continuity-ladder projection maps packet pointer, recent action, next safe action, blockers, progress, open questions, and answered questions to reducer evidence
- [ ] CHK-018 [P0] A continuity field, checkpoint, or mutable transcript cannot override the sealed ledger or authorize a new semantic transition
- [ ] CHK-019 [P1] The adapter output is consumable by shadow parity while the legacy path remains authoritative and no authority-cutover event is emitted
- [ ] CHK-020 [P1] Resume behavior is invariant to worker completion order when logical branch IDs and the sealed event order are unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] The mode event inventory, reducer ownership map, crash-boundary matrix, and recovery-disposition table cover every council stage
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P0] Blinded scorer inputs exclude generator identity, rationale, peer scores, and mutable social cues unless the frozen protocol explicitly permits them
- [ ] CHK-011 [P1] Seal verification, receipt lookup, replay compatibility, and idempotency checks fail closed on missing, stale, or conflicting identity material
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] The phase outcome is reflected in the packet docs and the successor shadow-parity contract consumes the named resume projection
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-021 [P1] Mode-scoped adapter and fixture changes land in path-scoped commits without modifying sealed ledger history or sibling phase contracts
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
