---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
trigger_phrases: []
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review (spec-folder)
- Started: 2026-09-15T12:32:10Z
- Status: COMPLETE (synthesized)
- Iteration: 5 of 5
- Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-wave2-deepseek-1789475514883-p58bmd
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached
- Release readiness: release-blocking
<!-- /ANCHOR:status -->

<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: hub-root version fields across three hubs and all seventeen mode packets (angle 11); leaf-manifest generation and the twelve invisible symlink leaves (angle 12); the compiled runtime's preamble enforcement and the improvement-lane leaf-set identity (angle 13); every executor/mode roster statement across three hubs, four artifact classes, six command YAMLs and two compiled contracts (angle 14); every catalog, README and playbook reference, count and cited path under the three hubs, ~1,100 documents scanned (angle 15)
- Pivot lineage: none yet
- Remaining frontier: synthesis complete; remediation routes through `/speckit:plan`
<!-- /ANCHOR:dimension-expansion -->

<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 1 |
| P1 (Required) | 11 |
| P2 (Suggestions) | 12 |
| Resolved | 0 |
- Delta this iteration: +0 P0, +6 P1, +6 P2
<!-- /ANCHOR:findings-summary -->

<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Angle 11 — version authority across routing artifacts | traceability, maintainability | 1.00 | 0/2/1 | complete |
| 2 | Angle 12 — leaf-manifest generation and doctrine reachability | traceability, maintainability | 1.00 | 0/2/0 | complete |
| 3 | Angle 13 — preamble and leaf-set policy contradictions | traceability, correctness | 1.00 | 0/1/1 | complete |
| 4 | Angle 14 — roster completeness for the seventh executor | traceability, maintainability | 1.00 | 1/0/4 | complete |
| 5 | Angle 15 — stale references in catalogs and READMEs | traceability, maintainability | 1.00 | 0/6/6 | complete |
<!-- /ANCHOR:progress -->

<!-- ANCHOR:coverage -->
## 5. COVERAGE

| Dimension | Status | Iterations |
|-----------|--------|------------|
| correctness | covered | 3 |
| security | unreached-by-design | — |
| traceability | covered | 1, 2, 3, 4, 5 |
| maintainability | covered | 1, 2, 3, 4, 5 |
<!-- /ANCHOR:coverage -->

<!-- ANCHOR:traceability -->
## 6. TRACEABILITY COVERAGE

| Protocol | Level | Status |
|----------|-------|--------|
| spec_code | core | partial |
| checklist_evidence | core | notApplicable |
| feature_catalog_code | overlay | partial |
| playbook_capability | overlay | partial |
<!-- /ANCHOR:traceability -->

<!-- ANCHOR:trend -->
## 7. TREND
- Ratios so far: [1.00, 1.00, 1.00, 1.00, 1.00]
- Rolling average: 1.00
- MAD noise floor: 0.00 across five samples
- Composite stop score: convergence never gates this lane (`stopPolicy: max-iterations`, `convergenceMode: off`)
- Trajectory: five angles, one P0, eleven P1 and twelve P2 total, zero findings resolved. The P0 (F028) escalated on re-adjudication against wave one's unmet downgrade trigger; angle 15 then confirmed the wave-one stale-reference findings fleet-wide and added the deprecation-residue class, so the lane is release-blocking and convergence remains telemetry only.
<!-- /ANCHOR:trend -->

<!-- ANCHOR:blocked-stops -->
## 8. BLOCKED STOPS
None recorded.
<!-- /ANCHOR:blocked-stops -->

<!-- ANCHOR:graph-convergence -->
## 9. GRAPH CONVERGENCE
- graphConvergenceScore: 0
- graphDecision: null
- graphBlockers: []
<!-- /ANCHOR:graph-convergence -->

<!-- ANCHOR:corruption -->
## 10. CORRUPTION WARNINGS
None.
<!-- /ANCHOR:corruption -->

<!-- ANCHOR:risks -->
## 11. ACTIVE RISKS

- Guard violations: none. Stuck count: 0. Budget warnings: none.
- Next focus: none — review complete (5 of 5 iterations, synthesis done). Remediation of the 24 active findings routes through `/speckit:plan` per `review-report.md`.
<!-- /ANCHOR:risks -->
