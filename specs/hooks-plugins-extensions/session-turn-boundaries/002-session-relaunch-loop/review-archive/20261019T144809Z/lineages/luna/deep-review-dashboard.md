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
- Review Target: specs/hooks/023-session-relaunch-loop (spec-folder)
- Started: 2026-10-18T18:54:37Z
- Status: INITIALIZED
- Iteration: 7 of 3
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-luna-1792349322065-8lohfl
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 0.67 | 0/0/3 | complete |
| 3 | traceability | traceability | 0.40 | 0/0/5 | complete |
| 2 | security | security | 0.67 | 0/0/3 | complete |
| 3 | traceability | traceability | 0.40 | 0/0/5 | complete |
| 2 | security | security | 1.00 | 0/0/2 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 2 |
| traceability | covered | 2 |
| maintainability | pending | 0 |

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
- Last 3 ratios: 0.40 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 5
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
- candidateCoverage: covered=6, ruledOut=9, deferred=0, blocked=1

### Search Debt
- iteration 1 graph_backed_coverage (blocked): The lineage-only write boundary prevents the packet-level graph-seed step.; evidence=.skilled/skills/system-deep-loop/commands/deep/assets/deep-review-auto.yaml, specs/hooks/023-session-relaunch-loop/review/lineages/luna/deep-review-config.json

### Ruled-Out Candidates
- iteration 1 append_concurrency (ruled_out): No race was identified in the inspected append-mode path for complete writes.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:567-581, .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:749-779
- iteration 1 partial_tail_recovery (ruled_out): The next append is separated from the previous unterminated tail.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:571-585, .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:781-810
- iteration 1 state_directory_permissions (ruled_out): No incorrect mode was identified in the inspected create/reuse path.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:42-46, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1392-1415
- iteration 2 UNKNOWN (ruled_out): No static path escape was found in the checked entry path.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71-135, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1267-1274
- iteration 2 UNKNOWN (ruled_out): No double-takeover path was identified for the inspected scenario.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:285-388, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1074-1112
- iteration 2 UNKNOWN (ruled_out): The transcript-disappearance path returns before SIGTERM.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:157-176, .skilled/hooks/session-relaunch/tests/killer.test.cjs:958-982
- iteration 3 UNKNOWN (ruled_out): No broken reference was found in this AC-001 evidence chain.; evidence=specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md:54, specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:429-456
- iteration 3 UNKNOWN (ruled_out): The content is consistent; the remaining defect is its path in the declared dependency.; evidence=specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md:1-15, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/deep-review-findings-registry.json:1
- iteration 2 handoff_path_escape (ruled_out): No static path escape was found in the checked entry path.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71-135, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1267-1274
- iteration 2 stale_lock_takeover_race (ruled_out): No double-takeover path was identified for the inspected scenario.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:285-388, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1074-1112
- iteration 2 transcript_disappearance_signal (ruled_out): The transcript-disappearance path returns before SIGTERM.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:157-176, .skilled/hooks/session-relaunch/tests/killer.test.cjs:958-982
- iteration 3 acceptance_evidence_links (ruled_out): No broken reference was found in this AC-001 evidence chain.; evidence=specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md:54, specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:429-456
- iteration 3 archived_report_registry_alignment (ruled_out): The content is consistent; the remaining defect is its path in the declared dependency.; evidence=specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md:1-15, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/deep-review-findings-registry.json:1
- iteration 2 handoff_path_escape (ruled_out): No static path escape was found in the checked entry path.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71-135, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1267-1274
- iteration 2 stale_lock_takeover_race (ruled_out): No double-takeover path was identified for the inspected scenario.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:285-388, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1074-1112
- iteration 2 transcript_disappearance_signal (ruled_out): The transcript-disappearance path returns before SIGTERM.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:157-176, .skilled/hooks/session-relaunch/tests/killer.test.cjs:958-982
- iteration 3 acceptance_evidence_links (ruled_out): No broken reference was found in this AC-001 evidence chain.; evidence=specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md:54, specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:429-456
- iteration 3 archived_report_registry_alignment (ruled_out): The content is consistent; the remaining defect is its path in the declared dependency.; evidence=specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md:1-15, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/deep-review-findings-registry.json:1

### Clean Search Proof
- iteration 1 append_concurrency (ruled_out): No race was identified in the inspected append-mode path for complete writes.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:567-581, .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:749-779
- iteration 1 partial_tail_recovery (ruled_out): The next append is separated from the previous unterminated tail.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:571-585, .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:781-810
- iteration 1 state_directory_permissions (ruled_out): No incorrect mode was identified in the inspected create/reuse path.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:42-46, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1392-1415
- iteration 2 UNKNOWN (ruled_out): No static path escape was found in the checked entry path.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71-135, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1267-1274
- iteration 2 UNKNOWN (ruled_out): No double-takeover path was identified for the inspected scenario.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:285-388, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1074-1112
- iteration 2 UNKNOWN (ruled_out): The transcript-disappearance path returns before SIGTERM.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:157-176, .skilled/hooks/session-relaunch/tests/killer.test.cjs:958-982
- iteration 3 UNKNOWN (ruled_out): No broken reference was found in this AC-001 evidence chain.; evidence=specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md:54, specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:429-456
- iteration 3 UNKNOWN (ruled_out): The content is consistent; the remaining defect is its path in the declared dependency.; evidence=specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md:1-15, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/deep-review-findings-registry.json:1
- iteration 2 handoff_path_escape (ruled_out): No static path escape was found in the checked entry path.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71-135, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1267-1274
- iteration 2 stale_lock_takeover_race (ruled_out): No double-takeover path was identified for the inspected scenario.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:285-388, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1074-1112
- iteration 2 transcript_disappearance_signal (ruled_out): The transcript-disappearance path returns before SIGTERM.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:157-176, .skilled/hooks/session-relaunch/tests/killer.test.cjs:958-982
- iteration 3 acceptance_evidence_links (ruled_out): No broken reference was found in this AC-001 evidence chain.; evidence=specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md:54, specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:429-456
- iteration 3 archived_report_registry_alignment (ruled_out): The content is consistent; the remaining defect is its path in the declared dependency.; evidence=specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md:1-15, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/deep-review-findings-registry.json:1
- iteration 2 handoff_path_escape (ruled_out): No static path escape was found in the checked entry path.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71-135, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1267-1274
- iteration 2 stale_lock_takeover_race (ruled_out): No double-takeover path was identified for the inspected scenario.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:285-388, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1074-1112
- iteration 2 transcript_disappearance_signal (ruled_out): The transcript-disappearance path returns before SIGTERM.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:157-176, .skilled/hooks/session-relaunch/tests/killer.test.cjs:958-982
- iteration 3 acceptance_evidence_links (ruled_out): No broken reference was found in this AC-001 evidence chain.; evidence=specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md:54, specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:429-456
- iteration 3 archived_report_registry_alignment (ruled_out): The content is consistent; the remaining defect is its path in the declared dependency.; evidence=specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/review-report.md:1-15, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/deep-review-findings-registry.json:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Trace packet requirements, phase summaries, and evidence links against the implementation and this lineage's findings; inspect claims that may be stale or unsupported.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
