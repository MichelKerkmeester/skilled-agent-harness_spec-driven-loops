---
title: "Plan: system-code-graph Vitest Suite Triage"
description: "Implementation plan for system-code-graph Vitest Suite Triage."
trigger_phrases:
  - "system-code-graph-suite-triage"
  - "010 follow-on 1"
  - "code-graph 31 failures triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/001-system-code-graph-suite-triage"
    last_updated_at: "2026-05-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded follow-on phase."
    next_safe_action: "Plan and execute this phase when ready."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a01010101010101010101010101010101010101010101010101010101010101"
      session_id: "010-memory-leak-follow-ons-arc-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Source baseline documented in arc 009 phase 007 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: system-code-graph Vitest Suite Triage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Vitest |
| **Framework** | system-code-graph MCP server verification |
| **Storage** | Spec Kit phase documentation and test evidence |
| **Testing** | To be planned during phase execution |

### Overview
This phase is scaffolded for follow-on planning. It will triage the broader `system-code-graph` Vitest failures documented from arc 009 phase 007 and classify each failing test as fix-now, skip-with-rationale, or quarantine-with-follow-on.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Read the phase spec and source arc 009 phase 007 implementation summary.
- [ ] Reproduce or collect the failing-test inventory before implementation.
- [ ] Confirm the triage output format for implementation-summary evidence.

### Definition of Done
- [ ] Every listed failing test has a recorded classification.
- [ ] Any skipped or quarantined test includes rationale and a follow-on pointer.
- [ ] Verification evidence is recorded in `implementation-summary.md`.
- [ ] This phase and parent arc strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Scaffold Contract
The implementation plan is intentionally generic at scaffold time. The executing agent should replace this section with the concrete triage approach after reading the failing test files, current test output, and source baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/tests/` | Broader code-graph Vitest coverage | Triage failures and apply scoped fixes or documented skips | Targeted and broader Vitest commands selected during phase execution |
| `.opencode/skills/system-code-graph/mcp_server/` | Product code under test | Modify only when triage proves a real product bug | Focused tests for the changed surface |
| `implementation-summary.md` | Phase evidence ledger | Record per-test outcomes and validation evidence | Strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the child spec and predecessor baseline.
- [ ] Capture the current failure inventory.
- [ ] Replace scaffold placeholders with a concrete execution plan.

### Phase 2: Implementation
- [ ] Classify each failing test.
- [ ] Apply scoped fixes or documented skips.
- [ ] Record evidence as the work proceeds.

### Phase 3: Verification
- [ ] Run the agreed test commands for this phase.
- [ ] Update `implementation-summary.md`.
- [ ] Strict-validate this phase and the parent arc.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline | Reproduce current broader suite failures | Vitest command selected during phase planning |
| Targeted | Files changed by triage | Focused Vitest runs |
| Regression | Broader `system-code-graph` suite | Full suite or documented quarantine baseline |
| Documentation | Phase and parent validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 009 phase 007 implementation summary | Source evidence | Available | Required to recover the original failure inventory. |
| Broader `system-code-graph` Vitest suite | Verification | Pending phase execution | Required to determine current failure state. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Triage changes hide failures without rationale, product fixes regress targeted tests, or verification cannot reproduce the intended baseline.
- **Procedure**: Revert only this phase's code and test edits, preserve the observed test output in `implementation-summary.md`, and return to the documented baseline for replanning.
<!-- /ANCHOR:rollback -->
