---
title: "Tasks: Phase 3: root-doc-and-repo-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "repo rules tasks"
  - "router walk"
  - "contradiction scan"
  - "root doc clause tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: root-doc-and-repo-rules

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

- [x] T001 Read `repo-rules/communication.md` end to end and list its sections, rather than working from a summary of it (`repo-rules/communication.md`)
  - Evidence: baselines/seam-assignment.md, the section-to-side table lists every section heading of the full read with its line range
- [x] T002 Assign every section of the pre-change file to exactly one side of the seam, by the unit each rule governs rather than the topic it mentions (`baselines/`)
  - Evidence: baselines/seam-assignment.md, the Side column assigns all nine sections, the five self-check items and the scope preamble
- [x] T003 Capture the pre-change per-mark instruction set: for every punctuation mark or construction the stack governs, the file that carries the instruction and the direction it gives (`scratch/`)
  - Evidence: baselines/per-mark-baseline.md, 28 rows across 18 governed marks, each with the file, the line and the direction, plus three marks recorded as not governed
- [x] T004 Capture phase 005's pre-change measurement baseline, before the first edit, because a baseline taken after the rules change cannot support a regression claim
  - Evidence: baselines/measurement-baseline.md, the commit, 13 hashes, the six case rows, the negative control, the capture time and the blind-scoring rule
- [x] T005 [P] Read the current trigger table and index in `REPO RULES.md` and record the rows that reach the reply-shape rule (`REPO RULES.md`)
  - Evidence: baselines/seam-assignment.md, the trigger-table row at REPO RULES.md:47 and the index row at 65, the only two in the 36-70 window
- [x] T006 Read the three places where `AGENTS.md` names the reply-shape rule and confirm each pointer stays true once the split lands (`AGENTS.md`)
  - Evidence: baselines/seam-assignment.md, the pointers at AGENTS.md:146, 399 and 487, each with a note on what the split does to it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> The T007 to T012 evidence names the sentence half `repo-rules/prose-mechanics.md`, its filename when the split landed. Commit `dc79a591e0` renamed it to `repo-rules/communication-prose.md` and repointed the router and every inbound reference. The claims were re-verified against the current filename on 2026-09-15 and hold.

- [x] T007 Create the new half under `repo-rules/` with the routed-from line, the bounded-by statement, a fires-when list and a self-check (`repo-rules/`)
  - Evidence: repo-rules/prose-mechanics.md, the six-key frontmatter, the copied routed-from and bounded-by lines, the five-item fires-when list and the inherited self-check, in the ten-element rule shape
- [x] T008 Move the sentence and paragraph mechanics into the new half, so each moved sentence appears once and reads as it did before the move (`repo-rules/`)
  - Evidence: repo-rules/prose-mechanics.md:37-93, the former sections 2 to 4 of repo-rules/communication.md:70-126 moved whole, wording unchanged, the phrase scan puts every moved instruction in prose-mechanics.md alone
- [x] T009 Keep the whole-reply rules in `repo-rules/communication.md` and update its own header, so its scope statement names what it still owns and points at the other half (`repo-rules/communication.md`)
  - Evidence: repo-rules/communication.md:43-45, the scope paragraph under The rule now names what the file still owns and points at prose-mechanics.md, the register at 51, length at 64, filler at 82, recovery at 99 and the scope exemptions at 115 stayed
- [x] T010 Add the trigger row for the new half, in the same change as the file it names (`REPO RULES.md`)
  - Evidence: REPO RULES.md:48, the trigger row directly after the communication row, added in the same edit set as repo-rules/prose-mechanics.md, its settles cell reads How a sentence reads: sentence and paragraph shape, plain words, punctuation
- [x] T011 Add the index row for the new half, in the same change as the file it names (`REPO RULES.md`)
  - Evidence: REPO RULES.md:67, the index row directly after the Communication row, its summary matches the new rule's description, the checker's 9/9 confirms the match
- [x] T012 Confirm across both halves that no rule sentence was added, removed or reworded, so the diff is a move rather than an edit (`repo-rules/`)
  - Evidence: the only wording changes in the two halves are the shortened description at repo-rules/communication.md:3, the version at 27, the scope sentences at 44-45 and prose-mechanics.md:32-33, the moved blocks and the renumbered headings, every moved sentence appears once, worded as it was
- [x] T013 Record the per-half size baseline: the size of each half immediately after the split, measured the same way for both, so phases 006 and 008 can check their own additions against it
  - Evidence: baselines/seam-assignment.md, SIZE AFTER SPLIT, the wc -l -c output for both halves, 135 lines and 5658 characters against 106 and 3945, recorded beside SIZE BEFORE SPLIT
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Walk every trigger row and open every file it names, confirming none is missing (`REPO RULES.md`)
  - Evidence: the checker run after the change, 12 trigger rows, every named file resolves, RESULT: PASSED (9/9 checks)
- [x] T015 Walk every file under `repo-rules/` and confirm at least one trigger row names it (`repo-rules/`)
  - Evidence: the same run, 12 files under repo-rules/, 12 trigger rows, 12 index rows, no rule file unnamed
- [x] T016 Repeat the per-mark instruction scan and confirm every mark carries one instruction, unchanged from the captured baseline
  - Evidence: the scan repeated against baselines/per-mark-baseline.md, all 28 rows, every mark still carries one instruction, wording unchanged, what changed is the carrier file of the ten instruction rows the moved sections held at communication.md:79-82 and 104-126, they now sit at prose-mechanics.md:37-93, no instruction appears in both halves
- [x] T017 Read both halves for a rule that belongs on the other side of the seam, by reading rather than by grep (`repo-rules/`)
  - Evidence: both halves read against the seam assignment, the register, length, filler, table and recovery rules govern the reply in communication.md, the sentence, paragraph, word and punctuation mechanics govern the unit below it in prose-mechanics.md, no rule sits on the far side of the seam
- [x] T018 Confirm the scoped diff contains no change to `AGENTS.md` and no change to a rule file this phase does not own
  - Evidence: git status --porcelain over the scoped paths, AGENTS.md absent, the changed set is the two halves, the router and the packet docs, the three scratch baselines were already untracked before this dispatch
- [x] T019 Confirm both baselines are recorded in the packet, where phases 005, 006 and 008 read them (`implementation-summary.md`)
  - Evidence: implementation-summary.md, the Verification table records the measurement and per-mark baselines pinned at 4512473abdec9c7f0ea02126f85bb5c709b2ac26 and the size figures themselves, so phases 005, 006 and 008 read them from the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md REQ-001 through REQ-007)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md defines the split approach)
- [x] CHK-003 [P1] The pre-change per-mark instruction set is captured before the first edit (T003: baselines/per-mark-baseline.md, 28 rows)
- [x] CHK-004 [P1] Phase 005's pre-change measurement baseline is captured during this phase's setup (T004: baselines/measurement-baseline.md captured during setup)
- [x] CHK-005 [P1] Every section of the pre-change file is assigned to exactly one half before either half is written (T002: baselines/seam-assignment.md, every section assigned to one side)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The diff across the two halves is a pure move, with no rule sentence added, removed or reworded (T012, T017, AC-004: only framing sentences changed, no rule sentence added, removed or reworded)
- [x] CHK-011 [P0] No rule file relaxes a hard blocker or authorizes what the root doc forbids (T009, T012: whole-reply rules and scope exemptions kept intact, the split is a pure move)
- [x] CHK-012 [P1] Each half stays within the readable size the split was made for and neither grows past the length statement the pre-split file carried (T013: 135 lines/5658 characters and 106 lines/3945 characters recorded as SIZE AFTER SPLIT)
- [x] CHK-013 [P1] The new half follows the existing rule-file shape rather than inventing a second one (T007: routed-from, bounded-by, fires-when and self-check present, confirmed in repo-rules/communication-prose.md, the split half's current name after a later rename commit)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md AC-001 through AC-007 all Met)
- [x] CHK-021 [P0] Trigger-table reachability verified in both directions (T014, T015: checker RESULT PASSED 9/9, 12 files, 12 trigger rows, 12 index rows)
- [x] CHK-022 [P1] Per-mark instruction scan compared against the captured baseline (T016: all 28 baseline rows hold)
- [x] CHK-023 [P1] Both halves read for a seam violation, by reading rather than by grep (T017: both halves read against the seam assignment)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each change carries a finding class and traces to an adopted allocation row or to the split this phase's spec names, with shared-policy rows treated as cross-consumer (AC-001, T018: scoped git status traces every change)
- [x] CHK-FIX-002 [P0] Same-class producer inventory run: every file giving a punctuation or construction instruction (T003, T016: per-mark producer inventory captured and rescanned)
- [x] CHK-FIX-003 [P0] Consumer inventory run: every document citing the reply-shape rule by name or path (T005, T006: trigger-table rows and AGENTS.md pointers)
- [x] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope (not applicable: no path, parser, redaction or security logic is in scope)
- [x] CHK-FIX-005 [P1] Matrix axes listed: governed unit by half, with every section of the pre-change file accounted for (T002: seam-assignment.md Side column, every pre-change section accounted for)
- [x] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase (not applicable: no code reads process-wide state in this phase)
- [x] CHK-FIX-007 [P1] Evidence pinned to a commit, so the pre-change capture and both baselines name a revision rather than a moving branch (T004, T019: both baselines pinned at commit 4512473abdec9c7f0ea02126f85bb5c709b2ac26)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential, secret path or private identifier enters a governance document (credential scan of the phase folder clean, no matches)
- [x] CHK-031 [P0] Not applicable, no input-validation surface in scope (not applicable: no input-validation surface in scope)
- [x] CHK-032 [P1] Not applicable, no auth or authorization surface in scope (not applicable: no auth or authorization surface in scope)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized around the split (spec.md REQ-001..007, plan.md, tasks.md, acceptance-criteria.md AC-001..007 all aligned on the split)
- [x] CHK-041 [P1] Not applicable, no code comments written in this phase (not applicable: no code comments written in this phase)
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes (parent spec.md Phase Documentation Map row 3, Status Complete)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only .gitkeep, the three baselines are packet evidence under baselines/, no temp files anywhere)
- [x] CHK-051 [P1] scratch/ cleaned before completion, with both baselines recorded in the packet rather than left in scratch (2026-09-15: seam-assignment.md, per-mark-baseline.md and measurement-baseline.md moved with git mv to baselines/, every reference in tasks.md and implementation-summary.md repointed, scratch/ holds only .gitkeep)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15, CHK rows checked against T-task evidence, acceptance-criteria.md and the current repo-rules state, the baselines moved under baselines/, then validate.sh --strict rerun
**Validate RESULT (strict)**: RESULT: PASSED, errors 0, warnings 0, exit 0
**Metadata repair**: the first strict run reported 2 errors, both stale generated fields in graph-metadata.json, the stored fields had gone stale against the edited source docs, repair-derived.cjs regenerated them as the run prescribed, the rerun above is the final state
<!-- /ANCHOR:summary -->

---
