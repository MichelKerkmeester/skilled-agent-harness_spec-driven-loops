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

Evidence cites `E` for `scratch/w3-build/build-evidence.md`, the build orchestrator's record, and the session record for the orchestrator session's reruns, review and commit notes. `$G` is `.skilled/skills/sk-doc/sk-create-goal/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 **Operator, after the gate:** adopt a rubric for rules 4 and 5 from candidates A to D, or write a third, and record its id and two rule definitions on the "Adopted rubric" line. A (`mimo-02-strict-v1`) is the working default the build uses until then. Also decide whether the stop rule needs the interval floor under 0.05 (`spec.md`, section 4). Open at close: the operator has not adopted a rubric, and the build ran under A
- [x] T002 Capture the checker baseline with `SKDOC_SKIP_VALIDATION` unset: the stdout, stderr and exit code of `check-goal.cjs --all` before any new file exists (`implementation-summary.md`). Corpus mode prints no `RESULT` line (`check-goal.cjs:540-555`) and exits 2 whenever its error list is not empty (`:700-703`), so the whole output is the baseline. Evidence: at HEAD `996cf85eef`, with the switch unset and no `hook-flags.env`, `env -u SKDOC_SKIP_VALIDATION node $G/check-goal.cjs --all` printed `goals_scanned=353`, `phase_parents_scanned=36` and the five finding counts, wrote one stderr `ERROR` line for a scratch fixture whose frontmatter has no closing fence and exited 2. The outputs sit in `scratch/w3-build/baseline/` (`E` section 1)
- [x] T003 [P] Reopen the parser, walker and exit code lines before copying them (`check-goal.cjs:13-19`, `:140-149`, `:167-206`, `:212-217`, `:440-464`, `:695-716`). Evidence: the briefs cite the spans as they stood at the build's HEAD. Brief 01 names `check-goal.cjs:1-30` and `:140-217` and the require path at line 19, brief 04 names the walker at `:440-464` and brief 05 names `:557-586` and `:695-741`. The review found the port byte-identical to `check-goal.cjs:140-217` (session record)
- [x] T004 [P] Write stub `jev` and `cli-deem` (proposed) binaries in a temporary directory that log their arguments and answer per case (outside the repository). Evidence: `scratchpad/w3-006-stub`, outside the repository, held executable `jev` and `cli-deem` scripts that append their arguments to `<name>.log`. No model arm exists, so no per-case answer was needed. The directory was removed after P1 and P9 (`E` sections 2 and 4)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Import the three `goal-slice.cjs` helpers and copy `getAnchorBody`, `getGoalSections` and `getCriterionItems` with a "ported from check-goal.cjs" comment (`lint-goal-criteria.cjs`). Evidence: brief 01 on Devin DeepSeek. The comment sits at `lint-goal-criteria.cjs:60` (closure pass, `grep`). The parity test "the ported parser counts criteria the way check-goal does" passes, and the review found the three functions byte-identical to the original (`E` sections 3 and 4, session record)
- [x] T006 Write `rule4DanglingRefs(line)` for dangling referring expressions under working default A until the operator adopts a rubric (`lint-goal-criteria.cjs`). Evidence: brief 02 on Devin DeepSeek, the function at `lint-goal-criteria.cjs:229`. The rule 4 fail and pass cases pass (`E` sections 3 and 4, P2)
- [x] T007 Write `rule5ExternalFile(line)` for checks that need another document's content (`lint-goal-criteria.cjs`). Evidence: brief 03 on Pi MiMo, the function at `lint-goal-criteria.cjs:269`. The rule 5 fail and pass cases and the both-failing case pass (`E` sections 3 and 4, P2)
- [x] T008 Write the walker that skips `z_archive` and every `scratch` segment and counts scratch files, and the `no_input`, `placeholder` and `lexical_unscored` classes (`lint-goal-criteria.cjs`). Evidence: brief 03 wrote the line classes and brief 04 the walker. The `--all` run prints `scratch_excluded=30 placeholder=51 lexical_unscored=7 no_input=13`, the counts the planning prototype predicted, and the walker test excludes scratch paths and `z_archive` (`E` sections 1 and 4, P1 and P2)
- [x] T009 Write the report and the `--json` output, with named lines for a missing packet or an unreadable file and exit 0 on every path (`lint-goal-criteria.cjs`). Evidence: brief 05 on Pi MiMo. The lint printed `ERROR specs/no-such-packet: packet not found`, `ERROR unknown option: --bogus` and, on a temp tree whose only goal has mode 000, `ERROR specs/a/goal.md: EACCES: permission denied`, exit 0 each (`E` section 4, P8)
- [x] T010 Write the seven cases and the parser-parity assertion: rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal with no criteria and a scratch path excluded (`scripts/tests/lint-goal-criteria.test.cjs`). Evidence: briefs 01 to 05. The file holds 12 cases: the seven named ones, each `ok`, the parity case and four more for line and hash, the placeholder and unscored classes, the command line and the report (`E` section 4, P2, and section 6, deviation 2)
- [x] T011 Draw about 100 criterion lines, stratified by track group and goal kind with a recorded seed, and write each `id` and `text_sha12` with no criterion text and with `rubric`, `rule4_ok`, `rule5_ok` and `labeler` null (`goal-criteria-labels.jsonl`). Evidence: the orchestrator ran `node draw-labels.cjs 20260928 100`: seed 20260928, 100 rows over 21 strata, drawn from 1,357 distinct scored hashes. The check printed `rows=100 bad_schema=0 stale_hash=0 id_moved=0 distinct_hashes=100` (`E` sections 3 and 4, P4). The closure pass's own schema check printed `rows=100 bad=0 distinct_ids=100 distinct_hashes=100`, with the four label fields null on every row
- [ ] T012 **Operator, after the gate:** label each drawn line under the adopted rubric, filling `rubric`, `rule4_ok`, `rule5_ok` and `labeler`. No model writes a label (parent D4) (`goal-criteria-labels.jsonl`). Open at close: all 100 rows hold null label fields and wait for the operator
- [x] T013 Write the scorer: `rubric mismatch:` on mixed rubrics, the join on `text_sha12`, `stale=`, `unlabeled=` for rows with null label fields, per-rule TP, FP, FN, TN, precision, recall and F1, the rate with a Wilson 95% interval and the stop line under 0.05 (`score-goal-lint.cjs`). Evidence: brief 07 on Devin DeepSeek wrote the core and brief 08 on Pi MiMo the command line. On the drawn file it prints `unlabeled=100` and no rate, and on mixed rubrics `rubric mismatch: a,mimo-02-strict-v1` and no rate (`E` sections 3 and 4, P5 and P10)
- [x] T026 Write the scorer cases on synthetic fixture labels the test writes to a temporary directory: per-rule counts, precision, recall and F1, the Wilson interval, `stale=`, `unlabeled=`, `rubric mismatch:` and the stop line under 0.05 (`scripts/tests/score-goal-lint.test.cjs`, proposed). Evidence: briefs 07 and 08, 8 of 8 pass. The cases cover per-rule precision, recall and F1, the Wilson interval, the stop line, stale and unscored rows, unlabeled rows, mixed rubrics and two command-line runs (`E` section 4, P5, closure pass test names). The review checked the arithmetic by hand: rule 4 0.5, 0.5 and 0.5, rule 5 1, 0.5 and 0.6667 (session record)
- [x] T027 Update sk-create-goal's `SKILL.md`, `README.md` and `scripts/README.md`, add a changelog entry through sk-create-changelog, a playbook scenario through sk-create-manual-testing-playbook and an sk-doc hub catalog entry through sk-create-feature-catalog (parent D6). Evidence: briefs 09 to 17 on Pi MiMo, each a byte copy (`cmp` 0) of text the orchestrator wrote to sk-doc's rules for that doc type. `SKILL.md` went from 1.2.0.0 to 1.3.0.0, the changelog is `v1.3.0.0.md`, the scenario is SCG-009 and the catalog leaf is `document-validation/goal-criteria-lint.md`. `validate_document.py` exits 0 on all eight (`E` sections 3 and 4, G2)
- [ ] T014 **After the gate:** run the scorer on the operator's labels. If it prints `r20 model arm not built: labeled_violation_rate<0.05` (proposed), record the numbers and close the arm (`implementation-summary.md`). Open at close: no labeled row exists, so the scorer prints no rate yet
- [ ] T015 [B] **After the gate.** Only past the stop rule and its promotion conditions: add the model arm. Behind `--jev`: the identity line, parent D1's three Jev checks with one `--provider`, the skip lines, the payload notice and 002's exit table by reference. Behind `--deem` (proposed): `cli-deem health` (proposed, phase 008) once per run, the four `deem arm skipped:` lines and the rest of the shared gate contract in 007's research section 12 by reference, never starting the server (`lint-goal-criteria.cjs`). Open at close: not built, as the label gate requires. The review confirmed no model arm, no `--jev` or `--deem` and no spawn (session record)
- [ ] T016 [B] **After the gate.** Only with per-rule precision of at least 0.8 and sk-doc's approval: add one advisory line before `step_check` (`create-goal-auto.yaml:228-229`). Open at close: no precision is measured yet, and the yaml is unchanged (`E` section 4, P11)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run `git diff --quiet` on `check-goal.cjs` and expect exit 0, then rerun `check-goal.cjs --all` and compare its stdout, stderr and exit code with T002's baseline. Evidence: diff exit 0, sha256 `4bf117a9...aadcd6` unchanged, and stdout and stderr `cmp`-identical to the baseline with exit 2 as before. The session reran the comparison with the same result (`E` section 4, P3, session record). The closure pass's `git diff --quiet 996cf85eef HEAD` on the file exits 0
- [x] T018 Run `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` and read every result. Evidence: `tests 40`, `pass 40`, `fail 0`, exit 0, against 20 of 20 at baseline. The 20 new tests are 12 lint and 8 scorer cases. The session reran it with the same counts (`E` sections 4 and 5, P2 and G1, session record)
- [x] T019 Run the lint with `--all` and on a missing packet, and read the counts, the scratch count and exit 0 each time. Evidence: `goals_scanned=323 scratch_excluded=30 criteria=1543 scored=1485 rule4_violations=1017 rule5_violations=41 both_violations=40 placeholder=51 lexical_unscored=7 no_input=13 errors=0`, empty stderr, exit 0. The missing packet printed `ERROR specs/no-such-packet: packet not found`, exit 0 (`E` section 4, P1 and P8)
- [x] T020 Run the lint and the scorer with the stub `jev` and `cli-deem` first on PATH and confirm both stub logs are empty, then run `grep -n API_KEY` on both scripts and expect no match. Evidence: no stub log exists after either script, and `grep -n API_KEY` and `grep -n child_process` find no match, exit 1 each. The session reran both scripts under the stub `PATH` and the greps with the same result (`E` section 4, P1, P6 and P9, session record)
- [x] T021 Run the scorer on a labels copy with two `rubric` values and expect `rubric mismatch:` and no rate. Evidence: on a temp copy with rubrics `a` and `mimo-02-strict-v1` it printed `rows=100` and `rubric mismatch: a,mimo-02-strict-v1`, no rate, exit 0 (`E` section 4, P10)
- [x] T028 Run the scorer on the drawn labels file, with and without `--lint`, and expect `unlabeled=` equal to its row count, no rate and exit 0. Evidence: both forms print `rows=100 rubric=none unlabeled=100 stale=0 not_scored=0 labeled=0 no labeled rows`, no rate and no `precision=`, exit 0. The two outputs are `cmp`-identical (`E` section 4, P5)
- [x] T029 Run `validate_document.py` on each doc T027 changed and the playbook package validator on sk-create-goal's playbook, and expect exit 0 from each. Evidence: six docs `Total issues: 0`. The playbook root and catalog root keep the one `document_type_fallback` note they had at baseline, and read 0 with `--type playbook` and `--type feature_catalog`. The playbook package printed `PASS ... scenarios=9 ... violations=0 warnings=0`, and the catalog package printed its six baseline warnings and 0 failures. Exit 0 each, and the session reran all of them (`E` section 4, G2 and G3, session record)
- [ ] T022 [B] **After the gate.** If the arm was built: run `--jev` against the stub for no credential, a wrong version, no `jev` on PATH and a set `JEV_PROVIDER`, and `--deem` against the stub for not reachable, a stub backend, a wrong model and a bad health response, and read each line, exit status and stub log. Open at close: no arm was built, so there is nothing to run
- [x] T023 Run `git status --porcelain` and confirm only the five new files and the T027 docs changed, and `create-goal-auto.yaml` did not. Evidence: the status after the last dispatch lists 13 paths outside the other parallel builds and this scratch, the five new files and the eight T027 docs (`scratch/w3-build/logs/17.post.status`). `git diff --quiet` on the yaml exits 0 (`E` section 4, P11). Three derived paths joined later, outside the build: the session regenerated `.hermes/skills/sk-create-goal/SKILL.md` to clear the Hermes drift, and the commit hook regenerated two `activation/sk-doc/manifest.json` files, all in `2139eb8c0d` (session record). At close, `git status --short` on these paths and the yaml prints nothing
- [x] T024 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase. Evidence: the build's final checks printed `RESULT: PASSED` with 0 errors and 0 warnings and `RESULT: PASSED (5/5 checks)` (`E` section 4, P7). The closure pass reran both after its edits (`implementation-summary.md` Verification)
- [x] T025 Fill `implementation-summary.md` with the working rubric, the lint counts, the sample's seed and row count and the gate state. The adopted rubric, the per-rule numbers, the rate and the stop decision are added after the gate. Evidence: the closure pass filled it from `E` and the session record
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, except T001, T012, T014, T015, T016 and T022, which fall after the label gate (parent D4). Evidence: every other task above carries its evidence, and those six stay open for the operator's rubric and labels
- [x] No `[B]` blocked tasks remaining outside that after-the-gate set. Evidence: the `[B]` tasks are T015, T016 and T022, all in that set
- [x] Manual verification passed. Evidence: the session reran the lint and the scorer under stub binaries, the suite, the checker comparison, its own label schema check, the greps and the doc and package validators from the final state, and a Claude `review` agent passed the code with no P0 or P1 (session record)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
