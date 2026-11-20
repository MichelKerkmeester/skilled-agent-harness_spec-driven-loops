---
title: "Tasks: pi-context-decisions Research Phase"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "pi-context-decisions research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: pi-context-decisions Research Phase

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

`R` is this phase's `research/` folder. `C` is `../context/pi-context-decisions-main/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Move the extension source into the parent's context folder (`C`). Verify: `ls C/src/apps/skill-filter.ts` prints the path.
- [x] T002 Write the research brief with RQ1 to RQ8 and the answer shape (`spec.md`). Verify: `rg -c '^- \*\*RQ' spec.md` prints 8.
- [x] T003 Check the second-account executor (`plan.md`). Verify: `CLAUDE_CONFIG_DIR=/Users/michelkerkmeester/.claude-account2 claude -p "Reply with exactly your model id" --model claude-opus-5-5 --effort medium` printed `claude-opus-5-5` and exited 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `/deep:research:auto` for 5 iterations on the second account (`R/deep-research-config.json`). Verify: the config names `cli-claude-code`, `claude-opus-5-5`, `medium` and the account2 config dir. Evidence: config `executor` block holds all four; each detached dispatch ran with `CLAUDE_CONFIG_DIR=/Users/michelkerkmeester/.claude-account2`, the operator-approved override of the self-invocation guard.
- [x] T005 Let the loop write its synthesis (`R/research.md`). Verify: `rg -n 'RQ8' R/research.md` prints at least one line. Evidence: section 10 is RQ8; `synthesis-closeout.cjs` exited 0 and its event landed at ledger sequence 14.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Count the iteration records (`R/deep-research-state.jsonl`). Verify: `rg -c '"type":"iteration"' R/deep-research-state.jsonl` prints 5. Evidence: printed 5, and `verify-iteration.cjs` exited 0 for iterations 1 to 5.
- [x] T007 Open every citation in the ranked list (`R/research.md`). Verify: the verification note lists each citation as resolved or failed, with none unchecked. Evidence: section 14 of `R/research.md`: 120 unique citations, 120 resolve, 0 failed. ADOPT and ADAPT claims were opened by hand, and three corrections are recorded.
- [x] T008 Confirm the run wrote nothing outside this phase (`git status`). Verify: `git status --short` lists no run-made change outside this folder. Evidence: outside the 016 folder only the parent 003 `spec.md` and `graph-metadata.json` (orchestrator edits) and files already modified before the run changed.
- [x] T009 Validate this phase strictly (`spec.md`). Verify: `validate.sh <phase> --strict --quiet` prints `RESULT: PASSED`. Evidence: recursive strict validation of the 016 parent printed `RESULT: PASSED (errors=0 warnings=0)` for both folders.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `R/research.md` ranks the verdicts and every citation in it was opened
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
