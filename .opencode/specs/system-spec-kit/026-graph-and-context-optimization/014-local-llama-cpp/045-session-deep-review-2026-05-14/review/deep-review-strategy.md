# Deep Review Strategy

## Topic
Deep review of source-level changes shipped 2026-05-14: Bug A (embedding error propagation in 038), Bug B (token-aware llama-cpp truncation in 039), tsconfig restructure (009), and ancillary docs/SQL commits.

## Review Dimensions
- [ ] D1: Correctness — throw vs null contract, tokenizer API, error propagation
- [ ] D2: Security — no secrets exposure, no injection vectors introduced
- [ ] D3: Traceability — spec/code alignment, test coverage, cross-reference integrity
- [ ] D4: Maintainability — patterns, documentation, dead code, naming

## Completed Dimensions
(none yet)

## Running Findings
P0: 0 | P1: 0 | P2: 0

## What Worked
(none yet)

## What Failed
(none yet)

## Exhausted Approaches
(none yet)

## Ruled-Out Directions
(none yet)

## Next Focus
D1: Correctness — Focus on the throw vs null contract change in embeddings.ts, verifying all 7+ callers handle the new throws correctly, and that reconsolidation-bridge:643 passthrough is safe.

## Known Context
Bug A (commit 534563fb2): Changed 3 catch blocks in embeddings.ts from `return null` to `throw error`. Added wrappers in 4 callers. Left reconsolidation-bridge:643 as-is. Bug B (commit daf63f895): Extended llama-cpp provider with token budget aware truncation. Tsconfig (commit 8154fd0da): Dropped project-references from system-code-graph tsconfig.

## Cross-Reference Status
| Protocol | Type | Status |
|----------|------|--------|
| spec_code | core | pending |
| checklist_evidence | core | pending |
| feature_catalog_code | overlay | pending |

## Files Under Review
| File | Status | Dimensions |
|------|--------|------------|
| shared/embeddings.ts | pending | correctness, security |
| shared/embeddings/providers/llama-cpp.ts | pending | correctness, security |
| mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | pending | correctness |
| mcp_server/handlers/eval-reporting.ts | pending | correctness |
| scripts/evals/run-ablation.ts | pending | correctness |
| mcp_server/handlers/save/reconsolidation-bridge.ts | pending | correctness |
| system-code-graph/tsconfig.json | pending | traceability, maintainability |
| mcp_server/tests/embeddings.vitest.ts | pending | traceability |
| mcp_server/tests/llama-cpp-token-budget.vitest.ts | pending | traceability |
| mcp_server/tests/retry-manager.vitest.ts | pending | traceability |

## Review Boundaries
- Max iterations: 10
- Convergence threshold: 0.10
- Stuck threshold: 2
- Severity threshold: P2