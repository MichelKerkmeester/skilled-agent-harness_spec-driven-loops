---
title: "Implementation Summary: Deep Research Reducers and Projections"
description: "The additive-dark Deep Research ledger now folds into deterministic, immutable plan, claim, convergence, artifact, and status projections without changing legacy authority."
trigger_phrases:
  - "deep research reducer implementation"
  - "deep research projection contract"
  - "deterministic research replay"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-22T06:08:00Z"
    last_updated_by: "codex"
    recent_action: "Bound checkpoint tail integrity"
    next_safe_action: "Downstream projection consumption"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-reducers-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 23 typed event stems route to one closed reducer ownership surface"
      - "Canonical stream ordering and version-bound checkpoints define replay identity"
      - "Legacy comparison output remains frozen, lossy, and shadow-only"
      - "Synthesis events cannot create terminal convergence without stop eligibility"
      - "Completion references resolve to folded events for every terminal status"
      - "Opaque stream labels never participate in ordering or supersession decisions"
      - "Checkpoint resume replays status provenance and convergence invariants"
      - "Un-cleared poisoned-source evidence forces quarantined convergence and status"
      - "Source capture advances the convergence cursor because it can change that plane"
      - "Terminal convergence requires valid report and continuity-save artifacts"
      - "Checkpoint cursor-gap detection is enabled unless explicitly disabled"
      - "Eligibility and finalized revision change only on convergence evaluation or block events"
      - "Distinct source versions with identical bytes retain distinct full-digest artifact identities"
      - "Trusted and terminal references resolve across captured sources, evidence, and claims"
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
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; the legacy Deep Research path remains unchanged and authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Research events now reduce into byte-stable, immutable projections that downstream artifact and certificate work can consume without reparsing mutable reports. The module uses the predecessor's exact `DeepResearchLedgerEvent` union and the shared `ModeContract.reduce()` ownership surface, while retaining raw observations separately from trusted judgments.

### Closed deterministic projection surface

`foldDeepResearchEvents` canonicalizes persisted run, lineage, logical sequence, and event identity before folding. Opaque stream labels remain display provenance only. It emits `DeepResearchProjectionState`, a projection-identity digest, and a version-bound `DeepResearchProjectionCheckpoint`. The exported `deepResearchProjectionIntegrityDigest(projection)` and the fold result's top-level `integrityDigest` remain projection-only. The checkpoint's existing `integrityDigest` now hashes that projection identity together with `sourceTailSequence`, so a forged tail cannot mask a dropped-event gap. Full and incremental folds share the same reducer, and incompatible schema, reducer, codec, ordering, cursor, truncation, or checkpoint state returns `rebuild_required`. Checkpoint tail-contiguity checks are enabled by default; only an explicit `requireContiguousTail: false` opts out.

The projection contains a research-plan DAG, the claim/evidence/contradiction ledger, iteration history, convergence evaluations, artifact references, status provenance, per-plane cursors, and seen-event identities. Public projection interfaces are closed. Runtime validation dispatches every field through an exhaustive semantic-kind rule and rejects undeclared keys, malformed digests, prose in selectors, and any prose field not ending in `Reason`.

### Fail-closed ownership and lifecycle behavior

`DEEP_RESEARCH_PROJECTION_FIELD_OWNERSHIP` assigns all 13 persisted top-level fields to `DEEP_RESEARCH_REDUCER_ID`. `verifyDeepResearchReducerSurface` executes the real shared reducer signature twice and rejects duplicate owners, unowned writes, mutation, unfrozen output, and canonical nondeterminism.

Convergence retains exact `rawSignals`, `trustedSignals`, and `qualityGateResults` shapes from the typed ledger. Stop eligibility unconditionally requires admitted clean evidence attached to a supported active claim, and that evidence's `sourceVersionId` must resolve to a real captured source in the projection. A phantom-sourced admission therefore produces `INDETERMINATE` eligibility, a `blocked` outcome and status, and trusted evidence yield `0`; a self-reported yield cannot substitute for referential ledger evidence. Eligibility and finalized revision are evaluator-owned: only `convergence_evaluated` and `convergence_blocked` can change them, so a later claim cannot reuse a stale quality-gate snapshot. Claim, relation, and supersession events remain outside the convergence plane and do not advance its cursor. Declared source, admission, and gap feeders can still refresh quarantine, observation, and blocker state with matching cursor coverage. A flagged instruction scan present at evaluation has higher precedence than `converged` or `incomplete`: eligibility remains `INDETERMINATE`, the convergence outcome and mode status remain `quarantined`, and no finalized revision or terminal convergence is produced. Every ordering surface uses persisted logical identity, iteration where present, logical sequence, and producer event ID; stream ID remains provenance and never selects current convergence, status, seen-event order, or artifact supersession. Synthesis events are status-neutral. Stop eligibility without a valid `research-report` and valid `continuity-save` remains non-terminal, and the same artifact invariant is rechecked when resuming a checkpoint. Artifact entries contain identities, full digests, versions, locators, receipt references, validity, and supersession links, never report or source bodies. Source artifact IDs bind a digest of `sourceVersionId` to the complete content digest, so independent same-content captures retain distinct provenance. Every run-completion reference must resolve to the required convergence, synthesis, and memory-save event family for incomplete, blocked, and completed outcomes; completed runs additionally require a stop-eligible convergence event, valid synthesis reference, and valid continuity receipt. Terminal projection validation also requires every evidence source, claim evidence identity, and active claim identity to resolve inside the corresponding projected arrays. A second terminal event fails closed.

The reducer does not reject evidence admission at fold time. Real events are ordered only by run, lineage, logical sequence, and event ID, and the producer schema does not require a source capture to precede its admission. Because `assertDeepResearchProjectionState` runs after every applied event, cross-array membership checks are restricted to terminal projections: legitimate interleaving can settle later, while an unresolved terminal projection fails with `projection-field-invalid`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-reducers/deep-research-projection-types.ts` | Created | Closed projection, checkpoint, result, status, and ownership types |
| `runtime/lib/deep-research-reducers/deep-research-projection-schema.ts` | Created | Exhaustive semantic-kind validation and recursive immutable cloning |
| `runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Created | Event routing, pure folds, ownership verification, replay digest, checkpoint handling, and legacy view |
| `runtime/lib/deep-research-reducers/index.ts` | Created | Stable public exports for downstream siblings |
| `runtime/tests/unit/deep-research-reducers.vitest.ts` | Created | Replay, parity, field-discipline, ownership, mutation, and rejection fixtures |
| `decision-record.md` | Created | Quarantine precedence, convergence-plane routing, and the inert authorization-frame observation |
| Leaf packet docs | Updated | Completion state, evidence, generated metadata, and downstream contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reducer module is additive-dark and has no writer, filesystem, network, clock, randomness, model, seal, certificate, resume, parity, or gate dependency. Fixtures construct events through the real typed-ledger producer and verify mode reductions through the real shared `ModeContract.reduce()` signature. The legacy reader and writer remain untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Canonicalize by persisted logical identity | Arrival order and process timing cannot change replay output. |
| Keep public projection interfaces closed | The shared mode adapter requires a narrow `JsonObject` intersection, but evidence-bearing projection types must not expose an open index signature. |
| Recompute derived current views from immutable histories | Late events, supersession forks, and checkpoint replay remain equivalent to a clean fold. |
| Bind projection integrity to schema, reducer, codec, ordering, and content | A prior output digest never becomes its own input, and incompatible versions rebuild instead of silently reusing state. |
| Preserve raw and trusted convergence shapes verbatim | Raw novelty cannot become trusted yield through fallback or a renamed field. |
| Give un-cleared quarantine precedence over stop decisions | A poisoned source cannot become terminal success after its claim is admitted and supported. |
| Route source capture to convergence | The event can change convergence outcome, so its declared ownership and cursor must cover that plane. |
| Keep eligibility and finalized revision evaluator-owned | Claim-ledger changes cannot retroactively reuse an earlier quality-gate snapshot; a fresh convergence event is required. |
| Bind source artifact identity to source version plus full digest | Independent sources with identical bytes remain distinct and replay never fails on a content-only collision. |
| Exclude stream labels from every ordering decision | Opaque partition labels remain provenance and cannot control replay, status, selection, seen-event order, or artifact supersession. |
| Keep synthesis lifecycle events status-neutral | Report assembly cannot imply stop eligibility or terminal convergence. |
| Validate completion references before success-only gates | Incomplete and blocked outcomes do not claim success, but their identifiers must still resolve to the required event families. |
| Re-derive checkpoint status before resume | A schema-valid, digest-consistent checkpoint cannot silently reuse cross-field state that no legitimate replay can produce. |
| Bind checkpoint integrity to its source tail | Gap and truncation logic trusts `sourceTailSequence`, so the checkpoint digest covers it together with the unchanged projection-identity digest. |
| Gate terminal convergence on valid completion artifacts | An evaluator decision and stop eligibility cannot stand in for a committed report plus durable continuity save. |
| Detect checkpoint cursor gaps by default | Incremental replay fails closed unless a caller explicitly accepts non-contiguous tail semantics. |
| Require captured-source membership for trusted claim evidence | An admitted clean record cannot contribute stop eligibility or trusted yield unless its source version exists in the captured-source ledger. |
| Enforce referential integrity when a projection becomes terminal | Intermediate folds may legitimately receive related events out of order, but settled source, evidence, claim, and active-claim references cannot remain dangling. |
| Keep artifacts referential | Sealing and certification remain downstream responsibilities; this leaf records only stable references, receipts, validity, and lineage. |
| Fail closed on terminal ambiguity | Completion requires all referenced evidence, and duplicate terminal events are rejected. |
| Mark the legacy view `shadow-only` and `legacyAuthority: unchanged` | Compatibility output cannot become a second authority or authorize cutover. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 45 tests passed, including forged-tail rejection, untampered checkpoint continuation, phantom-source blocking, captured-source positive control, terminal phantom-evidence rejection, stale-evaluation ownership, distinct-source same-content artifacts, artifact-gated terminal convergence, default cursor-gap rejection, flagged-source quarantine, convergence-cursor ownership, replay determinism, incremental/full parity, and adversarial reducer failures |
| Real substrate | PASS: `substrateImportsReal: true`; fixtures import the real typed-ledger registry/producer, canonical envelope codec, reducer exports, and shared mode contract rather than a parallel mock substrate |
| Referential-integrity falsifiers | PASS: removing captured-source membership made the phantom run `STOP_ELIGIBLE`/`converged` with yield `0.3`; inverting membership broke the captured-source control; removing the terminal invariant let a dangling claim-evidence reference finish without rejection |
| Checkpoint-binding falsifier | PASS: temporarily restoring projection-only checkpoint digests made both new tests fail—the forged 2-to-500 tail projected event 501, and the positive control detected that checkpoint integrity no longer matched the tail-bound digest |
| Stream-label invariance | PASS: swapping opaque labels cannot change current convergence, status replay, seen-event order, or artifact validity and supersession classification |
| Checkpoint integrity | PASS: forging `sourceTailSequence` from 2 to 500 while retaining the valid projection and prior checkpoint digest rebuilds with `checkpoint-digest-mismatch`; the untampered checkpoint folds the next real event; a genuine gap still rebuilds with `cursor-gap`; zero-event resume still rejects digest-consistent cross-field contradictions |
| Completion reference integrity | PASS: nonexistent IDs and existing wrong-kind IDs on an incomplete completion event are rejected before status projection |
| Regression discovered during author pass | PASS after fix: a second validly referenced `run_completed` event now throws `duplicate-terminal-event` |
| Stale convergence falsifier | PASS after fix: an incomplete evaluation followed only by a supported claim stays `INDETERMINATE` with an unchanged convergence cursor; a fresh evaluation becomes stop-eligible and advances the cursor |
| Artifact collision falsifier | PASS after fix: two source versions with one content digest produce two artifact IDs and retain their own logical source identities and receipts |
| Runtime TypeScript project | PASS: project-pinned `tsc --noEmit -p runtime/tsconfig.json` exited 0 with zero errors before documentation closeout |
| Comment hygiene | PASS: every new TypeScript file passed the project checker with zero ephemeral artifact labels |
| Projection contract audit | PASS: all 23 event stems route; all 13 persisted fields have one owner; every sort/comparator was inspected; no ordering, selection, or supersession key uses `streamId`; `sourceTailSequence` was the only trusted checkpoint field outside the covered projection; exported projection type shapes and the exported projection-digest signature/output are unchanged |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 after generated-description and scoped graph-metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No sealed artifacts.** `003-sealed-artifacts` consumes the plan, claim, convergence, artifact-index, and status projections and owns construction and sealing.
2. **No certificates or receipts.** `004-certificates-and-receipts` certifies projection-derived evidence; this leaf only indexes receipt references already present in typed events.
3. **No resume, parity, cutover, or gate behavior.** Those remain owned by later sibling leaves and phase 014.
4. **No authoritative writer.** The reducer is dark and read-only; the legacy path remains unchanged and authoritative.
5. **The shared mode contract requires a JSON-object generic.** The adapter contains that requirement in `DeepResearchModeContractState`; downstream consumers must use the exported closed projection types and must not widen them back to open records.
6. **Authorization-frame behavior remains outside this reducer.** The unit helper constructs a complete verified frame, but the reducer intentionally consumes only `verified.event`; gateway authorization is owned by the upstream ledger boundary and no reducer code changed for this inert observation.
<!-- /ANCHOR:limitations -->
