---
title: "Implementation Plan: Phase 3: changelog-omissions"
description: "Reword the 50 released changelog entries that name internal ids or test counts into plain names without changing a fact, then record the round in one patch entry per touched skill with matching version carriers."
trigger_phrases:
  - "changelog omissions plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: changelog-omissions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON version carriers |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate_document.py`, `audit_readmes.py` |

### Overview
Reword the 50 released changelog entries that name internal ids or test counts into plain names without changing a fact, then record the round in one patch entry per touched skill with matching version carriers.
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
- [x] the changelog check flags 4 files (all for `SHA-256`), down from 53, and `parent-skill-check.cjs` passes on all six touched hubs
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: documentation edits checked by the repo's own validators.

### Key Components
- **validate_document.py changelog checks**: Flag `changelog_internal_id` and `changelog_test_count` in prose
- **Playbook titles and decision records**: The source of each plain name
- **sync-skills-hermes.cjs**: Regenerates the Hermes copies of each SKILL.md

### Data Flow
The validator lists flagged entries, DeepSeek resolves each id against the skill playbook or decision record and rewrites it, the conductor reads every word diff and checks a sample of mappings against titles, then new patch entries raise each skill version and the Hermes copies are regenerated.
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
| Skill playbooks and decision records | Internal | Green | An id cannot be named; it stays and is listed |
| DeepSeek V4.1 Flash via dispatch.sh | External | Green | Conductor edits by hand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rewording turns out to change a fact
- **Procedure**: `git revert` the class 3 commit, or restore the one entry from its parent commit
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
