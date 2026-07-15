# Deep Review Dashboard

Session: fanout-codex-4-1780596001496-dj6z7c
Verdict: CONDITIONAL
Stop reason: maxIterationsReached
Open findings: P0=0, P1=5, P2=1
Dimension coverage: correctness, security, traceability, maintainability

## Iterations

### Iteration 1 - Correctness: fanout execution and lineage loop bounds
- Dimensions: correctness
- New findings: F001, F002
- Active summary: P0=0, P1=2, P2=0
- Convergence signals: rollingAvg=0.62, madScore=0.28, dimensionCoverage=0.25, compositeStop=0.18

### Iteration 2 - Security: sandbox defaults and artifact write boundary
- Dimensions: security
- New findings: F003
- Active summary: P0=0, P1=3, P2=0
- Convergence signals: rollingAvg=0.49, madScore=0.23, dimensionCoverage=0.5, compositeStop=0.24

### Iteration 3 - Traceability: skill-advisor MCP descriptors versus handler schemas
- Dimensions: traceability
- New findings: F004
- Active summary: P0=0, P1=4, P2=0
- Convergence signals: rollingAvg=0.38, madScore=0.19, dimensionCoverage=0.75, compositeStop=0.31

### Iteration 4 - Traceability: review graphEvents to convergence graph semantics
- Dimensions: traceability
- New findings: F005
- Active summary: P0=0, P1=5, P2=0
- Convergence signals: rollingAvg=0.29, madScore=0.13, dimensionCoverage=0.75, compositeStop=0.37

### Iteration 5 - Maintainability: target map and code-graph degradation review
- Dimensions: maintainability
- New findings: F006
- Active summary: P0=0, P1=5, P2=1
- Convergence signals: rollingAvg=0.21, madScore=0.1, dimensionCoverage=1, compositeStop=0.43

### Iteration 6 - Stabilization replay: cross-findings dedupe and severity check
- Dimensions: correctness, security, traceability, maintainability
- New findings: none
- Active summary: P0=0, P1=5, P2=1
- Convergence signals: rollingAvg=0.12, madScore=0.06, dimensionCoverage=1, compositeStop=0.49

### Iteration 7 - Final stabilization: legal-stop audit and synthesis readiness
- Dimensions: correctness, security, traceability, maintainability
- New findings: none
- Active summary: P0=0, P1=5, P2=1
- Convergence signals: rollingAvg=0.07, madScore=0.03, dimensionCoverage=1, compositeStop=0.55

## Gates

- dimensionCoverageGate: pass
- p0ResolutionGate: pass
- evidenceDensityGate: pass
- graphlessFallbackGate: pass with rg/direct-read fallback
- convergenceGate: blocked for PASS by active P1 findings
- claimAdjudicationGate: blocked for PASS by active P1 findings
