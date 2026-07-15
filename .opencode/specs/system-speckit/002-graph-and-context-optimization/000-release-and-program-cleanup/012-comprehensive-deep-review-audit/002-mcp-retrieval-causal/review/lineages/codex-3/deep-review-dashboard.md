# Deep Review Dashboard

## Status

Provisional verdict: CONDITIONAL  
hasAdvisories: true  
stopReason: converged

## Findings Summary

P0: 0 | P1: 3 | P2: 1

## Progress Table

| Iteration | Focus | New Findings Ratio | Findings | Status |
| --- | --- | ---: | --- | --- |
| init | setup | 0.00 | P0:0 P1:0 P2:0 | initialized |
| 001 | correctness | 1.00 | F001, F003 | insight |
| 002 | security | 0.33 | F002 | insight |
| 003 | traceability | 0.06 | F004 | insight |
| 004 | maintainability | 0.00 | none | thought |
| 005 | stabilization | 0.00 | none | thought |

## Coverage

Dimensions covered: 4/4  
Traceability protocols covered: 4/4  
Files reviewed: 5/5

## Trend

Finding yield dropped from 1.00 to 0.33 to 0.06, then stabilized at 0.00 for two passes.

## Active Risks

- F001: omitted `memory_context.sessionId` calls share a process-wide fallback session despite ephemeral metadata.
- F002: `memory_search` uses raw caller session IDs for dedup and session-state mutation.
- F003: scoped trigger matching can miss valid scoped matches after global limiting.
- F004: causal-stats backfill is implemented in the handler but blocked by the public schema.

## Gates

| Gate | Status | Notes |
| --- | --- | --- |
| dimensionCoverageGate | pass | correctness, security, traceability, maintainability covered |
| p0ResolutionGate | pass | no P0 findings active |
| claimAdjudicationGate | pass | all active P1 findings have adjudication packets |
| evidenceDensityGate | pass | findings have direct source citations |
| graphlessFallbackGate | pass | Code Graph unavailable; direct line evidence used |
