---
title: "Feature Specification: memory_embedding_reconcile() MCP maintenance tool"
description: "Guarded, dry-run-default MCP tool that converges memory_index.embedding_status for vector-present stale rows and resets genuinely missing-vector retry-retention rows."
trigger_phrases:
  - "memory_embedding_reconcile"
  - "embedding status reconcile"
  - "embedding backlog drain"
  - "vector present status stale"
  - "embedding maintenance tool"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 spec for memory_embedding_reconcile() tool"
    next_safe_action: "Implement core logic + handler + registration, then run vitest + build"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/handlers/memory-embedding-reconcile.ts"
      - "mcp_server/tests/embedding-reconcile.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: memory_embedding_reconcile() MCP maintenance tool

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned / in implementation |
| **Created** | 2026-05-27 |
| **Branch** | `main` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The one-time backlog repair — vector-present rows whose `embedding_status` is stale at `failed`/`pending`/`retry`, which must be flipped to `success` — was executed via hand-written guarded SQL ("emergency fallback" in 004 `research/research.md` §7-§8). That path is manual, easy to misapply against the wrong shard, and unsafe to re-run by an operator without re-deriving every predicate by hand. 004 `research.md` §7 and §13 call for a first-class, guarded MCP tool so the repair is repeatable instead of a copy-pasted transaction.

### Purpose
Implement `memory_embedding_reconcile()` as a safe, repeatable, dry-run-default MCP maintenance tool. It resolves the active embedder from runtime metadata, verifies the attached active vector shard, reports four reconciliation buckets in dry-run, and — only in apply mode — converges vector-present stale rows to `success` and resets genuinely missing-vector retry-retention rows to `retry`, all inside one transaction.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New core logic `mcp_server/lib/embedders/embedding-reconcile.ts` exporting `runMemoryEmbeddingReconcile(database, args)`.
- New thin handler `mcp_server/handlers/memory-embedding-reconcile.ts` (mirrors the `memory_retention_sweep` handler shape).
- Tool registration across `tools/memory-tools.ts`, `schemas/tool-input-schemas.ts`, `tool-schemas.ts`, `handlers/index.ts`, `tools/types.ts`, and `context-server.ts` (`MEMORY_RUNTIME_TOOL_NAMES`).
- Vitest suite at `mcp_server/tests/embedding-reconcile.vitest.ts` covering the 7 scenarios from 004 `iteration-008.md` §F4.

### Out of Scope
- Pruning/dedup of masked duplicate rows (`failed_masked_by_newer_latest_path_anchor_row`) — explicitly out per 004 `iteration-008.md` §F3; that is a separate maintenance tool with different safety checks.
- The success-rows-missing-active-vector hygiene pass — that is packet `007-success-vector-coverage-hygiene`.
- Re-embedding work for genuinely missing vectors beyond resetting them to `retry` (the retry-manager owns the embed).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp_server/lib/embedders/embedding-reconcile.ts | Create | Core `runMemoryEmbeddingReconcile()` logic, buckets, guarded transaction |
| mcp_server/handlers/memory-embedding-reconcile.ts | Create | Thin MCP handler delegating to core logic |
| mcp_server/tools/memory-tools.ts | Modify | Register tool definition |
| mcp_server/schemas/tool-input-schemas.ts | Modify | Add input schema for the args object |
| mcp_server/tool-schemas.ts | Modify | Add tool schema entry |
| mcp_server/handlers/index.ts | Modify | Export/route the new handler |
| mcp_server/tools/types.ts | Modify | Add result/args typing |
| mcp_server/context-server.ts | Modify | Add to `MEMORY_RUNTIME_TOOL_NAMES` |
| mcp_server/tests/embedding-reconcile.vitest.ts | Create | 7-scenario vitest suite |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Core logic + dry-run schema | `runMemoryEmbeddingReconcile(database, args)` resolves the active embedder from main `vec_metadata` (`active_embedder_name`/`active_embedder_dim`/`active_embedder_provider`), verifies the `active_vec` shard metadata matches (name + dim + provider, where a null main provider passes) → `activeShardVerified`; dimension table is `vec_<dim>`. Dry-run emits the exact schema in 004 `iteration-008.md` §F1: `activeEmbedder`, `safety`, four buckets (`vector_present_status_stale` with `byStatus` failed/pending/retry split, `missing_active_vector_retry_eligible`, `missing_active_vector_provider_failure`, diagnostic `failed_masked_by_newer_latest_path_anchor_row` with `overlapsBucket`+`policy:reconcile`), and `plannedMutations`. |
| REQ-002 | Apply-mode guarded transaction | One transaction (`BEGIN IMMEDIATE`), ordered: (1) vector-present non-success rows → `success` (clear `failure_reason`, stamp `embedding_generated_at` via COALESCE), guarded by active-shard metadata match; (2) only if `resetMissing`: missing-vector rows that are `pending`/`retry` OR `failed` with `failure_reason LIKE 'Retry retention%'` → `retry` (`retry_count=0`, `last_retry_at=NULL`, `failure_reason=NULL`). Non-retention provider failures are report-only by default. Reconcile-before-reset ordering is mandatory (004 `iteration-008.md` §F2; SQL in §F2 / `iteration-010.md` §F6). |
| REQ-003 | Args + fail-closed guards | Args `{ mode: 'dry-run'\|'apply' (default 'dry-run'), activeOnly (default true), resetMissing (default true), missingFailureScope ('retry-retention' default), maskedFailedPolicy ('reconcile' default), providerFailurePolicy ('report-only' default), requireActiveShard (default true) }`. `requireActiveShard` + unverified shard → fail closed: dry-run reports `activeShardVerified=false`; apply mutates zero rows or raises a typed guard error. Active shard is resolved from runtime metadata only — never a caller-supplied path. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Vitest coverage (7 scenarios) | The 7 scenarios from 004 `iteration-008.md` §F4: (1) dry-run bucket counts incl. failed/pending/retry status split; (2) apply → `success` without enqueue; (3) missing-vector retention reset shape (`retry`/`retry_count=0`/`last_retry_at=NULL`/`failure_reason=NULL`); (4) provider-failure rows unchanged; (5) active-shard fail-closed (dry-run `activeShardVerified=false`, apply zero mutations / typed guard error); (6) masked rows reconciled-not-pruned negative test; (7) idempotency — second dry-run after apply reports all-zero action buckets. |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Dry-run is the default mode and never mutates the database; an operator must explicitly pass `mode: 'apply'` to write.
- **SC-002**: Apply mode is idempotent — a second dry-run after apply reports `vector_present_status_stale=0`, `missing_active_vector_retry_eligible=0`, and `missing_active_vector_provider_failure=0`.
- **SC-003**: The full vitest suite is green and `npm run build` succeeds with no regressions to existing handler/tool registration.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Active vector shard + `vec_metadata` | Cannot verify shard → cannot safely reconcile | Fail closed when `requireActiveShard` and shard unverified |
| Dependency | `memory_retention_sweep` handler/lib/registration pattern | Inconsistent wiring if pattern diverges | Mirror the existing sweep handler structure exactly |
| Risk | Deleting real provider-error evidence | Loss of diagnostic history | Non-retention provider failures are report-only by default |
| Risk | Masked failed rows erroneously pruned | Loss of historical memory rows | `maskedFailedPolicy='reconcile'` only; pruning is out of scope |
| Risk | Operator expecting a 17k-row run | Confusion when apply is a near-noop on current DB | Plan documents the backlog was already cleared this session (see plan.md) |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Dry-run executes as bounded read-only aggregate queries against `memory_index` joined to the attached active shard; single-pass bucket counts, no per-row round-trips.
- **NFR-P02**: Apply runs in one `BEGIN IMMEDIATE` transaction so the reconcile + optional reset commit atomically.

### Security
- **NFR-S01**: The active shard path is derived from runtime metadata only; the tool never accepts a caller-supplied shard path.
- **NFR-S02**: Fail-closed on shard mismatch, missing shard metadata, partial/zero-dim vectors, or any unverified active-shard condition.
- **NFR-S03**: Apply never deletes rows; it only updates `embedding_status` and adjacent retry/failure columns.

### Reliability
- **NFR-R01**: Reconcile-before-reset ordering is preserved so vector-present rows are converged before any missing-vector reset.
- **NFR-R02**: Idempotent — re-running apply against an already-reconciled DB is a near-noop with zero action-bucket rows.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Zero stale rows**: On the current live DB the backlog was already cleared this session, so all action buckets are 0 and apply is a near-noop. The tool must report cleanly rather than error.
- **Masked-vs-stale overlap**: `failed_masked_by_newer_latest_path_anchor_row` overlaps `vector_present_status_stale`; the masked bucket is diagnostic only and must NOT filter the success reconciliation update.
- **Null main provider**: When main `vec_metadata.active_embedder_provider` is null/empty, the provider check passes (name + dim must still match).

### Error Scenarios
- **Active shard metadata mismatch**: `activeShardVerified=false`; apply mutates zero rows or raises a typed guard error.
- **Missing shard / cannot attach**: Treated as unverified shard → fail closed under `requireActiveShard`.
- **Non-retention provider failure**: Reported in `missing_active_vector_provider_failure`, never reset by default (preserves real error evidence).

### Concurrent Operations
- **Concurrent drain**: Apply uses `BEGIN IMMEDIATE`; the runbook requires not running apply concurrently with a retry drain.
- **Repeated apply**: Second run is idempotent — already-`success` rows are not re-touched.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~2 new files + 6 registration edits + 1 test file in the MCP server |
| Risk | 14/25 | Guarded DB mutation tool; fail-closed shard verification; no schema migration |
| Research | 4/20 | Acceptance contract already derived in 004 iteration-008/010 + research §7-§8 |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should a future prune/dedup tool handle the 15,152 masked failed rows? **RESOLVED: Out of scope here; deferred to a separate maintenance tool (004 `iteration-008.md` §F3).**
- Should apply ever reset non-retention provider failures? **RESOLVED: No by default; `providerFailurePolicy='report-only'` preserves error evidence.**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->
