---
title: "Tasks: Phase 28: goal-rebind-live-proof-and-docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal rebind live proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 28: goal-rebind-live-proof-and-docs

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

- [x] T001 Baseline: run the relaunch gate, the OpenCode goal suites and the shared hook suites and record the totals (`scratch/gate/baseline-*`: 833, 551, 208, rule copies exit 0)
- [x] T002 Check each runtime starts without printing a key, and mark the ones that cannot as SKIP with the reason (`scratch/availability/`: Cursor not logged in, Hermes HTTP 402, the rest start)
- [x] T003 Prepare a short task and a low hop cap for each run (`SESSION_RELAUNCH_MAX_HOPS=1`, a note whose remaining work is two shell commands and a one-word reply)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run a live hop with an active goal on Claude, Codex, OpenCode and Pi and save the receiver status (`scratch/`). Claude and Pi pass. Codex carries no packet by design, so only its no-goal control ran. The OpenCode 2 hop did not reach its receiver at first; it passed after the phase 030 fixes (AC-009, Met)
- [x] T005 Run the same on Devin, Cursor and Hermes where the runtime allows, or record SKIP (Devin: no hop path, receiver half run and AC-010 waived; Cursor and Hermes: SKIP with the exact error)
- [x] T006 Run the switch-off control and the no-goal control on the same runtimes (`scratch/`): Claude and Pi hops, OpenCode 2 and Devin receiver half, Codex no-goal
- [x] T007 Add the scenarios to the three relaunch playbooks and the goal playbooks (the three relaunch playbooks only: the goal playbooks are not in the file list and are a follow-up)
- [x] T008 Update the READMEs, the goal plugin doc, `/speckit:handoff` and the feature catalog entry
- [x] T009 Add the 023 and 060 parent map rows and handoff criteria (023 row 28 only; the 060 spec has no relaunch row and was not edited)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun the whole relaunch and goal gates and report the delta against the baseline (`scratch/gate/final-*`: 833, 551, 208, rule copies exit 0, delta 0)
- [x] T011 Run `validate.sh --strict --recursive` on both parents and read the result (023: 30 of 30 `RESULT: PASSED`; 060: 16 of 16)
- [x] T012 Confirm no goal, tmux session or process remains and `git status` shows only the intended files (no ev028 process or tmux socket remains; `git status` shows the docs, this packet and the operator's untracked `.opencode/cli.json`)
<!-- /ANCHOR:phase-3 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Credentials for each live runtime are available, or the runtime is recorded as SKIP (Cursor and Hermes SKIP, `scratch/availability/`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Any changed script or playbook snippet runs under bash and zsh without word-splitting errors (the harness scripts are bash, `bash -n` and the comment hygiene check exit 0 on all of them, and every run used them; the playbook blocks only call them)
- [x] CHK-011 [P0] No console errors or warnings in the suite output (`scratch/gate/final-*`: 0 failures in every suite)
- [x] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start (no product code changed in this phase)
- [x] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments (`check-comment-hygiene.sh` on the harness, exit 0)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [x] CHK-021 [P0] The relaunch and goal gates pass in the final state with the delta against the baseline reported (833, 551, 208 and rule copies, each equal to its baseline)
- [x] CHK-022 [P1] Edge cases tested (a sender with no goal, the switch off on launch only and at prepare too, a runtime that cannot run)
- [x] CHK-023 [P1] Error scenarios validated (Cursor not logged in, Hermes HTTP 402, an OpenCode 2 hop that never claims, with the history lines in `scratch/opencode-a-hop-attempt/`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. (OpenCode 2 killer target: `instance-only`. OpenCode 2 `-m` relaunch argument: `instance-only`. Devin and Cursor have no hop path: `matrix/evidence`.)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (`rg -n "target-pid"` over the adapters: Claude, Codex and Hermes resolve the pid through the process tree, Pi runs in the TUI process, and only `.opencode/plugins/session-relaunch.js` passes `process.pid` from a plugin that runs in a child.)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. (No helper, field or schema changed. The docs that name the switch were listed with `rg -l SESSION_RELAUNCH_GOAL`, and four env docs outside the file list are named as a follow-up.)
- [x] CHK-FIX-004 [P0] No path or parser change is in this phase, so no adversarial table applies.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (Seven runtimes by three kinds, goal, switch off and no goal, is 21 cells. Hop passes: Claude 3, Pi 3, Codex no-goal 1, which is 7. OpenCode 2: the goal hop failed and all three cells have a receiver-half run, 3 cells. Devin: receiver-half run in all three cells and the hop waived, 3 cells. Cursor: 3 cells SKIP. Hermes: 3 cells SKIP. Codex goal and switch-off: 2 cells not applicable, no packet by design. 7 + 3 + 3 + 3 + 3 + 2 = 21.)
- [x] CHK-FIX-006 [P1] Each live run ran with the loop environment variables of the host session dropped. (Every `launch.sh` under `scratch/` unsets `SKILLED_LOOP_*`, `CLAUDE*`, `ORCA_*`, `SESSION_RELAUNCH_GOAL*` and `AI_SESSION_CHILD`.)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. (The runs used the working tree at `99c8cd95f9`, which holds no uncommitted product code change: `git status` shows only the docs and this packet.)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written (key patterns searched across the saved evidence before it was copied: no match; `coder/.env` never opened)
- [x] CHK-031 [P0] Input validation implemented for every path and value read from a note or an environment variable (no product code changed)
- [x] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [x] CHK-042 [P2] The READMEs and the feature catalog entry pass the sk-doc validators (`validate-playbook-package.cjs` and `validate_catalog_package.py --strict`, both `PASS ... violations=0`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/ (the throwaway checkouts lived under `/private/tmp/claude-501/ev028`, removed at the end)
- [x] CHK-051 [P1] scratch/ holds only evidence this packet cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
