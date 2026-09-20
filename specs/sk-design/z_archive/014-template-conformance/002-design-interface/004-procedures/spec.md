---
title: "Feature Specification: design-interface procedures conformance"
description: "Audit the 9 procedure cards under design-interface/procedures/ against skill-procedure-template.md; sampling shows strong conformance with one field-naming variance to verify."
trigger_phrases:
  - "design-interface procedures conformance"
  - "procedure card template audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/004-procedures"
    last_updated_at: "2026-07-27T16:20:08Z"
    last_updated_by: "spec-author"
    recent_action: "Sampled one card as near-conformant with a minor field-name variance"
    next_safe_action: "Read all 9 procedure cards against the required-fields table in order"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/procedures/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: design-interface procedures conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `003-assets` |
| **Successor** | `005-corpus` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`procedures/` holds 9 cards (39-44 lines each: `aesthetic-direction.md`, `component-system-inventory.md`, `deck-direction-spec.md`, `discovery-question-round.md`, `hierarchy-rhythm-review.md`, `prototype-flow-spec.md`, `tweakable-design-controls.md`, `variation-set.md`, `wireframe-exploration.md`), governed by `skill-procedure-template.md`. Reading `aesthetic-direction.md` in full against the template's §3 required-fields table found it near-conformant: correct frontmatter, correct H1+intro shape, all 7 required fields present in order, with one naming variance — it uses the field label `Owning mode` where the template's canonical label is `Owning skill/mode`. The other 8 cards were not yet read against the template.

### Purpose
Read all 9 cards against `skill-procedure-template.md` §2 (document structure/body order) and §3 (the seven required fields, in order, non-empty), confirm or correct the field-label variance across every card, and fix any other deviation found.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 9 files in `procedures/`.

### Out of Scope
- `references/`, `assets/`, `corpus/`, `scripts/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/` — sibling children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `procedures/aesthetic-direction.md` | Audit/Modify | Confirmed near-conformant; `Owning mode` label variance from template's `Owning skill/mode` |
| `procedures/component-system-inventory.md` | Audit | Not yet read against template |
| `procedures/deck-direction-spec.md` | Audit | Not yet read against template |
| `procedures/discovery-question-round.md` | Audit | Not yet read against template |
| `procedures/hierarchy-rhythm-review.md` | Audit | Not yet read against template |
| `procedures/prototype-flow-spec.md` | Audit | Not yet read against template |
| `procedures/tweakable-design-controls.md` | Audit | Not yet read against template |
| `procedures/variation-set.md` | Audit | Not yet read against template |
| `procedures/wireframe-exploration.md` | Audit | Not yet read against template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 cards read in full against `skill-procedure-template.md` §2-§3 | Per-card conformant/deviation verdict recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Field-label consistency (`Owning mode` vs `Owning skill/mode`) resolved across all 9 cards | Either every card matches the template's canonical label, or a documented exception is recorded |
| REQ-003 | Confirm all 9 cards carry the required 5-field frontmatter plus `version` | Verdict recorded per card |
| REQ-004 | Confirm no other file exists under `procedures/` beyond the 9 accounted for in scope | Fresh `find procedures -type f` matches the scope table |
| REQ-005 | Cross-references between cards (`Related Cards` sections) still resolve after any fix | `rg` spot-check across all 9 cards |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 cards carry the required 7 fields, in order, non-empty, with a consistent field-label vocabulary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renaming `Owning mode` to `Owning skill/mode` across 9 files could ripple into cross-references from `SKILL.md` §3 (procedure-card citation) | Broken citation | Grep for `Owning mode` before any bulk rename |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Resolved**: `Owning mode` is the correct, intentional field label — NOT drift. `sk-design/shared/procedure-card-schema.md` §2 (the hub-local, more specific schema that `skill-procedure-template.md`'s own text names as "the schema this template generalizes from") canonically requires `Owning mode` with the enum `design-interface | design-motion | design-md-generator | shared`, not the generic template's `Owning skill/mode`. Confirmed by running `node .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs`: all 12 cards hub-wide (including all 9 `design-interface` cards) PASS with 0 failures. No rename performed — renaming to `Owning skill/mode` would itself be the deviation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing template**: `.opencode/skills/sk-doc/create-skill/assets/skill/skill-procedure-template.md`
