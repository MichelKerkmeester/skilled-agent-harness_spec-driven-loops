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
| Convergence achieved | **no** — ratio 1.00 against threshold 0.10; composite stop score 0.45 against 0.60 |
| Iterations completed | 1 of 1 |
| Dimensions covered | 4 of 4 |
| Reviewed revision | commit `2d7439c0a5` (2026-09-12), dedicated worktree, tree stable |
| Lineage | `fanout-worktree-live-1789221489298-ipjoou` (generation 1, mode `new`) |

<!-- /ANCHOR:status -->

<!-- ANCHOR:findings-summary -->

## FINDINGS SUMMARY

| Severity | Active | New | Refined | Resolved |
|----------|--------|-----|---------|----------|
| P0 | 0 | 0 | 0 | 0 |
| P1 | 6 | 6 | 0 | 0 |
| P2 | 3 | 3 | 0 | 0 |
| **Total** | **9** | **9** | **0** | **0** |

Delta from previous iteration: none — this is iteration 1.

<!-- /ANCHOR:findings-summary -->

<!-- ANCHOR:progress -->

## PROGRESS TABLE

| Run | Status | Focus | Dimensions | `newFindingsRatio` | Findings | Duration |
|-----|--------|-------|-----------|-------------------|----------|----------|
| 1 | complete | all four dimensions | correctness, security, traceability, maintainability | 1.00 | 0 P0 / 6 P1 / 3 P2 | single pass |

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
| Run 1 | 1.00 | — (first reading) |

Rolling average (last 2): 1.00 — above `rollingStopThreshold` 0.08.
Composite stop score: 0.45 — the coverage signal only; rolling-average and MAD signals
cannot vote at one iteration, and 0.45 is below the 0.60 consensus threshold.
Trajectory: unknown. A single reading establishes no trend, and this lineage has no second pass.

<!-- /ANCHOR:trend -->

<!-- ANCHOR:blocked-stops -->

## BLOCKED STOPS

| Run | Blocked by | Recovery |
|-----|-----------|----------|
| 1 | `convergenceGate` | Ratio 1.00 against a 0.10 threshold and composite 0.45 against 0.60 with one iteration available. The run stopped on `maxIterations = 1` instead of on convergence. Re-dispatch with `--max-iterations=3` or higher for a legal convergence stop. |

Gate detail for run 1: `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`,
`hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`,
`candidateCoverageGate` and `graphlessFallbackGate` all passed. `convergenceGate` failed.
(The security-sensitive override matrix in `convergence.md` is SPEC ONLY and was not relied
upon; the convergence failure stands on the novelty ratio alone.)

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

- 6 active P1 finding(s) — required before release; none is a P0, but they block PASS and
  four of them misroute the next reader of the packet.
- Latest `blocked_stop` at run 1: `convergenceGate`. Recovery: re-dispatch with a larger iteration ceiling.
- Convergence was never achieved; the verdict rests on a single pass and the report says so
  rather than implying a converged review.
- The packet's own closure gate currently contradicts its criteria table (F002) and carries a
  false migration claim (F005); do not close the packet on the present `acceptance-criteria.md`.

<!-- /ANCHOR:active-risks -->

<!-- ANCHOR:lifecycle -->

## LIFECYCLE

| Field | Value |
|-------|-------|
| `sessionId` | `fanout-worktree-live-1789221489298-ipjoou` |
| `parentSessionId` | null |
| `lineageMode` | `new` |
| `generation` | 1 |
| `continuedFromRun` | null |
| `archivedPath` | null |

<!-- /ANCHOR:lifecycle -->

---

*Executor: `cli-pi` / `deepseek-v4.1-flash` (reasoning effort max). Artifact root bound
directly by the fan-out lineage override; `resolveArtifactRoot` was not invoked. This
lineage ran in its own git worktree; the reviewed tree was stable for the pass.*
