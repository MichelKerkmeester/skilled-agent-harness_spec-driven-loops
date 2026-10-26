---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one option branch and one exit-status gate to a single bash script. The report stays byte-identical; only the trailing exit code learns a threshold."
trigger_phrases:
  - "completeness min percent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 or newer with `bc`, both already required by the script |
| **Framework** | None - a standalone CLI script under `runtime/cli/spec/` |
| **Storage** | None; per-file statistics live in a temporary directory removed by the existing `trap` |
| **Testing** | Manual invocation with `diff` between runs, plus the strict spec validator |

### Overview
The change adds one case to the argument loop in section 8 of `calculate-completeness.sh` and one comparison between the report emitters and the trailing `exit 0`. The comparison reuses the percentage the report already computed, so no counting, formatting or output code is touched. Proof is a `diff` of the report with and without the flag, plus a check of the exit status at the boundary and on both sides of it.
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
Single-script option branch

### Key Components
- **Argument loop (section 8)**: takes `--min-percent` with its value, validates it, and stores it in a new global alongside `VERBOSE`, `JSON_OUTPUT` and `QUALITY_CHECK`.
- **Report emitters (`output_text`, `output_json`)**: unchanged. They keep sole ownership of what the report says.
- **Exit-status gate (end of section 8)**: reads the completion figure the report just printed and turns it into the process status.

### Data Flow
1. The argument loop reads `--min-percent <N>` and rejects a missing or out-of-range value before any work starts.
2. The existing calculation runs untouched and sets `OVERALL_PERCENTAGE` in folder mode, or the per-file `percentage` in `--file` mode.
3. The existing emitter prints the report exactly as it does today.
4. The gate compares the same figure the emitter used against `N`, then exits 3 when it is below `N` and 0 otherwise.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the current report and exit path. Implementation adds the option branch and the exit gate. Verification diffs the report and exercises every exit code.

### Step 1: Parse and validate the flag

Acceptance: `--min-percent` with a valid value is accepted, and a missing or invalid value exits 1 before any calculation runs.

Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent abc specs/zz-bench-authoring/001-completeness-min-percent; echo $?` prints one `ERROR:` line and `1`.

### Step 2: Gate the exit status on the reported percentage

Acceptance: the script exits 3 when the reported completion is below `N` and 0 when it is at or above `N`, with the report printed in full before either status.

Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 101 specs/zz-bench-authoring/001-completeness-min-percent` is rejected as invalid, while `--min-percent 0` prints the full report and exits 0.

### Step 3: Document the flag and prove the report is unchanged

Acceptance: `--help` lists the option, and a `diff` of the report with and without the flag is empty in text and JSON mode.

Verify: `diff before.txt after.txt` prints nothing, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --help` prints a line containing `--min-percent`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Text and JSON reports, folder and `--file` mode, with and without the flag | `diff` between captured runs |
| Boundary | `N` equal to the reported percentage, one below and one above | `echo $?` after each invocation |
| Error path | Missing value, non-integer, negative and out-of-range `N` | `echo $?` plus the stderr line |
| Packet | The planning documents themselves | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or newer | Runtime | Green | The script does not run at all today; no change |
| `bc` | Runtime | Green | The existing percentage math already fails without it |
| `diff` | Verification only | Green | Compare the captured reports by eye instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The report differs between a run with and without the flag, or a run without the flag stops exiting 0.
- **Procedure**: Revert the single commit that touches `calculate-completeness.sh`. The change adds no files, no configuration and no state, so the revert restores the previous behavior completely.
<!-- /ANCHOR:rollback -->

---
