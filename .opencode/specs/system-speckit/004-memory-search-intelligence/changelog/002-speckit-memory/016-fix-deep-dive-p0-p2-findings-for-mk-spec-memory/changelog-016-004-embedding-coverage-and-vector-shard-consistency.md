---
title: "Changelog: Embedding Coverage and Vector-Shard Consistency [016/004-embedding-coverage-and-vector-shard-consistency]"
description: "Closed the embedding coverage and vector-shard consistency gaps so rows stop landing success-without-vector, stale-model vectors are not compared against a different query embedder and retry-exhausted rows are rescuable."
trigger_phrases:
  - "embedding coverage changelog"
  - "vector shard consistency"
  - "embedding model provenance backfill"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency/` (Level 3)
> Parent packet: `.opencode/specs/system-speckit/004-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

Rows stop falling into the gap between indexed and actually embedded. Drains no longer produce success-without-vector rows. A stale-model vector is never silently compared against a different query embedder. Retry-exhausted rows are rescuable instead of stranded. The auto shard-repair sentinel now counts `vec_memories`, the surface the writes actually target, so it finally clears once vectors exist. A model-provenance backfill ran on the live index under an atomic backup. It normalized 1,026 long-spelling rows and derived the model for about 9,465 previously-empty rows from real shard provenance. It left 9,817 genuinely-unembedded rows untouched and reported them. Shipped in `289f5d57b5`.

### Added

- `memory_embedding_reconcile` corrected and gated. It is dry-run by default. On apply it reconciles stale-but-present vectors to success and resets vector-missing rows to retry for the async drain.
- A dry-run-default, checkpoint-gated, audited migration that backfills `embedding_model` from each row's real shard provenance.

### Changed

- The chunking safe-swap no longer deletes the row it just wrote.
- The drain scales its batch and interval by queue size so a large backlog clears without starving the loop.
- The sync and drain paths embed the same weighted text and hash it into the same cache key, so the shared cache is not poisoned by two texts under one key.
- Query time asserts embedder identity, so a vector from one model is not compared against a query embedded by another.
- Scan coalescing is scope-aware, so a scan for one scope no longer swallows a concurrent scan for another.
- Over-threshold documents keep one truncated vector while FTS and BM25 cover the full-text tail (ADR-001). Scan-path chunking stays off as the reversible, migration-free choice.

### Fixed

- Retry-exhausted rows are visible to the rescue path instead of invisible to both scan reindex and the retry queue.
- The auto shard-repair sentinel counted a `vec_<dim>` table it never populated. It now counts `vec_memories` and clears once vectors exist.
- `pendingVectors` counts updated rows whose embeddings are still pending rather than undercounting them.
- Two pre-existing failing tests from phase-002 mock drift were fixed.

### Verification

- `npm run build` clean.
- 004 vitest 122 of 122 across 7 files.
- REQ-001 through REQ-012 xhigh review pass after remediation, 7 of 12 on the first pass.
- Model backfill on live under backup, integrity ok, 10,491 audit rows.
- Reconcile dry-run on live identified 12,226 missing-vector rows. The apply is daemon-side.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/lib/embedders/embedding-reconcile.ts` carries the corrected reconcile.
- `mcp_server/lib/search/vector-index-store.ts` fixes the shard-repair sentinel.
- `mcp_server/scripts/migrations/normalize-embedding-model-provenance.mjs` is the model backfill.

### Follow-Ups

- The reconcile apply is daemon-side. It resets the 12,226 vector-missing rows to retry when the daemon picks up this code, then the async drain re-embeds them.
- About 9,817 rows remain without a model or a vector until their next embed.
- Rollback is `context-index.sqlite.pre-004-model-backfill-20260703` or the `embedding_model_backfill_audit` table.
