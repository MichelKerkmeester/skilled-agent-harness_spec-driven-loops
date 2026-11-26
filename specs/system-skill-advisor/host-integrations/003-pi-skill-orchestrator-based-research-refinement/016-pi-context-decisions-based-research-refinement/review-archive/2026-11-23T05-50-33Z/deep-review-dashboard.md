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
- Review Target: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts,.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts,.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts,.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs,.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts,.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts,.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts,.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts,.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts,.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts,.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts,.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py,.skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts,.skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs,.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-brief-producer.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts,.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py,.skilled/skills/system-skill-advisor/runtime/tests/fixtures/pasted-reply-strip-cases.json (files)
- Started: 2026-11-19T04:18:26.591Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-11-19T04:18:26.591Z
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
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/4 | complete |
| 2 | security | security | 0.20 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.17 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.25 | 0/0/2 | complete |
| 5 | correctness stabilization: reconfirm 8 P2s, sweep least-read files | correctness | 0.11 | 0/0/9 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 1 |
| traceability | covered | 1 |
| maintainability | covered | 2 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.85
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.17 -> 0.25 -> 0.11
- convergenceScore: 0.89
- openFindings: 9
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
- candidateCoverage: covered=9, ruledOut=13, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 parity_drift (ruled_out): verified by direct read and passing parity tests; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4803, .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:245
- iteration 1 crash_path_double_dedup (ruled_out): emitDiagnostic and observeEmittedAdvisorPolicy swallow errors; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:277, .skilled/skills/system-skill-advisor/runtime/lib/render.ts:469
- iteration 2 shared_temp_dir_trust (ruled_out): verified by direct read and existing tests; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:283, .skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts:230
- iteration 2 subprocess_argv_exposure (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:233
- iteration 2 error_detail_leak (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:624
- iteration 2 prompt_injection_routing (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:245
- iteration 3 unreached_contract_field (ruled_out): only tests set the field; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:249, .opencode/plugins/system-skill-advisor.js:890
- iteration 3 spec_code_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:77, .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:116, .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:305
- iteration 4 twin_drift (ruled_out): shared fixture read by vitest and Python suites; evidence=.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts:25, .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2538
- iteration 4 weak_test (ruled_out): measured on shipped dist; evidence=.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:1116
- iteration 5 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1481
- iteration 5 idempotence (ruled_out): probed on dist; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:265
- iteration 5 race (ruled_out): inference only, negligible window; evidence=.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:187

### Clean Search Proof
- iteration 1 parity_drift (ruled_out): verified by direct read and passing parity tests; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4803, .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:245
- iteration 1 crash_path_double_dedup (ruled_out): emitDiagnostic and observeEmittedAdvisorPolicy swallow errors; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:277, .skilled/skills/system-skill-advisor/runtime/lib/render.ts:469
- iteration 2 shared_temp_dir_trust (ruled_out): verified by direct read and existing tests; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:283, .skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts:230
- iteration 2 subprocess_argv_exposure (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:233
- iteration 2 error_detail_leak (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:624
- iteration 2 prompt_injection_routing (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:245
- iteration 3 unreached_contract_field (ruled_out): only tests set the field; evidence=.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:249, .opencode/plugins/system-skill-advisor.js:890
- iteration 3 spec_code_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:77, .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:116, .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:305
- iteration 4 twin_drift (ruled_out): shared fixture read by vitest and Python suites; evidence=.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts:25, .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2538
- iteration 4 weak_test (ruled_out): measured on shipped dist; evidence=.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:1116
- iteration 5 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1481
- iteration 5 idempotence (ruled_out): probed on dist; evidence=.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:265
- iteration 5 race (ruled_out): inference only, negligible window; evidence=.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:187

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. This is the last iteration; synthesis follows. - Focus area: synthesis over 9 active P2s (R1-P2-001..004, R2-P2-001, R3-P2-001, R4-P2-001/002, R5-P2-001). - Reason: max-iterations stop policy reached. - Rotation status: all four dimensions covered, plus one stabilization pass. - Blocked/productive carry-forward: probing on the dist stayed productive. Do not retry strip idempotence or the floor-staleness check. - Required evidence: none outstanding. Fix ordering: make TASK_MARKER linear (R2-P2-001) before moving the 64 KiB cut (R1-P2-001). Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 9 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
