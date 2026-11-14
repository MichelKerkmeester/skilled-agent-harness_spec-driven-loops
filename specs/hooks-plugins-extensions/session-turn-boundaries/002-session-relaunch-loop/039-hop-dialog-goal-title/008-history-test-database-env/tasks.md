---
title: "Tasks: Phase 8: history-test-database-env"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "history test database env tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: history-test-database-env

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

**Task variables**: `TEST` is `.opencode/plugins/tests/session-history-lookup.test.cjs`. `PHASE` is this phase folder. `FIX` is commit `94af61c540`.

**Test environment**: run the suites as `env -u AI_SESSION_CHILD node --test <file>`, because a dispatched child marker changes how the relaunch hooks behave. The whole-suite run also unsets `OPENCODE_DB`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the reader takes its database name from `OPENCODE_DB` (`.skilled/hooks/shared/session-readers/opencode.mjs`). Verify: `rg -n 'OPENCODE_DB' .skilled/hooks/shared/session-readers/opencode.mjs` prints line 58 with `const named = envOf(options).OPENCODE_DB;`.
  - **Evidence:** lines 52 and 58 matched on 2026-11-14. `openCodeDatabasePath` joins a relative name to the data folder and uses an absolute path as given.
- [x] T002 Confirm the unedited test handed the whole shell environment to the reader (`TEST`). Verify: `git show 94af61c540^:.opencode/plugins/tests/session-history-lookup.test.cjs | rg -n 'OPENCODE_DB|process.env'` prints line 135 with `...process.env` and no `OPENCODE_DB`.
  - **Evidence:** line 135 read `env: { ...process.env, XDG_DATA_HOME: dataHome, SPECKIT_RUNTIME: '' },` and nothing in the file named `OPENCODE_DB`.
- [x] T003 Run the unedited test with a database name set and save the failure (`PHASE/scratch/red.txt`). Verify: `env -u AI_SESSION_CHILD OPENCODE_DB=other-session.db node --test .opencode/plugins/tests/session-history-lookup.test.cjs` prints `tests 3`, `pass 2` and `fail 1`.
  - **Evidence:** `scratch/red.txt:5` to `scratch/red.txt:8`. The failing case is `a compacted session started in a subfolder gets an offer that redeems` and its reply is `{"ok":false,"code":"store_unreadable"}` at `scratch/red.txt:28`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Drop `OPENCODE_DB` from the environment the redeem test hands the reader, with a comment (`TEST`). Verify: `rg -n 'OPENCODE_DB' .opencode/plugins/tests/session-history-lookup.test.cjs` prints lines 133 and 135.
  - **Evidence:** line 135 reads `const { OPENCODE_DB: _ambientDatabase, ...ambientEnv } = process.env;` and the call spreads `ambientEnv` where it spread `process.env`. Lines 133 and 134 hold the comment.
- [x] T005 Rerun the test with the same database name set and save the pass (`PHASE/scratch/green.txt`). Verify: the command of T003 prints `tests 3`, `pass 3` and `fail 0`.
  - **Evidence:** `scratch/green.txt:5` to `scratch/green.txt:8`. A rerun by this packet's author on 2026-11-14 printed the same with exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the relaunch and OpenCode plugin suites with the variable unset (`.skilled/hooks/session-relaunch/tests` and `.opencode/plugins/tests`). Verify: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
  - **Evidence:** the commit message of `94af61c540` records 1543 of 1543, unchanged. On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. The 3 failures in an earlier run came from several agents running the suite at the same time. Neither run is saved under `scratch/`.
- [x] T007 Check that the fix touches one file and adds no new file (`FIX`). Verify: `git show --stat 94af61c540` lists one file and `git show 94af61c540 | rg -c '^new file'` prints nothing.
  - **Evidence:** the stat listed `.opencode/plugins/tests/session-history-lookup.test.cjs` with 4 insertions and 1 deletion. The new-file count printed nothing with exit 1.
- [x] T008 Check the changed test parses (`TEST`). Verify: `node --check .opencode/plugins/tests/session-history-lookup.test.cjs` exits 0.
  - **Evidence:** exit 0 on 2026-11-14.
- [x] T009 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/008-history-test-database-env --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4 and in the closing report of this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/red.txt` shows 1 of 3 failing and `scratch/green.txt` shows 3 of 3, both with `OPENCODE_DB=other-session.db` set
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The research that asked for this**: `../research/research.md` section 5 (row "009, 013") and section 9 rank 16
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T003 blocks the edit.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 4
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the rejected product fix in `implementation-summary.md`
- [x] CHK-003 [P1] The failure is reproduced before the edit (T003)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on the changed test (T008)
- [x] CHK-011 [P0] No other call in the file spreads `process.env`: `rg -n '\.\.\.process\.env' .opencode/plugins/tests/session-history-lookup.test.cjs` prints nothing
- [x] CHK-012 [P1] The other two tests in the file still pass with the variable set (`scratch/green.txt:3` and `scratch/green.txt:4`)
- [x] CHK-013 [P1] The unused binding `_ambientDatabase` carries an underscore prefix, by inspection of `TEST:135`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 and AC-002 pass with their commands
- [x] CHK-021 [P0] The redeem test failed before the edit (`scratch/red.txt`)
- [x] CHK-022 [P1] The whole relaunch and OpenCode plugin suite passes with the variable unset (T006)
- [x] CHK-023 [P1] No test was added or removed. The change is inside one existing case
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is `instance-only`: the redeem test is the one call in its file that passes the shell environment to the reader.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n '\.\.\.process\.env' .opencode/plugins/tests/session-history-lookup.test.cjs` prints nothing after the edit.
- [x] CHK-FIX-003 [P0] Consumer inventory: the reader in `opencode.mjs` is unchanged, by T007.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The test still passes every other inherited variable on.
- [x] CHK-FIX-005 [P1] Matrix axis listed in plan.md: `OPENCODE_DB` unset and set to a name.
- [x] CHK-FIX-006 [P1] The suites run with `AI_SESSION_CHILD` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to fix commit `94af61c540`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the test reads and writes no credential
- [x] CHK-031 [P0] N/A: the change removes one variable from a child process environment and adds none
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `OPENCODE_DB` and the test case `a compacted session started in a subfolder gets an offer that redeems`
- [x] CHK-041 [P1] The edit carries a comment on why the test drops the variable (`TEST:133`)
- [x] CHK-042 [P2] N/A: no README or playbook names this test
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test runs live under `scratch/` only
- [x] CHK-051 [P1] No temporary file was left outside `scratch/`
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
