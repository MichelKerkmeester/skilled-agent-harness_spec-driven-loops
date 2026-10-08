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
- [ ] T002 [P0] Confirm phase 001 has landed before step A
- [ ] T003 [P1] Run corpus baseline and capture ANCHORS_VALID findings by severity
- [ ] T004 [P1] Document baseline results
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P0] Add duplicate-closer detection to validateAnchorIntegrity() (`.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`)
- [ ] T006 [P0] Add nesting detection that allows `adr-NNN` to contain `adr-NNN-*`, reported at warning severity (step A)
- [ ] T007 [P0] After phase 011 lands: raise nesting findings to error severity (step B)
- [ ] T008 [P0] Update validator-registry.json ANCHORS_VALID description (`.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`)
- [ ] T009 [P0] Update validation-rules.md Anchor Rules (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 [P0] Re-run corpus validation and compare to baseline
- [ ] T011 [P0] Document which folders changed and verify match expectations
- [ ] T012 [P0] Update test fixtures that nest (e.g. 003-valid-level2/spec.md) and add fixtures for the allowance and duplicate closers
- [ ] T013 [P1] Run full spec-kit test suite
- [ ] T014 [P1] Manual tests with nested anchors, decision-record nesting and a duplicate closer
- [ ] T015 [P1] Verify all test failures align with chosen rule
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001 through T015 marked complete
- [ ] Operator decision recorded in spec.md section 10
- [ ] Code, registry, and docs aligned
- [ ] Corpus baseline comparison documented
- [ ] Test fixtures updated and test suite passing
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

- [ ] CHK-001 [P0] Operator decision documented (spec.md section 10)
- [ ] CHK-002 [P0] Corpus baseline captured
- [ ] CHK-003 [P0] Research understood
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Checks

- [ ] CHK-010 [P0] orchestrator.ts compiles with no errors
- [ ] CHK-011 [P0] New validation logic correctly placed
- [ ] CHK-012 [P1] Registry description matches code
- [ ] CHK-013 [P1] Documentation is accurate
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checks

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Corpus validation matches expectations
- [ ] CHK-022 [P0] Spec-kit test suite passes
- [ ] CHK-023 [P1] Manual test cases pass/fail as expected
<!-- /ANCHOR:testing -->

---
