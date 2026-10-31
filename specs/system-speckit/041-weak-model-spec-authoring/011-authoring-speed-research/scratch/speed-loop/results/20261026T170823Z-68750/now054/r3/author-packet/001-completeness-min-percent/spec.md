---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so a caller cannot gate on a threshold without parsing stdout. This spec adds a --min-percent <N> flag that turns the reported percentage into an exit status while leaving the report untouched."
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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `detached HEAD` (packet created with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` prints `Overall Completion: <N>%` and then exits 0 on every successful run, whatever the percentage. A caller that wants to fail a build or a gate below a completeness floor has to parse stdout, which breaks when the label, spacing or status line changes, and which reads a different key in `--json` mode.

### Purpose
Let a caller enforce a completeness floor with one flag and one exit status, so the report stays a report and the pass/fail decision moves into the shell.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--min-percent <N>` to the argument loop in section 8 of the script.
- Validate `N` as an integer from 0 to 100, and exit 1 with a stderr message for a missing or invalid value.
- Compare the completion figure the report already prints against `N` after the report is emitted, exiting 3 when it is below `N` and 0 otherwise.
- Document the option in the `--help` text.

### Out of Scope
- Changing the completion math, the quality thresholds or the report text - the report must stay byte-identical, so the flag may only affect the exit status.
- Adding a short alias such as `-m` - the request names the long form only, and an alias can follow when a caller asks for one.
- Folding `--quality` warnings into the threshold - those warnings stay advisory and do not change the exit status.
- Touching `validate.sh` or any other script in the directory - the change is confined to this one file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Parse `--min-percent <N>`, document it in `--help`, and gate the trailing exit status on the reported completion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted as a long option that takes one integer argument in the range 0 to 100. | `bash calculate-completeness.sh --min-percent 80 <folder>` runs to completion and exits with a status derived from the report. |
| REQ-002 | The script exits 3 when the reported completion is below `N`, and exits 0 when it is equal to or above `N`. | On a folder whose report reads `Overall Completion: 40%`, `--min-percent 80` exits 3, while `--min-percent 40` and `--min-percent 10` exit 0. |
| REQ-003 | A missing or invalid `N` exits 1 with an `ERROR:` line on stderr, matching the script's existing usage-error path. | `--min-percent abc`, `--min-percent 101`, `--min-percent -1` and a bare `--min-percent` each exit 1 and print one `ERROR:` line to stderr. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The completeness report on stdout is byte-identical with and without the flag, in text and JSON mode, for both folder and `--file` invocations. | `diff` between the two runs is empty and both files end at the same line count. |
| REQ-005 | `--help` lists the new option next to the existing ones. | `bash calculate-completeness.sh --help` prints one line containing `--min-percent`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller can gate on a completeness floor with `--min-percent <N>` and read the answer from `$?` alone, with no stdout parsing.
- **SC-002**: **Given** a folder whose report reads `Overall Completion: 40%`, **When** the script runs with `--min-percent 80`, **Then** it exits 3 and prints exactly the same report as a run without the flag.
- **SC-003**: **Given** the same folder, **When** the script runs with `--min-percent 40`, **Then** it exits 0 because 40 is not below 40.
- **SC-004**: Exit codes 0 and 1 keep the meanings they have today, and a run without the flag exits 0 as it does now.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2 or newer and `bc`, both already required by the script | The flag cannot run where the script cannot run today | No new dependency; the comparison is builtin integer arithmetic |
| Risk | A bare `[[ ... ]] && exit 3` under `set -e` leaves a non-zero status on the false branch and changes a passing run's exit code | High | Write the gate as an explicit `if` block, the same shape the percentage clamp already uses |
| Risk | An existing caller treats exit 0 as "the script ran" and now sees 3 | Medium | Exit 3 only when the flag is present; a run without it keeps exit 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the threshold apply in `--file` mode, where the report prints `Completion:` rather than `Overall Completion:`? Decision: yes, compare the per-file `Completion` figure, the only completion number that mode reports.
- Does a missing target count as 0%? Decision: yes, a `Status: NOT FOUND` file reports a completion of 0, so the flag exits 3 for any `N` above 0.
- Should `N` accept a decimal such as `85.5`? Decision: no, the report rounds to whole percent, so integer comparison matches the number the caller sees.
<!-- /ANCHOR:questions -->

---
