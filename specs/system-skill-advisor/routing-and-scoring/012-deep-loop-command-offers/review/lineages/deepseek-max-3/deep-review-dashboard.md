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
- Review Target: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder)
- Started: 2026-11-24T19:03:48Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-3-1795546920757-7pyjry
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/2 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 4 | maintainability | maintainability | 0.11 | 0/0/1 | complete |
| 5 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 6 | correctness | correctness/traceability | 0.09 | 0/0/1 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 0 |
| traceability | covered | 1 |
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
- Last 3 ratios: 0.00 -> 0.09 -> 0.00
- convergenceScore: 1.00
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
- candidateCoverage: covered=12, ruledOut=25, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 word_rule_gap (ruled_out): 347/347 rows agree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129
- iteration 2 command_injection (ruled_out): argv spawn without a shell on both paths; evidence=lib/subprocess.ts:419, hooks/lib/skill-advisor-cli-fallback.ts:276
- iteration 2 instruction_injection (ruled_out): renderer ignores free-form text; evidence=lib/render.ts:519, skill-advisor-cli.ts:1489
- iteration 2 instruction_injection (ruled_out): handler strips before attaching; evidence=handlers/advisor-recommend.ts:642
- iteration 2 unbounded_input (ruled_out): bounded input on both copies; evidence=scripts/skill_advisor.py:888, lib/command-attach.ts:748
- iteration 3 spec_code_drift (ruled_out): probe matched each stated result; evidence=lib/command-attach.ts:1537
- iteration 3 spec_code_drift (ruled_out): prompt-to-row mapping confirmed; evidence=command-prompts.jsonl:225
- iteration 4 comment_hygiene_violation (ruled_out): no ephemeral label in a code comment; evidence=lib/command-attach.ts:462
- iteration 4 dead_code (ruled_out): occurrence counts all above one; evidence=lib/command-attach.ts:196
- iteration 5 missing_evidence (ruled_out): 126/126 resolved; evidence=tasks.md:275
- iteration 5 illegal_status (ruled_out): status vocabulary respected; evidence=acceptance-criteria.md:87
- iteration 5 unbacked_waiver (ruled_out): three of three ADRs exist; evidence=acceptance-criteria.md:97
- iteration 5 count_mismatch (ruled_out): static counts agree; evidence=tests/fixtures/deep-loop-offer-cases.json:129
- iteration 6 parity_gap (ruled_out): 347/347 agreement; evidence=tests/fixtures/deep-loop-offer-cases.json:123
- iteration 6 degraded_render_gap (ruled_out): typed rows print plainly; evidence=lib/render.ts:250
- iteration 6 closure_record_drift (ruled_out): four of four cited lines hold; evidence=013-deep-loop-offer-in-hint/implementation-summary.md:123
- iteration 7 skill_claim_drift (ruled_out): guard rows exist; evidence=.skilled/skills/system-deep-loop/SKILL.md:71
- iteration 7 skill_claim_drift (ruled_out): no content drift; evidence=.skilled/agents/deep-review.md
- iteration 7 stale_severity (ruled_out): five of five unchanged; evidence=spec.md:257, acceptance-criteria.md:97

### Clean Search Proof
- iteration 1 word_rule_gap (ruled_out): 347/347 rows agree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129
- iteration 2 command_injection (ruled_out): argv spawn without a shell on both paths; evidence=lib/subprocess.ts:419, hooks/lib/skill-advisor-cli-fallback.ts:276
- iteration 2 instruction_injection (ruled_out): renderer ignores free-form text; evidence=lib/render.ts:519, skill-advisor-cli.ts:1489
- iteration 2 instruction_injection (ruled_out): handler strips before attaching; evidence=handlers/advisor-recommend.ts:642
- iteration 2 unbounded_input (ruled_out): bounded input on both copies; evidence=scripts/skill_advisor.py:888, lib/command-attach.ts:748
- iteration 3 spec_code_drift (ruled_out): probe matched each stated result; evidence=lib/command-attach.ts:1537
- iteration 3 spec_code_drift (ruled_out): prompt-to-row mapping confirmed; evidence=command-prompts.jsonl:225
- iteration 4 comment_hygiene_violation (ruled_out): no ephemeral label in a code comment; evidence=lib/command-attach.ts:462
- iteration 4 dead_code (ruled_out): occurrence counts all above one; evidence=lib/command-attach.ts:196
- iteration 5 missing_evidence (ruled_out): 126/126 resolved; evidence=tasks.md:275
- iteration 5 illegal_status (ruled_out): status vocabulary respected; evidence=acceptance-criteria.md:87
- iteration 5 unbacked_waiver (ruled_out): three of three ADRs exist; evidence=acceptance-criteria.md:97
- iteration 5 count_mismatch (ruled_out): static counts agree; evidence=tests/fixtures/deep-loop-offer-cases.json:129
- iteration 6 parity_gap (ruled_out): 347/347 agreement; evidence=tests/fixtures/deep-loop-offer-cases.json:123
- iteration 6 degraded_render_gap (ruled_out): typed rows print plainly; evidence=lib/render.ts:250
- iteration 6 closure_record_drift (ruled_out): four of four cited lines hold; evidence=013-deep-loop-offer-in-hint/implementation-summary.md:123
- iteration 7 skill_claim_drift (ruled_out): guard rows exist; evidence=.skilled/skills/system-deep-loop/SKILL.md:71
- iteration 7 catalog_claim_drift (not_applicable): no catalog claim exists to check; evidence=.skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md
- iteration 7 skill_claim_drift (ruled_out): no content drift; evidence=.skilled/agents/deep-review.md
- iteration 7 stale_severity (ruled_out): five of five unchanged; evidence=spec.md:257, acceptance-criteria.md:97

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the last iteration under `maxIterations`; the run goes to synthesis with stop reason `maxIterationsReached`. - Rotation status: correctness, security, traceability and maintainability each covered; both core protocols executed; overlays resolved. - Carry-forward for synthesis: P0=0, P1=1, P2=4, verdict CONDITIONAL, release readiness `in-progress`. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
