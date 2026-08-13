---
title: "Implementation Summary: Model Benchmark Reducers and Projections"
description: "The additive-dark Model Benchmark fold extends the unchanged deep-improvement-common reducer with exhaustive event reduction, forward-only matrix cells, abstention-preserving ranking, and addressable scoring, lifecycle, pairwise, cost, latency, status, and replay projections."
trigger_phrases:
  - "model benchmark reducers implementation"
  - "model benchmark projection fold"
  - "model benchmark scoring matrix replay"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-23T14:36:30Z"
    last_updated_by: "codex"
    recent_action: "Carried cited judge abstentions into ranking eligibility"
    next_safe_action: "Consume the additive shadow projection in the next model leaf"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-projection-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "model-benchmark-reducers-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The composite projection preserves the exact common state under common"
      - "Every stream advances from its own last-seen sequence"
      - "Raw observations cannot become rankings without typed sealed evidence and reduction events"
      - "Score writes remain pinned to backend:deep-improvement-score"
      - "Every registry-admitted model event has an explicit fold case"
      - "Contamination and case lifecycle evidence invalidate existing rankings"
      - "Pairwise results and cost/latency slices are separate records"
      - "All event references validate the expected producer stem"
      - "Blocking unresolved validity abstains and later evidence re-ranks"
      - "Cited invalid judge observations abstain unless superseded"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-reducers-and-projections |
| **Implemented** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; existing execution and shared common authority remain unchanged |
| **substrateImportsReal** | true |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`model-benchmark-reducers` folds the landed typed event union into an immutable composite projection. The exact
`DeepImprovementCommonProjectionState` remains nested under `common`. Model-owned state lives under
`modelBenchmark`, split into run and iteration/convergence state, a content-addressed artifact index, a scoring
matrix, and a namespaced mode-status extension. The exported fold-entry list contains the real common fold branch
plus one model-specific branch; it does not add fields to the common projection.

The replay boundary validates every input through the real model-benchmark event registry. It tracks event identity
and the last sequence independently for each logical stream, returns named rebuild results for gaps or stale order,
binds checkpoint integrity to both projection bytes and every stream frontier, and rejects digest-mismatched
references before advancing state. Every reference field also supplies an allowed producer-stem list, so a captured
event of the wrong kind cannot satisfy lineage merely by matching an ID or digest. Projection records use canonical
ordering, the input projection is never mutated, and every public result is recursively frozen.

The scoring matrix stores raw observations, score vectors, judge observations, oracle labels, contamination evidence,
exposure and case lifecycle, pairwise comparison results, cost/latency slices, validity cards, sealed selection
evidence, and rankings as separate addressable records. A ranking appears only after a typed
`selection_reduction_requested` event that references typed sealed evidence. Missing measurements, failed or unknown
hard floors, contaminated or exposed cases, disclosed/retired/replaced cases, validity blockers, and common hard
vetoes keep a candidate ineligible. Unknown-validity records retain the blocker flag and required evidence by
validity plan. An affected ranking abstains while either the blocker or any required evidence remains unresolved;
a later validity card that cites the required evidence clears it and re-derives existing rankings. Late validity,
contamination, or lifecycle evidence therefore cannot leave stale eligibility behind.

Sealed judge evidence is also executable at ranking time. For each candidate's cited scores, the reducer consumes
cited judge observations and blocks explicit abstention, unknown or not-observed disagreement, confidence at zero,
or uncertainty at one. Repeated evidence supersedes an earlier block only when the later event is from the same
evaluator identity for the same score and calibration slice on the same ledger stream. Independent evaluator
abstentions therefore remain visible instead of being erased by an unrelated supporting observation.

The specific-event fold maintains an explicit handled-stem inventory. Registry growth without a matching fold case
returns `rebuild_required` with `unhandled-event-stem`; the switch default also raises the matching typed reducer
error. Matrix cells use a forward transition table, so a completed cell cannot be replaced by a later admitted event.

### Projection families

| Family | Current state |
|--------|---------------|
| Iteration/convergence | Run lifecycle, matrix designs and blocks, explicit cell dispositions, unresolved evidence, coverage, and resumable per-stream frontiers |
| Artifact index | Capsule, workload, design, raw result, usage, score, calibration, validity, and selection references plus digests and producer lineage |
| Scoring matrix | Raw observations, scores, judge and oracle evidence, contamination, exposure and lifecycle, pairwise results, cost/latency slices, validity cards and unresolved-validity records, sealed adjudication evidence, and derived rankings |
| Mode status | Active matrix profile, incumbent, matrix coverage, ranking state, blocking cells, and inherited common veto codes |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/model-benchmark-reducers/model-benchmark-projection-types.ts` | Created | Composite, projection-family, checkpoint, ranking, and result types |
| `runtime/lib/model-benchmark-reducers/model-benchmark-projection-schema.ts` | Created | Projection assertions, errors, canonical immutable cloning, and frozen-state checks |
| `runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts` | Created | Common delegation, model event fold, per-stream replay, referential integrity, checkpoints, rankings, and mode surface |
| `runtime/lib/model-benchmark-reducers/index.ts` | Created | Stable `MODEL_BENCHMARK_*` and mode-renamed public exports |
| `runtime/tests/unit/model-benchmark-reducers.vitest.ts` | Created | Real-fold, real-registry, checkpoint, adversarial, abstention, scoring, common-oracle, and verified mode-surface coverage |
| Leaf packet docs | Updated | Completion state, decisions, verification evidence, and downstream handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is additive-dark and has no authoritative consumer. It imports the landed model-benchmark ledger schema,
the real common projection constructor, reducer surface, fold branch, and legacy projection. Shared events are
registry-validated and then delegated through the common reducer surface, so shared raw-versus-derived checks,
vetoes, transitions, and validation stay single-source. The only generic adaptation is at that runtime-validated
transport boundary. No golden module, common reducer, ledger schema, or frozen substrate file changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the common projection exact under `common` | Model fields cannot widen or fork shared evaluator, canary, promotion, rollback, or veto semantics. |
| Validate combined ordering per stream before reduction | Independent streams may each begin at sequence one; a single global tail would reject valid replay. |
| Bind checkpoints to all stream frontiers | A forged tail or truncated stream becomes a rebuild result before state is advanced. |
| Hash the complete typed `TrialMatrixKey` | Cell identity remains stable across providers, tasks, protocols, recipes, seeds, routes, frameworks, tools, and attempts. |
| Derive rankings only from typed sealed evidence and reduction events | Raw results and observations never acquire adjudication authority by being present. |
| Preserve blockers outside the aggregate | Weighted score arithmetic cannot erase a hard floor, contamination or lifecycle block, validity blocker, or common veto. |
| Carry cited judge invalidity into eligibility | A raw score cannot erase an abstention, inconclusive disagreement, confidence floor, or uncertainty maximum present in its sealed evidence. |
| Supersede only the same evaluator on one stream | A corrected observation can restore eligibility without allowing an unrelated evaluator to erase another evaluator's abstention. |
| Require an allowed producer stem at every event reference | Existence and digest equality do not prove that lineage points to the required evidence kind. |
| Retain unknown validity by plan until its evidence resolves | The blocker flag and unresolved references must affect ranking, and later evidence must deterministically clear them. |
| Inventory every registry-admitted specific stem | Schema growth cannot silently become a no-op projection. |
| Enforce forward-only cell transitions | A later validly ordered event cannot regress an already advanced matrix cell. |
| Re-derive rankings after late case evidence | Existing ranks cannot remain eligible after contamination, exposure, disclosure, retirement, or replacement. |
| Project judge and usage events twice by purpose | Raw judge/usage evidence remains intact while pairwise and cost/latency consumer records stay directly addressable. |
| Keep legacy output complete and shadow-only | Additive-dark readers can compare a full compatibility view without taking authority. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 33 tests passed |
| Determinism | PASS: repeated replay and recursively key-reordered inputs are byte-identical |
| Per-stream ordering | PASS: four streams maintain independent frontiers; gaps and out-of-order inputs block |
| Referential and tail integrity | PASS: phantom sources, real wrong-kind sources across all 17 reference fields, and forged checkpoint tails are rejected; all 17 correct-kind controls are accepted |
| Raw/derived boundary | PASS: raw observations and scores exist before rankings; only typed selection reduction derives rank |
| Fold completeness | PASS: all unique registered specific stems equal the explicit handled-stem inventory; seven formerly omitted stems mutate their projection records |
| Cell transitions | PASS: completed-to-admitted regression is rejected while admitted-to-dispatched checkpoint continuation succeeds |
| Veto precedence | PASS: failed and unknown hard floors remain unranked; confirmed contamination invalidates rank and marks scores/comparisons |
| Unknown validity | PASS: blocker plus unresolved required evidence abstain ranking; a later matching validity card clears both and re-ranks |
| Cited judge abstention | PASS: abstained and otherwise invalid cited observations remain ineligible; genuine evidence ranks; a later same-evaluator observation supersedes the earlier abstention |
| Lifecycle precedence | PASS: exposure, disclosure, retirement, and replacement invalidate affected rankings |
| Addressable records | PASS: judge observations, oracle labels, contamination, exposure, case lifecycle, pairwise results, and cost/latency slices remain separate |
| Common extension | PASS: shared event output is byte-identical to the unchanged common fold oracle |
| Verified mode surface | PASS: real `VerifiedLedgerEvent` reduction matches the fold oracle |
| Runtime TypeScript project | PASS: whole-runtime `tsc` exits 0; diagnostics for `runtime/lib/model-benchmark-reducers/` = 0 |
| Comment hygiene | PASS: comments describe durable registry and transport boundaries only |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after description and graph metadata refresh |
| Scope audit | PASS: path-scoped status lists only the new module, unit test, and this leaf's docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No authoritative consumer.** The projection is additive-dark; execution, evaluation, sealing, certification, promotion, and rollback stay outside this leaf.
2. **No inferred adaptive selection.** The landed schema has no adaptive-selection event family, so the fold records no propensity or quota facts and fails closed on unknown extensions.
3. **No repair path inside replay.** Invalid order, missing sources, incompatible versions, or checkpoint tampering require a rebuild; the reducer never repairs ledger history.

Projection-family completeness is no longer a known limitation. Every unique model-specific stem in the landed
registry has an explicit fold case, and pairwise plus cost/latency consumer records are present.
<!-- /ANCHOR:limitations -->
