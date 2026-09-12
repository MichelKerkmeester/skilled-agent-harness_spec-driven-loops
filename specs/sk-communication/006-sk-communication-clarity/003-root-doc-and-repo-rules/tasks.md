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

- [ ] T001 Read `repo-rules/communication.md` end to end and list its sections, rather than working from a summary of it (`repo-rules/communication.md`)
- [ ] T002 Assign every section of the pre-change file to exactly one side of the seam, the unit each rule governs rather than the topic it mentions (`scratch/`)
- [ ] T003 Capture the pre-change per-mark instruction set: for every punctuation mark or construction the stack governs, the file that carries the instruction and the direction it gives (`scratch/`)
- [ ] T004 Capture phase 005's pre-change measurement baseline, before the first edit, because a baseline taken after the rules change cannot support a regression claim
- [ ] T005 [P] Read the current trigger table and index in `REPO RULES.md` and record the rows that reach the reply-shape rule (`REPO RULES.md`)
- [ ] T006 Read the three places where `AGENTS.md` names the reply-shape rule and confirm each pointer stays true once the split lands (`AGENTS.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Create the new half under `repo-rules/` with the routed-from line, the bounded-by statement, a fires-when list and a self-check (`repo-rules/`)
- [ ] T008 Move the sentence and paragraph mechanics into the new half, so each moved sentence appears once and reads as it did before the move (`repo-rules/`)
- [ ] T009 Keep the whole-reply rules in `repo-rules/communication.md`, and update its own header so its scope statement names what it still owns and points at the other half (`repo-rules/communication.md`)
- [ ] T010 Add the trigger row for the new half, in the same change as the file it names (`REPO RULES.md`)
- [ ] T011 Add the index row for the new half, in the same change as the file it names (`REPO RULES.md`)
- [ ] T012 Confirm across both halves that no rule sentence was added, removed or reworded, so the diff is a move rather than an edit (`repo-rules/`)
- [ ] T013 Record the per-half size baseline: the size of each half immediately after the split, measured the same way for both, so phases 006 and 008 can check their own additions against it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Walk every trigger row and open every file it names, confirming none is missing (`REPO RULES.md`)
- [ ] T015 Walk every file under `repo-rules/` and confirm at least one trigger row names it (`repo-rules/`)
- [ ] T016 Repeat the per-mark instruction scan and confirm every mark carries one instruction, unchanged from the captured baseline
- [ ] T017 Read both halves for a rule that belongs on the other side of the seam, by reading rather than by grep (`repo-rules/`)
- [ ] T018 Confirm the scoped diff contains no change to `AGENTS.md` and no change to a rule file this phase does not own
- [ ] T019 Confirm both baselines are recorded in the packet, where phases 005, 006 and 008 read them (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] The pre-change per-mark instruction set is captured before the first edit
- [ ] CHK-004 [P1] Phase 005's pre-change measurement baseline is captured during this phase's setup
- [ ] CHK-005 [P1] Every section of the pre-change file is assigned to exactly one half before either half is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The diff across the two halves is a pure move, with no rule sentence added, removed or reworded
- [ ] CHK-011 [P0] No rule file relaxes a hard blocker or authorizes what the root doc forbids
- [ ] CHK-012 [P1] Each half stays within the readable size the split was made for, and neither grows past the pre-split file's own length statement
- [ ] CHK-013 [P1] The new half follows the existing rule-file shape rather than inventing a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Trigger-table reachability verified in both directions
- [ ] CHK-022 [P1] Per-mark instruction scan compared against the captured baseline
- [ ] CHK-023 [P1] Both halves read for a seam violation, by reading rather than by grep
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each change carries a finding class, and it traces to an adopted allocation row or to the split this phase's spec names, with shared-policy rows treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run: every file giving a punctuation or construction instruction
- [ ] CHK-FIX-003 [P0] Consumer inventory run: every document citing the reply-shape rule by name or path
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [ ] CHK-FIX-005 [P1] Matrix axes listed: governed unit by half, with every section of the pre-change file accounted for
- [ ] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, so the pre-change capture and both baselines name a revision rather than a moving branch
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential, secret path or private identifier enters a governance document
- [ ] CHK-031 [P0] Not applicable, no input-validation surface in scope
- [ ] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized around the split
- [ ] CHK-041 [P1] Not applicable, no code comments written in this phase
- [ ] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, with both baselines recorded in the packet rather than left in scratch
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---
