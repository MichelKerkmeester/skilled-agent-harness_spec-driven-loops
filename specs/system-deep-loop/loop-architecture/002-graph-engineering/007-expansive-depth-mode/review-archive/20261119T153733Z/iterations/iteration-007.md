# Iteration 007 - Correctness (second pass: fan-out merge and run, upsert, divergent pivot, research reducer)

## Dispatcher
- Run 7 of 10, session 2026-11-19T04:20:12.962Z, generation 1, lineageMode new. Dimension: correctness (second pass on files not read in iteration 1).
- Operator focus addressed: code and runtime files of commit range 21c4b325b5a..1d2b49e4306 only; every cited path is in reviewScopeFiles. No overengineering or sk-code-alignment lens this iteration.

## Dimension
correctness

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs (frontier merge, partition guard, review coverage-surface merge)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs (seed partition, lineage budgets, lineage store seeding)
- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs (finding-id folding, derived evidence edges, orphan-edge pruning)
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts (per-attempt seat cap, one council retry)
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs (frontier projection, depth-band budget, frontier focus pick)
- .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts (frontier-unanswered seeds, open-frontier guard, per-attempt seat usage)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

No new finding this iteration. Every hypothesis below was read to a conclusion and closed as ruled out; none is held back as an uncertain finding.

## Traceability Checks
- spec_code: pass for the pivot-hygiene slice. The spec requires a 3-per-attempt seat cap, one retry on a quorum miss, and a parsed but unenforced minRemainingIterations (specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/spec.md:108). Code matches: cap check .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:759, retry only on attempt 1 quorum failure .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1504, a two-attempt loop .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1621, persisted limit still parsed .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1062.
- checklist_evidence: not run this iteration (no checklist claims read); left out rather than recorded as pending.

## Integration Evidence
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs hands each lineage its dealt share through writeLineageFrontierStore (.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:378); .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs reads the recorded frontier_partition back for the partition guard (.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:800). The lineage seed step is skipped for fan-out lineages (`skip_when: config.fanout_lineage_artifact_dir is present` in .skilled/commands/deep/assets/deep-review.yaml), and seedNodes refuses a second seed (.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:681).

## Edge Cases
- Partition guard flattens expected ids across lineages instead of checking per lineage (.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:800). Ruled out as a masking bug: dealt ids are depth-1 ids from the parent store, lineages only mint `F-<depth>-<serial>` children at depth 2 or deeper (.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:604), and a lineage never reseeds, so no lineage can report a depth-1 id it was not dealt.
- Research reducer matches inboxId against nodeId through normalizeQuestionId (.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2671); that function only trims (.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:223), so raw and normalized ids agree.
- Merged searchCoverage unions each bucket independently (.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1000), so a bug class covered by one lineage and deferred by another sits in both lists. Whether any consumer of the merged registry reads `deferred` as debt was not traced within budget; deferred, not a finding.

## Confirmed-Clean Surfaces
- upsert finding-id folding: this iteration's ids register before stored ids, so a reused id split into `finding:<id>#<n>` (.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:269) keeps the leaf's node and edges (.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:176); orphan edges are pruned before the batch so one bad endpoint no longer rolls back the whole write (.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:541).
- Divergent pivot retry: attempt 2 uses separate seat and deliberation event ids and paths; resume reuses persisted usage and limits, so the replayed pivot_started event cannot conflict.
- Review pivot ordinal is unchanged (`completedEvents.length + 1`, .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:465); open-frontier guard refuses a pivot while nodes are open (.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:405).
- Research depth-band budget (.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2524): answered nodes are marked before budget closes, roll-down happens only from a band with no open node, and the visit marker cannot match a longer id (.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2490).
- Fan-out partition is deterministic (sorted by nodeId, round-robin) (.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:314).

## Ruled Out
- Partition-guard masking by a colliding lineage-local id (see Edge Cases).
- Idle fan-out lineage reseeding the whole target (seed step skipped for lineages; seedNodes is idempotent).
- Removal of the remaining-iterations preflight as a regression (the spec retires it deliberately, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/spec.md:108).
- inboxId/nodeId normalization mismatch in the research frontier projection.
- Review-pivot quotedPaths stripping as a guard bypass (.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:189): scope text is adapter-built from admitted frontier nodes and the pivot stays read-only by contract; security is outside this iteration's dimension.

## Next Focus
- Dimension: traceability (cross-reference carry-forward).
- Focus area: record `checklist_evidence` (still unrun) and the overlays `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`; trace whether any consumer of the merged review registry reads `searchCoverage.deferred` or `candidateCoverage.deferred` as open debt.
- Reason: core protocols must be recorded before STOP; the merged-coverage overlap is the one open hypothesis from this pass.
- Rotation status: 6/6 dimensions complete; second correctness pass found no new defect.
- Required evidence: file:line refs per protocol result.

Review verdict: CONDITIONAL