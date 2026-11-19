# Iteration 009 -- Correctness (third pass)

## Dispatcher
- Iteration 9 of 10, dimension correctness, focus: ledger schemas and types, legacy compatibility, continuity thread, coverage graph, reducers, and YAML-step vs script contract coherence.
- Operator focus addressed: code and runtime files only this pass, every citation from reviewScopeFiles; docs were not re-read.
- State read: config (sessionId 2026-11-19T04:20:12.962Z, generation 1, lineageMode new), registry (P0=0 P1=2 P2=14), strategy, iteration-008.

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts (run_extended rules, extension-budget kind, isConsistentExtension)
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts (optionalLeafFields, run_extended upcast)
- .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:166, :531, :888-895, :951-954
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts and deep-review-reducers/deep-review-reducer.ts (foldRun run_extended)
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:161-173, deep-research-contract.ts:292
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:77-190
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2604-2620, :2782-2788 (continuity callers)
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts (SOURCE_QUALITY_CLASS), coverage-graph-signals.ts:679-685
- .skilled/commands/deep/assets/deep-review.yaml:505-592 (step_extend_completed_run), :2143-2171 (fan-out merge bindings)
- .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:210-266, :350-445
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:497-566
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1000-1036, reduce-state.cjs:1800-1850, :550-575, convergence.cjs:1600-1625

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

No new finding this pass. Every hypothesis below was checked by direct read and ruled out or confirmed as already recorded. No finding is invented to fill the slot.

## Traceability Checks
- spec_code (partial scope, run_extended contract): pass. The YAML producer computes `newMaxIterations = continuedFromRun + addedIterations` (.skilled/commands/deep/assets/deep-review.yaml:550), the same identity the schema enforces in isData (.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:951-954), and the reducer adopts it as the run cap (deep-review-reducer.ts foldRun run_extended). The research copy matches (.skilled/commands/deep/assets/deep-research.yaml:522 vs deep-research-ledger-schema.ts isConsistentExtension).

## Integration Evidence
- Workflow `.skilled/commands/deep/assets/deep-review.yaml` step_extend_completed_run: appends through `append-mode-event.cjs --mode review` before it moves the new config into place (:588-589), so a refused event (for example an `--extend` value past uint32) leaves the config unchanged.
- Workflow `.skilled/commands/deep/assets/deep-review.yaml:2168-2171`: the fan-out merge values synthesis binds are `p0_count` and `failed_required_gate_ids`. No step reads the merged `searchCoverage` or `candidateCoverage`.

## Edge Cases
- Open question from iteration 8, closed: does any consumer read the merged coverage surfaces in fanout-merge.cjs, and does a reader treat a class that is both covered and deferred as open work? The only reader of `registry.searchCoverage` outside the merge is convergence.cjs:1606, which reads the registry of the run it decides on. The workflow binds only p0_count and failed_required_gate_ids from the merge. A class landing in several buckets is not new to the merge either: the per-run reducer adds a class to each bucket it was reported in across iterations (reduce-state.cjs:1823-1827). The unread-surface finding stays as recorded. The "deferred read as open work" sub-hypothesis is withdrawn.
- Ambiguity: an extension on a run that stopped early computes its new cap from the runs completed, not from the old cap. A run converged at 6 of 10 and extended by 3 gets cap 9. This is the documented rule ("derives it from the run it continues", deep-review-ledger-schema.ts:949-950), so it is recorded as intended semantics, not a defect.

## Confirmed-Clean Surfaces
- continuity-thread.cjs: `registryQuestions` and `resolvedQuestions` are question objects at the caller (reduce-state.cjs:2786-2787), and `textFromQuestion` reads `.text` (continuity-thread.cjs:36-44). `buildQuestionFields` keeps `text` (reduce-state.cjs:1419), so the resolved filter is not silently empty.
- deriveNextFocusFromContinuity: the leaf focus is checked only after the terminal-sentinel return, matching its comment. The caller passes the latest leaf focus through rejected-pattern suppression first (reduce-state.cjs:2604-2611).
- legacy-compatibility.ts run_extended upcast refuses a budget with a missing or negative field rather than defaulting it. Any ceiling inconsistency is still refused by isData.
- coverage-graph-signals.ts: excluding `unclassified` from source diversity matches the closed SOURCE_QUALITY_CLASS vocabulary in coverage-graph-query.ts.
- dispatch-iteration.cjs: widening `--claude-config-dir` to research still validates the directory before the prompt is read (:357-360), and only review requires it (:216).
- verify-iteration.cjs: route proof now comes from the projection, with the delta as fallback only when the state row fails. The warning names the state-row reason (:566).

## Ruled Out
- Research/review reducer generation drift on run_extended: research takes `max(run.generation, data.generation)`, review takes the scope generation. Both come from the same config generation in the extend step, so they cannot disagree in a recorded event.
- Huge `--extend` value bypassing the ceiling: the regex has no upper bound, but `isUint32` on every budget field refuses it at the gateway before the config moves.
- Leaf prose fields widening the iteration event: optionalLeafFields keeps only typed fields and drops a field with the wrong shape.

## Next Focus
- Dimension: traceability (core protocol closure, final iteration).
- Focus area: record `checklist_evidence` with file:line evidence against the 010 and 011 tasks and checklists, plus `skill_agent` and `agent_cross_runtime` over the agent files in scope.
- Reason: checklist_evidence is still unrun and iteration 10 is the cap.
- Rotation status: 6/6 covered; correctness now has three passes.
- Blocked/productive carry-forward: do not retry the exhausted approaches. Productive: grep each consumer before raising an unread-surface claim.
- Required evidence: file:line per protocol result.

Review verdict: CONDITIONAL
