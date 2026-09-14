# Iteration 5: D5 Completeness — the remaining changed surfaces and the phase evidence

## Focus

Dimension: **completeness** (D5, cross-cutting).
Files: `runtime/scripts/fanout-run.cjs` (registry check, advisory emission, lane completion contract), `runtime/scripts/fanout-pool.cjs`, `runtime/scripts/fanout-merge.cjs`, `runtime/scripts/reduce-state.cjs` and `deep-research/scripts/reduce-state.cjs`, the seven child-phase packets' acceptance criteria, and the runner's own completion contract (read to confirm this lineage satisfies it).
Scope: the fix phases' declared scope checked against their shipped evidence, and the paths not yet read line by line in iterations 1-4. Static evidence only.

## Scorecard

- Dimensions covered: completeness
- Files reviewed: 5 primary + 8 supporting
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.25

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F-024**: The empty-registry advisory checks the research registry key and misfires on every review lane, `fanout-run.cjs:860-876, 882, 3526-3539`. `hasLineageKeyFindings` accepts a registry only when `registry.keyFindings` is a non-empty array (`:868`), which is the key the deep-research reducer writes (`deep-research/scripts/reduce-state.cjs:2353, 2451`) — the review reducer writes its findings under `openFindings` (`runtime/scripts/reduce-state.cjs:1557, 1565`; the alias `findings` is what the merge coerces, `fanout-merge.cjs` normalization). For loop type `review` the registry file list is exactly `['deep-review-findings-registry.json']` (`:825-828`), so any review lane whose deltas hold `type: "finding"` rows and whose registry is complete will still be reported as `lineage_registry_empty` on the orchestrator ledger. The only test for the new check uses a research lane and a lane that writes no registry at all (`fanout-run.vitest.ts:4303-4373`, `--loop-type research`, stub writes deltas only), so the false-positive path is untested. The advisory is non-fatal and the merge reads `openFindings` correctly, so the lane still completes; the cost is a misleading data-integrity warning on every review lane, which the operator or a later triage pass will chase.
  Recommendation: accept `openFindings` (and the coerced `findings` alias) for review, or delegate the emptiness question to the merge's normalization so the two cannot disagree.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | carried from iteration 3 | hard | already failing | Not re-run; no new contract surface reviewed |
| checklist_evidence | not applicable | advisory | no `checklist.md` in the packet or any child phase | Carried from iteration 3 |
| feature_catalog_code | carried from iteration 4 | advisory | F-023 | — |

## Assessment

- New findings ratio: 0.25 (one new finding; the iteration's work was largely confirmatory).
- Dimensions addressed: completeness.
- Novelty justification: F-024 sits on the phase-006 check that no earlier iteration audited (iterations 1-2 reviewed the guard and runner write paths, 3 the documents, 4 the call-site shape), and it is the only defect the cross-cutting sweep found.

## Claim Adjudication

No P0/P1 findings this iteration; no adjudication packets required.

## Ruled Out

- **The runner's lane-completion contract is satisfied by this lineage's artifact shape.** `iterationNumbersOnDisk` parses any digit width (`fanout-run.cjs:713-717`), so `iteration-001.md` … `iteration-005.md` resolve to 1..5; `forcedDepthIterationViolation` requires exactly that set on disk and in the retained state records (`:754-775`), which this lineage writes; the review artifact it requires is `review-report.md` (`:691`) plus the state log, and a synthesis event whose `stopReason` begins with "maxiteration" (`:893-896, 998`). No naming mismatch.
- **Per-lineage executor provenance works as phase 003 claims.** `fanout-merge.cjs:1202-1211` resolves each lineage's kind/model from `invocation-metadata.json` through the `executor_start` event to the summary entry, degrading to `unknown`; the attribution table emits kind and model (`:883-896`). Covered by `fanout-merge.vitest.ts:538, 878, 1372, 1412`.
- **Phase 002's duplicate-iteration handling is correct and tested.** `retainIterationRecords` prefers the route-proof copy (`fanout-run.cjs:726-740`); tests cover the duplicate-with-gap rejection, the route-proof preference and the duplicate-file rejection (`fanout-run.vitest.ts:610-663`).
- **Phase 006's review-reducer half surfaces its warning.** `reduce-state.cjs:2141-2154` catches only `MISSING_ANCHOR`, keeps the strategy file untouched and carries `strategyWarning` to stderr and the result (`:2273-2288`); any other error still propagates.
- **Phase 007's evidence is real, not stale like the parent's.** `acceptance-criteria.md:57-59`: the "151 files" figure matches the tree at HEAD (145 `.vitest.ts` plus 6 `.test.ts` under `runtime/tests`, with `vitest.config.ts:17` including both), and the cited `007-worktree-removal/research/orchestration-summary.json` exists with the claimed two-lane settlement.
- **Pool settlement of advisory lanes is correctly separated.** An advisory lane increments both `succeeded` and `completed_with_containment_advisory` and emits a flagged event (`fanout-pool.cjs:36, 627-629, 893, 904`); nothing recategorises it as a failure.
- **The churn detector's threshold semantics match the config contract.** Zero disables an arm, both zero disables the sampler, and detection latches preserve before the ledger append (`fanout-run.cjs:2822-2827`, detector factory).

## Dead Ends

- Hunting for a runner-side path that turns fatal containment violations into a rejected lane: the only caller treats every violation class as the same advisory terminal state (`fanout-run.cjs:3486-3493`), which is what REQ-003 asks for; the fatal/advisory partition governs the payload and the `dataLossPossible` event, not the outcome.
- Looking for test files orphaned by the worktree-suite deletion in the runner's glob: none; the included set is complete and the deleted suites left no empty directories under `runtime/tests/unit`.

## Recommended Next Focus

None — the five planned angles are covered. Proceed to synthesis.

Review verdict: PASS
