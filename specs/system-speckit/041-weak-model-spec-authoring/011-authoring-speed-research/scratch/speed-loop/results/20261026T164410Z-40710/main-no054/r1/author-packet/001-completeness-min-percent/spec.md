---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage and then always exits 0, so a caller that wants to gate on the number has to parse stdout. A --min-percent option turns that check into an exit status without changing the report."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
  - "min-percent exit code gate"
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

`calculate-completeness.sh` prints an `Overall Completion` percentage and then exits 0 unconditionally, whatever the number says. A caller that wants to stop on a packet below N% has to capture stdout, pull the percentage out of a decorated text block (or read `overall_completion` from `--json`), and repeat the comparison itself. That parsing is brittle: the report is wrapped in box-drawing rules and a status line, so a formatting change breaks every caller silently. The script already computes the number; only the verdict is missing.

### Purpose

Let a caller gate on completion with one flag and one exit status, while every figure the script reports stays exactly as it is.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--min-percent <N>` option on `calculate-completeness.sh`, with N an integer from 0 to 100.
- Exit status 3 when the reported completion is below N, and 0 when it is at or above N.
- Argument validation for the option: a missing value, a non-integer and a value outside 0-100 are user errors.
- Help text and tests for the new option.

### Out of Scope
- The percentage math, the placeholder patterns, the text layout and the JSON schema - the feature adds a verdict, not a new report.
- A short alias (`-m`) or an `--min-percent=N` spelling - the request names one form, and more spellings are a separate decision.
- Wiring the flag into hooks, CI or `check-completion.sh` - callers adopt it after this lands.
- The unguarded `$2` read on `--file` - it has the same latent fault today, and repairing it would change behavior outside this request.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Parse the option, validate N, document it in help, derive the exit status from the reported percentage |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` | Modify | Cover the threshold boundaries, invalid input, and unchanged output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Accept `--min-percent <N>` anywhere in the argument list, with N an integer from 0 to 100 | `--min-percent 80 <packet>` runs the report; `--min-percent` with no value and `--min-percent abc` each exit 1 with an `ERROR:` line on stderr |
| REQ-002 | Exit 3 when the reported completion is below N, and 0 when it is at or above N | A packet reporting 40% exits 3 with `--min-percent 41` and 0 with `--min-percent 40` |
| REQ-003 | The report itself is unchanged | `diff` of stdout with and without the flag is empty, in text and `--json` modes, for both a folder and a `--file` target |
| REQ-004 | Compare the same figure the report prints | Folder mode compares `Overall Completion`; `--file` mode compares that file's `Completion`, the only figure that mode reports |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `--help` documents the option and both exit statuses | Help output contains `--min-percent <N>` and names exit 3 as "below threshold" |
| REQ-006 | Tests cover the boundary and the invalid inputs | The vitest file passes with cases for below, equal, above, invalid and missing value |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller gates on completion with one flag and no stdout parsing - `calculate-completeness.sh --min-percent 90 <packet>` returns 0 or 3, and nothing else about the run changes.
- **SC-002**: The text and JSON reports for a given packet are byte-identical with and without the option.
- **SC-003**: The two tests already in `calculate-completeness-script.vitest.ts` still pass unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required for the percentage math | The script exits 1 today when `bc` is absent | The option adds no new dependency |
| Risk | Exit status 3 already means "system error" in the spec-script taxonomy | Medium - a caller that reads 3 as an I/O failure could misread a low score | State the meaning in `--help`, and treat 3 as "below threshold" only when the flag was passed |
| Risk | The reported percentage is rounded to a whole number before comparison | Low - 89.6% prints as 90 and passes `--min-percent 90` | Document that the gate compares the printed integer, not the raw fraction |
| Risk | `set -euo pipefail` turns a bare `(( percentage < N ))` into a silent abort | Medium - the script already carries a comment about this pattern at its clamp | Write the decision as an explicit `if`, matching the existing clamp style |
| Risk | The printed figure carries defaults: an empty packet reports 100%, a missing `--file` target reports 0% | Low - a gate on an empty folder passes | Document both defaults in the plan and cover the missing-file case in the tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Resolved while writing this spec:

- Does the option apply in `--file` mode? Yes, against that file's `Completion`, because `Overall Completion` does not exist in that mode (REQ-004).
- Does "output unchanged" cover `--help`? No. The calculation report is unchanged; help gains one option line, which REQ-005 requires.
- What status for a bad N? 1, the script's existing status for a bad argument.
<!-- /ANCHOR:questions -->

---
