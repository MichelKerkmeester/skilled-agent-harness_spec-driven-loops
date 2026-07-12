---
title: "AST-level section retrieval tool"
description: "Tracks the deferred AST-based section retrieval tool for precise heading-level document access."
trigger_phrases:
  - "AST-level section retrieval"
  - "read_spec_section"
  - "heading-level document access"
  - "markdown AST parsing"
version: 3.6.0.15
---

# AST-level section retrieval tool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks the deferred AST-based section retrieval tool for precise heading-level document access.

This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.

---

## 2. HOW IT WORKS

**PLANNED (Sprint 019): DEFERRED.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is deferred until spec docs routinely exceed ~1000 lines. Existing R7 anchor-aware thinning remains the current approach. Estimated effort: M (5-7 days).

**Status: PLANNED / NOT YET IMPLEMENTED** — This tool is documented as a planned feature but is not registered in the live MCP tool registry (`tool-schemas.ts`). It does not appear in the exported tool list.

---

## 3. SOURCE FILES

No source files yet. This feature is planned but not yet implemented.

---

## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval/ast_level_section_retrieval_tool.md`
Related references:
- [bm25-trigger-phrase-re-index-gate.md](bm25_trigger_phrase_re_index_gate.md) — BM25 trigger phrase re-index gate
- [quality-aware-3-tier-search-fallback.md](quality_aware_3_tier_search_fallback.md) — Quality-aware 3-tier search fallback
