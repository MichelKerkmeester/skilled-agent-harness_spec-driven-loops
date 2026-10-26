---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "The completeness calculator prints a percentage but always exits 0, so a caller that needs a pass/fail gate has to parse the report text. Add a --min-percent <N> option that turns the reported completion into an exit status without changing a byte of the output."
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
| **Branch** | `detached HEAD` (no feature branch; the packet was scaffolded with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` prints `Overall Completion: <N>%` and then always exits `0`, so a caller that wants to refuse a folder below a quality bar has to capture the report and parse the percentage out of it. A caller that skips that parsing treats a half-empty folder as a pass, and every caller that does it repeats the same brittle text match.

### Purpose
Add a `--min-percent <N>` option so one invocation both reports completion and returns a pass/fail exit status, leaving the report itself byte-identical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--min-percent <N>` option to the argument parser in `calculate-completeness.sh`.
- Exit `3` when the completion percentage the run reports is below `N`, and exit `0` when it is at or above `N`.
- Reject a value that is not a whole number with an `ERROR` line on stderr and exit `1`, before any analysis runs.
- Document the option in `show_help` and document exit `3` in the script's exit-code comment block.

### Out of Scope
- Changing the report body, the JSON schema or the status labels - the requirement is that output stays identical with and without the option.
- Changing the default exit status of a run that omits `--min-percent` - such a run keeps exiting `0`.
- Adding the same gate to `validate.sh` or any other spec script - that is a separate change with its own callers.
- Adding a short alias such as `-m` - no caller has asked for one, and the long form is the documented contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add option parsing, threshold validation and the exit-status gate, plus help and exit-code documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is parsed and consumes its value, leaving the folder argument intact | `calculate-completeness.sh --min-percent 80 <folder>` prints the normal folder report and never prints `Unexpected argument` |
| REQ-002 | A reported completion below `N` exits `3` | A folder whose `Overall Completion` line reads `42%` exits `3` under `--min-percent 80` |
| REQ-003 | A reported completion at or above `N` exits `0` | The same folder exits `0` under `--min-percent 42` and under `--min-percent 40` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Output is unchanged, with or without the option | `diff` between a run with `--min-percent` and a run without it is empty in both text and `--json` modes |
| REQ-005 | A value that is not a whole number is rejected before analysis | `--min-percent abc` prints an `ERROR` line on stderr and exits `1`, and no report body is printed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `calculate-completeness.sh --min-percent 80 <folder>` exits `3` when the folder reports `Overall Completion: 42%`, and exits `0` when it reports `80%` or higher.
- **SC-002**: Text output and `--json` output are byte-identical between a run with `--min-percent` and a run without it.
- **SC-003**: A run that omits `--min-percent` still exits `0` at any completion level.

### Acceptance Scenarios

- **Given** a spec folder whose `Overall Completion` is `42%`, **When** the script runs with `--min-percent 80`, **Then** it prints the unchanged report and exits `3`.
- **Given** the same folder, **When** the script runs with `--min-percent 40`, **Then** it prints the unchanged report and exits `0`.
- **Given** the same folder, **When** the script runs with no `--min-percent` option, **Then** it prints the unchanged report and exits `0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc` | The script already requires `bc` and exits `1` without it, so the gate cannot run where `bc` is missing | Keep the existing `bc` preflight ahead of the comparison and do not introduce a second calculator |
| Risk | Exit `3` already means "system error" in the spec-script taxonomy (`0` success, `1` user error, `2` validation error, `3` system error) | A caller that maps `3` to "system error" will misreport a below-threshold result | Document the meaning in `show_help` and in the exit-code comment block, and keep the report on stdout so a caller can still see the number |
| Risk | A caller compares a fractional percentage against a whole-number threshold | Off-by-one at the boundary, where `79.6%` prints as `80%` but a `--min-percent 80` gate passes | Compare the same rounded integer the report prints, so the gate and the visible number can never disagree |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the gate apply in `--file` mode, where the script reports a per-file `Completion:` line rather than `Overall Completion`? Decision: yes, it gates whatever completion value the run reports, so `--file` mode gates that file's percentage.
- Should `N` be bounded to `0`-`100`? Decision: no upper bound is enforced beyond a non-negative whole number, so `N` above `100` is a valid threshold that always exits `3`.
- Should `--min-percent` imply `--quality`? Decision: no, the two options stay independent.
<!-- /ANCHOR:questions -->

---
