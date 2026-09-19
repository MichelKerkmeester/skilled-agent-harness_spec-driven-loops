# Deep Review Dashboard

*Auto-generated from `deep-review-state.jsonl`, `deep-review-strategy.md` and
`deep-review-findings-registry.json`. Overwritten on every refresh; never hand-edited.*

<!-- ANCHOR:status -->

## STATUS

| Field | Value |
|-------|-------|
| Verdict | **CONDITIONAL** |
| `hasAdvisories` | false |
| `releaseReadinessState` | `in-progress` |
| Stop reason | `maxIterationsReached` |
| Convergence achieved | **no** — ratio 0.70 against threshold 0.10 |
| Iterations completed | 1 of 1 |
| Dimensions covered | 4 of 4 |
| Lineage | `fanout-containment-live-2-1789159071284-irnvcb` (generation 1, mode `new`) |

<!-- /ANCHOR:status -->

<!-- ANCHOR:findings-summary -->

## FINDINGS SUMMARY

| Severity | Active | New | Refined | Resolved |
|----------|--------|-----|---------|----------|
| P0 | 0 | 0 | 0 | 0 |
| P1 | 5 | 5 | 0 | 0 |
| P2 | 2 | 2 | 0 | 0 |
| **Total** | **7** | **7** | **0** | **0** |

Delta from previous iteration: none — this is iteration 1.

<!-- /ANCHOR:findings-summary -->

<!-- ANCHOR:progress -->

## PROGRESS TABLE

| Run | Status | Focus | Dimensions | `newFindingsRatio` | Findings | Duration |
|-----|--------|-------|-----------|-------------------|----------|----------|
| 1 | complete | all four dimensions | correctness, security, traceability, maintainability | 0.70 | 0 P0 / 5 P1 / 2 P2 | single pass |

<!-- /ANCHOR:progress -->

<!-- ANCHOR:dimension-coverage -->

## COVERAGE

| Dimension | Status | Iterations touched | Verdict |
|-----------|--------|--------------------|---------|
| correctness | covered | 1 | PASS |
| security | covered | 1 | PASS |
| traceability | covered | 1 | CONDITIONAL |
| maintainability | covered | 1 | CONDITIONAL |

**Protocols**

| Protocol | Level | Status |
|----------|-------|--------|
| `spec_code` | core | partial |
| `checklist_evidence` | core | partial |
| `skill_agent` | overlay | notApplicable |
| `agent_cross_runtime` | overlay | notApplicable |
| `feature_catalog_code` | overlay | partial |
| `playbook_capability` | overlay | not_executed |

**Resources absent at init**: `resource-map.md` — coverage gate skipped, no report section due.

<!-- /ANCHOR:dimension-coverage -->

<!-- ANCHOR:trend -->

## TREND

| Ratio | Value | Direction |
|-------|-------|-----------|
| Run 1 | 0.70 | — (first reading) |

Rolling average (last 2): 0.70 — above `rollingStopThreshold` 0.08.
Composite stop score: not computed — coverage stabilization cannot be satisfied at this ceiling.
Trajectory: unknown. A single reading establishes no trend, and this lineage has no second pass.

<!-- /ANCHOR:trend -->

<!-- ANCHOR:blocked-stops -->

## BLOCKED STOPS

| Run | Blocked by | Recovery |
|-----|-----------|----------|
| 1 | `convergenceGate` | Ratio 0.70 against a 0.10 threshold, and the security-sensitive override requires `minStabilizationPasses = 2`, which one pass cannot satisfy. The run stopped on `maxIterations = 1` instead of on convergence. Re-dispatch with `--max-iterations=3` or higher for a legal convergence stop. |

Gate detail for run 1: `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`,
`hotspotSaturationGate`, `claimAdjudicationGate`, `candidateCoverageGate` and
`graphlessFallbackGate` all passed. `convergenceGate` and `fixCompletenessReplayGate` failed.

<!-- /ANCHOR:blocked-stops -->

<!-- ANCHOR:graph-convergence -->

## GRAPH CONVERGENCE

| Field | Value |
|-------|-------|
| `graphConvergenceScore` | 0 |
| `graphDecision` | null |
| `graphBlockers` | none |

No `graph_convergence` event was recorded, so reducer defaults apply. The
`candidateCoverageGate` and `graphlessFallbackGate` gates pass trivially on this path.

<!-- /ANCHOR:graph-convergence -->

<!-- ANCHOR:corruption-warnings -->

## CORRUPTION WARNINGS

No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->

<!-- ANCHOR:search-debt -->

## SEARCH DEBT

None recorded. No query obligations were deferred or blocked in this run.

<!-- /ANCHOR:search-debt -->

<!-- ANCHOR:active-risks -->

## ACTIVE RISKS

- 5 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Latest `blocked_stop` at run 1: `convergenceGate`. Recovery: re-dispatch with a larger iteration ceiling.
- Convergence was never achieved; the verdict rests on a single pass and the report says so rather than implying a converged review.

<!-- /ANCHOR:active-risks -->

<!-- ANCHOR:lifecycle -->

## LIFECYCLE

| Field | Value |
|-------|-------|
| `sessionId` | `fanout-containment-live-2-1789159071284-irnvcb` |
| `parentSessionId` | null |
| `lineageMode` | `new` |
| `generation` | 1 |
| `continuedFromRun` | null |
| `archivedPath` | null |

<!-- /ANCHOR:lifecycle -->

---

*Executor: `cli-pi` / `deepseek-v4.1-flash` (reasoning effort max). Artifact root bound
directly by the fan-out lineage override; `resolveArtifactRoot` was not invoked.*
