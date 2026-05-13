---
title: "Variant A: Quantized EmbeddingGemma runtime"
description: "Subsystems that invoke the Memory MCP quantized EmbeddingGemma embedding stack (llama-cpp default, hf-local fallback)."
trigger_phrases:
  - "variant a embeddinggemma"
  - "memory mcp llama-cpp"
  - "skill advisor gemma"
importance_tier: "important"
contextType: "specification"
---
# Variant A: Quantized EmbeddingGemma runtime

This document lists every spec-kit subsystem that uses the **quantized EmbeddingGemma 300m** embedding stack. The Memory MCP server owns this runtime and every other subsystem on this page consumes it transitively by storing records into the Memory MCP via `memory_save` and querying them via `memory_search`.

---

## Runtime profile

| Aspect | Value |
|--------|-------|
| **Model family** | `google/embeddinggemma-300m` |
| **Active default model id** | `unsloth/embeddinggemma-300m-GGUF` |
| **Active runtime** | node-llama-cpp loading the GGUF Q8_0 quantization on Metal |
| **Fallback model id** | `onnx-community/embeddinggemma-300m-ONNX` |
| **Fallback runtime** | `@huggingface/transformers` (hf-local) loading the ONNX Q8 quantization |
| **Output dimensions** | 768 |
| **Pooling** | Mean pooling, normalized to unit length |
| **Hardware acceleration** | Apple Silicon GPU via Metal (llama-cpp) or via the ONNX runtime CPU/ANE path (hf-local) |
| **Canonical source file** | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` |
| **Provider cascade** | `EMBEDDINGS_PROVIDER` env var → `VOYAGE_API_KEY` → `OPENAI_API_KEY` → `llama-cpp` → `hf-local` |
| **Vector store** | `mcp_server/database/context-index__llama-cpp__*.sqlite` or the equivalent `__hf-local__*` file |

The 017 default flip made llama-cpp the active provider when its binary is installed; the 018 auto-migration packet wired startup-time re-embed-and-delete of any pre-flip hf-local store. Older clones that never installed llama-cpp continue running on hf-local without behavioral change.

---

## Subsystems on this runtime

### Direct consumers

| Subsystem | Purpose | Where the model gets called |
|-----------|---------|----------------------------|
| **Spec Kit Memory MCP** | Semantic memory of spec-doc records, continuity, decisions, handovers, council artifacts, deep-research and deep-review iterations. | `memory_save` and `memory_search` invoke `factory.ts:resolveProvider()` then call `provider.embed(text)`. Vectors land in `context-index__<provider>__*.sqlite`. |
| **Skill Advisor (semantic lane)** | Multi-lane scoring of which skill best matches a prompt. The "semantic" lane is one of five fusion lanes. | `skill_advisor/lib/scorer/fusion.ts` calls `memory_search` for the semantic lane. Memory search routes through the active Memory MCP provider. |

### Transitive consumers via Memory MCP indexing

These subsystems do not call the embedding provider themselves. They store structural rows in their own SQLite tables, but their **linked spec-doc records** are indexed by Memory MCP, which means their semantic surface uses Variant A.

| Subsystem | Storage | Why it ends up on Variant A |
|-----------|---------|----------------------------|
| **Causal Graph** | `causal_edges` table inside `context-index.sqlite` | Edge endpoints reference `memory_index` row ids. The rows have Variant A embeddings. `memory_causal_link` / `memory_causal_stats` query the edge table; semantic retrieval over linked memories surfaces Variant A vectors. |
| **Council Graph** | `council_graph` tables inside `context-index.sqlite` | A derived projection of `ai-council/**` packet-local artifacts. The underlying artifacts are spec-docs indexed by Memory MCP, so any semantic recall of council deliberations runs through Variant A. |
| **Coverage Graph** | `coverage_graph` table inside `context-index.sqlite` | Structural-only schema mapping tests to symbols. No embeddings of its own. Semantic surfacing of linked tests happens via Memory MCP. |
| **Deep Loop Graph** | `mcp_server/database/deep-loop-graph.sqlite` | Tracks iteration state for `deep-research` and `deep-review` packets. Structural data only. Semantic recall of iteration content happens after the iteration markdown is indexed by Memory MCP. |

Memory MCP indexing of these subsystems' artifacts happens automatically when `memory_index_scan` runs over the parent spec folder, and continuity-save writes through `generate-context.js` keep the embeddings refreshed.

---

## What is NOT on Variant A

- **CocoIndex code semantic search** lives on Variant B. See `variant-b-cocoindex-sbert.md`.
- **Structural Code Graph** (the `code_graph_scan` / `code_graph_query` family) does not use embeddings at all. It is a tree-sitter AST graph and is also covered in `variant-b-cocoindex-sbert.md` under the "no embeddings" section.
- **Voyage API** is supported in the cascade for migration paths but is not the active default on this machine.

---

## Verify with

```bash
# Confirm the Memory MCP provider cascade
grep -n "SUPPORTED_PROVIDERS\|DEFAULT_LOCAL_MODELS\|resolveProvider" \
  .opencode/skills/system-spec-kit/shared/embeddings/factory.ts | head -20

# Confirm the active llama-cpp model id
grep -n "unsloth/embeddinggemma-300m-GGUF" \
  .opencode/skills/system-spec-kit/shared/embeddings/factory.ts

# Confirm the active hf-local fallback model id
grep -n "onnx-community/embeddinggemma-300m-ONNX" \
  .opencode/skills/system-spec-kit/shared/embeddings/factory.ts

# Confirm none of the graph subsystems invoke embeddings directly
grep -rln "embed\|cosine" \
  .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop \
  .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph \
  .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph
# Expected: no matches
```
