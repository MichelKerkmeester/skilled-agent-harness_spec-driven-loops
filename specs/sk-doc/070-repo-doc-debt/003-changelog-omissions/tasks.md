---
title: "Tasks: Phase 3: changelog-omissions"
description: "Ordered tasks and verification checklist for changelog-omissions."
trigger_phrases:
  - "changelog omissions tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: changelog-omissions

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

- [x] T001 Run the changelog check over every tracked entry. Verify: 53 of 864 files warn
- [x] T002 Separate the `SHA-256` false positives. Verify: 3 files flagged for nothing else
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Reword ids into scenario and decision names in 50 entries, 14 briefs. Verify: each file validates with no changelog warning
- [x] T004 Correct rewordings that changed a fact. Verify: `cli-opencode` v1.3.3.0 and `sk-create-changelog` v1.2.0.0 and v1.3.0.0 fixed by hand
- [x] T005 Write one patch entry per touched skill and set its carriers. Verify: `parent-skill-check.cjs` 13a and 13b pass
- [x] T006 Regenerate the Hermes skill copies. Verify: `sync-skills-hermes.cjs --check` prints PASS: 67
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Read every word diff and check mappings against playbook titles. Verify: sampled ids match their titles; archived decision records checked in git history
- [x] T008 Rerun the changelog check. Verify: 4 files flagged, all `SHA-256`
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

- [x] CHK-010 [P0] Edited files pass their validator. Evidence: `validate_document.py` VALID on the 50 reworded and 10 new entries
- [x] CHK-011 [P0] No new validator warnings on edited files. Evidence: `validate_document.py` VALID on the 50 reworded and 10 new entries
- [x] CHK-012 [P1] Failure path handled: an unresolvable item is left and listed, not guessed. Evidence: implementation-summary.md Known Limitations
- [x] CHK-013 [P1] Edits follow the owning template. Evidence: diff review
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Diffs reviewed for lost facts and invented links. Evidence: every word diff read; three rewordings corrected by hand
- [x] CHK-022 [P1] Edge cases checked. Evidence: `SHA-256` left as an algorithm name; ids in code spans and spec-folder lines untouched
- [x] CHK-023 [P1] Before and after counts measured from reruns. Evidence: 53 flagged files before, 4 after (all `SHA-256`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: documentation-only diff
- [x] CHK-031 [P0] Input validation: N/A, no code changed
- [x] CHK-032 [P1] Auth/authz: N/A, no code changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: validate.sh strict
- [x] CHK-041 [P1] Code comments: N/A, no code changed
- [x] CHK-042 [P2] README updated where in scope. Evidence: Files Changed table in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept outside the repo, in the session scratchpad. Evidence: `git status` shows no stray files
- [x] CHK-051 [P1] scratch/ holds only its .gitkeep. Evidence: `ls scratch`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
