---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so any caller that wants to fail on incomplete docs has to parse the report text. A --min-percent option turns that percentage into an exit status without touching the report."
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

`calculate-completeness.sh` computes a completion percentage and prints it, then ends with `exit 0` on every non-error path. A caller that wants to gate on completeness — a pre-commit hook, a CI step, a packet-closing script — therefore has to scrape `Overall Completion: N%` out of the human-readable report, and it has to keep that scrape in sync with a layout the script is free to change. The `--json` form makes the scrape bearable but still leaves the caller responsible for the comparison and for the exit status.

### Purpose

Let a caller declare the completeness floor it requires and read the verdict from the exit status alone, while every existing invocation keeps its current output byte for byte.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` in the existing option loop, accepting an integer from 0 to 100.
- Exit 3 when the completion percentage the report presents is below `N`, and 0 otherwise.
- Reject a missing, non-integer or out-of-range `N` with exit 1 and a message on stderr.
- Name the option in the `--help` OPTIONS block and record exit 3 in the script's exit-code trailer.
- Keep the reported percentage, labels and layout identical with and without the option.

### Out of Scope
- Any change to how completeness is calculated, rounded or clamped - the option reads the figure the report already prints.
- Any change to the existing exit codes 0 and 1 for other outcomes - a successful run without the option still exits 0.
- A short alias such as `-m` - no caller has asked for one, and the option space stays smaller without it.
- Enforcing a floor by default or from an environment variable - the gate is opt-in per invocation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add option parsing, threshold evaluation, help text and the exit-code trailer entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted in folder mode and in `--file` mode, in any position the existing options accept, and a valid `N` never changes the exit status from 3 or 0. | `calculate-completeness.sh --min-percent 50 <folder>` exits 3 or 0 for a folder whose report prints a percentage; it never exits 1. |
| REQ-002 | The script exits 3 when the reported completion percentage is below `N`. | On a folder whose report prints `Overall Completion: 40%`, `--min-percent 41` exits 3. |
| REQ-003 | The script exits 0 when the reported completion percentage is greater than or equal to `N`. | On the same folder, `--min-percent 40` and `--min-percent 0` both exit 0. |
| REQ-004 | The report is unchanged by the option: stdout for an invocation with `--min-percent` is byte-identical to the same invocation without it. | `diff <(script <folder>) <(script --min-percent 100 <folder>)` prints nothing and exits 0, for folder, `--verbose`, `--json`, `--quality` and `--file` forms. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A missing value, a non-integer value, or an integer outside 0-100 exits 1 with a message on stderr and no report on stdout. | `--min-percent`, `--min-percent abc`, `--min-percent -1` and `--min-percent 101` each exit 1, write a message to stderr, and write nothing to stdout. |
| REQ-006 | `--help` documents the option and its exit code. | `calculate-completeness.sh --help` exits 0 and its OPTIONS block contains a `--min-percent <N>` line. |
| REQ-007 | When `--json` and `--min-percent` are passed together, the JSON object gains a boolean `min_percent_met` field that is `true` when the Overall Completion percentage is at or above `N` and `false` otherwise. | On a folder whose report prints `Overall Completion: 40%`, `--json --min-percent 40` prints `"min_percent_met": true` and `--json --min-percent 41` prints `"min_percent_met": false`; `--json` alone prints no `min_percent_met` key. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A folder reporting `Overall Completion: 40%` exits 3 with `--min-percent 41` and exits 0 with `--min-percent 40`, proving both sides of the boundary.
- **SC-002**: `diff` of stdout with and without the option is empty for folder, `--verbose`, `--json`, `--quality` and `--file` invocations, proving the report did not change.
- **SC-003**: `--min-percent` with no value, `abc`, `-1` or `101` exits 1 and prints to stderr, proving invalid input is rejected before any report is written.
- **SC-004**: `calculate-completeness.sh --help` exits 0 and names `--min-percent <N>`, proving the option is discoverable.
- **SC-005**: Invocations that pass no option keep their current outcomes: no arguments exits 1, a nonexistent folder exits 1, and `--help` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script for percentage arithmetic | The script already exits 1 with a clear message when `bc` is absent, so the new option inherits that behaviour rather than adding a failure mode | No action needed; the existing `command -v bc` guard runs before the gate |
| Risk | A caller that treats every non-zero status as a hard failure will now see 3 from an advisory check | Medium | Document exit 3 in `--help` and the exit-code trailer so callers can distinguish it from the error status 1 |
| Risk | The gate compares the rounded integer the report prints, so a folder at 79.6% reads as 80% and passes `--min-percent 80` | Low | State in the help text that the floor is compared against the reported percentage, not a hidden exact value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the gate apply in `--file` mode, where the report prints a per-file `Completion:` rather than `Overall Completion:`? Decision: yes. It compares against the percentage that mode prints, because a silently ignored option in one of two modes is worse than an extra line of help text.
- Should the option accept a decimal floor such as `79.5`? Decision: no. The report only ever shows an integer, so a decimal floor would imply precision the figure does not carry.
<!-- /ANCHOR:questions -->

---

