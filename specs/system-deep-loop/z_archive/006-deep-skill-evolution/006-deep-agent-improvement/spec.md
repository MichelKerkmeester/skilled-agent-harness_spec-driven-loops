---
title: "Feature Specification: Deep Agent Improvement uplift + correctness + evaluator + cross-runtime + mixed-executor arc"
description: "Phase parent for 9 deep-agent-improvement sub-phases: uplift investigation in 3 phases (001-003 research / applicability / recommendations), 5 leaf packets (correctness fixes, doc-version reconciliation, evaluator hardening, cross-runtime promotion, mixed-executor adjudication), and command surface relocation."
trigger_phrases:
  - "deep-agent-improvement uplift"
  - "deep-agent-improvement correctness"
  - "deep-agent-improvement evaluator"
  - "deep-agent-improvement cross-runtime"
  - "deep-agent-improvement command relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/006-deep-agent-improvement"
    last_updated_at: "2026-05-24T06:47:43Z"
    last_updated_by: "main_agent"
    recent_action: "nested-from-flat-131-restructure"
    next_safe_action: "resume-via-cluster-children"
    blockers: []
    key_files:
      - "001-research-recent-updates/spec.md"
      - "002-applicability-analysis/spec.md"
      - "003-recommendations/spec.md"
      - "004-correctness-fixes/spec.md"
      - "005-doc-version-reconciliation/spec.md"
      - "009-command-surface-relocation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000005"
      session_id: "005-thematic-cluster"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Restructured from flat 131 root into nested thematic phase parent"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: Deep Agent Improvement uplift + correctness + evaluator + cross-runtime + mixed-executor arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | Active |
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

This cluster groups 9 sub-phases that share a single thematic focus. Before restructuring, most existed as flat siblings at the root of `116-deep-skill-evolution/`; the command relocation phase was added here because it specifically owns the deep-agent-improvement command surface. Nesting them under this thematic phase parent reduces root-level fan-out and makes the cluster's internal arc easier to follow.

### Purpose

Co-evolve deep-agent-improvement with deep-review/deep-research arcs: uplift research + 5 dimensional improvements (correctness / doc-version / evaluator / cross-runtime / mixed-executor) plus command-surface relocation.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the 9 child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 9 child phase folder(s) listed in the Phase Documentation Map below
- Per-child specifics live in each child's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` where applicable

### Out of Scope

- Modifying source code, skills, or agents (this cluster bundle does no implementation itself; all execution happens in children)
- Promoting work from another cluster into this one (cross-cluster shifts require explicit user approval)

### Files Changed (cumulative across all phases)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `005-deep-agent-improvement/NNN-*/**` | per-phase | See per-child `spec.md` §3 Files Changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus |
|-------|--------|-------|
| 001 | `001-research-recent-updates/` | 10-iter deep-research dispatch on recent arc 117-122 updates and their applicability to deep-agent-i |
| 002 | `002-applicability-analysis/` | Applicability classification table for each pattern/finding from arcs 117-122 to deep-agent-improvem |
| 003 | `003-recommendations/` | Prioritized improvement packet roadmap for deep-agent-improvement based on 10-iter research findings |
| 004 | `004-correctness-fixes/` | Packet 124: deep-agent-improvement correctness fixes |
| 005 | `005-doc-version-reconciliation/` | Packet 125: Deep-Agent-Improvement Doc Version Reconciliation |
| 006 | `006-evaluator-hardening/` | Packet 126: deep-agent-improvement evaluator hardening |
| 007 | `007-cross-runtime-promotion/` | Packet 127: deep-agent-improvement cross-runtime promotion gate |
| 008 | `008-mixed-executor-adjudication/` | Feature Specification: 128 — Deep-Agent-Improvement Mixed-Executor + Adjudication Methodology |
| 009 | `009-command-surface-relocation/` | Move `the legacy agent-improvement command` to `/deep:start-agent-improvement-loop`, make `/prompt` canonical, and remove improve command groups |

### Phase Transition Rules

- Each phase preserves the strict-validate state it had before consolidation (no per-phase re-validation required unless restructuring introduced drift)
- Cluster parent tracks aggregate progress via this map
- Use `/speckit:resume skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/[NNN-phase]/` to resume a specific phase
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
- **Phase children**: 9 folders enumerated in PHASE DOCUMENTATION MAP above
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
