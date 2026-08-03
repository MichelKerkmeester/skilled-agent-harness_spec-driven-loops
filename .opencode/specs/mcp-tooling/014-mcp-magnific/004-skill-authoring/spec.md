---
title: "Feature Specification: Phase 4 — Author the mcp-magnific mode package"
description: "Author the nested Magnific transport contract, setup guide, routed references, safe examples, troubleshooting, and changelog from verified research and runtime discovery."
trigger_phrases:
  - "author mcp-magnific"
  - "magnific skill package"
  - "magnific mcp references"
  - "mcp-magnific phase 4"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/004-skill-authoring"
    last_updated_at: "2026-08-02T13:36:49Z"
    last_updated_by: "spec-author"
    recent_action: "Define Magnific skill authoring phase"
    next_safe_action: "Author from verified Phase 1 and 3 evidence"
    blockers:
      - "Runtime discovery must establish callable names and schemas"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-magnific-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — Author the mcp-magnific mode package

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 7 |
| **Predecessor** | `003-mcp-runtime-integration` |
| **Successor** | `005-feature-catalog-and-playbook` |
| **Handoff Criteria** | Nested package validates; routing, credit gates, judgment pairing, and every reference path are executable and evidence-backed. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This phase turns the verified remote surface into an agent-executable transport packet. The package must separate creative intent from transport execution, no-cost queries from paid mutations, and confirmed tool schemas from per-session discovery requirements.

**Scope Boundary**: Mode-local package content only. Shared hub registration is Phase 6.

**Dependencies**:
- Phase 1 research synthesis.
- Phase 2 architecture contract.
- Phase 3 discovery fixture and auth setup.
- `sk-create-skill` templates and nested-packet rules.

**Deliverables**:
- `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, references, examples, troubleshooting, assets if needed, and changelog.
- No mode-local `description.json` or `graph-metadata.json`.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A working manual alone does not tell an agent when Magnific is appropriate, when to load `sk-design`, how to avoid accidental credit spend, how to verify schemas, or how to handle asynchronous and multimodal outputs.

### Purpose
Author a concise execution contract that makes Magnific usable, safe, discoverable inside the hub, and honest about runtime-dependent details.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Activation boundary and when-not-to-use rules.
- Intent routing for generation, editing, creations, Spaces, LoRAs, models, account/balance, setup, and troubleshooting.
- Explicit confirmation gates for credit-consuming, destructive, publishing, sharing, and account-changing operations.
- Mandatory `sk-design` pairing for creative judgment.
- Per-session tool discovery and output verification.

### Out of Scope
- Invented tools or schemas.
- Generic design doctrine duplicated from `sk-design`.
- Hub registration or advisor metadata.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-magnific/SKILL.md` | Create | Executable transport contract |
| `.opencode/skills/mcp-tooling/mcp-magnific/README.md` | Create | Operator overview and quick start |
| `.opencode/skills/mcp-tooling/mcp-magnific/INSTALL-GUIDE.md` | Create | Connector and authentication setup |
| `.opencode/skills/mcp-tooling/mcp-magnific/references/**` | Create | Verified tool, safety, and troubleshooting references |
| `.opencode/skills/mcp-tooling/mcp-magnific/examples/**` | Create | Safe no-cost and explicitly gated paid examples |
| `.opencode/skills/mcp-tooling/mcp-magnific/changelog/v1.0.0.0.md` | Create | Initial release record |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author valid nested `SKILL.md` | Frontmatter, standard sections, router, rules, and success criteria pass package validation |
| REQ-002 | Enforce credit confirmation | Given a generation or transformation request, execution stops for explicit consent with a stated spend boundary |
| REQ-003 | Enforce creative-judgment pairing | Design-affecting requests load `sk-design` before calling Magnific |
| REQ-004 | Require live schema discovery | Every callable is confirmed with runtime discovery before use |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Author operator documentation | Setup, auth, troubleshooting, privacy, outputs, and limitations are documented |
| REQ-006 | Keep references resolvable | Every resource-map and related-document path exists and link checks pass |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Another agent can connect, discover, choose the correct operation class, confirm spend, execute, and verify output from the package alone.
- **SC-002**: No creative taste decision is delegated to the transport.
- **SC-003**: No unsupported tool name or fixed model catalog is presented as durable truth.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live discovery fixture | Router may point at stale names | Treat fixture as dated and reconfirm per session |
| Risk | Marketing claims exceed MCP surface | False capability claims | Catalog only discovered tools |
| Risk | Paid actions hidden in natural language | Accidental spend | Classify verbs and confirm before call |
| Risk | Model catalog changes daily | Stale references | Prefer discovery and explicit model lookup |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should no-cost balance/history access be the default verification path in every session?
- Which result types need a separate download/export procedure before local use?
<!-- /ANCHOR:questions -->
