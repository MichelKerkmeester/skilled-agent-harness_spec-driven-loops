---
title: "Implementation Plan: Goal-Criteria Lint"
description: "A zero-call lexical lint for sk-create-goal rules 4 and 5 beside check-goal.cjs, a scorer against operator labels under a rubric adopted first, and a model arm on Deem or Jev, each backend behind its own parent D1 check, built only past the stop rule."
trigger_phrases:
  - "goal criteria lint plan"
  - "lint-goal-criteria plan"
  - "score-goal-lint plan"
  - "goal criteria rubric labels"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Goal-Criteria Lint

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), no new dependency |
| **Framework** | `node:test` for the test file, matching `check-goal.test.cjs`. `goal-slice.cjs` for the durable-slice helpers |
| **Storage** | `goal-criteria-labels.jsonl` beside the scripts, with ids and hashes only. Lint JSON goes to a path the operator names |
| **Testing** | `node --test` on `scripts/tests/`, runs with stub `jev` and `cli-deem` (proposed) binaries for zero calls, `git diff --quiet` and a before-and-after `check-goal.cjs --all` for the unchanged checker |

### Overview

The lint walks active `goal.md` files, cuts each durable slice with `goal-slice.cjs`, extracts criterion bullets with a copy of `check-goal.cjs`'s parser and runs two lexical rule functions on each line. It prints a report, or JSON with `--json`, and always exits 0. The operator adopts a rubric, then labels about 100 stratified lines under it. The scorer joins those labels to the lint's JSON and prints per-rule precision, recall and F1, the labeled violation rate and, when that rate is under 0.05, the stop line that closes the model arm on both backends.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] The operator has adopted a rubric and it is recorded in `spec.md`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two standalone advisory scripts beside the checker, with no shared helper. The lint copies about 60 lines of `check-goal.cjs`'s parser, because that file exports only packet-level runners (`check-goal.cjs:681-689`) and adding exports would widen a frozen completion gate for one caller. The copy keeps `check-goal.cjs` byte-identical and deletes cleanly.

### Key Components

- **Parser copy**: imports `extractDurableSlice`, `splitFrontmatter` and `LOG_ANCHOR` from `.skilled/hooks/goal/lib/goal-slice.cjs`, as `check-goal.cjs:13-18` does, and copies `getAnchorBody` (`:135-144`), `getGoalSections` (`:162-201`) and `getCriterionItems` (`:207-212`) under a "ported from check-goal.cjs" comment.
- **`rule4DanglingRefs(line)`**: finds referring expressions such as "the", "this", "every" or "its" followed by a head noun, and flags each one whose head noun is not self-naming in the line. A head noun is self-naming when it sits in backticks or quotes, is a path, is on a locality list (`repo`, `packet`, `child`, `line`, `command`, `operator`, `test`) or is followed by `:`, `=` or `of` plus a named thing. The pattern set follows swe-04's design and is tuned to the adopted rubric.
- **`rule5ExternalFile(line)`**: flags wording whose check needs another document, such as "as described in", "every kept file", "the rows in", "where they" or "is listed" with no named artifact.
- **Walker**: walks `specs/`, skips `z_archive` and any `scratch` segment, and counts the scratch files it skipped.
- **Line classes**: each criterion line is `scored`, `placeholder`, `lexical_unscored` (no English function word) or part of a `no_input` file. Only `scored` lines enter a rate.
- **Report**: per-rule counts, `scratch_excluded=<n>`, `no_input`, `placeholder` and `lexical_unscored` counts. With `--json`, one record per line: `id` as `path:line`, `text_sha12`, class and the flagged spans for each rule. Exit 0 always.
- **Scorer**: reads `--labels`, and reads `--lint <file>` when given or otherwise runs the lint in process over the active tree. It refuses mixed `rubric` values, joins on `text_sha12`, counts stale labels apart and prints per-rule TP, FP, FN, TN, precision, recall and F1, the labeled violation rate with a Wilson 95% interval and the stop line when that rate is under 0.05.
- **Model arm, conditional**: added to the lint only past the stop rule in `spec.md`, with one switch per backend and no global switch. Deem is preferred (007's research section 12, R20 and condition C12). The Jev half runs behind `--jev`. It prints the identity line with the `jev` path and the provider, `JEV_PROVIDER` or `official`. Then it runs parent D1's three Jev checks once, in order: `command -v jev`, `jev --version` printing `jev 0.6.2`, then `jev auth status --provider <provider>` exiting 0. Every later call carries the same `--provider`. Each failure prints its skip line and leaves the lexical output byte-identical with exit 0. The script reads no key, and `jev` resolves its own. The Deem half runs behind `--deem` (proposed). Once per run, `cli-deem health` (proposed, phase 008) applies the pinned check within 2,000 ms and prints the backend, the model id and the commit pair. Each failure prints its `deem arm skipped:` line (`not reachable`, `stub backend`, `bad health response` or `model` with a details line) and leaves the lexical output byte-identical with exit 0. The script never starts the Deem server and sends no bearer. With neither switch set, or with every gate failing, the output is byte-identical to the default run and no binary is spawned.

### Data Flow

`goal.md` files go through the walker and the parser to criterion lines. The rules flag spans on each line, and the report prints totals, or the JSON carries one record per line. The operator's labels join that JSON by `text_sha12` in the scorer, which prints the per-rule numbers and the stop decision. Nothing is written into `specs/`, and nothing leaves the machine unless a later Jev arm passes its gate. A later Deem arm sends its calls to the local server only.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### First Slice, in Order

1. The operator adopts a rubric and it is recorded in `spec.md`. Nothing is labeled before this.
2. Capture the checker baseline: the `RESULT` line and exit code of `check-goal.cjs --all`.
3. Write the parser copy, the two rule functions, the walker and the report, then the seven test cases.
4. Run the lint over the tree and read the counts, the scratch count and the `lexical_unscored` count.
5. Draw about 100 stratified lines with a recorded seed, and write their ids and hashes to the labels file. The operator labels each one under the adopted rubric.
6. Write the scorer and run it. Stop and record the reason in `implementation-summary.md` if it prints `r20 model arm not built: labeled_violation_rate<0.05` (proposed).
7. Only past the stop rule and its promotion conditions: add the model arm with `--deem` and `--jev`, prove every gate branch against stub `cli-deem` and `jev` binaries, then run it once on each backend whose check passes.
8. Only with per-rule precision of at least 0.8 and sk-doc's approval: add the advisory line to `create-goal-auto.yaml`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root, with `G=.skilled/skills/sk-doc/sk-create-goal/scripts`. The stub is a temporary directory outside the repository holding executable `jev` and `cli-deem` files that append their arguments to a log and answer as each case needs.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Checker baseline, before the build | `node $G/check-goal.cjs --all; echo "exit=$?"` | A `RESULT` line and an exit code, recorded in `implementation-summary.md` |
| Checker unchanged, after the build | `git diff --quiet -- $G/check-goal.cjs; echo "exit=$?"`, then the baseline command again | `exit=0`, then the same `RESULT` line and exit code as the baseline |
| Tests | `node --test $G/tests/` | Every test passes, including the seven `lint-goal-criteria.test.cjs` cases and the parser-parity assertion |
| Lint over the tree | `node $G/lint-goal-criteria.cjs --all; echo "exit=$?"` | Per-rule counts, `scratch_excluded=` with a count (14 files on today's tree), the `no_input`, `placeholder` and `lexical_unscored` counts and `exit=0` |
| Lint on a missing packet | `node $G/lint-goal-criteria.cjs specs/no-such-packet; echo "exit=$?"` | One named error line and `exit=0` |
| Zero calls | `PATH="$STUB:$PATH" node $G/lint-goal-criteria.cjs --all`, then the scorer the same way | The `jev` and `cli-deem` stub logs are empty after both |
| No key in code | `grep -n API_KEY $G/lint-goal-criteria.cjs $G/score-goal-lint.cjs; echo "exit=$?"` | No match and `exit=1` |
| Scorer | `node $G/score-goal-lint.cjs --labels $G/goal-criteria-labels.jsonl`, and the same with `--lint` on a saved `--all --json` run | The same numbers from both forms: TP, FP, FN, TN, precision, recall and F1 for each rule, the labeled violation rate with a Wilson 95% interval, `stale=` with a count and, under 0.05, `r20 model arm not built: labeled_violation_rate<0.05` |
| Mixed rubrics | The scorer on a temporary labels copy with two `rubric` values | `rubric mismatch:` with both ids and no rate |
| Jev arm gate, conditional | `--jev` against the stub: `auth status` exits 3, `--version` prints `0.2.3`, and `PATH=/usr/bin:/bin` | `jev arm skipped: no credential`, `jev arm skipped: version` plus a details line, `jev arm skipped: jev not on PATH`. Each time the lexical output matches the run without `--jev` and the exit is 0 |
| Jev arm provider, conditional | `JEV_PROVIDER=<name>` with the stub | The identity line names that provider, and every logged `auth status` and judgment call carries `--provider <name>` |
| Deem arm gate, conditional | `--deem` against the stub `cli-deem`, whose `health` answers as not reachable, as a stub backend, with a wrong model id and with a bad response | The four `deem arm skipped:` lines, the `model` case with a details line naming the id found. Each time the lexical output matches the run without `--deem`, the exit is 0 and no server start is attempted |
| Scope | `git status --porcelain` | Only the four new files, plus `create-goal-auto.yaml` if sk-doc approved the line |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint --strict` and `node $G/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint` | `RESULT: PASSED` from both |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator's rubric and labels come first. The lint and the scorer need only Node and `goal-slice.cjs`. A later Jev arm needs the Python `jev-cli` 0.6.2 on PATH, a key that `jev auth status --provider <provider>` resolves, 002's latency record and the redaction unit cases passing. A later Deem arm needs `cli-deem` from phase 008 and a running local server that passes the Deem check. It never starts the server. No package is installed by this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `lint-goal-criteria.cjs`, `score-goal-lint.cjs`, `tests/lint-goal-criteria.test.cjs` and `goal-criteria-labels.jsonl`, and revert the one `create-goal-auto.yaml` line if it landed. `check-goal.cjs` is never edited and `CHECKS` never grows, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---
