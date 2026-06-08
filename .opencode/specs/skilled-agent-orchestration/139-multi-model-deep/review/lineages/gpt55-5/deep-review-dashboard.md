# Deep Review Dashboard - gpt55-5

## Status

| Field | Value |
|-------|-------|
| Verdict | FAIL |
| Stop reason | maxIterationsReached |
| Release readiness | release-blocking |
| hasAdvisories | true |
| Iterations | 1 / 1 |

## Findings Summary

| Severity | Active | New This Iteration |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 3 | 3 |
| P2 | 1 | 1 |

## Dimension Coverage

| Dimension | Covered | Notes |
|-----------|---------|-------|
| correctness | yes | F001, F002 |
| security | yes | F004 |
| traceability | yes | F003; hard protocols partial |
| maintainability | yes | Documentation and invariant clarity reviewed |

## Progress

| Iteration | Focus | Ratio | Status | Verdict |
|-----------|-------|-------|--------|---------|
| 001 | correctness+security+traceability+maintainability | 1.00 | complete | CONDITIONAL |

## Next Focus

Fix F001/F002 before release-readiness claims, then replace packet scaffold docs to satisfy the hard traceability gate.

## Active Risks

- `coverage` gate failed because `spec_code` and `checklist_evidence` are partial.
- Code graph was stale; findings rely on direct fallback evidence.
- CLI executor was recorded but not spawned due OpenCode self-invocation guard.
