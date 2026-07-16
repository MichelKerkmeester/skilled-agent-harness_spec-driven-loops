---
title: "Feature Specification: component migration (032 phase 008)"
description: "The 14-way per-component fan-out that renames each skill subtree's snake_case filesystem names to kebab-case as a self-contained, dependency-closed closure. Lanes are scheduled from the phase 006 executable SCC condensation DAG under exclusive skill leases and one serial integration steward; phase number is grouping order, not a runtime sequence."
trigger_phrases:
  - "component migration fan-out"
  - "hyphen naming phase 008"
  - "per-skill kebab-case migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the component-migration fan-out model and 14-child phase map"
    next_safe_action: "Schedule the first component lane from the phase 006 epoch SCC DAG"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Lane count is derived from the phase 006 executable SCC DAG, not fixed at 14; a skill splits only when its intra-skill closures are proven disjoint."
      - "Cross-skill closures are hoisted to phase 007 first, so each component subtree here is a self-contained closure."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; detailed mechanics live in child documents. -->

# Feature Specification: Component migration

> Phase adjacency under the 032 parent (grouping order, not a runtime dependency): predecessor `007-shared-and-cross-cutting-closures`; successor `009-remove-transition-aliases`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration |
| **Level** | phase parent |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | sk-doc |
| **Parent packet** | sk-doc/032-hyphen-naming-convention |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The bulk of the rename lives in roughly fourteen skill subtrees. Migrating them serially would stretch the drift window and
guarantee rework as concurrent sessions keep editing skills; migrating them naively in parallel would collide on shared roots,
`SKILL.md` pointers, and generated output. This phase is the component fan-out: each skill subtree is renamed to kebab-case as a
self-contained, dependency-closed closure, made possible because phase 007 has already hoisted every cross-skill (two-or-more
component) closure out of the fan-out.

The number of lanes is not fixed at fourteen. It is derived from the phase 006 executable SCC condensation DAG by topological
level; a component splits into sub-lanes only when phase 006 proves its intra-skill closures have disjoint write sets. Execution
is governed by exclusive per-skill leases and one serial integration steward that merges one SCC at a time on exact integration
SHAs, with hot skills ordered by observed churn. The phase NUMBER of each child is grouping order for documentation, not a
runtime sequence. The scheduling model, drift census, lease protocol, and ordering rule live in the packet's
execution-parallelization-strategy.md.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child phase manifest for the fourteen component subtrees, each ending in a `…-gate` rollup child and carrying a `changelog-verify`.
- Per-component detail — rename map slice, reference closure, consumer updates, and verifier contract — in each child folder.
- The fan-out scheduling contract: lanes derived from the phase 006 epoch SCC DAG, exclusive skill leases, and serial integration.

### Out of Scope
- Cross-skill (two-or-more component) closures; those are hoisted to phase 007 before this fan-out begins.
- The frozen map, executable batches, and SCC partition; those are phase 006.
- Transition-alias removal (phase 009) and the whole-repo gate (phase 010).
- Detailed per-phase plans, tasks, checklists, and decisions at the parent level; those live in the child folders.

### Files to Change
Summary of aggregate file scope. Per-component detail lives in each child plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child component subtree] | Rename/Modify | Child phases | Each child owns its skill subtree's rename map, reference closure, and consumer updates |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each child is an independently executable component-migration closure. All implementation detail (plan, tasks, checklist, decisions, continuity) lives inside the child folders.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-sk-code/` | Rename the sk-code subtree's snake_case filesystem names to kebab-case as a dependency-closed closure; ends in a gate rollup. | Planned |
| 2 | `002-sk-design/` | Rename the sk-design subtree (largest component) as dependency-closed sub-closures; ends in a gate rollup. | Planned |
| 3 | `003-sk-doc/` | Rename the sk-doc hub subtree, with the shared backbone preceding the nested `create-*` packets at depth 4; ends in a gate rollup. | Planned |
| 4 | `004-sk-prompt/` | Rename the sk-prompt subtree (prompt-improve + prompt-models) as a dependency-closed closure; ends in a gate rollup. | Planned |
| 5 | `005-cli-external-orchestration/` | Rename the cli-external-orchestration hub and per-CLI subtrees as closures; ends in a gate rollup. | Planned |
| 6 | `006-mcp-tooling/` | Rename the mcp-tooling subtrees, each `mcp_server` dir/manifest closure included; ends in a gate rollup. | Planned |
| 7 | `007-system-deep-loop/` | Rename the system-deep-loop subtree, including the nested deep-improvement mode dirs; ends in a gate rollup. | Planned |
| 8 | `008-system-spec-kit/` | Rename the system-spec-kit subtree (scripts, references, templates, mcp_server) as closures; ends in a gate rollup. | Planned |
| 9 | `009-system-skill-advisor/` | Rename the system-skill-advisor subtree, `mcp_server` dir/manifest closure included; ends in a gate rollup. | Planned |
| 10 | `010-system-code-graph/` | Rename the system-code-graph subtree, `mcp_server` dir/manifest closure included; ends in a gate rollup. | Planned |
| 11 | `011-mcp-code-mode/` | Rename the mcp-code-mode subtree as a dependency-closed closure; ends in a gate rollup. | Planned |
| 12 | `012-sk-git/` | Verify/complete the sk-git subtree kebab state (references, assets, playbook already piloted on v4); ends in a gate rollup. | Planned |
| 13 | `013-commands/` | Rename the commands surface (namespaced assets, loose command ids, `.codex/prompts` mirror regenerated by producer); ends in a gate rollup. | Planned |
| 14 | `014-agents/` | Per-agent verify-only closures documenting the zero-candidate or exempt state; ends in a gate rollup. | Planned |

### Phase Transition Rules

- Lanes are scheduled by topological level from the phase 006 executable SCC condensation DAG, not by ascending phase number.
- Each component holds one exclusive skill lease; a sub-lane is permitted only when phase 006 proves disjoint intra-skill write sets.
- The serial integration steward merges one SCC at a time on an exact integration SHA and reruns the guard/reference checker per wave.
- Run `validate.sh --recursive` on this parent to validate the direct children as an integrated level.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 007-shared-and-cross-cutting-closures | 008-component-migration | Every cross-skill closure is landed, so each component subtree is a self-contained closure against the current epoch. | The epoch DAG shows no cross-component edge into an un-landed component. |
| Any component child | Its `…-gate` rollup | The component's rename closure is dependency-complete, references are rewritten under compare-and-swap, and the merge is conflict-free at the integration SHA. | The child's checklist P0 contract passes and the guard/reference checker is green on the integration head. |
| 008-component-migration | 009-remove-transition-aliases | All component gates are green and no transition alias is still relied upon by a migrated consumer. | The whole-parent recursive validate is clean and the alias inventory is ready for removal. |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which components are hot at execution time (currently sk-doc, commands, and deep-loop) — recomputed from observed churn per the strategy doc, never hard-coded.
- Which components earn sub-lanes — decided only when phase 006 proves disjoint intra-skill closures.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-component spec.md, plan.md, tasks.md, checklist.md
- **Parent Spec**: See `../spec.md`
- **Scheduling model**: See `../execution-parallelization-strategy.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
