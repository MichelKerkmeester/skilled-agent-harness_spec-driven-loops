---
title: Deep Review Convergence
description: Stop condition algorithms, quality guards, and recovery strategies for the autonomous deep review loop.
trigger_phrases:
  - "review convergence detection"
  - "severity weighted stop ratio"
  - "legal stop gate bundle"
  - "review stuck detection"
  - "composite convergence vote"
importance_tier: important
contextType: implementation
---

# Deep Review Convergence

Stop condition algorithms, quality guards, and stuck recovery for the deep review loop.

---

## 1. OVERVIEW

### Purpose

Convergence detection determines when the autonomous review loop should stop iterating. After every iteration the orchestrator evaluates three possible outcomes:

| Outcome | Meaning |
|---------|---------|
| **CONTINUE** | More review work is expected to yield meaningful new findings. Dispatch the next iteration. |
| **STOP** | The review has reached saturation. Proceed to synthesis and verdict. |
| **STUCK_RECOVERY** | No progress detected for consecutive iterations. Attempt a recovery strategy before deciding. |

Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.

Release-readiness states are derived alongside convergence:
- `in-progress` while coverage is incomplete or new P0/P1 findings are still appearing
- `converged` once coverage and stabilization pass without new P0/P1 findings
- `release-blocking` whenever unresolved P0 findings remain active

When the loop stops and enters synthesis, the workflow emits `{artifact_dir}/resource-map.md` from converged review deltas before compiling `review-report.md`. Operators can disable that write with `--no-resource-map`.

### When to Use

- Evaluating whether the autonomous review loop should stop, continue, or recover.
- Tuning convergence thresholds, stuck-recovery cadence, or stabilization windows.
- Debugging a stuck-recovery escalation or a premature STOP vote.
- Auditing the release-readiness classification logic before shipping.

### Key Defaults

| Setting | Value | Purpose |
|---------|-------|---------|
| `maxIterations` | 7 | Hard ceiling on loop iterations |
| `convergenceThreshold` | 0.10 | General convergence sensitivity |
| `rollingStopThreshold` | 0.08 | Rolling-average STOP vote threshold |
| `noProgressThreshold` | 0.05 | Stuck / no-progress classification threshold |
| `stuckThreshold` | 2 | Consecutive no-progress iterations before recovery |
| `minStabilizationPasses` | 1 | Coverage signal requires at least one stabilization pass |
| `compositeStopScore` | 0.60 | Weighted stop-score needed before guard evaluation |

### Threshold Semantics and Sibling Parity

`convergenceThreshold` (default 0.10) compares new severity-weighted findings (P0=10, P1=5, P2=1) against accumulated findings. Lower values demand more iterations and a higher signal threshold before STOP is legal.

**Not interchangeable with sibling deep-loop skills:**

| Skill | Default | Signal |
|---|---|---|
| `deep-review` | 0.10 | severity-weighted P0/P1/P2 ratio |
| `deep-research` | 0.05 | newInfoRatio (negative-knowledge emphasis) |
| `deep-ai-council` (proposed) | 0.20 | adjudicator-verdict stability |

Carrying threshold expectations across siblings will cause unexpected iteration counts. Tune each skill against its own default and its own signal, not by analogy.

### Security-Sensitive Fix Overrides

> **STATUS: SPEC ONLY (future implementation).** The override matrix below describes the contract that a future release should apply automatically when the review target involves security-sensitive surfaces. As of v1.9.0.0, the runtime does NOT auto-detect security-sensitivity and does NOT apply these overrides. `requiredClosedFindingReplay` and `requiredFixCompletenessGate` exist in no config / yaml / reducer surface (verified by grep). Operators running a security-sensitive review must manually tighten thresholds via `--convergence` + `--max-iterations` and manually maintain the closed-gate replay table. The contract below stands as the target spec for the next implementation pass. (Provenance for this deferred contract is recorded in this skill's changelog.)

For review reruns after fixes involving security, path disclosure, auth/authz, sandboxing, env precedence, public schemas, persistence, or user-visible error payloads (intended contract, not yet runtime-enforced):

| Setting | General Default | Security-Sensitive Fix Default |
|---------|-----------------|--------------------------------|
| `minStabilizationPasses` | 1 | 2 |
| `requiredClosedFindingReplay` | false | true for prior P0/P1 and any prior security/path P2 |
| `requiredFixCompletenessGate` | false | true |

When implemented, STOP must not be legal until the review report contains a closed-gate replay table that marks each prior active or remediated P0/P1 as `PASS`, `FAIL`, or `carried forward`, with file:line or command evidence. Operators today must enforce this rule manually.

### Shared Stop Contract

Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus, when STOP is vetoed, a `blocked_stop` event written to `deep-review-state.jsonl`. There is no nested `legalStop` wrapper on the persisted path. Earlier drafts of this document implied one, and that drift was the source of F009 in the 042 closing audit.

#### stopReason Enum

| `stopReason` | Meaning |
|--------------|---------|
| `converged` | All convergence signals met and legal-stop gates passed. |
| `maxIterationsReached` | Iteration limit hit before convergence. |
| `userPaused` | User requested pause via sentinel. |
| `blockedStop` | Convergence math voted stop but legal-stop gates failed. |
| `stuckRecovery` | Stuck detection triggered recovery. |
| `error` | Unrecoverable error during iteration or reducer flow. |
| `manualStop` | Operator explicitly halted outside the pause sentinel path. |

#### blocked_stop Event (canonical, persisted)

`step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml` appends the following record to `deep-review-state.jsonl` whenever the legal-stop decision tree vetoes STOP. The gate names and their shapes are load-bearing, the reducer reads them verbatim:

```json
{
  "type": "event",
  "event": "blocked_stop",
  "mode": "review",
  "run": 5,
  "blockedBy": ["dimensionCoverageGate", "p0ResolutionGate"],
  "gateResults": {
    "convergenceGate": { "pass": true, "score": 0.72 },
    "dimensionCoverageGate": {
      "pass": false,
      "covered": ["correctness", "security", "traceability"],
      "missing": ["maintainability"]
    },
    "p0ResolutionGate": { "pass": false, "activeP0": 1 },
    "evidenceDensityGate": { "pass": true, "avgEvidencePerFinding": 1.6 },
    "hotspotSaturationGate": { "pass": true },
    "claimAdjudicationGate": { "pass": true, "activeP0P1": 2 },
    "fixCompletenessReplayGate": { "pass": true, "securitySensitive": false, "requiredRows": 0, "passingRows": 0 },
    "candidateCoverageGate": { "pass": true, "searchDebt": [], "missing": [] },
    "graphlessFallbackGate": { "pass": true, "mode": "graph_available", "missing": [], "unavailabilityReason": "" }
  },
  "graphBlockerDetail": [],
  "recoveryStrategy": "Dispatch the next iteration at the maintainability dimension and re-check after resolving the remaining P0.",
  "timestamp": "2026-03-24T15:02:00Z",
  "sessionId": "rvw-2026-03-24T10-00-00Z",
  "generation": 1
}
```

- `blockedBy`: array of gate names that failed (string[], never structured objects). Empty when STOP is legal, in which case no `blocked_stop` event is emitted.
- `gateResults`: named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, and `graphlessFallbackGate`. This is the full 9-gate set emitted by `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`. Each sub-record has a `pass` boolean plus gate-specific fields (score, covered/missing, activeP0, avgEvidencePerFinding, activeP0P1, securitySensitive, requiredRows, passingRows, searchDebt, mode, unavailabilityReason). The reducer reads these verbatim and does not coerce shapes. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates, they pass trivially when the review-depth-v2 search path is inactive (no search debt, graph available).
- `graphBlockerDetail`: array of structured graph blockers copied from the latest graph convergence decision. Empty when graph convergence did not veto STOP.
- `recoveryStrategy`: human-readable one-liner describing what the next iteration should do before another stop attempt.
- When the graph convergence verdict is `STOP_BLOCKED`, fold the graph blocker gate name into `blockedBy` and preserve the structured blocker objects under `graphBlockerDetail`.

### Decision Priority

Checks are evaluated in this order (first match wins):

1. **Max iterations** -- hard cap, always checked first.
2. **All dimensions covered + clean** -- all 4 dimensions covered, no active P0/P1, stabilization passed, gates passed.
3. **Stuck detection** -- 2+ consecutive no-progress iterations.
4. **Composite convergence** -- 3-signal weighted vote with threshold 0.60.
5. **Legal-stop gate bundle** -- review-specific stop gates. If a stop vote fails any gate, persist `stopReason=blockedStop` and continue.
6. **Default CONTINUE** -- none of the above triggered.

---

## 2. HARD STOPS

Hard stops are evaluated first and override all other signals.

### Max Iterations Reached

```
if len(iterations) >= config.maxIterations:       // default 7
  return { action: "STOP", stopReason: "maxIterationsReached" }
```

The loop stops unconditionally. Synthesis runs with whatever findings exist.

### All Dimensions Covered with Stabilization

```
if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
  if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
    if buildReviewLegalStop(state, config, coverage).passed:
      return { action: "STOP", stopReason: "converged" }
```

Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and the 5-gate legal-stop bundle passes. If gates fail, the loop records `stopReason=blockedStop` and continues despite full coverage.

---

## 3. STUCK DETECTION

Identifies when the review loop makes no meaningful progress across consecutive iterations.

```
function countConsecutiveStuck_review(evidenceIterations, noProgressThreshold):
  count = 0
  for i in reversed(evidenceIterations):
    if i.status == "thought":   continue    // invisible to stuck counter
    if i.status == "insight":   break       // resets stuck counter (genuine progress)
    if i.newFindingsRatio < noProgressThreshold or i.status == "stuck":
      count += 1
    else:
      break
  return count
```

**Threshold:** `stuckThreshold = 2` consecutive no-progress iterations (using `noProgressThreshold = 0.05`).

**Status exclusions:**
- `insight`: Resets stuck counter -- a conceptual breakthrough counts as progress even with a low ratio.
- `thought`: Skipped entirely -- analytical iterations produce no evidence to measure.

When `stuckCount >= stuckThreshold`, the orchestrator invokes the recovery protocol (Section 8) before deciding whether to continue or stop.

The recovery entry uses `stopReason=stuckRecovery` while the loop is in recovery. If recovery later terminates the run, the terminal record keeps the same shared enum value instead of minting a review-only label.

---

## 4. COMPOSITE CONVERGENCE

Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold. The signal set below matches the authoritative 3-signal vote in `deep_review_{auto,confirm}.yaml` `step_check_convergence` and the quick-reference convergence table, the 3rd signal is **dimension coverage**, not a standalone novelty ratio.

| Signal | Weight | Min Iterations | Measures |
|--------|--------|---------------|----------|
| Rolling Average | 0.30 | 2 | Recent severity-weighted finding yield |
| MAD Noise Floor | 0.25 | 3 | Signal vs noise in newFindingsRatio |
| Dimension Coverage | 0.45 | 1 | Configured review dimensions fully covered AND required traceability protocols covered AND `coverage_age >= minStabilizationPasses` |

### Signal 1: Rolling Average (weight 0.30)

Averages the last 2 severity-weighted `newFindingsRatio` values from evidence-bearing iterations (excludes `thought` status). Votes STOP when the average drops below `rollingStopThreshold` (0.08).

```
if len(evidenceIterations) >= 2:
  recent = evidenceIterations[-2:]
  avgRatio = mean(i.newFindingsRatio for i in recent)
  rollingStop = avgRatio < 0.08
```

### Signal 2: MAD Noise Floor (weight 0.25)

Robust statistical test using Median Absolute Deviation. Votes STOP when the latest ratio is at or below the computed noise floor.

```
if len(evidenceIterations) >= 3:
  allRatios = [i.newFindingsRatio for i in evidenceIterations]
  med = median(allRatios)
  mad = median([abs(r - med) for r in allRatios])
  noiseFloor = mad * 1.4826     // normal distribution estimator
  madStop = evidenceIterations[-1].newFindingsRatio <= noiseFloor
```

### Signal 3: Dimension Coverage (weight 0.45)

Highest-weight signal. Votes STOP once every configured review dimension AND every required traceability protocol has been covered by at least one iteration, and the coverage set has been stable for at least `minStabilizationPasses` iterations (default 1). This is the signal the YAML workflow evaluates.

```
dimensionStop =
  dimensions_covered_count == configured_dimensions_count
  AND required_traceability_protocols_covered
  AND coverage_age >= config.minStabilizationPasses
```

The latest severity-weighted newFindingsRatio is still tracked (the dashboard and registry surface it as `newFindingsRatio`), but it does NOT cast an independent stop vote, it feeds the rolling average and MAD noise-floor signals only.

### Weighted Vote

```
stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
if stopScore >= 0.60:   // proceed to quality gate evaluation
```

Weights are redistributed across active signals only. If only 2 signals have enough data, their weights are normalized to sum to 1.0.

### Semantic Convergence Signals

Two additional signals provide deeper semantic analysis of review iteration quality. These signals are ADDITIONAL to the 3-signal composite vote above and participate in the legal-stop gate evaluation rather than the composite stop-score.

#### semanticNovelty (0.0-1.0)

Measures how much genuinely new review insight each iteration contributes beyond surface-level overlap with prior findings. Unlike `newFindingsRatio` (which is severity-weighted), `semanticNovelty` evaluates the conceptual novelty of findings independent of severity weighting.

| Value | Meaning |
|-------|---------|
| 0.8-1.0 | Iteration uncovered substantially new defect patterns, architectural concerns, or review angles |
| 0.4-0.7 | Mix of new review insights and restatements of prior findings |
| 0.1-0.3 | Mostly refinements or rewordings of previously identified issues |
| 0.0 | No semantically novel findings detected |

Computation:
```
function computeSemanticNovelty_review(currentFindings, priorCumulativeFindings):
  newPatterns = extractDefectPatterns(currentFindings) - extractDefectPatterns(priorCumulativeFindings)
  totalPatterns = extractDefectPatterns(currentFindings)
  if len(totalPatterns) == 0: return 0.0
  return len(newPatterns) / len(totalPatterns)
```

When `semanticNovelty` drops below 0.15 for 2+ consecutive evidence iterations, it provides strong supporting evidence for a legal STOP decision. This signal catches cases where `newFindingsRatio` stays moderate (due to severity weighting of refinements) but the review has exhausted genuinely new defect categories.

#### findingStability (0.0-1.0)

Measures how stable the cumulative finding set is across iterations. A high stability score means the finding registry is not materially changing between iterations -- findings are not being added, upgraded, downgraded, or invalidated at a significant rate.

| Value | Meaning |
|-------|---------|
| 0.9-1.0 | Finding set is highly stable, minimal churn between iterations |
| 0.6-0.8 | Moderate stability, some findings still evolving |
| 0.3-0.5 | Active churn, findings being added, merged, or reclassified frequently |
| 0.0-0.2 | Highly unstable, the review is still in early discovery |

Computation:
```
function computeFindingStability(currentRegistry, priorRegistry):
  if priorRegistry is null: return 0.0  // first iteration
  unchangedFindings = count(f for f in currentRegistry
    if f.id in priorRegistry and f.severity == priorRegistry[f.id].severity
    and f.status == priorRegistry[f.id].status)
  totalFindings = max(len(currentRegistry), len(priorRegistry))
  if totalFindings == 0: return 1.0
  return unchangedFindings / totalFindings
```

Convergence behavior:
- `findingStability >= 0.85` supports STOP: the finding set has stabilized and further iterations are unlikely to materially change the review outcome.
- `findingStability < 0.50` prevents STOP: the finding set is still in flux and the review has not reached a stable assessment.

#### Integration with Legal-Stop Gate Bundle

The two semantic signals integrate with the existing 5-gate legal-stop bundle (Section 6):

1. **findingStability gate** (existing): The existing `findingStability` gate already evaluates rolling average, MAD noise floor, and novelty ratio. The new `semanticNovelty` signal adds a sub-check:
   - `semanticNoveltyPlateau`: `semanticNovelty < 0.15` for 2+ consecutive evidence iterations
   - When this sub-check fails while the existing churn signals pass, the gate records the mismatch as a diagnostic note but does not independently block STOP.

2. **findingStability signal** (new): The `findingStability` metric (0.0-1.0) is surfaced alongside the existing convergence signals. It supports the `findingStability` gate evaluation by providing a registry-level stability measure that complements the ratio-based churn signals.

The gate passes only when both the existing churn-based checks AND the semantic stability checks agree. When a semantic check fails, the persisted `blocked_stop.gateResults.findingStability` payload includes the semantic signal values.

#### Stop-Decision Trace

The stop-decision event includes which semantic signals supported or prevented STOP:

```json
{
  "type": "event",
  "event": "stop_decision",
  "semanticSignals": {
    "semanticNovelty": { "value": 0.06, "consecutiveLow": 3, "supportsStop": true },
    "findingStability": { "value": 0.92, "supportsStop": true }
  },
  "semanticVerdict": "all_support_stop",
  ...
}
```

| `semanticVerdict` | Meaning |
|-------------------|---------|
| `all_support_stop` | Both semantic signals support stopping |
| `mixed` | One signal supports stop, the other does not |
| `all_prevent_stop` | Both semantic signals indicate more work is needed |
| `insufficient_data` | Not enough iterations to compute semantic signals |

### Graceful Degradation

| Iterations Completed | Active Signals | Behavior |
|---------------------|----------------|----------|
| 1 | Novelty ratio only (weight 1.0) | Very unlikely to stop without later confirmation from rolling churn signals |
| 2 | Rolling avg + novelty ratio | Two-signal vote, reweighted |
| 3+ | All three signals | Full composite, most reliable |

Semantic convergence signals (`semanticNovelty`, `findingStability`) require at least 2 evidence iterations to produce meaningful values. They are omitted from legal-stop evaluation when insufficient data exists.

---

## 5. SEVERITY-WEIGHTED RATIO

The review loop uses `newFindingsRatio` instead of `newInfoRatio`. It weights findings by severity so that critical discoveries count far more than minor suggestions.

### Severity Weights

| Severity | Weight | Description |
|----------|--------|-------------|
| **P0** (Blocker) | 10.0 | Correctness failures, security vulnerabilities, spec contradictions |
| **P1** (Required) | 5.0 | Degraded behavior, incomplete implementation, missing validation |
| **P2** (Suggestion) | 1.0 | Style, naming, minor improvements, documentation gaps |

### Computation

```
SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
refinementMultiplier = 0.5

weightedNew       = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
weightedTotal     = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)

newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
```

- `fully_new_findings` -- findings not present in any prior iteration (new findingId).
- `refinement_findings` -- findings that refine or upgrade an existing finding (same root cause, new evidence or severity change).
- `refinementMultiplier = 0.5` -- refinements count at half weight.

### P0 Override Rule

```
if ANY new P0 found this iteration:
  newFindingsRatio = max(calculated, 0.50)

if total_findings == 0:
  newFindingsRatio = 0.0
```

A new critical finding always signals significant remaining work. The 0.50 floor prevents premature convergence when critical issues are still being discovered.

---

## 6. LEGAL-STOP GATE BUNDLE

> **GATE MODEL, two naming conventions mapped to one authoritative set.** The authoritative producer is `step_emit_blocked_stop` in both `deep_review_{auto,confirm}.yaml`, which emits **9 gates** with the `Gate` suffix: `convergenceGate` / `dimensionCoverageGate` / `p0ResolutionGate` / `evidenceDensityGate` / `hotspotSaturationGate` / `claimAdjudicationGate` / `fixCompletenessReplayGate` / `candidateCoverageGate` / `graphlessFallbackGate`. The §Section-1 event shape (lines 98-119) mirrors this set verbatim and the reducer reads those names verbatim, so treat the event shape as authoritative when writing or reading JSONL state. The §6 table below is the high-level conceptual model and uses descriptive names WITHOUT the `Gate` suffix where one reads more naturally (for example `findingStability` maps to `convergenceGate`); each row carries its event-shape name so the mapping is explicit. `candidateCoverageGate` and `graphlessFallbackGate` are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. The gate-model drift cluster (LG-0013, LG-0016, LG-0031, LG-0032) was reconciled in `006-gate-model-reconciliation`.

Deep review treats STOP as legal only when the full review-specific gate bundle passes together. Convergence math may request STOP, but the workflow must still evaluate these 9 gates and persist a blocked-stop event when any gate fails.

| Gate (§6 conceptual) | Event-shape name (§Section-1) | Rule | Fail Action |
|------|------|------|-------------|
| **findingStability** | `convergenceGate` | Rolling average, MAD noise floor, and novelty ratio must all indicate low-yield review churn | Block STOP, persist `blockedStop` |
| **dimensionCoverage** | `dimensionCoverageGate` | Every configured review dimension must have been examined at least once, with required traceability coverage stabilized | Block STOP, persist `blockedStop` |
| **p0Resolution** | `p0ResolutionGate` | No unresolved P0 findings may remain active at stop time | Block STOP, persist `blockedStop` |
| **evidenceDensity** | `evidenceDensityGate` | Evidence density across active findings must meet the configured threshold | Block STOP, persist `blockedStop` |
| **hotspotSaturation** | `hotspotSaturationGate` | Review hotspots must be revisited enough times to satisfy the saturation heuristic | Block STOP, persist `blockedStop` |
| (no §6 counterpart) | `claimAdjudicationGate` | Each new P0/P1 finding must carry a typed adjudication packet, missing or failing packets veto STOP | Block STOP, persist `blockedStop` |
| **fixCompletenessReplay** | `fixCompletenessReplayGate` | Security-sensitive fix reruns must replay previously closed P0/P1 gates and validate producer/consumer/matrix coverage from the remediation packet | Block STOP, persist `blockedStop` |
| **candidateCoverage** (v2 rollout) | `candidateCoverageGate` | Search debt must be cleared and every required bug class must have candidate coverage before STOP, passes trivially when the v2 search path is inactive | Block STOP, persist `blockedStop` |
| **graphlessFallback** (v2 rollout) | `graphlessFallbackGate` | When the code graph is unavailable, required bug classes must carry cited fallback ledger rows, passes trivially when the graph is available | Block STOP, persist `blockedStop` |

### Gate Evaluation

```
function buildReviewLegalStop(state, config, coverage):
  gateResults = {
    findingStability: {
      pass: rollingStop and madStop and state.latestNoveltyRatio <= config.convergenceThreshold,
      detail: "Rolling average, MAD noise floor, and novelty ratio are all below stop thresholds."
    },
    dimensionCoverage: {
      pass: everyConfiguredDimensionExaminedAtLeastOnce(coverage, config.reviewDimensions) and
            coverage.requiredProtocolsCovered and
            coverage.stabilizationPasses >= 1,
      detail: "All configured review dimensions have been examined, required traceability protocols are covered, and stabilization has aged enough to stop."
    },
    p0Resolution: {
      pass: countActiveFindings(state, ["P0"]) == 0 and state.claimAdjudicationPassed != false,
      detail: "No unresolved P0 findings remain and blocker adjudication is complete."
    },
    evidenceDensity: {
      pass: computeEvidenceDensity(state.activeFindings) >= config.evidenceDensityThreshold,
      detail: "Evidence density meets the configured threshold for active findings."
    },
    hotspotSaturation: {
      pass: computeHotspotSaturation(state.hotspots) >= config.hotspotSaturationThreshold,
      detail: "Priority hotspots received enough revisits to satisfy saturation."
    },
    fixCompletenessReplay: {
      pass: not isSecuritySensitiveFixRerun(state, config) or allRequiredReplayRowsPass(state.reviewReport),
      detail: "Security-sensitive fix reruns include closed-gate replay evidence and producer/consumer/matrix coverage before STOP."
    },
    candidateCoverage: {
      pass: not isReviewDepthV2Active(state, config) or (searchDebtCleared(state) and allRequiredBugClassesCovered(state)),
      detail: "Search debt is cleared and every required bug class has candidate coverage. Passes trivially when the v2 search path is inactive."
    },
    graphlessFallback: {
      pass: state.searchCoverage.graphCoverageMode == "graph_available" or allRequiredBugClassesHaveFallbackRows(state),
      detail: "When the code graph is unavailable, required bug classes carry cited fallback ledger rows. Passes trivially when the graph is available."
    }
  }

  blockedBy = [name for name, result in gateResults.items() if not result.pass]
  return {
    pass: len(blockedBy) == 0,
    blockedBy,
    gateResults
  }
```

When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class `blocked_stop` event with the failing `blockedBy` gates, the full `gateResults` bundle, a `recoveryStrategy`, and the normal run/timestamp/session lineage fields before overriding the decision to CONTINUE.

### Blocked-Stop Recovery Strategy

| Failed Gate | Recovery Strategy |
|-------------|-------------------|
| `findingStability` | Revisit the noisiest recent dimension and reduce novelty by closing obvious follow-up loops before re-checking STOP. |
| `dimensionCoverage` | Schedule the next uncovered review dimension immediately. |
| `p0Resolution` | Re-open the active blocker path and verify whether the P0 is real, downgraded, or still unresolved. |
| `evidenceDensity` | Re-read weakly supported findings and add concrete `file:line` citations before they count toward a stop decision. |
| `hotspotSaturation` | Revisit undersampled hotspots or adjacent call sites until the saturation heuristic passes. |
| `fixCompletenessReplay` | Replay prior active or remediated P0/P1 gates, then record producer, consumer, and matrix coverage evidence before re-checking STOP. |
| `candidateCoverage` | Clear outstanding search debt and run candidate discovery for the missing bug classes before re-checking STOP. |
| `graphlessFallback` | Add cited fallback ledger rows for the required bug classes, or restore graph availability, before re-checking STOP. |

### Legacy Stop-Reason Mapping

Use this table when replaying old packets or translating older prose/docs into the shared stop contract.

| Legacy label | New `stopReason` | Mapping note |
|--------------|------------------|--------------|
| `all_dimensions_clean` | `converged` | Legacy review-specific terminal label, now expressed by the shared enum. |
| `composite_converged` | `converged` | Legacy convergence-math wording now rolls into shared terminal success. |
| `all dimensions clean` | `converged` | Old operator-facing prose for the same successful stop. |
| `max_iterations_reached` | `maxIterationsReached` | Legacy machine label for the hard iteration cap. |
| `max iterations` | `maxIterationsReached` | Old operator-facing hard-stop wording. |
| `pause sentinel detected` | `userPaused` | Sentinel pause is now a shared user-directed stop reason. |
| `guard_override` | `blockedStop` | Legacy continue override when a stop vote failed legal gates. |
| `quality guard failed` | `blockedStop` | Older prose for the same blocked-stop outcome. |
| `P0 override blocks convergence` | `blockedStop` | Legacy review wording for a stop attempt that was not legal to finalize. |
| `stuck_detected` | `stuckRecovery` | Legacy recovery trigger label. |
| `stuck_unrecoverable` | `stuckRecovery` | Legacy terminal wording for the same recovery path family. |
| `manual halt` | `manualStop` | Operator-directed halt outside normal pause sentinel flow. |

---

## 7. PROVISIONAL VERDICT

The provisional verdict is determined from active findings at the time the loop stops. It appears in both the convergence report and the final `review-report.md`.

| Verdict | Condition | Meaning |
|---------|-----------|---------|
| **FAIL** | `activeP0 > 0` OR any legal-stop gate fails at terminal stop time | Does not meet quality standards. Blocks release. |
| **CONDITIONAL** | `activeP0 == 0` AND `activeP1 > 0` | Meets threshold but has required fixes before release. |
| **PASS** | `activeP0 == 0` AND `activeP1 == 0` | Shippable. Set `hasAdvisories: true` when `activeP2 > 0`. |

### Determination

```
function determineVerdict(state, gateResult):
  activeP0 = countActiveFindings(state, ["P0"])
  activeP1 = countActiveFindings(state, ["P1"])
  activeP2 = countActiveFindings(state, ["P2"])

  if activeP0 > 0 or not gateResult.passed:
    return { verdict: "FAIL", nextCommand: "/speckit:plan" }
  if activeP1 > 0:
    return { verdict: "CONDITIONAL", nextCommand: "/speckit:plan" }

  hasAdvisories = activeP2 > 0
  return { verdict: "PASS", hasAdvisories, nextCommand: "/create:changelog" }
```

### Post-Verdict Routing

| Verdict | Next Step |
|---------|-----------|
| FAIL | `/speckit:plan` -- create remediation plan from findings |
| CONDITIONAL | `/speckit:plan` -- create fix plan for P1 findings |
| PASS | `/create:changelog` -- record the clean audit |

---

## 8. RECOVERY, REPORTING, AND GRAPH-AWARE CONVERGENCE

Stuck-recovery strategies, the convergence report format, and graph-aware review convergence live in `convergence_recovery.md` for navigability.

---

## OPTIMIZER-TUNABLE THRESHOLDS

The following convergence thresholds are managed by the offline loop optimizer (042.004). Changes to these fields are proposed through the optimizer's advisory-only promotion gate and reviewed by humans before adoption.

### Tunable Fields (Optimizer-Managed)

| Field | Default | Range | Description |
|-------|---------|-------|-------------|
| `convergenceThreshold` | 0.10 | 0.01-0.20 | General convergence sensitivity |
| `stuckThreshold` | 2 | 1-5 | Consecutive no-progress iterations before recovery |
| `maxIterations` | 7 | 3-20 | Hard iteration ceiling |
| `compositeStopScore` | 0.60 | 0.40-0.80 | Weighted stop score needed before guard evaluation |

### Locked Fields (Not Optimizer-Tunable)

The following fields are runtime contracts and MUST NOT be modified by the optimizer:

- `stopReason` enum values and semantics
- `blocked_stop` event structure and gate names
- Lineage fields (`sessionId`, `lineageMode`, `generation`)
- Reducer configuration and file protection policies
- Review dimensions (`reviewDimensions`) and product mode (`mode`)

### Canonical Manifest

The authoritative registry of tunable vs locked fields is maintained at:
`.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
