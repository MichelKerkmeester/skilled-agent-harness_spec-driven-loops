---
title: "Backend storage adapter abstraction"
description: "Backend storage adapter abstraction now exists as a shipped vector-store seam while SQLite remains the concrete backend."
trigger_phrases:
  - "backend storage adapter abstraction"
  - "vector-store seam"
  - "storage adapter interface"
  - "sqlite concrete backend"
  - "swap storage backend"
---

# Backend storage adapter abstraction

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Backend storage adapter abstraction now exists as a shipped vector-store seam while SQLite remains the concrete backend.

The system is still SQLite-backed, but it is no longer hard-wired directly at every vector-search call site. A small adapter layer now defines the vector-store contract and keeps the storage implementation swappable at the vector boundary. It is like changing from plugging appliances straight into the wall to using a standardized socket adapter first. You still use the same power source today, but the coupling point is cleaner and easier to replace later if scale ever demands it.

---

## 2. HOW IT WORKS

**IMPLEMENTED (Sprint 019 closeout).** `IVectorStore` defines the vector-storage contract and `SQLiteVectorStore` provides the current production implementation. The broader graph/document storage stack still runs concretely on SQLite, so the shipped seam is intentionally scoped: vector storage is abstracted, while graph/document stores remain direct SQLite integrations until a real multi-backend need appears.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store contract consumed by the search/storage layer |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | SQLite implementation of the vector-store contract |
| `mcp_server/lib/search/vector-index.ts` | Lib | Stable facade re-exporting the storage seam |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/interfaces.vitest.ts` | Automated test | Interface contract coverage for `IVectorStore` |
| `mcp_server/tests/pipeline-architecture-remediation.vitest.ts` | Automated test | Direct audit traceability coverage for the adapter seam |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Automated test | Vector-index implementation coverage through the storage facade |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/176-backend-storage-adapter-abstraction.md`
Related references:
- [175-dynamic-server-instructions-at-mcp-initialization.md](175-dynamic-server-instructions-at-mcp-initialization.md) — Dynamic server instructions at MCP initialization
- [177-cross-process-db-hot-rebinding.md](177-cross-process-db-hot-rebinding.md) — Cross-process DB hot rebinding
