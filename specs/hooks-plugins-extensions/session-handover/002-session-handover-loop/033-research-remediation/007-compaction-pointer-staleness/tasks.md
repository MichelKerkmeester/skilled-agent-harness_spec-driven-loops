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

- [x] T001 Run both test commands and record the baseline pass counts (plan.md section 5) (baseline: node 892 tests, 886 pass, 6 fail, all six in other phases' in-flight red tests; vitest 54 pass)
- [x] T002 [P] Inventory `seedText` callers (no existing test pins the old after-compaction text exactly) (callers: compact-pointer.mjs, pi/session-relaunch.ts, .opencode/plugins/session-relaunch.js, plus seedInstructions in nudge.cjs on the relaunch path)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add failing test "after-compaction pointer names the note created_at and the git checks", plus the no-date case, and confirm it is red (`tests/nudge.test.cjs`) (red before: both failed on AssertionError)
- [x] T004 [P] Add a fixed `created_at: 2026-10-25T10:00:00Z` to the fixture, replacing `new Date()` at `:1215`, and add failing test "compaction pointer carries the note date" (`tests/claude-adapters.test.cjs`) (red before: AssertionError, pointer lacked the git step)
- [x] T005 [P] Add a fixed `created_at: 2026-10-25T10:00:00Z` to the `writeOpenNote` fixture (`:995-1015`), and add failing test "compaction pointer carries the note date" (`pi/session-relaunch.test.ts`) (red before: vitest AssertionError, 1 failed)
- [x] T006 [P] Add a fixed `created_at: 2026-10-25T10:00:00Z` to the fixture (`:144-152`), and add failing test "compaction pointer carries the note date" (`.opencode/plugins/tests/session-relaunch.test.cjs`) (red before: AssertionError)
- [x] T007 Add `createdAt` and the dated git step (date wrapped in `shellQuote`; empty and missing treated alike) to the after-compaction branch of `seedText` (`lib/nudge.cjs`)
- [x] T008 Widen `noteSpecFolder()` (`:65-72`) to return `{ specFolder, createdAt }` from its one read and pass `createdAt` from the Claude caller (`claude/compact-pointer.mjs`) (helper renamed noteFields, since it no longer returns only the folder)
- [x] T009 Widen `noteSpecFolder()` (`:356-366`) to return `{ specFolder, createdAt }` from its one read, pass `createdAt` from Pi and widen its options type (`pi/session-relaunch.ts`) (helper renamed noteFields; tsc -p tsconfig.pi.json exit 0)
- [x] T010 Widen `noteSpecFolder()` (`:116-123`) to return `{ specFolder, createdAt }` from its one read and pass `createdAt` from OpenCode (`.opencode/plugins/session-relaunch.js`) (helper renamed noteFields)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun both test commands; new tests green, relaunch seed tests unedited and green (node 896/896 pass, vitest 59/59 pass; no existing test line removed)
- [x] T012 Live proof: none required (none required; sample dated and undated pointers printed with node -e)
- [x] T013 Fill `implementation-summary.md` and mark rows in `acceptance-criteria.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md [spec.md section 4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [plan.md sections 1 and 3]
- [x] CHK-003 [P1] Dependencies identified and available [no dependency on other phases]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [node --check on the six edited JS files, all ok; tsc -p tsconfig.pi.json exit 0]
- [x] CHK-011 [P0] No console errors or warnings [suite output shows no new warnings]
- [x] CHK-012 [P1] Error handling implemented [helpers fall back to empty fields on a read or parse error, as before]
- [x] CHK-013 [P1] Code follows project patterns [same helper shape across the three adapters]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [acceptance-criteria.md, all four rows Met]
- [x] CHK-021 [P0] Manual testing complete [no live proof required by the plan; dated and undated pointer text printed and read]
- [x] CHK-022 [P1] Edge cases tested [missing, empty and null created_at covered in nudge.test.cjs]
- [x] CHK-023 [P1] Error scenarios validated [unreadable note keeps the undated step through the empty fallback]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [class: cross-consumer, one producer and three consumers]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [rg seedText|afterCompaction: one producer, nudge.cjs seedText]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [three compaction callers updated; seedInstructions takes the relaunch path and is unchanged]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [hostile date x'; rm -rf ~ stays one quoted argument; empty and missing take the no-op undated path]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [axes afterCompaction by createdAt (set, missing), four rows; relaunch byte check ran 24 rows, 0 differences]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [N/A: the new code reads no process-wide state]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [working-tree diff against HEAD 933d71235f; the orchestrator commits]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [none added]
- [x] CHK-031 [P0] Input validation implemented [date is shellQuoted inside the git command]
- [x] CHK-032 [P1] Auth/authz working correctly [N/A: no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [tasks and acceptance criteria updated]
- [x] CHK-041 [P1] Code comments adequate [comments carry the why only]
- [x] CHK-042 [P2] README updated (if applicable) [N/A: README describes no pointer text]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [temp output kept in the session scratchpad, outside the repo]
- [x] CHK-051 [P1] scratch/ cleaned before completion [no files added under scratch/]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



