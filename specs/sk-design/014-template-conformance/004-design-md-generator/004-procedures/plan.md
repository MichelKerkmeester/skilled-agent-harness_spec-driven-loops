---
title: "Plan: design-md-generator procedures/ conformance"
description: "Plan to audit design-md-generator's single procedures/ file against skill-procedure-template.md."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/004-procedures"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author procedures audit plan"
    next_safe_action: "Read design-system-extraction.md against skill-procedure-template.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: design-md-generator procedures/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Single markdown procedure doc |
| **Governing template** | `.opencode/skills/sk-doc/create-skill/assets/skill/skill-procedure-template.md` |
| **Verification** | Section-by-section diff + `validate.sh` |

### Overview
First-pass audit of an unsampled, single-file folder, with a cross-check against the real `backend/` pipeline stages.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `skill-procedure-template.md` read in full
- [ ] `design-system-extraction.md` located and read

### Definition of Done
- [ ] File diffed against the template
- [ ] Procedure steps cross-checked against `backend/scripts/` stage names
- [ ] Confirmed gap fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit + a real-pipeline cross-check.

### Key Components
- **Target:** `design-md-generator/procedures/design-system-extraction.md`.
- **Reference:** `skill-procedure-template.md`; `backend/scripts/{crawl,extract,cluster,formatters-v3}.ts` as the ground truth for pipeline stage names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `skill-procedure-template.md`
- [ ] Read `design-system-extraction.md`
- [ ] List `backend/scripts/` stage names

### Phase 2: Core Implementation
- [ ] Diff the file against the template; fix if confirmed
- [ ] Cross-check procedure steps against the real pipeline stages

### Phase 3: Verification
- [ ] Re-diff the fixed file
- [ ] Run `validate.sh`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Structure parity vs template | Read + compare |
| Cross-check | Procedure steps vs `backend/scripts/` stage names | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-procedure-template.md` | Internal | Green | Cannot diff without reference |
| `backend/scripts/` stage names | Internal | Green | Cannot cross-check procedure accuracy without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix alters content beyond the structural gap.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version.
<!-- /ANCHOR:rollback -->
