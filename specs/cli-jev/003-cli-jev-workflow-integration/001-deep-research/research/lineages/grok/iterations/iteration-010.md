# Iteration 10: grok-10 — The one slice, and what a loss kills

## Focus

If only one Jev integration ships, which one, and what a failed first slice kills. Focus Area is `grok-10`. The checklist in iteration 9 left a single `next` row.

## Actions Taken

Reread iteration 9's table and DeepSeek's ordering from iterations 2 and 3. No new seam was opened. No live `jev` call. MiMo still has no iteration file.

## Findings

The first slice is an offline arm on the routing-accuracy evaluation. It asks a Python `jev-cli` `choice` over the skills in one ambiguity cluster, plus an explicit "none" key. It prints MRR and right-skill-at-3 beside the similarity-only arm. It does not write the committed ranking. The flag defaults off. With no key the arm is skipped and the log says skipped, and the similarity numbers are unchanged.

DeepSeek iteration 2 reached the same first slice. That agreement is not independent. This lineage's reason for putting it first is question 1: it is the only idea whose harness and similarity baseline already exist. DeepSeek iteration 3's goal mode is a better plug-in and a worse first slice, because the labeled transcripts do not exist and `met` can overturn `goal-core.cjs:603`.

### What a loss kills

If the Jev arm does not beat similarity-only MRR or right-skill-at-3 on the held-out split, closed-set `choice` ideas die for this quarter:

- the severity `choice` beside a P0
- the `next_check` `choice`
- the goal `choice`, even with the blocking-language wrapper

They are the same shape: a small key set, no gold set yet, and a repository rule that already decides. A loss on the one shape that has a gold-like split is evidence those three would be built on hope.

A loss does not kill the two `noul` laters. A grader `noul` and an injection `noul` are different questions. They stay later because they still fail question 1, not because routing failed.

A loss does not revive anything in the drop list.

### What a win does not license

A win licenses a second offline arm on a second split. It does not license a live call in the 2500 ms advisor child, a hook under 1800 ms, a stop field, or a verdict change. Those died for structural reasons that a routing delta does not touch.

## Sources Consulted

- This lineage, iterations 1 through 9
- DeepSeek iterations 2 and 3
- Fitness checklist, opened in iteration 9

## Assessment

newInfoRatio: 0.34

Novelty justification: The kill radius of a failed first slice is new. The slice itself was named in iteration 6 and filtered in iteration 9.

Convergence telemetry: 0.34. Rolling average from iteration 4 onward is under 0.5. Mode is off. `stopPolicy` is max-iterations. This is iteration 10 of 10. The synthesis record, not this file, carries `stopReason`.

## Reflection

What worked: refusing to average DeepSeek's `next` on goals with this lineage's `next` on routing. They are different questions. One has a harness.

What failed: there is still no measured Jev number. The first slice is a plan, and this research does not run it.

Ruled out: shipping the goal verifier, the grader, or the screen before the routing arm has a delta.

## Recommended Next Focus

Synthesis. No further angle.

## Hand-off

- Single first build: offline Python `jev-cli` `choice` arm on the routing-accuracy script. Verdict `next`. Not `build-now`, because the arm's own delta is unmeasured.
- Kill criterion: held-out MRR or right-skill-at-3 does not beat the similarity-only arm.
- Dies with that loss: severity `choice`, `next_check` `choice`, goal `choice`.
- Survives a loss, still unscheduled: shadow grader `noul`, fail-closed injection `noul`.
- Stays dead: live route, live prune, live drop, stop authority, second hub mode, smell command, missing-answer coerced to 0 or 1.
