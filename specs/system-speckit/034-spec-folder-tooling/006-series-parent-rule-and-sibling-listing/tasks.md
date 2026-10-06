---
title: "Tasks: Series parent rule, sibling listing and trigger phrases for new packets"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "series parent rule tasks"
  - "sibling listing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Series parent rule, sibling listing and trigger phrases for new packets

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
## Phase 1: Rule docs

- [x] T001 Define the series parent in §2 and allow it in §4, fix the Option D and E labels (`references/structure/phase-definitions.md`)
- [x] T002 [P] Point the versions table at the series parent (`references/structure/sub-folder-versioning.md`)
- [x] T003 [P] Name the exception beside the thresholds (`references/structure/phase-system.md`, `SKILL.md`)
- [x] T004 [P] Update §8, the priority line, the labels and the create step (`references/workflows/quick-reference.md`)
- [x] T005 [P] Name the series parent in Gate 3 Option C and fix the Option D notes (`AGENTS.md`, `speckit-plan.yaml`, `speckit-complete.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Seed trigger phrases from the slug and description in every `spec.md` that `create.sh` copies (`runtime/cli/spec/create.sh`)
- [x] T007 Count the four template phrases as generic in the judge (`runtime/cli/retrieval/lib/phrase-judge.mjs`)
- [x] T008 List recent packets in the track to stderr before allocating a top-level number (`runtime/cli/spec/create.sh`)
- [x] T009 Add test coverage for T006 to T008 and update the golden snapshot (`runtime/cli/tests/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun the six baseline test files plus new tests
- [x] T011 Run one `create.sh` in a scratch specs root and read the listing and the phrases
- [x] T012 Validate the parent recursively in strict mode and check the trigger index
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

- [x] CHK-001 [P0] Requirements documented in spec.md - spec.md §4 lists REQ-001 to REQ-007
- [x] CHK-002 [P0] Technical approach defined in plan.md - plan.md §3 and §4
- [x] CHK-003 [P1] Dependencies identified and available - opencode and node available, both used
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n create.sh` passes, vitest passes
- [x] CHK-011 [P0] No console errors or warnings - no stack trace on a missing track, stderr only carries the listing
- [x] CHK-012 [P1] Error handling implemented - the listing returns 0 on any read or node failure
- [x] CHK-013 [P1] Code follows project patterns - reuses the existing perl and node -e patterns in create.sh
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - acceptance-criteria.md: 7 of 7 Met
- [x] CHK-021 [P0] Manual testing complete - two worktree create.sh runs, real track and missing track
- [x] CHK-022 [P1] Edge cases tested - 14-day window, phase child silence and punctuation covered by tests
- [x] CHK-023 [P1] Error scenarios validated - missing track folder and missing node return 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. - class-of-bug: every restatement of the thresholds
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. - search for the threshold wording found one missed doc, fixed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. - consumers: Gate 3 text, command notes, judge diagnostics
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - N/A, no security, path or parser fix
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. - N/A, no matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - N/A, no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. - commits 6a21c6b5311, bff396f481e, f53d63e4615
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - no secrets touched
- [x] CHK-031 [P0] Input validation implemented - phrases are reduced to [a-z0-9 ] before they reach YAML
- [x] CHK-032 [P1] Auth/authz working correctly - N/A, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - spec, plan, tasks and acceptance criteria agree
- [x] CHK-041 [P1] Code comments adequate - one why-comment per new function, no ids in comments
- [x] CHK-042 [P2] README updated (if applicable) - N/A, no README covers these flags
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - scratch runs used the scratchpad, scratch folders removed
- [x] CHK-051 [P1] scratch/ cleaned before completion - no files left in scratch/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-06
<!-- /ANCHOR:summary -->

---



