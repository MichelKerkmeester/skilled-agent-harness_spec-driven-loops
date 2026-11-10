---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so every caller has to scrape stdout to decide whether a packet passes. This adds an opt-in --min-percent <N> threshold that turns the report into an exit status without changing the report itself."
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

`calculate-completeness.sh` prints an `Overall Completion: N%` line and then ends with a flat `exit 0`, so the answer it produces never reaches a caller as a status. Automation that wants to gate on completeness has to scrape the report with `grep`/`awk`, which breaks whenever the report is reformatted and cannot tell a low score apart from a successful run. There is no way today to ask the script a yes/no question.

### Purpose

Let a caller ask the question directly: run the script with `--min-percent <N>` and read the verdict from the exit status, while every existing caller keeps the exact report and the exact exit status it gets today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `--min-percent <N>` option in the script's argument parser, accepting an integer from 0 to 100.
- Input validation for `N`, reported in the script's existing `ERROR:` style.
- An exit-status decision after the report is printed: `3` when the reported completion is below `N`, `0` otherwise.
- A `--help` entry for the option and an update to the trailing exit-code comment block.
- Vitest coverage for the exit status and for the unchanged-output invariant.

### Out of Scope

- Changing the percentage formula, the rounding, or any number the report shows - the feature is a gate, not a calculation change.
- Changing report content, JSON field names, ordering or whitespace - the report must stay byte-identical.
- A default threshold - without the flag the script keeps today's `exit 0` behaviour.
- Teaching `validate.sh`, `check-completion.sh` or any other spec script the same flag - one script, one contract.
- Wiring the flag into current callers - adoption is a separate change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option, its validation, the threshold exit, the help line and the exit-code comment |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` | Modify | Cover the threshold exit status and the unchanged-output invariant |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The parser accepts `--min-percent <N>` and consumes the next argument, leaving the positional `SPEC_FOLDER` and the existing `--file` path intact. | `--min-percent 90 <folder>` and `<folder> --min-percent 90` both parse to the same target and threshold. |
| REQ-002 | When `--min-percent <N>` is supplied, the script exits `3` if the reported Overall Completion is below `N`, and exits `0` if it is equal to or above `N`. | A packet reporting 50% exits 3 at `--min-percent 90`, and 0 at `--min-percent 50` and `--min-percent 40`. |
| REQ-003 | Results output is unchanged. For the same target and the same other options, stdout and stderr are byte-identical with and without `--min-percent`, in both the text and `--json` modes. | `diff` of the two captured streams is empty for a text run and for a JSON run. |
| REQ-004 | Without the flag the script behaves exactly as it does today: the same report, and `exit 0` on a successful run. | The existing suite passes unmodified; a run with no flag exits 0 on a valid folder. |
| REQ-005 | An invalid `N` exits `1` before any report is printed, with an `ERROR:` line on stderr naming the option and the existing `Use --help for usage information` hint. Invalid means: missing value, non-integer, empty, negative, or greater than 100. `0` and `100` are valid. | Each invalid case exits 1, writes the error to stderr and leaves stdout empty. |
| REQ-006 | The comparison uses the same integer the report prints, so a displayed 90 passes at `--min-percent 90`. | A packet whose raw score rounds to 90 exits 0 at `--min-percent 90`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `--help` documents `--min-percent <N>` alongside the other options, including that it exits 3 below the threshold. | `--help` output contains one entry for the option; the rest of the help text is untouched. |
| REQ-008 | The trailing exit-code comment block lists `3` with its meaning, next to the existing `0` and `1` entries. | The block names all three statuses the script can now return. |
| REQ-009 | In `--file` mode the report has no Overall Completion line, so the threshold compares against the single-file `Completion: N%` the script already prints. | `--file <path> --min-percent 90` exits 3 below 90 and 0 at or above it. |
| REQ-010 | The vitest suite covers the exit-status matrix, the invalid-input cases and the output-identity invariant. | `npx vitest run runtime/cli/tests/calculate-completeness-script.vitest.ts --config vitest.config.ts` passes from `.skilled/skills/system-spec-kit`. |
| REQ-011 | When `--json` and `--min-percent <N>` are supplied together, the JSON output carries a boolean `min_percent_met` field that is `true` when the reported Overall Completion is at or above `N` and `false` when it is below. | A 50% packet emits `"min_percent_met": false` at `--min-percent 90` and `true` at `--min-percent 40`, matching the percentage the exit status compares. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--min-percent` turns the reported percentage into a status: exit 3 below the threshold, exit 0 at or above it, across the boundary values 0, 50, 90 and 100.
- **SC-002**: The report is byte-identical with and without the flag in both output modes, so no existing consumer sees a change.
- **SC-003**: Invalid input fails fast with exit 1 and an actionable stderr message, and never prints a partial report.
- **SC-004**: The existing and new vitest cases pass, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 as shipped on macOS - no associative arrays, no `mapfile` | Syntax that only works on bash 4 breaks the primary platform | Use the scalar globals and `case` parsing the script already uses; test with `/bin/bash` |
| Dependency | `bc` for the percentage math | Already required by the script, so no new dependency | None needed |
| Risk | Exit `3` overlaps the spec-script taxonomy where `3` means system error | Medium - a caller that treats 3 as infrastructure failure misreads a threshold miss | Document 3 in `--help` and the exit-code block; the flag is opt-in, so no existing caller can receive it |
| Risk | `set -euo pipefail` turns a false comparison into a silent exit | High impact, low likelihood - output is already printed, but the status would be wrong | Write the decision as an `if`/`else` with explicit `exit`, the same shape as the existing clamp at lines 294-299 |
| Risk | The threshold is compared against a rounded integer | Low - a raw 89.6% displays as 90 and passes at `--min-percent 90` | REQ-006 fixes the comparison to the displayed value and the docs say so |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `validate.sh` and `check-completion.sh` grow the same flag? Deferred; adoption is a separate packet.
- Is a `--fail-under` alias worth adding? Deferred until a caller asks for it.
<!-- /ANCHOR:questions -->

---
