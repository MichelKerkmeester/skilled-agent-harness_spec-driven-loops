---
title: "Embedding Provider Local-First Resolution"
description: "resolveProvider() is now local-first (ollama -> hf-local; cloud opt-in/last-resort), matching the intended Ollama > HF > OpenAI/Voyage priority. Two pre-existing stale embedder fixtures were repaired. Embedder test gate: 62 passed, 0 failed."
trigger_phrases:
  - "embedding local-first resolution"
  - "resolveProvider local-first shipped"
  - "ollama default embedder"
  - "embedding provider priority fix"
  - "016-embedding-provider-local-first"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/016-embedding-provider-local-first` (Level 2)

### Summary

The shared embeddings factory had three provider-order definitions: `auto-select.ts` bootstrap cascade and `getCascadeFallbackOrder()` were already local-first (`ollama → hf-local → openai → voyage`), but `resolveProvider()` — the primary runtime resolver — placed cloud providers (`Voyage`, `OpenAI`) above `hf-local` in auto mode. When Ollama was unavailable and a cloud API key was present, the system silently selected cloud instead of the local hf-local fallback, contradicting the intended `Ollama > HF > OpenAI/Voyage` priority.

`resolveProvider()` was reordered to `explicit EMBEDDINGS_PROVIDER → persisted-ollama → hf-local`, making cloud strictly opt-in or last-resort cascade. Two pre-existing stale test fixtures (`createActiveNomicDb` in `embedder-ollama.vitest.ts` and inline `createActiveOllamaDb` in `factory-auto-resolution.vitest.ts`) were repaired to include the missing `vec_memories_rowids` table required by the active-ollama path. Three legacy `it.skip` cloud-preference tests were rewritten to assert local-first and un-skipped. The embedder test gate ran 62 passed / 5 skipped / 0 failed.

### Added

- `hf-local` added to the `createEmbeddingsProvider()` error-catch fallback condition so a hard local failure cascades to cloud via `getCascadeFallbackOrder('hf-local') = ['openai','voyage']`, preserving cloud as a genuine last-resort tier.
- `vec_memories_rowids` table creation added to the two stale active-ollama test fixtures, which legitimately required this table before honouring an active ollama embedder.

### Changed

- `resolveProvider()` in `shared/embeddings/factory.ts` reordered: auto-mode `VOYAGE_API_KEY`/`OPENAI_API_KEY` branches removed. Auto-mode precedence is now `explicit EMBEDDINGS_PROVIDER → persisted-ollama → hf-local`. Cloud is never silently auto-selected.
- Three legacy `it.skip` cloud-preference tests (`T513-01b/c/d`) in `embeddings.vitest.ts` rewritten to assert local-first behavior and un-skipped.
- Stale precedence docstring in `factory.ts` corrected to reflect the new local-first order.

### Fixed

- `resolveProvider()` silently preferring OpenAI/Voyage over `hf-local` in auto mode when Ollama was unavailable and a cloud API key was set. Now `hf-local` is always tried before cloud in auto mode.
- Dead `isPlaceholderKey` helper removed (its only callers were the removed cloud auto-selection branches).
- Stale `it.skip` cloud-preference tests that asserted the wrong (cloud-first) behavior in auto mode.

### Verification

| Check | Result |
|-------|--------|
| Embedder test gate (6 files, isolated DBs) | PASS — 62 passed / 5 skipped / 0 failed |
| `T513-01b/c` auto mode with valid Voyage + OpenAI keys resolves `hf-local` | PASS |
| Provider-flap recovery: stays `hf-local` when ollama unreachable; recovers to `ollama` when reachable | PASS |
| `factory-auto-resolution` + `embedder-ollama` persisted-ollama path (repaired fixtures) | PASS |
| Cause isolation (`git stash` factory.ts + rebuild): 2 fixture failures reproduced against pristine source | PASS — confirmed pre-existing |
| `tsc --build` (shared) | PASS — clean |
| Comment hygiene: `post-016` packet-id removed; no spec-paths in code | PASS |
| Test isolation: isolated test DBs; production DB untouched | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | `resolveProvider()` local-first reorder; `createEmbeddingsProvider()` `hf-local` cascade trigger added; dead `isPlaceholderKey` helper removed; stale precedence docstring corrected |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts` | Modified | Three `it.skip` cloud-preference tests rewritten to assert local-first and un-skipped |
| `.opencode/skills/system-spec-kit/mcp_server/tests/factory-auto-resolution.vitest.ts` | Modified | Stale active-ollama fixture repaired (`vec_memories_rowids` table added) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts` | Modified | Stale active-ollama fixture repaired (`vec_memories_rowids` table added) |

### Follow-Ups

- **Live daemon recycle deferred.** The running daemon (pid 69984) loaded the pre-rebuild `shared/dist` and already runs on persisted ollama. The behavioral change affects only the fallback path until a recycle. Batched with the pending 015 launcher-`.cjs` restart decision (user-gated).
- **Downstream consumer.** Packet `131-doctor-install-alignment` (relocated: `006-operator-tooling/006-doctor-install-alignment`) documents embeddings as `Ollama default → HF → OpenAI/Voyage (cloud opt-in)`, consuming this change as ground truth.
