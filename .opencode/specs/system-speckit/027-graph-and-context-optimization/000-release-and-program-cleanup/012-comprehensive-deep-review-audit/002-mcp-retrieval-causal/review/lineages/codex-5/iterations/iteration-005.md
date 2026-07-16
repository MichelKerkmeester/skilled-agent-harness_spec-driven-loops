# Iteration 5: Maintainability - Fix Shape and Regression Surface

## Focus

Dimension: maintainability.

Files reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings

### P0, Blocker

- **F002** remains active. Fix shape: pass governed scope into community search or post-filter `memberRows` with the same spec/tenant/user/agent predicate before appending.
- **F003** remains active. Fix shape: add governed scope parameters to causal tool schemas and enforce owner predicates for read, stats, link, and unlink operations.

### P1, Required

- **F001** remains active. Fix shape: validate causal edge endpoints against `memory_index` before insertion and make automatic reference resolution deterministic within the source memory's scope.

### P2, Suggestion

- **F004** remains active. Fix shape: align public and runtime schemas for `memory_causal_stats`, or move write-capable backfill behind an explicitly named mutation tool.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:36` | Active P0 findings keep the slice release-blocking. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:17` | No checklist exists for this Level 1 slice. |

## Assessment

- New findings ratio: 0.00
- Dimensions addressed: maintainability
- Novelty justification: no new findings; maintainability pass converted active issues into focused remediation lanes.

## Ruled Out

- Broad rewrite of retrieval stack: F002 can be fixed surgically at the fallback injection boundary.
- Broad rewrite of causal storage: F001 and F003 can be fixed at handler/schema boundaries while preserving storage test compatibility.

## Dead Ends

- Deferring all causal issues as mutation-path work: `memory_drift_why` and `memory_causal_stats` are read-path tools and still expose unscoped metadata.

## Recommended Next Focus

Stabilization replay for P0/P1 adjudication and stop-gate validation.

Review verdict: FAIL
