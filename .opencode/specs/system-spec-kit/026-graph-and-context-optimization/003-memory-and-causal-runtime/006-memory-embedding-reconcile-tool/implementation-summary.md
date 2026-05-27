---
title: "Implementation Summary: memory_embedding_reconcile() MCP maintenance tool"
description: "Level 2 implementation summary skeleton for the guarded reconcile tool; Files Changed and verification tables are pending finalization after coding."
trigger_phrases:
  - "memory_embedding_reconcile summary"
  - "embedding reconcile implementation summary"
  - "reconcile tool what was built"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool"
    last_updated_at: "2026-05-27T08:53:23Z"
    last_updated_by: "main_agent"
    recent_action: "implemented-verified-memory-embedding-reconcile-tool-8-scenario-vitest-green"
    next_safe_action: "none-006-shipped-live-daemon-serves-tool-apply-is-operator-choice"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/handlers/memory-embedding-reconcile.ts"
      - "mcp_server/tests/embedding-reconcile.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tool implemented + registered across all wiring points; 8-scenario vitest green; build clean; live dry-run confirmed activeShardVerified=true"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-memory-embedding-reconcile-tool |
| **Completed** | 2026-05-27 |
| **Level** | 2 |
| **Actual Effort** | ~1 session (single agent: research + implement + verify) |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A guarded, dry-run-default `memory_embedding_reconcile()` MCP maintenance tool that converges `memory_index.embedding_status` for vector-present stale rows (→ `success`) and resets genuinely missing-vector retry-retention rows (→ `retry`) inside one ordered transaction. Core logic lives in `lib/embedders/embedding-reconcile.ts`; a thin handler delegates to it. The tool replaces the hand-written emergency SQL used for the one-time backlog repair (004 `research.md` §7-§8) with a repeatable operation. On the current DB this is a near-noop because the ~17k backlog was already cleared this session (005 Operator Run Record).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/embedders/embedding-reconcile.ts` | Created | Core `runMemoryEmbeddingReconcile()`, buckets, guarded transaction |
| `mcp_server/handlers/memory-embedding-reconcile.ts` | Created | Thin MCP handler delegating to core logic |
| `mcp_server/tools/memory-tools.ts` | Modified | Register tool definition |
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | Add args input schema |
| `mcp_server/tool-schemas.ts` | Modified | Add tool schema entry |
| `mcp_server/handlers/index.ts` | Modified | Route the new handler |
| `mcp_server/tools/types.ts` | Modified | Add result/args typing |
| `mcp_server/context-server.ts` | Modified | Add to `MEMORY_RUNTIME_TOOL_NAMES` |
| `mcp_server/tests/embedding-reconcile.vitest.ts` | Created | 7-scenario vitest suite |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built and verified inside the MCP server (`cd .opencode/skills/system-spec-kit/mcp_server && npm run build` — clean, no TS errors) and exercised by an 8-scenario vitest suite (`tests/embedding-reconcile.vitest.ts`) against seeded SQLite fixtures with an attached `active_vec` shard (plain `vec_768`/`vec_memories_rowids` tables — the logic only does `EXISTS` on id/rowid, so real sqlite-vec is not needed in tests). The apply path runs inside a `BEGIN IMMEDIATE` transaction (better-sqlite3 `.immediate()`). Confirmed end-to-end by a dry-run against the live `context-index.sqlite` via the registered MCP tool: `activeShardVerified=true`, `vector_present_status_stale=0` (the ~17k backlog was already cleared earlier this session), latency ~23ms. No production apply was performed for this packet — apply on the live DB is an operator choice.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Dry-run is the default mode | Safety — apply requires an explicit `mode: 'apply'` |
| Active shard resolved from runtime metadata only | Never trust a caller-supplied shard path; fail closed on mismatch |
| Masked rows reconciled to `success`, never pruned | Pruning is a separate future tool with different safety checks (004 §F3) |
| Non-retention provider failures report-only | Preserves real provider-error evidence |
| Mirror `memory_retention_sweep` handler/lib/registration pattern | Consistent wiring across the MCP server |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Unit | Pass | 8 scenarios | Bucket counts + status split, shard verification, args defaults, masked-row reconcile-not-prune |
| Integration | Pass | apply + idempotency | Reconcile-before-reset ordering; second dry-run all-zero; fail-closed guard throws |
| Manual | Pass | live dry-run | MCP tool on live DB: activeShardVerified=true, stale=0, ~23ms |
| Checklist | Pass | core items | build clean + 12/12 vitest (8 reconcile + 4 hygiene) + live dry-run |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| lib/embedders/embedding-reconcile.ts | Covered | Covered | Covered (8-scenario suite) |
| handlers/memory-embedding-reconcile.ts | Live dry-run | - | Verified via live MCP call |


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Dry-run read-only aggregate, single pass | COUNT-only queries, zero writes | Pass |
| NFR-P02 | Apply in one BEGIN IMMEDIATE transaction | `database.transaction().immediate()` wraps both UPDATEs | Pass |
| NFR-S01 | Shard path from runtime metadata only | Resolved via attached `active_vec` + `vec_metadata`; no caller path | Pass |
| NFR-S02 | Fail closed on unverified shard | `ActiveShardGuardError` on apply; zero buckets on dry-run (tested) | Pass |
| NFR-R02 | Idempotent re-apply (near-noop) | Second dry-run all-zero (unit + live) | Pass |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pruning out of scope** — masked failed rows are reconciled to `success`, not pruned; dedup/prune remains a separate future tool.
2. **Success-rows-missing-vector not covered** — the inverse hygiene case is packet 007.
3. **Near-noop on current DB** — the ~17k backlog was already cleared this session; expect ~0 stale rows in dry-run today.
4. **Missing-vector reset relies on retention scope** — only retry-retention failures reset by default; non-retention provider failures stay report-only.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Mutation-ledger / governance-audit entry on apply | Omitted | Kept core logic dependency-free + low-risk; status-flip on vector-present rows is lower-stakes than the delete-based retention sweep. Deferrable follow-up. |
| Core logic also hosts the 007 `repairSuccessCoverage` extension | Shared `lib/embedders/embedding-reconcile.ts` | 007 reuses the same active-shard verification + transaction; documented in packet 007 |

<!-- /ANCHOR:deviations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 addendum
- Enhanced verification documentation
- Test coverage and NFR verification
-->
