---
title: "Feature Specification: MCP-tooling Spec Consolidation [skilled-agent-orchestration/140-mcp-spec-consolidation/spec]"
description: "Consolidate every MCP-tooling skill spec packet into a new sequentially-numbered mcp-tooling track and repair all nested path references."
trigger_phrases:
  - "mcp spec consolidation"
  - "mcp-tooling track"
  - "mcp spec folder renumber"
  - "consolidate mcp specs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-mcp-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration spec authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Feature Specification: MCP-tooling Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/0044-mcp-tooling-consolidation` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
MCP-tooling skill specs were scattered across `skilled-agent-orchestration/` top-level with unrelated numbering and stale self-identity metadata pointing at deleted `z_archive/<n>-<slug>` origins. There was no dedicated `mcp-tooling` spec track, so the MCP tool-routing / Code Mode family (coco semantic search, Figma, ClickUp, install-doctor, readme-sync) was not browsable as a unit.

### Purpose
Consolidate every MCP-tooling spec into a new `mcp-tooling` track, renumber it contiguously (chronological by original number), repair all nested path references, regenerate all packet + root category JSONs, and land it without regressing validation or touching concurrent-session work — mirroring the completed CLI consolidation.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the new `mcp-tooling` track and move in the 8 committed MCP-tooling packets from `skilled-agent-orchestration/`.
- Renumber contiguously `001`–`008`, chronological by original number, slugs preserved.
- Repair nested path references (graph-metadata identity + children_ids, description.json, continuity pointers, bare self-refs) within the migrated tree.
- Regenerate every packet's description.json + graph-metadata.json; author the mcp-tooling track-root JSONs; prune the movers from the SAO root children list.

### Out of Scope
- **Pre-existing doc-quality debt** in the migrated packets (template headers, anchors, sufficiency) — present identically before the migration; SCOPE LOCK.
- **065-spec-kit-coco-sk-code-research** — operator-excluded (cross-cutting spec-kit+coco+sk-code research, not primarily mcp-tooling).
- `sk-git/014-gitkraken-mcp-integration` (correctly in sk-git), `081-webflow-per-language-style-guides` (style guide), `109/014-mcp-code-mode-readme` (child of 109).
- The memory/vector DB reindex — operator-gated / skipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/mcp-tooling/001-008/** | Rename | 8 packets moved + renumbered via git-mv |
| .opencode/specs/mcp-tooling/**/*.md,*.json | Modify | Nested path-reference + identity repair |
| .opencode/specs/mcp-tooling/{description,graph-metadata}.json | Create | Track-root category JSONs |
| .opencode/specs/skilled-agent-orchestration/graph-metadata.json | Modify | Prune mover references from root children_ids |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contiguous numbering | mcp-tooling holds exactly 8 packets, 001–008, no gaps/dups/temp folders |
| REQ-002 | No stale identity | Zero z_archive/old-SAO/bare-old-number references remain in the mcp tree |
| REQ-003 | Rename history preserved | All folder moves land as `R` renames, not delete+add |
| REQ-004 | Regression-neutral validation | No new strict-validate errors on any packet vs pre-migration baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Metadata regenerated | Every packet description.json + graph-metadata.json refreshed |
| REQ-006 | Root JSONs generated | mcp-tooling track root has description.json + graph-metadata.json listing all 8 children |
| REQ-007 | Concurrent-session safe | No move/edit touches another session's files; explicit-path staging only |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mcp-tooling` is a single contiguous 001–008 track with correct per-packet + root metadata.
- **SC-002**: Migration-invariant validators (child-drift, disk-path-consistency, graph/description shape, folder-naming) pass for all packets.
- **SC-003**: Strict-validate error delta vs baseline is ≤ 0 (regression-neutral or better).


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bare-token rewrite hitting z_archive twins | Corrupt unrelated packets | Category-qualified first; bare tokens only mcp-tree-scoped (twins deleted, slugs unique) |
| Risk | Stale bare "Spec Folder" metadata | SPEC_DOC_INTEGRITY error | Scoped bare-token rewrite + regen |
| Dependency | Concurrent session dirty tree | Merge conflict / clobber | Isolated worktree, FF push, explicit-path staging |
| Dependency | Memory/vector DB (global) | Pollution from worktree | DB-free regen; reindex gated/skipped |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regen batch completes unattended across all mcp-tooling folders.

### Security
- **NFR-S01**: No destructive operation on files outside the migration path set.
- **NFR-S02**: No global-DB writes from the worktree.

### Reliability
- **NFR-R01**: Every move preserves git rename history.
- **NFR-R02**: Deterministic, re-runnable rewrite (idempotent token map).


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Deleted z_archive twins**: 7 of 8 movers carried z_archive-origin identity for folders that no longer exist; rewritten to the new mcp-tooling path.
- **Bare self-references**: `implementation-summary.md` "Spec Folder" metadata used a bare old number that the category-qualified pass missed; a mcp-tree-scoped bare-token pass fixed it.
- **Phase parents**: 004-mcp-figma-transfer (4 children) and 008-mcp-tooling-parent (8 children) carry children_ids that must re-point to new paths.

### Error Scenarios
- **Fresh category**: `mcp-tooling/` did not exist; all 8 packets are move-ins (no interleave), so single-phase git-mv is collision-free.
- **Stale source_fingerprint**: path edits invalidate the stored fingerprint; graph-metadata regen recomputes it.

### Concurrent Operations
- **Parallel sessions on the shared tree**: isolated worktree + fast-forward push; never `git add -A`.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Include 065-spec-kit-coco-sk-code-research? **RESOLVED: Excluded (operator).**
- 2-digit vs 3-digit numbering? **RESOLVED: 3-digit (operator).**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---
