---
title: "Spec: design-md-generator packet-root conformance"
description: "Audit design-md-generator's three packet-root markdown files (SKILL.md, README.md, INSTALL-GUIDE.md) against their two different governing template families."
trigger_phrases:
  - "design-md-generator packet root audit"
  - "design-md-generator INSTALL-GUIDE conformance"
  - "md-generator root template check"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author packet-root audit spec"
    next_safe_action: "Read SKILL.md, README.md, INSTALL-GUIDE.md against their templates"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/README.md"
      - ".opencode/skills/sk-design/design-md-generator/INSTALL-GUIDE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-md-generator packet-root conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — not yet audited |
| **Spec Folder** | 001-packet-root |
| **Parent** | 004-design-md-generator |
| **Predecessor** | None — first child in the map |
| **Successor** | `002-references` (map position only; no hard dependency, independently executable) |
| **Phase** | 1 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`design-md-generator`'s packet root is unusual among sk-design modes: it carries three root markdown files, not two. `SKILL.md` and `README.md` follow the standard skill templates, but `INSTALL-GUIDE.md` is governed by a different template family entirely (`.opencode/skills/sk-doc/create-readme/assets/`), because install guides are an sk-doc concern, not a skill-authoring concern. None of the three has been read against its template as part of this program.

### Purpose
Read `SKILL.md` against `skill-md-template.md`, `README.md` against `skill-readme-template.md`, and `INSTALL-GUIDE.md` against the sk-doc create-readme install-guide template, and fix any confirmed structural gap in each. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-md-generator/SKILL.md` against `assets/skill/skill-md-template.md`.
- `.opencode/skills/sk-design/design-md-generator/README.md` against `assets/skill/skill-readme-template.md`.
- `.opencode/skills/sk-design/design-md-generator/INSTALL-GUIDE.md` against `.opencode/skills/sk-doc/create-readme/assets/` (install-guide template family, not the skill template).

### Out of Scope
- All other `design-md-generator` folders (owned by sibling children 002-008), including `backend/` (which has its own `README.md`, owned by sibling `005-backend`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/SKILL.md` | Audit (Modify if confirmed) | Bring in line with `skill-md-template.md` |
| `.opencode/skills/sk-design/design-md-generator/README.md` | Audit (Modify if confirmed) | Bring in line with `skill-readme-template.md` |
| `.opencode/skills/sk-design/design-md-generator/INSTALL-GUIDE.md` | Audit (Modify if confirmed) | Bring in line with the sk-doc create-readme install-guide template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` read against `skill-md-template.md` | Every required section/frontmatter field checked line by line; gaps listed with file:line evidence |
| REQ-002 | `README.md` read against `skill-readme-template.md` | Same evidence standard as REQ-001 |
| REQ-003 | `INSTALL-GUIDE.md` read against its own governing family, not the skill template | The correct reference doc (sk-doc create-readme assets) is confirmed before diffing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confirmed gaps remediated | Each confirmed gap fixed in place, no unrelated rewrite |
| REQ-005 | No template cross-contamination | `INSTALL-GUIDE.md` is never diffed against `skill-md-template.md`, and vice versa |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three root files are read in full against their correct, respective governing templates with cited evidence.
- **SC-002**: Either all three files are conformant (documented as such) or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Diffing `INSTALL-GUIDE.md` against the skill template by mistake | False-positive gaps, wasted fix effort | Confirm the sk-doc create-readme template family before starting REQ-003 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The audit must be exhaustive (full-file read for all three files), not sampled.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- None — the three files and all governing templates are already located.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
