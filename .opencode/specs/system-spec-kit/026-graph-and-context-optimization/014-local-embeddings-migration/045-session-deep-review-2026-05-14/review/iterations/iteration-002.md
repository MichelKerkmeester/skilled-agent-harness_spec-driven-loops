# Iteration 2: D1 Correctness — Tokenizer API Correctness and Token Budget Edge Cases

## Focus
Correctness of the tokenizer API in `shared/embeddings/providers/llama-cpp.ts` (Bug B, commit daf63f895). Verify that `model.tokenize` and `model.detokenize` are the correct node-llama-cpp v3.17.1 API surfaces, and examine edge cases in token budget truncation.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 2
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.42

## Findings

### P1 — Required

- **F005**: `model.tokenize` / `model.detokenize` placed behind a type guard but not a runtime version guard — `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:358-360`. The code checks `typeof runtime.model.tokenize !== 'function' || typeof runtime.model.detokenize !== 'function'` and throws if unavailable. This is defensive and correct for the API surface. However, the interface declares `tokenize?: (text: string) => unknown[]` and `detokenize?: (tokens: unknown[]) => string` as optional on `LlamaModel`. The task description notes that "a parallel session's 037 packet research had flagged `model.tokenizer.tokenize` as broken." The code uses `model.tokenize` and `model.detokenize` (directly on the model object), NOT `model.tokenizer.tokenize`/`model.tokenizer.detokenize` (the broken sub-property pattern). This is the correct API surface for node-llama-cpp v3.17.1 where `tokenize` and `detokenize` are direct methods on the model object. The type guard is a correct safety net. But there is no runtime check that the model version actually supports these methods — if `loadRuntime` loads a model from an older node-llama-cpp version where `tokenize` does not exist, the type guard will throw with `llama-cpp model tokenizer is unavailable; cannot enforce token budget`, which is the correct behavior (fail-open: throw rather than silently exceed the budget).

### P2 — Suggestion

- **F006**: Token budget does not account for BOS/EOS tokens or embedding prefix overhead — `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:236,385-392`. The `tokenBudget = Math.floor(trainContextSize * 0.9)` accounts for 10% headroom, which should absorb BOS/EOS tokens (typically 1-2 tokens). However, `getPrefixFor(this.prefixModelId, 'document')` and `getPrefixFor(this.prefixModelId, 'query')` in `embedDocument` and `embedQuery` prepend a prefix string BEFORE the text reaches `generateEmbedding`, and the token budget check happens AFTER `semanticChunk` but BEFORE prefix addition. The sequence is: `semanticChunk` → tokenize → check budget → detokenize → then the caller adds the prefix. This means the token budget does not account for the prefix tokens. For the EmbeddingGemma model, the prefix is typically short (< 10 tokens), so the 10% headroom (which for a 2048 context is ~205 tokens) provides ample margin. This is a minor gap that could cause issues with very long inputs on very small context windows.

- **F007**: Empty-string after truncation is not explicitly handled — `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:362-365`. If `semanticChunk` returns a non-empty string, but after tokenization and truncation, the `detokenize` call on `tokens.slice(0, runtime.tokenBudget)` could theoretically produce an empty string if `tokenBudget` is 0 or if the tokens decode to nothing. The 10% margin ensures `tokenBudget >= 1` for any `trainContextSize >= 10`, so this is practically impossible but not explicitly guarded.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | llama-cpp.ts:229,356-366 |

## Assessment
- New findings ratio: 0.42
- Dimensions addressed: correctness
- Novelty justification: Tokenizer API correctness and budget edge cases are new findings not covered in iteration 1.

## Ruled Out
- `contextSize: 'auto'` configuration: The `createEmbeddingContext` call uses `{ contextSize: 'auto', minContextSize: 512, maxContextSize: trainContextSize, batchSize: Math.min(512, trainContextSize) }`. If the model doesn't support `contextSize: 'auto'`, node-llama-cpp v3.17.1 falls back to the model's default context size, which is safe.

## Dead Ends
- None.

## Recommended Next Focus
D1 continued: Circuit breaker accounting under the new throw contract.