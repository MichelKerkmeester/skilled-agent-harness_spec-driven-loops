---
title: "Tasks: Phase 3: feature-catalog-findings"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "feature catalog findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: feature-catalog-findings

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

- [x] T001 Capture the baseline: 761 findings (42 fail, 719 warn)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Script: `normalize_validation_types.py`, 300 rows
- [x] T003 Script: `remove_packet_history_lines.py`, 110 lines
- [x] T004 Script: `sync_leaf_frontmatter.py`, 166 fields in 147 leaves
- [x] T005 Script: `link_phantom_rows.py`, 84 links
- [x] T006 Builders: stale paths in system-spec-kit, system-skill-advisor, system-deep-loop, sk-design, sk-vision and sk-doc
- [x] T007 Builder: mcp-click-up unshipped labels and sk-git placeholder rows
- [x] T008 Narrow the warn-tier list to five packages
- [x] T009 Bump 20 non-hub units (19 with a `SKILL.md`) with `../scratch/bump_units.py`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun the validator: 15 findings (3 fail, 12 warn)
- [x] T011 Run the validator test scripts: ALL PASS
- [x] T012 Run the close-out checks
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
- [x] CHK-012 [P1] Error handling implemented: the script reports and skips what it cannot change
- [x] CHK-013 [P1] Code follows project patterns (Python checklist header, docstring, numbered sections)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
- [x] CHK-FIX-003 [P0] Consumer inventory completed
- [x] CHK-FIX-004 [P0] Security/path/parser fixes: not applicable
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md
- [x] CHK-FIX-006 [P1] Hostile env variant: not applicable
- [x] CHK-FIX-007 [P1] Evidence pinned to the phase commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: the script takes explicit paths
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable): not applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion: only the phase script remains
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
