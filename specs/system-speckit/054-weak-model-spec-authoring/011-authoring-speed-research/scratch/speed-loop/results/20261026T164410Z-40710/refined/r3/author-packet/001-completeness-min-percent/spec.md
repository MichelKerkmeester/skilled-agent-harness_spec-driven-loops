---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "The completeness calculator prints a percentage and always exits 0, so a caller that needs a completeness floor has to parse stdout. This spec adds --min-percent <N>, which exits 3 below the threshold and leaves the report byte-identical."
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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The completeness calculator prints `Overall Completion: <N>%` and then exits 0 on every successful run, whatever the number is. A caller that needs a completeness floor therefore has to capture stdout and parse the percentage itself, so every hook or CI step that gates on completeness carries its own regex, and a change to the report's wording turns that gate into a silent no-op.

### Purpose
Let a caller enforce a completeness floor with one flag: `--min-percent <N>` exits 3 when the reported completion is below N and exits 0 otherwise, while the report itself stays byte-identical.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The option does not exist yet, so its value is rejected as a stray positional argument:

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 90 specs/zz-bench-authoring/001-completeness-min-percent
ERROR: Unexpected argument: 90
Use --help for usage information
$ echo $?
1
```

A plain run reports the percentage and exits 0 regardless of its value:

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent | rg 'Overall Completion|Total Placeholders'
Overall Completion: 100%
Total Placeholders: 0
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent > /dev/null; echo $?
0
```

`bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --help | grep -c -- '--min-percent'` prints `0`, and the exit-code comment block at the end of the script lists only `0` and `1`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` in the existing option loop and keep the value in a new `MIN_PERCENT` global.
- Publish the percentage each output path prints into one shared variable, so the gate compares the number the caller actually saw.
- Exit 3 after the report is written when the reported percentage is below N, and exit 0 otherwise.
- List the option in `show_help` and add `3` to the exit-code comment block at the end of the script.

### Out of Scope
- Changing how completeness is calculated - the placeholder patterns and line counting must stay as they are, because the report has to remain byte-identical.
- Wiring `--min-percent` into `validate.sh` or any hook - a separate change with its own exit-code contract.
- A short `-m` alias - the request names the long form only, and an alias is a one-line follow-up.
- Rewording the `Status:` band or the threshold colours - untouched by this change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add `--min-percent <N>` parsing, the shared reported-percentage variable, the post-output gate, and the help/exit-code text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted as an option that consumes one integer value, in any argument position the current loop allows. | `bash calculate-completeness.sh --min-percent 90 <folder>` no longer prints `ERROR: Unexpected argument: 90`. |
| REQ-002 | When the reported percentage is below N, the script exits 3. | On a folder whose run reports less than N, `bash calculate-completeness.sh --min-percent <N> <folder> > /dev/null; echo $?` prints `3`. |
| REQ-003 | When the reported percentage is at or above N, the script exits 0. | On a folder whose run reports 100, `bash calculate-completeness.sh --min-percent 100 <folder> > /dev/null; echo $?` prints `0`. |
| REQ-004 | The report is unchanged with or without the option. | `diff <(bash calculate-completeness.sh <folder>) <(bash calculate-completeness.sh --min-percent 90 <folder>)` prints nothing, and the same holds with `--json`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A missing, non-integer, or out-of-range value exits 1 with an `ERROR:` line on stderr and prints no report. | `bash calculate-completeness.sh --min-percent abc <folder>; echo $?` prints the error and `1`; the same holds for `--min-percent` with no value and for `--min-percent 150`. |
| REQ-006 | `--help` lists the option and the exit-code comment block documents code 3. | `bash calculate-completeness.sh --help \| grep -c -- '--min-percent'` prints `1`, and the comment block at the end of the script names `3`. |
| REQ-007 | `--file` runs gate on the file completion they print, since a single-file run has no `Overall Completion` line. | `bash calculate-completeness.sh --min-percent 100 --file <file-below-100>; echo $?` prints `3`, and the same file at 100 prints `0`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A folder that reports 100 exits 0 under `--min-percent 100`, and a folder that reports less than 100 exits 3 under the same flag.
- **SC-002**: `diff` of the text report with and without `--min-percent` prints nothing, and so does `diff` of the `--json` report.
- **SC-003**: `--min-percent 0` exits 0 for every input the script accepts today, including a folder with no template files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script | The script exits 1 before any calculation, so the gate never runs | Unchanged from today; the existing `command -v bc` guard stays where it is |
| Dependency | `/bin/bash` 3.2.57 on macOS | Bash 4 syntax (`declare -A`, `mapfile`, `local -n`) fails at parse time on the default shell | Use only integer `[[ ... -lt ... ]]` tests and a plain global, matching the script's existing Bash 3.2 note |
| Risk | The gate compares a different number from the one printed, so a below-threshold run exits 0 | Medium - the flag would silently pass | Both output paths assign the value they print to one shared variable, and REQ-004's `diff` plus REQ-002's exit check cover it |
| Risk | The gate writes to stdout or reorders the report | Medium - callers that parse the report break | Compare after the output call and write nothing; REQ-004 proves it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the gate apply to `--file` runs, which print no `Overall Completion` line? Decision: yes, it compares the `Completion:` percentage that run prints, so the flag is never a silent no-op.
- Is a value above 100 an error or a clamp? Decision: an error, exit 1, because a threshold no run can reach would make the flag look broken.
- Should the option be added to `validate.sh` in the same change? Decision: no, that is a separate exit-code contract and is listed as out of scope.
<!-- /ANCHOR:questions -->

---
