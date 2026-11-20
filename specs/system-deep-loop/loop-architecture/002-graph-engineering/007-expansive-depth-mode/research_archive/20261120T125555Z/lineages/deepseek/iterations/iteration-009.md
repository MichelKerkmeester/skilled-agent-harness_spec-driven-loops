# Iteration 9: Q5 — stuck scoping, completion for older runs, and a cheap pivot admission

## Focus

Q5 design questions: (a) should research count stuck passes per frontier node as review now does; (b) does the lineage completion check break resume and extend for older committed research lineages, and what is the right rule; (c) is there a cheap design that makes pivot admission into the frontier work?

## Findings

1. **Research still counts stuck passes lineage-wide: `nodeScoped` is gated on `loopType === 'review'`.** `convergence.cjs:1775-1778` sets `nodeScoped` only for review, so a research run with an active node counts every low-novelty pass in the lineage, and the workflow then closes the active node as `exhausted/stuck`. The review decision record already settled the principle (D-011-11: a node-bound pass that recorded a new finding is progress, and clean sibling passes must not close a node). One concrete change: drop the loop-type gate and add `frontier.activeNodeId` (and `activeNextDimension`) to the research projection via the shared frontier module from iteration 8. Value: research nodes close on their own evidence, not their siblings'. Effort S/M. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1775] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1406] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:69]

2. **The completion check fails 31 committed research lineages that have a `research.md` but no terminal closeout row.** A scan of `specs/system-deep-loop/**/deep-research-state.jsonl` finds 104 state logs, 42 with no terminal synthesis event, and 31 of those 42 have `research.md` on disk. `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE.research` requires one of `synthesis_complete`, `phase_synthesis_complete`, `synthesis` or `synthesis_incomplete` (`fanout-run.cjs:1248-1251`), and `checkLineageCompletion` fails `no_terminal_event` when none is present (`lineage-timestamp-window.ts:202-208`). The prompt's "3 of 12" understates the break; the measured population is 31 with a report. One concrete change: keep the terminal-row requirement for a live attempt, and fall back to `completionFromArtifacts` (already implemented at `fanout-run.cjs:1282`) when the lineage config is `status: complete` and the log holds no terminal row at all. Value: historical audit and re-run stop mislabelling finished work. Effort S. Risk low (the live path is untouched). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1248] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:202] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282]

3. **Resume and extend are not broken; only the audit of a *historical* run is.** A resume or extend re-runs `phase_synthesis`, whose `step_convergence_report` always hands a fresh closeout row to the gateway (`deep-research.yaml:2199-2225`), so the current attempt satisfies the terminal check. The break is confined to code paths that judge a completed run without re-running it, which is exactly the fallback in finding 2. One concrete change: name the two rules in the completion helper's contract ("current attempt: terminal row required; historical completed run: report artifact accepted"). Value: stops a future reader from weakening the live check to fix the audit. Effort S. Risk low. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2199] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:169]

4. **Pivot admission has a cheap design: carry the saturated focus's scope, admit pivots without the relevance check, reserve one depth-1 slot, and order `frontier_drained` before `all_dimensions_clean`.** D-011-10 rejected admission for three structural reasons: a minimum seed spends the whole depth-1 band so a new depth-1 node closes `exhausted:budget` on the next reduce; pivot candidates carry no scope for the relevance check; and `all_dimensions_clean` forms before `frontier_drained`. Each has a small answer: copy the previous focus's `scope` onto the pivot node (the saturated direction already has one) and tag it `origin: pivot` so admission skips only the relevance check; reserve one depth-1 slot by subtracting `1 / maxIterations` from `budgetSplit.depth1` when the pivot branch is enabled; and evaluate the frontier-terminal gate before the clean-stop candidate in `convergence.cjs`. Value: REQ-007's promise can be kept without a reworked pivot transaction. Effort M. Risk medium (the reservation changes band arithmetic and needs a test). [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:68] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:613] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1158]

5. **The reducer copies a leaf's `Recommended Next Focus` narrative into Next Focus verbatim, even when it is an instruction rather than a question.** With the frontier terminal, `deriveNextFocusFromContinuity` takes `latestLeafNextFocus` (`reduce-state.cjs:2574-2588`); this run's Next Focus became "Close F-2-008 as answered…", so the next iteration would have chased a closing instruction had this pass not overridden it. One concrete change: when the frontier has no open node, prefer the first unchecked key question over the leaf recommendation, and reject a recommendation that does not end in a question mark or name a scope. Value: the loop always works a question. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2574] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-strategy.md:151]

## Ruled Out

- Weakening the live completion check to fix the audit: a live attempt that writes nothing must still fail, so the fallback has to be scoped to a completed historical config.
- Admitting pivot candidates with a full reworked transaction: the three D-011-10 blockers each have a one-line answer; a transaction rewrite is not needed.

## Dead Ends

- Looking for a research `activeNodeId` in the registry: the research projection does not emit one, which is why the node-scoped counter cannot be enabled by a flag alone.

## Edge Cases

- Ambiguous input: "break resume and extend" could mean the live path or the historical audit. Both are separated in findings 2 and 3.
- Contradictory evidence: the prompt's "3 of 12" vs the measured 31 of 104 with a report. The measurement wins; the discrepancy is recorded here rather than smoothed over.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1158,1406,1775`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1248,1282`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:169,202`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:613`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2574`
- `.skilled/commands/deep/assets/deep-research.yaml:2199`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:68`
- Scan of `specs/system-deep-loop/**/deep-research-state.jsonl` (104 logs)

## Assessment

- New information ratio: 1.0
- Questions addressed: Q5 (a), (b), (c) and the next-focus consumer
- Questions answered: Q5: research stuck scoping is a one-gate change; the completion break is 31 historical reports, not a live resume/extend break; pivot admission has a three-part cheap design.

## Reflection

- What worked and why: scanning the committed state logs turned a remembered "3 of 12" into a measured 31 of 104 with a report, which changes the severity and the right fix.
- What did not work and why: looking for a research active-node field found none, so the stuck-scoping fix is two-part rather than one line.
- What I would do differently: run the population scan before reasoning about backward compatibility; the corpus is the evidence.

## Recommended Next Focus

Q6 prior art on the web, then synthesis.
