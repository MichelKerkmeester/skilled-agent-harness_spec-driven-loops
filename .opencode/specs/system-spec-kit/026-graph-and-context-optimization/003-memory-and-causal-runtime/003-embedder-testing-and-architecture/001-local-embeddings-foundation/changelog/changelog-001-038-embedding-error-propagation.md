---
title: "Embedding Provider Error Propagation: Surface Real Failures Through the Shared Facade"
description: "Single embedding wrappers now rethrow real provider failures instead of swallowing them as null. Retry-manager records the actual provider error class. Intentional degraded-null fallback is preserved at the four call sites that use null as a signal."
trigger_phrases:
  - "embedding error propagation"
  - "generateDocumentEmbedding rethrow"
  - "retry-manager failure_reason masking"
  - "embedding generation returned null bug"
  - "circuit breaker provider error"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The shared embedding facade caught real provider failures, incremented the circuit-breaker count and returned null. This made the retry-manager provider-error path unreachable, so rows whose provider actually threw "Input is longer than the context size" were stored with the misleading failure reason "Embedding generation returned null". The single embedding wrappers now rethrow after circuit-breaker accounting, so callers that track error classes receive the real provider exception. Batch embedding retains its null-per-item semantics because batch callers use null as a degraded-but-continuing signal. Four call sites that legitimately degrade received explicit fallback wrappers to preserve their behavior after the rethrow change.

### Added

- T029-01 through T029-04 test cases in `embeddings.vitest.ts` covering the facade rethrow contract, batch null semantics plus circuit-breaker increment on real throws
- T45d regression test in `retry-manager.vitest.ts` asserting `failure_reason` contains provider evidence and is not the old null-string sentinel
- Verbose error-count logging in the batch wrapper for observability on per-item failures

### Changed

- `generateDocumentEmbedding` and `generateQueryEmbedding` catch blocks now rethrow real provider errors after circuit-breaker accounting instead of returning null
- `stage1-candidate-gen.ts` gained a top-level degraded fallback that returns an empty candidate result on a caught embedding throw
- `eval-reporting.ts` gained two query embedding fallback wrappers that return null on caught throws
- `run-ablation.ts` gained one query embedding fallback wrapper that returns null on caught throws

### Fixed

- Retry-manager stored "Embedding generation returned null" as the failure reason when the provider actually threw a context-size overflow. The rethrow fix surfaces the real provider error class to callers that persist failure metadata.
- Circuit-breaker failure accounting was reachable but the provider error class was lost before callers could record it. The rethrow path preserves the class through to retry-manager.

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` in `mcp_server/` | PASS, exit 0 |
| `npx vitest run tests/embeddings.vitest.ts tests/retry-manager.vitest.ts tests/embedding-circuit-breaker.vitest.ts tests/chunking-orchestrator.vitest.ts tests/lazy-loading.vitest.ts` | PASS, exit 0. 5 files and 105 tests passed. |
| `validate.sh --strict` on 038 packet | PASS after final doc reconciliation |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Modified | Single-wrapper catch blocks rethrow real provider errors. Batch wrapper retains null-array semantics. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | Top-level fallback catch returns an empty degraded candidate result on embedding throw. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts` | Modified | Two query embedding calls wrapped with null-returning fallback catches. |
| `.opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts` | Modified | Query embedding call wrapped with null-returning fallback catch. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts` | Modified | T029-01 through T029-04 facade contract tests added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts` | Modified | T45d failure_reason regression test added. |

### Follow-Ups

- Stage and commit the working-tree changes once `.git/index.lock` EPERM is resolved in the host environment.
- Coordinate landing of 038 together with 037 and 039 as a single deployment unit. 038 surfaces failures. 039 prevents token-budget overflows. 037 reproduces and fixes the llama.cpp API contract.
- After 037, 038 and 039 land, verify that save-heavy query-intelligence playbook scenarios no longer trip the circuit breaker.
