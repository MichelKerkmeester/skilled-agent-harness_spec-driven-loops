# Iteration 1: Correctness Dimension Review

**Date**: 2026-05-21  
**Iteration**: 1 of 10  
**Dimension**: correctness  
**Status**: complete  

## Dimension Focus

This iteration reviewed the correctness dimension for the spec-memory rerank decision arc (011) and its implementation across:
- Parent spec (011/spec.md) 
- 5 child packets (001-005)
- Implementation files (search-flags.ts, confidence-scoring.ts, scoring-opt-in.vitest.ts)
- Skill documentation (system-spec-kit/SKILL.md, system-rerank-sidecar/SKILL.md)

## Files Reviewed

1. `.opencode/skills/sk-code-review/references/review_core.md` - Review doctrine
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/spec.md` - Parent arc spec
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit/spec.md` - Phase 1 spec
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/spec.md` - Phase 2 spec
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/spec.md` - Phase 3 spec
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit/spec.md` - Phase 4 spec
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/spec.md` - Phase 5 spec (closure)
8. `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126` - Flag implementation
9. `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:27,256-262` - Scoring implementation
10. `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:1-108` - Opt-in test coverage
11. `.opencode/skills/system-spec-kit/SKILL.md:377-379` - Spec-kit documentation
12. `.opencode/skills/system-rerank-sidecar/SKILL.md:12,222` - Sidecar documentation

## Findings by Severity

### P1 - Required

#### P1-001: Test expectation mismatch for SPECKIT_CROSS_ENCODER default

- **File**: `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:75`
- **Evidence**: The test at line 75 expects `isCrossEncoderEnabled()` to return `true` by default with no environment variables set. However, per spec 005 REQ-001, the implementation correctly defaults to `false` (opt-in-only closure). The test comment at line 71 states "defaults all graduated gates on including reconsolidation", but this is incorrect for `isCrossEncoderEnabled()` which is no longer a graduated gate per the 011/005 decision.
- **Finding class**: instance-only
- **Scope proof**: The test file `search-flags.vitest.ts` contains this single assertion about the default state; grep confirms no other tests assert this default behavior.
- **Affected surface hints**: ["search-flags test suite", "SPECKIT_CROSS_ENCODER default behavior"]
- **Recommendation**: Update the test expectation at line 75 to expect `false` instead of `true`, and update the test comment at line 71 to exclude `isCrossEncoderEnabled()` from the "graduated gates on" list, or split it into a separate test case that explicitly tests the new default-off behavior.

### P2 - Suggestions

#### P2-001: Documentation inconsistency in isCrossEncoderEnabled() semantics

- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-109`
- **Evidence**: The `isCrossEncoderEnabled()` function checks four opt-in signals (SPECKIT_CROSS_ENCODER, VOYAGE_API_KEY, COHERE_API_KEY, RERANKER_LOCAL), making it semantically identical to `isRerankerExpected()`. However, the docstring at line 99-101 describes it as "Cross-encoder reranking gate" without clarifying that it also detects cloud provider configuration. The spec 005 REQ-001 focuses on flipping the SPECKIT_CROSS_ENCODER default, but the implementation allows cloud API keys to also enable the feature.
- **Finding class**: instance-only
- **Scope proof**: Grep confirms these are the only two functions with this specific opt-in detection logic.
- **Affected surface hints**: ["search-flags semantics", "cross-encoder enablement logic"]
- **Recommendation**: Consider whether `isCrossEncoderEnabled()` should only check SPECKIT_CROSS_ENCODER (strict flag semantics) while cloud API key detection remains in provider resolution logic (cross-encoder.ts:220-227). If the current behavior is intentional, update the docstring to clarify that cloud API keys also enable cross-encoder reranking.

## Traceability Checks

### Core Traceability (spec_code)

- **001-off-baseline-audit**: Implementation status matches spec (Complete with OFF_DEFICIENT verdict). Evidence file exists at `001-off-baseline-audit/evidence/off-baseline-2026-05-21.json`.
- **002-bge-v2-m3-trial**: Correctly marked superseded by 011/005 in spec frontmatter.
- **003-domain-tuned-finetune**: Correctly marked superseded by 011/005 in spec frontmatter.
- **004-retrieval-and-fixture-audit**: Correctly marked superseded by 011/005 in spec frontmatter.
- **005-opt-in-only-closure**: Implementation matches spec requirements (SPECKIT_CROSS_ENCODER default false, isRerankerExpected() helper, conditional penalty, test coverage, doc updates).

### Overlay Traceability (skill_agent)

- **system-spec-kit/SKILL.md**: Lines 377-379 document the opt-in reranking behavior correctly: "Cross-encoder reranking is opt-in. Default is OFF based on the 011 decision arc."
- **system-rerank-sidecar/SKILL.md**: Lines 12 and 222 correctly note that spec-memory consumption is "opt-in only via SPECKIT_CROSS_ENCODER=true or RERANKER_LOCAL=true."

### Checklist Evidence

Spec 005 requirements verification:
- REQ-001 (SPECKIT_CROSS_ENCODER default false): ✅ Implemented at search-flags.ts:103-109
- REQ-002 (isRerankerExpected() helper): ✅ Implemented at search-flags.ts:120-126
- REQ-003 (conditional WEIGHT_RERANKER penalty): ✅ Implemented at confidence-scoring.ts:256
- REQ-004 (vitest coverage): ✅ Test file exists at scoring-opt-in.vitest.ts with 3 test cases
- REQ-005 (doc updates): ✅ Both skill docs updated with opt-in language
- REQ-006 (supersede sweep): ✅ All 7 sibling packets marked superseded in frontmatter
- REQ-007 (arc parent updates): ✅ 011/spec.md phase-map updated
- REQ-008 (strict-validate): Not verified in this review (requires execution)

## Verdict

**CONDITIONAL** - The implementation correctly realizes the spec 005 requirements for opt-in-only closure, but one P1 test expectation mismatch must be fixed before the change can be considered complete. The test suite asserts the old default-on behavior which contradicts the new default-off implementation.

## SCOPE VIOLATIONS

**Delta file creation blocked**: The review attempted to create the delta file at `review/deltas/iter-001.jsonl` but could not create the `deltas/` directory due to permission restrictions. The iteration narrative and state log append were successful. Findings are documented in this iteration narrative and the state log JSONL record.

## Next Dimension

The next iteration should review the **security** dimension, focusing on:
- Whether the conditional penalty logic in confidence-scoring.ts could be exploited
- Sidecar security boundaries given the opt-in changes
- Any security implications of the superseded packet cleanup

