---
title: "Provider Adapter Redesign Deferred P2 Closure"
description: "Closes six deferred P2 findings across execution-router.ts and sidecar-worker.ts by collapsing DirectProviderAdapter to a factory function, moving Ollama delegation to creation time and making the worker fail fast on invalid provider and dimension configuration."
trigger_phrases:
  - "provider adapter redesign"
  - "direct provider adapter collapse"
  - "F10 F23 F63 F64 F71 F75 closure"
  - "worker dimension provider fallback removal"
  - "execution router sidecar worker P2"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes`

### Summary

The `execution-router.ts` module carried a single-instantiation `DirectProviderAdapter` class that mixed provider creation, provider promise caching and Ollama registry delegation in one object. The `sidecar-worker.ts` module silently fell back to `hf-local` on a missing provider env and to the active profile dimension on invalid request dimensions, even though the router already resolved both upstream. Six deferred P2 findings (F10, F23, F63, F64, F71, F75) were closed by collapsing the class to a `createDirectProviderAdapter()` factory and three focused helpers, moving Ollama delegation to creation time, removing the worker fallbacks and normalizing provider aliases in one worker helper. The public `getEmbedderAdapter()` contract was preserved unchanged and all embedders vitest suites exited 0 after two F95 fixtures were updated to supply the now-required provider env.

### Added

- Five new vitest fixtures across `execution-router.vitest.ts`, `sidecar-worker.vitest.ts` covering router dimension validation, Ollama delegation, worker invalid-dimensions rejection, missing-provider rejection and provider-alias normalization
- Decision-record addendum with four ADRs documenting the redesign choices, alternatives considered and affected-consumer verification

### Changed

- `execution-router.ts`: `DirectProviderAdapter` class replaced by `createDirectProviderAdapter()` factory with three focused helpers (`createOllamaDelegatingAdapter`, `toProviderFactoryName`, `createFactoryBackedAdapter`) keeping provider-promise caching in a closure
- `execution-router.ts`: registered Ollama models now delegate to the registry adapter at creation time instead of branching on each embed call
- `sidecar-worker.ts`: dimension fallback removed so invalid request dimensions throw before provider factory creation
- `sidecar-worker.ts`: provider default removed so a missing `SPECKIT_EMBEDDER_SIDECAR_PROVIDER` env throws rather than silently selecting `hf-local`
- `sidecar-worker.ts`: `sentence-transformers` and `api` provider aliases normalized through one helper to canonical `hf-local` and `openai` respectively

### Fixed

- F23: `DirectProviderAdapter` single-use class was unnecessary indirection with no shared state requiring identity. Collapsed to a factory function.
- F63: Direct adapter logic was not decomposed into focused helpers. Resolved by the F23 collapse plus explicit helper extraction.
- F64: Registered Ollama models called `createEmbeddingsProvider()` unnecessarily on each embed. Delegation now happens once at creation time.
- F10: Worker dimension fallback was an unreachable silent default because upstream `resolveDimensions()` already validates. Fallback deleted and worker now throws on invalid dimensions.
- F71: Worker provider default to `hf-local` was unreachable because `SidecarClient` always injects the provider env. Default deleted and worker now throws on a missing env.
- F75: Provider alias fallback logic was scattered across `getProvider()`. Consolidated to one normalization helper called before factory creation.

### Verification

| Command | Result | Notes |
|---------|--------|-------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS | Scaffold validation before code edits. errors 0, warnings 0 |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/execution-router.vitest.ts mcp_server/tests/embedders/sidecar-worker.vitest.ts --config mcp_server/vitest.config.ts` | PASS | 2 files, 22 tests |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/sidecar-hardening.vitest.ts --config mcp_server/vitest.config.ts` | PASS | 1 file, 29 tests after F95 fixture update |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | PASS | Final allowed retry. 4 files, 54 tests. Previous run failed only on known F48 flake |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASS | Exit 0 |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS | Final validation after docs |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc-020-parent> --strict` | PASS | Parent validation after final bucket |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | `DirectProviderAdapter` class collapsed to `createDirectProviderAdapter()` factory. Three focused helpers extracted. Ollama delegation moved to creation time. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Modified | Dimension fallback removed. Provider default removed. Provider alias normalization consolidated to one helper. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` | Modified | Router dimension-validation fixture and Ollama delegation fixture added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-worker.vitest.ts` | Modified | Worker invalid-dimensions, missing-provider and provider-alias fixtures added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modified | Two F95 direct-worker fixtures updated to provide the now-required provider env. |

### Follow-Ups

- The arc 020 parent `spec.md` was not updated in this packet because the prompt scoped writable docs to the child packet only. A follow-on pass should reflect the arc completion state.
- The F48 random-ID flake appeared twice during full-suite runs. The final allowed retry passed. The flake remains a known non-deterministic test issue for a separate remediation packet.
- Three arc 020 findings (outside all six bucket scopes) remain DEFERRED and require operator sign-off before closure.
