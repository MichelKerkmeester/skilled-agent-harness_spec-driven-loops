---
title: "Feature Specification: Frontmatter contract owner and the description budget"
description: "Sets ownership for frontmatter rules and keeps skill and agent descriptions within their project budget."
trigger_phrases:
  - "frontmatter contract owner"
  - "sk-create-frontmatter mode"
  - "skill description budget"
  - "agent description limits"
  - "routing token safe trims"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/001-frontmatter-and-description-budget"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-049-frontmatter-and-description-budget"
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

# Feature Specification: Frontmatter contract owner and the description budget

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-01 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 049-frontmatter-and-description-budget |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six modes emitted frontmatter without one mode owning the rules, leaving the shared contract without a clear maintainer. Separately, authored skill and agent descriptions exceeded their project budget, while the audit described the wrong counted surface and two references named a rejected doctor invocation.

### Purpose
Give the frontmatter contract an owning mode and have producers cite it. Bring authored descriptions within the project budget without losing routing terms. Have the audit state which surface it counts and correct the two rejected invocation references.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create sk-create-frontmatter as the owner of frontmatter rules and repoint producers and validators.
- Trim authored skill and agent descriptions without losing routing terms. Update the audit scope and correct two references to rejected doctor invocations.

### Out of Scope
- Changing the frontmatter rules beyond establishing their owner.
- Changing doctor routing behavior or editing descriptions outside the budget work.

### Files to Change
Each row identifies one child phase and its purpose.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| specs/sk-doc/document-standards/001-frontmatter-and-description-budget/001-sk-create-frontmatter/ | Phase | 001-sk-create-frontmatter | Establishes the frontmatter owner mode and producer routing. |
| specs/sk-doc/document-standards/001-frontmatter-and-description-budget/002-description-budget/ | Phase | 002-description-budget | Budgets authored descriptions and corrects audit scope and references. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-sk-create-frontmatter/` | Frontmatter mode ownership and producer routing | Complete |
| 2 | `002-description-budget/` | Description limits, audit scope and valid doctor references | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use /speckit:resume with the parent and child folder to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sk-create-frontmatter | 002-description-budget | 001-sk-create-frontmatter validates on its own | validate.sh --strict on 001-sk-create-frontmatter |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See each child folder for its per-phase spec.md, plan.md and tasks.md.
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for frontmatter contract owner and the description budget.
<!-- /ANCHOR:requirements -->
