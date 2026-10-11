---
title: "Implementation Plan: Phase 7: remediation-review-fixes"
description: "Extend the shared stdin suite instead of keeping a second harness, then make four one-line documentation corrections."
trigger_phrases:
  - "remediation review fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: remediation-review-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js node:test, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The shared stdin suite on the current tree and on a pre-fix archive |

### Overview
Extend the shared stdin suite instead of keeping a second harness, then make four one-line documentation corrections.
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
Reuse of an existing test table

### Key Components
- **Shared stdin suite**: strips every `*_DISABLED` variable and requires an exit no sooner than 2900 ms, so a hook that skips its read cannot pass

### Data Flow
Not applicable.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The extended suite was copied into a `git archive 1d078f3356^` tree of `.skilled/hooks`, `sk-git` and `sk-vision` and run with both kill-switches set: the three new rows were SIGKILLed. On the current tree they pass, with 21 of 21 overall.
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
