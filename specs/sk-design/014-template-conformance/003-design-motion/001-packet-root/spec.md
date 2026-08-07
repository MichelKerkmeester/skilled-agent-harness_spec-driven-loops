---
title: "Spec: design-motion packet-root conformance"
description: "Audit design-motion's two packet-root markdown files (README.md, SKILL.md) against the sk-doc skill-readme and skill-md templates, and remediate any confirmed gap."
trigger_phrases:
  - "design-motion packet root audit"
  - "design-motion SKILL.md README.md conformance"
  - "motion mode root template check"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author packet-root audit spec"
    next_safe_action: "Read SKILL.md + README.md against governing templates"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/SKILL.md"
      - ".opencode/skills/sk-design/design-motion/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-motion packet-root conformance

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
| **Parent** | 003-design-motion |
| **Predecessor** | None — first child in the map |
| **Successor** | `002-references` (map position only; no hard dependency, independently executable) |
| **Phase** | 1 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`design-motion`'s packet root carries exactly two markdown files, `SKILL.md` and `README.md`. Neither has been read against its governing template as part of this program; the audit sample that seeded the 014 program did not cover the root.

### Purpose
Read `SKILL.md` against `assets/skill/skill-md-template.md` and `README.md` against `assets/skill/skill-readme-template.md`, section by section, and fix any confirmed structural gap (missing required section, malformed frontmatter, heading-numbering violation). A clean read that confirms full conformance is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-motion/SKILL.md` against `skill-md-template.md`.
- `.opencode/skills/sk-design/design-motion/README.md` against `skill-readme-template.md`.

### Out of Scope
- All other `design-motion` folders (owned by sibling children 002-008).
- Content/scope changes to the mode itself — structure and template conformance only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-motion/SKILL.md` | Audit (Modify if confirmed) | Bring frontmatter/section structure in line with `skill-md-template.md` |
| `.opencode/skills/sk-design/design-motion/README.md` | Audit (Modify if confirmed) | Bring structure in line with `skill-readme-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` read against `skill-md-template.md` | Every required section/frontmatter field checked line by line; gaps listed with file:line evidence |
| REQ-002 | `README.md` read against `skill-readme-template.md` | Same evidence standard as REQ-001 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Confirmed gaps remediated | Each confirmed gap fixed in place, no unrelated rewrite |
| REQ-004 | Frontmatter fields validated against the template's allowed vocabulary | `importance_tier` and `contextType` values checked against their enums, not just presence |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/template fixes, no prose rewording beyond the confirmed gap |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both root files are read in full against their governing templates with cited evidence.
- **SC-002**: Either both files are conformant (documented as such) or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-fixing (rewriting content beyond structure) | Scope creep into the mode's actual design guidance | Fix structure/template gaps only; leave motion-design content untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The audit must be exhaustive (full-file read), not sampled, since this child's entire job is closing the sampling gap.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- None — the two files and both governing templates are already located.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
