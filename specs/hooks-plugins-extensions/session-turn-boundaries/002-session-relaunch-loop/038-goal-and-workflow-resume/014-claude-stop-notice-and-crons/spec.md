---
title: "Feature Specification: Phase 14: claude-stop-notice-and-crons"
description: "When the Claude Stop hook defers a hop because background tasks run, it writes one log line and prints nothing, so the operator cannot tell the hop is waiting or how to call it off. The same Stop payload carries session_crons, and no code reads it, so nothing records that the scheduled tasks of the session end with the hop."
trigger_phrases:
  - "claude stop notice and crons"
  - "phase 14 claude stop notice and crons"
  - "deferred hop notice"
  - "session crons count"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: claude-stop-notice-and-crons

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 17 |
| **Predecessor** | 013-opencode-child-and-title |
| **Successor** | 015-pi-mode-and-descendant-walk |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 014-claude-stop-notice-and-crons --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: The Claude Stop adapter `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` and its test file only. Research rank 8 (a notice for a deferred hop), the adapter half of rank 4 (read `session_crons`) and research section 7 item 2. The nudge and note lines, Codex and the other adapters stay out.

**Dependencies**:
- Phase 011 (`011-permission-mode-carry`) changes the same file at the `arm` call, `stop-arm.mjs:152`. This phase builds after 011 lands and finds its anchors by text, not by line.
- Phase 009 (`009-nudge-note-lines`) owns the `Scheduled:` note line. This phase relies on it for the cron list and does not write the note.
- `node:test` and `rg` are available.

**Deliverables**:
- A live check, recorded in `scratch/`, of whether a cron made in a sender exists in its receiver after a hop, and of the real shape of a `session_crons` entry.
- A live or documented check that a Claude Stop hook's `systemMessage` reaches the operator.
- A Stop notice on a deferred hop that names the task count and the `cancel` command.
- A `session-crons` log line with the cron count whenever Stop sees an armable record and a non-empty `session_crons`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When background tasks run at Stop, `armPendingRecord` logs `deferred-background-tasks`, marks the record and returns null with no output (`.skilled/hooks/session-relaunch/claude/stop-arm.mjs:119-135`), and `main` then exits with nothing printed (`stop-arm.mjs:179-180`). A task that never ends parks the hop, and the operator sees no sign of it and no way to stay. The Stop payload carries `session_crons` (`.skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:12`), and no adapter or library line reads it, so the log never shows that a hop drops scheduled tasks.

### Purpose
A deferred Claude hop tells the operator once per Stop how many tasks it waits on and how to call it off, and the relaunch log records how many crons a session held when its hop was armable.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm defers' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
✔ stop-arm defers pending state when background tasks exist and logs the reason (85.655625ms)
✔ stop-arm defers an armed record with a dead killer while background tasks run (66.182208ms)
ℹ tests 2
ℹ pass 2
ℹ fail 0

$ rg -n 'session_crons|systemMessage' .skilled/hooks/session-relaunch/claude .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/tests/fixtures
.skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:12:  "session_crons": []
```

The first deferral test passes while it asserts `result.stdout` is empty (`.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:653`), so a silent deferral is the tested contract today. The search finds `session_crons` in the fixture only and `systemMessage` nowhere in the adapter, the library or the fixtures.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm live that a cron made in a Claude sender is gone in its receiver after a hop, and record the shape of one `session_crons` entry.
- Confirm that a Stop hook's `{"systemMessage": ...}` on stdout with exit 0 is shown to the operator and does not continue the turn.
- Print one `systemMessage` from the deferral branch of `armPendingRecord` with the task count, the fact that a typed prompt also calls the hop off, and the `cancel` command.
- Log `session-crons` with the count once Stop finds an armable record and `session_crons` is a non-empty array.
- Change the deferral test's empty-stdout assertion to the new notice, and add the cron log test, each failing before its source edit.

### Out of Scope
- The `Scheduled:` and other note lines in `lib/nudge.cjs` - phase 009 owns them.
- Handing the cron list from Stop to the note - decision D2 leaves the list to phase 009's `Scheduled:` line.
- The permission mode passed to `arm` at `stop-arm.mjs:152` - phase 011 owns it.
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs` and the Pi and OpenCode adapters - the research names Claude only for both gaps.
- The README paragraph on Stop deferral, `README.md:126` - phase 017 owns the hand-over docs.
- Recreating crons in the receiver - no Claude launch flag restores them (research Eliminated Alternatives).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | Print the deferral notice and log the cron count. |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Replace the empty-stdout assertion of the deferral test and add the cron log test. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The claim that crons and wakeups end with the session on a hop is observed, not taken from vendor docs. In a throwaway checkout, a Claude sender inside `skilled-loop` creates one recurring task with `/loop`, a temporary Stop hook saves its payload, the sender hops, and the receiver lists its scheduled tasks. `scratch/live-crons.txt` holds the saved `session_crons` entry, the sender's list and the receiver's list. The same run answers research open question 2: the sender writes a two-item todo list before the hop, and the file records under `todo list` whether the receiver still shows it. No change follows from that answer in this phase. |
| REQ-002 | The claim that a Claude Stop hook shows `systemMessage` to the operator is confirmed from Claude Code's hook documentation or one live Stop in the same throwaway checkout, and the source or the screen text is recorded in `scratch/live-crons.txt`. If it is refuted, the build stops and the goal log names a replacement channel before any source edit. |
| REQ-003 | `claude/stop-arm.mjs` prints exactly one line on stdout in the deferral branch: `{"systemMessage": <text>}`, where the text names the task count, says the hop goes ahead at the first Stop after the tasks finish, says a typed prompt calls it off, and names `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs cancel`. The record handling and the `deferred-background-tasks` log line stay as they are. The test `stop-arm defers pending state when background tasks exist and logs the reason` in `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` replaces its assertion `result.stdout === ''` with a parse of that line and asserts `1 background task` and the cancel command. Today it would fail on the empty stdout. |
| REQ-004 | `claude/stop-arm.mjs` appends `session-crons loopId=<id> sessionId=<id> crons=<n>` to `relaunch.log` when the record is armable and `payload.session_crons` is an array with one or more entries, in both the arm and the deferral path. An empty or missing array writes no line. New test `stop-arm logs the cron count of a session whose hop is armable` sends two cron entries and asserts one line with `crons=2`. Today no such line exists. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The guard tests keep their assertions. `stop-arm arms a matching pending record, starts the killer lock, and prints nothing` still asserts empty stdout (`claude-adapters.test.cjs:564`), `stop-arm leaves a pending record alone when the relaunch concern is disabled` still asserts empty stdout (`:602`), `stop-arm defers an armed record with a dead killer while background tasks run` (`:1254`) still passes, and the Claude row of `adapter-conformance.test.cjs` (`:205-216`) still passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/live-crons.txt` shows one task in the sender's list and none in the receiver's, plus the saved `session_crons` entry.
- **SC-002**: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm defers pending state|stop-arm logs the cron count' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- **SC-004**: `validate.sh 014-claude-stop-notice-and-crons --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 edits `stop-arm.mjs` first | A build on the older file would conflict at the `arm` call | Build after 011 is merged and find anchors by text |
| Dependency | The live hop needs a throwaway checkout and a Claude login | REQ-001 cannot be met without it | Use the playbook harness from the parent's live hops, and stop to ask if no checkout is available |
| Risk | Stop fires at every turn end, so a long task repeats the notice | Low | One line per Stop is the intended rate, and the edge case is recorded |
| Risk | Claude reads a JSON stdout with `decision: "block"` as a request to continue | High | The line carries `systemMessage` only, and REQ-002 confirms the field before the edit |
| Risk | Crons survive a hop after all | Medium | REQ-001 runs first. A refuted claim stops the build and is recorded for phase 009 |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: the change adds one stdout write and one log append to a hook that already appends a log line.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The notice prints a count and a fixed command only, with no payload text, so a task label cannot reach the operator's screen through it.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A failed stdout write or log append never changes the exit code, which stays 0.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty or missing `session_crons` writes no `session-crons` line, and an empty `background_tasks` prints no notice.
- Maximum input: 50 background tasks print one notice that says `50 background tasks`, and 50 crons write one line with `crons=50`.
- Failure path: a non-array `session_crons` is ignored, and a record that is not armable prints and logs nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One adapter and one test file, about 25 lines |
| Risk | 5/25 | Hook stdout is read by the runtime, and a wrong field could continue a turn |
| Research | 8/20 | Two runtime claims need a live check before the edit |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Do crons and wakeups end with the session on a hop? Decision: REQ-001 observes it live before any edit.
- Does Claude's todo list survive a relaunch (research open question 2)? Decision: the REQ-001 run records it. Phase 017 documents the answer, and nothing is built on it here.
- Does a Claude Stop hook show `systemMessage` to the operator? Decision: REQ-002 confirms it before any edit.
<!-- /ANCHOR:questions -->

---
