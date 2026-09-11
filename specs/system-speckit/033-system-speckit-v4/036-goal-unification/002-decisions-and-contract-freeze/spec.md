---
title: "Feature Specification: Decisions and contract freeze"
description: "Freeze seven ADRs from the research synthesis: session-to-packet binding, legacy store fate, frontmatter-strip contract, resend and reminder mechanics, per-runtime matrix, durable budget and the reconciliation with goal isolation."
trigger_phrases:
  - "goal unification decisions"
  - "goal ADR freeze"
  - "session packet binding decision"
  - "goal store fate decision"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Decisions and contract freeze

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-goal-unification-research |
| **Successor** | 003-speckit-goal-contract |
| **Handoff Criteria** | See the parent Phase Handoff Criteria row for this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Goal unification: packet goal.md as the single goal surface across runtimes specification.

**Scope Boundary**: A `decision-record.md` where each of the seven decisions names the chosen option, the rejected option and the site that enforces it.

**Dependencies**:
- 001-goal-unification-research Complete

**Deliverables**:
- Eight ADRs in `decision-record.md`; ADR-8 decides where the goal posture lives: an `AGENTS.md` row, a repo rule under `repo-rules/`, or skill docs only, tested against the repo-rule contract (a rule that binds without a trigger is an `AGENTS.md` row; mechanics never go in a rule)
- An explicit amendment to the 009-goal-isolation decision record
- Parent goal resend if any decision wording changes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 003 through 007 each depend on a decision no single phase can make alone. Without a frozen record, the template phase and the hook phase will each guess the binding mechanism and disagree.

### Purpose
A `decision-record.md` where each of the seven decisions names the chosen option, the rejected option and the site that enforces it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Eight ADRs in `decision-record.md`; ADR-8 decides where the goal posture lives: an `AGENTS.md` row, a repo rule under `repo-rules/`, or skill docs only, tested against the repo-rule contract (a rule that binds without a trigger is an `AGENTS.md` row; mechanics never go in a rule)
- An explicit amendment to the 009-goal-isolation decision record
- Parent goal resend if any decision wording changes

### Out of Scope
- Any code or template change
- Re-running research; a gap is recorded as an open question, not filled by guessing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create | Seven ADRs |
| `../goal.md` | Modify | Decision wording amended if research changes it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each ADR names chosen option, rejected option, enforcement site and the synthesis citation | Seven entries with all four fields |
| REQ-002 | The 009-goal-isolation reconciliation is an explicit amendment, not a silent reversal | ADR-7 cites 009's decision record and states what changes |
| REQ-003 | ADR-8 names the home of the goal posture and the exact AGENTS.md wording, if any | ADR-8 quotes the proposed row and the quick-reference line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-00x | None beyond the P0 rows | n/a |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `decision-record.md` has eight ADRs, each with four fields filled from synthesis.md
- **SC-002**: Parent goal.md decisions D1-D7 match the ADRs word for word or the parent was resent
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Synthesis leaves a decision open | Downstream phases guess | Record it as an open question and escalate to the operator with two options |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the Claude Code memory goal files retire or stay as a mirror
<!-- /ANCHOR:questions -->

---


