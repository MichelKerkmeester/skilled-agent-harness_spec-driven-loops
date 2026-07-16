---
title: "Feature Specification: Research and Doctrine (Phase Parent)"
description: "Phase-parent for the research-derived doctrine adoptions: peck verification discipline and gem-team agent I/O contracts."
trigger_phrases:
  - "027 research and doctrine"
  - "peck teachings adoption"
  - "gem team agent io contract"
  - "self-check templates"
  - "reviewer benchmark substrate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/001-research-and-doctrine"
    last_updated_at: "2026-06-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Both child phase-parents shipped (peck teachings + gem-team); grandchildren complete"
    next_safe_action: "Resume or validate a child phase folder if further work is needed"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration narratives, renamed-from, X to Y history
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Research and Doctrine (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 027 program drew on external research sources whose doctrine had to be adopted into Spec Kit process and agent surfaces. These adoptions share a research provenance and a process-quality target, so they belong under one themed parent that points to the per-source child phases.

### Purpose
Own the research-and-doctrine child phases (peck teachings, gem-team agent I/O contract) so each can be resumed and validated independently while the parent keeps the phase map and handoff order visible.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Peck-derived documentation/process improvements (self-check templates, current-state discipline, constitutional review, reviewer benchmark, verification discipline, acceptance-coverage gate).
- Gem-team typed agent I/O contract, scoped pre-execution gates, and advisory reviewer/drift fields.
- Root-level child phase routing and resume wayfinding for this theme.

### Out of Scope
- Implementation detail at the parent level.
- Memory-store, advisor/code-graph, shared-infrastructure, or verification work (other tracks).

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| child phase folders `[0-9][0-9][0-9]-*/` | Modify/Create | all | Per-phase implementation lives in the child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-peck-teachings-adoption/` | Peck adoption phase-parent — README teachings T1-T4 + source-pass T5-T10 (reviewer benchmark, verification discipline, acceptance-coverage gate); all 7 children shipped | Phase Parent |
| 002 | `002-gem-team-adoption/` | Gem-team adoption phase-parent — typed agent I/O contract, scoped pre-execution gates, advisory reviewer/drift fields; all 3 children shipped | Phase Parent |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| (per-child) | (next child) | Each child ships and validates independently under tolerant policy | Per-child strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open at the parent level; per-phase questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
