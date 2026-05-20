# Iteration 002 — mcp-coco-index/feature_catalog/ (root + indexing-pipeline + search-and-ranking)

**Scope:** feature_catalog.md, 03--indexing-pipeline/04-embedding-provider-selection.md, 05--search-and-ranking/07-hybrid-search-bm25-rrf.md, 05--search-and-ranking/08-reranker-cross-encoder.md

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1

**P1-001: 08-reranker-cross-encoder.md stale module path after restructure**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/08-reranker-cross-encoder.md:59-61
- **Issue:** Module paths reference `cocoindex_code/reranker.py` but the commit 29f412f31 restructured cocoindex_code into feature subdirs. The correct path should be `cocoindex_code/rerankers/reranker.py`.
- **Evidence:** Lines 59-61 show:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:40`
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:81`
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:132`
- **Fix recommendation:** Update all three paths to:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:40`
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:81`
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:132`

**P1-002: 08-reranker-cross-encoder.md incomplete mitigation note**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/08-reranker-cross-encoder.md:33
- **Issue:** The mitigation note says "the default reranker was moved away from GTE" but doesn't specify the new default (Qwen3-Reranker-0.6B) or the 023B head-to-head context. This is incomplete given the prompt's emphasis on documenting the Qwen3 promotion.
- **Evidence:** Line 33 states "Mitigation in v1.10: the default reranker was moved away from GTE."
- **Fix recommendation:** Update to: "Mitigation in v1.10 and later: the default reranker was moved away from GTE to `Qwen/Qwen3-Reranker-0.6B` (promoted by the 023B head-to-head expanded fixture)."

### P2 — None

### INFO

**INFO-001: feature_catalog.md accurate defaults**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md:35
- **Issue:** None found. Defaults are correctly stated.
- **Evidence:** Line 35 correctly states Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed` (768d, MIT) and Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0)
- **Note:** The two-model pipeline distinction is correctly documented.

**INFO-002: 04-embedding-provider-selection.md accurate defaults**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md:12-13
- **Issue:** None found. Defaults are correctly stated.
- **Evidence:** Lines 12-13 correctly state Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed` (768d, MIT) and Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0)
- **Note:** The two-model pipeline distinction is correctly documented with the non-interchangeability warning.

**INFO-003: 07-hybrid-search-bm25-rrf.md accurate defaults**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/07-hybrid-search-bm25-rrf.md:10
- **Issue:** None found. Defaults are correctly stated.
- **Evidence:** Line 10 correctly states Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed` (768d, MIT) and Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0)
- **Note:** Correctly notes that hybrid fusion belongs to Stage 1, not Stage 2.

**INFO-004: 08-reranker-cross-encoder.md accurate current default**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/08-reranker-cross-encoder.md:10,17
- **Issue:** None found on the current default. The overview correctly states Qwen3-Reranker-0.6B as the default.
- **Evidence:** Line 10 correctly states `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0). Line 17 correctly notes jina-reranker-v3 as opt-in fallback with CC BY-NC 4.0 license.
- **Note:** The current default is accurate; only the mitigation note and module paths need fixes.

**INFO-005: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found in these 4 files.
- **Evidence:** No spec packet references in these feature catalog files.
- **Note:** These are technical implementation docs that don't reference spec packets.

---

## Summary

**Status:** 2 P1 findings, clean on defaults

The feature catalog files have accurate model defaults:
- Stage 1 embedder: `sbert/nomic-ai/CodeRankEmbed` (MIT) ✓
- Stage 2 reranker: `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0) ✓
- 2-model pipeline distinction correctly documented ✓

However, two P1 issues were found:
1. **P1-001:** Stale module paths in 08-reranker-cross-encoder.md (reranker.py → rerankers/reranker.py after the feature-grouped restructure)
2. **P1-002:** Incomplete mitigation note in 08-reranker-cross-encoder.md (doesn't mention Qwen3 or 023B context)

**Recommendation:** Fix the two P1 issues. The defaults are all accurate, so this is purely a path reference and completeness fix.
