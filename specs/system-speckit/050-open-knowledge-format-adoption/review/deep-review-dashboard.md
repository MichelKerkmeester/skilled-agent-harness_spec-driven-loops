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
- Review Target: specs/system-speckit/050-open-knowledge-format-adoption (spec-folder)
- Started: 2026-10-05T08:17:54Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-05T08:17:54Z
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
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.00 | 0/0/0 | error |
| 4 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 5 | maintainability | maintainability | 0.25 | 0/0/1 | complete |

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
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.25
- convergenceScore: 0.75
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
- candidateCoverage: covered=10, ruledOut=10, deferred=4, blocked=0

### Search Debt
- iteration 1 context_type_consumer_integration (deferred): Review the three shared-value consumers in the follow-on pass.; evidence=specs/system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc/plan.md:66, .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:15
- iteration 4 checklist_evidence_staleness (deferred): Replaying prior census studies, hashes or tests is a separate verification task.; evidence=specs/system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/005-source-resolver/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/009-census-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc/acceptance-criteria.md:57
- iteration 4 feature_catalog_code_drift (deferred): The existing cutoff edge remains under R1-P2-001; a direct redirect-data audit was not part of this pass.; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:230, .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/source-tag-resolution.md:19, .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/shared-frontmatter-value-list.md:19, .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/source-tag-resolution.md:48
- iteration 5 cross_checker_test_parity (deferred): Inspect the Python, skill-doc checker, and shared context-types tests in a follow-up review.; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/check-frontmatter-values.vitest.ts:39

### Ruled-Out Candidates
- iteration 1 citation_path_resolution (ruled_out): No correctness defect found in the inspected spaced-path and redirect resolution direction.; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts:203
- iteration 1 shared_alias_contract (ruled_out): The document checker alias list and runtime legacy migration set have explicitly different contracts.; evidence=.skilled/skills/system-spec-kit/shared/context-types.ts:70, .skilled/skills/system-spec-kit/shared/tests/context-types.test.ts:33
- iteration 2 shell_argument_injection (ruled_out): No reviewed wrapper or subprocess constructs a shell command from document content or path text.; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:29, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh:38, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:187, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1803, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1808
- iteration 2 document_content_to_process_execution (ruled_out): No content-derived command string or eval/exec sink was identified in the scoped helpers.; evidence=.skilled/skills/sk-doc/shared/scripts/validate_document.py:1803, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1808, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:29, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh:38
- iteration 2 regex_redos (ruled_out): No regex path was found where untrusted content controls a pattern with catastrophic backtracking behavior.; evidence=.skilled/skills/sk-doc/shared/scripts/validate_document.py:1634, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1635, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:54
- iteration 2 document_derived_write_path_traversal (ruled_out): Path traversal through untrusted document content was not present in the reviewed data flow.; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:2206, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1422, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:2343, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1887
- iteration 4 spec_code_drift (ruled_out): Direct source inspection found no new mismatch.; evidence=specs/system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/005-source-resolver/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/009-census-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc/acceptance-criteria.md:57, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:230, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:27, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:214, .skilled/skills/system-spec-kit/shared/context-types.ts:34, .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:9, .skilled/skills/system-spec-kit/runtime/cli/extractors/session-extractor.ts:17, .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:15, .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:2
- iteration 4 playbook_capability_drift (ruled_out): Direct source-to-scenario comparison found no new mismatch.; evidence=.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-census-across-doc-families.md:15, .skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md:15, .skilled/skills/sk-doc/manual-testing-playbook/document-validation/shared-frontmatter-value-warning.md:15, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/source-tag-resolution.md:15, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/shared-frontmatter-value-list.md:15, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:230, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:27
- iteration 4 context_type_consumer_drift (ruled_out): The proposed missing consumer integration is not present.; evidence=.skilled/skills/system-spec-kit/shared/context-types.ts:34, .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:9, .skilled/skills/system-spec-kit/runtime/cli/extractors/session-extractor.ts:17, .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:15
- iteration 5 alias_acceptance_drift (ruled_out): The inspected source comments and maps preserve the distinction between frontmatter acceptance and legacy migration.; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:7, .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:19, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:34, .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:47, .skilled/skills/system-spec-kit/shared/context-types.ts:75

### Clean Search Proof
- iteration 1 citation_path_resolution (ruled_out): No correctness defect found in the inspected spaced-path and redirect resolution direction.; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts:203
- iteration 1 shared_alias_contract (ruled_out): The document checker alias list and runtime legacy migration set have explicitly different contracts.; evidence=.skilled/skills/system-spec-kit/shared/context-types.ts:70, .skilled/skills/system-spec-kit/shared/tests/context-types.test.ts:33
- iteration 2 shell_argument_injection (ruled_out): No reviewed wrapper or subprocess constructs a shell command from document content or path text.; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:29, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh:38, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:187, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1803, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1808
- iteration 2 document_content_to_process_execution (ruled_out): No content-derived command string or eval/exec sink was identified in the scoped helpers.; evidence=.skilled/skills/sk-doc/shared/scripts/validate_document.py:1803, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1808, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:29, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh:38
- iteration 2 regex_redos (ruled_out): No regex path was found where untrusted content controls a pattern with catastrophic backtracking behavior.; evidence=.skilled/skills/sk-doc/shared/scripts/validate_document.py:1634, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1635, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:54
- iteration 2 document_derived_write_path_traversal (ruled_out): Path traversal through untrusted document content was not present in the reviewed data flow.; evidence=.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:2206, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1422, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:2343, .skilled/skills/sk-doc/shared/scripts/validate_document.py:1887
- iteration 4 spec_code_drift (ruled_out): Direct source inspection found no new mismatch.; evidence=specs/system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/005-source-resolver/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/009-census-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening/acceptance-criteria.md:57, specs/system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc/acceptance-criteria.md:57, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:230, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:27, .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:214, .skilled/skills/system-spec-kit/shared/context-types.ts:34, .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:9, .skilled/skills/system-spec-kit/runtime/cli/extractors/session-extractor.ts:17, .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:15, .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:2
- iteration 4 playbook_capability_drift (ruled_out): Direct source-to-scenario comparison found no new mismatch.; evidence=.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-census-across-doc-families.md:15, .skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md:15, .skilled/skills/sk-doc/manual-testing-playbook/document-validation/shared-frontmatter-value-warning.md:15, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/source-tag-resolution.md:15, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/shared-frontmatter-value-list.md:15, .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:360, .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:230, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:27
- iteration 4 context_type_consumer_drift (ruled_out): The proposed missing consumer integration is not present.; evidence=.skilled/skills/system-spec-kit/shared/context-types.ts:34, .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:9, .skilled/skills/system-spec-kit/runtime/cli/extractors/session-extractor.ts:17, .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:15
- iteration 5 alias_acceptance_drift (ruled_out): The inspected source comments and maps preserve the distinction between frontmatter acceptance and legacy migration.; evidence=.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:7, .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json:19, .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:34, .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:47, .skilled/skills/system-spec-kit/shared/context-types.ts:75

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
