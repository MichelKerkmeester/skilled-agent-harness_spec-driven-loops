---
title: "Tasks: 028 Spec Housekeeping"
description: "Fix tasks for remediation phase 5."
trigger_phrases:
  - "028 drift remediation"
  - "tasks: 028 spec housekeeping"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded tasks for phase 5"
    next_safe_action: "Work the fix tasks"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: 028 Spec Housekeeping

<!-- ANCHOR:notation -->
## Task Notation
- [ ] open
- [x] fixed and verified
- [~] false-positive (reason in ledger)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Load ledger entries for 005-spec-housekeeping
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] F026 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-root.md` 007-root claims bitemporal wiring is still pending, but 011 follow-up says it was done
- [ ] F027 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-010-dark-flag-validation.md` 010 validation says bitemporal wiring unconfirmed, but 011 says it was done
- [ ] F035 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json` Dead relative key_file path in root graph-metadata
- [ ] F036 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/graph-metadata.json` Dead relative key_file path in review-remediation graph-metadata
- [ ] F038 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/benchmark-and-test-status.md` Non-migrated phase parent contains heavy doc
- [ ] F051 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/handover.md` 028-root phase parent carries heavy/non-canonical docs violating lean trio
- [ ] F052 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/graph-metadata.json` 5 of 8 child phase parents missing migrated flag (inconsistent with 000/006/028-root)
- [ ] F053 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/graph-metadata.json` 007 phase parent has non-trio benchmark doc + missing migrated flag
- [ ] F076 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json` Parent 028 graph-metadata uses bare lib/ path that does not resolve at repo root
- [ ] F077 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero/graph-metadata.json` Mixed absolute-vs-bare-lib conventions in key_files
- [ ] F078 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window/graph-metadata.json` Same file represented twice with different path conventions
- [ ] F079 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/033-identity-resolver-merge-safety/graph-metadata.json` Entity path reverts to bare lib/ while sibling entities use absolute paths
- [ ] F080 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/checklist.md` Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- [ ] F081 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert/checklist.md` Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- [ ] F082 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/checklist.md` Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- [ ] F083 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/029-vague-query-model-benchmark/checklist.md` Completed child checklist still declares 'Pending (run in progress)'
- [ ] F100 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/037-drift-gate-synopsis-extractor/graph-metadata.json` 037 drift validator path drops system-spec-kit prefix
- [ ] F108 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/description.json` Inconsistent phase-parent level metadata
- [ ] F122 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/before-vs-after.md` before-vs-after.md present at 6 phase parents — undocumented non-canonical leak
- [ ] F123 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/041-search-quality-fixes/graph-metadata.json` key_files path spec/is-phase-parent.ts does not exist at listed location
- [ ] F124 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/001-multihop-tail-appends/graph-metadata.json` key_files path lib/search/deterministic-multihop.ts missing mcp_server prefix
- [ ] F125 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/003-true-citation-ledger/graph-metadata.json` key_files path handlers/memory-search.ts missing mcp_server prefix
- [ ] F126 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/004-save-reconsolidation/graph-metadata.json` key_files path lib/storage/reconsolidation.ts missing mcp_server prefix
- [ ] F127 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/009-flag-name-cleanup/graph-metadata.json` key_files path lib/response/profile-formatters.ts missing mcp_server prefix
- [ ] F151 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking/graph-metadata.json` Relative-only lib/ path with no repo-root-absolute equivalent
- [ ] F152 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/002-retrieval-class-weights/graph-metadata.json` All code references use bare lib/ paths resolving only under mcp_server
- [ ] F153 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/description.json` 001 parent claims level 1
- [ ] F154 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/description.json` 002 parent claims level 1
- [ ] F155 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/description.json` 003 parent claims level 1
- [ ] F156 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/description.json` 004 parent claims level 1
- [ ] F157 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/description.json` 005 parent claims level 3
- [ ] F158 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/description.json` 007 parent claims level 3
- [ ] F166 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/graph-metadata.json` 036 graph metadata keeps repo-misrelative script paths
- [ ] F167 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening/graph-metadata.json` 038 test script path is missing skills prefix
- [ ] F168 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/039-full-repo-json-migration/graph-metadata.json` 039 migration script is listed twice with one bad path
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] opus re-reads every touched file; evidence resolved; scope respected
- [ ] validate.sh on this phase --strict exit 0
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 35 findings terminal in the ledger.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- ../remediation-ledger.jsonl
<!-- /ANCHOR:cross-refs -->
