---
title: "Tasks: Debug Delegation Integration"
description: "Task breakdown for the debug delegation command, skill updates, supporting documentation, agent guidance and verification."
trigger_phrases:
  - "debug delegation tasks"
  - "debug command task breakdown"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Debug Delegation Integration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

> Per-task state was not recorded at the time, so every task below is listed pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Command Creation

- [ ] T001 Create the `/spec_kit:debug` command (`.opencode/commands/spec_kit/debug.md`)
- [ ] T002 Define the five-phase workflow: Context, Model Selection, Report, Dispatch, Integration (`.opencode/commands/spec_kit/debug.md`)
- [ ] T003 Add the mandatory model selection options: Sonnet, Opus, o1/o3, Other (`.opencode/commands/spec_kit/debug.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: SKILL.md Updates

- [ ] T004 Add the "Debug Delegation Workflow" section (`SKILL.md`)
- [ ] T005 Expand trigger keywords for auto-suggestion (`SKILL.md`)
- [ ] T006 Update the command table with `/spec_kit:debug` (`SKILL.md`)
- [ ] T007 Add routing logic for debug escalation (`SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Supporting Documentation

- [ ] T008 Add the command and update the command count to 7 (`README.md`)
- [ ] T009 Add the debug checkpoint (`implementation-phase.md`)
- [ ] T010 Expand the debug-delegation.md section (`template_guide.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: AGENTS.md Updates

- [ ] T011 Add the command to the SpecKit Commands table in both AGENTS.md files (`AGENTS.md`)
- [ ] T012 Add debug delegation to the tool routing guidance (`AGENTS.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [ ] T013 Test command execution
- [ ] T014 Test auto-suggestion triggers
- [ ] T015 Verify sub-agent dispatch works
- [ ] T016 Confirm documentation consistency
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
