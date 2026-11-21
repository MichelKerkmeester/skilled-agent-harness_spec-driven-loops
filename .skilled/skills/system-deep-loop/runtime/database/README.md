---
title: "runtime/ Database"
description: "Persistent SQLite state for deep-loop execution history and convergence metadata."
---

# runtime/ Database

---

## 1. OVERVIEW

Persistence layer for deep-loop graph state. Research, review and context scripts read and write `deep-loop-graph.sqlite` through `../lib/coverage-graph/`. `council-graph.sqlite` is a legacy file that no script reads or writes any more.

---

## 2. FILES

| File | Purpose |
|------|---------|
| `deep-loop-graph.sqlite` | SQLite database holding coverage-graph state across deep-* sessions |
| `council-graph.sqlite` | Legacy AI Council graph database, kept on disk. No current script reads or writes it |

---

## 3. LIFECYCLE

- Created on first script invocation if absent. `initDb` in [`coverage-graph-db.ts`](../lib/coverage-graph/coverage-graph-db.ts) creates the directory and file, applies schema migrations and enables WAL journaling and foreign keys. It throws instead of reusing a connection that is open read-only or on another directory
- Graph writer locks are implemented by `../scripts/lib/cli-guards.cjs` `acquireWriterLock` using `wx` lock-file acquisition, stale-lock reclamation and nonce ownership checks
- Not tracked at `.sqlite-shm` or `.sqlite-wal` level because transient SQLite artifacts are ignored by git
- `DEEP_LOOP_COVERAGE_DB_DIR` points the coverage graph at another directory, so tests and diagnostics can use a scratch database instead of this one

---

## 4. VALIDATION

From the repository root, run the coverage-graph database tests through the runtime configuration. They open the database in a temporary directory, so this folder's database is not touched.

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts coverage-graph-db
```

---

## 5. RELATED RESOURCES

- Schema: [`../lib/coverage-graph/`](../lib/coverage-graph/)
- Writer-lock contract: [`../scripts/lib/cli-guards.cjs`](../scripts/lib/cli-guards.cjs)
- [Runtime overview](../README.md)
