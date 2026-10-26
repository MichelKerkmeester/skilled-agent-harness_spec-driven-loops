---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one long option to an existing Bash CLI: parse and validate a threshold, print the report exactly as today, then exit 3 when the reported percentage falls below it. No new dependency, no change to the calculation."
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
| **Language/Stack** | Bash, written for Bash 3.2+ so it runs unchanged on macOS and Linux |
| **Framework** | None - a standalone CLI script with a hand-rolled `while`/`case` argument parser |
| **Storage** | None - temporary per-file stats under `${TMPDIR:-/tmp}/speckit-completeness-$$`, removed by an `EXIT` trap |
| **Testing** | Manual shell verification against fixture spec folders, plus `validate.sh --strict` on this packet |

### Overview

The script already computes one percentage per run: `OVERALL_PERCENTAGE` for a folder, or the single file's `percentage` in `--file` mode. The change adds a `MIN_PERCENT` global, one `case` arm in the existing argument loop, a validation helper that rejects anything outside the integer range 0-100, and a comparison after the output function returns. The report is printed first and never modified, so the only observable difference when the option is passed is the exit status.
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
- [ ] Output diffed byte-for-byte with and without the option
- [ ] Exit status verified for below, at and above the threshold
- [ ] `validate.sh --strict` reports `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-pass CLI filter. Parse arguments, compute, emit the report, then map the computed value onto an exit status. The new option is a post-processing gate, not a new stage in the calculation.

### Key Components

- **Argument loop** (`while [[ $# -gt 0 ]]` / `case "$1"`): gains a `--min-percent` arm that shifts twice and stores the raw value in `MIN_PERCENT`.
- **Validation helper**: rejects a missing, non-integer, negative or above-100 value before any calculation runs, using the script's existing `ERROR: ...` / `Use --help for usage information` / `exit 1` convention.
- **Reported-percentage selector**: resolves the value the gate compares - `OVERALL_PERCENTAGE` in folder mode, the sourced `percentage` in `--file` mode - so the gate reads the same number the report prints rather than recomputing it.
- **Exit gate**: after `output_json` or `output_text` returns, exits 3 on a shortfall and 0 otherwise.

### Data Flow

```
argv -> argument loop -> MIN_PERCENT (validated)
                              |
spec folder / file -> calculate_*_completeness -> report function -> stdout
                              |
                    reported percentage + MIN_PERCENT -> exit gate -> status 0 or 3
```

The report path is untouched; the gate is appended after it. That ordering is what keeps the output identical whether or not the option is present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

The work is small enough to land as one change. Setup captures the baseline outputs and exit statuses that the verification phase diffs against; implementation adds the option in four edits to a single file; verification proves parity and the new statuses before the packet is called done.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no test suite for this script, so verification is a scripted manual pass over fixtures built in a temporary directory:

- **Parity**: run each mode (default, `--verbose`, `--json`, `--file`) with and without `--min-percent 50`, capture stdout, and `diff` the pairs. Any difference is a failure, including whitespace.
- **Threshold arithmetic**: build a folder whose reported percentage is known, then exercise `N` below, equal to and above that number. Equal must pass - the comparison is `below N`, not `at or below N`.
- **Validation**: assert exit 1 and a stderr message for a missing value, a non-integer, `-1` and `101`, and confirm no report reached stdout.
- **Combination**: `--json --min-percent`, `--verbose --min-percent` and `--quality --min-percent` each return the same status as the plain run.
- **Absence**: a run with no `--min-percent` exits 0, matching the baseline captured in setup.
- **Syntax**: `bash -n` on the script, and `shellcheck` when it is installed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `bc`, which the script already requires and already checks for before calculating. The gate reuses its output and adds no new external command.
- Bash 3.2 or newer. The new code stays inside that floor: no associative arrays, no `mapfile`, no `[[ -v ]]`.
- No change to `validate.sh`, `check-completion.sh` or the Level contract. This packet does not touch them.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single modified file, `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`, to its pre-change revision. Nothing else in the repository is written, so the revert is complete on its own. Callers that adopted `--min-percent` must be updated in the same step, because after the revert the flag is rejected as an unexpected argument and the script exits 1.
<!-- /ANCHOR:rollback -->

---
