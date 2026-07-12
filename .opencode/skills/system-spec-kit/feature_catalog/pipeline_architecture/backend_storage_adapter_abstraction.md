---
title: "Backend storage adapter abstraction"
description: "Backend storage adapter abstraction now exists as five typed storage ports while SQLite remains the concrete backend."
trigger_phrases:
  - "backend storage adapter abstraction"
  - "typed storage ports"
  - "storage adapter interface"
  - "sqlite concrete backend"
  - "swap storage backend"
version: 3.6.0.15
---

# Backend storage adapter abstraction

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Backend storage adapter abstraction now exists as five shipped typed storage ports while SQLite remains the concrete backend.

The system is still SQLite-backed, but it is no longer hard-wired directly at every storage boundary. A port layer now defines contracts for vector storage, lexical search, graph traversal, maintenance, and contention handling. Each port has a better-sqlite3-backed adapter for current production behavior and a storage-free fake for tests. It is like changing from plugging appliances straight into the wall to using standardized socket adapters first: the same power source remains, but the coupling points are cleaner and easier to replace if a real multi-backend need appears.

---

## 2. HOW IT WORKS

**IMPLEMENTED.** The shipped port set is `VectorStore`, `LexicalSearch`, `GraphTraversal`, `Maintenance`, and `ContentionPolicy` under `mcp_server/lib/storage/ports/`. The current adapters are `BetterSqliteVectorStore`, `PackedBm25LexicalSearch`, `BetterSqliteGraphTraversal`, `BetterSqliteMaintenance`, and `BetterSqliteContentionPolicy`. The 012 traversal-helper work supplied the `GraphTraversal` adapter shape, and the 014 packed-BM25 work supplied the `LexicalSearch` adapter shape.

The extraction is behavior-preserving. SQLite remains the concrete backend; the ports make current seams explicit without claiming that every storage call site has moved behind a backend-agnostic API. Contract tests run the same expectations against the better-sqlite3 adapters and the fakes in `mcp_server/tests/fakes/storage-ports.ts`, so new routing can be validated without opening SQLite where a fake is sufficient.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/ports/index.ts` | Lib | Barrel export for all five typed storage ports and their current adapters |
| `mcp_server/lib/storage/ports/vector-store.ts` | Lib | `VectorStore` contract and `BetterSqliteVectorStore` adapter, with legacy vector-store export compatibility |
| `mcp_server/lib/storage/ports/lexical-search.ts` | Lib | `LexicalSearch` contract and `PackedBm25LexicalSearch` adapter over the packed BM25 engine |
| `mcp_server/lib/storage/ports/graph-traversal.ts` | Lib | `GraphTraversal` contract and `BetterSqliteGraphTraversal` adapter over the BFS traversal helper |
| `mcp_server/lib/storage/ports/maintenance.ts` | Lib | `Maintenance` contract and `BetterSqliteMaintenance` adapter for integrity, vacuum, and checkpoint operations |
| `mcp_server/lib/storage/ports/contention-policy.ts` | Lib | `ContentionPolicy` contract and `BetterSqliteContentionPolicy` adapter for retry/backoff/write-lock and busy-timeout operations |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | Legacy vector-store implementation body moved behind the port adapter and re-exported for compatibility |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/storage-ports-contract.vitest.ts` | Automated test | Contract tests shared by the better-sqlite3 adapters and fake implementations |
| `mcp_server/tests/fakes/storage-ports.ts` | Test support | Storage-free fakes for `VectorStore`, `LexicalSearch`, `GraphTraversal`, `Maintenance`, and `ContentionPolicy` |
| `mcp_server/tests/memo-storage.vitest.ts` | Automated test | Fake `GraphTraversal` substitution coverage without opening SQLite |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `pipeline_architecture/backend_storage_adapter_abstraction.md`
Related references:
- [dynamic-server-instructions-at-mcp-initialization.md](dynamic_server_instructions_at_mcp_initialization.md) — Dynamic server instructions at MCP initialization
- [cross-process-db-hot-rebinding.md](cross_process_db_hot_rebinding.md) — Cross-process DB hot rebinding
