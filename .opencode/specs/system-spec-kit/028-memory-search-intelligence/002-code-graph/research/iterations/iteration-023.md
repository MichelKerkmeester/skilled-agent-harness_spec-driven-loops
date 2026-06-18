# Iteration 23: Round J Build Sequence — Code Graph (one migration chokepoint; bi-temporal critical path)

## Focus
Round J: the ordered build sequence for Code Graph. Read-only.

## Migration chokepoint (confirmed)
`SCHEMA_VERSION=5` (code-graph-db.ts:142); `ensureSchemaMigrations()` has ONE call site (initDb :511) on the WAL singleton; body is purely additive (hasColumn→ALTER, CREATE IF NOT EXISTS) — **no table-rebuild pattern exists yet.** All writers wrap in `d.transaction()` on the one serialized connection → schema changes serialize as ordered migrations.

## Build sequence (newInfoRatio 0.40)
| Phase | Candidates | Note |
|---|---|---|
| 0 | Q6-C2 (metadata watermark, no migration), det-context-order-global → Q4-C1 (RRF-additive), CG-incremental-edge-staleness-repair (benchmark) | OFF the schema chokepoint; read-path + metadata only |
| 1 | CG-closed-vocab-CHECK (FIRST table-rebuild migration), Q6-C1 generation (additive ALTER) | order the edge_type rebuild here so Phase-3 extends the rebuilt table; SCHEMA_VERSION bump |
| 2 | Q1-C1 columns + Q1-C1-views (ATOMIC keystone — the live current-view is the read chokepoint) | depends on Q6-C1 generation; land as ONE migration |
| 3 | edge-lifecycle (atomic supersede) → CRDT-merge (NEEDS-BENCHMARK) | depends on Q1-C1; standalone edge-bitemporal-lifecycle REFUTED (per-scan rebuild + tombstones cover deletion-history) |

**Critical path:** Q6-C1 generation → Q1-C1 columns+views (ATOMIC keystone) → edge-lifecycle → CRDT-merge, fully serialized through the single ensureSchemaMigrations/SCHEMA_VERSION boundary.

## Key note (per J6 re-verify)
Q6-C2's bump site is NOT ensure-ready.ts:497 as I4 sketched (that's setLastGitHead in the out-of-scope-HEAD branch, doesn't fire on full_scan/selective_reindex) — the generation bump is a PROPOSED insertion needing a correct scan-finalize site, not existing code. CG-closed-vocab-CHECK needs a pre-migration `SELECT DISTINCT edge_type NOT IN(...)` scan (incl. nullable tombstone.edge_type) before the rebuild — "no risk" was unverified.

## Next Focus
Feeds the roadmap re-sync (Code Graph build order) + corrects the Q6-C2 bump-site claim.
