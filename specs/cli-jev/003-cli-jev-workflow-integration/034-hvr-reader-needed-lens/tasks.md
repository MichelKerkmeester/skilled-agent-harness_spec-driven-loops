---
title: "Tasks: Phase 34: hvr-reader-needed-lens"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hvr reader lens tasks"
  - "reader lens sibling script tasks"
  - "reader-needed lens verification"
  - "reader-needed lens label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 34: hvr-reader-needed-lens

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

`S` is `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`, `T` is `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` and `L` is `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl`. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds ran in number order. Closure (2026-09-29): built and committed as `2588231589`, 13 files with the route remint, and closed at its label gate. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the briefs in `scratch/w4-build/briefs/` and the session facts in `scratch/w4-session/docs/facts.txt`. No labels file is committed (parent D4).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the owner's contracts before writing: the packet's `SKILL.md`, `README.md` and `scripts/README.md`, `hvr_scan.py`, `test_hvr_scan.py`, `references/hvr-rules.md`, `shared/scripts/validation_switch.py`, `cli-classifier/cli-deem/SKILL.md` and `cli-classifier/cli-usage/SKILL.md`. Route the code write through sk-code (`.skilled/skills/sk-doc/sk-create-with-human-voice/`). Evidence: design section 1 rechecked each owner contract (`hvr_scan.py:8-11`, `:17-21`, `:26`, `:55-57`, `hvr-rules.md:275-288`, `:317-329`, `validation_switch.py:32`, `:105-118`, `cli-deem/SKILL.md:49-57`), each code brief routes the write through `.skilled/skills/sk-code/SKILL.md` (`c1.last.txt` prints `SKILL ROUTING: sk-code`), and the code steps c1 to c10 and every fix ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh` (`c1.status` to `c10f.status`; `SE` sections 1 and 2)
- [x] T002 Record the baseline: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py`, its PASS count, `ALL PASS` line and exit code saved before any change. 11 PASS on 2026-09-29 (`.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/`). Evidence: design section 1 and plan section 4 step 1 record 11 PASS, `ALL PASS` and exit 0 on 2026-09-29, and the session's final run of the unchanged file printed 11 and `ALL PASS` (`SE` section 2)
- [x] T003 [P] Build the test fixtures inside `T`: a temp git repository with two commits, skill folders holding flagged and unflagged sections, a heading inside a fence, a listed significance phrase, a false range and a genuine range, an untracked doc and a `.env` path, plus stub `jev` and `cli-deem` binaries that log one line per call (`T`). Evidence: c1 built the harness (`clean_env`, `temp_dir`, `_write_files`, `make_repo`, `JEV_STUB`/`DEEM_STUB`, `make_stubs`, `stub_log`, `stub_env`, `run_main`) and its two named cases pass (`c1.check.txt`); the final test file prints 42 `PASS` lines and `ALL PASS` (`SE` section 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Frame walker and scanner bridge: the In Scope path rule over HEAD's tree (`git ls-files` at planning; the docs review's P1 fix c13f moved `tracked_files` to `git ls-tree -r HEAD`), batched `hvr_scan.py --json`, `.env` refused, a skipped scan stopping the run and a scanner exit 2 stopping it with exit 2 (`S`). Spec REQ-002, REQ-003. Evidence: `T` passes `tracked files and read at commit`, `frame walker keeps skill markdown and refuses .env and changelog`, `census counts files, sections, flagged and in-band`, `a skipped scanner stops the run`, `a scanner exit 2 stops the run` and `census leaves out a staged, uncommitted doc` (`c10.final-check.txt`; `SE` section 3)
- [x] T005 Section splitter and census output: ATX headings outside fences, flagged sections, the 5 to 80 line band, candidates per comparator and the HEAD commit, zero calls and no text (`S`). Spec REQ-001, REQ-002. Evidence: `T` passes `split sections at ATX headings`, `a heading inside a fence does not split` and `census counts files, sections, flagged and in-band`; the final-state default run prints `census: commit=... files=7920 sections=107218 flagged=51057 in_band_5_80=40965 refused=5`, the three `candidates=` lines and no section text, and the stub log was never written (`c10.final-check.txt`; `SE` section 2)
- [x] T006 Comparators: the eight significance phrases parsed from the standard at run time and the false-range pattern (`S`). Spec REQ-005. Evidence: `T` passes `significance comparator flags a listed phrase`, `false-range comparator flags a construction and a genuine range` and `a thin standard stops the comparator parse` (`c4.check.txt`; `c10.final-check.txt`)
- [x] T007 `--draw --seed <n>`: 150 rows, 50 per category, candidate halves, the per-skill cap, hashes with no text and refusal to overwrite a label (`S`, `L`). Spec REQ-004. Evidence: `T` passes `draw is reproducible and carries no text`, `draw caps rows per skill per category`, `draw refuses to overwrite a labeled file` and `--draw needs a valid non-negative seed`; the real-tree proof `--draw --seed 20260929 --labels <scratchpad file>` exits 0 with `rows=150`, 50 per category, `candidate_rows=0`, 2 and 25, every label empty and no stub call (`c10.final-check.txt`; `SE` section 2)
- [x] T008 Baselines and label gate: both accuracies and the `yes` share per category, `stop: fewer than 150 labeled rows`, `margin: 0.10`, the `keep rule:` line, the headroom and power lines and `stop: fewer than 2 categories can pass` (`S`). Spec REQ-005, REQ-006. Evidence: `T` passes `label gate stops at 149 labeled rows`, `baseline picks the comparator only when it beats flag-nothing` and `headroom, power and the categories stop`; the final-state default run prints `margin: 0.10`, the `keep rule:` line, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows` (`c10.final-check.txt`; `SE` section 2)
- [x] T009 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with its category's fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012. Evidence: `T` passes `deem gate passes a torch health`, `deem gate skips a stub backend`, `deem arm prints a verdict and records every call`, `deem exit 4 with a changed commit pair stops the arm`, `a stored commit pair that differs prints requalify` and `--out is required for both switches`; the review's P1 fix c11f points the fallback at `node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs`, checked by c11g; the session's `--deem --out <dir>` run adds only `deem arm skipped: stub backend` after one health call, writes no file, and `--deem` without `--out` exits 2 before any call (`SE` sections 2 and 3)
- [x] T010 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012. Evidence: `T` passes `jev gate passes jev 0.6.2 with a credential`, `jev gate skips no credential`, `jev gate skips a wrong version`, `jev arm sends one --provider on every call` and `jev exit 3 after the gate stops the arm`; the session's `--jev --out <dir>` run prints the identity line and `jev arm skipped: no credential` after `jev --version` and `jev auth status --provider official`, writing no file (`c10.final-check.txt`; `SE` section 2)
- [x] T011 Verdict per column on stdout and in `report.json`: the order of spec REQ-006, integer counts, an exact p, the Brier score printed beside it, three category lines and both `requalify` lines (`S`). Spec REQ-006, REQ-013. Evidence: `T` passes `verdict keep when every check passes`, `verdict kill (precision)`, `verdict stop (coverage)`, `verdict stop (categories)`, `sign test is exact and returns p 1 at no disagreements`, `both switches print Jev first` and `report.json holds each column's verdict line, categories and identity`, the check the review's P1 fix c11h added; no verdict line has printed from the real tree (`SE` sections 2 and 3)
- [x] T012 [P] README rows for the script, the test and the labels file (`.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/README.md`). Evidence: `scripts/README.md` gains two rows, for the script and its test, plus a usage fence, and `validate_document.py` exits 0 (brief d11, +10 lines; `SE` sections 1 and 2). The labels-file row was dropped: no labels file is committed, since parent D4 outranks the design steps 11 and 15, which had the session commit the draw (`SE` section 1; `notes.md`; the deviation row in `goal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` exits 0 and prints `ALL PASS` with at least 18 checks, one happy path and one edge case per surface listed in spec REQ-014, and `test_hvr_scan.py` still prints T002's 11 PASS (`T`). Evidence: the final run prints 42 `PASS` lines and `ALL PASS`; the unchanged `test_hvr_scan.py` prints 11 `PASS` lines and `ALL PASS` (`SE` section 2)
- [x] T014 One zero-call run on the real tree with stub binaries first on `PATH`: record the census and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`). Evidence: the final-state default run exits 0 in 207 s with the census lines, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`; the stub log was never written; `git status` moved during the runs only by the session's own 029 and 030 doc commits (`SE` section 2)
- [B] T015 Run `--draw --seed <n>` on the real tree, record the seed and the candidate rows per category, and commit the drawn file through the parent session (`L`). Evidence: the draw proof ran with seed 20260929, exit 0 in 184 s, `rows=150`, 50 per category, `candidate_rows` 0, 2 and 25, every label empty; no labels file is committed, and the draw is the operator's first step (parent D4; `SE` sections 1, 2 and 6)
- [B] T016 The operator labels all 150 rows `yes` or `no` for each row's category. No model writes a label. Blocked on the operator (`L`). Evidence: no operator label exists, so the phase closed on the label gate stop (parent D4; `SE` sections 2 and 6)
- [B] T017 After T016, one zero-call run. Unless it prints `stop: fewer than 2 categories can pass`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line and category line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`). Evidence: no label exists and T016 has not run, so the second zero-call run and both model runs wait; the phase closed at the label gate (parent D4; `SE` sections 2 and 6)
- [x] T018 After T017, the packet's `SKILL.md`, `README.md`, the next changelog file, one sk-doc hub catalog entry in `document-validation` with its index row and one playbook scenario in `tell-detection` with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/sk-create-with-human-voice/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/sk-doc/`). Evidence: the eight docs landed in `2588231589` (briefs d11 to d18), each `VALID` on `validate_document.py` exit 0; the packet `SKILL.md` moved to 1.2.0.0 beside `changelog/v1.2.0.0.md`, the catalog entry is 2.2.0.0 and the scenario HVT-004 is 1.2.0.0, and the indexes and READMEs kept their versions (`SE` sections 1, 2 and 4). The step's `After T017` order did not hold: T017 waits on the operator's labels, so the docs were written from the label-gate state and no doc names a verdict line
- [x] T019 `validate_document.py` exits 0 on every doc T012 and T018 changed, the key grep of spec REQ-009 returns no match, `git diff --stat` on `hvr_scan.py` is empty and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`). Evidence: the key grep exits 1; `git diff --stat` on `hvr_scan.py` is empty and the file is byte-identical to HEAD; `validate_document.py` exits 0 on all eight changed docs; `git status --porcelain` listed the Files to Change paths plus the session's own other-phase doc edits during the runs (`SE` sections 1, 2 and 4)
- [x] T020 A cross-family review of `S` and `T` leaves no open P0 or P1 finding. Then the parent session commits with path-scoped commits (parent goal D5). Evidence: code, read by Pi MiMo, `VERDICT: FAIL` with 2 P1 and 3 P2; c11f, c11g and c11h closed both P1s and the recheck printed `VERDICT: PASS`; the session's own P1 census finding closed by c12f and c12g, recheck `VERDICT: PASS`; docs, read by DeepSeek on Cline, `VERDICT: FAIL` with 1 P1 and no P2, closed by c13f and c13g, recheck Pi MiMo `VERDICT: PASS`; the playbook fix f0 followed; the five P2 findings are recorded; committed as `2588231589`, 13 files with the route remint, not pushed (`SE` sections 3 and 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T015, T016 and T017 left `[B]` with the label gate stop line recorded as the phase's result
- [x] No `[B]` blocked tasks remaining other than T015, T016 and T017, which wait on the operator's draw and labels (parent D4)
- [x] Each backend whose gate passed printed a verdict line, or the zero-call run printed `stop: fewer than 2 categories can pass`; the final runs stopped at the label gate instead, since the operator has not drawn or labeled the rows (parent D4), and `stop: fewer than 150 labeled rows` is in `goal.md`'s log
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../004-deep-research-expansion/research/research.md:711-729` (R22) and `../007-classifier-deep-research/research/research.md:97` (C13), `:429` and `:927`
<!-- /ANCHOR:cross-refs -->

---
