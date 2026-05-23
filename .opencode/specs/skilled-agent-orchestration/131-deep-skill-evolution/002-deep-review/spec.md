---
title: "Feature Specification: Deep Review complexity-hardening arc"
description: "Phase parent for 8 deep-review complexity hardening sub-phases: research synthesis, seeded fixture harness, schema + prompt contract, validator v2 enforcement, search ledger persistence, candidate saturation gates, ledger-led graph vocabulary, and playbooks + calibration."
trigger_phrases:
  - "deep-review complexity arc"
  - "deep-review schema v2"
  - "deep-review search ledger"
  - "deep-review candidate saturation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review"
    last_updated_at: "2026-05-23T09:52:56.265976Z"
    last_updated_by: "main_agent"
    recent_action: "nested-from-flat-131-restructure"
    next_safe_action: "resume-via-cluster-children"
    blockers: []
    key_files:
      - "001-complexity-research-synthesis/spec.md"
      - "002-complexity-seeded-fixture-harness/spec.md"
      - "003-complexity-schema-prompt-contract/spec.md"
      - "004-complexity-validator-v2-enforcement/spec.md"
      - "005-complexity-search-ledger-persistence/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000002"
      session_id: "002-thematic-cluster"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Restructured from flat 131 root into nested thematic phase parent"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: Deep Review complexity-hardening arc

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
| **Parent Spec** | `131-deep-skill-evolution` |
| **Parent Packet** | skilled-agent-orchestration/131-deep-skill-evolution |
| **Predecessor** | n/a (cluster bundle) |
| **Successor** | None |
| **Handoff Criteria** | Each sub-phase passes `validate.sh --strict` independently |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This cluster groups 8 sub-phases that share a single thematic focus. Before restructuring, these existed as flat siblings at the root of `131-deep-skill-evolution/`. Nesting them under this thematic phase parent reduces root-level fan-out and makes the cluster's internal arc easier to follow.

### Purpose

Take deep-review search-depth hardening from research synthesis through staged rollout (schema + validator + ledger + saturation + calibration).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the 8 child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 8 child phase folder(s) listed in the Phase Documentation Map below
- Per-child specifics live in each child's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` where applicable

### Out of Scope

- Modifying source code, skills, or agents (this cluster bundle does no implementation itself; all execution happens in children)
- Promoting work from another cluster into this one (cross-cluster shifts require explicit user approval)

### Files Changed (cumulative across all phases)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-deep-review/NNN-*/**` | per-phase | See per-child `spec.md` §3 Files Changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus |
|-------|--------|-------|
| 001 | `001-complexity-research-synthesis/` | Feature Specification: 116/001 — Deep Review Complexity Research Synthesis |
| 002 | `002-complexity-seeded-fixture-harness/` | Feature Specification: 116/002 - Seeded Fixture Harness |
| 003 | `003-complexity-schema-prompt-contract/` | Feature Specification: 116/003 - Review-Depth Schema and Prompt Contract |
| 004 | `004-complexity-validator-v2-enforcement/` | Feature Specification: 116/004 — Validator v2 Enforcement |
| 005 | `005-complexity-search-ledger-persistence/` | Feature Specification: 116/005 — Search Ledger Persistence and Reporting |
| 006 | `006-complexity-candidate-saturation-gates/` | Feature Specification: 116/006 - Candidate Saturation and Graphless Gates |
| 007 | `007-complexity-ledger-led-graph-vocab/` | Feature Specification: 116/007 - Ledger-Led Graph Vocabulary |
| 008 | `008-complexity-playbooks-calibration/` | Manual testing playbook scenarios for the v2 review-depth contract; deep-review SKILL.md version bum |

### Phase Transition Rules

- Each phase preserves the strict-validate state it had before consolidation (no per-phase re-validation required unless restructuring introduced drift)
- Cluster parent tracks aggregate progress via this map
- Use `/speckit:resume skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on this cluster parent to validate all its children
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- See parent `131-deep-skill-evolution/spec.md` § 4 OPEN QUESTIONS for arc-level open items.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent arc**: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md`
- **Phase children**: 8 folders enumerated in PHASE DOCUMENTATION MAP above
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
