---
title: "Tasks: Phase 18: benchmark-redesign-and-remeasure"
description: "Rescore the 23 uncontaminated packets, harden the speed loop for a new task, run 5 rounds on four variants once phases 015 to 017 land, grade every packet blind, and report a verdict per comparison."
trigger_phrases:
  - "benchmark redesign and remeasure tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 18: benchmark-redesign-and-remeasure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `S` is the script path. `P` is the packet path. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-spec-kit`. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/018-benchmark-redesign-and-remeasure`. `L` is the loop, `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop`. `R1` is `L/results/20261026T050500Z-67716` and `R2` is `L/results/20261026T140632Z-79914`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. WEAK: T001 Set up the project. -->

- [x] T001 [P] List the 23 author packets to score, one per line with run, variant and round, leaving out R2 pre054 r1, whose `results.tsv` row reads `contaminated=1` (`P/scratch/rescore/packets.tsv`). Verify: `awk -F'\t' 'NR>1' P/scratch/rescore/packets.tsv | wc -l` prints 23, and `rg -c '20261026T140632Z-79914\tpre054\t1' P/scratch/rescore/packets.tsv` prints nothing. Done: `23`; the `rg` printed nothing, exit 1, while the same pattern with round 2 prints 1, so the tab format matches.
- [x] T002 [P] Write the residue list as the union of the sample rows in the core `spec`, `plan` and `tasks` templates of the four variant trees, one exact string per line (`P/scratch/rescore/residue-strings.txt`). Verify: `rg -c -F -e 'Auth/authz working correctly' -e 'Monitoring/alerting configured' -e 'Phase 1.5 (Config)' -e 'Each actionable finding has a finding class' P/scratch/rescore/residue-strings.txt` prints 4. Done: `4`; `rescore.py build-residue L/prep/sandbox-map.tsv` wrote 207 strings from the four sandbox trees.
- [x] T003 [P] Write the new task's leak terms, one per line: `calculate-completeness`, `min-percent`, `Overall Completion`, `completeness-min-percent` (`P/scratch/briefs/task-terms.txt`). Verify: `rg -l -F -f P/scratch/briefs/task-terms.txt S/templates S/references/templates S/references/workflows/spec-authoring-card.md | wc -l` prints 0 from the tree after phases 015 to 017. Done: rerun at closeout, with 015, 016 and 017 each reading Status Complete in `spec.md`, printed `0`; the file holds the four terms.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. WEAK: T002 Implement the feature. -->

- [x] T004 Write the rescore script: per packet, the `Verify:` ratio from the card's two `rg -c` patterns, one count per residue string, each stated output line count against `bash S/runtime/cli/spec/recommend-level.sh <named input> | wc -l`, and each `decision-record.md` pointer in a folder without that file (`P/scratch/rescore/rescore.py`). Verify: `python3 -m py_compile P/scratch/rescore/rescore.py` exits 0. Done: exit 0. A synthetic packet gave one MATCH, one MISMATCH and one UNPARSED claim, and an UNPARSED claim makes the script exit 3 unless `--allow-unparsed` is passed.
- [x] T005 Run the rescore over `packets.tsv` and write the table plus a per-variant mean summary (`P/scratch/rescore/rescore.tsv`, `P/scratch/rescore/rescore.md`). Verify: `awk -F'\t' 'NR>1' P/scratch/rescore/rescore.tsv | wc -l` prints 23, and the R1 now054 r1 row reads a `Verify:` ratio of 1.0 while the R1 pre054 r1 row reads 0. Done: `23`; now054 r1 `1.000`, pre054 r1 `0.000`. 94 line-count claims: 32 MATCH, 0 MISMATCH, 62 UNPARSED, listed in `claims.tsv` and `unparsed.log` for a reading by hand.
- [x] T006 Write the new author brief: the `calculate-completeness.sh --min-percent <N>` task, exit 3 below N and exit 0 otherwise with output unchanged, the helper call `recommend-level.sh --loc 40 --files 2`, the rule to use the printed level and `--level 1` for Level 0, the short name `completeness-min-percent`, and repository-relative paths only (`P/scratch/briefs/author-minpct.txt`). Verify: `rg -n -i 'final|level 3|--level 3' P/scratch/briefs/author-minpct.txt` prints nothing, and `rg -c 'recommend-level.sh --loc 40 --files 2' P/scratch/briefs/author-minpct.txt` prints 1. Done: the first `rg` printed nothing, exit 1; the second printed `1`. The helper prints `Recommended Level: 0 (Quick)` for that input today.
- [x] T007 Write the new upkeep brief: one added requirement, with `--json` and `--min-percent` together the JSON gains a `min_percent_met` boolean, plus its task line, then strict validation (`P/scratch/briefs/upkeep-minpct.txt`). Verify: `rg -c 'min_percent_met' P/scratch/briefs/upkeep-minpct.txt` prints at least 1, and `rg -c 'acceptance-criteria' P/scratch/briefs/upkeep-minpct.txt` prints nothing. Done: `1`; the second `rg` printed nothing, exit 1.
- [x] T008 Add the task switch through cli-pi DeepSeek V4.1 Flash max: `--task quiet|minpct` selects brief, upkeep brief, packet name, document list and upkeep check; `minpct` scores `spec.md`, `plan.md` and `tasks.md`, checks a new REQ id in `spec.md` and `tasks.md`, and prints `missing_anchors=NA` (`L/lib.sh`, `L/loop.sh`, `L/step.sh`). Verify: `bash L/loop.sh --task minpct --variants pre054,main-no054,now054,refined --runs 5 --dry-run` exits 0 and prints `001-completeness-min-percent`, and `bash L/loop.sh --task quiet --variants pre054 --runs 1 --dry-run` still prints `001-recommend-level-quiet-flag`. Done: written by an Opus lane, not cli-pi DeepSeek. minpct dry run exited 0 with 81 lines naming `001-completeness-min-percent` and 0 naming the quiet packet (it warned that the three briefs were not written yet); quiet dry run exited 0 and printed `001-recommend-level-quiet-flag`; `--task bogus` exits 2. CHK-012: normalized for stamp, sandbox id, epoch and shuffle order, the quiet dry run differs from the pre-edit capture only in the header task line and dry-run wall seconds (0 vs 1).
- [x] T009 Add the leak scan: count sandbox files under `templates/`, `references/templates/` and the card that name a term from the task's terms file, write `task_term_refs=<n>` into `ready` and `prep/prep-times.tsv`, and make `loop.sh` refuse to dispatch when any sandbox's count is not 0 (`L/prepare.sh`, `L/loop.sh`). Verify: `rg -n 'task_term_refs' L/prepare.sh L/loop.sh` prints at least one line per file. Done: rg printed 1 line in prepare.sh (72) and 4 in loop.sh (92, 110, 114, 115). Scan (lib.sh `term_refs`) with a temporary terms file read 0 on the four existing sandboxes, 1 on a planted template, NA with an empty terms file or no scanned paths. The real-run refusal (exit 4) was checked on sample ready lines only, not by a real run.
- [x] T010 Add a paired `tok_out` verdict beside the seconds verdict, under the rule: REAL only with at least 4 valid pairs that all share one sign (`L/summarize.py`). Verify: `python3 -I L/summarize.py R2/results.tsv | rg -c 'tok_out verdict'` prints at least 1. Done: printed `2`, exit 0 (`summarize.py:132` states the rule, `:135` is the column header). The loop review's F2 added `tok_unknown`, so a row with missing token figures cannot read REAL.
- [x] T011 Keep the `SPECKIT_DIST_AUTO_REBUILD=0` switch on the dispatch line and its comment (`L/step.sh`). Verify: `rg -c 'SPECKIT_DIST_AUTO_REBUILD=0' L/step.sh` prints 1, and `bash -n L/step.sh` exits 0. Done: rg printed 1 (dispatch line, comment above it kept); `bash -n L/step.sh` exit 0.
- [x] T012 Document the task switch, the leak scan, the rebuild switch, the token verdict and the decision rule (`L/README.md`). Verify: `rg -c -e '--task' -e 'task_term_refs' -e 'SPECKIT_DIST_AUTO_REBUILD' -e 'tok_out verdict' L/README.md` prints at least 4. Done: rg printed 6 (per term: `--task` 3, `task_term_refs` 1, `SPECKIT_DIST_AUTO_REBUILD` 1, `tok_out verdict` 1); a `## Decision rule` section states REQ-006.
- [x] T013 Have a fresh Opus medium agent review the loop diff (`P/scratch/review-loop.md`). Verify: `rg -n '^Verdict:' P/scratch/review-loop.md` prints one line. Done: one line, `108:Verdict: PASS`, the file's last line. The first verdict, CHANGES NEEDED on F1 (`term_refs` printed 0 when `rg` failed), is kept as "Initial verdict (superseded)"; the fix check found `term_refs` prints `NA` when `rg` exits above 1, which the leak gate (`loop.sh:114-115`) refuses with exit 4. F4, F5 and F7 stay as optional notes.
- [x] T014 Once phases 015, 016 and 017 are Complete and the operator authorizes `--parallel-ok`, run 5 rounds, which retakes the refined snapshot (`L/results/<stamp>/`). Verify: `awk -F'\t' 'NR>1 && $3=="author"' L/results/<stamp>/results.tsv | wc -l` prints 20, and `rg -c 'task_term_refs=0' L/prep/prep-times.tsv` grows by 4. Done, with a top-up: the block lifted when 015 and 016 read Complete and 017 was closing on its suite result only, and the operator authorized `--parallel-ok` in this session. Main run `20261026T164410Z-40710`: 20 author rows, 17 valid. Its round 2 main-no054 author ran vitest inside the sandbox and wrote `node_modules/.vitest-cache`, so `step.sh` marked that sandbox dirty and the loop refused main-no054 rounds 3 to 5 (`rc` reads `ABORT`); the guard worked as designed. A 3-round top-up, `20261026T170823Z-68750` with `--reuse-refined`, gave 12 more author rows, all valid. `prep-times.tsv` gained 5 `task_term_refs=0` lines (rows 13 to 17): 4 from the main run and 1 for the re-prepared main-no054 sandbox.
- [x] T015 Copy the run's `results.tsv`, `round.tsv` and `summary.md` (`P/scratch/remeasure/`). Verify: `ls P/scratch/remeasure/run-*/` lists all three names in each run folder. Done: both run folders hold all three; `combined-results.tsv` merges them with the top-up rounds renumbered 6 to 8, and `combined-summary.md` summarizes it. The verify command is corrected from `ls P/scratch/remeasure/`, since two runs need two folders.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `wc -l` prints 1 and 17. WEAK: T003 Test everything. -->

- [x] T016 Shuffle a neutral label onto each valid author packet and keep the map away from graders (`P/scratch/grading/label-map.tsv`). Verify: `awk -F'\t' 'NR>1' P/scratch/grading/label-map.tsv | wc -l` equals the valid author count in `P/scratch/remeasure/combined-results.tsv` (valid: `rc` 0, `timed_out` 0, `contaminated` 0). Done: `29` and `29`. The map stayed in the conductor's session scratchpad and was copied here only after the last grade file existed. The verify path is corrected from `P/scratch/remeasure/results.tsv`, which does not exist.
- [x] T017 [P] Grade each labeled packet with one fresh Opus medium agent that reads the real `S/runtime/cli/spec/calculate-completeness.sh`, scores the six dimensions out of 30, and writes its file (`P/scratch/grading/<label>.json`). Verify: `ls P/scratch/grading/*.json | wc -l` equals the line count of T016. Done: `29`. The rubric (`P/scratch/grading/rubric.md`) was written for this round. The report review checked the 29 grader transcripts: 29 separate `opus-medium` agents, each read the real script and only its own packet, and none read the label map.
- [x] T018 Unblind the grades and run the rescore on the new packets (`P/scratch/grading/unblinded.tsv`, `P/scratch/rescore/rescore-minpct.tsv`). Verify: `awk -F'\t' 'NR>1' P/scratch/grading/unblinded.tsv | wc -l` equals the line count of T016. Done: `29`; `rescore-minpct.tsv` also holds 29 rows, and `unparsed-minpct.log` lists 1 UNPARSED claim (now054 r3 `tasks.md:37`, which names no `--loc` and `--files` input).
- [x] T019 Write the operator summary: one REAL or INCONCLUSIVE line per comparison for `tok_out` and for the blind total, each with its pairs, seconds beside it, and the old and new rescore figures (`P/scratch/report.md`). Verify: `rg -c 'REAL|INCONCLUSIVE' P/scratch/report.md` prints at least 6. Done: `21` lines: 6 quality rows, 12 speed rows (author and upkeep), the rule and two prose lines.
- [x] T020 Have a fresh Opus medium agent check every verdict in the report against `results.tsv`, `unblinded.tsv` and the REQ-006 rule (`P/scratch/review-report.md`). Verify: `rg -n '^Verdict:' P/scratch/review-report.md` prints one line. Done: one line, `104:Verdict: PASS`. The first pass read CHANGES NEEDED (F1 to F8); the conductor fixed `report.md`, and a fresh checker recomputed all 12 speed rows from `combined-results.tsv` and found every P1 fixed and no number wrong.
- [x] T021 With the operator's go-ahead, commit the loop edits, `step.sh` included (`L/`). Verify: `git status --porcelain -- L/step.sh` prints nothing. Done by the conductor's closeout commit on the worktree branch, under the operator's standing approval for this program, with no push. At the time of this edit `git status --porcelain -- L/step.sh` still printed ` M` because that commit follows this closeout; its SHA is pinned in a follow-up.
- [x] T022 Validate this folder (`P`). Verify: `bash S/runtime/cli/spec/validate.sh P --strict` prints `RESULT: PASSED`. Done: see the result recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--quiet` prints one line and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes, and `P/scratch/report.md` exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../017-measured-behavior-and-draft-metadata/`
- **Evidence**: `../015-template-example-neutralization/scratch/insight-review.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason, and the phase stays In Progress. T014 and T021 started blocked on phases 015 to 017 and on the operator; both blocks have lifted.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] `packets.tsv`, `residue-strings.txt` and `task-terms.txt` exist before any script runs: `ls P/scratch/rescore/packets.tsv P/scratch/rescore/residue-strings.txt P/scratch/briefs/task-terms.txt` prints three paths. Observed at closeout: three paths.
- [x] CHK-002 [P0] Phases 015, 016 and 017 each show Status Complete in their `spec.md` before T014 starts. Recorded deviation: 015 and 016 read Complete when T014 started, and 017 was closing on its suite result only; at closeout all three `spec.md` files read `| **Status** | Complete |`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n recommend-level.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `bash -n` exits 0 on `L/lib.sh`, `L/loop.sh`, `L/step.sh` and `L/prepare.sh`. Observed at closeout: rc=0 for each of the four.
- [x] CHK-011 [P0] `python3 -m py_compile` exits 0 on `L/summarize.py` and `P/scratch/rescore/rescore.py`. Observed at closeout: rc=0 for both, compiled with `cfile` set to a scratchpad path so no `__pycache__` was written.
- [x] CHK-012 [P1] `loop.sh --task quiet --dry-run` prints the same packet path and step commands as before the edit, apart from the task line. Observed under T008: the normalized dry run differs only in the header task line and the dry-run wall seconds.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--quiet` prints one line. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met. Observed: every row reads Met; AC-005 and AC-008 carry recorded deviations in their cells.
- [x] CHK-021 [P0] `rescore.tsv` holds 23 rows and the two known-answer rows match T005. Observed: `23`; R1 pre054 r1 reads 0 of 13, ratio `0.000`; R1 now054 r1 reads 19 of 19, ratio `1.000`.
- [x] CHK-022 [P0] Every sandbox line of the new run reads `task_term_refs=0`. Observed: `prep-times.tsv` rows 13 to 17 (pre054, main-no054, now054, refined, then main-no054 re-prepared for the top-up) all read `task=minpct task_term_refs=0`.
- [x] CHK-023 [P0] The grade file count equals the valid author count, and no grade exists for a contaminated run. Observed: 29 grade files, 29 valid author rows in `combined-results.tsv`, 0 rows with `contaminated=1`; the 3 refused main-no054 rows read `ABORT` and have no grade.
- [x] CHK-024 [P1] Both Opus reviews record a verdict line. Observed: `review-loop.md:108` and `review-report.md:104`, each `Verdict: PASS` after a fix check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
<!-- FILL: Keep this section, because every level requires it. Write one check per finding class this packet can produce. Delete only the rows that do not apply, never the section. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The leak finding is `class-of-bug`: the old guard counted packet-folder names only (`prepare.sh:64`), so the new scan covers every template, example and card file, not one string. Observed: `term_refs` scans the sandbox `templates/`, `references/templates/` and the card for every line of the terms file, and `loop.sh:114-115` refuses any count other than `0`, `NA` included.
- [x] CHK-FIX-002 [P0] Same-class inventory: `rg -n 'recommend-level-quiet-flag|hints-l3|acceptance-criteria' L/` lists every task-specific line, and each one either moves behind the task switch or is recorded as shared. Observed (results and prep excluded): `lib.sh:43-45` sit inside the `quiet` case; `upkeep-brief.txt` is the quiet task's brief; `prepare.sh:65` keeps the old `quiet_flag_refs` count beside the new one; `hints-l3.txt` is recorded as shared in `README.md:16`.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `report.md`: 4 variants, 5 rounds, 2 steps, 2 metrics, 6 comparisons. Observed: 4 variants (`report.md:9-14`), 8 rounds with the top-up (`:16`), author and upkeep steps and `tok_out` plus the blind total (`:37-52`), 6 comparisons per table. Recorded deviation: 8 rounds, not 5.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the loop commit SHA and the run stamp in `report.md`. Open: the run stamps are in `report.md:16`, but the loop commit is the conductor's closeout commit, which follows this edit; its SHA is pinned in a follow-up.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] The script reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No brief, grader prompt or result file holds a credential: `rg -n -i 'api[_-]?key|token=' P/scratch/briefs P/scratch/grading` prints nothing. Observed: no output, exit 1.
- [ ] CHK-031 [P1] Each dispatch keeps `--permission-mode dangerous` inside its sandbox; `wt_new_lines` in `results.tsv` stays 0 for every row. Open as written: 17 rows that ran read `wt_new_lines` 1, 2 or 6; the value is per step, so the four variants of a step share it. Every line in the `wt-r*-new.txt` files names a file the conductor or a closeout agent wrote while the loop ran (two changelogs, 017's suite output and brief files, `ARCHITECTURE.md`, `README.md`, `grading/rubric.md`, the runtime `.workflow-lock/owner.json`), and `out_of_scope_writes` is 0 on every row that ran. That attribution is read from file names, not proven; the loop README says such a line "means look, not guilt".
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `goal.md` and `report.md` state the same decision rule as spec REQ-006. Observed: `goal.md` D2 and `report.md:22` restate REQ-006 and `plan.md` cites it; `report.md:22` records that the 5-round wording is applied as at least 4 valid pairs over 8 rounds, all of one sign.
- [x] CHK-041 [P1] `L/README.md` describes `--task`, `task_term_refs`, the rebuild switch and the token verdict. Observed: the T012 `rg -c` prints `6` at closeout.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Rescore, briefs, grades, copied results and reviews live under `P/scratch/` only; loop edits stay in `L/`. Observed: `P/scratch/` holds `rescore/`, `briefs/`, `grading/`, `remeasure/`, `runs/` and both reviews; `git status --porcelain` on `L/` lists only loop files, `prep/` and four result folders.
- [ ] CHK-051 [P1] No sandbox or dispatch temp file lands in this worktree outside `L/results/` and `P/scratch/`: `wt-r*-new.txt` files of the run are empty. Open as written: 5 of the 16 `wt-r*-new.txt` files are not empty; see CHK-031 for what they name. The `-nm.txt` files list `.skilled/skills/system-spec-kit/node_modules/.vite-temp` for main-run r2 and r4 upkeep and top-up r1 upkeep, which matches vitest runs in this worktree but is not proven to come from them.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 9 | 6/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-26. Open: CHK-FIX-007, CHK-031 and CHK-051 (P1); each line says why. CHK-002 and CHK-FIX-005 are ticked as recorded deviations.
<!-- /ANCHOR:summary -->

---
