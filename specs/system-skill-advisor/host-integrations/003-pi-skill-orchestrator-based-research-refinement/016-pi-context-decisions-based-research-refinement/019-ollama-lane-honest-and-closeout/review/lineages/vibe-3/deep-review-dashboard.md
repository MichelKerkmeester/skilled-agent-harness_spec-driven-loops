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
- Started: 2026-11-20T11:10:17.419Z
- Status: COMPLETE
- Iteration: 10 of 16
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-vibe-3-1795172940208-84a42n
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-003: correctness | correctness | 1.00 | 0/1/1 | complete |
| 2 | Frontier node F-1-006: correctness | correctness | 1.00 | 0/0/1 | complete |
| 3 | Frontier node F-1-003: security | security | 0.00 | 0/0/0 | complete |
| 4 | Frontier node F-1-006: security | security | 0.00 | 0/0/0 | complete |
| 5 | Frontier node F-1-003: traceability | traceability | 0.00 | 0/0/0 | complete |
| 6 | Frontier node F-1-006: traceability | traceability | 1.00 | 0/1/0 | complete |
| 7 | Frontier node F-1-003: maintainability | maintainability | 1.00 | 0/0/0 | complete |
| 8 | Frontier node F-1-006: maintainability | maintainability | 1.00 | 0/0/0 | complete |
| 9 | Cross-reference fallback: shipped changelog against the packet ablation record | traceability | 1.00 | 0/0/0 | complete |
| 10 | Cross-reference fallback: documented environment variables against the code that reads them | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 0 |
| traceability | covered | 1 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 0.00
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
- graphCoverageMode: graph
- candidateCoverage: covered=25, ruledOut=16, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read of both intervals; evidence=system-skill-advisor-launcher.cjs:1558, liveness.ts:18
- iteration 1 state_transition (ruled_out): verified by direct read of both resolvers; evidence=generation.ts:55, system-skill-advisor-launcher.cjs:24
- iteration 2 wrong_routing (ruled_out): verified by exact search of the router vocabulary; evidence=hub-router.json:254
- iteration 2 duplicate_write (ruled_out): verified by reading the Q rows of all three records; evidence=specs/sk-code/verification-guards/005-surface-intent-fold-declaration/decision-record.md:37
- iteration 2 pii_leak (ruled_out): verified by pattern scan of every added line; evidence=specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard/decision-record.md:1032
- iteration 3 secret_exposure (ruled_out): verified with git check-ignore; evidence=.gitignore:25
- iteration 3 privilege_escalation (ruled_out): verified by direct read; evidence=ollama.ts:125
- iteration 3 path_traversal (ruled_out): verified by direct read; evidence=advisor-status.ts:177
- iteration 4 wrong_routing (ruled_out): verified by reading the router policy; evidence=hub-router.json
- iteration 4 secret_exposure (ruled_out): verified by pattern scan and by reading the writer; evidence=decision-record-writer.js:401
- iteration 4 pii_leak (ruled_out): verified by pattern scan; evidence=specs/**/decision-record.md
- iteration 5 doc_code_drift (ruled_out): verified by direct read; evidence=advisor-server.ts:439
- iteration 5 unmet_criterion (ruled_out): verified by exact search; evidence=acceptance-criteria.md:75
- iteration 6 dedup_collision (ruled_out): verified by direct read; evidence=resume-ladder.js:508
- iteration 6 doc_code_drift (ruled_out): verified by git log; evidence=git log 2f5fe41bb9e~1..aaaff7dd9df
- iteration 7 naming_collision (ruled_out): verified by direct read; evidence=system-skill-advisor-launcher.cjs:1554
- iteration 8 unguarded_duplication (ruled_out): verified by direct read of the workflow and the symlink target; evidence=.github/workflows/routing-registry-drift.yml:243
- iteration 8 template_default (ruled_out): verified by counting the same value across the pre-existing records; evidence=specs/agents/006-agent-contract-and-registry-alignment/decision-record.md:20
- iteration 9 doc_code_drift (ruled_out): verified by reading every row; evidence=acceptance-criteria.md:56, acceptance-criteria.md:68
- iteration 10 documented_default_drift (ruled_out): verified by direct read of both sides; evidence=ENV-REFERENCE.md:394, ollama.ts:99
- iteration 10 passthrough_gap (ruled_out): verified by direct read; evidence=system-skill-advisor-launcher.cjs:171, system-skill-advisor-launcher.cjs:185
- iteration 10 undocumented_variable (ruled_out): verified by reading every row; evidence=acceptance-criteria.md:56, acceptance-criteria.md:68

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read of both intervals; evidence=system-skill-advisor-launcher.cjs:1558, liveness.ts:18
- iteration 1 state_transition (ruled_out): verified by direct read of both resolvers; evidence=generation.ts:55, system-skill-advisor-launcher.cjs:24
- iteration 2 wrong_routing (ruled_out): verified by exact search of the router vocabulary; evidence=hub-router.json:254
- iteration 2 duplicate_write (ruled_out): verified by reading the Q rows of all three records; evidence=specs/sk-code/verification-guards/005-surface-intent-fold-declaration/decision-record.md:37
- iteration 2 pii_leak (ruled_out): verified by pattern scan of every added line; evidence=specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard/decision-record.md:1032
- iteration 3 secret_exposure (ruled_out): verified with git check-ignore; evidence=.gitignore:25
- iteration 3 privilege_escalation (ruled_out): verified by direct read; evidence=ollama.ts:125
- iteration 3 path_traversal (ruled_out): verified by direct read; evidence=advisor-status.ts:177
- iteration 4 wrong_routing (ruled_out): verified by reading the router policy; evidence=hub-router.json
- iteration 4 secret_exposure (ruled_out): verified by pattern scan and by reading the writer; evidence=decision-record-writer.js:401
- iteration 4 pii_leak (ruled_out): verified by pattern scan; evidence=specs/**/decision-record.md
- iteration 5 doc_code_drift (ruled_out): verified by direct read; evidence=advisor-server.ts:439
- iteration 5 unmet_criterion (ruled_out): verified by exact search; evidence=acceptance-criteria.md:75
- iteration 6 dedup_collision (ruled_out): verified by direct read; evidence=resume-ladder.js:508
- iteration 6 doc_code_drift (ruled_out): verified by git log; evidence=git log 2f5fe41bb9e~1..aaaff7dd9df
- iteration 7 naming_collision (ruled_out): verified by direct read; evidence=system-skill-advisor-launcher.cjs:1554
- iteration 8 unguarded_duplication (ruled_out): verified by direct read of the workflow and the symlink target; evidence=.github/workflows/routing-registry-drift.yml:243
- iteration 8 template_default (ruled_out): verified by counting the same value across the pre-existing records; evidence=specs/agents/006-agent-contract-and-registry-alignment/decision-record.md:20
- iteration 9 doc_code_drift (ruled_out): verified by reading every row; evidence=acceptance-criteria.md:56, acceptance-criteria.md:68
- iteration 10 documented_default_drift (ruled_out): verified by direct read of both sides; evidence=ENV-REFERENCE.md:394, ollama.ts:99
- iteration 10 passthrough_gap (ruled_out): verified by direct read; evidence=system-skill-advisor-launcher.cjs:171, system-skill-advisor-launcher.cjs:185
- iteration 10 undocumented_variable (ruled_out): verified by reading every row; evidence=acceptance-criteria.md:56, acceptance-criteria.md:68

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 2 nodes (0 open, 0 active, 2 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 8 of 8 iterations spent
- Budget depth2: 0 of 5.6 iterations spent
- Budget depth3: 0 of 8 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: the frontier is drained, all four dimensions are covered, and two cross-reference passes have run - Rotation status: F-1-003 4 of 4, F-1-006 4 of 4, cross-reference 2 of 2 - Blocked/productive carry-forward: clean -- the env-var surface produced no finding - Required evidence: none; synthesis reads the registry and the ten iteration files - Recovery note: none Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
