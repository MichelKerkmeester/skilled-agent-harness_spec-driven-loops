---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one option branch, one shared reported-percentage variable and one post-output exit gate to the completeness calculator, leaving the report byte-identical."
trigger_phrases:
  - "completeness min percent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 (macOS `/bin/bash` 3.2.57), plus `bc` for the percentage arithmetic |
| **Framework** | None - one CLI script, `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` |
| **Storage** | None persistent; per-file stats go to a `${TMPDIR}/speckit-completeness-$$` temp directory that the existing `EXIT` trap removes |
| **Testing** | Shell invocation with `bash`, comparing exit codes and `diff`ing stdout between runs |

### Overview
The change touches one script and adds three things: an option branch in the argument loop, a `REPORTED_PERCENTAGE` global that both output paths assign the number they print, and an exit-code gate after the output call. The gate runs last so the report is written exactly as it is today, then the script chooses between exit 0 and exit 3. It is proved by `diff`ing the report with and without the flag and by checking `echo $?` on a folder above and below the threshold.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 100 specs/zz-bench-authoring/001-completeness-min-percent > /dev/null; echo $?` prints `0`, and the same command against the scratch fixture prints `3`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script branch - one option added to an existing `while`/`case` loop, one shared global, one exit gate, no new file.

### Key Components
- **Argument loop (section 8, MAIN SCRIPT)**: gains `--min-percent|-m`-style handling of the long form only, consuming `$2` into `MIN_PERCENT` and validating it before any calculation runs.
- **`REPORTED_PERCENTAGE` global (section 3, GLOBALS)**: the single number the gate compares, assigned by whichever output function ran.
- **`output_text` (section 7)**: already computes a local `percentage` for both the folder and `--file` branches; it assigns that same value to `REPORTED_PERCENTAGE` without printing anything extra.
- **`output_json` (section 7)**: assigns `OVERALL_PERCENTAGE` in the folder branch and the sourced `percentage` in the `--file` branch, so JSON runs gate on the same number they report.
- **Exit gate (section 8, after the output call)**: `if [[ -n "$MIN_PERCENT" ]] && [[ "$REPORTED_PERCENTAGE" -lt "$MIN_PERCENT" ]]; then exit 3; fi`, replacing the unconditional `exit 0`.

### Data Flow
1. The argument loop sets `MIN_PERCENT` and leaves every other flag on its current path.
2. `calculate_spec_completeness` or `calculate_file_completeness` writes per-file stats into the temp directory.
3. The chosen output function prints the report and copies the percentage it printed into `REPORTED_PERCENTAGE`.
4. The exit gate compares that copy against `MIN_PERCENT` and exits 3 or 0. It writes nothing, so stdout and stderr are what they were before the option existed.

The `--file` not-found path returns from `output_text` before any percentage is computed, so `REPORTED_PERCENTAGE` needs a default of `0`; otherwise a missing file would satisfy any threshold.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state: Setup records the current report and builds a below-threshold fixture, Implementation adds the option and the gate, Verification proves parity and both exit codes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no test framework for this script, so every case is one shell invocation whose exit code and stdout are read directly.

| Case | Command | Expected |
|------|---------|----------|
| Above threshold | `bash calculate-completeness.sh --min-percent 90 specs/zz-bench-authoring/001-completeness-min-percent > /dev/null; echo $?` | `0` |
| Below threshold | `bash calculate-completeness.sh --min-percent 100 <scratch-fixture> > /dev/null; echo $?` | `3` |
| Text parity | `diff <(bash calculate-completeness.sh <folder>) <(bash calculate-completeness.sh --min-percent 90 <folder>)` | no output |
| JSON parity | same `diff` with `--json` on both sides | no output |
| Invalid value | `bash calculate-completeness.sh --min-percent abc <folder>; echo $?` | `ERROR:` on stderr, then `1` |
| Baseline unchanged | `bash calculate-completeness.sh <folder>; echo $?` | the report recorded in Setup, then `0` |

The fixture is one file under the packet's `scratch/` directory that carries an unfilled token from the script's `PLACEHOLDER_PATTERNS` list, which puts its completion below 100 without touching any real packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or later | Runtime | Green | The script does not run at all; no Bash 4 feature may be introduced |
| `bc` | Runtime | Green, already required | The script exits 1 at the existing `command -v bc` guard before the gate is reached |
| `diff` and `rg` | Verification only | Green | The parity check falls back to `cmp` and `grep` |
| None new | Package | Green | No manifest changes; the change adds no dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the report changes in any way, or a run at or above the threshold exits 3.
- **Procedure**: revert the single commit that touches `calculate-completeness.sh`. The script holds no state and writes only to its temp directory, so there is nothing to migrate or clean up, and removing the option restores the unconditional `exit 0`.
<!-- /ANCHOR:rollback -->

---
