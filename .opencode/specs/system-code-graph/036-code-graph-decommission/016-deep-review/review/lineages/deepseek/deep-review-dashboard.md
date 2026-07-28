# Deep Review Dashboard — DeepSeek Lane

**Session**: fanout-deepseek-1785216731182-5rt43x
**Generated**: 2026-07-28T11:15:00Z
**Mode**: review | **Lineage**: new, generation 1

---

## Status

| Metric | Value |
|--------|-------|
| **Verdict** | CONDITIONAL |
| **hasAdvisories** | true |
| **Active P0** | 0 |
| **Active P1** | 1 |
| **Active P2** | 16 |
| **Total Iterations** | 5/5 |
| **Stop Reason** | maxIterationsReached |

---

## Findings Summary

| Severity | Count | Delta (last iteration) |
|----------|-------|----------------------|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 16 | +1 |

---

## Progress Table

| Run | Focus | Dimensions | Files | P0 | P1 | P2 | Ratio | Status |
|-----|-------|-----------|-------|----|----|----|-------|--------|
| 1 | correctness | correctness | 12 | 0 | 0 | 5 | 0.636 | PASS |
| 2 | security | security | 8 | 0 | 0 | 4 | 0.444 | PASS |
| 3 | traceability | traceability | 6 | 0 | 1 | 3 | 0.400 | CONDITIONAL |
| 4 | maintainability | maintainability | 8 | 0 | 0 | 4 | 0.160 | PASS |
| 5 | coverage-verify | all four | 4 | 0 | 0 | 1 | 0.043 | PASS |

---

## Dimension Coverage

| Dimension | Covered | Iterations |
|-----------|---------|------------|
| Correctness | Yes | Run 1 |
| Security | Yes | Run 2 |
| Traceability | Yes | Run 3 |
| Maintainability | Yes | Runs 4, 5 |

---

## Trend

| Metric | Value |
|--------|-------|
| **Ratio trajectory** | 0.636 → 0.444 → 0.400 → 0.160 → 0.043 (descending) |
| **Rolling average (last 2)** | 0.102 |
| **Composite stop score** | 0.45 |
| **Stop threshold** | 0.60 |

---

## Active Risks

| Risk | Detail |
|------|--------|
| P1 outstanding | F010: Overbroad closeout claim in 015-verification |
| Sandbox gap | F006: cli-opencode executor lacks sandbox enforcement |
| Security-spec gap | F007: Security-sensitive fix overrides not yet implemented |

---

## Gate Status

| Gate | Status |
|------|--------|
| convergenceGate | Continue (rolling 0.102 > 0.08) |
| dimensionCoverageGate | Pass (4/4 dims covered) |
| p0ResolutionGate | Pass (0 active P0) |
| evidenceDensityGate | Pass (all findings have file:line evidence) |
| hotspotSaturationGate | Pass |
| claimAdjudicationGate | Pass (F010 has adjudication packet) |
| fixCompletenessReplayGate | Pass (not security-sensitive re-run) |
| candidateCoverageGate | Pass (v2 inactive) |
| graphlessFallbackGate | Pass (graph available) |
