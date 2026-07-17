# Deep Review Dashboard

## Status
- Iterations: 10/10
- Stop reason: maxIterationsReached
- Provisional verdict: CONDITIONAL
- Active findings: P0=0, P1=3, P2=1

## Coverage
All four dimensions and both core traceability protocols were exercised. `spec_code` and `checklist_evidence` remain partial because active P1 findings contradict shipped claims.

## Trend
Ratios: 1.0, 0.0, 0.5, 0.1429, 0.4167, 0.0, 0.0, 0.0, 0.0, 0.0. Convergence became telemetry-only under `stopPolicy=max-iterations`; stabilization continued through iteration 10.

## Active Risks
- Reviewer fixtures/profiles cannot follow the documented validator path.
- A shipped profile resolves the wrong fixture directory.
- Completion evidence overstates consumer-pointer coverage.
