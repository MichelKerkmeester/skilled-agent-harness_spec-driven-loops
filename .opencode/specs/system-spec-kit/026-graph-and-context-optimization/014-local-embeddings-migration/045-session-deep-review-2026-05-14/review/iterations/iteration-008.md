# Iteration 8: D4 Maintainability — Patterns, Naming, Dead Code

## Focus
Review code patterns, naming consistency, dead code, and documentation quality in the modified files.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.16

## Findings

### P2 — Suggestion

- **F018**: Inconsistent error message prefixes across the throw contract — `.opencode/skills/system-spec-kit/shared/embeddings.ts:507,673,727`. The `generateEmbedding` catch uses `[embeddings] generateEmbedding failed:` while `generateDocumentEmbedding` and `generateQueryEmbedding` use `[embeddings] generateDocumentEmbedding failed:` and `[embeddings] generateQueryEmbedding failed:` respectively. The prefix inconsistency is cosmetic but reduces grep-ability. The `stage1-candidate-gen.ts:544` prefix is `[stage1-candidate-gen]`. No standard prefix convention is documented.

- **F019**: `testRuntimeOverride` and `testNodeLlamaCppModule` are module-level singletons that persist across tests — `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:79-80`. While `resetRuntimeForTesting()` clears these, the `afterEach` in `llama-cpp-token-budget.vitest.ts:55-58` correctly calls it. However, if a test file imports `__llamaCppTestables` but forgets to call `resetRuntimeForTesting` in `afterEach`, state leaks between test suites. This is a standard testing pattern concern, not a production bug.

- **F020**: The `generateBatchEmbeddings` error message uses `console.error` while individual embedding functions use `console.warn` — `.opencode/skills/system-spec-kit/shared/embeddings.ts:600`. The batch error path logs `console.error('[embeddings] Batch ${batchNum} failed: ${errMsg}')` but the individual throw sites log `console.warn`. Log level inconsistency between batch (error) and per-item (warn) paths could confuse log aggregation.

## Assessment
- New findings ratio: 0.16
- Dimensions addressed: maintainability
- Novelty justification: All maintainability findings are new cosmetic/pattern observations.

## Recommended Next Focus
D4 continued: Metal acceleration regression risk.