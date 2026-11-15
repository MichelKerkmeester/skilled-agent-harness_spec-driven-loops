---
title: "Tasks: Phase 7: review-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: review-remediation

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

`H` is `.skilled/hooks/session-handover`. `R` is `.skilled/skills/system-spec-kit/runtime`. Every command runs from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Merge origin/main into the worktree branch (`worktrees/399-hook-feature-subtracks`). Verify: `git log -1 --format=%h` printed `abf02ba1e6c` after a fast-forward.
- [x] T002 Capture the post-merge baseline (`H/tests`, `R/tests`). Verify: the node suite printed `pass 999` and `fail 0`, and the vitests printed `Tests  149 passed (149)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Resolve the Claude store root from `CLAUDE_CONFIG_DIR` before `~/.claude` (`R/hooks/lib/history/cli.ts`). Verify: the claim-then-redeem test with the transcript only under `CLAUDE_CONFIG_DIR` fails before and prints the fixture text after.
- [x] T004 Place both folders and compare checkouts before the mint (`H/lib/relaunch-core.cjs`). Verify: the other-checkout claim test finds no state file keyed to the note's checkout after, and finds one before.
- [x] T005 Refuse a transcript whose first recorded folder is another checkout (`H/lib/relaunch-core.cjs`). Verify: the foreign-transcript claim test prints no `## History Lookup` after and prints one before.
- [x] T006 Remove the prepare-time mint and its prepare locator tests (`H/bin/session-handover.cjs`). Verify: `rg -n mintHandoverLocator H/bin/session-handover.cjs` prints nothing.
- [x] T007 Rework the stale-locator claim test to seed state directly and check the claim-written locator recomputes to its handle (`H/tests/session-handover-cli.test.cjs`). Verify: the test passes without a `prepare` call.
- [x] T008 Print `core_unavailable` when the compiled core cannot load (`H/bin/history-lookup.mjs`). Verify: the entry test with the real entry and no core reads `{"ok":false,"code":"core_unavailable"}`.
- [x] T009 Add `core_unavailable` to the refusal union and both READMEs (`R/hooks/lib/history/cli.ts`). Verify: `rg -n core_unavailable` prints a line in `cli.ts` and each README.
- [x] T010 State the 30-minute locator window in receiver step 3 and its mirror (`.skilled/commands/speckit/handoff.md`). Verify: `rg -n '30 minutes'` prints a line in each copy.
- [x] T011 Fold the window into the existing claim section line (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: `rg -n '30 minutes' .skilled/changelog/skilled/v4.0.2.1.md` prints the section line.
- [x] T012 Remove every claim that `prepare` stores a locator (`.skilled/hooks/session-handover/README.md`, the history README, the injection contract, the catalog entry and the catalog index). Verify: `rg -n 'prepare. (stores|mints) a locator' .skilled -g '*.md'` prints nothing outside `specs/`.
- [x] T013 Rename the catalog and playbook titles and triggers (`feature-catalog/context-preservation/compaction-history-lookup.md`). Verify: `rg -n '^title'` on both files prints the handoff name.
- [x] T014 Correct phase 005's mitigation, phase 004's SC-003 and tasks T005 and T006, and phase 006's run counts (`../005-deprecate-compaction-offer/plan.md`). Verify: each line the review cited reads as the code and run folders show.
- [x] T015 Correct the parent's packet row, status, in-scope line, phase row and transition rows (`../spec.md`). Verify: `rg -n 'scaffold/' ../spec.md` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Rerun the handover suite (`H/tests`). Verify: `node --test H/tests/*.test.cjs` prints `fail 0`.
- [x] T017 Rerun the history and compaction vitests (`R/tests`). Verify: `npx vitest run tests/history-*.vitest.ts tests/compaction-adapters.vitest.ts` prints every test passed.
- [x] T018 Run the sk-code quality gate on the changed code (`H`, `R/hooks/lib/history`). Verify: the gate prints no error.
- [x] T019 Validate the parent packet (`../`). Verify: `validate.sh <parent> --strict --recursive` prints `RESULT: PASSED`.
- [x] T020 Rebuild the trigger index (`R/data/trigger-index.json`). Verify: the rebuild exits 0 and names the new phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [x] The suite delta names each removed, moved and added test
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
