# Iteration 004 — mcp-coco-index/references/ (settings + tool reference)

**Scope:** references/settings_reference.md, references/tool_reference.md, references/search_patterns.md

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1

**P1-001: settings_reference.md chunking config discrepancy**
- **File:** .opencode/skills/mcp-coco-index/references/settings_reference.md:174-176
- **Issue:** Chunking parameters show 1000/250/150 but INSTALL_GUIDE.md and feature catalog show 1500/250/200. This is a discrepancy that needs resolution.
- **Evidence:** Lines 174-176 show:
  - Chunk size: 1,000 characters
  - Minimum chunk size: 250 characters
  - Overlap: 150 characters
  But INSTALL_GUIDE.md:323-325 and feature_catalog/08--configuration/04-environment-overrides.md:31-33 show:
  - CHUNK_SIZE: 1500
  - MIN_CHUNK_SIZE: 250
  - CHUNK_OVERLAP: 200
- **Uncertainty:** I'M UNCERTAIN ABOUT THIS: Need to check the actual code defaults in config.py to determine which is correct. The feature catalog and INSTALL_GUIDE agree (1500/250/200), while settings_reference shows older values (1000/250/150).
- **Fix recommendation:** Verify config.py for the actual defaults, then align settings_reference.md to match. The v1.2.0 chunking retuning (1000 → 1500) may not have propagated to this reference doc.

**P1-002: tool_reference.md module paths need restructure check**
- **File:** .opencode/skills/mcp-coco-index/references/tool_reference.md:245-246
- **Issue:** Module paths reference `cocoindex_code/client.py` and `cocoindex_code/daemon.py` but the commit 29f412f31 restructured cocoindex_code into feature subdirs. These paths may need updating.
- **Evidence:** Lines 245-246 show:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py`
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- **Uncertainty:** I'M UNCERTAIN ABOUT THIS: Need to verify if client.py and daemon.py were moved to subdirs or stayed at the top level during the restructure. The reranker module moved to rerankers/, but these may be core modules that stayed.
- **Fix recommendation:** Verify the actual file locations after the restructure. If they moved to subdirs, update the paths. If they stayed at top level, no change needed.

### P2 — None

### INFO

**INFO-001: settings_reference.md accurate model defaults**
- **File:** .opencode/skills/mcp-coco-index/references/settings_reference.md:54,139,145,153-154
- **Issue:** None found. All model defaults are correctly stated.
- **Evidence:**
  - Line 54: Correctly states default as `nomic-ai/CodeRankEmbed`
  - Line 139: Correctly states `nomic-ai/CodeRankEmbed` as "Current local default" with ratified date 2026-05-19
  - Line 145: Correctly states `google/embeddinggemma-300m` as "Pre-018 baseline"
  - Line 153: Correctly states `Qwen/Qwen3-Reranker-0.6B` as "Current default" with promotion date 2026-05-20
  - Line 154: Correctly states `jinaai/jina-reranker-v3` as "Pre-2026-05-20 default; opt-in fallback" with CC BY-NC 4.0 license
- **Note:** The Reranker Model Options table is comprehensive and accurate.

**INFO-002: settings_reference.md accurate hybrid weights**
- **File:** .opencode/skills/mcp-coco-index/references/settings_reference.md:227-228
- **Issue:** None found. Hybrid weights are correctly stated and match INSTALL_GUIDE.md.
- **Evidence:** Lines 227-228 correctly show:
  - `COCOINDEX_HYBRID_VECTOR_WEIGHT` | 0.9
  - `COCOINDEX_HYBRID_FTS5_WEIGHT` | 0.5
- **Note:** These match INSTALL_GUIDE.md and resolve the discrepancy found in iteration 003 (feature catalog showed 0.7/0.7).

**INFO-003: tool_reference.md accurate pipeline architecture**
- **File:** .opencode/skills/mcp-coco-index/references/tool_reference.md:22-27
- **Issue:** None found. Pipeline architecture is correctly stated.
- **Evidence:**
  - Line 24: Correctly states Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed`
  - Line 27: Correctly states Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B`
  - Line 25: Correctly states hybrid weights as 0.9 for vector and 0.5 for FTS5
- **Note:** The two-model pipeline distinction is correctly documented.

**INFO-004: search_patterns.md no model-specific content**
- **File:** .opencode/skills/mcp-coco-index/references/search_patterns.md
- **Issue:** None found. This is a query-writing guide with no model-specific content.
- **Evidence:** The file focuses on search strategies, query writing, and filter usage.
- **Note:** No model defaults or pipeline architecture in this file, so no drift possible.

**INFO-005: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found in these 3 files.
- **Evidence:** No spec packet references.
- **Note:** These are reference docs that don't reference spec packets.

---

## Summary

**Status:** 2 P1 findings (both uncertain), clean on model defaults

The references docs have accurate model defaults:
- Stage 1 embedder: `nomic-ai/CodeRankEmbed` (ratified 2026-05-19) ✓
- Stage 2 reranker: `Qwen/Qwen3-Reranker-0.6B` (promoted 2026-05-20) ✓
- License callouts for jina-v3 (CC BY-NC 4.0) are accurate ✓
- Hybrid weights (0.9/0.5) match INSTALL_GUIDE.md ✓

However, two P1 issues were found:
- **P1-001:** Chunking config discrepancy (1000/250/150 vs 1500/250/200) - settings_reference.md may have old values
- **P1-002:** Module paths for client.py and daemon.py need verification after restructure

**Recommendation:** Verify config.py for actual chunking defaults and verify client.py/daemon.py locations after restructure. The model defaults are all accurate, so these are purely config value and path reference issues that need code verification to resolve.
