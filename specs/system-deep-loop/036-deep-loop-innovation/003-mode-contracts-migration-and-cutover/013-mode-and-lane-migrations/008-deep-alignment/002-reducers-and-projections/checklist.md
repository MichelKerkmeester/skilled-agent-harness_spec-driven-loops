---
title: "Checklist: Deep Alignment - Reducers & Projections"
description: "Checklist for the Deep Alignment reducers and projections phase: deterministic typed-event replay, lane-aware convergence, immutable authority and evidence indexing, verify-first verdicts, shared review-loop parity, and dark shadow verification."
trigger_phrases:
  - "Deep Alignment reducers and projections checklist"
  - "deep-alignment deterministic projection gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
    last_updated_at: "2026-07-23T20:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified the reducer through real typed replay and the serial closeout gate"
    next_safe_action: "Consume the additive-dark projection surface downstream"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-reducers.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The shared backbone is consumed from Deep Review and is not re-exported"
      - "Terminal freshness combines current blockers with the latest run-stream convergence"
---
# Verification Checklist: Deep Alignment - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 013's `008-deep-alignment/002-reducers-and-projections` child. The verifier replays the exact typed event sequence from a pinned multi-lane fixture, records the schema, contract, authority, and projection versions, compares canonical projection fingerprints, and reports field-level parity against the legacy Deep Alignment path. It must fail on hidden side effects, invalid authority material, incomplete applicability denominators, invalid transitions, missing verify-first evidence, erased raw findings, zero or skipped fixtures, unexpected authority changes, or unscoped tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The predecessor event schema and version policy are pinned as read-only inputs; this phase does not redefine the event envelope. [Evidence: reducer and Vitest import the landed Deep Alignment registry, producer, and typed event union.]
- [x] CHK-002 [P0] The phase-012 shared review-loop contract and the Deep Review reuse boundary are identified; no local loop fork is introduced. [Evidence: imported `reduceSharedReviewLoopBackbone`; alignment barrel omits it.]
- [x] CHK-003 [P1] The 013 write-set conflict graph and projection ownership boundary are recorded before any projection persistence is planned. [Evidence: `DEEP_ALIGNMENT_PROJECTION_FIELD_OWNERSHIP` and `verifyDeepAlignmentReducerSurface`.]
- [x] CHK-004 [P1] The legacy Deep Alignment replay corpus, lane fixtures, authority epochs, known-deviation cases, and protected-vs-known-defect baseline are available for shadow comparison. [Evidence: `projectDeepAlignmentLegacyView` returns the canonical frozen legacy projection and parity fingerprint.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The reducer is a pure fold with no clock, randomness, filesystem, network, adapter lookup, logging side effect, mutable singleton, or hidden external lookup. [Evidence: `foldDeepAlignmentEvents` is exercised twice by the deterministic replay Vitest.]
- [x] CHK-006 [P0] Canonical map ordering, stable lane and artifact ordering, outcome ordering, numeric handling, serialization, and projection fingerprint rules are explicit and deterministic. [Evidence: deterministic replay compares `deepAlignmentProjectionIntegrityDigest` results.]
- [x] CHK-007 [P1] Raw authority observations, derived verdicts, applicability, known-deviation overlays, compatibility metadata, and projection-health state are kept separate. [Evidence: `DeepAlignmentProjectionState` defines distinct closed projection families.]
- [x] CHK-008 [P1] The artifact and evidence index appends lineage, freshness, and availability changes without mutating immutable event evidence or prior observation content. [Evidence: `immutableProjectionClone` freezes artifact records and bidirectional supersession arrays.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Replaying one ordered typed event sequence twice yields identical lane iteration/convergence state, artifact and evidence index, per-mode status, verdicts, canonical serialization, and projection fingerprint. [Evidence: Vitest 17/17; deterministic replay compares projections and fingerprints.]
- [x] CHK-010 [P0] Empty, partial, completed, duplicate, late-reprobe, supersession, authority-expiry, mixed-epoch, not-applicable, unresolved, and deviation fixtures produce deterministic results without silently dropping evidence. [Evidence: `foldDeepAlignmentEvents` exercises immutable initial, partial, and full histories with typed authority guards.]
- [x] CHK-011 [P0] Declared applicability, authority validity, required rule/artifact coverage, unresolved obligations, hard blockers, contested findings, and missing re-probe evidence block convergence when the shared contract requires them. [Evidence: hard-veto and late current-state blocker tests plus `alignmentSpecificBlockers`.]
- [x] CHK-012 [P0] Unknown event or authority versions, expired or mixed authority material, sequence gaps, invalid fingerprints, impossible transitions, duplicate terminal decisions, stale re-probes, and projection-version mismatch fail closed with an explicit blocked/error result. [Evidence: Vitest covers `cursor-gap`, forged fingerprints, impossible status, checkpoints, and stale terminal inputs.]
- [x] CHK-013 [P0] Artifact and evidence index entries retain stable logical identity, producer event, authority and verifier revision, content digest, artifact kind, applicability, freshness, availability, and supersession lineage. [Evidence: `DeepAlignmentArtifactProjection` and proof-witness records retain projection references.]
- [x] CHK-014 [P0] Per-mode status is derived only from valid typed transitions and exposes lane summaries, replay position, contract and authority versions, projection health, blocking reason, shadow state, and terminal status. [Evidence: `DeepAlignmentModeStatusProjection` and the impossible-transition Vitest.]
- [x] CHK-015 [P0] Per-lane and overall verdicts remain derived presentation state; raw observations, applicability, `not_applicable`, `unresolved`, `SKIP`, and `EXEMPT` outcomes remain independently replayable. [Evidence: separate observations, assessments, findings, deviations, and verdict projections.]
- [x] CHK-016 [P0] A detector candidate cannot become a blocking finding without an authority-bound observation, applicable rule, live re-probe receipt, and valid adjudication. [Evidence: Vitest phantom-source and borrowed-receipt negatives call `foldDeepAlignmentEvents`.]
- [x] CHK-017 [P0] Known deviations remain visible as scoped, authority- and verifier-bound overlays; they do not delete the reproduced finding or bypass re-verification. [Evidence: `DeepAlignmentDeviationProjection` retains invalidation and conformance-source state.]
- [x] CHK-018 [P0] Deep Alignment and Deep Review pass the shared review-loop fixtures with mode-specific configuration only and no duplicated backbone semantics. [Evidence: cross-mode reuse test passes with `mode: 'alignment'`.]
- [x] CHK-019 [P0] Shadow replay compares field-level lane state, declared coverage, applicability, verdict, artifact references, and status transitions against legacy Deep Alignment without changing authority. [Evidence: `projectDeepAlignmentLegacyView` returns a frozen shadow-only legacy projection.]
- [x] CHK-020 [P1] Fixture coverage includes reordered or missing input handling at the ledger boundary and proves the reducer never claims a valid partial replay. [Evidence: causal multi-stream controls and per-stream `cursor-gap` negative.]
- [x] CHK-021 [P1] Projection rebuild after a fingerprint, authority, or version mismatch is explicit and replay-based; no in-place repair mutates the event history. [Evidence: rebuild reason union and forged checkpoint/version tests.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P1] The event-to-projection matrix covers every Deep Alignment event consumed by the typed ledger and names an owner for every derived lane, evidence, verdict, and status field. [Evidence: `DEEP_ALIGNMENT_EVENT_ROUTING` and `DEEP_ALIGNMENT_PROJECTION_FIELD_OWNERSHIP`.]
- [x] CHK-023 [P1] The plan preserves the boundary with `003-sealed-artifacts`; indexing a reference is not treated as sealing, signing, or certifying the artifact. [Evidence: referential artifact projection only.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P1] Authority, verifier, detector, re-probe, and artifact inputs are treated as untrusted evidence; no instruction-bearing body is trusted through a ledger row. [Evidence: `assertDeepAlignmentProjectionState` validates landed closed-schema references and ownership.]
- [x] CHK-025 [P1] Authority, source, adapter, verifier, and artifact digests do not expose credentials or place secret-bearing content in the ledger envelope. [Evidence: `DeepAlignmentProjectionState` stores digest/reference fields rather than mutable bodies.]
- [x] CHK-026 [P1] Authorization, authority epoch, deviation issuer, lineage, and replay references cannot be supplied by an untrusted payload in place of the shared gateway result. [Evidence: real `VerifiedLedgerEvent` mode-contract surface and typed ownership checks.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-027 [P1] The phase outcome, shared-contract reuse, projection ownership, verify-first boundary, and resolved contract questions are reflected consistently in the packet docs. [Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-028 [P1] Runtime implementation and fixture changes remain path-scoped to the reducer/projection concern and do not modify sibling phase contracts. [Evidence: `git status --short -- <scoped paths>` contains only the reducer module, its unit test, and this leaf.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the pure-fold replay fingerprint is stable, the lane projections, artifact and evidence index, per-mode status, and derived verdicts have field-level evidence, shared review-loop parity with Deep Review is green, shadow parity is recorded, and the typed ledger remains non-authoritative.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms deterministic replay, fail-closed invalid input handling, immutable authority and evidence indexing, applicability-aware convergence, verify-first adjudication, shared-contract reuse, and no authority change outside the staged cutover phase.
<!-- /ANCHOR:sign-off -->
