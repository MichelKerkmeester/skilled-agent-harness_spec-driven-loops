# Deep Review Dashboard - codex-3

## Status

| Field | Value |
|---|---|
| Verdict | CONDITIONAL |
| Stop Reason | converged |
| Release Readiness | converged |
| hasAdvisories | false |
| Iterations | 5 |

## Findings Summary

| Severity | Active | Delta |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 0 | 0 |

## Progress Table

| Run | Focus | New P0 | New P1 | New P2 | Ratio | Status |
|---:|---|---:|---:|---:|---:|---|
| 1 | correctness | 0 | 1 | 0 | 1.000 | complete |
| 2 | security | 0 | 0 | 0 | 0.000 | complete |
| 3 | traceability | 0 | 1 | 0 | 0.500 | complete |
| 4 | maintainability | 0 | 0 | 0 | 0.000 | complete |
| 5 | stabilization | 0 | 0 | 0 | 0.000 | complete |

## Coverage

| Area | Status |
|---|---|
| correctness | covered |
| security | covered |
| traceability | covered |
| maintainability | covered |
| stabilization | covered |
| `spec_code` | partial |
| `checklist_evidence` | pass/skipped |
| `feature_catalog_code` | partial |
| `playbook_capability` | pass/skipped |

## Trend

Last three `newFindingsRatio` values: 0.500 -> 0.000 -> 0.000. Trend: descending then flat.

## Active Risks

- F001: parent machine metadata includes placeholder `000-release-cleanup`.
- F002: child descriptions retain stale renumbering metadata and old `009` trigger phrases.
- Code Graph was unavailable; graphless fallback used direct file reads.
