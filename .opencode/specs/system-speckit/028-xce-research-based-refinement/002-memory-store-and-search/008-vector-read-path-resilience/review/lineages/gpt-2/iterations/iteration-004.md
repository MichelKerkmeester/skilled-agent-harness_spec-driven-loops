# Iteration 004: Maintainability

## Focus

Dimension: maintainability. Files reviewed: dimension-source code, KNN benchmark helper, and tests.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- None.

### P2, Suggestion

- **F002**: Dimension mismatch warning mislabels profile-derived dimensions as schema-derived. `StoredEmbeddingDimension.source` can be `active_embedder_profile` or `startup_profile` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:162-166], and the fallback path can return either source from profile data [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:236-253]. The mismatch warning maps every non-`vec_metadata` source to `vec_memories schema`, which makes active-profile or startup-profile mismatches misleading during recovery triage [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:305-307].

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `vector-index-queries.ts:132-238`, `vector-knn-query-shape-benchmark.vitest.ts:79-93` | Benchmark helper and adoption threshold match the plan. |

## Assessment

- New findings ratio: 1.00.
- Dimensions addressed: maintainability.
- Novelty justification: one advisory diagnostic issue.

## Ruled Out

- KNN query-shape adoption bug: `shouldAdoptMatchQueryShape` requires supported `MATCH` and improvement strictly greater than 20 percent [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:132-136], and the test covers the boundary [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/vector-knn-query-shape-benchmark.vitest.ts:79-93].

## Dead Ends

- No maintainability finding rose to P1 because the warning label does not change runtime behavior.

## Recommended Next Focus

Run stabilization replay on F001 and F002.
Review verdict: PASS
