---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one option and one post-report comparison to calculate-completeness.sh, leaving the report byte-identical and moving the verdict into the process exit status."
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
| **Language/Stack** | Bash, kept 3.2-compatible for macOS |
| **Framework** | None — single-file CLI with a `while`/`case` argument loop |
| **Storage** | None |
| **Testing** | Vitest, spawning the script with `spawnSync` |

### Overview

Add one option and one comparison to `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. The option is parsed and validated in the loop that already handles `--verbose`, `--json`, `--quality` and `--file`; the comparison runs after the report is written, so the output path is never touched and the only observable difference is the process exit status.
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

Single-file CLI pipeline: parse arguments, compute, report, then return a verdict. No new module, no new file, no new dependency.

### Key Components

- **Argument parser** (`while`/`case` loop, the script's main section): already order-independent, so `--min-percent` joins `VERBOSE`, `JSON_OUTPUT`, `QUALITY_CHECK` and `SINGLE_FILE` as one more global plus one more case arm. Validation of `N` belongs here, before any work starts, so a bad value fails fast instead of after a full scan.
- **Completeness engine** (`calculate_file_completeness`, `calculate_spec_completeness`): unchanged. It sets `percentage` per file and `OVERALL_PERCENTAGE` for a folder, and both are already the figures the report prints.
- **Output layer** (`output_text`, `output_json`): unchanged by design. The option must not add a line, a field or a warning, so the report stays byte-identical.
- **Verdict step** (new, after the `output_*` call at the end of the script): compares the figure the report presented against `MIN_PERCENT` and sets the exit status — 3 below the threshold, 0 otherwise. It reads the same value the output layer just printed rather than recomputing, so the report and the verdict cannot disagree.

### Data Flow

`argv` → parser (sets and validates `MIN_PERCENT`) → engine computes `OVERALL_PERCENTAGE` in folder mode or `percentage` in `--file` mode → output layer writes the report → verdict compares that figure with `MIN_PERCENT` → `exit 3` or `exit 0`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Extend the existing `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`, which already spawns the script with `spawnSync` and builds fixtures in `fs.mkdtempSync` temp folders, so no new harness is needed. Four cases cover the feature: threshold passes at equality, threshold fails below, a malformed `N` exits 1, and stdout plus stderr are identical with and without the option in both text and `--json` mode.

Run the file from `.skilled/skills/system-spec-kit/runtime/cli`:

```
npx vitest run --config ../../vitest.config.ts --project cli tests/calculate-completeness-script.vitest.ts
```

A fixture that reports a known percentage is the whole trick: a `spec.md` with one placeholder line and several filled lines gives a stable, sub-100 figure, so the test asserts a verdict rather than a magic number.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond what the script already requires. The percentage calculation keeps its existing `bc` dependency; the threshold comparison is integer-only bash arithmetic, so `--min-percent` adds nothing to install and nothing to check at startup.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two file edits. The option is additive and carries no state, config, migration or persisted value, so there is nothing to unwind: a caller that never passes `--min-percent` sees exactly the behaviour it saw before, which is why REQ-004 and REQ-005 are the first things the test file pins.
<!-- /ANCHOR:rollback -->

---
