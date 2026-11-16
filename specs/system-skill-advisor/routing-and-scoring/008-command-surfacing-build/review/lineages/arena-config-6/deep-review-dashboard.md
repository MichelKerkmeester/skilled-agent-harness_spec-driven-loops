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
- Started: 2026-11-16T08:08:13.000Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-arena-config-6-1794815529929-dybl7p
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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | traceability | traceability | 0.33 | 0/0/1 | complete |
| 3 | maintainability | maintainability/security | 0.40 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
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
- Last 3 ratios: 1.00 -> 0.33 -> 0.40
- convergenceScore: 0.60
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
- candidateCoverage: covered=5, ruledOut=6, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 input_size_overflow (ruled_out): reproduced the overflow at the default cap and its absence at 512 MiB; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:148
- iteration 1 socket_path_length (ruled_out): no socket path in this runtime resolves under tmpdir(); evidence=.skilled/bin/lib/launcher-ipc-bridge.cjs:31
- iteration 2 second_entry_point (ruled_out): the workflow's default step reads vitest.config.ts, which carries the block; evidence=.github/workflows/skill-advisor-stress.yml:95
- iteration 2 checklist_evidence_gap (ruled_out): T043 records the ok:true build and the marker contents; evidence=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:164
- iteration 3 private_temp_mode (ruled_out): observed mode 0700 and unchanged writer modes; evidence=.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14, .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:456
- iteration 3 dotenv_copy_filter (ruled_out): unchanged filter on a path the diff does not modify; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:484

### Clean Search Proof
- iteration 1 input_size_overflow (ruled_out): reproduced the overflow at the default cap and its absence at 512 MiB; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:148
- iteration 1 socket_path_length (ruled_out): no socket path in this runtime resolves under tmpdir(); evidence=.skilled/bin/lib/launcher-ipc-bridge.cjs:31
- iteration 2 second_entry_point (ruled_out): the workflow's default step reads vitest.config.ts, which carries the block; evidence=.github/workflows/skill-advisor-stress.yml:95
- iteration 2 checklist_evidence_gap (ruled_out): T043 records the ok:true build and the marker contents; evidence=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:164
- iteration 3 private_temp_mode (ruled_out): observed mode 0700 and unchanged writer modes; evidence=.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14, .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:456
- iteration 3 dotenv_copy_filter (ruled_out): unchanged filter on a path the diff does not modify; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:484

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. - Focus area: synthesis only. - Reason: `maxIterations=3` is reached with correctness, traceability, maintainability and a security read of the changed boundaries covered; no active P0 or P1. - Rotation status: complete. - Blocked/productive carry-forward: productive — the packet's own blocked-run note supplied the concrete input for the failure-code advisory. - Required evidence: the terminal convergence decision, the finding registry, and the synthesis report. - Recovery note: none; no failed iteration. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
