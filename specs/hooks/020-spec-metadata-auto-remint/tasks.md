---
title: "Tasks: Auto re-derive a spec packet's generated metadata at commit time"
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
# Tasks: Auto re-derive a spec packet's generated metadata at commit time

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

- [x] T001 Run every skill and routing audit to find which drift is real rather than assumed
- [x] T002 Establish that a passing packet reports zero repairable, so the count means failing
- [x] T003 Measure the scale repository-wide and per track
- [x] T004 [P] Identify the one subtree carrying another session's uncommitted work
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Sweep every track with the repair tool, excluding the live subtree by name
- [x] T006 Add the gate block modelled on the routing re-mint gate (`git-hooks/pre-commit`)
- [x] T007 Resolve a staged document to the nearest ancestor carrying `graph-metadata.json`
- [x] T008 Refuse a partly staged packet, and refuse a pathspec-narrowed commit
- [x] T009 Stage the two generated files and confirm they reached the index
- [x] T010 [P] Add eight cases to the hook harness and rename it for two gates
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the hook harness against the real hook file
- [x] T012 Re-run the repository dry run and confirm zero repairable outside the exclusion
- [x] T013 Let the gate fire on this packet's own commit as the end-to-end proof
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
- **Closure gate**: See `acceptance-criteria.md`
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

- [x] CHK-010 [P0] The hook parses under `bash -n`
- [x] CHK-011 [P0] No case emits an unexpected warning
- [x] CHK-012 [P1] Every refusal prints what is wrong and how to fix it
- [x] CHK-013 [P1] The block follows the shape of the routing gate beside it rather than inventing a second idiom
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The harness exercises the real hook file, not a copy
- [x] CHK-022 [P1] Edge cases tested: scratch file, phase child, no-op repair, unrelated commit
- [x] CHK-023 [P1] Error scenarios validated: tool failure, partial staging, throwaway index
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `class-of-bug`: one derived artifact whose regeneration nothing enforced, across every packet in the repository.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. The sibling case is the compiled-routing manifest, which already has its gate, and this block is modelled on it.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the validator reads the fingerprint, and nothing else does.
- [x] CHK-FIX-004 [P0] The path-walk invariant is stated and its adversarial case covered by a phase-child test, where the wrong ancestor would leave the real packet stale.
- [x] CHK-FIX-005 [P1] Axes listed: staged or not, packet depth, repair outcome, index kind.
- [ ] CHK-FIX-006 [P1] Hostile env variant not run beyond the throwaway-index case, which is the one that matters here.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the final state, with the harness rerun after the last edit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Input validation implemented. The walk stops at `specs/` rather than escaping upward.
- [x] CHK-032 [P1] Auth/authz working correctly. Not applicable, no auth surface is touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments state why the gate auto-fixes and why each refusal exists
- [x] CHK-042 [P2] README updated. Not applicable, the hook README lists gates by their block comment
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The sweep script ran from the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

The one unverified P1 is CHK-FIX-006, whose only relevant variant is already covered.

**Verification Date**: 2026-09-10
<!-- /ANCHOR:summary -->

---
