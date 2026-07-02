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
- Review Target: See topic above (two-target files review: create.sh corruption bug + phase-010 deriveStatus fix audit) (files)
- Started: 2026-07-02T10:46:47Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: gpt-followup-audit-20260702T104647Z
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
| P1 (Required) | 6 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| gpt-followup-audit-iter-001 | correctness inventory pass - Target 1 create.sh parent description.json write path | correctness | 1.00 | 0/1/0 | complete |
| gpt-followup-audit-iter-002 | correctness determinism - Target 1 phase append parent description overwrite | correctness | 0.18 | 0/1/0 | complete |
| gpt-followup-audit-iter-003 | security blast-radius scan - Target 1 existing description.json corruption | security | 0.33 | 0/1/0 | complete |
| gpt-followup-audit-iter-004 | maintainability minimal fix proposal - Target 1 only | maintainability | 0.50 | 0/2/0 | complete |
| gpt-followup-audit-iter-005 | correctness - Target 2 REQ-001..REQ-005 deriveStatus completion-evidence audit | correctness | 1.00 | 0/1/0 | complete |
| gpt-followup-audit-iter-006 | correctness - Target 2 edge-case audit of deriveStatus completion_pct and no-open-tasks gate | correctness | 0.08 | 0/0/1 | complete |
| gpt-followup-audit-iter-007 | security - Target 2 severity-resolution regression check for generated-metadata-integrity and flag wiring | security | 0.13 | 0/1/0 | complete |
| gpt-followup-audit-iter-008 | traceability - Target 2 test suite gap analysis | traceability | 0.37 | 0/1/1 | complete |
| gpt-followup-audit-iter-009 | traceability cross-cutting - Target 1/Target 2 independence and status-completion flag wiring | traceability | 0.00 | 0/0/0 | complete |
| gpt-followup-audit-iter-010 | adversarial wrap-up - both targets claim adjudication | maintainability/correctness/security/traceability | 0.00 | 0/6/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
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
- Last 3 ratios: 0.37 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
- persistentSameSeverity: 7
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 7

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=40, ruledOut=26, deferred=4, blocked=0

### Search Debt
- iteration 1 blast-radius-signature (deferred): Needs a path-aware JSON classifier rather than broad grep output.; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/description.json:3
- iteration 2 blast_radius_signature (deferred): Requires a path-aware JSON classifier to separate legitimate roots, archived scratch records, and corrupted nested parent packets.; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json:3, .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json:20
- iteration 3 related_metadata_drift (deferred): Related drift is outside this Target 1 same-corruption count and needs its own data-quality audit before severity assignment.; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/deep-review-strategy.md:114

### Ruled-Out Candidates
- iteration 1 child-writer-false-cause (ruled_out): Verified by direct read of generator arguments.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 2 argument_parsing_misalignment (ruled_out): Direct parser read shows stable variable assignment before phase mode.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:55, .opencode/skills/system-spec-kit/scripts/spec/create.sh:207, .opencode/skills/system-spec-kit/scripts/spec/create.sh:323, .opencode/skills/system-spec-kit/scripts/spec/create.sh:329
- iteration 2 generator_state_leak (ruled_out): No module-level mutable state participates in the reviewed CLI path.; evidence=.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:30, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1315, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 2 parent_metadata_precondition (ruled_out): Canonical field construction ignores stale state for the fields involved in the corruption.; evidence=.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:70, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:91, .opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:64
- iteration 2 child_writer_false_cause (ruled_out): The child call target is the child folder path.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 3 child_description_overwrite (ruled_out): The high-confidence candidate has identity/lineage corruption, but its description body still aligns with the parent spec purpose.; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/spec.md:41, .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/spec.md:63, .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/spec.md:66, .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json:4
- iteration 4 child_description_regression (ruled_out): Verified by direct read of separate parent and child generator calls.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1329, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1351, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 4 phase_parent_detection_regression (ruled_out): Verified against classifier source assumptions.; evidence=.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:38, .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:50, .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:51, .opencode/skills/system-spec-kit/scripts/utils/phase-classifier.ts:5, .opencode/skills/system-spec-kit/scripts/lib/phase-classifier.ts:86
- iteration 5 derive_status_file_presence_fallback (ruled_out): Verified by direct read of the patched fallback.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1215-1239, git show ea2bb09b7a
- iteration 5 validator_status_mismatch_missing (ruled_out): Verified by direct code and test reads.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:179-233, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221-257
- iteration 5 status_mismatch_blocks_by_default (ruled_out): Verified by direct read of flag, resolver, and bridge.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220, .opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:344-363, .opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:81-101
- iteration 6 malformed_completion_pct (ruled_out): Verified by direct read of parser branch.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1269, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1225-1233
- iteration 6 quoted_completion_pct (ruled_out): Verified by direct read of extraction and numeric parsing.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:493-494, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1269
- iteration 6 zero_checkbox_tasks_vacuous (ruled_out): Spec lacks a positive-task-count requirement.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1272-1280, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/spec.md:132-143
- iteration 6 empty_implementation_summary (ruled_out): Verified by direct read of parser branch.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1265, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1225-1233
- iteration 6 derive_only_concurrency (ruled_out): No shared mutable deriveStatus state found.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1307-1318, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1505-1527
- iteration 7 legacy_violation_code_regression (ruled_out): verified by direct read of producer and resolver branches; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354
- iteration 8 targeted_suite_count_claim (ruled_out): Broader-suite interpretation remains possible, but the two requested files contain only 47 test cases.; evidence=.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:191-766, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:77-296
- iteration 9 cross_target_coupling (ruled_out): No shared import, env read, caller, or data path connects capability-flags.ts to the create.sh parent description writer.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046-1062, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1310-1317, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1351-1357, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:37-38, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77-90, .opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220, .opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:323-364
- iteration 9 flag_name_default_mismatch (ruled_out): All reviewed flag surfaces agree on the env name and report-mode default.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220, .opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:323-364, .opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:81-85, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310
- iteration 9 unreported_prior_coverage_gap (ruled_out): Prior iteration narratives and registry already capture the genuine gaps found so far.; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-001.md:34-44, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-004.md:49-81, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-005.md:30-58, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-008.md:33-42
- iteration 10 child-description-overwrite (ruled_out): verified by direct read of child generator call; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351-1357
- iteration 10 flag-name-default-mismatch (ruled_out): helper and tests agree on env name/default; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:209-220, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310
- iteration 10 cross-target-coupling (ruled_out): prior cross-cutting pass found no coupling; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-009.md:64-79

### Clean Search Proof
- iteration 1 child-writer-false-cause (ruled_out): Verified by direct read of generator arguments.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 2 argument_parsing_misalignment (ruled_out): Direct parser read shows stable variable assignment before phase mode.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:55, .opencode/skills/system-spec-kit/scripts/spec/create.sh:207, .opencode/skills/system-spec-kit/scripts/spec/create.sh:323, .opencode/skills/system-spec-kit/scripts/spec/create.sh:329
- iteration 2 generator_state_leak (ruled_out): No module-level mutable state participates in the reviewed CLI path.; evidence=.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:30, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1315, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 2 parent_metadata_precondition (ruled_out): Canonical field construction ignores stale state for the fields involved in the corruption.; evidence=.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:70, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:91, .opencode/skills/system-spec-kit/mcp_server/lib/description/description-merge.ts:64
- iteration 2 child_writer_false_cause (ruled_out): The child call target is the child folder path.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 3 child_description_overwrite (ruled_out): The high-confidence candidate has identity/lineage corruption, but its description body still aligns with the parent spec purpose.; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/spec.md:41, .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/spec.md:63, .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/spec.md:66, .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json:4
- iteration 4 child_description_regression (ruled_out): Verified by direct read of separate parent and child generator calls.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1329, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1351, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1355
- iteration 4 phase_parent_detection_regression (ruled_out): Verified against classifier source assumptions.; evidence=.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:38, .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:50, .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:51, .opencode/skills/system-spec-kit/scripts/utils/phase-classifier.ts:5, .opencode/skills/system-spec-kit/scripts/lib/phase-classifier.ts:86
- iteration 5 derive_status_file_presence_fallback (ruled_out): Verified by direct read of the patched fallback.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1215-1239, git show ea2bb09b7a
- iteration 5 validator_status_mismatch_missing (ruled_out): Verified by direct code and test reads.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:179-233, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221-257
- iteration 5 status_mismatch_blocks_by_default (ruled_out): Verified by direct read of flag, resolver, and bridge.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220, .opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:344-363, .opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:81-101
- iteration 6 malformed_completion_pct (ruled_out): Verified by direct read of parser branch.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1269, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1225-1233
- iteration 6 quoted_completion_pct (ruled_out): Verified by direct read of extraction and numeric parsing.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:493-494, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1269
- iteration 6 zero_checkbox_tasks_vacuous (ruled_out): Spec lacks a positive-task-count requirement.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1272-1280, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/spec.md:132-143
- iteration 6 empty_implementation_summary (ruled_out): Verified by direct read of parser branch.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1265, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1225-1233
- iteration 6 derive_only_concurrency (ruled_out): No shared mutable deriveStatus state found.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1307-1318, .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1505-1527
- iteration 7 legacy_violation_code_regression (ruled_out): verified by direct read of producer and resolver branches; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354
- iteration 8 targeted_suite_count_claim (ruled_out): Broader-suite interpretation remains possible, but the two requested files contain only 47 test cases.; evidence=.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:191-766, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:77-296
- iteration 9 cross_target_coupling (ruled_out): No shared import, env read, caller, or data path connects capability-flags.ts to the create.sh parent description writer.; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046-1062, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1310-1317, .opencode/skills/system-spec-kit/scripts/spec/create.sh:1351-1357, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:37-38, .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77-90, .opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220, .opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:323-364
- iteration 9 flag_name_default_mismatch (ruled_out): All reviewed flag surfaces agree on the env name and report-mode default.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220, .opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:323-364, .opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:81-85, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310
- iteration 9 unreported_prior_coverage_gap (ruled_out): Prior iteration narratives and registry already capture the genuine gaps found so far.; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-001.md:34-44, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-004.md:49-81, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-005.md:30-58, .opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-008.md:33-42
- iteration 10 child-description-overwrite (ruled_out): verified by direct read of child generator call; evidence=.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351-1357
- iteration 10 flag-name-default-mismatch (ruled_out): helper and tests agree on env name/default; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:209-220, .opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310
- iteration 10 cross-target-coupling (ruled_out): prior cross-cutting pass found no coupling; evidence=.opencode/specs/system-speckit/028-memory-search-intelligence/010-generated-metadata-status-integrity/review/iterations/iteration-009.md:64-79

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
