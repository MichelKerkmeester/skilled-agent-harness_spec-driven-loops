---
title: "Feature Specification: memory_index_scan Self-Maintaining Index Program [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec]"
description: "Phase-parent root for the memory_index_scan self-maintaining index program: a coalescing async scan job with self-healing orphan/move reconciliation behind a memory_health freshness surface, plus the durability work that protects the index DB it maintains."
trigger_phrases:
  - "memory index scan implementation"
  - "memory_index_scan self-maintaining index program"
  - "013 memory index phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation"
    last_updated_at: "2026-06-01T16:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase-parent root spec and child map"
    next_safe_action: "Resume 002-checkpoint-v2-file-snapshot child phase"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 60
    open_questions: []
    answered_questions: []
---

# Feature Specification: memory_index_scan Self-Maintaining Index Program

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-31 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The memory index must stay correct without operator intervention: new and changed spec docs need indexing, orphaned rows need sweeping, and packet renames/moves need reconciliation, all without flooding writers or stalling the daemon. The same index database also needs a durable rollback net so a corrupt or oversized state can be recovered.

### Purpose
Own navigation, the child-phase map, and aggregate status for the memory_index_scan self-maintaining index program. Each child phase folder owns its own planning, execution, and verification: the index runtime itself in `001-self-maintaining-index`, and the file-based checkpoint durability layer that protects it in `002-checkpoint-v2-file-snapshot`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the child phase folders for the self-maintaining index program and their aggregate status.
- Provide the navigation map from this program to each child phase folder.

### Out of Scope
- Per-child implementation detail (lives in each child phase folder).
- Phase history narration (lives in the root `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-self-maintaining-index/` | Modify | children | Index runtime: coalescing async scan, degraded-mode, orphan/move reconciliation |
| `002-checkpoint-v2-file-snapshot/` | Modify | children | File-based full-DB checkpoint durability layer |
| `spec.md`, `graph-metadata.json`, `description.json` | Modify | this | Program navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. The Status column reports child state.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-self-maintaining-index/` | Coalescing async scan job, phased lexical-first execution, single-writer concurrency, degraded-mode embedding, self-healing orphan/move reconciliation behind a memory_health freshness surface | complete (shipped) |
| 002 | `002-checkpoint-v2-file-snapshot/` | File-based full-DB checkpoint via VACUUM INTO with whole-file restore swap and schema v29 versioning | in progress |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently.
- This parent tracks aggregate progress via the map; per-child detail stays in the children.
- Deferred and abandoned children remain in place with explicit status; they are not removed.
- Use `/spec_kit:resume` on a child folder to resume it.
- Run `validate.sh --recursive` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-self-maintaining-index` | `002-checkpoint-v2-file-snapshot` | Index runtime stable before adding the durability layer that snapshots its DB | Each child validates independently |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. The active child is `002-checkpoint-v2-file-snapshot`; resume it via its folder.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
