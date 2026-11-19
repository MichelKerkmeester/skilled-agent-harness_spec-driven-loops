# Iteration 008 - overengineering (stuck recovery, function-level)

## Dispatcher
- Iteration 8 of 10, dispatched by `/deep:review` (`.skilled/commands/deep/assets/deep-review.yaml`) in stuck recovery after two low-yield passes (ratios 0.05 then 0).
- Recovery strategy: change granularity from file level to function level. Dimension: overengineering, scored with the strategy's Review Charter rubric and `.skilled/repo-rules/prevent-overengineering.md`.
- Operator focus addressed: code and runtime files first. Each finding names what to delete or collapse and which current requirement, if any, it serves. No registry finding is re-reported.

## Dimension
overengineering

## Files Reviewed
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` (the added functions at 751-1070, the `main` wiring at 1746-1800)
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` (the added functions at 167-345, the `main` changes at 361-565)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` (the council-attempt retry diff, `preflightFailure` at 749-765, defaults at 290-295, `parsePersistedLimits` at 1052-1075)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` (`optionalLeafFields`, the `run_extended` upcast)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` (the `run_extended` rules)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` (the `run_extended` projection)
- Context only: `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge/spec.md`, `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **`minRemainingIterations` is still defaulted, validated, persisted and required on replay, but nothing reads it** -- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:293 -- The retry change removed the only check that read the option (the old `usage.remainingIterations < config.minRemainingIterations` preflight). The option still has a default at :293, a normalizer at :471-474, an optional input field at :99, a normalized field at :235, and a required key in `parsePersistedLimits` at :1055 and :1062. A search of `runtime/lib`, `runtime/scripts`, both pivot adapters, both workflow YAMLs and both config assets finds no decision that reads it. An operator who sets `antiConvergence.divergent.minRemainingIterations` gets validation and no effect.
   Delete or collapse: delete the default, the normalizer branch and both type fields. Have `parsePersistedLimits` stop requiring the key, so pivot configs persisted with it still replay. No current requirement uses it; the pivot-hygiene spec retires the preflight on purpose.
   Finding class: dead-config-option
   Scope proof: grep for `minRemainingIterations` over the runtime, the adapters, the YAMLs and the config assets returns only divergent-pivot.ts declarations, the normalizer and the replay parser.
   Affected surface hints: divergent-pivot.ts (DEFAULT_DIVERGENT_CONFIG, normalizeDivergentConfig, parsePersistedLimits, the config types); the pivot unit tests that pass the key
   Case: a config with `antiConvergence.divergent.minRemainingIterations: 5`, dispatched at the second-to-last iteration, still opens a pivot, so the setting changes nothing.

2. **The `maxCouncilSeatOutputs` cap now compares the constant 3 with config, so its only reachable effect is to disable every pivot** -- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:759 -- After the cap was scoped to one attempt, the check is `openingAttempt && 3 > config.maxCouncilSeatOutputs`. A council always has exactly three seats (`REQUIRED_SEAT_IDS` at :289, invariant `seats: 3`), and the value must be a positive integer (:339-342). Any value of 3 or more is a no-op, and 1 or 2 fails every pivot with `max_council_seat_outputs_exceeded`. That duplicates `maxPivots` as an off switch. The default dropped from 9 to 3 (:292) only to keep the check from firing. The running `councilSeatOutputs` counter (:1589) is no longer compared with anything.
   Delete or collapse: delete the option, its failure reason (:197, :307) and the check at :759-761, and keep the three-seat invariant as the only bound. Keep `parsePersistedLimits` tolerant of the key at :1055 and :1061 for replay. No current requirement needs a configurable per-attempt seat cap.
   Finding class: vestigial-option
   Scope proof: the only reader of `config.maxCouncilSeatOutputs` is the preflight check at :759, found by grep in divergent-pivot.ts. No other script or lib reads it.
   Affected surface hints: divergent-pivot.ts (preflightFailure, PivotFailureReason, DEFAULT_DIVERGENT_CONFIG, parsePersistedLimits); pivot tests asserting `max_council_seat_outputs_exceeded`
   Case: `antiConvergence.divergent.maxCouncilSeatOutputs: 2` makes every pivot fail at preflight, and any value of 3 or more never fires.

3. **Four of the six merged review coverage surfaces are written into the merged registry and nothing reads them** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1000 -- `mergeSearchCoverage` (:1000), `mergeCandidateCoverage` (:1015), `mergeDivergenceByLineage` (:1040) and `mergeRuledOutCandidates` (:1048) add about 60 lines of merge rules: per-bucket unions, ORed flags, an iteration union and lineage attribution. The phase that added them gave its reason as "so a merge-time coverage guard (Slice K) has data to read" (009 spec.md:42) and left that guard to Slice K (009 spec.md:72). Slice K shipped only the frontier partition guard (:1781 and the `frontier_partition_guard` output). A grep of `runtime/scripts`, `runtime/lib`, both pivot adapters and both workflow YAMLs finds no reader of `divergenceByLineage`, `ruledOutCandidates`, or the merged `searchCoverage` and `candidateCoverage`. The only reader is the test that asserts the keys exist (fanout-review-focus.vitest.ts:187-221). The `fan-out merge` stdout summary does not report them either.
   Delete or collapse: either delete the four merges and their keys until a guard reads them, or ship the guard 009 promised. `mergeDimensionCoverage` and `mergeTraceability` may stay, because they are cheaper and closer to the synthesis surfaces. This also answers iteration 7's open question: no consumer reads the merged `deferred` buckets as debt, so the overlap it noted is inert.
   Finding class: consumerless-layer
   Scope proof: the grep for the four key names, excluding fanout-merge.cjs and tests, returns only per-run reducer writers in reduce-state.cjs (:1753-1884) and the per-run stop gate in convergence.cjs (:1607). Neither reads the fan-out merged registry.
   Affected surface hints: fanout-merge.cjs (mergeReviewCoverageSurfaces and its four helpers, COVERAGE_BUCKETS); fanout-review-focus.vitest.ts six-surfaces case; 009 spec's stated consumer
   Case: a two-lineage fan-out review where one lineage defers `injection` and the other covers it: the merged registry records `injection` under both `covered` and `deferred`, and no step ever reads either.
   Downgrade or withdraw trigger: a synthesis or stop step that evaluates the fan-out parent's merged `deep-review-findings-registry.json` with convergence.cjs. Whether one exists was not traced this iteration.

4. **The edge-endpoint resolver re-implements `resolveReviewFindingId` inline instead of calling it** -- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:490 -- `canonicalEdgeEndpoint` (:490-503) repeats the same lowercase direct lookup and the same `^(?:node:)?(?:finding|find)[:_-](.+)$` regex as `resolveReviewFindingId` (:176-184). It differs only in skipping the `finding:<id>` fallback for an unknown id. The two copies of the fold rule can drift, and a node could then fold to one id while its edge folds to another.
   Delete or collapse: delete the inline copy at :494-498. Have `resolveReviewFindingId` take a `{ fallback: false }` option, or return null on a miss and let the node path add `finding:<id>`. Call it from both places. This serves the existing requirement that a node and its edges fold to one finding node, with one rule instead of two.
   Finding class: duplicated-logic
   Scope proof: both regex literals appear at upsert.cjs:181 and :496, and there are no other copies in the file.
   Affected surface hints: upsert.cjs (resolveReviewFindingId, canonicalEdgeEndpoint in main)
   Case: a future change that adds a `fnd-` prefix to the regex at :181 only folds a leaf node `fnd-R1-P1-001` onto the finding, while its edge still names `fnd-R1-P1-001` and is rejected as an orphan.

## Traceability Checks
- `spec_code`: partial. The six-surface merge matches 009 spec.md:42 (fanout-merge.cjs:1061-1070). The consumer that requirement names, a merge-time coverage guard owned by 011, does not exist in code. Only the partition guard (fanout-merge.cjs:1781) shipped.
- `checklist_evidence`: not run this iteration (out of dimension). It stays open for iterations 9 and 10.

## Integration Evidence
- `/deep:review` workflow `.skilled/commands/deep/assets/deep-review.yaml`: grepped for readers of the merged coverage keys. It reads `dimensionCoverage` only through the per-run stop gates (:1290-1305), never from a fan-out merged registry.
- `runtime/scripts/convergence.cjs:1607`: reads `registry.candidateCoverage` of the run it decides on. It is not shown to run on the fan-out parent registry.

## Edge Cases
- Ambiguity: the advice to keep tolerant replay for persisted pivot limits (findings 1 and 2) rests on `parsePersistedLimits` requiring both keys. Deleting them without that tolerance would refuse resumed pivots. Each finding names this so the fix does not break replay.
- Contradiction: 009 spec.md:42 earns the six merges, and the code has no consumer. Recorded as a P2 finding whose fix is to cut the code or ship the guard, not as a spec mismatch, because the spec explicitly defers the guard.
- Missing dependency: no fan-out review run artifact was available to show whether synthesis reads the merged surfaces. Finding 3 carries a withdraw trigger.

## Confirmed-Clean Surfaces
- `qualifyFrontierId`, `shouldMergeFrontier`, `mergeResearchFrontier` (fanout-merge.cjs:751-805) are earned by the lost-node partition guard. One function serves both loops, which is reuse, not a speculative layer.
- `readJsonlRows` `required` flag (upsert.cjs:202): two real callers with different needs (optional delta, required state log).
- `optionalLeafFields` (legacy-compatibility.ts): the fields it keeps feed the findings gate and focus guard, as its comment states. Not speculative.
- The `run_extended` schema, upcast and projection additions (deep-review-ledger-schema.ts, legacy-compatibility.ts, deep-research-contract.ts) each serve the completed-run extension and reject rather than guess.
- The divergent-pivot attempt-2 machinery (`seatEventId`, `deliberationEventId`, attempt-scoped paths) is bounded to exactly two attempts. Each piece has a caller.

## Ruled Out
- `classifySourceLocation` hard-coded doc-host list (upsert.cjs:311-345) as speculative: it replaces a leaf-supplied quality class that a leaf could game. That is a current requirement, and the list is small and closed.
- `deriveReviewFindingEvidence` reused-id split (`#<iteration>`) as speculative: a comment cites the reducer's same rule, and finding ids are unique only per source.
- Attempt-1 config byte-identity rewrite in divergent-pivot.ts as gold-plating: it keeps resumed attempt-1 replays consistent, which is a correctness requirement.

## Next Focus
- Dimension: traceability (core protocol closure).
- Focus area: record `checklist_evidence` (still unrun across the session) with file:line evidence against 010 and 011 tasks/checklists. Also run `skill_agent` and `agent_cross_runtime` over the agent tomls and the patch yml in scope. If budget remains, trace whether any synthesis step runs convergence.cjs against the fan-out parent registry (finding 3's withdraw trigger).
- Reason: a core protocol must be recorded before STOP, and iteration 10 is the cap.
- Rotation status: 6/6 dimensions covered. Overengineering now has two passes, at file and function granularity.
- Blocked carry-forward: do not retry the exhausted approaches. Productive: grep each option or field's readers before calling it dead.
- Required evidence: file:line per protocol result.
- Recovery note: function-level granularity yielded four P2 findings after two dry passes.

Review verdict: CONDITIONAL
