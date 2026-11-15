---
title: "Feature Specification: Phase 28: goal-rebind-live-proof-and-docs"
description: "Unit tests cannot show that a real session carries its goal across a real hand-over. This phase runs a live hop with a goal on each runtime, proves the switch and the no-goal case with negative controls, adds the playbook scenarios and brings the docs and parent maps in line."
trigger_phrases:
  - "goal rebind live proof"
  - "phase 28 goal rebind live proof and docs"
  - "goal survives hand-over live test"
  - "goal persistence playbook"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 28: goal-rebind-live-proof-and-docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 29 |
| **Predecessor** | 027-goal-rebind-claude-and-codex |
| **Successor** | 029-relaunch-evidence-gaps-and-playbook-drift |
| **Handoff Criteria** | Every runtime with credentials has a live hop that shows the goal in the receiver, the controls show no goal, and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the session relaunch loop specification.

**Scope Boundary**: Live runs, the three relaunch playbooks, the goal docs, the feature catalog entry, and the parent maps. No new behavior is built here, and a defect a run finds is fixed test-first inside the owning phase.

**Dependencies**:
- Phases 025 to 027, which build the behavior.

**Deliverables**:
- A live hop record per runtime with the receiver goal status.
- A switch-off run and a no-goal run per runtime that show no goal.
- Playbook scenarios, doc updates and the parent map rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The goal-persistence work is only proven where a unit test can reach. A real hop crosses the wrapper, the killer, the claim and the receiver start, and the earlier phases showed that is where defects hide.

### Purpose
Each runtime with credentials shows, in a live hop, the sender goal in the receiver, and the switch and no-goal controls show none.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A live hop with an active goal on Claude, Codex, OpenCode and Pi, and on Devin, Cursor and Hermes where credentials and the entry point allow, with a SKIP and its reason otherwise.
- A control per runtime with `SESSION_RELAUNCH_GOAL=0` and one with a sender that had no goal.
- Playbook scenarios in the three relaunch playbooks and the goal playbooks for the new behavior.
- Doc updates in the session-relaunch README, the goal plugin doc, `/speckit:handoff` and the system-spec-kit feature catalog entry.
- The 023 parent map rows and handoff criteria for phases 24 to 29, and the 060 parent row for the goal phase.

### Out of Scope
- Fixing a defect a run finds inside this phase - it goes back to the owning phase as a failing-first test
- Committing, pushing or merging - the operator decides, and a push needs its own go-ahead

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md, session-relaunch-command-runtimes.md, session-relaunch-pi-opencode.md | Modify | Scenarios for the hop goal, the switch and the no-goal control |
| .skilled/hooks/session-relaunch/README.md, .skilled/hooks/goal/goal-plugin.md, .skilled/commands/speckit/handoff.md | Modify | Describe the behavior, the switch and what the live runs showed |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md | Modify | One section for the goal carry-over |
| specs/hooks/023-session-relaunch-loop/spec.md | Modify | Map row 28 |
| scratch/ in this folder | Create | The harness, live transcripts extracts and receiver status per runtime |

Follow-up, not edited here because the list above does not cover them: `.skilled/hooks/hook-flags.env.example`, `.skilled/hooks/README.md`, `.skilled/commands/doctor/assets/doctor-env.yaml` and `.skilled/hooks/session-relaunch/tests/README.md` still do not name `SESSION_RELAUNCH_GOAL`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On each runtime with credentials, a live hop with an active goal shows the same packet goal in the receiver, read from the receiver and not from the sender |
| REQ-002 | A hop with `SESSION_RELAUNCH_GOAL=0` and a hop whose sender had no goal each leave the receiver with no goal, on the same runtimes |
| REQ-003 | A runtime that cannot run live is recorded as SKIP with its reason, never as a pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The playbooks, READMEs, command doc and feature catalog entry describe the behavior and the switch |
| REQ-005 | Recursive strict validation passes for the 023 parent and the 060 parent |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live record per runtime exists, with a control that could have shown the opposite.
- **SC-002**: The relaunch gate and the goal suites still pass at their baselines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Credentials and quota for the runtimes | A runtime is skipped | Record SKIP and the reason, and keep its unit proof |
| Risk | A live run finds a defect | Med | Fix it test-first in the owning phase and rerun the live hop |
| Risk | A run leaves a goal or a process behind | Low | Each run clears its goal and its tmux session |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each live hop uses a low hop cap and a short task so a run ends in minutes.

### Security
- **NFR-S01**: No key is printed or asked for again, and `coder/.env` is never opened.
- **NFR-S02**: A bypass flag runs only after a fresh operator yes.

### Reliability
- **NFR-R01**: A failed run is recorded as it ran, not retried until it passes.
- **NFR-R02**: Evidence is read from the receiver, not inferred from the sender.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A goal slice at the 4,000-character limit: carried on Claude and Codex.
- A goal over the limit: not sent, with the reason, in a Claude run.

### Error Scenarios
- A runtime with no credentials: SKIP.
- A hop that never claims: recorded as a failed run, with the history lines.

### State Transitions
- A receiver that already had a goal: the goal is unchanged.
- A second hop in one run: the goal carries again from the new sender.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Seven runtimes, three playbooks, docs |
| Risk | 10/25 | Real CLIs, tmux and credentials |
| Research | 8/20 | Evidence design with controls |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Answered by the runs: Devin ran headless on the receiver half only, because no hop reaches it. Cursor and Hermes were skipped, Cursor for no login and Hermes for an HTTP 402.
- Open: the OpenCode 2 hop does not reach the receiver. Fix the killer's target in its owning phase and rerun, or waive the row under a new decision record.
<!-- /ANCHOR:questions -->

---
