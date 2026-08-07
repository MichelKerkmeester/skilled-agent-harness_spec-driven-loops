# Iteration 005 — mcp-coco-index/manual_testing_playbook/ + cocoindex_code module README

**Scope:** manual_testing_playbook.md, 03--configuration/001-default-model-verification.md, mcp_server/cocoindex_code/README.md

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1

**P1-001: cocoindex_code/README.md stale reranker references**
- **File:** .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md:73,118
- **Issue:** Lines 73 and 118 reference "GTE multilingual rerank" as the reranker, but the default is now Qwen3-Reranker-0.6B. GTE is the prior default that failed on Apple Silicon MPS and was replaced.
- **Evidence:**
  - Line 73: "reranker.py adds a local GTE multilingual rerank pass (opt-in via `COCOINDEX_RERANK=1`)."
  - Line 118: "Optional GTE multilingual cross-encoder rerank over top-K candidates."
- **Fix recommendation:** Update both references to reflect the current default:
  - Line 73: "reranker.py adds a local Qwen3-Reranker-0.6B cross-encoder rerank pass (default-on via `COCOINDEX_RERANK=true`)."
  - Line 118: "Optional Qwen3-Reranker-0.6B cross-encoder reranker over top-K candidates (default-on)."

**P1-002: cocoindex_code/README.md stale embedder registry reference**
- **File:** .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md:117
- **Issue:** Line 117 states "Vetted embedder registry (jina-code default + alternatives)" but the default embedder is now nomic-ai/CodeRankEmbed, not jina-code.
- **Evidence:** Line 117: "registered_embedders.py - Vetted embedder registry (jina-code default + alternatives)."
- **Fix recommendation:** Update to: "Vetted embedder registry (nomic-ai/CodeRankEmbed default + alternatives)."

### P2 — None

### INFO

**INFO-001: manual_testing_playbook.md accurate default model**
- **File:** .opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:329
- **Issue:** None found. Default model is correctly stated.
- **Evidence:** Line 329 correctly states `embedding.model` is the current code-search default (`nomic-ai/CodeRankEmbed` in settings or `sbert/nomic-ai/CodeRankEmbed` in environment defaults)
- **Note:** The CFG-001 scenario contract is accurate.

**INFO-002: 001-default-model-verification.md accurate default model**
- **File:** .opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/001-default-model-verification.md:31,42
- **Issue:** None found. Default model is correctly stated.
- **Evidence:**
  - Line 31 correctly states `embedding.model` is the current code-search default (`nomic-ai/CodeRankEmbed` in settings or `sbert/nomic-ai/CodeRankEmbed` in environment defaults)
  - Line 42 correctly states the same in the test execution table
- **Note:** The test scenario is accurate and will pass with current defaults.

**INFO-003: cocoindex_code/README.md accurate two-stage pipeline**
- **File:** .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md:84-85
- **Issue:** None found. Two-stage pipeline is correctly stated.
- **Evidence:**
  - Line 84 correctly states Stage 1 embedder as `sbert/nomic-ai/CodeRankEmbed` (768d, MIT)
  - Line 85 correctly states Stage 2 reranker as `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0)
- **Note:** The pipeline table is accurate; only the feature descriptions have stale references.

**INFO-004: No broken module paths found**
- **Issue:** No stale module paths found in these 3 files.
- **Evidence:** All file references use correct paths.
- **Note:** The README structure table uses top-level file names which is appropriate for this code-facing document.

**INFO-005: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found.
- **Evidence:** No spec packet references.
- **Note:** These are testing docs and code README that don't reference spec packets.

---

## Summary

**Status:** 2 P1 findings, clean on test scenarios

The testing playbook docs have accurate model defaults:
- CFG-001 correctly validates `nomic-ai/CodeRankEmbed` as the current default ✓
- Test scenarios use the correct default model names ✓

However, the cocoindex_code module README has stale references:
- **P1-001:** Lines 73 and 118 reference "GTE multilingual rerank" instead of the current Qwen3-Reranker-0.6B default
- **P1-002:** Line 117 references "jina-code default" instead of the current nomic-ai/CodeRankEmbed default

The two-stage pipeline table in the README is accurate (lines 84-85), so this is purely a feature description drift issue in the FEATURES and STRUCTURE sections.

**Recommendation:** Update the three stale references in the README to reflect current defaults. The testing playbook scenarios are accurate and will pass.
