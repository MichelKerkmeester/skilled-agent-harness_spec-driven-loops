---
title: "Feature Specification: Phase 13: opencode-child-and-title"
description: "The OpenCode relaunch plugin drops every event of a sub-agent session, so a parent can arm and be relaunched while a backgrounded child is still busy. The same plugin never names the receiver session, so the launch name the record carries is lost on every OpenCode hop. Both changes rest on runtime behaviour that is not yet observed on OpenCode 2.2.7, so the phase settles each one live before any code changes."
trigger_phrases:
  - "opencode child and title"
  - "phase 13 opencode child and title"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: opencode-child-and-title

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
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 17 |
| **Predecessor** | 012-session-name-carry |
| **Successor** | 014-claude-stop-notice-and-crons |
| **Handoff Criteria** | Both live checks are recorded in `scratch/`, each change is either built test first or dropped with its evidence, every acceptance row is Met, Waived or Superseded, and `validate.sh 013-opencode-child-and-title --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: Ranks 7 and 10 of `../research/research.md` section 9, in `.opencode/plugins/session-relaunch.js` and its test file only. Every other runtime, the wrapper, the relaunch core and the OpenCode v2 bridge are out of scope.

**Dependencies**:
- Phase 012 decides how the launch name reaches the record and the receiver. This phase reads it from `SKILLED_LOOP_NAME`, the same variable `prepare` copies into the record (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:560`).
- OpenCode 2.2.7 is installed (`opencode --version` prints `opencode v2.2.7`) and a provider and model are available for one `opencode run -m <provider/model>` call.
- The plugin suite passes at baseline: 65 tests, 0 failures (Measured Behavior).

**Deliverables**:
- One event trace on OpenCode 2.2.7 that answers whether a parent emits `session.idle` while a backgrounded child is busy, and which child events reach the plugin.
- One live title call on OpenCode 2.2.7 that answers whether a session update sets a title, and whether the plugin's client can make it.
- For each of the two changes: a failing test, the source change and a passing run, or a dropped change with its evidence in `goal.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The plugin puts every sub-agent session in a skip set and returns before reading any later event for it (`.opencode/plugins/session-relaunch.js:335`, `:341`), and the parent arms at `session.idle` with no child check (`:418` to `:435`). If OpenCode emits the parent's idle while a backgrounded child still runs, the killer relaunches the runtime under that child. The plugin also detects the claim seed (`:407` to `:414`) but never names the session, and no code in the plugin calls `client.session` at all, so a hop loses the launch name on OpenCode.

### Purpose
A parent with a busy child does not arm until the child is done, and a receiver that claims a seed carries the launch name as its session title, each only where a live check on OpenCode 2.2.7 shows the change can work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n -F -e 'trackChildSession(sessionStates, childSessions, info.id);' -e 'childSessions.has(sessionID)) return;' -e "if (event.type === 'session.idle') {" -e 'const seedText = nudge.seedInstructions' .opencode/plugins/session-relaunch.js
335:            trackChildSession(sessionStates, childSessions, info.id);
341:        if (!nudge.validSessionId(sessionID) || childSessions.has(sessionID)) return;
407:          const seedText = nudge.seedInstructions({ prompt: part.text, sessionId: sessionID });
418:        if (event.type === 'session.idle') {
476:        if (!sessionID || childSessions.has(sessionID)) return;
$ rg -n -F -e 'client.session' -e '.update(' .opencode/plugins/session-relaunch.js; echo "rg-exit=$?"
rg-exit=1
$ node --test .opencode/plugins/tests/session-relaunch.test.cjs; echo "test-exit=$?"
ℹ tests 65
ℹ pass 65
ℹ fail 0
test-exit=0
```

Every child event returns at line 341, the idle arm at line 418 reads no child state, and the plugin makes no session client call.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Trace the plugin events on OpenCode 2.2.7 for a parent whose task sub-agent is moved to the background, and record whether the parent's `session.idle` fires while the child is busy.
- Make one live session update with a title on OpenCode 2.2.7, and record whether the title is set and whether the plugin's `ctx.client.session.update` exists on that runtime.
- If the trace confirms the gap, keep a busy state for child ids instead of dropping their status events, return early at the parent's idle arm while one of its children is busy, and run the deferred arm when the last busy child goes idle.
- If the live call confirms the title path, call `ctx.client.session.update` with `SKILLED_LOOP_NAME` once when the claim seed is detected, fail open on any error.
- Drop a change whose live check refutes it, and write the evidence in `goal.md` section 4.

### Out of Scope
- Every runtime other than OpenCode - the operator scoped this phase to the OpenCode plugin.
- Every part of `.opencode/plugins/lib/v2-bridge.js` other than one `session.update` method on its client. The live call of 2026-11-13 showed the title works on 2.2.7 and the bridged client had no `update`, so the operator amended the scope by that one method.
- How the name reaches the record or the environment - phase 012 owns it.
- Children created before the plugin loaded - the plugin cannot see their creation event.
- A name on the first launch - the change fires only at a claimed seed.
- `bin/session-relaunch.cjs`, `lib/relaunch-core.cjs`, `lib/killer.cjs` and `skilled-loop` - no change is planned in them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/session-relaunch.js` | Modify | Keep child busy state and defer the parent arm while a child is busy. Set the session title from `SKILLED_LOOP_NAME` at the claim seed. |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Modify | Add the failing tests for both changes and the guard cases. |
| `.opencode/plugins/lib/v2-bridge.js` | Modify | Scope amendment of 2026-11-13: one `update` method on the client's `session`, which passes a title to the native `ctx.session.update`. |
| `.opencode/plugins/tests/v2-bridge.test.cjs` | Modify | Scope amendment of 2026-11-13: the test for the bridged `session.update`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Before any code change, an event trace on OpenCode 2.2.7 records, for a parent whose task sub-agent is moved to the background, the ordered event types the plugin receives with their session id, any `parentID` and any status type. The trace answers yes or no to: does the parent's `session.idle` arrive while the child is busy, and does a child `session.created` or `session.updated` carry `parentID`. Saved as `scratch/trace-child-idle.jsonl` with a one-line verdict in `scratch/trace-child-idle.md`. |
| REQ-002 | Before any code change, one live call on OpenCode 2.2.7 sends a session update with a title and reads the session back. It also records `typeof ctx.client?.session?.update` as the plugin sees it on that runtime. Saved as `scratch/live-title.md` with the request, the response and the verdict. |
| REQ-003 | If REQ-001 answers yes, a parent `session.idle` does not arm while one of its children is busy. Test `a parent session.idle does not arm while its sub-agent is busy` in `.opencode/plugins/tests/session-relaunch.test.cjs` prepares a pending record for the parent, sends the child's creation with `parentID`, a child busy status, then the parent idle, and asserts the record is still `pending` and no killer spawned. Today the record arms. If REQ-001 answers no, this requirement is dropped with the trace as evidence. |
| REQ-004 | If REQ-003 holds, the deferred parent arm runs when its last busy child goes idle. Test `a deferred parent arm runs when its last busy sub-agent goes idle` in the same file follows REQ-003's sequence with a child idle status and asserts the record is `armed` and one killer spawned. Test `a parent with two sub-agents stays unarmed until both are idle` asserts the record stays `pending` while one of two children is busy. Today there is no deferred arm. |
| REQ-005 | If REQ-002 answers yes for both the title and the client method, the plugin calls `ctx.client.session.update` with `{ path: { id: sessionID }, body: { title: SKILLED_LOOP_NAME } }` once when the claim seed is detected. Test `the claim seed sets the session title to SKILLED_LOOP_NAME` in the same file stubs the client, sends a seed user message and part, and asserts one call with that shape. Today no call is made. If REQ-002 answers no for the title, this requirement is dropped with the call as evidence. If the title works but the plugin's client lacks `update`, the phase stops and asks. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Guards keep their assertions and pass. `a sub-agent session.idle never arms a pending record`, `a task sub-agent session never receives a nudge`, `a sub-agent never receives the claim seed`, every existing `session.idle` test and every other test in `.opencode/plugins/tests/session-relaunch.test.cjs` still pass. A new test `no title call without SKILLED_LOOP_NAME or a client update method` asserts no call and an intact seed in both cases, and `a rejected title call leaves the seed in place` asserts the seed text still reaches the system prompt. Both may pass at once, since they pin the fail-open path. |
| REQ-007 | The plugin suites and the v2 bridge suite pass after the change: `node --test .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`. |
| REQ-008 | Scope amendment of 2026-11-13. The bridge's client offers `session.update({ path: { id }, body: { title } })`, which calls the native `ctx.session.update` with the session id and the title and throws the bridge's usual error when the runtime has no such method. Test `client session update passes the title to the native session update` in `.opencode/plugins/tests/v2-bridge.test.cjs` fails before the method exists. One live seed on OpenCode 2.2.7 confirms the native call's argument shape, recorded in `scratch/live-title-bridge.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/trace-child-idle.md` and `scratch/live-title.md` each hold a yes or no verdict quoted from a recorded live run.
- **SC-002**: For each change, either `node --test --test-name-pattern '<test title>' .opencode/plugins/tests/session-relaunch.test.cjs` exits 1 before the edit and 0 after it, or `goal.md` section 4 records the drop with its evidence.
- **SC-003**: `node --test .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` after the last edit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 012 and `SKILLED_LOOP_NAME` | The record is deleted by `consume` before the receiver starts (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:735` to `:739`), so the plugin cannot read the name from it | Read the variable the wrapper exports (`.skilled/bin/skilled-loop:778`, `:785`). If phase 012 moves the name elsewhere, update the read before the build |
| Dependency | A provider and model for `opencode run -m <provider/model>` | A repository hook blocks a non-interactive run without `-m`, so the trace cannot start | Pass `-m` on every run in the trace task |
| Risk | A child stays busy forever, so the deferred parent never arms | Med | A user message still withdraws the hand-over, and the hop waits as it would for any busy session. The trace records whether a child idle arrives |
| Risk | On 2.2.7 a child's creation event carries no `parentID`, so no child is ever recognised | High | REQ-001 records it. If so, the child gate cannot work through this plugin alone and the change is dropped or the scope is raised with the operator |
| Risk | A title call throws or hangs inside the event handler | Med | Do not await it in the event path, catch every error, and pin it with the rejected-call test |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: the change adds one map lookup per idle event and at most one client call per claimed seed.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The title is the operator's own launch name. It is sent only to the local OpenCode server through the plugin client.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A failed or missing title call never stops the seed, the nudge or the arm. The handler keeps its fail-open `catch` (`.opencode/plugins/session-relaunch.js:465`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an unset or empty `SKILLED_LOOP_NAME` makes no title call, and a parent with no tracked child arms as today.
- Maximum input: the child busy map is capped at the existing `MAX_SESSIONS` of 1,000 (`.opencode/plugins/session-relaunch.js:27`), oldest first, like the child set.
- Failure path: a rejected title call is caught and logged, and the seed still reaches the system prompt.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One plugin file and its test file |
| Risk | 8/25 | The arm decides when a runtime is ended, and both changes rest on runtime behaviour |
| Research | 10/20 | Two live checks on OpenCode 2.2.7 come before any code |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does an OpenCode 2.2.7 parent emit `session.idle` while a backgrounded child is busy? REQ-001 settles it.
- Does a session update set a title on OpenCode 2.2.7, and does the plugin's client offer `session.update` there? REQ-002 settles it.
<!-- /ANCHOR:questions -->

---
