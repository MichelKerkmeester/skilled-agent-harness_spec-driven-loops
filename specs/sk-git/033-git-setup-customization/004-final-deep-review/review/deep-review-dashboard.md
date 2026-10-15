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
- Review Target: Review all shipped work of the /doctor:git setup program for correctness, security, traceability and maintainability, and judge whether it is complete: commits 8d40b8c128 through 0b2414a14b on main (git log c05034a20b..0b2414a14b). Scope: .skilled/commands/doctor/scripts/git-setup-check.cjs and tests/git-setup-check.test.cjs, assets/doctor-git-setup.yaml, assets/doctor-git-presentation.txt, git.md, _routes.yaml, scripts/route-validate.py and its test, .github/scripts/check-gate-inputs.sh and its test, .skilled/skills/sk-git/assets/commit-message-template.md, sk-git SKILL.md, README.md, feature-catalog/workflow-playbooks/doctor-git-settings.md, manual-testing-playbook DOC-384, the root README.md sk-git sections, and the packets specs/sk-git/033-git-setup-customization/002-doctor-git-setup and specs/sk-git/034-standards-template-round-trip. Invariants to attack: the battery writes nothing and never runs code from the repository it inspects (any git, helper or config path a repository can steer), exit codes and the STATUS line agree, each FAIL's repair actually fixes it, each check matches what the hooks and helpers really do, tests fail when the behavior breaks, and every doc that lists /doctor:git targets names setup accurately. Every finding needs a concrete failure case and path:line evidence. (files)
- Started: 2026-10-15T13:35:35.122Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-15T13:35:35.122Z
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
| P1 (Required) | 8 |
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/2/1 | complete |
| 2 | security | security | 1.00 | 0/2/2 | complete |
| 3 | traceability: spec_code, checklist_evidence, feature_catalog_code, playbook_capability | traceability | 1.00 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/3 | complete |
| 5 | traceability closure plus adversarial correctness replay | traceability/correctness | 0.00 | 0/4/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 9 |
| security | covered | 4 |
| traceability | covered | 3 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.92
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 16
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
- candidateCoverage: covered=23, ruledOut=9, deferred=1, blocked=6

### Search Debt
- iteration 1 repair_effectiveness (deferred): Carry to the next traceability/correctness pass; do not infer that a named repair command fixes its check.; evidence=.skilled/commands/doctor/scripts/git-setup-check.cjs:72-81
- iteration 1 dynamic_test_execution (blocked): The dispatch prohibits executing rm against any path; running this test file calls fs.rmSync on OS-temporary fixture directories.; evidence=.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:70-72, .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:300-302
- iteration 3 template_serializer_drift (blocked): The attempted serializer path is absent and no canonical source path was resolved; carry the implementation check forward.; evidence=specs/sk-git/034-standards-template-round-trip/spec.md:34, specs/sk-git/034-standards-template-round-trip/spec.md:58
- iteration 4 standards_serializer_round_trip (blocked): The combined output was truncated before the relevant consumers and round-trip tests were inspectable.; evidence=.skilled/commands/doctor/scripts/git-standards.cjs:135-138
- iteration 4 duplicate_target_scoping (blocked): Relevant source and test output was truncated; no conclusion is recorded.; evidence=UNKNOWN
- iteration 4 gate_inputs_test_sensitivity (blocked): Relevant source and test output was truncated; no conclusion is recorded.; evidence=UNKNOWN
- iteration 5 serializer_round_trip (blocked): Dedicated serializer test body was not inspected within the iteration read budget.; evidence=.skilled/commands/doctor/scripts/git-standards.cjs:135, specs/sk-git/034-standards-template-round-trip/spec.md:72

### Ruled-Out Candidates
- iteration 1 exit_status_mismatch (ruled_out): No mismatch is present in the reviewed branches; JSON-specific no-fail-with-UNKNOWN/SKIP test coverage is recorded separately as R1-P2-001.; evidence=.skilled/commands/doctor/scripts/git-setup-check.cjs:681-687, .skilled/commands/doctor/scripts/git-setup-check.cjs:753-759, .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130-177
- iteration 3 target_list_omission (ruled_out): Exact target-list scan found no omission in the named surfaces.; evidence=.skilled/commands/doctor/assets/doctor-git-presentation.txt:57, .skilled/commands/doctor/_routes.yaml:275, .skilled/skills/sk-git/README.md:232, README.md:1256, README.md:1505
- iteration 3 playbook_output_mismatch (ruled_out): Direct battery output matched DOC-384's expected output contract.; evidence=.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:55, .skilled/commands/doctor/scripts/git-setup-check.cjs:675
- iteration 4 contract_parser_duplication (ruled_out): Direct reads show resolveContractDir and loadContract are called from message-contract.mjs.; evidence=.skilled/commands/doctor/scripts/git-setup-check.cjs:316-346
- iteration 5 duplicate_target_scope (ruled_out): A global duplicate rejection would fail the real-manifest cross-command test; disabling duplicate checks would fail the duplicate fixture.; evidence=.skilled/commands/doctor/scripts/route-validate.py:687, .skilled/commands/doctor/scripts/tests/route-validate.test.sh:133, .skilled/commands/doctor/scripts/tests/route-validate.test.sh:140
- iteration 5 sentinel_parser_scope (ruled_out): A broken sentinel exemption or overbroad segment removal changes one of the expected test statuses.; evidence=.github/scripts/check-gate-inputs.sh:283, .github/scripts/tests/check-gate-inputs.test.sh:477, .github/scripts/tests/check-gate-inputs.test.sh:483

### Clean Search Proof
- iteration 1 exit_status_mismatch (ruled_out): No mismatch is present in the reviewed branches; JSON-specific no-fail-with-UNKNOWN/SKIP test coverage is recorded separately as R1-P2-001.; evidence=.skilled/commands/doctor/scripts/git-setup-check.cjs:681-687, .skilled/commands/doctor/scripts/git-setup-check.cjs:753-759, .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130-177
- iteration 3 target_list_omission (ruled_out): Exact target-list scan found no omission in the named surfaces.; evidence=.skilled/commands/doctor/assets/doctor-git-presentation.txt:57, .skilled/commands/doctor/_routes.yaml:275, .skilled/skills/sk-git/README.md:232, README.md:1256, README.md:1505
- iteration 3 playbook_output_mismatch (ruled_out): Direct battery output matched DOC-384's expected output contract.; evidence=.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:55, .skilled/commands/doctor/scripts/git-setup-check.cjs:675
- iteration 4 contract_parser_duplication (ruled_out): Direct reads show resolveContractDir and loadContract are called from message-contract.mjs.; evidence=.skilled/commands/doctor/scripts/git-setup-check.cjs:316-346
- iteration 5 duplicate_target_scope (ruled_out): A global duplicate rejection would fail the real-manifest cross-command test; disabling duplicate checks would fail the duplicate fixture.; evidence=.skilled/commands/doctor/scripts/route-validate.py:687, .skilled/commands/doctor/scripts/tests/route-validate.test.sh:133, .skilled/commands/doctor/scripts/tests/route-validate.test.sh:140
- iteration 5 sentinel_parser_scope (ruled_out): A broken sentinel exemption or overbroad segment removal changes one of the expected test statuses.; evidence=.github/scripts/check-gate-inputs.sh:283, .github/scripts/tests/check-gate-inputs.test.sh:477, .github/scripts/tests/check-gate-inputs.test.sh:483

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: finish the blocked serializer round-trip and duplicate-target scoping checks, then inspect mutation sensitivity in `route-validate.test.sh` and `check-gate-inputs.test.sh`. - Reason: those requested surfaces were not inspectable in the combined output, so the dimension remains partial. - Rotation status: productive carry-forward. - Blocked/productive carry-forward: complete the four blocked checks listed above. - Required evidence: direct reads of `git-standards.cjs`, `message-contract.mjs`, the 034 packet claims and tests, `route-validate.py` with its test, and the gate-input script with its test. - Recovery note: use focused reads so the evidence remains within the output budget.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 8 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 7 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
