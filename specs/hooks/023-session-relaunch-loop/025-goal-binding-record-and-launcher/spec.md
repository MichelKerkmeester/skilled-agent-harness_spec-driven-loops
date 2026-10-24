---
title: "Feature Specification: Phase 25: goal-binding-record-and-launcher"
description: "A hand-over note carries the spec folder but nothing says the sending session had a goal. This phase makes prepare and keep record the goal packet the sender was working under, makes claim and the launcher hand it to the receiver, and adds one switch that turns the whole thing off."
trigger_phrases:
  - "goal binding record launcher"
  - "phase 25 goal binding record and launcher"
  - "goal_packet handoff note field"
  - "SESSION_RELAUNCH_GOAL"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 25: goal-binding-record-and-launcher

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 29 |
| **Predecessor** | 024-goal-rebind-claude-codex-hermes-probes |
| **Successor** | 026-goal-rebind-shared-core-and-opencode |
| **Handoff Criteria** | A note records the sender goal packet, claim and the launcher pass it on, and the switch removes it, with the relaunch gate green in every environment |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the session relaunch loop specification.

**Scope Boundary**: The shared relaunch core, the relaunch CLI, the wrapper, the handoff command, their tests and the env and README docs. No runtime binds a goal here.

**Dependencies**:
- Phase 023, whose `hand-over` and claim paths this phase extends.
- Phase 024 is not required for this phase, and the two can run side by side.

**Deliverables**:
- An optional `goal_packet` note field written at prepare and keep.
- Claim output and the receiver launch carry the packet.
- The `SESSION_RELAUNCH_GOAL` switch and the env docs for it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hand-over note already carries `spec_folder`, but the receiver cannot tell whether the sending session had a goal, and whether that goal came from a packet other than the spec folder. A hop therefore drops the goal, and a receiver that tried to bind one from `spec_folder` alone would set a goal the sender never had.

### Purpose
The receiver is told which packet goal the sender was working under, or that there was none, through the note and the launcher.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read first whether `spec_folder` plus the presence of `goal.md` is enough. If it is, this phase adds no note field and only the launcher pass and the switch remain.
- An optional `goal_packet` frontmatter field, validated as a repo-relative directory that holds `goal.md`, the way `spec_folder` is validated.
- Per-runtime resolution at prepare and keep: the goal record under `.skilled/skills/.state/goal/` for OpenCode, Pi, Devin, Cursor and Hermes, the session log goal entries for Claude, and `spec_folder` with a `goal.md` for Codex.
- Claim prints the packet, and `skilled-loop` exports it to the receiver as `SESSION_RELAUNCH_GOAL_PACKET`.
- `SESSION_RELAUNCH_GOAL=0` drops the field from claim output and the launch environment.

### Out of Scope
- Binding the goal in any runtime - phases 26 and 27 do that
- Copying the goal text into the note - the text is read fresh from `goal.md`, so a copy goes stale
- Changing the note for sessions that never had a goal - the field stays empty and the receiver does nothing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | Modify | The field, its validation and the per-runtime resolver |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Modify | Write the field at prepare and keep, print it at claim |
| .skilled/bin/skilled-loop | Modify | Export the packet to the receiver and honor the switch |
| .skilled/commands/speckit/handoff.md | Modify | Name the new optional note field |
| .skilled/hooks/session-relaunch/tests/*.test.cjs | Modify | Failing-first tests for the field, the claim output, the launcher pass and the switch |
| .skilled/hooks/session-relaunch/README.md, .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md, .env.example | Modify | Describe the field and the switch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Prepare and keep write `goal_packet` when the sender goal packet can be resolved, and leave it empty when it cannot |
| REQ-002 | A `goal_packet` that is not a repo-relative directory holding `goal.md` is refused at prepare and keep, the way `spec_folder` is |
| REQ-003 | Claim prints the packet and the launcher exports it to the receiver, and `SESSION_RELAUNCH_GOAL=0` removes both |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A note written before this phase, with no `goal_packet`, still claims and hands over unchanged |
| REQ-005 | The README, the env reference, `.env.example` and `/speckit:handoff` describe the field and the switch |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The relaunch gate passes in every environment the 023 phase used, against a baseline taken first.
- **SC-002**: Every new test fails against the code before this phase, so each guards the change it names.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Claude session log keeps goal entries in a readable form | Claude resolves to `spec_folder` only | Re-read the log format before coding and fall back to `spec_folder` with a `goal.md` |
| Risk | The switch is a permanent option nobody else needs | Low | Keep it as the off ramp for an inferred-consent action, and drop it if the operator says so |
| Risk | The field widens the note contract for every runtime | Med | Optional, validated like `spec_folder`, and older notes read unchanged |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Resolving the packet reads one small record or one log tail and adds no network call.

### Security
- **NFR-S01**: The packet path is validated as repo-relative, and a path outside the repository is refused.
- **NFR-S02**: State files keep their `0o700` directory mode.

### Reliability
- **NFR-R01**: A resolver that finds nothing leaves the field empty and never fails a prepare.
- **NFR-R02**: The relaunch suite passes with the loop environment set and unset.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A sender with no goal: the field is empty and the receiver does nothing.
- A packet whose `goal.md` was deleted after prepare: claim prints nothing for it.

### Error Scenarios
- An unreadable goal record: the field stays empty and prepare succeeds.
- A `goal_packet` that escapes the repository: prepare exits non-zero with the reason.

### State Transitions
- A note from before this phase: no field, no change in behavior.
- A hop with `SESSION_RELAUNCH_GOAL=0`: the note still records nothing extra for the receiver to act on.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Core, CLI, wrapper and docs |
| Risk | 10/25 | Shared note contract across seven runtimes |
| Research | 8/20 | Claude log format to re-read |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is `spec_folder` with a `goal.md` enough on its own, which would drop the new field? The recommendation is to keep the field, because it also records that the sender had an active goal, and that is the only consent signal the receiver has.
- Does the operator want the switch? The recommendation is to keep it, because the receiver sets a goal without a keystroke.
<!-- /ANCHOR:questions -->

---
