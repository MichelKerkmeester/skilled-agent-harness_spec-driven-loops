---
title: "Implementation Summary: Deep AI Council Reducers and Projections"
description: "The additive-dark Deep AI Council ledger now folds into deterministic, immutable seat, critique, blinded adjudication, convergence, artifact, test-gate, and status projections."
trigger_phrases:
  - "deep ai council reducer implementation"
  - "deep ai council projection contract"
  - "deterministic council replay"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
    last_updated_at: "2026-07-23T13:51:04Z"
    last_updated_by: "codex"
    recent_action: "Added reducer-surface and canonical-order verification"
    next_safe_action: "Consume the closed projection types from downstream additive-dark leaves"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-reducers.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All landed council event stems route through one closed reducer ownership surface"
      - "Strict source ordering, predecessor hashes, and checkpoint tail binding define replay identity"
      - "Seat proposals remain separate from blinded judgments and adjudication decisions"
      - "Hard vetoes and unresolved obligations cannot be overridden by scalar support"
      - "Legacy comparison output remains complete, frozen, lossy, and shadow-only"
      - "Verified-event reduction and the declared reducer surface match the full fold oracle"
      - "Canonical object-key reordering preserves projection bytes and integrity fingerprints"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-reducers-and-projections |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; the legacy Deep AI Council path remains unchanged and authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`runtime/lib/deep-ai-council-reducers/` imports the landed
`deep-ai-council-ledger-schema` and folds its complete 25-stem event union into
closed, recursively frozen projection families:

- `councilSeats`: round, independent-seat, dispatch, and immutable proposal observations.
- `critique`: critique-round exposure and critique evidence with captured-proposal references.
- `blindedAdjudication`: blinded candidates, raw pairwise ballots, bias audits, and adjudication decisions. Seat and model identities do not enter the scorer-facing judgment records.
- `convergence`: stance lineage, deliberation, raw convergence evaluations, effective independence, hard vetoes, blockers, and a plural presentation that keeps raw proposal, judgment, and adjudication event identities separate.
- `artifacts`: stable logical identity, content and byte digests, source ranges, availability, and append-only supersession lineage. It does not construct, seal, or certify artifacts.
- `testGate`: raw required-check results and the observed gate verdict.
- `status`: typed lifecycle provenance, projection health, admission, terminal state, shadow posture, and a permanently off mode gate.

The public surface mirrors the golden reducer contract: event routing, ordering,
codec, schema and reducer versions, reducer identity/set/surface, initial state,
projection integrity digest, full/checkpoint fold, verified-event reduction,
surface verification, closed projection assertions, immutable clone helpers,
legacy projection, and typed reducer errors.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is additive-dark and has no writer or authority path. Fixtures create
events through the landed typed producer and drive the real registry-backed fold.
The shared mode contract owns the verified-event reduction signature; this leaf
adds only council mappings and projections. The test suite drives real
`VerifiedLedgerEvent` values through both the named reducer export and the
declared reducer surface, comparing each complete reduction with the pure-fold
oracle for the same ordered event sequence.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

The fold has no clock, randomness, filesystem, network, logging, model, or
mutable external lookup. Canonical JSON plus stable array ordering yields the
same projection and fingerprint for the same ordered events.

Replay fails closed on unknown typed events, schema drift, stream changes,
out-of-order input, sequence gaps, predecessor-digest mismatch, incompatible
projection versions, truncated sources, and checkpoint-integrity mismatch.
Checkpoint integrity binds the projection fingerprint, authenticated source
tail sequence, and source tail digest. A digest-consistent checkpoint is also
revalidated for status and cross-array referential consistency.

Dependent evidence must cite a captured predecessor: dispatches cite selected
seats; critiques and blinded candidates cite proposals; ballots cite blinded
candidates; bias audits and adjudications cite judgments; stances cite captured
evidence and prior stances; source ranges cite seen events; supersession cites a
prior artifact; and terminal completion cites the required convergence,
deliberation, gate, artifact, and ledger-tail evidence.

Raw agreement, calibrated support, raw score vectors, ballots, minority
references, contradictions, and hard vetoes remain independent fields. The
derived presentation cannot erase them, and a hard veto or required-gate
failure blocks terminal convergence regardless of scalar support.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 17 tests |
| Real substrate | PASS: fixtures and reducer import the landed typed registry/producer and shared mode contract |
| Fold oracle parity | PASS: `reduceDeepAiCouncilVerifiedEvent` and `DEEP_AI_COUNCIL_REDUCER_SURFACE.reduce` produce the exact canonical projection and integrity fingerprint returned by `foldDeepAiCouncilEvents` for the same ordered events |
| Surface verification | PASS: `verifyDeepAiCouncilReducerSurface` accepts the declared surface and rejects incomplete field ownership |
| Canonical ordering | PASS: recursively reordered object-key insertion yields a byte-identical projection and integrity fingerprint while ledger event order remains strict |
| Anti-vacuous negatives | PASS: real fold calls reject gaps, array-level reordering, phantom sources, forged checkpoints, contradictory checkpoints, impossible transitions, forged terminal tails, and wrong-kind terminal references |
| Role blinding | PASS: scorer-facing adjudication serialization contains no seat or model identity |
| Hard veto | PASS: raw agreement and calibrated support at 1.0 remain blocked when a hard veto exists |
| Legacy parity | PASS: complete canonical legacy structure equals the frozen fixture; no subset comparison |
| Runtime TypeScript own path | PASS: zero diagnostics for the module and test |
| Strict packet validation | PASS: exit 0, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The new public entry point is
`runtime/lib/deep-ai-council-reducers/index.ts`. Downstream siblings consume
`DeepAiCouncilProjectionState`, `DeepAiCouncilProjectionCheckpoint`,
`DeepAiCouncilFoldResult`, `DEEP_AI_COUNCIL_REDUCER_SURFACE`, and the seven
projection-family interfaces. Do not widen these closed evidence shapes back to
open records.

No sealed-artifact writer, certificate, receipt issuer, rollback switch,
authority cutover, legacy-writer deletion, or active mode gate was added.
`rollback_recorded` is only observed as a blocked status because rollback
execution belongs outside this reducer leaf.
<!-- /ANCHOR:limitations -->
