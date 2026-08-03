---
title: "Feature Specification: Phase 3 — Magnific MCP runtime integration"
description: "Register the official Magnific remote MCP in Code Mode using the verified transport and authentication flow, while keeping credentials and session state out of the repository."
trigger_phrases:
  - "magnific mcp runtime"
  - "magnific utcp manual"
  - "mcp-remote magnific"
  - "mcp-magnific phase 3"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/003-mcp-runtime-integration"
    last_updated_at: "2026-08-02T18:15:00Z"
    last_updated_by: "spec-author"
    recent_action: "Execute runtime integration phase"
    next_safe_action: "Execute 004-skill-authoring"
    blockers: ["Operator browser OAuth approval required for authenticated discovery (documented, non-blocking for this phase)"]
    key_files: ["spec.md", "plan.md", "tasks.md", "research/discovery-fixture.json"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-003", parent_session_id: null}
    completion_pct: 100
    open_questions: ["Exact Code Mode tool namespace (single vs doubled magnific prefix) requires authenticated discovery"]
    answered_questions: ["Authenticated discovery completed: 85 tools, 22 resources, 1 prompt; simulate_cost exists; balance probe works read-only"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — Magnific MCP runtime integration

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete (2026-08-02) — with documented operator-OAuth blocker for authenticated discovery |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 7 |
| **Predecessor** | `002-mode-architecture-and-scaffold` |
| **Successor** | `004-skill-authoring` |
| **Handoff Criteria** | Code Mode discovers Magnific through the official endpoint, or an exact environment/auth blocker is recorded; JSON parses and no secret is committed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

The current repository bridges remote MCPs such as Mobbin and Refero through `npx -y mcp-remote <url>`. This phase applies only the topology accepted in Phase 2 and validates it against the official Magnific endpoint.

**Scope Boundary**: Runtime wiring and discovery only. Do not generate or transform content unless the operator separately authorizes a controlled paid smoke.

**Dependencies**:
- Official endpoint `https://mcp.magnific.com`.
- Phase 2 architecture contract.
- Node/npx and Code Mode.

**Deliverables**:
- Magnific manual in `.utcp_config.json`.
- `.env.example` additions only if the verified auth contract needs them.
- Dated discovery evidence with secret values excluded.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The remote endpoint is not registered in Code Mode, so agents cannot discover or call Magnific. Incorrect bridge or auth wiring could expose credentials, persist stale sessions, or make a paid call during setup.

### Purpose
Create the smallest verified runtime registration that reaches the official endpoint and proves discovery without spending credits.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a name-keyed `magnific` manual to `.utcp_config.json`.
- Use the verified remote transport/auth flow.
- Confirm JSON validity, bridge startup, discovery naming, and session behavior.
- Document authentication reset and local session-state location without committing it.

### Out of Scope
- Native `opencode.json` registration.
- Proxy-server implementation.
- Unapproved paid generation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.utcp_config.json` | Modify | Register official Magnific remote MCP |
| `.env.example` | Modify if required | Add verified configuration variable names only |
| `research/discovery-fixture.json` | Create | Sanitized tool discovery snapshot |
| `implementation-summary.md` | Modify | Runtime verification evidence |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register the official endpoint | Manual targets `https://mcp.magnific.com` through the accepted bridge |
| REQ-002 | Preserve credential safety | No token, cookie, OAuth secret, or session artifact appears in tracked files |
| REQ-003 | Prove no-cost discovery | Given valid auth, tool discovery succeeds without invoking a credit-consuming action |
| REQ-004 | Preserve config integrity | `.utcp_config.json` parses and existing manuals remain unchanged except required ordering |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Record callable naming | Fixture captures the exact Code Mode namespace and schemas available at verification time |
| REQ-006 | Document auth recovery | Operator can clear/reconnect authentication without editing unrelated configuration |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Code Mode lists Magnific tools from the official server.
- **SC-002**: Setup performs no generation/transformation and consumes no credits.
- **SC-003**: Authentication and discovery can be repeated without repository secrets.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `mcp-remote` or accepted equivalent | Bridge failure blocks Code Mode | Verify package identity and launch before wiring |
| Risk | Browser OAuth unavailable in headless runtime | Discovery blocked | Record operator-assisted auth requirement |
| Risk | Session state written inside repo | Credential leak | Inspect bridge state path and git status |
| Risk | Tool discovery changes | Stale docs | Capture fixture and require fresh runtime checks |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does Code Mode expose the remote server's tool names with a single or doubled `magnific` prefix?
- Does the bridge require browser interaction on every machine or reuse a local OAuth session?
<!-- /ANCHOR:questions -->
