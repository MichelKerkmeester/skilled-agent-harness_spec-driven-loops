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
- Started: 2026-11-15T16:38:04Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-vibe-hooks-doctor-5-1794760565927-i99t40
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
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 0.50 | 0/0/2 | complete |
| 3 | traceability | traceability | 0.33 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 0.25 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 2 |
| traceability | covered | 2 |
| maintainability | covered | 2 |

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
- Last 3 ratios: 0.50 -> 0.33 -> 0.25
- convergenceScore: 0.75
- openFindings: 8
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
- candidateCoverage: covered=7, ruledOut=6, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Equal head suppressed by the receipt comparison and pinned by the suite.; evidence=prompt-advisor.mjs:179-181, vibe-prompt-advisor.vitest.ts:205-208
- iteration 2 environment_precedence (ruled_out): Environment precedes the file, and the daemon path passes no file.; evidence=advisor-disabled.ts:92-101, handlers/advisor-recommend.ts:542
- iteration 2 trust_boundary (ruled_out): The allowlist forwards neither the switch names nor HOOK_FLAGS_CONFIG.; evidence=system-skill-advisor-launcher.cjs:312-315
- iteration 3 coverage_gap (ruled_out): CI, the route and the workflow all run the three scripts with --check.; evidence=.github/workflows/spec-kit-check.yml:337-339
- iteration 3 holdout_leak (ruled_out): No scoped file names a corpus file; no prompt text was read.; evidence=review/review-scope-5.txt:3-48
- iteration 4 dead_code (ruled_out): The constant documents the fail-open policy the composer relies on and matches the DSH adapters.; evidence=prompt-advisor.mjs:51
- iteration 4 state_transition (ruled_out): The write failure is swallowed and the context is still returned.; evidence=prompt-advisor.mjs:106-108

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Equal head suppressed by the receipt comparison and pinned by the suite.; evidence=prompt-advisor.mjs:179-181, vibe-prompt-advisor.vitest.ts:205-208
- iteration 2 environment_precedence (ruled_out): Environment precedes the file, and the daemon path passes no file.; evidence=advisor-disabled.ts:92-101, handlers/advisor-recommend.ts:542
- iteration 2 trust_boundary (ruled_out): The allowlist forwards neither the switch names nor HOOK_FLAGS_CONFIG.; evidence=system-skill-advisor-launcher.cjs:312-315
- iteration 3 coverage_gap (ruled_out): CI, the route and the workflow all run the three scripts with --check.; evidence=.github/workflows/spec-kit-check.yml:337-339
- iteration 3 holdout_leak (ruled_out): No scoped file names a corpus file; no prompt text was read.; evidence=review/review-scope-5.txt:3-48
- iteration 4 dead_code (ruled_out): The constant documents the fail-open policy the composer relies on and matches the DSH adapters.; evidence=prompt-advisor.mjs:51
- iteration 4 state_transition (ruled_out): The write failure is swallowed and the context is still returned.; evidence=prompt-advisor.mjs:106-108

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; synthesis - Focus area: the lineage report, the release-readiness state and the convergence record. - Reason: all four dimensions are covered and the loop has reached its four-iteration cap. - Rotation status: correctness, security, traceability and maintainability complete (PASS with advisories). - Blocked/productive carry-forward: no blocked approach; the receipt-injection and route-name gaps are the last two advisories. - Required evidence: the registry's active counts, the four iteration final lines, the synthesis close-out record and the report. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 8 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
