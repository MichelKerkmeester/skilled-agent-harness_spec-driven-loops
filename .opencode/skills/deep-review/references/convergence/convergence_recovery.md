---
title: Deep Review Convergence Recovery and Reporting
description: Stuck-recovery strategies, the convergence report format, and graph-aware review convergence for the deep review loop.
---

# Deep Review Convergence Recovery and Reporting

When a review loop stalls or finishes, these contracts take over. This reference covers stuck-recovery strategies, the convergence report format, and graph-aware review convergence.

---

## 1. OVERVIEW

### Purpose

This reference defines what the deep-review loop does when convergence stalls or completes. It covers stuck-recovery strategy selection, the convergence report payload, and graph-aware signals that can support or block a final STOP.

### When to Use

- Selecting a recovery strategy after repeated low-value or no-progress review iterations.
- Verifying the convergence report fields written into `review-report.md` and JSONL state.
- Auditing graph-aware convergence behavior when iteration records include `graphEvents`.
- Debugging blocked STOP decisions that need recovery before synthesis can finalize.

### Key References

| Reference | Purpose |
|-----------|---------|
| Recovery strategies | Choose granularity, protocol replay, or severity-focused review after stuck detection. |
| Convergence report | Records stop reason, verdict, coverage, score, gates, and recovery attempts. |
| Graph-aware convergence | Adds structural evidence signals to the legal-stop evaluation. |

---

## 2. RECOVERY STRATEGIES

When stuck detection triggers (`stuckCount >= stuckThreshold`), the orchestrator selects a targeted recovery strategy before deciding whether to continue or exit to synthesis.

### Failure Modes

| Failure Mode | Detection | Recovery Strategy |
|-------------|-----------|-------------------|
| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity:** zoom into functions if reviewing at file level, or zoom out to module level if reviewing functions |
| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
| Low-value advisory churn | Last 2 iterations found only P2 findings | **Escalate severity review:** explicitly search for P0/P1 patterns or downgrade unsupported severity claims |

### Least-Covered Dimension Pivot

Stuck recovery always pivots to the **least-covered dimension** -- the review dimension with the fewest iteration passes and lowest coverage ratio -- rather than relying solely on strategy-based selection. This ensures recovery escapes local minima by exploring under-examined areas of the review target.

The pivot target is computed as:
```
leastCovered = min(dimensions, key=lambda d: (iterationCountFor(d), coverageRatioFor(d)))
```

When the stuck recovery fires, the YAML workflow appends a `stuck_recovery` JSONL event that records the target dimension:
```json
{"type":"event","event":"stuck_recovery","fromIteration":4,"strategy":"change_granularity","targetDimension":"maintainability","outcome":"pending","timestamp":"..."}
```

### Selection Logic

```
function selectReviewRecoveryStrategy(stuckIterations, state, config):
  lastFocuses = [i.focus for i in stuckIterations[-2:]]
  leastCovered = findLeastCoveredDimension(state.dimensionCoverage, state.iterations)

  if len(set(lastFocuses)) <= 1:                           // same dimension stuck
    return { strategy: "change_granularity", dimension: leastCovered }
  if hasRequiredProtocolPlateau(state.traceabilityChecks):  // protocols incomplete
    return { strategy: "protocol_first_replay", dimension: leastCovered }
  return { strategy: "escalate_severity_review", dimension: leastCovered }  // default
```

### Recovery Dispatch Prompt

```
RECOVERY MODE: The last {stuckCount} iterations found no significant new findings.

Dimension focus that is exhausted: {dimension}
Recovery strategy: {strategy}

You MUST try a fundamentally different approach:
- change_granularity: Zoom into functions (if file-level) or zoom out to modules (if function-level).
- protocol_first_replay: Re-run the incomplete traceability protocol against conflicting artifacts.
- escalate_severity_review: Hunt for P0/P1 patterns across all dimensions.

Focus on: {leastCoveredDimension}
```

### Recovery Evaluation

- **Success:** Recovery iteration finds any new P0/P1 or materially advances required traceability coverage. Reset stuck count. Continue.
- **Failure:** Recovery iteration finds only P2 or nothing. If all dimensions are covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.

### JSONL Record

```json
{"type":"event","event":"stuck_recovery","fromIteration":4,"strategy":"change_granularity","outcome":"recovered"}
```

---

## 3. CONVERGENCE REPORT

When the loop stops, the orchestrator generates a convergence report embedded in `review-report.md` and appended to the JSONL state file.

### Report Format

```
CONVERGENCE REPORT
------------------
Stop reason: [converged | maxIterationsReached | userPaused | blockedStop | stuckRecovery | error | manualStop]
Total iterations: N
Provisional verdict: [PASS | CONDITIONAL | FAIL]
hasAdvisories: [true | false]

Active findings at convergence:
  P0: N    P1: N    P2: N

Dimension coverage: N / 4 (X%)
  Correctness:     [covered | not covered]
  Security:        [covered | not covered]
  Traceability:    [covered | not covered]
  Maintainability: [covered | not covered]

Required protocols covered: [true | false]
Stabilization passes: N

Composite Convergence Score: 0.XX / 0.60 threshold
  Signal 1 - Rolling Avg (w=0.30):        0.XX [STOP|CONTINUE]
  Signal 2 - MAD Noise (w=0.25):          0.XX [STOP|CONTINUE] (floor: 0.XX)
  Signal 3 - Novelty Ratio (w=0.45):      0.XX [STOP|CONTINUE] (threshold: 0.10)

Legal-stop gates:
  findingStability: [PASS | FAIL]
  dimensionCoverage: [PASS | FAIL]
  p0Resolution: [PASS | FAIL]
  evidenceDensity: [PASS | FAIL]
  hotspotSaturation: [PASS | FAIL]

Semantic Convergence Signals:
  semanticNovelty:    0.XX (consecutive low: N) [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  findingStability:   0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  semanticVerdict:    [all_support_stop|mixed|all_prevent_stop|insufficient_data]

blocked_stop (only when STOP was vetoed on this run):
  blockedBy: [gate names]
  gateResults: [pass/fail map with detail]
  recoveryStrategy: [what the next iteration must do before STOP can be retried]

Stuck recovery attempts: N (recovered: N, failed: N)
```

### JSONL Synthesis Event

```json
{
  "type": "event",
  "event": "synthesis",
  "stopReason": "converged",
  "totalIterations": 5,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeP0": 0,
  "activeP1": 2,
  "activeP2": 5,
  "dimensionCoverage": 1.0,
  "requiredProtocolsCovered": true,
  "stabilizationPasses": 1,
  "compositeStopScore": 0.70,
  "signals": [
    { "name": "rollingAvg", "value": 0.04, "stop": true, "weight": 0.30 },
    { "name": "madScore", "value": 0.06, "stop": true, "weight": 0.25 },
    { "name": "noveltyRatio", "value": 0.03, "stop": true, "weight": 0.45 }
  ],
  "gatesPassed": true,
  "stuckRecoveryAttempts": 0
}
```

When STOP is vetoed instead of finalized, the workflow emits the separate `blocked_stop` event from Section 3 rather than nesting a `legalStop` object inside `synthesis`.

---

## 4. GRAPH-AWARE REVIEW CONVERGENCE

When `graphEvents` are present in review iteration records, the reducer builds an in-memory coverage graph and derives structural convergence signals that complement the existing statistical signals.

### Graph Convergence Signals (Review)

| Signal | Type | Description | Stop Support |
|--------|------|-------------|-------------|
| `graphDimensionCoverage` | number (0.0-1.0) | Fraction of dimension nodes with at least one COVERS edge to a file node | Above 0.85 supports stop |
| `graphFindingConnectivity` | number (0.0-1.0) | Fraction of finding nodes with at least one EVIDENCES edge | Above 0.90 supports stop (all findings backed by evidence) |
| `graphRemediationRatio` | number (0.0-1.0) | Fraction of P0/P1 findings with at least one REMEDIATES edge | Rising ratio supports stop (findings being resolved) |
| `graphIsolatedFindings` | number | Finding nodes with no edges | Above 0 prevents stop (unconnected findings need evidence) |

### Integration with Legal-Stop Gates

Graph signals participate in the existing `findingStability` gate as additional sub-checks:

```
findingStability.checks.graphEvidence = {
  pass: graphFindingConnectivity >= 0.90 AND graphIsolatedFindings == 0,
  detail: "Graph shows N/M findings connected with K isolated"
}
```

When `graphEvents` are absent (no graph data), the `graphEvidence` sub-check is omitted from the findingStability gate evaluation. The gate passes or fails based on existing sub-checks alone.

### Convergence Report Extension

When graph signals are available, the convergence report (Section 3) includes an additional block:

```
Graph Convergence Signals:
  graphDimensionCoverage:    0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  graphFindingConnectivity:  0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  graphRemediationRatio:     0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  graphIsolatedFindings:     N    [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
```

### Graceful Degradation

| Condition | Behavior |
|-----------|----------|
| No `graphEvents` in any iteration | Graph signals omitted from legal-stop evaluation |
| Fewer than 2 iterations with `graphEvents` | Graph signals marked `insufficient_data` |
| Graph has zero edges | `graphDimensionCoverage` = 0.0, sub-check skipped |

---
