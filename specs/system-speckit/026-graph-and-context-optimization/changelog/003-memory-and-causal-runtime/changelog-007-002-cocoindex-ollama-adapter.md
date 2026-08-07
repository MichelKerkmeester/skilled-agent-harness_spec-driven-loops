---
title: "CocoIndex Ollama Adapter: LiteLLM Provider Registration and Daemon Readiness Gate"
description: "CocoIndex gained a registered Ollama embedder path backed by LiteLLM. ollama/nomic-embed-text is admitted through the registry gate. The runtime factory checks daemon and model readiness before indexing. Mocked route tests and operator setup docs shipped alongside."
trigger_phrases:
  - "cocoindex ollama adapter"
  - "litellm ollama provider registration"
  - "ollama embedder registry cocoindex"
  - "nomic-embed-text cocoindex"
  - "ollama daemon readiness gate"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion`

### Summary

CocoIndex's embedder registry was sbert-only. A comment in `config.py` claimed non-sbert prefixes routed via LiteLLM, but the path was unverified. No Ollama manifests existed. `_is_registered_embedder()` silently fell back to the default for any unrecognized prefix. Operators running Ollama had no supported local path into CocoIndex indexing.

The LiteLLM path was confirmed present through `cocoindex[litellm]` and `shared.py`'s existing `LiteLLMEmbedder` branch. The missing pieces were registry admission, an Ollama manifest plus a preflight gate. `ollama/nomic-embed-text` (768d) was registered with a `requires_ollama_daemon=True` flag. `shared.py` gained a `/api/tags` readiness check that raises an actionable `RuntimeError` before indexing starts. 37 pytest cases cover the new routing path.

A worktree end-to-end run at commit `d850fcd97` indexed 4 files and returned top-1 correct results on 3 semantic queries with the cross-encoder reranker firing, producing a stable retrieval fingerprint (`41bcd9c6352d`).

### Added

- `requires_ollama_daemon` flag on `EmbedderMetadata`, defaulting to `False` for all existing sbert entries
- `ollama/nomic-embed-text` manifest entry (`dim=768`, `disk_mb=270`, `mps_compatible=True`, `category="text"`) in `registered_embedders.py`
- Ollama daemon and model readiness checks in `shared.py` using `/api/tags`, accepting implicit `:latest` tags and raising a clear `RuntimeError` on failure
- `tests/test_ollama_routing.py` with 37 pytest cases mocking `litellm.aembedding` and exercising the Ollama-prefix route
- "Using Ollama" section in `INSTALL_GUIDE.md` covering pull command, daemon start, env var setup plus a registry table row
- `feature_catalog/03--indexing-pipeline/07-ollama-embedding-adapter.md` as a dedicated feature catalog entry

### Changed

- `registered_embedders.py`: existing sbert entries updated to carry the new `requires_ollama_daemon=False` default
- `shared.py` factory path: now passes `api_base` into `LiteLLMEmbedder` when the model has the `ollama/` prefix
- `feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md`: Ollama documented as a LiteLLM-backed provider-selection variant
- `feature_catalog/feature_catalog.md`: Ollama adapter added to the indexing pipeline inventory
- `tests/test_registered_embedders.py` and `tests/test_config.py`: updated to accept the `ollama/` prefix and assert Ollama metadata

### Fixed

- `_is_registered_embedder()` previously fell back silently to the default model when an `ollama/` prefix was given. Registry admission and the preflight gate now make the routing explicit.
- Missing daemon produced no user-facing error before indexing. The `/api/tags` readiness check now raises a `RuntimeError` with an actionable message before any chunks are processed.

### Verification

| Check | Result |
|-------|--------|
| `from cocoindex.ops.litellm import LiteLLMEmbedder` and signature inspection | PASS. `LiteLLMEmbedder(model: str, **kwargs)` and `embed(text, input_type=None)` confirmed in existing venv. |
| `import litellm; hasattr(litellm, "embedding")` | PASS. LiteLLM installed through `cocoindex[litellm]` dependency path. |
| `pytest tests/test_ollama_routing.py tests/test_registered_embedders.py tests/test_config.py` | PASS. 37 passed. |
| `ruff check cocoindex_code/registered_embedders.py cocoindex_code/shared.py tests/test_ollama_routing.py tests/test_registered_embedders.py tests/test_config.py` | PASS. |
| `python -m compileall -q` on changed modules | PASS. |
| `verify_alignment_drift.py --root .opencode/skills/mcp-coco-index` | PASS. 24 pre-existing warnings, no errors. |
| `curl http://localhost:11434/api/tags` | PASS. `nomic-embed-text:latest` and `nomic-embed-text:v1.5` present. |
| Worktree e2e (`ccc init + ccc index + 3 x ccc search`) against `ollama/nomic-embed-text` at commit `d850fcd97` | PASS. `Embedder: ollama/nomic-embed-text (litellm, dim=768)`. Retrieval fingerprint `41bcd9c6352d`. Top-1 correct on all 3 queries with `cross_encoder_rerank` signal. |
| `validate.sh --strict --verbose` on packet | PASS. 0 errors, 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py` | Modified | Added `requires_ollama_daemon` flag and registered `ollama/nomic-embed-text` manifest entry. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modified | Added `/api/tags` readiness check and `api_base` pass-through into `LiteLLMEmbedder`. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py` | Created (NEW) | 37 pytest cases mocking `litellm.aembedding` and exercising the Ollama-prefix route. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py` | Modified | Updated to accept `ollama/` prefix and assert `requires_ollama_daemon` metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | Added assertions that registered Ollama model names do not fall back to the default. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Modified | Added "Using Ollama" section with setup steps and registry table row. |
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Modified | Added Ollama adapter to the indexing pipeline inventory. |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md` | Modified | Documented Ollama as a LiteLLM-backed provider-selection variant. |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/07-ollama-embedding-adapter.md` | Created (NEW) | Dedicated feature catalog entry for the Ollama embedding adapter. |

### Follow-Ups

- Benchmark `ollama/nomic-embed-text` against code-tuned sbert defaults on the 18-pair fixture before recommending it as a production replacement. The model is text-tuned and GGUF-quantized. Quality delta versus FP16 sbert defaults is unconfirmed.
- Add a second Ollama manifest entry (`ollama/mxbai-embed-large`) to confirm the one-line MANIFESTS pattern generalizes.
