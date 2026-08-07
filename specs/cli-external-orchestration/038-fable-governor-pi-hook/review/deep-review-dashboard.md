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
- Review Target: .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook (spec-folder)
- Started: 2026-08-05T07:41:16.505Z
- Status: INITIALIZED
- Iteration: 2 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: review-1785915676506
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 0/1/0 | complete |
| review-i2-g1 | security | security | 1.00 | 0/2/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 0 |
| traceability | pending | 0 |
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
- Last 3 ratios: 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 3
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
- candidateCoverage: covered=8, ruledOut=5, deferred=3, blocked=0

### Search Debt
- iteration 1 receipt_pair_binding (deferred): Not enough direct inspection was performed in iteration 1 to make a severity call.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:1
- iteration 1 write_containment_boundary (deferred): Reserved for a later correctness or security iteration.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1
- iteration 2 containment_fail_open (deferred): Resolve against the supported execution-environment contract and decide whether this boundary must fail closed in the next security/traceability pass.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1-13, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:270-275, .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2418-2423

### Ruled-Out Candidates
- iteration 1 raw_input_capture_order (ruled_out): The factory tests cover both handler orders and session mismatch denial.; evidence=.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:148-190, .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:211-237
- iteration 1 hard_rule_fail_open (ruled_out): The implementation and focused tests agree on the non-blocking failure policy.; evidence=.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:119-126, .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:50-58
- iteration 2 advisor_prompt_injection (ruled_out): The reviewed renderer, bridge, contract, and tests constrain injected labels and fixed directives; revisit if the compiled hook returns free-form text outside that contract.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:91-106, .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-210, .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:168-205
- iteration 2 receipt_secret_exposure (ruled_out): No secret sink was found in the in-scope producer or bridge; this does not resolve the separate authenticity failure.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:435-481, .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:58-91
- iteration 2 unsafe_receipt_deserialization (ruled_out): No unsafe deserialization sink was found in the reviewed receipt path.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:795-870, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:748-970

### Clean Search Proof
- iteration 1 raw_input_capture_order (ruled_out): The factory tests cover both handler orders and session mismatch denial.; evidence=.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:148-190, .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts:211-237
- iteration 1 hard_rule_fail_open (ruled_out): The implementation and focused tests agree on the non-blocking failure policy.; evidence=.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:119-126, .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:50-58
- iteration 2 advisor_prompt_injection (ruled_out): The reviewed renderer, bridge, contract, and tests constrain injected labels and fixed directives; revisit if the compiled hook returns free-form text outside that contract.; evidence=.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:91-106, .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:163-210, .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:168-205
- iteration 2 receipt_secret_exposure (ruled_out): No secret sink was found in the in-scope producer or bridge; this does not resolve the separate authenticity failure.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:435-481, .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:58-91
- iteration 2 unsafe_receipt_deserialization (ruled_out): No unsafe deserialization sink was found in the reviewed receipt path.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:795-870, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:748-970

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
traceability

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
