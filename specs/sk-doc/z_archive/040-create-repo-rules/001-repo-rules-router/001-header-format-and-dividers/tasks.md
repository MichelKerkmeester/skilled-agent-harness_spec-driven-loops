---
title: "Tasks: Phase 1: Numbered-Header Casing and Section Dividers"
description: "Ordered tasks for the formatting pass over REPO RULES.md and the six repo-rules files: capture baseline counts, run a fence-aware heading-casing transform, insert section dividers, then prove by diff shape and idempotence that nothing but headings, dividers, and blank lines changed."
trigger_phrases:
  - "header casing tasks"
  - "divider insertion tasks"
  - "diff shape assertion"
  - "idempotent formatting pass"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: Numbered-Header Casing and Section Dividers

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

- [x] T001 Record the pre-transform baseline: numbered-header count and divider count per file (`REPO RULES.md`, `repo-rules/*.md`)
- [x] T002 Confirm the seven target paths are clean in `git status`, so the resulting diff is attributable to this phase
- [x] T003 [P] Confirm no fenced code block in the seven files contains a line matching `^## [0-9]+\. `
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the transform in `scratch/`: fence-aware, uppercases numbered-heading prose, leaves backticked spans byte-identical
- [x] T005 Run the heading pass over all seven files
- [x] T006 Run the divider pass: insert `---` before each numbered heading whose nearest preceding non-blank line is not already `---`, including before the first numbered heading of each file
- [x] T007 Re-run the transform and confirm the second run is a no-op (empty diff)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Assert per file that the numbered-header count equals the uppercase-numbered-header count
- [x] T009 Assert per file that no two `---` lines are adjacent and that no trailing divider was appended after the final section
- [x] T010 Review `git diff -U0` over the seven files and confirm every changed line is a heading, a `---`, or blank
- [x] T011 Resolve every `repo-rules/*.md` link in `REPO RULES.md` against the filesystem
- [x] T012 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Diff-shape assertion passed with recorded output
- [x] `scratch/` holds only re-runnable drivers (`format_rules.py`, `run-iteration.mjs`); the one-shot template filler was removed at close-out
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Parent packet**: See `../spec.md` Phase Documentation Map
- **Target files**: `../../../../REPO RULES.md` and `../../../../repo-rules/`
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
- [x] CHK-003 [P1] Baseline counts captured before any file is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The transform is fence-aware and never rewrites text inside backticks
- [x] CHK-011 [P0] The transform is idempotent: a second run produces an empty diff
- [x] CHK-012 [P1] The transform fails loud on a file with zero numbered headers rather than silently passing
- [x] CHK-013 [P1] The transform lives in `scratch/` and ships nothing into the runtime tree
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Diff-shape review complete across all seven files
- [x] CHK-022 [P1] Heading shapes covered: plain prose, containing a code span, containing punctuation
- [x] CHK-023 [P1] Divider edge cases checked: first numbered section, last numbered section, sub-heading between two numbered sections
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase is a formatting change, not a defect fix. The rows below record that classification rather than assume it.

- [x] CHK-FIX-001 [P0] Finding class recorded as `instance-only`: the change is confined to seven named files with no behavioral producer
- [x] CHK-FIX-002 [P0] Same-class producer inventory run: `rg -n '^## [0-9]+\. ' 'REPO RULES.md' repo-rules/` enumerates every heading the transform may touch
- [x] CHK-FIX-003 [P0] Consumer inventory run for `REPO RULES.md` and `repo-rules/` references across the repository
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser, or redaction surface is touched; recorded rather than skipped
- [x] CHK-FIX-005 [P1] Matrix axes listed: 7 files x 3 heading shapes x 3 divider positions
- [x] CHK-FIX-006 [P1] Not applicable - the transform reads no process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase, not to a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets present in the seven files before or after the pass
- [x] CHK-031 [P0] Not applicable - no input is parsed at runtime; the files are read by an agent, not executed
- [x] CHK-032 [P1] Not applicable - no auth or authorization surface is touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] The transform in `scratch/` carries a docstring saying why it exists and why it is not a runtime tool
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated from Pending
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

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



