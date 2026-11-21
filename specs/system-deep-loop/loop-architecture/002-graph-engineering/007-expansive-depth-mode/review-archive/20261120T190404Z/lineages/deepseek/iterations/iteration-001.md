# Iteration 1 - F-1-003 correctness: fan-out frontier partition, lineage prompt and merged coverage

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-003, dimension correctness. Node scope: `fanout-run.cjs`, `fanout-merge.cjs` and their unit suites.
- Operator review focus covered in this iteration: overengineering (duplicated traceability arithmetic), operator UX (a leaf contract that names a block the detached prompt never renders) and cross-CLI/OS parity (locale-dependent node ordering).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` -- partition, per-lineage budget, lineage store, lineage prompt and the pass-through of `depthMode`.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` -- merged coverage surfaces, merged review frontier and the partition guard.
- `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` -- `{frontier_block}` placement.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` -- traceability rollup the merge copies.
- `.skilled/commands/deep/assets/deep-review.yaml` -- `step_fanout_spawn`, `step_frontier_seed`, `step_findings` claims.
- Traceability sources: `specs/.../007-expansive-depth-mode/009-fanout-review-coverage-merge/plan.md` section 3 and `011-review-frontier-mode/spec.md` REQ-008, REQ-019.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Detached lineage contract names a FRONTIER block the CLI prompt never renders** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1791 -- The leaf contract tells a CLI lineage to work "one node and its next uncovered dimension per iteration as the FRONTIER block names it" and caps proposals by "the slots its FRONTIER block allows", but `buildLoopPrompt` only binds `frontier_scope: F-1-003, F-1-005, F-1-007` and never interpolates `{frontier_block}` (the placeholder lives in `prompt-pack-iteration.md.tmpl:28`, which detached lineages do not receive per iteration). The leaf therefore has no per-iteration node, no dimension steering and no proposal-slot count. The code's own comment at `fanout-run.cjs:415` says review nodes "reach the leaf through the FRONTIER block", which is true only for the native prompt path.
Finding class: class-of-bug
Scope proof: `grep -n "frontier_block" .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` returns the template placeholder, while `grep -n "frontier_block" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` returns no interpolation; the detached prompt lines are the only frontier steering a CLI leaf receives.
Affected surface hints: ["fanout-run.cjs buildLoopPrompt", "prompt-pack-iteration.md.tmpl", "deep-review leaf contract"]
Case: a CLI lineage reads its contract, looks for the FRONTIER block that is supposed to name the active node and dimension, finds none, and must guess whether to start at F-1-003 or F-1-005 and whether it may emit proposals at all.

2. **Frontier partition order depends on locale collation while the merge orders by code unit** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:357 -- `partitionFrontierNodes` sorts dealt nodes with `left.nodeId.localeCompare(right.nodeId)`, whose result depends on the host locale and ICU build. The merge and reducer compare the same ids with code-unit ordering (`fanout-merge.cjs:928` `compareText`, used for every merged list). The assignment of a node to a lineage is therefore reproducible only on a host with the same collation; two hosts can deal the same seed differently while the recorded partition keeps the merge self-consistent, so the drift surfaces as a different distribution rather than an error.
Finding class: class-of-bug
Scope proof: the only ordering call in the partition path is `localeCompare` at `fanout-run.cjs:357`; every other node-id sort in the range (`fanout-merge.cjs:928-936`, `frontier-admit.cjs` store ordering) uses code-unit comparison.
Affected surface hints: ["fanout-run.cjs partitionFrontierNodes", "fanout-merge.cjs compareText", "orchestration-summary frontier_partition"]
Case: the same seed is replayed on a host whose `LANG` collation orders `F-1-003` and `F-1-005` differently, and the same two lineages receive opposite shares even though nothing in the config changed.

3. **A single lineage that omits graphCoverageMode erases the mode the others agree on** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1003 -- `mergeSearchCoverage` collects `coverage.graphCoverageMode ?? null` and keeps a mode only when `modes.length === 1`. A lineage that ran graphless and recorded `graphless_fallback`, plus a lineage that recorded `graph`, merge to `null`; a lineage that predates the field (absent, mapped to `null`) has the same effect. The merged registry then claims no coverage mode at all, which is weaker than both inputs and hides a real disagreement from the report's coverage section.
Finding class: class-of-bug
Scope proof: `mergeSearchCoverage` is the only producer of the merged mode (`fanout-merge.cjs:999-1009`); `grep -n "graphCoverageMode" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` shows the single write, and no test asserts the absent-versus-disagreeing distinction.
Affected surface hints: ["fanout-merge.cjs mergeSearchCoverage", "merged review-report searchCoverage section"]
Case: lineage A records `graphCoverageMode: "graph"` and lineage B never writes the key; the merged report renders no mode, so a reader cannot tell that B ran without a graph.

4. **The merge re-implements the reducer's traceability summary arithmetic** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:982 -- `mergeTraceability` recomputes `required`, `executed`, `pass`, `partial`, `fail`, `blocked`, `notApplicable` and `gatingFailures` from merged results with an eight-line block that duplicates `reduce-state.cjs:1652-1665` verbatim, including the `gateClass === 'hard'` predicate. Two copies of one counting rule drift the moment either side adds a status or a gate class; the merged registry is exactly the surface a release report reads.
Finding class: instance-only
Scope proof: the two blocks are textually identical apart from the undecided-set constant name (`TRACEABILITY_UNDECIDED` versus `TRACEABILITY_UNDECIDED_STATUSES`); `reduce-state.cjs` exports `buildTraceabilityRollup`, so the merge could call it instead of copying it.
Affected surface hints: ["fanout-merge.cjs mergeTraceability", "reduce-state.cjs buildTraceabilityRollup"]
Case: a future status is added to `TRACEABILITY_UNDECIDED_STATUSES` only; the reducer stops counting it as executed while the merge keeps counting it, and the same run reports two different executed totals.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | 009 `plan.md` section 3 lists the six merge rules and the code matches each: dimension OR (`fanout-merge.cjs:946`), strongest-restriction traceability (`:966`), sorted-union search coverage (`:999`), per-bug-class candidate merge (`:1014`), per-lineage divergence (`:1039`), lineage-qualified ruled-out rows (`:1047`). 011 REQ-008's round-robin partition, `frontier_scope:` binding and `frontier_partition` summary are present (`fanout-run.cjs:347`, `:1826`, `:3896`); REQ-019's per-share budget with D 4 and the 12/7 floors is implemented (`:378`, `:381`). |

## Integration Evidence

- `.skilled/commands/deep/assets/deep-review.yaml:363-416` (`step_fanout_spawn`) passes `--review-focus-file`, `--review-target-file`, `--fanout-config-json-file` and `--depth-mode`, which are the flags this iteration read.
- `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:28` owns `{frontier_block}` for the native per-iteration prompt; the detached CLI lineage prompt is built by `fanout-run.cjs:1791` and carries no such block.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:928` (`compareText`) is the ordering helper the merged lists use.

## Edge Cases

- The fan-out config labels are unique per run, so the partition map cannot collide on a label; the round-robin index still depends on the order of `expandedLineages`, which follows the config's executor order.
- A lineage dealt no node is accepted by design (the runner warns and runs it at the loop default); this iteration did not treat that as a defect.
- The review target is a commit range, so `partitionFrontierNodes` reads the seeded store rather than the diff; an empty store yields an empty partition and no `frontier_scope` line, which the runner tolerates.

## Confirmed-Clean Surfaces

- `expansiveLineageBudgets` keeps an explicit matrix `iterations` value (`Number.isInteger` is safe because `executor-config.ts:865` validates `z.number().int().positive().nullable()`), and it uses the documented D 4 and 12/7 floors.
- `writeLineageFrontierStore` refuses to overwrite an existing store, so a resumed lineage keeps the nodes it already closed, and a review lineage correctly gets no inbox.
- `mergeResearchFrontier` qualifies child ids with the lineage label, so two lineages' `F-2-002` children cannot collide, and the guard compares only the globally unique depth-1 ids.

## Ruled Out

- Flat partition-guard set collision: a missing depth-1 node cannot be masked by another lineage's node because depth-1 ids are minted once by the shared seed; only child ids repeat per lineage, and those are qualified before the set is built.
- Duplicate `node -e` extend scripts across the two YAML assets: the duplication predates the range and the copies track real config-shape differences (research nests lineage fields and has an inbox), so it is not a range-introduced overengineering finding.
- Locale-dependent ordering of merged lists: the merge sorts with code-unit `compareText` everywhere, so only the partition assignment (finding 2) is exposed.

## Next Focus

- Dimension: correctness on F-1-005 (reducers, convergence, verification and the ledger/projection layer).
- Reason: iteration 1 cleared the fan-out runner/merge surface at the P2 level; the reducer and convergence path decides node status, dimension coverage and the stop decision, so it carries the next correctness risk.
- Required evidence: `reduce-state.cjs` node-status and frontier projection, `convergence.cjs` stop arithmetic, `verify-iteration.cjs` and `dispatch-iteration.cjs` guards.
- Rotation status: F-1-003 remains open with correctness covered; F-1-005 and F-1-007 have no dimension covered yet.

Review verdict: PASS
