# Iteration 001 - Correctness: core engine

## Dimension
correctness (iteration 1 of 10). Operator focus addressed: code and runtime files first; this iteration covered the four core engine scripts the Iteration Plan names, read from the diff `21c4b325b5a..1d2b49e4306` and the current file contents, and checked one finding empirically by calling the exported function against this run's own config.

## Dispatcher
- Route: mode=review, target_agent=deep-review, native leaf, single iteration.
- Iteration number: 1 (state log holds 0 `type:"iteration"` records; matches dispatch).

## Files Reviewed
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` (new file, all 1,138 lines)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (364-line diff: dimension universe, review frontier projection, budget bands, focus selection, dashboard section)
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` (79-line diff: frontier_drained candidate, frontierOpen veto, minIterations gate, focus alignment)
- `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` (16-line diff: comments and one warning string only)

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Commit-range review target written with any surrounding text prunes every expansive node as `relevance`** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:494 -- `isCommitRange` (frontier-admit.cjs:452) only recognises a range when `splitTargetPaths(reviewTarget)` yields exactly one entry, so a target such as `commit range 21c4b325b5a..1d2b49e4306 (expansive-depth program, phases 001-014)` falls through to frontier-admit.cjs:496, which treats every whitespace-separated word (`commit`, `range`, `program`, the range itself) as a path base. A real scope under the touched files is then outside every base, so `checkProposal` returns `relevance` at frontier-admit.cjs:525. Seeding goes through the same check (`admitProposals(..., seeding: true)` at frontier-admit.cjs:715), so the seed admits nothing, `seedBudget` sees zero seeded nodes and falls back to the loop default, and the run proceeds with an empty frontier: expansive mode is silently a default run. The same word split also admits a scope under any directory named after a prose word (`commit/x.js` returns true). Empirical check: `scopeInsideReviewTarget(['.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs'], <this run's deep-review-config.json>)` returns `false`; the same call with `reviewTarget` set to the bare `21c4b325b5a..1d2b49e4306` returns `true`; `['commit/x.js']` against the decorated target returns `true`.
   Case: an expansive `/deep:review` whose target is entered as `commit range <base>..<tip> (<label>)`, the exact shape this run's own config holds with `reviewTargetType: "files"`, prunes every seeded sub-target with reason relevance.
   Finding class: cross-consumer
   Scope proof: `deep-review.yaml` writes `reviewTarget: "{review_target}"` verbatim from setup (deep-review.yaml:867) and both the seed (deep-review.yaml:924) and per-iteration admit (deep-review.yaml:2040) call frontier-admit with `--target review`, so every review admission goes through `scopeInsideReviewTarget`; no other caller normalises the target first.
   Affected surface hints: frontier-admit.cjs `isCommitRange` / `scopeInsideReviewTarget`; deep-review.yaml setup step that records `reviewTarget`; frontier-admit tests for the commit-range branch.

```json
{"type":"claim-adjudication","findingId":"R1-P1-001","claim":"A files-type review target that carries a commit range plus any other words is not recognised as a range, so frontier admission (seed and admit) prunes every in-scope proposal as relevance and expansive depth silently degrades to an empty frontier.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:452",".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:494",".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:496",".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:525",".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:715"],"counterevidenceSought":"Looked for a setup step that strips the target to a bare range before it reaches the config (grep of deep-review.yaml for range handling found none; reviewTarget is written verbatim at deep-review.yaml:867), and ran the exported function against this run's real config to rule out a reading error.","alternativeExplanation":"The contract may intend reviewTarget to hold only a bare range for files-type targets; but nothing validates that, the run that produced this config is the deep-review workflow itself, and the code's own comment promises a commit range is recognised and scoped by its touched files.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"Downgrade to P2 if the setup contract is shown to always reduce a commit-range target to the bare base..tip form before writing reviewTarget, or if an expansive review cannot be launched with a decorated target."}
```
   Skeptic/referee (compact): Skeptic -- prose targets are supposed to set `reviewTargetType` to something other than `files`, which returns true early. Referee -- this run's config pairs the decorated string with `reviewTargetType: "files"`, so the early return does not apply; the reach is a real workflow-produced config. P1 stands.

### P2 Findings
1. **Defaulted expansive review budget cannot fund its own depth-1 seed under the 50% band share** -- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1983 -- `expansiveBudget` caps a defaulted review at `EXPANSIVE_BUDGET_CEILING` 24 (frontier-admit.cjs:342-348), and `applyReviewFrontierBudget` gives depth 0-1 only `maxIterations * 0.5` = 12 iterations before it closes every open depth-1 node as `exhausted` reason `budget` (reduce-state.cjs:1983). A review node needs one visit per dimension in the universe before reduce-state.cjs:2017 marks it answered, so 4 canonical dimensions times 4 or more seeded nodes (the seed step's documented range is 3 to 8) needs at least 16 depth-1 visits against 12 allotted; with 6 dimensions, as this run configures, even 3 seeds need 18. At least one seeded node always closes unanswered, and three seeds at four dimensions leave zero slack for any revisit or stuck iteration. The sizing comment's "two iterations for each node" promise is not met once the band split applies.
   Case: an expansive review with four canonical dimensions and a defaulted budget seeds four sub-targets; the budget becomes 24, band depth1 gets 12, and the fourth node is projected `exhausted` reason budget before any iteration reaches it.
   Finding class: algorithmic
   Scope proof: the band shares are read only in `applyReviewFrontierBudget` and the ceiling only in `expansiveBudget`; no other code sizes review depth.
   Affected surface hints: frontier-admit.cjs `expansiveBudget` / `EXPANSIVE_BUDGET_CEILING`; reduce-state.cjs `applyReviewFrontierBudget`; `expansiveDepth.budgetSplit` defaults.

## Traceability Checks
- `spec_code` (partial): `spec.md` section 3 claims default runs stay byte-identical for phases 010-011. convergence.cjs keeps every expansive branch behind `config.depthMode === 'expansive'` and `stopDecisionConfig` adds the key only for expansive runs, and reduce-state.cjs reads the frontier store only when `antiConvergence.depthMode === 'expansive'`. But convergence.cjs:1195 widened the `minIterationsNotReached` gate from research-only to every loop type, which changes default review behavior; that is consistent with the spec's statement that the defect-fix phases change default paths on purpose, but which phase owns it was not traced this iteration. Left partial for the traceability iteration.

## Integration Evidence
- `.skilled/commands/deep/assets/deep-review.yaml:867` writes `reviewTarget` verbatim; `:924` seed, `:1602` stuck close, `:1708` active close, `:1750` block render and `:2040` admit are the frontier-admit call sites checked against the script's CLI contract (commands and flags match `VALUE_FLAGS` and `runCli`).

## Edge Cases
- Split state: the reducer derives `answered` and budget `exhausted` in the projection only (reduce-state.cjs:2017, :1983); frontier-admit reads the store, where those nodes stay `open`/`active`. Dispatch picks `activeNodeId` from the projection, so no leaf is sent to such a node, but the last visit to a node that becomes answered still renders a block (store status active) and its proposals are admitted under it. Judged intended growth, not a defect; recorded for the overengineering/maintainability passes.
- `isCommitRange` with an empty `reviewScopeFiles` admits every scope (frontier-admit.cjs `scopeInsideTouchedFiles` returns true on an empty list); the code comment acknowledges this.

## Confirmed-Clean Surfaces
- convergence.cjs `frontier_drained` candidate and `frontierOpen` veto: drained requires total >= 1, open+active 0 and answered >= 1, so the veto and the candidate cannot both apply; veto sits after the cap, failure, stuck and floor gates as its comment says.
- convergence.cjs focus alignment now judges only the newest record with id-prefix normalisation; consistent with its stated intent.
- frontier-admit.cjs `closeNode` guards (pruned cannot revive; settled cannot move) and `nextNodeSerial` torn-line safety.
- reduce-state.cjs `frontierMarkerPattern` bounds ids on both sides, so `F-1-001` cannot claim `F-1-0010`.
- verify-iteration.cjs diff changes comments and a warning string only; no logic change.

## Ruled Out
- Cycle check bypass: `checkCycle` caps steps at maxDepth+1 and returns `cycle` on a revisit; a dangling parent is caught earlier by relevance.
- Node-id collision after a torn store line: `nextNodeSerial` counts from the highest serial, not the row count.
- Default-run registry drift: the frontier key is spread only when the projection exists.

## Next Focus
- Dimension: security (iteration 2 per the Iteration Plan).
- Focus area: `fanout-run.cjs`, `dispatch-iteration.cjs`, `frontier-admit.cjs` input and path handling (artifact-dir, `--output` in `writeFrontierGraph` writes anywhere it is pointed), `upsert.cjs`, shell steps of both workflow YAMLs.
- Reason: plan rotation; correctness core slice done.
- Rotation status: correctness covered once; 5 dimensions remain.
- Carry-forward: R1-P1-001 commit-range target detection; spec_code partial (minIterations gate ownership).
- Required evidence: file:line in the listed scripts; any path written outside the artifact dir.

Review verdict: CONDITIONAL