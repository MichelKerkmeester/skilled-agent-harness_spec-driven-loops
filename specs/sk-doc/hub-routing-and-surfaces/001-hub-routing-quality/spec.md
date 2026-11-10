---
title: "Feature Specification: Hub routing completeness and clarity"
description: "Measures hub routing reachability and improves skill routing clarity."
trigger_phrases:
  - "hub routing completeness"
  - "realistic prompt routing replay"
  - "skill router clarity"
  - "single source routing decisions"
  - "skill documentation routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/hub-routing-and-surfaces/001-hub-routing-quality"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-051-hub-routing-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Hub routing completeness and clarity

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 051-hub-routing-quality |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A realistic prompt audit found that only 21 of 48 phrasings reached the right mode, with dozens of diagnosed findings still open. Skill documents also repeat routing decisions in several places and use much of each mode guide on routing before the reader reaches operating guidance. Routing is incomplete and hard to follow.

### Purpose
Measure routing with realistic prompts and fix each diagnosed finding or record its disposition. Give every skill and hub one clear source for each routing decision. Keep each routing shape suited to its skill type and write prose the reader can act on while preserving the dependent tooling that reads the current shape.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure realistic hub routes. Fix diagnosed findings or record their disposition, then remeasure the routes.
- Give skills and hubs one authoritative source per routing decision with clear, type-appropriate instructions.

### Out of Scope
- Changing product behavior unrelated to hub routing and skill documentation clarity.

### Files to Change
Each row identifies one child phase and its purpose.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| specs/sk-doc/hub-routing-and-surfaces/001-hub-routing-quality/001-routing-completeness/ | Phase | 001-routing-completeness | Measures routing and closes diagnosed findings. |
| specs/sk-doc/hub-routing-and-surfaces/001-hub-routing-quality/002-skill-routing-and-clarity/ | Phase | 002-skill-routing-and-clarity | Sets one routing source and improves clarity. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-routing-completeness/` | Measure route reachability and close diagnosed hub findings | Complete |
| 2 | `002-skill-routing-and-clarity/` | Give skills clear routing ownership and readable instructions | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use /speckit:resume with the parent and child folder to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-routing-completeness | 002-skill-routing-and-clarity | 001-routing-completeness validates on its own | validate.sh --strict on 001-routing-completeness |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- 002-skill-routing-and-clarity remains In Progress.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See each child folder for its per-phase spec.md, plan.md and tasks.md.
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for hub routing completeness and clarity.
<!-- /ANCHOR:requirements -->
