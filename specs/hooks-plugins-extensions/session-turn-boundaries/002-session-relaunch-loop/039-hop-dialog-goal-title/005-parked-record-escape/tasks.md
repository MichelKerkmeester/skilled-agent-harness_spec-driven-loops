---
title: "Tasks: Phase 5: parked-record-escape"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "parked record escape tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: parked-record-escape

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Task variables**: `RL` is `.skilled/hooks/session-relaunch`. `PHASE` is this phase folder. `FIX` is commit `eaf24f999e`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test <file>`, because a dispatched child marker or an inherited OpenCode database path changes how the hooks and the history lookup behave.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm that Stop stamped `deferredAt` on one path only before the fix (`RL/claude/stop-arm.mjs`). Verify: `git show eaf24f999e^:.skilled/hooks/session-relaunch/claude/stop-arm.mjs | rg -n markDeferred` prints the import at line 21 and one call at line 143.
  - **Evidence:** the one call sat inside the background-task deferral. The missing transcript path, the unresolved target and the thrown arm each returned with no stamp.
- [x] T002 Confirm that the operator's next prompt withdraws only a stamped or armed record (`RL/lib/withdraw.cjs`). Verify: `rg -n deferredAt .skilled/hooks/session-relaunch/lib/withdraw.cjs` prints lines 27 and 28.
  - **Evidence:** `acceptsRecord` returns true for an armed record, and for a pending record only when `deferredAt` is a non-empty string. An unstamped pending record is refused, which is the gap.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rename two Stop tests to expect the stamp and add one test where the arm throws (`RL/tests/claude-adapters.test.cjs`). Verify: `PHASE/scratch/red.txt` prints `✖` for all three test names, then `ℹ tests 3`, `ℹ pass 0` and `ℹ fail 3`.
  - **Evidence:** `scratch/red.txt:2` to `scratch/red.txt:4` show the three failures, and `scratch/red.txt:5`, `scratch/red.txt:7` and `scratch/red.txt:8` show the counts. Each fails on the `deferredAt` assertion, so the third test reached the throwing arm and found no stamp.
- [x] T004 Add the helper `markParked` (`RL/claude/stop-arm.mjs`). Verify: `rg -n 'function markParked' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints line 53.
  - **Evidence:** the helper calls `markDeferred` and logs `stop-arm-error stage=defer` when that call throws.
- [x] T005 Call `markParked` when the transcript path is missing, when no kill target resolves and when the arm throws (`RL/claude/stop-arm.mjs`). Verify: `rg -n 'markParked\(' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints lines 137, 183 and 202 beside the others.
  - **Evidence:** the three calls follow the `missing-transcript-path` log, the `stop-arm-error stage=target-pid` log and the `stop-arm-error stage=arm` log.
- [x] T006 Make the background-task deferral stamp through the helper (`RL/claude/stop-arm.mjs`). Verify: the same `rg` prints line 153, and `rg -n 'markDeferred' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints only the import at line 21 and the call at line 55.
  - **Evidence:** both lines printed on 2026-11-14. The inline try and log that sat at the old line 143 are gone.
- [x] T007 Let the shared no-target conformance case set the stamp aside (`RL/tests/adapter-conformance.test.cjs`). Verify: `rg -n assertStillPending .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints lines 414 and 465.
  - **Evidence:** the helper drops `deferredAt` from the record, then asserts the rest equals the record before the Stop and that no killer started. Codex Stop does not stamp such a record and parent decision D2 forbids editing the Codex adapter, so the case cannot require the stamp.
- [x] T008 Name the stamp on the three paths in the long arm paragraph (`RL/README.md`). Verify: `rg -n 'stamps .deferredAt. on the record' .skilled/hooks/session-relaunch/README.md` prints line 134.
  - **Evidence:** the paragraph now says the hook "stamps `deferredAt` on the record" for a missing transcript path, names the stamp for the unresolved target and for `stop-arm-error stage=arm`, and says the stamp lets the next prompt withdraw the record.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the three Stop tests (`RL/tests/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='marks the pending record deferred' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `ℹ tests 3`, `ℹ pass 3` and `ℹ fail 0`.
  - **Evidence:** `scratch/green.txt:2` to `scratch/green.txt:4` and `scratch/green.txt:5`, `scratch/green.txt:7`, `scratch/green.txt:8`. A rerun by this packet's author on 2026-11-14 on the later tree printed the same with exit 0.
- [x] T010 Run both changed test files whole (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `ℹ tests 115`, `ℹ pass 115` and `ℹ fail 0`.
  - **Evidence:** run by this packet's author on 2026-11-14 on the tree that holds later commits, with no saved output.
- [x] T011 Run the relaunch and OpenCode plugin suites (`RL/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1539 of 1539.
  - **Evidence:** the orchestrator ran it on this commit's tree: exit 0, 1539 of 1539, from 1538 before. The commit message records the same counts. This author did not rerun the whole suite, and no output is saved.
- [x] T012 Check that the fix adds no file and leaves every other adapter alone (`FIX`). Verify: `git show --stat eaf24f999e` lists four files and `git show eaf24f999e | rg -c '^new file'` prints nothing.
  - **Evidence:** the stat listed the README, `stop-arm.mjs` and the two test files. The new-file count printed nothing with exit 1. `git diff eaf24f999e^ eaf24f999e --stat -- .skilled/hooks/session-relaunch/codex` printed nothing.
- [x] T013 Check the changed hook parses (`RL/claude/stop-arm.mjs`). Verify: `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0.
  - **Evidence:** exit 0 on 2026-11-14.
- [x] T014 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/005-parked-record-escape --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows 3 of 3 new or renamed tests failing and `scratch/green.txt` shows 3 of 3 passing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The dialog guard this keeps usable**: `../001-sender-dialog-after-prepare/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 8
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the decisions in `implementation-summary.md`
- [x] CHK-003 [P1] The pre-change gap is confirmed from the parent commit (T001 and T002)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the changed hook (T013)
- [x] CHK-011 [P0] Each of the three tests asserts that the record equals the pre-Stop record apart from `deferredAt`, so the stamp is the only change
- [x] CHK-012 [P1] A failed stamp is logged and not thrown, by inspection of the `try` and `catch` in `markParked` at `stop-arm.mjs:53` to `stop-arm.mjs:59`
- [x] CHK-013 [P1] The helper reuses `markDeferred`, the stamp the background-task deferral already used
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-003 pass with their commands
- [x] CHK-021 [P0] All three new or renamed tests failed before the edit (`scratch/red.txt`)
- [x] CHK-022 [P1] The conformance case still asserts an otherwise unchanged record and no killer for every runtime (T007)
- [x] CHK-023 [P1] The throwing arm starts no killer, by the test's `assert.deepEqual(spawns, [])`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `class-of-bug`: three Stop paths shared one flaw, a pending record left unmarked, and one helper now covers all three and the fourth that already stamped.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'markDeferred' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints the import and one call inside `markParked`.
- [x] CHK-FIX-003 [P0] Consumer inventory: the only reader of the stamp is `acceptsRecord` in `lib/withdraw.cjs`, unchanged by T012.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axis listed in plan.md: the path that leaves the record pending, four rows.
- [x] CHK-FIX-006 [P1] The suites run with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `eaf24f999e`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the helper reads no credential and writes one timestamp
- [x] CHK-031 [P0] No hook input reaches the record through the stamp, because `markDeferred` writes its own clock value
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `markParked` and the three paths
- [x] CHK-041 [P1] The helper carries a comment on why a parked record is marked
- [x] CHK-042 [P2] The session-relaunch README names the stamp on the three paths (T008)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only
- [x] CHK-051 [P1] The fix leaves no temporary file in the source tree: `git show --stat eaf24f999e` lists the four changed files and nothing else
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
