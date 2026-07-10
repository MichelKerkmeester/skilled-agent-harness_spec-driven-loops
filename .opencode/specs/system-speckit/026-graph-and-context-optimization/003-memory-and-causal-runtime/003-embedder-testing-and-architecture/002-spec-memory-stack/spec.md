---
title: "016/001: mk-spec-memory stack (phase parent)"
description: "mk-spec-memory stack parent for adapter architecture, Ollama + hf-local Nomic cascade, Nomic/CodeRankEmbed default, retrieval-rescue closure, and later metadata repair packets. mxbai was tested and rolled back."
trigger_phrases:
  - "016/001 mk-spec-memory stack"
  - "mk-spec-memory pluggable embedder"
  - "embedder adapter architecture"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack"
    last_updated_at: "2026-05-22T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "retired-020-into-009-arc"
    next_safe_action: "use-009-001-leak-evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016001"
      session_id: "016-mk-spec-memory-stack"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Current default: Nomic/CodeRankEmbed auto cascade."
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

| Phase | Focus | Status |
|---|---|---|
| `001-adapter-interface/` | 016/001: EmbedderAdapter interface + EmbedderRegistry | Scaffolded |
| `002-ollama-backend-and-multi-dim-schema/` | 016/002: Ollama backend adapter + dim-tagged vec schema | Implemented |
| `003-mcp-tools-and-reindex/` | 016/003: Embedder MCP tools + re-index orchestrator | Shipped |
| `004-spec-memory-embedder-bake-off/` | 016/004: mk-spec-memory text-embedder bake-off (6 candidates) + retrieval-rescue layer + cat-24/409 closure | SHIPPED - ADR-012 selects jina-embeddings-v3 + rescue layer as production default; cat-24/409 closed at 9/10 under jina-v3 (was 8/10 under nomic) |
| `005-context-server-memory-reduction-research/` | 005-context-server-memory-reduction-research | Unknown |
| `006-ollama-encode-path-wiring/` | 016/002/006: Ollama encode-path wiring | Implemented |
| `007-auto-embedder-selection-and-llama-cpp-purge/` | 016/002/007 Auto-Embedder Selection + llama-cpp Purge | Planned (2026-05-18 evening; just-after 006 ship) |
| `008-byte-aware-health-telemetry/` | Byte-Aware Health Telemetry | Complete |
| `009-byte-bounded-embedding-cache/` | Byte-Bounded Embedding Cache | Complete |
| `010-embedder-sidecar-execution/` | Embedder Sidecar Execution | Complete |
| `011-lazy-startup-gating/` | Lazy Startup Gating | Implemented - Handler Verification Blocked |
| `012-canonical-vector-shard-split/` | Canonical Vector Shard Split | Implemented - Verified |
| `013-bm25-fts5-rag-fusion-investigation/` | BM25 FTS5 RAG Fusion Investigation | Complete |
| `014-fts5-default-lexical-with-guardrails/` | FTS5 Default Lexical With Guardrails | Implemented, verification pending |
| `015-cascade-reorder-and-nomic-hf-local-default/` | 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default (ADR-014) | Planned (one partial edit landed pre-scaffold) |
| `016-reindex-populates-vec-memories-knn-table/` | Phase 1: reindex-populates-vec-memories-knn-table | Complete |
| `017-factory-shard-fallback-for-hf-voyage-openai/` | factory-shard-fallback-for-hf-voyage-openai | Complete |
| `018-constitutional-quality-gate-exemption/` | Phase 1: constitutional-quality-gate-exemption | Complete |
| `019-lineage-and-metadata-repair-runner/` | Lineage and Metadata Repair Runner | Complete |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:cross-refs -->
## 3. CROSS-REFERENCES

- Sibling umbrella: `../004-code-index-stack/` — CocoIndex (Python) embedder + retrieval pipeline work
- Sibling umbrella: `../003-skill-advisor-stack/` — skill-advisor (TypeScript) embedder parity work (mirrors this stack's adapter pattern)
- Cross-cutting: `../008-deep-review-stack/` — 20-iter deep-review covering the work in this stack
- Cross-cutting: `../009-skill-docs-alignment/` — docs sweep covering the work in this stack
- Cross-cutting: `../009-memory-leak-remediation/001-research-synthesis-and-remediation-map/` — canonical archive for the former `020-cli-process-memory-leak-deep-research` research artifacts
<!-- /ANCHOR:cross-refs -->
