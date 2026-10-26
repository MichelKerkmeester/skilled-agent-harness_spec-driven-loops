---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports an Overall Completion percentage but always exits 0, so a caller cannot fail a build on an incomplete spec folder. This adds a --min-percent <N> gate that exits 3 when the reported percentage is below N and 0 otherwise, leaving the printed report untouched."
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
`calculate-completeness.sh` prints an Overall Completion percentage and then exits 0 on every run, including a run whose folder is nearly empty. A caller that wants to fail a build on an incomplete spec folder has to parse the printed report or the JSON field itself, and each caller that does so re-implements the comparison.

### Purpose
Add a `--min-percent <N>` option so one invocation both reports and gates: exit 3 when the reported Overall Completion is below N, exit 0 otherwise, with the report unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ mkdir -p /tmp/minpct-demo && printf '%s\n' '# Demo spec' '' '## 1. METADATA' 'Level 1' '' '## 2. PROBLEM' '[PLACEHOLDER]' '## 3. SCOPE' '[PLACEHOLDER]' '' '## 4. REQUIREMENTS' '[PLACEHOLDER]' '## 5. SUCCESS CRITERIA' 'None' '## 6. RISKS' 'None' > /tmp/minpct-demo/spec.md
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh /tmp/minpct-demo; echo "EXIT=$?"
Spec Folder: /tmp/minpct-demo
Files Analyzed: 1
Overall Completion: 77%
Total Placeholders: 3
Total Content Lines: 13
Status: ✅ Good - Well underway
EXIT=0
```

The fixture reports `Overall Completion: 77%` and still exits `0`, so section 2's claim that no run gates on the percentage is measured rather than recalled. `77` is the number every requirement below uses as its below-threshold case.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--min-percent <N>` option to the argument parser in `calculate-completeness.sh`.
- Exit 3 after printing the report when Overall Completion is below N, and exit 0 when it is at or above N.
- Reject a missing, empty or non-integer N with exit 1 and an error on stderr.
- Document the option in `show_help`.

### Out of Scope
- Changing the completion formula or the placeholder patterns - the percentage stays the number the script already reports.
- Changing the text or JSON report - the option adds an exit status only.
- Gating `--file` single-file mode - a single file has no Overall Completion to compare, so the combination is rejected rather than guessed.
- Adding a default threshold or reading one from configuration - the option is opt-in per invocation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh | Modify | Parse `--min-percent <N>`, validate it, document it in `show_help`, and exit 3 below the threshold |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | With `--min-percent <N>`, a spec-folder run whose Overall Completion is below N exits 3 | `calculate-completeness.sh --min-percent 90 /tmp/minpct-demo` exits 3 on the 77% fixture |
| REQ-002 | With `--min-percent <N>`, a spec-folder run whose Overall Completion is at or above N exits 0 | `calculate-completeness.sh --min-percent 70 /tmp/minpct-demo` exits 0, and `--min-percent 77` also exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The printed report is byte-identical with and without `--min-percent` | `diff` of the two runs prints nothing for both the text and the `--json` report |
| REQ-004 | `--help` documents the option and its exit status | `calculate-completeness.sh --help \| rg -c -- '--min-percent'` prints 2 |
| REQ-005 | A missing, empty or non-integer N exits 1 with an error on stderr | `calculate-completeness.sh --min-percent /tmp/minpct-demo` exits 1, and `--min-percent abc /tmp/minpct-demo` exits 1 |
| REQ-006 | `--min-percent` combined with `--file` exits 1, because no Overall Completion exists to compare | `calculate-completeness.sh --min-percent 90 --file specs/x/spec.md` exits 1 with an error naming the conflict |
| REQ-007 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean field `min_percent_met`, true when Overall Completion is at or above N and false otherwise | `calculate-completeness.sh --json --min-percent 90 /tmp/minpct-demo \| rg -c '"min_percent_met": false'` prints 1, and the same run with `--min-percent 70` prints 1 for `"min_percent_met": true` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `calculate-completeness.sh --min-percent 90 /tmp/minpct-demo` prints `Overall Completion: 77%` and exits 3.
- **SC-002**: `calculate-completeness.sh --min-percent 70 /tmp/minpct-demo` prints the same report and exits 0.
- **SC-003**: `diff <(calculate-completeness.sh /tmp/minpct-demo) <(calculate-completeness.sh --min-percent 90 /tmp/minpct-demo)` prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required for the percentage math | No percentage, so no comparison | The existing `command -v bc` guard runs before the gate and exits 1 |
| Risk | Exit 3 is the spec-script taxonomy's system-error code, so a caller may read a below-threshold result as a crash | A caller retries or aborts on what is a normal gate result | Document exit 3 in `show_help` and in the script's trailing exit-code comment, and name it in REQ-004 |
| Risk | `set -euo pipefail` turns an arithmetic comparison of a non-integer N into a bare bash abort instead of the intended error | Unclear exit status and no message | Validate N against `^[0-9]+$` before any comparison, and test both `abc` and a missing value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does a threshold of exactly N count as passing? Decision: yes, `--min-percent 77` exits 0 on a 77% folder, because the requirement reads "below N".
- Should the gate apply to `--file` mode? Decision: no. A single file reports a per-file `Completion` rather than an Overall Completion, so the combination exits 1 instead of silently comparing a different number.
- Should N above 100 be rejected? Decision: no. It always exits 3, which is the honest answer for a threshold no folder can reach, and rejecting it would add a rule the feature did not ask for.
<!-- /ANCHOR:questions -->

---
