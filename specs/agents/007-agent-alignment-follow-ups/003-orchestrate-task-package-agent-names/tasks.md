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

- [x] T001 Save the three Measured Behavior commands with their output, and the output of the mirror check (`scratch/baseline.txt`). Verify: `rg -c '^├─ Agent: @code' scratch/baseline.txt` prints 1, and `rg -c 'agent-roster: OK' scratch/baseline.txt` prints 1. Observed: `scratch/baseline.txt` holds the line, the registry count of 10 and both check outputs, read from the commit before the edit. Both searches printed 1.
- [x] T002 Find the command that writes the runtime copies of an agent file and record it (`scratch/baseline.txt`). Verify: `rg -c 'mirror write command:' scratch/baseline.txt` prints 1. Observed: `.claude` is an authored fork edited in the same change, `.cursor` and `.devin` are symlinks onto it, and three generators write `.pi`, `.codex` and `.dsh`. The search printed 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace the eight names on the `Agent:` line of the task template with a bracketed instruction to name one agent from the routing table in section 2 (`.skilled/agents/orchestrate.md`). Verify: `rg -c '^├─ Agent: \[.*routing table' .skilled/agents/orchestrate.md` prints 1, and `rg -c '^├─ Agent: @code . @context' .skilled/agents/orchestrate.md` prints no line. Observed: the first search printed 1 and the second printed no line. The file equals the expected file byte for byte (`cmp`).
- [x] T004 Regenerate the runtime copies with the command T002 recorded (`.claude/agents/orchestrate.md`). Verify: `rg -c '^├─ Agent: @code . @context' .claude/agents/orchestrate.md` prints no line. Observed: the `.claude` twin took the same one-line edit and equals its expected file (`cmp`). The Pi, Codex and harness generators each wrote 1 of 11. The search on `.claude/agents/orchestrate.md` printed no line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the roster check from the final state and save its output (`scratch/after.txt`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and exits 0. Observed: `agent-roster: OK`, exit 0.
- [x] T006 Run the mirror check from the final state and save its output (`scratch/after.txt`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync` and exits 0. Observed: `agent-mirror-sync: 11 agent(s) checked — all comparable mirrors in sync — OK`, exit 0. The Pi, Codex and harness generators in `--check` mode each printed PASS, and the roster mirror check printed `STATUS=OK`.
- [x] T007 Confirm one line changed in the agent file (`scratch/after.txt`). Verify: `git diff --numstat` against the commit before the edit reports 1 added and 1 removed. Observed: 1 added and 1 removed in each of `.skilled`, `.claude`, `.codex`, `.pi` and `.dsh`.
- [x] T008 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names --strict --quiet` prints `RESULT: PASSED`. Observed: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh on this folder with `--strict --quiet` printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `sed -n 211p .skilled/agents/orchestrate.md` prints a line that starts `├─ Agent: [` and both checks exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
