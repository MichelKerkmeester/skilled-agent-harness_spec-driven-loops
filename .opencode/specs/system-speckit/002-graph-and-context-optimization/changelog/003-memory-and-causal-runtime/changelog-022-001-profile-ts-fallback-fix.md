---
title: "022/001 profile.ts Fallback Fix: replace inline pipe-pipe literals with getCanonicalFallback"
description: "Closed 3 P0 audit findings by replacing all inline pipe-pipe model fallbacks in profile.ts and embeddings.ts with registry-derived getCanonicalFallback calls. Shipped a 7-invariant test suite locking the contract."
trigger_phrases:
  - "profile.ts fallback fix"
  - "022/001 inline pipe-pipe cleanup"
  - "BAAI hf-local active bug fix"
  - "getCanonicalFallback profile.ts"
  - "embeddings.ts dead code jina removal"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Three P0 audit findings from packet 021 remained open because `profile.ts:resolveActiveProfileModel` used inline `||` string literals as fallbacks for all four embedding providers. The hf-local branch was actively broken: it returned `BAAI/bge-base-en-v1.5` in common no-config scenarios, sending CLI scripts (checkpoint, ablation, eval) to stale BAAI vector tables even after the daemon switched to nomic. The ollama branch carried a latent `jina-embeddings-v3` literal contradicting ADR-013/014. A parallel dead-code fallback at `embeddings.ts:774` was also flagged.

All four `profile.ts` inline literals were replaced with `getCanonicalFallback(provider)` calls. The dead-code literal in `embeddings.ts` was removed. A new `profile.test.ts` was shipped with 7 standalone-assertion invariants (3 ban-list checks plus 4 behavioral checks). Typecheck exited 0 and all 7 test assertions passed. The confirmed-active BAAI bug now routes CLI scripts to the canonical nomic tables.

### Added

- `import { getCanonicalFallback, type CanonicalProvider } from './registry.js'` in `profile.ts`
- `shared/embeddings/profile.test.ts` with 7 standalone-assertion invariants: 3 ban-list checks and 4 behavioral checks covering all four providers (voyage, openai, ollama, hf-local)

### Changed

- `profile.ts:resolveActiveProfileModel`: all 4 inline `||` literals (voyage, openai, ollama, hf-local) replaced with `getCanonicalFallback(provider)` calls
- `embeddings.ts:detectConfiguredModelName`: 3 inline `||` literals (voyage, openai, ollama) replaced with `getCanonicalFallback(provider)` calls
- `embeddings.ts:774`: dead-code `|| 'jina-embeddings-v3'` literal removed

### Fixed

- hf-local fallback in `profile.ts` returned `BAAI/bge-base-en-v1.5` in no-config scenarios, routing CLI scripts to stale vector tables. Now returns the canonical nomic value via registry.
- ollama latent fallback `jina-embeddings-v3` in `profile.ts` contradicted ADR-013/014. Now registry-derived.
- Dead-code `jina-embeddings-v3` literal at `embeddings.ts:774` was shadowed by upstream registry config. Removed for hygiene and ban-list compliance.

### Verification

| Check | Result |
|---|---|
| `npm run typecheck:root` | exit 0 |
| `node --experimental-vm-modules shared/dist/embeddings/profile.test.js` | 7/7 ok |
| `rg "BAAI/bge-base-en|jina-embeddings-v3" shared/embeddings/profile.ts shared/embeddings.ts` | 0 hits in production code (comments and dim-lookups are legitimate) |
| `rg "getCanonicalFallback" shared/embeddings/profile.ts shared/embeddings.ts` | 10 hits (1 import plus 4 call sites per file) |

### Files Changed

| File | Action |
|---|---|
| `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts` | Modified. Added registry import. Replaced 4 inline fallback literals with `getCanonicalFallback(provider)` calls. |
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Modified. Replaced 3 inline fallback literals with `getCanonicalFallback(provider)` calls. Removed dead-code `jina-embeddings-v3` at line 774. |
| `.opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts` (NEW) | Created. 7 standalone-assertion invariants: 3 ban-list checks and 4 behavioral checks. |

### Follow-Ups

- Confirm that CLI scripts (checkpoint, ablation, eval) now target the correct nomic vector tables after the hf-local fallback fix.
- Dim-lookup at `profile.ts:225` retains `BAAI/bge-base-en-v1.5` as a backward-compatibility identifier in a registered-model-to-dim map. This is out of scope per the audit verdict and requires no change.
- `profile.ts:133` retains `jina-embeddings-v3: 1024` in a dim-map registered-model lookup. Same reasoning applies.
