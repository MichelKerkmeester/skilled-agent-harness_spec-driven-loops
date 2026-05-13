---
title: "Variant B: CocoIndex sentence-transformers runtime"
description: "Subsystems that invoke the CocoIndex full-precision EmbeddingGemma sentence-transformers stack, plus the structural subsystems that use no embedding model at all."
trigger_phrases:
  - "variant b cocoindex sbert"
  - "code graph no embedding"
  - "cocoindex embeddinggemma"
importance_tier: "important"
contextType: "specification"
---
# Variant B: CocoIndex sentence-transformers runtime, plus no-embedding subsystems

This document lists every spec-kit subsystem that uses the **CocoIndex full-precision EmbeddingGemma** stack, and the subsystems that **do not invoke any embedding model at all**. Both groups are documented together so a reader who came looking for "the other Gemma variant" also sees which subsystems are intentionally structural-only.

---

## Runtime profile (semantic consumer)

| Aspect | Value |
|--------|-------|
| **Model family** | `google/embeddinggemma-300m` |
| **Active model id** | `google/embeddinggemma-300m` (unquantized) |
| **Active runtime** | `sentence-transformers` ("sbert") via the `mcp-coco-index` Python MCP server |
| **Output dimensions** | 768 |
| **Pooling** | Mean pooling, normalized to unit length |
| **Hardware acceleration** | Apple Silicon GPU via PyTorch MPS backend |
| **Prompt template** | `InstructionRetrieval` resolves to `"task: code retrieval | query: "` |
| **Canonical source file** | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` |
| **Vector store** | CocoIndex managed semantic store under `~/.cocoindex_code/` |

The CocoIndex stack runs the same model family as Variant A (`google/embeddinggemma-300m`) but uses the unquantized weights and runs them through `sentence-transformers` instead of node-llama-cpp or `@huggingface/transformers`. The CocoIndex side keeps full bf16 precision because code semantic search has stricter parity expectations than memory recall and the speed tradeoff is acceptable given that CocoIndex indexing is offline.

---

## Subsystems on this runtime

| Subsystem | Purpose | Where the model gets called |
|-----------|---------|----------------------------|
| **CocoIndex code semantic search (`cocoindex_code`)** | Semantic search over the project's source code via the `ccc` CLI and the `mcp__cocoindex_code__search` MCP tool. | `cocoindex_code/shared.py:resolve_embedder()` instantiates a sentence-transformers `SentenceTransformer` and embeds both ingested code chunks and the operator's query string with the `InstructionRetrieval` prompt template. |

CocoIndex is the sole semantic consumer on this runtime. Everything else in this section is structural-only.

---

## Subsystems with NO embedding model at all

These subsystems carry structural data only. They invoke no embedding provider and store no vectors. If they need semantic surfacing of their linked artifacts, the surfacing happens by routing the artifacts through Memory MCP indexing, which uses Variant A.

| Subsystem | What it stores | Why it has no model |
|-----------|----------------|---------------------|
| **Structural Code Graph (`code_graph_scan` / `code_graph_query`)** | TypeScript, JavaScript, Python, and Bash AST nodes, edges (CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TYPE_OF, TESTED_BY, CONTAINS, OVERRIDES, DECORATES), and parse-health metadata. | Tree-sitter parses files into structural graphs. The graph is queried via `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, and `blast_radius` operations. None of those operations involve cosine similarity or embeddings. |
| **Deep Loop Graph (`deep_loop_graph_*`)** | Iteration deltas for `deep-research` and `deep-review` packets, plus convergence state. | The graph tracks iteration relationships by id. Iteration content is surfaced through Memory MCP indexing of the per-iteration markdown files. |
| **Council Graph (`council_graph_*`)** | A derived projection of the packet-local `ai-council/**` artifacts. | The graph rebuild reads append-only state JSONL and stores structural rows. The deliberation text itself surfaces through Memory MCP indexing of the council artifacts. |
| **Coverage Graph (`coverage_graph_*`)** | Test-to-symbol coverage edges. | Coverage is a structural relation between symbols, not a semantic one. |
| **Skill Graph (`skill_graph_*`)** | Skill discovery, dependencies, and intent-signal metadata pulled from each skill's `graph-metadata.json`. | The graph holds skill relationships and trust-state markers. Semantic skill scoring happens upstream in the Skill Advisor, which is on Variant A. |
| **Causal Graph edges (the edge rows themselves)** | Edge rows in `causal_edges`. | The edges are id-to-id structural relations. Vectors live on the linked `memory_index` rows, which is Variant A territory. |

---

## What is NOT on Variant B

- **Memory MCP, Skill Advisor, Causal Graph (semantic surface), Council Graph (semantic surface), Coverage Graph (semantic surface), and Deep Loop Graph (semantic surface)** all live on Variant A. See `variant-a-quantized-gemma.md`.
- **Voyage cloud API** is no longer the active default for any subsystem on this machine.

---

## Verify with

```bash
# Confirm the CocoIndex model and prompt template
grep -n "google/embeddinggemma-300m\|InstructionRetrieval\|SBERT_PREFIX" \
  .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py

# Confirm the structural Code Graph uses no embeddings
grep -rln "embed\|cosine" \
  .opencode/skills/system-spec-kit/mcp_server/code_graph/lib \
  .opencode/skills/system-spec-kit/mcp_server/code_graph/handlers
# Expected: matches only in documentation strings, not in execution paths

# Confirm the structural graphs (deep-loop, council, coverage, skill) use no embeddings
grep -rln "embed\|cosine" \
  .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop \
  .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph \
  .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph \
  .opencode/skills/system-spec-kit/mcp_server/lib/skill-graph
# Expected: no matches
```
