---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one option to one Bash script: parse --min-percent <N>, keep the existing report untouched, and turn the reported percentage into exit 3 or 0 after the output is printed."
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
| **Language/Stack** | Bash 3.2-compatible shell |
| **Framework** | None - a single CLI script |
| **Storage** | None |
| **Testing** | Manual CLI invocations plus `bash -n`; the script has no test suite |

### Overview
One file changes: `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. The argument loop gains a `--min-percent <N>` branch that stores and validates an integer, the existing output functions stay untouched, and a comparison after the report turns the reported percentage into exit 3 or exit 0. Proof is a pair of runs on a fixture that reports 80%, one above the threshold and one below, plus a `diff` showing stdout is unchanged.
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
- [ ] `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` exits 0
- [ ] On an 80% fixture, `--min-percent 90` exits 3 and `--min-percent 70` exits 0
- [ ] `diff` of plain-run stdout against `--min-percent` stdout is empty, in text and `--json` modes
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script, argument switch.

### Key Components
- **Argument loop (section 8)**: the `while [[ $# -gt 0 ]]` / `case "$1"` block that already parses `--verbose`, `--json`, `--quality`, `--file` and `--help`; it gains the `--min-percent` branch and owns N's validation.
- **Percentage producers**: `calculate_spec_completeness` sets `OVERALL_PERCENTAGE` for a folder, and `calculate_file_completeness` writes `percentage` into the per-file stats file; both already finish before any output.
- **Output functions**: `output_text` and `output_json`; neither changes, which is what keeps stdout byte-identical.
- **Threshold check**: a new block after the output call and before the final `exit 0`, comparing the reported percentage against `MIN_PERCENT`.

### Data Flow
The argument loop stores `MIN_PERCENT` while the folder or file is calculated, the calculation writes `OVERALL_PERCENTAGE` (or the stats-file `percentage` for `--file`), the output function prints the report exactly as today, and only then does the threshold block compare the reported percentage with `MIN_PERCENT` and choose exit 3 or exit 0. Because the comparison runs last, a below-threshold run still prints its full report.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no test suite for this script, so verification is a fixture plus the invocations recorded in `tasks.md`. Build a fixture whose report reads `Overall Completion: 80%` (one placeholder line among five content lines) and assert: `--min-percent 90` exits 3, `--min-percent 70` exits 0, no option exits 0, and `diff` between the plain run and each option run is empty. Repeat the `diff` with `--json` to cover the second output path, and run `bash -n` for syntax.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` 3.2 or newer and `bc`, both already required by the script today; no new package. The `--help` text and the trailing exit-code comment live in the same file, so no documentation outside the script changes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: any caller reports that a plain run changed its output or that exit 3 fires on a complete packet. Roll back by reverting the single commit that touches `calculate-completeness.sh`; the option has no persisted state, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---
