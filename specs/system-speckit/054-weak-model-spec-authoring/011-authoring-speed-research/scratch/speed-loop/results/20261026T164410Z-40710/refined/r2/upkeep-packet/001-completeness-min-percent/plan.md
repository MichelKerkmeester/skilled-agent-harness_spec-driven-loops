---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add a --min-percent <N> case to the option loop of calculate-completeness.sh, keep the parsed value in a new global, and compare it against the percentage the run already computed after the report is written. The report path is untouched, so stdout stays byte-identical."
trigger_phrases:
  - "completeness min percent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, written to Bash 3.2 compatibility like the rest of `runtime/cli/spec/` |
| **Framework** | None - a single standalone script |
| **Storage** | None |
| **Testing** | Manual CLI invocations against a fixture spec folder, asserting the exit status and diffing stdout |

### Overview
Change one file, `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. Add a `--min-percent <N>` case to the existing `while`/`case` option loop, store the value in a new `MIN_PERCENT` global, and after `output_text` or `output_json` has run, compare the percentage the run computed against `MIN_PERCENT` and exit `3` when it is lower. Because the comparison sits after the output call and never touches the output functions, the report is byte-identical with and without the flag, and the check is proved by diffing two runs and reading their exit statuses.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 80 specs/zz-bench-authoring/001-completeness-min-percent/scratch/fixture-67` exits `3`, and the same command with `--min-percent 50` exits `0`
- [ ] `diff <(run <folder>) <(run --min-percent 50 <folder>)` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script, one added branch.

### Key Components
- **Option loop (`§8 MAIN SCRIPT`)**: the `while [[ $# -gt 0 ]]` / `case "$1"` block gains a `--min-percent)` arm that consumes two arguments and validates the second.
- **`MIN_PERCENT` global (`§3 GLOBALS`)**: holds the parsed threshold, defaulting to an empty string so "no flag" is distinguishable from `0`.
- **Post-output comparison (`§8 MAIN SCRIPT`)**: reads the same percentage the report used - `OVERALL_PERCENTAGE` in folder mode, the sourced `percentage` in `--file` mode - and maps it to an exit status.
- **`show_help` (`§4 HELPER FUNCTIONS`)**: gains one `OPTIONS:` line so the flag is discoverable.

### Data Flow
Arguments are parsed left to right. `--min-percent` takes the next token as its value, validates it as an integer in `0..100`, and stores it in `MIN_PERCENT`; an invalid value prints `ERROR:` on stderr and exits `1` before any report is produced. `calculate_spec_completeness` or `calculate_file_completeness` then computes the percentage as it does today. `output_json` or `output_text` writes the report exactly as it does today. Only after that does the main body compare the computed percentage with `MIN_PERCENT` and choose the exit status: `3` when below, `0` otherwise.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms the script rejects the flag today and builds a 67% fixture folder. Implementation adds the option arm, the `MIN_PERCENT` global and the post-output comparison, plus the help and footer lines. Verification runs the below-threshold, at-threshold, above-threshold, unchanged-output and invalid-value cases.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Testing is manual CLI work against one fixture, because the script has no test suite of its own and this packet does not add one.

Build the fixture under `scratch/fixture-67/`: a single `spec.md` holding 2 placeholder lines and 4 content lines, which the measured behavior block in `spec.md` records as `Overall Completion: 67%`.

| Case | Command | Expected |
|------|---------|----------|
| Below threshold | `calculate-completeness.sh --min-percent 80 <fixture>` | exit `3`, report still on stdout |
| At threshold | `calculate-completeness.sh --min-percent 67 <fixture>` | exit `0` |
| Above threshold | `calculate-completeness.sh --min-percent 50 <fixture>` | exit `0` |
| Unchanged output | `diff <(calculate-completeness.sh <fixture>) <(calculate-completeness.sh --min-percent 50 <fixture>)` | no output, both exit `0` |
| Unchanged JSON | `diff <(calculate-completeness.sh --json <fixture>) <(calculate-completeness.sh --json --min-percent 50 <fixture>)` | no output |
| No flag | `calculate-completeness.sh <fixture>` | exit `0` |
| Missing value | `calculate-completeness.sh --min-percent` | `ERROR:` on stderr, exit `1` |
| Non-integer | `calculate-completeness.sh --min-percent abc <fixture>` | `ERROR:` on stderr, exit `1` |
| Negative | `calculate-completeness.sh --min-percent -1 <fixture>` | `ERROR:` on stderr, exit `1` |
| Over 100 | `calculate-completeness.sh --min-percent 101 <fixture>` | `ERROR:` on stderr, exit `1` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` and `bc`. Both are already required: the script checks for `bc` at startup and exits `1` when it is missing. No new package, tool or runtime version is introduced.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: any run that printed the report but exited `1`, or any diff between a plain run and a `--min-percent` run that is not empty.

Revert the one commit that touches `calculate-completeness.sh`. The change is additive - a new `case` arm, one new global, one comparison block and two documentation lines - so `git checkout -- <script>` restores the prior behavior with no data migration and no follow-up step.
<!-- /ANCHOR:rollback -->

---
