---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Parse and validate a --min-percent value in calculate-completeness.sh, then set the exit status from the Overall Completion it already computes, after the report is printed. The report text stays byte-identical; only the status changes."
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
| **Language/Stack** | Bash 3.2-compatible shell script (macOS system bash and Linux bash) |
| **Framework** | None - a standalone CLI in the SpecKit runtime, driven by its `case` argument loop |
| **Storage** | None - reads spec docs from disk and keeps per-file stats in a temp directory |
| **Testing** | Manual invocations compared with `diff` and checked for exit status; `validate.sh --strict` for the packet |

### Overview
Change one script: `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. Add a `--min-percent <N>` branch to the existing argument loop, validate the value, document the option in `show_help`, and replace the unconditional `exit 0` at the foot of the script with a status chosen from `OVERALL_PERCENTAGE`. Prove it by running the same folder at 10% and at 100% with the option and reading the two exit statuses, then diffing the stdout of a run with the option against the same run without it.
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
- [ ] `calculate-completeness.sh --min-percent 90 <folder at 10%>` exits 3 and `--min-percent 90 <folder at 100%>` exits 0
- [ ] `diff <(calculate-completeness.sh <folder>) <(calculate-completeness.sh --min-percent 50 <folder>)` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script, one option branch

### Key Components
- **Argument loop** (`while [[ $# -gt 0 ]]` case block): gains a `--min-percent) MIN_PERCENT="$2"; shift 2 ;;` arm beside the existing `--file` arm, so the value is consumed the same way.
- **`MIN_PERCENT` global**: empty by default, which is how every later check tells "option absent" from "threshold of zero".
- **Value validation**: runs once after the loop, before the folder is read, so a bad value fails fast and never prints a report.
- **`output_text` / `output_json`**: untouched. Both keep printing exactly what they print today.
- **Exit-status tail**: replaces the bare `exit 0` with a branch on `OVERALL_PERCENTAGE` when `MIN_PERCENT` is set.

### Data Flow
The argument loop stores `MIN_PERCENT`, the existing `calculate_spec_completeness` fills `OVERALL_PERCENTAGE` exactly as it does now, the chosen output function prints the report, and only then does the tail compare the two numbers and pick 0 or 3. Because the comparison runs last, no exit status can suppress output.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three invocations carry the whole feature. Against a folder whose report reads `Overall Completion: 10%`, `--min-percent 90` must exit 3 and print the unchanged report; against a folder at `100%`, `--min-percent 90` must exit 0. A third pair, one run with `--min-percent 50` and one without, must produce byte-identical stdout under `diff`, repeated with `--json` and with `--verbose` so the option is proven independent of the output mode.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` and `bc`, both already required by the script - `bc` is guarded by an existing `command -v` check that stays as it is. No new package, no new tool, no change to any other file.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: any caller that relied on the old unconditional `exit 0` starts failing, or the report output differs by even one byte. Revert the single commit that touches `calculate-completeness.sh`; the option disappears with it and every caller returns to the current behaviour, because the change adds no state outside the script.
<!-- /ANCHOR:rollback -->

---
