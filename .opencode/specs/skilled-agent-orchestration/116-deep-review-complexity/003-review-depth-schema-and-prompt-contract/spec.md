---
title: "Feature Specification: 116/003 — Review-Depth Schema and Prompt Contract"
description: "Define versioned review-depth fields and prompt obligations for target selection, search coverage, and search ledger rows."
trigger_phrases:
  - "review-depth schema"
  - "searchLedger prompt contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/003-review-depth-schema-and-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 003 planning packet."
    next_safe_action: "Define review-depth fields after phase 002 fixtures exist."
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/references/state_format.md"
      - ".opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl"
    session_dedup:
      fingerprint: "sha256:1160030000000000000000000000000000000000000000000000000000000000"
      session_id: "116-003-review-depth-schema"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 116/003 — Review-Depth Schema and Prompt Contract

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 8 |
| **Predecessor** | `../002-seeded-fixture-harness/spec.md` |
| **Successor** | `../004-validator-v2-enforcement/spec.md` |
| **Handoff Criteria** | Prompt and state docs define versioned review-depth fields with render-test coverage. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase defines the contract that later validator, reducer, convergence, and graph phases enforce or project.

**Scope Boundary**: Schema docs, prompt-pack contract, and prompt render tests.

**Dependencies**:
- Phase 002 seeded fixtures.

**Deliverables**:
- `reviewDepthSchemaVersion: 2` contract.
- `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger[]` docs.
- Prompt requirements for evidence refs, dispositions, and finding/ruled-out/blocked linkage.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep-review currently asks for disciplined finding output, but not a versioned proof of target selection and candidate search. A ledger field alone is insufficient unless the prompt and state docs define required relationships.

### Purpose
Create the canonical v2 review-depth schema and prompt contract that later phases can validate, persist, and use for stop decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- State-format documentation for review-depth v2 fields.
- Prompt-pack changes requiring target selection and search ledger rows.
- Prompt render tests that assert the contract terms appear.

### Out of Scope
- Hard validator enforcement.
- Reducer/dashboard persistence.
- Graph vocabulary changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/references/state_format.md` | Modify | Document review-depth v2 fields. |
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modify | Require search ledger and target selection output. |
| prompt-pack tests | Modify/Create | Assert rendered contract terms. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define `reviewDepthSchemaVersion: 2`. | State docs explain legacy vs v2 behavior. |
| REQ-002 | Define applicability and target-selection fields. | Prompt requires selected targets, discovery methods, omitted high-risk targets, and evidence refs. |
| REQ-003 | Define `searchCoverage` and `searchLedger[]`. | Row fields include target refs, bug class or invariant, actions, evidence, disposition, and disposition-specific linkage. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Rendered prompts contain `searchLedger`, `targetSelection`, `bugClass`, `invariant`, `producer`, `consumer`, `negativeTestSearched`, `evidenceRefs`, and `linkedFindingId`.
- State docs explain trivial/legacy applicability so low-risk reviews are not overburdened.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Schema becomes boilerplate. | Require linkage between selected target, searched bug class, cited evidence, and disposition. |
| Dependency | Phase 002 fixtures. | Start only after fixtures define invalid shallow cases. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
