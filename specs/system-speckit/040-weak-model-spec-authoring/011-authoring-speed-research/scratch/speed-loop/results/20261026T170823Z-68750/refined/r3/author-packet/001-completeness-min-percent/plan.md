---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one flag to an existing bash script: parse --min-percent <N>, validate it as a non-negative integer, and turn the already-computed Overall Completion into an exit status after the report prints. The report itself stays byte-identical."
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
| **Language/Stack** | Bash 3.2+ compatible shell script |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Direct invocation against a fixture folder, checking output and exit status |

### Overview
Add a `MIN_PERCENT` global and one `--min-percent` case to the existing argument loop, then compare `OVERALL_PERCENTAGE` against it after `output_text`/`output_json` returns and before the final `exit 0`. Because the comparison runs last, the report prints exactly as it does today and only the process exit status changes.
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
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 90 /tmp/minpct-demo` prints `Overall Completion: 77%` and exits 3; the same run with `--min-percent 70` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script branch

### Key Components
- **`calculate-completeness.sh` argument loop**: gains a `--min-percent` case that stores the raw value and validates it before any analysis runs.
- **`calculate_spec_completeness`**: unchanged; it already sets `OVERALL_PERCENTAGE`, which is the number the gate reads.
- **Main tail after `output_text`/`output_json`**: the one new decision point, comparing `OVERALL_PERCENTAGE` with `MIN_PERCENT` and choosing exit 3 or exit 0.

### Data Flow
The argument loop sets `MIN_PERCENT` and rejects a bad value with exit 1. Analysis sets `OVERALL_PERCENTAGE` exactly as it does now. The output function prints the report. Control then reaches the tail, which exits 3 when `MIN_PERCENT` is set and `OVERALL_PERCENTAGE` is below it, and exits 0 in every other case.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup builds the 77% fixture and confirms today's exit 0. Implementation adds the flag, its validation, the tail gate and the help text. Verification proves the two exit statuses, the unchanged report and the rejected combinations.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the script twice against the 77% fixture: `--min-percent 90` must exit 3 and `--min-percent 70` must exit 0, both printing `Overall Completion: 77%`. Then diff the plain run against the gated run for both the text and `--json` reports; both diffs must print nothing. Finally check the rejected inputs, where `--min-percent` with no value, with `abc`, and with `--file` must each exit 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` 3.2 or later and `bc`, both already required by the script. No new package, no new file and no change to any other script.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a gated run exits 3 or 0 on the wrong side of its threshold, or the report differs from the plain run. Revert the single scoped commit to `calculate-completeness.sh`; the option disappears and every caller keeps today's always-exit-0 behavior.
<!-- /ANCHOR:rollback -->

---
