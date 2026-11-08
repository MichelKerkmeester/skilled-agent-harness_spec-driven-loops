---
title: "Tasks: Keep cli-opencode workers inside the git worktree they are started in"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "opencode worktree confinement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Keep cli-opencode workers inside the git worktree they are started in

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

`O` is `.skilled/skills/cli-external-orchestration/cli-opencode/`. `P` is the probe script, named at T001.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Write the probe: it creates a throwaway linked worktree, runs one read-only worker in it and prints each tool path outside it (`O/scripts/`). Verify: `node P --help` exits 0.
- [ ] T002 Reproduce the leak with the current dispatch shape (`P`). Verify: the probe prints at least one main-checkout path and exits 1.
- [ ] T003 Find where OpenCode gets that path: test the `git rev-parse --git-common-dir` hypothesis and look for a flag or setting that pins the project root (`O/references/cli-reference.md`). Verify: the cause is written into `spec.md` §7 with the command that shows it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Apply the fix the cause points to: the OpenCode flag, or an absolute-root line in the shared preamble (`.skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md`). Verify: `rg -n "root" <the changed file>` shows the new line.
- [ ] T005 Correct rule 16 layer L2 and the dispatch shape (`O/SKILL.md`, `O/references/integration-patterns.md`). Verify: `rg -n "L2" O/SKILL.md` names the fix.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Rerun the probe with the fixed shape three times (`P`). Verify: each run prints no outside path and exits 0.
- [ ] T007 Validate the packet (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The probe exits 1 with the old shape and 0 with the fixed shape
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: question 8 in `specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity/scratch/morning-decisions.md`
<!-- /ANCHOR:cross-refs -->

---
