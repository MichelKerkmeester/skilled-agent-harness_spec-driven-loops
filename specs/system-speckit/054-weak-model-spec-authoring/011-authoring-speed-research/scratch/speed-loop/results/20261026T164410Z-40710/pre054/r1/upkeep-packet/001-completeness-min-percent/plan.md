---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Extend the existing argument parser with one new case, validate the threshold there, and replace the final flat exit 0 with a single if/else that returns 3 or 0 from the percentage the report already printed. The calculation and output paths are untouched."
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
| **Language/Stack** | Bash, 3.2-compatible (the macOS system shell) |
| **Framework** | None - a single-file CLI script |
| **Storage** | None - a temp stats directory under `TMPDIR` |
| **Testing** | Vitest, `runtime/cli/tests/calculate-completeness-script.vitest.ts` |

### Overview

The script already parses options in a `while`/`case` loop and already computes the percentage it prints. The change adds one `--min-percent` case to that loop, validates the value there, and replaces the trailing `exit 0` with an `if`/`else` that returns 3 when the printed percentage is below the threshold and 0 otherwise. Nothing in the counting or rendering functions changes, so the report stays byte-identical and the flag only affects the process status.
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

Single-file CLI: parse, compute, render, exit. No modules, no state beyond shell globals.

### Key Components

- **Argument parser** (section 8, lines 544-562): the `case` loop that already handles `--verbose`, `--json`, `--quality`, `--file` and `--help`. Gains one `--min-percent` branch that consumes the next argument.
- **`MIN_PERCENT` global** (section 3, near `SINGLE_FILE`): empty means no gate; a value from 0 to 100 means gate.
- **Threshold validation**: an integer check plus a range check, run at parse time so a bad value fails before any work is done, in the same `ERROR:` style as the existing argument errors.
- **Exit decision** (replaces the final `exit 0`): compares the value the report already printed against `MIN_PERCENT`.
- **Output functions** (section 7): untouched, which is what keeps the report identical.

### Data Flow

`argv` -> parser sets `MIN_PERCENT` and `SPEC_FOLDER` (or `SINGLE_FILE`) -> `calculate_spec_completeness` or `calculate_file_completeness` fills the percentage globals -> `output_text` or `output_json` prints the report -> the exit decision compares the printed percentage -> `exit 0` or `exit 3`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

The shape of the change is three edits in one file: a global, a parser case with its validation, and the exit decision plus the two documentation surfaces (`--help` and the exit-code comment block).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Unit-level exit matrix**: build a temporary packet with a known completion (one file with a single `[TODO: ...]` line yields a low percentage), then assert exit 3 below the threshold and exit 0 at or above it, including the boundary values 0, 50, 90 and 100.
- **Output identity**: capture stdout and stderr for the same target with and without `--min-percent`, in both text and `--json` modes, and `diff` the captures. Any difference fails the test.
- **Invalid input**: assert exit 1 for a missing value, `abc`, an empty string, `-1` and `101`, and assert stdout is empty in each case.
- **No-flag regression**: the existing cases in `calculate-completeness-script.vitest.ts` must pass unmodified.
- **Command**: from `.skilled/skills/system-spec-kit`, run `npx vitest run runtime/cli/tests/calculate-completeness-script.vitest.ts --config vitest.config.ts`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Bash 3.2+**: the script must keep working with the macOS system shell, so no associative arrays, no `mapfile` and no `;;&` fallthrough.
- **`bc`**: already required by the script for the percentage math; the feature adds no new external command.
- **Vitest**: already configured for this package, so the test file needs no new dependency.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single script change and the test addition. Because the flag is opt-in and the default path is untouched, a revert needs no data migration and no caller change: anything that never passed `--min-percent` is unaffected either way.
<!-- /ANCHOR:rollback -->

---
