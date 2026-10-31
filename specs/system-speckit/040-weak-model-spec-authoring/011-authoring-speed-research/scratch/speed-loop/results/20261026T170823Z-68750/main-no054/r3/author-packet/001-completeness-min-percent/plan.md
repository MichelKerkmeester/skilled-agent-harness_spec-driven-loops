---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "A single-file change: one argument arm, one validation block, and a post-output comparison that turns the already-computed overall percentage into exit 3. The calculation and both report renderers stay untouched."
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
| **Language/Stack** | Bash, 3.2-compatible, with `set -euo pipefail` |
| **Framework** | None - standalone CLI script |
| **Storage** | None - a temp stats directory under `${TMPDIR:-/tmp}`, removed by an `EXIT` trap |
| **Testing** | `runtime/cli/tests/calculate-completeness-script.vitest.ts` plus direct CLI runs |

### Overview

The change is confined to the argument loop and the tail of `calculate-completeness.sh`. Parsing gains one `case` arm that stores an integer threshold and shifts two arguments; a validation block runs once, before any calculation, and rejects anything that is not an integer from 0 to 100. `calculate_spec_completeness` already leaves `OVERALL_PERCENTAGE` in a global, so the gate needs no plumbing: after `output_text` or `output_json` returns, the tail compares that global against the threshold and exits 3 when it is lower. The report body never learns that the flag exists.
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

Single-pass CLI with a post-output exit gate. The script already has this shape: parse, calculate into globals, render, exit. The feature adds one stage at the end rather than threading a new value through the renderers.

### Key Components

- **Argument loop** (`while [[ $# -gt 0 ]]`, around line 544): the existing `case` arms each set a global and shift. The new `--min-percent` arm sets `MIN_PERCENT="$2"` and shifts two, matching `--file`.
- **Validation block** (after the loop, before the `bc` check): rejects a non-integer, an out-of-range value, and the `--file` combination with exit 1. Running it before the calculation means a typo fails immediately instead of after a full scan.
- **Calculator** (`calculate_spec_completeness`): unchanged. It sets the global `OVERALL_PERCENTAGE`, which the gate reads.
- **Renderers** (`output_text`, `output_json`): unchanged. They are the byte-identical contract REQ-001 protects.
- **Threshold gate** (after the renderer call, before the final `exit 0`): `if [[ "$OVERALL_PERCENTAGE" -lt "$MIN_PERCENT" ]]; then exit 3; fi`, guarded so it runs only when a threshold was supplied.

### Data Flow

`argv` -> argument loop stores `SPEC_FOLDER` and `MIN_PERCENT` -> validation accepts or exits 1 -> `calculate_spec_completeness` sets `OVERALL_PERCENTAGE` -> `output_text` or `output_json` prints the report unchanged -> the gate compares `OVERALL_PERCENTAGE` with `MIN_PERCENT` -> exit 3 when below, exit 0 otherwise.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The existing vitest suite at `runtime/cli/tests/calculate-completeness-script.vitest.ts` covers the unflagged path and must pass without edits. The new behaviour is verified by direct runs against a packet whose report is known:

| Case | Invocation | Expected |
|------|------------|----------|
| Below threshold | `--min-percent 90` on a 64 percent packet | report printed, exit 3 |
| At threshold | `--min-percent 64` on the same packet | report printed, exit 0 |
| Zero | `--min-percent 0` | exit 0 |
| Maximum | `--min-percent 100` on an incomplete packet | exit 3 |
| JSON | `--json --min-percent 90` | JSON byte-identical, exit 3 |
| Verbose | `--verbose --min-percent 90` | verbose report byte-identical, exit 3 |
| No flag | folder only | report byte-identical to the baseline, exit 0 |
| Non-integer | `--min-percent abc` | exit 1, stderr names the value, no report |
| Out of range | `--min-percent -1` and `--min-percent 101` | exit 1 for each |
| Missing value | trailing `--min-percent` | exit 1, no unbound-variable crash |
| File mode | `--file <path> --min-percent 50` | exit 1, message names folder mode |

Every case records its exit status with `echo $?` immediately after the run, because `set -e` inside a wrapper can mask the code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` 3.2 or newer, `bc`, and the usual `find`/`grep`/`wc` userland - all already required by the script. No new dependency, no build step, no generated artifact. The two existing callers, `archive.sh` and `completion-state.cjs`, pass no `--min-percent` and therefore keep exit 0.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single modified file. The change adds an opt-in flag and leaves no state, no migration and no persisted configuration, so reverting restores the previous behaviour for every caller with no cleanup step.
<!-- /ANCHOR:rollback -->

---

