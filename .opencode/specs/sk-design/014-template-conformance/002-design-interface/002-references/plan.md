---
title: "Implementation Plan: design-interface references conformance"
description: "Read all 29 reference files against skill-reference-template.md, fix confirmed deviations, resolve the sub-200-line files."
trigger_phrases:
  - "references plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/002-references"
    last_updated_at: "2026-07-27T16:13:03Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned plan.md"
    next_safe_action: "Read all 29 files against the template"
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

# Implementation Plan: design-interface references conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc `create-skill` reference template |
| **Storage** | None |
| **Testing** | `package_skill.py --check` |

### Overview
29 files across 5 subfolders. Read each in full against `skill-reference-template.md`, record per-file conformance, fix the confirmed defect (`refero-tools.md` header) and decide disposition for the four sub-200-line files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable

### Definition of Done
- [ ] All 29 files audited with a recorded verdict
- [ ] Confirmed deviations fixed
- [ ] `package_skill.py --check` passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-file documentation audit against a shared template; no code architecture.

### Key Components
- **`skill-reference-template.md`**: the governing template (OVERVIEW requirement, 200-line bar, 5-field frontmatter).
- **29 reference files**: grouped by subfolder (`aesthetics/`, `design-grounding/`, `design-process/`, `foundations/`, `mcp-tooling/`).

### Data Flow
N/A — static documentation files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read `skill-reference-template.md` in full
- [ ] Enumerate all 29 files with current line counts

### Phase 2: Core Implementation
- [ ] Audit `aesthetics/` (5 files)
- [ ] Audit `design-grounding/` (2 files)
- [ ] Audit `design-process/` (10 files)
- [ ] Audit `foundations/` incl. `color/`, `layout/`, `type/` (10 files)
- [ ] Audit `mcp-tooling/` (2 files)
- [ ] Fix `refero-tools.md` §1 header
- [ ] Decide and apply disposition for the four sub-200-line files

### Phase 3: Verification
- [ ] Run `package_skill.py --check`
- [ ] Grep for broken cross-references after any consolidation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Checker | Frontmatter + structure conformance | `package_skill.py --check` |
| Manual | Cross-reference integrity after any file merge/rename | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decision on sub-200-line file disposition | Internal | Yellow | Blocks REQ-003 until answered |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consolidation breaks a cross-reference from `SKILL.md` or another reference file.
- **Procedure**: Revert the merge via git; restore the standalone file.
<!-- /ANCHOR:rollback -->
