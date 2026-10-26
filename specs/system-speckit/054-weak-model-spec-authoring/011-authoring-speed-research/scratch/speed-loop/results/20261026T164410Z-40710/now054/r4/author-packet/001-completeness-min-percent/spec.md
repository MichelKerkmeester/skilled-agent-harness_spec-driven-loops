---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "The completeness calculator reports Overall Completion but always exits 0, so a caller cannot gate on a minimum percentage without parsing human-readable output. This feature adds a --min-percent option that turns the reported figure into an exit status."
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
`calculate-completeness.sh` prints `Overall Completion: <N>%` and then exits 0 on every successful run. A caller that wants to fail a check when a packet is below a threshold has to capture and parse that text line, which couples it to the report format and breaks when the report is reformatted. There is no supported way to express "this packet must be at least N percent complete" as a pass/fail signal.

### Purpose
Add `--min-percent <N>` so the script's exit status answers the threshold question directly: exit 3 when Overall Completion is below N, exit 0 otherwise, with the report output unchanged either way.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` in the script's existing option loop and store the value in a global.
- Validate that N is an integer from 0 through 100 and reject anything else as a user error.
- Choose the exit status after the report is printed: 3 below the threshold, 0 at or above it.
- Document the option in the script's `--help` text.

### Out of Scope
- Changing the text or JSON report - the feature is an exit-status gate only, so any output change is a defect.
- Gating on the per-file `Completion:` figure in `--file` mode - that mode has no overall figure to compare against.
- Wiring the option into other spec scripts, CI configs or `validate.sh` - a separate change against those surfaces.
- Adding a new report field for the threshold - callers read the exit status, not the output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh | Modify | Add the `--min-percent` option, its validation and the threshold-based exit status |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | With `--min-percent <N>` and Overall Completion below N, the script exits 3 after printing its normal report | Run on a packet whose overall figure is below N; `echo $?` prints 3 and the report is still on stdout |
| REQ-002 | With `--min-percent <N>` and Overall Completion at or above N, the script exits 0 | Run with `--min-percent 0`; `echo $?` prints 0 and the report is still on stdout |
| REQ-003 | The report output is unchanged with or without `--min-percent` | `diff` of the two runs' stdout prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Without `--min-percent`, the script still exits 0 on a successful run | Plain invocation on any packet; `echo $?` prints 0 |
| REQ-005 | A non-integer or out-of-range N is a user error that exits 1 with a message on stderr | `--min-percent abc` and `--min-percent 101` each print an error to stderr and `echo $?` prints 1 |
| REQ-006 | `--help` lists the new option | `--help` output contains the `--min-percent <N>` option line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `calculate-completeness.sh --min-percent 100 specs/zz-bench-authoring/001-completeness-min-percent` exits 3 while placeholders remain in that packet.
- **SC-002**: `diff <(calculate-completeness.sh <packet>) <(calculate-completeness.sh --min-percent 0 <packet>)` prints nothing, so the gate never alters the report.
- **SC-003**: `--min-percent abc` and `--min-percent 101` each exit 1 with an error on stderr, and no report is printed for them.
- **SC-004**: A plain invocation on the same packet still exits 0, so existing callers are unaffected.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script for percentage math | Overall Completion cannot be computed, so no comparison is possible | The existing guard exits 1 before any comparison; the new option adds no dependency |
| Dependency | The `OVERALL_PERCENTAGE` global, which only `calculate_spec_completeness` sets | A `--file` run has no overall figure to compare | Documented decision: single-file runs exit 0 under `--min-percent` |
| Risk | Exit 3 already means "system error" in the spec-script exit taxonomy | A caller may read a threshold miss as a crash | State in `--help` that 3 means "below the requested minimum" when `--min-percent` is supplied |
| Risk | A comparison placed before the output call would suppress or truncate the report | REQ-003 would fail | Compare only after `output_text` or `output_json` returns, immediately before the final exit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `--min-percent` apply in `--file` mode? Decision: no, because that mode reports a per-file figure and never sets `OVERALL_PERCENTAGE`; a single-file run exits 0.
- Should the JSON report gain a field for the threshold? Decision: no, because output must stay unchanged; the exit status carries the result.
- Should N accept a decimal such as `99.5`? Decision: no, because the reported figure is a rounded integer; N is validated as an integer from 0 through 100.
<!-- /ANCHOR:questions -->

---

