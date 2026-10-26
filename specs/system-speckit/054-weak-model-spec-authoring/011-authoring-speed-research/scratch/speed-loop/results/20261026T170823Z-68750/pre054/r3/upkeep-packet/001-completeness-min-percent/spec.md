---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so callers must parse stdout to gate on it. This adds a --min-percent N flag that turns the reported percentage into an exit status."
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
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`calculate-completeness.sh` computes an `Overall Completion` percentage and prints it, then reaches a fixed `exit 0`. Any caller that wants to enforce a completeness floor - a CI job, a pre-merge check, an agent loop - has to capture stdout and parse the number back out of human-readable text, or re-implement the calculation against the JSON output. Both approaches duplicate the script's own knowledge of its result and break silently when the report layout changes.

### Purpose

Let a caller pass the floor it cares about once, on the command line, and read the answer from the exit status: `--min-percent 90` fails the run when the packet is below 90% complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `--min-percent <N>` option on `calculate-completeness.sh`, with `<N>` an integer from 0 to 100.
- A threshold comparison against the same percentage the script already reports, evaluated after the report is printed.
- Exit status `3` when the reported percentage is below `<N>`, exit status `0` when it is at or above `<N>`.
- Argument validation for the new option: missing value, non-integer value and out-of-range value each fail with the script's existing usage-error convention.
- A `--help` usage line documenting the option.
- Coverage of the option across the existing output modes: default text, `--verbose`, `--json`, and `--file`.

### Out of Scope

- Changing the completeness calculation itself - the placeholder patterns, the line counting and the percentage arithmetic stay exactly as they are.
- Changing the status bands (`Excellent`, `Good`, `Fair`, `Poor`, `Very Low`) or the wording of the report.
- Changing the JSON schema or the text layout of the report. Callers diffing this output must see no difference.
- Adding a short alias, a config file or an environment variable for the threshold. The long option is the whole surface.
- Modifying `validate.sh`, `check-completion.sh` or any other script in `runtime/cli/spec/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option, its validation, the help line and the post-report exit gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The script accepts `--min-percent <N>` and consumes the following argument as the threshold. | `calculate-completeness.sh --min-percent 90 <folder>` runs without an argument error and reports normally. |
| REQ-002 | With the option set, the script exits `3` when the reported completion percentage is below `<N>` and exits `0` when it is at or above `<N>`. | On a folder reporting 72%: `--min-percent 90` exits 3, `--min-percent 72` exits 0, `--min-percent 50` exits 0. |
| REQ-003 | Without the option, the script's exit status and behaviour are unchanged from today. | The script with no `--min-percent` exits 0 on every input that exits 0 today. |
| REQ-004 | The report output is byte-identical with and without the option, in every output mode. | `diff` of stdout from the same folder with and without `--min-percent 50` is empty, for default, `--verbose` and `--json` runs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `--min-percent` validates its value: a missing value, a non-integer value, a value below 0 or above 100 each print an error to stderr and exit `1`, matching the existing usage-error convention. | `--min-percent`, `--min-percent abc`, `--min-percent -1` and `--min-percent 101` each exit 1 with a one-line stderr message; no report is printed. |
| REQ-006 | The `--help` text lists the new option alongside the existing ones. | `calculate-completeness.sh --help` includes a `--min-percent` line that states the accepted range and the meaning of exit status 3. |
| REQ-007 | The option works in `--file` mode, gating on that file's reported `Completion` percentage, and combines correctly with `--json`, `--verbose` and `--quality`. | `--file <path> --min-percent 90` exits 3 for a file reporting below 90% and 0 otherwise; `--json --min-percent` returns the same status as the text run. |
| REQ-008 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean field `min_percent_met`, `true` when Overall Completion is at or above `<N>` and `false` otherwise. | `--json --min-percent 90` on a folder reporting 72% emits `"min_percent_met": false`; the same run at `--min-percent 72` emits `"min_percent_met": true`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller can gate on a completeness floor with one flag and no output parsing - exit status alone answers "did this packet clear the floor".
- **SC-002**: Every existing caller sees no change: same report bytes, same exit status, when the option is absent.
- **SC-003**: Every invalid form of the option fails fast with exit 1 and a stderr message that names the option, so a mistyped flag never reads as a completeness failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script for percentage arithmetic | No new dependency; the gate reuses the computed value | None needed - the option adds no external tool |
| Risk | Exit status 3 collides with the spec-script taxonomy, where 3 means "system error such as missing folders, missing manifests, or file I/O failures" | A caller that treats 3 as an infrastructure failure would misread a completeness shortfall | Recorded here as a known collision: the requirement fixes 3 as the shortfall signal, and the option's help text states it explicitly. Callers using the flag must distinguish by whether the flag was passed |
| Risk | `set -euo pipefail` turns a bare failing `[[ ... ]]` into a silent script exit before any output | The gate could terminate the run with no report and the wrong status | Evaluate the comparison inside an `if` block and set the exit status only after the output function returns; the script already carries a comment about this exact hazard in `calculate_spec_completeness` |
| Risk | A threshold of 0 or 100 is degenerate - 0 can never fail, 100 fails on any remaining placeholder | Callers may expect 100 to mean "clean" and get a failure for a single bracket | Both are accepted as literal comparisons; the help text states the range and that the comparison is exact |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The option name, its value range and its exit status are fixed by the request; the two judgement calls - gating `--file` mode on the single file's percentage, and accepting the exit-3 taxonomy collision - are recorded under Risks with their rationale.
<!-- /ANCHOR:questions -->

---
