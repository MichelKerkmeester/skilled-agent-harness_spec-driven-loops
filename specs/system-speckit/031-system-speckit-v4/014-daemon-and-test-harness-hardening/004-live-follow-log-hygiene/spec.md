---
title: "Feature Specification: Phase 4: Live-Follow Log Hygiene"
description: "The live-follow daemon writes its divergence warning on every poll rather than on state change, and nothing rotates or caps the file. One transient divergence produced 126,088 lines across 12 MB."
trigger_phrases:
  - "live follow log hygiene"
  - "diverged warning spam"
  - "follower log rotation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening/004-live-follow-log-hygiene"
    last_updated_at: "2026-08-30T09:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec from an observed 12 MB follower log"
    next_safe_action: "Plan the state-change comparison and the cap policy"
    blockers: []
    key_files:
      - ".opencode/bin/git-live-follow.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-live-follow-log-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Cap by size, by line count, or by rotation count?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: Live-Follow Log Hygiene

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-test-hang-containment |
| **Successor** | None |
| **Handoff Criteria** | A sustained divergence produces one entry per state change, and the log cannot grow unbounded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Daemon Lifecycle and Test-Harness Hardening specification.

**Scope Boundary**: The follower's logging behaviour only. Its fast-forward safety contract is correct and stays untouched.

**Dependencies**:
- None.

**Deliverables**:
- Logging on state change rather than per poll
- A bound on log growth

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`git-live-follow.sh` emits its divergence warning as two unconditional `echo` statements inside the poll loop, which runs every 5 seconds by default. A single transient divergence — the local branch sitting one commit ahead of origin — therefore wrote the same two lines roughly every 5 seconds until the condition cleared, producing 126,088 lines and 12 MB in one checkout's log. Nothing in the script rotates, truncates, or caps that file.

The follower itself is healthy and its fast-forward-only safety contract is sound. This is purely a logging defect: the signal is correct but repeated at a rate that buries it.

### Purpose

Report each divergence once when it starts, and keep the log from growing without limit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Emit the divergence warning on state change rather than on every poll
- Cap or rotate the log file
- Apply the same treatment to any other per-poll emission in the loop

### Out of Scope
- The follower's fast-forward-only reconcile behaviour — correct as designed
- The divergence condition itself, which is an operator concern, not a script defect
- Followers in other repositories, beyond inheriting the same script

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/git-live-follow.sh` | Modify | Track last-reported state; emit on change; cap the log |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A sustained condition logs once, not once per poll | Hold a divergence across many intervals and count emitted lines |
| REQ-002 | The log cannot grow without bound | A long-running follower's log stays within the cap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A cleared and re-entered condition is reported again | Clear the divergence, reintroduce it, and see a second entry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A divergence held across many poll intervals produces one log entry
- **SC-002**: A follower running for days cannot produce a multi-megabyte log
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deduplication hides a genuinely recurring problem | Med | Re-report on transition, and include a repeat count when the state finally clears |
| Risk | Rotation loses evidence mid-investigation | Low | Keep at least one previous file rather than truncating in place |
| Dependency | The per-checkout pid lock | Low | Rotation must not disturb the lock or the single-follower guarantee |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Cap by size, by line count, or by keeping N rotated files?
- Should the repeat count be reported when the condition clears, so a long divergence is still visible as sustained rather than momentary?
<!-- /ANCHOR:questions -->

---
