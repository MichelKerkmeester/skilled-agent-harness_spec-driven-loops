---
title: "Tasks: Goal-Criteria Lint"
description: "Ordered tasks for the operator's rubric, the zero-call lexical lint, the operator labels, the scorer and its stop line, and the conditional model arm on Deem or Jev and workflow line."
trigger_phrases:
  - "goal criteria lint tasks"
  - "lint-goal-criteria tasks"
  - "goal criteria labels tasks"
  - "score-goal-lint tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Goal-Criteria Lint

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

Tasks marked **Operator** are the operator's to complete. No agent completes them.

Tasks marked **After the gate** fall past this phase's label gate (parent D4). They stay open when the phase closes and are not part of its completion.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 **Operator, after the gate:** adopt a rubric for rules 4 and 5 from candidates A to D, or write a third, and record its id and two rule definitions on the "Adopted rubric" line. A (`mimo-02-strict-v1`) is the working default the build uses until then. Also decide whether the stop rule needs the interval floor under 0.05 (`spec.md`, section 4)
- [ ] T002 Capture the checker baseline with `SKDOC_SKIP_VALIDATION` unset: the `RESULT` line and exit code of `check-goal.cjs --all` before any new file exists (`implementation-summary.md`)
- [ ] T003 [P] Reopen the parser, walker and exit code lines before copying them (`check-goal.cjs:13-19`, `:140-149`, `:167-206`, `:212-217`, `:440-464`, `:695-716`)
- [ ] T004 [P] Write stub `jev` and `cli-deem` (proposed) binaries in a temporary directory that log their arguments and answer per case (outside the repository)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Import the three `goal-slice.cjs` helpers and copy `getAnchorBody`, `getGoalSections` and `getCriterionItems` with a "ported from check-goal.cjs" comment (`lint-goal-criteria.cjs`)
- [ ] T006 Write `rule4DanglingRefs(line)` for dangling referring expressions under working default A until the operator adopts a rubric (`lint-goal-criteria.cjs`)
- [ ] T007 Write `rule5ExternalFile(line)` for checks that need another document's content (`lint-goal-criteria.cjs`)
- [ ] T008 Write the walker that skips `z_archive` and every `scratch` segment and counts scratch files, and the `no_input`, `placeholder` and `lexical_unscored` classes (`lint-goal-criteria.cjs`)
- [ ] T009 Write the report and the `--json` output, with named lines for a missing packet or an unreadable file and exit 0 on every path (`lint-goal-criteria.cjs`)
- [ ] T010 Write the seven cases and the parser-parity assertion: rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal with no criteria and a scratch path excluded (`scripts/tests/lint-goal-criteria.test.cjs`)
- [ ] T011 Draw about 100 criterion lines, stratified by track group and goal kind with a recorded seed, and write each `id` and `text_sha12` with no criterion text and with `rubric`, `rule4_ok`, `rule5_ok` and `labeler` null (`goal-criteria-labels.jsonl`)
- [ ] T012 **Operator, after the gate:** label each drawn line under the adopted rubric, filling `rubric`, `rule4_ok`, `rule5_ok` and `labeler`. No model writes a label (parent D4) (`goal-criteria-labels.jsonl`)
- [ ] T013 Write the scorer: `rubric mismatch:` on mixed rubrics, the join on `text_sha12`, `stale=`, `unlabeled=` for rows with null label fields, per-rule TP, FP, FN, TN, precision, recall and F1, the rate with a Wilson 95% interval and the stop line under 0.05 (`score-goal-lint.cjs`)
- [ ] T026 Write the scorer cases on synthetic fixture labels the test writes to a temporary directory: per-rule counts, precision, recall and F1, the Wilson interval, `stale=`, `unlabeled=`, `rubric mismatch:` and the stop line under 0.05 (`scripts/tests/score-goal-lint.test.cjs`, proposed)
- [ ] T027 Update sk-create-goal's `SKILL.md`, `README.md` and `scripts/README.md`, add a changelog entry through sk-create-changelog, a playbook scenario through sk-create-manual-testing-playbook and an sk-doc hub catalog entry through sk-create-feature-catalog (parent D6)
- [ ] T014 **After the gate:** run the scorer on the operator's labels. If it prints `r20 model arm not built: labeled_violation_rate<0.05` (proposed), record the numbers and close the arm (`implementation-summary.md`)
- [ ] T015 [B] **After the gate.** Only past the stop rule and its promotion conditions: add the model arm. Behind `--jev`: the identity line, parent D1's three Jev checks with one `--provider`, the skip lines, the payload notice and 002's exit table by reference. Behind `--deem` (proposed): `cli-deem health` (proposed, phase 008) once per run, the four `deem arm skipped:` lines and the rest of the shared gate contract in 007's research section 12 by reference, never starting the server (`lint-goal-criteria.cjs`)
- [ ] T016 [B] **After the gate.** Only with per-rule precision of at least 0.8 and sk-doc's approval: add one advisory line before `step_check` (`create-goal-auto.yaml:228-229`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run `git diff --quiet` on `check-goal.cjs` and expect exit 0, then rerun `check-goal.cjs --all` and compare its `RESULT` line and exit code with T002's baseline
- [ ] T018 Run `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` and read every result
- [ ] T019 Run the lint with `--all` and on a missing packet, and read the counts, the scratch count and exit 0 each time
- [ ] T020 Run the lint and the scorer with the stub `jev` and `cli-deem` first on PATH and confirm both stub logs are empty, then run `grep -n API_KEY` on both scripts and expect no match
- [ ] T021 Run the scorer on a labels copy with two `rubric` values and expect `rubric mismatch:` and no rate
- [ ] T028 Run the scorer on the drawn labels file, with and without `--lint`, and expect `unlabeled=` equal to its row count, no rate and exit 0
- [ ] T029 Run `validate_document.py` on each doc T027 changed and the playbook package validator on sk-create-goal's playbook, and expect exit 0 from each
- [ ] T022 [B] **After the gate.** If the arm was built: run `--jev` against the stub for no credential, a wrong version, no `jev` on PATH and a set `JEV_PROVIDER`, and `--deem` against the stub for not reachable, a stub backend, a wrong model and a bad health response, and read each line, exit status and stub log
- [ ] T023 Run `git status --porcelain` and confirm only the five new files and the T027 docs changed, and `create-goal-auto.yaml` did not
- [ ] T024 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase
- [ ] T025 Fill `implementation-summary.md` with the working rubric, the lint counts, the sample's seed and row count and the gate state. The adopted rubric, the per-rule numbers, the rate and the stop decision are added after the gate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, except T001, T012, T014, T015, T016 and T022, which fall after the label gate (parent D4)
- [ ] No `[B]` blocked tasks remaining outside that after-the-gate set
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
