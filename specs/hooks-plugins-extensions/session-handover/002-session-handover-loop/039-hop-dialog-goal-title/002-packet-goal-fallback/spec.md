---
title: "Feature Specification: Phase 2: packet-goal-fallback"
description: "A hop carried a goal only when the Claude sender had set one itself. A sender with no goal entry in its session log handed on nothing, so the operator had to type the goal again with /goal in the new session."
trigger_phrases:
  - "packet goal fallback"
  - "phase 2 packet goal fallback"
  - "claude receiver starts on packet goal"
  - "no goal entry hop"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: packet-goal-fallback

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/366-hop-after-question-dialog` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-sender-dialog-after-prepare |
| **Successor** | 003-generated-title-carry |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 002-packet-goal-fallback --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title specification.

**Scope Boundary**: The Claude branch of the goal resolver in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, its tests in `relaunch-core.test.cjs` and `session-relaunch-cli.test.cjs` and the Goal Packet rows of `.skilled/hooks/session-relaunch/README.md`. Claude Code only.

**Dependencies**:
- `packetLineage`, `firstUsablePacket` and `goalPacketProblem` in `lib/relaunch-core.cjs` already exist and are reused unchanged.
- `readPacketGoal` in `.skilled/hooks/goal/lib/goal-slice.cjs` gives the durable slice and its `budgetState`.
- `.skilled/bin/skilled-loop` already starts a Claude receiver on `/goal <slice>` when the note carries `goal_packet`. That path is unchanged.

**Deliverables**:
- A fallback in `claudeGoalPacketResult` that names the nearest unfinished packet goal when the whole session log holds no goal entry.
- A `whole` flag from `latestGoalLogEntry`, so a log cut at the tail cap is never read as "no goal was set".
- Two resolver tests and one CLI test, one of them failing before the source edit.
- Two README lines that state the new rule.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A hop carried a goal only when the Claude sender had set one itself. `claudeGoalPacketResult` returned no packet when the session log held no goal entry, so the note got no `goal_packet` and the receiver started with the claim seed only. Claude Code lets no hook set a goal, so the operator had to type the goal again with `/goal` in every new session of a packet that already has a `goal.md`.

The orchestrator saw this live on 2026-11-13. The sender of the hop into session `53e771b8` had no goal set, and the operator set the goal by hand. No file in this packet saves that run.

The operator asked on 2026-11-13: "claude code will ask you to manually set goal after in session handover we want to bypass that somehow so it can keep working on goal without user needing to set it maybe utilize a hook or something thats auto triggered that references nested goal parent and phase goal docs".

### Purpose
A Claude sender that never set a goal still hands on the unfinished goal of the packet its note names, so the receiver starts on that goal without the operator typing it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from this phase folder. `scratch/red.txt` is the resolver test run with the new tests in place and the source not yet changed.

```text
$ rg -n '^(✖|ℹ (tests|pass|fail) )' scratch/red.txt
8:✖ resolveGoalPacket gives a Claude sender with no goal entry the nearest unfinished packet goal (2.259375ms)
13:ℹ tests 12
15:ℹ pass 11
16:ℹ fail 1
22:✖ failing tests:
25:✖ resolveGoalPacket gives a Claude sender with no goal entry the nearest unfinished packet goal (2.259375ms)
```

The failing assertion is `the parent holds the only goal.md`. The resolver returned `''` where the test expected `specs/hooks/023-session-relaunch-loop` (`scratch/red.txt` lines 26 to 30). The code before the change held `if (latest === null || !latest.active) return none;` at line 623 of `relaunch-core.cjs` in the parent of `c461b79a71`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Return a `whole` flag from `latestGoalLogEntry` next to the newest goal entry.
- Add `packetGoalIsSettable`, which accepts a packet whose durable slice is within budget and still holds an unticked `- [ ]` line.
- Carry the nearest packet in `packetLineage(specFolder)` that passes `goalPacketProblem` and `packetGoalIsSettable` when the log was read whole and holds no goal entry.
- Test the fallback, the cases that stay uncarried and the `prepare` command end to end.
- State the new rule in the Goal Packet table and the troubleshooting list of the session-relaunch README.

### Out of Scope
- Pi, OpenCode, Devin and Cursor - they read goal records and are unchanged.
- Codex - it carries no packet, and nothing here changes that.
- Carrying the ending of a goal through the hop chain - it would close the cleared-goal gap but needs a new note field. The operator chose to skip finished goal docs instead.
- A live hop - none was run for this child. The wrapper path from `goal_packet` to `/goal` is unchanged code.
- A new module or a new relaunch record key - parent decision D3 forbids both.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Add `OPEN_CRITERION_PATTERN`, `packetGoalIsSettable` and the `whole` flag, and carry the packet goal when no goal entry exists |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the fallback test and the ended or unreadable test |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Add a `prepare` test that writes and then removes `goal_packet` |
| `.skilled/hooks/session-relaunch/README.md` | Modify | State the fallback in the Claude row and the troubleshooting list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When the Claude log is readable, was read whole and holds no goal entry, `resolveGoalPacket` returns the nearest packet in `packetLineage(specFolder)` whose `goal.md` passes `goalPacketProblem`, has `budgetState` `ok` and has an unticked `- [ ]` line in its durable slice. The test `resolveGoalPacket gives a Claude sender with no goal entry the nearest unfinished packet goal` fails before the edit. |
| REQ-002 | A goal the sender set still wins, and a met, failed or cleared goal stays uncarried. The test `resolveGoalPacket leaves an ended or unreadable Claude goal uncarried` covers each case. |
| REQ-003 | A log that was not read whole stays uncarried. Removing `if (!whole) return none;` makes the case `a log read only in part` fail. |
| REQ-004 | A finished `goal.md`, a slice over the budget, a `goal.md` with no criteria and an unticked box in the log section are skipped. A leaf phase goal gives way to its parent. |
| REQ-005 | No module is added and the relaunch record is not touched. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `prepare` for a Claude sender with no goal writes `goal_packet` into the note while the packet goal is open and removes it once every criterion is ticked. |
| REQ-007 | The relaunch and OpenCode plugin suites, the goal hook suites and the Pi adapter suite all exit 0. |
| REQ-008 | The session-relaunch README states the fallback and the cases that leave the field out. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with 159 of 159, and `scratch/red.txt` shows 11 pass and 1 fail before the edit.
- **SC-002**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `git show --summary --format= c461b79a71 | rg 'create mode'` prints nothing.
- **SC-004**: `validate.sh 002-packet-goal-fallback --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `readPacketGoal` and its `budgetState` in `.skilled/hooks/goal/lib/goal-slice.cjs` | A changed budget rule would change which packet is carried | The fallback test asserts the leaf phase case and the over-budget case |
| Risk | The goal log is per session. A goal met or cleared in session 1 leaves session 2 with no goal entry, so session 3 could start on the ended goal | Med | A finished `goal.md` is skipped. A goal cleared by hand while criteria are still unticked still comes back, as stated in Known Limitations |
| Risk | The fallback has no headline proof, so a stale parent `goal.md` could be picked | Med | Only a goal with an unticked criterion and a slice within budget is carried. `SESSION_RELAUNCH_GOAL=0` turns the carry off |
| Risk | A log cut at the 16 MB tail cap reads as "no goal entry" | Low | The `whole` flag. Only a log read whole counts as "no goal was set" |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the fallback reads at most one `goal.md` per lineage step, once per `prepare`.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: A carried packet passes `goalPacketProblem`, the same containment check every other goal packet passes.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A `goal.md` that cannot be read is skipped, and a log that cannot be read carries nothing. The hand-over never fails on either.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a note with no spec folder or a lineage with no `goal.md` carries nothing.
- Maximum input: a log past the 16 MB tail cap is not read whole and carries nothing.
- Failure path: a `goal.md` that throws on read is skipped for that root, and the resolver returns an empty packet with no reason line.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One core file, two test files and two README lines |
| Risk | 8/25 | A wrong packet starts a receiver on a goal the operator did not want |
| Research | 6/20 | One read-only review and code reading, no live run |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a goal the operator cleared by hand stay cleared across the hop chain? Decision: not in this phase. The operator chose "Skip finished goal docs (Recommended)". Carrying the ending through the chain needs a new note field.
- Does a live receiver start on `/goal` from a fallback packet? Not run live. Unit and CLI tests cover the note field, and the wrapper path is unchanged.
<!-- /ANCHOR:questions -->

---
