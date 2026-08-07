---
title: "Spec Memory Stack Phase 020: Embedder Default Drift Fix"
description: "Five hardcoded embedder default strings eliminated via a registry-derived getCanonicalFallback() helper. A pre-ADR-013 jina-embeddings-v3 bug in ollama.ts contributed to circuit-breaker flapping and 1978 failed records in the 2026-05-23 incident. Twenty-three invariant assertions in registry.test.ts lock the contract and block legacy-string regression."
trigger_phrases:
  - "embedder default drift fix"
  - "getCanonicalFallback helper"
  - "hardcoded embedder default removal"
  - "registry-derived embedder fallback"
  - "ollama jina bug fix circuit breaker"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

ADR-013 and ADR-014 migrated the canonical spec-memory embedder to `nomic-ai/nomic-embed-text-v1.5` via the registry MANIFESTS array, but 5 hardcoded string constants survived across `shared/embeddings.ts`, `hf-local.ts`, `ollama.ts`, `factory.ts` and `sidecar-worker.ts`. The `ollama.ts` constant held `jina-embeddings-v3`, a pre-ADR-013 bake-off winner that the operator overrode. When the resolution chain fell through to these stale fallbacks the runtime instantiated models the registry did not recognize, triggering circuit-breaker flapping and contributing to 1978 failed records, 786 null-embedding errors and 754 stuck-pending items in the 2026-05-23 incident.

A `getCanonicalFallback(provider: CanonicalProvider)` helper was added to `shared/embeddings/registry.ts` as the single source of truth. Local providers (`ollama`, `hf-local`) derive their fallback from `MANIFESTS[0]`. Cloud providers (`voyage`, `openai`) derive theirs from a frozen `CLOUD_CANONICAL` table. All 5 hardcoded-default sites were refactored to call the helper. A 23-assertion standalone-test file (`registry.test.ts`) locks the ADR consensus name, dimensions, backend plus a regression guard against 3 banned legacy strings.

### Added

- `getCanonicalFallback(provider: CanonicalProvider): string` exported from `shared/embeddings/registry.ts`, derives local-provider fallbacks from `MANIFESTS[0]` and cloud fallbacks from a frozen table
- `CanonicalProvider` union type (`voyage`, `openai`, `hf-local`, `ollama`) exported from `registry.ts`
- `EmbedderNotConfiguredError` class exported from `registry.ts` as a programmer-error guard when MANIFESTS is empty
- `CLOUD_CANONICAL` frozen record in `registry.ts` for `voyage` and `openai` canonical strings
- `shared/embeddings/registry.test.ts` (NEW) with 23 standalone-assertion invariants covering MANIFESTS non-empty, ADR-013/014 consensus name, dimension, backend, all-4-provider helper contract plus a regression guard against the 3 banned legacy strings `BAAI/bge-base-en-v1.5`, `nomic-ai/nomic-embed-text-v1.5` (wrong path form) and `jina-embeddings-v3`

### Changed

- `shared/embeddings/factory.ts` lines 146-153: `DEFAULT_PROVIDER_MODELS` refactored so all 4 entries derive from `getCanonicalFallback(provider)` wrapped in `Object.freeze({...})`
- `shared/embeddings.ts` line 874: `DEFAULT_MODEL_NAME` constant replaced with `getCanonicalFallback('hf-local')`
- `shared/embeddings/providers/hf-local.ts` line 14: `DEFAULT_MODEL` constant replaced with `getCanonicalFallback('hf-local')`

### Fixed

- `shared/embeddings/providers/ollama.ts` line 14: `DEFAULT_MODEL = 'jina-embeddings-v3'` (pre-ADR-013 bug) replaced with `getCanonicalFallback('ollama')`. The stale string was the bake-off winner before the operator override in ADR-013 and was one contributor to the circuit-breaker flapping incident.
- Zero hits for `DEFAULT.*'BAAI/bge-base` across `.opencode/skills/system-spec-kit/` after refactor
- Zero hits for `DEFAULT.*'jina-embeddings-v3` across `.opencode/skills/system-spec-kit/` after refactor

### Verification

| Check | Result |
|---|---|
| `npm run typecheck:root` from `.opencode/skills/system-spec-kit/` | exit 0 |
| `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` | 23 of 23 ok |
| `rg "DEFAULT.*['\"]BAAI/bge-base" .opencode/skills/system-spec-kit/` | 0 hits |
| `rg "DEFAULT.*['\"]jina-embeddings-v3" .opencode/skills/system-spec-kit/` | 0 hits |
| `rg "getCanonicalFallback" .opencode/skills/system-spec-kit/` | 7 hits (1 export, 5 callers, 1 test) |
| Strict packet validation (`validate.sh --strict`) | PASS |

### Files Changed

| File | What changed |
|---|---|
| `shared/embeddings/registry.ts` | Added `CanonicalProvider` type, `EmbedderNotConfiguredError` class, `CLOUD_CANONICAL` frozen record, `getCanonicalFallback()` function after existing MANIFESTS export |
| `shared/embeddings/registry.test.ts` (NEW) | 23 standalone-assertion invariants covering ADR consensus lock and regression guard against 3 banned legacy strings |
| `shared/embeddings.ts` | Line 874: replaced `DEFAULT_MODEL_NAME` inline string with `getCanonicalFallback('hf-local')` |
| `shared/embeddings/factory.ts` | Lines 146-153: refactored `DEFAULT_PROVIDER_MODELS` to derive all 4 entries from `getCanonicalFallback(provider)` |
| `shared/embeddings/providers/hf-local.ts` | Line 14: replaced `DEFAULT_MODEL` inline string with `getCanonicalFallback('hf-local')` |
| `shared/embeddings/providers/ollama.ts` | Line 14: replaced stale `jina-embeddings-v3` bug string with `getCanonicalFallback('ollama')` |

### Follow-Ups

- The MANIFESTS array order is now load-bearing. Re-ordering changes the return value of `getCanonicalFallback('ollama')` and `getCanonicalFallback('hf-local')`. Any re-order must update the invariant test to reflect the new operator decision.
- Cloud providers' canonical strings still live as inline constants inside `CLOUD_CANONICAL` (two entries). If a third cloud provider arrives or these models change canonical, the table needs a manual update.
- Audit other subsystems (CocoIndex, skill-advisor, code-graph, rerank-sidecar) for similar hardcoded-default patterns. That sweep is deferred to a follow-on deep-research packet.
