---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Change one bash script: add the option, validate its value, and turn the percentage it already prints into an exit status."
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
| **Language/Stack** | Bash 3.2-compatible shell, matching the script's current target |
| **Framework** | None - a standalone CLI script |
| **Storage** | None; the script's existing temp stats directory under `$TMPDIR` |
| **Testing** | Direct script runs that assert exit status, plus `diff` between runs |

### Overview
The change touches one script in three places: the option loop, the help and exit-code text, and a threshold check that runs after the report is printed. The check reads the percentage the output functions already computed, so the report itself does not change. Proof is a set of script runs that assert exit status 0 and 3 and an empty `diff` between the runs with and without the flag.
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
- [ ] Verification runs in `tasks.md` show exit 0 and 3 and an empty `diff`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script CLI branch

### Key Components
- **Argument loop**: the `while [[ $# -gt 0 ]]` block that already maps `--verbose`, `--json`, `--quality` and `--file` onto globals; it gains `--min-percent` and its value validation.
- **Output functions**: `output_text` and `output_json` already compute and print the percentage. They are the source of the number to compare and are not modified.
- **Threshold check**: a new block between the output call and the final `exit 0` that compares the printed integer with the requested floor.

### Data Flow
1. The argument loop stores the folder or `--file` path and now also the requested floor in `MIN_PERCENT`.
2. Calculation fills `OVERALL_PERCENTAGE` in folder mode, or the file stats in `--file` mode.
3. `output_text` or `output_json` prints the report, unchanged.
4. The threshold check compares the same integer that was printed. It exits 3 when the value is below the floor and falls through to `exit 0` otherwise.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the current report and reads the option loop. Implementation adds the flag, its validation and the threshold exit. Verification proves both exit statuses and an unchanged report.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every check is a command whose exit status or output is read directly.

| Check | Command | Expected |
|-------|---------|----------|
| Below the floor | `bash $S --min-percent $((P+1)) $F; echo "exit=$?"` | `exit=3` |
| At the floor | `bash $S --min-percent $P $F; echo "exit=$?"` | `exit=0` |
| Report unchanged | `diff <(bash $S $F) <(bash $S --min-percent 0 $F)` | No output |
| Missing value | `bash $S --min-percent` | Exit 1, `ERROR:` on stderr |
| Out-of-range value | `bash $S --min-percent 101 $F` | Exit 1, `ERROR:` on stderr |
| Single-file mode | `bash $S --file $F/spec.md --min-percent 100; echo "exit=$?"` | `exit=0` on a complete file |

`$S` is the script under change and `$F` is a fixture packet; both are defined in `tasks.md`. `P` is the percentage the run prints, read from the report before the comparison.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or later | Runtime | Available | The script cannot run at all |
| `bc` | Runtime | Available | The existing guard already exits 1 with an `ERROR:` line |
| `find` and `grep` | Runtime | Available | File discovery and placeholder counting fail |

No new package is needed. The threshold comparison uses shell arithmetic.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run without `--min-percent` changes its exit status or its report.
- **Procedure**: revert the one commit that touches `calculate-completeness.sh`. There is no data, config or state to unwind.
<!-- /ANCHOR:rollback -->

---
