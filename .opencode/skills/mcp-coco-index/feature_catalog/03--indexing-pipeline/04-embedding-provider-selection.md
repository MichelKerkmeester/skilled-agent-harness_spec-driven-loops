---
title: "04. Embedding provider selection"
description: "Creates sentence-transformer or LiteLLM embedders from user settings."
---

# 04. Embedding provider selection

Creates sentence-transformer or LiteLLM embedders from user settings. The embedder factory selects the runtime embedding backend. It supports local sentence-transformers and external LiteLLM-backed providers.

> **Pipeline note**: CocoIndex Code's retrieval uses **two architecturally distinct models** in sequence:
>
> 1. **Bi-encoder embedder** (`sbert/nomic-ai/CodeRankEmbed`, 768d, MIT) — encodes query + chunks independently; vector lane uses cosine similarity, fused with FTS5 via RRF (K=60, V=0.9, F=0.5).
> 2. **Cross-encoder reranker** (`Qwen/Qwen3-Reranker-0.6B`, Apache-2.0) — encodes query+candidate **together** (token-level attention) to capture interaction signals the bi-encoder cannot. Runs on top-K (default 20) only.
>
> The two slots are not interchangeable: a bi-encoder cannot rerank (cosine already runs in the vector lane), and a cross-encoder cannot embed at scale (50–200ms per pair × 84k chunks = unworkable).

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The embedder factory selects the runtime embedding backend. It supports local sentence-transformers and external LiteLLM-backed providers.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Default user settings choose the local sentence-transformers provider with `nomic-ai/CodeRankEmbed`; environment defaults may present the same bi-encoder embedder as `sbert/nomic-ai/CodeRankEmbed`. When the provider is `sentence-transformers`, the factory strips the legacy `sbert/` prefix and resolves the `query` prompt prefix for nomic CodeRankEmbed (code-tuned, 768d, Metal/MPS auto-detected on Apple Silicon). Other embedding providers route through LiteLLM. Registered `ollama/` embedders use the LiteLLM path with an additional local daemon/embedder readiness check. This page covers Stage 1 embedder selection only; Stage 2 cross-encoder reranking is documented in [`05--search-and-ranking/08-reranker-cross-encoder.md`](../05--search-and-ranking/08-reranker-cross-encoder.md).
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
| `.opencode/skills/mcp-coco-index/references/settings_reference.md:122` | Reference | Documents supported embedders. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/tests/test_settings.py:45` | Unit | Covers default user settings. |
| `.opencode/skills/mcp-coco-index/tests/test_config.py:19` | Unit | Covers device and default embedder configuration. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py:1` | Unit | Covers Ollama-prefix routing through LiteLLM. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/04-embedding-provider-selection.md`

<!-- /ANCHOR:source-metadata -->
