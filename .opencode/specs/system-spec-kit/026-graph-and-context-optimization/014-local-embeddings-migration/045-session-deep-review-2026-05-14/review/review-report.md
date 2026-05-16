# Deep Review Report — Session 2026-05-14

**Verdict: CONDITIONAL** | P0: 0 | P1: 5 | P2: 16 | hasAdvisories: true

## 1. Executive Summary

A deep review of 9 commits shipped on 2026-05-14, with primary focus on Bug A (embedding error propagation in 038), Bug B (token-aware llama-cpp truncation in 039), and the system-code-graph tsconfig restructure (009). The review covered 10 iterations across 4 dimensions (correctness, security, traceability, maintainability).

**Verdict: CONDITIONAL** — 5 P1 findings require remediation before the changes can be fully trusted in production. No P0 blockers were found. The error propagation contract (Bug A) is correctly implemented across 3 of 4 caller wrappers, with 2 gaps (reconsolidation-bridge passthrough, stage1 error context loss). The token-aware truncation (Bug B) is functionally correct with minor edge cases. The tsconfig restructure (009) has a cross-skill emit dependency that should be documented.

## 2. Planning Trigger

The CONDITIONAL verdict routes to remediation planning. The 5 P1 findings should be addressed before the next release cycle:
- F001: Add explicit try/catch around generateDocumentEmbedding in reconsolidation-bridge
- F002: Propagate error type to stage1 metadata for observability
- F005: Document node-llama-cpp Minimum version requirement
- F008: Document throw-circuit-breaker interaction; consider threshold adjustment
- F012: Add integration test for circuit breaker open→null under throw contract
- F014: Document or verify skill-advisor's independent compilation of shared code

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:Line | First/Last | Status |
|----|-----|-------|-----------|-----------|------------|--------|
| F001 | P1 | Reconsolidation-bridge:643 passthrough lacks explicit try/catch | correctness | reconsolidation-bridge.ts:642-644 | 1/10 | active |
| F002 | P1 | Stage1 top-level catch swallows error context | correctness | stage1-candidate-gen.ts:541-557 | 1/10 | active |
| F005 | P1 | Tokenizer API runtime version gap not guarded beyond type check | correctness | llama-cpp.ts:358-360 | 2/10 | active |
| F008 | P1 | Circuit breaker threshold may be aggressive under throw contract | correctness | embeddings.ts:55,90-100 | 3/10 | active |
| F012 | P1 | Circuit breaker open→null path untested under throw contract | traceability | embeddings.vitest.ts:365-423 | 5/10 | active |
| F014 | P1 | Skill-advisor dist relies on shared emit path through code-graph | traceability | system-code-graph/tsconfig.json:32-38 | 6/10 | active |
| F003 | P2 | Batch-vs-single behavioral asymmetry undocumented | correctness | embeddings.ts:582-602 | 1/10 | active |
| F004 | P2 | batchErrorCount only logged when verbose=true | correctness | embeddings.ts:619-621 | 1/10 | active |
| F006 | P2 | Token budget doesn't account for prefix overhead | correctness | llama-cpp.ts:236,385-392 | 2/10 | active |
| F007 | P2 | Empty-string after truncation not explicitly guarded | correctness | llama-cpp.ts:362-365 | 2/10 | active |
| F009 | P2 | Test utility resetForTesting() could reset production state | correctness | embeddings.ts:945-963 | 3/10 | active |
| F010 | P2 | Thrown error messages propagate to logs without sanitization | security | embeddings.ts:505-508 | 4/10 | active |
| F013 | P2 | Token budget tests use charTokenize mock | traceability | llama-cpp-token-budget.vitest.ts:23-25 | 5/10 | active |
| F015 | P2 | No integration test for tsconfig emit shape change | traceability | system-code-graph/tsconfig.json | 6/10 | active |
| F016 | P2 | pending vs retry failure_reason not cleared by SQL reset | traceability | retry-manager.ts | 7/10 | active |
| F017 | P2 | Pre-renumber path references may remain in docs | traceability | specs/ | 7/10 | active |
| F018 | P2 | Inconsistent error message prefixes | maintainability | embeddings.ts:507,673,727 | 8/10 | active |
| F019 | P2 | Test singletons persist across suites | maintainability | llama-cpp.ts:79-80 | 8/10 | active |
| F020 | P2 | Log level inconsistency batch/error vs per-item/warn | maintainability | embeddings.ts:600 | 8/10 | active |
| F021 | P2 | trainContextSize fallback 2048 undocumented magic number | maintainability | llama-cpp.ts:229 | 9/10 | active |

## 4. Remediation Workstreams

### Workstream A: Error Propagation Contract Hardening (P1)
- **F001**: Wrap `embeddings.generateDocumentEmbedding` call in reconsolidation-bridge:642-644 with try/catch returning null on failure
- **F002**: Add error type/context to stage1 metadata on catch for observability

### Workstream B: Token Budget & Circuit Breaker Documentation (P1)
- **F005**: Add JSDoc documenting node-llama-cpp v3.17.1 minimum version for `tokenize`/`detokenize`
- **F008**: Document throw-circuit-breaker interaction; add comment at `EMBEDDING_CB_THRESHOLD`
- **F012**: Add test: 3 consecutive throws → circuit opens → next call returns null

### Workstream C: Cross-Skill Integration Documentation (P1)
- **F014**: Document or verify skill-advisor's independent compilation of shared code; add build verification

### Workstream D: P2 Advisory Cleanup (16 items)
- Address F003-F021 as time permits; all are documentation, test, or minor code improvements

## 5. Spec Seed

No spec updates required. The P1 findings map to existing spec folders 038 and 039.

## 6. Plan Seed

1. Add try/catch wrapper in reconsolidation-bridge.ts:642-644 (5 min)
2. Add error context propagation to stage1-candidate-gen.ts:543-557 (15 min)
3. Document node-llama-cpp version requirement in llama-cpp.ts (5 min)
4. Add circuit breaker integration test (30 min)
5. Verify skill-advisor build independence and add comment (15 min)

## 7. Traceability Status

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | partial | hard | Throw contract matches spec; reconsolidation-bridge gap identified |
| checklist_evidence | partial | hard | T029/T030 tests exist but circuit breaker integration is untested |
| feature_catalog_code | not_applicable | advisory | N/A for this review target |

## 8. Deferred Items

- F011 (security, disproved): detokenize injection impossibility confirmed
- F006 (token prefix overhead): 10% margin sufficient for current models
- F007 (empty-string after truncation): practically impossible with 10% margin
- F017 (pre-renumber docs): cosmetic; git history preserves old paths

## 9. Audit Appendix

### Convergence Evidence
- Iterations: 10
- Dimensions covered: 4/4 (100%)
- New findings ratio trend: 0.55 → 0.42 → 0.37 → 0.18 → 0.35 → 0.55 → 0.18 → 0.16 → 0.10 → 0.05
- Rolling average (last 2): 0.075 < 0.08 threshold
- Stop reason: converged (all dimensions covered, rolling average below threshold)

### File Coverage Matrix
| File | Iterations Reviewed | Dimensions |
|------|-------------------|------------|
| shared/embeddings.ts | 1,3,4,8,10 | correctness, security, maintainability |
| shared/embeddings/providers/llama-cpp.ts | 2,4,9,10 | correctness, security, maintainability |
| mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | 1,4,10 | correctness |
| mcp_server/handlers/save/reconsolidation-bridge.ts | 1,10 | correctness |
| mcp_server/handlers/eval-reporting.ts | 1 | correctness |
| scripts/evals/run-ablation.ts | 1 | correctness |
| mcp_server/tests/embeddings.vitest.ts | 5 | traceability |
| mcp_server/tests/llama-cpp-token-budget.vitest.ts | 5 | traceability |
| mcp_server/tests/retry-manager.vitest.ts | 5 | traceability |
| system-code-graph/tsconfig.json | 6 | traceability |

### Dimension Breakdown
| Dimension | Iterations | Findings |
|-----------|-----------|----------|
| Correctness | 1,2,3 | F001-F009 |
| Security | 4 | F010-F011 |
| Traceability | 5,6,7 | F012-F017 |
| Maintainability | 8,9 | F018-F021 |