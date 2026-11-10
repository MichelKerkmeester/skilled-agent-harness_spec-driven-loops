---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "The completeness calculator reports a percentage but always exits 0, so every caller that wants a threshold re-parses stdout to enforce one."
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
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-26 |
| **Branch** | none - created with `--skip-branch` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`calculate-completeness.sh` prints an Overall Completion percentage and then always exits 0, so the percentage cannot be used as a gate without parsing it. `archive.sh` is the proof: `get_completeness()` runs the script with `--json`, greps `"overall_completion": [0-9]*` out of the output, and compares the number against its own `MIN_COMPLETENESS=90` before it will archive. Every new caller repeats that parse-and-compare, and a caller that skips the parse reads exit 0 as "complete enough" on a folder that is barely started.

### Purpose

One flag turns the report into a gate: with `--min-percent <N>`, the script exits 3 when the reported completion is below N and exits 0 otherwise, while the report itself stays byte-for-byte unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--min-percent <N>` parsed in the existing option loop of `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`, stored in a new `MIN_PERCENT` global that defaults to empty so "option absent" stays distinguishable from `--min-percent 0`.
- A gate at the end of the script that reads the same percentage the report prints and exits 3 when it is below N, 0 when it is at or above N.
- `reported_percentage()`, a helper that resolves the folder-mode `OVERALL_PERCENTAGE` and the single-file `percentage` from the same stats file `output_text` already reads, so the gate and the printed line cannot disagree.
- `validate_min_percent()`, which rejects a missing, non-integer or out-of-range value with the script's existing `ERROR:` plus `Use --help` shape and exit 1.
- The option named in the `--help` block, the file-header usage comment and the trailing exit-code comment block.

### Out of Scope
- Any change to the report - the percentages, counts, status line, per-file breakdown and every JSON field stay identical, so the option adds no output of its own.
- Teaching `archive.sh` to pass `--min-percent 90` - the option is additive, and that caller keeps the comparison it already has.
- Reworking the exit-code taxonomy - `2` stays unused here, and `3` is reused from the spec-kit shell taxonomy, where it means system error. The collision is recorded in §6 rather than fixed.
- Adding the option to any other `spec/*.sh` script, or to the OpenCode completion plugin that shells this one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Adds the `MIN_PERCENT` global, the `--min-percent` option case, `validate_min_percent()`, `reported_percentage()` and the exit-3 gate, and names the option and exit code in the help and header comments. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The option loop accepts `--min-percent <N>` and stores the value in `MIN_PERCENT`, and `--help` lists the option beside the existing ones | `calculate-completeness.sh --help` prints a `--min-percent <N>` line, and `calculate-completeness.sh --min-percent 90 <folder>` parses without the `Unexpected argument` error |
| REQ-002 | After the report is written, the script exits 3 when the reported percentage is below N and exits 0 when it is at or above N, so the boundary is inclusive | On a folder the report shows at 42%, `--min-percent 90` exits 3 and `--min-percent 40` exits 0; on a folder at exactly 90%, `--min-percent 90` exits 0 |
| REQ-003 | The report is unchanged with and without the option, in both text and `--json` mode | `diff` of the two runs' stdout is empty and `diff` of their stderr is empty, for the same folder and the same other flags |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | N is validated as an integer from 0 to 100 before any report is written; a missing value, a non-integer, or a value outside that range exits 1 with an `ERROR:` line and the `Use --help for usage information` hint | `--min-percent` with no value, `--min-percent abc`, `--min-percent -1` and `--min-percent 101` each exit 1, print the error to stderr and print no report to stdout |
| REQ-005 | In `--file` mode the gate reads the single file's `Completion` percentage, so the option works in both modes instead of being an error | A file the report shows at 50% exits 3 under `--min-percent 60` and exits 0 under `--min-percent 50` |
| REQ-006 | When `--json` and `--min-percent` are passed together, the JSON output gains a boolean `min_percent_met` field that is true when Overall Completion is at or above N and false otherwise | On a folder the report shows at 42%, `--json --min-percent 40` prints `"min_percent_met": true` and `--json --min-percent 90` prints `"min_percent_met": false`, while every existing JSON field keeps its value |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixture folder whose report shows Overall Completion 42% exits 3 under `--min-percent 90` and 0 under `--min-percent 40`, while `diff` of the two runs' stdout is empty and the JSON `overall_completion` field reads 42 in both.
- **SC-002**: Without the option, every existing invocation in the repository - `archive.sh`'s `--json` call and the manual-testing-playbook command - produces byte-identical stdout and the same exit status as before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc` for the percentage arithmetic | Unchanged - the script already refuses to run without it and exits 1 | The new gate runs after that check, so a missing `bc` still fails first with its own message |
| Risk | Exit 3 already means system error in the spec-kit shell taxonomy | Medium - a caller that reads any 3 as a system fault would misreport a low score as a broken script | `--help` and the trailing exit-code comment both name 3 as "completion below `--min-percent`" for this script, and a caller that needs to tell them apart reads `--json` |
| Risk | A caller pipes the report into `grep` or `head` and reads `$?` | Medium - `$?` is the last command in the pipeline, so the gate disappears and the run looks green | Documented in `--help`: the exit code is meaningful only when the script runs directly, not as the left side of a pipeline |
| Risk | Bash 3.2 compatibility on macOS | Low - no associative arrays or `mapfile` are introduced | The helper uses the same `case` and arithmetic forms the script already uses, and the missing-value guard is written as `${2:-}` so `set -u` cannot abort before the error message |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The two readings that needed a decision - the inclusive boundary and `--file` mode - are settled in REQ-002 and REQ-005.
<!-- /ANCHOR:questions -->

---
