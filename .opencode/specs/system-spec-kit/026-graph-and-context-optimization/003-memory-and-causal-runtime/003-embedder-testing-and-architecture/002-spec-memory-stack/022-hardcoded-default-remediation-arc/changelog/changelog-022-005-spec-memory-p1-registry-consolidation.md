---
title: "022/005 Spec-Memory P1 Registry Consolidation"
description: "Seven P1 audit findings closed by extending registry.ts with a RerankerProvider type, a RERANKER_CANONICAL frozen object plus a getRerankerFallback helper. Four consumer files rewired to derive defaults from the canonical registry instead of repeating inline strings."
trigger_phrases:
  - "022/005 registry consolidation"
  - "RERANKER_CANONICAL spec-memory"
  - "getRerankerFallback helper"
  - "spec-memory P1 registry"
  - "hardcoded default remediation 005"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Spec-memory had inline provider model defaults duplicated across four files despite `registry.ts` already exporting `getCanonicalFallback(provider)` since packet 020. The reranker side had no canonical helper at all: `cross-encoder/ms-marco-MiniLM-L-6-v2` was hardcoded inline in `PROVIDER_CONFIG.local`. Seven P1 audit findings tracked these gaps.

A single cli-opencode dispatch (deepseek-v4-pro, variant high, PID 37723, about 12 minutes wall-clock) extended `registry.ts` with `RerankerProvider`, `RERANKER_CANONICAL` plus `getRerankerFallback(provider)`, then rewired all four consumer files to derive their defaults from the registry. Typecheck exited 0. 678 vitest cases passed with no new failures.

### Added

- `RerankerProvider` type in `registry.ts` for typed reranker provider keys
- `RERANKER_CANONICAL` frozen object in `registry.ts` with `local: 'cross-encoder/ms-marco-MiniLM-L-6-v2'` and empty-string placeholders for voyage and cohere
- `getRerankerFallback(provider)` helper in `registry.ts` returning the canonical reranker model string for a given provider
- OLLAMA_PRIORITY derivation from `MANIFESTS` in `auto-select.ts`, expanding coverage from 4 hardcoded entries to 7 manifests

### Changed

- `providers/voyage.ts` line 13: `DEFAULT_MODEL` derives from `getCanonicalFallback('voyage')` instead of the inline string `'voyage-code-3'`
- `providers/openai.ts` line 13: `DEFAULT_MODEL` derives from `getCanonicalFallback('openai')` instead of the inline string `'text-embedding-3-small'`
- `auto-select.ts`: `VOYAGE_MODEL`, `OPENAI_MODEL` plus `HF_LOCAL_MODEL` all derive from `getCanonicalFallback()` instead of separate inline strings
- `cross-encoder.ts` line 54: `PROVIDER_CONFIG.local.model` uses `getRerankerFallback('local')` instead of the inline string `'cross-encoder/ms-marco-MiniLM-L-6-v2'`

### Fixed

- Seven P1 audit findings from packet 021 closed. All four duplication sites now reference the canonical registry, eliminating the risk of diverging defaults across files.

### Verification

| Check | Result |
|---|---|
| Typecheck (`typecheck:root`) | exit 0 |
| Vitest suite | 678 pass, 3 pre-existing failures (DB fixtures, tool count, sidecar-hardening) confirmed unrelated |
| Dispatch self-reported bundle gate | PASS |
| All 5 target sites verified by ban-list grep | 0 hits remaining |
| Strict packet validation (`validate.sh --strict`) | exit 0 |

### Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` | Added `RerankerProvider` type, `RERANKER_CANONICAL` frozen object, `getRerankerFallback(provider)` helper |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts` | `DEFAULT_MODEL` derives from `getCanonicalFallback('voyage')` |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts` | `DEFAULT_MODEL` derives from `getCanonicalFallback('openai')` |
| `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` | `VOYAGE_MODEL`, `OPENAI_MODEL`, `HF_LOCAL_MODEL` derive from `getCanonicalFallback()`. `OLLAMA_PRIORITY` derives from `MANIFESTS` (7 manifests vs prior 4 hardcoded) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | `PROVIDER_CONFIG.local.model` uses `getRerankerFallback('local')` (file later removed in packet 013) |

### Follow-Ups

- Fill voyage and cohere entries in `RERANKER_CANONICAL` when canonical reranker model names are established. Current empty-string placeholders require callers to guard with `getRerankerFallback(provider) !== ''` before use.
- Resolve pre-existing vitest failures for DB fixtures, tool count mismatch plus sidecar-hardening. These were confirmed unrelated to this phase but remain open.
