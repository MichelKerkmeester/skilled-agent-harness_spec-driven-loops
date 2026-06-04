---
title: "004 — Causal Edge Tombstones"
description: "Add lifecycle cleanup for causal edges by routing every delete path through a tombstone-producing sweep helper. Active edges remain hard-deleted for query simplicity, while tombstone audit rows preserve restoration and debugging context."
trigger_phrases:
  - "causal edge tombstones"
  - "causal graph lifecycle"
  - "orphan edge sweep"
  - "memory delete causal cleanup"
  - "memory_health autoRepair tombstone"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "027-xce-research-based-refinement/004-causal-edge-tombstones"
    last_updated_at: "2026-05-13T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "authored spec"
    next_safe_action: "design sweep"
    blockers: []
    key_files:
      - "lib/search/vector-index-schema.ts"
      - "lib/causal/sweep.ts"
      - "handlers/memory-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-004-spec-authoring"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "retention window"
    answered_questions:
      - "hard-delete active edges"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 004 — Causal Edge Tombstones

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-05-13 |
| **Branch** | `scaffold/004-causal-edge-tombstones` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 003-incremental-index-foundation |
| **Successor** | 005-metadata-edge-promoter |
| **Handoff Criteria** | All memory and edge deletion paths produce tombstone audit rows before active causal edges are deleted. |

### Research Basis

| Source | Evidence |
|--------|----------|
| `external/cocoindex-main/rust/core/src/state/db_schema.rs:35` | `ChildExistencePrefix,` shows CocoIndex records child existence state separately from live component data. |
| `external/cocoindex-main/rust/core/src/state/db_schema.rs:39` | `ChildComponentTombstonePrefix,` shows tombstones are a first-class lifecycle key. |
| `external/cocoindex-main/rust/core/src/state/db_schema.rs:315` | `TODO: Add a generation, to avoid race conditions during deletion,` directly supports a lifecycle generation counter. |
| `external/cocoindex-main/rust/core/src/engine/execution.rs:612` | `let db_key_prefix = db_schema::DbEntryKey::StablePath(` starts the prefix diff over stored child existence rows. |
| `external/cocoindex-main/rust/core/src/engine/execution.rs:746` | `fn del_child(` routes missing children into deletion handling. |
| `external/cocoindex-main/rust/core/src/engine/execution.rs:771` | `fn flush_component_tombstones` persists buffered tombstones after child reconciliation. |
| `external/cocoindex-main/rust/core/src/engine/execution.rs:1472` | `pub(crate) async fn cleanup_tombstone` removes tombstones after cleanup succeeds. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:607` | `CREATE TABLE IF NOT EXISTS causal_edges (` shows the current active-edge table is flat. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:768` | `DELETE FROM causal_edges` shows current cleanup hard-deletes without audit. |
| `research/research.md:94` | The adapted port should hard-delete active edges, snapshot deleted edges to `causal_edge_tombstones`, and route every delete path through one helper. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase adapts CocoIndex's lifecycle invariant, not its exact storage shape. CocoIndex stores child existence state and tombstones under stable-path keys, then consumes tombstones through a GC path. Spec Kit Memory has a relational causal graph, so the equivalent is a tombstone audit table plus a single sweep helper that every edge-deleting path uses.

**Scope Boundary**: add active-edge cleanup with tombstone audit rows and lifecycle generation. Do not add automatic edge derivation; packet 005 depends on this cleanup foundation before increasing generated edge volume.

**Dependencies**:
- Existing `causal_edges` remains the active query table.
- Delete paths must be discoverable and routed through one helper.
- `memory_health({ autoRepair: true })` must be able to identify orphan edges before deleting them.

**Deliverables**:
- `causal_edge_tombstones` table with restore metadata.
- `lib/causal/sweep.ts` helper for hard delete plus tombstone audit.
- Delete-path integration for memory delete, bulk delete, stale cleanup, manual unlink, and orphan sweep.
- Health warning and auto-repair behavior for orphaned causal edges.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `causal_edges` table is a flat active-edge table with no lifecycle record. When source or target memories are deleted, existing paths can remove active edges, but they do not consistently preserve audit data about which edge was removed, why it was removed, or whether it can be restored inside a retention window.

This creates two operational problems. Orphan edges can accumulate when some delete paths bypass causal cleanup, and successful cleanup can erase the evidence needed to debug or reverse an incorrect deletion.

Three active call sites perform hard edge deletes with no tombstone today (confirmed iter-032):
- `handlers/memory-crud-delete.ts:117-118` — single memory delete, within SQLite transaction
- `handlers/memory-bulk-delete.ts:248-252` — bulk delete loop; cache invalidation was added by d232da4ee but edge tombstoning was not
- `handlers/memory-crud-health.ts:701-714` → `causal-edges.ts:836` — autoRepair orphan sweep via `cleanupOrphanedEdges()`; previously inactive, now live

Both delete implementations (`causal-edges.ts:764-775` for bulk, `causal-edges.ts:743-759` for single) issue unconditional `DELETE FROM causal_edges` with no prior snapshot.

### Purpose

Route every causal-edge deletion through a single sweep helper that writes a tombstone audit row, increments a lifecycle generation, hard-deletes the active edge, and gives health auto-repair a safe orphan-cleanup path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `causal_edge_tombstones(id, source_id, target_id, relation, tombstoned_at, reason, lifecycle_generation, restore_metadata)`.
- Add lifecycle generation support so delete and recreate races are detectable.
- Create `lib/causal/sweep.ts` as the single helper for tombstone-then-delete behavior.
- Route `memory_delete` through the sweep helper.
- Route `memory_bulk_delete` through the sweep helper.
- Route stale index cleanup in `handlers/memory-index.ts` through the sweep helper.
- Route manual unlink through the sweep helper.
- Add orphan sweep support that tombstones dangling edges before deleting them.
- Extend `memory_health({ autoRepair: true })` so it reports orphan edges first, then tombstones and deletes them when confirmed.

### Out of Scope

- Auto-deriving causal edges from frontmatter or content.
- Changing the allowed causal relation vocabulary.
- Replacing `causal_edges` with a soft-delete table.
- Redesigning causal graph traversal or scoring.
- Retrofitting tombstones for all historical pre-existing edge deletes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add tombstone DDL, lifecycle generation storage, indexes, and migration. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts` | Create | Centralize tombstone audit, active edge deletion, generation bump, and restore metadata construction. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-delete.ts` | Modify | Route single-memory delete edge cleanup through sweep helper. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modify | Route selected-row edge cleanup through sweep helper. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Route stale indexed-record cleanup through sweep helper. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-health.ts` | Modify | Add orphan-edge warning and auto-repair tombstone behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Expose read-before-delete helpers and stop bypassing tombstone paths for active cleanup. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every memory delete path writes tombstone rows for affected causal edges. | Deleting a memory with incoming and outgoing edges creates one tombstone row per removed edge before active rows disappear. |
| REQ-002 | Manual causal unlink writes a tombstone row. | Calling the unlink handler records source, target, relation, reason, generation, and restore metadata. |
| REQ-003 | Orphan edges produce a health warning before repair. | `memory_health` reports orphan edge ids and endpoint state without deleting them unless auto-repair is confirmed. |
| REQ-004 | Auto-repair tombstones and deletes orphan edges cleanly. | `memory_health({ autoRepair: true })` creates tombstones, deletes orphan active rows, clears graph caches, and reports counts. |
| REQ-005 | Active query paths stay simple. | Normal causal graph reads query `causal_edges` without filtering tombstone state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `restore_metadata` is sufficient for retention-window reversal. | Tombstone rows include original anchors, evidence, strength, creator, timestamps, and triggering memory id or command. |
| REQ-007 | Lifecycle generation is monotonic. | Successive delete cycles for the same edge identity produce increasing generation values. |
| REQ-008 | Migration documents historical gap. | Implementation summary states that existing active edges have no prior tombstone history until first post-migration deletion. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Deleting a memory cascades to all referencing causal edges with audit tombstone rows.
- **SC-002**: `memory_health` auto-repair tombstones and deletes orphan edges without leaving dangling active rows.
- **SC-003**: Manual unlink and bulk delete paths produce the same tombstone schema as normal memory delete.
- **SC-004**: Historical active edges survive migration and are not falsely tombstoned during upgrade.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing 205 causal edge rows have no tombstone history. | Low | Treat pre-migration rows as historical; audit begins at first post-migration deletion. |
| Risk | Delete paths may be missed. | High | Use `rg` for `deleteMemory`, `deleteEdgesForMemory`, `deleteEdge`, and raw `DELETE FROM causal_edges` before implementation. |
| Risk | Tombstone writes inside transactions can fail and block deletes. | Medium | Make sweep helper transactional and return explicit failure counts to callers. |
| Risk | Restore metadata may grow large. | Low | Store compact JSON only for fields needed to recreate the edge. |
| Risk | `causal-edges.ts:L269-L288` checks `createdBy === 'auto'` only; a session-trace reducer emitting `created_by='auto-session'` bypasses the 0.5 strength cap. The auto-provenance broadening fix (`isAutoEdgeCreator`) is a P0 precondition that must land in 002-memory-write-safety before session-trace reducer ships. | High | Confirmed by NF-1 synthesis finding (iteration-039). Phase 004 must coordinate with 002. |
| Risk | `causal-edges.ts:L313-L338` upserts `created_by` on conflict; a reducer without a pre-insert ownership query silently overwrites manual edges. Fix is in 002 P0-2. | High | Confirmed by NF-2 synthesis finding (iteration-039). Manual-edge overwrite guard in 002 must land before any reducer-style insertEdge call. |
| Dependency | Packet 005 generated edges need reliable cleanup. | High | Ship this packet before frontmatter auto-promotion unless promoter is report-only. |
| Dependency | Cache invalidation must follow sweep actions. | Medium | Clear graph and degree caches after active edge deletes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should tombstone retention default to 90 days or indefinite retention?
- Should tombstones include the full original evidence text or a shortened evidence hash plus excerpt?
- Should `memory_health` auto-repair require an explicit `confirmed` flag for orphan edge deletion, matching other destructive repair flows?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
