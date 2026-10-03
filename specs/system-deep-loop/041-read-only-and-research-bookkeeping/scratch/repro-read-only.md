# Reproduction: no read-only path on the graph scripts

Command: `rg -n "readOnly|read-only|dryRun|dry-run" scripts/status.cjs scripts/query.cjs scripts/convergence.cjs lib/coverage-graph/coverage-graph-db.ts lib/council/council-graph-db.ts` (from the runtime root)
Output: no matches (exit 1).

Read: `initDb` in `coverage-graph-db.ts` calls `mkdirSync(dbDir, { recursive: true })`, `new Database(dbPath)`, `journal_mode = WAL`, `db.exec(SCHEMA_SQL)` and inserts or bumps `schema_version`; `getDb()` lazy-calls it. `council-graph-db.ts` does the same for `council_schema_version`. `status.cjs` and `convergence.cjs` call `appendObservabilityEvent` after every run; `convergence.cjs` passes `persistSnapshot` through.

Verdict: holds.
