---
title: "003/001 Pluggable embedder architecture for skill-advisor"
description: "Skill-advisor had no swap mechanism, no vec_metadata pointer, no pluggable registry. A local lib/embedders/ module mirroring the 016 mk-spec-memory pattern was shipped with EmbedderAdapter, MANIFESTS registry, dim-tagged vec tables, schema helpers, rewired semantic-shadow dispatch. Four new vitest cases pass."
trigger_phrases:
  - "pluggable embedder architecture skill-advisor"
  - "skill-advisor EmbedderAdapter"
  - "skill-graph vec_metadata"
  - "skill-advisor embedder registry"
  - "022/001 pluggable architecture"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack`

### Summary

The skill-advisor server was locked to a legacy pre-016 cascade (`lib/shared/embeddings` symlink) with no mechanism to swap embedders, no `vec_metadata` pointer table, no pluggable registry. Operators could not change the default embedder without editing legacy provider files directly.

A skill-advisor-local `mcp_server/lib/embedders/` module was shipped that mirrors the 016 mk-spec-memory pattern: `EmbedderAdapter` interface, `MANIFESTS` registry with 6 vetted models (default `jina-embeddings-v3`), dim-tagged `vec_<dim>` schema helpers, `vec_metadata` pointer, `OllamaAdapter`, `LlamaCppBaselineAdapter` backends. The skill-graph-db migration gained idempotent `vec_metadata` and dim-table setup. The `semantic-shadow.ts` scorer now reads the active embedder via the registry instead of the factory cascade. Four new vitest cases cover adapter dispatch, dim-table creation, the active-pointer roundtrip.

### Added

- `mcp_server/lib/embedders/adapter.ts` with the `EmbedderAdapter` interface (name, dim, backend, embed, ready)
- `mcp_server/lib/embedders/types.ts` with `BackendKind` union and `EmbedderManifest` type
- `mcp_server/lib/embedders/registry.ts` with 6-entry `MANIFESTS` array and `getAdapter` dispatcher
- `mcp_server/lib/embedders/adapters/ollama.ts` with `OllamaAdapter` for Ollama-hosted models
- `mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` with `LlamaCppBaselineAdapter` for gemma fallback
- `mcp_server/lib/embedders/schema.ts` with `ensureVecTableForDim` plus `getActiveEmbedder` and `setActiveEmbedder` helpers
- `mcp_server/lib/embedders/index.ts` barrel re-exporting the public surface
- `mcp_server/tests/embedders/registry.vitest.ts` covering MANIFESTS shape and `getAdapter` dispatch
- `mcp_server/tests/embedders/schema.vitest.ts` covering `vec_metadata` roundtrip and `ensureVecTableForDim`

### Changed

- `mcp_server/lib/skill-graph/skill-graph-db.ts` migration extended with idempotent `vec_metadata`, `vec_768` and `vec_1024` table creation
- `mcp_server/lib/scorer/lanes/semantic-shadow.ts` rewired from legacy factory cascade to `getActiveEmbedder()` plus `getAdapter()` registry dispatch

### Fixed

- None.

### Verification

- `npm run build`: exit 0 under Node 25.
- Vitest 4 new cases (registry + schema): 4 of 4 pass via `vitest@4.0.18`.
- Full skill-advisor suite under `vitest@4.0.18`: 381 passed, 7 skipped. 4 failures are pre-existing out-of-scope drift in corpus-parity, manual-playbook-inventory, graph-health suites.
- Schema probe after build: `vec_metadata`, `vec_768` and `vec_1024` tables confirmed present.
- Strict packet validation (`validate.sh --strict`): exit 0, zero errors, zero warnings.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/lib/embedders/adapter.ts` (NEW) | `EmbedderAdapter` interface definition. |
| `mcp_server/lib/embedders/types.ts` (NEW) | `BackendKind` union and `EmbedderManifest` type. |
| `mcp_server/lib/embedders/registry.ts` (NEW) | 6-entry `MANIFESTS` with `getAdapter` dispatcher. |
| `mcp_server/lib/embedders/adapters/ollama.ts` (NEW) | `OllamaAdapter` using `POST /api/embed` shape. |
| `mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` (NEW) | `LlamaCppBaselineAdapter` for gemma fallback. |
| `mcp_server/lib/embedders/schema.ts` (NEW) | `vec_metadata` table helpers and dim-table bootstrap. |
| `mcp_server/lib/embedders/index.ts` (NEW) | Barrel re-exports for the embedders surface. |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Idempotent `vec_metadata` migration added to schema init. |
| `mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Registry dispatch replaces legacy factory cascade. |
| `mcp_server/tests/embedders/registry.vitest.ts` (NEW) | Vitest cases for MANIFESTS and `getAdapter`. |
| `mcp_server/tests/embedders/schema.vitest.ts` (NEW) | Vitest cases for `vec_metadata` roundtrip and dim-table creation. |

### Follow-Ups

- Resolve pre-existing vitest failures in `manual-testing-playbook.vitest.ts`, `advisor-corpus-parity.vitest.ts`, `advisor-graph-health.vitest.ts`, `python-ts-parity.vitest.ts` before the next full-suite green baseline.
- Extract a shared `@spec-kit/embedders` package to replace the copy-adapt duplication between 016 mk-spec-memory and skill-advisor once a third consumer emerges.
