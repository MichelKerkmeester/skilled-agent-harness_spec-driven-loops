---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh prints an Overall Completion figure but always exits 0, so a caller that wants to gate on completeness has to parse stdout. Add a --min-percent <N> option that turns the figure it already computes into an exit status of 3."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
  - "calculate-completeness exit code"
  - "gate on spec completeness"
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
| **Branch** | `zz-bench-authoring/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` reports how complete a spec folder is, then exits 0 no matter what that number says. A caller that wants to refuse an under-filled packet, in a hook, a CI step or a shell `if`, has to capture stdout and grep for `Overall Completion` before it can decide anything. That parsing is brittle: the line is human-formatted, and the same script already has a machine-readable `--json` mode that would be the only safe thing to parse instead.

### Purpose
One option, `--min-percent <N>`, makes the script usable as a gate: it exits 3 when the completion it just printed is below N, and 0 otherwise, with the output left exactly as it is today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent
───────────────────────────────────────────────────────────────────
         SpecKit Completeness Calculator - Results
───────────────────────────────────────────────────────────────────

Spec Folder: specs/zz-bench-authoring/001-completeness-min-percent
Files Analyzed: 3

───────────────────────────────────────────────────────────────────
Overall Completion: 100%
───────────────────────────────────────────────────────────────────
Total Placeholders: 0
Total Content Lines: 164

───────────────────────────────────────────────────────────────────
Status: ✅ Excellent - Nearly complete
───────────────────────────────────────────────────────────────────

$ echo $?
0

$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 80 specs/zz-bench-authoring/001-completeness-min-percent
ERROR: Unexpected argument: 80
Use --help for usage information
$ echo $?
1
```

The second run is the current failure mode: `--min-percent` is not a known option, so the parser takes it as the spec-folder argument and then rejects the `80` that follows. Nothing in the script reads a threshold today, and every successful run ends at `exit 0` on line 587.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--min-percent <N>` to the option loop in `calculate-completeness.sh`, storing N for the final comparison
- Compare the completion the script already computes against N after the output functions have run, and exit 3 when it falls short
- Reject a missing, non-numeric or out-of-range value with exit 1 and a message on stderr, before any analysis starts
- Document the option and exit code 3 in `show_help` and in the header comment's option list

### Out of Scope
- Any change to the placeholder patterns, quality checks or percentage arithmetic - the option only reads the number those already produce
- Changing the meaning of the existing exit codes 0 and 1 - callers depend on both today
- Wiring the option into `validate.sh` or any other caller - that is a separate decision for a separate packet
- Adding a `--max-percent` counterpart - no caller has asked for an upper bound

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Parse and validate `--min-percent <N>`, apply the exit status after output, document it in `show_help` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | With `--min-percent <N>`, the script exits 3 when the completion it printed is below N, and exits 0 when it is at or above N | On a fixture measuring below 90, `--min-percent 90` prints its normal report and `echo $?` prints 3; on this packet at 100, `--min-percent 90` prints the same report and `echo $?` prints 0 |
| REQ-002 | The option changes no output: text and `--json` stdout are byte-identical with and without it | `diff` between the baseline capture and the same run with `--min-percent 50` prints nothing, in both output modes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A missing, non-numeric or out-of-range value exits 1 with a usage message on stderr and no results report | `--min-percent` with no value, `--min-percent abc` and `--min-percent 101` each print an `ERROR:` line to stderr and `echo $?` prints 1 |
| REQ-004 | `show_help` lists `--min-percent <N>` and states what exit 3 means | `bash calculate-completeness.sh --help` prints a line containing `--min-percent` and a line naming exit code 3 |
| REQ-005 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean `min_percent_met` field: `true` when Overall Completion is at or above N, `false` when it is below | `bash calculate-completeness.sh --json --min-percent 90 <folder>` prints `"min_percent_met": true` on this packet at 100 and `"min_percent_met": false` on a fixture measuring below 90, with every other JSON field unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller can gate on completeness without parsing stdout: the exit status alone answers "is this packet at least N percent complete"
- **SC-002**: Every existing invocation behaves exactly as before, including its exit status, when the option is absent
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required for the percentage arithmetic | None new - the script already exits 1 with a clear message when `bc` is missing | No change; the threshold reads a number `bc` has already produced |
| Risk | `set -euo pipefail` turns a failed comparison into a silent early exit before any report is printed | Med | Run the comparison after the output functions and write it as a full `if`, the same shape the clamping block at line 297 already uses |
| Risk | A caller treats exit 3 as a script error rather than a threshold signal | Low | Document 3 in both `show_help` and the header comment, and keep it distinct from the existing 1 |
| Risk | `--file` mode prints `Completion:` rather than `Overall Completion:`, so the threshold has no matching label there | Low | Compare against the percentage that mode prints; recorded as a decision in the open questions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `--min-percent` apply in `--file` mode, which prints no `Overall Completion` line? Decision: yes - it compares against that file's `Completion` percentage, the only figure the mode reports.
- What does a bare `--min-percent` with no value do? Decision: exit 1 with a usage error, matching the script's existing error path rather than silently disabling the threshold.
- Is N restricted to 0-100? Decision: yes - a value outside that range exits 1, since a threshold above 100 can never pass and is a caller bug worth surfacing.
<!-- /ANCHOR:questions -->

---
