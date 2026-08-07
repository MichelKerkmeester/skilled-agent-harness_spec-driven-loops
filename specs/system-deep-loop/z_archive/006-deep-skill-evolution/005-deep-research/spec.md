---
title: "Feature Specification: Deep Research uplift + ordering + uncovered + hygiene arc"
description: "Phase parent for 6 deep-research sub-phases: uplift investigation in 3 phases (001-003 research / applicability / recommendations) plus 3 leaf fixes (iteration ordering, uncovered questions tracking, hygiene fix-pack)."
trigger_phrases:
  - "deep-research uplift"
  - "deep-research iteration ordering"
  - "deep-research uncovered questions"
  - "deep-research hygiene"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/005-deep-research"
    last_updated_at: "2026-05-23T09:52:56.265976Z"
    last_updated_by: "main_agent"
    recent_action: "nested-from-flat-131-restructure"
    next_safe_action: "resume-via-cluster-children"
    blockers: []
    key_files:
      - "001-uplift-research-deep-review-changes/spec.md"
      - "002-uplift-applicability-analysis/spec.md"
      - "003-uplift-recommendations/spec.md"
      - "004-iteration-ordering-fix/spec.md"
      - "005-uncovered-questions/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000004"
      session_id: "004-thematic-cluster"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Restructured from flat 131 root into nested thematic phase parent"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: Deep Research uplift + ordering + uncovered + hygiene arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `116-deep-skill-evolution` |
| **Parent Packet** | skilled-agent-orchestration/116-deep-skill-evolution |
| **Predecessor** | n/a (cluster bundle) |
| **Successor** | None |
| **Handoff Criteria** | Each sub-phase passes `validate.sh --strict` independently |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This cluster groups 6 sub-phases that share a single thematic focus. Before restructuring, these existed as flat siblings at the root of `116-deep-skill-evolution/`. Nesting them under this thematic phase parent reduces root-level fan-out and makes the cluster's internal arc easier to follow.

### Purpose

Propagate deep-review learnings to deep-research (uplift 001-003) plus deep-research-internal fixes for iteration ordering, uncovered questions tracking, and dedup/hygiene.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the 6 child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 6 child phase folder(s) listed in the Phase Documentation Map below
- Per-child specifics live in each child's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` where applicable

### Out of Scope

- Modifying source code, skills, or agents (this cluster bundle does no implementation itself; all execution happens in children)
- Promoting work from another cluster into this one (cross-cluster shifts require explicit user approval)

### Files Changed (cumulative across all phases)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `004-deep-research/NNN-*/**` | per-phase | See per-child `spec.md` §3 Files Changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus |
|-------|--------|-------|
| 001 | `001-uplift-research-deep-review-changes/` | 10-iter deep-research dispatch hosting the research workspace. Mixed-executor: cli-devin SWE-1.6 ite |
| 002 | `002-uplift-applicability-analysis/` | Applicability classification table for all 47 changes catalogued from arc 118. Outputs: applicabilit |
| 003 | `003-uplift-recommendations/` | 3-packet follow-on roadmap closing the 5 actionable items from the 10-iter deep-research investigati |
| 004 | `004-iteration-ordering-fix/` | Feature Specification: 120 — Deep-Research Iteration Ordering Fix |
| 005 | `005-uncovered-questions/` | Packet 121 DR-003 adds deep-research uncovered question tracking in the reducer registry and dashboa |
| 006 | `006-hygiene-fix-pack/` | Packet 122 bundles deep-research negative knowledge dedup, workflow YAML script-path verification, a |

### Phase Transition Rules

- Each phase preserves the strict-validate state it had before consolidation (no per-phase re-validation required unless restructuring introduced drift)
- Cluster parent tracks aggregate progress via this map
- Use `/speckit:resume skilled-agent-orchestration/116-deep-skill-evolution/004-deep-research/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on this cluster parent to validate all its children
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- See parent `116-deep-skill-evolution/spec.md` § 4 OPEN QUESTIONS for arc-level open items.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent arc**: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/spec.md`
- **Phase children**: 6 folders enumerated in PHASE DOCUMENTATION MAP above
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
