# Mechanism Baseline And Verification

Accepted limitation: `database/context-index.sqlite` is unavailable in this worktree, so live p50/p95/RSS/scan-lag were not measured here. This scratch note records mechanism-level counters from unit fixtures only.

| Mechanism | Baseline Risk | Verified Counter |
| --- | --- | --- |
| Rescue hydration | N per-candidate hydration queries | 1 `id IN` hydration query for 8 candidates |
| Rescue backfill token routing | FTS MATCH can diverge from substring LIKE | Routed-vs-LIKE ordered ids equal for quotes, NEAR, OR, unary `-`, unicode, empty, and safe FTS route |
| Rank parity | Pure perf edits can reorder results | Fixed-query hybrid fusion ordered ids stable: `[1, 3, 4, 5]` |
| Graph adjacency | Rebuild on every search | Build count stays 1 on second search, increments after dirty mark and DB rebind |
| Community lookup | Parse/load per candidate | 1 lookup load per boost pass; injected boost value unchanged at `0.3` |
| Intent embedding | 2+ deterministic embeddings for same query text | `deterministicEmbeddingCalls <= 1` for repeated same query text |
| Envelope emission | Multiple stringify round trips in handler transforms | 1 serialization at final emission with equivalent envelope content |
| Keyword fallback | LIKE-only bounded SQL path, no FTS route | Safe token query routes through FTS candidate discovery and returns same LIKE top-K |
| Retrieval directives | `readFileSync` per result | 1 read for duplicate results at same `(path, mtime)`, 2 after mtime freshness change |
| Scan stale check | Per-path `statSync` | 0 stat calls and <=1 directory read for 24 stale paths in one directory |
| Provenance sources | `new Set` inside result loops | Hoisted scratch Set preserves ordered merged sources across repeated calls |

Commands:

| Command | Result |
| --- | --- |
| `npx vitest run tests/search-hot-path-performance.vitest.ts` | PASS, 1 file / 15 tests |
| `npx tsc --build` | PASS, no output |
| `npx vitest run tests/search-hot-path-performance.vitest.ts tests/hybrid-search.vitest.ts tests/intent-classifier.vitest.ts tests/intent-classifier-corpus.vitest.ts tests/incremental-index-v2.vitest.ts tests/stage2-fusion.vitest.ts` | PASS, 6 files / 238 tests |
