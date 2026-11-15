---
title: "Feature Specification: Phase 26: goal-rebind-shared-core-and-opencode"
description: "Pi, Devin, Cursor and Hermes share one goal core and OpenCode has its own plugin, and none binds a goal when a hop starts. This phase lets each bind the packet named by the hand-over when the receiver has no goal of its own."
trigger_phrases:
  - "goal rebind shared core opencode"
  - "phase 26 goal rebind shared core and opencode"
  - "bind goal after hand-over"
  - "bind if unbound goal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 26: goal-rebind-shared-core-and-opencode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 29 |
| **Predecessor** | 025-goal-binding-record-and-launcher |
| **Successor** | 027-goal-rebind-claude-and-codex |
| **Handoff Criteria** | Each of the five receivers binds the packet once, never overwrites a goal, and does nothing without the packet, with the goal suites green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the session relaunch loop specification.

**Scope Boundary**: The shared goal core and its Pi, Devin, Cursor and Hermes callers, the OpenCode goal plugin, and their tests. Claude and Codex are phase 27.

**Dependencies**:
- Phase 025, which hands `SESSION_RELAUNCH_GOAL_PACKET` to the receiver.
- Phase 024 probe D, which says whether Hermes needs code beyond the shared core.

**Deliverables**:
- One bind-if-unbound step in the shared core and a call in each of the four adapters.
- The same step in the OpenCode plugin.
- Failing-first tests for each runtime.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A goal record is keyed by the session id, and a hop creates a new session, so the Pi, Devin, Cursor, Hermes and OpenCode receivers start with no record. Each of them already injects the goal from `goal.md` once a session is bound to a packet, so the missing piece is only the bind at the first turn.

### Purpose
A hop receiver that was told a goal packet and has no goal of its own is bound to that packet and injects it as any bound session does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One function beside the existing bind in the shared core that binds the packet only when the session has no record, and never overwrites one.
- A call at the first turn in the Pi, Devin and Cursor adapters and in the Hermes plugin, reading `SESSION_RELAUNCH_GOAL_PACKET`.
- The same behavior at session start in the OpenCode plugin, through its own binding path.
- No goal text is sent. Each runtime injects from `goal.md` as it does for a bound packet.
- Failing-first tests per runtime, and a check that the no-budget-stop guard test still passes.

### Out of Scope
- Claude and Codex - their goal is a command or a model tool and not a record, which is phase 27
- A new option or subcommand on `goal.cjs` - the existing bind covers the call
- Any change to when a goal ends - a goal still ends only on completion, a pause, a clear or a provider quota

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/goal/lib/goal-core.cjs and goal-core.test.cjs | Modify | One bind-if-unbound function and its tests |
| .skilled/hooks/goal/pi/goal-context.ts and goal-pi.test.mjs | Modify | Call it on the first turn |
| .skilled/hooks/goal/devin/goal-inject.mjs and goal-devin.test.mjs | Modify | Call it on the first turn |
| .skilled/hooks/goal/cursor/goal-inject.mjs and goal-cursor.test.mjs | Modify | Call it on the first turn |
| .hermes/plugins/repo-guards/__init__.py and tests/test_repo_guards.py | Unchanged | Probe D says the export is enough, so no call was added (see section 10) |
| .opencode/plugins/opencode-goal.js and .opencode/plugins/tests/opencode-goal-*.test.cjs | Modify | Bind at session start without a record |
| .skilled/hooks/goal/goal-plugin.md and README.md | Modify | Describe the hop bind and its limits |
| .opencode/plugins/tests/opencode-goal-handover.test.cjs | Create | The OpenCode hand-over cases, kept apart so the lifecycle suite stays focused |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md | Modify | Its stated suite count (155/155 across eight files) went stale with the new test file and now reads 164/164 across nine |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A receiver started with a goal packet and no goal record binds that packet on its first turn, on Pi, Devin, Cursor, Hermes and OpenCode |
| REQ-002 | A receiver that already has a goal record keeps it, and a bind never overwrites one |
| REQ-003 | A receiver started without the packet behaves exactly as before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The no-budget-stop guard test and every existing goal suite still pass |
| REQ-005 | The plugin and hook docs say when a hop binds and when it does not |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The OpenCode goal suites and the shared hook suites pass against baselines recorded first.
- **SC-002**: Every new test fails against the code before this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 025 exports the packet to the receiver | Nothing to bind | Tests set the variable directly, and the live proof is phase 28 |
| Risk | The shared core change reaches four runtimes at once | Med | One function, called only when the variable is set, with a test per caller |
| Risk | A bind sets a goal the operator did not want | Med | Only when the sender had one, and `SESSION_RELAUNCH_GOAL=0` stops the export |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The bind reads one record file at the first turn and adds no network call.

### Security
- **NFR-S01**: The packet path is re-validated as repo-relative before it is bound.
- **NFR-S02**: State files keep their `0o700` directory mode.

### Reliability
- **NFR-R01**: A failed bind logs and the session starts anyway.
- **NFR-R02**: A bind is idempotent, so a second turn changes nothing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A packet whose `goal.md` is missing: nothing is bound and the session starts.
- An empty variable: treated as not set.

### Error Scenarios
- An unreadable record: the bind is skipped and logged.
- A packet outside the repository: refused and logged.

### State Transitions
- A paused or completed goal already in the record: kept, not replaced.
- A second session with the same packet: binds its own record.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Core plus five callers and tests |
| Risk | 10/25 | Shared core touches four runtimes |
| Research | 6/20 | Existing bind path |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Resolved: does Hermes need code?** No. Probe D showed that exporting `HERMES_SPEC_FOLDER` makes the existing plugin bind that packet to a session with no goal, so the Hermes call and its test dropped out of this phase. This differs from the plan's default of giving Hermes a call, and the evidence won. **Follow-up, outside this phase's file list:** `.skilled/bin/skilled-loop` does not export `HERMES_SPEC_FOLDER` for a Hermes receiver, so a real hop to Hermes binds nothing until it exports the hand-over packet under that name (and only when `SESSION_RELAUNCH_GOAL` is not off).
- **Resolved (operator default): does the receiver ask before binding?** No. The receiver binds without asking, and `SESSION_RELAUNCH_GOAL=0` is the off switch, read from the environment or `hook-flags.env`.
- **Resolved: what counts as "no goal of its own"?** A live record of any status, an archived record (a goal that was cleared or completed leaves one and the live record is gone, so the record alone would let a hop hand the session a second goal) and a record that cannot be read. This reads the plan's "no record" as "no goal now or before in this session".
- **Resolved: when does OpenCode bind?** At `session.created`, for the first top-level session of the plugin instance only. A child session or a later session in the same process never binds.
<!-- /ANCHOR:questions -->

---
