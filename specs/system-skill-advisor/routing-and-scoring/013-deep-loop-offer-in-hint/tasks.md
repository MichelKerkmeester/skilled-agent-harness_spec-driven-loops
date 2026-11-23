---
title: "Tasks: Carry the deep-loop offer in the advisor hint"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep loop offer in hint tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Carry the deep-loop offer in the advisor hint

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

Shell names used below. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `BRIEF` is the Measured Behavior command in `spec.md`, run from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Build the advisor on the unchanged tree (`$ADV/dist/`). Verify: `npm run build` in `$ADV` exits 0. Observed 2026-11-23: exit 0.
- [x] T002 Record the current head (`spec.md` Measured Behavior). Verify: `BRIEF` prints `system-deep-loop → /deep:review (ask) 0.95/0.12 pass.` in its first line. Observed 2026-11-23 before the edit: `system-deep-loop → /deep:review (ask) 0.95/0.12 pass.`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Append the three offer options after a `/deep:research` or `/deep:review` command whose policy word is `ask`, with a comment that says why the options travel in the brief (`$ADV/lib/render.ts` `commandLabel`). Verify: after `npm run build`, `BRIEF` prints `system-deep-loop → /deep:review (ask: A /deep:review:auto, B /deep:review:confirm, C no loop)`. Observed 2026-11-23 after `npm run build`: the first line reads `Advisor: live; use system-deep-loop → /deep:review (ask: A /deep:review:auto, B /deep:review:confirm, C no loop) 0.95/0.12 pass.`
- [x] T004 Expect the new head on the two deep-loop goldens and add a child-session case and a default-cap companion case (`$ADV/tests/command-brief-golden.vitest.ts`). Verify: `npx vitest run tests/command-brief-golden.vitest.ts` in `$ADV` reports 0 failed. Observed 2026-11-23: 15 passed, 0 failed.
- [x] T005 Show the deep-loop variant of the brief head beside the existing format line (`.skilled/hooks/injection-contract.md`). Verify: `rg -n 'C no loop' .skilled/hooks/injection-contract.md` prints one line. Observed 2026-11-23: prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T006 Run the whole advisor suite (`$ADV`). Verify: `npx vitest run` in `$ADV` reports 0 failed. Observed 2026-11-23: 180 files, 2624 passed, 4 skipped, 0 failed. Two other test files pinned the old label and were updated (see `spec.md` Files to Change).
- [x] T007 Check that no other command label changed (`$ADV/tests/command-brief-golden.vitest.ts`). Verify: `git diff` on the file changes only the two deep-loop `expectedHead` lines and adds the new cases. Observed 2026-11-23: against the parent commit, only the two deep-loop `expectedHead` lines are removed, and the two new cases are added.
- [x] T008 Sample F6 four times in a behaviour arena built from the committed tree (`scratch/behaviour/F6-1.md` to `F6-4.md`). Verify: each file holds the run's prompt, cost and final answer, and `implementation-summary.md` states how many of four asked the three-option offer. Observed 2026-11-23 at `c4198c6f8cc`: four files written, and 0 of 4 sessions asked the full offer (`implementation-summary.md` Verification).
- [x] T010 Mark option A `(Recommended)` in the brief and sample F6 four more times (`$ADV/lib/render.ts`, `scratch/behaviour/F6-5.md` to `F6-8.md`). Verify: the suite reports 0 failed, `BRIEF` prints `A /deep:review:auto (Recommended)`, and four more files are written. Observed 2026-11-23 at `9dcaaea6b8f`: 2624 passed, the head prints the marker, and 0 of 4 asked the full offer.
- [x] T009 Validate the packet (`specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint`). Verify: `validate.sh <packet> --strict` prints `RESULT: PASSED`. Observed 2026-11-23: `RESULT: PASSED (errors=0 warnings=0)`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`. Observed: T001 to T010.
- [x] No `[B]` blocked tasks remaining. Observed: none.
- [x] Manual verification passed: four F6 runs recorded under `scratch/behaviour/`. Observed: eight runs, `F6-1.md` to `F6-8.md`. SC-002 is unmet, and the operator closed the packet with that limitation recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Measured gap**: packet `012-deep-loop-command-offers`, AC-008 and `scratch/behaviour/`
<!-- /ANCHOR:cross-refs -->

---

