---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one validated option and one conditional exit to calculate-completeness.sh. The report functions stay untouched; the tail compares the percentage it already computed with N and exits 3 on a shortfall."
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
| **Framework** | None - system-spec-kit CLI |
| **Storage** | None - reads spec Markdown files |
| **Testing** | Bash exit-status matrix plus `diff` of stdout on a temp fixture |

### Overview
Change one file, `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. The argument loop gains a validated `--min-percent <N>` case and the unconditional `exit 0` at the end becomes a comparison against the percentage the script already computed. The report functions are not edited, so stdout stays byte-identical; a temp folder with a known completion proves both the exit matrix and the unchanged output.
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
- [ ] Exit matrix verified: below N exits 3, at or above N exits 0, no option exits 0
- [ ] Report output diffed clean with and without the option in text and JSON modes
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script option branch.

### Key Components
- **Argument loop (section 8, MAIN SCRIPT)**: parses `--min-percent <N>`, validates it as an integer from 0 to 100, and stores it in a `MIN_PERCENT` global that defaults to empty.
- **Completion calculation (section 6)**: unchanged; produces `OVERALL_PERCENTAGE` in folder mode and the file `percentage` under `--file`.
- **Output functions (section 7)**: unchanged; print the report before any threshold decision runs.
- **Exit decision (section 8, after the output call)**: reads the same percentage the report printed, compares it with `MIN_PERCENT`, and exits 3 or 0.

### Data Flow
argv enters the option loop, which sets `MIN_PERCENT` and leaves the folder or `--file` path in place. `calculate_spec_completeness` or `calculate_file_completeness` fills the percentage, `output_text` or `output_json` prints the report, and the tail compares that percentage with `MIN_PERCENT`. When `MIN_PERCENT` is empty the tail keeps the current `exit 0`; when it is set and the completion is lower, the script exits 3.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Use a temp fixture with a known completion: `tmp=$(mktemp -d); printf '[%s]\n' TBD > "$tmp/spec.md"` writes the TBD placeholder token, giving one placeholder over one content line, so the report prints `Overall Completion: 0%`.

| Check | Command | Expected |
|-------|---------|----------|
| Below threshold | `calculate-completeness.sh --min-percent 90 "$tmp"` | exit 3 |
| At threshold | `calculate-completeness.sh --min-percent 0 "$tmp"` | exit 0 |
| No option | `calculate-completeness.sh "$tmp"` | exit 0 |
| Text output unchanged | `diff <(calculate-completeness.sh "$tmp" \|\| true) <(calculate-completeness.sh --min-percent 90 "$tmp" \|\| true)` | no output |
| JSON output unchanged | same diff with `--json` on both sides | no output |
| Bad value | `calculate-completeness.sh --min-percent 101 "$tmp"` | exit 1, stderr message, empty stdout |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` 3.2 or newer and `bc`, which the script already requires and guards. No new package and no change to the existing `bc` check.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the invocation without `--min-percent` changes its output or its exit status. Revert the one scoped commit to `calculate-completeness.sh`; the option is additive and writes no state, so nothing else needs cleanup.
<!-- /ANCHOR:rollback -->

---
