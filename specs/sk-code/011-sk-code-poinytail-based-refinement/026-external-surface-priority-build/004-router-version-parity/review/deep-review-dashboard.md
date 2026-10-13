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
- Review Target: commits 9d1168bf3a and 95698b591b on branch worktrees/128-router-version-parity (diff 455f2a2d8c..95698b591b): doctor check 13a no longer compares a hub ROUTER.md version with SKILL.md, a new invariants test pins that, both create-changelog YAML twins stop copying the release version into ROUTER.md, and frontmatter-versioning.md says the doctor compares only the three JSON routing files (files)
- Started: 2026-10-13T07:13:05.484Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-13T07:13:05.484Z
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
| P1 (Required) | 4 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness/traceability | 1.00 | 0/1/0 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 1.00 | 0/1/0 | complete |
| 4 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 5 | correctness (adversarial re-check of all four changes and re-adjudication of every open finding) | correctness | 0.00 | 0/2/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
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
- graphConvergenceScore: 0.88
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":11,"description":"Dimension coverage (50%) is below threshold (80%). 11 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 4
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
- candidateCoverage: covered=3, ruledOut=24, deferred=1, blocked=0

### Search Debt
- iteration 5 unverified_runtime_claim (deferred): read-only iteration; goal criterion 3 executes the suite at closure; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/goal.md:65

### Ruled-Out Candidates
- iteration 1 test_vacuity (ruled_out): fixture emits the replaced version line; replace is effective; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441
- iteration 1 json_parity_regression (ruled_out): direct read shows JSON followers retained with mismatch and format softFails; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1848, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1862, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:406, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:515
- iteration 1 silent_omission (ruled_out): no defect in the changed files; spec-scoped minimal change, addressed by the R1-P1-001 recommendation; evidence=.skilled/commands/create/assets/create-changelog-auto.yaml:665
- iteration 1 twin_divergence (ruled_out): direct diff shows identical removals and aligned lists; evidence=.skilled/commands/create/assets/create-changelog-confirm.yaml:600, .skilled/commands/create/assets/create-changelog-auto.yaml:665
- iteration 2 auth_bypass (ruled_out): diagnostic metadata comparison; no guard role, no enforcement path; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1850, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1859
- iteration 2 injection (ruled_out): validated authority plus JSON.stringify-escaped values; hardcoded file labels; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1845, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1859
- iteration 2 redos (ruled_out): linear anchored regex, no catastrophic backtracking; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:150
- iteration 2 path_traversal (ruled_out): fixed relative names under the target root; one read removed, none added; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1761, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441
- iteration 2 secret_exposure (ruled_out): no secret or PII content in changed lines; evidence=.skilled/commands/create/assets/create-changelog-auto.yaml:666, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124
- iteration 2 tamper_detection_regression (ruled_out): advisory diagnostic, no enforcement consumer; own-edition semantics are the declared contract; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/spec.md:84
- iteration 2 test_isolation (ruled_out): private temp copy per test with after() cleanup; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:265
- iteration 3 stale_documentation (ruled_out): exact search found no ROUTER.md version claim there; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-router-reach.md:14
- iteration 3 checklist_evidence_gap (ruled_out): expected mid-flight state owned by tasks T007-T009; evidence=goal.md, tasks.md:35, implementation-summary.md
- iteration 3 plan_code_divergence (ruled_out): planning-time artifact, out of the spec's file list; closure sync owned by T009; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/plan.md
- iteration 3 spec_mismatch (ruled_out): spec-to-code mapping verified for the four static requirements; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1850, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/create/assets/create-changelog-auto.yaml:665, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122
- iteration 4 comment_drift (ruled_out): comment and implementation agree on scope, failure semantics and the ROUTER.md exclusion; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1839, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1866
- iteration 4 dead_code (ruled_out): no dead code left by the follower removal; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1844
- iteration 4 stale_message (ruled_out): no overclaim or stale wording in the changed pass message; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1866, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:394
- iteration 4 test_fixture_alignment (ruled_out): no name, fixture or assertion drift in the new test; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/spec.md:74, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/goal.md:47
- iteration 4 stale_test_assertion (ruled_out): exact search shows no stale 13a ROUTER.md failure expectation; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:406, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:405
- iteration 4 doc_code_drift (ruled_out): no doc/code drift after the paragraph rewrite; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850
- iteration 4 version_bump_conformance (ruled_out): version raise conforms to the standard's own bump rule; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:12, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:77
- iteration 5 json_parity_regression (ruled_out): exact search found no other ROUTER.md version comparison; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1713, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1841
- iteration 5 test_vacuity (ruled_out): fixture emits the replaced line and the replacement differs; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:39, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441

### Clean Search Proof
- iteration 1 test_vacuity (ruled_out): fixture emits the replaced version line; replace is effective; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441
- iteration 1 json_parity_regression (ruled_out): direct read shows JSON followers retained with mismatch and format softFails; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1848, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1862, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:406, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:515
- iteration 1 security_impact (not_applicable): no security-relevant guard removed; version strings are non-executable metadata; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1855
- iteration 1 silent_omission (ruled_out): no defect in the changed files; spec-scoped minimal change, addressed by the R1-P1-001 recommendation; evidence=.skilled/commands/create/assets/create-changelog-auto.yaml:665
- iteration 1 twin_divergence (ruled_out): direct diff shows identical removals and aligned lists; evidence=.skilled/commands/create/assets/create-changelog-confirm.yaml:600, .skilled/commands/create/assets/create-changelog-auto.yaml:665
- iteration 2 auth_bypass (ruled_out): diagnostic metadata comparison; no guard role, no enforcement path; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1850, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1859
- iteration 2 injection (ruled_out): validated authority plus JSON.stringify-escaped values; hardcoded file labels; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1845, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1859
- iteration 2 redos (ruled_out): linear anchored regex, no catastrophic backtracking; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:150
- iteration 2 path_traversal (ruled_out): fixed relative names under the target root; one read removed, none added; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1761, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441
- iteration 2 secret_exposure (ruled_out): no secret or PII content in changed lines; evidence=.skilled/commands/create/assets/create-changelog-auto.yaml:666, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124
- iteration 2 supply_chain (not_applicable): no dependency, manifest, lockfile or install-script change; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/scratch/review-diff.patch
- iteration 2 tamper_detection_regression (ruled_out): advisory diagnostic, no enforcement consumer; own-edition semantics are the declared contract; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/spec.md:84
- iteration 2 test_isolation (ruled_out): private temp copy per test with after() cleanup; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:265
- iteration 3 stale_documentation (ruled_out): exact search found no ROUTER.md version claim there; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-skill-advisor-router-reach.md:14
- iteration 3 checklist_evidence_gap (ruled_out): expected mid-flight state owned by tasks T007-T009; evidence=goal.md, tasks.md:35, implementation-summary.md
- iteration 3 plan_code_divergence (ruled_out): planning-time artifact, out of the spec's file list; closure sync owned by T009; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/plan.md
- iteration 3 spec_mismatch (ruled_out): spec-to-code mapping verified for the four static requirements; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1850, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/create/assets/create-changelog-auto.yaml:665, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122
- iteration 4 comment_drift (ruled_out): comment and implementation agree on scope, failure semantics and the ROUTER.md exclusion; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1839, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1866
- iteration 4 dead_code (ruled_out): no dead code left by the follower removal; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1844
- iteration 4 stale_message (ruled_out): no overclaim or stale wording in the changed pass message; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1866, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:394
- iteration 4 test_fixture_alignment (ruled_out): no name, fixture or assertion drift in the new test; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/spec.md:74, specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/goal.md:47
- iteration 4 stale_test_assertion (ruled_out): exact search shows no stale 13a ROUTER.md failure expectation; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:406, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:405
- iteration 4 doc_code_drift (ruled_out): no doc/code drift after the paragraph rewrite; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850
- iteration 4 version_bump_conformance (ruled_out): version raise conforms to the standard's own bump rule; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:12, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:77
- iteration 5 json_parity_regression (ruled_out): exact search found no other ROUTER.md version comparison; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1713, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1841
- iteration 5 test_vacuity (ruled_out): fixture emits the replaced line and the replacement differs; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:39, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Claim-adjudication gate last failed at run 5 (missing packets: R1-P1-001, R3-P1-001). STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
