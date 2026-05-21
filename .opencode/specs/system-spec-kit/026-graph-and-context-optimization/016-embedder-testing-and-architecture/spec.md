---
title: "016: Embedder testing and architecture (umbrella phase parent)"
description: "Umbrella phase parent for embedder and reranker architecture across mk-spec-memory, mcp-coco-index, skill-advisor, launcher support, cross-cutting QA, Ollama/BGE historical promotion work, and the shared rerank sidecar arc. Current defaults: nomic-ai/CodeRankEmbed bi-encoder; Qwen/Qwen3-Reranker-0.6B for CocoIndex rerank via sidecar; cross-encoder/ms-marco-MiniLM-L-6-v2 for mk-spec-memory rerank when opt-in."
trigger_phrases:
  - "016 embedder testing and architecture"
  - "embedder umbrella program"
  - "embedder adapter interface"
  - "any embedder zero migration"
  - "nomic CodeRankEmbed and Qwen reranker defaults"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture"
    last_updated_at: "2026-05-21T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Dispatch A reconciled map/defaults."
    next_safe_action: "Resume 008-rerank-sidecar-arc."
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016000"
      session_id: "016-scaffold"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "Architecture decision: ollama as universal inference backend (avoids per-model GGUF wrangling)"
      - "Dimension strategy: dim-tagged tables (vec_768, vec_1024, vec_384) lazily created"
      - "First concrete swap target: mxbai-embed-large-v1 (cosine-optimized for paraphrase recall)"
      - "Multi-runtime split: 001=Claude, 002=cli-codex, 003=cli-devin, 004=cli-opencode-deepseek-v4-pro"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — only spec.md + description.json + graph-metadata.json at this level. -->

# 016: Embedder testing and architecture (umbrella)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 2 (phase parent) |
| Priority | P1 |
| Status | In Progress |
| Created | 2026-05-17 |
| Branch | main |
| Predecessor | `008-spec-memory-mcp-stress-test` (cat-24/409 PARTIAL — embedding model bottleneck) |
| Related | `014-local-embeddings-migration` (existing EmbeddingGemma setup work — Complete) |
| Related | `115-embedding-model-evaluation` (sibling-track scaffold; superseded by this 016 packet via "build pluggable layer FIRST" decision) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:root-purpose -->
## 2. ROOT PURPOSE

Track the end-to-end embedder and reranker program across the 016 umbrella. The current production posture is no longer the original Jina/mxbai scaffold: mk-spec-memory defaults to the Nomic/CodeRankEmbed local bi-encoder path through the Ollama -> hf-local Nomic cascade, CocoIndex defaults to `sbert/nomic-ai/CodeRankEmbed` for code embeddings, and CocoIndex reranks through `Qwen/Qwen3-Reranker-0.6B` via the shared sidecar by default.

mk-spec-memory's reranker default is configured as `cross-encoder/ms-marco-MiniLM-L-6-v2`, but `SPECKIT_CROSS_ENCODER` remains default-off per the arc 008 HOLD verdicts. Skill-advisor is still actively running gemma; alignment to mk-spec-memory's Nomic default is tracked outside this cleanup in `003/006-shared-embedder-logic`.

This parent is a control file for eight direct child arcs plus `research/`; detailed implementation state lives inside the arc children.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:sub-phase-list -->
## 3. SUB-PHASE LIST

| Arc | Focus | Current Status |
|---|---|---|
| `001-local-embeddings-foundation/` | Local embeddings foundation, Ollama cascade, local-LLM follow-ons | In Progress |
| `002-spec-memory-stack/` | mk-spec-memory adapter/cascade/default stack | In Progress |
| `003-skill-advisor-stack/` | skill-advisor pluggable registry and deferred default alignment | In Progress |
| `004-code-index-stack/` | CocoIndex CodeRankEmbed, hybrid search, query expansion, rerank stack | In Progress |
| `005-cross-cutting-quality/` | cross-stack QA, docs, benchmark format, install hygiene | In Progress |
| `006-mcp-launcher-concurrency-arc/` | launcher lease/concurrency hardening and 013 follow-up | In Progress |
| `007-ollama-and-bge-promotion-arc/` | historical Ollama/BGE promotion arc superseded by Nomic | Closed / Superseded |
| `008-rerank-sidecar-arc/` | shared rerank sidecar and Qwen/CocoIndex rerank work | In Progress |
<!-- /ANCHOR:sub-phase-list -->

---

<!-- ANCHOR:what-needs-done -->
## 4. WHAT NEEDS DONE

Current umbrella follow-up work is status reconciliation and scoped execution in active child arcs, not the original four-phase scaffold. The live defaults to preserve are:

- mk-spec-memory bi-encoder: `sbert/nomic-ai/CodeRankEmbed` (768d, MIT); `auto` cascade is Ollama -> hf-local Nomic.
- mk-spec-memory reranker: `cross-encoder/ms-marco-MiniLM-L-6-v2`, configured but default-off via `SPECKIT_CROSS_ENCODER` after arc 008 HOLD verdicts.
- mcp-coco-index bi-encoder: `sbert/nomic-ai/CodeRankEmbed`.
- mcp-coco-index reranker: `Qwen/Qwen3-Reranker-0.6B` through `system-rerank-sidecar`, default-on via `COCOINDEX_RERANK_VIA_SIDECAR=true`.
- Hybrid search: default-on. Query expansion: default-off.
- llama-cpp migration work is historical and superseded by the Ollama cascade.

Resume work from the relevant child arc. The latest active arc is `008-rerank-sidecar-arc/`.
<!-- /ANCHOR:what-needs-done -->
