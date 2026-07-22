---
title: "Storage Ports: Adapter Boundary"
description: "Typed ports and the better-sqlite3 adapters behind contention, maintenance, graph traversal, lexical search and vector storage."
---

# Storage Ports: Adapter Boundary

---

## 1. OVERVIEW

`lib/storage/ports/` is a ports-and-adapters boundary between callers and the concrete storage backend. Each port is a small interface (`ContentionPolicy`, `Maintenance`, `GraphTraversal`, `LexicalSearch`, `VectorStore`) plus one `better-sqlite3`-backed implementation that wraps the existing lower-level modules in `../../graph/`, `../../search/` and `../../interfaces/`. Callers depend on the port interface, so `tests/fakes/storage-ports.ts` can implement the same interfaces without a real database for tests.

Current state:

- `common.ts` defines the shared `Awaitable<T>` and `StorageId` types every port reuses.
- Each port module owns one concern: contention retry, maintenance (integrity/vacuum/checkpoint), graph traversal, lexical search or vector storage.
- `index.ts` re-exports every port type and implementation as the package barrel.
- Adapters delegate to existing modules (`../../search/bm25-index.ts`, `../../search/vector-index-store.ts`, `../../graph/bfs-traversal.ts`) rather than reimplementing storage logic.

## 2. PACKAGE TOPOLOGY

```text
lib/storage/ports/
+-- common.ts             # Awaitable<T>, StorageId shared types
+-- contention-policy.ts  # ContentionPolicy port + BetterSqliteContentionPolicy
+-- maintenance.ts        # Maintenance port + BetterSqliteMaintenance
+-- graph-traversal.ts    # GraphTraversal port + BetterSqliteGraphTraversal
+-- lexical-search.ts     # LexicalSearch port + PackedBm25LexicalSearch
+-- vector-store.ts       # VectorStore port + BetterSqliteVectorStore
`-- index.ts              # Barrel export of every port type and implementation
```

Allowed dependency direction:

```text
callers → lib/storage/ports (interface) → lib/search, lib/graph, lib/interfaces (implementation)
tests/fakes/storage-ports.ts → lib/storage/ports (types only)
```

Disallowed dependency direction:

```text
lib/storage/ports → handlers
lib/storage/ports → tests/fakes
```

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `common.ts` | Shared `Awaitable<T>` and `StorageId` types used across every port. |
| `contention-policy.ts` | `ContentionPolicy` port (`withRetry`, `withWriteLock`, `setBusyTimeout`) and the `BetterSqliteContentionPolicy` adapter. Also exports `isSqliteContentionError`. |
| `maintenance.ts` | `Maintenance` port (`integrityCheck`, `vacuum`, `checkpoint`) and the `BetterSqliteMaintenance` adapter. |
| `graph-traversal.ts` | `GraphTraversal` port (weighted walks, directed reachability, causal and dependency traversal) and the `BetterSqliteGraphTraversal` adapter wrapping `../../graph/bfs-traversal.ts`. |
| `lexical-search.ts` | `LexicalSearch` port (index, search, remove) and the `PackedBm25LexicalSearch` adapter wrapping `../../search/bm25-index.ts`. |
| `vector-store.ts` | `VectorStore` port and the `BetterSqliteVectorStore` adapter wrapping `../../search/vector-index-store.ts`, `vector-index-queries.ts` and `vector-index-mutations.ts`. |
| `index.ts` | Re-exports every port type and adapter as the package's public surface. |

## 4. VALIDATION

Run from the repository root unless noted.

```bash
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/storage-ports-contract.vitest.ts
```

Expected result: the contract suite passes for both the real adapters and the `tests/fakes/storage-ports.ts` test doubles.

## 5. RELATED

- [`../README.md`](../README.md)
- [`../../../tests/fakes/README.md`](../../../tests/fakes/README.md)
