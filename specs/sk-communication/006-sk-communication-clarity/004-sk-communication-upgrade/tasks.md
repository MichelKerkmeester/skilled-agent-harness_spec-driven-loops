---
title: "Tasks: Phase 4: sk-communication-upgrade"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skill upgrade tasks"
  - "rubric duplication search"
  - "package gate task"
  - "command mirror sync"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: sk-communication-upgrade

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

- [ ] T001 Re-read the projection invariants in the package source, not in the skill's description of them
- [ ] T002 Capture the baseline package gate result before any edit, so afterwards has a before
- [ ] T003 [P] List the adopted rows this phase owns, from phase 002's allocation table
- [ ] T004 Run the rubric-duplication search and record the current state, so a new copy is detectable
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Update the wording-standard section and its stated exclusions (`.opencode/skills/sk-communication/SKILL.md`)
- [ ] T006 Declare the pass performed (`.opencode/commands/rewrite/response.md`)
- [ ] T007 Declare the pass performed (`.opencode/commands/rewrite/response-by-external-agent.md`)
- [ ] T008 Sync both Claude-runtime mirrors in the same change (`.claude/commands/rewrite/`)
- [ ] T009 Record the changed capability in the feature catalog
- [ ] T010 Add a version entry to the skill's changelog
- [ ] T011 Apply the reply-scope split to the wording standard, only if phase 002 allocated one
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Re-run the rubric-duplication search and confirm one home and no second copy
- [ ] T013 Confirm both command documents name their pass in their own text
- [ ] T014 Run the package gate from the final state and read its output and exit status
- [ ] T015 Rewrite a reply that carries a caveat and confirm the caveat survives
- [ ] T016 Confirm the enablement default and the advisor exclusion are unchanged
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
- [ ] CHK-003 [P1] Baseline package gate result and duplication-search result captured
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The package gate passes from the final state, with output and exit status read
- [ ] CHK-011 [P0] No voice or tone rubric written into a command, an asset or a presentation contract
- [ ] CHK-012 [P1] Each document change describes behavior the code actually has
- [ ] CHK-013 [P1] The skill keeps its existing routing shape rather than gaining a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] A rewrite of a caveated reply checked for claim preservation
- [ ] CHK-022 [P1] Both runtime mirrors diffed against their source
- [ ] CHK-023 [P1] Every failed path still returns the exact original bytes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each adopted row carries a finding class, and the pointer change is treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run: every place a rubric could have been copied
- [ ] CHK-FIX-003 [P0] Consumer inventory run: every document pointing at the wording standard
- [ ] CHK-FIX-004 [P0] Adversarial cases exercised: a reorder that inverts a cause, a cut that drops a caveat, a plainer word that weakens a hedge
- [ ] CHK-FIX-005 [P1] Matrix axes listed: command surface by runtime mirror, four rows
- [ ] CHK-FIX-006 [P1] The enablement flag read from a hostile default, confirming off stays off
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not to a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential value appears in any document, and credentials stay references
- [ ] CHK-031 [P0] Protected spans stay unmodifiable: a quotation, an error string, a command, a path, an identifier
- [ ] CHK-032 [P1] Telemetry stays content-free, unchanged by this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Any touched code comment states present behavior rather than past approaches
- [ ] CHK-042 [P2] The skill README reflects the changed rewrite contract
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
| P0 Items | 14 | 0/14 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---

