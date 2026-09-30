---
title: "Tasks: Phase 28: confirm-mode-stop-hint"
description: "Ordered build and verification tasks for the offline confirm-mode stop hint evaluator: 027 report reader, hint counter, column switches, the Keep Rule, tests, one run and the parent D6 skill docs."
trigger_phrases:
  - "stop hint tasks"
  - "score-stop-hint tasks"
  - "hint precision tests"
  - "confirm-mode hint verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 28: confirm-mode-stop-hint

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

`S` below is `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs` and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts`. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds ran in number order. Code tasks went to the CLI executors of parent D5 as single-change briefs. Closure (2026-09-29): built and committed as `97200ea481`. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the dispatch briefs in `scratch/w4-build/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`). Evidence: 027 recorded `Test Files 124 passed (124)` and `Tests 2392 passed (2392)` before any wave-4 test file; after 027's contract fix the suite held 125 files and 2,428 tests all passing, the base this phase adds one file and 28 tests to (`SE` section 2; `notes.md`). The row is in `goal.md`'s log, recorded by this closure pass
- [x] T002 [P] Reopen `.skilled/commands/deep/assets/deep-research-confirm.yaml:1325-1354` and 027's final report format, and log any drift (`goal.md`). Evidence: design section 1 reads `gate_post_iteration:` at `:1325` and `on_D:` at `:1354`, unchanged at this closure pass, and 027's real report as 5,721 bytes with 16 lineages and `gate.label.passed=false`; the only drift is the one already logged in `goal.md`'s "Seam drift" row (`:1316-1345` to `:1325-1354`) (`SE` section 2; design section 1)
- [x] T003 [P] Write fixture 027 reports inside `V`: one with a passed gate and `legacy`, `sources`, `jev` and `deem` columns, one whose gate stopped, one without rater columns and one broken file (`V`). Evidence: `V` builds each fixture in a temp directory and prints `Tests 28 passed (28)`; cases 1 to 5, 11 to 25 cover the gated report, the two gate stops, the missing rater columns, the `stopped`/`skipped` shapes and the broken file (`SE` section 2; design section 3)
- [x] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` for the no-call check (`V`). Evidence: the no-call guard writes both stub binaries into a temp directory, puts it first on `PATH` and asserts the log never exists in the default and `--jev --deem` modes; the session's real runs also left both stub logs absent (`vitest.ts:399-418`; `SE` section 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the report reader: `--rater-report <dir>`, the label-gate check with `stop: rater report has no confirmed gold`, exit 2 on a missing or broken file and the report's SHA-256 (`S`). Evidence: brief c1's check prints `Tests 5 passed (5)` with `node --check` at exit 0; from the final state the refusals exit 2 before any output and the gate stop prints its one line and exits 0 (`scratch/w4-build/logs/c1.check.txt`; `SE` section 2; facts.txt)
- [x] T006 Write the hint counter of REQ-003 per column and lineage: hint iteration, right, wrong, no hint and iterations saved (`S`). Evidence: brief c2's check prints `Tests 11 passed (11)`; cases 6 to 11 pin the right and wrong hints, the no-hint boundaries at and past the recorded last iteration, the trimmed `M` from a null stop and the column line format (`scratch/w4-build/logs/c2.check.txt`; design section 3)
- [x] T007 Write the column selector: `legacy` and `sources` by default, `--jev` and `--deem` with their skip lines when 027 recorded no such column or recorded it skipped or stopped (`S`). Evidence: brief c3's check prints `Tests 15 passed (15)`; cases 12 to 15 pin the default two columns, both skip lines on a report without rater columns with the remaining output byte-identical, and the `stopped.jev` and `skipped.deem` shapes (`scratch/w4-build/logs/c3.check.txt`; design section 3)
- [x] T008 Write the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the rater fields and `requalify: rater changed` of REQ-006 and the proposed hint line of REQ-007 (`S`). Evidence: brief c4's check prints `Tests 24 passed (24)` and c5's `Tests 28 passed (28)`; cases 16 to 26 pin all seven outcomes, the stored verdict lines and the hint line; the review's P1 (requalify on every rerun) is closed by c6f with c6g pinning the round trip (`scratch/w4-build/logs/c4.check.txt`, `c5.check.txt`, `c6g.check.txt`; `SE` section 3)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write `V` with a happy path and one edge case per surface: reader pass and gate stop, broken file exit 2, hint counter right and wrong, both skip lines with byte-identical remaining output, `keep`, `kill` and `stop (precision)`, the proposed line on a keep and no stub call in any mode. Expect at least 10 passed tests (`V`). Evidence: `V` holds 28 `it(` cases in 424 lines and prints `Tests 28 passed (28)`, exit 0, against the floor of 10 (`scratch/w4-build/logs/c6g.check.txt`; `SE` section 2)
- [x] T010 Proof steps 1 to 3 on fixtures with logging stubs first on `PATH`. Read each exit status, the column lines, the verdict lines and two absent stub logs (`goal.md`). Evidence: from the final state the default run exits 0 with `stop: rater report has no confirmed gold`, `--jev --deem --out <dir>` prints the same line and creates no `<dir>`, and both stub logs stayed absent; the gated-report columns and verdicts rest on the `V` fixtures, since no real 027 report passed its label gate (parent D4; `SE` section 2; facts.txt)
- [x] T011 Proof step 5: `git status --porcelain` is the same before and after each run, and `git diff --stat .skilled/commands/deep/assets/` is empty (`goal.md`). Evidence: `git status` outside `specs/` was equal before and after every run, and the assets diff is empty at this closure pass; the build commit touches no workflow YAML (`SE` sections 2 and 5)
- [B] T012 One run on phase 027's real report with `--jev --deem`. Read each column's verdict or skip line. Blocked until 027 has a report whose label gate passed (`goal.md`). The run happened against 027's final report, whose label gate stopped, so it printed `stop: rater report has no confirmed gold` and no column line; the run past the gate waits on the operator's gold (parent D4; `SE` sections 2 and 6)
- [x] T013 Write the parent D6 docs through sk-doc after the run: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the scoring catalog entry and the scoring playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`). Evidence: the eight docs landed in `97200ea481` (`SKILL.md`, both READMEs, `changelog/v1.7.0.0.md`, catalog F057 with its index and playbook DLR-057 with its index) and `validate_document.py` exits 0 on each; the docs review's P2 (an unconditional gate-stop sentence) is closed by f1 with a `VERDICT: PASS` recheck (`SE` sections 2 and 3)
- [x] T014 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`). Evidence: the suite from the staged state printed `Test Files 126 passed (126)` and `Tests 2456 passed (2456)` against 027's 125 files and 2,428 tests, with the in-progress test files of 029 and 030 left out; this closure pass ran `validate.sh --strict` (`RESULT: PASSED`) and `check-goal.cjs` (`RESULT: PASSED (5/5 checks)`) from the final state, both exit 0 (`SE` section 2)
- [x] T015 Record every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`). Evidence: the only line the real runs printed, `stop: rater report has no confirmed gold`, is in `goal.md`'s log and `implementation-summary.md` Verification, recorded by this closure pass; no run printed a verdict line (`SE` section 2; facts.txt)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T012 left `[B]` with `stop: rater report has no confirmed gold` recorded as the phase's result
- [x] No other `[B]` blocked tasks remaining
- [x] Manual verification passed: the fixture runs and any real run were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
