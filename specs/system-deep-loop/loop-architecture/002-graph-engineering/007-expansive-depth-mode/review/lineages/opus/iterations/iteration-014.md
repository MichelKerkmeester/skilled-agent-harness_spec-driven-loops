# Iteration 014 - Blocked-stop recovery: graphless fallback evidence (correctness)

## Dispatcher

- Lineage: opus (fan-out), iteration 14 of 24
- Stop check before dispatch: the frontier is closed with two answered nodes, so `frontier_drained` formed; `convergence.cjs` returned BLOCKED with `blockedBy: ["graphlessFallbackGate"]`. Every other legal-stop gate passed (convergence, dimension coverage, P0 resolution, evidence density, hotspot saturation, claim adjudication, fix-completeness replay, candidate coverage).
- Workflow action taken: `deep_review.blocked_stop_recorded` appended through the gateway (ledger sequence 20), recovery strategy "add cited fallback ledger rows". No frontier node is open, so this record carries no `frontierNodeId`.
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Correctness, applied to the blocking gate: why this lineage's graphless-fallback ledger rows did not count, and fresh cited rows for the two required bug classes (`state_transition`, `contract_drift`).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:960-1000` (gate evaluation), `:1568-1590` (`reviewFallbackCoveredBugClasses`)
- `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:134,142` (ledger contract and compact example)
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:26`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:893-900` (state transition re-verification)
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464` (contract drift re-verification)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The graphless fallback gate counts a ledger row only when the row itself carries `evidenceRefs` and one of five method names, but the prompt pack contract and its example put `evidenceRefs` only inside `searchActions` and name `exact_search`** -- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1581 -- `reviewFallbackCoveredBugClasses` skips a row with no row-level `evidenceRefs` (`:1581`) and accepts only `direct_read`, `exact_grep`, `semantic_search`, `producer_consumer_trace` and `negative_test_inspection` (`:1569-1575`). The leaf's contract lists the row's required fields without a row-level `evidenceRefs` (`prompt-pack-iteration.md.tmpl:134`), and the compact example a leaf copies has none and names `exact_search` among the discovery methods (`:142`). A leaf that follows the pack exactly produces rows the gate ignores, so a `graphless_fallback` run is BLOCKED at every stop candidate until the cap. This lineage followed the pack for thirteen iterations and its `frontier_drained` stop was blocked for exactly this reason. Both sides predate the range (the base already had `exact_grep` and the row-level check), so this is pre-existing, but expansive depth now routes its only drained stop through this gate.
   - Finding class: cross-consumer
   - Scope proof: one producer contract (the prompt pack, mirrored in state-format's example) and one consumer (`reviewFallbackCoveredBugClasses`); the graphless-fallback playbook (`stop-gate-graphless-fallback.md:26`) names the gate's method list, not the pack's.
   - Affected surface hints: prompt-pack-iteration.md.tmpl ledger bullet and example; state-format v2 example; convergence.cjs fallback derivation (read action-level evidence and accept `exact_search`, or require row-level evidence in the pack).
   - Case: any review whose leaves record `graphCoverageMode: graphless_fallback` with ledger rows shaped like the pack's example.

## Traceability Checks

No protocol run this iteration (gate-recovery pass).

## Integration Evidence

- Gate inputs observed before this iteration: `requiredBugClasses` `["state_transition","contract_drift"]` (from the latest record's `searchCoverage`), `fallbackCoveredBugClasses` `[]`, `graphCoverageMode` `graphless_fallback`.

## Edge Cases

- Recording change in this lineage from this iteration on: every ledger row carries a row-level `evidenceRefs` (the union of its actions' refs) and uses `direct_read` or `exact_grep` for cited fallback evidence. Earlier records are not rewritten.
- Fresh cited rows in this record: `state_transition` re-verified by direct read of the close guards (`frontier-admit.cjs:895-900`): a pruned node cannot be closed live and a settled node cannot move, ruled out as a defect; `contract_drift` re-verified by exact grep of the un-narrowed universe phrasing (`loop-protocol.md:464`), linked to this iteration's finding as the drift class it belongs to.

## Confirmed-Clean Surfaces

- The other eight legal-stop gates pass on this lineage's state, including claim adjudication for both active P1 findings.

## Ruled Out

- A state-transition defect in `closeNode`: guards verified again by direct read.

## Operator Focus Coverage

- Overengineering: two vocabularies for one ledger (`exact_search` in the pack, `exact_grep` in the gate) is the kind of restated contract the focus asks to collapse; one exported method list read by both the pack renderer and the gate removes the class.
- Operator UX: the blocked-stop hint names "cited fallback ledger rows" but not that the row needs its own `evidenceRefs`, so an operator or leaf reading the hint repeats the same shape.
- Cross-CLI parity: every executor renders the same pack and hits the same gate.

## Next Focus

- Dimension: correctness
- Focus area: stop check; synthesis when the gate passes
- Reason: blocked-stop recovery evidence recorded
- Rotation status: frontier closed; all dimensions covered
- Required evidence: convergence.cjs gate output

Review verdict: CONDITIONAL
