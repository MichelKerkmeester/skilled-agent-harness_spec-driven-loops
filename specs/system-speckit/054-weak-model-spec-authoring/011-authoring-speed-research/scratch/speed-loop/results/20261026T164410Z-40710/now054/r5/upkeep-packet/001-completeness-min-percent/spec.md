---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "Add a --min-percent <N> option to calculate-completeness.sh so a caller can fail a check on an incomplete packet, exiting 3 when the reported completion is below N and 0 otherwise while leaving the report output unchanged."
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
`calculate-completeness.sh` prints a completion report and then always exits 0, so a caller cannot tell an incomplete packet from a complete one without parsing stdout. Every wrapper that greps the `Overall Completion:` line couples itself to the human-readable report and breaks when that formatting changes.

### Purpose
Add `--min-percent <N>` so a caller can make an incomplete packet fail the call by exit status, without changing the report a human reads.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--min-percent <N>` parsing to the argument loop, storing N for the final exit decision.
- Exit 3 when the reported completion is below N and 0 when it is at or above N.
- Keep stdout and stderr byte-identical with and without the option, in text and JSON modes.
- Document the option in `--help` and in the trailing exit-code comment block.
- Reject a missing, non-integer or out-of-range N with exit 1 and a stderr message.

### Out of Scope
- Changing how completion is calculated - the placeholder patterns and percentage formula stay as they are.
- Adding a config file or environment variable for the threshold - callers already pass flags, and a flag keeps the threshold per-invocation.
- Gating other spec-kit scripts - each script owns its own exit codes.
- Turning `--quality` warnings into failures - that mode stays advisory.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Parse `--min-percent <N>`, compare it with the reported completion, and set exit 3 on a shortfall; update `show_help` and the exit-code comment block. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Accept `--min-percent <N>` in the argument loop without consuming the spec folder or `--file` path | `calculate-completeness.sh --min-percent 90 specs/<folder>` analyzes the named folder and prints the normal report |
| REQ-002 | Exit 3 when the reported completion is below N | On a fixture whose Overall Completion is 0%, `--min-percent 90` exits 3 |
| REQ-003 | Exit 0 when the reported completion is at or above N | On the same fixture, `--min-percent 0` exits 0; the boundary value equal to the completion also exits 0 |
| REQ-004 | Leave the report output unchanged whether or not the option is present | `diff` of stdout from the two invocations is empty in text mode and in `--json` mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Reject a missing, non-integer or out-of-range N with exit 1 and a stderr error, leaving stdout empty | `--min-percent` with no value, `--min-percent abc` and `--min-percent 101` each exit 1 and print a usage error to stderr |
| REQ-006 | Document the option in `--help` and in the trailing exit-code comment block | `--help` lists `--min-percent <N>` once, and the comment block lists exit 3 as a below-threshold result |
| REQ-007 | Add a boolean `min_percent_met` field to the `--json` output when `--json` and `--min-percent` are passed together, true when Overall Completion is at or above N and false otherwise | `calculate-completeness.sh --json --min-percent 90 <0% fixture>` prints `"min_percent_met": false` and `--json --min-percent 0` prints `"min_percent_met": true` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `calculate-completeness.sh --min-percent 90 <fixture>` exits 3 on a 0% fixture, and `--min-percent 0 <fixture>` exits 0.
- **SC-002**: stdout from `<script> <folder>` and `<script> --min-percent 90 <folder>` is byte-identical in text mode and in `--json` mode.
- **SC-003**: Without the option the script still exits 0 on the same fixture, so existing callers keep working.
- **SC-004**: `--min-percent 101` exits 1, writes one usage error to stderr and writes nothing to stdout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc` and Bash 3.2 integer arithmetic, both already used by the script | The comparison cannot run if `bc` is missing | Reuse the integer the report already prints; the script's existing `bc` guard keeps its current error path |
| Risk | A caller treats exit 3 as a script error and aborts a pipeline that used to continue | Med | Document exit 3 in `--help` and the exit-code comment, and keep exit 1 reserved for real errors |
| Risk | A value with leading zeros or a sign compares as a string rather than a number | Low | Validate N against `^[0-9]+$` and normalize it to a base-10 integer before the comparison |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `--min-percent` also apply under `--file`? Decision: yes - it compares against that file's reported completion, so the gate behaves the same in both modes.
- Is N inclusive? Decision: yes - a completion equal to N passes, matching the request's "below N".
- Does the option change stderr? Decision: no - stderr is unchanged, so existing warning consumers keep working.
<!-- /ANCHOR:questions -->

---
