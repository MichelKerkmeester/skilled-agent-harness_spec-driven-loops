---
title: "034 Query Expansion Context Size: Bounded Combined Query for llama-cpp Worker"
description: "Consumer-side character budget added to embedding-expansion.ts so low-priority synonym terms cannot silently overflow the llama-cpp query embedding context. The original query is preserved verbatim and only the highest-priority expansion terms that fit under the 6500-character cap are appended."
trigger_phrases:
  - "query expansion context size"
  - "combinedQuery character budget"
  - "embedding expansion synonym cap"
  - "bounded combined query helper"
  - "llama-cpp query overflow fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The query expansion pipeline built `combinedQuery` by appending up to eight synonym terms to the original query without any length check. When the combined text crossed the practical llama-cpp context budget, the worker truncated the tail after the fact, silently dropping lower-priority synonym signal and degrading retrieval quality. Packet 039 added worker-side tokenizer truncation as a fallback but did not address the consumer-side construction.

A `COMBINED_QUERY_CHAR_BUDGET` constant and a `buildBoundedCombinedQuery()` helper were added to `embedding-expansion.ts`. The helper preserves the original query verbatim, returns it unchanged when it already exceeds the cap. Otherwise it appends expansion terms in existing priority order until the next term would exceed the 6500-character limit. A targeted vitest suite covers the short, long-synonym and over-budget base-query cases. Build, targeted vitest, stage1 expansion regression and strict packet validation all passed.

### Added

- `COMBINED_QUERY_CHAR_BUDGET` constant (6500 characters) exported from `embedding-expansion.ts`
- `buildBoundedCombinedQuery()` helper that preserves base query verbatim and appends terms in priority order up to the cap
- `tests/embedding-expansion-bound.vitest.ts` covering short query, long-synonym and long-base-query cases (3 tests)

### Changed

- `combinedQuery` construction in `embedding-expansion.ts` replaced with a call to `buildBoundedCombinedQuery()` so all expansion paths enforce the character budget

### Fixed

- Unbounded `combinedQuery` construction that silently overflowed the llama-cpp embedding worker context and dropped low-priority tail expansion terms

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS, exit 0. `tsc --build && node scripts/finalize-dist.mjs` completed without errors. |
| `npx vitest run tests/embedding-expansion-bound.vitest.ts` | PASS, exit 0. 1 test file passed, 3 tests passed. |
| `npx vitest run tests/stage1-expansion.vitest.ts` | PASS, exit 0. Existing stage1 expansion regression passed with 1 test file and 13 tests. |
| `npx vitest run tests/stage1-candidate-gen.vitest.ts` | FAIL, exit 1. Vitest reports no test files found for this filter. The file `tests/stage1-candidate-gen.vitest.ts` is absent from this checkout. The equivalent coverage is provided by `tests/stage1-expansion.vitest.ts` which imports `stage1-candidate-gen.ts`. |
| `validate.sh --strict` | PASS, exit 0. RESULT PASSED with 0 errors and 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts` | Modified | Added `COMBINED_QUERY_CHAR_BUDGET` constant and `buildBoundedCombinedQuery()` helper. Replaced unbounded `combinedQuery` construction with the bounded helper. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedding-expansion-bound.vitest.ts` (NEW) | Created | Three targeted cases covering short query, long-synonym list and over-budget base query. |

### Follow-Ups

- The cap is character-based rather than tokenizer-based. This was chosen deliberately for simplicity and to keep the patch minimal. Future retrieval evaluation can replace the character proxy with provider tokenizer plumbing if degradation evidence appears.
- The `tests/stage1-candidate-gen.vitest.ts` filter referenced in the dispatch is absent from this checkout. The available regression `tests/stage1-expansion.vitest.ts` imports `stage1-candidate-gen.ts` and passed. The missing filename should be reconciled with the test suite when the stage1 test layout is next revised.
