---
title: "Tasks: Header tags, hook catch and script test fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "remediation tasks"
  - "confirmed row application"
  - "shell header tag normalization"
  - "silent hook catch stderr"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Header tags, hook catch and script test fixes

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

- [x] T001 Read the confirmed tables and the cited standard clauses (../026-runtime-code-standards-research/research/confirmed-findings.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Normalize the header tags with a line-3 substitution per file (runtime/cli)
- [x] T003 Remove the dead barrel and its compiled copy (runtime/cli/utils/memory-frontmatter.ts)
- [x] T004 Make the hook report on stderr and add the migration-header rationale and the embeddings comment (runtime/hooks/cursor, runtime/cli/lib, shared)
- [x] T005 Write the two script tests (runtime/cli/tests)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the two tests and the CLI typecheck
- [x] T007 grep the retired tags and confirm no hit
- [x] T008 Validate this child strict, regenerate metadata, commit by pathspec
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

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Gates rerun from the final state with output read
- [x] CHK-022 [P1] Residue scan clean
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Implementation summary records every judgment decision
- [x] CHK-042 [P2] Parent map row and timeline entry updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 4/4 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---
