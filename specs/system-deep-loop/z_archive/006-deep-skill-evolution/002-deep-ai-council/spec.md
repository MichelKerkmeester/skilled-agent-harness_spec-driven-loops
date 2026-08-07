---
title: "Feature Specification: AI Council cluster (rename + shared runtime + iterative multi-topic)"
description: "Phase parent for 13 ai-council related sub-phases: skill+agent rename across 4 runtimes (001-006), shared-runtime deliberation (007), and iterative multi-topic upgrade (008-013)."
trigger_phrases:
  - "ai-council rename arc"
  - "sk-ai-council rename"
  - "ai-council iterative multi-topic"
  - "ai-council shared runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council"
    last_updated_at: "2026-05-23T09:52:56.265976Z"
    last_updated_by: "main_agent"
    recent_action: "nested-from-flat-131-restructure"
    next_safe_action: "resume-via-cluster-children"
    blockers: []
    key_files:
      - "001-rename-preflight-and-plan/spec.md"
      - "002-rename-sk-skill/spec.md"
      - "003-rename-agent-4-runtime/spec.md"
      - "004-rename-sibling-edges-typescript/spec.md"
      - "005-rename-root-docs-hooks-index/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000001"
      session_id: "001-thematic-cluster"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Restructured from flat 131 root into nested thematic phase parent"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: AI Council cluster (rename + shared runtime + iterative multi-topic)

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

This cluster groups 13 sub-phases that share a single thematic focus. Before restructuring, these existed as flat siblings at the root of `116-deep-skill-evolution/`. Nesting them under this thematic phase parent reduces root-level fan-out and makes the cluster's internal arc easier to follow.

### Purpose

Cover all sk-ai-council co-evolution work: the rename refactor (deep-ai-council → sk-ai-council), the shared-runtime deliberation, and the iterative multi-topic upgrade.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the 13 child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 13 child phase folder(s) listed in the Phase Documentation Map below
- Per-child specifics live in each child's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` where applicable

### Out of Scope

- Modifying source code, skills, or agents (this cluster bundle does no implementation itself; all execution happens in children)
- Promoting work from another cluster into this one (cross-cluster shifts require explicit user approval)

### Files Changed (cumulative across all phases)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-ai-council/NNN-*/**` | per-phase | See per-child `spec.md` §3 Files Changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus |
|-------|--------|-------|
| 001 | `001-rename-preflight-and-plan/` | Feature Specification: 115/001 — preflight scope-map |
| 002 | `002-rename-sk-skill/` | Feature Specification: 115/002 — skill dir rename |
| 003 | `003-rename-agent-4-runtime/` | Feature Specification: 115/003 — agent runtime rename |
| 004 | `004-rename-sibling-edges-typescript/` | Feature Specification: 115/004 — cross-skill edges + TypeScript |
| 005 | `005-rename-root-docs-hooks-index/` | Feature Specification: 115/005 — root docs + hooks + skills index |
| 006 | `006-rename-reindex-validate/` | Feature Specification: 115/006 — reindex + validate + reconcile |
| 007 | `007-shared-runtime-deliberation/` | Spec: sk-ai-council Shared Runtime Deliberation |
| 008 | `008-iterative-research-and-architecture/` | Feature Specification: Deep AI Council Research + Architecture Design |
| 009 | `009-iterative-runtime-primitive-extraction/` | Phase 002: extract or adapt council-compatible primitives from deep-loop-runtime per ADR-001, withou |
| 010 | `010-iterative-per-topic-multi-round/` | Feature Specification: Per-Topic Multi-Round Orchestration |
| 011 | `011-iterative-session-findings-registry/` | Feature Specification: Multi-Topic Session and Findings Registry |
| 012 | `012-iterative-command-and-skill-wiring/` | Feature Specification: Command and Skill Wiring |
| 013 | `013-iterative-parity-cost-docs/` | Feature Specification: Parity Tests, Cost Guards, and Docs |

### Phase Transition Rules

- Each phase preserves the strict-validate state it had before consolidation (no per-phase re-validation required unless restructuring introduced drift)
- Cluster parent tracks aggregate progress via this map
- Use `/speckit:resume skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/[NNN-phase]/` to resume a specific phase
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
- **Phase children**: 13 folders enumerated in PHASE DOCUMENTATION MAP above
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
