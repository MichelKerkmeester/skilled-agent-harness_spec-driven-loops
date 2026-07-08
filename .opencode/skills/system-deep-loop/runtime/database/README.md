---
title: "deep-loop-runtime Database"
description: "Persistent SQLite state for deep-loop execution history and convergence metadata."
---

# deep-loop-runtime Database

---

## 1. OVERVIEW

Persistence layer for deep-loop graph state. Research, review and context scripts read and write `deep-loop-graph.sqlite` through `lib/coverage-graph/`; council mode switches to `council-graph.sqlite` through `lib/council/council-graph-db.ts`.

## 2. FILES

| File | Purpose |
|------|---------|
| `deep-loop-graph.sqlite` | SQLite database holding coverage-graph state across deep-* sessions |
| `council-graph.sqlite` | SQLite database holding AI Council graph state across council sessions |

## 3. LIFECYCLE

- Created on first script invocation if absent
- Graph writer locks are implemented by `scripts/lib/cli-guards.cjs` `acquireWriterLock` using `wx` lock-file acquisition, stale-lock reclamation and nonce ownership checks
- Not tracked at `.sqlite-shm` or `.sqlite-wal` level because transient SQLite artifacts are ignored by git

## 4. RELATED RESOURCES

- Schema: `lib/coverage-graph/`
- Council schema: `lib/council/council-graph-db.ts`
- Writer-lock contract: `scripts/lib/cli-guards.cjs`
