---
title: "Plan: design-md-generator packet-root conformance"
description: "Plan for reading design-md-generator's three root markdown files against their two different governing template families."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author packet-root audit plan"
    next_safe_action: "Read SKILL.md, README.md, INSTALL-GUIDE.md against their templates"
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
# Plan: design-md-generator packet-root conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | 3 root markdown skill docs, 2 template families |
| **Governing templates** | `skill-md-template.md`, `skill-readme-template.md`, sk-doc create-readme install-guide template |
| **Verification** | Section-by-section diff per file + `validate.sh` |

### Overview
Read each of the three root files against its own correct governing template — `INSTALL-GUIDE.md` is not a skill doc, it belongs to the sk-doc create-readme family.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All three governing templates located and read
- [ ] `SKILL.md`, `README.md`, `INSTALL-GUIDE.md` located and read in full

### Definition of Done
- [ ] Gap list (or conformant confirmation) recorded per file with evidence
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit across two distinct template families in one folder.

### Key Components
- **Target:** `design-md-generator/{SKILL.md,README.md,INSTALL-GUIDE.md}`.
- **Reference:** `skill-md-template.md`, `skill-readme-template.md` (skill family); `.opencode/skills/sk-doc/create-readme/assets/` (install-guide family).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `skill-md-template.md` and `skill-readme-template.md`
- [ ] Locate and read the sk-doc create-readme install-guide template

### Phase 2: Core Implementation
- [ ] Diff `SKILL.md` against `skill-md-template.md`; fix if confirmed
- [ ] Diff `README.md` against `skill-readme-template.md`; fix if confirmed
- [ ] Diff `INSTALL-GUIDE.md` against the install-guide template; fix if confirmed

### Phase 3: Verification
- [ ] Re-diff all three fixed files
- [ ] Run `validate.sh` for this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Section/frontmatter parity vs each file's correct template | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-md-template.md` / `skill-readme-template.md` | Internal | Green | Cannot diff `SKILL.md`/`README.md` without reference |
| sk-doc create-readme install-guide template | Internal | Green | Cannot diff `INSTALL-GUIDE.md` without reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix introduces an unintended content change, or the wrong template was applied to a file.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version; re-confirm the correct template family before retrying.
<!-- /ANCHOR:rollback -->
