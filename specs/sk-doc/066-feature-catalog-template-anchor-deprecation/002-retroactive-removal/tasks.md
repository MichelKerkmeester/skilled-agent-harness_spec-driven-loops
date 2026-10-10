---
title: "Tasks: Phase 2: retroactive-removal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retroactive removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: retroactive-removal

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

- [x] T001 Census: 548 copies in 548 catalog files, 529 underscore and 19 hyphenated (git grep)
- [x] T002 Baseline: `validate_catalog_package.py --repo-root .` exits 1 with 761 violations (42 fail, 719 warn)
- [x] T003 Write the sweep script (scratch/remove_template_anchor.py)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the script once: files_changed=548 markers_removed=548 inline_copies_left=0 (scratch/remove-template-anchor-report.json)
- [x] T005 Patch-bump the 27 owning units and write their changelog entries
- [x] T006 Point the cli-classifier README release table and SKILL.md hub-changelog link at v0.8.1.0
- [x] T007 Re-mint the six hub activation manifests and copy each to the authored root
- [x] T008 Regenerate Hermes copies and the trigger index
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `git diff --numstat`: 548 files, each 0 insertions and 2 deletions
- [x] T010 Catalog validator output identical to baseline once line numbers are normalized
- [x] T011 `validate_document.py` on all 548 files: 547 pass, 1 fails identically at HEAD
- [x] T012 Guard, Hermes check, trigger index check and frontmatter gate exit 0
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`py_compile` clean)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented: the script exits 1 and writes nothing for a file with a leftover copy
- [x] CHK-013 [P1] Code follows project patterns (Python checklist header, docstring, numbered sections)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested: hyphenated spelling removed, heading spacing scanned
- [x] CHK-023 [P1] Error scenarios validated: no inline copies found
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed in phase 1
- [x] CHK-FIX-003 [P0] Consumer inventory completed: no reader
- [x] CHK-FIX-004 [P0] Security/path/parser fixes: not applicable
- [x] CHK-FIX-005 [P1] Matrix axes listed: two spellings, 27 units, 548 files
- [x] CHK-FIX-006 [P1] Hostile env variant: not applicable
- [x] CHK-FIX-007 [P1] Evidence pinned to the phase commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: the script takes one repository path
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable): cli-classifier release table
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion: only the script and its report remain
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-10
<!-- /ANCHOR:summary -->

---
