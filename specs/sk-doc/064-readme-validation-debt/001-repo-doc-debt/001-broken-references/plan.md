---
title: "Implementation Plan: Phase 1: broken-references"
description: "Fix the README references whose target moved under the sk-design hub or was removed, after classifying all 119 audit hits by whether the target is really missing."
trigger_phrases:
  - "broken references plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: broken-references

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate_document.py`, `audit_readmes.py` |

### Overview
Fix the README references whose target moved under the sk-design hub or was removed, after classifying all 119 audit hits by whether the target is really missing.
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
- [x] `audit_readmes.py` reports 103 broken references, down from 119, with no new hit
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: documentation edits checked by the repo's own validators.

### Key Components
- **audit_readmes.py**: Reports unresolved path tokens per README
- **validate_document.py**: Checks each edited README against its template

### Data Flow
The audit lists hits, each hit is classified with `git check-ignore`, `git ls-files` and `readlink`, the real ones go to a DeepSeek worker one brief at a time, and the conductor reviews each diff and reruns both checks.
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
| Unit | Each edited file | `validate_document.py` |
| Integration | The whole repo | `audit_readmes.py` rerun, before and after |
| Manual | Diff review for lost facts or invented links | `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| audit_readmes.py | Internal | Green | No counts |
| DeepSeek V4.1 Flash via dispatch.sh | External | Green | Conductor edits by hand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fixed path turns out wrong
- **Procedure**: `git revert` the class 1 commit; every change is a one-line path edit
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Baseline audit | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->
