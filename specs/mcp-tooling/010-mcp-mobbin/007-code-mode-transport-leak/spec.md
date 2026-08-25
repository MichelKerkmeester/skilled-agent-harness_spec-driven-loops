---
title: "Feature Specification: Release Code Mode transports so remote MCP children stop accumulating"
description: "The Code Mode server opened a child process per registered manual and never closed them, so idle transports persisted for the session and survived its exit. Orphans piled up across sessions until concurrent instances of the same remote transport fought over shared OAuth state and looped a browser prompt."
trigger_phrases:
  - "mobbin browser window keeps opening"
  - "mcp-remote orphan processes"
  - "code mode transport leak"
  - "repeated oauth prompt mcp"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/007-code-mode-transport-leak"
    last_updated_at: "2026-08-25T06:54:48Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored spec for the Code Mode transport release fix"
    next_safe_action: "Operator reviews the working-tree changes, then commits"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/mcp-server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Release Code Mode transports so remote MCP children stop accumulating

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-25 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-live-verification-capture |
| **Successor** | none |
| **Handoff Criteria** | The Code Mode server holds no idle transport child at steady state and leaves none behind on exit, both proven against a pre-fix control |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Mobbin transport specification — a defect fix in the Code Mode server that hosts this transport, rather than a change to the transport itself.

**Scope Boundary**: transport lifecycle in the Code Mode server entry point. No change to the Mobbin skill, the manual definitions, or any tool surface.

**Dependencies**:
- Phase 3, which added the `mobbin` manual to the shared Code Mode configuration and so put this transport on the affected path.

**Deliverables**:
- Idle transports released after tool discovery, and all transports released before process exit.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A browser verification window for Mobbin reopened every few minutes with no user action.

The Code Mode server registers every manual in the shared configuration at startup. All thirteen are stdio MCP manuals, so registration spawns thirteen child processes purely to read each manual's tool list, then keeps every one of them resident for the whole session even though a session typically calls none of them.

Those children also outlived the server. Its shutdown path exited the process directly without closing the client, so each child was left running and reparented to the init process. Twenty-one such orphans were observed, the oldest three days old.

Thirteen concurrent processes for the same remote endpoint then contended over one shared credential store. Each instance independently decided it needed authorization, so each opened a browser window. The observed cadence was one authorization attempt every two to five minutes.

The trigger is generic — any remote transport reached through a browser-based authorization would behave the same way — but Mobbin surfaced it because it accumulated the most instances.

### Purpose
Hold a transport open only while it is actually needed, and release every transport before exit, so children cannot accumulate across sessions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Release idle transports after startup tool discovery.
- Release all transports before the process exits.

### Out of Scope
- The vendored client SDK and its protocol plugins, which already expose the teardown entry point this fix calls.
- The manual definitions in the shared Code Mode configuration; the roster is unchanged.
- The Mobbin skill and its tool surface.
- Reaping the orphans that already existed, which was a one-time operator action rather than a code change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-code-mode/mcp-server/index.ts` | Modify | Release idle transports after discovery and all transports on shutdown |
| `.opencode/skills/mcp-code-mode/mcp-server/dist/` | Rebuild | Local build output the runtime loads; ignored by version control, so each checkout must rebuild to pick the fix up |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No transport survives exit | After the server exits, none of the children it spawned are still running; the same check fails against the pre-fix build |
| REQ-002 | No idle transport at rest | After startup settles, the server holds no transport child |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Discovery survives release | Every tool remains searchable after idle release, and a call reopens its transport transparently |
| REQ-004 | Exit is never blocked | Releasing transports is time-bounded, so an unresponsive transport delays exit rather than preventing it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A shutdown leak probe reports zero surviving children on the fixed build and a surviving child on the pre-fix build.
- **SC-002**: Steady-state transport children after startup is zero.
- **SC-003**: A tool call still succeeds after transports are released.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Releasing the client also clears stored authorization for direct HTTP manuals | A manual authenticated at startup could need reauthorization on first call | Audited the roster: all thirteen manuals are stdio, none declares auth, so the HTTP path is inert here |
| Risk | First call after release pays transport startup cost | A slower first call per manual | Accepted; a session calls few manuals, and the previous behavior paid that cost for all thirteen every session |
| Risk | A hung transport stalls shutdown | Exit could block | Release is bounded and falls through to exit on timeout |
| Dependency | The client exposes a teardown entry point that cascades into each protocol | Correct child cleanup | Verified in the shipped type definitions and protocol implementation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Both behaviors were measured against a pre-fix control build under identical conditions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (live verification capture)**: `../006-live-verification-capture/implementation-summary.md`
- **Parent Spec**: `../spec.md`
