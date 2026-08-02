---
title: "Feature Specification: Phase 2 - Webflow mode architecture and safety contract"
description: "Convert Phase 1 evidence into a frozen mode classification, backend, permissions, authentication, confirmation, rollback, publishing, and design-pairing contract."
trigger_phrases:
  - "webflow mcp architecture"
  - "webflow mcp safety contract"
  - "mcp-webflow phase 2"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/002-architecture-and-safety-contract"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the architecture and safety decision gate"
    next_safe_action: "Wait for Phase 1 synthesis, then freeze the contract"
    blockers:
      - "Phase 1 research is not complete"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Workflow or transport classification"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 - Webflow mode architecture and safety contract

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 8 |
| **Predecessor** | `001-deep-research` |
| **Successor** | `003-webflow-mcp-integration` |
| **Handoff Criteria** | One accepted contract fixes the mode kind, backend, allowed tools, auth model, operation classes, confirmation rules, rollback posture, and design pairing. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase consumes the cited research synthesis and makes the load-bearing decisions that all implementation phases must follow. It changes specification documents only and performs no Webflow operation.

**Dependencies**: completed Phase 1 synthesis and current `mcp-tooling` registry/router contracts.

**Deliverables**: classification decision, tool-surface matrix, operation-risk matrix, auth/secret contract, confirmation and rollback policy, `sk-design` pairing rule, and approved integration target.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Webflow MCP may read and mutate an external design and content system, while `mcp-tooling` distinguishes workspace-mutating workflows from external transports. Without a frozen classification and action policy, later implementation could grant the wrong tools or allow publish and destructive operations without explicit control.

### Purpose
Turn research evidence into one minimal architecture and safety contract that implementation can apply mechanically.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Decide `packetKind`, `backendKind`, `toolSurface`, workspace mutation posture, and cross-hub pairing.
- Classify every researched tool as read-only, draft-write, reversible mutation, destructive mutation, publish, or deployment.
- Define operator-confirmation, precondition, evidence, and rollback requirements per class.
- Define authentication, scope minimization, secret handling, and environment naming.
- Select the official MCP transport and safe smoke target.

### Out of Scope
- Creating the mode package or changing hub files.
- Running external mutations.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Record accepted architecture and safety contract |
| `plan.md` | Modify | Freeze integration sequence and verification |
| `tasks.md` | Modify | Track decision evidence and sign-off |
| `implementation-summary.md` | Modify at close | Record accepted decisions and remaining risks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Classify the mode using registry semantics | Decision cites current registry definitions and Phase 1 evidence |
| REQ-002 | Freeze the permission boundary | Allowed and forbidden tools plus workspace/external mutation posture are explicit |
| REQ-003 | Gate high-impact operations | Delete, overwrite, publish, deploy, and irreversible actions require rollback and operator confirmation |
| REQ-004 | Protect credentials | Only names and setup methods are documented; values never enter repository files or logs |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Define `sk-design` pairing | Design-affecting operations explicitly load `sk-design`; transport never decides taste |
| REQ-006 | Define live-smoke safety | Named non-production target, allowed operation, rollback, and evidence requirements exist |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Phase 3 can implement without choosing architecture or inventing safety rules.
- **SC-002**: Every researched Webflow operation maps to one risk class and gate.
- **SC-003**: Authentication and live-smoke plans expose no secret or production-content risk.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 evidence | Decisions may be speculative | Block this phase until synthesis exists |
| Risk | External mutation differs from workspace mutation | Wrong packet classification | Apply registry definitions and record dominant posture explicitly |
| Risk | Publish semantics are unclear | Accidental public change | Default to prohibited until official evidence proves a safe gate |
| Risk | OAuth scopes are broader than needed | Excess privilege | Select least privilege and document scope rationale |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Does external Webflow mutation make this a transport despite broad write capability?
- Which operations have native versioning or rollback, and which need compensating actions?
- Can live smoke use a disposable site or isolated branch/staging surface?
<!-- /ANCHOR:questions -->
