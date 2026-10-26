---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "The completeness calculator always exits 0, so a CI job or pre-commit hook cannot fail a build on incomplete spec docs without parsing its text or JSON output. A --min-percent <N> option turns the reported percentage into an exit status while leaving the report byte-identical."
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
| **Branch** | `scaffold/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` prints an `Overall Completion` percentage and then always exits 0, so a caller that wants to fail a build on incomplete docs has to parse the text or JSON report itself. Every such caller re-implements the same comparison, and each one breaks when the report wording changes.

### Purpose
Let a caller state the threshold it already knows it needs, so one exit status answers "are these docs complete enough" without changing a byte of what the script prints.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The script reports a percentage today but no option controls its exit status. Run against a complete packet it prints 100% and exits 0; passing `--min-percent` today is a usage error, because the option falls through to the positional-argument branch.

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/system-speckit/026-graph-and-context-optimization
Spec Folder: specs/system-speckit/026-graph-and-context-optimization
Files Analyzed: 1
Overall Completion: 100%
Total Placeholders: 0
Total Content Lines: 98
Status: ✅ Excellent - Nearly complete
EXIT=0

$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 80 specs/system-speckit/026-graph-and-context-optimization
ERROR: Unexpected argument: 80
Use --help for usage information
EXIT=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` in the script's argument loop, accepting an integer from 0 to 100.
- Exit 3 when the percentage the run reports is below N, and exit 0 when it is at or above N.
- Keep stdout byte-identical with and without the option, in both text and `--json` modes.
- Reject a missing, non-integer or out-of-range N with an error on stderr and exit 1, printing no report.
- Document the option in the script's `--help` text and its trailing exit-code comment.

### Out of Scope
- Changing the placeholder patterns, the percentage math or the status thresholds - the feature only adds an exit status, and touching the math would move every caller's baseline.
- Wiring the option into `validate.sh` or any CI workflow - this packet ships the script option only, and a consumer decides where to use it.
- Adding a test harness - the script has no test suite today, so verification stays manual command invocations recorded in `tasks.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add `MIN_PERCENT` global, the `--min-percent` case branch with validation, the threshold comparison before the final exit, and the `--help` and exit-code documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` exits 3 when the reported percentage is below N. | On a fixture whose report reads `Overall Completion: 80%`, `--min-percent 90` exits 3. |
| REQ-002 | `--min-percent <N>` exits 0 when the reported percentage is at or above N, and when the option is absent. | On the same 80% fixture, `--min-percent 70` exits 0, and a run with no option exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The report is unchanged by the option, in text and JSON modes. | `diff` of stdout from a plain run and a `--min-percent` run is empty, for both default and `--json` output. |
| REQ-004 | An invalid N is rejected before any report is printed. | `--min-percent` with no value, `--min-percent abc` and `--min-percent 101` each print an `ERROR:` line to stderr, exit 1, and print no report. |
| REQ-005 | `--help` documents the option. | `--help` lists `--min-percent <N>` and states the 0-100 range and the exit-3 meaning. |
| REQ-006 | The option works in `--file` mode against that file's `Completion` percentage. | `--file <path> --min-percent 90` on a file reporting 80% exits 3; `--min-percent 70` on it exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a fixture whose report reads `Overall Completion: 80%`, `--min-percent 90` exits 3 and `--min-percent 70` exits 0, with stdout identical in both runs.
- **SC-002**: A run with no `--min-percent` exits 0 and produces stdout byte-identical to the pre-change script.
- **SC-003**: `bash -n` on the script exits 0, and `--help` names the option.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required for the percentage math | Script exits 1 before calculating, so the new option cannot be exercised | Leave the existing `bc` guard in place; it already fails closed |
| Dependency | Bash 3.2 compatibility, which the script explicitly preserves | A `[[ ]]` or array construct that needs Bash 4 breaks macOS callers | Use a plain `case` branch and integer `[[ ]]` comparison only, then run `bash -n` |
| Risk | A caller treats any non-zero exit as a crash and reports a false failure | High | Document exit 3 in `--help` and the trailing exit-code comment so the code is discoverable |
| Risk | The threshold check accidentally changes stdout, breaking existing parsers | High | Diff a plain run against a `--min-percent` run in both text and JSON modes before closing |
| Risk | An empty `MIN_PERCENT` is compared as 0 under `set -u`, silently failing every run | High | Guard the comparison on `[[ -n "$MIN_PERCENT" ]]` and verify a plain run still exits 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the threshold apply in `--file` mode, where the report says `Completion` rather than `Overall Completion`? Decision: yes, REQ-006 compares against that file's `Completion` percentage, so one option behaves the same in both modes.
- Should an invalid N exit 2 to separate usage errors from threshold failures? Decision: no, exit 1 matches the script's existing usage errors, and exit 3 stays unique to a below-threshold run.
- Should N accept a decimal such as `85.5`? Decision: no, the report is already rounded to a whole number by `printf "%.0f"`, so an integer is the honest input.
<!-- /ANCHOR:questions -->

---
