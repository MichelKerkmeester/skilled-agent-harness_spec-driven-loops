# Deep Review Dashboard

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-5-1780595350529-5jk4vx` |
| State | complete |
| Provisional Verdict | CONDITIONAL |
| hasAdvisories | true |

## Findings Summary

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |

## Progress Table

| Iteration | Focus | newFindingsRatio | Findings | Status |
|---:|---|---:|---:|---|
| 0 | init | 0 | 0 | complete |
| 1 | correctness | 1.00 | 2 | complete |
| 2 | security | 0.45 | 1 | complete |
| 3 | traceability | 0.31 | 1 | complete |
| 4 | maintainability | 0.06 | 1 | complete |
| 5 | stabilization | 0.00 | 0 | complete |

Stop reason: converged. Final report: `review-report.md`.

## Coverage

| Area | Covered |
|---|---|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |
| spec_code | yes |
| checklist_evidence | skipped-pass |

## Trend

Ratios: 1.00 -> 0.45 -> 0.31 -> 0.06 -> 0.00.

## Active Risks

- Code Graph unavailable; graphless fallback evidence is required.
- No checklist exists in the slice packet, so checklist evidence is skipped with explicit rationale.
- Active P1: F001 contradictory comment/TODO rule and checker gap.
- Active P1: F003 whole-line allowed-token bypass in comment-hygiene checker.
- Active P1: F004 sk-doc template rules drift from packaging-required references section.
- Active P2: F005 stale sk-doc frontmatter link.
