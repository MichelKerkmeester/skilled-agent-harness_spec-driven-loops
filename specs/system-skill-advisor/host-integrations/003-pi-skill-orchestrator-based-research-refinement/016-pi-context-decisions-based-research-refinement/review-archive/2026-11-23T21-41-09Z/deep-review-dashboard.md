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
- Review Target: .skilled/skills/system-skill-advisor (skill)
- Started: 2026-11-23T21:02:32.908Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: scope, coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-23T21:02:32.908Z
- Parent Session: 2026-11-23T21:02:32.908Z
- Lifecycle Mode: resume
- Generation: 4
- continuedFromRun: 0

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
| P1 (Required) | 1 |
| P2 (Suggestions) | 14 |
| Resolved | 2 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/5 | complete |
| 2 | security | security | 0.58 | 0/1/2 | complete |
| 3 | traceability | traceability | 0.32 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 0.30 | 0/0/6 | complete |
| 5 | correctness (closing recheck of all 16 carried findings at HEAD) plus the unreached cache, freshness and rebuild-lock slice | correctness | 0.07 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 12 |
| security | covered | 3 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.32 -> 0.30 -> 0.07
- convergenceScore: 0.93
- openFindings: 15
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
- candidateCoverage: covered=21, ruledOut=18, deferred=4, blocked=0

### Search Debt
- iteration 2 socket_hijack (deferred): the client transport lives in .skilled/bin/lib/launcher-ipc-bridge.cjs and the shared package, both outside the declared review target; handed to the traceability pass; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1205, .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:449
- iteration 3 python_ts_parity (deferred): the permissions hold, but executing the Python/TS parity suite is outside this read-only iteration's budget; carried to maintainability; evidence=.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2167, .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2533, .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2857
- iteration 4 duplication (deferred): read-only iteration does not execute the parity suite; evidence=runtime/tests/parity/python-ts-parity.vitest.ts:41-80
- iteration 5 lifecycle_and_derived_defect_scan (deferred): budget exhausted at iteration 5 of 5; no generation of this review has read lifecycle/ or derived/; evidence=runtime/lib/derived/sync.ts, runtime/lib/lifecycle/supersession.ts

### Ruled-Out Candidates
- iteration 2 symlink_or_traversal (ruled_out): both stores enforce ownership, mode and no-follow, so the hypothesis does not reproduce; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:283, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:42
- iteration 2 injection (ruled_out): prompt travels on stdin to an argv array; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:231
- iteration 2 signal_or_pid_redirect (ruled_out): no signal other than 0 is sent from lease state; evidence=.skilled/skills/system-skill-advisor/runtime/lib/daemon/lease.ts:248
- iteration 2 secret_exposure (ruled_out): stderr is discarded and no env value is echoed into the brief; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:208
- iteration 3 contract_drift (ruled_out): 9/9 entries identical and the source suite asserts name-set plus deep schema equality; evidence=.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30
- iteration 3 socket_reach (ruled_out): live 0700 dir and 0600 socket with owner checks at bind; evidence=/tmp/system-skill-advisor, .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:449-470, .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:236-241
- iteration 4 comment_hygiene (ruled_out): no artifact identifiers found in comments under review; evidence=runtime/advisor-server.ts:103, runtime/lib/skill-graph/skill-graph-db.ts:241
- iteration 4 embedding_lane_leftovers (ruled_out): no embedding module, flag or branch survives; evidence=runtime/scripts/command-bridges/command-bridges.generated.json:2058
- iteration 4 duplication (ruled_out): split implementation over one contract, not a second copy; evidence=hooks/lib/directive-lifecycle.ts:19-33
- iteration 4 duplication (ruled_out): values are single-sourced in data; evidence=runtime/lib/prompt-policy.ts:43-63
- iteration 4 dead_code (ruled_out): test support rather than dead production code; evidence=runtime/tests/parity/python-ts-parity.vitest.ts:41
- iteration 5 stale_cache (ruled_out): key includes sourceSignature and generation, so staleness cannot be observed via this cache; evidence=runtime/lib/freshness.ts:386-391, runtime/lib/source-cache.ts:66-80
- iteration 5 missing_invalidation (ruled_out): invalidation wired on the request path and on the freshness listener; evidence=runtime/handlers/advisor-recommend.ts:528, runtime/lib/skill-advisor-brief.ts:513, runtime/lib/prompt-cache.ts:114, runtime/lib/prompt-cache.ts:168-176
- iteration 5 atomicity (ruled_out): no generation publish precedes a complete harvest; evidence=runtime/lib/skill-graph/skill-graph-db.ts:1045-1068, runtime/advisor-server.ts:161-170
- iteration 5 auth_gate_promise (ruled_out): doctrine reach calibration keeps a promise-failure at P1 regardless of impact-side arguments; evidence=runtime/advisor-server.ts:237-240, runtime/advisor-server.ts:248, .skilled/skills/sk-code/sk-code-review/references/review-core.md:55-58
- iteration 5 path_drift (ruled_out): the suite exists; only the citation prefix is wrong; evidence=feature-catalog/cli-surface/skill-advisor-cli.md:16, feature-catalog/cli-surface/skill-advisor-cli.md:61-67, feature-catalog/cli-surface/skill-advisor-cli.md:61-67

### Clean Search Proof
- iteration 2 symlink_or_traversal (ruled_out): both stores enforce ownership, mode and no-follow, so the hypothesis does not reproduce; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:283, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:42
- iteration 2 injection (ruled_out): prompt travels on stdin to an argv array; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:231
- iteration 2 signal_or_pid_redirect (ruled_out): no signal other than 0 is sent from lease state; evidence=.skilled/skills/system-skill-advisor/runtime/lib/daemon/lease.ts:248
- iteration 2 secret_exposure (ruled_out): stderr is discarded and no env value is echoed into the brief; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:208
- iteration 3 contract_drift (ruled_out): 9/9 entries identical and the source suite asserts name-set plus deep schema equality; evidence=.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30
- iteration 3 socket_reach (ruled_out): live 0700 dir and 0600 socket with owner checks at bind; evidence=/tmp/system-skill-advisor, .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:449-470, .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:236-241
- iteration 4 comment_hygiene (ruled_out): no artifact identifiers found in comments under review; evidence=runtime/advisor-server.ts:103, runtime/lib/skill-graph/skill-graph-db.ts:241
- iteration 4 embedding_lane_leftovers (ruled_out): no embedding module, flag or branch survives; evidence=runtime/scripts/command-bridges/command-bridges.generated.json:2058
- iteration 4 duplication (ruled_out): split implementation over one contract, not a second copy; evidence=hooks/lib/directive-lifecycle.ts:19-33
- iteration 4 duplication (ruled_out): values are single-sourced in data; evidence=runtime/lib/prompt-policy.ts:43-63
- iteration 4 dead_code (ruled_out): test support rather than dead production code; evidence=runtime/tests/parity/python-ts-parity.vitest.ts:41
- iteration 5 stale_cache (ruled_out): key includes sourceSignature and generation, so staleness cannot be observed via this cache; evidence=runtime/lib/freshness.ts:386-391, runtime/lib/source-cache.ts:66-80
- iteration 5 missing_invalidation (ruled_out): invalidation wired on the request path and on the freshness listener; evidence=runtime/handlers/advisor-recommend.ts:528, runtime/lib/skill-advisor-brief.ts:513, runtime/lib/prompt-cache.ts:114, runtime/lib/prompt-cache.ts:168-176
- iteration 5 atomicity (ruled_out): no generation publish precedes a complete harvest; evidence=runtime/lib/skill-graph/skill-graph-db.ts:1045-1068, runtime/advisor-server.ts:161-170
- iteration 5 auth_gate_promise (ruled_out): doctrine reach calibration keeps a promise-failure at P1 regardless of impact-side arguments; evidence=runtime/advisor-server.ts:237-240, runtime/advisor-server.ts:248, .skilled/skills/sk-code/sk-code-review/references/review-core.md:55-58
- iteration 5 path_drift (ruled_out): the suite exists; only the citation prefix is wrong; evidence=feature-catalog/cli-surface/skill-advisor-cli.md:16, feature-catalog/cli-surface/skill-advisor-cli.md:61-67, feature-catalog/cli-surface/skill-advisor-cli.md:61-67

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining (4/4 reviewed; iteration budget exhausted at 5 of 5). - Focus area: none — this was the closing pass. Remaining work belongs to remediation, not to another review iteration. - Reason: `maxIterations` reached; `stopPolicy` is `max-iterations`, so the loop stops here by configuration rather than by convergence. - Rotation status: correctness, security, traceability, maintainability all reviewed. This pass: 1 new P2, 0 new P1/P0, 1 severity re-adjudication (R2-P1-001 retained at P1), 1 finding sharpened (R3-P2-002). - Blocked/productive carry-forward: nothing was blocked this pass; the deferred slice (`lifecycle/`, `derived/`, most of `cross-skill-edges/` and `skill-graph/`) is named in the edge cases for a follow-up run. - Required evidence for remediation: a file:line fix plus a test for R2-P1-001's promise (either the comment and default agree, or the launcher comment owns the behaviour and the reference doc stops saying "authentication"); an `openSync`-then-`write` replacement plus an empty-lock test for R5-P2-001. - Recovery note: if a future pass re-runs these modules, start with `lifecycle/` and `derived/`, which no generation of this review has read.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 4 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
