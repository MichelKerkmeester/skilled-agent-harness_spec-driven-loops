# Deep Review Strategy — p017c003-mimo

## Files Under Review

| File | Role | Lines |
|------|------|-------|
| `mcp_server/lib/search/query-classifier.ts` | Core: generic-query escalation logic | 293 |
| `mcp_server/lib/search/query-expander.ts` | Synonym expansion for recovery suggestions | 106 |
| `mcp_server/lib/search/recovery-payload.ts` | Weak-result recovery payload builder | 388 |
| `mcp_server/tests/generic-query-deep-routing.vitest.ts` | Contract tests for escalation + recovery | 129 |

## Cross-Reference Status

### Core
- `query-classifier.ts` exports `classifyQueryComplexity`, `isLowSignalShortQuery` (unexported), `LOW_SIGNAL_STOPWORD_RATIO`
- `recovery-payload.ts` imports `expandQuery` from `query-expander.ts`
- `recovery-payload.ts` imports `routeQueryConcepts` from `entity-linker.ts`, `isGraphFallbackEnabled` from `search-flags.ts`
- Test file imports `classifyQueryComplexity` and `buildRecoveryPayload`

### Overlay
- `query-plan.ts` — consumed via `buildComplexityQueryPlan` (not modified)
- `hyde.ts` — intentionally untouched per spec

## Known Context
- Feature flag: `SPECKIT_COMPLEXITY_ROUTER` (default ON)
- Feature flag: `SPECKIT_EMPTY_RESULT_RECOVERY_V1` (default ON)
- Feature flag: `SPECKIT_GRAPH_FALLBACK` (default ON)
- `LOW_SIGNAL_STOPWORD_RATIO = 0.5` — heuristic, not tuned
- Escalation adds no LLM calls; channels are local

## Review Boundaries
- Observation-only: no code changes
- Scope: the 4 files listed above
- Pre-existing failures (token-budget-enforcement, reconsolidation, dist-freshness) are out of scope
