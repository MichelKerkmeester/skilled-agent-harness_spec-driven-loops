---
title: "Feature Specification: Phase 16: ended-goal-mark-match"
description: "The ended-goal mark is read from any note the session ever claimed, whatever its status, and it is not read at all when the session log is missing or unreadable. A session that claimed two notes can lose a valid goal fallback, and a receiver without a readable log drops a goal ending the operator chose."
trigger_phrases:
  - "ended goal mark match"
  - "phase 16 ended goal mark match"
  - "goal_ended mark from the note claimed last"
  - "goal_ended kept when the session log cannot be read"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: ended-goal-mark-match

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
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 19 |
| **Predecessor** | 015-wrapper-start-checksum |
| **Successor** | 017-missing-transcript-notice |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 016-ended-goal-mark-match --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the hop dialog, goal and title specification, in the third review round of 2026-11-14.

**Scope Boundary**: `claimedNoteEndedGoal` and the two early returns of `claudeGoalPacketResult` in `lib/relaunch-core.cjs`, two tests in `tests/relaunch-core.test.cjs` and the Claude row of the goal table in the session-relaunch README. The shared relaunch core only. No adapter, no note field and no relaunch record key.

**Dependencies**:
- Phase 10 added the `goal_ended` note field and the claimed-note scan this phase narrows.
- Phase 11 bounded the packet fallback to the note's folder and its parent. The fallback this phase protects is that bounded one.
- Phase 14 recorded that the mark is matched on the claiming session id. That limit stays, because whether a Claude session id changes on `/clear` is still unconfirmed.
- The parent goal log of 2026-11-14 deferred "a change to what the ended-goal mark matches on" to a later packet. The operator now asks for every P0, P1 and P2 finding to be fixed, which supersedes that deferral for the two findings here.

**Deliverables**:
- A mark read only from the note this session claimed last.
- A mark that survives a missing or unreadable session log.
- Two tests that failed before the source edit.
- A README row that states both rules.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`claimedNoteEndedGoal` (`lib/relaunch-core.cjs:632`) returns true for any note in the handoffs folder whose `claimed_by` is this session and whose `goal_ended` is `true` (`:639`). It never looks at the note's status. `supersedeClaimed` marks a session's earlier claimed notes `done` and keeps their `claimed_by` (`:1471` to `:1517`). The public `claim` command lets one session claim a second open note, because `claimHandoff` (`:1414`) only requires an open note. A session that claimed a marked note and later a second, unmarked one therefore reads the old mark and loses the packet fallback of the note it now works from. The alignment run raised this as A-1, which its critic lowered from P1 to P2, and both independent reviews of 2026-11-14 confirmed it.

`claudeGoalPacketResult` returns `none` when no session log is found (`:658`) and when the log read throws (`:661` to `:665`). Both returns come before the claimed-note check at `:673`. A receiver whose own log is missing or unreadable therefore writes no mark, and the next receiver that sets no goal can fall back to the packet goal the operator ended. Review FH raised this as a P2 and marked it inferred.

### Purpose
The ended-goal mark is read from the one note this session claimed last, and a missing or unreadable session log no longer drops it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `99d197475d`. The first command prints the status-blind match, the early return for a missing log and the claimed-note check. The second shows that `prepare` resolves the goal before it supersedes the claimed notes.

```text
$ rg -n -o 'frontmatter.claimed_by === sessionId && frontmatter.goal_ended === .true.|if \(logPath === null\) return none|if \(claimedNoteEndedGoal\(handoffPath, sessionId\)\) return' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
639:frontmatter.claimed_by === sessionId && frontmatter.goal_ended === 'true'
658:if (logPath === null) return none
673:if (claimedNoteEndedGoal(handoffPath, sessionId)) return
exit=0

$ rg -n -o '^  (recordGoalPacket|supersedeClaimedNotes)\(\{? ?handoffPath' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs
485:  recordGoalPacket({ handoffPath
603:  supersedeClaimedNotes(handoffPath
637:  supersedeClaimedNotes(handoffPath
exit=0
```

The match at line 639 has no status test. The return at line 658 comes fifteen lines before the check at line 673. The goal is written at line 485, inside the note validation both commands run, before `prepare` supersedes at line 603 and `keep` at line 637. Neither false result was reproduced here. Both are read from the code, and the two tests this phase adds are what reproduce them.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the mark only from the note in the handoffs folder that this session claimed last, chosen by the greatest `claimed_at`. A note with no `claimed_at` counts as older than any note that has one.
- Check the claimed-last note's mark when no session log is found and when the log read throws, and return `ended: true` when it carries the mark. Otherwise return `none` as today.
- Add the tests `the ended-goal mark counts only from the note this session claimed last` and `a goal the sender ended stays ended when the session log cannot be read`, both written to fail first.
- Correct the Claude row of the goal table in the session-relaunch README: the mark comes from the note claimed last, and a missing or unreadable log keeps it.

### Out of Scope
- A `status: claimed` filter in place of the claimed-last rule: `prepare` writes the goal at `bin/session-relaunch.cjs:485` before it supersedes the claimed note at `:603`, so a second `prepare` in the same session after a `cancel` would find its one claimed note `done` and drop the mark. That is inferred from the call order, and the first new test pins it.
- Clearing `claimed_by` on a superseded note: the hop history and the claim refusal read it, so the producer stays as it is and only the reader changes.
- Matching on anything other than the claiming session id: phase 14 recorded that limit, and it waits on a check of whether `/clear` changes a Claude session id.
- The feature catalog and the playbook: phase 19 documents this behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `claimedNoteEndedGoal` keeps the claimed note with the greatest `claimed_at`, and `claudeGoalPacketResult` checks it on the two early returns |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Two new tests |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The Claude row of the goal table names the claimed-last rule and the unreadable log |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A session that claimed a marked note and later an unmarked one, with a whole log and no goal entry, resolves to the parent packet goal with `ended: false`. With only the marked note left, which is now `done`, it resolves to `ended: true`. The test `the ended-goal mark counts only from the note this session claimed last` fails before the edit and passes after. |
| REQ-002 | A session whose claimed-last note carries the mark resolves to `ended: true` when no session log is found and when the log path cannot be read. With no mark it resolves to `{ packet: '', reason: '', ended: false }`. The test `a goal the sender ended stays ended when the session log cannot be read` fails before the edit and passes after. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The existing tests `a goal the sender ended stays ended for a receiver that sets none` and `resolveGoalPacket answers empty when no Claude log can be read` pass unchanged. |
| REQ-004 | The relaunch and OpenCode plugin suites pass at the final state with two more tests than the baseline taken in the first task. |
| REQ-005 | The fix commit changes the core, the test file and the README, adds no file, no module, no note field and no relaunch record key, and every changed comment names no packet, phase, task or finding number. |
| REQ-006 | The README Claude row names the note the session claimed last and says a missing or unreadable log keeps its mark. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows the two new tests failing for the name pattern `ended-goal mark counts only|session log cannot be read` before the edit, and `scratch/green.txt` shows both passing after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count plus two.
- **SC-003**: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0 and `git show --stat` of the fix commit lists three files and no new file.
- **SC-004**: `validate.sh 016-ended-goal-mark-match --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `claimHandoff` writes `claimed_at` as an ISO timestamp | Notes could not be ordered by claim | Every claim goes through `claimHandoff`, and a note without the field counts as oldest |
| Risk | Keeping the mark on an unreadable log suppresses a goal the session set itself | Low | With no readable log the session's own goal cannot be carried today either, so the only change is that the operator's ending is not undone |
| Risk | The claimed-last rule picks a note the session claimed by hand in another folder | Low | The scan stays in the folder of the note being handed over, as today |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The scan reads the same notes it reads today and keeps one candidate, so no extra file is read.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The scan stays inside the folder of the note being handed over, as `safeDirectory` already limits it.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A note that cannot be read or parsed still says nothing about a goal, as today.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a folder with no note this session claimed returns no mark, as today.
- Maximum input: two claimed notes with the same `claimed_at` are not expected, because one session claims one note at a time. The build picks either one and the test does not depend on the order.
- Failure path: a missing log or a log path that cannot be read returns `ended: true` only when the claimed-last note carries the mark, and `none` otherwise.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One helper, two early returns, two tests and one README row |
| Risk | 6/25 | The goal path decides what a receiver starts on |
| Research | 4/20 | Two findings, one inferred, and a call order read across two files |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a Claude session id change on `/clear`? Not confirmed. Decision: the limit phase 14 recorded stays, and this phase does not change what id the mark is matched on.
- Does a real session ever claim a second note? Not observed. Decision: the public `claim` command allows it, so the reader is narrowed anyway.
<!-- /ANCHOR:questions -->

---
