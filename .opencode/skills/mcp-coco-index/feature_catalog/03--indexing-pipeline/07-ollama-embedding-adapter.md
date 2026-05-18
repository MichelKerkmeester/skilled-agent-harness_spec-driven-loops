---
title: "07. Ollama embedding adapter"
description: "Routes registered ollama/ embedders through LiteLLM with local daemon readiness checks."
---

# 07. Ollama embedding adapter

Routes registered `ollama/` embedders through LiteLLM with local daemon readiness checks. The first supported candidate is `ollama/nomic-embed-text`, a 768-dimensional text embedder for operators who already run Ollama locally.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The Ollama adapter extends the existing LiteLLM provider path rather than adding a separate indexing backend. Registered Ollama models are selected with `COCOINDEX_CODE_EMBEDDING_MODEL` or `global_settings.yml`, then served by the local Ollama daemon through LiteLLM.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`registered_embedders.py` includes `ollama/nomic-embed-text` with `requires_ollama_daemon=True`. The embedder factory checks `/api/tags` before constructing the LiteLLM embedder, accepts implicit `:latest` Ollama tags, and passes `OLLAMA_API_BASE` through to LiteLLM. Missing daemons or missing models fail before indexing starts.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:52` | Registry | Registers vetted embedder metadata including the Ollama daemon flag. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:60` | Shared runtime | Validates Ollama daemon/model readiness and builds the LiteLLM embedder. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:255` | Config | Accepts only registered model names from `COCOINDEX_CODE_EMBEDDING_MODEL`. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py:1` | Unit | Mocks LiteLLM embedding calls and exercises the `ollama/` route. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py:35` | Unit | Verifies registry shape and Ollama metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py:112` | Unit | Verifies the registered Ollama model is accepted by env config. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/07-ollama-embedding-adapter.md`

<!-- /ANCHOR:source-metadata -->
