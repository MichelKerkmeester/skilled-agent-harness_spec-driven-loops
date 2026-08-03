---
title: "Feature Specification: Phase 1 — Official Magnific MCP research"
description: "Verify the official Magnific remote MCP contract before any runtime or skill implementation: transport, authentication, tools, schemas, assets, plan access, credits, and mutation safety."
trigger_phrases:
  - "magnific mcp research"
  - "magnific remote mcp contract"
  - "mcp-magnific phase 1"
  - "magnific tool discovery"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/001-official-mcp-research"
    last_updated_at: "2026-08-02T18:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Execute bounded research and live discovery"
    next_safe_action: "Hand off to 002-mode-architecture-and-scaffold"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-magnific-001"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Live tool schemas and per-tool credit costs await an authenticated session (Phase 3)."
    answered_questions:
      - "Transport is streamable HTTP, fully Bearer-gated (401 without token)."
      - "Auth is OAuth 2.0 (Keycloak realm auth.magnific.com/realms/mcp), browser authorization-code + PKCE; device grant advertised."
      - "~34 stable tool names documented officially; no resources/prompts published."
      - "MCP uses the account credit balance; generation/transformation/training consume credits."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Official Magnific MCP research

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete (2026-08-02) |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | `002-mode-architecture-and-scaffold` |
| **Handoff Criteria** | A cited research synthesis freezes the verified remote-MCP contract and separates confirmed facts from unknowns. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This research-only phase gates every implementation phase. The official page confirms `https://mcp.magnific.com`, custom-connector setup, paid-plan access, broad creative capabilities, and credit consumption for generation/transformation, but it does not publish the callable schema in the retrieved page content.

**Scope Boundary**: Read-only research and controlled discovery. Do not modify runtime config, create the shipped skill package, or spend credits.

**Dependencies**:
- Official Magnific MCP page and endpoint.
- A compatible MCP discovery client.
- Operator-provided authentication if live discovery requires it.

**Deliverables**:
- `research/research.md` with citations and a verified contract matrix.
- Tool inventory or an exact authentication blocker.
- Recommendation for transport classification, runtime bridge, and credit gates.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The landing page describes capabilities in product language but does not establish the wire protocol, authorization flow, callable names, schemas, job lifecycle, output references, or destructive operations needed for a safe agent integration.

### Purpose
Produce enough verified evidence for Phase 2 to freeze the mode architecture without guessing any tool, credential, cost, or asset-handling behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify Streamable HTTP/SSE/bridge compatibility and authentication.
- Enumerate tools, resources, prompts, schemas, asynchronous job behavior, and result formats.
- Classify balance/history/browse operations versus credit-consuming generation and transformation.
- Verify plan restrictions, privacy statements, model-selection behavior, and team/workspace effects.
- Identify delete, overwrite, publish, share, LoRA-training, and workflow-saving operations.

### Out of Scope
- Spending credits or generating assets.
- Writing `.utcp_config.json`.
- Authoring final skill claims before discovery.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Cited synthesis and contract matrix |
| `research/**` | Create | Workflow-owned state, findings, and discovery fixtures |
| `implementation-summary.md` | Modify | Closeout evidence after research completes |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify endpoint transport and authentication | Given a supported client, discovery either succeeds or records the exact auth/transport blocker without speculation |
| REQ-002 | Capture the exact callable surface | Tool/resource/prompt names and schemas come from live discovery or official technical documentation |
| REQ-003 | Classify credit semantics | Every confirmed operation is marked no-cost, credit-consuming, unknown, or account-changing |
| REQ-004 | Capture mutation and asset behavior | Outputs, jobs, workspace writes, sharing, deletion, and overwrite semantics are documented where confirmed |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Compare direct remote registration with `mcp-remote` | Phase 2 receives one recommended Code Mode topology with evidence |
| REQ-006 | Define verification fixtures | Research names safe no-cost probes and a separately consented paid smoke scenario |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 2 can decide classification, permissions, runtime topology, and gates without additional foundational research.
- **SC-002**: No tool name, schema, cost, or authentication detail is inferred from marketing copy.
- **SC-003**: The official endpoint and product-page claims are cited, and live evidence is timestamped.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Paid Magnific account | Authenticated discovery may be unavailable | Record a precise blocker and keep implementation gated |
| Risk | Discovery itself triggers side effects | Unexpected credit use | Restrict Phase 1 to list/info/balance/history calls |
| Risk | Tool surface changes frequently | Stale documentation | Save a dated fixture and require per-session discovery |
| Risk | Auto mode hides selected model | Reproducibility loss | Document explicit-model requests for controlled scenarios |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does browser OAuth complete through `mcp-remote`, and where is session state stored?
- Can the server quote or estimate credits before a generation call?
- Are remote asset URLs durable, signed, downloadable, or workspace-only?
- Are Spaces and LoRA operations exposed in the current MCP tool surface?
<!-- /ANCHOR:questions -->
