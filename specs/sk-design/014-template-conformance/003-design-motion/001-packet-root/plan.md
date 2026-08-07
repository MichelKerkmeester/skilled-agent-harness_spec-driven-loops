---
title: "Plan: design-motion packet-root conformance"
description: "Plan for reading design-motion's SKILL.md and README.md against their governing templates and fixing any confirmed gap."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author packet-root audit plan"
    next_safe_action: "Read SKILL.md + README.md against governing templates"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: design-motion packet-root conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Markdown skill docs |
| **Governing templates** | `skill-md-template.md`, `skill-readme-template.md` |
| **Verification** | Section-by-section diff against template + `validate.sh` |

### Overview
A documentation-structure audit, not a code change. Read both root files against their templates, list any gap with evidence, fix confirmed gaps in place.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Both governing templates located and read
- [ ] `SKILL.md` and `README.md` located and read in full

### Definition of Done
- [ ] Gap list (or conformant confirmation) recorded with evidence
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit: read target, read template, compare section-by-section, remediate.

### Key Components
- **Target:** `design-motion/SKILL.md`, `design-motion/README.md`.
- **Reference:** `.opencode/skills/sk-doc/create-skill/assets/skill/skill-md-template.md`, `skill-readme-template.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read both governing templates in full

### Phase 2: Core Implementation
- [ ] Read `SKILL.md` in full; diff against `skill-md-template.md`
- [ ] Read `README.md` in full; diff against `skill-readme-template.md`
- [ ] Fix each confirmed gap

### Phase 3: Verification
- [ ] Re-diff fixed files against templates
- [ ] Run `validate.sh` for this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Section/frontmatter parity vs template | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-md-template.md` / `skill-readme-template.md` | Internal | Green | Cannot diff without reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix introduces an unintended content change.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version; no other surface touched.
<!-- /ANCHOR:rollback -->
