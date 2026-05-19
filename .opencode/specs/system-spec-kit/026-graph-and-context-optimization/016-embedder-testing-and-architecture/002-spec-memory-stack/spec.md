---
title: "016/001: mk-spec-memory stack (phase parent)"
description: "Phase parent grouping all mk-spec-memory (TypeScript MCP) embedder + architecture work: adapter interface, Ollama backend + multi-dim schema, MCP tools + reindex, mxbai swap + cat-24 closure."
trigger_phrases:
  - "016/001 mk-spec-memory stack"
  - "mk-spec-memory pluggable embedder"
  - "embedder adapter architecture"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack"
    last_updated_at: "2026-05-19T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "2026-05-19 swept: ADR-013 (nomic OLLAMA_PRIORITY first, commit 847333a8f) + nomic re-index complete (job emb-swap-2026-05-19T05-41-40-358Z-86e029d6, 3808/3808, ~1:51 min, vector search verified at semantic sim 85.83) + jina shard + .jina-backup deleted (~148 MB freed); 015 packet scaffolded for ADR-014 cascade reorder + nomic hf-local default, dispatched to fresh Opus agent."
    next_safe_action: "Await fresh Opus agent (015 packet) completion; on commit-handoff, main agent stages + commits the cascade reorder + doc sweep."
    blockers: []
    key_files:
      - "001-adapter-interface/spec.md"
      - "002-ollama-backend-and-multi-dim-schema/spec.md"
      - "003-mcp-tools-and-reindex/spec.md"
      - "004-spec-memory-embedder-bake-off/spec.md"
      - "004-spec-memory-embedder-bake-off/decision-record.md"
      - "005-context-server-memory-reduction-research/spec.md"
      - "006-ollama-encode-path-wiring/spec.md"
      - "007-auto-embedder-selection-and-llama-cpp-purge/spec.md"
      - "008-byte-aware-health-telemetry/spec.md"
      - "009-byte-bounded-embedding-cache/spec.md"
      - "010-embedder-sidecar-execution/spec.md"
      - "011-lazy-startup-gating/spec.md"
      - "012-canonical-vector-shard-split/spec.md"
      - "013-bm25-fts5-rag-fusion-investigation/spec.md"
      - "014-fts5-default-lexical-with-guardrails/spec.md"
      - "015-cascade-reorder-and-nomic-hf-local-default/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016001"
      session_id: "016-mk-spec-memory-stack"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "What's the production active embedder? nomic-embed-text-v1.5 (768d, Ollama), set by ADR-013 + verified via embedder_set job emb-swap-2026-05-19T05-41-40-358Z-86e029d6 on 2026-05-19."
      - "What's the outer cascade tier order? Currently [Voyage, OpenAI, Ollama, hf-local] (cloud-first); ADR-014 in flight to flip to [Ollama, hf-local, OpenAI, Voyage] (local-first)."
      - "What's the rollback path for ADR-013? Checkpoint pre-nomic-swap-2026-05-19-073000 in checkpoints table (54 MB, 3808 memories). jina vector shard + .jina-backup were deleted 2026-05-19 (~148 MB freed) after vector search verified working under nomic."
      - "What was the jina production state pre-swap? BROKEN — 3808 rows with embedding_status='success' but the prior swap (emb-swap-2026-05-18T19-38-28-209Z) completed only 227/3808. Production was running BM25/FTS5 only for the remaining 94% of rows."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# 016/001: mk-spec-memory stack (phase parent)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This phase parent groups all mk-spec-memory (TypeScript MCP) embedder + architecture work that was previously spread across the top-level `016/001-004` slots. The grouping mirrors the `004-code-index-stack` pattern — one umbrella per skill surface so the 016 root stays scannable.

mk-spec-memory is the TypeScript MCP server that powers `memory_save`, `memory_search`, `memory_context`, and related continuity tools. Its embedder stack ships:

1. **Pluggable adapter interface** — `EmbedderAdapter` contract + `MANIFESTS` registry of vetted embedders (BASELINE = `embeddinggemma-300m`).
2. **Ollama backend + multi-dim schema** — dim-tagged `vec_<dim>` tables, `OllamaAdapter` for HTTP-served models (jina-v3, mxbai-embed-large-v1, bge-m3), `LlamaCppBaselineAdapter` for the gemma fallback.
3. **MCP tools + reindex orchestrator** — `embedder_list` / `embedder_set` / `embedder_status` user-facing tools backed by a background reindex job runner.
4. **First concrete swap** — mxbai-embed-large-v1 (1024d, cosine-optimized AnglE-loss training that addressed the paraphrase weakness behind cat-24/409 in packet 008).

All 4 sub-phases shipped before this restructure landed. The restructure is purely organizational — no code changes.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Title | Status |
|---|---|---|
| 001-adapter-interface | EmbedderAdapter contract + MANIFESTS registry | Shipped |
| 002-ollama-backend-and-multi-dim-schema | OllamaAdapter + vec_<dim> schema | Shipped |
| 003-mcp-tools-and-reindex | embedder_list/set/status + reindex orchestrator | Shipped |
| 004-spec-memory-embedder-bake-off | mxbai swap + cat-24/409 closure | Shipped |
| 015-cascade-reorder-and-nomic-hf-local-default | 016-reindex-populates-vec-memories-knn-table | [Criteria TBD] | [Verification TBD] |
| 016-reindex-populates-vec-memories-knn-table | 017-factory-shard-fallback-for-hf-voyage-openai | Confirm whether hf-local, voyage, and openai have active-embedder DB resolvers needing ADR-012 shard fallback. | Source audit documents that no analogous functions exist; shared and MCP server builds pass. |
| 017-factory-shard-fallback-for-hf-voyage-openai | 018-constitutional-quality-gate-exemption | [Criteria TBD] | [Verification TBD] |
| 018-constitutional-quality-gate-exemption | 019-lineage-and-metadata-repair-runner | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:cross-refs -->
## 3. CROSS-REFERENCES

- Sibling umbrella: `../004-code-index-stack/` — CocoIndex (Python) embedder + retrieval pipeline work
- Sibling umbrella: `../003-skill-advisor-stack/` — skill-advisor (TypeScript) embedder parity work (mirrors this stack's adapter pattern)
- Cross-cutting: `../008-deep-review-stack/` — 20-iter deep-review covering the work in this stack
- Cross-cutting: `../009-skill-docs-alignment/` — docs sweep covering the work in this stack
<!-- /ANCHOR:cross-refs -->
