---
title: "Implementation Plan: Phase 3: drift-guard-warning-count"
description: "Tee each guard's stdout into a temp file, count `[WARN]` lines after a passing run, show the count on the PASS line, and add the total to the success line."
trigger_phrases:
  - "drift guard warning count plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: drift-guard-warning-count

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | A full umbrella run before and after |

### Overview
Tee each guard's stdout into a temp file, count `[WARN]` lines after a passing run, show the count on the PASS line, and add the total to the success line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small in-place change to an existing gate script

### Key Components
- **`run_guard`**: tees stdout to a temp file, counts `[WARN]` lines, and removes the file
- **Summary**: adds the running total when it is above zero

### Data Flow
Each guard's stdout streams to the terminal and into a temp file. Under `pipefail` the guard's exit status still decides PASS or FAIL. The count feeds the PASS line and a running total.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Before: the run exited 0, `grep -c '\[WARN\]'` printed 272, and the last line was `run-all-drift-guards: all 4 guards PASSED`. After: same exit and PASS decisions, the alignment PASS line shows `(272 warnings)` and the last line adds `272 non-blocking warning(s)`. The builder also checked the fail and zero-warning branches in an isolated copy of `run_guard`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the components named in the architecture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. No state, data or generated file outlives it.
<!-- /ANCHOR:rollback -->

---
