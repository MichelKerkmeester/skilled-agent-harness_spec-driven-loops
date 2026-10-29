---
title: "Tasks: Phase 1: diagram-references"
description: "Ordered tasks and verification checklist for diagram-references."
trigger_phrases:
  - "diagram references tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: diagram-references

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Validate all 454 tracked references. Verify: `validate-all.py` prints `failing=65` (61 failing and 4 skipped fixtures)
- [x] T002 Capture the routing baseline (`leaf-route-replay.cjs --report`). Verify: the totals line reads `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`
- [x] T003 Classify every `§N` in the 34 files. Verify: 146 references counted by `grep -o` equal the script's 125 rewritten plus 21 left alone
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write `scratch/renumber-references.py` with plan, apply, verify and preserved commands. Verify: `plan` prints `rows=125 mismatches=0 errors=0`
- [x] T005 Review every row and every left-alone reference by hand. Verify: one override added for `import-drawio.md` line 159, which belongs to `SKILL.md`
- [x] T006 Apply to the 34 files. Verify: `apply` prints `wrote 34 files`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Validate the 34 files. Verify: `validate-all.py` prints `failing=0`
- [x] T008 Rescan for dangling references. Verify: `verify` prints `checked=146 dangling=0`, and the HEAD scan prints the same
- [x] T009 Run the negative control. Verify: `negative-control.py` prints `dangling=20`
- [x] T010 Compare each file with its HEAD version after removing the allowed edits. Verify: `preserved` prints `files=34 differing=0`
- [x] T011 Search for anchor links into the files. Verify: `rg` finds 0 and finds the known `ROUTER.md#3-machine-router` links as a control
- [x] T012 Rerun the replay and compare. Verify: same totals line and `cmp` prints nothing
- [x] T013 Run the diagram corpus check. Verify: it prints `RESULT: PASSED`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited files pass their validator. Evidence: 34 of 34 report `Total issues: 0`
- [x] CHK-011 [P0] No section reference moved to a different heading. Evidence: 125 rows, 0 mismatches
- [x] CHK-012 [P1] Failure path handled: a reference with no matching section stops `apply`. Evidence: a plan run over the next phase's files stopped on a bare `§8` that had no section, which shows the stop fires
- [x] CHK-013 [P1] Edits follow the owning template. Evidence: `skill-reference-template.md` shape, overview first and a rule between sections
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Content outside the allowed edits is unchanged. Evidence: `preserved` prints `files=34 differing=0`
- [x] CHK-022 [P1] Edge cases checked. Evidence: the catalog sentinels, a file that already had an overview and `SKILL.md` citations in the same line as sibling-file citations
- [x] CHK-023 [P1] Before and after counts measured from reruns. Evidence: 190 issues before, 0 after
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: documentation-only diff
- [x] CHK-031 [P0] Input validation: N/A, no product code changed
- [x] CHK-032 [P1] Auth/authz: N/A, no product code changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: validate.sh strict
- [x] CHK-041 [P1] Code comments: N/A, the script stays in scratch/
- [x] CHK-042 [P2] README updated where in scope. Evidence: Files Changed table in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files kept in this packet's scratch/ folders. Evidence: the script, tables and reports sit under `scratch/`
- [x] CHK-051 [P1] No stray files outside the packet and the 34 references. Evidence: `git status` lists only those paths for this phase
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->
