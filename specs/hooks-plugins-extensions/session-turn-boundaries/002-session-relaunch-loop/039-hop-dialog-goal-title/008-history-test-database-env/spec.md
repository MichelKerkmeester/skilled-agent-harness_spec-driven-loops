---
title: "Feature Specification: Phase 8: history-test-database-env"
description: "The history lookup reader takes its database name from OPENCODE_DB, and one plugin test passed the whole shell environment to it. A name inherited from the shell pointed the reader away from the store the test wrote, so the test failed with store_unreadable."
trigger_phrases:
  - "history test database env"
  - "phase 8 history test database env"
  - "opencode_db history lookup test"
  - "store_unreadable inherited database name"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: history-test-database-env

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 11 |
| **Predecessor** | 007-killer-test-margin |
| **Successor** | 009-document-corrections |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 008-history-test-database-env --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Close the research gaps of the relaunch hop dialog, goal and title fixes specification.

**Scope Boundary**: One test in `.opencode/plugins/tests/session-history-lookup.test.cjs`, the case `a compacted session started in a subfolder gets an offer that redeems`. No product code.

**Dependencies**:
- The research finding in `../research/research.md` section 5 (row "009, 013") and the ranked change at section 9 rank 16.
- `openCodeDatabasePath` in `.skilled/hooks/shared/session-readers/opencode.mjs` already reads `OPENCODE_DB`. It is unchanged.

**Deliverables**:
- The test drops `OPENCODE_DB` from the environment it hands the history reader, with a comment that says why.
- A red run and a green run with `OPENCODE_DB=other-session.db` set, saved under `scratch/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The history lookup reader takes its database name from `OPENCODE_DB` (`.skilled/hooks/shared/session-readers/opencode.mjs:58`). The test `a compacted session started in a subfolder gets an offer that redeems` wrote its own store and then ran the printed lookup command with the whole shell environment. A name inherited from the shell pointed the reader at a different database than the one the test wrote, and the test failed with `store_unreadable`. Anyone who runs the full relaunch and OpenCode plugin suites from a shell that holds `OPENCODE_DB` sees one red test that has nothing to do with relaunch.

The research of 2026-11-13 confirmed it: "One test inherits the ambient database name. It is a test defect, not a relaunch defect" (`../research/research.md` section 5, row "009, 013").

### Purpose
The test passes whatever `OPENCODE_DB` the shell holds, so the full suite no longer needs that variable unset.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root. The red run is the test before the edit and the green run is the same command after it. Both are saved under `scratch/`.

```text
$ env -u AI_SESSION_CHILD OPENCODE_DB=other-session.db node --test .opencode/plugins/tests/session-history-lookup.test.cjs
(scratch/red.txt, before the edit)
✖ a compacted session started in a subfolder gets an offer that redeems (243.895708ms)
✔ a second request keeps the offer and another session gets none (89.196167ms)
✔ a folder outside any checkout gets no offer and saves no locator (120.2735ms)
ℹ tests 3
ℹ pass 2
ℹ fail 1
    output: [ null, '{"ok":false,"code":"store_unreadable"}\n', '' ],

(scratch/green.txt, after the edit, variable still set)
✔ a compacted session started in a subfolder gets an offer that redeems (203.508084ms)
✔ a second request keeps the offer and another session gets none (91.251167ms)
✔ a folder outside any checkout gets no offer and saves no locator (121.344958ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

Before the edit one of three failed and the reply was `store_unreadable`. After it all three pass with the variable still set. This author reran the green command on 2026-11-14 and it printed `tests 3`, `pass 3` and `fail 0`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Drop `OPENCODE_DB` from the environment the redeem test passes to the history reader.
- Say why in a comment, so the next editor does not put the whole environment back.
- Save a red run and a green run with `OPENCODE_DB=other-session.db` set.

### Out of Scope
- A product fix for the `OPENCODE_DB` coupling - the reader is meant to take its name from the variable, and the research ranks a product fix as rejected because it is one test's inherited environment (`../research/research.md`, the Eliminated Alternatives table).
- The other two tests in the file - they passed in the red run and do not hand the shell environment to the reader.
- A live hop - this is a test defect and no hop is involved.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/tests/session-history-lookup.test.cjs` | Modify | The redeem test drops `OPENCODE_DB` from the environment it hands the reader |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `OPENCODE_DB=other-session.db` set, `env -u AI_SESSION_CHILD OPENCODE_DB=other-session.db node --test .opencode/plugins/tests/session-history-lookup.test.cjs` exits 0 with 3 of 3 passing. It printed 1 of 3 failing with `store_unreadable` before the edit. |
| REQ-002 | No product code changes. The fix commit lists one file, the test, and adds no new file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The relaunch and OpenCode plugin suites pass at the final state with `OPENCODE_DB` unset, with no test removed. |
| REQ-004 | A comment at the edit says that the reader takes its database name from `OPENCODE_DB` and why the test drops it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 3 tests with 2 pass and 1 fail before the edit, and `scratch/green.txt` shows 3 of 3 after it, both with `OPENCODE_DB=other-session.db` set.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `git show --stat 94af61c540` lists one file and `git show 94af61c540 | rg -c '^new file'` prints nothing.
- **SC-004**: `validate.sh 008-history-test-database-env --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The reader keeps reading `OPENCODE_DB` in `opencode.mjs` | If it stopped, the test would no longer need the drop but would still pass | The drop is harmless in that case, and the comment names the reader so an editor can retire it |
| Risk | A later edit puts the whole `process.env` back in that call | Low | The comment at `session-history-lookup.test.cjs:133` names the reason. A run with `OPENCODE_DB` set would fail again as `scratch/red.txt` shows |
| Risk | The test no longer exercises a shell that holds `OPENCODE_DB` | Low | The case checks the offer and its redeem against the store the test wrote. A shell that sets the variable is the case the drop removes on purpose. Judgment, not measured |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the edit adds one object destructure to a test and changes no runtime path.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: N/A: the test passes the rest of the shell environment on as before. Only the database name is dropped.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: The test result no longer depends on the shell that runs it, for the one variable `OPENCODE_DB`. Other inherited variables are not examined here.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: with `OPENCODE_DB` unset the destructure leaves the rest of the environment as it was, and the suite passes as before.
- Maximum input: an absolute path in `OPENCODE_DB` is the other form the reader accepts (`opencode.mjs:60` to `opencode.mjs:61`), and the drop removes it the same way. Not run, by inspection of the reader.
- Failure path: with a name set and no drop the reader replies `{"ok":false,"code":"store_unreadable"}` and `execFileSync` throws, as `scratch/red.txt:28` shows.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 1/25 | One test file, 4 lines added and 1 removed |
| Risk | 1/25 | A test only, no product code |
| Research | 2/20 | The research already named the cause, and one red run confirmed it |
| **Total** | **4/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the whole relaunch and OpenCode plugin suite stay green when run from a shell that sets `OPENCODE_DB`? Not run with the variable set. The suite runs recorded here unset it. A run with it set would answer.
<!-- /ANCHOR:questions -->

---
