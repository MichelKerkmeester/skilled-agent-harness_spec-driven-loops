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
| **Code standard** | sk-code's OpenCode route (`sk-code/sk-code-opencode`) for the scripts and tests. sk-doc for every skill doc the phase changes (parent D6) |
| **Build route** | A fresh Opus 5.5 xhigh build orchestrator writes single-change briefs and runs CLI executors by Bash only: Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` and Cursor `grok-4.7-xhigh-fast`. The orchestrator session verifies, gets a cross-family review of the code and commits (parent D5) |

### Overview

The lint walks active `goal.md` files, cuts each durable slice with `goal-slice.cjs`, extracts criterion bullets with a copy of `check-goal.cjs`'s parser and runs two lexical rule functions on each line. It prints a report, or JSON with `--json`, and always exits 0. The build then draws about 100 stratified lines with their label fields empty and stops at the label gate (parent D4). After the gate the operator adopts a rubric and labels those lines. The scorer joins the labels to the lint's JSON and prints per-rule precision, recall and F1, the labeled violation rate and, when that rate is under 0.05, the stop line that closes the model arm on both backends. Inside this phase the scorer is proven on synthetic fixture labels only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The rubric is not a build prerequisite: the build runs under working default A, and the operator adopts one at the label gate (parent D4)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks), and sk-create-goal's `SKILL.md`, `README.md`, `scripts/README.md`, changelog and playbook plus the hub catalog entry through sk-doc (parent D6)
- [ ] The phase stops at its label gate: the rubric, the labels, the scored numbers, the stop decision, the arm and the workflow line stay with the operator (parent D4)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two standalone advisory scripts beside the checker, with no shared helper. The lint copies about 60 lines of `check-goal.cjs`'s parser, because that file exports only packet-level runners (`check-goal.cjs:722-731`) and adding exports would widen a frozen completion gate for one caller. The copy keeps `check-goal.cjs` byte-identical and deletes cleanly.

### Key Components

- **Parser copy**: imports `extractDurableSlice`, `splitFrontmatter` and `LOG_ANCHOR` from `.skilled/hooks/goal/lib/goal-slice.cjs`, as `check-goal.cjs:13-19` does, and copies `getAnchorBody` (`:140-149`), `getGoalSections` (`:167-206`) and `getCriterionItems` (`:212-217`) under a "ported from check-goal.cjs" comment.
- **`rule4DanglingRefs(line)`**: finds referring expressions such as "the", "this", "every" or "its" followed by a head noun, and flags each one whose head noun is not self-naming in the line. A head noun is self-naming when it sits in backticks or quotes, is a path, is on a locality list (`repo`, `packet`, `child`, `line`, `command`, `operator`, `test`) or is followed by `:`, `=` or `of` plus a named thing. The pattern set follows swe-04's design and is tuned to working default A until the operator adopts a rubric at the gate.
- **`rule5ExternalFile(line)`**: flags wording whose check needs another document, such as "as described in", "every kept file", "the rows in", "where they" or "is listed" with no named artifact.
- **Walker**: walks `specs/`, skips `z_archive` and any `scratch` segment, and counts the scratch files it skipped.
- **Line classes**: each criterion line is `scored`, `placeholder`, `lexical_unscored` (no English function word) or part of a `no_input` file. Only `scored` lines enter a rate.
- **Report**: per-rule counts, `scratch_excluded=<n>`, `no_input`, `placeholder` and `lexical_unscored` counts. With `--json`, one record per line: `id` as `path:line`, `text_sha12`, class and the flagged spans for each rule. Exit 0 always.
- **Scorer**: reads `--labels`, and reads `--lint <file>` when given or otherwise runs the lint in process over the active tree. It refuses mixed `rubric` values, joins on `text_sha12`, counts stale labels apart and prints per-rule TP, FP, FN, TN, precision, recall and F1, the labeled violation rate with a Wilson 95% interval and the stop line when that rate is under 0.05. Rows with null label fields count under `unlabeled=` and enter no rate. `score-goal-lint.test.cjs` (proposed) proves every output on synthetic fixture labels in a temporary directory.
- **Model arm, conditional**: after the label gate only, added to the lint only past the stop rule in `spec.md`, with one switch per backend and no global switch. Deem is preferred (007's research section 12, R20 and condition C12). The Jev half runs behind `--jev`. It prints the identity line with the `jev` path and the provider, `JEV_PROVIDER` or `official`. Then it runs parent D1's three Jev checks once, in order: `command -v jev`, `jev --version` printing `jev 0.6.2`, then `jev auth status --provider <provider>` exiting 0. Every later call carries the same `--provider`. Each failure prints its skip line and leaves the lexical output byte-identical with exit 0. The script reads no key, and `jev` resolves its own. The Deem half runs behind `--deem` (proposed). Once per run, `cli-deem health` (proposed, phase 008) applies the pinned check within 2,000 ms and prints the backend, the model id and the commit pair. Each failure prints its `deem arm skipped:` line (`not reachable`, `stub backend`, `bad health response` or `model` with a details line) and leaves the lexical output byte-identical with exit 0. The script never starts the Deem server and sends no bearer. With neither switch set, or with every gate failing, the output is byte-identical to the default run and no binary is spawned.

### Data Flow

`goal.md` files go through the walker and the parser to criterion lines. The rules flag spans on each line, and the report prints totals, or the JSON carries one record per line. After the label gate, the operator's labels join that JSON by `text_sha12` in the scorer, which prints the per-rule numbers and the stop decision. Nothing is written into `specs/`, and nothing leaves the machine unless a later Jev arm passes its gate. A later Deem arm sends its calls to the local server only.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### First Slice, in Order

1. Capture the checker baseline with `SKDOC_SKIP_VALIDATION` unset: the `RESULT` line and exit code of `check-goal.cjs --all`.
2. Write the parser copy, the two rule functions, the walker and the report, then the seven test cases. The rules follow working default A.
3. Run the lint over the tree and read the counts, the scratch count and the `lexical_unscored` count.
4. Draw about 100 stratified lines with a recorded seed, and write their ids and hashes to the labels file with every label field null.
5. Write the scorer and its synthetic-fixture tests, then run the scorer on the drawn file and read `unlabeled=` with no rate.
6. Update sk-create-goal's `SKILL.md`, `README.md`, `scripts/README.md`, changelog and playbook and the hub catalog entry through sk-doc (parent D6).
7. Stop at the label gate (parent D4) and record the gate state in `implementation-summary.md`.

### After the Label Gate (not part of this phase's completion)

1. The operator adopts a rubric, records it in `spec.md` and labels each drawn line under it.
2. Run the scorer on the labels. Stop and record the reason in `implementation-summary.md` if it prints `r20 model arm not built: labeled_violation_rate<0.05` (proposed).
3. Only past the stop rule and its promotion conditions: add the model arm with `--deem` and `--jev`, prove every gate branch against stub `cli-deem` and `jev` binaries, then run it once on each backend whose check passes.
4. Only with per-rule precision of at least 0.8 and sk-doc's approval: add the advisory line to `create-goal-auto.yaml`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root, with `G=.skilled/skills/sk-doc/sk-create-goal/scripts`. The stub is a temporary directory outside the repository holding executable `jev` and `cli-deem` files that append their arguments to a log and answer as each case needs.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Checker baseline, before the build | `env -u SKDOC_SKIP_VALIDATION node $G/check-goal.cjs --all; echo "exit=$?"` | A `RESULT` line and an exit code, recorded in `implementation-summary.md`. A skip notice instead means the switch is on in `.skilled/hooks/hook-flags.env` and the baseline is void |
| Checker unchanged, after the build | `git diff --quiet -- $G/check-goal.cjs; echo "exit=$?"`, then the baseline command again | `exit=0`, then the same `RESULT` line and exit code as the baseline |
| Tests | `node --test $G/tests/` | Every test passes, including the seven `lint-goal-criteria.test.cjs` cases, the parser-parity assertion and the `score-goal-lint.test.cjs` cases on synthetic fixture labels |
| Lint over the tree | `node $G/lint-goal-criteria.cjs --all; echo "exit=$?"` | Per-rule counts, `scratch_excluded=` with a count (30 files on 2026-09-28), the `no_input`, `placeholder` and `lexical_unscored` counts and `exit=0` |
| Lint on a missing packet | `node $G/lint-goal-criteria.cjs specs/no-such-packet; echo "exit=$?"` | One named error line and `exit=0` |
| Zero calls | `PATH="$STUB:$PATH" node $G/lint-goal-criteria.cjs --all`, then the scorer the same way | The `jev` and `cli-deem` stub logs are empty after both |
| No key in code | `grep -n API_KEY $G/lint-goal-criteria.cjs $G/score-goal-lint.cjs; echo "exit=$?"` | No match and `exit=1` |
| Scorer at the gate | `node $G/score-goal-lint.cjs --labels $G/goal-criteria-labels.jsonl; echo "exit=$?"`, and the same with `--lint` on a saved `--all --json` run | From both forms: `unlabeled=` equal to the file's row count, no rate and `exit=0`. The per-rule numbers come from the fixture tests until the operator labels |
| Scorer after the gate, not part of completion | The same two commands on the operator's labels | The same numbers from both forms: TP, FP, FN, TN, precision, recall and F1 for each rule, the labeled violation rate with a Wilson 95% interval, `stale=` with a count and, under 0.05, `r20 model arm not built: labeled_violation_rate<0.05` |
| Mixed rubrics | The scorer on a temporary labels copy with two `rubric` values | `rubric mismatch:` with both ids and no rate |
| Jev arm gate, after the gate and conditional | `--jev` against the stub: `auth status` exits 3, `--version` prints `0.2.3`, and `PATH=/usr/bin:/bin` | `jev arm skipped: no credential`, `jev arm skipped: version` plus a details line, `jev arm skipped: jev not on PATH`. Each time the lexical output matches the run without `--jev` and the exit is 0 |
| Jev arm provider, after the gate and conditional | `JEV_PROVIDER=<name>` with the stub | The identity line names that provider, and every logged `auth status` and judgment call carries `--provider <name>` |
| Deem arm gate, after the gate and conditional | `--deem` against the stub `cli-deem`, whose `health` answers as not reachable, as a stub backend, with a wrong model id and with a bad response | The four `deem arm skipped:` lines, the `model` case with a details line naming the id found. Each time the lexical output matches the run without `--deem`, the exit is 0 and no server start is attempted |
| Scope | `git status --porcelain` | The five new files and the sk-create-goal and hub catalog docs parent D6 names. `create-goal-auto.yaml` stays untouched inside this phase |
| Skill docs | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <doc>` on each changed doc, and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook` | Exit 0 on every doc, and the playbook package passes with one more scenario than before |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint --strict` and `node $G/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint` | `RESULT: PASSED` from both |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator's rubric and labels come after this phase's label gate (parent D4), and the build does not wait for them. The lint and the scorer need only Node and `goal-slice.cjs`. A later Jev arm needs the Python `jev-cli` 0.6.2 on PATH, a key that `jev auth status --provider <provider>` resolves, 002's latency record and the redaction unit cases passing. A later Deem arm needs `cli-deem` from phase 008 and a running local server that passes the Deem check. It never starts the server. No package is installed by this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `lint-goal-criteria.cjs`, `score-goal-lint.cjs`, `tests/lint-goal-criteria.test.cjs`, `tests/score-goal-lint.test.cjs` and `goal-criteria-labels.jsonl`. Revert the sk-create-goal and hub catalog doc edits, which removes the new changelog entry, playbook scenario and catalog entry. Revert the one `create-goal-auto.yaml` line if it landed after the gate. `check-goal.cjs` is never edited and `CHECKS` never grows, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---
