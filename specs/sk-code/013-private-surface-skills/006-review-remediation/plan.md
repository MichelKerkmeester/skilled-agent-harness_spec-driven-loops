---
title: "Implementation Plan: Phase 6: review-remediation"
description: "Apply the confirmed deep-review findings in two passes: the record fixes in the spec docs first, children before the parent, then the guard, scanner and doc fixes, each with a test that fails before it."
trigger_phrases:
  - "review remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node CommonJS, Python 3, TypeScript, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The pre-commit shell harness, self-running Node tests, unittest, vitest |

### Overview
The record fixes come first, phase 002 and 003 before the parent, because the parent's status reads from theirs. The code fixes follow, each paired with a test that fails against the old script.
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
Other

### Key Components
- **Private-skill guard**: the pre-commit gate that refuses a staged `local-*` path
- **Skills-root readers**: scripts that list `.skilled/skills/` and must state a `local-*` rule
- **Reader inventory test**: the check that holds every reader to a rule

### Data Flow
A reader lists the skills root, applies its `local-*` rule before any probe, and writes or reports only on tracked skills.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each code fix has one new test, and each new test was run against the old script to show it fails there.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The review report and the operator checkout, where goal criterion 3 and the audit skip were rerun read-only.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the remediation commit. No data or generated artifact outside the packet depends on it.
<!-- /ANCHOR:rollback -->

---
