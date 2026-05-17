---
title: "Summary: 022/001 pluggable architecture"
description: "Implemented skill-advisor-local pluggable embedder architecture"
trigger_phrases: ["022/001 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/001-pluggable-architecture"
    last_updated_at: "2026-05-17T22:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented pluggable embedder architecture"
    next_safe_action: "Resolve or waive full-suite drift before 001 commit"
    blockers: ["Full skill-advisor suite fails outside 001 scope: manual playbook inventory, corpus parity, graph health"]
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022001"
      session_id: "022-001-pluggable-architecture-impl"
      parent_session_id: "022-001-pluggable-architecture"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 022/001 pluggable architecture

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Implemented; verification blocked |
| Artifact | `mcp_server/lib/embedders/**`, `tests/embedders/**`, skill-graph-db migration, semantic-shadow registry wiring |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

- Added skill-advisor-local `lib/embedders/` with `EmbedderAdapter`, manifests, Ollama adapter, llama-cpp baseline adapter, schema helpers, and barrel exports.
- Registry has 6 manifests: `embeddinggemma-300m`, `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `jina-embeddings-v2-base-code`, `mxbai-embed-large-v1`, and `bge-m3`.
- Default registry selection is `jina-embeddings-v3`; empty `vec_metadata` falls back to `embeddinggemma-300m`.
- Added `vec_metadata`, `vec_768`, and `vec_1024` idempotent migrations to skill-graph init.
- Rewired semantic-shadow query embedding through `getActiveEmbedder()` + `getAdapter()`.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Copied the 016 embedder pattern, then adapted storage for skill-advisor skill IDs: `vec_<dim>` rows are keyed by `skill_nodes.id` so 002 can reindex skill metadata into the active vector table. Legacy `skill_nodes.embedding` loading remains the fallback when `vec_metadata` is empty.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Copy-adapt 016 mk-spec-memory code (duplicate) rather than extract shared package now — accelerates ship; defer extraction.
- `vec_metadata` keeps the 016 key/value shape (`active_embedder_name`, `active_embedder_dim`).
- `vec_<dim>` uses `skill_id TEXT PRIMARY KEY` rather than anonymous integer IDs because skill-advisor reindexing writes per-skill vectors.
- Semantic-shadow uses registry dispatch for prompt embeddings; the baseline adapter preserves the legacy shared provider cascade when no active pointer exists.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- `npm run build` — PASS under installed Node 25.
- Installed shared `vitest@4.1.6` exits 139 before test execution; package-declared `vitest@4.0.18` targeted run passes 4/4 new tests:
  `npm exec --yes --package vitest@4.0.18 -- vitest run tests/embedders/registry.vitest.ts tests/embedders/schema.vitest.ts`.
- Full suite under `vitest@4.0.18`: 381 passed, 7 skipped, 4 failed. Failures are existing corpus/playbook/graph-health drift, not new embedder tests.
- Schema probe after build: `vec_metadata`, `vec_768`, and `vec_1024` exist.
- Strict validation: PASS (`validate.sh 001-pluggable-architecture --strict`).
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- Full package test suite is not green in the current checkout due existing unrelated drift:
  `manual-testing-playbook.vitest.ts`, `advisor-corpus-parity.vitest.ts`, `advisor-graph-health.vitest.ts`, and `python-ts-parity.vitest.ts`.
<!-- /ANCHOR:limitations -->
