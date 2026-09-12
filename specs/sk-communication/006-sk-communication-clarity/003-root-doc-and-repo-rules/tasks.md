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

- [ ] T001 Read the current text of every surface in scope, rather than working from memory of it
- [ ] T002 Capture the baseline: the per-mark instruction set before the change, so the scan afterwards has a before
- [ ] T003 [P] List the adopted rows this phase owns, from phase 002's allocation table
- [ ] T004 Confirm each row's target surface is the one whose reach the clause actually needs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Apply the allocated changes to `repo-rules/communication.md`
- [ ] T006 Apply the allocated changes to `repo-rules/presenting-decisions.md`
- [ ] T007 Apply the allocated changes to `repo-rules/handoff-and-questions.md`
- [ ] T008 Create each new rule file with the standard header, fires-when list and self-check (`repo-rules/`)
- [ ] T009 Add the trigger row and index row for each new file, in the same change as the file (`REPO RULES.md`)
- [ ] T010 Resolve the em-dash replacement instruction so one mark carries one instruction across the stack
- [ ] T011 Add the adopted clauses to `AGENTS.md`, each stating why it cannot live below
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Walk every trigger row and open every file it names, confirming none is missing
- [ ] T013 Walk every file under `repo-rules/` and confirm at least one trigger row names it
- [ ] T014 Run the per-mark contradiction scan and confirm one instruction per mark
- [ ] T015 Read every added paragraph and confirm it names a failure specific enough to argue with
- [ ] T016 Confirm the scoped diff contains only the surfaces this phase owns
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
- [ ] CHK-003 [P1] Baseline per-mark instruction set captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every change traces to an adopted allocation row
- [ ] CHK-011 [P0] No rule file relaxes a hard blocker or authorizes what the root doc forbids
- [ ] CHK-012 [P1] Each touched file keeps its length discipline, splitting rather than growing at its ceiling
- [ ] CHK-013 [P1] Each new file follows the existing rule-file shape rather than inventing a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Trigger-table reachability verified in both directions
- [ ] CHK-022 [P1] Per-mark contradiction scan compared against the captured baseline
- [ ] CHK-023 [P1] Every added paragraph read for a named failure, by reading rather than by grep
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each adopted row carries a finding class, and shared-policy rows are treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run: every file giving a punctuation or construction instruction
- [ ] CHK-FIX-003 [P0] Consumer inventory run: every document citing a changed rule file by name or path
- [ ] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [ ] CHK-FIX-005 [P1] Matrix axes listed: surface tier by adopted recommendation, rows taken from the allocation table
- [ ] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not to a moving branch-relative range
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

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Not applicable, no code comments written in this phase
- [ ] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---

