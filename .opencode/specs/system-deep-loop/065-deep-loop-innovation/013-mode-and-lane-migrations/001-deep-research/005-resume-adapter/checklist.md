---
title: "Checklist: Deep Research - Resume Adapter"
description: "Checklist for the Deep Research resume-adapter phase: sealed-ledger reconstruction, continuity mapping, compatibility decisions, and idempotent re-entry."
trigger_phrases:
  - "deep research resume adapter checklist"
  - "deep-research replay-safe resume checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-15T19:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Prepared the blocking resume-adapter verifier contract"
    next_safe_action: "Run ledger-only replay and crash-window fixtures after the shared contracts freeze"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Research - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Research resume-adapter phase. Every item is checked against a
pinned candidate SHA and BASE SHA using sealed-ledger fixtures, reducer fingerprints, event IDs, lease identities, decision
receipts, and legacy-state snapshots. Verification must fail on silent fallback, zero-fixture execution, unexpected tracked
mutation, duplicate semantic application, lost committed events, or dark-path authority leakage.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-012 shared envelope, replay, idempotency, and conflict contracts are frozen and the candidate records their contract fingerprints
- [ ] CHK-002 [P0] The Deep Research sibling ownership matrix names typed schema, reducers, seals, certificates, resume, shadow parity, rollback, and mode-gate boundaries
- [ ] CHK-003 [P1] The candidate worktree is clean, pinned to BASE, isolated, and limited to the phase write set
- [ ] CHK-004 [P2] The continuity-ladder matrix and resume request identity are recorded before implementation fixtures are accepted
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Resume authority is ledger-only through verified reducers; mutable JSONL projections, iteration Markdown, reports, URLs, and cache paths cannot silently override sealed state
- [ ] CHK-006 [P0] Compatibility, recovery, and re-entry decisions are typed, immutable, fingerprint-bound, and fail closed for unknown or incompatible inputs
- [ ] CHK-007 [P1] Stable logical branch, effect, lease, lineage, claim, synthesis, and memory-handoff identities are separated from changing attempt IDs and revisions
- [ ] CHK-008 [P2] The phase introduces no second reducer, seal, receipt, certificate, shadow-parity, rollback, authority, or legacy-writer contract
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Ledger-only replay reconstructs identical state, continuity position, finalized frontier, active claim set, open obligations, handoff state, and projection fingerprint from identical sealed history
- [ ] CHK-010 [P0] The continuity ladder covers `init`, plan/frontier, gather, analyze, convergence, synthesis, memory-save, incomplete, and failed states with one reducer-owned mapping per state
- [ ] CHK-011 [P0] Exact, compatible, migrate, pin-old-runtime, fork, reject, blocked, unknown-event, cursor-gap, and projection-mismatch fixtures persist explicit decisions and never silently reuse stale state
- [ ] CHK-012 [P0] Per-branch recovery assigns `reuse`, `reexecute`, `compensate`, or `reject` using manifest revision plus logical branch ID, and only approved reexecute branches enter the pool
- [ ] CHK-013 [P0] Effect receipt fixtures cover prepared, dispatched, result, unknown, reconciled, and compensated states; unknown irreversible effects never auto-retry
- [ ] CHK-014 [P0] Duplicate resume requests, duplicate event delivery, concurrent entry, and process restart produce no double-applied semantic event, duplicate dispatch, or duplicate trusted completion
- [ ] CHK-015 [P0] Resume reuses the persisted root `RunLease`, deadline, lineage, generation, and replay fingerprint and never allocates a fresh lease for the same run
- [ ] CHK-016 [P0] Source mutation, retraction, derivative duplication, contradiction, and supersession fixtures reopen only affected claims and synthesis inputs while preserving prior evidence
- [ ] CHK-017 [P0] Frozen original-manifest replay is distinct from changed-manifest execution; changed fingerprints cannot inherit retry credit or success by label
- [ ] CHK-018 [P0] Interrupted synthesis and memory-save handoff fixtures reconcile or retry under stable idempotency keys without duplicate report or memory-save completion
- [ ] CHK-019 [P1] Crash injection at append, seal-reference, reducer-checkpoint, effect-dispatch, convergence, synthesis, and handoff boundaries preserves committed events and exposes incomplete work
- [ ] CHK-020 [P1] Blocked, quarantined, and dark-success cases leave legacy state, legacy writers, and authority status unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P1] The phase contract maps every requirement and continuity-ladder row to a task, fixture, expected typed outcome, and evidence location
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P1] Tampered, truncated, substituted, wrong-kind, or descriptor-drifted ledger and artifact references release no trusted resume bytes and produce a typed verification failure
- [ ] CHK-023 [P2] Retrieved instructions, poisoned evidence, unsupported source metadata, and unverified provider outcomes cannot enter trusted resumed state without an admission or reconciliation decision
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] The continuity-ladder map, decision algebra, compatibility matrix, and dark-authority boundary are reflected consistently in spec.md, plan.md, and tasks.md
- [ ] CHK-025 [P2] The mode gate handoff names the adapter outputs required by shadow parity and leaves certificate, rollback, and authority decisions to their owning phases
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Changes land in dependency-closed, path-scoped commits under the pinned worktree and do not modify sibling packets or research inputs
- [ ] CHK-027 [P2] Validation and fixture commands mutate no tracked legacy state or research artifact during verification
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 resume, compatibility, effect, lease, continuity, and dark-path check passes; the
candidate report binds the tested ledger/reducer fingerprints and SHAs; duplicate and crash-window fixtures show no lost or
replayed semantic events; and the phase gate is green without moving runtime authority.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the replay and re-entry evidence is attached, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
