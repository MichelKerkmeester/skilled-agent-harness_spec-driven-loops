---
title: "Feature Specification: Phase 5 — Magnific feature catalog and manual-testing playbook"
description: "Create a current-state inventory of verified Magnific MCP capabilities and reproducible scenarios that separate no-cost discovery from explicitly authorized credit-consuming operations."
trigger_phrases:
  - "magnific feature catalog"
  - "magnific testing playbook"
  - "magnific mcp scenarios"
  - "mcp-magnific phase 5"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/005-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T13:36:50Z"
    last_updated_by: "spec-author"
    recent_action: "Define Magnific catalog and playbook phase"
    next_safe_action: "Inventory only verified Phase 4 capabilities"
    blockers:
      - "Phase 4 package must define the current verified surface"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-magnific-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5 — Magnific feature catalog and manual-testing playbook

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 7 |
| **Predecessor** | `004-skill-authoring` |
| **Successor** | `006-hub-registration-and-advisor` |
| **Handoff Criteria** | Catalog and playbook validate, cover the verified surface, and label every scenario by cost and mutation class. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

Magnific's official page spans generation, editing, creations, Spaces, LoRAs, and models, but only the discovered MCP surface may enter the catalog. Scenarios must make credit consumption visible before execution.

**Scope Boundary**: Documentation packages only. Do not expand the runtime or invent roadmap entries.

**Dependencies**:
- Verified tool and schema reference from Phase 4.
- `sk-create-feature-catalog` and `sk-create-manual-testing-playbook` doctrines.

**Deliverables**:
- Feature catalog rooted in current tool discovery.
- Manual-testing playbook with stable scenario IDs, explicit cost class, evidence, and rollback/cleanup.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Without an inventory and scenario corpus, operators cannot tell what the MCP actually supports, which checks are free, which actions spend credits, or how to verify asynchronous multimodal results safely.

### Purpose
Create a current-behavior source of truth and a repeatable validation surface for routing, auth, free reads, paid generation, transformations, workflows, and failure handling.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Feature cards for each verified current tool/capability.
- Cost classes: no-cost, credit-consuming, account-changing, unknown.
- Mutation classes: read, create, transform, destructive, share/publish.
- Scenarios for discovery, balance, history, explicit-model generation, safe editing, auth failure, insufficient credits, timeout, and result retrieval where supported.
- `sk-design` pairing checks for design-affecting prompts.

### Out of Scope
- Undiscovered marketing capabilities.
- Real paid tests without an operator-approved budget.
- Future model or feature roadmaps.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-magnific/feature-catalog/**` | Create | Current verified capability inventory |
| `.opencode/skills/mcp-tooling/mcp-magnific/manual-testing-playbook/**` | Create | Reproducible scenarios and execution policy |
| `implementation-summary.md` | Modify | Validation evidence |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Catalog only verified behavior | Every card cites a discovered tool/schema or official source |
| REQ-002 | Label cost and mutation class | Every card and scenario states cost/mutation posture, including UNKNOWN where necessary |
| REQ-003 | Build safe scenario contracts | Given a paid scenario, the exact prompt stops before execution until budget consent is recorded |
| REQ-004 | Cover failure paths | Auth, plan gating, insufficient credits, timeout, model drift, and unavailable result cases are represented |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cross-link both packages | Catalog and playbook references resolve bidirectionally |
| REQ-006 | Validate package shape | Catalog and playbook validators pass with stable IDs and required fields |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operators can select a no-cost verification path without accidental credit use.
- **SC-002**: Paid scenarios are reproducible only after explicit budget approval.
- **SC-003**: The catalog distinguishes product-page breadth from currently discovered MCP capability.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stable discovery fixture | Catalog can drift | Record capture date and require revalidation |
| Risk | Scenario prompt causes multiple generated assets | Spend exceeds expectation | State count, model, dimensions/duration, and budget before call |
| Risk | Outputs are not directly renderable | False pass | Require result retrieval and artifact evidence |
| Risk | Unlimited-plan assumptions | Unexpected credit use | Preserve official warning that MCP actions still consume credits |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What budget unit can be stated before execution: credits, asset count, model, resolution, duration, or all of them?
- Which no-cost history and creation-rendering operations are exposed by the live server?
<!-- /ANCHOR:questions -->
