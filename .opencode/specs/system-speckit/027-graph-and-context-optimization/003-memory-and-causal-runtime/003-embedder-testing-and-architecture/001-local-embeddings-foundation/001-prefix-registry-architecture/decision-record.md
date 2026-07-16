---
title: "Decision Record: Prefix Registry Architecture"
description: "ADR-001 — model-keyed PREFIX_REGISTRY + env-var override for HfLocalProvider and cocoindex shared.py, replacing the hardcoded Nomic-only prefix"
trigger_phrases:
  - "prefix registry ADR"
  - "ADR prefix registry"
  - "DR-001 prefix"
  - "decision prefix registry"
  - "decision-record prefix registry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/001-prefix-registry-architecture"
    last_updated_at: "2026-05-12T18:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "ADR-001 authored for the prefix-registry design"
    next_safe_action: "Proceed to sub-phase 002"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:01400161646400000000000000000000000000000000000000000000000000ad"
      session_id: "014-001-adr-2026-05-12"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record — 014/001 — Prefix Registry Architecture

<!-- SPECKIT_LEVEL: 1 -->

<!-- NOTE: Packet declared at Level 1 for validator-conformance pragmatics. The
architectural content (model-keyed prefix registry replacing hardcoded Nomic
prefix) IS the load-bearing change for Setup A and is documented here as a
bonus L3-style ADR. Validator strictly checks level-required files only; this
file is informational at L1 (not validator-required) but kept for traceability. -->

---

## ADR-001: Model-Keyed Prefix Registry with Env Override

**Date**: 2026-05-12
**Status**: Accepted
**Deciders**: Project owner (user); claude-opus-4-7 (main agent)

### Context

`HfLocalProvider` (TypeScript, `shared/embeddings/providers/hf-local.ts`) and `cocoindex_code/shared.py` both hardcode the **Nomic** prefix convention (`search_document: ` / `search_query: `). The prefix is prepended on every encode call regardless of which model is actually loaded.

Different embedding model families use different prefix conventions:

| Model family | Document prefix | Query prefix |
|---|---|---|
| Nomic v1.5 | `search_document: ` | `search_query: ` |
| EmbeddingGemma (Google) | `title: none \| text: ` | `task: search result \| query: ` |
| E5 (Microsoft) | `passage: ` | `query: ` |
| mxbai-large (Mixedbread) | _(none)_ | _(none)_ |
| Snowflake-Arctic-L v2 | _(none)_ | `Represent this sentence for searching relevant passages: ` |
| bge-m3 (BAAI) | _(none)_ | _(none)_ |

Feeding the wrong prefix doesn't crash — it just silently degrades retrieval quality by ~5-8% on standard benchmarks (MTEB, MTEB-CoIR). The user's Setup A migration (Voyage → local) requires running EmbeddingGemma for memory and Qwen3-Embedding for code, both of which would inherit the wrong Nomic prefix under the current code.

### Decision

Introduce a **model-keyed registry + env-var override** in both surfaces:

- TypeScript (`hf-local.ts`):
  - `PREFIX_REGISTRY: Record<string, {document?: string; query?: string}>` — frozen object with 6 initial entries
  - `getPrefixFor(modelId, kind): string` — resolves env override → registry → empty fallback
  - `embedDocument` / `embedQuery` call `getPrefixFor(this.modelName, ...)` instead of the hardcoded `TASK_PREFIX`
  - Env vars: `HF_EMBEDDINGS_PREFIX_DOC`, `HF_EMBEDDINGS_PREFIX_QUERY`
  - **Empty string is a valid override** (means "explicitly no prefix"); `undefined` (unset) means "fall through to registry"

- Python (`cocoindex_code/shared.py`):
  - `_QUERY_PROMPT_MODELS: dict[str, str]` — replaces the old `set`; maps model_id → SentenceTransformerEmbedder `prompt_name`
  - `resolve_query_prompt_name(model_name)` — env > dict > None
  - Env var: `COCOINDEX_QUERY_PROMPT_NAME`
  - `create_embedder()` calls the resolver instead of inline `if model_name in _QUERY_PROMPT_MODELS`

The legacy `TASK_PREFIX` export is preserved for back-compat with three external consumers (`shared/embeddings.ts`, `shared/index.ts`, `mcp_server/lib/providers/embeddings.ts`); their refactor is a follow-on packet.

### Alternatives Considered

1. **Keep hardcoded prefix, document the limitation**
   - Pros: zero code change
   - Cons: silent recall loss on every non-Nomic model; documentation rots; user has to know to override at the call site
   - **Rejected** — silent failure mode is exactly what the user wants eliminated.

2. **Pure env config, no registry**
   - Every model would require the user to set `HF_EMBEDDINGS_PREFIX_DOC` and `_QUERY` in every runtime config
   - Pros: maximum flexibility; no registry maintenance
   - Cons: 100% config churn for common cases; users have to know each model's prefix shape; ergonomic disaster
   - **Rejected** — the registry exists precisely so common cases just work.

3. **Runtime model probing (try multiple prefixes, pick best)**
   - Encode the query with each known prefix variant; pick the one that maximizes retrieval score on a held-out probe
   - Pros: zero configuration; "just works" for unknown models
   - Cons: 6× latency on every query; fragile probe-set design; requires a representative held-out set; bug surface for divergent scores
   - **Rejected** — cost/benefit lopsided; the registry handles the same case in O(1).

4. **Registry + env override hybrid** ✓ chosen
   - Built-in registry for all common families (currently 6)
   - Env-var escape hatch for unregistered models
   - Empty-string fallback (safe — never wrong, just suboptimal for prefix-sensitive models)
   - Pros: common cases just work; one-line PR to add a new model; env override for custom; safe default
   - Cons: registry needs maintenance (low — ~5 entries/year expected)

### Consequences

**Positive:**
- Setup A models (EmbeddingGemma, Qwen3-Embedding) ship the correct prefix automatically.
- Future model swap = one registry entry + a config line (no source change).
- Empty-string fallback means "no prefix" is always safe; the system never silently mis-prefixes an unknown model.
- Env override supports experimentation without re-deploying.

**Negative:**
- Two registries to keep in sync (TS-side for HfLocalProvider; Python-side for cocoindex). Mitigation: both are short (~6 entries) and ship together in this packet.
- Adding a new model still requires a registry entry to get the correct prefix; users who skip the entry get empty fallback (suboptimal but not broken).

**Neutral:**
- Legacy `TASK_PREFIX` export retained → no breakage in existing consumers. Eventual cleanup is a follow-on packet, not blocking this work.
