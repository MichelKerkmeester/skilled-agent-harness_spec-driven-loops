---
title: "Tasks: Phase 11: anchor-repair-mode"
description: "The task list for Anchor repair mode, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "anchor repair mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: anchor-repair-mode

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

- [ ] T001 Verify phase 1 (SH-01) template fix is available and new scaffolds render correctly
- [ ] T002 Collect 10 fixture examples: glued template pairs, fenced duplicates, nested questions layouts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Build the fence parser that respects code fence boundaries (`` ``` `` and `~~~`) (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`)
- [ ] T004 [P] Build the collision detector that checks suffix conflicts when numbering duplicates (same file)
- [ ] T005 Build the anchor-repair mode with dry-run that writes nothing and reports findings (same file)
- [ ] T006 [P] Add un-nesting detector for the systematic questions layout (same file)
- [ ] T007 Add anchor-repair as a repair step in `upgrade-legacy.mjs` (`.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`)
- [ ] T013 Run the un-nesting move, and no other anchor repair, on archived packets in `repairArchived`, and update the header comment (`.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`)
- [ ] T014 Update the archived test at line 208 to allow exactly the un-nesting move, and add a prose-identity check (`.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts`)
- [ ] T008 [P] Write tests for all three defect classes and collision detection (`.skilled/skills/system-spec-kit/runtime/cli/tests/heal-spec-docs.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add atomic write implementation for all anchor edits in a document
- [ ] T009a Run the test suite on all three defect types: `npx vitest run heal-spec-docs.vitest.ts`
- [ ] T010 Run dry-run on 50 random documents from the 549 and verify no files written, findings reported
- [ ] T011 Apply anchor-repair on the same 50 documents and run `validate.sh --strict` on each
- [ ] T012 Run the full spec-kit CLI suite and verify no regressions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
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
| P0 Items | 8 | [ ]/8 |
| P1 Items | 4 | [ ]/4 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: Pending completion
<!-- /ANCHOR:summary -->

---



