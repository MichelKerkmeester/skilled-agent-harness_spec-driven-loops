---
title: "Feature Specification: Claude relaunch loop"
description: "Phase 001 builds the Claude path for a session relaunch loop at 80%. Auto-compaction stays unchanged and remains the fallback when a hop fails."
trigger_phrases:
  - "Claude relaunch loop"
  - "phase 001 Claude relaunch"
  - "session relaunch at 80 percent"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Claude relaunch loop

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 001 builds the Claude relaunch path around a runtime-neutral core and thin Claude adapters. It adds the wrapper and manual handoff command, tests the safety and state transitions, updates the phase documentation and proves a live hop.

**Key Decisions**: Use the 80% trigger and leave auto-compaction unchanged.

**Critical Dependencies**: Lane 1.0 and lane 1.1 evidence must be available for Gate S1 before lane 1.2 starts.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | worktrees/142-session-relaunch-loop |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-pi-opencode-adapters |
| **Handoff Criteria** | All ten AC seeds are Met, Gate PG passes and the phase docs have landed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 1 of the Session relaunch loop. Its objective is for a Claude session to hop through the loop at 80% while auto-compaction stays untouched as the fallback.

**Scope Boundary**: The phase covers lanes 1.0 to 1.8 and the Claude deliverables listed below.

**Dependencies**:
- Lane 1.0 and lane 1.1 evidence feed Gate S1.
- Gate S1 follows lanes 1.0 and 1.1 and precedes lane 1.2.
- Lane 1.2 writes tests before the lane 1.3 build.

**Deliverables**:
- A runtime-neutral Node core, context reader, CLI, killer and Claude wrapper arm.
- Claude adapters and hook registration rows.
- The /speckit:handoff command and runtime mirrors.
- Tests, documentation and a Claude live run.

<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Near the context limit, a Claude session needs a handoff note and a fresh session in the same terminal. The hook payload does not provide a context percentage, so Phase 001 must base its Claude context reader on captured transcript usage and hook data.

### Purpose
Build and verify the Claude relaunch path at the 80% threshold while keeping auto-compaction as the fallback when a hop fails.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm transcript usage, Stop registrations and compaction timing from lane 1.0.
- Capture PostToolUse and Stop input from a throwaway headless Claude run in lane 1.1.
- Write tests before building the core, CLI, context reader, Claude wrapper arm and killer.
- Build the core, CLI, killer, Claude adapters, wrapper arm and /speckit:handoff command.
- Run the named reviews, phase checks and the live Claude relaunch.
- Update the documentation listed in the plan.

### Out of Scope
- Automatic triggers or adapter work for Pi and OpenCode, which belong to phase 002.
- Codex, Cursor, Devin and Hermes triggers, which belong to phase 003.
- Changing autoCompactEnabled or autoCompactWindow.
- Adding wrapper resume flags.
- Commits, pushes or merges.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs, lib/context-usage.cjs and bin/session-relaunch.cjs | Create | State handling, usage reading and the model-facing CLI. |
| .skilled/hooks/session-relaunch/lib/killer.cjs and .skilled/bin/skilled-loop | Create | Safe idle-session termination and the Claude wrapper arm. |
| .skilled/hooks/session-relaunch/claude/, hook-registry.json and generated Claude settings rows | Create and modify | Claude nudge and Stop adapters with registry entries. |
| .skilled/commands/speckit/handoff.md and its runtime mirrors | Create | Manual handoff command and mirrors. |
| .skilled/hooks/session-relaunch/**/*.test.* and 001-claude-relaunch-loop/scratch/ | Create | Tests and spike evidence files. |
| ENV-REFERENCE.md, hook-flags.env.example, hooks README files, injection-contract.md and bin README | Modify | Document switches, hooks, injection and skilled-loop. |
| Feature-catalog and manual-testing-playbook entries and indexes | Create and modify | Describe the relaunch feature and Claude scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Record the Gate S1 answers for (a) to (d) in the implementation summary, including a nonblank compaction verdict. |
| REQ-002 | Record a red run of the new tests in the ledger before lane 1.3 starts. The run must exit nonzero with assertion failures, not syntax or import errors. |
| REQ-003 | Run node --test with explicit test files. The result must end with # fail 0 and each bullet in approved plan section 9 must map to at least one named test. |
| REQ-004 | Add a named killer test that proves SIGTERM reaches only descendants of the wrapper and only when SKILLED_LOOP_ID matches. |
| REQ-005 | Make sync-hook-registrations.cjs --check exit 0 with a baseline delta limited to Claude rows and pass hook-registration-sync.vitest.ts. |
| REQ-006 | Make the handoff command pass check_authored_name_kebab.py and validate_document.py --type command with exit 0. Keep mirror checks at baseline or better. |
| REQ-007 | Pass the section 10 gates and keep spec paths and ids out of new code comments. |
| REQ-008 | Create each phase document listed in Docs for 001 and pass its validator. |
| REQ-009 | Prove a live Claude relaunch using the procedure in the phase plan. |
| REQ-010 | Record a result for every Claude playbook scenario as pass, fail or not-run with the reason. |

### P1 - Required (complete OR user-approved deferral)

No additional P1 requirements are defined. Section 7 makes every acceptance-criteria seed necessary for phase Done.

> Acceptance criteria for these requirements live in acceptance-criteria.md, which decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Claude session hops through the loop at 80% while auto-compaction remains unchanged as the fallback.
- **SC-002**: All ten AC seeds are Met, Gate PG passes and the phase docs have landed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Lane 1.0 and lane 1.1 evidence for Gate S1 | Lane 1.2 starts only after the evidence is recorded. | Record all four S1 answers before tests begin. |
| Risk | The 80% trigger may not land before compaction. | H1 stops the 001 build. | Report the numbers and keep the 80% decision unchanged. |
| Risk | A signal may reach a PID outside the wrapper or the wrapper may act without SKILLED_LOOP_ID. | H9 stops the killer lane. | Require the named killer test before acceptance. |
| Risk | The live run may not be drivable even in tmux. | H10 prevents a C3 completion claim. | Record the command, observed evidence and exit state. |
| Risk | Duplicate Stop registrations exist in project and user settings. | A duplicate can start more than one killer. | Make stop-arm idempotent with a lock file. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The killer waits until transcript mtime stays stable for about 3 seconds before SIGTERM. It gives up after 30 seconds.

### Security
- **NFR-S01**: The killer signals only a runtime PID that descends from the wrapper, and only when SKILLED_LOOP_ID matches.

### Reliability
- **NFR-R01**: shouldRelaunch passes only when the relaunch file is armed, under 10 minutes old and below 10 hops.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or invalid handoff: prepare exits 2 with a reason when the note is invalid, belongs to another session or child processes are alive.
- Maximum length: The approved plan sets no maximum handoff length.

### Error Scenarios
- Hop failure: auto-compaction remains the fallback.
- Killer timeout: after 30 seconds the killer gives up, unarms the file and sends the manual command notification.

---

## 9. COMPLEXITY ASSESSMENT

The approved plan does not assign numeric complexity scores to phase 001.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | N/A | The plan does not score this dimension. |
| Risk | N/A | The plan does not score this dimension. |
| Research | N/A | The plan does not score this dimension. |
| Multi-Agent | N/A | The plan does not score this dimension. |
| Coordination | N/A | The plan does not score this dimension. |
| **Total** | **N/A** | **Level 3 packet, as declared in the scaffold.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | H1: the 80% trigger does not land before compaction. | Stops the 001 build. | Not quantified in the approved plan. | Halt and report the numbers. Do not change the threshold. |
| R-002 | H9: a signal reaches a non-descendant PID or the wrapper acts without SKILLED_LOOP_ID. | Stops the killer lane. | Not quantified in the approved plan. | Halt and report. |
| R-003 | H10: the live run cannot be driven even in tmux. | C3 is not proven. | Not quantified in the approved plan. | Record the command, evidence and exit state. |

---

## 11. USER STORIES

### US-001: Claude session relaunch (Priority: P0)

**As an** operator, **I want** a Claude session to hop at 80% with auto-compaction as the fallback, **so that** the loop can continue in the same terminal.

**Acceptance criteria:** REQ-001 to REQ-005 and REQ-009.

---

### US-002: Manual handoff (Priority: P1)

**As an** operator, **I want** the /speckit:handoff command to start a handoff, **so that** I can trigger the flow manually.

**Acceptance criteria:** REQ-006, REQ-008 and REQ-010.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- What are the PostToolUse and Stop payload shapes captured by the lane 1.1 spike?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent packet: ../spec.md
- Implementation plan: plan.md
- Task breakdown and verification checklist: tasks.md
- Closure criteria: acceptance-criteria.md
