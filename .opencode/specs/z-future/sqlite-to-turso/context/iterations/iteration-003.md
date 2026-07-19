# Iteration 3: Slice 3: causal graph + recursive CTE layer

## Focus
Slice 3: causal graph + recursive CTE layer (5 slice files, shared across all seats)

## Per-Seat Contribution
Succeeded: mimo-a, mimo-b, mimo-c | Failed: none

## Merged Findings (relevance-gated at 0.55)
Kept 24 units (14 marginal); 1 agreement-eligible, 1 new this iteration.

### Agreement-eligible units
- [2x] `.opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts` :: `sqlite_master` (gap, rel 0.8) — Direct sqlite_master query for table/index existence checks. Turso may expose schema differently; verify sqlite_master availability or substitute with PRAGMA-based detection.

## Coverage
sliceCoverage 1 · agreementRate 0.042 · relevanceFloor 0.6
