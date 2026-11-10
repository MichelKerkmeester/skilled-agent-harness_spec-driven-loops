---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Change one Bash script: parse and validate a --min-percent threshold, evaluate it after the report is written, and return exit code 3 below it while leaving the report byte-identical."
trigger_phrases:
  - "completeness min percent plan"
  - "min-percent threshold gate"
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
| **Language/Stack** | Bash 3.2-compatible shell script |
| **Framework** | None - standalone CLI under `runtime/cli/spec/` |
| **Storage** | None - reads spec folder files and writes a temporary stats directory |
| **Testing** | `bash -n`, `shellcheck` when installed, and command-level exit-code and `diff` checks |

### Overview
Change one script in three places: the argument loop gains `--min-percent` with range validation, the threshold is evaluated after the report writer returns, and the help plus exit-code comment block document it. The report writers stay untouched, so the proof is a `diff` of the report with and without the flag plus an exit-code matrix around the boundary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other - single-file Bash CLI with a straight-line flow.

### Key Components
- **Argument parser** (`case "$1"` loop, section 8): gains the `--min-percent` branch, its missing-value guard and the 0-100 range check.
- **Report writers** (`output_text`, `output_json`): unchanged; the gate runs after they finish, which is what keeps the report byte-identical.
- **Threshold gate** (new, between the report writer call and the final `exit 0`): compares the active mode's percentage with `MIN_PERCENT` and returns 3 or 0.

### Data Flow
`argv` → parser (sets `MIN_PERCENT`, `SPEC_FOLDER`, `SINGLE_FILE`) → `calculate_file_completeness` or `calculate_spec_completeness` → report writer → threshold gate → exit.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification uses two inputs. The packet folder itself reports 100 percent once its docs are filled, which proves the top of the range. A fixture in `scratch/fixture/spec.md` with two placeholder tokens across four content lines reports exactly 50 percent, which gives a deterministic mid-range boundary without depending on any real packet's state.

Commands, in order:
- `bash -n` on the script, and `shellcheck` when it is installed.
- Boundary matrix on the fixture: `--min-percent 51` exits 3, `50` exits 0, `49` exits 0.
- Top of range on the packet: `--min-percent 100` exits 0.
- Parity: `diff` of the text report and of the `--json` report, each with and without `--min-percent 0`.
- Invalid input: missing value, `abc`, `-1`, `101` each exit 1 with `ERROR:` on stderr and no report.
- `--file` mode: the threshold follows the printed `Completion` value.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Bash 3.2 or later, `bc`, `grep`, `find` and `sed` - all already required by the script. No new package and no new runtime.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the report changes without the flag, or a caller that omits the option sees a new exit code. Action: revert the single script file. There is no state, schema or data migration to unwind.
<!-- /ANCHOR:rollback -->

---
