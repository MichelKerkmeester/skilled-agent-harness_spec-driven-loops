# Iteration 11 - F-1-005 maintainability: reducer and upsert change cost

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-005, dimension maintainability. Node scope: the two reducers, `upsert.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `dispatch-iteration.cjs` and the five `runtime/lib` folders.
- Operator review focus covered in this iteration: overengineering (the shared predicate and the two reducers' helpers), operator UX (dashboard and strategy rendering), cross-CLI/OS parity (one rule in one module for both loops).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` -- frontier projection, strategy and dashboard renderers, lineage state.
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` -- the parallel frontier helpers.
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` -- the shared `reviewOmitsTraceability` / `reviewUnfinishedCoreProtocols` predicates.
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` -- derived-evidence helpers and the node loop.
- Traceability sources: `006-state-log-leaf-fields` REQ-001..REQ-004, `011-review-frontier-mode` REQ-018.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The shared predicates live in one module and both consumers import them; no maintainability contradiction. The iteration 3 REQ-007 admission claim remains the only partial. |
| `checklist_evidence` | partial | AC-004/AC-018/AC-019 match; AC-008 remains outstanding. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:18` imports `reviewOmitsTraceability` and `reviewUnfinishedCoreProtocols` from `convergence.cjs`, so one predicate decides what the stop gate owes and what the reducer's universe contains.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2390-2492` keeps every strategy section update behind an anchor helper, with a warning path when an anchor is missing.
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:265-300` separates finding collection, id resolution and evidence derivation into named helpers.
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2452-2530` mirrors the review reducers' node helpers but keeps its own question-resolution rule, so the divergence is contract, not drift.

## Edge Cases

- The two reducers repeat the marker regex and the visit ranking. This is the second instance; `prevent-overengineering.md` section 4 keeps it separate until a third consumer appears, and the review path's `frontierNodeId`/store-active attribution is not the research path's focus-marker rule.
- `convergence.cjs` owns two predicates the reducer imports; the alternative is a third small module for two functions, which moves the cost rather than removing it.
- The reducer's three writers use plain `fs.writeFileSync` while the merge uses realpath-guarded readers; the asymmetry predates the range and is recorded as hardening, not a maintainability finding.

## Confirmed-Clean Surfaces

- Every strategy section update has one anchor helper and a missing-anchor warning instead of a partial rewrite.
- The frontier projection, the band budget and the registry build are separated by rule.
- The upsert's finding-id resolution and evidence derivation are separate helpers with a single caller each.
- Both reducers keep loop-specific rules local and share the frontier primitives through `frontier-admit.cjs`.

## Ruled Out

- Extracting the two reducers' marker/visit helpers at two instances: no third consumer, and the attribution rules differ by contract.
- Moving the two convergence predicates into a new module: it relocates a two-caller helper without shrinking the surface.
- Reporting the plain writers as a maintainability defect: the asymmetry predates the range and is a hardening note.

## Next Focus

- Dimension: maintainability on F-1-007 (pivot and coverage-graph change cost).
- Reason: F-1-005 is complete across all four dimensions; F-1-007 is the last maintainability pass and its attempt handling is the most intricate new state machine.
- Required evidence: the pivot's attempt transition writes, the library/YAML retry split, the graph vocabulary and the per-mode script duplication.
- Rotation status: F-1-003 and F-1-005 complete; F-1-007 has maintainability left.

Review verdict: CONDITIONAL
