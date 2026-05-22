---
title: "Feature Specification: 116/007 — Ledger-Led Graph Vocabulary"
description: "Project stable search ledger semantics into review graph vocabulary after text/JSON evidence is durable."
trigger_phrases:
  - "ledger-led graph vocabulary"
  - "deep-review bug class graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/007-ledger-led-graph-vocabulary"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 007 planning packet."
    next_safe_action: "Add graph vocabulary only after ledger persistence and gates are stable."
    blockers: []
    key_files:
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:1160070000000000000000000000000000000000000000000000000000000000"
      session_id: "116-007-ledger-led-graph-vocabulary"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 116/007 — Ledger-Led Graph Vocabulary

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 8 |
| **Predecessor** | `../006-candidate-saturation-and-graphless-gates/spec.md` |
| **Successor** | `../008-playbooks-and-default-calibration/spec.md` |
| **Handoff Criteria** | Graph events preserve candidate semantics while graphless fallback tests still pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase adds graph vocabulary after ledger semantics are stable, so graph data mirrors search proof rather than replacing it.

**Scope Boundary**: Graph event schema/workflow projection and related tests.

**Dependencies**:
- Phase 006 convergence behavior.

**Deliverables**:
- Graph support for `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` semantics where appropriate.
- Tests showing graph projection does not break graphless fallback runs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Current review graph vocabulary is too coarse to represent bug-class or invariant search. Adding graph nodes too early would also risk making graph availability a false requirement.

### Purpose
Project stable ledger semantics into graph events so graph-enabled runs gain stronger structural coverage while text/JSON fallback remains authoritative.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Candidate-led graph vocabulary projection.
- Graph allow-list updates where required.
- Coverage graph tests for candidate semantics.

### Out of Scope
- Changing the ledger row schema.
- Requiring graph data for graphless fallback runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Project ledger semantics into graph events. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm workflow parity. |
| coverage graph implementation/tests | Modify | Accept candidate vocabulary where the graph layer owns it. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add candidate vocabulary after ledger stability. | Graph events mirror ledger rows and do not define a conflicting contract. |
| REQ-002 | Preserve graphless fallback. | Graphless fallback tests from phase 006 still pass. |
| REQ-003 | Block only when graph data exists or fallback is insufficient. | Graph gates do not create false-safe or false-blocking states. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Graph events preserve candidate semantics from ledger rows.
- Unknown graph events degrade safely where appropriate.
- Graphless fallback remains valid without candidate graph nodes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Graph becomes the source of truth too early. | Keep text/JSON ledger authoritative. |
| Dependency | Phase 006 stop gates. | Add graph projection after fallback behavior is stable. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
