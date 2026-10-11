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
- Review Target: Commit f34b01bf0a on worktrees/115-rem-routing-parity-ci: the local-vs-native divergence ratchet (fresh skill-graph index, pinned scoring clock, regime header), the widened holdout independence check (declared scoring surfaces and allowed-overlap map), and the two new blocking steps in the golden-prompt-gate CI job (files)
- Started: 2026-10-11T19:33:34Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: rvw-021-004-routing-parity-20261011T193333Z
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/3 | complete |
| 2 | security | security | 1.00 | 0/0/2 | complete |
| 3 | traceability | traceability | 1.00 | 0/1/1 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/3 | complete |
| 5 | correctness | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 10
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
- candidateCoverage: covered=9, ruledOut=19, deferred=1, blocked=0

### Search Debt
- iteration 5 missing_closure_evidence (deferred): tracked findings cover it; no new finding permissible; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:136

### Ruled-Out Candidates
- iteration 1 time_dependent_scoring (ruled_out): the local scorer is time-invariant, so the one-sided pin is sound for the current implementation; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1185, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1241, .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts:31
- iteration 1 env_capture_order (ruled_out): the env var is set before skill-graph-db and fusion load, and no statically imported module reaches projection.ts; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:70, .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:237, .skilled/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts:9
- iteration 1 scan_whitelist_drift (ruled_out): the declaration set is complete against the current tree and the build output directory is skipped; evidence=.skilled/skills/system-skill-advisor/runtime/package.json, .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:346
- iteration 1 clock_derivation (ruled_out): the fixture values are date-only and non-empty; the deriver guards invalid input by throwing; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:222
- iteration 1 workflow_blocking (ruled_out): the steps are blocking job steps on the right job and paths, with python installed before them; evidence=.github/workflows/routing-registry-drift.yml:275, .github/workflows/routing-registry-drift.yml:278, .github/workflows/routing-registry-drift.yml:289, .github/workflows/routing-registry-drift.yml:278
- iteration 2 command_injection (ruled_out): All run: steps are static text and every subprocess call uses an argv array without a shell; evidence=.github/workflows/routing-registry-drift.yml:118, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:617, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:714, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1382, .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:72
- iteration 2 secrets_exposure (ruled_out): Read-only token and no secrets referenced; unpinned-npx surface is version-pinned and the new steps resolve the npm-ci-installed local vitest; evidence=.github/workflows/routing-registry-drift.yml:118, .github/workflows/routing-registry-drift.yml:126, .github/workflows/routing-registry-drift.yml:240
- iteration 2 sql_injection (ruled_out): Parameterized statements throughout; only static SQL text is executed; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:497, .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:593
- iteration 2 unsafe_env_trust (ruled_out): Operator-controlled environment with the same trust level as the running user; no cross-boundary input; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:70, .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:236
- iteration 3 spec_code_drift (ruled_out): name-status equals the spec's Files to Change exactly; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80-82
- iteration 3 doc_code_divergence (ruled_out): No doc claim covers these internal gates; catalog updates are outside this phase's frozen scope; evidence=.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:39, specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80-82
- iteration 3 cross_runtime_reference_drift (ruled_out): No agent definition references the changed paths; nothing to reconcile; evidence=UNKNOWN
- iteration 3 stale_evidence_pointer (ruled_out): Research-time pointers identify regions, not content; all probed lines resolve; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:104
- iteration 4 duplicated_setup (ruled_out): no new duplication introduced; below scope threshold; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:168
- iteration 4 scan_cost (ruled_out): measured bounded; no finding; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:228
- iteration 4 comment_hygiene_violation (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:14, .github/workflows/routing-registry-drift.yml:269, .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:5
- iteration 4 holdout_temp_dir_leak (ruled_out): no impact; pre-existing; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:240
- iteration 5 declaration_coverage (ruled_out): replayed green on the live tree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:306, .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:322
- iteration 5 clock_derivation (ruled_out): verified by direct read and fixture probe; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:169, .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:181, .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1

### Clean Search Proof
- iteration 1 time_dependent_scoring (ruled_out): the local scorer is time-invariant, so the one-sided pin is sound for the current implementation; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1185, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1241, .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts:31
- iteration 1 env_capture_order (ruled_out): the env var is set before skill-graph-db and fusion load, and no statically imported module reaches projection.ts; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:70, .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:237, .skilled/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts:9
- iteration 1 scan_whitelist_drift (ruled_out): the declaration set is complete against the current tree and the build output directory is skipped; evidence=.skilled/skills/system-skill-advisor/runtime/package.json, .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:346
- iteration 1 clock_derivation (ruled_out): the fixture values are date-only and non-empty; the deriver guards invalid input by throwing; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:222
- iteration 1 workflow_blocking (ruled_out): the steps are blocking job steps on the right job and paths, with python installed before them; evidence=.github/workflows/routing-registry-drift.yml:275, .github/workflows/routing-registry-drift.yml:278, .github/workflows/routing-registry-drift.yml:289, .github/workflows/routing-registry-drift.yml:278
- iteration 2 command_injection (ruled_out): All run: steps are static text and every subprocess call uses an argv array without a shell; evidence=.github/workflows/routing-registry-drift.yml:118, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:617, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:714, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1382, .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:72
- iteration 2 secrets_exposure (ruled_out): Read-only token and no secrets referenced; unpinned-npx surface is version-pinned and the new steps resolve the npm-ci-installed local vitest; evidence=.github/workflows/routing-registry-drift.yml:118, .github/workflows/routing-registry-drift.yml:126, .github/workflows/routing-registry-drift.yml:240
- iteration 2 sql_injection (ruled_out): Parameterized statements throughout; only static SQL text is executed; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:497, .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:593
- iteration 2 unsafe_env_trust (ruled_out): Operator-controlled environment with the same trust level as the running user; no cross-boundary input; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:70, .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:236
- iteration 3 spec_code_drift (ruled_out): name-status equals the spec's Files to Change exactly; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80-82
- iteration 3 doc_code_divergence (ruled_out): No doc claim covers these internal gates; catalog updates are outside this phase's frozen scope; evidence=.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:39, specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80-82
- iteration 3 cross_runtime_reference_drift (ruled_out): No agent definition references the changed paths; nothing to reconcile; evidence=UNKNOWN
- iteration 3 stale_evidence_pointer (ruled_out): Research-time pointers identify regions, not content; all probed lines resolve; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:104
- iteration 4 duplicated_setup (ruled_out): no new duplication introduced; below scope threshold; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:168
- iteration 4 scan_cost (ruled_out): measured bounded; no finding; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:228
- iteration 4 comment_hygiene_violation (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:14, .github/workflows/routing-registry-drift.yml:269, .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:5
- iteration 4 holdout_temp_dir_leak (ruled_out): no impact; pre-existing; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:240
- iteration 5 declaration_coverage (ruled_out): replayed green on the live tree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:306, .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:322
- iteration 5 clock_derivation (ruled_out): verified by direct read and fixture probe; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:169, .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:181, .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
