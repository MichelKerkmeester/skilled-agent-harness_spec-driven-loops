---
title: "Feature Specification: Phase 11: goal-fallback-bound"
description: "A Claude sender that never set a goal started its receiver on the nearest unfinished packet goal found by climbing every ancestor of the note's spec folder. Nothing ties a goal several levels up to the session, so a receiver could start on the goal of work the sender never touched."
trigger_phrases:
  - "goal fallback bound"
  - "phase 11 goal fallback bound"
  - "packet goal fallback ancestor limit"
  - "stale ancestor packet goal on hop"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: goal-fallback-bound

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 14 |
| **Predecessor** | 010-goal-ending-carry |
| **Successor** | 012-wrapper-notice-log |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 011-goal-fallback-bound --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Close the research gaps of the relaunch hop dialog, goal and title fixes specification.

**Scope Boundary**: The no-goal-entry branch of `claudeGoalPacketResult` in `lib/relaunch-core.cjs`, one test in `tests/relaunch-core.test.cjs` and the Claude row of the goal table in the session-relaunch README. Claude Code only, and only a sender whose session log holds no goal entry.

**Dependencies**:
- Phase 2 built the fallback this phase bounds: the nearest unfinished packet goal for a sender that set no goal.
- Phase 10 adds the `goal_ended` carry in the same branch. This phase keeps its `claimedNoteEndedGoal` check ahead of the fallback unchanged.
- `packetLineage` and `firstUsablePacket` in `lib/relaunch-core.cjs` already return and filter the candidate folders. Both are reused unchanged.

**Deliverables**:
- The fallback considers the note's folder and its parent and no packet further up.
- One test that failed before the source edit.
- One README sentence that states the bound.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Claude sender whose session log holds no goal entry is started on the nearest unfinished packet goal above its note's spec folder. The search took every ancestor up to `specs`, and the only checks were a settable `goal.md` and an unticked criterion. Nothing ties a goal several levels up to the session beyond where the note sits, so a receiver could be started on the goal of work the sender never touched.

The 2026-11-13 research confirmed it. `packetLineage` walks every parent up to `specs`, and the fallback checks budget and an unticked box and never that the packet relates to the note. The research ranked the bound seventh and asked the operator whether a goal's ending is carried. The operator approved the amendment on 2026-11-14 as "Goal continuity" (research ranks 6 and 7, decision 4).

### Purpose
A receiver is started on a packet goal only when the goal sits in the note's folder or in its parent.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root. The first command reads the parent of the fix commit. The second is the red run saved in `scratch/red.txt`, taken with the new test present and the source edit absent.

```text
$ git show eba587cae7^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -n "firstUsablePacket\(lineage"
677:      packet: firstUsablePacket(lineage, roots, (candidate) => packetGoalIsSettable(candidate, roots)),
exit=0

$ env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='looks no further up|nearest unfinished packet goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
✔ resolveGoalPacket gives a Claude sender with no goal entry the nearest unfinished packet goal (10.268208ms)
✖ resolveGoalPacket looks no further up than the parent of the note folder (3.558167ms)
ℹ tests 2
ℹ pass 1
ℹ fail 1
  AssertionError [ERR_ASSERTION]: the only open goal is two levels up
  + actual - expected
  + 'specs/hooks/023-session-relaunch-loop'
  - ''
```

Before the fix the fallback passed the whole lineage to `firstUsablePacket`. With the only open goal two levels above the note's folder the resolver returned that goal, `specs/hooks/023-session-relaunch-loop`, where the test expects an empty string. The existing test of the fallback passed, because its open goal sits in the folder itself and in its parent.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Limit the no-goal-entry fallback in `claudeGoalPacketResult` to `lineage.slice(0, 2)`, the note's folder and its parent.
- Add the test `resolveGoalPacket looks no further up than the parent of the note folder`, written to fail first.
- State the bound in the Claude row of the goal table in the session-relaunch README.

### Out of Scope
- The active-goal path: it still takes the whole lineage plus the packets the goal text names, because there the goal's opening line must match the packet's `goal.md`, which already ties the packet to the session.
- A new relation check between the note and a packet, such as comparing file paths: the research named a bound and the operator approved the bound, and no check is added without a failing case.
- Pi, OpenCode, Codex, Cursor and Devin: their goal source is a record or nothing, not the Claude log.
- A live hop: the unit test stands in for it, as the known limitations record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | The no-goal-entry fallback takes `lineage.slice(0, 2)` with a comment on why the parent stays |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | One test that sets the only open goal two levels up |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The Claude row says "the spec folder first and then its parent and no packet further up" |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For a Claude sender with no goal entry, `resolveGoalPacket` returns no packet when the only open packet goal is two levels above the note's folder and returns the goal in the note's parent. The existing test of the fallback covers a goal in the note's folder. The test `resolveGoalPacket looks no further up than the parent of the note folder` fails before the edit and passes after. |
| REQ-002 | The path for an active goal is unchanged: it still takes `[...lineage, ...named]`. `rg -n 'lineage, \.\.\.named' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints line 692. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The relaunch and OpenCode plugin suites pass at the final state with one more test than before, 1548 against 1547. |
| REQ-004 | The Claude row of the session-relaunch README states that the fallback looks at the spec folder and then its parent and no packet further up. |
| REQ-005 | The commit adds no file, no module and no relaunch record key. `git show --stat eba587cae7` lists three files. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 2 tests with 1 pass and 1 fail before the edit, and `scratch/green.txt` shows 2 of 2 after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1548 of 1548, as the commit message and the parent goal log record.
- **SC-003**: `git show --stat eba587cae7` lists the README, `relaunch-core.cjs` and `relaunch-core.test.cjs` and no new file.
- **SC-004**: `validate.sh 011-goal-fallback-bound --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `packetLineage` returns the folder first and then each parent | A change in its order would make `slice(0, 2)` take the wrong two folders | The new test sets a goal in the folder, in its parent and two levels up, so a reorder fails it |
| Risk | A phase grandchild that works under a goal two levels up now gets no fallback | Low | The receiver waits for the operator to type a goal, which is what a sender with no goal entry got before phase 2. The bound is the operator-approved trade, so a goal the session never touched is not forced on it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The fallback reads at most two `goal.md` files where it read one per ancestor before. Not measured.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The value still passes through `firstUsablePacket` and `packetGoalIsSettable`, so the path and link checks on a written packet are unchanged.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A log that cannot be read or is read only in part still returns no packet, because the `whole` check sits ahead of the changed line.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a note with no spec folder gives a lineage of zero entries, so `slice(0, 2)` is empty and no packet is returned.
- Maximum input: a leaf phase folder two levels below the only open goal returns no packet, which is the row the new test fails on before the edit.
- Failure path: a log read only in part returns no packet, because the `whole` check at `relaunch-core.cjs:674` sits ahead of the changed line.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | One changed expression, one test and one README sentence |
| Risk | 5/25 | A wrong bound would start a receiver on the wrong goal or on none |
| Research | 3/20 | One research finding, confirmed in the code, and one operator decision |
| **Total** | **11/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a live Claude receiver start on no goal when the only open goal sits three folders up, and on the parent's goal when it sits one folder up? Not run. Decision: the unit test stands in for it.
- Is two the right bound for deeper phase trees? Not decided here. The operator approved the folder and its parent as "Goal continuity", and a deeper tree would need its own case and its own decision.
<!-- /ANCHOR:questions -->

---
