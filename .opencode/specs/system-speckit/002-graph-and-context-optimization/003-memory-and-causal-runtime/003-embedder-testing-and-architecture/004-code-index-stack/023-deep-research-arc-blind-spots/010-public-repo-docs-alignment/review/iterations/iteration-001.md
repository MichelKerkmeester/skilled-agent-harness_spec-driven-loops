# Iteration 001 — Root + AGENTS + mcp-coco-index trio

**Scope:** README.md (repo root), AGENTS.md (repo root), .opencode/skills/mcp-coco-index/{README.md, SKILL.md, INSTALL_GUIDE.md}

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1 — None

### P2

**P2-001: README.md line 122 stale embedder reference for mk-spec-memory**
- **File:** README.md:122
- **Issue:** The diagram shows "jina-v3 (Ollama)" as the default embedder for mk-spec-memory. Based on recent commits, Qwen3-Reranker-0.6B was promoted as default reranker, but this embedder reference may be stale for mk-spec-memory.
- **Evidence:** README.md:122 shows "jina-v3 (Ollama) │ HF Local │ Voyage" in the embedder architecture diagram
- **Uncertainty:** I'M UNCERTAIN ABOUT THIS: This is in the mk-spec-memory context, not CocoIndex. The prompt focuses on CocoIndex defaults. Need to verify if mk-spec-memory's embedder defaults changed or if this is still accurate for that system.
- **Fix recommendation:** Verify mk-spec-memory embedder defaults. If jina-embeddings-v3 is still the default there, no change needed. If it changed to align with CocoIndex defaults, update to reflect current state.

### INFO

**INFO-001: README.md embedder architecture context separation**
- **File:** README.md:134
- **Issue:** README.md correctly distinguishes between mk-spec-memory (jina-embeddings-v3) and CocoIndex (jina-embeddings-v2-base-code) embedder choices. This is accurate context separation.
- **Evidence:** README.md:134 states "**mk-spec-memory** defaults to `jina-embeddings-v3`... **CocoIndex** defaults to `sbert/jinaai/jina-embeddings-v2-base-code`"
- **Note:** This is actually correct - the two systems use different embedders. No action needed, just noting the accurate separation.

**INFO-002: AGENTS.md no embedder/reranker references**
- **File:** AGENTS.md
- **Issue:** AGENTS.md focuses on agent behavior rules and workflows. It does not reference specific embedder or reranker models.
- **Evidence:** AGENTS.md content is about gate systems, safety rules, and workflow patterns
- **Note:** This is expected - AGENTS.md is the right place for framework-level behavior, not model-specific defaults.

**INFO-003: mcp-coco-index README.md accurate defaults**
- **File:** .opencode/skills/mcp-coco-index/README.md
- **Issue:** None found. Defaults are correctly stated.
- **Evidence:**
  - Line 78: Correctly states Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0)
  - Line 77: Correctly states Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed` (MIT)
  - Line 82: Correctly notes "The default reranker is Apache-2.0 as of 2026-05-20; `jinaai/jina-reranker-v3` remains registered as an opt-in fallback"
  - Line 217: Embedder table correctly shows nomic-ai/CodeRankEmbed as default
  - Line 217: gemma-embeddings-300m correctly labeled as "Pre-018 baseline"
- **Note:** All defaults are current and accurate.

**INFO-004: mcp-coco-index SKILL.md accurate defaults**
- **File:** .opencode/skills/mcp-coco-index/SKILL.md
- **Issue:** None found. Defaults are correctly stated.
- **Evidence:**
  - Line 18: Correctly states v1.2.3 defaults including `COCOINDEX_RERANK_MODEL=Qwen/Qwen3-Reranker-0.6B`
  - Line 27: Correctly states Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0)
  - Line 29: Correctly notes "The default reranker is Apache-2.0 as of 2026-05-20"
  - Line 26: Correctly states Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed` (MIT)
  - Line 285: Embedder table correctly shows nomic-ai/CodeRankEmbed as default
  - Line 286: gemma-embeddings-300m correctly labeled as "Pre-018 baseline"
- **Note:** All defaults are current and accurate.

**INFO-005: mcp-coco-index INSTALL_GUIDE.md accurate defaults**
- **File:** .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md
- **Issue:** None found. Defaults are correctly stated.
- **Evidence:**
  - Line 359: Correctly states `COCOINDEX_RERANK_MODEL` default as `Qwen/Qwen3-Reranker-0.6B`
  - Line 362: Correctly notes "the default reranker is `Qwen/Qwen3-Reranker-0.6B`, promoted by the 023B head-to-head expanded fixture"
  - Line 362: Correctly notes `jinaai/jina-reranker-v3` as opt-in fallback
  - Line 405: Config template correctly notes "Default: nomic-ai/CodeRankEmbed"
  - Line 494: Embedder config correctly shows nomic-ai/CodeRankEmbed as default
- **Note:** All defaults are current and accurate.

**INFO-006: No broken module import paths found**
- **Issue:** No stale import paths like `cocoindex_code.reranker` found in these 5 files.
- **Evidence:** All code references use correct paths or no Python module imports are shown.
- **Note:** These high-level docs don't contain Python import statements, so this is expected.

**INFO-007: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found in these 5 files.
- **Evidence:** No 023 packet references in these files.
- **Note:** These are high-level docs that don't reference specific spec packets.

---

## Summary

**Status:** CLEAN with 1 uncertainty

The mcp-coco-index trio (README.md, SKILL.md, INSTALL_GUIDE.md) are all accurate with current defaults:
- Stage 1 embedder: `sbert/nomic-ai/CodeRankEmbed` (MIT) ✓
- Stage 2 reranker: `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0) ✓
- 2-model pipeline distinction correctly documented ✓
- jina-v3 correctly noted as opt-in fallback with CC BY-NC 4.0 license ✓
- gemma correctly labeled as "pre-018 baseline" ✓

AGENTS.md is clean (no model-specific content expected).

README.md has one uncertain reference (P2-001) about mk-spec-memory embedder defaults, but this is outside the CocoIndex scope. The CocoIndex-specific content in README.md is accurate.

**Recommendation:** Verify mk-spec-memory embedder defaults to resolve P2-001 uncertainty. The CocoIndex documentation surface is clean.
