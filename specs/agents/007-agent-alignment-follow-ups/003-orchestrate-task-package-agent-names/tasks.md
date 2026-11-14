---
title: "Tasks: Phase 3: orchestrate-task-package-agent-names"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "orchestrate task package agent names tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: orchestrate-task-package-agent-names

<!-- SPECKIT_LEVEL: 1 -->

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

**Variables**: `O` is `.skilled/agents/orchestrate.md`. `scratch/` is this folder's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Save the three Measured Behavior commands with their output, and the output of the mirror check (`scratch/baseline.txt`). Verify: `rg -c '^├─ Agent: @code' scratch/baseline.txt` prints 1, and `rg -c 'agent-roster: OK' scratch/baseline.txt` prints 1.
- [ ] T002 Find the command that writes the runtime copies of an agent file and record it (`scratch/baseline.txt`). Verify: `rg -c 'mirror write command:' scratch/baseline.txt` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Replace the eight names on the `Agent:` line of the task template with a bracketed instruction to name one agent from the routing table in section 3 (`.skilled/agents/orchestrate.md`). Verify: `rg -c '^├─ Agent: \[.*routing table' .skilled/agents/orchestrate.md` prints 1, and `rg -c '^├─ Agent: @code' .skilled/agents/orchestrate.md` prints no line.
- [ ] T004 Regenerate the runtime copies with the command T002 recorded (`.claude/agents/orchestrate.md`). Verify: `rg -c '^├─ Agent: @code' .claude/agents/orchestrate.md` prints no line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Run the roster check from the final state and save its output (`scratch/after.txt`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and exits 0.
- [ ] T006 Run the mirror check from the final state and save its output (`scratch/after.txt`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync` and exits 0.
- [ ] T007 Confirm one line changed in the agent file (`scratch/after.txt`). Verify: `git diff --numstat main -- .skilled/agents/orchestrate.md` reports 1 added and 1 removed.
- [ ] T008 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `sed -n 211p .skilled/agents/orchestrate.md` prints a line that starts `├─ Agent: [` and both checks exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
