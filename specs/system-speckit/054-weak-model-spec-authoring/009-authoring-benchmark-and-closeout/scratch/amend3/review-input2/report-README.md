# 2026-10-25--model-eval--authoring-baseline

> system-spec-kit · model-eval · authoring-baseline · cli-devin swe-2-max

---

## 1. HEADLINE / OVERVIEW

**Verdict: PASS on the deciding set (fourth update), after FAIL on three earlier sets**

**Update on 2026-10-25, third amendment: the final set was rerun.** This report now holds three final sets, and they are different experiments. The first set, kept below as history, ran cli-devin `swe-2-max` on the tree before the L3+ label fix against a `swe-2-max` baseline. The operator then ruled out the swe-2 models and set a DeepSeek baseline. The second set ran cli-devin `deepseek-v4-1-flash-1017-max` on the tree after the fix (the fill note under each of the six `## L3+:` headings of `tasks.md` now opens with 'L3+ means Level 3 and above, so this section stays at Level 3.') against a new DeepSeek baseline of three runs at the packet start commit. The second set was the first final set on the final tree, and **its verdict is FAIL**. The operator later set a new anchor rule after seeing that result, so the fresh set decided criterion 5 next, and the second fresh set decides it now.

The second set's worst run is worse than the DeepSeek baseline's worst on missing_anchors: a final maximum of 3 against 0. Run 1 wrote a `tasks.md` with 18 anchors where the frozen list expects 21 and lacks `deploy-ready`, `compliance-verify` and `sign-off`. Runs 2 and 3 kept all 21. Run 2 is marked contaminated: its session read the frozen vocabulary files (section 5), so it is kept as recorded and not used as evidence of a clean pass. The verdict is FAIL with or without run 2, because run 1 alone is above the baseline maximum. Leftover hints were 0 in all three final runs against a baseline maximum of 1.


**Update on 2026-10-25, fix-completeness note fixed and a fourth final set run.** The cause of the previous failure was found and fixed at the source. Strict validation does not check that required anchors are present, and the fill note of the required `fix-completeness` section of `tasks.md` said 'Delete the rows that do not apply', which fresh run 1 read as permission to delete the section. The note now opens with 'Keep this section, because every level requires it.' and says 'Delete only the rows that do not apply, never the section.' The anchor rule and criterion 5 did not change. The fix is commit `74a629a7af`, and the full suite passed again with the same counts.

The fourth set is the second fresh set. It ran cli-devin `deepseek-v4-1-flash-1017-max` in a new disposable worktree created from `74a629a7af`, with this packet's folder deleted from its working tree, with the same brief, dispatch and measures, and with the rule script committed before any fresh run. **Its verdict is PASS.** Every run passed strict validation, leftover hints were 0, 1 and 0 against a baseline maximum of 1, counted `missing_anchors` was 0, 0 and 0 against 0, and no run wrote outside its track. The three earlier final sets all failed and stay below as history, each labelled with its model, its tree and the rule that scored it.

Read the PASS with its limits. It is the fourth set, it followed a template fix made after a failure was understood, and it is three runs on one model. The result shows that these three runs, on the fixed template, kept every required section and lost no required anchor. It does not show an effect size, and the section 7 caveats apply.

**Update on 2026-10-25, fresh runs under a new anchor rule.** After the second set failed, the operator chose "New rule, fresh runs". Parent criterion 5 now excludes an optional Level 3 section that a run deleted as its fill note allows. The rule was fixed and committed before any fresh run, as commit `e13115c7da`, and is implemented in `scratch/tools/justified-anchors.sh`. A frozen anchor that is missing from a packet counts, unless it is one of the six optional `tasks.md` anchors in the contract and its condition holds: `arch-verify` when the packet has no `ADR-<n>`, `perf-verify` when `spec.md` has no `NFR-P<n>`, and `deploy-ready`, `compliance-verify` and `sign-off` by task definition. `docs-verify` never holds. Any missing anchor in `spec.md`, `plan.md` or `acceptance-criteria.md` counts, and so does any required `tasks.md` anchor.

The rule scored the earlier sets before the fresh runs, and the scores are in `scratch/amend3/justified-anchors-test.txt`: the first swe-2-max final set scores 0, 0 and 3 (run 3 dropped `arch-verify`, `perf-verify` and `docs-verify` while its packet records ADR-001 and NFR-P01), the second DeepSeek set scores 0, 0 and 0, and all six baseline packets score 0. The second DeepSeek set cannot decide the box, because its result was seen before the rule was set.

The fresh set ran cli-devin `deepseek-v4-1-flash-1017-max` in a disposable worktree created from the pre-registration commit, with this packet's folder deleted from its working tree so no benchmark evidence could be read there. **The fresh set was the deciding set when it ran, and its verdict is FAIL. It was superseded by the second fresh set above, after the cause was fixed.** Run 1 deleted the whole `fix-completeness` section of `tasks.md`, a required anchor, and its fill note says to delete rows that do not apply and not the section. Counted anchors are 1, 0 and 0 against a DeepSeek baseline maximum of 0. Runs 2 and 3 are clean under the rule, and run 3 deleted `deploy-ready`, `compliance-verify` and `sign-off`, which the rule excuses. Leftover hints were 0 in all three fresh runs and every run passed strict validation.

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

Verdict rule at that time: every final run passes strict validation and the final maximum of `leftover_hints`, `missing_anchors` and `out_of_scope_writes` is at most the baseline maximum. Here `missing_anchors` is 3 against 0, so the verdict is FAIL.


### 2.2 Fresh set under the new anchor rule (cli-devin deepseek-v4-1-flash-1017-max, disposable worktree)

Baseline: the same three DeepSeek baseline runs as section 2.1. Final: three runs in a disposable worktree at commit `e13115c7da`, with the packet folder removed from its working tree. `missing_anchors` here is the counted value under the rule. The numbers come from `scratch/amend3/fresh/delta.json`.

| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |
|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|
| strict_passed | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| leftover_hints | 0 | 1 | 0.3 | 0 | 0 | 0 | -0.3 |
| missing_anchors | 0 | 0 | 0 | 0 | 1 | 0.3 | 0.3 |
| out_of_scope_writes | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| seconds | 217 | 298 | 252.3 | 153 | 223 | 194.7 | -57.7 |

| Set | Run | strict_passed | leftover_hints | missing_anchors (rule) | missing_anchors (raw) | out_of_scope_writes | seconds | Rule detail |
|-----|-----|---------------|----------------|------------------------|-----------------------|---------------------|---------|-------------|
| fresh final | 1 | 1 | 0 | 1 | 2 | 0 | 208 | counted 1 excused=[sign-off] counted_list=[fix-completeness] |
| fresh final | 2 | 1 | 0 | 0 | 0 | 0 | 223 | counted 0 excused=[] counted_list=[] |
| fresh final | 3 | 1 | 0 | 0 | 3 | 0 | 153 | counted 0 excused=[deploy-ready compliance-verify sign-off] counted_list=[] |

All three runs are scored again under the old and the new rule in the table below. The old column is the raw shortfall against the frozen anchor counts.

| Final set | Raw missing_anchors (old rule) | Counted missing_anchors (new rule) |
|-----------|--------------------------------|-------------------------------------|
| swe-2-max first set, history | 0, 0, 6 | 0, 0, 3 |
| DeepSeek second set | 3, 0, 0 | 0, 0, 0 |
| DeepSeek fresh set | 2, 0, 3 | 1, 0, 0 |

Verdict rule as now worded: every final run passes strict validation and the final maximum of `leftover_hints`, `missing_anchors` (counted under the rule) and `out_of_scope_writes` is at most the baseline maximum. Counted `missing_anchors` is 1 against 0, so the verdict is FAIL. The per-run rows are in `results-amend3.csv` under the set `amend3-fresh`.

### 2.3 Second fresh set after the fix-completeness note fix (cli-devin deepseek-v4-1-flash-1017-max, new disposable worktree)

Baseline: the same three DeepSeek baseline runs as section 2.1. Final: three runs in a new disposable worktree at commit `74a629a7af`, with the packet folder removed from its working tree. `missing_anchors` is the counted value under the rule. The numbers come from `scratch/amend3/fresh2/delta.json`.

| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |
|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|
| strict_passed | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| leftover_hints | 0 | 1 | 0.3 | 0 | 1 | 0.3 | 0 |
| missing_anchors | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| out_of_scope_writes | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| seconds | 217 | 298 | 252.3 | 164 | 228 | 193.7 | -58.7 |

| Set | Run | strict_passed | leftover_hints | missing_anchors (rule) | missing_anchors (raw) | out_of_scope_writes | seconds |
|-----|-----|---------------|----------------|------------------------|-----------------------|---------------------|---------|
| fresh2 final | 1 | 1 | 0 | 0 | 0 | 0 | 189 |
| fresh2 final | 2 | 1 | 1 | 0 | 0 | 0 | 228 |
| fresh2 final | 3 | 1 | 0 | 0 | 0 | 0 | 164 |

Every run kept all 21 `tasks.md` anchors, and every `spec.md`, `plan.md` and `acceptance-criteria.md` anchor, so the raw shortfall is 0 as well as the counted value. Run 2 has one bare hint left, and the baseline maximum is also 1. Verdict rule as now worded: every final run passes strict validation and the final maximum of `leftover_hints`, `missing_anchors` (counted under the rule) and `out_of_scope_writes` is at most the baseline maximum. All three hold, so the verdict is PASS. The per-run rows are in `results-amend3.csv` under the set `amend3-fresh2`.

---

## 3. METHODOLOGY

Fixture: one Level 3 packet for a `--quiet` flag on `recommend-level.sh`. The brief is `brief-1.txt` from the SWE 2 Max baseline, copied for each final run and compared with `cmp`, so no word changed. Each side is three serial runs by cli-devin `swe-2-max` on `--permission-mode dangerous` with a 2700 second watchdog. The measured documents are `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. The throwaway track is copied outside the worktree and then deleted after each measurement.

Metrics: `strict_passed` is the count of `RESULT: PASSED` lines from strict validation of the packet. `leftover_hints` counts bare v2.2 hint strings from the baseline list (121 patterns) plus v2.3 value tokens, so each unfilled instruction counts once whichever spelling the template used. `missing_anchors` sums the shortfall of each document against the baseline anchor counts (spec 7, plan 14, tasks 21, acceptance-criteria 3). `out_of_scope_writes` counts new lines in the git status after the run, outside the bench track and this phase folder. `seconds` is the dispatch end second minus the dispatch start second, the same clock the baseline used.

Second set (third amendment): same brief, same fixture, same five metrics, same scripts, with the model changed to `deepseek-v4-1-flash-1017-max` on `--permission-mode dangerous` and a 2700 second watchdog. The final runs ran in this worktree one after another, each with the per-process git setting `core.fsmonitor=false` because a git file-system monitor daemon had stalled `git ls-files` earlier the same day. The DeepSeek baseline was provisioned and run by a separate agent in a disposable worktree at `ac2be31ec6` and its folder is `scratch/amend3/baseline-deepseek/`. Its metrics use the frozen hint and anchor lists.

Fresh set: the same brief (`cmp` against the phase 1 brief, no difference), the same dispatch on cli-devin `deepseek-v4-1-flash-1017-max` with a 2700 second watchdog, and the same five metrics, except that `missing_anchors` is the counted value from `scratch/tools/justified-anchors.sh`, with the raw shortfall recorded beside it. The runs ran one after another in a disposable worktree made with `worktree-naming.sh create deepseek-final e13115c7da --no-provision`, provisioned with the per-process git setting `core.fsmonitor=false`. The packet folder was deleted in that worktree only, uncommitted, and the `.skilled` diff against the commit was empty before the first run and had the same hash before and after each run. All evidence files were written to this packet's scratch folder, outside the disposable worktree.

Second fresh set: identical to the first fresh set in brief, dispatch, measures, rule script and isolation, except for the tree (commit `74a629a7af`, which adds the fix-completeness note fix) and the worktree (a new one, `worktrees/224-deepseek-final2`, provisioned with `core.fsmonitor=false`). The `.skilled` diff against the commit was empty before the runs and had the same hash before and after each run. The evidence is in `scratch/amend3/fresh2/`.

Each run's Devin session was found by working directory and start window, and its tool calls were searched in both the call and the update column for the baseline evidence folder, this phase's scratch folder and `/private/tmp`.

---

## 4. PER-CANDIDATE PROFILES

| Side | Tree | What the worker saw |
|---|---|---|
| baseline | Commit `ac2be31ec6`, before the packet changes | v2.2 templates, bare bracketed hints, the hand-written examples |
| final (first set, history) | Commit `a15bc0636e`, after phases 1 to 8 | v2.3 value tokens, section fill guidance, the authoring card, the guards |
| baseline (second set) | Commit `ac2be31ec6` in a disposable worktree | the same pre-change tree as the first baseline, run by cli-devin `deepseek-v4-1-flash-1017-max` |
| final (second fresh set) | Commit `74a629a7af` in a new disposable worktree, packet folder removed | the label-fix tree plus the fix-completeness note fix, with no benchmark packet files readable |
| final (fresh set) | Commit `e13115c7da` in a disposable worktree, packet folder removed | the label-fix tree plus the committed records, with no benchmark packet files readable |
| final (second set) | Commit `23657e227e`, phases 1 to 8 plus the L3+ label fix | the first final tree with 'L3+ means Level 3 and above, so this section stays at Level 3.' opening the six L3+ fill notes of `tasks.md` |

---

## 5. PROCESS NOTES

Final runs 1 to 3 ran in order with nothing else touching the worktree. No attempt was discarded, and every dispatch exited with status 0. The audit found exactly one session per run and no tool call naming a forbidden path. The git diff of `.skilled` hashed the same before and after each run, and the status diff showed no write outside the bench track.

The three final runs took 437, 429, 1822 seconds. The three baseline runs took 326, 317, 384 seconds.

The report file is `README.md`, not the `benchmark-report.md` that the benchmark authoring skill names, because every existing folder under this reports root holds `README.md` and the index links to the folder.

Second set (third amendment). All three final dispatches exited with status 0, the `.skilled` diff hash was the same before and after each run, and the status diff showed no write outside the bench track. Each audit found exactly one Devin session. The final runs took 259, 198, 243 seconds and the baseline runs took 242, 217, 298 seconds. The baseline runs happened while the suite rerun of this amendment was going on the same machine, so seconds are not like-for-like. Seconds are reported and are not part of the verdict rule.

The audit patterns gave hits, and they were read one by one. In runs 1 and 3 the hits are the benchmark's own files: the session ran `git status` and the listing named the untracked evidence folders of this phase, which is why the phase scratch pattern matched in the update column, and run 1 also wrote its own validation output to `/tmp`, which resolves to `/private/tmp`. Neither run read a baseline or phase file. Run 2 is different. Its session tried to read `scratch/baseline/hints-l3.txt` and `scratch/baseline/anchors-l3.txt` in this phase (neither path exists), read the frozen `hints-v2.3.txt` and `anchors-v2.3.txt` that sit in `scratch/baseline/`, and listed `scratch/bench-evidence/`, which holds the earlier runs' documents. Under the protocol rule that any hit marks a run contaminated, run 2 is contaminated and the stop rule fired. The three runs were already finished when this was read, because they ran in one unattended chain, so nothing was rerun. The run is kept as recorded. The evidence is `scratch/amend3/runs/T005-2.audit`, `.calls` and `.updates`. Runs 1 and 3 also have audit hits by the literal rule and are classified benign above, and that classification is a judgment from reading the hits, not a measurement.

Fresh set. Every dispatch exited with status 0, exactly one Devin session was found per run, the `.skilled` diff hash was the same before and after each run, and no write fell outside the bench track. Seconds were 208, 223, 153, against 217, 242 and 298 on the baseline, and they were not measured under equal load. The audit searched the call and update columns of each session for ten strings (`baseline-swe`, `baseline-deepseek`, `bench-evidence`, `bench-packets`, `hints-`, `anchors-`, `009-authoring-benchmark-and-closeout`, `/private/tmp`, `authoring-baseline`, `model-eval`). No call text of any run names one of them. Every hit sits in a tool's output: in all three runs the output of `git status --porcelain`, which lists the uncommitted deletion of this packet's files by path, and in run 2 also the output of a code search for `recommend-level`, which returned one line of the report README that names the fixture. No file of the packet or the report was read, because the packet files do not exist in that worktree. The sessions did see file names, so this is a limit, not a clean zero (section 7). The hit lines are in `scratch/amend3/fresh/runs/T005-N.hits`.

Second fresh set. Every dispatch exited with status 0, exactly one Devin session was found per run, the `.skilled` diff hash was the same before and after each run, and no write fell outside the bench track. The audit searched ten strings in both columns. No call text of any run names one of them. Every hit is tool output naming paths: the output of `git status --porcelain`, which lists the uncommitted deletion of this packet's files (all three runs), the output of a file-list search for `recommend-level` that returned the report README path (run 1), and, in run 3, a `git status` after a repair of its own packet. No packet or report file was read. As in the first fresh set, the sessions could see file names, so this is a limit. Seconds were 189, 228 and 164 against 242, 217 and 298 on the baseline. The seconds are not like-for-like, because the baseline was measured on another day's load and no check was made for other sessions during the runs (the only check, at the start of run 1, found no other `devin -p` process).

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

Fresh set. Counted `missing_anchors` is 1, 0 and 0 (raw 2, 0 and 3). Run 1 left out `fix-completeness` and `sign-off`. The rule excuses `sign-off` and counts `fix-completeness`, because it is a required anchor in the contract. Strict validation still passed, so no validator rule requires that section. The section's fill note says 'Delete the rows that do not apply', and the run deleted the whole section, so this is not a deletion the note allows. Run 3 left out `deploy-ready`, `compliance-verify` and `sign-off`, all excused. Run 2 kept all 21 anchors. Scored against the contract-required anchors, run 1 misses 1 of 15 and runs 2 and 3 miss 0 (`scratch/amend3/fresh/diagnostic.txt`, a diagnostic and not a verdict). Leftover hints were 0 in all three runs against a baseline of 1, 0 and 0. Time was lower than the baseline (153 to 223 seconds against 217 to 298), without equal load.

Across all three final sets the omission moves: swe-2-max run 3 dropped six sections, DeepSeek second-set run 1 dropped three, and DeepSeek fresh run 1 dropped one required section. No set shows the same sections dropped twice, and the sample is too small to tell variation from an effect of the template wording.

Second fresh set. Counted and raw `missing_anchors` are 0, 0 and 0. The deletion of the `fix-completeness` section that failed the first fresh set did not recur in three runs. Leftover hints were 0, 1 and 0, with the baseline at 1, 0 and 0. Scored against the contract-required anchors, all three runs miss 0 of 15 (`scratch/amend3/fresh2/diagnostic.txt`, a diagnostic). Across all four final sets the dropped sections moved: six, then three, then one required section, then none. That pattern fits a fix that worked and it fits run-to-run variation, and three runs cannot tell them apart.

---

## 7. CAVEATS

Three runs per side cannot support a significance claim. One run produced the whole regression, so the sample cannot say whether the omission comes from the template change or from ordinary run-to-run variation. The fixture is one small feature and four documents. The model is one model at one setting. A template change and a card change landed together, so this report cannot separate their effects.

The `spec.md`, `plan.md` and `tasks.md` of the three final packets, and the `tasks.md` of the three baseline packets, are kept as `.txt` copies under `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/bench-evidence/`. The rest of each final packet was copied to the conductor scratchpad outside the worktree and is not part of the repository. The raw run logs and audit files are in the source packet named in `source.md`.

Second set (third amendment): one run produced the whole regression and another is contaminated, so there are two usable clean runs. Three runs cannot separate the label sentence from run-to-run variation, and the first set's single regression and this set's single regression point at the same six sections. The model changed between the sets, so the two sets are not comparable with each other. The DeepSeek baseline and the final runs did not share a worktree, and the final worktree holds earlier benchmark evidence that a session can find (run 2 did), which the baseline worktree did not. The final copies of `spec.md`, `plan.md` and `tasks.md` are kept as `.txt` under `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/bench-evidence/`.

Fresh set: it is one worktree with the packet folder removed, three runs, and one model. The sessions could see the names of the deleted files in `git status` output and, in run 2, one report line from a code search, so the isolation is strong for file contents and weaker for file names. The rule was written after the first two final sets were scored, which the parent goal states openly, and the fresh set is the first that was run after the rule was committed. The final copies of `spec.md`, `plan.md` and `tasks.md` are kept as `.txt` under `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh/bench-evidence/`.

Second fresh set: it is the fourth final set, run after a template fix aimed at the failure of the third, so the PASS is a result after repeated attempts and not a first-try result. It is one worktree with the packet folder removed, three runs and one model. The sessions saw the names of the deleted files. A different model, a different feature or a Level 1 packet is not measured. The final copies of `spec.md`, `plan.md` and `tasks.md` are kept as `.txt` under `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/bench-evidence/`.

---

## 8. RECOMMENDATIONS

- **Apply now.** Keep the already shipped template work as it stands, and do not read that as proof of a gain. Report the result as it is: C5 FAIL on the frozen metric, fewer leftover hints, and one run that deleted six optional Level 3 verification sections.
- **Validate first.** Make the `## L3+:` heading label unambiguous for Level 3 authors, then rerun this benchmark in a new phase with three or more runs on the same brief and see whether the omission recurs.
- **Future.** Decide whether strict validation should treat the optional Level 3 verification anchors as required when a packet records an ADR, a performance requirement or paired documents. That is a validator change and belongs to its own packet.

Recommendations after the second set, which supersede the first set's 'Validate first' line (verdict FAIL again):

- **Apply now.** Keep the label sentence and the shipped template work. They do no harm on the measured data (leftover hints 0, strict validation 3 of 3) and there is no evidence that they remove the omission. Do not report criterion 5 as met.
- **Decide the metric.** The operator decided this question with the anchor rule below. Against the contract-required anchors every run on both models and both trees scores 0 missing, so the frozen metric and the contract disagree about what a complete Level 3 `tasks.md` is.
- **Validate first.** Before another rerun, either reword the 'delete the section when' clauses of the three sections run 1 dropped, or accept that deleting them is allowed. Then run the final set in a worktree that holds no earlier benchmark evidence, as the baseline did, so a session cannot find the frozen lists.
- **Future.** A validator rule that requires the optional Level 3 verification anchors when a packet records an ADR, a performance requirement or paired documents is still a separate packet.

Recommendations after the fresh set, which supersede the two earlier sets' recommendations and are themselves superseded by the next block (verdict FAIL on the set that decided at that time):

- **Apply now.** Keep the label sentence and the shipped template work. Leftover hints are 0 in all six DeepSeek final runs and strict validation passed in all of them. Do not report criterion 5 as met.
- **Decide what a required anchor is.** `fix-completeness` is required in the contract, yet strict validation passes without it and its fill note invites deleting rows. Either add a validator rule that fails a packet without the required `tasks.md` anchors, or move `fix-completeness` to the optional set with a stated condition. That is a template and validator decision and belongs to its own packet.
- **Validate first.** Reword the `fix-completeness` fill note so it cannot be read as permission to delete the section, then rerun the final set in a fresh disposable worktree. The rule script and the worktree recipe are in the source packet and can be reused unchanged.
- **Future.** A larger run count would separate variation from an effect. Three runs per set cannot.

Recommendations after the second fresh set, which supersede the earlier ones (verdict PASS on the deciding set):

- **Apply now.** Ship the template changes as they are: the value tokens, the section fill guidance, the authoring card, the `L3+` label sentence and the `fix-completeness` note fix. Criterion 5 is met on the deciding set.
- **Validate first.** Nothing blocks shipping. A reader who wants more than a range should rerun the final set with more runs and a second model.
- **Future.** Strict validation still does not enforce required anchors, so a packet without a required `tasks.md` section can pass. That is an open follow-up and not fixed here. It belongs to its own packet, together with the `ANCHORS_VALID` rule.

---

## 9. REPRODUCIBILITY

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 3 --track zz-bench-hints --short-name recommend-level-quiet-flag "Add a quiet flag to recommend-level.sh"
rg -o --no-filename "\[YOUR_VALUE_HERE: [^]]*\]" specs/zz-bench-hints/001-recommend-level-quiet-flag/*.md | sort -u > hints.txt
```

The dispatch and the five metric commands are in `scratch/tools/run-final.sh` in the source packet. The second set used `scratch/tools/run-amend3.sh` in the same way with the DeepSeek model, `scratch/tools/amend3-delta.sh` for the delta and `scratch/tools/amend3-diagnostic.sh` for the diagnostic. The second fresh set used `scratch/tools/run-fresh2.sh`, `scratch/tools/fresh2-delta.sh` and `scratch/tools/fresh2-diagnostic.sh`. The first fresh set used `scratch/tools/run-fresh.sh`, `scratch/tools/fresh-delta.sh`, `scratch/tools/fresh-diagnostic.sh` and the rule script `scratch/tools/justified-anchors.sh`. Run it as `run-final.sh N dispatch` and then `run-final.sh N measure`. The three final runs took about 45 minutes together.

---

## 10. CROSS-LINKS

- Source packet: `specs/system-speckit/054-weak-model-spec-authoring`
- Baseline measurement: `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline-swe-l3/baseline.json`
- Delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/delta.json`
- Second set delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/delta.json`, results in `results-amend3.csv`
- DeepSeek baseline: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/baseline-deepseek/baseline.json`
- Second fresh set delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.json`
- Fresh set delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh/delta.json`, anchor rule scores in `scratch/amend3/justified-anchors-test.txt`
