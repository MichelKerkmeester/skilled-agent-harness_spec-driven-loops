---
title: "Feature Specification: Deep Loop runtime isolation arc"
description: "Phase parent for 9 deep-loop runtime isolation sub-phases: core-isolation deliberation (001), then full isolation in 8 phases (002-009) covering scaffold, migration, shim+db relocation, MCP tool removal, YAML workflow update, doctor playbook, test migration, and verification closeout."
trigger_phrases:
  - "deep-loop runtime isolation"
  - "deep-loop-runtime skill"
  - "deep-loop full isolation no-mcp"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime"
    last_updated_at: "2026-05-23T09:52:56.265976Z"
    last_updated_by: "main_agent"
    recent_action: "nested-from-flat-131-restructure"
    next_safe_action: "resume-via-cluster-children"
    blockers: []
    key_files:
      - "001-core-isolation-deliberation/spec.md"
      - "002-skill-scaffold/spec.md"
      - "003-lib-runtime-migration/spec.md"
      - "004-script-shim-db-relocation/spec.md"
      - "005-mcp-tool-surface-removal/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000003"
      session_id: "003-thematic-cluster"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Restructured from flat 131 root into nested thematic phase parent"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: Deep Loop runtime isolation arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | Complete |
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

This cluster groups 9 sub-phases that share a single thematic focus. Before restructuring, these existed as flat siblings at the root of `116-deep-skill-evolution/`. Nesting them under this thematic phase parent reduces root-level fan-out and makes the cluster's internal arc easier to follow.

### Purpose

Isolate the deep-loop runtime from system-spec-kit into its own peer skill (.opencode/skills/deep-loop-runtime) — deliberation + 8-phase full isolation.

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
| `003-deep-loop-runtime/NNN-*/**` | per-phase | See per-child `spec.md` §3 Files Changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus |
|-------|--------|-------|
| 001 | `001-core-isolation-deliberation/` | AI Council deliberation evaluating whether to relocate 18 deep-loop / coverage-graph runtime files f |
| 002 | `002-skill-scaffold/` | Feature Specification: 118/001 — Runtime Skill Scaffold |
| 003 | `003-lib-runtime-migration/` | Feature Specification: Lib Runtime Migration |
| 004 | `004-script-shim-db-relocation/` | Feature Specification: 003 — Script Shim + DB Relocation |
| 005 | `005-mcp-tool-surface-removal/` | Feature Specification: 004 — MCP Tool Surface Removal |
| 006 | `006-yaml-workflow-update/` | Feature Specification: 118/005 — YAML Workflow Update (MCP → bash script) |
| 007 | `007-collateral-doctor-playbook/` | Feature Specification: 118/006 — Update /doctor + system-code-graph Playbook Collateral |
| 008 | `008-test-migration/` | Feature Specification: 118/007 — Test Migration (Split by Responsibility) |
| 009 | `009-verification-changelog-closeout/` | Feature Specification: Verification + Changelog + Closeout |

### Phase Transition Rules

- Each phase preserves the strict-validate state it had before consolidation (no per-phase re-validation required unless restructuring introduced drift)
- Cluster parent tracks aggregate progress via this map
- Use `/speckit:resume skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/[NNN-phase]/` to resume a specific phase
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
