# Iteration 5: D3 Traceability — Test Coverage Gaps and Spec-Code Alignment

## Focus
Examine whether the new tests in `embeddings.vitest.ts` (T029) and `llama-cpp-token-budget.vitest.ts` (T030) actually exercise the real code paths or short-circuit through mocks.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.35

## Findings

### P1 — Required

- **F012**: T029 tests mock the provider but do NOT test the circuit breaker + throw interaction end-to-end — `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:365-423`. T029-01 through T029-04 test individual throw propagation but use `mockEmbeddingProvider` to control behavior. T029-04 (`recordEmbeddingFailure`) verifies that the failure counter increments, but does not verify that: (a) the circuit breaker opens after 3 consecutive throws, (b) once open, calls to `generateEmbedding`/`generateDocumentEmbedding`/`generateQueryEmbedding` return null WITHOUT throwing (the circuit breaker early-return path). This means the single most critical interaction — throw 3 times → circuit opens → subsequent calls return null — is untested in the actual throw-contract integration. The test uses `__embeddingCircuitTestables.setProviderForTesting` to inject a mock, which bypasses the real provider initialization but correctly tests the throw paths. The gap is the circuit-breaker state transition under throw contract.

  Claim adjudication packet:
  ```json
  {
    "findingId": "F012",
    "claim": "Circuit breaker open-then-null path is untested under the throw contract integration.",
    "evidenceRefs": [".opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:365-423", ".opencode/skills/system-spec-kit/shared/embeddings.ts:475-477"],
    "counterevidenceSought": "Searched for a test that sets up 3 consecutive throws then verifies null-return; none found.",
    "alternativeExplanation": "The circuit breaker logic itself (open/half-open/close) is tested in embedding-circuit-breaker.vitest.ts under the old null contract, and the logic paths haven't changed.",
    "finalSeverity": "P1",
    "confidence": 0.78,
    "downgradeTrigger": "If circuit-breaker.vitest.ts already covers the open→null path under throw contract via integration, downgrade to P2.",
    "transitions": [{"iteration": 5, "from": null, "to": "P1", "reason": "Integration gap between throw contract and circuit breaker open behavior"}]
  }
  ```

### P2 — Suggestion

- **F013**: Token budget tests use `charTokenize` (character-level tokenization) as mock, not real tokenizer — `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts:23-25,61-72`. The `charTokenize` function splits text into characters, which means one character = one token. Real tokenizers (like EmbeddingGemma's BPE tokenizer) produce fewer tokens than characters, so the 200-token budget in T030-01 would allow approximately 200 characters, not 200 BPE tokens. This overestimates truncation behavior. T030-04 is a smoke test that runs only when `EMBEDDINGS_PROVIDER=llama-cpp` and the model file exists, so it's effectively conditional. The mock-based tests validate the code path correctly but under-represent real tokenizer behavior.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | T029 tests cover throw paths but miss circuit-breaker integration under throw |
| checklist_evidence | partial | hard | No spec checklist for 038/039 was reviewed; tests exist but have coverage gaps |

## Assessment
- New findings ratio: 0.35
- Dimensions addressed: traceability
- Novelty justification: Test coverage and circuit-breaker interaction gap are new finding classes.

## Recommended Next Focus
D3 continued: Cross-skill integration (tsconfig restructure impact).