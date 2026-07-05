---
title: "Feature Specification: Phase 5: completion-supervisor [template:level_1/spec.md]"
description: "The goal supervisor now evaluates redacted evidence on session idle, maps strict verifier verdicts to durable state, and only marks goals complete on a met verdict."
trigger_phrases:
  - "goal supervisor"
  - "session idle"
  - "verifier verdict"
  - "completion source"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/005-completion-supervisor"
    last_updated_at: "2026-06-28T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented supervisor verdict handling for the goal plugin"
    next_safe_action: "Enable active continuation only after idle verifier behavior is stable"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-supervisor.test.cjs"
    session_dedup:
      fingerprint: "sha256:b98c419e9c328d206a7b01472b06611a344e9af57df05fd8998a9110fa29ab95"
      session_id: "goal-m2-supervisor-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Absent or ambiguous evidence defaults to not_met"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: completion-supervisor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `scaffold/005-completion-supervisor` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-lifecycle-tracking |
| **Successor** | 006-active-continuation |
| **Handoff Criteria** | Idle verifier maps `met`, `not_met`, and `blocked` safely and exposes redacted status evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase adds the automatic completion decision layer. It verifies evidence gathered by lifecycle tracking but does not submit continuation prompts.

**Scope Boundary**: Run supervisor verification on `session.idle` and update durable state. Active continuation remains deferred.

**Dependencies**:
- Lifecycle phase evidence capture.
- Existing goal store and status enum.

**Deliverables**:
- `maybeVerifyGoal(sessionID)` verifier path.
- Strict verdict normalization for `met`, `not_met`, and `blocked`.
- Manual vs supervisor completion source tracking.
- Redacted verifier fields in `mk_goal_status`.

**Changelog**:
- Supervisor behavior is implemented in the existing plugin and covered by node unit tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The plugin could store and track goals, but automatic completion still needed a verifier that did not trust assistant self-report. Without a strict verdict mapping, idle-time completion could mark goals done from weak or ambiguous evidence.

### Purpose
The goal plugin now treats supervisor evidence as the only automatic completion path and keeps manual completion distinguishable from supervisor completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `maybeVerifyGoal(sessionID)`.
- Run verification on `session.idle`.
- Complete only on `verdict: "met"`.
- Mark `blocked` verdicts as blocked without completing.
- Redact and cap stored verifier evidence.

### Out of Scope
- LLM prompt design for a production supervisor.
- Shell command execution or automatic objective-derived gates.
- Active continuation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Adds verifier normalization, idle verification, completion source, and status evidence fields. |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Create | Covers met, blocked, ambiguous, and absent-evidence verdict mapping. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default absent evidence to `not_met`. | The verifier is not called when no evidence exists and the goal remains active. |
| REQ-002 | Complete only on `met`. | A `met` verdict sets `status=complete` and `completionSource=supervisor`; other verdicts do not complete. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Preserve manual completion source. | `/goal complete` continues to set `completionSource=manual`. |
| REQ-004 | Redact verifier evidence. | Status output and stored evidence do not expose obvious token or secret patterns. |
| REQ-005 | Normalize ambiguous verifier output. | Unknown verdicts map to `not_met`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `session.idle` with `met` evidence completes the active goal.
- **SC-002**: `session.idle` with `blocked` evidence marks blocked but leaves `completionSource` unset.
- **SC-003**: Ambiguous or absent evidence leaves the goal active with `lastVerifierVerdict=not_met`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Verifier false positive. | A goal could complete too early. | Default to `not_met` unless the verifier returns strict `met`. |
| Risk | Evidence may include sensitive text. | Status output could leak secrets. | Cap evidence and redact common secret/token patterns before persistence and display. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Production supervisor prompt and model wiring remain for the active continuation phase.
<!-- /ANCHOR:questions -->
