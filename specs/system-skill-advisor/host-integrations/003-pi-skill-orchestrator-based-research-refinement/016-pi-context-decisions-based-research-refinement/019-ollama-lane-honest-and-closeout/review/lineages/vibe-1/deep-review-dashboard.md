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
- Review Target: .skilled/skills/system-skill-advisor .skilled/bin/system-skill-advisor-launcher.cjs .skilled/bin/launcher-heartbeat-watchdog.vitest.ts .skilled/bin/launcher-threshold-env.vitest.ts .skilled/commands/doctor/assets .skilled/commands/create/assets .skilled/changelog/skilled/v4.1.0.0.md .skilled/skills/sk-doc/hub-router.json .skilled/skills/sk-doc/sk-create-readme/SKILL.md .skilled/hooks/session-handover/pi/session-handover.test.ts .opencode/plugins/tests/system-skill-advisor.test.cjs .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md .github/workflows/skill-advisor-stress.yml .env.example INSTALL-SKILLED.md README.md specs/**/decision-record.md (files)
- Started: 2026-11-20T11:10:31Z
- Status: COMPLETE
- Iteration: 5 of 16
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-vibe-1-1795172940208-84a42n
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged: weighted new-finding ratio 0.08 below the 0.10 threshold with all four dimensions covered; frontier not drained because this executor may not write the node store

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
| P1 (Required) | 3 |
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-001: correctness | correctness | 1.00 | 0/2/2 | complete |
| 2 | Frontier node F-1-004: correctness | correctness | 0.50 | 0/1/1 | complete |
| 3 | security | security | 0.25 | 0/0/2 | complete |
| 4 | traceability | traceability | 0.09 | 0/0/2 | complete |
| 5 | maintainability | maintainability | 0.08 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 0 |
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
- Last 3 ratios: 0.25 -> 0.09 -> 0.08
- convergenceScore: 0.92
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
- graphCoverageMode: none
- candidateCoverage: covered=0, ruledOut=0, deferred=2, blocked=0

### Search Debt
- iteration 0 frontier:F-1-001 (deferred): frontier node open; evidence=frontier-nodes.jsonl#F-1-001
- iteration 0 frontier:F-1-004 (deferred): frontier node open; evidence=frontier-nodes.jsonl#F-1-004

### Ruled-Out Candidates
[None yet]

### Clean Search Proof
[None yet]

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 2 nodes (2 open, 0 active, 0 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 2 of 8 iterations spent
- Budget depth2: 0 of 5.6 iterations spent
- Budget depth3: 0 of 8 iterations spent
- Active node: F-1-001 (security)

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Frontier node F-1-001 (depth 1, scope .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts, .skilled/skills/system-skill-advisor/runtime/advisor-server.ts, .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts, .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-in-background.vitest.ts): Vector refresh lifecycle: is the background refresh single-flight, can it overlap a watcher reindex or a second refresh, does an Ollama outage mid-refresh keep the old vectors, and can a refresh block, crash or leak in the daemon? - review the security dimension

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
