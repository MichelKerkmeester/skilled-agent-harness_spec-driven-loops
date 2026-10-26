---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Parse the option into a new global, validate the value before any work, and compare the overall percentage after the report is printed. The report functions stay untouched, so the unchanged-output requirement holds by construction."
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
| **Language/Stack** | Bash, kept compatible with the 3.2 shell the script already targets |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Direct invocation against fixture spec folders under `mktemp -d`, plus `diff` of captured stdout |

### Overview
The option is an addition to the existing argument loop, not a new mode. Its value lands in one global beside `SINGLE_FILE`, gets validated before the script does any work, and is compared against the overall percentage only after the report has already been printed. Because the two output functions and the arithmetic are not touched, the unchanged-output requirement is satisfied by construction rather than by matching strings afterwards.
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
- [ ] Exit matrix and output diffs recorded in `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks)

### Baselines (2026-10-26, before any change)

| Gate | Result |
|------|--------|
| `calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent` | exit 0, `Overall Completion: 100%` |
| `calculate-completeness.sh --json` on the same folder | exit 0, `overall_completion` present |
| `calculate-completeness.sh --help` | exit 0, five options listed |
| `recommend-level.sh --loc 40 --files 2` | `Recommended Level: 0 (Quick)` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place option extension of an existing Bash CLI. No new module, function or dependency, and no change to the calculation or output paths.

### Key Components
- **Globals, `calculate-completeness.sh:48-52`**: add `MIN_PERCENT=""` beside `VERBOSE`, `JSON_OUTPUT`, `QUALITY_CHECK` and `SINGLE_FILE`. An empty value means the gate is off, which is what keeps today's exit status for every existing caller.
- **Argument loop, `calculate-completeness.sh:544-562`**: add `--min-percent) MIN_PERCENT="$2"; shift 2 ;;` to the `case`. `--file|-f` already consumes a value the same way, so the shape is the file's own convention. The `*)` branch is left alone, so a folder path still lands in `SPEC_FOLDER` in any position.
- **Validation, after the `bc` check at `calculate-completeness.sh:570-573`**: reject an empty value, a non-integer and a number outside 0 to 100 with the file's `ERROR:` plus exit 1 convention. This runs before `calculate_spec_completeness`, so a bad floor never prints a report that a caller might mistake for a result.
- **Gate, between the output call at `calculate-completeness.sh:581-585` and `exit 0` at line 587**: compare and exit 3 when below. Written as a full `if` with an `else` branch, matching the clamp at lines 297-299, because a bare `[[ ... ]] && exit 3` leaves a false test as the script's last status and `set -e` is in force.
- **`--file` combination**: `OVERALL_PERCENTAGE` is initialized to 100 at line 67 and is only recomputed inside `calculate_spec_completeness`. In `--file` mode it therefore never reflects the file, so a gate on it would pass silently. Per the recommendation recorded in `spec.md` section 7, the combination is rejected with exit 1 and an `ERROR:` line rather than gated against a value the mode never produces.
- **Text surfaces, `calculate-completeness.sh:8`, `74-96` and `589-591`**: the header usage comment, the `--help` option list and the exit-code comment block each gain one entry. The report itself gains nothing.

### Data Flow
`argv` reaches the `case` loop and sets `MIN_PERCENT`. Validation either exits 1 or falls through. `calculate_spec_completeness` sets `OVERALL_PERCENTAGE` from the placeholder and line totals. `output_text` or `output_json` prints exactly what it prints today. The gate then reads `OVERALL_PERCENTAGE` and chooses the exit status, which is the only observable difference.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Fixtures are built under a fresh `mktemp -d` and removed afterwards. Each fixture folder carries a `spec.md` whose placeholder count and content-line count give a known percentage, so a floor can be chosen just above, exactly at and just below it.
- Exit matrix: below the floor gives 3, at the floor gives 0, above gives 0, no option gives 0, and each invalid value gives 1 with one `ERROR:` line on stderr.
- Output invariance: capture stdout for plain text, `--json`, `--verbose` and `--quality`, run each again with `--min-percent` set, and require an empty `diff`. Stderr must be empty in both runs.
- Argument position: run the folder path before and after the option, and run `--min-percent` last with no value to confirm the missing-value path rather than a silent empty comparison.
- `--file` combination: confirm exit 1 and the `ERROR:` line, so the ambiguity recorded in `spec.md` section 7 cannot regress into a silent pass.
- Regression: the existing `--help`, `--json` and `--verbose` invocations keep their exit status and their output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `bc`, already required and already checked by the script at lines 570-573. The option adds no dependency.
- No caller adopts the option in this change, so nothing downstream waits on it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single modified file. The option is additive and no caller passes it yet, so a revert restores today's behavior with no migration and no state to unwind.
<!-- /ANCHOR:rollback -->

---
