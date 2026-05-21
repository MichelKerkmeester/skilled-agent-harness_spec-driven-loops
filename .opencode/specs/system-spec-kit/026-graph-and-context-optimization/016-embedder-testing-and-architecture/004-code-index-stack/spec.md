---
title: "018: Code embedder swap to nomic-ai/CodeRankEmbed (phase parent)"
description: "CocoIndex code embedder stack parent. Current default is sbert/nomic-ai/CodeRankEmbed (768d, MIT) with hybrid search default-on, query expansion default-off, and Qwen rerank via sidecar default-on."
trigger_phrases:
  - "018 code embedder coderank"
  - "cocoindex embedder swap"
  - "code-specific embedder comparison"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded three-phase CocoIndex code-embedder swap packet"
    next_safe_action: "Author 001 cocoindex swap implementation"
    blockers: []
    key_files:
      - "001-cocoindex-swap/spec.md"
      - "002-baseline-fixture/spec.md"
      - "003-comparison-measure/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018000"
      session_id: "018-code-embedder-coderank"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# 018: Code embedder swap to nomic-ai/CodeRankEmbed (phase parent)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

CocoIndex (semantic code search) currently uses `sbert/google/embeddinggemma-300m` — a general-text embedder, not code-tuned. Code Graph's `mk-code-index` reaches CocoIndex through a bridge in `lib/`, so swapping CocoIndex's embedder also affects Code Graph's semantic queries.

The live default is `sbert/nomic-ai/CodeRankEmbed` (768d, MIT, code-tuned) per `registered_embedders.py` and `config/config.py`. Earlier Jina-code and BGE-code lanes are historical benchmark candidates, not the current production default.

mk-spec-memory uses `jina-embeddings-v3` (text-tuned, 1024 dim, Q4_K_M via Ollama) set by 016/004 ADR-012 + rescue layer per ADR-010/011. The two systems now use distinct local defaults: mk-spec-memory follows the Nomic/CodeRankEmbed local cascade for prose memory, while CocoIndex uses Nomic CodeRankEmbed for code search.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:scope -->
## 2. SCOPE

In scope:
- CocoIndex embedder swap from `embeddinggemma-300m`/historical Jina lanes to `sbert/nomic-ai/CodeRankEmbed` via `COCOINDEX_CODE_EMBEDDING_MODEL` env var
- MPS device auto-detection patch (current code only auto-detects CUDA; add MPS branch for Apple Silicon)
- Code-retrieval fixture (10-20 deterministic query/expected-source pairs scoped to actual repo code)
- Benchmark gemma baseline vs jina-code (and optionally CodeRankEmbed, bge-code) on the fixture
- ADR ratifying production embedder choice for CocoIndex

Out of scope:
- mk-spec-memory embedder choice (already ratified — nomic-embed-text-v1.5 + rescue layer per 016/004 ADRs)
- Code Graph internal structural indexing (no embeddings — AST-only)
- Cross-encoder reranker for CocoIndex (separate concern)
- API-backed embedders via LiteLLM (out of scope — local-only by policy)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:children -->
## 3. CHILDREN

| Child | Purpose |
|---|---|
| `001-cocoindex-swap` | Implement the swap: env var contract, MPS auto-detect patch, reindex orchestration, swap verification |
| `002-baseline-fixture` | Author code-retrieval fixture (10-20 query→expected-source pairs grounded in actual repo code) |
| `003-comparison-measure` | Run gemma vs CodeRankEmbed (and optional jina-code / bge-code) on the fixture; write ADR-001 ratifying winner |
<!-- /ANCHOR:children -->

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

- 016/004 retrieval-rescue + nomic text embedder (already shipped) — mk-spec-memory side; this packet is independent
- CocoIndex skill at `.opencode/skills/mcp-coco-index/` (active, no modifications)
- PyTorch 2.11.0 with MPS support (already in CocoIndex venv)
- `sentence-transformers` library (already in CocoIndex venv)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- jina-code installed + indexable; reindex of repo completes without errors
- Fixture measurement shows jina-code ≥ gemma on top-3 recall (or operator accepts gemma if measurement is inconclusive)
- ADR-001 ratifies the production choice with empirical evidence
- Code Graph semantic queries (via CocoIndex bridge) continue to work post-swap (smoke test)
- MPS auto-detect patch lands; CocoIndex auto-uses Apple Silicon GPU when available
<!-- /ANCHOR:success -->
