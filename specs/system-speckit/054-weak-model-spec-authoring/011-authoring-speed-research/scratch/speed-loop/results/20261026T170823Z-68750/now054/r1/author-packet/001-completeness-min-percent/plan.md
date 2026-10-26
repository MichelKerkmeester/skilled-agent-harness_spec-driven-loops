---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one option arm, one validation guard and one exit-status branch to calculate-completeness.sh, then prove the report bytes and the 0/1/3 exit codes on a throwaway fixture packet."
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
| **Language/Stack** | Bash 3.2-compatible shell script |
| **Framework** | None |
| **Storage** | None; the script writes per-file stats to a temp directory it removes on exit |
| **Testing** | Direct invocations against a `mktemp -d` fixture folder, plus `validate.sh --strict` |

### Overview
The change is confined to `calculate-completeness.sh`. The section 8 option loop gains a `--min-percent <N>` arm that sets a new global, a guard rejects a value outside 0-100 before any counting starts, and a branch after the output call exits 3 when the percentage the report presented is below N. Proof compares stdout byte for byte across the plain and flagged runs, then reads the exit status at the threshold, one point above it and for each invalid input.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a single script with one option gate at its exit.

### Key Components
- **`calculate-completeness.sh` section 8 option loop**: the `case` that already reads `--file`, `--verbose`, `--json` and `--quality`; it gains the `--min-percent` arm and the guard that follows the loop.
- **`show_help` and the file header**: the usage block and the exit-code footer, which become the discoverable contract for the flag.
- **The final exit branch**: the one place exit 3 is raised, after the report has already been written.

### Data Flow
`argv` enters the option loop, which sets `MIN_PERCENT` and leaves `SPEC_FOLDER` and `SINGLE_FILE` as they are. The guard rejects a bad value before the `bc` check and the calculation, so no report is printed on that path. The calculation fills `OVERALL_PERCENTAGE` for a folder, or the single-file stats file for `--file`. The output function prints the report unchanged. The gate then compares that same presented percentage to `MIN_PERCENT` and exits 3 or 0.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Create a fixture packet under `mktemp -d` holding a `spec.md`, `plan.md` and `tasks.md` with enough placeholder lines to land the reported percentage well below the threshold, and delete it when the runs finish. Record the plain run's stdout and exit 0 as the baseline. Then run the flagged form against the same folder, diff the two stdout captures, and read the exit statuses: 3 below the threshold, 0 at exactly the printed percentage, 3 one point above it, and 1 for `abc`, `-1`, `101` and a bare `--min-percent`. Repeat once with `--file` and once with `--json` to confirm the gate follows the presented percentage and the JSON body is unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` and `bc`. The script already checks for `bc` and exits 1 without it, and the flag introduces no new package or tool.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the run without the flag changes its output or its exit status. Revert the single commit that touches the script. The option is additive, so nothing else depends on it yet.
<!-- /ANCHOR:rollback -->

---
