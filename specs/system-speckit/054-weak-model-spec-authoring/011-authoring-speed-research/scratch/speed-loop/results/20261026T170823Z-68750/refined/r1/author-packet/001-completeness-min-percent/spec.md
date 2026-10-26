---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "Add a --min-percent <N> option to calculate-completeness.sh so a caller can turn the reported Overall Completion into an exit status. The script exits 3 below the threshold and 0 otherwise, and prints exactly the same report either way."
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
`calculate-completeness.sh` reports a percentage but always ends with `exit 0`, so a caller that needs to fail a gate — a CI step, a pre-commit hook, a workflow script — has to capture stdout and parse the `Overall Completion:` line itself. Every caller that parses that line duplicates the same fragile regex against a human-readable report, and each copy drifts when the report formatting changes.

### Purpose
Let one invocation both report the number and decide the gate: `--min-percent <N>` makes the script exit 3 when Overall Completion is below N, so a caller reads an exit status instead of scraping text.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

A folder holding ten placeholder tokens in a single `spec.md` scores 10% and still exits 0, which is the gap this feature closes.

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent/scratch/measured; echo "exit=$?"

───────────────────────────────────────────────────────────────────
         SpecKit Completeness Calculator - Results
───────────────────────────────────────────────────────────────────

Spec Folder: specs/zz-bench-authoring/001-completeness-min-percent/scratch/measured
Files Analyzed: 1

───────────────────────────────────────────────────────────────────
Overall Completion: 10%
───────────────────────────────────────────────────────────────────
Total Placeholders: 10
Total Content Lines: 11

───────────────────────────────────────────────────────────────────
Status: ❌ Very Low - Just starting
───────────────────────────────────────────────────────────────────

exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--min-percent <N>` option to `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` that sets a threshold on Overall Completion.
- Exit 3 when Overall Completion is below N, and exit 0 when it is at or above N.
- Reject a missing, non-numeric, negative or over-100 value with a message on stderr and exit 1, without printing a report.
- Keep the completeness report byte-identical with and without the option, in both text and `--json` output.
- List the option in the `--help` usage text so a caller can discover it.

### Out of Scope
- Changing the percentage formula, the placeholder patterns or the quality checks - the request is an exit-status gate, not a scoring change.
- Applying the threshold to `--file` mode - that mode reports a per-file `Completion:` line and never produces an `Overall Completion`, so there is nothing for the option to compare.
- A short alias such as `-m` - no alias was requested and the long form is unambiguous.
- Making `--min-percent` implied by default or defaulting it to a value - a run without the option must behave exactly as it does today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh | Modify | Parse `--min-percent <N>`, validate the value, document it in `--help`, and set the exit status from Overall Completion after the report is printed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A run whose Overall Completion is at or above N exits 0. | `calculate-completeness.sh --min-percent 90 <folder at 100%>` prints its normal report and exits 0. |
| REQ-002 | A run whose Overall Completion is below N exits 3. | `calculate-completeness.sh --min-percent 90 <folder at 10%>` prints its normal report and exits 3. |
| REQ-003 | The report is unchanged by the option, in text and in JSON. | `calculate-completeness.sh <folder>` and `calculate-completeness.sh --min-percent 50 <folder>` produce byte-identical stdout; the same holds with `--json`, `--verbose` and `--quality` added to both. |
| REQ-004 | A missing, non-numeric, negative or over-100 value is rejected before any report. | `--min-percent` with no value, `abc`, `-1` or `101` writes a message naming the bad value to stderr, prints no report, and exits 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A run without the option behaves exactly as it does today. | `calculate-completeness.sh <folder at 10%>` exits 0 and its stdout matches the same run before the change. |
| REQ-006 | `--help` documents the option. | `calculate-completeness.sh --help` exits 0 and its output contains the line `--min-percent <N>`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--min-percent 90` exits 3 on a folder whose report says `Overall Completion: 10%`, and exits 0 on a folder whose report says `Overall Completion: 100%`.
- **SC-002**: `diff` between the stdout of a run with `--min-percent 50` and the same run without it is empty, so no existing consumer of the report output changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script for its percentage arithmetic | The script already exits 1 when `bc` is missing; no new dependency is introduced | Reuse the existing `command -v bc` guard and change nothing about it |
| Dependency | `bash` 3.2 arithmetic on the parsed value | A non-integer reaching `(( ))` aborts the run under `set -euo pipefail` with an opaque message | Validate N against an integer pattern and a 0-100 range before any comparison, and exit 1 with a message naming the value (REQ-004) |
| Risk | The threshold comparison leaves a non-zero status under `set -e` and kills the script before the report prints | The caller sees exit 1 and no output, which is worse than today | Set the status only after output, from a full `if` block whose false branch is empty, mirroring the clamp already used at `calculate_spec_completeness` |
| Risk | A caller treats every non-zero status as a script failure | Exit 3 gets reported as a crash rather than a gate result | Document exit 3 in the `--help` text and in the exit-code comment at the foot of the script |
| Risk | A future edit gates on the per-file percentage instead of the overall one | `--min-percent` disagrees with the `Overall Completion` line the caller reads | Read the single `OVERALL_PERCENTAGE` global, and assert it in the verification task for `--verbose` and `--json` runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `--min-percent` apply in `--file` mode? Decision: no. That mode prints `Completion:`, never `Overall Completion`, so the option is accepted and the run exits 0.
- Does the option change what the script prints? Decision: no. The report is unchanged; only the `--help` usage text gains one line for the new option.
- Is a short alias wanted? Decision: no. Only `--min-percent` is added, and an unknown `-m` keeps its current "Unexpected argument" path.
<!-- /ANCHOR:questions -->

---
