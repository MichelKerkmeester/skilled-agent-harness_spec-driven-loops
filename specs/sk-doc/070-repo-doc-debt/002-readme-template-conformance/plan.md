---
title: "Implementation Plan: Phase 2: readme-template-conformance"
description: "Bring the hand-authored READMEs that fail the sk-create-readme validator to the template, close the inventory gaps the audit names, and record why the generated benchmark reports stay as they are."
trigger_phrases:
  - "readme template conformance plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: readme-template-conformance

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
Bring the hand-authored READMEs that fail the sk-create-readme validator to the template, close the inventory gaps the audit names, and record why the generated benchmark reports stay as they are.
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
- [x] `audit_readmes.py` reports 237 template-invalid (from 244), 0 warnings (from 1) and 14 missing key artifacts (from 19)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: documentation edits checked by the repo's own validators.

### Key Components
- **readme-template.md**: Numbered ALL-CAPS H2 sections starting at `## 1. OVERVIEW`
- **validate_document.py**: Blocks a README with no overview section
- **render-report.cjs**: The only benchmark report renderer left in the repo

### Data Flow
The audit lists template failures, each failure is traced to a hand-authored file or a generator, hand-authored files go to DeepSeek one brief each, and the conductor reads every diff and reruns the validator.
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
| sk-create-readme template | Internal | Green | No target shape |
| DeepSeek V4.1 Flash via dispatch.sh | External | Green | Conductor edits by hand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A heading change breaks an inbound anchor
- **Procedure**: `git revert` the class 2 commit; no inbound `#anchor` link to these READMEs exists (`rg` checked)
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
