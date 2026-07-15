---
title: "Feature Specification: Scouted Bugfix Train"
description: "Phase parent for the verify-first scouted bugfix batches in the 026 release-and-program-cleanup track. Groups the scout -> gpt-5.5-fast confirm -> implement-and-test batches that remediate drift, defects, and refinements across the spec-kit subsystems."
trigger_phrases:
  - "scouted bugfix train"
  - "verify-first bugfix batches"
  - "scouted bugfix batch"
  - "026 scouted bugfix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train"
    last_updated_at: "2026-06-03T00:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Batches 1-5 shipped via verify-first scout-confirm-fix pipeline"
    next_safe_action: "Land scouted bugfix batch-4 as 004 under this train"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000011"
      session_id: "010-scouted-bugfix-train-2026-06-03"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md (these live in child phase folders)
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose, sub-phase list, what needs done
-->

# Feature Specification: Scouted Bugfix Train

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-03 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 026 program subsystems (memory MCP, code-graph, skill-advisor, deep-loop runtime, and the cli executors) accumulate latent drift, small correctness defects, and refinement opportunities that no single feature packet owns. They are best remediated in disciplined, repeatable batches rather than one-off fixes.

### Purpose

Run a verify-first bugfix pipeline as a repeatable train: scout the codebase for candidate defects, confirm each with an independent gpt-5.5-fast deep-dive (refuting the false or over-stated headlines), implement and test only the confirmed mechanical fixes, then ship. Each batch is an independently executable child phase.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify-first scouted bugfix batches: scout -> confirm -> adversarial verify -> implement-and-test -> ship.
- Cross-subsystem defects in the spec-kit memory MCP, code-graph, skill-advisor, deep-loop runtime, and cli surfaces.

### Out of Scope

- Product or policy decisions surfaced during scouting (tracked separately, not auto-fixed).
- Security changes that alter persisted data shape or require a migration.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| spec-kit subsystem source + tests | Modify | 001-003 | Confirmed mechanical fixes per batch, each with a regression test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-scouted-bugfix-batch-1/` | First verify-first batch (security + MCP defects) | Complete |
| 002 | `002-scouted-bugfix-batch-2/` | Second batch (chunking, deep-loop, embeddings, vector-index, code-graph) | Complete |
| 003 | `003-scouted-bugfix-batch-3/` | Third batch (stress-test isolation, launcher TOCTOU, memory-search gating, schema) | Complete |
| 004 | `004-scouted-bugfix-batch-4/` | Fourth batch (token-metrics, anchor-miss, formatAgeString, shadow gate, adapter, graph-metadata-shape, cli auth, token-budget) | Complete |
| 005 | `005-scouted-bugfix-batch-5/` | Fifth batch (D4-R grader dim_id, handover freshness aliases, updatePhaseParentPointer Zod) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Independent batches, no hard dependency | Each validates standalone |
| 002 | 003 | Independent batches, no hard dependency | Each validates standalone |
| 003 | 004 | Independent batches, no hard dependency | Each validates standalone |
| 004 | 005 | Independent batches, no hard dependency | Each validates standalone |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-scouted-bugfix-batch-1/`, `002-scouted-bugfix-batch-2/`, `003-scouted-bugfix-batch-3/`, `004-scouted-bugfix-batch-4/`, `005-scouted-bugfix-batch-5/`
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json`
