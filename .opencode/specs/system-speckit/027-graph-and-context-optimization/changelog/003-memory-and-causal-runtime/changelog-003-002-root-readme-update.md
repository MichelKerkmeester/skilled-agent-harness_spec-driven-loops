---
title: "Root README Refresh: Embedder Defaults and Architecture Summary"
description: "Surgical +7 LOC update to root README.md replacing stale llama-cpp and gemma-300m claims with current jina-v3 defaults. Adds an Embedder Architecture subsection and wires three cross-links to canonical references."
trigger_phrases:
  - "root readme refresh"
  - "021/002 root readme"
  - "embedder defaults readme"
  - "jina-v3 readme update"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/002-root-readme-update`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment`

### Summary

Root `README.md` still claimed llama-cpp and `google/embeddinggemma-300m` as the active defaults across four sections after the 016-019 embedder migration. New visitors landing on the repository saw outdated provider names, a stale ASCII diagram, incorrect env var names. The database filename no longer matched the shipped default. A markdown agent (Sonnet) applied a surgical +7 LOC net edit across eight locations: the ASCII diagram, Quick Start provider block, Memory Engine providers list, mcp-coco-index skill bullet, retired env var entries, TIP auto-detect block, DB schema path example. A new Embedder Architecture subsection was added. All stale gemma-300m and llama-cpp current-state claims were removed. Historical packet-name citations in "What's Shipped Recently" were intentionally retained.

### Added

- New `### Embedder Architecture` subsection in `## 1. OVERVIEW` covering both MCPs' current defaults, pluggability, ADR-011 rescue toggle, MPS auto-detect. Cross-links wired to the canonical narrative and CocoIndex INSTALL_GUIDE.
- `SPECKIT_EMBEDDER` and `SPECKIT_RERANK_LAYER` env var entries in the Configuration section

### Changed

- ASCII connection diagram in `## 1. OVERVIEW` now lists `jina-v3 (Ollama)`, `HF Local`, `Voyage` replacing `llama-cpp`, `HF Local`, `OpenAI`, `Voyage`
- Quick Start "Set Up Embedding Provider" block switched from llama-cpp/GGUF to jina-v3 plus Ollama HTTP and `ollama pull` instructions
- Memory Engine "Embedding Providers" subsection reframed with pluggability intro and Ollama as default, HF Local as fallback
- mcp-coco-index skill-library bullet updated from `google/embeddinggemma-300m 768d` to `sbert/jinaai/jina-embeddings-v2-base-code` 768d with MPS auto-detect note
- DB schema paths example updated to match the new `context-index__ollama__jina-embeddings-v3__1024__q4_k_m.sqlite` filename
- TIP block auto-detect language updated to Ollama-serving-jina-v3 with HuggingFace Local fallback

### Fixed

- Four occurrences of llama-cpp as current default removed from current-state copy
- One `google/embeddinggemma-300m` CocoIndex default claim corrected
- Three occurrences of `unsloth/embeddinggemma-300m-GGUF` memory-engine default replaced
- Stale `LLAMA_CPP_EMBEDDINGS_MODEL` and `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env vars removed from Configuration section

### Verification

- `grep -i "embeddinggemma|gemma-300m"` on updated README: zero hits.
- `grep -i "llama-cpp"` on updated README: only historical packet-name citation in "What's Shipped Recently" remains.
- Cross-link targets `registered_embedders.py` and `INSTALL_GUIDE` verified to exist at dispatch time.
- Net LOC delta: +7 (20 added, 13 removed), well within the under-100 LOC budget from spec.md.
- Shipped in commit `d3c89963` as part of the 021 parallel-agents landing.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `README.md` | Changed | Eight surgical locations updated. Stale llama-cpp and gemma-300m claims replaced with jina-v3 defaults. New Embedder Architecture subsection added. Retired env vars removed. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/002-root-readme-update/evidence/diff-summary.md` | Created (NEW) | Diff summary recording eight changed locations, LOC delta, cross-links added. Stale claims removed noted. |

### Follow-Ups

- Update `implementation-summary.md` completion metadata to reflect the shipped state (currently shows 0% pending).
- Verify forward-reference cross-link `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` resolves now that 021/003 has shipped.
