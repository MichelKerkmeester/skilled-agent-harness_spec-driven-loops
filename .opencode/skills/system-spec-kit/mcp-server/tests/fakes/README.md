---
title: "Storage Port Fakes"
description: "Storage-free test doubles for the lib/storage/ports interfaces, used by contract and unit tests that should not depend on a real database."
---

# Storage Port Fakes

---

## 1. OVERVIEW

`tests/fakes/` holds in-memory test doubles that implement the port interfaces from `../../lib/storage/ports`. Tests that only need port-shaped behavior, not real SQLite persistence, construct these fakes instead of a `better-sqlite3` database, keeping the test fast and storage-free while still exercising the same interface the production adapters implement.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `storage-ports.ts` | `FakeGraphTraversal`, `FakeLexicalSearch`, `FakeVectorStore`, `FakeMaintenance` and `FakeContentionPolicy`. Each implements its matching `lib/storage/ports` interface (`GraphTraversal`, `LexicalSearch`, `VectorStore`, `Maintenance`, `ContentionPolicy`) without touching a real database. `FakeGraphTraversal` delegates its walk and reachability logic straight to `lib/graph/bfs-traversal` over caller-supplied edges. |

## 3. CONSUMERS

- `tests/storage-ports-contract.vitest.ts` runs the same contract suite against these fakes and against the real `lib/storage/ports` adapters.
- `tests/memo-storage.vitest.ts`

## 4. RELATED

- [`../README.md`](../README.md)
- [`../../lib/storage/ports/README.md`](../../lib/storage/ports/README.md)
