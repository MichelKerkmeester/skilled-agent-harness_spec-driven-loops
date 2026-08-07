---
title: "Feature Specification: deep-loop skill README standardization"
description: "Group the archived deep-loop skill README standardization phases for the deep-ai-council, deep-context, deep-improvement, deep-loop-runtime, deep-research and deep-review README rewrites. This parent organizes the completed child phase folders and their independent validation records."
trigger_phrases:
  - "deep-loop readme standardization"
  - "skill readme standardization campaign"
  - "deep skill readme batch"
importance_tier: "archived"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-skill-readme-standardization"
    last_updated_at: "2026-07-08T00:00:00.000Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Created archived phase parent for the completed deep-loop skill README standardization batch"
    next_safe_action: "Archive lookup via child phase folders"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: deep-loop skill README standardization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `system-deep-loop` |
| **Parent Packet** | `system-deep-loop` |
| **Handoff Criteria** | Each child phase remains complete and validates independently; this parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The archived deep-loop skill README standardization work spans six completed child phases, one for each deep-loop sub-skill README that needed a problem-first narrative entry point instead of a tabular reference-card presentation.

### Purpose
Group the completed README standardization phases for the deep-loop sub-skills so the archived child specifications, plans, tasks, implementation summaries and validation records can be resumed as one coherent historical batch.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All plans, task breakdowns, checklists, decisions, and continuity live in the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six archived deep-loop skill README rewrite phases for deep-ai-council, deep-context, deep-improvement, deep-loop-runtime, deep-research and deep-review.
- Parent-level navigation across the completed child phase folders.
- Recursive validation of this parent and its child phases.

### Out of Scope
- Reopening or changing the shipped README conclusions in the child phases.
- Changing any deep-loop skill behavior, SKILL.md contract or runtime implementation.
- Updating the shared grandparent archive graph metadata, which is handled by the orchestrating session.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This parent authors only `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives inside the phase children. Resume a specific phase with `/speckit:resume system-deep-loop/z_archive/020-skill-readme-standardization/[NNN-phase]/`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-deep-ai-council-readme/` | The deep-ai-council README is a tabular reference card with no problem-first entry point | complete |
| 002 | `002-deep-context-readme/` | The deep-context README is a tabular reference card with no problem-first entry point, and its Key Statistics carry stale facts: version 1.0.0 (the | complete |
| 003 | `003-deep-improvement-readme/` | The deep-improvement README is a tabular reference card with no problem-first entry point, and its stats carry stale facts (a feature-catalog count of | complete |
| 004 | `004-deep-loop-runtime-readme/` | The deep-loop-runtime README is a tabular reference card with no problem-first entry point, and its Key Features table carries stale counts (27 vitest | complete |
| 005 | `005-deep-research-readme/` | The deep-research README is a tabular reference card with a buried Key Statistics block and no problem-first entry point | complete |
| 006 | `006-deep-review-readme/` | The deep-review README is a tabular reference card with a buried Key Statistics block and no problem-first entry point | complete |

### Phase Transition Rules

- Each child phase validates independently before being treated as complete.
- This parent tracks aggregate archive status via the map.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../` (`system-deep-loop`)
- **Graph Metadata**: see `graph-metadata.json`
