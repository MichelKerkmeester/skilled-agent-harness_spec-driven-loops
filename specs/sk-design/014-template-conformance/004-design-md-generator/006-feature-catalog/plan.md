---
title: "Plan: design-md-generator feature-catalog/ conformance"
description: "Plan to audit design-md-generator's feature-catalog/ root + 7 subdirectories against feature-catalog-template.md."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/006-feature-catalog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author feature-catalog audit plan"
    next_safe_action: "Enumerate and read all 9 feature-catalog/ files against the template"
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
# Plan: design-md-generator feature-catalog/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | 1 root + 8 nested markdown feature-catalog docs across 7 subdirectories |
| **Governing template** | `.opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-template.md` |
| **Verification** | Section-by-section diff + `validate.sh` |

### Overview
First-pass audit of an unsampled folder with 7 same-shape subdirectories; enumerate all 9 files before diffing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `feature-catalog-template.md` read in full
- [ ] All 9 files located (root + 7 subdirectories)

### Definition of Done
- [ ] All 9 files diffed against the template
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit across a root file plus 7 single-file subdirectories.

### Key Components
- **Target:** `feature-catalog.md`, `{cluster-classify,extract,feature-extractors,interaction-capture,procedure-cards,report-preview,validate,write-design-md}/*.md`.
- **Reference:** `feature-catalog-template.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `feature-catalog-template.md`
- [ ] Enumerate and read all 9 target files

### Phase 2: Core Implementation
- [ ] Diff each file against the template; fix confirmed gaps
- [ ] Cross-check each subdirectory file against its corresponding `backend/scripts/*.ts` stage

### Phase 3: Verification
- [ ] Re-diff fixed files
- [ ] Run `validate.sh`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Structure parity vs template | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `feature-catalog-template.md` | Internal | Green | Cannot diff without reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix alters content beyond the structural gap.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version.
<!-- /ANCHOR:rollback -->
