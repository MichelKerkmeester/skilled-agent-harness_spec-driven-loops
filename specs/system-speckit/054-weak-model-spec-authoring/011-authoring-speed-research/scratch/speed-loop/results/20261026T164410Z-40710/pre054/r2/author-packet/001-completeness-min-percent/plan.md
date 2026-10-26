---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one flag to the existing argument loop, validate it, and compare it against the percentage the script already computes. No new file, function family or dependency; the report path stays byte-identical."
trigger_phrases:
  - "completeness min percent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, written for Bash 3.2 compatibility (`set -euo pipefail`) |
| **Framework** | None; a single CLI script under `runtime/cli/spec/` |
| **Storage** | None; temporary stats files under `$TMPDIR/speckit-completeness-$$` |
| **Testing** | Manual CLI checks: captured stdout diffs and exit-status assertions |

### Overview

The script already computes the percentage the report prints, so the option only has to read it. Add `MIN_PERCENT` to the globals, one `case` arm to the argument loop, a validation helper, and a comparison after the report is written. The comparison sits after `output_text`/`output_json` so the exit status cannot change the output, and the only new exit code appears when the caller passed the flag.
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
- [ ] Output diff empty for every existing invocation
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file procedural CLI. Existing sections keep their roles: configuration, helpers, counting, output, main.

### Key Components

- **Argument loop** (`calculate-completeness.sh:544-562`): the `while`/`case` that already maps `--file`, `--verbose`, `--json` and `--quality` to globals. `--min-percent` joins it as one arm reading `$2`, with the same `shift 2` shape as `--file`.
- **`validate_min_percent`** (new helper, next to `show_help`): rejects an empty value, a non-digit string, and a value above `100`. Prints to stderr and exits `1`, matching the script's existing user-error convention.
- **Percentage source**: `OVERALL_PERCENTAGE` after `calculate_spec_completeness` for folder runs; the `percentage` field in the stats file after `calculate_file_completeness` for `--file` runs. Both are already computed and both are what the report prints.
- **Exit decision** (end of main, after the output call): when `MIN_PERCENT` is set and the reported percentage is below it, exit `3`; otherwise fall through to the existing `exit 0`.

### Data Flow

`argv` → argument loop sets `MIN_PERCENT` → validation runs before any calculation → `calculate_spec_completeness` or `calculate_file_completeness` produces the percentage → `output_text` or `output_json` prints the unchanged report → main compares the reported percentage against `MIN_PERCENT` and chooses the exit status.

### Placement constraint

The exit decision must follow the output call, not precede it. Exiting early would drop the report, and REQ-003 requires the report to be identical with and without the option.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no shell test harness for this script, so verification is command evidence recorded in `tasks.md`:

- **Baseline capture first**: run the script on a folder with a known percentage and on `--file`, `--verbose`, `--json` and `--quality` variants, saving stdout, stderr and exit status before the change.
- **Output equality**: rerun each variant with `--min-percent` added and `diff` the captures. An empty diff is the pass condition; the exit status is read separately because it is expected to differ on the below-threshold run.
- **Boundary table**: `N` equal to the reported percentage, `N` one above it, `N=0`, `N=100` on an incomplete folder, and `N=100` on a folder that reports `100`.
- **Malformed input table**: no value, `abc`, `-1`, `101`, and a value that looks like a flag (`--min-percent --json`), each expected to exit `1` with an empty stdout.
- **Syntax**: `bash -n calculate-completeness.sh` after the edit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond what the script already requires: `bc` for percentage arithmetic (checked at `calculate-completeness.sh:570`) and the Bash 3.2 feature set. No new file, command or package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single modified file with `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. Because the option is additive and off by default, a revert restores the previous behaviour with no caller migration: nothing else in the repository passes `--min-percent` after this packet.
<!-- /ANCHOR:rollback -->

---
