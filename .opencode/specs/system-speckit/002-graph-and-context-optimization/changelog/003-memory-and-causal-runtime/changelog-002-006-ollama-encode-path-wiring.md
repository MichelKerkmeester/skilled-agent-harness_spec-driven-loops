---
title: "016/002/006: Ollama encode-path wiring"
description: "Shared embeddings factory wired to Ollama-backed active embedders. Query-time encoding now matches the re-indexed vec_dim table, closing the dimension mismatch between the index path and the search path."
trigger_phrases:
  - "ollama encode path wiring"
  - "shared embeddings factory ollama"
  - "jina encode path fix"
  - "OllamaProvider shared factory"
  - "016/002/006 changelog"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The shared embeddings factory only knew `openai`, `voyage`, `hf-local` and `llama-cpp` after 016/002 shipped its registry and Ollama adapter. That left a production asymmetry where the index path could write Jina v3 vectors into `vec_1024` via `OllamaAdapter`, while query-time calls to `generateEmbedding()` still instantiated llama-cpp and produced 768-dim EmbeddingGemma vectors. The live machine had `active_embedder_name='jina-embeddings-v3'` and a populated `vec_1024`, making silent dimension mismatches inevitable at search time.

A shared `OllamaProvider` was added to `shared/embeddings/` implementing `IEmbeddingProvider`. The factory's auto mode now reads `vec_metadata.active_embedder_name` and selects Ollama when the active manifest is an Ollama backend and the matching `vec_<dim>` table exists with rows. A guard falls back to EmbeddingGemma with a warning when the active pointer is invalid or missing or points at an empty table. Sixteen regression tests cover the full provider matrix including hostile `process.env` mutation cases. Architecture documentation was added to explain the dual path and operator restart runbook.

### Added

- `shared/embeddings/providers/ollama.ts` implementing `IEmbeddingProvider` with `/api/tags`, `/api/embed` and legacy `/api/embeddings` support
- `ollama` entry in `SUPPORTED_PROVIDERS`, `VALID_PROVIDER_DIMENSIONS`, startup profile and explicit provider creation path in `factory.ts`
- Active `vec_metadata` auto-detection in factory auto mode selecting Ollama when `active_embedder_name` maps to an Ollama manifest and `vec_<active_dim>` exists with rows
- Dim mismatch protection: missing, empty or manifest-mismatched active dim tables log a warning and continue to EmbeddingGemma fallback without crashing
- `mcp_server/tests/embedder-ollama.vitest.ts` with 16 regression tests covering explicit provider, auto mode, missing table and hostile `process.env` variants
- `references/memory/embedder_architecture.md` canonical architecture reference explaining the shared factory path, registry adapter path and operator restart runbook

### Changed

- `shared/embeddings/factory.ts` `resolveProvider` now includes an `ollama` branch in the provider switch and consults `vec_metadata` in auto mode before the cloud/local cascade
- `shared/embeddings/profile.ts` provider enum extended with `ollama`
- `shared/embeddings/providers/README.md` updated with Ollama provider description
- `SKILL.md` top-level reference index updated with `embedder_architecture.md`
- `references/memory/embedding_resilience.md` cross-link added pointing to the new architecture doc

### Fixed

- Query-time dimension mismatch: search path called llama-cpp EmbeddingGemma (768-dim) while the active vector table was `vec_1024` written by Jina v3 via `OllamaAdapter`. The shared factory now follows the active `vec_metadata` pointer and encodes queries with the matching Ollama model.

### Verification

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | Pass |
| `npx vitest --run embedder-ollama` | Pass, 16 of 16 tests |
| `npm --prefix .opencode/skills/system-spec-kit run build` | Pass |
| Live compiled-dist explicit probe | `dim: 1024 provider: OllamaProvider` |
| Live compiled-dist auto probe | `provider: ollama reason: vec_metadata active_embedder_name=jina-embeddings-v3 (1024-dim)` |
| Strict packet validation (`validate.sh --strict`) | Pass, 0 errors, 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `shared/embeddings/providers/ollama.ts` (NEW) | `OllamaProvider` implementing `IEmbeddingProvider` for Ollama HTTP API |
| `shared/embeddings/factory.ts` | `ollama` branch in `resolveProvider`. Auto mode reads `vec_metadata` to select Ollama. `VALID_PROVIDER_DIMENSIONS` extended. |
| `shared/embeddings/profile.ts` | Provider enum extended with `ollama` |
| `shared/embeddings/providers/README.md` | Ollama provider entry added |
| `mcp_server/tests/embedder-ollama.vitest.ts` (NEW) | 16 regression tests covering explicit provider, auto mode, dim mismatch and hostile env variants |
| `references/memory/embedder_architecture.md` (NEW) | Canonical dual-path architecture reference with operator runbook |
| `references/memory/embedding_resilience.md` | Cross-link to new architecture doc added |
| `SKILL.md` | Top-level reference index updated |

### Follow-Ups

- Update `embedder_status` to report active shared-provider metadata instead of only re-index job state. The handler was outside the frozen scope for this packet.
- Restart the live `context-server.js` daemon after deploying this packet so the new compiled dist loads and old llama-cpp module state is dropped.
- Keep shared factory manifest rows and MCP registry manifest rows symmetric until a package-safe shared manifest source is established to avoid silent drift.
