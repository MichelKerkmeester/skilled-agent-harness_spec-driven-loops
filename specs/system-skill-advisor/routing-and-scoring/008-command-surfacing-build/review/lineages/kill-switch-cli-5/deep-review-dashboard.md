---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (spec-folder)
- Started: 2026-11-15T16:45:27Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-kill-switch-cli-5-1794760565927-i99t40
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 0 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness-security | correctness/security | 0.00 | 0/0/0 | complete |
| 2 | traceability-docs-and-scenario | traceability | 1.00 | 0/0/3 | complete |
| 3 | maintainability-tests-and-module-map | maintainability | 0.50 | 0/0/3 | complete |
| 4 | stabilization-and-holdout-hygiene | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 0 |
| traceability | covered | 3 |
| maintainability | covered | 3 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.50 -> 0.00
- convergenceScore: 1.00
- openFindings: 6
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=13, ruledOut=7, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 switch_bypass (ruled_out): Both call sites check before the I/O path.; evidence=advisor-disabled.ts:85, skill-advisor-cli.ts:1540, advisor-recommend.ts:646, skill-advisor-cli-stale-daemon-retry.vitest.ts:303-317
- iteration 1 prompt_leak (ruled_out): The builder has no prompt input.; evidence=advisor-disabled.ts:150-179
- iteration 1 daemon_environment_leak (ruled_out): Daemon child env cannot carry a switch.; evidence=system-skill-advisor-launcher.cjs:131-189, system-skill-advisor-launcher.cjs:312-315, system-skill-advisor-launcher.cjs:156-163
- iteration 1 workspace_root_bypass (ruled_out): Disproved at the CLI schema and handler parse boundaries.; evidence=skill-advisor-cli-manifest.ts:43-64, advisor-tool-schemas.ts:285-303
- iteration 4 active_finding_replay (ruled_out): No drift at the six cited sites.; evidence=ENV-REFERENCE.md:74-75, global-disable-flag.md:49, launcher-bootstrap.vitest.ts:127-145, skill-advisor-cli-stale-daemon-retry.vitest.ts:219-221, runtime/lib/README.md:100-122
- iteration 4 switch_path_recheck (ruled_out): All claimed paths checked before the daemon/scorer or filtered at the launcher.; evidence=hook-flags.cjs:234-285, advisor-disabled.ts:85-93, skill-advisor-cli.ts:1540, advisor-recommend.ts:646, system-skill-advisor-launcher.cjs:312-315
- iteration 4 holdout_hygiene (ruled_out): Counts-only probe; no prompt text in any artifact.; evidence=review-brief-5.txt:1

### Clean Search Proof
- iteration 1 switch_bypass (ruled_out): Both call sites check before the I/O path.; evidence=advisor-disabled.ts:85, skill-advisor-cli.ts:1540, advisor-recommend.ts:646, skill-advisor-cli-stale-daemon-retry.vitest.ts:303-317
- iteration 1 prompt_leak (ruled_out): The builder has no prompt input.; evidence=advisor-disabled.ts:150-179
- iteration 1 daemon_environment_leak (ruled_out): Daemon child env cannot carry a switch.; evidence=system-skill-advisor-launcher.cjs:131-189, system-skill-advisor-launcher.cjs:312-315, system-skill-advisor-launcher.cjs:156-163
- iteration 1 workspace_root_bypass (ruled_out): Disproved at the CLI schema and handler parse boundaries.; evidence=skill-advisor-cli-manifest.ts:43-64, advisor-tool-schemas.ts:285-303
- iteration 4 active_finding_replay (ruled_out): No drift at the six cited sites.; evidence=ENV-REFERENCE.md:74-75, global-disable-flag.md:49, launcher-bootstrap.vitest.ts:127-145, skill-advisor-cli-stale-daemon-retry.vitest.ts:219-221, runtime/lib/README.md:100-122
- iteration 4 switch_path_recheck (ruled_out): All claimed paths checked before the daemon/scorer or filtered at the launcher.; evidence=hook-flags.cjs:234-285, advisor-disabled.ts:85-93, skill-advisor-cli.ts:1540, advisor-recommend.ts:646, system-skill-advisor-launcher.cjs:312-315
- iteration 4 holdout_hygiene (ruled_out): Counts-only probe; no prompt text in any artifact.; evidence=review-brief-5.txt:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; all four dimensions are covered and the run reached `maxIterations=4`. - Focus area: synthesis and the closeout record, not another dispatch. - Reason: the final iteration found no new finding; the active set is six P2 advisories, so the verdict is PASS with `hasAdvisories: true`. The legal stop reason is `maxIterationsReached`, because the coverage graph is unavailable and no graph-backed convergence decision exists. - Rotation status: D1, D2, D3 and D4 covered; no new dimension remains. - Required evidence: the six active findings, the four iteration files, the four deltas and the reducer's final registry. - Recovery note: the run did not claim a graph-backed convergence; the report must say the stop reason is `maxIterationsReached` and that the P2s remain advisories. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
