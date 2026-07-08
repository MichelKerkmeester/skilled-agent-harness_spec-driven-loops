---
title: "Feature Specification: sk-deep-research evolution"
description: "Group the archived `sk-deep-research` evolution packets as nested phases covering creation, refinement, playbook work, upgrade research, review-mode extraction, path migration, and later deep-loop improvements. This parent organizes the historical sequence; implementation detail remains in the child phase folders."
trigger_phrases:
  - "sk deep research evolution"
  - "deep research evolution archive"
  - "sk-deep-research evolution series"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/044-sk-deep-research-evolution"
    last_updated_at: "2026-07-08T00:00:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Created archive phase parent for the sk-deep-research evolution series"
    next_safe_action: "Validate the parent recursively after metadata regeneration"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: sk-deep-research evolution

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Archived historical bundle; child docs retain mixed legacy status labels |
| **Created** | 2026-03-18 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `system-deep-loop` |
| **Parent Packet** | `system-deep-loop` |
| **Handoff Criteria** | Each child phase remains independently inspectable; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The archived `sk-deep-research` history spans multiple adjacent packets that describe the skill's creation, refinement, testing surface, first upgrade research, review-mode work, path-layout migration, review split, and later runtime-improvement bundles.

### Purpose
Group the archived `sk-deep-research` evolution series as one phase parent so the historical sequence can be browsed from a single documentation map while keeping each child packet as the source of truth for its own plans, tasks, decisions, and completion evidence.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All plans, task breakdowns, checklists, decisions, and continuity live in the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The archived `sk-deep-research` creation, refinement, testing-playbook, first-upgrade, review-mode, review-folder, path-migration, review-split, review-improvement-1, and review-improvement-2 child packets.
- Recursive validation of the parent and child phase structure.
- Metadata and graph identity for the phase parent and moved children.

### Out of Scope
- The unrelated `010-sk-recursive-agent-loop` archive packet, which remains outside this parent.
- Rewriting child packet conclusions, plans, tasks, implementation summaries, research iterations, or review artifacts.
- Changing the shared archive grandparent graph metadata during parallel archive work.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This parent authors only `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives inside the phase children. Resume a specific phase with `/speckit:resume system-deep-loop/z_archive/044-sk-deep-research-evolution/[NNN-phase]/`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-sk-deep-research-creation/` | The current `/speckit:research` workflow is single-pass only | v1 Complete (incl. Phase 5.5 legacy removal), v2 Planned |
| 002 | `002-sk-deep-research-refinement/` | The sk-deep-research system (v1) is functional but has 18 documented improvement proposals (from spec 023) that need rigorous validation, | Draft |
| 003 | `003-sk-deep-research-testing-playbook/` | `sk-deep-research` documents a rich operator-visible surface: the setup prompt, spec-folder choice, `:auto` and `:confirm` modes, | Approved |
| 004 | `004-sk-deep-research-first-upgrade/` | The first sk-deep-research upgrade needed grounded input from comparable autonomous research systems | Complete |
| 005 | `005-sk-deep-research-review-mode/` | Currently, reviewing spec folders, code changes, skills, and their cross-references for release readiness is a manual, single-pass process | In Progress |
| 006 | `006-sk-deep-research-review-folders/` | Review mode is currently modeled as a `scratch/` workflow | Approved |
| 007 | `007-sk-deep-research-path-migration/` | Deep research has an inconsistent packet contract | Approved |
| 008 | `008-sk-deep-research-review-split/` | `sk-deep-research` previously handled both investigation workflows and iterative review-mode auditing | Review |
| 009 | `009-sk-deep-research-review-improvement-1/` | `sk-deep-research` and `sk-deep-review` had sound packet-first loop architectures but implicit contracts: lineage and lifecycle branches were | Complete |
| 010 | `010-sk-deep-research-review-improvement-2/` | The deep-loop stack still needs stronger runtime truth, better semantic coverage signals, bounded large-target orchestration, and safer offline tuning | Implemented (phases 1–8) + post-phase-008 closing-audit remediation (Lanes 1–5) closed |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before being treated as done.
- This parent tracks aggregate progress via the map.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for this archived parent; child packets retain their original open-question records.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../` (`system-deep-loop`)
- **Graph Metadata**: see `graph-metadata.json` for `derived.last_active_child_id`
