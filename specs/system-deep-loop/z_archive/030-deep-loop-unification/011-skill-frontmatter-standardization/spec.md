---
title: "Feature Specification: skill-frontmatter-standardization"
description: "Organizes the five deep-loop skill frontmatter alignment phases that applied the canonical reference/asset frontmatter contract across deep-ai-council, deep-improvement, deep-loop-runtime, deep-research, and deep-review."
trigger_phrases:
  - "deep loop skill frontmatter standardization"
  - "deep loop frontmatter campaign"
  - "nested deep loop frontmatter phases"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/011-skill-frontmatter-standardization"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Grouped five completed deep-loop skill frontmatter alignment phases under a phase parent"
    next_safe_action: "Validate recursively; grandparent children update deferred to orchestrator"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: skill-frontmatter-standardization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `system-deep-loop` |
| **Parent Packet** | `system-deep-loop` |
| **Handoff Criteria** | Each child phase validates independently; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop skill family has five completed frontmatter-alignment phases, each covering one deep-loop sub-skill and the same canonical reference/asset frontmatter contract. The parent needs to present the coordinated program as a phase map while leaving implementation detail inside each child phase.

### Purpose
Track the deep-loop skill frontmatter standardization program as one phase parent with five independently validated child phases: deep-ai-council, deep-improvement, deep-loop-runtime, deep-research, and deep-review.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All plans, task breakdowns, checklists, decisions, and continuity live in the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five deep-loop sub-skill frontmatter alignment phases listed in the Phase Documentation Map.
- Parent-level recursive validation of the child phase folders.
- Parent metadata for phase-parent discovery and resume routing.

### Out of Scope
- Rewriting child implementation history, task breakdowns, checklists, or decisions.
- Changing skill reference or asset frontmatter content.
- Updating the `system-deep-loop` grandparent graph metadata; the orchestration session owns that shared edit.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This parent authors only `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives inside the phase children. Resume a specific phase with `/speckit:resume system-deep-loop/030-deep-loop-unification/011-skill-frontmatter-standardization/[NNN-phase]/`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-deep-ai-council-frontmatter-alignment/` | deep-ai-council reference/asset frontmatter is inconsistent with the repo-wide contract: 15 of 15 references and 2 of 3 assets carry the detailed | complete |
| 002 | `002-deep-improvement-frontmatter-alignment/` | deep-improvement reference/asset frontmatter is inconsistent with the repo-wide contract: 17 of 23 references and 8 of 11 assets carry the detailed | complete |
| 003 | `003-deep-loop-runtime-frontmatter-alignment/` | deep-loop-runtime reference/asset frontmatter is inconsistent with the repo-wide contract: 4 of 4 references and 0 of 0 assets carry the detailed | complete |
| 004 | `004-deep-research-frontmatter-alignment/` | deep-research reference/asset frontmatter is inconsistent with the repo-wide contract: 0 of 13 references and 0 of 2 assets carry the detailed | complete |
| 005 | `005-deep-review-frontmatter-alignment/` | deep-review reference/asset frontmatter is inconsistent with the repo-wide contract: 3 of 10 references and 0 of 2 assets carry the detailed | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before being treated as done.
- This parent tracks aggregate progress via the map.
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
- **Graph Metadata**: see `graph-metadata.json` for `derived.last_active_child_id`
