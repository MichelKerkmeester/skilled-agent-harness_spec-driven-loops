---
title: "Scripts"
description: "Operational scripts for forced embedding reindex and maintenance workflows."
trigger_phrases:
  - "scripts"
  - "reindex embeddings"
  - "database maintenance"
importance_tier: "normal"
---

# Scripts

> Operational entry points for maintenance tasks that run outside the normal MCP request lifecycle, such as forced full-reindex of embeddings.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. IMPLEMENTED STATE](#3--implemented-state)
- [4. USAGE](#4--usage)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

`scripts/` contains standalone executable scripts for database maintenance and embedding management. Scripts initialize the full runtime module stack (vector index, embeddings, checkpoints, hybrid search, access tracker), then invoke the appropriate handler to perform the operation.

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
scripts/
+-- reindex-embeddings.ts    # Forced full embedding reindex via handleMemoryIndexScan [spec 138]
+-- README.md                # This file
```

### File Inventory

| File                      | Purpose                                                                     | Key Behavior                                                       | Spec     |
| ------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------- |
| `reindex-embeddings.ts`   | Forced full scan: warms embeddings and reindexes all memory + spec docs     | Calls `handleMemoryIndexScan({ force: true, includeConstitutional: true })` | Spec 138 |

<!-- /ANCHOR:structure -->

---

## 3. IMPLEMENTED STATE
<!-- ANCHOR:implemented-state -->

- Reindex path runs through current handlers (not a separate indexing implementation).
- Indexed scope follows current scan behavior, including README and spec-doc discovery defaults.
- Script prints a concise progress summary on stdout and exits non-zero on fatal startup failures.
- Spec 138: graph-unified search flag (`isGraphUnifiedEnabled`) is checked at startup. When enabled, a unified graph search function is created and registered before the scan begins.
- Module initialization order: `vectorIndex` -> `embeddings` -> `checkpointsLib` -> `accessTracker` -> `hybridSearch` -> `initDbState` -> `setEmbeddingModelReady`.

<!-- /ANCHOR:implemented-state -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

```bash
npm run build
node mcp_server/dist/scripts/reindex-embeddings.js
```

The script exits 0 on success. Any fatal startup error (missing DB, failed embedding warm-up) exits non-zero with an error message on stderr.

<!-- /ANCHOR:usage -->

---

## 5. RELATED
<!-- ANCHOR:related -->

- `../handlers/memory-index.ts`
- `../handlers/memory-save.ts`
- `../core/README.md`

<!-- /ANCHOR:related -->
