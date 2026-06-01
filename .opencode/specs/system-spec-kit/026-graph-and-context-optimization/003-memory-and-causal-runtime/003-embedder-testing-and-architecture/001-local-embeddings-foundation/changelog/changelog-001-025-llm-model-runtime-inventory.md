---
title: "LLM and Embedding-Model Runtime Inventory Per Subsystem"
description: "Two inventory documents shipped that map every spec-kit subsystem to either the quantized EmbeddingGemma stack (Memory MCP and Skill Advisor) or the CocoIndex sentence-transformers stack, with structural-only subsystems called out explicitly."
trigger_phrases:
  - "model runtime inventory"
  - "embedding variant per subsystem"
  - "embeddinggemma subsystem map"
  - "memory mcp vs cocoindex models"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/025-llm-model-runtime-inventory` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

After the 014 setup-A line migrated both MCP servers off cloud Voyage onto local EmbeddingGemma, two distinct runtimes landed in production: a quantized GGUF/ONNX path for the Memory MCP family plus a full-precision sentence-transformers path for CocoIndex. Operators routinely conflated the two because both surface as "EmbeddingGemma 768d" in documentation, with no per-subsystem breakdown of which runtime each one actually invokes.

Two inventory documents were authored at the packet root, splitting every spec-kit subsystem into one of two clearly labelled buckets and explicitly marking the structural-only subsystems that store no embeddings at all. Each document cites the active configuration file so future drift is detectable in a single grep.

### Added

- `variant-a-quantized-gemma.md` mapping Memory MCP and Skill Advisor as primary consumers plus four transitive graph subsystems (Causal, Council, Coverage, Deep Loop)
- `variant-b-cocoindex-sbert.md` mapping CocoIndex code semantic search to the sentence-transformers path and calling out structural Code Graph as a no-embeddings subsystem
- Per-row "verify with" command blocks in each document so operators can re-resolve any row against the canonical source file in one bash command

### Changed

- None. Additive-only phase.

### Fixed

- None. Additive-only phase.

### Verification

| Gate | Status |
|------|--------|
| Both variant documents written and placed at packet root | PASS |
| Each document cites the canonical source file (`factory.ts`, `cocoindex_code/shared.py`) | PASS |
| Structural-only subsystems (Deep Loop, Council, Coverage, Code Graph) called out explicitly | PASS |
| Strict spec validation (`validate.sh --strict`) | PASS after final run |
| 15 tasks recorded as complete | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `025-llm-model-runtime-inventory/variant-a-quantized-gemma.md` (NEW) | Quantized EmbeddingGemma runtime inventory for Memory MCP, Skill Advisor plus four transitive graph subsystems |
| `025-llm-model-runtime-inventory/variant-b-cocoindex-sbert.md` (NEW) | CocoIndex sentence-transformers inventory with structural-only subsystems noted |
| `025-llm-model-runtime-inventory/implementation-summary.md` (NEW) | Level 1 implementation summary with verification table and key decisions |
| `025-llm-model-runtime-inventory/spec.md` (NEW) | Feature specification with requirements and success criteria |

### Follow-Ups

- Re-resolve each inventory row after any provider swap by running the "verify with" command blocks at the bottom of each variant document.
- Update the Skill Advisor classification if it ever gains its own embedding pipeline rather than routing through Memory MCP transit.
- Exclude CocoIndex tokenizer warm-up models from the inventory scope if they are formally documented elsewhere.
