---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports an Overall Completion percentage but ends with an unconditional exit 0, so a CI step that wants to fail a thin packet has to parse the report text. A --min-percent option moves that decision into the exit status."
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
| **Branch** | `HEAD (detached; no branch created)` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` prints `Overall Completion: N%` in text mode and `"overall_completion": N` in JSON mode, then ends with an unconditional `exit 0`. A CI step or wrapper that wants to fail a packet below a threshold has to capture the report, find the percentage line and parse the number out of it, and every caller writes that parsing again.

### Purpose
A caller passes `--min-percent <N>` and reads the answer from the exit status, while the report text stays byte-for-byte identical to what it prints today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` in the section 8 option loop, next to the existing `--file` arm.
- Reject a value that is not an integer from 0 to 100 with the script's existing `ERROR:`-on-stderr and exit 1 form.
- Exit 3 after the report when the reported completion is below N, and exit 0 otherwise.
- List the option in `show_help`, in the file's usage header and in the exit-code footer.

### Out of Scope
- The percentage arithmetic and the report layout - the flag reads the value the report already prints, so neither changes.
- A short alias or an environment variable - the request names one long option, and callers already pass flags.
- The other scripts in `runtime/cli/spec/` - `validate.sh` and its siblings are untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option, its validation, the help text and the threshold exit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted and the report is unchanged | `calculate-completeness.sh --min-percent 50 <folder>` and `calculate-completeness.sh <folder>` print identical stdout and stderr; only the exit status may differ |
| REQ-002 | Exit 3 when the reported completion is below N | A folder whose report prints `Overall Completion: 20%` run with `--min-percent 50` exits 3 |
| REQ-003 | Exit 0 when the reported completion is at or above N, including exactly N | The same folder with `--min-percent 20` exits 0, and a run without the flag exits 0 as it does today |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A value that is not an integer from 0 to 100 exits 1 with an `ERROR:` line on stderr and no report | `--min-percent abc`, `--min-percent -1`, `--min-percent 101` and a bare `--min-percent` each exit 1 and print no results block |
| REQ-005 | The help text and the exit-code footer document the option and code 3 | `--help` output contains the `--min-percent <N>` line, and the footer lists `3` with its meaning |
| REQ-006 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean `min_percent_met` field, `true` when `Overall Completion` is at or above N and `false` otherwise | A folder whose JSON prints `"overall_completion": 20` run with `--json --min-percent 50` prints `"min_percent_met": false`, and the same folder with `--json --min-percent 20` prints `"min_percent_met": true` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a fixture folder that prints below the threshold, `--min-percent 50` exits 3 while the plain run exits 0, and both write the same bytes to stdout.
- **SC-002**: On the same folder, `--min-percent` set to the printed percentage exits 0 and one point above it exits 3.
- **SC-003**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, which the script already requires | Low - the flag adds no new dependency and the existing check exits 1 without it | Leave the `command -v bc` guard where it is, ahead of the calculation |
| Risk | A caller reads exit 3 as a crash and aborts its run | Medium | Document 3 in `--help` and the footer, and keep 1 for real errors so the two stay distinguishable |
| Risk | `set -euo pipefail` turns an unvalidated comparison into a silent exit before the report | Medium | Validate N before the calculation, and write the final branch as an `if` that always ends in an explicit `exit 0` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the flag gate `--file` mode, where the report prints `Completion:` instead of `Overall Completion:`? Decision: it compares the percentage the report presents for the requested scope - the single file's `Completion` in `--file` mode, `Overall Completion` otherwise - so the flag and the status line never disagree.
- Does `--json` change? Decision: no. The JSON body stays as it is and callers read the exit status.
- What does a non-integer N do? Decision: exit 1 with an `ERROR:` line, matching the script's other argument errors, so 3 means only "below the threshold".
<!-- /ANCHOR:questions -->

---
