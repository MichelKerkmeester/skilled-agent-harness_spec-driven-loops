---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh prints a completion percentage but always exits 0, so a caller that wants to fail below a threshold has to parse stdout. Adding --min-percent <N> gives callers a machine-readable floor via exit code 3 while leaving the report byte-identical."
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
| **Branch** | `scaffold/001-completeness-min-percent` (not created; the packet was scaffolded with `--skip-branch`, so the working tree is on a detached `HEAD`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` computes and prints a completion percentage, then ends with an unconditional `exit 0`. A caller that wants to fail when a spec folder is less complete than a required floor must scrape the `Overall Completion:` line out of stdout and compare it itself. Any change to the report formatting breaks every such caller, and a shell pipeline cannot gate on the result with a plain `if`.

### Purpose
Let a caller state its completion floor as one flag and read the answer from the exit status, with the existing report left exactly as it is.
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

$ echo "EXIT=$?"
EXIT=0

$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 50 specs/zz-bench-authoring/001-completeness-min-percent
ERROR: Unexpected argument: 50
Use --help for usage information
$ echo "EXIT=$?"
EXIT=1
```

The second run shows the option does not exist today: `--min-percent` is consumed as the positional `SPEC_FOLDER`, so the value `50` lands in the catch-all branch and the run dies with exit 1.

A folder that is genuinely partial reports a fractional figure. A fixture holding one `spec.md` with 2 placeholders over 6 content lines prints `Overall Completion: 67%` and still exits 0, which is the case the new flag has to fail.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--min-percent <N>` option to the option-parsing loop of `calculate-completeness.sh`.
- Compare the percentage the run computed against `N` and exit `3` when it is below `N`, `0` otherwise.
- Reject a missing, non-integer, negative, or greater-than-100 value for `N` with the script's existing `ERROR:` form on stderr and exit `1`.
- List the new option in `show_help` and add exit code `3` to the script's exit-code footer.

### Out of Scope
- Any change to the printed report or the JSON payload - the feature requires the output to stay unchanged, so the status labels, the `Overall Completion:` line and the JSON keys are all frozen.
- Any change to how the percentage is calculated - placeholder counting, line counting and the `bc` rounding stay as they are.
- An environment variable or config-file form of the threshold - the request names one CLI flag.
- Wiring the new exit code into `validate.sh` or any other caller - no caller is named, and changing one is a separate packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add `--min-percent` parsing, the threshold comparison, one help line and one exit-code footer line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | With `--min-percent <N>`, a folder run whose `Overall Completion` is below `N` exits `3`. | On the 67% fixture, `calculate-completeness.sh --min-percent 80 <fixture>` exits `3`. |
| REQ-002 | With `--min-percent <N>`, a folder run whose `Overall Completion` is at or above `N` exits `0`. | On the 67% fixture, both `--min-percent 67` and `--min-percent 50` exit `0`. |
| REQ-003 | The report is unchanged by the option. | `diff <(run <folder>) <(run --min-percent 50 <folder>)` prints nothing, and the JSON payload from `--json` is identical with and without the option. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | An unusable `N` is rejected before any report is printed, with an `ERROR:` line on stderr and exit `1`. `N` must be an integer from 0 to 100. | `--min-percent` with no value, `--min-percent abc`, `--min-percent -1` and `--min-percent 101` each print an `ERROR:` line on stderr and exit `1`. |
| REQ-005 | `show_help` lists the new option. | `calculate-completeness.sh --help` prints a line containing `--min-percent <N>`. |
| REQ-006 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean field `min_percent_met`, `true` when `Overall Completion` is at or above `N` and `false` otherwise. | On the 67% fixture, `calculate-completeness.sh --json --min-percent 50 <fixture>` prints `"min_percent_met": true` and `calculate-completeness.sh --json --min-percent 80 <fixture>` prints `"min_percent_met": false`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the 67% fixture, `--min-percent 80` exits `3` and prints the unchanged report on stdout.
- **SC-002**: On the same fixture, `--min-percent 50` exits `0`.
- **SC-003**: stdout of a plain run and of a `--min-percent 50` run against the same folder are byte-identical, in both text and `--json` modes.
- **SC-004**: `--min-percent` with no value exits `1` and writes nothing to stdout.
- **SC-005**: A plain run with no `--min-percent` still exits `0` at any percentage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script and checked at startup | None - no new dependency is introduced | Nothing to do; the check at startup already fails fast when `bc` is missing |
| Dependency | Bash 3.2, which the script is written against | A newer-only construct would break the macOS default shell | Use only `[[ ]]` integer tests and plain arithmetic, as the rest of the script does |
| Risk | `set -euo pipefail` aborts the script when a bare `[[ ... ]]` comparison is the last command of a function and evaluates false | The report would never print and the caller would see exit 1 instead of 3 or 0 | Compute the exit status in the main body after output is written, in an explicit `if`/`else` that always ends on a zero-status statement |
| Risk | Exit `3` already means "system error" elsewhere in `spec/*.sh`, so a caller cannot tell a threshold miss from a broken run by the number alone | A wrapper could misreport a below-threshold result as a tooling failure | The feature fixes `3` as the below-threshold code, so document it in the footer and in `--help`; the report on stdout still names the percentage |
| Risk | `--min-percent` is consumed as the positional `SPEC_FOLDER` if it is added anywhere but the option loop | The flag silently becomes a path and the run reports "Spec folder not found" | Add the case to the loop before the `*)` catch-all and cover it with the T001 before/after check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the option apply in `--file` single-file mode, where the report line is `Completion:` rather than `Overall Completion:`? Decision: yes, compare against the percentage that run reports, so the flag is never silently ignored. REQ-001 and REQ-002 name the folder label because that is the term the request used.
- Does "output unchanged" forbid touching `--help`? Decision: no. It scopes to the results report, and REQ-003 pins that. `--help` gains one option line under REQ-005.
- Should a value equal to the reported percentage pass? Decision: yes. The request says "below N" fails, so `N` itself passes.
<!-- /ANCHOR:questions -->

---
