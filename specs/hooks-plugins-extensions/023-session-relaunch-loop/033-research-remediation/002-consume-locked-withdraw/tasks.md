---
title: "Tasks: Phase 2: consume-locked-withdraw"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "consume locked withdraw tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: consume-locked-withdraw

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

- [x] T001 Confirm phase 001 is Complete (`../001-model-effort-atomic-replay/`). Evidence: its code is committed in `20dfa9fec6`; its spec still reads In Progress with only a live-hop item open, outside consume, and the orchestrator dispatched wave 2
- [x] T002 Run the baseline test commands and save the output in `scratch/`. Evidence: `scratch/red-before-full-suite.txt`, run on the unchanged code: the 896 existing tests all pass
- [x] T003 [P] Add failing tests "consume reports withdrawn for a record withdrawn before it" and "consume output has no withdrawn key for an armed record" (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`). Evidence: plus "consume reads the record under the same lock as its unlink"
- [x] T004 [P] Add failing test "a withdraw between approval and consume declines with the runtime exit code", asserting no `handed-over` history line (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`). Evidence: plus the Ctrl-C path test
- [x] T005 Run the new tests and record that they fail on the current code. Evidence: `scratch/red-before-full-suite.txt`, 902 tests, 897 pass, 5 fail, all five new; the no-key guard passes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Read, check and unlink the record inside one `withAppendLock` call; parse the note after the lock (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [x] T007 Add `withdrawn: true` to consume output only for a withdrawn record (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [x] T008 Add a `consumed_withdrawn` reader beside `consumed_note_state` (`.skilled/bin/skilled-loop`)
- [x] T009 After `consume_record` on the approved path, print the withdrawn warning and exit with `runtime_exit` when withdrawn (`.skilled/bin/skilled-loop`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009a Before each `print_manual_command` after a consume on the approved path (about `:709`, `:715`, `:724`), check `consumed_withdrawn` and skip the claim command for a withdrawn record, reusing the previous-hop unclaimed-note warning block at about `:886-890` (`.skilled/bin/skilled-loop`). Evidence: the `decline_withdrawn` helper, called on the two cwd-failure paths and the Ctrl-C path
- [x] T010 Run the full test commands from `plan.md` and compare with the baseline. Evidence: 906 tests, 903 pass, 3 fail; the three are `readClaudeSettings` tests in `context-usage.test.cjs` from the concurrent phase 001 follow-up; Pi vitest 59 pass
- [x] T011 Confirm the exact-shape consume tests pass with unedited expectations. Evidence: `git diff --numstat` on `session-relaunch-cli.test.cjs` shows 69 added, 0 removed
- [x] T012 No live proof required; record that in `implementation-summary.md`
- [x] T013 Update `acceptance-criteria.md` evidence and `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is Met
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `core.withAppendLock` and `core.WITHDRAWN_DISARM_REASONS` are exported by `relaunch-core.cjs`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `bash -n` exit 0, `shellcheck -S warning` exit 0 with no findings, `node --check` exit 0
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the new tests assert the only warning is the withdrawn line
- [x] CHK-012 [P1] Error handling implemented. Evidence: a non-ENOENT unlink error still throws; a consume that fails or prints no JSON leaves `consumed_withdrawn` false, so the existing warning path runs
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the helper sits beside the other `consumed_*` readers and reuses the declined path's wording
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, five rows Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: the plan requires no live proof; the wrapper tests drive the real wrapper and the real `cancel` command end to end
- [x] CHK-022 [P1] Edge cases tested. Evidence: both withdrawn reasons, a disarmed record with another reason, an armed record, the Ctrl-C path
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the existing consume-failure and malformed-consume wrapper tests still pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: `cross-consumer`, a race between the consume producer and the wrapper consumer
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg -n WITHDRAWN_DISARM_REASONS .skilled/hooks` lists `shouldRelaunch`, `nudge.cjs` and now consume; the withdraw writer and cancel already judge under the lock
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `rg -n "consume --loop-id" .skilled .opencode` finds one caller, `skilled-loop:73`
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: not a path or parser fix; the string match is guarded by compact JSON escaping, noted in its comment
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: record state (withdrawn x2, other disarm, armed) by wrapper path (main, Ctrl-C), six new tests
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: the sandboxes clear the `SKILLED_LOOP_*` variables an outer loop exports
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: uncommitted working-tree diff on top of `20dfa9fec6`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. Evidence: `--loop-id` handling is unchanged and no new input surface exists
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable to a local CLI
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. Evidence: each new comment states the lock reason and carries no spec or phase id
- [x] CHK-042 [P2] README updated (if applicable). Evidence: not applicable; the README is outside this phase's write scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: only the three evidence files the build was told to keep remain
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



