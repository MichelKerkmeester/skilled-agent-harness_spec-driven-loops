# Deep Review Strategy

## Files Under Review

| File | Phase | Role |
|------|-------|------|
| `code-graph-db.ts` | 001 | Bitemporal close-and-insert writer + asOf reader |
| `structural-indexer.ts` | 001 | Degree-cap default + force-parse filtering |
| `scoring-constants.ts` | 004 | Advisor penalty contract documentation |
| `context-server.ts` | 003 | `selectBudgetTrimIndex` helper + trim loop rewrite |
| `search-results.ts` | 003 | `appendExempt` marking + `isTailAppendedRow` |
| `true-citation-emitter.ts` | 003 | Density probe + content-anchor citation detection |
| `memory-crud-health.ts` | 003 | Health surface for citation density |
| `code-edge-bitemporal-reindex.vitest.ts` | 001 | Bitemporal integration test |
| `reverse-dep-degree-cap-default.vitest.ts` | 001 | Degree-cap inertness test |
| `append-exempt-serializer.vitest.ts` | 003 | Append-exempt marking + trim tests |
| `advisor-self-recommendation-penalty-contract.vitest.ts` | 004 | Penalty regression test |
| `dedup-scale-test.mjs` | 002 | Fan-out dedup scale test |
| `gauge-flood-test.mjs` | 002 | Progress-heartbeat + lag-ceiling flood test |

## Known Context

- Commit 420c4734f3 is the 010 graduation follow-ups, all behind default-off flags
- Deep-loop gauge defaults committed at 0; production values (30s, 1500ms) proven externally
- The cli executor pass was 6/7 green on first run, 14/14 on rerun
- Sub-phase 003 implementation-summary shows completion_pct: 90 (cli test pass pending)

## Review Boundaries

- Scope: Only the changes in commit 420c4734f3
- Out: Pre-existing issues, unrelated files, broader subsystem concerns
- The committed defaults are 0 for gauges; review covers what IS committed, not proposed values
