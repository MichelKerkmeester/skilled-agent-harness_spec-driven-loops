# Iteration 4: Traceability - Schema and Spec Alignment

## Focus

Dimension: traceability.

Files reviewed:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.04

## Findings

### P2, Suggestion

- **F004**: `memory_causal_stats` has public/runtime contract drift around backfill. The public MCP schema advertises `memory_causal_stats` as a statistics-only tool with an empty input schema [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:457`]. The runtime input schema accepts a `backfill` object and documents that `{ dryRun: false }` commits bounded inferred edges [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:414`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:420`]. The handler then runs `backfillRelationInference` before computing stats [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:822`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:827`]. This is lower severity because public clients cannot discover the argument from `tool-schemas.ts`, but it is traceability drift: one contract says read-only/no args, another accepts a write-capable option.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:36` | Security findings F002 and F003 contradict expected safe retrieval/causal behavior. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:17` | Level 1 slice has no checklist.md; there are no checked items to verify. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:95` | Feature catalog labels exist, but scoped fallback behavior violates governed retrieval expectations. |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454` | Public causal stats schema does not describe runtime backfill capability. |

## Assessment

- New findings ratio: 0.04
- Dimensions addressed: traceability
- Novelty justification: found one advisory public/runtime contract drift and completed hard traceability protocol coverage.

## Ruled Out

- Checklist failure: no `checklist.md` exists for this Level 1 slice, so there are no checked completion claims to falsify.

## Dead Ends

- Resource-map coverage gate: `resource-map.md` is absent by init observation, so this gate is skipped.

## Recommended Next Focus

Maintainability pass over fixes and response contracts; then stabilization replay.

Review verdict: PASS
