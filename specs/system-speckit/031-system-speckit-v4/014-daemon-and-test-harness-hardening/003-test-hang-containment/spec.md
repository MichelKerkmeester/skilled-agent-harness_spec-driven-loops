---
title: "Feature Specification: Phase 3: Test Hang Containment"
description: "Three vitest runs finished reporting and then held a core each at ~96% CPU for hours. Nothing bounds a test invocation's runtime and nothing makes a hung run name the handle retaining it."
trigger_phrases:
  - "test hang containment"
  - "vitest does not exit"
  - "hanging process reporter"
  - "test runtime bound"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening/003-test-hang-containment"
    last_updated_at: "2026-08-30T09:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec from three observed hangs"
    next_safe_action: "Reproduce a hang with the hanging-process reporter enabled"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/vitest.config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-test-hang-containment"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What is the actual retaining handle? Unproven; this phase is containment plus diagnosis."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: Test Hang Containment

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
| **Phase** | 3 of 4 |
| **Predecessor** | 002-orphan-daemon-reaping |
| **Successor** | 004-live-follow-log-hygiene |
| **Handoff Criteria** | A hung suite terminates within its bound and reports the retaining handle |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Daemon Lifecycle and Test-Harness Hardening specification.

**Scope Boundary**: Containment and diagnosis of hangs. Not fixing whichever test leaks the handle — that is follow-up work this phase makes possible.

**Dependencies**:
- None hard. Runs after 002 by sequence, not by requirement.

**Deliverables**:
- A runtime bound on test invocations
- Hang diagnosis that names the retaining handle

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

On 2026-08-30 three vitest trees were killed after 2h35m, 3h41m and 4h12m, each holding roughly 96% of a core. One had printed its complete summary — 29 failed, 107 passed, duration 167 seconds — and then never exited. Sustained CPU rather than an idle process points at a spin loop after teardown rather than a merely open handle, but the retaining handle is unproven.

Two of the three belonged to one session, which started a second run half an hour after the first hung and a third within seconds of the first being killed. Nothing bounds the runtime, so a 167-second suite stayed alive for four hours, and nothing makes the hang self-describing, so each occurrence needs a post-mortem.

### Purpose

Make a hung run die quickly and explain itself, so the underlying leak becomes diagnosable instead of expensive.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime bound on test invocations, sized well above the real suite duration
- Hang diagnosis that names the handle retaining the process
- A reproduction using a deliberately leaked handle

### Out of Scope
- Fixing the 56 failing tests — unrelated to the hang
- Identifying and fixing the specific leaking test — enabled by this phase, not done in it
- Changing test parallelism or isolation settings for performance reasons

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Test invocation scripts | Modify | Wrap runs in a runtime bound |
| `.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts` | Modify | Enable hang reporting so a stuck run names its handle |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A test invocation cannot outlive a defined bound | A deliberately hung run terminates at the bound rather than persisting |
| REQ-002 | A hung run names what retained it | The run's output identifies the retaining handle |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The bound does not fire on a healthy run | The full suite completes well inside the bound with margin recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A hung run ends within its bound instead of running for hours
- **SC-002**: The next hang produces a named handle without needing a process-level post-mortem
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The bound fires on a legitimately slow run | Med | Size it against a measured baseline with generous margin, and record that baseline |
| Risk | Hang reporting adds overhead to every run | Low | Enable on the reporter path only, or behind an env flag used by the bound wrapper |
| Dependency | A reproducible hang | Med | Use a deliberately leaked handle rather than waiting for the organic one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What actually retains the process? Unproven. Sustained CPU suggests a spin loop rather than an idle handle, which the standard hang reporter may not surface.
- Should the bound live in the invocation scripts, in the config, or both?
<!-- /ANCHOR:questions -->

---
