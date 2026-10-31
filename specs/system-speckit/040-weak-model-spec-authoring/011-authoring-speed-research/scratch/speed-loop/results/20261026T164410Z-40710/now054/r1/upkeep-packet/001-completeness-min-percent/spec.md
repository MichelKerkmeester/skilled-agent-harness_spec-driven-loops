---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "Add a --min-percent <N> option so a caller can gate on the reported completion percentage through the exit status instead of parsing stdout."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` prints `Overall Completion: N%` and then always exits 0. A caller that wants to fail below a floor has to scrape stdout with `grep` and `awk`, so a change to the label or to the rule lines around it silently disables the gate.

### Purpose
Add `--min-percent <N>` so a caller states the floor once and reads the answer from the exit status.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` in the script's option loop and reject a missing or invalid value.
- Exit 3 after the results are printed when the reported completion is below N, and exit 0 otherwise.
- Name the option and its exit code in the `--help` block and in the script's trailing exit-code comment.
- Cover folder mode and `--file` mode in the verification tasks.

### Out of Scope
- Changing how completion is calculated, rounded or worded - the report stays exactly as it is.
- Adding the threshold to the JSON payload - callers read the exit status, not a new field.
- Changing any other option or the default exit status - a run without the flag behaves as it does today.
- Wiring the option into callers such as `validate.sh` - a separate change with its own spec.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option, its validation, the threshold exit, and the help and exit-code text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` sets an exit-status floor on the reported completion. | On a packet reporting P%, `--min-percent $((P+1))` exits 3 and `--min-percent $P` exits 0. |
| REQ-002 | The results output does not change when the option is present. | `diff` between the same run with and without `--min-percent 0` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The compared value is the same integer the script prints. | `--min-percent` equal to the printed percentage exits 0, and one above it exits 3. |
| REQ-004 | A missing, non-integer or out-of-range N is a usage error. | `--min-percent` with no value, then `abc`, `-1` and `101`, each exits 1 with an `ERROR:` line on stderr and no results output. |
| REQ-005 | `--file <path>` mode applies the floor to that file's reported completion. | A file reporting 100% with `--min-percent 100` exits 0; a file reporting P% with `--min-percent $((P+1))` exits 3. |
| REQ-006 | `--help` names the option. | `bash calculate-completeness.sh --help` prints a line containing `--min-percent <N>`. |
| REQ-007 | With `--json` and `--min-percent` both given, the JSON output carries a boolean `min_percent_met` field, true when Overall Completion is at or above N and false otherwise. | `--json --min-percent P` prints `"min_percent_met": true` for a packet reporting P%, and `--json --min-percent $((P+1))` prints `"min_percent_met": false`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `calculate-completeness.sh --min-percent 90 <packet>` exits 3 below 90% and exits 0 at or above it.
- **SC-002**: stdout and stderr for a run with `--min-percent` are byte-identical to the same run without it.
- **SC-003**: `--help` lists `--min-percent <N>` and the script's exit-code comment records 3.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, `find` and `grep`, already required by the script | None beyond today - the option adds no new tool | Keep the existing `bc` guard untouched; the check uses shell arithmetic only |
| Risk | Exit 3 already means "system error" in the spec-script taxonomy | A caller cannot tell a threshold miss from a broken run by status alone | Record 3 in the script's exit-code comment and keep stderr silent on a threshold miss, so an `ERROR:` line still marks a real fault |
| Risk | The percentage is rounded before it is printed | A true 89.6% prints 90 and would pass `--min-percent 90` | Compare the printed integer, as REQ-003 states, so the exit status agrees with the report |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Rounding, `--file` mode and input validation are decided in REQ-003, REQ-004 and REQ-005, and nothing blocks the plan.
<!-- /ANCHOR:questions -->

---
