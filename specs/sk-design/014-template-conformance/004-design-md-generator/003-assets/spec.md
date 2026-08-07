---
title: "Spec: design-md-generator assets/ conformance"
description: "Audit the 3 assets/ files against skill-asset-template.md and remediate any confirmed gap."
trigger_phrases:
  - "design-md-generator assets conformance"
  - "md-generator assets template audit"
  - "cardinal rules card conformance"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/003-assets"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author assets audit spec"
    next_safe_action: "Read all 3 assets files against skill-asset-template.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-md-generator assets/ conformance

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
| **Spec Folder** | 003-assets |
| **Parent** | 004-design-md-generator |
| **Predecessor** | `002-references` (map position only; no hard dependency, independently executable) |
| **Successor** | `004-procedures` (map position only; no hard dependency, independently executable) |
| **Phase** | 3 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`assets/` holds 3 files — `cardinal-rules-card.md`, `design-md-prompt-template.md`, `source-of-truth-router-card.md` — none of which was part of the 014 program's seed sample. Their conformance to `skill-asset-template.md` is unknown.

### Purpose
Read all 3 files against `skill-asset-template.md` section-by-section and fix any confirmed gap. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-md-generator/assets/cardinal-rules-card.md`
- `.opencode/skills/sk-design/design-md-generator/assets/design-md-prompt-template.md`
- `.opencode/skills/sk-design/design-md-generator/assets/source-of-truth-router-card.md`
- All three against `assets/skill/skill-asset-template.md`.

### Out of Scope
- `design-md-generator`'s other folders (siblings 001, 002, 004-008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/assets/*.md` | Audit (Modify if confirmed) | Diff each against `skill-asset-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 3 files exhaustively read against the template | Each file diffed section-by-section with cited evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Confirmed gaps fixed | Any real gap found under REQ-001 fixed in place |
| REQ-003 | Frontmatter enum values checked, not just field presence | `importance_tier`/`contextType` values verified against the template's allowed vocabulary |
| REQ-004 | No unrelated content rewrite | Diff shows only structural/template fixes |
| REQ-005 | `design-md-prompt-template.md` distinguished from a runtime prompt asset | Confirm this file is documentation about the prompt template, not itself consumed as executable prompt text, before applying doc-structure fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 `assets/` files pass a `skill-asset-template.md` diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `design-md-prompt-template.md` may be consumed verbatim by the generator's runtime, not just read as documentation | A structural fix could alter prompt behavior | Confirm consumption path before editing; if the backend reads this file directly, treat any edit as runtime-affecting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read of all 3 files, not a sample.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- Is `design-md-prompt-template.md` read by `backend/` at runtime, or is it purely human-facing documentation? Resolve before editing.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
