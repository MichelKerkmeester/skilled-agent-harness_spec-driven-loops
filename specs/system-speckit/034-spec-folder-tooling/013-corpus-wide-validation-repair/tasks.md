---
title: "Tasks: Phase 13: corpus-wide-validation-repair"
description: "The task breakdown for repairing every live and archived packet: the baseline, the archive phrase cleanup, the scripted metadata, anchor and field fixes, 43 DeepSeek lanes, and the full re-validation against the baseline."
trigger_phrases:
  - "corpus wide validation repair tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: corpus-wide-validation-repair

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

- [x] T001 Run strict validation over all 4,408 folders under `specs/` that hold a `spec.md` and record each result as the baseline
- [x] T002 Split out the 37 folders that are not packets: backup snapshots, test fixtures and review scopes. That leaves 4,371 packets, 2,046 of them failing: 1,935 of the 2,198 archived and 111 of the 2,173 live
- [x] T003 [P] Group the baseline failures by validator rule to pick a fixer for each class
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the phase 12 cleanup with `--include-archive --apply` over the archived packets' template phrases (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`)
- [x] T005 Set every `description.json` `specFolder` to the folder's path under `specs/`: 1,104 fixed and 3,295 already correct
- [x] T006 Re-derive the recomputable metadata with `repair-derived.cjs` over every packet, then restore the 91 files the run changed inside non-packet folders
- [x] T007 Rename or remove duplicate anchors by script, changing only marker lines, and copy missing `importance_tier` and `contextType` fields from each folder's `spec.md`. The failures fell from 2,046 to 573, then to 474
- [x] T008 [P] Hand the 474 remaining folders to 43 DeepSeek V4.1 Flash lanes through cli-pi, six at a time and up to twelve folders each. Every lane exited 0
- [x] T009 Reconstruct each missing plan, tasks or implementation summary from the packet's `spec.md` and git history, with the dated reconstruction note and unknowns written as not recorded: 157 documents
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Re-validate all 4,371 packets and join the results to the baseline by path
- [x] T011 Compare the body of every modified document with HEAD, ignoring frontmatter, comments and blank lines, and read each flagged change. Three lane edits that changed what a record says were reverted
- [x] T012 Check that every reconstructed document carries the dated note: 157 of 157
- [x] T013 Run the census: 0 template carriers, live and archived, for all five templates
- [x] T014 Rebuild the trigger index and run its freshness check (`generate-trigger-index.mjs --check`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - the orchestrator read every flagged prose change and each lane's report
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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 to REQ-006, with the criteria table in `acceptance-criteria.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md - the staged pipeline from baseline to lanes to re-validation
- [x] CHK-003 [P1] Dependencies identified and available - the phase 12 cleanup, `repair-derived.cjs` and cli-pi
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - no product code changed. The one-off repair scripts lived in the session's working files and are not shipped
- [x] CHK-011 [P0] No console errors or warnings - every lane exited 0 and every repair batch logged no failure for a packet
- [x] CHK-012 [P1] Error handling implemented - the scripts skip a missing file, a missing `spec.md` and a file with no frontmatter instead of guessing
- [x] CHK-013 [P1] Code follows project patterns - the fixes use the shipped cleanup and `repair-derived.cjs` wherever they cover the class
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete - the flagged prose changes and the lane reports were read
- [x] CHK-022 [P1] Edge cases tested - phase parents report their children's issues, so each issue was fixed in the folder that owns the file
- [x] CHK-023 [P1] Error scenarios validated - links with no surviving target keep their text and lose only the link
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - every baseline failure is grouped by validator rule, and each class has one fixer
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - the scaffold that produces the nested `questions` anchor is recorded for phase 14's recommendations
- [x] CHK-FIX-003 [P0] Consumer inventory completed - the trigger index and graph metadata read the corpus and both are regenerated
- [x] CHK-FIX-004 [P0] Adversarial cases - non-packet folders, quoted anchor examples in prose and records whose documents disagree are kept and listed rather than rewritten
- [x] CHK-FIX-005 [P1] Matrix axes - live or archived, by failure class, by fixer
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant - not applicable, the fixes read only the files under `specs/`
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA - each stage is its own commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - none in the changed files
- [x] CHK-031 [P0] Input validation implemented - the scripts act only on folders named in the validator's own output
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable, local file edits with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - reconciled at close
- [x] CHK-041 [P1] Code comments adequate - no shipped code changed
- [x] CHK-042 [P2] README updated (if applicable) - no README change was part of this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the working files stayed outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion - this packet's `scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---
