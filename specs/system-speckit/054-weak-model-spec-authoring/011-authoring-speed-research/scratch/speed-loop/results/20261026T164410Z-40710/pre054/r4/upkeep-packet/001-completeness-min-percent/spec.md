---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but cannot fail a caller that needs a floor, so every caller parses the report itself. A --min-percent option turns that report into an exit-code gate while leaving what it prints unchanged."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Branch** | `scaffold/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` prints `Overall Completion: N%` and exits 0 on every successful run, whatever the percentage. A caller that needs a floor, such as a hook, a CI step or a review gate, therefore has to parse the report and compare the number itself. The text layout is written for a human reader, and the JSON field carrying the figure is named differently in the two modes (`overall_completion` for a folder, `completion_percentage` for `--file`), so each caller grows its own fragile extraction.

### Purpose
A caller asks the script whether a spec folder clears a floor and reads only the exit status, while every existing caller that reads the printed report keeps working unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `--min-percent <N>` option: parsing, the stored value, and the comparison against the completion figure the run reports.
- Validation of `N` as an integer from 0 to 100, reported through the script's existing `ERROR:` and exit 1 convention.
- The help text, the header usage comment and the exit-code comment block, so the option and its exit code are discoverable.

### Out of Scope
- Changing the completion arithmetic or the set of files analyzed. The percentage must stay identical to today's for the same input.
- Any new output line, field or status word, including in `--json`. Callers that parse the report must not need a change.
- A default floor when the option is absent. Without the option the script keeps exiting 0 on success.
- Wiring the option into any hook, CI job or validator. Those callers adopt it in their own change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option, its validation, the exit gate, and the help and exit-code text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The script accepts `--min-percent <N>` as a two-token option, stores the value, and leaves the behavior of every existing option untouched | `calculate-completeness.sh --min-percent 50 specs/<folder>` produces the same report as the run without the option, and `--help` lists the option with its exit code |
| REQ-002 | With the option set, the script exits 3 when the reported completion is below `N` and exits 0 otherwise | A fixture folder whose percentage is known runs to exit 3 with a floor above it and exit 0 with a floor at or below it. The same folder without the option exits 0 in both cases |
| REQ-003 | The completeness report is unchanged, byte for byte, with and without the option | `diff` between the two runs is empty for plain text, `--json`, `--verbose` and `--quality`, and stderr is empty in both. `--help` is the only output that gains a line, because it documents the new option |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | An unusable `N` fails before any report is printed, with an `ERROR:` line on stderr and exit 1, matching the script's existing user-error convention | `--min-percent abc`, `--min-percent -1`, `--min-percent 101`, `--min-percent 50.5` and a trailing `--min-percent` with no value each exit 1 and print one `ERROR:` line |
| REQ-005 | When `--json` and `--min-percent` are passed together, the JSON report gains a boolean `min_percent_met` field, true when Overall Completion is at or above `N` and false otherwise | `--json --min-percent <N>` on a fixture folder at or above the floor prints `"min_percent_met": true`, and one below the floor prints `false`; `--json` without the option emits no `min_percent_met` field |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three exit paths are shown by running the script, not by reading it: 3 below the floor, 0 at or above it, and 0 when the option is absent.
- **SC-002**: Stdout from every output mode is byte-identical with and without the option, proven by `diff`, and no existing consumer of the report needs a change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script for its percentage arithmetic | None new | The option adds no dependency |
| Risk | The new two-token option interferes with the positional spec-folder argument | Med | Parse it in the existing `case` branch and consume its value with `shift 2`, then test the folder path in first and last position |
| Risk | A comparison added at top level under `set -euo pipefail` leaves a non-zero status that errexit turns into a silent early exit | Low | Use the explicit `if` form the file already uses for its percentage clamp, so the false branch ends on a true statement |
| Risk | A caller passes a floor that the report cannot satisfy because the folder has no analyzable file | Low | The script already reports 100 for a folder with no placeholders, so the gate passes; the behavior is documented rather than special-cased |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `--file` mode never computes an overall percentage, so `--file` combined with `--min-percent` would compare against an unset value and pass silently. Recommendation: reject the combination with exit 1 and an `ERROR:` line, which keeps the option's contract to the folder path that the `Overall Completion` label describes. `plan.md` section 3 adopts this recommendation, and implementation confirms it with a test.
<!-- /ANCHOR:questions -->

---
