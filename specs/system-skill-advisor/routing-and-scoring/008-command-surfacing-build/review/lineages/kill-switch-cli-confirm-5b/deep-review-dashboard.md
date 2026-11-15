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
- Started: 2026-11-15T22:15:13Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-kill-switch-cli-confirm-5b-1794780590351-ezt1v0
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
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | confirm-fixes-correctness-and-traceability | correctness/traceability | 1.00 | 0/0/2 | complete |
| 2 | security-and-maintainability-of-switch-set | security/maintainability | 0.00 | 0/0/0 | complete |
| 3 | advisory-replay-and-fix-provenance | traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

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
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 2
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
- candidateCoverage: covered=10, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 switch_bypass (ruled_out): No enable switch exists for the advisor and every listed name resolves to a disable decision.; evidence=.skilled/hooks/shared/hook-flags.cjs:104-106, .skilled/hooks/shared/hook-flags.cjs:256-271
- iteration 1 fixture_narrowing (ruled_out): The size assertion runs first and the child env assertion is exact.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:129-143
- iteration 2 switch_leak (ruled_out): Exact-set allowlist and an exact child-env assertion.; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:131-180, .skilled/bin/system-skill-advisor-launcher.cjs:312-315
- iteration 2 test_isolation (ruled_out): Per-case temp root and a missing flags file.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:51-70, .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:151-156
- iteration 2 duplicate_alias_list (ruled_out): Same defect as the iteration-1 index finding; a second finding would double-count it.; evidence=.skilled/hooks/shared/hook-flags.cjs:38-78, .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74-75
- iteration 2 prompt_leak (ruled_out): Counts only; no content printed and no reader in scope.; evidence=review-brief-5b.txt:1
- iteration 3 advisory_replay (ruled_out): Both advisories are still present exactly as written.; evidence=.skilled/hooks/README.md:36-44, .skilled/skills/system-skill-advisor/runtime/lib/README.md:57-76, .skilled/skills/system-skill-advisor/runtime/lib/README.md:135
- iteration 3 fix_provenance (ruled_out): No later commit in the range touched a scope file.; evidence=review-scope-5b.txt:14,16,28-29,30, review-scope-5b.txt:14,16,28-29,30

### Clean Search Proof
- iteration 1 switch_bypass (ruled_out): No enable switch exists for the advisor and every listed name resolves to a disable decision.; evidence=.skilled/hooks/shared/hook-flags.cjs:104-106, .skilled/hooks/shared/hook-flags.cjs:256-271
- iteration 1 fixture_narrowing (ruled_out): The size assertion runs first and the child env assertion is exact.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:129-143
- iteration 2 switch_leak (ruled_out): Exact-set allowlist and an exact child-env assertion.; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:131-180, .skilled/bin/system-skill-advisor-launcher.cjs:312-315
- iteration 2 test_isolation (ruled_out): Per-case temp root and a missing flags file.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:51-70, .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:151-156
- iteration 2 duplicate_alias_list (ruled_out): Same defect as the iteration-1 index finding; a second finding would double-count it.; evidence=.skilled/hooks/shared/hook-flags.cjs:38-78, .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74-75
- iteration 2 prompt_leak (ruled_out): Counts only; no content printed and no reader in scope.; evidence=review-brief-5b.txt:1
- iteration 3 advisory_replay (ruled_out): Both advisories are still present exactly as written.; evidence=.skilled/hooks/README.md:36-44, .skilled/skills/system-skill-advisor/runtime/lib/README.md:57-76, .skilled/skills/system-skill-advisor/runtime/lib/README.md:135
- iteration 3 fix_provenance (ruled_out): No later commit in the range touched a scope file.; evidence=review-scope-5b.txt:14,16,28-29,30, review-scope-5b.txt:14,16,28-29,30

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; D1-D4 are covered and the run is at `maxIterations=3`. - Focus area: synthesis and the closeout record, not another dispatch. - Reason: the final iteration found no new finding; the active set is two P2 advisories, so the verdict is PASS with `hasAdvisories: true` and the legal stop reason is `maxIterationsReached`. - Rotation status: all four dimensions covered across three iterations. - Required evidence: the two finding rows, the three iteration files, the three deltas and the reducer's registry. - Recovery note: the synthesis must not claim convergence and must carry the fix-provenance note forward. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
