# 2026-10-25--model-eval--authoring-baseline

> system-spec-kit · model-eval · authoring-baseline · cli-devin swe-2-max

---

## 1. HEADLINE / OVERVIEW

**Verdict: FAIL**

**Update on 2026-10-25, third amendment: the final set was rerun.** This report now holds two final sets, and they are different experiments. The first set, kept below as history, ran cli-devin `swe-2-max` on the tree before the L3+ label fix against a `swe-2-max` baseline. The operator then ruled out the swe-2 models and set a DeepSeek baseline. The second set ran cli-devin `deepseek-v4-1-flash-1017-max` on the tree after the fix (the fill note under each of the six `## L3+:` headings of `tasks.md` now opens with 'L3+ means Level 3 and above, so this section stays at Level 3.') against a new DeepSeek baseline of three runs at the packet start commit. The second set is the final set on the final tree. **Its verdict is FAIL.**

The second set's worst run is worse than the DeepSeek baseline's worst on missing_anchors: a final maximum of 3 against 0. Run 1 wrote a `tasks.md` with 18 anchors where the frozen list expects 21 and lacks `deploy-ready`, `compliance-verify` and `sign-off`. Runs 2 and 3 kept all 21. Run 2 is marked contaminated: its session read the frozen vocabulary files (section 5), so it is kept as recorded and not used as evidence of a clean pass. The verdict is FAIL with or without run 2, because run 1 alone is above the baseline maximum. Leftover hints were 0 in all three final runs against a baseline maximum of 1.

First set, history (swe-2-max, tree before the L3+ label fix):

Three baseline runs and three final runs of one frozen Level 3 authoring brief. Every final run passed strict validation, and leftover hints run from 0 to 1 on the baseline side and from 0 to 0 on the final side. The verdict is FAIL because the worst final run is worse than the worst baseline run on missing_anchors: a final maximum of 6 against 0. The verdict is PASS only when every final run passes strict validation and none is worse than the worst baseline run on leftover hints, missing anchors or out-of-scope writes.

C5 FAIL on the frozen metric, and the verdict stays FAIL. Run 3 deleted the six optional Level 3 verification sections in `tasks.md`: `arch-verify`, `perf-verify`, `deploy-ready`, `compliance-verify`, `docs-verify` and `sign-off`.

Diagnostic, chosen after the result and not a verdict. Scored against the anchors the Level 3 `tasks.md` contract requires (`template-structure.js contract 3 tasks.md`: 15 required, and these 6 optional), all six runs, three baseline and three final, miss 0 required anchors. The six deleted sections are the optional ones. Three of the deletions went against the template's own fill notes: the packet records ADR-001 (`plan.md` line 239 of run 3, kept as `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/bench-evidence/final-run-3/plan.txt`), it states NFR-P01 (`spec.md` line 133 of run 3, kept as `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/bench-evidence/final-run-3/spec.txt`), and it holds paired documents. The run's reply says 'L3+ optional sections dropped (this is Level 3, not 3+)', so it read the `## L3+:` heading prefix as meaning Level 3+ only. Leftover hints improved from a baseline maximum of 1 to 0. Run 3 took 1822 seconds against 437 and 429 for the other two, and the cause is unknown.

The operator chose to keep the frozen metric and the FAIL, and to add this diagnostic ("Option 3 + diagnostic").

---

## 2. AGGREGATE RESULTS

| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |
|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|
| strict_passed | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| leftover_hints | 0 | 1 | 0.7 | 0 | 0 | 0 | -0.7 |
| missing_anchors | 0 | 0 | 0 | 0 | 6 | 2 | 2 |
| out_of_scope_writes | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| seconds | 317 | 384 | 342.3 | 429 | 1822 | 896 | 553.7 |

Each cell above comes from three runs of the first set (`swe-2-max`, history). The per-run rows are in `results.csv`.

### 2.1 Second final set, third amendment (cli-devin deepseek-v4-1-flash-1017-max, tree after the L3+ label fix)

Baseline: three runs at the packet start commit `ac2be31ec6` in a disposable worktree. Final: three runs in this worktree after the label fix. The numbers come from `scratch/amend3/delta.json`.

| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |
|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|
| strict_passed | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| leftover_hints | 0 | 1 | 0.3 | 0 | 0 | 0 | -0.3 |
| missing_anchors | 0 | 0 | 0 | 0 | 3 | 1 | 1 |
| out_of_scope_writes | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| seconds | 217 | 298 | 252.3 | 198 | 259 | 233.3 | -19 |

| Set | Run | strict_passed | leftover_hints | missing_anchors | out_of_scope_writes | seconds | Session audit |
|-----|-----|---------------|----------------|-----------------|---------------------|---------|---------------|
| baseline | 1 | 1 | 1 | 0 | 0 | 242 | clean |
| baseline | 2 | 1 | 0 | 0 | 0 | 217 | clean |
| baseline | 3 | 1 | 0 | 0 | 0 | 298 | clean |
| final | 1 | 1 | 0 | 3 | 0 | 259 | status listing and own /tmp file only |
| final | 2 | 1 | 0 | 0 | 0 | 198 | contaminated: read frozen vocabulary files |
| final | 3 | 1 | 0 | 0 | 0 | 243 | status listing only |

Anchors per final run against the frozen list (`scratch/amend3/anchor-diff.txt`): run 1 spec 7 of 7, plan 14 of 14, tasks 18 of 21, acceptance-criteria 3 of 3. Runs 2 and 3 hold every anchor. The per-run rows are in `results-amend3.csv`.

Verdict rule, unchanged: every final run passes strict validation and the final maximum of `leftover_hints`, `missing_anchors` and `out_of_scope_writes` is at most the baseline maximum. Here `missing_anchors` is 3 against 0, so the verdict is FAIL.


---

## 3. METHODOLOGY

Fixture: one Level 3 packet for a `--quiet` flag on `recommend-level.sh`. The brief is `brief-1.txt` from the SWE 2 Max baseline, copied for each final run and compared with `cmp`, so no word changed. Each side is three serial runs by cli-devin `swe-2-max` on `--permission-mode dangerous` with a 2700 second watchdog. The measured documents are `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. The throwaway track is copied outside the worktree and then deleted after each measurement.

Metrics: `strict_passed` is the count of `RESULT: PASSED` lines from strict validation of the packet. `leftover_hints` counts bare v2.2 hint strings from the baseline list (121 patterns) plus v2.3 value tokens, so each unfilled instruction counts once whichever spelling the template used. `missing_anchors` sums the shortfall of each document against the baseline anchor counts (spec 7, plan 14, tasks 21, acceptance-criteria 3). `out_of_scope_writes` counts new lines in the git status after the run, outside the bench track and this phase folder. `seconds` is the dispatch end second minus the dispatch start second, the same clock the baseline used.

Second set (third amendment): same brief, same fixture, same five metrics, same scripts, with the model changed to `deepseek-v4-1-flash-1017-max` on `--permission-mode dangerous` and a 2700 second watchdog. The final runs ran in this worktree one after another, each with the per-process git setting `core.fsmonitor=false` because a git file-system monitor daemon had stalled `git ls-files` earlier the same day. The DeepSeek baseline was provisioned and run by a separate agent in a disposable worktree at `ac2be31ec6` and its folder is `scratch/amend3/baseline-deepseek/`. Its metrics use the frozen hint and anchor lists.

Each run's Devin session was found by working directory and start window, and its tool calls were searched in both the call and the update column for the baseline evidence folder, this phase's scratch folder and `/private/tmp`.

---

## 4. PER-CANDIDATE PROFILES

| Side | Tree | What the worker saw |
|---|---|---|
| baseline | Commit `ac2be31ec6`, before the packet changes | v2.2 templates, bare bracketed hints, the hand-written examples |
| final (first set, history) | Commit `a15bc0636e`, after phases 1 to 8 | v2.3 value tokens, section fill guidance, the authoring card, the guards |
| baseline (second set) | Commit `ac2be31ec6` in a disposable worktree | the same pre-change tree as the first baseline, run by cli-devin `deepseek-v4-1-flash-1017-max` |
| final (second set) | Commit `23657e227e`, phases 1 to 8 plus the L3+ label fix | the first final tree with 'L3+ means Level 3 and above, so this section stays at Level 3.' opening the six L3+ fill notes of `tasks.md` |

---

## 5. PROCESS NOTES

Final runs 1 to 3 ran in order with nothing else touching the worktree. No attempt was discarded, and every dispatch exited with status 0. The audit found exactly one session per run and no tool call naming a forbidden path. The git diff of `.skilled` hashed the same before and after each run, and the status diff showed no write outside the bench track.

The three final runs took 437, 429, 1822 seconds. The three baseline runs took 326, 317, 384 seconds.

The report file is `README.md`, not the `benchmark-report.md` that the benchmark authoring skill names, because every existing folder under this reports root holds `README.md` and the index links to the folder.

Second set (third amendment). All three final dispatches exited with status 0, the `.skilled` diff hash was the same before and after each run, and the status diff showed no write outside the bench track. Each audit found exactly one Devin session. The final runs took 259, 198, 243 seconds and the baseline runs took 242, 217, 298 seconds. The baseline runs happened while the suite rerun of this amendment was going on the same machine, so seconds are not like-for-like. Seconds are reported and are not part of the verdict rule.

The audit patterns gave hits, and they were read one by one. In runs 1 and 3 the hits are the benchmark's own files: the session ran `git status` and the listing named the untracked evidence folders of this phase, which is why the phase scratch pattern matched in the update column, and run 1 also wrote its own validation output to `/tmp`, which resolves to `/private/tmp`. Neither run read a baseline or phase file. Run 2 is different. Its session tried to read `scratch/baseline/hints-l3.txt` and `scratch/baseline/anchors-l3.txt` in this phase (neither path exists), read the frozen `hints-v2.3.txt` and `anchors-v2.3.txt` that sit in `scratch/baseline/`, and listed `scratch/bench-evidence/`, which holds the earlier runs' documents. Under the protocol rule that any hit marks a run contaminated, run 2 is contaminated and the stop rule fired. The three runs were already finished when this was read, because they ran in one unattended chain, so nothing was rerun. The run is kept as recorded. The evidence is `scratch/amend3/runs/T005-2.audit`, `.calls` and `.updates`. Runs 1 and 3 also have audit hits by the literal rule and are classified benign above, and that classification is a judgment from reading the hits, not a measurement.

---

## 6. FINDINGS

The load-bearing number is `missing_anchors`. Its final maximum is 6 against 0 on the baseline.
Run 3 wrote a `tasks.md` with 15 anchors where the baseline expects 21. Compared with run 1, it lacks `arch-verify`, `perf-verify`, `deploy-ready`, `compliance-verify`, `docs-verify`, `sign-off`. Strict validation still passed, so no validator rule catches those sections.

Scored against the contract-required anchors, all six runs miss 0 of 15 required `tasks.md` anchors. The six anchors run 3 deleted are optional in the contract.

Leftover hints fell: the final maximum is 0 and the baseline maximum is 1. Strict validation passed in all 3 final runs. No run wrote outside its track.

Time rose. Seconds per run ranged from 429 to 1822 on the final side against 317 to 384 on the baseline. Two final runs took about as long as each other (437 and 429), and run 3 took 1822.

Second set (third amendment). The load-bearing number is again `missing_anchors`: a final maximum of 3 against 0. The label sentence did not remove the omission. Run 1 still deleted three of the six optional Level 3 verification sections (`deploy-ready`, `compliance-verify`, `sign-off`) and kept `arch-verify`, `perf-verify` and `docs-verify`. Runs 2 and 3 kept all six, and run 2 is contaminated. Scored against the contract-required anchors, all six DeepSeek runs, three baseline and three final, miss 0 of 15 (`scratch/amend3/diagnostic.txt`, a diagnostic and not a verdict).

The fill notes of those three sections each carry a 'delete the section when' clause (the packet ships no service, none applies, no sign-off applies). The new sentence says the section stays at Level 3, and the same note then says to delete it under that condition. Whether run 1 acted on those clauses is UNKNOWN, because its reply holds only the final result line. What would confirm it is a transcript that shows the reason, or a rerun with the clauses reworded.

Leftover hints were 0 in all three final runs against a baseline of 1, 0 and 0. Strict validation passed in all three. Seconds ranged from 198 to 259 on the final side against 217 to 298 on the baseline, with the load difference noted in section 5.

---

## 7. CAVEATS

Three runs per side cannot support a significance claim. One run produced the whole regression, so the sample cannot say whether the omission comes from the template change or from ordinary run-to-run variation. The fixture is one small feature and four documents. The model is one model at one setting. A template change and a card change landed together, so this report cannot separate their effects.

The `spec.md`, `plan.md` and `tasks.md` of the three final packets, and the `tasks.md` of the three baseline packets, are kept as `.txt` copies under `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/bench-evidence/`. The rest of each final packet was copied to the conductor scratchpad outside the worktree and is not part of the repository. The raw run logs and audit files are in the source packet named in `source.md`.

Second set (third amendment): one run produced the whole regression and another is contaminated, so there are two usable clean runs. Three runs cannot separate the label sentence from run-to-run variation, and the first set's single regression and this set's single regression point at the same six sections. The model changed between the sets, so the two sets are not comparable with each other. The DeepSeek baseline and the final runs did not share a worktree, and the final worktree holds earlier benchmark evidence that a session can find (run 2 did), which the baseline worktree did not. The final copies of `spec.md`, `plan.md` and `tasks.md` are kept as `.txt` under `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/bench-evidence/`.

---

## 8. RECOMMENDATIONS

- **Apply now.** Keep the already shipped template work as it stands, and do not read that as proof of a gain. Report the result as it is: C5 FAIL on the frozen metric, fewer leftover hints, and one run that deleted six optional Level 3 verification sections.
- **Validate first.** Make the `## L3+:` heading label unambiguous for Level 3 authors, then rerun this benchmark in a new phase with three or more runs on the same brief and see whether the omission recurs.
- **Future.** Decide whether strict validation should treat the optional Level 3 verification anchors as required when a packet records an ADR, a performance requirement or paired documents. That is a validator change and belongs to its own packet.

Recommendations after the second set, which supersede the first set's 'Validate first' line (verdict FAIL again):

- **Apply now.** Keep the label sentence and the shipped template work. They do no harm on the measured data (leftover hints 0, strict validation 3 of 3) and there is no evidence that they remove the omission. Do not report criterion 5 as met.
- **Decide the metric.** The operator should decide whether `missing_anchors` should count the optional Level 3 verification sections. Against the contract-required anchors every run on both models and both trees scores 0 missing, so the frozen metric and the contract disagree about what a complete Level 3 `tasks.md` is.
- **Validate first.** Before another rerun, either reword the 'delete the section when' clauses of the three sections run 1 dropped, or accept that deleting them is allowed. Then run the final set in a worktree that holds no earlier benchmark evidence, as the baseline did, so a session cannot find the frozen lists.
- **Future.** A validator rule that requires the optional Level 3 verification anchors when a packet records an ADR, a performance requirement or paired documents is still a separate packet.

---

## 9. REPRODUCIBILITY

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 3 --track zz-bench-hints --short-name recommend-level-quiet-flag "Add a quiet flag to recommend-level.sh"
rg -o --no-filename "\[YOUR_VALUE_HERE: [^]]*\]" specs/zz-bench-hints/001-recommend-level-quiet-flag/*.md | sort -u > hints.txt
```

The dispatch and the five metric commands are in `scratch/tools/run-final.sh` in the source packet. The second set used `scratch/tools/run-amend3.sh` in the same way with the DeepSeek model, `scratch/tools/amend3-delta.sh` for the delta and `scratch/tools/amend3-diagnostic.sh` for the diagnostic. Run it as `run-final.sh N dispatch` and then `run-final.sh N measure`. The three final runs took about 45 minutes together.

---

## 10. CROSS-LINKS

- Source packet: `specs/system-speckit/054-weak-model-spec-authoring`
- Baseline measurement: `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline-swe-l3/baseline.json`
- Delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/delta.json`
- Second set delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/delta.json`, results in `results-amend3.csv`
- DeepSeek baseline: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/baseline-deepseek/baseline.json`
