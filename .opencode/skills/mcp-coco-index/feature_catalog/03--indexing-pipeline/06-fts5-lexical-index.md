---
title: "06. FTS5 lexical index"
description: "Mirrors indexed chunks into a SQLite FTS5 virtual table for lexical retrieval."
---

# 06. FTS5 lexical index

Mirrors indexed chunks into a SQLite FTS5 virtual table for lexical retrieval. The indexer maintains a `code_chunks_fts` BM25 index alongside the `code_chunks_vec` vector table so the hybrid search lane can union exact-token hits with semantic neighbors.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The FTS5 lane carries exact-token, identifier and path matches that pure vector search can miss. The indexer mirrors every persisted chunk into the `code_chunks_fts` virtual table so the hybrid retrieval lane has a populated BM25 surface to query.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ensure_fts_table` creates the `code_chunks_fts` virtual table with content, file path and language columns and the `unicode61 remove_diacritics 2` tokenizer. The indexer calls `ensure_fts_table` once when the vector target is mounted and `populate_fts` per chunk during `process_file`, so FTS5 rows are produced as a side effect of normal indexing. `sync_fts_from_code_chunks` provides an idempotent rebuild from the current `code_chunks_vec` snapshot for backfill and recovery. The FTS5 table is opt-in for retrieval: rows are always written, but query-time use requires `COCOINDEX_HYBRID=true`.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py:11` | FTS5 module | Defines the `code_chunks_fts` table name and identifier tokenizer regex. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py:25` | FTS5 module | `ensure_fts_table` creates the virtual table on first index. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py:46` | FTS5 module | `populate_fts` inserts or replaces chunk rows per `FtsChunkRow`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py:64` | FTS5 module | `sync_fts_from_code_chunks` rebuilds FTS5 from the current vector table snapshot. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:305` | Indexer | Calls `populate_fts` from `process_file` for each new chunk. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:349` | Indexer | Calls `ensure_fts_table` once after the vector target is mounted. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py:110` | Unit | `test_fts_table_created_on_first_index` covers table creation on first index. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py:121` | Unit | `test_fts_populated_with_chunks` covers row mirroring during indexing. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/06-fts5-lexical-index.md`

<!-- /ANCHOR:source-metadata -->
