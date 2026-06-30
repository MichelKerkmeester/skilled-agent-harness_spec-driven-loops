---
title: "Feature Specification: Docs and Stress-Test Refresh [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/spec]"
description: "Phase-parent root for refreshing the system-spec-kit documentation cluster and stress harness to reflect the shipped 013 memory-index-scan roadmap (phases 001-005) and the 128 sk-git worktree convention: manual testing playbook, feature catalog, README cluster, and a new durability stress domain."
trigger_phrases:
  - "docs and stress test refresh"
  - "manual testing playbook feature catalog readme stress refresh"
  - "014 docs stress test phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh"
    last_updated_at: "2026-06-02T11:35:15Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Four child phases authored and validated strict-clean (0 errors / 0 warnings)"
    next_safe_action: "None binding; docs + stress refresh complete and committed to main"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Docs and Stress-Test Refresh

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (shipped) |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit documentation cluster and stress harness lag the shipped runtime. The 013 memory-index-scan roadmap (phases 001-005) added checkpoint-v2 file snapshots, the MCP front-proxy, memory_save enrichment (schema v30), and the post-restore rebuild sentinel, while the 128 work introduced the sk-git worktree convention. The manual testing playbook, feature catalog, README cluster, and stress harness do not yet describe these capabilities, so operators cannot exercise or discover them from the docs alone.

### Purpose
Own navigation, the child-phase map, and aggregate status for refreshing the system-spec-kit documentation cluster and stress harness so they reflect the shipped 013 roadmap and the 128 sk-git worktree convention. Each child phase folder owns its own planning, execution, and verification: the manual testing playbook scenarios in `001-manual-testing-playbook-update`, the feature catalog expansion in `002-feature-catalog-update`, the README cluster refresh in `003-readme-cluster-update`, and the new durability stress domain in `004-stress-test-durability-domain`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the child phase folders for the docs and stress-test refresh and their aggregate status.
- Provide the navigation map from this program to each child phase folder.

### Out of Scope
- Per-child implementation detail (lives in each child phase folder).
- Phase history narration (lives in the root `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-manual-testing-playbook-update/` | Modify | children | New EX scenarios for checkpoint-v2, enrichment v30, index_scan refinements, front-proxy, sk-git worktrees |
| `002-feature-catalog-update/` | Modify | children | New/expanded feature files: checkpoint-v2, front-proxy, schema-version-history, error-codes, enrichment discoverability, sk-git |
| `003-readme-cluster-update/` | Modify | children | README.md, mcp_server/README.md, ENV_REFERENCE.md: SPECKIT_BACKEND_ONLY, schema v28-30, front-proxy, error codes, version footer, sk-git |
| `004-stress-test-durability-domain/` | Modify | children | New mcp_server/stress_test/durability domain + stress:durability script |
| `spec.md`, `graph-metadata.json`, `description.json` | Modify | this | Program navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. The Status column reports child state.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-manual-testing-playbook-update/` | New EX scenarios for checkpoint-v2, enrichment v30, index_scan refinements, front-proxy, and sk-git worktrees | complete (shipped) |
| 002 | `002-feature-catalog-update/` | New/expanded feature files: checkpoint-v2, front-proxy, schema-version-history, error-codes, enrichment discoverability, sk-git | complete (shipped) |
| 003 | `003-readme-cluster-update/` | README.md + mcp_server/README.md + ENV_REFERENCE.md: SPECKIT_BACKEND_ONLY, schema v28-30, front-proxy, error codes, version footer, sk-git | complete (shipped) |
| 004 | `004-stress-test-durability-domain/` | New mcp_server/stress_test/durability domain + stress:durability script | complete (shipped) |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently.
- This parent tracks aggregate progress via the map; per-child detail stays in the children.
- Deferred and abandoned children remain in place with explicit status; they are not removed.
- Use `/spec_kit:resume` on a child folder to resume it.
- Run `validate.sh --recursive` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `002-feature-catalog-update` | `003-readme-cluster-update` | Feature files exist before the README cluster links and summarizes them | Each child validates independently |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. All four child phases are authored, validated strict-clean, and shipped.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
