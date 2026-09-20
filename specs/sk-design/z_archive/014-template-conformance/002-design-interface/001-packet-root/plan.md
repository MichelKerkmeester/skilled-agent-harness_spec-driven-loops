---
title: "Implementation Plan: design-interface packet-root conformance"
description: "Audit SKILL.md and README.md against their governing templates, fix confirmed deviations only, run package_skill.py --check."
trigger_phrases:
  - "packet root plan"
  - "SKILL.md conformance plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned plan.md"
    next_safe_action: "Read SKILL.md and README.md in full against templates"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: design-interface packet-root conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc `create-skill` templates |
| **Storage** | None |
| **Testing** | `package_skill.py --check` |

### Overview
Two files, one folder: read `SKILL.md` and `README.md` against `skill-md-template.md` and `skill-readme-template.md` section-by-section, record every deviation with line evidence, fix only confirmed defects, then run the packet checker.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (LICENSE.txt exclusion)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `package_skill.py --check` passing
- [ ] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation audit-and-fix, no code architecture involved.

### Key Components
- **`SKILL.md`**: packet activation surface, Smart Routing table, resource loading levels.
- **`README.md`**: human-facing pitch, AT A GLANCE table, navigation.

### Data Flow
N/A — static documentation files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read `SKILL.md` and `README.md` in full
- [ ] Re-read `skill-md-template.md` and `skill-readme-template.md` in full

### Phase 2: Core Implementation
- [ ] Section-by-section diff of `SKILL.md` against template §2-§6
- [ ] Section-by-section diff of `README.md` against template §2, §5
- [ ] Apply confirmed fixes only (leave AT A GLANCE / pitch untouched — already conformant)

### Phase 3: Verification
- [ ] Run `package_skill.py --check`
- [ ] Manual re-read of both files post-fix
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Checker | `SKILL.md` + `README.md` structural conformance | `package_skill.py --check` |
| Manual | Line-by-line re-read against templates | N/A |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-apache-devendoring` (sibling) | Internal | Green | Owns `LICENSE.txt`; no overlap expected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A trim to `SKILL.md` breaks Smart Routing behavior.
- **Procedure**: Revert the specific edit via git; re-run `package_skill.py --check`.
<!-- /ANCHOR:rollback -->
