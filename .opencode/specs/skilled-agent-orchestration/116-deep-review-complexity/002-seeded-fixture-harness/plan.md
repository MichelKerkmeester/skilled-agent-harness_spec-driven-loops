---
title: "Implementation Plan: 116/002 — Seeded Fixture Harness"
description: "Plan for failing review-depth fixtures that gate later deep-review hardening phases."
trigger_phrases:
  - "116 seeded fixture plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/002-seeded-fixture-harness"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 002 plan."
    next_safe_action: "Inspect existing test fixtures and add failing cases."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1160021000000000000000000000000000000000000000000000000000000000"
      session_id: "116-002-plan"
      parent_session_id: "116-002-seeded-fixture-harness"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 116/002 — Seeded Fixture Harness

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript tests, JSONL fixtures, Markdown playbook notes |
| **Framework** | Vitest + deep-review reducer fixtures |
| **Storage** | Test fixtures and packet scratch notes |
| **Testing** | Targeted vitest runs plus spec validation |

### Overview
Add behavior-first fixture coverage so later phases cannot satisfy review-depth hardening by adding optional fields only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 synthesis identifies seeded-test gating as required.
- [ ] Existing validator and reducer fixture conventions inspected.

### Definition of Done
- [ ] Failing validator fixtures exist.
- [ ] Failing reducer/report fixtures exist.
- [ ] Failing convergence/graphless fixtures exist.
- [ ] Strict validation passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Fixture-first hardening. Tests define expected failures before schema, validation, persistence, and convergence changes are implemented.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [ ] Read existing validator tests and fixture folders.
- [ ] List fixture gaps in `scratch/fixture-inventory.md`.

### Phase 2: Fixture Authoring
- [ ] Add invalid shallow v2 records.
- [ ] Add valid rich v2 records.
- [ ] Add reducer and convergence fixture sessions.

### Phase 3: Verification
- [ ] Run targeted tests and record expected failing state.
- [ ] Validate this child spec folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator | post-dispatch records | `npx vitest` targeted file |
| Reducer | search debt fixture | reducer fixture tests |
| Spec docs | phase folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phase 001 research synthesis | Spec evidence | Complete |
| Existing validator fixture layout | Test convention | To inspect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK PLAN

Remove only the newly added fixture files and test assertions from this phase. No production code should be touched here.
<!-- /ANCHOR:rollback -->
