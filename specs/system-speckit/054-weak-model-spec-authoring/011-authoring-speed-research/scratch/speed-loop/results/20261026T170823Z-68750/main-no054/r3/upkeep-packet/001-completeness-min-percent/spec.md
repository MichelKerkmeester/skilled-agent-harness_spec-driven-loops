---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so a caller cannot gate on it without parsing the text or JSON report. Adding --min-percent <N> turns the reported percentage into an exit-code contract."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
  - "min percent exit code gate"
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

`calculate-completeness.sh` measures placeholder burn-down and prints `Overall Completion: <N>%`, but the script ends with an unconditional `exit 0`. A caller that wants to fail when a packet sits below a threshold has to parse the text report or the JSON payload and re-implement the comparison itself. `archive.sh` already carries its own 90 percent minimum for exactly this reason, and any further caller inherits the same duplicated policy. The script computes the number that the decision needs and then throws the decision away.

### Purpose

Let the script's exit status carry the completion policy, so a caller can gate on `--min-percent <N>` without reading a single line of the report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Parse `--min-percent <N>` in the existing argument loop, in any position relative to the spec folder.
- Validate `N` as an integer from 0 to 100 before any calculation runs, and reject a missing, malformed or out-of-range value with exit 1.
- Compare the reported overall completion against `N` after the report is written, exiting 3 when the percentage is below the threshold.
- Reject `--min-percent` combined with `--file`, because single-file mode reports a per-file figure and no overall completion.
- List the option in `--help` and record exit 3 in the script's trailing exit-code comment block.

### Out of Scope

- Changing how completion is calculated - the placeholder patterns, line counting and `bc` arithmetic stay exactly as they are.
- Changing the text or JSON report body, its field names or its field order - the report is the contract this feature reads, not one it edits.
- Wiring `--min-percent` into `archive.sh`, `completion-state.cjs` or any other caller - each caller adopts the flag on its own schedule.
- Multiple thresholds, per-file thresholds, or a threshold read from configuration.
- Non-integer thresholds such as `85.5` - percentages are already rounded to whole numbers before they are reported.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option, its validation, the post-output threshold gate, the help entry and the exit-code note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted in any argument position relative to the spec folder, and it never alters the completion report. | `calculate-completeness.sh --min-percent 90 <folder>` and `calculate-completeness.sh <folder>` produce byte-identical stdout; `diff` between the two captures reports no difference. |
| REQ-002 | When the reported `Overall Completion` is below `N`, the script exits 3. When it is equal to or above `N`, the script exits 0. | On a packet whose report reads 64 percent, `--min-percent 90` exits 3 and `--min-percent 50` exits 0, confirmed with `echo $?` after each run. |
| REQ-003 | Without `--min-percent`, the script's output and exit status are unchanged. | A run with no flag prints the same report as before the change and exits 0; the existing `calculate-completeness-script.vitest.ts` suite passes unmodified. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `N` must be an integer from 0 to 100. A missing value, a non-integer, or a value outside that range exits 1 with a message on stderr, and no report is printed. | `--min-percent abc`, `--min-percent -1`, `--min-percent 101` and a trailing `--min-percent` each exit 1, and the stderr message names the offending value. |
| REQ-005 | `--min-percent` combined with `--file` exits 1, because single-file mode has no overall completion to compare. | `--file <path> --min-percent 50` exits 1 with a message stating the option requires a spec folder. |
| REQ-006 | `--help` lists the option with one example, and the trailing exit-code comment records 3 as a threshold miss. | `--help` output contains `--min-percent <N>` and an example invocation; the comment block at the end of the script names exit 3. |
| REQ-007 | When `--json` and `--min-percent` are passed together, the JSON report gains a boolean `min_percent_met` field, true when `Overall Completion` is at or above `N` and false otherwise. | `--json --min-percent 50` on a 64 percent packet prints `"min_percent_met": true` and `--json --min-percent 90` on the same packet prints `"min_percent_met": false`, with the field present in both payloads. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--min-percent 90` against a packet that reports 64 percent exits 3, and the report printed before that exit is identical to the unflagged run.
- **SC-002**: `--min-percent 50` against the same packet exits 0, with the same identical report.
- **SC-003**: Every test in `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` still passes.
- **SC-004**: A caller can replace its own percentage parsing with `if ! calculate-completeness.sh --min-percent 90 <folder>; then ...` and never read the output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc` | Percentages are computed with `bc`, and the script already exits 1 when it is missing | The threshold reads a value the script has already computed, so it adds no new dependency |
| Dependency | Bash 3.2, the macOS default | `set -euo pipefail` can turn a bare arithmetic comparison into a silent early exit | Write the gate as an explicit `if [[ ... ]]; then exit 3; fi`, the same shape the script already uses for its percentage clamp |
| Risk | Exit 3 collides with the spec-kit CLI convention that reserves 3 for a system error | A caller may read a threshold miss as a crash | Document exit 3 in the script's exit-code comment and in `--help`, and keep the gate silent so the printed report is the only explanation |
| Risk | A caller treats any non-zero status as a failure | A pipeline that never intended a gate could start failing | `archive.sh` and `completion-state.cjs` pass no `--min-percent`, so both keep exit 0; confirm both call sites before release |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The request left two behaviours open, and Section 4 settles both: `--min-percent` requires folder mode (REQ-005), and a threshold miss prints nothing extra, so the report stays byte-identical and the exit status alone carries the verdict (REQ-002).
<!-- /ANCHOR:questions -->

---

