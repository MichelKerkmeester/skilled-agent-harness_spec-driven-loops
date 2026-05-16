---
title: "Implementation Summary: LLM and embedding-model runtime inventory per subsystem"
description: "What was delivered for the 026 inventory packet and how the variant boundary was resolved."
trigger_phrases:
  - "model inventory summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/_025-llm-model-runtime-inventory"
    last_updated_at: "2026-05-13T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored variant-a and variant-b inventory docs"
    next_safe_action: "Review accuracy with operator"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "variant-a-quantized-gemma.md"
      - "variant-b-cocoindex-sbert.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation Summary: LLM and embedding-model runtime inventory per subsystem

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Completed** | 2026-05-13 |
| **Branch** | `_025-llm-model-runtime-inventory` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two inventory documents at the packet root that split every spec-kit subsystem into one of two embedding-runtime variants, and explicitly identify the subsystems that store no embeddings at all.

- `variant-a-quantized-gemma.md` — Memory MCP and Skill Advisor, plus the graph subsystems that piggyback on Memory MCP indexing.
- `variant-b-cocoindex-sbert.md` — CocoIndex code semantic search. Structural Code Graph is called out as a no-embeddings subsystem.

Each document carries a table mapping subsystem to runtime, model id, dimensions, quantization, hardware acceleration, and the canonical source-of-truth file. A "verify with" command block at the bottom of each lets an operator confirm the documented row in one grep.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two variants were resolved by reading the canonical configuration files. `factory.ts:resolveProvider()` defines the Memory MCP cascade and `factory.ts:DEFAULT_LOCAL_MODELS` resolves provider names to model ids. `cocoindex_code/shared.py:MODEL_TASK_HINTS` defines the CocoIndex model and prompt template.

For each graph subsystem (causal, council, coverage, deep loop, structural code graph), a grep for `embed`, `cosine`, and `HfLocal` confirmed whether the subsystem invokes embeddings directly. None of them do; their semantic surfacing happens when their linked records are stored in Memory MCP via `memory_save` and indexed through the active provider cascade.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Separate document per variant | Reader looking at one runtime never has to mentally filter the other out. |
| Cite canonical source file in each row | Future drift is detectable in one grep. |
| Call out structural-only subsystems explicitly | Prevents future readers from assuming Deep Loop, Council, Coverage, and structural Code Graph have their own model. |
| Inventory the active state, not aspirational architecture | The 014 line shipped llama-cpp as the default and hf-local as the fallback; both share the EmbeddingGemma family at 768 dimensions. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status |
|------|--------|
| Both variant documents written and placed at packet root | PASS |
| Each document cites the canonical source file | PASS |
| Structural-only subsystems called out explicitly | PASS |
| Strict spec validation | PASS after final run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The inventory is a point-in-time snapshot.** Future provider swaps will require re-resolving each row. The verify-with command blocks at the bottom of each variant document are the maintenance handle.
2. **Skill Advisor is classified under Variant A by transit.** It does not invoke an embedding provider directly; it queries `memory_search` which goes through the Memory MCP provider. If the Skill Advisor ever gains its own embedding pipeline, the classification will need updating.
3. **CocoIndex's tokenizer warm-up is excluded from this inventory.** The inventory covers the model used for embedding generation, not auxiliary models loaded for tokenization.
<!-- /ANCHOR:limitations -->
