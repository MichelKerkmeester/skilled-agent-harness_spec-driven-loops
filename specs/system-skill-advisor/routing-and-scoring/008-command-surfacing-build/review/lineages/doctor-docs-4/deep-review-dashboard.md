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
- Started: 2026-11-14T15:26:10Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-doctor-docs-4-1794669272137-9v23rz
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
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security + traceability | security/traceability | 0.00 | 0/0/1 | complete |
| 3 | maintainability | maintainability | 0.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 1
- persistentSameSeverity: 1
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=8, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 cross_runtime_parity (ruled_out): The line is plain text read by every runtime and matches the single canonical constant; the parity guard covers it.; evidence=spec-gate-core.mjs:154, gate-3-menu-parity.test.mjs:26
- iteration 1 derived_data_sync (ruled_out): The deriver was rerun and the generated data no longer carries any removed phrase.; evidence=command-bridges.generated.json, doctor-helper-handoff.vitest.ts:118-128
- iteration 1 holdout_leakage (ruled_out): No command-prompts.jsonl or holdout-prompts.jsonl read occurred; the search excluded both files.; evidence=review-brief-4.txt:1
- iteration 2 mutating_attachment (ruled_out): Every mutating doctor route asks first, and the attach guard suppresses refusals and command-only mentions.; evidence=derive-command-bridges.cjs:485-496, command-bridges.generated.json, command-attach.ts:470-483, command-attach-guards.vitest.ts:138-247
- iteration 2 cross_runtime_parity (ruled_out): The renamed command is consistent on every runtime that carries commands, and the changed presentation is runtime-neutral.; evidence=.claude/commands/create/sk-skill.md, .cursor/commands/create-sk-skill.md, .codex/prompts/create-sk-skill.md, .pi/prompts/create-sk-skill.md, .dsh/prompts/create-sk-skill.md, .devin/config.json, .claude/agents/markdown.md, .codex/agents/markdown.toml
- iteration 2 behavioral_contract (ruled_out): The count arithmetic is unchanged and the malformed row keeps its rule path in the test.; evidence=agents-md-check.cjs:798-809
- iteration 2 holdout_leakage (ruled_out): No command-prompts.jsonl or holdout-prompts.jsonl read occurred.; evidence=a494145dd0 commit body, review-brief-4.txt:1
- iteration 2 feature_catalog_drift (ruled_out): The catalog claims match the generated policy and reach-probe behavior.; evidence=doctor-command-routing.md:27-39
- iteration 3 maintainability_style (ruled_out): No style, comment-hygiene or test-shape regression is present in the changed lines.; evidence=git diff --check, agents-md-check.cjs, agents-md-check.test.cjs, agents-md-check.cjs:798-799, agents-md-check.test.cjs:763-764
- iteration 3 hidden_coupling (ruled_out): No current input produces a wrong count, and the changed test covers the subtraction.; evidence=agents-md-check.cjs:798-809, agents-md-check.test.cjs:760-764

### Clean Search Proof
- iteration 1 cross_runtime_parity (ruled_out): The line is plain text read by every runtime and matches the single canonical constant; the parity guard covers it.; evidence=spec-gate-core.mjs:154, gate-3-menu-parity.test.mjs:26
- iteration 1 derived_data_sync (ruled_out): The deriver was rerun and the generated data no longer carries any removed phrase.; evidence=command-bridges.generated.json, doctor-helper-handoff.vitest.ts:118-128
- iteration 1 holdout_leakage (ruled_out): No command-prompts.jsonl or holdout-prompts.jsonl read occurred; the search excluded both files.; evidence=review-brief-4.txt:1
- iteration 1 phantom_scorer_count (not_applicable): The doctor-docs area has no transcript-scoring code; the scorer paths belong to the accuracy-runner and scorer-attach areas.; evidence=review-scope-4.txt:6-9
- iteration 2 mutating_attachment (ruled_out): Every mutating doctor route asks first, and the attach guard suppresses refusals and command-only mentions.; evidence=derive-command-bridges.cjs:485-496, command-bridges.generated.json, command-attach.ts:470-483, command-attach-guards.vitest.ts:138-247
- iteration 2 cross_runtime_parity (ruled_out): The renamed command is consistent on every runtime that carries commands, and the changed presentation is runtime-neutral.; evidence=.claude/commands/create/sk-skill.md, .cursor/commands/create-sk-skill.md, .codex/prompts/create-sk-skill.md, .pi/prompts/create-sk-skill.md, .dsh/prompts/create-sk-skill.md, .devin/config.json, .claude/agents/markdown.md, .codex/agents/markdown.toml
- iteration 2 behavioral_contract (ruled_out): The count arithmetic is unchanged and the malformed row keeps its rule path in the test.; evidence=agents-md-check.cjs:798-809
- iteration 2 holdout_leakage (ruled_out): No command-prompts.jsonl or holdout-prompts.jsonl read occurred.; evidence=a494145dd0 commit body, review-brief-4.txt:1
- iteration 2 feature_catalog_drift (ruled_out): The catalog claims match the generated policy and reach-probe behavior.; evidence=doctor-command-routing.md:27-39
- iteration 3 maintainability_style (ruled_out): No style, comment-hygiene or test-shape regression is present in the changed lines.; evidence=git diff --check, agents-md-check.cjs, agents-md-check.test.cjs, agents-md-check.cjs:798-799, agents-md-check.test.cjs:763-764
- iteration 3 hidden_coupling (ruled_out): No current input produces a wrong count, and the changed test covers the subtraction.; evidence=agents-md-check.cjs:798-809, agents-md-check.test.cjs:760-764

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; all four dimensions are covered. - Focus area: synthesis only. - Reason: the three-iteration cap is reached, the only active finding is the carried P2, and no new maintainability issue exists. - Rotation status: complete (correctness, security, traceability, maintainability). - Blocked/productive carry-forward: carry `DR4-P2-001` into the report; do not re-enter the ruled-out directions. - Required evidence: the final report's Active Finding Registry, Planning Packet and Audit Appendix. - Recovery note: none. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
