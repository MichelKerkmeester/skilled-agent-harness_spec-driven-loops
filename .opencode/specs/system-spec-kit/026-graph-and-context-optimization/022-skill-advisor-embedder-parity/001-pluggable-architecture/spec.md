---
title: "Spec: 022/001 Pluggable embedder architecture for skill-advisor"
description: "Author mcp_server/lib/embedders/ module mirroring 016 pattern: EmbedderAdapter + MANIFESTS + OllamaAdapter + dim-tagged vec_<dim> schema + vec_metadata pointer"
trigger_phrases:
  - "022/001 pluggable architecture"
  - "skill-advisor EmbedderAdapter"
  - "skill-graph vec_metadata"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/022-skill-advisor-embedder-parity/001-pluggable-architecture"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Implement EmbedderAdapter + MANIFESTS"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022001"
      session_id: "022-001-pluggable-architecture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 022/001 Pluggable embedder architecture for skill-advisor

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned |
| Level | 1 |
| Owner | main agent or cli-codex dispatch |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

skill-advisor uses `lib/shared/embeddings` (symlink to `system-spec-kit/shared/embeddings/`) which is the pre-016 cascade (Voyage → OpenAI → llama-cpp[gemma] → hf-local[gemma]). No swap mechanism, no `vec_metadata` pointer, no pluggable registry. Operator can't change the default without editing legacy provider files.

Purpose: ship a skill-advisor-local `mcp_server/lib/embedders/` module that mirrors 016 mk-spec-memory: `EmbedderAdapter` interface, `MANIFESTS` registry, dim-tagged schema, `vec_metadata` pointer. Operator can then swap embedders via env var + daemon restart (or eventually MCP tool).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- New `mcp_server/lib/embedders/` directory in skill-advisor:
  - `adapter.ts` — `EmbedderAdapter` interface (name, dim, backend, embed, ready)
  - `registry.ts` — `MANIFESTS` array (6+ vetted embedders matching 016's list) + `getAdapter(name)` dispatcher
  - `adapters/ollama.ts` — OllamaAdapter for jina-v3 + other ollama-hosted models
  - `adapters/llama-cpp-baseline.ts` — LlamaCppBaselineAdapter for gemma fallback
  - `schema.ts` — `ensureVecTableForDim` + `getActiveEmbedder`/`setActiveEmbedder` reading/writing `vec_metadata` in skill-graph.sqlite
- `skill-graph-db.ts` migration: ADD `vec_metadata` table + per-dim `vec_<dim>` indexes
- `semantic-shadow.ts` updated: read active embedder from `vec_metadata`, dispatch via registry
- Vitest covering adapter resolution + dim-table creation + active-embedder pointer

Out of scope:
- Reindexing skill-graph (022/002)
- New MCP tools (`skill_advisor_embedder_set` etc — defer)
- Docs (022/003)
- Retiring the legacy `shared/embeddings` cascade (separate concern)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `EmbedderAdapter` interface mirrors 016 mk-spec-memory shape |
| R2 | `MANIFESTS` lists at least: embeddinggemma-300m (baseline), jina-embeddings-v3 (default), nomic-embed-text-v1.5, jina-embeddings-v2-base-code |
| R3 | `getActiveEmbedder()` reads from `vec_metadata.active_embedder_name`; falls back to baseline if unset |
| R4 | `setActiveEmbedder(name)` writes `vec_metadata` + ensures `vec_<dim>` table exists |
| R5 | `OllamaAdapter` reuses the same HTTP shape as 016 (`POST /api/embed` with `model + input`) |
| R6 | `semantic-shadow.ts` reads active embedder via registry instead of factory.ts cascade |
| R7 | Vitest covers: adapter dispatch, dim table creation, active pointer roundtrip |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 7 requirements met
- Existing skill-graph.sqlite has `vec_metadata` table after migration
- Vitest passes; full skill-advisor suite still passes (regression baseline)
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Code duplication**: 022/001 mirrors 016 code rather than importing. Decision: duplicate-for-now (no cross-skill module dep yet); refactor to shared package later if 016+022+future-tier-3 all share embedder code
- **Schema migration**: existing skill-graph.sqlite needs `vec_metadata` added. Mitigation: idempotent `CREATE TABLE IF NOT EXISTS` migration; no destructive ops
- **Daemon hot-reload**: daemon must restart to pick up new adapter dispatch. Documented in 022/003

Dependencies:
- 016 mk-spec-memory `lib/embedders/` (reference + can copy-adapt)
- skill-graph daemon (operator restart required)
- jina-v3 already pulled via Ollama (from 016/004 swap)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to extract a shared `@spec-kit/embedders` package now (one-time cost, future maintenance saved) or duplicate (faster ship, defer extraction)
<!-- /ANCHOR:questions -->
