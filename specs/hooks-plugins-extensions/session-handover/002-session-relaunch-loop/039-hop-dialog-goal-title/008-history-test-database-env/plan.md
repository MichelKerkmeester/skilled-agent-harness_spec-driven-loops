---
title: "Implementation Plan: Phase 8: history-test-database-env"
description: "Drop OPENCODE_DB from the environment the history lookup test hands the reader, run it red then green with the variable set, and run the whole relaunch and OpenCode plugin suite with it unset."
trigger_phrases:
  - "history test database env plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: history-test-database-env

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the plugin test |
| **Framework** | None, Node built-in modules |
| **Storage** | None changed. The test writes its own OpenCode store under a temp data folder |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
One test hands the whole shell environment to the history lookup command, and the reader takes its database name from `OPENCODE_DB`. The test now drops that one variable before it builds the environment. The proof is a red run and a green run of the test file with `OPENCODE_DB=other-session.db` set, then the whole relaunch and OpenCode plugin suite with the variable unset.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `OPENCODE_DB=other-session.db` makes the unedited test fail with `store_unreadable` (`scratch/red.txt:28`)

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scoped test environment.

### Key Components
- **The redeem test in `session-history-lookup.test.cjs`**: builds the environment for the printed lookup command. It destructures `OPENCODE_DB` out of `process.env` and spreads the rest. Without the drop a shell that holds the variable redirects the reader.

### Data Flow
The test writes a store under `XDG_DATA_HOME`, fires a compaction event and takes the printed lookup command from the system line. It runs that command with `bash -c` and the built environment. `openCodeDatabasePath` in `.skilled/hooks/shared/session-readers/opencode.mjs` opens `OPENCODE_DB` under the data folder when the variable names a database and `opencode.db` when it does not. The edit makes the second case the one the test always gets.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The redeem test in `.opencode/plugins/tests/session-history-lookup.test.cjs` | Runs the printed lookup command with an environment | update | `rg -n 'OPENCODE_DB' .opencode/plugins/tests/session-history-lookup.test.cjs` prints lines 133 and 135 |
| `openCodeDatabasePath` in `.skilled/hooks/shared/session-readers/opencode.mjs` | Reads `OPENCODE_DB` for the database name | unchanged | `git show --stat 94af61c540` lists one file, the test |
| The other two tests in the same file | Do not hand the shell environment to the reader | not a consumer | They passed in `scratch/red.txt:3` and `scratch/red.txt:4` |
| `.skilled/hooks/shared/tests/session-readers/opencode.test.mjs` | Tests that the database named by `OPENCODE_DB` is the one read | not a consumer | `rg -n 'OPENCODE_DB' .skilled/hooks --glob '*.test.*'` prints it at lines 58 and 63. It sets the variable on purpose |

Required inventories:
- Same-class producers: `rg -n 'OPENCODE_DB' .opencode/plugins/tests .skilled/hooks --glob '*.test.*'` prints the two lines of this edit and the reader test above. No other test passes the shell environment through to the reader.
- Consumers of changed symbols: none. The edit adds a local binding `ambientEnv` inside one test.
- Matrix axes: `OPENCODE_DB` (unset, set to a name). The red and green runs cover the set row and the whole-suite run covers the unset row.
- Algorithm invariant: the environment handed to the reader never holds `OPENCODE_DB`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the reader and the test and runs the unedited test with `OPENCODE_DB` set. Implementation drops the variable from the environment and reruns it. Verification runs the whole relaunch and OpenCode plugin suite and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three tests of `session-history-lookup.test.cjs` with `OPENCODE_DB=other-session.db` set | `node:test` |
| Integration | The relaunch and OpenCode plugin suites with `OPENCODE_DB` unset | `node:test` |
| Manual | None. No live hop is run in this phase | Not run |

The test file runs first with the variable set and must show 2 pass and 1 fail, saved to `scratch/red.txt`. After the edit the same command must show 3 pass, saved to `scratch/green.txt`. No new test is added. The existing case is the test that fails first.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `openCodeDatabasePath` in `.skilled/hooks/shared/session-readers/opencode.mjs` | Internal | Green | The cause would need a new trace |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the redeem test fails after the edit, or any relaunch or plugin test fails because of it.
- **Procedure**: revert commit `94af61c540`. It touches one test file and no product code.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The research finding in `../research/research.md` section 5 | Implementation |
| Implementation | The red run saved in `scratch/red.txt` | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
