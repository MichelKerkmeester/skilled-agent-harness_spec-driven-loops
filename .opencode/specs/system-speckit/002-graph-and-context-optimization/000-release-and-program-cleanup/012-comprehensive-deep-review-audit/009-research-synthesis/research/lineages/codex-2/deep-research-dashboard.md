# Deep Research Dashboard

## Status

- Lineage: `codex-2`
- Session: `fanout-codex-2-1780597406873-hzqkj0`
- Mode: `research`
- Status: `complete`
- Stop reason: `converged`
- Iterations: 5
- Key questions answered: 5 of 5

## Iteration Metrics

| Iteration | Focus | New Info Ratio | Status |
|---|---|---:|---|
| 001 | Doc/schema-to-code drift | 1.00 | insight |
| 002 | Metadata drift systemic-ness | 0.72 | insight |
| 003 | Memory-correctness impact | 0.50 | insight |
| 004 | Security severity calibration | 0.32 | insight |
| 005 | Deep-loop fan-out blast radius | 0.08 | converged |

## Findings Summary

| ID | Severity | Status | Summary |
|---|---|---|---|
| R001 | P1 | active | Tool contracts drift across docs, schemas, handlers, and helpers. |
| R002 | P1 | active | Governed bulk metadata is validated and then dropped before indexing. |
| R003 | P1 | active | Metadata drift is systemic across 026, 027, and audit-control packets. |
| R004 | P1 | active | Memory correctness splits into stale routing and DB/file divergence risks. |
| R005 | P1-local-P0-shared | active | Security severity depends on whether governance scopes are trust boundaries. |
| R006 | P1 | active | Fan-out can count non-zero subprocess exits as fulfilled lineages. |
| R007 | P2 | corrected | Current CLI fan-out is concurrency-capped, not serial. |

## Convergence

Converged because each charter question has a direct source-backed answer, the last iteration produced only calibration/correction rather than a new root-cause family, and no remaining unknown requires a write outside this lineage artifact directory.
