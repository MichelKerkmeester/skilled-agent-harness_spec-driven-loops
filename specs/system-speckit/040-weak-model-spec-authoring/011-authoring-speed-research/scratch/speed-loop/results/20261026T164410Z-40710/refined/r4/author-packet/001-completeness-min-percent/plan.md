---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one option to one bash script: parse --min-percent <N>, validate it, compare the already-computed percentage, and exit 3 below the threshold while leaving the printed report untouched."
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
| **Language/Stack** | Bash, written for the 3.2-compatible subset the script already targets, with `bc` for the percentage |
| **Framework** | None - one standalone script |
| **Storage** | None |
| **Testing** | `vitest` (`tests/calculate-completeness-script.vitest.ts`) plus direct shell runs |

### Overview
One script gains one option. The argument loop stores a threshold, a validation step rejects a bad value before any analysis, and a comparison after the report is printed sets the exit status. The percentage compared is the same rounded integer the report already prints, so stdout stays byte-identical.
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
- [ ] `npx vitest run tests/calculate-completeness-script.vitest.ts --config ../vitest.config.ts --root .` exits 0 from `.skilled/skills/system-spec-kit/runtime/cli`
- [ ] `diff` of the captured output with and without `--min-percent` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script option branch

### Key Components
- **Argument loop** (`calculate-completeness.sh` §8): gains a `--min-percent` case that stores the value and exits 1 on a missing, non-integer or out-of-range one.
- **Globals block** (`calculate-completeness.sh` §3): gains the threshold variable, empty meaning "no gate".
- **Threshold check** (after the output call, before the final `exit 0`): compares the reported integer against the threshold and exits 3 when it is lower.

### Data Flow
`argv` → the argument loop sets the threshold or exits 1 → folder or `--file` analysis sets the reported percentage → the existing output function prints the unchanged report → the threshold check reads that same percentage variable and chooses exit 3 or exit 0.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reproduces the current behavior and confirms the suite is green. Implementation adds the option, the validation, the comparison and the help and exit-code text. Verification diffs the output at both exit statuses and runs the suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two layers. The vitest file gains cases for exit 3 below the threshold, exit 0 at and above it, and exit 1 for an invalid value, run with:

```bash
npx vitest run tests/calculate-completeness-script.vitest.ts --config ../vitest.config.ts --root .
```

from `.skilled/skills/system-spec-kit/runtime/cli`; it must exit 0. Direct runs cover the byte-identical requirement, which a unit assertion states awkwardly: capture stdout twice on one folder and `diff` the captures, expecting no output and exit statuses of 3 and 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` and `bc`, both already required by the script, and `vitest` for the existing test file. No new package and no new runtime tool.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: `--min-percent` changes a line of the report, or fails a run whose percentage meets the threshold. Revert the one commit that touches the script and its test file. The option is additive, so no caller can depend on it before this change lands.
<!-- /ANCHOR:rollback -->

---
