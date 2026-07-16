---
title: "Implementation Plan: LLM and embedding-model runtime inventory per subsystem"
description: "Author two variant documents that split each spec-kit subsystem between the quantized EmbeddingGemma runtime and the CocoIndex sentence-transformers runtime."
trigger_phrases:
  - "model runtime inventory plan"
  - "variant a variant b authoring"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/025-llm-model-runtime-inventory"
    last_updated_at: "2026-05-13T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored variant-a and variant-b inventory docs"
    next_safe_action: "Review accuracy with operator"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation Plan: LLM and embedding-model runtime inventory per subsystem

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Write two flat inventory documents at the packet root. Each lists every subsystem in scope and resolves its current embedding runtime. The split avoids interleaving the two variants on a single page so a reader looking at one runtime never has to mentally filter the other out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] Source-of-truth files identified: `factory.ts`, `cocoindex_code/shared.py`.
- [x] Subsystem list bounded by what exists in `mcp_server/handlers/` and `mcp-coco-index/mcp_server/`.
- [x] Variant boundary defined: quantized GGUF/ONNX EmbeddingGemma vs full-precision sentence-transformers EmbeddingGemma.

### Definition of Done
- [x] Both variant documents exist at the packet root.
- [x] Each document cites the canonical source file for its runtime.
- [x] Structural-only subsystems are explicitly marked in the appropriate document.
- [x] Strict spec validation passes for the packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | Spec Kit Level 1 packet under a phase parent |
| **Storage** | File-backed spec folder |
| **Testing** | `validate.sh --strict` |

### Approach
Pull each subsystem's embedding-runtime decision directly from code. Authoritative sources:

- `factory.ts:resolveProvider()` cascade — env override, then VOYAGE_API_KEY, then OPENAI_API_KEY, then llama-cpp, then hf-local.
- `factory.ts:DEFAULT_LOCAL_MODELS` map — `hf-local` resolves to `onnx-community/embeddinggemma-300m-ONNX`, `llama-cpp` resolves to `unsloth/embeddinggemma-300m-GGUF`.
- `cocoindex_code/shared.py:MODEL_TASK_HINTS` — `google/embeddinggemma-300m` keyed to `InstructionRetrieval` prompt template.

For graph subsystems (causal, council, coverage, deep loop, structural code graph), inspect their handler/lib modules for direct embedding calls. Where there are none, the subsystem stores structural rows only and surfaces semantics via Memory MCP indexing of linked records.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Variant A authoring
- Enumerate subsystems that invoke Memory MCP embedding provider directly or indirectly.
- Record runtime, model id, dimensions, quantization, hardware acceleration.

### Phase 2: Variant B authoring
- Enumerate subsystems that invoke the CocoIndex sentence-transformers stack.
- Record model id, prompt template, quantization, hardware acceleration.

### Phase 3: Strict validation
- Run `validate.sh --strict` on the packet.
- Fix anchor or template-source issues if reported.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Structural validation | Level 1 doc contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
| Source-of-truth verification | Subsystem-to-runtime mapping | Manual grep of `factory.ts` and `cocoindex_code/shared.py` against each documented row |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- The 014 setup-A line shipped the local-embeddings migration that this inventory describes.
- Sibling 020 packet covers catalog and playbook documentation alignment.
- Sibling 019 packet covers README alignment.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Delete the `025-llm-model-runtime-inventory/` packet folder. No runtime code changes are involved.
<!-- /ANCHOR:rollback -->
