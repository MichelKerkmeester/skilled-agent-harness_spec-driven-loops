---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "Adds a --min-percent <N> option to the completeness calculator so a caller can gate on the reported percentage through an exit code instead of parsing the report text."
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
`calculate-completeness.sh` prints an `Overall Completion` percentage and then always exits 0. A caller that wants to refuse an unfinished spec folder, such as a CI step or a pre-commit hook, has to parse the report text or re-implement the percentage arithmetic. Either choice can disagree with the number the script printed.

### Purpose
Add `--min-percent <N>` so one invocation both prints the unchanged report and returns a pass or fail exit code for the percentage it printed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 90 specs/zz-bench-authoring/001-completeness-min-percent
ERROR: Unexpected argument: 90
Use --help for usage information
$ echo $?
1
```

The flag is unparsed today: `--min-percent` falls into the positional branch, so `90` arrives as an unexpected second positional argument and the run fails before it prints any report.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` in the script's existing option loop, accepting an integer from 0 to 100.
- Compare the percentage the run reports against N after the report is written, and exit 3 when it is below N.
- Keep the text and JSON reports byte-identical whether or not the option is passed.
- Document the option in the script's `--help` block and name exit code 3 in its exit-code footer.

### Out of Scope
- Changing how the percentage is computed - the check reads the printed figure, so the report and the exit code cannot drift.
- Editing `validate.sh` or any other spec script - the request names one script.
- Wiring the option into CI - a caller can adopt the exit code without a change here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Option parsing, threshold check, help text and exit-code footer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parse `--min-percent <N>` as an integer from 0 to 100, and reject any other value or a missing value. | `--min-percent 90` on a 100% folder exits 0; `--min-percent abc`, `--min-percent 101` and a trailing `--min-percent` with no value each print an error and exit 1. |
| REQ-002 | Exit 3 when the reported completion is below N, and exit 0 otherwise. | On a fixture whose Overall Completion is 86, `--min-percent 90` exits 3 and `--min-percent 50` exits 0. |
| REQ-003 | Leave the report unchanged, with or without the option. | `diff` between the stdout of a run with `--min-percent 90` and the stdout of the same run without it prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Name the option in `--help` and exit code 3 in the script's footer comment. | `--help` prints a line beginning `--min-percent`; the footer names exit code 3. |
| REQ-005 | Keep the existing exit codes intact. | A run with no target still exits 1; a run without the option still exits 0 on a valid folder. |
| REQ-006 | When `--json` and `--min-percent` are passed together, the JSON output gains a boolean `min_percent_met` field, true when Overall Completion is at or above N and false otherwise. | `--json --min-percent 90` on the 100% packet reports `min_percent_met` as `true`; the same option pair on the 86% fixture reports it as `false`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixture at 86% run with `--min-percent 90` exits 3 and prints the same report as the same run without the option.
- **SC-002**: The 100% packet run with `--min-percent 90` exits 0.
- **SC-003**: Every invocation that omits the option keeps the exit code and stdout it had before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc` | The percentage cannot be computed, so the threshold has nothing to compare | The script already exits 1 when `bc` is missing, and the new check runs only after a successful report |
| Dependency | Bash 3.2, the macOS `/bin/bash` | `[[ =~ ]]` and `local -a` must stay compatible | Reuse the constructs the script already uses; no `mapfile` and no associative arrays |
| Risk | Exit 3 already means "system error" in the spec-script taxonomy | A caller may read a below-threshold result as a crash | Name exit 3 in the script footer and in this packet, so the meaning sits next to the code |
| Risk | The check compares a recomputed percentage instead of the printed one | The report and the exit code disagree | Read the same variable the report prints, and keep REQ-003's diff test as the guard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `--min-percent` apply to `--file` mode? Decision: yes - the run compares the percentage it reports, which is Overall Completion for a folder and the per-file Completion under `--file`.
- Should N accept a decimal such as `90.5`? Decision: no - reported percentages are rounded to whole numbers before printing, so an integer N compares exactly while a decimal would compare against a rounded figure.
- Should a below-threshold run print a warning line? Decision: no - REQ-003 requires identical output, so the exit code is the only signal.
<!-- /ANCHOR:questions -->

---
