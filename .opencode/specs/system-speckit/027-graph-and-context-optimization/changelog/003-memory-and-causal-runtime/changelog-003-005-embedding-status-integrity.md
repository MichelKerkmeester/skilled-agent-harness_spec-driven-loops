---
title: "Embedding Status Integrity: Durable Prevention Fixes"
description: "Three durable code fixes preventing the mk-spec-memory embedding backlog from recurring: reindex status commit, non-destructive retention for clean pending rows, call-time retention config accessors."
trigger_phrases:
  - "embedding status integrity"
  - "reindex status commit fix"
  - "retry retention non-destructive"
  - "call-time retention config"
  - "embedding backlog prevention"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/005-embedding-status-integrity` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

The 004 deep-research investigation surfaced three durable defects that prevented a bulk re-embed of the mk-spec-memory store from ever reaching a clean state. The reindex completion transaction wrote vectors but never committed `memory_index.embedding_status`, leaving rows stale after every run. The retention enforcer parked clean never-attempted `pending` rows as failed before the drain could embed them. Retry-retention config was read once at module load, so tuned environment variables never applied to a long-lived daemon without a full restart.

Three surgical fixes were shipped: REQ-001 adds a status-commit UPDATE to the reindex completion transaction, REQ-002 adds a guard that spares never-attempted rows from all three retention passes, REQ-003 adds call-time accessor methods so retention config reflects the live environment. All three fixes landed with extended vitest suites and a clean build.

### Added

- Status-commit UPDATE in `reindex.ts` completion transaction: rows backed by the active-profile vector now receive `embedding_status='success'` with `failure_reason` cleared and `embedding_generated_at` stamped
- `getMaxRetryQueuePending()` and `getMaxRetryQueueAgeMs()` call-time accessors on `RetryManager`, exported and used as retention defaults
- Assertions in `tests/embedder-reindex.vitest.ts` confirming all rows become `success` after a completed reindex
- Assertions in `tests/providers/retry-retention.vitest.ts` confirming the never-attempted guard is present in all three retention queries and that call-time config reads are honored

### Changed

- `enforceRetryRetentionLimits()` in `retry-manager.ts`: all three retention passes now carry `AND (embedding_status='retry' OR COALESCE(retry_count,0)>0)` so clean pending rows are never promoted to failed
- `tests/embedder-reindex.vitest.ts` upgraded to a realistic `memory_index` schema that includes the status columns, replacing the previous minimal fixture

### Fixed

- Reindex completion no longer leaves successfully vectorized rows in a stale `failed` or `pending` status, eliminating the primary driver of embedding-backlog accumulation
- Retention enforcer no longer destroys clean never-attempted `pending` work before the embed drain reaches it

### Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Build | Pass | `npm run build` (tsc + finalize-dist) exits clean. Fixes present in `dist/`. |
| Unit (reindex) | Pass | `tests/embedder-reindex.vitest.ts` status-commit assertion and existing job-lifecycle tests all green |
| Unit (retention) | Pass | `tests/providers/retry-retention.vitest.ts` guard-present and call-time-config assertions all green |
| Regression sweep | Pass | 135 of 136 coupled tests green |
| Pre-existing flake | Noted | `retry-manager.vitest.ts` T49 fails identically on untouched `main` (full-file ordering flake). Passes in isolation. Not introduced by this change. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | REQ-001: completion transaction commits `embedding_status='success'`, clears `failure_reason`, stamps `embedding_generated_at` and `updated_at` for rows in the active `vec_<dim>` table |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Modify | REQ-002: all three retention passes gain the never-attempted guard. REQ-003: `getMaxRetryQueuePending()` and `getMaxRetryQueueAgeMs()` added as call-time accessors and exported. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts` | Modify | Upgraded to realistic `memory_index` schema with status columns. Added assertion that all rows reach `success` after reindex. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/providers/retry-retention.vitest.ts` | Modify | Added assertions for the retry_count guard in all three retention queries and for call-time env reads |

### Follow-Ups

- Rebuild the daemon and restart the lease owner after deploying these fixes. A `/mcp` reconnect alone is not sufficient to activate the changes in `dist/`.
- Move the context-server hardcoded retry interval and batch size (5 min / 5 rows) to call-time environment reads. Deferred from this packet.
- Implement `memory_embedding_reconcile()` as a maintenance tool for future one-time backlog repairs. Currently only an emergency SQL fallback exists.
