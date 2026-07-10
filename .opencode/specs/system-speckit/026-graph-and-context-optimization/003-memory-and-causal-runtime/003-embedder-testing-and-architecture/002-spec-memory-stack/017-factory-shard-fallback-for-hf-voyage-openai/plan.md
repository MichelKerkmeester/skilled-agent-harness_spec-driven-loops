---
title: "Implementation Plan: factory-shard-fallback-for-hf-voyage-openai [template:level_1/plan.md]"
description: "Investigate whether factory.ts contains hf-local, voyage, or openai active-embedder database resolvers that need ADR-012 shard fallback. The implementation path is documentation-only because the analogous resolver functions do not exist."
trigger_phrases:
  - "factory shard fallback plan"
  - "hf-local voyage openai resolver audit"
  - "ADR-012 shard split factory"
  - "readActiveOllamaEmbedderFromDb follow-on"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai"
    last_updated_at: "2026-05-19T19:22:07Z"
    last_updated_by: "codex"
    recent_action: "Planned documentation-only closure for absent provider resolvers"
    next_safe_action: "Stage packet docs and parent phase map for commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0170000000000000000000000000000000000000000000000000000000000002"
      session_id: "016-002-017-factory-shard-fallback-for-hf-voyage-openai"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No code implementation phase is needed because no analogous functions exist."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: factory-shard-fallback-for-hf-voyage-openai

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, SQLite |
| **Framework** | Spec Kit shared package and MCP server workspace |
| **Storage** | `context-index.sqlite` metadata DB plus ADR-012 vector shards under `database/vectors/` |
| **Testing** | `npm run build` in `@spec-kit/shared`, `npm run build` in `@spec-kit/mcp-server`, strict spec validation |

### Overview
The work starts from the predecessor Ollama fix and checks whether the same active-embedder DB lookup exists for hf-local, voyage, and openai. The result is documentation-only: `factory.ts` has no analogous non-Ollama `readActive*EmbedderFromDb` functions, so adding shard fallback would create a new behavior rather than fixing an existing one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] Resolver search and source read completed.
- [x] No unnecessary source patch applied.
- [x] Shared and MCP server builds passed.
- [x] Packet docs updated with commit handoff.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Configuration-first provider factory with a single persisted active Ollama override.

### Key Components
- **`readActiveOllamaEmbedderFromDb`**: Reads `vec_metadata.active_embedder_name` and `active_embedder_dim`, validates the Ollama manifest, and checks `vec_<dim>` in either the main DB or the Ollama shard.
- **`resolveProvider`**: Applies provider precedence: explicit override, persisted Ollama pointer, Voyage API key, OpenAI API key, then hf-local fallback.
- **`get_vector_shard_path`**: Builds canonical ADR-012 vector shard paths as `vectors/context-vectors__${profile.slug}.sqlite`.

### Data Flow
Ollama can become the active provider from persisted database metadata. Hf-local, voyage, and openai do not read `vec_metadata` during factory provider selection; they resolve from explicit configuration, API-key presence, and local fallback rules. That means the requested shard fallback has no non-Ollama database resolver target in the current source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/factory.ts` | Owns provider selection and provider instance creation. | Unchanged. No hf-local, voyage, or openai active-embedder DB resolver exists. | `grep -n "readActive.*EmbedderFromDb\|hf-local\|voyage\|openai\|ollama" factory.ts` found only `readActiveOllamaEmbedderFromDb`. |
| `mcp_server/lib/search/vector-index-store.ts` | Owns canonical ADR-012 shard filename convention. | Unchanged. Used as evidence only. | `get_vector_shard_path` returns `path.join(vectorDir, \`context-vectors__${profile.slug}.sqlite\`)`. |
| `mcp_server/database/vectors/` | Holds current vector shards. | Unchanged. Used as evidence only. | Current files include Ollama `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` and hf-local `context-vectors__hf-local__baai_bge-base-en-v1.5__768__q8.sqlite`. |
| Packet docs | Records the completed investigation and no-code-change rationale. | Created and authored. | Strict validation runs against packet 017. |

Required inventories:
- Same-class producers: searched `factory.ts` for `readActive.*EmbedderFromDb`, provider names, and `active_embedder_*`.
- Consumers of changed symbols: no changed symbols exist because no code patch was applied.
- Matrix axes: provider (`ollama`, `hf-local`, `voyage`, `openai`), resolver type (`persisted DB pointer`, `env/API-key/config fallback`), shard filename convention (`with quant suffix`, `without quant suffix`).
- Algorithm invariant: do not add shard fallback for providers unless an existing factory resolver reads a dim-tagged table or persisted active-embedder pointer.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read predecessor packet implementation summary.
- [x] Read `factory.ts`.
- [x] Read `vector-index-store.ts::get_vector_shard_path`.

### Phase 2: Core Implementation
- [x] Run `grep -n` search for analogous provider resolver functions.
- [x] Confirm non-Ollama providers use different resolution paths.
- [x] Leave `factory.ts` unchanged because the target functions do not exist.
- [x] Author packet docs for the no-code-change result.

### Phase 3: Verification
- [x] Build `@spec-kit/shared`.
- [x] Build `@spec-kit/mcp-server`.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source inventory | Confirm resolver functions and provider resolution paths. | `grep -n`, `grep -R -n`, `sed` reads |
| Build | TypeScript workspace compilation after investigation. | `npm run build` |
| Documentation | Packet contract and metadata shape. | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Predecessor packet 016 implementation summary | Internal | Green | Defines the follow-on limitation this packet closes. |
| `factory.ts` current main state | Internal | Green | Determines whether a source patch is valid. |
| `vector-index-store.ts` shard naming logic | Internal | Green | Provides canonical ADR-012 filename evidence. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails after doc edits, or the main agent chooses not to record a no-code-change packet.
- **Procedure**: Remove the packet 017 folder and revert the generated parent phase-map row from `002-spec-memory-stack/spec.md`.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
