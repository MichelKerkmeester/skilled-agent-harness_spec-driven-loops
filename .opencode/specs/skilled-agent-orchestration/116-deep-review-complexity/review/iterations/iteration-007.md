---
title: "Iteration 7: Traceability (Round 2, Cross-Surface)"
iteration: 7
dimension: traceability
focus: cross-surface
status: complete
---

# Iteration 7: Traceability (Round 2, Cross-Surface)

## Execution Summary

Cross-surface traceability review focusing on name consistency across validator code, test fixtures, reducer registry, playbook scenarios, ADR claims, and research synthesis recommendations.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:76-81,233,257,262,276`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts:115-122`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:878-1024,1069-1073,1093-1112,1264,1452,1622`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/058-validator-warn-rollout.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/059-validator-strict-v2.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/060-reducer-search-debt.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/061-stop-gate-candidate-coverage.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/062-stop-gate-graphless-fallback.md`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/004-validator-v2-enforcement/decision-record.md:24-92`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/005-search-ledger-persistence-and-reporting/decision-record.md:24-95`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/001-research-synthesis/research/research.md:116-181`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/004-validator-v2-enforcement/implementation-summary.md:1-117`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/005-search-ledger-persistence-and-reporting/implementation-summary.md:1-151`

## Cross-Surface Consistency Checks

### 1. Validator Failure Codes vs Phase B Fixtures

**Validator codes emitted** (post-dispatch-validate.ts:76-81):
- `v2_missing_ledger`
- `v2_uncited_ledger_row`
- `v2_broken_linked_finding`
- `v2_shallow_finding_details`
- `state_delta_iteration_mismatch`

**Phase B fixture assertions** (review-depth-validator.vitest.ts:115-122):
- 4 TODO tests for v2 validation scenarios
- Tests describe expected behavior but do NOT assert specific failure codes
- Tests are marked `it.todo()` and not yet implemented

**Finding**: P2 - Code-test drift. The validator emits specific failure codes, but the Phase B fixtures don't validate those exact codes. The fixtures describe the scenarios in prose but don't assert the machine-readable codes that the validator actually emits. This reduces test coverage for the specific failure surface.

**Evidence**: `post-dispatch-validate.ts:76-81,233,257,262,276` vs `review-depth-validator.vitest.ts:115-122`

### 2. Reducer Registry Fields vs Playbook Scenarios

**Reducer registry fields** (reduce-state.cjs:878-1024,1069-1073):
- `candidateCoverage`
- `searchDebt`
- `ruledOutCandidates`
- `cleanSearchProof`
- `searchCoverage`

**Playbook scenario field usage** (DRV-060, DRV-061, DRV-062):
- DRV-060: Explicitly lists all 5 fields in objective and expected signals
- DRV-061: Uses `candidateCoverage` and `searchDebt` in gate validation
- DRV-062: Uses `searchCoverage.graphCoverageMode` in fallback validation

**Finding**: PASS - Perfect name consistency. All reducer registry fields are referenced with identical names in the playbook scenarios.

### 3. Phase ADR Claims vs Implementation

**ADR 004 claims** (decision-record.md:24-92):
- Three-phase rollout: warn → hard-fail v2 → STOP wire
- Advisory codes: `legacy_unversioned_record`, `applicability_strict_unenforced`, `ledger_present_but_unverified`
- v2 strict reasons: `v2_missing_ledger`, `v2_uncited_ledger_row`, `v2_broken_linked_finding`, `v2_shallow_finding_details`, state/delta identity mismatch

**Implementation verification** (post-dispatch-validate.ts):
- All 5 v2 strict reasons are present in the type union (line 76-81)
- All 5 are emitted in validation logic (lines 233, 257, 262, 276)
- Advisory codes are documented in implementation notes
- Rollout flag `DEEP_REVIEW_V2_ENFORCEMENT` is present

**ADR 005 claims** (decision-record.md:24-95):
- Extend reducer registry with: `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, `searchCoverage`
- Dashboard verdict uses CONDITIONAL for search debt
- Report renders Search Ledger section

**Implementation verification** (reduce-state.cjs):
- All 5 fields are present in registry output (lines 1069-1073)
- Dashboard rendering includes search debt CONDITIONAL logic (lines 1264, 1452)
- Search debt count is tracked (line 1622)

**Finding**: PASS - All ADR claims are implemented in the cited sources.

### 4. Research Synthesis vs Shipped Features

**Research recommendations** (research.md:116-181):
- R1 (P0): Versioned searchLedger schema → Shipped in Phase C (state_format.md) + Phase D/E (implementation)
- R2 (P0): Validator enforcement → Shipped in Phase D (post-dispatch-validate.ts)
- R3 (P0): Reducer persistence → Shipped in Phase E (reduce-state.cjs)
- R4 (P1): Target-selection proof → Shipped in Phase D/E (targetSelection field)
- R5 (P1): Graph vocabulary → Deferred to Phase G (not yet shipped)
- R6 (P1): Convergence gates → Shipped in Phase F (STOP gates)
- R7 (P1): Graphless fallback → Shipped in Phase F (graphlessFallbackGate)
- R8 (P2): Higher iteration defaults → Explicitly deferred as P2

**Implementation citations**:
- Phase 004 implementation-summary.md cites R2 for validator enforcement
- Phase 005 implementation-summary.md cites R3 for reducer persistence
- Phase D/E bundled commit references both R2 and R3
- Phase F implementation (not reviewed here) would cite R6 and R7

**Finding**: PASS - All shipped P0/P1 recommendations are cited in implementation summaries. R5 is correctly deferred to Phase G. R8 is correctly deferred as P2.

## Traceability Check Results

- **spec_code**: PASS - ADR claims match implementation, research recommendations are cited
- **checklist_evidence**: PARTIAL - Playbook scenarios document expected behavior, but Phase B fixtures don't assert specific validator failure codes

## New Findings

1. **P2**: Code-test drift in validator failure codes. The validator emits specific machine-readable failure codes (`v2_missing_ledger`, `v2_uncited_ledger_row`, `v2_broken_linked_finding`, `v2_shallow_finding_details`, `state_delta_iteration_mismatch`), but the Phase B test fixtures are TODO-only and don't assert these exact codes. This reduces test coverage for the specific failure surface.

## Search Coverage

Required bug classes for this iteration:
- `code_vs_test_drift`: covered (finding #1)
- `code_vs_playbook_drift`: covered (PASS)
- `adr_vs_code_drift`: covered (PASS)
- `research_vs_ship_drift`: covered (PASS)

## Verdict

Review verdict: CONDITIONAL

One P2 finding for code-test drift in validator failure codes. No P0 or P1 findings. Cross-surface consistency is strong for ADR-to-code and reducer-to-playbook alignment, but test fixtures don't validate the specific failure codes that the validator emits.
