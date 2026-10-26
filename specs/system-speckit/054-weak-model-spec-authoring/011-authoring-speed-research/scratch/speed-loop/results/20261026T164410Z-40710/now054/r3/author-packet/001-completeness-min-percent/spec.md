---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh always exits 0 when its calculation succeeds, so a caller that wants to fail below a completion threshold has to parse the report. Add a --min-percent <N> option that turns that comparison into an exit code while leaving the report unchanged."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
  - "min-percent exit code"
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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `detached HEAD (scaffolded with --skip-branch)` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` computes an Overall Completion percentage and always exits 0 when the calculation succeeds, so a CI job or gate script that wants "fail below N percent" has to capture stdout and parse the report. That parsing duplicates the script's arithmetic, differs between the text and JSON forms, and breaks silently when the report wording changes.

### Purpose
Let any caller gate on a completion threshold with a single exit-code check, while the existing report stays byte-identical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--min-percent <N>` option parsing with integer range validation for `N` between 0 and 100.
- Return exit code 3 after the report when completion is below `N`, and exit code 0 otherwise.
- Apply the same threshold in `--file` mode against that mode's reported `Completion` value.
- Document the option in `show_help` and in the script's trailing exit-code comment block.

### Out of Scope
- Changing how completion is calculated - the placeholder-to-line ratio is the contract this flag reads, not something it redefines.
- Changing the text or JSON report - callers that parse the report today must see identical bytes.
- Wiring the flag into `validate.sh` or `check-completion.sh` - those are separate callers and a separate change.
- Adding a short alias such as `-m` - no caller needs one, and the short flags in this script are already assigned.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Parse and validate `--min-percent`, gate the exit code on the reported percentage, and document the option |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Accept `--min-percent <N>` with an integer `N` between 0 and 100. | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 90 specs/zz-bench-authoring/001-completeness-min-percent` completes with exit 0 or 3, never 1. |
| REQ-002 | Exit 3 when the reported completion is below `N`. | On a folder reporting `Overall Completion: 42%`, `--min-percent 43` exits 3 while `--min-percent 42` exits 0. |
| REQ-003 | Exit 0 when the reported completion is at or above `N`, including `N=0`. | `--min-percent 0` exits 0 on every folder that calculates successfully. |
| REQ-004 | Keep the report byte-identical with and without the option. | `diff` between the plain report and the `--min-percent 0` report is empty, in both text and `--json` mode. |
| REQ-005 | Reject an invalid value before calculating anything. | A missing value, `abc`, `-1` and `101` each print an `ERROR:` line on stderr, print no report, and exit 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Document the option where the script already documents its interface. | `--help` lists `--min-percent <N>` and the trailing exit-code comment block names 3 as the below-threshold code. |
| REQ-007 | Apply the threshold in `--file` mode against that file's `Completion` value. | `--file <path> --min-percent 100` exits 3 for a file below 100 percent and 0 for a file at 100 percent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller gates with one check: `calculate-completeness.sh --min-percent 80 <folder>; echo $?` prints 3 below 80 and 0 at or above it.
- **SC-002**: `diff` of the text report and of the `--json` report, each with and without `--min-percent 0`, prints nothing.
- **SC-003**: `--help` names the option, and `bash -n` on the script exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc` for the percentage arithmetic | The script already exits 1 when `bc` is missing, so the flag adds no dependency | Leave the existing `command -v bc` preflight untouched |
| Dependency | Bash 3.2, the macOS `/bin/bash` the script targets | A construct such as `local -n` or an associative array would break the target shell | Use only `[[ ]]` integer comparison and plain scalars, as the rest of the script does |
| Risk | Exit code 3 collides with the spec CLI taxonomy, where 3 means system error | Medium | Document 3 as below-threshold in the script's exit-code block and `--help`, so callers of this script read it unambiguously |
| Risk | `$2` is unbound under `set -u` when `--min-percent` is the last argument | Low | Read `${2:-}`, emit the standard `ERROR:` line and exit 1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Resolved during planning: `--file` mode prints `Completion:` rather than `Overall Completion:`, so the threshold reads that mode's percentage; folder mode reads `OVERALL_PERCENTAGE`.
<!-- /ANCHOR:questions -->

---
