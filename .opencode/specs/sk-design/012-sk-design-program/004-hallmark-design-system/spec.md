---
title: "Feature Specification: sk-design hallmark design system phase"
description: "Phase parent for hallmark design-system adoption — surgical fixes, evidence envelopes, authored cards, and the brand-first lane — that brought the hallmark design system into sk-design."
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
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author hallmark theme phase-parent"
    next_safe_action: "Regenerate metadata; validate --recursive"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
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
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: sk-design hallmark design system phase

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Planned — the four adoption lanes are specced but not yet built |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/012-sk-design-program` |
| **Handoff Criteria** | Each adoption lane validates independently |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hallmark design system needed adopting into sk-design in a controlled way — surgical fixes first, then evidence envelopes, authored cards, and a brand-first lane — rather than a single large change.

### Purpose
Adopt the hallmark design system across four lanes so sk-design carries hallmark's evidence-backed, brand-first design behavior, informed by the hallmark-skill research in the research phase.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The four hallmark-adoption lanes: surgical fixes, evidence envelopes, authored cards, brand-first lane.

### Out of Scope
- The hallmark-skill research (owned by `../001-research/004-hallmark-design-skill-research/`).

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `004-hallmark-design-system/00[1-4]-*/` | Organize | (adoption lanes) | The four hallmark-adoption lane packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable adoption lane.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-surgical-fixes/` | Surgical hallmark fixes | **Planned** |
| 2 | `002-evidence-envelopes/` | Evidence envelopes for hallmark claims | **Planned** |
| 3 | `003-authored-cards/` | Authored hallmark cards | **Planned** |
| 4 | `004-brand-first-lane/` | Brand-first design lane | **Planned** |

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
- The four adoption lanes are specced but not yet built — surfaced in the program `retrospective.md` as planned-but-missed work.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` and `../retrospective.md`.
- **Research that drove this adoption:** `../001-research/004-hallmark-design-skill-research/`.
- **Graph Metadata:** `graph-metadata.json`.
