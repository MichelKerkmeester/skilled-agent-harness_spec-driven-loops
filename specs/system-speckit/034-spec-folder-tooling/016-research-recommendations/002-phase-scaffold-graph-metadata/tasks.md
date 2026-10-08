---
title: "Tasks: Phase 2: phase-scaffold-graph-metadata"
description: "Remove early exit in --phase mode, call graph-metadata backfill for parent and children, refresh children_ids, add test case."
trigger_phrases:
  - "phase scaffold graph metadata tasks"
  - "create.sh --phase backfill tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: phase-scaffold-graph-metadata

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
## Phase 1: Setup

- [ ] T001 [P0] Verify backfill-graph-metadata.ts exists and is callable (`.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts`)
- [ ] T002 [P1] Document the current create.sh --phase control flow at lines 1900-1920
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P0] Extract the graph-metadata backfill code (create.sh lines 2006-2021) into a reusable helper function (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [ ] T004 [P0] Call the helper for the parent packet in the --phase block before the exit at line 1919 (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [ ] T005 [P0] Verify the existing _child_paths loop at create.sh:2017-2021 is reached by the helper call; it will drive child backfills automatically (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [ ] T006 [P0] Verify that parent backfill auto-refreshes children_ids from on-disk directories; the deriveGraphMetadata function handles this automatically (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [ ] T007 [P1] Handle errors from backfill calls: report warnings but do not fail the scaffold (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 [P0] Add --phase test case to scaffold-passes-its-own-gate.vitest.ts that creates a parent with two children (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`)
- [ ] T009 [P0] Test case validates parent with strict gates after scaffold (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`)
- [ ] T010 [P0] Test case validates each child with strict gates after scaffold (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`)
- [ ] T011 [P1] Run full spec-kit test suite and verify no regressions
- [ ] T012 [P1] Manual test: create a real phase parent and validate all three packets with validate.sh --strict
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001 through T012 marked complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict validation passes on scaffolded parent and children
- [ ] Full spec-kit test suite passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for problem statement and requirements
- **Plan**: See `plan.md` for technical approach
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research Source**: `../../014-spec-auto-healing-research/research/research.md` section 5.3, section 11 SH-02
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation Checks

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] backfill-graph-metadata.ts exists and is functional
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Checks

- [ ] CHK-010 [P0] No syntax errors in create.sh modifications
- [ ] CHK-011 [P0] Error handling for backfill failures implemented
- [ ] CHK-012 [P1] Code follows bash style conventions in create.sh
- [ ] CHK-013 [P1] New test case follows vitest patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checks

- [ ] CHK-020 [P0] All P0 requirements from acceptance-criteria.md met
- [ ] CHK-021 [P0] New --phase test case in scaffold-passes-its-own-gate.vitest.ts passes
- [ ] CHK-022 [P0] Full spec-kit test suite passes with no regressions
- [ ] CHK-023 [P1] Manual test: created phase parent passes strict validation
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



