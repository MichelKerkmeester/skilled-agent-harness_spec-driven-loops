---
title: "Feature Specification: Phase 3 - Integrate Webflow MCP 2.0"
description: "Scaffold mcp-webflow and integrate the official transport, authentication, configuration, discovery, and safe read smoke defined by Phase 2."
trigger_phrases: ["webflow mcp integration", "mcp-webflow scaffold", "mcp-webflow phase 3"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/003-webflow-mcp-integration"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the pending MCP integration contract"
    next_safe_action: "Wait for accepted Phase 2 architecture"
    blockers: ["Phase 2 architecture is not accepted"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 - Integrate Webflow MCP 2.0

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 8 |
| **Predecessor** | `002-architecture-and-safety-contract` |
| **Successor** | `004-skill-authoring` |
| **Handoff Criteria** | Mode scaffold and official MCP connection follow the accepted contract; config validates; tools are discoverable; safe non-production read smoke succeeds or has an evidence-backed blocker. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
This phase is the first runtime-facing implementation. It may create the packet and configuration selected by Phase 2, but it must not broaden permissions, improvise auth, or perform unapproved external mutation.

**Dependencies**: completed Phase 1 and accepted Phase 2 contract.

**Deliverables**: `mcp-webflow` scaffold, transport pointer/configuration, environment example entries if required, tool reference generated from discovery, doctor/install guidance if applicable, and safe read-smoke evidence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
A researched architecture is not usable until the official Webflow MCP transport can be configured, authenticated, discovered, and exercised through the repository's Code Mode/MCP conventions.

### Purpose
Create the smallest working integration that proves connectivity and tool discovery while preserving the Phase 2 safety boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Scaffold `.opencode/skills/mcp-tooling/mcp-webflow/` from the approved skill workflow.
- Add only the official connection/install pointer required by research.
- Register Code Mode or local configuration and environment variable names if required.
- Verify authentication without exposing credentials.
- Discover and document the live tool inventory.
- Run a read-only smoke against the approved non-production target.

### Out of Scope
- Final skill prose and examples beyond integration notes.
- Hub routing/advisor registration.
- External mutation, publish, deployment, delete, or overwrite smoke.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-webflow/**` | Create | Mode scaffold and MCP integration assets |
| `.utcp_config.json` | Modify if required | Register researched MCP transport |
| `.env.example` | Modify if required | Document namespaced variables without values |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement only the accepted transport | Package/config identity matches Phase 1 and Phase 2 evidence |
| REQ-002 | Preserve least privilege | Tool surface and auth scopes do not exceed the accepted contract |
| REQ-003 | Protect credentials | No key, token, cookie, OAuth secret, or account identifier is committed or logged |
| REQ-004 | Prove tool discovery | Code Mode/MCP discovery returns the expected official inventory |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Prove safe connectivity | Approved read-only non-production smoke returns evidence |
| REQ-006 | Document blocked live smoke honestly | If no safe target exists, exact blocker and confirmation path are recorded; production is not used as fallback |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: The official transport resolves through repository tooling.
- **SC-002**: Auth configuration is documented without secrets and tool discovery matches evidence.
- **SC-003**: No operation exceeds the Phase 2 boundary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Accepted architecture | Wrong integration if absent | Hard block until Phase 2 closes |
| Risk | Existing `.utcp_config.json` is concurrently dirty | Overwrite another AI's work | Re-read immediately before surgical edit and halt on conflict |
| Risk | Auth redirects or tokens enter logs | Credential exposure | Redact output and store values only in operator environment |
| Risk | Smoke target is production | External damage | Require named disposable/non-production target or defer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Exact transport, endpoint, and auth shape are owned by Phase 1 and Phase 2.
- Is a repository-level `.utcp_config.json` entry required, or does the official client use remote OAuth configuration only?
<!-- /ANCHOR:questions -->
