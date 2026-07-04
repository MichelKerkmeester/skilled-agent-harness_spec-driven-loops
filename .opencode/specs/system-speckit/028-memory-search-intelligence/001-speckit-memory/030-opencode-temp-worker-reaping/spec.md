---
title: "Feature Specification: OpenCode Temp Worker Reaping and Vitest Runaway Prevention"
description: "OpenCode sessions that spawn parallel detached workers or MCP helpers leave orphan processes when the parent exits ungracefully. Vitest worker accumulation during long stress-test suites can exhaust system resources. This phase adds session-scoped process-tree cleanup and a runaway-worker guard for the test runner."
trigger_phrases:
  - "opencode temp worker reaping"
  - "session process cleanup"
  - "orphan worker reaping"
  - "vitest runaway prevention"
  - "mcp helper lifecycle"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/030-opencode-temp-worker-reaping"
    last_updated_at: "2026-07-04T17:51:05.616Z"
    last_updated_by: "drift-remediation"
    recent_action: "Replaced template scaffold with real spec content"
    next_safe_action: "Plan implementation or mark deferred"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "drift-remediation-030"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which OpenCode lifecycle hook (stop-hook vs session-cleanup.sh) should own the reap?"
      - "Should the Vitest runaway guard be a global config or per-suite opt-in?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 30: opencode-temp-worker-reaping

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Pending |
| **Created** | 2026-06-30 |
| **Branch** | `scaffold/030-opencode-temp-worker-reaping` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 30 |
| **Predecessor** | 029-substrate-sandbox-cleanup |
| **Successor** | None |
| **Handoff Criteria** | Spec approved; implementation not yet started |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the OpenCode temp worker reaping and Vitest runaway prevention specification.

**Scope Boundary**: Session-scoped process-tree cleanup for OpenCode parallel workers and MCP helpers, plus a Vitest runaway-worker guard for stress-test suites. No changes to the memory or code-graph subsystems.

**Dependencies**:
- OpenCode session lifecycle hooks (stop-hook, session-cleanup.sh)
- Existing orphan-sweep stop-hook mechanism (`SPECKIT_STOP_HOOK_ORPHAN_SWEEP`)

**Deliverables**:
- A session-scoped reaper that cleans up orphaned parallel detached workers and MCP helpers when the parent session exits ungracefully.
- A Vitest worker runaway guard that caps concurrent workers and reaps stale worker processes during long stress-test suites.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode sessions that spawn parallel detached workers or MCP helpers leave orphan processes when the parent exits ungracefully. The existing session-cleanup.sh resolves descendants from CLAUDE_SESSION_PID but has no fallback when the session PID is missing, so a shared-terminal scenario can leave workers alive. Vitest worker accumulation during long stress-test suites can exhaust system resources when stale workers are not reaped between iterations.

### Purpose
Add session-scoped process-tree cleanup that reliably reaps orphaned parallel workers and MCP helpers, and add a Vitest runaway-worker guard that caps concurrent workers and reaps stale processes during stress-test suites.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Session-scoped reaper for orphaned parallel detached workers and MCP helpers
- Vitest runaway-worker guard with concurrency cap and stale-worker reaping
- Integration with existing stop-hook and session-cleanup.sh lifecycle

### Out of Scope
- Changes to the memory or code-graph subsystems
- Changes to the MCP transport or protocol layer
- Changes to how OpenCode spawns workers (only their cleanup)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/session-cleanup.sh` | Modify | Add orphan-worker reaping fallback when session PID is missing |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/` | Modify | Add Vitest runaway-worker guard for stress-test suites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Session-scoped reaper must clean up orphaned parallel workers and MCP helpers | When a parent session exits ungracefully, the reaper kills all descendant processes; a shared-terminal scenario with a missing session PID does not leave workers alive |
| REQ-002 | Vitest runaway-worker guard must cap concurrent workers and reap stale processes | Stress-test suites do not accumulate workers beyond the configured cap; stale workers from previous iterations are reaped before new ones spawn |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Integration with existing lifecycle hooks | The reaper works alongside the existing orphan-sweep stop-hook without conflicts; session-cleanup.sh continues to function for the happy path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A parent session that exits ungracefully leaves no orphaned worker or MCP helper processes behind.
- **SC-002**: Stress-test suites with long iteration counts do not accumulate workers beyond the configured concurrency cap.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reaping a worker that a sibling session is still bridged to | High | Check worker liveness and socket bridgeability before reaping; adopt live workers instead of killing them |
| Dependency | session-cleanup.sh and orphan-sweep stop-hook | Med | Test both hooks together to confirm no double-reap or conflict |
| Risk | Vitest guard reaping a worker that is still producing test output | Low | Only reap workers that have been idle beyond the configured stale threshold |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which OpenCode lifecycle hook (stop-hook vs session-cleanup.sh) should own the reap?
- Should the Vitest runaway guard be a global config or per-suite opt-in?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

