---
title: "CocoIndex Phase 001: Jina-Code Embedder Swap and MPS Auto-Detect"
description: "Default CocoIndex embedder flipped from gemma-300m to jina-embeddings-v2-base-code. MPS auto-detect added for Apple Silicon. Full reindex completed with 127,099 chunks. Test suite green. Code Graph bridge confirmed functional."
trigger_phrases:
  - "cocoindex jina-code swap"
  - "mps auto-detect cocoindex"
  - "jina-embeddings-v2-base-code default"
  - "cocoindex embedder default"
  - "018/001 cocoindex"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/001-cocoindex-swap` (Level 1)
> Parent packet: `002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The CocoIndex embedder default was `sbert/google/embeddinggemma-300m`, a general-text model that left code-search recall on the table. Device resolution only checked for CUDA, meaning Apple Silicon machines ran CPU inference even when Metal was available.

Two changes shipped in commit `8f909d229`: `_DEFAULT_MODEL` was flipped to `sbert/jinaai/jina-embeddings-v2-base-code` (768-dimensional, code-tuned, 161M parameters). A `_resolve_device()` helper was added that probes CUDA then MPS then CPU in order. A 7-case test suite in `tests/test_config.py` covers the full device-resolution matrix. The public repo reindexed to 127,099 chunks (8,386 files) in roughly 25 minutes on Apple Silicon with Metal acceleration. The Code Graph bridge confirmed functional post-swap. The `COCOINDEX_CODE_DEVICE=cpu` kill switch was preserved throughout.

### Added

- `_resolve_device()` helper in `cocoindex_code/config.py` with CUDA, MPS, CPU fallback chain and lazy torch import
- `tests/test_config.py` with 7 test cases covering default model identity, env override passthrough, CUDA preference, MPS-only path, CPU fallback, no-torch case
- `evidence/swap-runbook.md` operator runbook for daemon restart, first-use download, reindex trigger, smoke tests, rollback sequence
- `evidence/reindex-execution-results.md` captured reindex metrics for both the public repo and the anobel.com sibling project

### Changed

- `_DEFAULT_MODEL` in `cocoindex_code/config.py` changed from `sbert/google/embeddinggemma-300m` to `sbert/jinaai/jina-embeddings-v2-base-code`
- Device resolution now uses `_resolve_device()` instead of a CUDA-only check

### Fixed

- Apple Silicon machines received CPU inference even when Metal Performance Shaders were available. The MPS branch in `_resolve_device()` corrects this without requiring an env-var override from the operator.

### Verification

| Check | Result |
|---|---|
| `tests/test_config.py` (7 cases) | 7/7 PASS |
| Full CocoIndex pytest suite | 35/35 PASS on the swap branch |
| Device probe (`_resolve_device(None)`) on Apple Silicon | Returns `mps` |
| `_DEFAULT_MODEL` grep post-ship | `sbert/jinaai/jina-embeddings-v2-base-code` confirmed |
| Public repo reindex (127,099 chunks, 8,386 files) | Completed without errors in ~25 min |
| anobel.com sibling reindex (3,041 chunks, 212 files) | Completed without errors in ~30 sec |
| `mcp__cocoindex_code__search` smoke test | Non-empty top-k returned |
| Code Graph bridge (`mcp__mk_code_index__code_graph_context`) | Functional post-swap |

### Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `_DEFAULT_MODEL` flipped to jina-code. `_resolve_device()` helper added with CUDA, MPS, CPU fallback chain. (Note: file moved to `config/config.py` in a later refactor commit `29f412f31e`.) |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` (NEW) | 7-case test suite covering device resolution matrix and default model identity. |
| `evidence/swap-runbook.md` (NEW) | Operator runbook for daemon restart, jina-code first-use download, reindex trigger, smoke tests, rollback. |
| `evidence/reindex-execution-results.md` (NEW) | Captured reindex wall-clock, chunk counts, language breakdown, resource peaks, verdict table for both repos. |

### Follow-Ups

- Complete 018/003 benchmark measurement and ratify ADR-001 comparing jina-code against gemma-300m on recall metrics. Deferred per operator discretion at time of ship.
- Verify behavior after the `mcp-coco-index` skill removal (commit `400e7c075b`) to confirm the embedder logic was migrated to its replacement location before the skill was deleted.
