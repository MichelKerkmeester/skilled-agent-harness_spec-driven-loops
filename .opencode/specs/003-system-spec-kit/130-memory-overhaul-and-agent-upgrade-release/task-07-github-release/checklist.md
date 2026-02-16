# Verification Checklist: Task 07 — Tagged Release

<!-- SPECKIT_LEVEL: 3 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## P0 — Pre-Release

- [ ] CHK-001 [P0] All changes from Tasks 01–06 committed to main
- [ ] CHK-002 [P0] No uncommitted changes in working tree
- [ ] CHK-003 [P0] All 3 changelog entries created and committed

## P0 — Release

- [ ] CHK-004 [P0] Git tag `v2.1.0.0` created on correct commit
- [ ] CHK-005 [P0] GitHub release published with correct title
- [ ] CHK-006 [P0] Release notes contain Agent Updates section
- [ ] CHK-007 [P0] Release notes contain Spec-Kit Updates section
- [ ] CHK-008 [P0] Release notes contain Documentation Updates section
- [ ] CHK-009 [P0] Release notes contain Breaking Changes section (none)

## P1 — Formatting

- [ ] CHK-010 [P1] GitHub markdown renders correctly
- [ ] CHK-011 [P1] Version number consistent across tag, title, and notes
- [ ] CHK-012 [P1] Release targets main branch

## Output Verification

- [ ] CHK-030 [P0] changes.md populated with release details
- [ ] CHK-031 [P0] No placeholder text in changes.md

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | /11 |
| P1 Items | 3 | /3 |
| P2 Items | 0 | /0 |

**Verification Date**: ____
