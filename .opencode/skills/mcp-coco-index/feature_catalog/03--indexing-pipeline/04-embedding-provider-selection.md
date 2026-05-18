---
title: "04. Embedding provider selection"
description: "Creates sentence-transformer or LiteLLM embedders from user settings."
---

# 04. Embedding provider selection

Creates sentence-transformer or LiteLLM embedders from user settings. The embedder factory selects the runtime embedding backend. It supports local sentence-transformers and external LiteLLM-backed providers.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The embedder factory selects the runtime embedding backend. It supports local sentence-transformers and external LiteLLM-backed providers.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Default user settings choose the local sentence-transformers provider with `google/embeddinggemma-300m`; environment defaults may present the same model as `sbert/google/embeddinggemma-300m`. When the provider is `sentence-transformers`, the factory strips the legacy `sbert/` prefix and resolves the `InstructionRetrieval` query prompt for EmbeddingGemma. Other providers route through LiteLLM. Registered `ollama/` models use the LiteLLM path with an additional local daemon/model readiness check.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:101` | Settings | Defines default user embedding settings. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:46` | Shared runtime | Creates the embedder from settings. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:52` | Registry | Lists vetted local, LiteLLM and Ollama embedder candidates. |
| `.opencode/skills/mcp-coco-index/references/settings_reference.md:122` | Reference | Documents supported embedding models. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/tests/test_settings.py:45` | Unit | Covers default user settings. |
| `.opencode/skills/mcp-coco-index/tests/test_config.py:19` | Unit | Covers device and default model configuration. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py:1` | Unit | Covers Ollama-prefix routing through LiteLLM. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/04-embedding-provider-selection.md`

<!-- /ANCHOR:source-metadata -->
