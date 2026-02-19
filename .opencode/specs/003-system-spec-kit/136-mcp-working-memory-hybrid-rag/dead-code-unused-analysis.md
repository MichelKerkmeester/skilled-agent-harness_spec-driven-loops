# Dead Code and Unused Analysis

<!-- ANCHOR: summary -->
## Summary

This document captures dead code and unused symbol findings from the current review of the MCP working-memory hybrid RAG implementation.
<!-- /ANCHOR: summary -->

<!-- ANCHOR: context -->
## Scope and Method

- Scope: `.opencode/skill/system-spec-kit/scripts/` and `.opencode/skill/system-spec-kit/mcp_server/`
- Method: static review analysis with line-level evidence
- Confidence: proven findings are direct code facts, suspected findings need targeted follow-up
<!-- /ANCHOR: context -->

<!-- ANCHOR: artifacts -->
## Proven Findings

| Finding | Evidence | Why it matters |
|---|---|---|
| Unreachable FAIL path in `chk113` | Set at `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:299`, compared at `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:420` | `totalRequests` is set from a constant and compared to that same constant, so the FAIL path cannot execute. |
| `chk114` hardcoded PASS | `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:421` | This check always reports PASS and cannot fail, so it does not verify runtime behavior. |
| Unused export `isMemoryAwareTool` | `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:159`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:177` | Exported API is not used by current call sites and adds maintenance noise. |
| Unused type `WorkflowState` | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:82` | Dead type declaration increases surface area without value. |
| Unused exported constant `DEFAULT_DENYLIST` | `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:6` (only local references around `:31` and `:56`) | Export appears unused outside the file and can likely be reduced to internal scope or removed. |

## Suspected Findings

- Compatibility aliases and test-only exports in config modules and snake_case handlers look intentionally retained.
- These items were not marked as proven dead code in this pass because they may still serve backward compatibility or test harness needs.
<!-- /ANCHOR: artifacts -->

<!-- ANCHOR: next-steps -->
## Next Steps

1. Replace hardcoded or unreachable benchmark checks with measurable conditions.
2. Remove or internalize unused exports and types after confirming no external consumers.
3. Keep compatibility aliases only where required and document each retained alias.
<!-- /ANCHOR: next-steps -->
