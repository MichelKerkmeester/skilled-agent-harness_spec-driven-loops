---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Change one bash script: add a threshold variable, parse and validate --min-percent, then choose exit 3 or exit 0 from the percentage the report already prints. The report functions are not touched, and parity is proven with a baseline diff."
trigger_phrases:
  - "completeness min percent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ (the macOS default) with `bc` |
| **Framework** | None; one standalone shell script |
| **Storage** | None; the script reads spec markdown and writes only a temp directory |
| **Testing** | Direct invocation, exit-status capture and `diff` against a saved baseline |

### Overview
The change lands entirely inside `calculate-completeness.sh`. A new `MIN_PERCENT` global is populated by an option branch in the existing parser, validated before analysis, and compared against the completion value the report functions already compute, after they print. Proof is a baseline capture plus `diff`, so the "output unchanged" requirement is tested rather than asserted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope are documented in `spec.md` sections 2 and 3.
- [x] Success criteria are measurable: each `SC-` line names an invocation and the exit status it must return.
- [x] Dependencies are identified in section 6 below: `bash`, `bc` and `find`.

### Definition of Done
- [ ] All five `REQ-` rows in `spec.md` are met.
- [ ] `diff` between a baseline run and a `--min-percent` run prints nothing, for both text and `--json`.
- [ ] `--help` lists `--min-percent <N>` and the exit-code comment block documents exit `3`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script branch.

### Key Components
- **Argument parser** (`calculate-completeness.sh` section 8): the existing `while [[ $# -gt 0 ]]` loop gains one `--min-percent` case that reads `$2` into `MIN_PERCENT` and shifts two arguments.
- **Threshold validator**: rejects a non-whole-number value with an `ERROR` line on stderr and exit `1`, before any file is read.
- **Exit-status gate**: runs after the `output_text` or `output_json` call and selects `3` or `0` from the completion value the report used.
- **Report functions** (`output_text`, `output_json`): unchanged; they remain the only code that writes the report.

### Data Flow
`--min-percent N` lands in `MIN_PERCENT` during parsing, is validated before the preflight checks, and is read once at the end of the script. The gate compares `OVERALL_PERCENTAGE` in folder mode and the single-file `percentage` in `--file` mode, after the report has been printed, so stdout is complete before the process exits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Step 1: Add the option and the threshold variable

Acceptance: `--min-percent 80 <folder>` is accepted, and the folder argument is not consumed as the option value.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 80 specs/zz-bench-authoring/001-completeness-min-percent` prints the normal report and never prints `Unexpected argument`.

### Step 2: Reject a non-numeric threshold

Acceptance: a value that is not a whole number exits `1` with an `ERROR` line on stderr, before any analysis runs.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent abc specs/zz-bench-authoring/001-completeness-min-percent` prints a line starting with `ERROR:` and exits `1`.

### Step 3: Gate the exit status on the reported completion

Acceptance: the run exits `3` below `N` and `0` at or above `N`, and the report body is unchanged. The comparison is written as a full `if` so a false test does not leave the script with a non-zero status that `set -e` turns into a silent early exit.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 101 specs/zz-bench-authoring/001-completeness-min-percent` exits `3`, and the same command with `--min-percent 0` exits `0`.

### Step 4: Document the option and prove output parity

Acceptance: `--help` lists `--min-percent <N>`, the exit-code comment block documents `3`, and text and `--json` output are byte-identical with and without the option.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --help` prints one line containing `--min-percent`, and `diff` between a baseline run and a `--min-percent 0` run prints nothing in both modes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Capture the current report before touching the script, then compare it after. The parity check is `diff <(bash "$S" "$P") <(bash "$S" --min-percent 0 "$P")` and the same pair with `--json` added; both must print nothing. The exit-status cases use deterministic thresholds rather than a fixture folder: `--min-percent 101` is above every percentage the script can report, so it must exit `3`, and `--min-percent 0` must exit `0`. No test framework is added, because the script has none today.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `bash` 3.2 or newer, for the existing `[[ ]]` tests and process substitution in the parity check.
- `bc`, already required by the script's preflight; the gate reuses the existing percentage and adds no arithmetic dependency.
- `find`, already used by `calculate_spec_completeness` for the folder scan.
- No new package, and no change to any other script.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the report body, the JSON schema or the default exit status changes for a run that omits `--min-percent`. Rollback is restoring `calculate-completeness.sh` from the revision before the change; the change is one file with no schema, data or configuration migration, so no other step is needed.
<!-- /ANCHOR:rollback -->

---
