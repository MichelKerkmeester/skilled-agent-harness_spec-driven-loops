# Iteration 4: Honesty thresholds calibrated on 678 committed lineages (F-1-001, with F-2-007)

## Focus
This pass revisits F-1-001 so that it closes with evidence. It also answers its child F-2-007, which asks two things:
- Which unexamined-pass thresholds flag the gen2 review stamps without flagging real passes?
- Does an observed ratio change any stop?

It also settles the correction recorded in `research.md`: does the review gateway path keep the model's stamp too?

## Actions Taken
1. Read the deep-review branch of `append-mode-event.cjs`.
2. Wrote `.executor-state/calibrate.cjs`, a read-only script. It applies the composite rule from iteration 1 to any lineage directory:
   - `future`: the projected stamp is more than 1 s after its own ledger commit;
   - `noReads+noFindings`: zero source reads and zero findings in the pass;
   - `batched`: a commit gap under 15 s with zero tool calls.
   It takes the last commit per iteration, so a re-recorded iteration is never matched to an older commit.
3. Ran it over **every committed fan-out lineage in `specs/`** that has a runner log: 701 directories, 678 with a state log, and 3,588 iteration passes. The live run's own lineages were left out.
4. Looked up the executor kind of each flagged lineage from its config.
5. Computed an observed ratio for the gen3 research lineages: the share of each pass's cited `file:line` locations that no earlier pass cited.

## Findings
1. **The review gateway path also lets the model choose the projected stamp, through a different mechanism. The fix must cover both modes.**
   - A review `iteration` or `iteration_start` row travels whole as `data.record` under `deep_review.iteration_recorded`. The projection writes the record back unchanged, so its model-written `timestamp` is what readers see. The envelope's `occurredAt` and `recordedAt` take the gateway clock. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:432-458]
   - The research upcaster instead promotes the stamp into `occurredAt`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:908-916]
   - **Change:** stamp the projected `timestamp` of `iteration` rows from the gateway clock in both paths, and keep the model's value as `claimedTimestamp`. This corrects iteration 1 finding 1, which named only the research path.
   - Value H, effort S, risk L.
2. **The composite rule flags 85 of 3,588 passes (2.4%) in 27 of 678 lineages.**
   - **0 of 328 research lineages are flagged.** That includes gen3 deepseek, whose real passes ran 33-98 s.
   - The flagged lineages are 19 `cli-opencode`, 6 `cli-pi`, 1 `cli-devin` and 1 `cli-mistral-vibe`.
   - **No `cli-claude-code` or native lineage is flagged.**
   - [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/opus/.executor-state/calibrate.cjs]
3. **A future stamp is common, grows run over run, and is safe to flag with zero tolerance.**
   - 17 lineages carry stamps later than their own commit, and the skew grows within each run. Examples:
     - `pi-deepseek-1`: +463 s at iteration 1, rising to +3,218 s at iteration 10;
     - `vibe-1`: +549 s rising to +7,852 s;
     - gen2 `deepseek`: +8 s rising to +126 s.
   - In each case the model is inventing a clock that runs ahead of the real one.
   - No Claude or research lineage had any skew above 1 s, so a 1 s bound produces no false positives in this corpus.
   - [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/deepseek/deep-review-state.jsonl] [INFERENCE: based on calibrate.cjs output over the 678 lineages]
4. **Zero reads plus zero findings is the coverage-faking shape, and it is mostly review dimension passes.**
   - 11 lineages hit it. In `mention-14`, passes 4-8 each read no source and reported nothing, yet each is a dimension pass that counts toward coverage.
   - The batched rule fired in only 2 lineages. One was gen2 deepseek iteration 12: 0.9 s after the previous commit, with zero calls.
   - [INFERENCE: based on calibrate.cjs output]
5. **The rule is deliberately conservative.**
   - It flags gen2 deepseek passes 8-12 but not passes 4-7, which the conductor also called stamped.
   - Passes 4-7 made 12-33 calls with 4-22 source reads and 0-1 findings, so they do show real reading.
   - Tightening the rule further, for example to "reads < 5", would start flagging real gen3 passes 4 and 7-9, which had 0-2 in-pass reads because their context carried over from earlier passes.
   - **Recommendation:** ship the three rules as calibrated here. Do not add a reads threshold without labelled data.
   - [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-review-gen2.md:297-312] [INFERENCE: based on toolcalls-probe.cjs per-pass counts in iteration 1]
6. **An observed ratio would not have changed any stop in gen3, so it is a guard rather than a stop driver.**
   - Cited-location novelty per pass:
     - gen3 deepseek: 1.00, 0.94, 1.00, 0.80, 1.00, 0.86, 0.83, 0.59, 1.00;
     - gen3 opus: 1.00, 1.00, 0.60, 0.90, 0.89.
   - All of these sit far above the 0.05 threshold.
   - Deepseek's self-reported 1.0 was inflated, but not enough to matter. Its cap stop was legitimate for a lineage whose passes kept citing new code.
   - This downgrades iteration 1 finding 7's observed-ratio half to value M, consistent with keeping held row 28 deferred.
   - Finding ids are useless for this measure, because every pass mints new ones.
   - [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/lineages/deepseek/iterations/iteration-001.md] [INFERENCE: based on the novelty computation over both gen3 lineages]
7. **How convergence should weigh a flagged pass: treat it like `thought`.**
   - Extend `isEvidenceBearingIteration` to drop rows carrying `passEvidence.unexamined === true`. A flagged pass then:
     - does not reset or advance the stuck count;
     - does not vote for a stop;
     - does not count as a frontier node visit;
     - cannot answer a node on its own.
   - [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:96-100] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1464] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2513-2520]
   - **Producer:** the runner cannot write a lineage's state log. The verdict must therefore come from a runner-side `pass_evidence` row on the root ledger, or from the post-attempt check that already runs at `fanout-run.cjs:4898-4923`.
   - The lineage's own convergence call still trusts its own rows. The in-lineage effect therefore needs the gateway to attach `passEvidence` when it records the row, using the commit gap it can see. It cannot see tool calls.
   - Value H, effort M, risk M.
8. **How the merge and the completion check should weigh a flagged pass: keep the evidence, discount the claims.**
   - In `fanout-merge.cjs`, keep the findings of a flagged pass, since they carry citations. Do not count its dimension coverage or node answers unless a second pass corroborates them.
   - Print `flagged passes` beside `Iterations` in the attribution table, in place of the "Convergence" column that today shows a self-reported ratio. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1216-1222]
   - In the completion check, a lineage with more than half its passes flagged settles as `fulfilled_unverified`, a new outcome. That keeps its work, and the operator gets a named rerun. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1283-1310]
   - Value H, effort M, risk M.

## Questions Answered
- **F-1-001 (lineage honesty):**
  - The signals are named and calibrated: future stamp, zero reads with zero findings, and a batched commit.
  - The weighing for convergence, the merge and the completion check is set out in findings 7-8.
- **F-2-007 (thresholds):**
  - The calibrated rule separates the stamps from every research lineage and every Claude or native lineage.
  - The observed ratio changes no gen3 stop.

## Questions Remaining
- F-2-006: the log shape of each runtime, which decides where tool calls can be counted.

## Ruled Out
- **A minimum-reads threshold:** it flags real context-carried passes (finding 5).
- **Finding-id novelty as an observed ratio:** ids are minted fresh on every pass.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence:
  - The conductor called all 9 of gen2 deepseek's late passes stamps, but the log shows real reads in passes 4-7. Both are recorded, and the rule sides with the log.
  - "3 of 12" in other briefs is a sample, while this calibration covers the whole committed corpus.
- Missing dependencies: 446 of the 678 lineages have text logs (`toolLog=none`), so only the skew rule applies to them.
- Partial success: none.

## Sources Consulted
- `runtime/scripts/append-mode-event.cjs`: 432-458; `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`: 908-916
- `runtime/scripts/frontier-admit.cjs`: 96-100; `runtime/scripts/convergence.cjs`: 1464; `deep-research/scripts/reduce-state.cjs`: 2513-2520
- `runtime/scripts/fanout-merge.cjs`: 1216-1222; `runtime/scripts/fanout-run.cjs`: 1283-1310, 4898-4923
- the ledger frames, state logs and `logs/fanout-lineage.out` of 678 committed lineages under `specs/` (list in `/tmp`, not kept)
- `scratch/dogfood-review-gen2.md`: 297-312; gen3 lineage iterations

## Assessment
- New information ratio: 0.75
- Questions addressed: F-1-001, F-2-007
- Questions answered: F-1-001, F-2-007

## Reflection
- **What worked:** running the rule on the whole corpus. It turned a two-lineage anecdote into a measured false-positive rate of zero on Claude, native and research lineages.
- **What did not work:** my first matcher, which took the first commit per iteration. I switched it to the last commit, so a resumed lineage cannot fake skew. The counts did not change.
- **What I would do differently:** hand-label 20 passes to test the conservative rule's recall beyond gen2.

## Recommended Next Focus
F-2-006: per-runtime log shapes and the single adapter contract (Q2).
