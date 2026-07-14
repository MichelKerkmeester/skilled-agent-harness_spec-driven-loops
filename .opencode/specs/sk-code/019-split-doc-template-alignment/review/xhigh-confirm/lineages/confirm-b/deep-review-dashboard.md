# Deep Review Dashboard: confirm-b

## Status

- Verdict: **FAIL**
- Review state: complete at 4/4 iterations
- Release-readiness state: converged review, failed hard evidence gate
- Stop reason: `maxIterationsReached`
- `hasAdvisories`: true

## Findings Summary

| Severity | Active | New in latest |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 2 | 0 |

Active: F002 (required), F001 and F003 (advisory).

## Dimension Coverage

| Dimension | Covered | Iteration | Outcome |
|---|---|---:|---|
| Correctness | yes | 1 | PASS with F001 advisory |
| Security | yes | 2 | PASS |
| Traceability | yes | 3 | FAIL: F002 hard protocol |
| Maintainability | yes | 4 | CONDITIONAL stabilization |

## Progress

| Run | Focus | Ratio | P0/P1/P2 | Status |
|---:|---|---:|---|---|
| 1 | correctness | 1.0000 | 0/0/1 | complete |
| 2 | security | 0.0000 | 0/0/1 | complete |
| 3 | traceability | 0.8571 | 0/1/2 | insight |
| 4 | maintainability/stabilization | 0.0000 | 0/1/2 | complete |

## Gate Status

| Gate | Result |
|---|---|
| Evidence density | pass |
| Scope | pass |
| Dimension coverage | pass |
| P0 resolution | pass |
| Claim adjudication | pass |
| `spec_code` | partial |
| `checklist_evidence` | **fail** |

## Next Focus

1. Resolve F002 by attaching auditable evidence to 25 completed rows and obtaining strict exit 0.
2. Optionally close F001 intro polish and F003 continuity wording.
3. Re-run a focused confirmation lineage after the packet evidence changes.

## Runtime Notes

- Memory trigger retrieval timed out; file evidence was used.
- Graphless fallback was used to preserve the detached write boundary.
- No source resource map existed at initialization.
