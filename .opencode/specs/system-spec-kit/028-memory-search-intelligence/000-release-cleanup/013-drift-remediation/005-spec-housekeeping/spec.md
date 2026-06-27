---
title: "Feature Specification: 028 Spec Housekeeping"
description: "Remediation phase 5 of 6: 35 drift findings (P1 16, P2 19). Each is verified real, fixed by gpt-5.5 high, re-verified by opus."
trigger_phrases:
  - "028 drift remediation"
  - "feature specification: 028 spec housekeeping"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase 5 from the remediation ledger"
    next_safe_action: "Triage and fix the 35 findings"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: 028 Spec Housekeeping

<!-- ANCHOR:metadata -->
## 1. METADATA
- Track: 008-drift-remediation, phase 5 of 6
- Findings: 35 (P1 16, P2 19)
- Ledger: ../remediation-ledger.jsonl (phase=005-spec-housekeeping)
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 028 drift audit surfaced 35 evidence-backed findings in this surface area: doc/config/test reality drifted from code.
### Purpose
Verify each against the real file, fix the genuine ones with minimal scoped edits, re-verify, and leave every ledger entry terminal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
The 35 findings in REQUIREMENTS.
### Out of Scope
Findings in other phases; adjacent cleanup not cited by a finding.
### Files to Change
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-root.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-010-dark-flag-validation.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/benchmark-and-test-status.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/handover.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/033-identity-resolver-merge-safety/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/checklist.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert/checklist.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/checklist.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/029-vague-query-model-benchmark/checklist.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/037-drift-gate-synopsis-extractor/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/description.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/before-vs-after.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/041-search-quality-fixes/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/001-multihop-tail-appends/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/003-true-citation-ledger/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/004-save-reconsolidation/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/009-flag-name-cleanup/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/002-retrieval-class-weights/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/description.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/description.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/description.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/description.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/description.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/description.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening/graph-metadata.json`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/039-full-repo-json-migration/graph-metadata.json`
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### Required (complete OR user-approved deferral)
- F026 [P1 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-root.md:62` 007-root claims bitemporal wiring is still pending, but 011 follow-up says it was done
- F027 [P1 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-010-dark-flag-validation.md:62` 010 validation says bitemporal wiring unconfirmed, but 011 says it was done
- F035 [P1 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json:65` Dead relative key_file path in root graph-metadata
- F036 [P1 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/graph-metadata.json:44` Dead relative key_file path in review-remediation graph-metadata
- F038 [P1 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/benchmark-and-test-status.md:1` Non-migrated phase parent contains heavy doc
- F051 [P1 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/handover.md` 028-root phase parent carries heavy/non-canonical docs violating lean trio
- F052 [P1 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/graph-metadata.json:1-3` 5 of 8 child phase parents missing migrated flag (inconsistent with 000/006/028-root)
- F053 [P1 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/graph-metadata.json:1-5` 007 phase parent has non-trio benchmark doc + missing migrated flag
- F076 [P1 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json:65` Parent 028 graph-metadata uses bare lib/ path that does not resolve at repo root
- F077 [P1 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero/graph-metadata.json:44-48` Mixed absolute-vs-bare-lib conventions in key_files
- F078 [P1 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window/graph-metadata.json:44-50` Same file represented twice with different path conventions
- F079 [P1 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/033-identity-resolver-merge-safety/graph-metadata.json:54` Entity path reverts to bare lib/ while sibling entities use absolute paths
- F080 [P1 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/checklist.md:3` Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- F081 [P1 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert/checklist.md:3` Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- F082 [P1 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/checklist.md:3` Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- F083 [P1 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/029-vague-query-model-benchmark/checklist.md:3` Completed child checklist still declares 'Pending (run in progress)'
- F100 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/037-drift-gate-synopsis-extractor/graph-metadata.json:39` 037 drift validator path drops system-spec-kit prefix
- F108 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/description.json:2` Inconsistent phase-parent level metadata
- F122 [P2 dead] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/before-vs-after.md` before-vs-after.md present at 6 phase parents — undocumented non-canonical leak
- F123 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/041-search-quality-fixes/graph-metadata.json:44` key_files path spec/is-phase-parent.ts does not exist at listed location
- F124 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/001-multihop-tail-appends/graph-metadata.json:46` key_files path lib/search/deterministic-multihop.ts missing mcp_server prefix
- F125 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/003-true-citation-ledger/graph-metadata.json:44` key_files path handlers/memory-search.ts missing mcp_server prefix
- F126 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/004-save-reconsolidation/graph-metadata.json:48` key_files path lib/storage/reconsolidation.ts missing mcp_server prefix
- F127 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/009-flag-name-cleanup/graph-metadata.json:38` key_files path lib/response/profile-formatters.ts missing mcp_server prefix
- F151 [P2 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking/graph-metadata.json:44,56` Relative-only lib/ path with no repo-root-absolute equivalent
- F152 [P2 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/002-retrieval-class-weights/graph-metadata.json:46-48,71-77` All code references use bare lib/ paths resolving only under mcp_server
- F153 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/description.json:2` 001 parent claims level 1
- F154 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/description.json:2` 002 parent claims level 1
- F155 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/description.json:2` 003 parent claims level 1
- F156 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/description.json:2` 004 parent claims level 1
- F157 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/description.json:2` 005 parent claims level 3
- F158 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/description.json:19` 007 parent claims level 3
- F166 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/graph-metadata.json:38-39` 036 graph metadata keeps repo-misrelative script paths
- F167 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening/graph-metadata.json:47` 038 test script path is missing skills prefix
- F168 [P2 misalignment] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/039-full-repo-json-migration/graph-metadata.json:58` 039 migration script is listed twice with one bad path
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Every listed finding terminal in the ledger (fixed+verified or false-positive with reason).
- opus re-read confirms evidence resolved and scope respected.
- validate.sh --strict exit 0 for this phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS
- A fix touches more than the cited drift (scope creep) -> opus verifies scope per file.
- A finding is a false positive -> triage before fixing; never fix a phantom.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- No behavior regressions; edits are doc/config/test alignment only.
- Comment hygiene: no artifact-ids or spec paths in code comments.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- Same file cited by multiple findings -> batch edits, verify once per file.
- Evidence line numbers shifted since the audit -> verify by content, not line.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS
None open; deferrals (if any) are recorded as false-positive with reason in the ledger.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## 10. RELATED DOCS
- ../remediation-ledger.jsonl
- ../../research/drift-audit-2026-06-27/converged-report.md
<!-- /ANCHOR:related-docs -->
