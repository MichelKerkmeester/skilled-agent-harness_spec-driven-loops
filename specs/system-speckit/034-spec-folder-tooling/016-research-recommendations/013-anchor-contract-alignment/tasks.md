---
title: "Tasks: Phase 13: anchor-contract-alignment"
description: "Get operator decision, baseline corpus, implement chosen anchor rules, align registry and docs."
trigger_phrases:
  - "anchor contract alignment tasks"
  - "ANCHORS_VALID implementation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: anchor-contract-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup & Decision

- [x] T001 [P0] Operator decision: option 2 with the `adr-NNN` allowance plus duplicate closers, decided 2026-10-08 (spec.md section 10)
- [x] T002 [P0] Confirm phase 001 has landed before step A. Evidence: 001 spec.md reads Status Complete, and wave 1 was pushed to main (`73be1380b6`, `c65147fca3`, parent goal.md progress log)
- [x] T003 [P1] Run corpus baseline and capture ANCHORS_VALID findings by severity. Evidence: `scratch/anchors-baseline-step-a.json` (4,642 packets, pass 4,612, error 30)
- [x] T004 [P1] Document baseline results. Evidence: `scratch/anchors-baseline-step-a.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Add duplicate-closer detection to validateAnchorIntegrity() (`.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`). Evidence: the closer-count pass in `validateAnchorIntegrity()`, fixture 080, test "reports a name closed twice when it is opened once"
- [x] T006 [P0] Add nesting detection that allows `adr-NNN` to contain `adr-NNN-*`, reported at warning severity (step A). Evidence: `anchorNestingFindings()` in orchestrator.ts. Step A warning output in `gates/now-078-anchors-nested-questions.raw`; step A test "warns when an anchor opens inside another one"
- [x] T007 [P0] After phase 011 lands: raise nesting findings to error severity (step B). Evidence: `ANCHOR_NESTING_SEVERITY = 'error'` at orchestrator.ts:106, set after census3 found zero nested documents. The flip rests on 011's un-nesting, whose closeout sets 011's status. Dated note 2026-10-09: OC-O4 removed this constant. The error entry at `orchestrator.ts:846-851` carries the nesting findings now, see implementation-summary.md deviation 9
- [x] T008 [P0] Update validator-registry.json ANCHORS_VALID description (`.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`). Evidence: line 109, corrected in 013-F1, 013-F2 and 013-O6
- [x] T009 [P0] Update validation-rules.md Anchor Rules (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md`). Evidence: section 6 (lines 368-484) and the summary row at line 58 match the code, see AC-004
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P0] Re-run corpus validation and compare to baseline. Evidence: `scratch/anchors-baseline-step-b.md` compares with step A (pass 4,613, error 29, one packet error to pass, nesting findings 0)
- [x] T011 [P0] Document which folders changed and verify match expectations. Evidence: step B report, "Changed packets" (one folder, `z_archive/022-hybrid-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/merged-030-architecture-boundary-remediation`, error to pass from a working-tree edit), and the expected zero nesting findings
- [x] T012 [P0] Update test fixtures that nest (e.g. 003-valid-level2/spec.md) and add fixtures for the allowance and duplicate closers. Evidence: `test-fixtures/003-valid-level2/spec.md` moves its questions anchor below the nfr block. New fixtures 078, 079 and 080 exist, and `tests/anchor-contract.vitest.ts` holds 11 cases
- [x] T013 [P1] Run full spec-kit test suite. Evidence: `gates/tree5/cli-test.log` rc 0, 171 files and 1,775 tests passed, 0 failed
- [x] T014 [P1] Manual tests with nested anchors, decision-record nesting and a duplicate closer. Evidence: the validate.sh runs of fixtures 078, 079 and 080 in `gates/now-*.raw`, and the same cases as vitest tests in `anchor-contract.vitest.ts`
- [x] T015 [P1] Verify all test failures align with chosen rule. Evidence: no test in tree1 through tree5 failed on an anchor-rule expectation. The one tree1 failure (workflow-invariance over the 011 anchor-repair-sample fixture prefix) was cleared by 011-I1 and passes in tree5, 2 of 2 isolated (`gates/tree5/workflow-invariance-isolated.rc` 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001 through T015 marked complete
- [x] Operator decision recorded in spec.md section 10
- [x] Code, registry, and docs aligned
- [x] Corpus baseline comparison documented
- [x] Test fixtures updated and test suite passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research Source**: `../../014-spec-auto-healing-research/research/research.md` section 5.2, section 11 SH-13
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation Checks

- [x] CHK-001 [P0] Operator decision documented (spec.md section 10)
- [x] CHK-002 [P0] Corpus baseline captured. Step A ran before any change, and step B ran after the flip with the census taken before it
- [x] CHK-003 [P0] Research understood (research.md section 5.2 and the SH-13 row of section 11)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Checks

- [x] CHK-010 [P0] orchestrator.ts compiles with no errors. Evidence: `gates/tree5/build.rc`, `build-cli.rc`, `typecheck.rc` and `typecheck-cli.rc` are all 0. The five eslint `no-unused-vars` errors in orchestrator.ts also appear on HEAD (`gates/closeout-013/eslint-orchestrator-now.log`), so they predate this phase
- [x] CHK-011 [P0] New validation logic correctly placed. Evidence: the closer-count and nesting passes sit inside `validateAnchorIntegrity()`, with helpers `anchorNestingFindings()` and `stripInlineCode()`
- [x] CHK-012 [P1] Registry description matches code. Evidence: AC-003
- [x] CHK-013 [P1] Documentation is accurate. Evidence: AC-004
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checks

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-001 to AC-007 are Met in acceptance-criteria.md
- [x] CHK-021 [P0] Corpus validation matches expectations. Evidence: step B shows nesting findings 0 and no new errors (error count 30 to 29)
- [x] CHK-022 [P0] Spec-kit test suite passes. Evidence: `gates/tree5/cli-test.log` rc 0, 1,775 passed, 0 failed
- [x] CHK-023 [P1] Manual test cases pass/fail as expected. Evidence: the 11 cases of `anchor-contract.vitest.ts` pass in `gates/tree5/focused-vitest.log` (rc 0, 8 files, 152 tests)
<!-- /ANCHOR:testing -->

---
