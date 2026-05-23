# Iteration 003 — mcp-coco-index/feature_catalog/ (configuration)

**Scope:** 08--configuration/01-user-settings.md, 08--configuration/04-environment-overrides.md

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1

**P1-001: 04-environment-overrides.md hybrid weight default discrepancy**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/08--configuration/04-environment-overrides.md:40-41
- **Issue:** Hybrid search weight defaults show 0.7 for both vector and FTS5, but INSTALL_GUIDE.md shows 0.9 for vector and 0.5 for FTS5. This is a discrepancy that needs resolution.
- **Evidence:** Lines 40-41 show:
  - `COCOINDEX_HYBRID_VECTOR_WEIGHT` | 0.7
  - `COCOINDEX_HYBRID_FTS5_WEIGHT` | 0.7
  But INSTALL_GUIDE.md:345-347 shows:
  - `COCOINDEX_HYBRID_VECTOR_WEIGHT` | 0.9
  - `COCOINDEX_HYBRID_FTS5_WEIGHT` | 0.5
- **Uncertainty:** I'M UNCERTAIN ABOUT THIS: Need to check the actual code defaults in config.py to determine which is correct. The INSTALL_GUIDE.md is more specific (0.9/0.5), while the feature catalog shows 0.7/0.7.
- **Fix recommendation:** Verify config.py for the actual defaults, then align both docs to match the code.

### P2 — None

### INFO

**INFO-001: 01-user-settings.md accurate defaults**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/08--configuration/01-user-settings.md:23
- **Issue:** None found. Defaults are correctly stated.
- **Evidence:** Line 23 correctly states default as `nomic-ai/CodeRankEmbed` and notes environment defaults may present as `sbert/nomic-ai/CodeRankEmbed`
- **Note:** Correctly references Stage 2 cross-encoder reranking as configured separately.

**INFO-002: 04-environment-overrides.md accurate model defaults**
- **File:** .opencode/skills/mcp-coco-index/feature_catalog/08--configuration/04-environment-overrides.md:17,49
- **Issue:** None found on model defaults. They are correctly stated.
- **Evidence:**
  - Line 17 correctly states Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed` (768d, MIT)
  - Line 17 correctly states Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0)
  - Line 49 correctly states `COCOINDEX_RERANK_MODEL` default as `Qwen/Qwen3-Reranker-0.6B`
  - Line 49 correctly notes jina-reranker-v3 as opt-in with CC BY-NC 4.0 license
  - Line 49 correctly notes GTE fails on Apple Silicon MPS
- **Note:** All model defaults are accurate. Only the hybrid weights have a discrepancy.

**INFO-003: No broken module paths found**
- **Issue:** No stale module paths found in these 2 files.
- **Evidence:** All file references use correct paths.
- **Note:** These configuration docs don't contain Python module imports.

**INFO-004: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found.
- **Evidence:** No spec packet references.
- **Note:** These are configuration docs that don't reference spec packets.

---

## Summary

**Status:** 1 P1 finding (uncertain), clean on model defaults

The configuration docs have accurate model defaults:
- Stage 1 embedder: `nomic-ai/CodeRankEmbed` / `sbert/nomic-ai/CodeRankEmbed` ✓
- Stage 2 reranker: `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0) ✓
- License callouts for jina-v3 (CC BY-NC 4.0) and GTE limitations are accurate ✓

However, one P1 issue was found:
- **P1-001:** Hybrid weight default discrepancy between feature catalog (0.7/0.7) and INSTALL_GUIDE.md (0.9/0.5)

**Recommendation:** Verify the actual defaults in config.py and align both docs. The model defaults are all accurate, so this is purely a config value discrepancy that needs code verification to resolve.
