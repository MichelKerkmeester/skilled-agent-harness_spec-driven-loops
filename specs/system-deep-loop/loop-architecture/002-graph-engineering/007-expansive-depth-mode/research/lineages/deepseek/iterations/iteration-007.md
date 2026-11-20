# Iteration 7: Frontier node F-2-008 — per-node dashboard detail across both reducers

## Focus

Frontier node F-2-008 (depth 2, child of F-1-002): do the research and review dashboards expose per-frontier-node budget spend and visit counts, or only lineage-wide iteration totals?

## Findings

1. **The review reducer already computes a per-node `visits` count; the research reducer drops it from its projection.** `runtime/scripts/reduce-state.cjs:1972-2008` builds a visit array and puts `visits: records.length` on each projected node, while `deep-research/scripts/reduce-state.cjs:2453-2475` projects only `nodeId, parentId, depth, scope, question, status, reason, iteration`. The research dashboard can therefore report a total (`Revisits` at `:3108`) but cannot print per-node detail, even though `frontierNodeVisits(nodeId, iterationRecords)` is already defined beside the projection (`:2499`). One concrete change: add `visits` (and `coveredDimensions` where the review reducer has it) to the research projection and print a per-node table. Value: three single-node passes stop looking like three passes on one node. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1972] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2453] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2499]

2. **The frontier dashboard section has already drifted between the two reducers.** Review renders `## 10B. FRONTIER` with size, pruned, revisits, every band budget and an active-node line (`runtime/scripts/reduce-state.cjs:2520-2545`); research renders `## 6B. FRONTIER` with size, pruned, revisits and band budgets but no active node (`deep-research/scripts/reduce-state.cjs` section 6B). One concrete change: extract one `renderFrontierDashboardSection(frontier, iterationRecords)` helper and call it from both reducers. Value: one dashboard contract, and a new field lands in both places at once. Effort M. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2520] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:108]

3. **The split has confused even this study's own scope line: it names `deep-review/scripts/reduce-state.cjs`, a path that does not exist.** The review reducer lives at `runtime/scripts/reduce-state.cjs`; the research reducer lives at `deep-research/scripts/reduce-state.cjs`; there is no `deep-review/scripts/reduce-state.cjs` (`deep-review/scripts/` holds only the pivot, a README, a contract renderer, capabilities and tests). One concrete change: move the research reducer to `runtime/scripts/reduce-state.cjs` (or a shared `runtime/lib/deep-loop/frontier-projection` module) so the two loops name one path. Value: removes a wrong path from the operating model and makes the shared helper above natural. Effort M. Risk medium (workflow paths and tests must move together). [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1149] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2520]

## Ruled Out

- Claiming both dashboards hide band spend: both print the three bands and their allotments; the missing piece is per-node detail and the active-node line.
- Adding a new registry file: the projection is the right carrier; it already has the visit function.

## Dead Ends

- Searching for a review-side per-node table in the committed review dashboard: it reports the same aggregate size and revisits, so the per-node table is absent on both sides, not only in research.

## Edge Cases

- Ambiguous input: "budget spend" could mean lineage-wide or per-band. Read as per-band and per-node; the bands are already printed, the nodes are not.
- Contradictory evidence: none.
- Missing dependencies: the nonexistent path in the scope line is itself evidence, not a missing file to fetch.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1972,2520`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2453,2499,3108`
- `.skilled/commands/deep/assets/deep-review.yaml:1149`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:108`

## Assessment

- New information ratio: 1.0
- Questions addressed: dashboard per-node detail (frontier node F-2-008)
- Questions answered: yes, the node question: both dashboards show only aggregate frontier state, and the two renderers have drifted.

## Reflection

- What worked and why: diffing the two frontier projection functions found a one-field gap that explains the dashboard difference and costs almost nothing to close.
- What did not work and why: looking for a per-node table in the review dashboard found none; the review reducer has the data but does not render it either.
- What I would do differently: read both dashboard renderers side by side before writing the first dashboard finding.

## Recommended Next Focus

Close F-2-008 as answered; the frontier is then terminal (F-1-006 was closed by the depth-1 band budget). Next: Q1 restraint (concrete deletions), then Q5 design questions and Q6 prior art.
