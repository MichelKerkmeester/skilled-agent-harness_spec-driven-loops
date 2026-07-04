# Iteration 010: test suite coverage and contract validation (final pre-synthesis pass)

## Focus

- Dimension: correctness (test contract validation)
- Goal: run the full test suite as ground truth, count tests
  per file, verify the `__test` export contract, and check
  the parent's "6-file" and "16-seam pin" narratives against
  the actual numbers.

## Scorecard

- Dimensions covered: correctness (test contract validation);
  also touches maintainability (test architecture) and
  traceability (test count narrative)
- Files reviewed: 8 test files + 1 source file + 1 contract test
- New findings: P0=0 P1=1 P2=1
- Refined findings: 1 (F018 refined: now grounded in the
  actual 17-seam count and 8-file count, both empirically
  observed by running the test suite)
- New findings ratio: 1.0 (2/2 — every observation is novel)

## Findings

### P0 Findings

None.

### P1 Findings

- **F030 — Phase 018's "6-file test suite" narrative is wrong;
  actual test count is 8 files and 101 tests** —
  The parent's phase-map and phase 018 spec reference "6-file
  test suite" (e.g.,
  `spec.md:216`, `spec.md:222`, `010-security-and-correctness-fixes/implementation-summary.md`
  which shows `exit: 0` 6 times in the suite run). The actual
  test directory has 8 goal-related cjs files (verified at
  `iterations/iteration-010.md:5-15`): mk-goal-capabilities,
  mk-goal-continuation, mk-goal-export-contract, mk-goal-lifecycle,
  mk-goal-state, mk-goal-supervisor, mk-goal-tool-path,
  speckit-goal-offer-contract. The test counts per file are
  8, 18, 3, 27, 21, 11, 9, 4 = 101 tests total. The
  `node --test` reporter at
  `iterations/iteration-010.md:48-58` confirms 101 pass / 0 fail.
  The parent's "6-file" count is stale (pre-phase-012). Phase
  018 will need to update both the suite-count narrative and
  the test architecture's per-file conversions to match the
  current 8-file reality.
  - Category: traceability (with correctness impact)
  - Source evidence: `ls mk-goal-*.test.cjs speckit-*.test.cjs`
    at `iterations/iteration-010.md:30-44`; `node --test`
    reporter output at `iterations/iteration-010.md:48-58`.
  - Affected surface hints: `["spec.md handoff table",
    "phase 018 spec.md", "010-security-and-correctness-fixes
    implementation-summary.md (Step 1/3/4 output)"]`

### P2 Findings

- **F031 — The audit dossier's DOC-2 finding (F024's missing
  row) and the new F024 finding (missing test file in both
  catalogs) together imply the system-skill-advisor catalog
  AND the system-spec-kit catalog need to be updated to add
  `speckit-goal-offer-contract.test.cjs`** — the 8th test file
  is missing from BOTH feature catalogs (F024), and the audit
  dossier's DOC-2 fix (add `mk-goal-export-contract.test.cjs`
  to the catalog) is already done (F026, redundant). The
  combined effect is that phase 015's REQ-010 ("the
  feature-catalog validation table lists
  `mk-goal-export-contract.test.cjs`") is now redundant AND
  the actual missing test file (`speckit-goal-offer-contract.test.cjs`)
  is not in any catalog fix-up. Phase 015 should also add
  this row, or phase 020/phase 008 should sweep it in.
  - Category: traceability
  - Source evidence: F024 + F026 + this iteration's
    `node --test` reporter output.
  - Affected surface hints: `["feature_catalog/18--ux-hooks/goal-opencode-plugin.md",
    "feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md",
    "phase 015 REQ-010",
    "phase 008 system-spec-kit integration scope"]`

## Refinements

- **F018 refined** — Originally recorded as "Phase 018's
  '16-seam pin' narrative is stale; current __test has 17
  seams." This iteration's empirical run of the test suite
  confirms: the export-contract test
  (`mk-goal-export-contract.test.cjs:30-48`) asserts exactly
  17 entries; the `__test` freeze at
  `mk-goal.js:2637-2655` has 17 entries; all 17 are used by
  at least 1 test file. The "16-seam pin" narrative is
  confirmed stale; F018 stays P1.

## Test Suite Ground Truth (run 2026-07-04)

| File | Test Count | Result |
|------|------------|--------|
| mk-goal-capabilities.test.cjs | 8 | PASS |
| mk-goal-continuation.test.cjs | 18 | PASS |
| mk-goal-export-contract.test.cjs | 3 | PASS |
| mk-goal-lifecycle.test.cjs | 27 | PASS |
| mk-goal-state.test.cjs | 21 | PASS |
| mk-goal-supervisor.test.cjs | 11 | PASS |
| mk-goal-tool-path.test.cjs | 9 | PASS |
| speckit-goal-offer-contract.test.cjs | 4 | PASS |
| **TOTAL** | **101** | **101 pass / 0 fail / 0 skipped** |

`node --test` reporter:
```
# tests 101
# pass 101
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 2178.1895
```

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | partial  | hard     | parent narrative vs test count reality         | 1 stale count (F030) |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | n/a      | advisory | not run this iteration                         | Defer (covered in iteration 006) |
| agent_cross_runtime| n/a      | advisory | not run this iteration                         | Defer (covered in iteration 009) |
| feature_catalog_code| partial | advisory | catalogs miss the 8th test file                | F024 + F031 |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer (covered in iteration 008) |

## Assessment

- newFindingsRatio: 1.0 (2/2 novel, 1 refinement)
- dimensionsAddressed: correctness (test contract validation)
- noveltyJustification: empirical test run revealed 8-file /
  101-test / 17-seam reality, contradicting the parent's
  "6-file" and phase 018's "16-seam" narratives; this is the
  definitive ground-truth observation the loop needed before
  synthesis.

## Ruled Out

- The 7 non-`mk-goal` tests in the 8-file list (capabilities,
  continuation, export-contract, lifecycle, state, supervisor,
  tool-path) all have the same `node --test` reporter output
  and exit 0; no per-file failure to enumerate.
- The `mk-deep-loop-guard.test.cjs` and
  `mk-dist-freshness-guard.test.cjs` are out of scope
  (different plugins, not in the goal-plugin contract).

## Dead Ends

- Trying to derive a "test coverage percentage" by counting
  covered branches — would require a coverage tool run, which
  is out of scope for this read-only review pass.

## Recommended Next Focus

Phase 3 (SYNTHESIS): compile `review-report.md` with all 9 core
sections + the conditional `## Resource Map Coverage Gate`
section (omitted because `resource_map_present: false`). Pull
all 30 findings (F001-F031 minus de-duplicated refinements)
from the registry, group them by severity, dimension, and
remediation workstream, and produce the final report.

## Claim Adjudication

```json
{"findingId":"F030","claim":"Parent phase-map and phase 018 spec say '6-file test suite'; actual is 8 files / 101 tests. The 6-file count predates phase 012's regression-test backfill.","evidenceRefs":["spec.md:216","spec.md:222","010-security-and-correctness-fixes/implementation-summary.md","node --test reporter output: tests 101, pass 101, fail 0, duration 2178ms"],"counterevidenceSought":"Re-ran ls on tests/; 8 goal-related cjs files confirmed. Re-ran node --test; 101 tests passed.","alternativeExplanation":"Could be that the parent's '6-file' count refers to a curated subset of tests (excluding export-contract and speckit-goal-offer-contract as 'contract tests, not behavior tests'). The audit dossier and impl-summaries don't make this distinction.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If the operator intentionally excludes contract tests from the '6-file' count, downgrade to P2 documentation drift."}
{"findingId":"F031","claim":"Combined effect of F024 (8th test file missing from catalogs) and F026 (DOC-2 already done) means phase 015 REQ-010 is partially redundant and the actual missing row (speckit-goal-offer-contract.test.cjs) is not in any planned fix.","evidenceRefs":["F024 evidence","F026 evidence","spec.md phase-map"],"counterevidenceSought":"Confirmed F024 (both catalogs miss the 8th test file) and F026 (DOC-2 row is present). Phase 015 REQ-010 enumerates only DOC-2 fix.","alternativeExplanation":"Could be that phase 008 (system-spec-kit integration) covers the speckit-goal-offer-contract row in a later sweep, but that phase is already Complete per the phase-map.","finalSeverity":"P2","confidence":0.9,"downgradeTrigger":"If phase 008's completion includes the speckit-goal-offer-contract row addition, downgrade to P2 (already P2)."}
```

Review verdict: CONDITIONAL