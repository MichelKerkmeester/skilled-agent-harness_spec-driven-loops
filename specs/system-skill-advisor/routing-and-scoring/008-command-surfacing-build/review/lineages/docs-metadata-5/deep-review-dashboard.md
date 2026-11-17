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
- Started: 2026-11-15T16:45:27.000Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-docs-metadata-5-1794760565927-i99t40
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
| 1 | traceability | traceability | 1.00 | 0/0/6 | complete |
| 2 | maintainability | maintainability | 0.14 | 0/0/1 | complete |
| 3 | correctness | correctness | 0.13 | 0/0/1 | complete |
| 4 | security | security | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 0 |
| traceability | covered | 2 |
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
- Last 3 ratios: 0.14 -> 0.13 -> 0.00
- convergenceScore: 1.00
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
- candidateCoverage: covered=7, ruledOut=13, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 link_rot (ruled_out): all relative link targets resolve on disk; evidence=doctor-command-routing.md:69
- iteration 1 unsupported_behavior_claim (ruled_out): each claim matches the named code path; evidence=hook-flags.cjs:157, command-attach.ts:208, command-attach.ts:294
- iteration 1 graph_drift (ruled_out): signals and enhance edges match exactly; evidence=graph-metadata.json:1, skill-graph.json:1
- iteration 1 stale_line_anchor (ruled_out): every cited line anchor resolves to the named declaration; evidence=advisor-recommend.md:35
- iteration 2 missing_inventory_entry (ruled_out): every named subfolder and key file exists; the defect is omission, not invention; evidence=.skilled/skills/system-skill-advisor/runtime/tests/README.md:56
- iteration 2 broken_path_reference (ruled_out): the central playbook target resolves; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:303
- iteration 3 offer_counted_without_offer (ruled_out): the ask path requires an observed offer and wait; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:926
- iteration 3 load_counted_without_load (ruled_out): both numerator paths require a witnessed load; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1863
- iteration 3 journal_scoring_divergence (ruled_out): Vibe records are normalized into the same event stream and path function; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1645
- iteration 4 holdout_leak (ruled_out): counts only; no holdout row is named or quoted; evidence=.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:188
- iteration 4 prompt_text_in_docs (ruled_out): the record schema and the sample carry no prompt text; evidence=.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:442, .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:62
- iteration 4 kill_switch_bypass (ruled_out): the switch is answered before any daemon or scorer work; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1540
- iteration 4 daemon_switch_forwarding (ruled_out): an allowlist with no disable key keeps the switch per-caller; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:131

### Clean Search Proof
- iteration 1 link_rot (ruled_out): all relative link targets resolve on disk; evidence=doctor-command-routing.md:69
- iteration 1 unsupported_behavior_claim (ruled_out): each claim matches the named code path; evidence=hook-flags.cjs:157, command-attach.ts:208, command-attach.ts:294
- iteration 1 graph_drift (ruled_out): signals and enhance edges match exactly; evidence=graph-metadata.json:1, skill-graph.json:1
- iteration 1 stale_line_anchor (ruled_out): every cited line anchor resolves to the named declaration; evidence=advisor-recommend.md:35
- iteration 2 missing_inventory_entry (ruled_out): every named subfolder and key file exists; the defect is omission, not invention; evidence=.skilled/skills/system-skill-advisor/runtime/tests/README.md:56
- iteration 2 broken_path_reference (ruled_out): the central playbook target resolves; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:303
- iteration 3 offer_counted_without_offer (ruled_out): the ask path requires an observed offer and wait; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:926
- iteration 3 load_counted_without_load (ruled_out): both numerator paths require a witnessed load; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1863
- iteration 3 journal_scoring_divergence (ruled_out): Vibe records are normalized into the same event stream and path function; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1645
- iteration 4 holdout_leak (ruled_out): counts only; no holdout row is named or quoted; evidence=.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:188
- iteration 4 prompt_text_in_docs (ruled_out): the record schema and the sample carry no prompt text; evidence=.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:442, .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:62
- iteration 4 kill_switch_bypass (ruled_out): the switch is answered before any daemon or scorer work; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1540
- iteration 4 daemon_switch_forwarding (ruled_out): an allowlist with no disable key keeps the switch per-caller; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:131

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All four configured dimensions have a full iteration. - Focus area: synthesis only. - Reason: `maxIterations=4` is reached with all dimensions covered and no active P0 or P1. - Rotation status: complete. - Blocked/productive carry-forward: none. - Required evidence: the terminal convergence decision and the finding registry. - Recovery note: none; no failed iteration. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 8 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
