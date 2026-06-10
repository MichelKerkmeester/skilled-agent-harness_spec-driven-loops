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
- Review Target: spec-143 guarded-refine-loop delta (deep-improvement Lane D + anti-Goodhart cross-lane guards + packaging-side loop hosts) (files)
- Started: 2026-06-10T06:19:24Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-06-10T06:19:24Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 2 |
| P2 (Suggestions) | 29 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory + correctness (first deep pass) | inventory/correctness | 1.00 | 0/2/5 | complete |
| run-002 | security | security | 0.13 | 0/1/7 | complete |
| run-003 | traceability | traceability | 0.38 | 0/1/5 | complete |
| run-004 | maintainability | maintainability | 0.30 | 0/0/6 | complete |
| run-005 | correctness deep pass: onboarding kit (templates, scaffolder, lint generalization) | correctness | 0.43 | 0/0/6 | complete |
| run-006 | security deep pass: dispatch surfaces (prompt injection chains, path traversal, subprocess hygiene) | security | 0.00 | 0/0/0 | complete |
| run-007 | traceability overlay protocols: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability | traceability | 0.00 | 0/0/2 | complete |
| run-008 | correctness deep pass 3: loop instance operational edge cases (resume, worktrees, deals specifics, lint filters, probes) | correctness | 0.10 | 0/0/3 | complete |
| run-009 | severity escalation review + finding deduplication | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |
| run-010 | adversarial self-check + closure verification + final verdict | correctness/security/traceability/maintainability | 0.00 | 0/0/24 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 31 |
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
- Last 3 ratios: 0.10 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 31
- persistentSameSeverity: 0
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=27, ruledOut=11, deferred=1, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 race_condition (ruled_out): retry loop provides sufficient protection for single-writer use case; evidence=Barter/Copywriter/_loop/loop.py:109-129
- iteration 1 state_transition (ruled_out): all 4 lanes have explicit sets; fallback covers shared scripts; evidence=scripts/shared/loop-host.cjs:144-160
- iteration 3 cross_reference_integrity (ruled_out): verified by cross-reference of all three surfaces; evidence=start-non-dev-ai-system-loop.md:80-81, loop-host.cjs:84-93, run-non-dev-ai-system.cjs:39-46
- iteration 6 prompt_injection (ruled_out): trusted-operator threat model; propose step is worktree-isolated; evidence=Barter/Copywriter/benchmark/run.sh:30,47,60
- iteration 6 deliverable_injection (ruled_out): JSON parser + different-family grader + no file tools on grader; evidence=Barter/Copywriter/benchmark/grader/regrade.py:54-57, assets/non_dev_ai_system/templates/grader_prompt.md.template:7-9
- iteration 6 prompt_injection (ruled_out): worktree + gates.py backstop + grader independence; evidence=Barter/Copywriter/_loop/loop.py:344,372-386,404-411
- iteration 6 path_traversal (ruled_out): operator-authored config is the trust boundary; evidence=scripts/non-dev-ai-system/init_packaging.py:136,254,345
- iteration 6 subprocess_injection (ruled_out): comprehensive subprocess audit: clean across all surfaces; evidence=Barter/Copywriter/_loop/loop.py:72-74, Barter/Copywriter/benchmark/grader/regrade.py:56-58, Barter/Copywriter/benchmark/grader/calibrate.py:25-27, scripts/shared/loop-host.cjs:296
- iteration 7 documentation_drift (ruled_out): verified by direct read comparison; evidence=SKILL.md:32-38, .opencode/agents/deep-improvement.md:46
- iteration 7 cross_runtime_drift (ruled_out): verified by direct read comparison; evidence=.opencode/agents/deep-improvement.md, .claude/agents/deep-improvement.md
- iteration 10 severity_downgrade_verification (ruled_out): path is correct for the repo structure despite naming confusion; evidence=Barter/Barter deals/_loop/loop.py:596, Barter/Barter deals/_loop/loop.py:600
- iteration 10 severity_downgrade_verification (ruled_out): immediate failure on bad config, no silent data corruption path; evidence=scripts/non-dev-ai-system/init_packaging.py:109-111, assets/non_dev_ai_system/packaging_config.schema.json:199-203

### Clean Search Proof
- iteration 1 race_condition (ruled_out): retry loop provides sufficient protection for single-writer use case; evidence=Barter/Copywriter/_loop/loop.py:109-129
- iteration 1 state_transition (ruled_out): all 4 lanes have explicit sets; fallback covers shared scripts; evidence=scripts/shared/loop-host.cjs:144-160
- iteration 3 cross_reference_integrity (ruled_out): verified by cross-reference of all three surfaces; evidence=start-non-dev-ai-system-loop.md:80-81, loop-host.cjs:84-93, run-non-dev-ai-system.cjs:39-46
- iteration 6 prompt_injection (ruled_out): trusted-operator threat model; propose step is worktree-isolated; evidence=Barter/Copywriter/benchmark/run.sh:30,47,60
- iteration 6 deliverable_injection (ruled_out): JSON parser + different-family grader + no file tools on grader; evidence=Barter/Copywriter/benchmark/grader/regrade.py:54-57, assets/non_dev_ai_system/templates/grader_prompt.md.template:7-9
- iteration 6 prompt_injection (ruled_out): worktree + gates.py backstop + grader independence; evidence=Barter/Copywriter/_loop/loop.py:344,372-386,404-411
- iteration 6 path_traversal (ruled_out): operator-authored config is the trust boundary; evidence=scripts/non-dev-ai-system/init_packaging.py:136,254,345
- iteration 6 subprocess_injection (ruled_out): comprehensive subprocess audit: clean across all surfaces; evidence=Barter/Copywriter/_loop/loop.py:72-74, Barter/Copywriter/benchmark/grader/regrade.py:56-58, Barter/Copywriter/benchmark/grader/calibrate.py:25-27, scripts/shared/loop-host.cjs:296
- iteration 7 documentation_drift (ruled_out): verified by direct read comparison; evidence=SKILL.md:32-38, .opencode/agents/deep-improvement.md:46
- iteration 7 cross_runtime_drift (ruled_out): verified by direct read comparison; evidence=.opencode/agents/deep-improvement.md, .claude/agents/deep-improvement.md
- iteration 10 severity_downgrade_verification (ruled_out): path is correct for the repo structure despite naming confusion; evidence=Barter/Barter deals/_loop/loop.py:596, Barter/Barter deals/_loop/loop.py:600
- iteration 10 severity_downgrade_verification (ruled_out): immediate failure on bad config, no silent data corruption path; evidence=scripts/non-dev-ai-system/init_packaging.py:109-111, assets/non_dev_ai_system/packaging_config.schema.json:199-203

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
