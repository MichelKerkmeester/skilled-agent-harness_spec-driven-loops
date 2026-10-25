---
title: "Feature Specification: Phase 9: pi-arm-on-agent-settled"
description: "The Pi extension arms the prepared record on agent_end, and a continuation agent_start in Pi 1.4.0 can withdraw it a moment later. This phase moves the arm to agent_settled."
trigger_phrases:
  - "pi arm on agent settled"
  - "phase 9 pi arm on agent settled"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: pi-arm-on-agent-settled

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 (wave 1) |
| **Predecessor** | ../008-claim-error-per-state/spec.md |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the Pi vitest suite exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the research remediation packet, B4 in wave 1. It is independent of the other children. The build order is the wave order in `../spec.md`, not the folder order.

**Scope Boundary**: The Pi extension's arm event, its tests and the README lines that name Pi's arm event.

**Dependencies**:
- Pi 1.4.0 installed locally, which emits `agent_settled` to extensions.
- Phase 007 also edits `pi/session-relaunch.ts` and its test, in separate regions. Whichever of the two lands second rebases onto the first.

**Deliverables**:
- The arm and the killer restart run on `agent_settled`.
- Two failing-first Pi tests that pass after the change.
- A recorded decision, backed by a test, that the held nudge stays on `agent_end`.
- README lines naming `agent_settled` as Pi's arm event.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi extension arms the prepared record on `agent_end` (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts:526`) and withdraws an arm on `agent_start` (`:561`). The live Pi is 1.4.0 (`~/.pi/agent/install/current-version`), and there a continuation such as an auto-retry, a compaction or a queued follow-up emits a fresh `agent_start` after `agent_end`, which can withdraw a record armed a moment before. Pi 1.4.0 emits `agent_settled` once per `_startRun`, from its `finally` block (`dist/core/agent-session.js:1471` calling `_emitAgentSettled` at `:683-690`), after the continuation loop (`:1450-1462`) and also when the run errors. Its payload is `{ aborted }` (`dist/core/extensions/types.d.ts:801-805`), where `agent_end` carries `{ messages }`. The current `agent_end` handler ignores its event (`_event`, `session-relaunch.ts:526`), and `agent_settled` gets the same `ctx`. Research section 11a, lesson 4.

### Purpose
A prepared record armed in a Pi session stays armed until the killer acts, because the arm happens only once Pi has settled.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the arm and the killer restart for an unowned armed record from `agent_end` to `agent_settled`.
- Keep the held nudge on `agent_end`: a follow-up queued there becomes a continuation inside the same run (`agent-session.js:1562-1564`), so `agent_settled` fires only after the prepare turn it triggers. A test checks this.
- Sort every hit of `rg -n "'agent_end'" .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` (36 today) into "arm: add agent_settled" or "nudge: leave", update the arm ones, and add the failing-first tests.
- Rename the log event `agent-end-arm-error` to `agent-settled-arm-error` (`session-relaunch.ts:323`, asserted at `session-relaunch.test.ts:553,591`), because it fires from the `agent_settled` arm after the move and no other file reads it.
- Update the README lines about 138 and 223, the two that name Pi's arm event. Line about 126 describes the held nudge on `agent_end`, which stays, so it is not changed.

### Out of Scope
- Other runtimes - their arm events are not affected by Pi's continuation order.
- The withdraw helper - the `agent_start` withdrawal stays as it is; only the arm moves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | Declare `AgentSettledRegistrar`, register `agent_settled`, run `armRelaunch` there, rename the arm log event |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modify | Drive `agent_settled` in the arm tests and add the new tests |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Name `agent_settled` as Pi's arm event |
| `.pi/extensions/session-relaunch.ts` | None | A symlink to the extension, so it follows without an edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The extension arms on `agent_settled`, not `agent_end`. |
| REQ-002 | The killer-restart path for an unowned armed record runs on `agent_settled`. |
| REQ-003 | A continuation `agent_start` between `agent_end` and `agent_settled` leaves the record armed once settled. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The held nudge event is decided from the Pi 1.4.0 source and recorded. |
| REQ-005 | README names `agent_settled` as Pi's arm event. |
| REQ-006 | An `agent_settled` event with `aborted: true` does not arm the record. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001 (AC-001)**: **Given** a pending record, **When** the test fires `agent_end` alone, **Then** the record stays pending; **When** it fires `agent_settled`, **Then** it is armed. Verify: Pi test, red before.
- **SC-002 (AC-002)**: **Given** `agent_end`, a continuation `agent_start`, `agent_end`, `agent_settled`, **When** run, **Then** the record ends armed, not disarmed. Verify: Pi test.
- **SC-003 (AC-003)**: **Given** the full suite, **When** `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` runs, **Then** it exits 0. Verify: output.
- **SC-004 (AC-004)**: **Given** the README, **When** searched for Pi's arm event, **Then** it names `agent_settled` and no line names `agent_end` as the arm. Verify: grep.
- **SC-005 (AC-005)**: **Given** a live Pi 1.4.0 session through `skilled-loop` with `openai/gpt-6-luna`, **When** the 031 harness runs one hop, **Then** the record reaches `armed` and the receiver claims the note. Verify: the harness output under `scratch/pi-settled-live/`. This is a no-regression check, since a hop succeeds on either arm event; AC-002 is the proof of the change.
- **SC-006 (AC-006)**: **Given** a pending record, **When** the test fires `agent_settled` with `aborted: true`, **Then** the record stays pending. Verify: Pi test.
- **SC-007 (AC-007)**: **Given** a held nudge, **When** the test fires `agent_end` without `agent_settled`, **Then** the nudge is sent as a follow-up and the record stays pending. Verify: Pi test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi 1.4.0 `agent_settled` event | Without it the extension never arms | Confirmed in the installed 1.4.0 source (`agent-session.js:683-690`, `:1471`) |
| Risk | A Pi older than the event would never arm | Low | No version guard: the oldest Pi in the repository, 0.87.0 under `.pi/extensions/pi-cache-optimizer/node_modules`, also declares `agent_settled` (`types.d.ts:625,1001`) |
| Risk | `agent_settled` carries `aborted`; an aborted run should not arm | Med | The type at `types.d.ts:801-805` documents `aborted`; skip the arm when it is true and cover it in AC-006 |
| Risk | The ambient shim `.pi/types/pi-coding-agent.d.ts` declares only `before_agent_start` | Med | Declare a local `AgentSettledRegistrar`, as `agent_start` and `session_compact` do (`session-relaunch.ts:143-159`), and run `tsc -p tsconfig.pi.json`, since vitest does not type-check |
| Risk | Tests that drive `agent_end` silently stop testing the arm | Low | Every hit of the `rg` inventory is sorted into arm or nudge; the arm ones (364-1272) fire `agent_settled`, the nudge ones (188-311) stay |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `agent_settled` handler does no more work than the `agent_end` arm did: one config read, one module load and one arm.

### Security
- **NFR-S01**: The handler reads only the session id and the loop env it already reads, and writes nothing new.

### Reliability
- **NFR-R01**: The handler swallows its own errors, as every other Pi handler in the file does, so a failed arm never breaks the Pi session.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No session id: the handler returns without arming, as `agent_end` does today.
- No pending record: `armRelaunch` finds nothing to arm and returns.

### Error Scenarios
- Aborted run: `agent_settled` with `aborted: true` leaves the record pending.
- Killer spawn fails: the next `agent_settled` restarts a killer for the unowned armed record.

### State Transitions
- A continuation between `agent_end` and `agent_settled`: the `agent_start` finds nothing armed to withdraw, and the later settle arms.
- An operator turn after the settle: `agent_start` still withdraws the arm, unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One extension file, one test file, two README lines |
| Risk | 10/25 | The arm timing decides whether a hop happens at all |
| Research | 6/20 | Pi 1.4.0 event order already traced in the research |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The held nudge stays on `agent_end` (`agent-session.js:1562-1564`, checked by AC-007), and no version guard is needed (Pi 0.87.0 already declares `agent_settled`).
<!-- /ANCHOR:questions -->

---
