---
title: "Implementation Plan: 027/004 Causal Edge Tombstones"
description: "Plan for tombstone-backed causal edge deletion and orphan cleanup. Every active-edge delete path must snapshot before hard-delete so later generated edge promotion is safe."
trigger_phrases:
  - "027 phase 004"
  - "causal edge tombstones"
  - "causal graph lifecycle"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Planned tombstone lifecycle"
    next_safe_action: "Inventory all active causal-edge delete paths before implementation."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-004-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Active causal-edge deletes still lack tombstones."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 027/004 Causal Edge Tombstones

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | SQLite causal graph tables |
| **Testing** | Vitest with in-memory DB fixtures |

### Overview

Phase 004 adds tombstone audit rows and routes every causal-edge deletion through one helper. The active `causal_edges` table remains the fast query table; tombstones preserve deletion evidence for memory delete, bulk delete, stale cleanup, manual unlink, and health auto-repair paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research confirmed `deleteEdge()` and `deleteEdgesForMemory()` still issue direct deletes.
- [x] Current delete consumers are identified as memory delete, bulk delete, stale memory-index cleanup, manual unlink, health auto-repair, and CLI cleanup.
- [x] Phase 002 is recognized as a safety precondition for any reducer-origin edge creation.

### Definition of Done
- [x] Tombstone schema and indexes are additive.
- [x] A single sweep helper snapshots active edge data before deletion.
- [x] All active delete paths call the helper or explicitly document why they do not delete active causal rows.
- [x] Health auto-repair reports orphan edges before deleting them.
- [x] Manual unlink and stale cleanup produce tombstones with reasons.
- [x] Strict validation passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-before-delete lifecycle helper. Active graph reads stay simple; deletion paths centralize audit, generation, cache invalidation, and hard delete.

### Key Components
- **Tombstone table**: stores source, target, relation, original edge metadata, reason, timestamp, and lifecycle generation.
- **Sweep helper**: reads active rows, writes tombstones transactionally, deletes active rows, and returns counts.
- **Delete-path adapters**: memory delete, bulk delete, stale cleanup, manual unlink, health auto-repair, and CLI cleanup all route through the helper.
- **Cache cleanup**: graph/degree/related caches clear only after helper-applied deletes.

### Data Flow

Delete caller identifies edge ids or memory ids, sweep helper reads matching active edges, creates tombstone rows, hard-deletes active rows, clears graph caches, and returns a typed result for the caller response or health report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/search/vector-index-schema.ts` | Owns SQLite migrations | Add tombstone table and lifecycle indexes | Migration fixture |
| `mcp_server/lib/storage/causal-edges.ts` | Owns active edge CRUD | Add read-before-delete support and stop bypassing sweep helper | Unit tests for single/bulk delete |
| `mcp_server/lib/search/vector-index-mutations.ts:137-145` | Raw `DELETE FROM causal_edges` during memory-row mutation cleanup | Route through sweep helper (2026-06-05 audit) | Mutation cleanup fixture |
| `mcp_server/lib/storage/checkpoints.ts:1668-1676` | Scoped restore deletes active edges by source/target id | Route through sweep helper (2026-06-05 audit) | Scoped restore fixture |
| `mcp_server/lib/learning/corrections.ts:611-649` | Undo path raw-deletes the owned causal edge | Route through sweep helper (2026-06-05 audit) | Undo-correction fixture |
| `mcp_server/lib/causal/sweep.ts` | Missing | Create central tombstone-then-delete helper | Transaction tests |
| `mcp_server/handlers/memory-crud-delete.ts` | Single-memory delete | Route affected edges through sweep helper | Delete fixture with incoming/outgoing edges |
| `mcp_server/handlers/memory-bulk-delete.ts` | Bulk memory delete | Route selected-row edges through sweep helper | Bulk fixture |
| `mcp_server/handlers/memory-index.ts` | Stale indexed-record cleanup | Route stale cleanup through sweep helper | Stale cleanup fixture |
| `mcp_server/handlers/causal-graph.ts` | Manual unlink | Route unlink through sweep helper | Manual unlink fixture |
| `mcp_server/cli.ts` | Operator bulk-delete surface | Preserve helper semantics when invoking delete paths | CLI path review |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Delete Inventory
- [x] Search active code for `DELETE FROM causal_edges`, `deleteEdge`, `deleteEdgesForMemory`, and orphan cleanup callers.
- [x] Record every caller and whether it deletes active causal rows.
- [x] Confirm transaction boundaries for memory delete and bulk delete.

### Phase 2: Tombstone Foundation
- [x] Add tombstone table and lifecycle generation migration.
- [x] Add active-edge read helpers needed to snapshot before deletion.
- [x] Create sweep helper with transactional tombstone insert and active delete.

### Phase 3: Caller Integration
- [x] Route memory delete through sweep helper.
- [x] Route bulk delete through sweep helper.
- [x] Route stale memory-index cleanup through sweep helper.
- [x] Route manual unlink through sweep helper.
- [x] Route health auto-repair orphan cleanup through sweep helper.
- [x] Confirm CLI bulk-delete uses the same underlying helper path.

### Phase 4: Verification
- [x] Test single-memory delete tombstones incoming and outgoing edges.
- [x] Test bulk delete creates one tombstone per removed edge.
- [x] Test manual unlink records reason and restore metadata.
- [x] Test health auto-repair reports before deletion and tombstones when confirmed.
- [x] Run strict validation for this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Migration | Tombstone table and indexes on existing DB | Vitest/SQLite fixture |
| Unit | Sweep helper transaction and failure behavior | Vitest |
| Integration | Memory delete, bulk delete, manual unlink, stale cleanup | Vitest |
| Health | Orphan warning and auto-repair tombstone behavior | Vitest |
| Regression | Active graph reads still query `causal_edges` normally | Existing causal graph tests |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 memory write safety | Upstream safety | Required before reducer-origin edge writes | Prevents auto-session and manual overwrite regressions. |
| Current causal edge CRUD | Internal | Available | Source of active edge rows and cache invalidation behavior. |
| Phase 005 metadata edge promoter | Downstream | Waits on this phase | Generated edges need safe cleanup when metadata changes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Sweep helper blocks legitimate deletes, writes malformed tombstones, or leaves dangling active rows.
- **Procedure**: Disable caller integration and temporarily restore old delete helpers while keeping additive tombstone schema inert.
- **Data Safety**: Tombstone rows are audit-only; rollback does not require deleting tombstone history unless tests prove corruption.
<!-- /ANCHOR:rollback -->
