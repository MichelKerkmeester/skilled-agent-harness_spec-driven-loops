---
title: "Feature Specification: 116/002 — Seeded Fixture Harness"
description: "Plan the failing fixtures and seeded review-depth targets that must exist before deep-review production behavior changes."
trigger_phrases:
  - "deep-review seeded fixtures"
  - "review-depth fixture harness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/002-seeded-fixture-harness"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 002 planning packet."
    next_safe_action: "Add failing fixtures before production edits."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts"
      - ".opencode/skills/deep-review/scripts/tests/fixtures/"
    session_dedup:
      fingerprint: "sha256:1160020000000000000000000000000000000000000000000000000000000000"
      session_id: "116-002-seeded-fixture-harness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Seeded tests gate every implementation slice."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 116/002 — Seeded Fixture Harness

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
| **Phase** | 2 of 8 |
| **Predecessor** | `../001-research-synthesis/spec.md` |
| **Successor** | `../003-review-depth-schema-and-prompt-contract/spec.md` |
| **Handoff Criteria** | Failing fixtures cover validator, reducer, convergence, graphless fallback, and playbook surfaces. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase turns the research requirement "seeded tests before each implementation slice" into concrete failing fixtures. Production workflow changes should not begin until this phase defines what shallow behavior must fail.

**Scope Boundary**: Tests, fixtures, and fixture documentation only.

**Dependencies**:
- Phase 001 research synthesis.

**Deliverables**:
- Validator fixtures for missing or shallow `searchLedger` rows.
- Reducer/dashboard fixtures for candidate coverage and search debt.
- STOP_BLOCKED fixtures for candidate coverage and graphless fallback.
- Manual seeded scenario inventory for phase 008.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research found that schema-only changes can become checkbox theater. Without failing fixtures first, later phases can add fields without proving that shallow no-finding reviews are rejected.

### Purpose
Create behavior-focused tests that fail against current shallow behavior and pass only when the relevant deep-review owner is wired correctly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Failing validator fixtures for review-depth v2 records.
- Failing reducer/report fixtures that prove ledger rows survive.
- Failing convergence fixtures for missing candidate coverage.
- Seeded manual scenario inventory.

### Out of Scope
- Production schema, validator, reducer, convergence, graph, or playbook behavior changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts` | Modify | Add invalid/valid v2 fixture assertions. |
| `.opencode/skills/deep-review/scripts/tests/fixtures/` | Create/Modify | Add candidate-ledger and search-debt fixture sessions. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/002-seeded-fixture-harness/scratch/` | Create | Store fixture inventory notes during planning. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add fixtures for missing ledger rows. | Current shallow records fail explicit v2 validation. |
| REQ-002 | Add fixtures for bad `findingsNew` shape. | Array/number/object drift is rejected where v2 requires severity-count shape. |
| REQ-003 | Add fixtures for reducer search debt. | Candidate coverage and clean-search proof survive reducer processing. |
| REQ-004 | Add fixtures for graphless fallback. | Missing fallback proof yields a named blocker. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Fixtures fail before production behavior changes.
- Each later implementation phase can point to at least one seeded fixture.
- Existing blocked-stop and graph tests remain green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Fixtures only check field presence. | Include evidence refs, disposition links, and search coverage totals. |
| Dependency | Existing test layout. | Inspect current vitest and fixture conventions before writing tests. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
