---
title: "Implementation Plan: 027/006 Write Path Reconciliation"
description: "Plan for explicit statediff reconciliation across memory write paths. Statediff is a planning and subscriber mechanism, not an implicit source of truth."
trigger_phrases:
  - "027 phase 006"
  - "statediff reconciliation"
  - "write path reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/004-write-path-reconciliation"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed statediff planning and subscriber wiring"
    next_safe_action: "Use action batches for follow-on write-path targets"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-006-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cache invalidation should follow explicit action subscribers."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 027/006 Write Path Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | SQLite memory index, embedding, lexical, generated graph, and cache subscribers |
| **Testing** | Vitest action-plan and handler integration fixtures |

### Overview

Phase 006 introduces a typed desired/prior state diff that plans durable row changes before handlers mutate storage. The phase keeps semantic policy decisions outside the diff engine, then applies explicit actions and notifies subscribers such as entity-density invalidation, alias/divergence checks, retention sweep, and graph cache cleanup.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 003 provides stable chunk ids and fingerprints for diff keys.
- [x] Research confirmed entity-density invalidation is manually wired in save and bulk-delete paths.
- [x] Research confirmed scan-path cache invalidation must be action-aware, not handler-name-aware.

### Definition of Done
- [x] `statediff.ts` produces deterministic action batches for insert, upsert, replace, delete, and no-op cases.
- [x] `memory_index_scan` can build a plan before durable writes.
- [x] `memory_save` uses statediff only after semantic policy gates.
- [x] Entity-density, graph, alias, divergence, and retention subscribers receive applied actions.
- [x] Stale deletes remain deferred when replacement indexing fails.
- [x] Strict validation passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Explicit action planning plus post-apply subscribers. Statediff reconciles desired and prior durable rows; it does not decide semantic truth, run LLM arbitration, or mutate caches directly.

### Key Components
- **Diff engine**: turns desired/prior rows into typed actions.
- **Target sinks**: apply actions to memory index rows, embeddings, lexical rows, generated graph edges, and child projections.
- **Action subscribers**: receive applied action batches and perform cache invalidation, alias conflict checks, divergence reconciliation, and retention-related hygiene.
- **Handler adapters**: convert `memory_index_scan`, `memory_save`, and bulk delete flows into desired/prior/action/apply phases.

### Data Flow

Handlers build desired state, load prior state, compute actions, validate safety constraints, apply target sinks transactionally where needed, then notify subscribers with applied action batches and source operation metadata.

**Async enrichment boundary (2026-06-05 audit)**: the durable-row statediff plan (memory index, embedding, lexical rows) is applied same-response, but generated graph-edge / enrichment targets are applied via the async pending-marker path, not in the same save response. `handlers/memory-save.ts` commits durable rows, marks enrichment pending in the commit transaction, then runs post-insert enrichment asynchronously (`setImmediate`) with replay/backfill repair. Statediff for graph/enrichment targets must subscribe to that async path rather than assume same-response graph writes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/storage/statediff.ts` | Missing | Create typed desired/prior diff engine | Unit tests for all action kinds |
| `mcp_server/handlers/memory-index.ts` | Inline scan reconciliation and stale cleanup | Build action plan before writes | Scan integration fixture |
| `mcp_server/handlers/memory-save.ts` | Inline save/write/cache behavior | Reconcile durable targets after policy gates | Save integration fixture |
| `mcp_server/handlers/memory-bulk-delete.ts` | Inline delete plus entity-density invalidation | Emit delete action batch and subscriber notifications | Bulk-delete fixture |
| `mcp_server/handlers/mutation-hooks.ts` | Broad cache clearing hooks | Convert to action-specific subscribers | Subscriber tests |
| `mcp_server/lib/search/entity-density.ts` | Cached density computation | Invalidate from action batches, not handler-specific calls | Save/scan/bulk delete fixture |
| `mcp_server/hooks/mutation-feedback.ts` | Reports mutation hook results | Reflect subscriber-based reporting | Snapshot test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Action Model
- [ ] Define target row keys, desired/prior row shape, and `DiffAction` variants.
- [ ] Implement deterministic diff planning for insert, upsert, replace, delete, and no-op.
- [ ] Add composite target support for parent memory rows and child projections.

### Phase 2: Target Sinks and Subscribers
- [ ] Add sink interfaces for memory index, embedding/cache, lexical rows, generated graph edges, and child projections.
- [ ] Add subscriber interface with action kind, target key, source operation, old hash, and new hash.
- [ ] Convert entity-density invalidation into an action subscriber.
- [ ] Convert graph/degree/related cache clearing into action-specific subscribers.

### Phase 3: Handler Integration
- [ ] Convert scan reconciliation to plan-before-write while preserving failed-replacement stale-delete safety.
- [ ] Convert save reconciliation to statediff after dedup, embedding, and semantic policy gates.
- [ ] Convert bulk delete into delete action batches and subscriber notifications.
- [ ] Keep manual causal commands imperative in this phase unless generated edge-set reconciliation is active.

### Phase 4: Verification
- [ ] Test deterministic diff output and action ordering invariants.
- [ ] Test no-op scan produces no durable writes.
- [ ] Test failed replacement indexing does not apply stale delete actions.
- [ ] Test save, scan, and bulk delete all invalidate entity-density through subscribers.
- [ ] Test mutation feedback shape remains backwards understandable while reporting subscribers.
- [ ] Run strict validation for this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Diff planning, composite targets, action ordering | Vitest |
| Unit | Subscriber dispatch and action filtering | Vitest |
| Integration | `memory_index_scan` plan-before-write and stale-delete guard | Vitest |
| Integration | `memory_save` durable target reconciliation | Vitest |
| Regression | Entity-density invalidates on save, scan, and bulk delete action batches | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 chunk fingerprints | Hard internal | Pending | Without stable keys, action planning falls back to whole-document targets. |
| Phase 005 generated edges | Downstream consumer | Pending | Generated graph edge sets can later use the same action model. |
| Existing mutation hooks | Internal | Available | Source of current cache invalidation behavior to preserve. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Statediff produces incorrect actions, loses stale-delete safeguards, or misses cache invalidation.
- **Procedure**: Disable handler integration and restore inline handler branches while keeping diff engine tests as diagnostic artifacts.
- **Data Safety**: Apply actions only after plan validation; no destructive schema migration is planned in this phase.
<!-- /ANCHOR:rollback -->
