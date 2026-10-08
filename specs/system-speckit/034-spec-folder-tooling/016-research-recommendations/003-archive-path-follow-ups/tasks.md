---
title: "Tasks: Archive path follow-ups"
description: "The task list for Archive path follow-ups, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "archive path follow ups tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Archive path follow-ups

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
## Phase 1: Audit and Documentation

- [ ] T001 [P0] Grep for archive policy mentions in all four tools (.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs, heal-spec-docs.cjs, .../graph/migrate-generated-json.ts, .../spec/upgrade-legacy.mjs)
- [ ] T002 [P0] Read README-repair-derived.md section 6 and document current content (.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:section 6)
- [ ] T003 [P] [P0] Review upgrade-legacy.mjs archive test and comments (.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:197-219, archive test section)
- [ ] T004 [P] [P0] List heal-spec-docs.cjs archive behavior at lines 40 and 189 (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:40,189)
- [ ] T005 [P] [P0] Review migrate-generated-json.ts archive walk and rewrite (.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:25,72,276)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [P0] Verify repair-derived.cjs FROZEN_TREES and comments reflect current-location semantics (.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:436-443)
- [ ] T007 [P0] Verify README-repair-derived.md section 6 documents archive scope under current-location semantics (.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:127-144)
- [ ] T008 [P0] Add archive documentation comment to heal-spec-docs.cjs SKIP_DIRS section to explain policy (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:40)
- [ ] T009 [P1] Verify upgrade-legacy.mjs header and repairArchived function align with current-location policy (.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12-14,419-429)
- [ ] T010 [P0] Add fixture test to archive-track.vitest.ts that archives a real packet, restores it, and validates with --strict (.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 [P0] Run test suite and confirm all archive-track tests pass (.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts)
- [ ] T012 [P0] Run full spec-kit test suite with npm test and verify no regressions
- [ ] T013 [P1] Manually verify archive-restore-validate workflow with a real test packet
- [ ] T014 [P1] Review spec.md, plan.md, tasks.md for consistency
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
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



