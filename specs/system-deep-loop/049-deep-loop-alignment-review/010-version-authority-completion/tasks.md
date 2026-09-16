---
title: "Tasks: Phase 10: version-authority-completion"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: version-authority-completion

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

- [x] T001 Resolve the `sk-doc` authority question from git history before aligning anything to it
- [x] T002 Measure every artifact of both hubs and the two `sk-code` `0.x` surfaces against their siblings
- [x] T003 Confirm which files are SHA inputs to the compiled policy
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the missing `sk-doc` release entry so the authority rule holds again
- [x] T005 Raise the four followers in each hub; add the authority sentence to both `SKILL.md` files
- [x] T006 Record the `sk-code` packet-version independence rather than aligning it
- [x] T007 Record what nothing enforces: cross-artifact and hub-versus-packet parity
- [x] T008 Re-mint the activation manifests, runtime and authored copies
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Route guard, metadata, frontmatter and document gates exit zero
- [x] T010 Full deep-loop suite exits zero
- [x] T011 Packet docs filled and strict validation passes
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

- [x] CHK-010 [P0] Validators pass (document and frontmatter gates exit 0)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] JSON artifacts parse after edit
- [x] CHK-013 [P1] Diff is version-and-prose only, no unintended byte changes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (not applicable; automated)
- [x] CHK-022 [P1] Edge cases tested (missing changelog entry, packet version independence, authored copy parity)
- [x] CHK-023 [P1] Error scenarios validated (stale manifest caught by the guard)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug`
- [x] CHK-FIX-002 [P0] Same-class producer inventory: five artifacts per hub across two hubs
- [x] CHK-FIX-003 [P0] Consumer inventory: the compiled policy hash and its manifests; no semantic version reader
- [x] CHK-FIX-004 [P0] Not applicable
- [x] CHK-FIX-005 [P1] Matrix: hub x artifact, ten rows
- [x] CHK-FIX-006 [P1] Not applicable
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (unchanged)
- [x] CHK-032 [P1] Not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Comments state the durable why, never an ephemeral label
- [x] CHK-042 [P2] README not applicable
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
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-16
<!-- /ANCHOR:summary -->

---
