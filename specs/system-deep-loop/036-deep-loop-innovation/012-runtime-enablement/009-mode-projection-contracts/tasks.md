---
title: "Tasks: Mode Projection Contracts"
description: "Staged task list: a surface-composition foundation, then one projection contract per foldable mode-owned surface proven against its real consumer, then the honest reclassification of the three surfaces the build proved are not ledger folds, then coverage integration."
trigger_phrases:
  - "mode projection contracts tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "Reconciled tasks to the final state: six contracts built, three reclassified"
    next_safe_action: "Proceed to 004-legacy-writer-retirement"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three surfaces are reducer output or operator input, not ledger folds"
---
# Tasks: Mode Projection Contracts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

|| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-001** Build the `review-state` single-file jsonl contract as the proven pilot pattern. [EVIDENCE: `deep-review-state-contract.ts` + `deep-review-state-contract.vitest.ts`; byte proof + real `reduceReviewState` proof + negative control; coverage `covered=2`]
- [x] **T-002** Extend the type system: `LegacyProjectionFormat` gains `'md'`; add `LegacyProjectionSurfaceContract` and `foldLegacyProjectionSurface`. [EVIDENCE: `legacy-projection-types.ts` + `legacy-projection-surface-fold.ts`; single-artifact engine unchanged; `legacy-projections.test.ts` still 14 passed]
- [x] **T-003** Prove the foundation: a mixed (jsonl+md) surface and a per-iteration delta fan-out fold correctly, with a negative control. [EVIDENCE: `legacy-projection-surface-fold.vitest.ts` 2/2; independent negative control flip→RED, restore→GREEN]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each folds its mode's ledger events into the legacy files its consumer reads; each is proven against the real consumer with an independent negative control.

- [x] **T-004** `review-deltas` (per-iteration `deltas/iter-NNN.jsonl`). [EVIDENCE: `deep-review-deltas-contract.ts` + test; fan-out byte proof + real `loadDeltaPayloads`/`buildRegistry` proof (openFindingsCount===2); independent negative control red/green; coverage `covered=3`, modeOwned.uncovered=7]
- [x] **T-005** `research-deltas` (per-iteration `deltas/iter-NNN.jsonl`). [EVIDENCE: `deep-research-deltas-contract.ts` + test 3/3; real `verify-iteration.cjs` proof (ok:true both iters); independent negative control (PARTITION_BY_ITERATION) 3 RED/3 GREEN; coverage modeOwned.uncovered=3]
- [x] **T-006** `alignment-state-deltas` (`deep-alignment-state.jsonl` + deltas). [EVIDENCE: `deep-alignment-state-deltas-contract.ts` + test; state+fan-out byte proof + real `reduceAlignmentState` (iterationsRun=2, severities correct); independent negative control red/green; coverage modeOwned.uncovered=6]
- [x] **T-007** `improvement-ledgers` (`agent-improvement-state.jsonl` + `improvement-journal.jsonl`). [EVIDENCE: `deep-improvement-ledgers-contract.ts` + test 3/3; real consumer `deep-improvement/scripts/shared/reduce-state.cjs` proof; independent negative control (EMIT_SCORED_STATE_ROWS) 3 RED/3 GREEN; coverage modeOwned.uncovered=5]
- [x] **T-008** `council-config-state` — projects `ai-council-state.jsonl` + `session-state.jsonl`; `ai-council-config.json` honestly OMITTED (operator input; ledger carries only its digest; consumer tolerates absence). [EVIDENCE: `deep-ai-council-config-state-contract.ts` + test 3/3; real consumers `replay-graph-from-artifacts.cjs`/`advise-council-completion.cjs`/`round-state-jsonl.cjs`; independent negative control (EMIT_COUNCIL_COMPLETE_ROW) 3 RED/3 GREEN; coverage modeOwned.uncovered=4]
- [x] **T-009** `research-strategy-inbox` — resolved by reclassification to `retain-legacy-input`, NOT a built contract. `deep-research-strategy.md` is authored prose and `inbox.jsonl` is operator input; the ledger carries only `strategyDigest`+`focusRef`, never the content. Honest treatment = reclassify (serializerId null, refreshBoundary null, non-null nonProjectableReason + laterOwner), not a fabricated contract. [EVIDENCE: manifest disposition `retain-legacy-input`; no contract file written for this surface]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-010** `review-projections` — resolved by reclassification to `retain-legacy-input`, explicitly NOT built. Produced by the deep-review reducer from projected state and deltas, not folded from the ledger. [EVIDENCE: manifest disposition `retain-legacy-input`; no contract file written]
- [x] **T-011** `research-projections` — resolved by reclassification to `retain-legacy-input`, explicitly NOT built. Produced by the deep-research reducer from projected state and deltas, not folded from the ledger. [EVIDENCE: manifest disposition `retain-legacy-input`; no contract file written]
- [x] **T-012** Coverage checker reports `modeOwned.uncovered = 0`; both cross-check constants balanced. [EVIDENCE: `node scripts/check-projection-coverage.cjs` from the runtime dir → `{"ok":true,"projectable":19,"covered":7,"uncovered":12,"breakdown":{"modeOwned":{"total":7,"uncovered":0},"infrastructure":{"total":12,"uncovered":12}}}`, exit 0. Constants: `UNCOVERED_DECLARED_COUNT=12`, `MODE_OWNED_EXPECTED_COUNT=7`. Negative control: flipping one reclassified surface back to `project` → `modeOwned.uncovered=1` + `UNDECLARED_UNCOVERED_SURFACE` + exit 2; restored → `modeOwned.uncovered=0`, exit 0. The checker's own test (`tests/unit/check-projection-coverage.vitest.ts`) had a stale fixture builder seeded only with the review-state contract; corrected to seed all seven covered contracts so case 5 (`MISSING_CONTRACT_EXPORT`) again observes exactly the one violation it induces.]
- [x] **T-013** Full projection suite re-run and reported as a delta; failed-test count does not increase. [EVIDENCE: full projection suite (9 files) — 39 passed / 1 failed, exit 1. The single failure is PRE-EXISTING and OUT OF SCOPE: a `model-benchmark-hub-output` path drift (census `prompt-models` vs manifest `sk-prompt-models`, a separate hub-rename), not a projection-contract surface. No projection-contract test regressed.]
- [x] **T-014** `validate.sh 009-mode-projection-contracts --strict` — Errors: 0. [EVIDENCE: `validate.sh --strict` on this folder — Errors: 0]
- [x] **T-015** Authority store byte-identical to its pre-phase state. [EVIDENCE: `.opencode/skills/.authority-state/` unchanged — 009 changed no authority record]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-016** Seven mode-owned surfaces covered (six new contracts plus the pre-existing research-state pilot); the three non-foldable surfaces honestly reclassified. [EVIDENCE: coverage `covered=7`, `modeOwned.uncovered=0`; three surfaces at disposition `retain-legacy-input`]
- [x] **T-017** `implementation-summary.md` records the foundation, the six contracts, the three reclassifications, the coverage proof, and the suite delta. [EVIDENCE: `implementation-summary.md` §2 and §5]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

|| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Design | `decision-record.md` |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../003-fleet-enablement/` |
| Blocks | `../004-legacy-writer-retirement/` |
<!-- /ANCHOR:cross-refs -->
