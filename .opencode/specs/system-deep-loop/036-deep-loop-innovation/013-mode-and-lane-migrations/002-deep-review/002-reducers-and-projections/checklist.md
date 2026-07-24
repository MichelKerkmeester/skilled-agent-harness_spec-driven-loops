---
title: "Checklist: Deep Review - Reducers & Projections"
description: "Checklist for the Deep Review reducers and projections phase: deterministic typed-event replay, coverage-aware convergence, immutable artifact indexing, status projection, shared review-loop parity, and dark shadow verification."
trigger_phrases:
  - "Deep Review reducers and projections checklist"
  - "deep-review deterministic projection gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-23T19:01:48Z"
    last_updated_by: "codex"
    recent_action: "Verified causal cross-stream replay ordering"
    next_safe_action: "Consume the projection surface downstream"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Review - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Review reducers-and-projections child. The verifier replays the exact typed event sequence from a pinned fixture, records the schema and projection versions, compares canonical projection fingerprints, and reports field-level parity against the legacy Deep Review path. It must fail on hidden side effects, invalid transitions, missing required coverage, zero or skipped fixtures, unexpected authority changes, or unscoped tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The predecessor event schema is imported read-only through `deep-review-ledger-schema/index.js`; no ledger-schema file changed.
- [x] CHK-002 [P0] `reduceSharedReviewLoopBackbone` owns shared coverage, obligation, finding, and veto semantics; Deep Review contributes only typed event mappings and mode configuration.
- [x] CHK-003 [P1] `DEEP_REVIEW_PROJECTION_FIELD_OWNERSHIP` assigns every persisted field to one reducer; no projection persistence or writer was added.
- [x] CHK-004 [P1] The unit suite pins a complete inline legacy-view fixture and its `parityFingerprint`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] `foldDeepReviewEvents` uses only typed inputs and pure canonical helpers; the module imports no clock, filesystem, network, logger, or mutable state.
- [x] CHK-006 [P0] Causal input ordering, per-stream cursor baselines from checkpoint `seenEvents`, closed numeric rules, canonical JSON, `deepReviewProjectionIntegrityDigest`, and the tail-bound checkpoint digest are implemented and replayed in tests.
- [x] CHK-007 [P1] `DeepReviewFindingRecord` retains impact, confidence, reachability, exploitability, evidence strength, scope, and lifecycle separately from `presentationSeverity`; status health remains a separate projection.
- [x] CHK-008 [P1] Artifact availability and supersession are derived into new `DeepReviewArtifactRecord` values while event evidence stays immutable.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] The 90/90 targeted Vitest run compares repeated folds of the same causal multi-stream input byte for byte, including the integrity fingerprint; causally invalid reversed input fails closed.
- [x] CHK-010 [P0] Full and partial typed streams preserve immutable findings and artifact histories; `duplicateEventIds` records exact idempotent duplicates and conflicting identities reject.
- [x] CHK-011 [P0] Convergence and every `terminalStatus: completed` event share one current-state derivation before `reduceSharedReviewLoopBackbone`, covering required cells, obligations, active P0/P1 findings, and every open hard veto while requiring the citation and evaluator judgment from the most-recent folded clean convergence; incomplete and blocked lifecycle terminals may retain unresolved state and a latest continue decision.
- [x] CHK-012 [P0] Real `foldDeepReviewEvents` calls cover earlier- and later-sorting auxiliary streams, full causal genesis replay, pre-genesis rejection, new-stream gaps, correct interleaved stream advances, stream-label swaps, payload fingerprint tampering, impossible status transitions, projection-version mismatch, checkpoint forgery, and terminal ambiguity.
- [x] CHK-013 [P0] `DeepReviewArtifactRecord` carries logical identity, producer event, reviewed input, digest, kind, availability, and bidirectional supersession IDs.
- [x] CHK-014 [P0] `DeepReviewStatusProjection` derives state, terminality, health, contract versions, causal replay position, blocking reason, and shadow state from typed transitions in input order.
- [x] CHK-015 [P0] Hard-veto fixtures assert factored `DeepReviewFindingRecord` fields independently and prove only a `fixed` transition citing the target finding's own adjudication, owned predecessor, and actual projected prior lifecycle removes the veto.
- [x] CHK-016 [P0] Perfect weighted signals passed to `foldDeepReviewEvents` remain blocked by accepted and never-adjudicated vetoes across every legal finding-class separator; non-separated superstrings remain non-veto classes.
- [x] CHK-017 [P0] The exported shared-backbone input/result contract is mode-neutral; `mode: review | alignment` configuration keeps typed mappings at each mode edge, while cross-mode end-to-end verification remains deferred until the Deep Alignment reducer exists.
- [x] CHK-018 [P0] `projectDeepReviewLegacyView` emits the complete canonical comparison structure plus fingerprint, and the frozen inline fixture compares every field while authority stays `shadow-only`.
- [x] CHK-019 [P1] A missing per-stream sequence returns only `rebuild_required` with `cursor-gap`; never-seen streams start at one, and checkpointed streams resume from their own last-seen sequence.
- [x] CHK-020 [P1] Version and checkpoint mismatches return `rebuildReasons` without changing the projection or event history.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P1] `DEEP_REVIEW_EVENT_ROUTING` is exhaustive over `DeepReviewEventStem`, and the ownership table covers all persisted fields.
- [x] CHK-022 [P1] `DeepReviewArtifactIndexProjection` stores references and availability only; it creates no seals, signatures, certificates, or receipts.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-023 [P1] The reducer preserves independent evidence class, causal proximity, stability, and relevance; pass, evidence, supersession, adjudication, lineage, state, artifact, and completion references are scoped to their candidate, finding, iteration/dimension, or run owner. Finding and evidence IDs have one candidate owner and remain stable across revision chains; re-adjudication must cite the current adjudication exactly, while null remains valid only for the first adjudication. [Evidence: targeted Vitest passes 90 tests including earlier- and later-sorting cross-stream evidence and re-adjudication lineage, full causal genesis replay, invalid-order rejection, same-stream lineage retention, unrelated-entity isolation, run-level established-stream scoping, stale-convergence rejection, blocked/reset citation rejection, latest-clean acceptance, incomplete/blocked latest-continue controls, collision/rename rejection, null/wrong/correct/first chaining controls, candidate-scoped terminal evidence, completed-verdict late-blocker rejection, borrowed-reference rejection, and own-scope positive controls.]
- [x] CHK-024 [P2] Blocked replay exposes no partial-success result, hard vetoes retain P0 presentation, projections are recursively frozen, and the legacy view remains non-authoritative.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P2] The implementation summary and decision record document causal input ordering, the closed opaque-stream risk, separator-robust veto classification, referential ownership, the reusable backbone, tail integrity, and sibling boundaries.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Authored runtime changes are limited to `runtime/lib/deep-review-reducers/` and its dedicated unit suite; only this leaf's docs were updated.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the pure-fold replay fingerprint is stable, the three live projections and derived finding presentation have field-level evidence, the shared review-loop interface is structurally ready for Deep Alignment, shadow parity is recorded, and the typed ledger remains non-authoritative. Cross-mode end-to-end verification occurs when the Deep Alignment reducer is built.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms deterministic replay, fail-closed invalid input handling, immutable artifact indexing, coverage-aware convergence, shared-contract reuse, and no authority change outside the staged cutover phase.
<!-- /ANCHOR:sign-off -->
