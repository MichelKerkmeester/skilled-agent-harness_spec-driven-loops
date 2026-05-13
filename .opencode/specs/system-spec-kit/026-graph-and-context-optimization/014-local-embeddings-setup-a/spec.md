---
title: "Feature Specification: Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory"
description: "Phase parent for Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory"
trigger_phrases:
  - "014-local-embeddings-setup-a"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/014-local-embeddings-setup-a"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/014-local-embeddings-setup-a |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phased decomposition tracks Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory across independently executable child phase folders.

### Purpose
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-prefix-registry-architecture/ | [Phase 1 scope] | Pending |
| 2 | 002-model-installation-and-compat/ | [Phase 2 scope] | Pending |
| 3 | 003-mcp-config-rollout/ | [Phase 3 scope] | Pending |
| 4 | 004-vec-store-rebuild/ | [Phase 4 scope] | Pending |
| 5 | 005-q4-quantization/ | [Phase 5 scope] | Pending |
| 6 | 006-bge-m3-hybrid-evaluation/ | [Phase 6 scope] | Pending |
| 7 | 007-voyage-cleanup-and-egress-monitoring/ | [Phase 7 scope] | Pending |
| 8 | 008-finalize-and-commit/ | [Phase 8 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-prefix-registry-architecture | 002-model-installation-and-compat | [Criteria TBD] | [Verification TBD] |
| 002-model-installation-and-compat | 003-mcp-config-rollout | [Criteria TBD] | [Verification TBD] |
| 003-mcp-config-rollout | 004-vec-store-rebuild | [Criteria TBD] | [Verification TBD] |
| 004-vec-store-rebuild | 005-q4-quantization | [Criteria TBD] | [Verification TBD] |
| 005-q4-quantization | 006-bge-m3-hybrid-evaluation | [Criteria TBD] | [Verification TBD] |
| 006-bge-m3-hybrid-evaluation | 007-voyage-cleanup-and-egress-monitoring | [Criteria TBD] | [Verification TBD] |
| 007-voyage-cleanup-and-egress-monitoring | 008-finalize-and-commit | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which child phase should execute first?
- What handoff criteria must each child satisfy?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
