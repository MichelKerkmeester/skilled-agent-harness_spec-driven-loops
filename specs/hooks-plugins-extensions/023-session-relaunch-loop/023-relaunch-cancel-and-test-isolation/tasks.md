---
title: "Tasks: Phase 23: relaunch-cancel-and-test-isolation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relaunch cancel and test isolation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 23: relaunch-cancel-and-test-isolation

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

- [x] T001 Create the worktree through sk-git and scaffold this phase child (`.worktrees/220-relaunch-cancel-and-test-isolation`)
- [x] T002 Record the baseline: 669 of 682 inside the loop, 682 of 682 outside it, Pi vitest 49 of 49
- [x] T003 [P] Confirm from a session transcript that Claude sends a background-task completion as a `<task-notification>` prompt
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Scrub `SKILLED_LOOP_*` at load in four test files and give the two `dropNestedLoop` tests a sandbox runtime directory (`tests/relaunch-core.test.cjs`, `tests/session-relaunch-cli.test.cjs`, `tests/killer.test.cjs`, `tests/hermes-adapters.test.cjs`)
- [x] T005 Add `markDeferred` and `withdrawDeferred` (`lib/relaunch-core.cjs`)
- [x] T006 Mark a deferred record on Stop (`claude/stop-arm.mjs`)
- [x] T007 Withdraw a deferred record on an operator prompt and emit the withdrawn notice (`claude/context-nudge.mjs`)
- [x] T008 Add the `cancel` subcommand and name it in the in-loop nudge text (`bin/session-relaunch.cjs`, `lib/nudge.cjs`)
- [x] T009 Move the hop record out of `should-relaunch` into a `hand-over` subcommand and call it from the relaunch path (`bin/session-relaunch.cjs`, `.skilled/bin/skilled-loop`)
- [x] T010 Add the optional `session` column, pass it from `claim` and render it in `history` (`lib/hop-history.cjs`, `bin/session-relaunch.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Add and update tests for each behavior, then run each new test against copies of main's code and see it fail
- [x] T012 Run the full gate with the loop environment set and unset, the Pi vitest, `bash -n` and `node --check`, and compare the `relaunch.log` line count
- [x] T013 Update the session relaunch README, its tests README, the `.skilled/bin` README and the feature catalog entry
- [x] T014 Act on the fresh review: scrub the loop variables in `skilled-loop.test.cjs`, reword the withdrawn notice and the docs, and record the other findings in implementation-summary.md
- [x] T015 Lock the record writes and note claim and complete, drop every loop variable in a nested run, report `withdrawn` from `should-relaunch`, and leave a cancelled record alone at killer timeout (`lib/relaunch-core.cjs`, `lib/killer.cjs`)
- [x] T016 Grant one more nudge after a withdraw or cancel, reword the withdrawn notice, and point compaction at a withdrawn note without a claim seed (`lib/nudge.cjs`, `claude/context-nudge.mjs`, `claude/compact-pointer.mjs`)
- [x] T017 Give `cancel` the nested-run check, record `withdrawn` hops, call `hand-over` only after the wrapper reads an open note, handle `withdrawn` in the wrapper, and refuse a missing spec folder (`bin/session-relaunch.cjs`, `lib/hop-history.cjs`, `.skilled/bin/skilled-loop`)
- [x] T018 Correct the Devin hand-over lines in the v4.0.0.13 release note and update the relaunch docs
- [x] T019 Verify independently and rerun the full gate in three environments
- [x] T020 Route every runtime's withdraw through one helper, withdraw an armed record on a Claude or Codex operator prompt, and give Pi and OpenCode compaction the withdrawn-note pointer (`lib/withdraw.cjs`, adapters)
- [x] T021 Lock the pending write and the consume unlink, and fix the prepare help text (`lib/relaunch-core.cjs`, `bin/session-relaunch.cjs`)
- [x] T022 Print a claim command only for a note it could claim, keep the warning for a different unclaimed note, and name notes by the full id in `/speckit:handoff` (`.skilled/bin/skilled-loop`, `handoff.md`)
- [x] T023 Check every touched code file against the sk-code skilled checklists, and add live and automatable playbook scenarios for each new behavior on Claude, Codex, OpenCode and Pi
- [x] T024 Run the live playbook scenarios: OpenCode and Pi (PO-0 to PO-6, CO-046), Codex (CX-0 to CX-5) and Claude (CL-0 to CL-7)
- [x] T025 Replace the word-splitting `$cli` variable in the three relaunch playbooks with a `cli` function, because the snippets failed under zsh (`session-relaunch-claude.md`, `session-relaunch-command-runtimes.md`, `session-relaunch-pi-opencode.md`)
- [x] T026 Check a spec folder against the note's own working directory as well as the CLI's checkout, so a worktree-only packet is accepted (`bin/session-relaunch.cjs`, `tests/session-relaunch-cli.test.cjs`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated verification passed (no live hop was run for this phase)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-005)
- [x] CHK-002 [P0] Technical approach defined in plan.md (architecture and affected surfaces)
- [x] CHK-003 [P1] Dependencies identified and available (the `<task-notification>` prefix, seen in a transcript)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax checks (`bash -n .skilled/bin/skilled-loop` and `node --check` on each changed file, clean)
- [x] CHK-011 [P0] No console errors or warnings in the suite output
- [x] CHK-012 [P1] Error handling implemented (history writes and the withdraw sit in `try` blocks and log on failure)
- [x] CHK-013 [P1] Code follows project patterns (guarded `unarm`, the existing `SUBCOMMANDS` table, no artifact ids in comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [x] CHK-021 [P0] Full gate passes in all three environments (see implementation-summary.md, Verification)
- [x] CHK-022 [P1] Edge cases tested (no record, a closed note, a never-deferred record, a task notification)
- [x] CHK-023 [P1] Error scenarios validated (`cancel` with nothing to cancel exits 1)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class: test isolation is `test-isolation`, the deferred hand-over is `class-of-bug`, the early hop line is `cross-consumer`, the claim session is `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n "recordHop\('handed-over'|notifyHandOver\("` outside tests shows the CLI `consume` path as the one writer.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `consume_record`, `should-relaunch`, `markDeferred` and `withdrawDeferred` (plan.md, affected surfaces).
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction fix is in this phase, so no adversarial table applies.
- [x] CHK-FIX-005 [P1] Matrix axes listed: the loop environment as set, unset and foreign, each over the full suite.
- [x] CHK-FIX-006 [P1] Hostile environment variant executed: the suite ran with this session's `SKILLED_LOOP_*` variables set and with foreign values, including a manual template that carries options.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the uncommitted worktree diff on `worktrees/220-relaunch-cancel-and-test-isolation` over main `3903667f40`; the commit SHA is added when the operator approves the commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (`--loop-id` required outside a loop, record status checked before `cancel`)
- [x] CHK-032 [P1] Auth/authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [x] CHK-042 [P2] README updated (the four docs pass `validate_document.py` with 0 issues)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ holds no task output
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---
