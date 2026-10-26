# Remeasure report: four template generations on a task no template names

Date: 2026-10-26. Model: DeepSeek V4.1 Flash 1017 at max effort, through cli-devin, in four sandboxes run side by side each round.

## What was measured

Each round, the same author brief ran once in each sandbox: plan a `--min-percent <N>` option for `calculate-completeness.sh`, a task that no template, example or card in any sandbox names (`task_term_refs=0` for all four, `L/prep/prep-times.tsv`). Each author packet was then handed to an upkeep step on the same sandbox.

| Variant | Tree |
|---|---|
| pre054 | `ac2be31ec6`, before packet 054 |
| main-no054 | `9a80256f05`, main's side of the last merge, without 054 |
| now054 | `84887f37f7`, packet 054 as first shipped |
| refined | this worktree at snapshot `553ab62`, with phases 012 to 017 |

Rounds: 8. The main run (`20261026T164410Z-40710`) gave rounds 1 to 5. The main-no054 sandbox was marked dirty after round 2, because its round 2 author ran vitest inside the sandbox and wrote cache files under `node_modules/`, so the loop refused its rounds 3 to 5. A 3-round top-up with all four variants (`20261026T170823Z-68750`) gave rounds 6 to 8, with the refined snapshot reused. The loop edits and both runs' results are commit `eace51ce7c`. Every other run was valid: 29 author packets, 29 upkeep runs, none contaminated.

Quality: one fresh Opus medium grader per author packet, blind to the variant, scored six dimensions out of 30 after reading the real script (`grading/rubric.md`, 29 grade files, `grading/unblinded.tsv`). Each grader saw a copy of `spec.md`, `plan.md` and `tasks.md` under a neutral label, with template-source stamps and fill-note comments stripped; `implementation-summary.md` stays as `create.sh` wrote it and was not graded. The label map stayed in the conductor's session scratchpad until the last grade file existed. The 29 grader transcripts, kept with the two grading workflow runs, show 29 separate `opus-medium` agents; each read the real script and its own packet, touched no other packet label, and none read the label map, a results folder or an original packet path.

## Decision rule

A comparison is REAL only when at least 4 rounds give a valid pair and every pair has the same sign on the comparison's metric: `tok_out` for speed, the blind total for quality. A quality claim also needs the rescore's Verify ratio or residue mean to move the same way. A zero difference shares no sign. Everything else is INCONCLUSIVE. Seconds are reported and never decide. REQ-006 was written for 5 rounds ("4 of the 5 rounds"); with the top-up there are 8, and the rule is applied as at least 4 valid pairs with every pair sharing one sign, which is stricter as the pair count grows.

## Verdicts

Quality (blind total out of 30, variant minus baseline per round):

| Comparison | Meaning | Pairs | Diff mean | Verdict |
|---|---|---|---|---|
| main-no054 vs pre054 | main drift alone | 5 | +0.6 | INCONCLUSIVE (+3 +1 +2 -2 -1) |
| now054 vs pre054 | includes main drift | 8 | +1.9 | REAL better (all 8 pairs positive; Verify ratio 1.00 vs 0.00, residue 5.75 vs 6.50) |
| refined vs pre054 | includes main drift | 8 | +2.6 | INCONCLUSIVE (7 of 8 positive; round 5 is -1) |
| now054 vs main-no054 | authoring work alone | 5 | +1.0 | INCONCLUSIVE (-2 0 +2 +3 +2) |
| refined vs main-no054 | authoring work alone | 5 | +2.0 | INCONCLUSIVE (0 +1 0 +5 +4) |
| refined vs now054 | refinement effect | 8 | +0.8 | INCONCLUSIVE (+2 +1 0 +5 -4 -2 +2 +2) |

Speed (output tokens per run, variant minus baseline in the same round; seconds beside, never deciding). Both mean columns are paired means over the same rounds; `combined-summary.md` also prints an unpaired delta of means, which differs for the main-no054 rows because that variant ran 5 of the 8 rounds.

| Step | Comparison | Pairs | tok_out paired mean | Pairs fewer / more | tok_out verdict | Seconds paired mean | Seconds verdict |
|---|---|---|---|---|---|---|---|
| author | main-no054 vs pre054 | 5 | +4,894 | 1 / 4 | INCONCLUSIVE | -0.6 | INCONCLUSIVE |
| author | now054 vs pre054 | 8 | +882 | 4 / 4 | INCONCLUSIVE | -18.5 | INCONCLUSIVE |
| author | refined vs pre054 | 8 | +1,239 | 3 / 5 | INCONCLUSIVE | -11.9 | INCONCLUSIVE |
| author | now054 vs main-no054 | 5 | -3,591 | 4 / 1 | INCONCLUSIVE | -23.0 | INCONCLUSIVE |
| author | refined vs main-no054 | 5 | -3,900 | 4 / 1 | INCONCLUSIVE | -14.6 | INCONCLUSIVE |
| author | refined vs now054 | 8 | +356 | 4 / 4 | INCONCLUSIVE | +6.6 | INCONCLUSIVE |
| upkeep | main-no054 vs pre054 | 5 | +1,560 | 1 / 4 | INCONCLUSIVE | 0.0 | INCONCLUSIVE |
| upkeep | now054 vs pre054 | 8 | -1,563 | 5 / 3 | INCONCLUSIVE | -9.0 | INCONCLUSIVE |
| upkeep | refined vs pre054 | 8 | -1,255 | 4 / 4 | INCONCLUSIVE | -14.0 | INCONCLUSIVE |
| upkeep | now054 vs main-no054 | 5 | -2,017 | 4 / 1 | INCONCLUSIVE | -3.6 | INCONCLUSIVE |
| upkeep | refined vs main-no054 | 5 | -2,098 | 5 / 0 | REAL fewer | -9.2 | INCONCLUSIVE |
| upkeep | refined vs now054 | 8 | +308 | 3 / 5 | INCONCLUSIVE | -5.0 | INCONCLUSIVE |

## Means per variant

| Variant | Author s | Author tok_out | Author validate calls | Upkeep s | Upkeep tok_out | Upkeep validate calls | Blind total | Verification score |
|---|---|---|---|---|---|---|---|---|
| pre054 | 114.2 | 17,397 | 2.5 | 52.1 | 7,031 | 2.8 | 22.9 | 1.9 |
| main-no054 | 114.4 | 21,091 | 2.4 | 47.8 | 7,772 | 2.4 | 23.6 | 1.8 |
| now054 | 95.8 | 18,279 | 2.9 | 43.1 | 5,468 | 3.2 | 24.8 | 3.2 |
| refined | 102.4 | 18,636 | 2.4 | 38.1 | 5,776 | 1.4 | 25.5 | 3.6 |

Blind dimension means (grounding, requirements, verification, scope, consistency, clarity): pre054 4.0 4.5 1.9 4.4 4.0 4.1; main-no054 4.0 4.6 1.8 4.4 4.6 4.2; now054 4.4 4.5 3.2 4.5 4.1 4.0; refined 4.1 4.5 3.6 4.8 4.4 4.1.

## Rescore, old and new

| Variant | Old task: Verify ratio | Old task: residue | New task: Verify ratio | New task: residue |
|---|---|---|---|---|
| pre054 | 0.00 | 24.60 | 0.00 | 6.50 |
| main-no054 | 0.00 | 26.67 | 0.00 | 7.00 |
| now054 | 1.00 | 10.33 | 1.00 | 5.75 |
| refined | 1.00 | 10.00 | 0.98 | 6.00 |

Old task: the 23 uncontaminated packets from runs `20261026T050500Z-67716` and `20261026T140632Z-79914` (`rescore/rescore.md`); its refined row pools two earlier refined snapshots, `8c817f37` and `582ed0de`, not `553ab62`. New task: the 29 packets here (`rescore/rescore-minpct.md`). The new task is Level 1, so packets are short and residue counts are lower for every variant.

## What this says

1. The tree with packet 054 makes better packets than the tree before it: now054 beat pre054 in all 8 rounds, and the rescore moves the same way. That comparison includes main's own drift. The comparison that isolates 054's work, now054 against main-no054, is INCONCLUSIVE (-2 0 +2 +3 +2 over 5 rounds), so this run does not prove the gain comes from 054 alone, although main-no054 itself shows no established gain over pre054 (+0.6, INCONCLUSIVE). Most of the gain is in verification, +1.4 of the +1.9 total (tasks with `Verify:` clauses that would catch a wrong implementation); grounding adds +0.4.
2. Today's tree has the highest blind mean (25.5) and the best verification score (3.6), but its lead over now054 (+0.8) and its one losing round against pre054 keep both comparisons INCONCLUSIVE at 8 rounds.
3. No speed claim survives the rule except one: upkeep on today's tree spends fewer output tokens than main without 054, in all 5 pairs. Seconds favour the 054 trees on average but no comparison is consistent across rounds.
4. Today's tree asks for fewer validate runs per upkeep (1.4 against 3.2 for now054), which matches the one-quiet-validate change; it does not show up as a consistent seconds gain.

## Limits

- The blind verification score and the rescore's Verify ratio both reward `Verify:` clauses, and only the 054 templates prompt for them, so the rescore is not an independent check of the blind total on that point. The same clauses, and leftover tokens, can also tell a grader that a packet came from a 054 tree, even with stamps and fill notes stripped.
- main-no054 has 5 valid rounds, not 8, so every comparison against it rests on 5 pairs, two of them from the earlier run's rounds 1 and 2.
- The rubric was written for this round. Earlier blind rounds kept no rubric, so their totals (17.3 to 25.0) are not comparable with these.
- The refined snapshot `553ab62` was taken before the closeout edits made after the run started: the Level 2 to 3+ example edge cases and one research add-on example. Neither changes the core templates the author step reads; the examples could.
- The conductor and closeout agents edited this worktree while the loop ran. The loop's worktree guard recorded those as new status lines; it does not touch the sandboxes, and no run was contaminated.
- The two full test suites ran during the top-up rounds, so rounds 6 to 8 ran under more machine load than rounds 1 to 5. All four variants in a round shared it.
