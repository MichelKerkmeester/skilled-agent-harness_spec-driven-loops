---
title: "Tasks: Plan Validation Research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "plan validation research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Plan Validation Research

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

`R` is this phase's `research/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rebuild the advisor runtime so live probes run (`.skilled/skills/system-skill-advisor/runtime/dist/`). Verify: `advisor_recommend` on the refactor prompt prints a recommendation instead of exit 69. Evidence: `npm run build` recorded the build attestation, and the probe printed `sk-code:0.82` first.
- [x] T002 Write the research brief with RQ1 to RQ4 and the answer shape (`spec.md`). Verify: `rg -c '^- \*\*RQ' spec.md` prints 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run `/deep:research:auto` for 3 iterations on the second account (`R/deep-research-config.json`). Verify: the config names `cli-claude-code`, `claude-opus-5-5`, `high` and the account2 config dir. Evidence: the config `executor` block holds all four; each dispatch ran detached with `CLAUDE_CONFIG_DIR` set, and each exited 0.
- [x] T004 Let the loop write its synthesis (`R/research.md`). Verify: `rg -n 'RQ4' R/research.md` prints at least one line. Evidence: section 6 is RQ4; `synthesis-closeout.cjs` exited 0 and its event landed at ledger sequence 10.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Count the iteration records (`R/deep-research-state.jsonl`). Verify: `rg -c '"type":"iteration"' R/deep-research-state.jsonl` prints 3. Evidence: printed 3, and `verify-iteration.cjs` exited 0 for iterations 1 to 3.
- [x] T006 Re-check every citation and probe behind a CHANGE or DROP verdict (`R/research.md`). Verify: the verification note lists each one as resolved or failed, with none unchecked. Evidence: section 10: 76 of 76 iteration citations resolve, every citation behind a CHANGE opened and matched, and the rule test ran with 0 of 700 corpus prompts changed.
- [x] T007 Confirm the run wrote nothing outside this phase (`git status`). Verify: `git status --short` lists no run-made change outside this folder. Evidence: outside this folder only the parent `spec.md` and `graph-metadata.json` changed, both orchestrator edits for the new phase row.
- [x] T008 Validate this phase strictly (`spec.md`). Verify: `validate.sh <phase> --strict --quiet` prints `RESULT: PASSED`. Evidence: recursive strict validation of the 016 parent printed `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `R/research.md` gives each planned phase a verdict, and every citation behind a plan change was re-checked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
