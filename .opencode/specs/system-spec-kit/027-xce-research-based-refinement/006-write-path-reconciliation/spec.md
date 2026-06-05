---
title: "006 — Write-Path Reconciliation"
description: "Replace scattered post-mutation reconciliation with a typed target-state diff model for durable memory projections. The pipeline builds a deterministic action plan before writes, applies actions through target sinks, then notifies cache and hygiene subscribers."
trigger_phrases:
  - "statediff reconciliation"
  - "desired prior diff actions"
  - "memory_index_scan action plan"
  - "post mutation subscribers"
  - "target state reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "027-xce-research-based-refinement/006-write-path-reconciliation"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied 2026-06-05 audit rescope: async post-insert enrichment"
    next_safe_action: "Model durable statediff as same-response; enrichment via async marker"
    blockers:
      - "003"
    key_files:
      - "lib/storage/statediff.ts"
      - "handlers/memory-index.ts"
      - "handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-spec-authoring"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "sink order"
    answered_questions:
      - "hooks become subscribers"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 006 — Write-Path Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-05-13 |
| **Branch** | `scaffold/006-write-path-reconciliation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 005-metadata-edge-promoter |
| **Successor** | None |
| **Handoff Criteria** | `memory_index_scan` and `memory_save` produce target-state action plans before DB mutation, and post-mutation hooks receive applied action batches. |

### Research Basis

| Source | Evidence |
|--------|----------|
| `external/cocoindex-main/python/cocoindex/connectorkits/statediff.py:52` | `DiffAction = _Literal["insert", "upsert", "replace", "delete"]` defines the portable action vocabulary. |
| `external/cocoindex-main/python/cocoindex/connectorkits/statediff.py:85` | `class TrackingRecordTransition` wraps desired state, previous rows, and prior completeness. |
| `external/cocoindex-main/python/cocoindex/connectorkits/statediff.py:149` | `def diff(` starts the desired-prior decision tree. |
| `external/cocoindex-main/python/cocoindex/connectorkits/statediff.py:172` | `if _coco.is_non_existence(t.desired):` maps desired non-existence to delete behavior. |
| `external/cocoindex-main/python/cocoindex/connectorkits/statediff.py:177` | `if any(p != t.desired for p in t.prev):` maps divergent observed prior rows to replace. |
| `external/cocoindex-main/python/cocoindex/connectorkits/statediff.py:189` | `def diff_composite(` provides the main record plus keyed substates model needed for memory documents. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:351` | `const runScanInvalidationHooks =` shows current scan-side cache invalidation is a post-write hook. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:436` | `categorizeFilesForIndexing(files);` shows current implicit planning categories. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:567` | `if (filesToDelete.length > 0) {` starts the stale cleanup branch that should become a planned delete action. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:27` | `let triggerCacheCleared = false;` begins the current cache-clearing hook bundle that should subscribe to applied actions. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3296` | `const shouldEmitPostMutationFeedback =` shows `memory_save` already gates hook emission after mutation outcomes. |
| `research/research.md:125` | Post-mutation hooks should become subscribers to applied action batches, not durable desired-prior rows. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase ports CocoIndex's statediff model into Spec Kit Memory as a storage reconciliation layer. The current system has several reconciliation fragments: scan categorization, stale cleanup, alias divergence handling, embedding cache writes, FTS and BM25 updates, causal graph mutation, and post-mutation cache hooks. They should not all remain inline branches inside handlers.

**Scope Boundary**: implement target-state reconciliation for durable rows and generated projections. Cache invalidation, alias feedback, retention sweep, and graph cache clearing become subscribers to the applied action batch; they are not themselves statediff targets.

**Dependencies**:
- Requires packet 003 for stable chunk identities and fingerprints used as diff keys.
- Generated causal-edge sets from packet 005 can later use the same action model.
- Current safety behavior around stale cleanup after failed replacement indexing must be preserved.

**Deliverables**:
- `lib/storage/statediff.ts` with typed transition and action model.
- Target sinks for memory index rows, embedding rows, FTS rows, BM25 rows, graph edges, and cache notifications.
- `memory_index_scan` plan-before-write path.
- `memory_save` single-document upsert path through target-state sinks.
- Subscriber interface for alias conflict detection, divergence reconciliation, retention sweep, and cache invalidation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`memory_index_scan` and `memory_save` currently reconcile state through scattered handler branches and post-mutation hooks. Scan code classifies files, deletes stale rows, updates mtime markers, invokes invalidation hooks, runs alias conflict detection, and reports divergence through separate callsites. Save code performs deduplication, embedding generation, reconsolidation, transactional writes, lineage recording, and post-mutation hook emission through another path.

This makes correctness hard to reason about. Alias conflicts, divergence detection, stale-row cleanup, cache invalidation, and child projection updates are coupled to handler order instead of to an explicit target-state plan.

### Purpose

Introduce a typed `(desiredRows, priorRows) -> DiffAction[]` model so memory writes first build a deterministic target-state plan, then apply typed actions through target-specific sinks, then notify post-mutation subscribers with the applied action batch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `lib/storage/statediff.ts`.
- Define `DiffAction` as `insert`, `upsert`, `replace`, and `delete`.
- Model transitions from desired rows and prior rows, including incomplete prior knowledge.
- Model memory documents as composite targets with child rows.
- Add target sinks for `memory_index` rows.
- Add target sinks for embedding rows and embedding cache rows.
- Add target sinks for FTS rows.
- Add target sinks for BM25 rows.
- Add target sinks for generated graph edges.
- Add cache and hygiene subscriber notifications after actions apply.
- Convert `handlers/memory-index.ts` scan reconciliation to build a plan before DB writes.
- Convert `handlers/memory-save.ts` single-doc upsert to use statediff after semantic policy decisions.
- Convert alias conflict detection, divergence reconciliation, retention sweep, and cache invalidation into subscribers where practical.
- Preserve the safety rule that stale deletes are deferred when replacement indexing fails.
- Remove `invalidateEntityDensityCacheAfterSave()` inline call at `memory-save.ts:2637`; entity-density invalidation becomes a statediff subscriber to `insert`/`delete` action batches.
- Remove `invalidateEntityDensityCacheAfterBulkDelete()` inline calls at `memory-bulk-delete.ts:151,258`; entity-density invalidation becomes a statediff subscriber.
- Convert `clearDegreeCache()` and `clearRelatedCache()` in `mutation-hooks.ts:70-71,83-95` from blanket post-call clears to typed subscribers on specific action kinds.
- Close entity-density cache scan-path gap: `memory-index.ts:361-366` `runPostMutationHooks('scan')` does not call `invalidateEntityDensityCache`; statediff `delete` actions on `memory_index` rows must notify the entity-density subscriber regardless of handler origin.
- Update `mutation-feedback.ts` feedback shape to reflect subscriber-based reporting rather than direct hook enumeration.

### Out of Scope

- Full schema redesign of `memory_index` and child tables.
- LLM-driven reconciliation or semantic arbitration.
- Cross-system replication or CocoIndex's heed-encoded KV store.
- Replacing manual `memory_causal_link` and manual unlink commands in the first pass.
- Removing the semantic policy layer from `memory_save`; prediction-error and reconsolidation remain policy decisions before storage diffing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/statediff.ts` | Create | Typed desired-prior diff engine, composite target support, and action model. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Build and apply scan action plans instead of scattered index/update/delete branches. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Reconcile single-doc storage targets after dedup, embedding, and semantic policy decisions. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/*target*.ts` | Create | Target sinks for memory index, embedding, lexical rows, graph edges, and cache notifications. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Modify | Convert hook bundle into action-batch subscribers; move `clearDegreeCache()`, `clearRelatedCache()`, `clearGraphSignalsCache()` to typed subscribers. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Support generated edge-set reconciliation once frontmatter promoter emits desired edges. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modify | Remove inline `invalidateEntityDensityCacheAfterBulkDelete()` calls at lines 151 and 258; subscribe via action batch. Added by 012-causal-routing. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/mutation-feedback.ts` | Modify | Update feedback shape to reflect subscriber-based reporting; `coactivationCacheCleared` field introduced by 012 must be preserved. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Statediff produces a deterministic action plan for any desired-prior pair. | Unit tests cover insert, upsert, replace, delete, no-op, incomplete prior, and composite child-row cases. |
| REQ-002 | Applied actions are invariant under reordering where target dependencies allow it. | Applying the same action set in supported orders yields the same final durable rows. |
| REQ-003 | `memory_index_scan` produces a statediff plan before DB writes. | Scan logs or debug output include planned actions before any target sink mutates rows. |
| REQ-004 | Stale deletes remain guarded by replacement-index success. | Existing behavior that defers stale cleanup after failed replacement indexing is preserved in statediff planning. |
| REQ-005 | `memory_save` uses statediff for durable storage targets after semantic policy gates. | Save path reconciles memory row, embedding row, lexical rows, and related projections through target sinks. |
| REQ-010 | The `memory_save` statediff conversion MUST model post-insert enrichment as ASYNC / pending-marker replay (commit `0060a097b3` deferred enrichment after row commit), not same-response graph writes. | Durable rows commit synchronously; generated graph/enrichment edges are applied via the async pending-marker path and reconciled on replay, never in the same save response. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Subscribers receive per-action notifications. | Alias conflict detection, divergence reconciliation, retention sweep, and cache invalidation can opt into action batches. |
| REQ-007 | Alias conflict detection runs as a subscriber. | The scan handler no longer directly runs alias conflict detection inline after indexing except as subscriber dispatch. |
| REQ-008 | Action batches include enough context for cache precision. | Subscribers can see target type, key, action, old state hash, new state hash, and source operation. |
| REQ-009 | Manual causal commands remain imperative initially. | `memory_causal_link` and manual unlink keep current user-command semantics unless generated edge-set reconciliation is active. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_index_scan` produces a statediff plan before any DB writes.
- **SC-002**: Alias conflict detection runs as a subscriber, not as an inline handler hook.
- **SC-003**: Re-running a no-op scan produces an empty or no-op action batch and no durable writes.
- **SC-004**: A failed replacement indexing run does not apply stale delete actions.
- **SC-005**: Cache invalidation receives applied action details instead of only broad operation strings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 003 stable chunk identities. | High | Do not use chunk rows as diff keys until `chunk_id` and `chunk_fingerprint` are stable. |
| Risk | This is the largest refactor of the five packets. | High | Start with scan planning and lexical or embedding targets before moving every write path. |
| Risk | Cache hooks could lose precision during conversion. | Medium | Preserve existing broad invalidation as fallback until subscribers prove equivalent. |
| Risk | Action sink ordering can create transient inconsistencies. | High | Define sink order and transaction boundaries before implementation. |
| Risk | Semantic policy may be mistaken for storage diffing. | Medium | Keep prediction-error, reconsolidation, and user-commanded causal link behavior outside the generic diff engine. |
| Dependency | Existing mutation hook feedback shape. | Medium | Maintain response feedback compatibility while internal hooks become subscribers. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should embedding rows or FTS and BM25 rows be the first statediff target sink?
- Should target sinks run inside one transaction per memory document or one transaction per action batch?
- Should subscriber failures fail the write, or report degraded post-mutation hygiene while preserving durable writes?
- Should alias conflicts use a fifth conflict action outside CocoIndex's four literals, or a policy layer over `replace`?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
