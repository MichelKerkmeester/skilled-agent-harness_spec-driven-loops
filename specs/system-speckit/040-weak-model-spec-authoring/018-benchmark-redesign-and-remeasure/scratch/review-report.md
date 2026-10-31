# Review of scratch/report.md

Fresh, independent recompute. Paths below are relative to this phase folder (`P`).

## What was recomputed and matched

- Speed: `remeasure/combined-results.tsv` equals the two per-run `results.tsv` files merged, with the top-up's rounds 1 to 3 renumbered 6 to 8 (64 rows, 0 field differences). Valid runs (rc 0, timed_out 0, contaminated 0): 58; the 6 invalid rows are main-no054 rounds 3 to 5 (author ABORT, upkeep SKIP), and `results/20261026T164410Z-40710/main-no054/r3..r5/author.log` give the dirty-sandbox abort.
- Per-round tok_out pairs, recomputed:
  - upkeep refined vs main-no054 (rounds 1,2,6,7,8): -3321 -688 -3921 -49 -2513, all negative, 5 pairs: REAL fewer, as reported. Seconds -12 -8 -16 +1 -11, mean -9.2: INCONCLUSIVE, as reported.
  - author now054 vs pre054: -5378 +6815 +5729 -991 -4195 -1245 +544 +5779: INCONCLUSIVE, as reported. Seconds mean -18.5.
  - author refined vs main-no054: -4624 -8388 +1951 -5191 -3247: INCONCLUSIVE, as reported. Seconds mean -14.6.
  - upkeep refined vs now054: -2231 -1241 +2114 -3628 +4387 +274 +479 +2314: INCONCLUSIVE, as reported. Seconds mean -5.0.
  - All other eight speed rows are INCONCLUSIVE on recompute too; every seconds diff mean in the report matches the paired mean.
- Per-variant means (author and upkeep seconds, tok_out, validate calls) match `combined-summary.md` and my recompute.
- Quality: all 29 grade JSON files exist, each `label` matches its file name, each `total` equals the sum of its six scores, and `unblinded.tsv` agrees with the JSON files and `label-map.tsv` (0 mismatches). Blind-total pairs by round, recomputed from the JSON files:
  - main-no054 vs pre054: +3 +1 +2 -2 -1, mean +0.6, INCONCLUSIVE.
  - now054 vs pre054: +1 +1 +2 +2 +3 +4 +1 +1, mean +1.875, all positive; Verify ratio 1.00 vs 0.00 and residue 5.75 vs 6.50 both move the same way: REAL better.
  - refined vs pre054: +3 +2 +2 +7 -1 +2 +3 +3, mean +2.625, INCONCLUSIVE (round 5).
  - now054 vs main-no054: -2 0 +2 +3 +2, mean +1.0, INCONCLUSIVE.
  - refined vs main-no054: 0 +1 0 +5 +4, mean +2.0, INCONCLUSIVE.
  - refined vs now054: +2 +1 0 +5 -4 -2 +2 +2, mean +0.75, INCONCLUSIVE.
- Blind means and dimension means (22.9, 23.6, 24.8, 25.5; verification 1.9, 1.8, 3.2, 3.6) match at one decimal.
- New-task rescore means recomputed from `rescore/rescore-minpct.tsv`: residue 6.50, 7.00, 5.75, 6.00; Verify ratio 0.00, 0.00, 1.00, 0.98. Old-task means from `rescore/rescore.tsv` (23 packets: 12 + 11): Verify 0, 0, 1, 1; residue 24.60, 26.67, 10.33, 10.00. All match the report.
- Earlier blind totals range 17.3 to 25.0 matches `../015-template-example-neutralization/scratch/evidence-summary.md:14-15`.
- Tree SHAs and `task_term_refs=0` for all four variants match `../011-authoring-speed-research/scratch/speed-loop/prep/prep-times.tsv:13-17`.
- Stage-time stripping: the staging script (`stage_grading.py` in the conductor's session scratchpad) drops whole lines matching `<!-- SPECKIT_TEMPLATE_SOURCE ... -->` or `<!-- FILL: ... -->`. All 29 staged copies (`<scratchpad>/grade-minpct/<label>/`) hold 0 `TEMPLATE_SOURCE` and 0 `FILL` strings, so `report.md:18` is accurate on what was stripped.
- `label-map.tsv` was created at 18:22:23, after the last grade file (18:22:07), which fits "copied in afterwards".

No number in the report is wrong and no table verdict is wrong. The findings are about sentences that claim more than the rule grants and about Limits that leave out things a reader needs.

## Findings

### F1 [P1] report.md:78: attribution claimed that the rule did not grant

"Packet 054 makes packets better, and the evidence holds" attributes the gain to packet 054. The only REAL comparison is now054 vs pre054, which the report's own table (`report.md:31`) labels "includes main drift". The authoring-work-alone comparison, now054 vs main-no054, is INCONCLUSIVE (`report.md:33`: -2 0 +2 +3 +2). The supporting evidence for attribution (main-no054 verification 1.8, close to pre054 1.9) is a dimension mean, not a rule-passing comparison.

Fix: "The 054 tree beat the pre-054 tree in all 8 rounds, and the rescore moves the same way; that comparison includes main's drift. Against main without 054 (the authoring work alone) the result is INCONCLUSIVE at 5 pairs (-2 0 +2 +3 +2), though the verification dimension points the same way (main-no054 1.8, now054 3.2)."

### F2 [P2] report.md:78: "almost all in verification" overstates

now054 minus pre054 per dimension: grounding +0.375, requirements 0, verification +1.375, scope +0.125, consistency +0.125, clarity -0.125; total +1.875. Verification is 73% of the gain; grounding adds 20%.

Fix: "Most of the gain is in verification (+1.4 of +1.9), with grounding adding +0.4."

### F3 [P1] report.md:78 and report.md:22: the rescore is not independent corroboration, and Limits omits it

The rubric's verification dimension asks for "a `Verify:` clause naming a command" (`grading/rubric.md`, Verification row), and the rescore's Verify ratio counts `Verify:` clauses (`rescore/rescore-minpct.md:89`). Both reward the same surface feature, which the 054 templates prompt and the pre-054 templates do not (every pre054 and main-no054 packet scores 0.00; every now054 and refined packet 0.93 to 1.00). "The deterministic rescore agrees" reads as an independent check; it largely re-measures what the blind verification score already rewards. The same feature also tells a grader which template generation it is reading, so the grade is blind to the label but not to the generation.

Fix: add to Limits: "The rubric's verification dimension and the rescore's Verify ratio both reward `Verify:` clauses, which only the 054 templates prompt, so the rescore agreement is not independent of the blind score, and a grader can tell a 054 packet from a pre-054 packet by its shape even without the label." And in `report.md:78` replace "the deterministic rescore agrees" with "the rescore's Verify ratio moves the same way (it counts the same `Verify:` clauses the rubric rewards)".

### F4 [P1] report.md:18: blinding described without what was reachable

The report says the graders were "blind to the variant" and does not say where the label map was. Evidence: `stage_grading.py` writes the map at staging time to `<session scratchpad>/grade-minpct-map.tsv`, a sibling of the `grade-minpct/` folder the graders read, in the same session scratchpad that dispatched subagents share (this reviewer, a subagent of the same session, can read it). The originals are also readable inside the repository at `../011-authoring-speed-research/scratch/speed-loop/results/<run>/<variant>/r<n>/author-packet/`, whose path names the variant and whose text differs from the staged copy only by the stripped comment lines. Nothing shows a grader opened either: no grade file mentions a variant name, the map or a results path. But the grader prompts were not kept, so "never sees the label map" (`spec.md:166`, NFR-S01) is unconfirmed, not shown. "Kept outside the repository" is true and is not the same as "unreachable".

Fix: add to `report.md:18` or to Limits: "The label map sat in the conductor's session scratchpad next to the staged copies, and the original packets sit in the repository under variant-named paths; both were readable by the graders. No grade file refers to either, but the grader prompts were not kept, so blinding rests on the graders not looking. The map was copied into `grading/` after the last grade was written."

### F5 [P2] report.md:72 and report.md:74: old-task "refined" is a different tree

The Variants table (`report.md:14`) defines refined as snapshot `553ab62`. The old-task rescore row pools two other refined snapshots: `8c817f37` for run `20261026T050500Z-67716` and `582ed0de` for run `20261026T140632Z-79914` (`../011-authoring-speed-research/scratch/speed-loop/prep/prep-times.tsv:10-12`).

Fix: append to `report.md:74`: "The old task's refined row pools two earlier refined snapshots (`8c817f37` and `582ed0de`), not `553ab62`."

### F6 [P2] report.md:39-52: tok_out column and seconds column use different statistics

"tok_out delta of means" is variant mean minus baseline mean over all valid runs, so for every main-no054 row it compares 5 runs with 8 and includes pre054, now054 and refined rounds 3 to 5 that have no main-no054 partner. The seconds column is the paired per-round mean. For main-no054 rows the paired tok_out means differ noticeably: author main-no054 vs pre054 +4,894 (reported +3,695), now054 vs main-no054 -3,591 (-2,812), refined vs main-no054 -3,900 (-2,456); upkeep main-no054 vs pre054 +1,560 (+741), now054 vs main-no054 -2,017 (-2,304), refined vs main-no054 -2,098 (-1,995). The numbers are correct for their label; the verdicts are unaffected, since they use the pairs.

Fix: replace the column with the paired tok_out diff mean (values above; 8-pair rows are unchanged), or add a sentence under the table saying the two columns use different statistics and why.

### F7 [P2] report.md:22 vs spec.md:113: rule wording adapted without saying so

REQ-006 reads "at least 4 of the 5 rounds give a valid pair". The run has 8 rounds, and the report applies "at least 4 valid pairs, all of one sign" over up to 8 pairs. That is a reasonable reading and if anything stricter for the 8-pair rows, but the report restates the rule without "of the 5" and does not record the change.

Fix: add after `report.md:22`: "REQ-006 was written for 5 rounds; with the 3-round top-up it is applied as at least 4 valid pairs out of 8, every pair of one sign."

### F8 [P2] report.md:18: two process claims are not checkable from the artifacts

"One fresh Opus medium grader per author packet" (REQ-007) has no record in `grading/`: the grade JSON files carry no model or session field, and no dispatch log was kept. Graders also saw only `spec.md`, `plan.md` and `tasks.md` (the staging script copies those plus an `acceptance-criteria.md` that no Level 1 packet has), which the report does not say.

Fix: add "Graders saw `spec.md`, `plan.md` and `tasks.md` only." and either cite where the grader dispatch is recorded or say the model and effort are as dispatched and not recorded in the grade files.

### Notes, no change asked

- `remeasure/combined-summary.md` "Rounds" section shows order and wall time UNKNOWN for all 8 rounds, while both per-run `round.tsv` files hold them. The report does not cite that section.
- Four valid runs carry `contam_weak` hits (pre054 author r5 and r6, refined author r6, main-no054 upkeep r6); the sampled hits are validator fixture folder names such as `011-anchors-duplicate-ids`, which the audit counts as weak by design, so "none contaminated" at `report.md:16` stands.
- `report.md:81` ("matches the one-quiet-validate change") is phrased as a match, not a cause; per round, refined upkeep validate calls are at or below now054 in all 8 rounds (one tie), so the wording is supported.

Initial verdict (superseded): CHANGES NEEDED

## Fix check 2026-10-26

Fresh checker, against `report.md` as edited by the conductor. Line numbers are `report.md` lines.

- F1 [P1] fixed. `report.md:78` now says the 054 tree beat the tree before it, names main's drift, gives now054 vs main-no054 as INCONCLUSIVE (-2 0 +2 +3 +2 over 5 rounds) and says the run "does not prove the gain comes from 054 alone". Item 1 claims no more than the table at `report.md:30-35` grants. One wording note, not blocking: "main-no054 itself shows no gain over pre054 (+0.6, INCONCLUSIVE)" reads best as "no established gain"; the number and verdict sit beside it, so a reader is not misled.
- F2 [P2] fixed. `report.md:78`: "+1.4 of the +1.9 total ... grounding adds +0.4". The parenthetical paraphrases the rubric's Verification row (`grading/rubric.md:17`).
- F3 [P1] fixed. `report.md:85` adds the Limits bullet: both measures reward `Verify:` clauses, so the rescore is not independent on that point, and the clauses can reveal the template generation. `report.md:78` no longer says "the rescore agrees"; "moves the same way" is neutral.
- F4 [P1] fixed. `report.md:18` now says where the map was and cites the grader transcripts. Verified myself: `wf_38995f2e-b64/` holds 17 and `wf_b8cf529b-2be/` 12 `agent-*.jsonl` (29), each with a `meta.json` saying `agentType` `opus-medium`. Every transcript's tool calls touch `calculate-completeness.sh` and exactly one `scratchpad/grade-minpct/<label>` folder; the 29 labels are distinct; each writes only its own `grading/<label>.json`. No transcript, prompt included, contains `grade-minpct-map`, `label-map`, `speed-loop/results` or `author-packet`, and no tool call names a variant (`pre054`, `main-no054`, `now054`, `refined`) or `011-authoring`. Graders also read other repository files (the script's vitest file, `archive.sh`, `SKILL.md`, `validation-rules.md`, `rubric.md`) and their own tool-result overflow files; three ran `ls specs/zz-bench-authoring`, a path named in their packet, which does not exist in the worktree (`No such file or directory`). None of that reaches a label or variant. The claim at `report.md:18` holds.
- F5 [P2] fixed. `report.md:74` names `8c817f37` and `582ed0de`, "not `553ab62`".
- F6 [P2] fixed. `report.md:37` explains the statistic; `report.md:39-52` now shows the paired tok_out mean and fewer/more counts. Recomputed from `remeasure/combined-results.tsv` (valid = rc 0, timed_out 0, contaminated 0; pair = same step and round), all 12 rows match: author +4,894 1/4, +882 4/4, +1,239 3/5, -3,591 4/1, -3,900 4/1, +356 4/4; upkeep +1,560 1/4, -1,563 5/3, -1,255 4/4, -2,017 4/1, -2,098 5/0, +308 3/5. Seconds paired means match too (author -0.6 -18.5 -11.9 -23.0 -14.6 +6.6; upkeep 0.0 -9.0 -14.0 -3.6 -9.2 -5.0). Only upkeep refined vs main-no054 has every pair one sign with at least 4 pairs, so REAL fewer there and INCONCLUSIVE elsewhere is right.
- F7 [P2] fixed. `report.md:22` records the 5-round wording and how it is applied over 8 rounds.
- F8 [P2] fixed. `report.md:18` says graders saw `spec.md`, `plan.md` and `tasks.md`, and the Opus medium dispatch is now backed by the transcripts and meta files checked under F4.

Every P1 is fixed and no number checked is wrong.

Verdict: PASS

