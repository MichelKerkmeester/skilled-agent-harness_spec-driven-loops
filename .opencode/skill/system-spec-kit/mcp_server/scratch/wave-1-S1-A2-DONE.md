# Agent S1-A2: Edge Density Measurement — DONE

Sprint 1 T003 | Wave 1

## Files Created

| File | Purpose |
|------|---------|
| `lib/eval/edge-density.ts` | Core module: EdgeDensityResult type, measureEdgeDensity(), formatDensityReport() |
| `tests/t011-edge-density.vitest.ts` | 37 acceptance tests covering all 5 required test cases |
| `scratch/wave-1-S1-A2-DONE.md` | This file |

## Test Results

```
37 tests passed (0 failed)
TypeScript type check: CLEAN (no errors)
```

All tests ran against vitest with better-sqlite3 in-memory database.

## Implementation Decisions

### SQL approach
Used the UNION-based node count query:
```sql
SELECT COUNT(*) FROM (
  SELECT source_id AS node_id FROM causal_edges
  UNION
  SELECT target_id AS node_id FROM causal_edges
)
```
This correctly counts unique participating nodes (union of source_id and target_id) rather than total memory_index rows, matching the spec requirement.

### Density = 0 is the only true "sparse" state
Graph theory finding: with this density formula (edges / participating nodes), the minimum achievable density when at least one edge exists is 0.5 (one edge with two distinct endpoints). The "density < 0.5" condition from the spec therefore maps to the zero-edge (empty) graph. Tests were updated to reflect this mathematical constraint. The boundary value 0.5 classifies as "moderate" (>= 0.5 threshold).

### R10 escalation trigger
Triggered when density < 0.5 (i.e., density = 0 with the current data model). The recommendation includes:
- Current density value and gap to 0.5 target
- Sprint timeline: schedule before Sprint 3 graph-channel work
- R4 typed-degree impact: signals degrade to uniform (degree=0) until R10 completes

### Classification boundaries
- `dense`: density >= 1.0
- `moderate`: 0.5 <= density < 1.0
- `sparse`: density < 0.5 (triggers R10 escalation)

Boundary 0.5 = moderate, boundary 1.0 = dense (inclusive lower bounds).

## Acceptance Criteria Status

- [x] Density ratio computed correctly (SQL verified, 37 tests)
- [x] If density < 0.5, R10 escalation documented with timeline recommendation
- [x] Function returns structured result with all metrics (edgeCount, nodeCount, totalMemories, density, classification, r10Escalation, r10Recommendation)
