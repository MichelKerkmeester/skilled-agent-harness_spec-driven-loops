---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so callers must parse its report to enforce a documentation floor. Adding --min-percent <N> makes the script exit 3 when the reported completion is below N and 0 otherwise, leaving the report itself byte-identical."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
  - "calculate completeness exit code gate"
  - "min percent threshold"
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

`calculate-completeness.sh` computes and prints a completion percentage, but every successful run ends in `exit 0`. The only non-zero paths are user errors: an unexpected argument, a missing spec folder, or a missing `bc`. A caller that needs to enforce a documentation floor - a CI step, a pre-commit gate, or an agent deciding whether a packet is ready - therefore has to capture stdout and re-parse `Overall Completion: N%` or the `overall_completion` JSON field. That re-implementation duplicates the script's formatting knowledge and silently breaks if the report layout ever changes.

### Purpose

Give the script one threshold flag whose exit status answers "did this packet clear the floor" so no caller has to read the report to find out.

### User Story

A CI maintainer runs the completeness calculator over every packet in a pull request and wants the step to fail the build when a packet drops below the team's documentation floor, without writing a parser for the report text.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `--min-percent <N>` argument parsing in `calculate-completeness.sh`, including argument validation
- A threshold comparison against the completion figure the run already reports, and exit status `3` when that figure is below `N`
- `--help` documentation for the new option and an extension of the trailing exit-code comment block

### Out of Scope

- The completeness formula, placeholder patterns, quality checks and report layout - the flag must not change what the script measures or prints
- Existing exit statuses `0` (success) and `1` (user error) - unchanged in behaviour and meaning
- A short alias for the option - `--min-percent` is the only spelling, so no single-letter flag collides with `-v`, `-j`, `-q` or `-f`
- Adding the same flag to any other script under `runtime/cli/spec/` - separate packets
- Wiring the flag into a caller (CI config, git hooks, `/speckit` commands) - this packet delivers the script contract only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the `--min-percent` flag, its validation, the post-output threshold gate, help text and exit-code documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The script accepts `--min-percent` with an integer value alongside the existing flags, in any argument position the current parser already tolerates. | A run of `--min-percent 80` followed by a packet path completes without an "Unexpected argument" error, and the same holds when `--json` is also passed. |
| REQ-002 | When the completion figure the run reports is below `N`, the script exits `3`; when it is at or above `N`, the script exits `0`. The comparison is inclusive-pass: a run at exactly `N` exits `0`. | On a fixture packet whose reported completion is 75%: `--min-percent 80` exits `3`, `--min-percent 75` exits `0`, `--min-percent 70` exits `0`. |
| REQ-003 | The flag changes only the exit status. Everything the script writes to stdout and stderr is byte-identical to the same invocation without the flag. | `diff` between a run with the flag and the same run without it is empty for text, `--json`, `--verbose`, `--quality` and `--file` invocations. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A missing, empty, non-integer, negative or greater-than-100 argument is rejected with exit `1` and a message on stderr. A malformed argument never produces exit `3`, because `3` must keep meaning "completion below the floor". | `--min-percent` with no value, `--min-percent abc`, `--min-percent -5` and `--min-percent 101` each exit `1` and print an error; no report is emitted. |
| REQ-005 | In `--file` mode, where the report has no "Overall Completion" line, the gate compares the completion figure that mode does report. | On a single file at 40%: `--file <path> --min-percent 50` exits `3`; `--file <path> --min-percent 40` exits `0`. |
| REQ-006 | `--help` lists the option, and the exit-code comment block at the end of the script names status `3`. | `--help` output contains `--min-percent`; the trailing comment block documents `0`, `1` and `3`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller can gate on documentation completeness with one exit status: `3` below the floor, `0` at or above it, `1` for a bad invocation.
- **SC-002**: Report output is provably unchanged - a byte-for-byte diff against a flagless run is empty across every output mode.
- **SC-003**: A default invocation with no flag keeps its current exit status and output, so every existing caller is unaffected.
- **SC-004**: The new status is discoverable: `--help` and the script's exit-code block both document it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required for the percentage arithmetic | No new dependency is introduced; a host without `bc` fails exactly as it does today | No change needed - the existing preflight check stays in place |
| Risk | Exit status `3` surprises a caller that treats any non-zero status as a crash | Med | Document `3` in `--help` and in the trailing exit-code block, and keep `1` reserved for bad input |
| Risk | Recomputing the ratio instead of reading the reported figure gives a different answer than the report | Med | Compare the already-rounded figure the run reports; never recompute from placeholder and line counts |
| Risk | `set -u` aborts on a missing flag value before the script can print a useful message | Med | Check the argument count before reading the value, and reject it with exit `1` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. Three ambiguities were resolved during planning and are carried as requirements:

- Which figure the gate compares - the rounded figure the report prints, not the unrounded ratio (REQ-002).
- What `--file` mode compares, given it prints no "Overall Completion" line - that file's reported completion (REQ-005).
- Whether a short alias is offered - no, so the option cannot collide with the existing single-letter flags (REQ-001).
<!-- /ANCHOR:questions -->

---
