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
- Review Target: The ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde: the frontmatter-version engine, packager and post-edit router now treat only SKILL.md as a versioned doc; the version line was dropped from 2,845 child docs; the versioning standard and templates were rewritten; the catalog validator checks two-column File tables; the citation scanner resolves skill runtime/ and scripts/ paths and prints an overlap advisory; the playbook validator reports unresolved backticked paths and keeps its whole report when piped; stale anchors and paths in playbooks and catalogs were corrected; five skills were bumped (files)
- Started: 2026-10-11T19:57:10Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: rvw-021-003-doc-catalog-truth-20261011T195710Z
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
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/4 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 0.33 | 0/1/1 | complete |
| 4 | maintainability | maintainability | 0.25 | 0/0/2 | complete |
| 5 | correctness | correctness | 0.11 | 0/1/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 0 |
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
- Last 3 ratios: 0.33 -> 0.25 -> 0.11
- convergenceScore: 0.89
- openFindings: 9
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
- candidateCoverage: covered=7, ruledOut=21, deferred=1, blocked=0

### Search Debt
- iteration 2 pinned_artifact_integrity (deferred): recomputation needs the compiled-routing tooling; runtime comparison verified instead; evidence=.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:118

### Ruled-Out Candidates
- iteration 1 scope_regression (ruled_out): gate and verify executed green over the complete SKILL.md population; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:203, command:gate
- iteration 1 validator_regression (ruled_out): executed suites green and each new behavior has a named assertion; evidence=command:catalog-tests, command:playbook-tests
- iteration 1 logic_error (ruled_out): direct read plus 67 green tests; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118, command:cite-drift-tests
- iteration 1 logic_error (ruled_out): dedicated piped-report regression test green; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:884, command:playbook-tests
- iteration 1 doc_contract_drift (ruled_out): spot checks passed; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1060
- iteration 1 scope_regression (ruled_out): engine verify and gate green; changelog and sample checks clean; evidence=command:verify-57-57
- iteration 2 command_injection (ruled_out): argv-array spawn sites with no shell and no string command lines; evidence=.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:202, .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:351, .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:407
- iteration 2 command_injection (ruled_out): quoted exec with no dynamic command construction; evidence=.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:12
- iteration 2 path_traversal_write (ruled_out): lexical containment guard plus non-symlink discovery; explicit-symlink case is pre-existing and operator-supplied; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:280, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:225
- iteration 2 path_traversal_read (ruled_out): existence probe with no read/exec/write, and a hit produces no output; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:379, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:387, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:399
- iteration 2 path_traversal_read (ruled_out): containment check precedes any git call and no shell is used; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:425, .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:586
- iteration 2 untrusted_input_regex (ruled_out): no dynamic RegExp construction; patterns are fixed and linear; evidence=.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:375
- iteration 2 path_traversal_read (ruled_out): tracked-only resolution gates every read; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:765
- iteration 2 gate_bypass (ruled_out): documented contract, reported as skip rather than ok, unchanged by this change set; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:387, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:65
- iteration 2 bulk_mutation_integrity (ruled_out): one removed line per file, all version lines, no additions; evidence=31888d05bb
- iteration 3 citation_drift (ruled_out): citations were accurate when written; drift is inherent to a frozen plan, not an error; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:113
- iteration 3 version_anchor_drift (ruled_out): no version or mirror mismatch found; evidence=.skilled/skills/system-spec-kit/SKILL.md:5
- iteration 3 cross_runtime_drift (ruled_out): no stale cross-runtime description found; evidence=.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:181
- iteration 3 catalog_anchor_drift (ruled_out): anchor resolves to the described code; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495
- iteration 3 playbook_capability_drift (ruled_out): all corrected ranges are inside their files; evidence=.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md:101
- iteration 3 spec_mismatch (ruled_out): requirement satisfied on the full population; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:103
- iteration 4 doc_code_drift (ruled_out): membership differences are documented as deliberate (standard line 32, DV-R7 spec line 134) and the remaining template gap is already tracked as R1-P2-001; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:32, specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:134, .skilled/skills/sk-doc/changelog/v2.3.5.0.md:11
- iteration 4 comment_hygiene (ruled_out): no artifact ids or spec paths appear in the changed scripts' comments; evidence=.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:55
- iteration 4 test_coverage_gap (ruled_out): each changed behavior carries a named regression test at the reviewed lines; evidence=.skilled/skills/sk-doc/scripts/tests/test_validate_catalog_package.py:190, .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:96
- iteration 4 fragile_parsing (ruled_out): guards are explicit at the changed lines and no silent failure path was introduced; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:310, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:396
- iteration 5 version_anchor_drift (ruled_out): all five bumped SKILL.md values equal their newest changelog entry; evidence=.skilled/skills/sk-doc/SKILL.md:1-12
- iteration 5 bulk_mutation_integrity (ruled_out): no SKILL.md or changelog entry lost a version, and the strip is one deletion per file by its own numstat; evidence=.skilled/skills/sk-doc/SKILL.md:6, commit:31888d05bb
- iteration 5 incomplete_refactor (ruled_out): checker-level narrowing is consistent; the residual mismatch is the strip-versus-standard scope filed as R5-P2-001; evidence=commit:c071e01662

### Clean Search Proof
- iteration 1 scope_regression (ruled_out): gate and verify executed green over the complete SKILL.md population; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:203, command:gate
- iteration 1 validator_regression (ruled_out): executed suites green and each new behavior has a named assertion; evidence=command:catalog-tests, command:playbook-tests
- iteration 1 logic_error (ruled_out): direct read plus 67 green tests; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118, command:cite-drift-tests
- iteration 1 logic_error (ruled_out): dedicated piped-report regression test green; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:884, command:playbook-tests
- iteration 1 doc_contract_drift (ruled_out): spot checks passed; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1060
- iteration 1 scope_regression (ruled_out): engine verify and gate green; changelog and sample checks clean; evidence=command:verify-57-57
- iteration 2 command_injection (ruled_out): argv-array spawn sites with no shell and no string command lines; evidence=.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:202, .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:351, .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:407
- iteration 2 command_injection (ruled_out): quoted exec with no dynamic command construction; evidence=.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:12
- iteration 2 path_traversal_write (ruled_out): lexical containment guard plus non-symlink discovery; explicit-symlink case is pre-existing and operator-supplied; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:280, .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:225
- iteration 2 path_traversal_read (ruled_out): existence probe with no read/exec/write, and a hit produces no output; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:379, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:387, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:399
- iteration 2 path_traversal_read (ruled_out): containment check precedes any git call and no shell is used; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:425, .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:586
- iteration 2 untrusted_input_regex (ruled_out): no dynamic RegExp construction; patterns are fixed and linear; evidence=.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:375
- iteration 2 path_traversal_read (ruled_out): tracked-only resolution gates every read; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:765
- iteration 2 gate_bypass (ruled_out): documented contract, reported as skip rather than ok, unchanged by this change set; evidence=.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:387, .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:65
- iteration 2 bulk_mutation_integrity (ruled_out): one removed line per file, all version lines, no additions; evidence=31888d05bb
- iteration 3 citation_drift (ruled_out): citations were accurate when written; drift is inherent to a frozen plan, not an error; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:113
- iteration 3 version_anchor_drift (ruled_out): no version or mirror mismatch found; evidence=.skilled/skills/system-spec-kit/SKILL.md:5
- iteration 3 cross_runtime_drift (ruled_out): no stale cross-runtime description found; evidence=.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:181
- iteration 3 catalog_anchor_drift (ruled_out): anchor resolves to the described code; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495
- iteration 3 playbook_capability_drift (ruled_out): all corrected ranges are inside their files; evidence=.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md:101
- iteration 3 spec_mismatch (ruled_out): requirement satisfied on the full population; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:103
- iteration 4 doc_code_drift (ruled_out): membership differences are documented as deliberate (standard line 32, DV-R7 spec line 134) and the remaining template gap is already tracked as R1-P2-001; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:32, specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:134, .skilled/skills/sk-doc/changelog/v2.3.5.0.md:11
- iteration 4 comment_hygiene (ruled_out): no artifact ids or spec paths appear in the changed scripts' comments; evidence=.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:55
- iteration 4 test_coverage_gap (ruled_out): each changed behavior carries a named regression test at the reviewed lines; evidence=.skilled/skills/sk-doc/scripts/tests/test_validate_catalog_package.py:190, .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:96
- iteration 4 fragile_parsing (ruled_out): guards are explicit at the changed lines and no silent failure path was introduced; evidence=.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:310, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:396
- iteration 5 version_anchor_drift (ruled_out): all five bumped SKILL.md values equal their newest changelog entry; evidence=.skilled/skills/sk-doc/SKILL.md:1-12
- iteration 5 bulk_mutation_integrity (ruled_out): no SKILL.md or changelog entry lost a version, and the strip is one deletion per file by its own numstat; evidence=.skilled/skills/sk-doc/SKILL.md:6, commit:31888d05bb
- iteration 5 incomplete_refactor (ruled_out): checker-level narrowing is consistent; the residual mismatch is the strip-versus-standard scope filed as R5-P2-001; evidence=commit:c071e01662

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
