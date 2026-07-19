---
title: "Interfaces"
description: "Runtime contracts for vector-store consumers and shared embedding interfaces."
trigger_phrases:
  - "interfaces"
  - "embedding provider interface"
  - "vector store interface"
---

# Interfaces

## 1. OVERVIEW

`lib/interfaces/` keeps the local runtime contract for vector-store implementations. TypeScript interface definitions live in `@spec-kit/shared`, while this folder provides a real class that plain JavaScript consumers can extend.

## 2. DATA FLOW

```text
embedding or vector request
  -> consumer depends on IVectorStore
  -> concrete vector store implements the methods
  -> search, upsert, delete, get, stats, availability
  -> vector result or stored record metadata
```

The interface boundary lets retrieval code call a vector backend without binding to one storage implementation.

## 3. KEY FILES

| File | Purpose |
|---|---|
| `vector-store.ts` | Exports `IVectorStore`, an abstract runtime base class for JS consumers |

Shared types such as `VectorStoreInterface` are re-exported from `@spec-kit/shared/types`.

## 4. BOUNDARIES

This folder owns contracts, not storage behavior. It does not create embeddings, open database handles, run vector search, or manage memory records.

## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `IVectorStore.search()` | Retrieve nearest records for an embedding |
| `IVectorStore.upsert()` | Store or replace an embedding and metadata |
| `IVectorStore.delete()` | Remove a stored vector by ID |
| `IVectorStore.get()` | Load a stored vector record by ID |
| `IVectorStore.getStats()` | Return backend counts and status data |
| `IVectorStore.isAvailable()` | Report whether the backend can serve requests |
| `IVectorStore.getEmbeddingDimension()` | Report the expected embedding dimension |
| `IVectorStore.close()` | Release backend resources |

## 6. VALIDATION

- Base-class methods throw until a subclass overrides them.
- Interface compliance is covered by `../../tests/interfaces.vitest.ts`.
- Implementations should match the shared `VectorStoreInterface` type when used from TypeScript.

## 7. RELATED

- `../search/vector-index-impl.ts`
- `../../tests/interfaces.vitest.ts`
- `@spec-kit/shared/types`
