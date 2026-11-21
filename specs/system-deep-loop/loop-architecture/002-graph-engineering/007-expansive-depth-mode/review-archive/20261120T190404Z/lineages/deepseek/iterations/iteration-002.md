# Iteration 2 - F-1-005 correctness: reducers, convergence, verification and the ledger/projection layer

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-005, dimension correctness. Node scope: `reduce-state.cjs` (review and research), `upsert.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `dispatch-iteration.cjs` and the five `runtime/lib` ledger, projection and reducer folders.
- Operator review focus covered in this iteration: overengineering (extension payload and projection duplication judged against `prevent-overengineering.md` section 4), operator UX (`--extend` output, warning text and persisted `continuedFromRun` meaning), cross-CLI/OS parity (`dispatch-iteration.cjs` claude config-dir handling and locale-dependent frontier ordering).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` -- frontier store projection, visit attribution, node status derivation, band budget, lineage and extension bookkeeping, strategy and dashboard rendering.
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` -- frontier store projection, visit records, focus ranking, band budget, question-resolution close rule.
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` -- review and research stop facts, `frontier_drained` candidate, `frontierOpen` veto, traceability gate, counters.
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` -- review finding-evidence derivation, finding-id folding, orphan-edge skip.
- `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` -- route-proof source preference and delta fallback.
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` -- `cli-claude-code` config-dir validation and env pass-through.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` and `deep-review-ledger-types.ts` -- `run_extended` payload shape and cross-field check.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts`, `deep-research-reducers`, `legacy-projections/deep-review-state-contract.ts`, `legacy-projections/deep-research-contract.ts` -- extension projection to the run ceiling.
- `.skilled/commands/deep/assets/deep-review.yaml` -- `step_extend_completed_run`, `step_reduce_review_state` and `step_graph_upsert` order.
- Traceability sources: `001-completed-run-extension` AC-004/AC-005, `010-research-frontier-mode` REQ-005/REQ-008, `011-review-frontier-mode` REQ-017/REQ-018, and `deep-review/references/convergence/convergence.md` section 4 (iteration status handling).

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A `thought` iteration covers a frontier dimension and spends node depth** -- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1971 -- `buildReviewFrontier` removes only `FAILED_VISIT_STATUSES` (`error`, `failed`, `failure`, `timeout`) from a node's records, then collects every surviving record's `dimensions` and projects the node `answered` once all four are present (`:1975-1984`). `thought` is a valid iteration status and the review contract states it produces no evidence: "`thought`: Skipped entirely -- analytical iterations produce no evidence to measure" (`deep-review/references/convergence/convergence.md:238`) and "Skip if `status == "thought"` (no change)" (`references/protocol/loop-protocol.md:369`). The research reducer already treats it that way for question coverage (`deep-research/scripts/reduce-state.cjs:2614` excludes `stuck` and `thought`), but the shared visit filter at `frontier-admit.cjs:90` omits both, so the review frontier accepts a record the loop's own doctrine says proves nothing.
Finding class: class-of-bug
Scope proof: `grep -n "FAILED_VISIT_STATUSES" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` returns the import at `:21` and the single use at `:1971`; `frontier-admit.cjs:90` defines the set as `['error','failed','failure','timeout']`; no other status filter exists between the state rows and `buildReviewFrontier`.
Affected surface hints: ["reduce-state.cjs buildReviewFrontier", "reduce-state.cjs reviewRecordsForNode", "frontier-admit.cjs FAILED_VISIT_STATUSES", "registry.frontier answered status", "frontier_drained stop candidate"]
Case: a leaf dispatched to F-1-005 for security returns `{"status":"thought","dimensions":["security"],"frontierNodeId":"F-1-005"}`; the reducer counts the visit, marks security covered, and after four such records the node projects `answered`, releases the `frontierOpen` veto and lets `frontier_drained` form even though no review evidence was produced.

Claim adjudication:
```json
{
  "type": "contract-contradiction",
  "claim": "A thought-status iteration is counted as a frontier visit and its dimensions as node coverage, so a node can answer without evidence.",
  "evidenceRefs": [
    ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1971",
    ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1975",
    ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:90",
    ".skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:238",
    ".skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:369",
    ".skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2614"
  ],
  "counterevidenceSought": "Checked whether thought rows are filtered before the frontier projection (no status filter in main; iterationRecords carries every type:'iteration' row), whether the global dimension coverage applies a status filter (it does not, which predates this range), and whether the research reducer treats a thought visit the same way (it excludes thought from question coverage but still counts the visit for budget and ranking).",
  "alternativeExplanation": "A thought visit may be intended to spend the node's budget because the iteration was dispatched, but the record's dimensions were not reviewed; the projection labels the node 'answered', which is the evidence claim the veto release reads.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the state-record schema or the review workflow refuses a thought status on a frontier-dispatched iteration, or if the leaf contract forbids dimensions on a thought record."
}
```

### P2 Findings

2. **Frontier steering and projection order by locale collation while the merge orders by code unit** -- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2016 -- The active node is chosen with `left.nodeId.localeCompare(right.nodeId)` after depth, visits and iteration, and the projected node list sorts the same way (`:1924`); the research reducer mirrors both sorts (`deep-research/scripts/reduce-state.cjs:2447`, `:2512`). The fan-out merge and its `compareText` helper order node ids by code unit (`fanout-merge.cjs:928`), so the same store can project a different active node and budget order on a host whose ICU collation orders the ids differently. This is the same root cause as R1-P2-002 on the reducer and steering surface.
Finding class: class-of-bug
Scope proof: `grep -n "localeCompare" .../runtime/scripts/reduce-state.cjs` returns `:1924` and `:2016` in the new frontier block; the research reducer returns `:2447` and `:2512`; every other node-id ordering in the merge uses `compareText`.
Affected surface hints: ["reduce-state.cjs pickReviewFrontierFocus/activeNodeId", "reduce-state.cjs readReviewFrontierStore", "deep-research/scripts/reduce-state.cjs pickFrontierFocus", "fanout-merge.cjs compareText"]
Case: two nodes with equal visits and creation iteration are steered on a host whose collation orders `F-1-005` and `F-1-007` differently from the merge host, so the lineage reviews a different node order than the orchestration summary records.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | `001` AC-004/AC-005 rule `newMaxIterations = continuedFromRun + N` and `max(prior, elapsed) + M`; the step implements both (`deep-review.yaml:551-568`) and the schema enforces the iteration identity (`deep-review-ledger-schema.ts:951-956`). `010` REQ-005's terminal-status close resolves the inbox question (`deep-research/scripts/reduce-state.cjs:2652-2662`). `011` REQ-017's review-only `frontier_drained` candidate and its cap/floor order match the code (`convergence.cjs:1169-1211`). |
| `checklist_evidence` | pass | AC-004's cap half is the fixture rule the step implements; AC-019's evidence-edge contract is implemented in `upsert.cjs:236-300` and guarded by the integration suite named in the phase; AC-018's candidate order and gate chain match `convergence.cjs:1164-1217`. |

## Integration Evidence

- `.skilled/commands/deep/assets/deep-review.yaml:514-620` (`step_extend_completed_run`) writes the `run_extended` event before the config, sets `status: "initialized"`, `lineageMode: "completed-continue"` and `continuedFromRun` to the distinct iteration count, and prints the re-stop warning.
- `.skilled/commands/deep/assets/deep-review.yaml:2057-2098` runs `step_reduce_review_state` before `step_graph_upsert`, so the reducer's frontier projection is the one the graph and the next iteration read.
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` and `deep-review-state-contract.ts` project the extension to `type: "event", event: "extended"` with the budget payload; the research legacy upcast refuses a legacy `extended` row without the full budget (`legacy-compatibility.ts:655-672`).
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:210-220` and `:350-447` now accept `--claude-config-dir` for either loop type and pass `CLAUDE_CONFIG_DIR` through the executor guard env; `buildExecutorDispatchEnv` admits it through the `CLAUDE_` allowlist (`executor-audit.ts:1455`).

## Edge Cases

- `--extend=N` sets `continuedFromRun` to the number of distinct iteration rows, so extending a run that stopped at 7 of 10 by 3 produces a ceiling of 10 and exactly 3 more dispatches. That matches AC-004 but means the new ceiling can sit below the prior cap; I did not treat it as a defect because the flag reads as "N more iterations", not "raise the cap by N".
- The same `continuedFromRun` field is a lineage field elsewhere and an iteration count after an extension; the strategy renders it without a unit. Recorded as operator-facing ambiguity, not a separate finding, because REQ-002 mandates the field name.
- `applyBandBudget` closes an open node as `exhausted` when its band's visits reach the share, using only records attributed to a node; pivot and blocked-stop iterations spend no node visit, so band spend can lag the loop's iteration count by design.
- A `stuck` record is treated like `thought` by the visit filter but, unlike `thought`, the review doctrine has no explicit "produces no evidence" sentence; the finding rests on the `thought` case and names `stuck` only as the same filter gap.

## Confirmed-Clean Surfaces

- The extension arithmetic and event/config ordering are correct against AC-004/AC-005: the event is appended before the config write, the config keeps `createdAt`, and a failed append leaves the run complete.
- `reviewTraceabilityCovered` and `reviewOmitsTraceability` read the raw config, not the reduced stop config, so `crossReference.core` and `reviewDimensions` are present at the gate (`convergence.cjs:1601-1631`, `:1683-1710`).
- The `frontier_drained` candidate is review-only and requires `frontierTotal >= 1` and `frontierAnswered >= 1`; a frontier that closed with nothing answered forms no candidate, as REQ-017 requires.
- `upsert.cjs` folds leaf finding ids case-insensitively onto stored findings, skips an edge to an undeclared node with a stderr notice, and derives no edge from a ref without a line.
- `verify-iteration.cjs` now prefers the projected route proof and falls back to the delta only when the state row fails it; the projected review row carries `target_agent`, `resolved_route` and `agent_definition_loaded` (read from this lineage's iteration 1 row).

## Ruled Out

- Abstracting the two reducers' frontier visit, marker and ranking blocks: exactly two instances with contract-driven divergence, and `prevent-overengineering.md` section 4 says two is a coincidence, so extracting them now would buy a wrong abstraction. Named what would change the judgment: a third frontier consumer.
- `maxIterations` extension lowering the ceiling after an early convergence: AC-004 defines the count-plus-N rule, and the schema check enforces the same identity; not a defect.
- Research `all_questions_answered` after an exhausted node: REQ-005 deliberately marks the terminal node's question resolved so it leaves the open set; the code matches.
- `thought` records in the global `buildDimensionCoverage`: the missing status filter predates the range; only the new frontier `answered` projection is reported.

## Next Focus

- Dimension: correctness on F-1-007 (divergent pivot, continuity thread and coverage-graph signals).
- Reason: the three dealt nodes now have F-1-003 and F-1-005 opened on correctness; F-1-007 is the only one with no dimension covered, and its pivot and graph signals feed the stop gates.
- Required evidence: `divergent-pivot.ts` seat and quorum rules, `divergent-pivot.cjs` CLI, `continuity-thread.cjs` and the `coverage-graph` query/signal functions the stop gates read.
- Rotation status: F-1-003 and F-1-005 each have correctness covered; F-1-007 has none.

Review verdict: CONDITIONAL
