---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Extend the existing argument parser with a --min-percent arm, keep the parsed value in a global, and apply the comparison after the report has been written so output stays byte-identical. The gate reads the completion figure the run already reports rather than recomputing it."
trigger_phrases:
  - "completeness min percent plan"
  - "calculate completeness threshold implementation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, written to run under Bash 3.2 (macOS default) as the script already does |
| **Framework** | None - a single self-contained CLI script under `runtime/cli/spec/` |
| **Storage** | None - the script reads spec markdown and writes only to stdout, stderr and a temp directory |
| **Testing** | Shell fixtures: a throwaway packet with a known placeholder ratio, driven through an invocation matrix and compared with `diff` |

### Overview

The change is confined to one script and follows the shape the script already uses: a new `case` arm in the argument parser, a new global holding the parsed threshold, and a comparison placed after the report is emitted. Ordering is the whole design. The report is written first and unchanged, and only then does the script choose between exit `0` and exit `3`, which is what makes the byte-identical requirement (REQ-003) structural rather than a matter of care.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file CLI extension - no new module, no new file, no new dependency.

### Key Components

- **Argument parser**: the existing `while [[ $# -gt 0 ]]` loop with its `case "$1"` dispatch gains a `--min-percent` arm. The arm must come before the `*` fallback, because that fallback treats an unrecognised token as the positional spec folder and would otherwise swallow the flag as a path.
- **Threshold global**: one new variable, empty by default. Empty means "no gate", so a flagless run keeps today's behaviour with no separate branch to maintain.
- **Argument validation**: a guard that the value is present and is an integer from 0 to 100 inclusive, exiting `1` with a stderr message otherwise. It runs at parse time, before any measurement or report, so a bad invocation produces no partial report.
- **Post-output gate**: the final status decision. It compares the reported figure with the threshold and exits `3` or `0`. It sits after the `output_text`/`output_json` call so every byte of the report is already on stdout.
- **Reported figure selection**: folder mode reports `OVERALL_PERCENTAGE`; `--file` mode reports the per-file percentage from its stats file. The gate reads whichever figure the active mode reports, so the exit status always agrees with the line the caller just read.

### Data Flow

`--min-percent N` is parsed into the threshold global → the script measures the packet exactly as it does today and emits the unchanged report → the gate reads the figure that report presented → exit `3` when that figure is below `N`, exit `0` otherwise. Error paths (missing folder, missing `bc`, bad flag value) still exit `1` before or independently of the gate.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A fixture packet under the packet's own `scratch/` carries a known placeholder count, so its completion percentage is predictable and the threshold boundaries can be asserted exactly. One fixture at 75% covers the interesting cases: below (`--min-percent 80` → `3`), exactly at (`--min-percent 75` → `0`) and above (`--min-percent 70` → `0`). A second fixture at a deliberately low percentage covers `--file` mode.

Output invariance is tested by diffing, not by inspection: each invocation in the matrix is run twice, once with the flag and once without, with stdout and stderr captured separately, and the diff must be empty. The matrix covers plain text, `--json`, `--verbose`, `--quality` and `--file`, because each one reaches a different output function and a stray gate line in any of them would show up only in that mode.

Malformed values are tested for the exit status specifically, not just for an error message: a missing value, a non-integer, a negative number and a value above 100 must each exit `1`, never `3`.

The script is also run under `bash -n` and against the existing spec-script test suite to confirm the edit introduces no syntax error and no regression in the current behaviour.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bc`, which the script already requires for its percentage arithmetic. The flag adds no dependency of its own; the comparison is integer arithmetic the shell performs natively.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single modified file. Nothing else in the repository reads the new flag, so no caller needs a coordinated revert, and no data or state is written by the change.
<!-- /ANCHOR:rollback -->

---
