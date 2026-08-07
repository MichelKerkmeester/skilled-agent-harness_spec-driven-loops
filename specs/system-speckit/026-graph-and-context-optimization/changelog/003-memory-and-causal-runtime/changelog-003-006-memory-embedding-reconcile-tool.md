---
title: "memory_embedding_reconcile() MCP Maintenance Tool"
description: "Guarded, dry-run-default MCP tool that converges memory_index.embedding_status for vector-present stale rows and resets genuinely missing-vector retry-retention rows inside one ordered transaction. Replaces hand-written emergency SQL with a repeatable, fail-closed operator operation."
trigger_phrases:
  - "memory_embedding_reconcile"
  - "embedding status reconcile tool"
  - "embedding backlog drain"
  - "vector present status stale fix"
  - "embedding reconcile mcp"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

The one-time backlog repair that flipped vector-present rows from stale `failed`/`pending`/`retry` to `success` in `memory_index.embedding_status` was executed via hand-written guarded SQL. That path was manual, easy to misapply against the wrong shard. It was also unsafe to re-run without re-deriving every predicate by hand.

A guarded, dry-run-default `memory_embedding_reconcile()` MCP maintenance tool now replaces that emergency SQL with a repeatable operation. The tool resolves the active embedder from runtime metadata, verifies the attached active vector shard, reports four reconciliation buckets in dry-run. In apply mode it converges vector-present stale rows to `success` then resets genuinely missing-vector retry-retention rows to `retry` inside one `BEGIN IMMEDIATE` transaction. Non-retention provider failures are report-only by default to preserve diagnostic evidence. A hardening pass followed the initial ship to tighten guard logic per an external review.

On the current DB the tool is a near-noop because the roughly 17k backlog was already cleared in the same session. The tool is the canonical path for any future reconciliation run.

### Added

- `runMemoryEmbeddingReconcile()` core logic in `lib/embedders/embedding-reconcile.ts` with four-bucket dry-run schema, active-shard verification, `ActiveShardGuardError` fail-closed guard. Applies changes under `BEGIN IMMEDIATE` transaction.
- Thin MCP handler at `handlers/memory-embedding-reconcile.ts` mirroring the `memory_retention_sweep` wiring pattern
- 8-scenario vitest suite at `tests/embedding-reconcile.vitest.ts` covering bucket counts, apply correctness, retention reset shape, provider-failure isolation, fail-closed shard guard, masked-row reconcile-not-prune. Includes idempotency verification.

### Changed

- `tools/memory-tools.ts`: registered the new tool definition
- `schemas/tool-input-schemas.ts`: added args input schema for the reconcile tool
- `tool-schemas.ts`: added tool schema entry
- `handlers/index.ts`: routed the new handler
- `tools/types.ts`: added result and args typing
- `context-server.ts`: added `memory_embedding_reconcile` to `MEMORY_RUNTIME_TOOL_NAMES`

### Fixed

- Repeated apply against an already-reconciled DB is now idempotent. A second dry-run after apply reports all action buckets at zero rather than re-processing already-converged rows.

### Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Unit | Pass | 8 scenarios | Bucket counts, status split, shard verification, args defaults, masked-row reconcile-not-prune |
| Integration | Pass | apply and idempotency | Reconcile-before-reset ordering. Second dry-run all-zero. Fail-closed guard throws. |
| Manual | Pass | Live dry-run | MCP tool on live DB: `activeShardVerified=true`, `vector_present_status_stale=0`, latency ~23ms |
| Checklist | Pass | Core items | Build clean. 12/12 vitest (8 reconcile and 4 hygiene). Live dry-run confirmed. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/embedders/embedding-reconcile.ts` (NEW) | Created | Core `runMemoryEmbeddingReconcile()`, four-bucket schema, guarded `BEGIN IMMEDIATE` transaction |
| `mcp_server/handlers/memory-embedding-reconcile.ts` (NEW) | Created | Thin MCP handler delegating to core logic |
| `mcp_server/tests/embedding-reconcile.vitest.ts` (NEW) | Created | 8-scenario vitest suite |
| `mcp_server/tools/memory-tools.ts` | Modified | Registered new tool definition |
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | Added args input schema |
| `mcp_server/tool-schemas.ts` | Modified | Added tool schema entry |
| `mcp_server/handlers/index.ts` | Modified | Routed new handler |
| `mcp_server/tools/types.ts` | Modified | Added result and args typing |
| `mcp_server/context-server.ts` | Modified | Added to `MEMORY_RUNTIME_TOOL_NAMES` |

### Follow-Ups

- Add a mutation-ledger governance-audit entry on apply mode. The initial ship omitted this to keep the core logic dependency-free. A follow-on packet can add it as a low-stakes status-flip audit trail.
- Implement a future prune/dedup tool for the masked `failed_masked_by_newer_latest_path_anchor_row` rows. Pruning is out of scope here and requires different safety checks per the acceptance contract.
- Address success-rows-missing-active-vector hygiene in packet `007-success-vector-coverage-hygiene`, which reuses the active-shard verification pattern from `lib/embedders/embedding-reconcile.ts`.
