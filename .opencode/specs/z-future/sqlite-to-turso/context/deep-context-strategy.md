# Deep-Context Strategy: SQLite surfaces → Turso migration touchpoints

## Scope

SQLite usage surfaces across system-spec-kit mcp_server, system-code-graph, and system-skill-advisor (better-sqlite3 + sqlite-vec + FTS5, recursive CTEs, pragmas, WAL, daemon/lease single-writer models) plus packet 027-xce-research-based-refinement storage changes (incremental-index schema v31-v34, causal tombstones, statediff reconciliation, OpenLTM retrieval observability), oriented at Turso/libSQL migration touchpoints.

## Executor Pool

| Label | Kind | Model | Framework | Perspective |
|-------|------|-------|-----------|-------------|
| mimo-a | cli-opencode | xiaomi/mimo-v2.5-pro (--variant high) | costar | Structure: schemas, tables, indexes, virtual tables, migrations |
| mimo-b | cli-opencode | xiaomi/mimo-v2.5-pro (--variant high) | costar | Write paths: transactions, triggers, WAL, locking, daemon single-writer |
| mimo-c | cli-opencode | xiaomi/mimo-v2.5-pro (--variant high) | costar | Migration risk: driver-API coupling (pragma/loadExtension/UDF/backup), Turso gap exposure |

Note: single-model pool (operator decision). Agreement counts distinct seat labels; perspectives are varied per seat to reduce correlation.

## Thresholds

- maxIterations: 10 · convergenceThreshold: 0.05 · relevanceGate: 0.55 · agreementMin: 2 · stuckThreshold: 2

## Frontier (seeded via glob_grep_fallback — code graph unavailable)

Ranked SLICE list (path groups, anchor-proximity ordered):

1. **spec-kit vector layer (sqlite-vec)** — `mcp_server/lib/search/vector-index-store.ts`, `vector-index-schema.ts`, `vector-index-queries.ts`, `vector-index-types.ts`, `hybrid-search.ts`, `db-shard-migration.ts`, `confidence-scoring.ts`, `embedders/reindex.ts`
2. **spec-kit FTS5/BM25 layer** — `mcp_server/lib/query/query-plan.ts`, `parsing/content-normalizer.ts`, `chunking/anchor-chunker.ts`, `storage/learned-triggers-schema.ts`
3. **recursive CTE + causal graph** — `mcp_server/lib/search/causal-boost.ts`, `storage/memo.ts`, `storage/causal-edges.ts`, `causal/sweep.ts`, `causal/frontmatter-promoter.ts`
4. **027 storage additions** — `mcp_server/lib/storage/incremental-index.ts`, `storage/statediff.ts`, `observability/retrieval-observability.ts`, `storage/mutation-ledger.ts`
5. **lifecycle/migrations** — `mcp_server/lib/storage/checkpoints.ts`, `storage/schema-downgrade.ts`, `governance/memory-retention-sweep.ts`, `storage/reconsolidation.ts`, `storage/consolidation.ts`
6. **system-code-graph DB layer** — `mcp_server/lib/code-graph-db.ts`, `recovery-procedures.ts`, `close-db-assertion.ts`
7. **system-skill-advisor DB layer** — `mcp_server/lib/skill-graph/skill-graph-db.ts`, `skill-graph-queries.ts`, `daemon/lease.ts`, `daemon/state-mutation.ts`, `freshness/sqlite-integrity.ts`
8. **cross-cutting infra** — `mcp_server/lib/session/session-manager.ts`, `analytics/session-analytics-db.ts`, `cache/embedding-cache.ts`, `eval/eval-db.ts`, `extraction/entity-extractor.ts`, `providers/retry-manager.ts`

## Known Context

- Baseline research docs 001-003 (frozen, written against Turso v0.5.0) enumerate 16 gaps; this loop maps the CURRENT code surface those gaps land on.
- Vendored comparison target: `external/turso-main` at v0.7.0-pre.6.
- Drivers: better-sqlite3 ^12.6.2 everywhere; sqlite-vec ^0.1.7-alpha.2 (spec-kit only).
- Observed during scaffolding: `[factory]` warnings about a malformed `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` shard and a missing `vec_768` table in `context-index.sqlite` — live evidence of shard-corruption handling worth confirming as an integration point.

## Next Focus

Iteration 1: Slice 1 — spec-kit vector layer (sqlite-vec): extension loading, vec0 virtual tables, shard layout, KNN query shapes, and the driver coupling in `vector-index-store.ts` / `db-shard-migration.ts`.
