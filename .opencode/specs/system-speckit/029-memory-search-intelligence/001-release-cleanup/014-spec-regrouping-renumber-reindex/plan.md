---
title: "Implementation Plan: Spec Regrouping Renumber Reindex"
description: "Apply deterministic spec-folder renumbering to the selected regrouped tracks, update current path references, and refresh spec memory indexing."
trigger_phrases:
  - "implementation"
  - "renumber specs"
  - "path references"
  - "reindex specs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-speckit/029-memory-search-intelligence/000-release-cleanup/014-spec-regrouping-renumber-reindex"
    last_updated_at: "2026-07-04T17:31:31.478Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Active orchestration correction applied"
    next_safe_action: "Repair memory daemon and reindex"
    blockers:
      - "memory_index_scan returns E040"
    key_files:
      - ".opencode/specs/design"
      - ".opencode/specs/skilled-agent-orchestration"
      - ".opencode/specs/deep-loops"
    session_dedup:
      fingerprint: "sha256:d5f57c99d91e62de02ea3fbbf181fe5001542e95532330c07a7803eaa7efd90e"
      session_id: "spec-regrouping-renumber-reindex"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Spec Regrouping Renumber Reindex

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, filesystem paths |
| **Framework** | Spec Kit Memory / spec-folder metadata |
| **Storage** | Spec docs plus memory index |
| **Testing** | Directory inventory, exact-path search, memory reindex, spec validation |

### Overview
The migration reads live direct-child folders, builds deterministic rename maps, renames through temporary names to avoid collisions, updates current path references under the affected roots, and reindexes the changed spec folders. The plan intentionally does not create rollback artifacts because the user explicitly declined them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [ ] All acceptance criteria met.
- [x] Reindex completed or bounded failure reported.
- [x] Docs updated and strict validation run.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded mechanical filesystem migration with scoped reference substitution.

### Key Components
- **Inventory step**: Reads direct child folders from each named root and derives maps from the live filesystem.
- **Rename step**: Moves mapped directories to temporary names, then to final names to avoid collisions.
- **Reference step**: Replaces exact old relative/full path strings under affected roots for current metadata and markdown navigation.
- **Index step**: Runs Spec Kit Memory index scans for changed tracks.

### Data Flow
Live directory entries produce rename maps. Rename maps produce path substitution pairs. Substitution pairs update current files under the affected roots. Reindexing refreshes the database view of those paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/specs/design` | Design track with non-contiguous numbering | Reset direct children to `001`-`008` | Directory read and exact old-path scan |
| `.opencode/specs/skilled-agent-orchestration` | Active orchestration track | Compact active children to `117`-`123` after archive `116` | Directory read and exact old-path scan |
| `.opencode/specs/skilled-agent-orchestration/z_archive` | Archived orchestration packets | Compact archive children to `001+` | Directory read and exact old-path scan |
| `.opencode/specs/deep-loops` | Active deep-loop track | Leave unchanged if already contiguous | Directory read |
| `.opencode/specs/deep-loops/z_archive` | Archived deep-loop packets | Compact archive children to `001+` | Directory read and exact old-path scan |
| `specs/design` | Design track root metadata | Add missing root JSON files | Directory read and JSON parse |
| `specs/deep-loops` | Deep-loops track root metadata | Add missing root JSON files | Directory read and JSON parse |
| Spec memory index | Search/continuity lookup | Reindex affected roots | `memory_index_scan` result |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm documentation phase folder.
- [x] Load spec/documentation workflow guidance.
- [x] Inventory live target roots.

### Phase 2: Core Implementation
- [x] Apply deterministic directory renames.
- [x] Update scoped current path references.
- [x] Add missing root metadata JSON files for `design` and `deep-loops`.
- [x] Update this phase packet with migration evidence.

### Phase 3: Verification
- [x] Read resulting directories.
- [x] Search for stale current references.
- [x] Reindex affected roots attempted; blocked by daemon `E040`.
- [x] Run strict validation for this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Direct child folder lists | Read / filesystem script |
| Reference | Old path strings inside affected roots | Exact text search |
| Integration | Spec memory visibility | `memory_index_scan` |
| Documentation | Phase packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live filesystem | Internal | Green | Migration cannot derive accurate maps. |
| Spec Kit Memory daemon | Internal | Yellow | Reindex may need retry if daemon times out. |
| User no-rollback constraint | Constraint | Green | No backup artifacts are created. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: User requests reversal or post-migration validation exposes an unsafe mapping.
- **Procedure**: No rollback artifacts will be created per user instruction. Recovery would use the visible git diff/status and the migration map in this packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Rename maps -> Temp renames -> Final renames -> Reference updates -> Reindex -> Validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Rename maps |
| Rename maps | Inventory | Renames |
| Reference updates | Renames | Reindex |
| Reindex | Reference updates | Completion |
| Validate | Docs and migration evidence | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 15-30 minutes |
| Core Implementation | Medium | 30-60 minutes |
| Verification | Medium | 15-30 minutes |
| **Total** | | **1-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] User declined rollback artifact creation.
- [x] Migration scope is bounded to named spec roots.
- [x] Temporary names will be used only to avoid collisions during the rename operation.

### Rollback Procedure
1. Inspect the migration map in this packet.
2. Reverse the final folder names manually if requested.
3. Rerun scoped reference replacement with the map reversed.
4. Reindex affected roots again.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Filesystem rename reversal and reindex only.
<!-- /ANCHOR:enhanced-rollback -->
