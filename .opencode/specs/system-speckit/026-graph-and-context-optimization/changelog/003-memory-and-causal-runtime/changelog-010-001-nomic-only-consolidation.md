---
title: "Consolidate local embedding models to nomic only"
description: "Local embedding model menus, dimension maps, and docs referenced eight stale models. This phase consolidates them to a single default, nomic-ai/nomic-embed-text-v1.5, with graceful runtime dimension derivation for user-specified unlisted models."
trigger_phrases:
  - "nomic only embedding consolidation"
  - "local embedding model menu cleanup"
  - "graceful unknown model dimensions"
  - "embeddinggemma docs cleanup"
  - "nomic embed text model default"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/001-nomic-only-consolidation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`

### Summary

Local embedding menus listed eight stale models across registries, dimension maps, provider code, and user documentation. This phase stripped them all back to a single default, nomic-ai/nomic-embed-text-v1.5. Unlisted models set by a user still work because the code derives the dimension from the runtime vector length instead of hard-failing. Cloud provider entries for voyage and openai were left unchanged.

### Added

- Graceful unknown-model handling so absent explicit local overrides use runtime-derived dimension instead of hard-failing (shared/embeddings/factory.ts).
- Regression test coverage for unlisted explicit local model runtime dimension derivation.

### Changed

- Local embedding model manifests reduced to nomic-ai/nomic-embed-text-v1.5 only, with canonical fallback resolving nomic for both hf-local and ollama providers.
- Provider dimension maps reduced to nomic-only dimension of 768.
- Provider model menus, PREFIX_REGISTRY entries, profile references, and type definitions trimmed to nomic-only defaults while preserving fallback-derived DEFAULT_MODEL values.
- Documentation updated to nomic-only local guidance, removing stale embeddinggemma-300m examples from ENV_REFERENCE.md, INSTALL_GUIDE.md, README.md, and provider READMEs.

### Fixed

- Stale old-registry assertions in prefix-system vitest tests corrected to match the nomic-only model reality.

### Verification

- npm run build for @spec-kit/shared and @spec-kit/mcp-server (tsc): PASS (exit 0)
- vitest run embeddings, embedder-*, and prefix-system (8 files): PASS (79 passed, 8 skipped, 0 failed)
- Four-lens adversarial review (guard, registry-factory, test-triage, scope): PASS
- Unlisted-model runtime dimension path: PASS with regression tests for hf-local and ollama
- Cloud providers and benchmarks untouched: PASS
- validate.sh --strict on this packet: PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `shared/embeddings/registry.ts` | Modify | MANIFESTS reduced to the nomic entry, getCanonicalFallback stays nomic |
| `shared/embeddings/factory.ts` | Modify | VALID_PROVIDER_DIMENSIONS local maps nomic-only (768) plus runtime-dim provisional for unlisted models |
| `shared/embeddings/providers/ollama.ts` | Modify | Model menu and PREFIX_REGISTRY trimmed to nomic, unlisted-model runtime-dim derivation added |
| `shared/embeddings/providers/hf-local.ts` | Modify | Model menu and PREFIX_REGISTRY trimmed to nomic, unlisted-model runtime-dim derivation added |
| `shared/embeddings/profile.ts` | Modify | Stale local model menu references removed |
| `shared/embeddings/types.ts` | Modify | Stale local model menu references removed |
| `mcp_server/ENV_REFERENCE.md` | Modify | Docs trimmed to nomic-only local guidance |
| `mcp_server/README.md` | Modify | Docs trimmed to nomic-only local guidance |
| `INSTALL_GUIDE.md` | Modify | Docs trimmed to nomic-only local guidance |
| `shared/embeddings/providers/README.md` | Modify | Docs trimmed to nomic-only local guidance |
| `mcp_server/database/vectors/README.md` | Modify | Docs trimmed to nomic-only local guidance |
| `mcp_server/tests/embeddings.vitest.ts` | Modify | Stale old-registry assertions updated to nomic-only |
| `mcp_server/tests/embedder-registry.vitest.ts` | Modify | Stale old-registry assertions updated to nomic-only |
| `mcp_server/tests/embedder-ollama.vitest.ts` | Modify | Stale old-registry assertions updated to nomic-only, runtime-dim regression test added |
| `tests/local-llm-features/prefix-system.vitest.ts` | Modify | Stale old-registry assertions updated to nomic-only |

### Follow-Ups

- Live re-embed was not performed here. Switching the default does not re-embed an existing corpus. Vectors stay valid because the default was already nomic (768). A genuine model change would require a reindex, documented in ENV_REFERENCE.
- Unlisted-model runtime-dim is verified headlessly with mocked vector length. A live unlisted model on a running daemon is the natural follow-up check.
- Phases 002 through 006, the hf-local HTTP model-server work, remain spec-only and deferred.
