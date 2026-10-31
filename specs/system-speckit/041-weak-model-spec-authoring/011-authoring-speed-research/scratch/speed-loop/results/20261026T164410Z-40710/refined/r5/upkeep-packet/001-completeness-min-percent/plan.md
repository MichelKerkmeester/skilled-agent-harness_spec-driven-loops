---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "One bash script gains a --min-percent <N> option. It parses and validates the value before analysis, keeps the percentage the script already computes, and turns it into an exit status after the report is printed so no output changes."
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
| **Language/Stack** | Bash 3.2-compatible shell, run under `set -euo pipefail` |
| **Framework** | None - one standalone CLI script |
| **Storage** | None |
| **Testing** | Manual runs with `echo $?` and `diff`; the spec CLI ships no test harness |

### Overview
Change one bash script. Add a `--min-percent <N>` arm to the existing `while`/`case` option loop, validate N before any analysis runs, and compare it against the percentage the script already computes once the output functions have finished. Prove it by checking `echo $?` on a fixture that sits below and above the threshold, and by diffing stdout with and without the option.
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
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 90 specs/zz-bench-authoring/001-completeness-min-percent` prints its report and `echo $?` prints 0
- [ ] The same command against the below-threshold fixture prints its report and `echo $?` prints 3
- [ ] `diff` between baseline stdout and the `--min-percent 50` run prints nothing, for both text and `--json`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script branch: one more arm in an existing argument parser, one comparison at the end.

### Key Components
- **`calculate-completeness.sh` option loop**: consumes `--min-percent <N>` into a new `MIN_PERCENT` global and rejects a bad value before any analysis starts
- **`calculate_spec_completeness` / `calculate_file_completeness`**: unchanged; they already produce the percentage the threshold reads
- **`output_text` / `output_json`**: unchanged; they run first, so the exit status can never suppress a report
- **`show_help`**: gains one option line and one exit-code line

### Data Flow
Arguments are parsed once at the top into `MIN_PERCENT`. The folder or file is analysed, and the result lands in `OVERALL_PERCENTAGE` for folder mode or in the per-file stats file for `--file` mode. The output function prints the report exactly as it does today. Only then does a single comparison set the exit status: 3 when the percentage is below the threshold, 0 otherwise.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two fixtures cover both sides of the boundary. This packet measures 100, so it is the passing case: `--min-percent 90` must exit 0. A scratch fixture seeded with one token from the script's own `PLACEHOLDER_PATTERNS` list measures below 90, so `--min-percent 90` must exit 3.

Output stability is a separate check. Capture stdout from a plain run once, then `diff` it against the same run with `--min-percent 50` added, in text and `--json` modes; an empty diff is the requirement. Usage errors are checked with a bare `--min-percent`, a non-numeric value and `101`, each of which must print an `ERROR:` line to stderr and exit 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` 3.2 or newer and `bc`, both already required by the script today. `diff` is needed for the output-stability check. No new package, and no change to the `bc` requirement or its missing-binary error path.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: any existing caller that relied on exit 0 from a below-threshold packet now sees 3, or a caller's argument order puts a value where the new arm expects an option. Rollback is reverting the single commit that touches `calculate-completeness.sh`; the option disappears, the parser returns to its current shape, and every invocation exits 0 again.
<!-- /ANCHOR:rollback -->

---
