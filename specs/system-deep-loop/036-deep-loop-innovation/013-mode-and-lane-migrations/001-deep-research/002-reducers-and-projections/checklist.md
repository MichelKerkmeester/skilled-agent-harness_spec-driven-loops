---
title: "Checklist: Deep Research - Reducers & Projections"
description: "Blocking verification checklist for deterministic deep-research reducers, iteration/convergence state, artifact indexing, and per-mode status projections."
trigger_phrases:
  - "deep research reducers checklist"
  - "deep research projection verification"
  - "deep research replay determinism checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-22T05:14:02Z"
    last_updated_by: "codex"
    recent_action: "Closed evidence-to-source referential trust"
    next_safe_action: "Downstream projection consumption"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Research - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the deep-research reducer/projection phase. The verifier binds
each report to the candidate and base identities, typed event-schema digest, reducer version, fixture-set digest, and
projection fingerprint. It records commands, exit codes, fixture counts, rejected-event counts, full-versus-incremental
parity, and any `rebuild_required` or `blocked` result. Every checked row below names its implementation or fixture evidence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The typed event schema, reducer input envelope, canonical ordering fields, and compatibility policy are frozen by `001-typed-ledger-schema` [Evidence: reducer imports `DeepResearchLedgerEvent`, its real registry, and persisted envelope ordering fields]
- [x] CHK-002 [P0] The reducer ownership matrix covers every projected field and event family with no duplicate owner [Evidence: `DEEP_RESEARCH_EVENT_ROUTING`, `DEEP_RESEARCH_PROJECTION_FIELD_OWNERSHIP`, and duplicate-owner rejection fixture]
- [x] CHK-003 [P1] Phase-012 mode-interface and phase-013 write-set evidence identify the reducer/projection resource boundary [Evidence: `DEEP_RESEARCH_REDUCER_SURFACE` implements the real `ModeContract.reduce()` subset]
- [x] CHK-004 [P2] Legacy reducer and heartbeat outputs are captured as comparison fixtures without treating them as the new authority [Evidence: `DeepResearchLegacyProjection` matches iteration, status, novelty, and next-focus comparison fields and is asserted `shadow-only`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The fold is pure and has no filesystem, network, clock, randomness, model, seal, or ledger-append side effect [Evidence: `foldDeepResearchEvents` imports only typed schema, canonical envelope helpers, mode-contract types, and local projection code]
- [x] CHK-006 [P0] Canonical ordering and tie-breakers use persisted logical identity and sequence fields only [Evidence: `compareEvents`, `foldConvergenceEvaluation`, `compareArtifactOrder`, `deriveStatusFromProvenance`, and `appendSeenEvent` exclude opaque stream labels; three relabel fixtures cover current convergence, status replay, seen-event order, and artifact supersession]
- [x] CHK-007 [P1] Raw observations, judgments, supersessions, retractions, contradiction obligations, and invalid states are never overwritten [Evidence: `DeepResearchClaimEvidenceProjection` history arrays plus the late-event parity fixture]
- [x] CHK-008 [P1] Projection fingerprint inputs include schema, reducer, codec, ordering, and normalized projection versions [Evidence: `deepResearchProjectionIntegrityDigest`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Identical event sequences produce byte-equivalent iteration/convergence state, artifact index, per-mode status, and projection fingerprint [Evidence: Vitest 45/45 includes byte-identical reordered replay, stream-label-swap invariance, artifact-gated convergence, and flagged/clean source controls]
- [x] CHK-010 [P0] Independent event permutations and late arrivals do not alter finalized state or trusted evidence without a declared frontier event [Evidence: `foldDeepResearchEvents` reordered, late-event, and cross-stream label-swap fixtures]
- [x] CHK-011 [P0] Duplicate event IDs, duplicate terminal events, malformed events, unknown required types, and impossible transitions fail closed [Evidence: `DeepResearchReducerError` conflict, terminal, registry, and convergence fixtures; synthesis-only sequences remain non-terminal without a stop-eligible evaluation]
- [x] CHK-012 [P0] Raw novelty is excluded from trusted convergence yield until evidence admission, captured-source membership, and independence rules mark the claim delta trusted [Evidence: `refreshConvergence` requires admitted clean evidence from a projected source for every stop-eligible result; the phantom-source run stays blocked with yield zero while the identical captured-source control converges]
- [x] CHK-013 [P0] Contradictions, falsification gaps, citation drift, query redundancy, health alarms, and lease exhaustion remain distinct convergence blockers [Evidence: `blockerIds` fixture preserves all six identities and raw citation drift]
- [x] CHK-014 [P0] Artifact digest mismatch, missing receipt, invalid reference, unavailable artifact, and supersession preserve explicit non-success states [Evidence: `artifactFromEvent` index, missing-receipt fixture, label-invariant supersession fixture, all-terminal-status completion reference checks, and a stop-eligible convergence decision that remains non-terminal until valid report and continuity artifacts exist]
- [x] CHK-015 [P0] Incremental cursor folding equals clean full replay after checkpoint restart, rotation, duplicate events, late judgments, and supersession forks [Evidence: `DeepResearchProjectionCheckpoint` oracle, untampered tail-bound continuation, late-event fixtures, default-on contiguous-tail enforcement, and digest-consistent checkpoint cross-field rejection]
- [x] CHK-016 [P0] Schema, reducer, codec, ordering, cursor-gap, truncation, or projection-fingerprint drift returns `rebuild_required` or `blocked` [Evidence: complete rebuild-reason fixture, genuine cursor-gap rejection, and forged `sourceTailSequence` rejection through `checkpoint-digest-mismatch`]
- [x] CHK-017 [P1] The compatibility projection marks lossy mappings and cannot append a transition or authorize a cutover [Evidence: frozen legacy projection exposes `shadow-only` and `legacyAuthority: unchanged` only]
- [x] CHK-018 [P1] Fixture reports include event-schema digest, reducer version, fixture digest, projection fingerprint, counts, and exit codes [Evidence: implementation summary records registry-bound fixture construction, reducer versions, 45 tests, projection and checkpoint digest assertions, and verifier exits]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-019 [P0] Every requirement in spec.md has a named fixture or verification command and no projection field is untested [Evidence: Vitest 45/45 plus `assertDeepResearchProjectionState`]
- [x] CHK-020 [P1] The reducer/projection output is consumable by `003-sealed-artifacts` without moving seal ownership into this phase [Evidence: exported plan, claim, convergence, artifact-index, and status projection types contain only referential artifact data]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-021 [P0] Retrieved instructions, poisoned evidence, phantom sources, unverified claims, and unknown effects cannot become trusted state through projection fallback [Evidence: `refreshConvergence` requires admitted clean claim evidence backed by a captured source; terminal validation resolves evidence-to-source, claim-to-evidence, and active-claim references; flagged and phantom controls remain non-converged while the captured clean-source control converges]
- [x] CHK-022 [P1] No reducer output bypasses the transition-authorization boundary or exposes compatibility output as authority [Evidence: `reduceDeepResearchVerifiedEvent` and shadow-only compatibility fixture]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-023 [P1] Reducer ownership, projection fields, invalid-state semantics, replay fingerprint inputs, and rebuild rules are documented in the phase artifacts [Evidence: implementation summary and exported ownership/types]
- [x] CHK-024 [P2] Research registry findings and local reducer baseline sources are cited in the implementation evidence [Evidence: `plan.md` dependencies and legacy baseline references]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-025 [P1] Changes remain inside the declared deep-research reducer/projection write set and do not modify schema, seal, gate, or authority owners [Evidence: `git status --short -- <scoped paths>` covers only the new module, unit suite, and leaf docs]
- [x] CHK-026 [P1] Projection checkpoints and fixtures are versioned, reproducible, and excluded from canonical evidence mutation [Evidence: `DeepResearchProjectionCheckpoint` binds projection identity plus `sourceTailSequence` in its existing integrity field; outputs remain frozen and retain the full-replay oracle]
- [x] CHK-027 [P1] Eligibility and finalized revision remain owned by convergence evaluation/block events; a later supported claim alone leaves them indeterminate and does not advance the convergence cursor [Evidence: Vitest 45/45 includes `keeps evaluation-owned convergence eligibility stable until a fresh evaluation`]
- [x] CHK-028 [P2] Distinct source versions with identical content digests index as separate artifacts with their own logical identities and receipts [Evidence: two-source same-content regression fixture]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when all P0 checks pass, the pure fold matches full replay under the fixture matrix, raw evidence
and versioned judgments remain reversible, artifact and status projections fail closed on missing or incompatible input,
and the exact projection fingerprint is recorded for the downstream sealed-artifact and mode-gate contracts. No check in
this phase authorizes production cutover; authority remains with the legacy path until phase 014.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms deterministic replay, incremental/full parity, explicit non-success states, and
the phase-scoped write set, with `validate.sh` and the reducer fixture gate green on the candidate identity.
<!-- /ANCHOR:sign-off -->
