---
title: "03. Chunking and language detection"
description: "Splits text into language-aware chunks and records line ranges."
---

# 03. Chunking and language detection

Splits text into language-aware chunks and records line ranges. Indexing converts source files into smaller chunks with detected or overridden language metadata. Those chunks become the searchable unit returned by CLI and MCP search.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Indexing converts source files into smaller chunks with detected or overridden language metadata. Those chunks become the searchable unit returned by CLI and MCP search.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The indexer skips unreadable and empty files, detects language by filename unless a project override exists and uses `RecursiveSplitter` with configured chunk size, minimum size and overlap. Stage A defaults are `CHUNK_SIZE=1500`, `CHUNK_OVERLAP=200` and `MIN_CHUNK_SIZE=250`. `process_file` performs a per-call `getattr(config, ...)` lookup with the module-level `CHUNK_SIZE`, `MIN_CHUNK_SIZE` and `CHUNK_OVERLAP` constants as fallbacks, so `COCOINDEX_CODE_CHUNK_SIZE`, `COCOINDEX_CODE_CHUNK_OVERLAP` and `COCOINDEX_CODE_MIN_CHUNK_SIZE` env overrides apply without code edits. Stage B (raise to 2000 with per-language overrides) is deferred; lift estimates from the Stage A change are research-derived and not yet validated on the fixture suite.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:34` | Indexer | Defines the Stage A chunking constants used as per-call fallbacks. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:39` | Indexer | Instantiates the stateless `RecursiveSplitter`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:273` | Indexer | Reads chunk size, min size and overlap from `Config` with module constants as fallbacks. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:277` | Indexer | Applies chunk size, minimum size, overlap and language to the splitter. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:291` | Config | Loads `COCOINDEX_CODE_CHUNK_SIZE`, `COCOINDEX_CODE_CHUNK_OVERLAP` and `COCOINDEX_CODE_MIN_CHUNK_SIZE`. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py:112` | Unit | `TestChunkConfigValidation` covers defaults, overrides and out-of-bounds fallback. |
| `.opencode/skills/mcp-coco-index/tests/test_settings.py:197` | Unit | Covers custom extension language overrides. |
| `.opencode/skills/mcp-coco-index/references/settings_reference.md:142` | Reference | Documents chunking configuration. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/03-chunking-and-language-detection.md`

<!-- /ANCHOR:source-metadata -->
