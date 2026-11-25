---
title: "Tasks: OpenBot parity research for skilled bots"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "openbot parity research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: OpenBot parity research for skilled bots

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

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
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Link the context repos into this worktree (`specs/system-skilled-bots/context`). Verify: `ls specs/system-skilled-bots/context | wc -l` prints 8 and `git status --short` prints nothing for it.
- [x] T002 Probe each executor once (`devin`, `vibe`, `codex`). Verify: each prints a model reply and exits 0.
- [x] T003 Dry-run the fan-out (`research/`). Verify: `--dry-run` prints four lineages with the expected models and 13 iterations each, and writes nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Run the expansive fan-out loop (`research/`). Verify: the pool reports four lineages started.
- [x] T005 Top up any lineage that stopped short on Codex `gpt-6-luna` xhigh fast (`research/`). Verify: every lineage reaches 13 iterations. Observed: all four reached 13, so no top-up ran.
- [x] T006 Synthesize the ranked gap table, the terminal verdict, the small-team section and the skip list (`research/research.md`). Verify: `rg -c '^## ' research/research.md` prints a count above 0 and each of the eight bot parts is named.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T007 Count the iteration records and their route-proof fields (`research/`). Verify: at least 50 records, each with `target_agent: "deep-research"` and `agent_definition_loaded: true`.
- [ ] T008 Validate the packet (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



