---
title: "Implementation Plan: Trigger coverage check"
description: "Extend the checker in place with a pure check function in the existing `CHECKS` registry, following check 9's precedent of comparing a router cell with rule content."
trigger_phrases:
  - "trigger coverage check plan"
  - "fires when router parity plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Trigger coverage check

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), Python 3 for tests |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest via `sk-doc/scripts/tests/run-script-tests.sh` |

### Overview
Extend the checker in place with a pure check function in the existing `CHECKS` registry, following check 9's precedent of comparing a router cell with rule content.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement in `002-rule-concision-and-loading`
- [ ] Predecessor handoff met: The gap named in `001-advisor-surfacing/research/research.md`
- [x] Affected files identified by codebase exploration

### Definition of Done
- [ ] All requirements met
- [ ] Tests and checks named in the testing strategy pass
- [ ] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One more pure check in an existing registry

### Key Components
- **Check 10**: tokenizes each Fires-when bullet and each router item, and requires an overlap above the measured threshold
- **`--root`**: two real callers need different roots today, CI (the repository) and the tests (a fixture tree)

### Data Flow
The checker parses router §2 rows and each rule's Fires-when list, pairs them by link, and reports bullets with no covering router item.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Check 10 on fixtures | pytest |
| Integration | Full corpus run | `node check-repo-rules.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `repo-rules-corpus.yml` CI | Internal | Green | Check runs locally only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: False positives block unrelated PRs
- **Procedure**: Revert the commit
<!-- /ANCHOR:rollback -->

---
