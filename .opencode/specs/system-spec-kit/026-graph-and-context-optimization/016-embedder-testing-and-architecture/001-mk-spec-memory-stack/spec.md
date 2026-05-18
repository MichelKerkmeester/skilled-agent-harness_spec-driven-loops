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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-mk-spec-memory-stack"
    last_updated_at: "2026-05-18T10:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Restructured: merged 4 mk-spec-memory phases (was 016/001-004) into one phase-parent umbrella"
    next_safe_action: "Strict-validate + commit restructure"
    blockers: []
    key_files:
      - "001-adapter-interface/spec.md"
      - "002-ollama-backend-and-multi-dim-schema/spec.md"
      - "003-mcp-tools-and-reindex/spec.md"
      - "004-mxbai-swap-and-008-closure/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016001"
      session_id: "016-mk-spec-memory-stack"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# 016/001: mk-spec-memory stack (phase parent)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This phase parent groups all mk-spec-memory (TypeScript MCP) embedder + architecture work that was previously spread across the top-level `016/001-004` slots. The grouping mirrors the `006-cocoindex-stack` pattern — one umbrella per skill surface so the 016 root stays scannable.

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
| 004-mxbai-swap-and-008-closure | mxbai swap + cat-24/409 closure | Shipped |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:cross-refs -->
## 3. CROSS-REFERENCES

- Sibling umbrella: `../006-cocoindex-stack/` — CocoIndex (Python) embedder + retrieval pipeline work
- Sibling umbrella: `../010-skill-advisor-embedder-parity/` — skill-advisor (TypeScript) embedder parity work (mirrors this stack's adapter pattern)
- Cross-cutting: `../008-deep-review-stack/` — 20-iter deep-review covering the work in this stack
- Cross-cutting: `../009-skill-docs-alignment/` — docs sweep covering the work in this stack
<!-- /ANCHOR:cross-refs -->
