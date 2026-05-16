---
title: "Feature Specification: LLM and embedding-model runtime inventory per subsystem"
description: "Inventory of which embedding model and runtime each spec-kit subsystem uses after the 014 setup-A local-embeddings migration."
trigger_phrases:
  - "model runtime inventory"
  - "llm variant per subsystem"
  - "embeddinggemma usage map"
  - "memory mcp vs cocoindex models"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/_025-llm-model-runtime-inventory"
    last_updated_at: "2026-05-13T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored variant-a and variant-b inventory docs"
    next_safe_action: "Review accuracy of subsystem-to-model mapping with operator"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "variant-a-quantized-gemma.md"
      - "variant-b-cocoindex-sbert.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000026"
      session_id: "_025-llm-model-runtime-inventory"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which subsystems use the quantized EmbeddingGemma runtime and which use the CocoIndex sbert runtime?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: LLM and embedding-model runtime inventory per subsystem

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `_025-llm-model-runtime-inventory` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the 014 setup-A line migrated both MCP servers off cloud Voyage onto local EmbeddingGemma, two distinct runtimes ended up in production: a quantized GGUF/ONNX path for the Memory MCP family, and a full-precision sentence-transformers path for CocoIndex. Operators routinely conflate the two when reasoning about what model is doing what, because both surface as "EmbeddingGemma 768d" in documentation. Existing docs describe the migration but do not enumerate, per subsystem, which runtime each one actually invokes.

### Purpose
Produce a per-subsystem inventory that splits every memory, graph, and search subsystem into one of two buckets and explicitly notes the structural-only subsystems that do not invoke embeddings at all. The two buckets are written as separate documents so the reader sees one runtime per page.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory the embedding runtime used by Memory MCP, Skill Advisor, Causal Graph, Council Graph, Coverage Graph, Deep Loop Graph, structural Code Graph, and CocoIndex.
- Cross-reference each subsystem to the active configuration in `factory.ts` and `cocoindex_code/shared.py`.
- Mark structural-only subsystems explicitly so readers do not assume they have an embedding model.

### Out of Scope
- Performance benchmarking. The 014 line already ran retrieval-quality and latency probes.
- Future model swaps. This packet documents the current state, not a roadmap.
- Documentation updates outside this packet. Sibling 020 packet already covered catalog/playbook alignment.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Produce a Variant A document listing every subsystem that uses the quantized EmbeddingGemma runtime. | `variant-a-quantized-gemma.md` exists, lists Memory MCP and Skill Advisor as primary users, and identifies each graph subsystem that piggybacks on Memory MCP indexing. |
| REQ-002 | Produce a Variant B document listing every subsystem that uses the CocoIndex sentence-transformers runtime. | `variant-b-cocoindex-sbert.md` exists, lists CocoIndex code search as the sole semantic consumer, and explains that structural Code Graph does not use embeddings. |
| REQ-003 | Both documents cite the active configuration files. | Documents reference `factory.ts:resolveProvider()` and `cocoindex_code/shared.py:MODEL_TASK_HINTS`. |
| REQ-004 | Both documents call out the structural-only subsystems by name. | Deep Loop Graph, Council Graph, Coverage Graph, and structural Code Graph are listed under "no embedding model" in the appropriate document. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who only reads one of the two variant documents can identify every subsystem that uses that runtime.
- **SC-002**: The split between Variant A and Variant B reflects the actual code paths, not aspirational architecture.
- **SC-003**: Subsystems that store no embeddings of their own are marked explicitly to prevent future drift.
- **SC-004**: Strict validation passes for this packet at Level 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Drift | Future provider swaps could move a subsystem between variants. | Inventory becomes stale. | Both documents cite the canonical source files so a future reader can verify in one grep. |
| Misclassification | A subsystem might silently start indexing into Memory MCP after the doc was written. | Reader misses Variant A coverage. | Each variant doc carries a "verify with" command snippet. |
| Dependency | Active state defined by 017 (default flip) and 018 (auto-migration). | Inventory is point-in-time. | Verify-with commands re-resolve from source. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None remaining. All subsystem mappings are answered in the variant documents.
<!-- /ANCHOR:questions -->
