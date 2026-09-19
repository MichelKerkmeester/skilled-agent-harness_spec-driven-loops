---
title: "Implementation Plan: Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children"
description: "Two additions to the cli-pi skill, a version bump and a changelog entry."
trigger_phrases:
  - "cli-pi build brief plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc skill conventions |
| **Storage** | None |
| **Testing** | `validate_document.py` |

### Overview
Add ALWAYS rule 12 and one Dispatch-Critical Gotcha to `cli-pi/SKILL.md`, bump the packet to 1.5.4.0, and record why in its changelog.
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
Documentation rules in the skill a dispatcher loads before every Pi dispatch.

### Key Components
- **ALWAYS rules**: what every dispatch must do.
- **Dispatch-Critical Gotchas**: what silently breaks a dispatch.

### Data Flow
Dispatcher loads `SKILL.md` → composes the brief and the child environment → dispatches.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Both files | `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rules prove wrong.
- **Procedure**: Revert the commit.
<!-- /ANCHOR:rollback -->
