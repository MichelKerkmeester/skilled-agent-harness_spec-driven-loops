---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "The completeness calculator prints a percentage and always exits 0, so a caller cannot gate on it. Add a --min-percent <N> option that turns the printed percentage into an exit status without changing the output."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
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
| **Branch** | `detached HEAD` (created with `--skip-branch`, so no branch exists) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` prints an `Overall Completion` percentage and then always exits 0 on a successful run, so a caller that wants to block on a threshold has to parse the printed number. No option accepts a threshold: `--min-percent 90` falls through the argument loop to the positional branch and the run dies with `ERROR: Unexpected argument: 90`.

### Purpose
Let a caller gate on the percentage it already prints: `--min-percent <N>` exits 3 when the reported percentage is below N and 0 otherwise, with output identical in both cases.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The fixture below is a one-file folder with three `[TODO: ...]` markers and four content lines. Both runs are against the unmodified script.

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh "$D"
Overall Completion: 25%
Total Placeholders: 3
Total Content Lines: 4
$ echo $?
0

$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 90 "$D"
ERROR: Unexpected argument: 90
Use --help for usage information
$ echo $?
1
```

Section 2's Problem Statement quotes both exit codes above: a 25% folder exits 0, and the option itself is rejected with exit 1. The `25%` figure is `(1 - 3 / 4) * 100`, rounded to an integer by the script.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--min-percent <N>` option to `calculate-completeness.sh` that exits 3 when the reported percentage is below N and 0 otherwise.
- Validate N as an integer in `0..100`, exiting 1 with a message on stderr before any analysis when it is missing or invalid.
- Compare the percentage the run already reports: `Overall Completion` in folder mode, the single file's `Completion` under `--file`.
- Add the option to `--help` and record exit 3 in the script's trailing exit-code comment block.
- Cover the new exit statuses in the existing vitest file.

### Out of Scope
- Any change to the printed report - the requirement is byte-identical stdout, so no line, label or percentage is added or reordered.
- Any change to how the percentage is computed - rounding, clamping and placeholder patterns stay as they are.
- Changing exit codes for the existing failure paths - a missing folder, a missing `bc` and an unexpected argument keep exiting 1.
- Documentation outside the packet - `runtime/cli/README.md` and the skill README are not touched by this change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh | Modify | Parse `--min-percent <N>`, validate it, compare the reported percentage, exit 3 below the threshold, add the help line and the exit-code comment |
| .skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts | Modify | Add cases for exit 3 below the threshold, exit 0 at or above it, and exit 1 for an invalid value |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Accept `--min-percent <N>` without changing the report. | On one folder, the run with `--min-percent 50` and the run without it produce byte-identical stdout: `diff` of the two captures prints nothing. |
| REQ-002 | Exit 3 when the reported percentage is below N. | On the 25% fixture, `--min-percent 90` prints the unchanged report and exits 3. |
| REQ-003 | Exit 0 when the reported percentage is at or above N. | On the 25% fixture, `--min-percent 25` and `--min-percent 0` each print the unchanged report and exit 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reject a missing, non-integer or out-of-range value with exit 1 and a message on stderr, before any analysis. | `--min-percent` with no value, `--min-percent abc`, `--min-percent -1` and `--min-percent 101` each print an error and exit 1, and none of them prints a report. |
| REQ-005 | Compare the percentage the run reports, in both modes. | In folder mode the comparison uses `Overall Completion`; with `--file <path> --min-percent 90` a file whose `Completion` is below 90 exits 3 and prints the unchanged single-file report. |
| REQ-006 | Document the option where the script already documents its options. | `--help` prints a line for `--min-percent <N>`, and the trailing exit-code comment block names exit 3 as "below --min-percent threshold". |
| REQ-007 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean `min_percent_met` field: true when Overall Completion is at or above N, false otherwise. | On the 25% fixture, `--json --min-percent 25` prints `"min_percent_met": true` and `--json --min-percent 90` prints `"min_percent_met": false`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the 25% fixture, `--min-percent 90` exits 3 and the same run without the option exits 0.
- **SC-002**: Stdout is byte-identical with and without the option on the same folder, so `diff` of the two captures prints nothing.
- **SC-003**: A threshold equal to the printed percentage never fails the run: `--min-percent 25` on the 25% fixture exits 0.
- **SC-004**: The existing vitest suite for the script exits 0 with the new cases included.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` and `bc`, both already required by the script | None new - the script already exits 1 when `bc` is absent | Reuse the existing `bc` presence check and integer comparison; add no new tool |
| Risk | Exit 3 is also the general `spec/*.sh` system-error code | A caller cannot tell "below threshold" from "system error" by code alone across the script family | Inside this script the system-error paths exit 1 today, so 3 is unambiguous here; record the meaning in `--help` and in the trailing exit-code block |
| Risk | The comparison drifts from the printed value, e.g. comparing an unrounded `bc` result | The gate and the report disagree | Compare the same rounded integer variable the report prints, and test the boundary where N equals the printed percentage |
| Risk | `set -euo pipefail` turns a non-zero comparison into a silent early exit before the report prints | The report disappears on a failing threshold | Make the comparison the last step before the existing `exit`, and assert in a test that the report still prints when the run exits 3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Decisions taken: the option compares the percentage the run reports (`Overall Completion` in folder mode, `Completion` under `--file`); `--json` output is unchanged because only the exit status differs; an invalid value exits 1 rather than 3 so a caller can separate a bad invocation from a failed gate.
<!-- /ANCHOR:questions -->

---
