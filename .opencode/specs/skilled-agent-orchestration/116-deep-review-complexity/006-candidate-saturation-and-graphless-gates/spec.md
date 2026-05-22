---
title: "Feature Specification: 116/006 — Candidate Saturation and Graphless Gates"
description: "Add stop gates that block shallow no-finding reviews when candidate coverage or graphless fallback proof is missing."
trigger_phrases:
  - "candidate saturation gates"
  - "graphless fallback gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/006-candidate-saturation-and-graphless-gates"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 006 planning packet."
    next_safe_action: "Add candidate and graphless stop gates after reducer persistence exists."
    blockers: []
    key_files:
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/skills/deep-review/references/convergence.md"
      - ".opencode/skills/deep-review/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:1160060000000000000000000000000000000000000000000000000000000000"
      session_id: "116-006-candidate-saturation-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 116/006 — Candidate Saturation and Graphless Gates

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
| **Phase** | 6 of 8 |
| **Predecessor** | `../005-search-ledger-persistence-and-reporting/spec.md` |
| **Successor** | `../007-ledger-led-graph-vocabulary/spec.md` |
| **Handoff Criteria** | STOP decisions use reducer-owned search coverage and named graphless fallback blockers. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase prevents a standard or complex run from stopping cleanly when required candidate classes, invariants, tests, or graphless fallback proof remain unresolved.

**Scope Boundary**: Convergence logic, docs, and tests.

**Dependencies**:
- Phase 005 reducer-owned search coverage.

**Deliverables**:
- `candidateCoverageGate` blocker.
- `graphlessFallbackGate` blocker.
- `searchCoverage.graphCoverageMode` stop behavior for `graph`, `graphless_fallback`, and `unavailable_blocked`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Dimension coverage can still substitute for bug pursuit unless convergence consumes candidate coverage and blocks shallow no-finding STOP decisions.

### Purpose
Make stop decisions depend on cited candidate/search coverage for non-trivial review scopes, with explicit graphless fallback proof when graph data is unavailable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Candidate-saturation stop gates.
- Graphless fallback proof requirements.
- Convergence documentation and blocked-stop tests.

### Out of Scope
- New graph node vocabulary.
- Raising iteration defaults.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add candidate/graphless stop gates. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm workflow parity. |
| `.opencode/skills/deep-review/references/convergence.md` | Modify | Document new blockers. |
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Modify | Supply convergence inputs if needed. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Block missing candidate coverage. | STOP_BLOCKED names missing bug classes or invariants. |
| REQ-002 | Require graphless fallback proof. | `graphless_fallback` mode needs cited direct reads/searches. |
| REQ-003 | Avoid false graph blockers. | Graph unavailable can pass with sufficient text/JSON fallback evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- No-finding iterations count positively only with clean-search ledger rows.
- Missing fallback proof emits a named blocker.
- Existing graph blocked-stop tests remain green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Graph downtime blocks useful reviews. | Allow graphless fallback proof with equal evidence obligations. |
| Dependency | Phase 005 reducer state. | Do not implement stop gates before search coverage is durable. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
