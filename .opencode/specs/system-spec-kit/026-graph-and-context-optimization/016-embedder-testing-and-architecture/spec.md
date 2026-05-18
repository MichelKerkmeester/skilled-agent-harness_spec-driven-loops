---
title: "016: Embedder testing and architecture (umbrella phase parent)"
description: "End-to-end embedder program — pluggable architecture (001-004), CocoIndex side swap + registry (006-007), playbook validation (005), 20-iter deep-review (008), skill docs alignment + canonical narrative (009), skill-advisor parity (010). Production winners: jina-embeddings-v3 for memory (text, ADR-012) + sbert/jinaai/jina-embeddings-v2-base-code for CocoIndex (code)."
trigger_phrases:
  - "016 embedder testing and architecture"
  - "embedder umbrella program"
  - "embedder adapter interface"
  - "any embedder zero migration"
  - "jina-v3 production embedder"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold phase parent + 4 children"
    next_safe_action: "Resume into 001-embedder-adapter-interface (native Claude @code)"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016000"
      session_id: "016-scaffold"
      parent_session_id: null
    completion_pct: 5
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
| Status | Scaffolded |
| Created | 2026-05-17 |
| Branch | main |
| Predecessor | `008-mk-spec-memory-stress-test` (cat-24/409 PARTIAL — embedding model bottleneck) |
| Related | `014-local-embeddings-migration` (existing EmbeddingGemma setup work — Complete) |
| Related | `115-embedding-model-evaluation` (sibling-track scaffold; superseded by this 016 packet via "build pluggable layer FIRST" decision) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:root-purpose -->
## 2. ROOT PURPOSE

Make mk-spec-memory **embedder-agnostic** so end users can swap models with a single MCP call — no code changes, no schema migration, no GGUF wrangling. Build the abstraction once; reuse it forever.

Current state: `unsloth-embeddinggemma-300m-GGUF` is hardcoded behind a direct `llama.cpp` invocation. Vector store has fixed 768-dim `vec_memories` table. Swapping models requires patching code paths, recreating tables at new dimensions, and re-embedding the corpus by hand.

Target state: an end user runs `ollama pull <model>` then `mcp__mk_spec_memory__embedder_set({ name: "mxbai-embed-large-v1" })` and the system handles the rest — schema creation, re-indexing, swap-over — automatically.

First concrete swap target: **mxbai-embed-large-v1** (Mixedbread AI, 335M params, 1024-dim, AnglE loss). Cosine-optimized for paraphrase recognition — directly addresses the cat-24/409 LLM-made-memory-recall failure mode that the current embedder cannot close.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:sub-phase-list -->
## 3. SUB-PHASE LIST

| Phase | Folder | Outcome |
|-------|--------|---------|
| 001 | `001-embedder-adapter-interface` | `EmbedderAdapter` interface + `EmbedderRegistry` lookup. Pure types + small registry. ✅ Shipped |
| 002 | `002-ollama-backend-and-multi-dim-schema` | Ollama HTTP-API adapter + lazy `vec_<dim>` table creation + active-embedder pointer. ✅ Shipped |
| 003 | `003-embedder-mcp-tools-and-reindex` | `embedder_list` / `embedder_set` / `embedder_status` MCP tools + background re-index orchestrator. ✅ Shipped |
| 004 | `004-mxbai-swap-and-008-closure` | Embedder leaderboard sweep (6 models tested) + retrieval-rescue layer + ADR-009/010/011/012 + 008/cat-24/409 51/51 closure. Production winner: jina-embeddings-v3 + rescue. ✅ Shipped |
| 005 | `005-playbook-quality-audit` (was 017) | Fairness audit + tool-coverage audit + scenario expansion (15 new + 3 repaired). B-RETRY validation 10/18 PASS. ✅ Shipped |
| 006 | `006-cocoindex-stack` (was 018) | CocoIndex default flipped from gemma to `sbert/jinaai/jina-embeddings-v2-base-code` + MPS auto-detect; reindex Public (127K chunks) + anobel.com (3K chunks). ✅ Shipped (003-comparison-measure deferred) |
| 007 | `006-cocoindex-stack` (was 019) | `registered_embedders.py` catalog of 6 vetted code embedders + INSTALL_GUIDE "Choosing an embedder" section. ✅ Shipped |
| 008 | `008-deep-review-stack` (was 020) | 20-iter cli-devin SWE-1.6 adversarial review of 016-019 (now 016/001-007). Verdict CONDITIONAL with hasAdvisories=true: 3 P0 / ~50 P1 / ~60 P2. ✅ Shipped |
| 009 | `009-skill-docs-alignment` (was 021) | Skill MDs audit (14 findings) + root README refresh + canonical `embedder-pluggability.md` narrative (410 LOC). ✅ Shipped |
| 010 | `010-skill-advisor-embedder-parity` (was 022) | Mirror 016/001-003 pattern in skill-advisor; flip default to jina-v3; reindex skill-graph. 🔄 Scaffolded; implementation pending |
<!-- /ANCHOR:sub-phase-list -->

---

<!-- ANCHOR:what-needs-done -->
## 4. WHAT NEEDS DONE

End-to-end working scenario after all four phases ship:

```bash
# One-time setup (any user)
brew install ollama && ollama serve &

# Pick whichever embedder you want
ollama pull mxbai-embed-large

# Tell mk-spec-memory to use it
mcp__mk_spec_memory__embedder_set({ name: "mxbai-embed-large-v1" })
# → "Created vec_1024 table. Re-indexing 11,434 memories. ETA ~15 min. Job: emb-swap-<utc>"

# Wait or poll
mcp__mk_spec_memory__embedder_status({ jobId: "emb-swap-<utc>" })
# → "9234 / 11434 (81%); ETA 3 min remaining"

# Or for an existing supported embedder, switch instantly if vec_<dim> already exists
mcp__mk_spec_memory__embedder_set({ name: "nomic-embed-text:v1.5" })
# → "Switched to nomic-embed-text:v1.5 (vec_768 already populated). No re-index needed."
```

Acceptance criteria (all four phases combined):
- Adding a new embedder = updating one registry entry + `ollama pull <name>`. No SQL DDL by hand. No code edits.
- Switch between any 2 embedders the user has previously installed = instant (vec_<dim> tables persist).
- Fresh install with a new dim = automatic table creation + re-index job + clean swap-over.
- Codex K commit `8ec4f1491` (SQL+trigger+rerank fixes) preserved end-to-end. No regression on packet 008's 56 PASS scenarios.
- cat-24/409 LLM-made-memory recall reaches PASS under the new model.

Hard constraints:
- Stay on `main` per `feedback_stay_on_main_no_feature_branches`
- Strict-scope git pattern per `feedback_git_add_not_scope_strict`
- Multi-runtime dispatch (001 Claude / 002 cli-codex / 003 cli-devin / 004 cli-opencode) per user directive
- Each phase commits + pushes independently; phase parent untouched until 004 closes
<!-- /ANCHOR:what-needs-done -->
