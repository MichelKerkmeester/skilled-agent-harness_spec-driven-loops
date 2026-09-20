---
title: "Feature Specification: sk-design hallmark design system phase"
description: "Completed phase parent for five hallmark design-system adoption lanes: surgical fixes, evidence envelopes, authored cards, brand-first authoring, and measured composition retrieval."
trigger_phrases:
  - "sk-design hallmark design system phase"
  - "hallmark adoption"
  - "brand-first lane"
  - "hallmark evidence envelopes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system"
    last_updated_at: "2026-07-23T07:04:12Z"

    last_updated_by: "spec-author"
    recent_action: "Completed and reconciled all five hallmark adoption lanes"
    next_safe_action: "Validate the phase parent recursively"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: sk-design hallmark design system phase

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Complete — all five adoption lanes shipped |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Handoff Criteria** | Each adoption lane validates independently |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hallmark design system needed adopting into sk-design in a controlled way — surgical fixes first, then evidence envelopes, authored cards, brand-first authoring, and measured composition retrieval — rather than a single large change.

### Purpose
Adopt the hallmark design system across five lanes so sk-design carries hallmark's evidence-backed, brand-first behavior and measured composition retrieval, informed by the hallmark-skill research in the research phase.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five hallmark-adoption lanes: surgical fixes, evidence envelopes, authored cards, brand-first lane, measured composition and retrieval facets.

### Out of Scope
- The hallmark-skill research (owned by `../001-research/004-hallmark-design-skill-research/`).

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `004-hallmark-design-system/00[1-5]-*/` | Organize | (adoption lanes) | The five hallmark-adoption lane packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable adoption lane.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-surgical-fixes/` | Surgical hallmark fixes | **Complete** |
| 2 | `002-evidence-envelopes/` | Evidence envelopes for hallmark claims | **Complete** |
| 3 | `003-authored-cards/` | Authored hallmark cards | **Complete** |
| 4 | `004-brand-first-lane/` | Brand-first design lane | **Complete** |
| 5 | `005-measured-composition-and-retrieval-facets/` | Measured composition records and retrieval facets | **Complete** |

### Phase Transition Rules
- Each lane passes `validate.sh` independently; validate the theme with `validate.sh --recursive`.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| hallmark-skill research | adoption lanes | Research recommended the adoption shape | research synthesis |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
None. All five adoption lanes are built and independently documented.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` and `../retrospective.md`.
- **Research that drove this adoption:** `../001-research/004-hallmark-design-skill-research/`.
- **Graph Metadata:** `graph-metadata.json`.
