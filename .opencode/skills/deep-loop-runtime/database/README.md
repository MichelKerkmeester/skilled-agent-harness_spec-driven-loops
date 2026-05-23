---
title: "deep-loop-runtime Database"
description: "Persistent SQLite state for deep-loop execution history and convergence metadata."
---

# deep-loop-runtime Database

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. FILES](#2--files)
- [3. LIFECYCLE](#3--lifecycle)
- [4. RELATED RESOURCES](#4--related-resources)

---

## 1. OVERVIEW

Persistence layer for deep-loop graph state. Read and written by `scripts/*.cjs` entry points via the `lib/coverage-graph/` schema.

## 2. FILES

| File | Purpose |
|------|---------|
| `deep-loop-graph.sqlite` | SQLite database holding coverage-graph state across deep-* sessions |

## 3. LIFECYCLE

- Created on first script invocation if absent
- Backed by atomic-write and flock locking via `lib/deep-loop/atomic-state`
- Not tracked at `.sqlite-shm` or `.sqlite-wal` level because transient SQLite artifacts are ignored by git

## 4. RELATED RESOURCES

- Schema: `lib/coverage-graph/`
- Atomic-state contract: `lib/deep-loop/`
