---
title: "Checklist: Deep Research - Resume Adapter"
description: "Checklist for the Deep Research resume-adapter phase: sealed-ledger reconstruction, continuity mapping, compatibility decisions, and idempotent re-entry."
trigger_phrases:
  - "deep research resume adapter checklist"
  - "deep-research replay-safe resume checklist"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-22T09:15:00Z"
    last_updated_by: "codex"
    recent_action: "Passed the resume-adapter contract and adversarial verifier suite"
    next_safe_action: "Consume the adapter evidence in 006-shadow-parity"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-resume-adapter.vitest.ts"
    completion_pct: 100
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

- [x] CHK-001 [P0] Phase-012 shared envelope, replay, idempotency, and conflict contracts are frozen and the candidate records their contract fingerprints -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-002 [P0] The Deep Research sibling ownership matrix names typed schema, reducers, seals, certificates, resume, shadow parity, rollback, and mode-gate boundaries -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-003 [P1] Candidate `012652b479dee08455de574574c5e7a8971a8b0b` is pinned and the leaf write set is isolated to the requested module, test, and packet docs; inherited unrelated status entries prevent a truthful global-clean claim -- Evidence: implementation-summary.md records the scoped audit; targeted Vitest reports 21 passed (21) and runtime tsc exits 0.
- [x] CHK-004 [P2] The continuity-ladder matrix and resume request identity are recorded before implementation fixtures are accepted -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Resume authority is ledger-only through verified reducers; mutable JSONL projections, iteration Markdown, reports, URLs, and cache paths cannot silently override sealed state -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-006 [P0] Compatibility, recovery, and re-entry decisions are typed, immutable, fingerprint-bound, and fail closed for unknown or incompatible inputs -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-007 [P1] Stable logical branch, effect, lease, lineage, claim, synthesis, and memory-handoff identities are separated from changing attempt IDs and revisions -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-008 [P2] The phase introduces no second reducer, seal, receipt, certificate, shadow-parity, rollback, authority, or legacy-writer contract -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Ledger-only replay reconstructs identical state, continuity position, finalized frontier, active claim set, open obligations, handoff state, and projection fingerprint from identical sealed history -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-010 [P0] The continuity ladder covers `init`, plan/frontier, gather, analyze, convergence, synthesis, memory-save, incomplete, and failed states with one reducer-owned mapping per state -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-011 [P0] Exact, compatible, migrate, pin-old-runtime, fork, reject, blocked, unknown-event, cursor-gap, and projection-mismatch fixtures persist explicit decisions and never silently reuse stale state -- Evidence: targeted Vitest reports 21 passed (21), including an unregistered changed-manifest pair that yields `blocked` and manifest `reject`; runtime tsc exits 0.
- [x] CHK-012 [P0] Per-branch recovery assigns `reuse`, `reexecute`, `compensate`, or `reject` using manifest revision plus logical branch ID, and only approved reexecute branches enter the pool -- Evidence: targeted Vitest reports 21 passed (21); a reopened live reservation yields `compensate`, null attempt ID, no execution-pool entry, and no dispatch.
- [x] CHK-013 [P0] Effect receipt fixtures cover prepared, dispatched, result, unknown, reconciled, and compensated states; unknown irreversible effects never auto-retry -- Evidence: targeted Vitest reports 21 passed (21); forged confirmation is `blocked`, genuine confirmation and applied reconciliation yield `reconcile`, uncertain verdicts and immutable conflict block, and replay-safe `not_applied` yields `reexecute`. Restoring the bare effect-ID match makes the forged test fail with `reconcile`.
- [x] CHK-014 [P0] Duplicate resume requests, duplicate event delivery, concurrent entry, and process restart produce no double-applied semantic event, duplicate dispatch, or duplicate trusted completion -- Evidence: targeted Vitest reports 21 passed (21); byte-identical retry is idempotent, while divergent compatibility content under the same key is denied with `idempotency_conflict` by the real gateway.
- [x] CHK-015 [P0] Resume reuses the persisted root `RunLease`, deadline, lineage, generation, and replay fingerprint and never allocates a fresh lease for the same run -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-016 [P0] Source mutation, retraction, derivative duplication, contradiction, and supersession fixtures reopen only affected claims and synthesis inputs while preserving prior evidence -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-017 [P0] Frozen original-manifest replay is distinct from changed-manifest execution; changed fingerprints cannot inherit retry credit or success by label -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-018 [P0] Interrupted synthesis and memory-save handoff fixtures reconcile or retry under stable idempotency keys without duplicate report or memory-save completion -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-019 [P1] Crash injection at append, seal-reference, reducer-checkpoint, effect-dispatch, convergence, synthesis, and handoff boundaries preserves committed events and exposes incomplete work -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-020 [P1] Blocked, quarantined, and dark-success cases leave legacy state, legacy writers, and authority status unchanged -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P1] The phase contract maps every requirement and continuity-ladder row to a task, fixture, expected typed outcome, and evidence location -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P1] Tampered, truncated, substituted, wrong-kind, or descriptor-drifted ledger and artifact references release no trusted resume bytes and produce a typed verification failure -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-023 [P2] Retrieved instructions, poisoned evidence, unsupported source metadata, and unverified provider outcomes cannot enter trusted resumed state without an admission or reconciliation decision -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P1] The continuity-ladder map, decision algebra, compatibility matrix, and dark-authority boundary are reflected consistently in spec.md, plan.md, and tasks.md -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-025 [P2] The mode gate handoff names the adapter outputs required by shadow parity and leaves certificate, rollback, and authority decisions to their owning phases -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Changes land in dependency-closed, path-scoped commits under the pinned worktree and do not modify sibling packets or research inputs -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
- [x] CHK-027 [P2] Validation and fixture commands mutate no tracked legacy state or research artifact during verification -- Evidence: implementation-summary.md:49 records the closed contract; targeted Vitest reports 11 passed (11) and runtime tsc exits 0.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 resume, compatibility, effect, lease, continuity, and dark-path check passes; the
candidate report binds the tested ledger/reducer fingerprints and SHAs; duplicate and crash-window fixtures show no lost or
replayed semantic events; and the phase gate is green without moving runtime authority.

The full-pipeline Vitest suite contains twenty-one passing tests. It drives the real authorized ledger, frozen reducer,
sealed-artifact store, replay registry, effect ledger reducer, and transition receipt parser. Evidence covers mutable-file
demotion, unknown-version blocking, registered manifest migration, effect unknown-state blocking, exact duplicate re-entry,
persisted lease reuse, dependency-closed drift, forged checkpoint rejection, the exact continuity map, default-dark dispatch,
verified-versus-tampered artifact references, unregistered-manifest rejection, reservation-first branch compensation, and
same-key divergent-content denial by the real gateway. Effect evidence adds forged and genuine confirmation controls plus
all reconciliation and conflict dispositions. Removing the confirmation-binding helper flips the forged result from
`blocked` to `reconcile`, proving that the negative case is not supplied by an unrelated fixture failure.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms the P0 contract, the replay and re-entry evidence is attached, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
