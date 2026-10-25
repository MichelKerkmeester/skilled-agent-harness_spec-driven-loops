---
title: "Tasks: Phase 7: compaction-pointer-staleness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "compaction pointer staleness tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: compaction-pointer-staleness

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

- [ ] T001 Run both test commands and record the baseline pass counts (plan.md section 5)
- [ ] T002 [P] Inventory `seedText` callers (no existing test pins the old after-compaction text exactly)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add failing test "after-compaction pointer names the note created_at and the git checks", plus the no-date case, and confirm it is red (`tests/nudge.test.cjs`)
- [ ] T004 [P] Add a fixed `created_at: 2026-10-25T10:00:00Z` to the fixture, replacing `new Date()` at `:1215`, and add failing test "compaction pointer carries the note date" (`tests/claude-adapters.test.cjs`)
- [ ] T005 [P] Add a fixed `created_at: 2026-10-25T10:00:00Z` to the `writeOpenNote` fixture (`:995-1015`), and add failing test "compaction pointer carries the note date" (`pi/session-relaunch.test.ts`)
- [ ] T006 [P] Add a fixed `created_at: 2026-10-25T10:00:00Z` to the fixture (`:144-152`), and add failing test "compaction pointer carries the note date" (`.opencode/plugins/tests/session-relaunch.test.cjs`)
- [ ] T007 Add `createdAt` and the dated git step (date wrapped in `shellQuote`; empty and missing treated alike) to the after-compaction branch of `seedText` (`lib/nudge.cjs`)
- [ ] T008 Widen `noteSpecFolder()` (`:65-72`) to return `{ specFolder, createdAt }` from its one read and pass `createdAt` from the Claude caller (`claude/compact-pointer.mjs`)
- [ ] T009 Widen `noteSpecFolder()` (`:356-366`) to return `{ specFolder, createdAt }` from its one read, pass `createdAt` from Pi and widen its options type (`pi/session-relaunch.ts`)
- [ ] T010 Widen `noteSpecFolder()` (`:116-123`) to return `{ specFolder, createdAt }` from its one read and pass `createdAt` from OpenCode (`.opencode/plugins/session-relaunch.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Rerun both test commands; new tests green, relaunch seed tests unedited and green
- [ ] T012 Live proof: none required
- [ ] T013 Fill `implementation-summary.md` and mark rows in `acceptance-criteria.md`
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

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



