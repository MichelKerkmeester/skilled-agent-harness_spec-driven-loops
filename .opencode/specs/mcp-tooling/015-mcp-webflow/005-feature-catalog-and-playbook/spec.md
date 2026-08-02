---
title: "Feature Specification: Phase 5 - Webflow feature catalog and manual playbook"
description: "Inventory every supported Webflow MCP capability and author safe, reproducible manual scenarios across discovery, reads, writes, errors, confirmation, rollback, and design pairing."
trigger_phrases: ["webflow feature catalog", "webflow mcp playbook", "mcp-webflow phase 5"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/005-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the pending catalog and playbook contract"
    next_safe_action: "Wait for Phase 4 package docs"
    blockers: ["Phase 4 is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5 - Webflow feature catalog and manual playbook

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 8 |
| **Predecessor** | `004-skill-authoring` |
| **Successor** | `006-hub-registration-and-advisor` |
| **Handoff Criteria** | Catalog and playbook cover every shipped capability and risk class with traceable, safe scenario contracts and pass/fail evidence requirements. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
This phase turns the verified skill surface into two operational evidence packages: a capability inventory and a manual behavior test suite. Mutating scenarios use a disposable/non-production target and explicit rollback; publish/deploy scenarios remain tabletop unless separately confirmed.

**Dependencies**: completed Phases 1-4 and current sk-create-feature-catalog/manual-playbook contracts.

**Deliverables**: feature catalog entries, scenario index, setup fixtures, safety matrix, evidence fields, failure triage, and coverage reconciliation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Without a catalog, supported features drift out of documentation. Without a playbook, routing, authentication, error handling, confirmation gates, rollback, and external side effects cannot be tested reproducibly.

### Purpose
Create a traceable inventory and safe behavior suite that future maintainers can rerun without risking production Webflow content.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Catalog each verified operation, tool, input/output, auth requirement, risk class, and implementation pointer.
- Author scenarios for setup, discovery, reads, draft-safe writes, errors, rate/permission handling, confirmation, rollback, and `sk-design` pairing.
- Define fixtures and cleanup for a disposable/non-production target.
- Reconcile catalog, playbook, and skill docs for full coverage.

### Out of Scope
- Hub/advisor registration.
- Production publish/deploy execution.
- Scenarios for unverified tools.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/**` | Create | Capability inventory |
| `.opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/**` | Create | Safe behavior scenarios and evidence contracts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Catalog all shipped capabilities | Every documented tool and operation has one canonical entry |
| REQ-002 | Cover every safety class | Playbook includes read, safe write, destructive/tabletop, auth, error, confirmation, and rollback behavior |
| REQ-003 | Prevent production damage | Live mutating scenarios require disposable target, rollback, and explicit confirmation |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Provide reproducible evidence fields | Each scenario names prompt, sequence, expected signals, evidence, pass/fail, and failure triage |
| REQ-005 | Reconcile coverage | No orphan catalog entry, undocumented tool, or unsupported scenario remains |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Catalog, packet docs, and discovered tool inventory have a one-to-one coverage map.
- **SC-002**: Manual scenarios cover every operation class without requiring production mutation.
- **SC-003**: Catalog and playbook validators pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Complete skill surface | Catalog/playbook may drift immediately | Block until Phase 4 validates |
| Risk | Scenario executes high-impact action | External damage | Tabletop by default; named rollback and confirmation for any live mutation |
| Risk | Feature names diverge from tools | Coverage ambiguity | Use stable IDs and direct implementation pointers |
| Risk | No disposable Webflow target | Mutating smoke unavailable | Mark scenario blocked, never redirect to production |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Which operation classes can be exercised safely on a disposable site?
- Which publish/deployment behaviors can only be validated through documentation and tabletop evidence?
<!-- /ANCHOR:questions -->
