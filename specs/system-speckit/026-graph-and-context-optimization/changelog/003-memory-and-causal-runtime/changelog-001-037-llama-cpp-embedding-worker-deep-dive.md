---
title: "037 llama-cpp embedding worker deep-dive"
description: "Confirmed and fixed the contextSize:512 hardcode that caused chronic embedding-worker throws above 492 tokens. The runtime now reads model.trainContextSize, passes contextSize auto to createEmbeddingContext, runs a token-count preflight that truncates oversized input before inference. Four vitest cases pass including the real-model smoke."
trigger_phrases:
  - "037 llama-cpp embedding worker deep-dive"
  - "llama-cpp contextSize 512 bug fix"
  - "embedding worker token budget preflight"
  - "node-llama-cpp context size auto"
  - "model.tokenize API hotfix 3.17.1"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The llama-cpp embedding worker had a hardcoded `contextSize: 512` that caused every input above 492 tokens to throw with a clean error from node-llama-cpp 3.17.1. The char-based gate at `chunking.ts` (`MAX_TEXT_LENGTH = 8000`) did not catch overflows because the model tokenizes at roughly one token per 6 chars, so substantive `memory_save` bodies (3000 or more chars) routinely crossed the 512-token ceiling and tripped the circuit breaker.

Phase 1 ran an 11-size reproduction harness against the real GGUF model. The crossover from `vector` to `throw` fell exactly between 492 tokens (3000 chars) and 655 tokens (4000 chars), bracketing the 512-token threshold and confirming the hypothesis. Phase 2 telescoped the 3.17.1 version probe into Phase 1 because the project already resolved to 3.17.1. Phase 3 recorded the verdict. Phase 4 applied a minimal source-only patch: `loadRuntime()` now reads `model.trainContextSize ?? 2048` and passes `contextSize: 'auto'` with `maxContextSize: trainContextSize` to `createEmbeddingContext`. A new preflight in `generateEmbedding()` tokenizes the input via `model.tokenize()` and truncates via `model.detokenize(tokens.slice(0, budget))` if the input exceeds 90 percent of the budget. A hotfix in Phase 5 corrected the wrong API call (`model.tokenizer.tokenize` to `model.tokenize` per `LlamaModel.d.ts:181`), unblocking the real-model smoke test.

### Added

- Token-count preflight in `generateEmbedding()` using `model.tokenize()` plus `model.detokenize(tokens.slice(0, budget))` for truncation with `console.warn` observability
- `__llamaCppTestables` export enabling hermetic vitest mocking without altering the production call path
- `tokenBudget = floor(trainContextSize * 0.9)` computation derived from the model's own `trainContextSize` value
- 11-size reproduction harness at `_sandbox/37--llama-cpp-context-size/repro.mjs` with raw JSONL output and summary TSV
- ADR-003 decision record capturing rationale, four alternatives weighed, evidence chain and consequences

### Changed

- `createEmbeddingContext` call in `loadRuntime()` changed from hardcoded `contextSize: 512` to `contextSize: 'auto'` with `maxContextSize: model.trainContextSize ?? 2048`
- `generateEmbedding()` API call changed from `model.tokenizer.tokenize(...)` (callable, not an object) to `model.tokenize(...)` per the 3.17.1 `LlamaModel.d.ts` type signature
- Vitest mocks updated to provide `model.tokenize` directly to match the corrected call site

### Fixed

- Embedding worker threw on inputs above 492 tokens due to `contextSize: 512` hardcode. Now uses `contextSize: 'auto'` bounded by `model.trainContextSize`.
- Substantive `memory_save` calls (3000 or more chars) accumulated toward the circuit-breaker threshold due to repeated throws. Token-budget preflight prevents oversized inputs from reaching `getEmbeddingFor`.
- Real-model smoke test T030-04 was blocked by the wrong tokenizer API (`model.tokenizer.tokenize`). Hotfix to `model.tokenize` transitions the test from FAIL to PASS.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Phase 0 scaffold plus Level-2 docs | PASS | 7 files at 037 folder with canonical anchors present |
| Parent spec.md phase map updated | PASS | Row 37 plus handoff criteria at lines 117 and 140 in `014-local-embeddings-migration/spec.md` |
| Strict validate post-canonical-rewrite | PASS | Errors: 0. Warnings: 0 |
| Phase 1 reproduction harness | PASS | `run-3.15.1.jsonl` (11 rows) plus summary TSV. Null/throw boundary at 512 tokens confirmed |
| Phase 2 version comparison | PASS (telescoped) | `version-comparison.md` confirms project resolves 3.17.1 already. Version drift does not contribute |
| Phase 3 hypothesis verdict | CONFIRMED | Recorded in implementation-summary with timestamp and evidence refs |
| Phase 4 source patch present | PASS | 142-line diff source-only on `shared/embeddings/providers/llama-cpp.ts` |
| 037 hotfix (`model.tokenizer.tokenize` to `model.tokenize`) | PASS | Source updated. Vitest T030-04 transitioned FAIL to PASS |
| `npx vitest run tests/llama-cpp-token-budget.vitest.ts` | PASS 4/4 | T030-01 through T030-04 all green including real-model smoke |
| `npx vitest run tests/governance-ephemeral-decouple.vitest.ts` (regression) | PASS 3/3 | No governance regression |
| `npm run build` in `mcp_server/` | PASS exit 0 | Both `shared/dist/` and orphan `mcp_server/dist/system-spec-kit/shared/` refreshed |
| Daemon boot smoke | PASS exit 0 | API key validated. DB integrity 3604/3604. Embedding dim 768 |
| Live `memory_health` post-respawn | PASS | `provider.healthy=true`, `circuitBreakerOpen=false`, `flapping=false`, `transitionsInLast10Min=0` |
| Live `memory_save` round-trip | PASS (after 040 V8 fix) | `memory_save` confirmed after 040 V-rule overreach fix. Validator `QUALITY_GATE_PASS`, `current_spec=037` |
| `validate.sh --strict` final | PASS | 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Modified | `loadRuntime()` reads `model.trainContextSize ?? 2048` and passes `contextSize: 'auto'` with `maxContextSize`. `generateEmbedding()` gains token-count preflight with truncation. `__llamaCppTestables` export added. Hotfix: `model.tokenizer.tokenize` corrected to `model.tokenize`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts` | Modified | Mocks updated to provide `model.tokenize` directly. 4 tests all PASS including T030-04 real-model smoke. |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/repro.mjs` | Created | 11-size direct-provider reproduction harness. |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/run-3.15.1.jsonl` | Created | Raw 11-row evidence. 5 sizes PASS (43 to 492 tokens). 6 sizes THROW (655 to 1640 tokens). |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/run-3.15.1.summary.tsv` | Created | Summary TSV with chars, tokens, result and elapsed columns. |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/version-comparison.md` | Created | Documents 3.17.1 probe telescoping. Project already resolves 3.17.1. |
| `037-llama-cpp-embedding-worker-deep-dive/decision-record.md` (NEW) | Created | ADR-003 captures rationale, four alternatives weighed, evidence chain, consequences and hotfix narrative. |

### Follow-Ups

- Repair the 214 historical failed embeddings in `memory_index.embedding_status='failed'`. This is 036 scope using the now-healed worker.
- Add consumer-side token-bound preflight in `lib/search/embedding-expansion.ts:268` to prevent the 8-synonym concatenation from relying solely on the worker-level truncation fallback. This is 034 scope.
- Investigate V8 sufficiency gate evidence-counter regression found during Phase 5 live verification. The primary and support counters returned zero on a rich document. Tracked as 041 scope.
