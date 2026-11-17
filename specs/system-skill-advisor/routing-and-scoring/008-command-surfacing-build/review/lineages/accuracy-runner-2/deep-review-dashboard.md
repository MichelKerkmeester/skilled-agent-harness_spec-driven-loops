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
- Started: 2026-11-13T11:48:49Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-accuracy-runner-2-1794570021136-noekp0
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
| P2 (Suggestions) | 12 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | correctness | correctness | 1.00 | 0/0/4 | complete |
| 3 | security | security | 1.00 | 0/0/1 | complete |
| 4 | traceability | traceability | 1.00 | 0/0/4 | complete |
| 5 | maintainability | maintainability | 1.00 | 0/0/2 | complete |
| 6 | cross-cutting stabilization | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |
| 7 | adjudication | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 1 |
| traceability | covered | 4 |
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
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 12
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
- candidateCoverage: covered=28, ruledOut=20, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 documentation_drift (ruled_out): recounted 14 code files and 21 listed entries; evidence=README.md:29, README.md:112, runtime/scripts/routing-accuracy/
- iteration 1 unverified_precondition (ruled_out): guard present and tested; evidence=run-command-behaviour.mjs:606, prepare-behaviour-arena.mjs:314, command-behaviour-guards.vitest.ts:76-89
- iteration 1 holdout_publication (ruled_out): id scan found 0 of 44 holdout ids; evidence=capture-command-routing-baseline.mjs:501, command-routing-baseline.json, command-routing-slice.vitest.ts:91-146
- iteration 1 label_drift (ruled_out): label derives from the runner table; evidence=score-command-transcripts.mjs:952-967, score-command-transcripts.mjs:31
- iteration 1 credential_exposure (ruled_out): allowlist verified by test; evidence=run-command-behaviour.mjs:828-889, command-behaviour-guards.vitest.ts:19-40
- iteration 2 command_parse (ruled_out): renderer output never places a bare word after the command; evidence=command-offer.mjs:34-67, render.ts:603-609
- iteration 2 replay_fidelity (ruled_out): design documented in the area README; evidence=README.md:71
- iteration 3 credential_exposure (ruled_out): allowlist verified; evidence=run-command-behaviour.mjs:876-889, command-behaviour-guards.vitest.ts:19-40
- iteration 3 arena_containment (ruled_out): guard present at every depth; evidence=prepare-behaviour-arena.mjs:266
- iteration 3 holdout_hygiene (ruled_out): 0 of 44 holdout ids published; evidence=score-command-transcripts.mjs:1156, capture-command-routing-baseline.mjs:501, command-routing-baseline.json
- iteration 3 holdout_hygiene (ruled_out): refusal precedes spawn; evidence=measure-brief-cost.mjs:124
- iteration 3 arena_containment (ruled_out): inherited paths are skipped and leftovers fail the run; evidence=worktree-restore.mjs:99-106
- iteration 4 metric_drift (ruled_out): five of five floors hold; evidence=command-routing-baseline.json, scorer-eval-baseline.json
- iteration 4 documentation_drift (ruled_out): chapter holds; evidence=hub-command-attachment.md:78-90
- iteration 4 corpus_integrity (ruled_out): no duplicate or missing id; evidence=labeled-prompts.jsonl, holdout-prompts.jsonl, ambiguity-prompts.jsonl, doctor-prompts.jsonl
- iteration 5 test_coverage_gap (ruled_out): covered by the restore finding; evidence=tests/worktree-restore.vitest.ts:1-122
- iteration 5 restore_completeness (ruled_out): both sides keyed; evidence=worktree-restore.mjs:54
- iteration 5 documentation_drift (ruled_out): wording consistent; evidence=advisor-corpus-parity.vitest.ts:28-34
- iteration 6 active_finding_stability (ruled_out): all twelve re-read and active; evidence=iterations/iteration-006.md
- iteration 6 coverage_gap (ruled_out): every area file read; evidence=iterations/iteration-006.md
- iteration 6 fixture_integrity (ruled_out): no duplicate or missing id; evidence=gate2-golden-prompts.jsonl, skill-advisor-regression-cases.jsonl
- iteration 6 security_fix_replay (ruled_out): 5 of 5 replay rows pass; evidence=command-behaviour-guards.vitest.ts:19-89, capture-command-routing-baseline.mjs:501
- iteration 7 duplicate_finding (ruled_out): non-duplication confirmed; evidence=review-report-pass-1.md:394-404
- iteration 7 severity_inflation (ruled_out): P2 confirmed for all twelve; evidence=iterations/iteration-007.md
- iteration 7 stale_finding (ruled_out): all twelve active; evidence=iterations/iteration-006.md

### Clean Search Proof
- iteration 1 documentation_drift (ruled_out): recounted 14 code files and 21 listed entries; evidence=README.md:29, README.md:112, runtime/scripts/routing-accuracy/
- iteration 1 unverified_precondition (ruled_out): guard present and tested; evidence=run-command-behaviour.mjs:606, prepare-behaviour-arena.mjs:314, command-behaviour-guards.vitest.ts:76-89
- iteration 1 holdout_publication (ruled_out): id scan found 0 of 44 holdout ids; evidence=capture-command-routing-baseline.mjs:501, command-routing-baseline.json, command-routing-slice.vitest.ts:91-146
- iteration 1 label_drift (ruled_out): label derives from the runner table; evidence=score-command-transcripts.mjs:952-967, score-command-transcripts.mjs:31
- iteration 1 credential_exposure (ruled_out): allowlist verified by test; evidence=run-command-behaviour.mjs:828-889, command-behaviour-guards.vitest.ts:19-40
- iteration 2 command_parse (ruled_out): renderer output never places a bare word after the command; evidence=command-offer.mjs:34-67, render.ts:603-609
- iteration 2 replay_fidelity (ruled_out): design documented in the area README; evidence=README.md:71
- iteration 3 credential_exposure (ruled_out): allowlist verified; evidence=run-command-behaviour.mjs:876-889, command-behaviour-guards.vitest.ts:19-40
- iteration 3 arena_containment (ruled_out): guard present at every depth; evidence=prepare-behaviour-arena.mjs:266
- iteration 3 holdout_hygiene (ruled_out): 0 of 44 holdout ids published; evidence=score-command-transcripts.mjs:1156, capture-command-routing-baseline.mjs:501, command-routing-baseline.json
- iteration 3 holdout_hygiene (ruled_out): refusal precedes spawn; evidence=measure-brief-cost.mjs:124
- iteration 3 arena_containment (ruled_out): inherited paths are skipped and leftovers fail the run; evidence=worktree-restore.mjs:99-106
- iteration 4 metric_drift (ruled_out): five of five floors hold; evidence=command-routing-baseline.json, scorer-eval-baseline.json
- iteration 4 documentation_drift (ruled_out): chapter holds; evidence=hub-command-attachment.md:78-90
- iteration 4 corpus_integrity (ruled_out): no duplicate or missing id; evidence=labeled-prompts.jsonl, holdout-prompts.jsonl, ambiguity-prompts.jsonl, doctor-prompts.jsonl
- iteration 5 test_coverage_gap (ruled_out): covered by the restore finding; evidence=tests/worktree-restore.vitest.ts:1-122
- iteration 5 restore_completeness (ruled_out): both sides keyed; evidence=worktree-restore.mjs:54
- iteration 5 documentation_drift (ruled_out): wording consistent; evidence=advisor-corpus-parity.vitest.ts:28-34
- iteration 6 active_finding_stability (ruled_out): all twelve re-read and active; evidence=iterations/iteration-006.md
- iteration 6 coverage_gap (ruled_out): every area file read; evidence=iterations/iteration-006.md
- iteration 6 fixture_integrity (ruled_out): no duplicate or missing id; evidence=gate2-golden-prompts.jsonl, skill-advisor-regression-cases.jsonl
- iteration 6 security_fix_replay (ruled_out): 5 of 5 replay rows pass; evidence=command-behaviour-guards.vitest.ts:19-89, capture-command-routing-baseline.mjs:501
- iteration 7 duplicate_finding (ruled_out): non-duplication confirmed; evidence=review-report-pass-1.md:394-404
- iteration 7 severity_inflation (ruled_out): P2 confirmed for all twelve; evidence=iterations/iteration-007.md
- iteration 7 stale_finding (ruled_out): all twelve active; evidence=iterations/iteration-006.md

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: compile the lineage report from the registry and the seven iteration files, then let the cross-lineage merge recompute the merged verdict - Reason: the cap is reached; no further iteration can change the active set without new evidence - Rotation status: all dimensions complete, stabilization and adjudication done - Blocked/productive carry-forward: blocked (no live arm, no graph); productive (fix replay, doc/tree comparison, restore probe) - Required evidence: the report's counts equal the registry's, and the final line is exactly one verdict Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 12 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
