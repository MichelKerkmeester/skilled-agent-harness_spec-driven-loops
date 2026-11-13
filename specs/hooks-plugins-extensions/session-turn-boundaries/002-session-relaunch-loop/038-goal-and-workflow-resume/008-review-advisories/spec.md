---
title: "Feature Specification: Phase 8: review-advisories"
description: "Nine P2 advisories from the 2026-11-13 deep review remain in the relaunch core, the Claude start claim, the nudge text and the OpenCode plugin. One can rewrite a note that is no longer open, one can forge a frontmatter line from a session id or a cwd, and one trusts any node-prefixed value as a command. The rest leave a wrong event name, a wrong reason, a stale packet variable and an unpinned record path."
trigger_phrases:
  - "review advisories"
  - "phase 8 review advisories"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: review-advisories

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/358-handover-goal-resume` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-goal-handover-docs |
| **Successor** | None |
| **Handoff Criteria** | Phase 008 is Complete, every acceptance row is Met, and `validate.sh 008-review-advisories --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: The nine P2 advisories of the 2026-11-13 deep review, built as four work packages in the order A, B, C and D. Each package owns its own files, and the nine paths in the Files to Change table are the whole change. No record format change, no new module and no other document.

**Dependencies**:
- Phase 007 is Complete, so the seven prior children are closed and the tree is the one the review examined.
- The four test files in `REQ-010` pass before the first edit.
- `node:test` and `rg` are available.

**Deliverables**:
- A start claim that names `SessionStart` from the caller, with no payload inference on that path.
- A note writer that refuses a note whose status is not `open`.
- An empty Claude goal that reports the empty-text reason, not a missing packet.
- Handoff text that strips control characters from the session id and the cwd.
- A command prefix that quotes any unsafe `node ` value.
- A hop verdict that matches `prepare` for an invalid hop count.
- An OpenCode packet variable that is deleted in `finally`.
- A contract test between the plugin record path and the core reader.
- One README sentence that names both uses of `SessionStart`.
- A guard run that shows the named existing tests kept their assertions.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Claude start claim can report `PostToolUse` when a startup payload carries no `hook_event_name`. `recordGoalPacket` rewrites a note that is not `open`, an active goal with no text is reported as a missing packet, and the nudge prints the session id and the cwd raw, trusts any `node ` value as a command and disagrees with `prepare` on an invalid hop count. The OpenCode packet variable survives a throwing bind, the plugin and the core build the same record path in two places with no test between them, and the README omits the startup use of `SessionStart`.

### Purpose
Every advisory gets a test that fails before its fix and passes after it, while the named guard tests keep their assertions and the relaunch record format stays the same.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
rg -n -o --sort path -F -e "payloadEventName(payload, { runtime: 'claude' })" -e "function recordGoalPacket" -e "the active goal names no packet this hand-over can find" -e 'session_id: ${sessionValue}' -e 'cwd: ${cwd}' -e 'if (/^node\s/.test(cliPath)) return cliPath;' -e 'const hops = switchNumber(env?.SKILLED_LOOP_HOPS, 0, { integer: true });' -e 'await bindRelaunchGoal(sessionID' -e 'delete process.env[RELAUNCH_GOAL_PACKET_ENV];' -e 'after a compaction, `SessionStart`' .skilled/hooks/session-relaunch/claude/compact-pointer.mjs .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/lib/nudge.cjs .opencode/plugins/opencode-goal.js .skilled/hooks/session-relaunch/README.md
.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:153:payloadEventName(payload, { runtime: 'claude' })
.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:213:payloadEventName(payload, { runtime: 'claude' })
.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:218:payloadEventName(payload, { runtime: 'claude' })
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:647:the active goal names no packet this hand-over can find
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:892:function recordGoalPacket
.skilled/hooks/session-relaunch/lib/nudge.cjs:66:if (/^node\s/.test(cliPath)) return cliPath;
.skilled/hooks/session-relaunch/lib/nudge.cjs:154:session_id: ${sessionValue}
.skilled/hooks/session-relaunch/lib/nudge.cjs:157:cwd: ${cwd}
.skilled/hooks/session-relaunch/lib/nudge.cjs:464:const hops = switchNumber(env?.SKILLED_LOOP_HOPS, 0, { integer: true });
.opencode/plugins/opencode-goal.js:3597:await bindRelaunchGoal(sessionID
.opencode/plugins/opencode-goal.js:3599:delete process.env[RELAUNCH_GOAL_PACKET_ENV];
.skilled/hooks/session-relaunch/README.md:19:after a compaction, `SessionStart`
```

The start claim uses the same payload inference as the compaction emit. `recordGoalPacket` has no status read, the empty-goal path falls through to the missing-packet reason, and the note template prints both values raw. `commandPrefix` returns any `node ` value unchanged, and `hopLimitReached` reads an invalid count as zero hops. The OpenCode bind is awaited with no `try` around the delete, and README line 19 names one use of `SessionStart`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Emit the literal `SessionStart` from `claimAfterGoalStart` in `claude/compact-pointer.mjs`.
- Return `false` without a write from `recordGoalPacket` when `frontmatter.status` is not `open`.
- Return the empty-text reason from `claudeGoalPacketResult` before the candidate and headline searches.
- Strip every C0 control character and DEL from the session id and the cwd before `handoffText` prints them.
- Keep a `node ` value unchanged only when it is `node`, one run of spaces and one safe argument.
- Treat a set, non-empty and invalid `SKILLED_LOOP_HOPS` as the limit reached in `hopLimitReached`.
- Put the OpenCode bind in `try` and the packet variable delete in `finally`.
- Add the plugin-to-core contract test for the OpenCode record path.
- Rewrite one README sentence so `SessionStart` names both uses.
- Keep the named guard tests in `REQ-010` passing with their assertions.

### Out of Scope
- `payloadEventName` and the compaction emit - the finding keeps both unchanged.
- `bin/session-relaunch.cjs` and its hop parser - the finding keeps both unchanged.
- A merged hop parser - the finding rules it out.
- A source change to the OpenCode record path - the finding fixes this gap with a test only.
- The cleared Claude goal, the shared goal off switch and the resend reminder - decision D4 rules them out.
- The relaunch record format and a new module - decision D3 keeps both unchanged.
- Any file outside the nine in the Files to Change table - decision D1 gives every file one package.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modify | Emit the start claim under `SessionStart`. |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Add the start-claim event test and keep the pointer guards. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Guard the note status and name the empty goal reason. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the claimed-note and empty-goal tests. |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | Strip control characters, quote an unsafe command and read an invalid hop count. |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | Add the three nudge tests. |
| `.opencode/plugins/opencode-goal.js` | Modify | Delete the packet variable in `finally`. |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modify | Add the throwing-bind and record-path tests. |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Name both uses of `SessionStart` on line 19. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `claude/compact-pointer.mjs` emits a start claim under the literal `SessionStart`. `claimAfterGoalStart` stops calling `payloadEventName`. Test `compact-pointer names the SessionStart event on a start claim with no hook event` in `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` sends a payload with `source: "startup"` and no `hook_event_name` and asserts the emitted claim carries `hookEventName: "SessionStart"`. Today the claim carries `PostToolUse`. |
| REQ-002 | `lib/relaunch-core.cjs` leaves a note whose `frontmatter.status` is not `open` untouched. Inside the append lock, `recordGoalPacket` returns `false` before the write. Test `recordGoalPacket leaves a note that is not open untouched` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` builds a note with `status: claimed`, calls `recordGoalPacket` with a packet, and asserts the return is `false` and the file bytes are unchanged. Today the call rewrites the note. |
| REQ-003 | `lib/relaunch-core.cjs` returns the empty-text reason for a Claude goal whose condition is empty. When the active goal entry has no text, `resolveGoalPacketResult` returns `{ packet: '', reason: 'the active goal has no text to match a packet by' }` before the candidate and headline searches. Test `an active goal with no text names the empty goal, not a missing packet` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` writes a Claude goal log with an empty condition and asserts that packet and reason. Today the reason reads `the active goal names no packet this hand-over can find`. |
| REQ-004 | `lib/nudge.cjs` keeps a line break out of the note template. `handoffText` removes every C0 control character and DEL from the session id and the cwd before it prints them. Test `handoff text strips control characters from the session id and the cwd` in `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` passes a `sessionId` and a `cwd` that each contain a line break, and asserts exactly one `session_id:` line, exactly one `cwd:` line and no frontmatter line that starts with text taken from after the break. Today both values print raw. |
| REQ-005 | `lib/nudge.cjs` prints a `node ` value unchanged only when it is `node`, one run of spaces and one safe argument. A safe argument is a single-quoted string with no quote inside, or a run of letters, digits and `_ / . @ : + -`. Every other value is quoted as one path. Test `commandPrefix quotes a node command that carries more than one argument` in `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` asserts `commandPrefix('node /x/cli.js; echo hi')` is `node 'node /x/cli.js; echo hi'`. Today the value returns unquoted. |
| REQ-006 | `lib/nudge.cjs` treats a set, non-empty and invalid `SKILLED_LOOP_HOPS` as the limit reached. Test `hopLimitReached treats an unusable hop count as the limit reached` in `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` asserts `hopLimitReached({ SKILLED_LOOP_HOPS: 'abc' })` is `true`. Today it is `false`, so the nudge asks for a handoff that `prepare` refuses. |
| REQ-007 | `.opencode/plugins/opencode-goal.js` deletes `SESSION_RELAUNCH_GOAL_PACKET` even when the bind throws. The `session.created` branch puts `await bindRelaunchGoal(...)` in `try` and the delete in `finally`, and the error still propagates. Test `a throwing hand-over bind still deletes the packet variable` in `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` makes the bind throw, asserts the variable is `undefined` afterwards and asserts the event rejects. Today the delete is skipped. |
| REQ-008 | `.opencode/plugins/opencode-goal.js` and `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` agree on the OpenCode record path. Test `the plugin record path is the one the relaunch core reads` in `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` binds a goal through the plugin for one session id, calls `resolveGoalPacketResult` with `runtime: 'opencode'` and the same session id, and asserts the bound packet comes back. The test may pass at once because it is a contract, not a fix. |
| REQ-009 | `.skilled/hooks/session-relaunch/README.md` line 19 names both uses of `SessionStart`. The one sentence says Claude Code uses it after a compaction and at startup for the claim of a hop whose start prompt is the goal command. No other README line changes. `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` prints one line on line 19 after the edit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | The named guard tests keep their assertions and pass. In `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`, `compact-pointer delivers the start claim with the Claude enable switch off` and `compact-pointer delivers the claim at the start of a goal-command receiver` still assert a start claim when `hook_event_name` is `SessionStart`, and `compact-pointer points a compacted session at its open note and resets the nudge level` still asserts the pointer. In `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`, `recordGoalPacket writes, replaces and removes the field and skips an unchanged note` still writes an open note and returns `true`, `the resolver result carries the packet and the reason together` still asserts the zero-match reason, and `finds a goal headline outside the packet lineage` still asserts one unique match and an empty packet for several. In `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`, `commandPrefix(nudge.CLI_COMMAND)` still returns `nudge.CLI_COMMAND`, a plain path still prints as `node '<path>'`, `hopLimitReached` with an unset or empty `SKILLED_LOOP_HOPS` still returns `false` below the cap, and every existing `handoffText` test still passes. In `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`, every existing test still passes, including `the hand-over packet variable is deleted after the one bind attempt`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'names the SessionStart event on a start claim' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, and the two start-claim guard tests still pass.
- **SC-002**: `node --test --test-name-pattern 'recordGoalPacket leaves a note that is not open|active goal with no text' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`, and the open-note guard still passes.
- **SC-003**: `node --test --test-name-pattern 'strips control characters|quotes a node command|unusable hop count' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`, and the hop and handoff guards still pass.
- **SC-004**: `node --test --test-name-pattern 'throwing hand-over bind|plugin record path' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`, and every existing lifecycle test still passes.
- **SC-005**: `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` prints one line on line 19, and `validate.sh 008-review-advisories --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007 Complete | The tree would not hold the shipped goal hand-over wording the review examined | Check the phase map before the first build dispatch |
| Dependency | The four test files pass at baseline | A new failure could be mistaken for the red run of this phase | Run all four files before the first test edit and record the count |
| Risk | A caller relies on `commandPrefix` returning an unsafe value unquoted | High | Every current caller passes a constant, and the guard test pins the constant and the plain path |
| Risk | The status guard blocks a legitimate rewrite of a claimed note | Medium | The caller records only while the note is open, and the open-note guard pins that path |
| Risk | An invalid hop count silences a nudge the wrapper would accept | Medium | Only a set, non-empty and invalid value counts, and unset or empty stays `false` |
| Risk | A test passes for the wrong reason | High | Record the failing run in `scratch/red.txt` and the passing run in `scratch/green.txt` for each package |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: the changes add one status check, one early return, two string sanitizers, one regex test and one `try` block.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The nudge removes every C0 control character and DEL from the session id and the cwd, so a model-facing frontmatter value cannot gain a line.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: The OpenCode packet variable is unset on both the success and the failure path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an unset or empty `SKILLED_LOOP_HOPS` returns `false` below the cap, and an empty goal condition returns the empty-text reason.
- Maximum input: a long session id or cwd with many control characters loses them all before the frontmatter print.
- Failure path: a throwing OpenCode bind unsets the packet variable and still rejects the event.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Nine files across four packages, with no new module |
| Risk | 6/25 | Model-facing text and command construction change, and no record format changes |
| Research | 4/20 | The finding is verified and names every test |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
