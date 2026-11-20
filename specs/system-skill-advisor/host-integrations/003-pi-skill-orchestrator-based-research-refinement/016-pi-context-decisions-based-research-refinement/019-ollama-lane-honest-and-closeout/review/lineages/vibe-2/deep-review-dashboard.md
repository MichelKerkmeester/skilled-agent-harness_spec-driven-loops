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
- Started: 2026-11-20T11:10:34.141Z
- Status: COMPLETE
- Iteration: 8 of 16
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-vibe-2-1795172940208-84a42n
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: convergence

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
| P2 (Suggestions) | 11 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-002: correctness | correctness | 1.00 | 0/1/3 | complete |
| 2 | Frontier node F-1-005: correctness | correctness | 1.00 | 0/0/2 | complete |
| 3 | Frontier node F-1-002: security | security | 1.00 | 0/0/1 | complete |
| 4 | Frontier node F-1-005: security | security | 1.00 | 0/0/1 | complete |
| 5 | Frontier node F-1-002: traceability | traceability | 1.00 | 0/0/1 | complete |
| 6 | Frontier node F-1-005: traceability | traceability | 1.00 | 0/0/1 | complete |
| 7 | Frontier node F-1-002: maintainability | maintainability | 1.00 | 0/0/1 | complete |
| 8 | Frontier node F-1-005: maintainability | maintainability | 1.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 2 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
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
- candidateCoverage: covered=20, ruledOut=18, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Early returns precede the embed and the coverage read.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:157
- iteration 2 doc_code_drift (ruled_out): fusion.ts:1284 honors laneWeightsOverride.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:331
- iteration 2 doc_code_drift (ruled_out): Line 149 forbids STATUS=FAIL on a zero lane weight.; evidence=.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:149
- iteration 3 env_leak (ruled_out): No secret key appears in the allowlist.; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:120
- iteration 3 resource_exhaustion (ruled_out): AbortController signal passed to fetch.; evidence=.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:142
- iteration 3 race_condition (ruled_out): The window is synchronous.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236
- iteration 4 prompt_injection (ruled_out): No raw prompt text survives the mapping.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:168, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:225
- iteration 4 information_disclosure (ruled_out): Both emission sites are gated.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:534
- iteration 4 untrusted_input (ruled_out): Citations are accurate.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:27
- iteration 5 unchecked_test (ruled_out): The argument is the emitted text under its new local name.; evidence=.opencode/plugins/tests/system-skill-advisor.test.cjs:1071, .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:535
- iteration 5 unchecked_test (ruled_out): The expected value is derived from the test file, not from the nudge.; evidence=.skilled/hooks/session-handover/pi/session-handover.test.ts:46
- iteration 5 stale_citation (ruled_out): The cited tests assert the claimed behavior.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts:305, .skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts:11
- iteration 6 unsupported_claim (ruled_out): The leaf states the shipped behavior.; evidence=.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:22
- iteration 6 contradictory_doc (ruled_out): The playbook matches the decision.; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:60
- iteration 6 unsupported_claim (ruled_out): No number to drift.; evidence=INSTALL-SKILLED.md:88
- iteration 7 implicit_invariant (ruled_out): The window is synchronous.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236
- iteration 7 dead_code (ruled_out): Consumed by the cosine test.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245
- iteration 8 index_drift (ruled_out): No drift.; evidence=.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:29
- iteration 8 broken_reference (ruled_out): Reference resolves.; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:281
- iteration 8 stale_measurement (ruled_out): Numbers are current.; evidence=.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:33

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Early returns precede the embed and the coverage read.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:157
- iteration 2 doc_code_drift (ruled_out): fusion.ts:1284 honors laneWeightsOverride.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:331
- iteration 2 doc_code_drift (ruled_out): Line 149 forbids STATUS=FAIL on a zero lane weight.; evidence=.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:149
- iteration 3 env_leak (ruled_out): No secret key appears in the allowlist.; evidence=.skilled/bin/system-skill-advisor-launcher.cjs:120
- iteration 3 resource_exhaustion (ruled_out): AbortController signal passed to fetch.; evidence=.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:142
- iteration 3 race_condition (ruled_out): The window is synchronous.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236
- iteration 4 prompt_injection (ruled_out): No raw prompt text survives the mapping.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:168, .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:225
- iteration 4 information_disclosure (ruled_out): Both emission sites are gated.; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:534
- iteration 4 untrusted_input (ruled_out): Citations are accurate.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:27
- iteration 5 unchecked_test (ruled_out): The argument is the emitted text under its new local name.; evidence=.opencode/plugins/tests/system-skill-advisor.test.cjs:1071, .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:535
- iteration 5 unchecked_test (ruled_out): The expected value is derived from the test file, not from the nudge.; evidence=.skilled/hooks/session-handover/pi/session-handover.test.ts:46
- iteration 5 stale_citation (ruled_out): The cited tests assert the claimed behavior.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts:305, .skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts:11
- iteration 6 unsupported_claim (ruled_out): The leaf states the shipped behavior.; evidence=.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:22
- iteration 6 contradictory_doc (ruled_out): The playbook matches the decision.; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:60
- iteration 6 unsupported_claim (ruled_out): No number to drift.; evidence=INSTALL-SKILLED.md:88
- iteration 7 implicit_invariant (ruled_out): The window is synchronous.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236
- iteration 7 dead_code (ruled_out): Consumed by the cosine test.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245
- iteration 8 index_drift (ruled_out): No drift.; evidence=.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:29
- iteration 8 broken_reference (ruled_out): Reference resolves.; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:281
- iteration 8 stale_measurement (ruled_out): Numbers are current.; evidence=.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:33

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
- Dimension: none remaining. All four configured dimensions are covered and both frontier nodes are answered. - Focus area: synthesis. - Reason: the run reached legal convergence at iteration 7 and this iteration closed the last open frontier dimension. - Rotation status: F-1-002 all four dimensions complete; F-1-005 all four dimensions complete. - Blocked/productive carry-forward: productive — reading the older changelog for the same claim found the duplication the single-file findings missed. - Required evidence: the findings registry and the eight iteration artifacts, for synthesis. - Recovery note: none. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
