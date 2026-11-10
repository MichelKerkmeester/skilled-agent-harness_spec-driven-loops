---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0 on a successful run, so every caller has to parse its output to enforce a bar. A --min-percent option turns that bar into an exit status without touching the report."
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

`calculate-completeness.sh` computes a completion percentage and prints it, but exits `0` on every successful run regardless of that number (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh:587`). Any caller that wants to enforce a floor has to capture stdout, find the `Overall Completion:` line or parse the JSON `overall_completion` field, and compare it itself. That duplicates the same parsing in every caller and silently breaks when the report format changes.

### Purpose

One option, `--min-percent <N>`, makes the script answer the floor question with its exit status: `3` when the reported completion is below `N`, `0` otherwise, with the report itself unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Parse `--min-percent <N>` in the argument loop, alongside the existing `--file`, `--verbose`, `--json` and `--quality` options.
- Validate `N` as an integer from `0` to `100`, rejecting anything else as a user error.
- Compare the percentage the run already reports against `N` and exit `3` when it is below, `0` when it is at or above.
- Document the option in `show_help` and in the trailing exit-code comment block.

### Out of Scope

- Changing the percentage arithmetic, the placeholder patterns or the quality checks - the option reads the existing result, it does not recompute it.
- Changing any output line, JSON key or stderr message produced by an existing invocation - callers depend on the current format.
- Wiring the option into `validate.sh`, `check-completion.sh` or any other caller - this packet adds the option, adoption is a separate change.
- A short flag such as `-m` - no caller needs one today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option to the argument loop and help text, validate `N`, and exit `3` below the threshold |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` accepts an integer `N` in `0..100` and makes the script exit `3` when the reported completion is below `N`, `0` when it is at or above | For a folder reporting `P`: `--min-percent P` exits `0`, `--min-percent $((P+1))` exits `3` |
| REQ-002 | The comparison uses the percentage the run already reports, rounded to the same integer the report prints | A folder printed as `90%` exits `0` for `--min-percent 90` and `3` for `--min-percent 91` |
| REQ-003 | Output is unchanged with the option. Stdout and stderr for an invocation carrying `--min-percent` are identical to the same invocation without it | `diff` between the two captured runs is empty for text, `--verbose` and `--json` modes |
| REQ-004 | Without the option, exit status is exactly what it is today | No-option run on a valid folder exits `0`; missing folder still exits `1` |
| REQ-005 | An invalid `N` - missing value, non-integer, negative, or above `100` - is a user error: a message on stderr and exit `1`, with no calculation run and no report printed | Each malformed form exits `1`; stdout is empty; stderr names the option and the accepted range |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | In `--file` mode, the threshold applies to that file's reported `Completion` percentage, since a single-file run has no `Overall Completion` | A file reporting `P` exits `0` for `--min-percent P` and `3` for `--min-percent $((P+1))` |
| REQ-007 | `--help` documents the option and the `3` exit code | Help output contains a `--min-percent` row and names exit `3` |
| REQ-008 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean field `min_percent_met`, `true` when `Overall Completion` is at or above `N` and `false` otherwise | `--json --min-percent P` on a folder reporting `P` prints `"min_percent_met": true`; `--json --min-percent $((P+1))` prints `"min_percent_met": false` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller can gate on completeness with one command and no output parsing: `calculate-completeness.sh --min-percent 90 specs/<folder>` exits `3` below `90` and `0` at or above it.
- **SC-002**: Every existing invocation produces byte-identical output and the same exit status it produced before this change.
- **SC-003**: Malformed thresholds fail loudly with exit `1` rather than being coerced to a default, so a typo cannot silently disable a gate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script for percentage arithmetic | None beyond the existing check at `calculate-completeness.sh:570` | No new dependency |
| Risk | Exit `3` collides with the spec-script taxonomy where `3` means system error (`.devin/skills/system-spec-kit/SKILL.md:121`) | A caller could read a below-threshold result as an infrastructure failure | Document the meaning in `--help` and the exit-code block; the code only appears when the caller opts in with `--min-percent` |
| Risk | The percentage is rounded to an integer before comparison, so `89.6%` reports `90` and passes `--min-percent 90` | A folder can pass a threshold its raw ratio misses | Accepted: the gate matches the number the report prints, which is what a human reads |
| Risk | A caller passes the threshold as a bare positional argument by mistake, and it is read as the folder | Confusing error, no silent wrong result | The argument loop already rejects a second positional argument with exit `1`; `--min-percent` requires its value to follow the flag |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The `--file` behaviour was the only open point and is settled by REQ-006: the threshold applies to whichever percentage the run reports.
<!-- /ANCHOR:questions -->

---
