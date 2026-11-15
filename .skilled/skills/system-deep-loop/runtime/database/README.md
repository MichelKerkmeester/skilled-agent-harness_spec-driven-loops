---
title: "runtime/ Database"
description: "Persistent SQLite state for deep-loop execution history and convergence metadata."
---

# runtime/ Database

---

## 1. OVERVIEW

Persistence layer for deep-loop graph state. Research, review and context scripts read and write `deep-loop-graph.sqlite` through `lib/coverage-graph/`. `council-graph.sqlite` is a legacy file that no script reads or writes any more.

---

## 2. FILES

| File | Purpose |
|------|---------|
| `deep-loop-graph.sqlite` | SQLite database holding coverage-graph state across deep-* sessions |
| `council-graph.sqlite` | Legacy AI Council graph database, kept on disk; no current script reads or writes it |

---

## 3. LIFECYCLE

- Created on first script invocation if absent
- Graph writer locks are implemented by `scripts/lib/cli-guards.cjs` `acquireWriterLock` using `wx` lock-file acquisition, stale-lock reclamation and nonce ownership checks
- Not tracked at `.sqlite-shm` or `.sqlite-wal` level because transient SQLite artifacts are ignored by git

---

## 4. RELATED RESOURCES

- Schema: `lib/coverage-graph/`
- Writer-lock contract: `scripts/lib/cli-guards.cjs`
