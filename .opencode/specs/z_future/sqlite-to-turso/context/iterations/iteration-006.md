# Iteration 6: Slice 6: system-code-graph DB layer

## Focus
Slice 6: system-code-graph DB layer (6 slice files, shared across all seats)

## Per-Seat Contribution
Succeeded: mimo-b, mimo-c | Failed: mimo-a

## Merged Findings (relevance-gated at 0.55)
Kept 24 units (7 marginal in [0.40,0.55)); 1 agreement-eligible (>=2 seats), 1 new this iteration.

### Agreement-eligible units
- [2x] `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` :: `queryStartupHighlights` (dependency, rel 0.6) — CTE with ROW_NUMBER() window function in SELECT. Turso supports CTEs and window functions but this is read-only — lower migration risk.

## Coverage
sliceCoverage 0.667 · agreementRate 0.042 · relevanceFloor 0.6 · reuseCatalogCoverage 0.5
