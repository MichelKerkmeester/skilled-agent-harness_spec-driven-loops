---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so callers must parse its output to enforce a completeness floor. A --min-percent option lets one exit status decide whether a packet meets that floor."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
  - "calculate-completeness threshold exit"
  - "completeness gate exit code 3"
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

`calculate-completeness.sh` computes an Overall Completion percentage for a spec folder and prints it, but the script ends with an unconditional `exit 0` once it has produced a report. A caller that wants to reject a packet below a completeness floor has to capture stdout, find the `Overall Completion:` line, strip the percent sign and compare the number itself. Every caller repeats that parsing, and each copy can disagree with the others about rounding and about which line is authoritative.

### Purpose

Add a `--min-percent <N>` option so a single exit status answers whether the packet meets the caller's floor, without changing a single character of the report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parsing `--min-percent <N>` in `calculate-completeness.sh`, with the same argument style as the existing options.
- Validating `N` as an integer from 0 through 100 and rejecting anything else as a user error.
- Exiting 3 when the reported completion percentage is below `N`, and 0 when it is at or above `N`.
- Listing the option in the script's `--help` text and in its header usage comment.

### Out of Scope
- Changing how the percentage is calculated, rounded or clamped - the gate compares the number the script already prints, so a display change would silently move the threshold.
- Changing the report itself - the stdout of a run with `--min-percent` must be identical to the same run without it.
- Adding the same option to `validate.sh`, `check-completion.sh` or any other spec script - each has its own exit-code contract and is a separate decision.
- A configuration file or environment variable that supplies a default threshold - an implicit floor would make an unchanged invocation behave differently after an unrelated edit.
- Reusing exit 2 - that code belongs to validation errors in the spec-script taxonomy and this script does not validate a packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh | Modify | Add the `--min-percent` flag, its value validation and the threshold exit |
| .skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts | Modify | Cover the gate's exit codes, its output parity and its rejected inputs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The script accepts `--min-percent <N>` as an option in any position the existing options accept, and accepts `N` only as an integer from 0 through 100. | `--min-percent 80` and `--min-percent 0` run; `--min-percent 101`, `--min-percent -1`, `--min-percent abc` and a missing value each exit 1 with an `ERROR:` line on stderr and print no report. |
| REQ-002 | In spec-folder mode, the script exits 3 when Overall Completion is below `N` and 0 when it is at or above `N`. | A folder whose report says `Overall Completion: 40%` exits 3 with `--min-percent 80` and 0 with `--min-percent 40` or `--min-percent 20`. |
| REQ-003 | The comparison uses the integer percentage the report prints, after the existing `printf "%.0f"` rounding and the clamp to 0. | A folder whose report says `Overall Completion: 80%` exits 0 with `--min-percent 80`, even when the unrounded value was 79.6%. |
| REQ-004 | The report on stdout is unchanged, byte for byte, whether or not the option is present. | Capturing stdout from `--json` and from the default text report with and without `--min-percent` yields identical output for the same folder. |
| REQ-005 | Without the option the script keeps its current exit codes: 0 on a completed run, 1 on the existing setup and argument errors. | Running the current invocations from the test file still returns 0, and the missing-folder case still returns non-zero. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `--min-percent` composes with `--json`, `--verbose` and `--quality` in either order, and the gate reads the same percentage those modes report. | `--json --min-percent 80` and `--min-percent 80 --json` produce identical JSON and identical exit status. |
| REQ-007 | In `--file` mode the gate compares the single file's `Completion:` percentage, because no Overall Completion is computed in that mode. | A file reporting `Completion: 25%` exits 3 with `--min-percent 80` and 0 with `--min-percent 10`. |
| REQ-008 | `--help` lists `--min-percent <N>` with its meaning and the exit-3 condition, and the header usage comment names the option. | `--help` output contains the option, its value range and the words "exit 3"; the header comment at the top of the script lists it with the other options. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A folder below the requested floor returns exit 3, and the same folder at or above the floor returns exit 0, with no other change to the run.
- **SC-002**: A stdout diff between a run with `--min-percent` and the same run without it is empty for both the text and JSON reports.
- **SC-003**: Every rejected value (out of range, non-numeric, missing) exits 1 before any report is produced, so a caller never receives a completeness figure it might mistake for a passed gate.
- **SC-004**: The extended test file passes, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script | The gate never runs because the script exits 1 first | Leave the existing `bc` check where it is; the gate adds no new dependency |
| Risk | Exit 3 collides with the spec-script convention where 3 means a system error | A caller that treats every 3 as fatal cannot tell a below-floor packet from a broken run | Document the meaning in `--help` and the header comment; a caller can read stderr, which stays empty on a below-floor result |
| Risk | Rounding makes a 79.6% packet pass a `--min-percent 80` gate | The exit status looks wrong against a raw ratio | Gate the printed integer, so the status always agrees with the report the caller reads |
| Risk | `set -euo pipefail` turns a bare arithmetic comparison into a silent exit | The script exits before printing its report | Write the comparison as an explicit `if` with `[[ ... ]]`, matching the existing clamp in `calculate_spec_completeness` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Two edge cases are decided in §4 rather than left open: `--file` mode gates the per-file percentage (REQ-007), and a below-floor result uses exit 3 rather than 2 (Out of Scope). Both are recorded in `plan.md` §3 as decisions so a reviewer can challenge them before implementation.
<!-- /ANCHOR:questions -->

---
