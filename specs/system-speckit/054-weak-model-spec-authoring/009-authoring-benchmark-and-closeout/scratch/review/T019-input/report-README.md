# 2026-10-25--model-eval--authoring-baseline

> system-spec-kit · model-eval · authoring-baseline · cli-devin swe-2-max

---

## 1. HEADLINE / OVERVIEW

**Verdict: FAIL**

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

Each cell comes from three runs. The per-run rows are in `results.csv`.

---

## 3. METHODOLOGY

Fixture: one Level 3 packet for a `--quiet` flag on `recommend-level.sh`. The brief is `brief-1.txt` from the SWE 2 Max baseline, copied for each final run and compared with `cmp`, so no word changed. Each side is three serial runs by cli-devin `swe-2-max` on `--permission-mode dangerous` with a 2700 second watchdog. The measured documents are `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. The throwaway track is copied outside the worktree and then deleted after each measurement.

Metrics: `strict_passed` is the count of `RESULT: PASSED` lines from strict validation of the packet. `leftover_hints` counts bare v2.2 hint strings from the baseline list (121 patterns) plus v2.3 value tokens, so each unfilled instruction counts once whichever spelling the template used. `missing_anchors` sums the shortfall of each document against the baseline anchor counts (spec 7, plan 14, tasks 21, acceptance-criteria 3). `out_of_scope_writes` counts new lines in the git status after the run, outside the bench track and this phase folder. `seconds` is the dispatch end second minus the dispatch start second, the same clock the baseline used.

Each run's Devin session was found by working directory and start window, and its tool calls were searched in both the call and the update column for the baseline evidence folder, this phase's scratch folder and `/private/tmp`.

---

## 4. PER-CANDIDATE PROFILES

| Side | Tree | What the worker saw |
|---|---|---|
| baseline | Commit `ac2be31ec6`, before the packet changes | v2.2 templates, bare bracketed hints, the hand-written examples |
| final | Commit `a15bc0636e`, after phases 1 to 8 | v2.3 value tokens, section fill guidance, the authoring card, the guards |

---

## 5. PROCESS NOTES

Final runs 1 to 3 ran in order with nothing else touching the worktree. No attempt was discarded, and every dispatch exited with status 0. The audit found exactly one session per run and no tool call naming a forbidden path. The git diff of `.skilled` hashed the same before and after each run, and the status diff showed no write outside the bench track.

The three final runs took 437, 429, 1822 seconds. The three baseline runs took 326, 317, 384 seconds.

The report file is `README.md`, not the `benchmark-report.md` that the benchmark authoring skill names, because every existing folder under this reports root holds `README.md` and the index links to the folder.

---

## 6. FINDINGS

The load-bearing number is `missing_anchors`. Its final maximum is 6 against 0 on the baseline.
Run 3 wrote a `tasks.md` with 15 anchors where the baseline expects 21. Compared with run 1, it lacks `arch-verify`, `perf-verify`, `deploy-ready`, `compliance-verify`, `docs-verify`, `sign-off`. Strict validation still passed, so no validator rule catches those sections.

Scored against the contract-required anchors, all six runs miss 0 of 15 required `tasks.md` anchors. The six anchors run 3 deleted are optional in the contract.

Leftover hints fell: the final maximum is 0 and the baseline maximum is 1. Strict validation passed in all 3 final runs. No run wrote outside its track.

Time rose. Seconds per run ranged from 429 to 1822 on the final side against 317 to 384 on the baseline. Two final runs took about as long as each other (437 and 429), and run 3 took 1822.

---

## 7. CAVEATS

Three runs per side cannot support a significance claim. One run produced the whole regression, so the sample cannot say whether the omission comes from the template change or from ordinary run-to-run variation. The fixture is one small feature and four documents. The model is one model at one setting. A template change and a card change landed together, so this report cannot separate their effects.

The `spec.md`, `plan.md` and `tasks.md` of the three final packets, and the `tasks.md` of the three baseline packets, are kept as `.txt` copies under `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/bench-evidence/`. The rest of each final packet was copied to the conductor scratchpad outside the worktree and is not part of the repository. The raw run logs and audit files are in the source packet named in `source.md`.

---

## 8. RECOMMENDATIONS

- **Apply now.** Keep the already shipped template work as it stands, and do not read that as proof of a gain. Report the result as it is: C5 FAIL on the frozen metric, fewer leftover hints, and one run that deleted six optional Level 3 verification sections.
- **Validate first.** Make the `## L3+:` heading label unambiguous for Level 3 authors, then rerun this benchmark in a new phase with three or more runs on the same brief and see whether the omission recurs.
- **Future.** Decide whether strict validation should treat the optional Level 3 verification anchors as required when a packet records an ADR, a performance requirement or paired documents. That is a validator change and belongs to its own packet.

---

## 9. REPRODUCIBILITY

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 3 --track zz-bench-hints --short-name recommend-level-quiet-flag "Add a quiet flag to recommend-level.sh"
rg -o --no-filename "\[YOUR_VALUE_HERE: [^]]*\]" specs/zz-bench-hints/001-recommend-level-quiet-flag/*.md | sort -u > hints.txt
```

The dispatch and the five metric commands are in `scratch/tools/run-final.sh` in the source packet. Run it as `run-final.sh N dispatch` and then `run-final.sh N measure`. The three final runs took about 45 minutes together.

---

## 10. CROSS-LINKS

- Source packet: `specs/system-speckit/054-weak-model-spec-authoring`
- Baseline measurement: `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline-swe-l3/baseline.json`
- Delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/delta.json`
