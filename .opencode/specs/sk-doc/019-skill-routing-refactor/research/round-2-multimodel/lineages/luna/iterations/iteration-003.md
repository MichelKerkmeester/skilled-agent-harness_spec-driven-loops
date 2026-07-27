# Iteration 3: Commit 140266be3e, metrics, and links

## Focus
The just-landed parent-document fixes, route-gold metrics, stale cross-references, and root-aware Markdown links.

## Actions Taken
- Diffed every changed parent `spec.md`, `context-index.md`, `description.json`, `graph-metadata.json`, `routing-before-after.md`, and `routing-config-and-advisor-reference.md` line-by-line against `140266be3e^`.
- Re-read the non-frozen child verification report and implementation summary that supply the route-gold counts.
- Ran the public compiled-route checks and a root-aware Markdown-link scanner over the parent packet tree, excluding `research/**`, `benchmark/**`, `lineages/**`, review iteration artifacts, logs, outputs, and run records.
- Checked the changed related-path references against the current repository paths.

## Findings

### P2: PRE-EXISTING — route-gold hub denominator is inconsistent across the parent and its verification evidence
Evidence: `routing-before-after.md:154` reports `7/7 hubs PASS`, while the child verification report at `020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:47-55` lists six hub rows and a fleet verdict of `6/6 PASS` for 106 scenarios and 91 route-gold cases. The same report states at `:32-33` that the teeth proof covered all 6 hubs, and `routing-before-after.md:161` separately calls them the 6 applicable hubs. The parent child implementation summary repeats `7/7` at `:54` and `:111`, but its arithmetic `4+13+7+20+15+32` is six hub rows. This is a scope/denominator ambiguity in a load-bearing metric, not a claim that the 91/106 scenario count is false. The `7/7` parent wording predates `140266be3e`; the commit sharpened the scenario denominator but did not reconcile the hub denominator.

## Questions Answered
- `140266be3e` corrected the stale `smart_routing.md` spelling and the three related repository paths; those changed paths resolve in the current tree.
- The parent snapshot's 91-of-106 scenario wording has supporting evidence, but the hub denominator remains ambiguous between 7/7 and the verification report's 6/6.
- The non-excluded Markdown-link scan found zero broken or absolute-worktree links in 449 Markdown files.

## Questions Remaining
- Do parent and nested graph metadata have complete, unique, and resumable child topology?
- Do duplicate `012` prefixes and the 14-child `015` sub-parent cause actual graph or resume ambiguity?
- Are there status contradictions deeper in the nested tree beyond the direct-child scan?

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:17,154,161`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/verification-report.md:32-55`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard/implementation-summary.md:54,111`
- `git diff 140266be3e^ 140266be3e -- parent documents`

## Recommended Next Focus
Reconcile every `graph-metadata.json` `children_ids` and `derived.last_active_child_id` with on-disk nested packet topology, including duplicate `012` names and the 14-child `015` sub-parent.

## Ruled Out
- Broken Markdown links in the non-excluded packet tree were ruled out by direct filesystem resolution.
- Treating the frozen review iteration links to historical worktree paths as current defects was ruled out by the operator's frozen-artifact exclusion.
