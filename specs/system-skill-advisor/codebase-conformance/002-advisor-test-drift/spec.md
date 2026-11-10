---
title: "Feature Specification: Advisor test and playbook drift reconciliation"
description: "Reconciles advisor scorer crashes, test expectations, fixture drift and playbook inventory without weakening gates."
trigger_phrases:
  - "advisor scorer null id crash"
  - "advisor suite expectation drift"
  - "advisor skill list parity"
  - "manual testing playbook inventory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/codebase-conformance/002-advisor-test-drift"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-advisor-test-drift"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Advisor test and playbook drift reconciliation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 019-advisor-test-drift |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Retired or malformed skill projections could crash the advisor scorer. Concurrent changes also left suite baselines and fixtures stale, while the playbook inventory no longer matched its scenario files.

### Purpose
These children keep the scorer from failing on invalid projections and align advisor expectations with confirmed behavior. The playbook table and inventory test also match the actual scenarios, with every gate intact and unrelated failures left with their owners.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `001-code-graph-retirement-drift/` hardens scorer and holdout handling for invalid retired-skill entries, then triages the remaining failures.
- `002-advisor-suite-drift-reconciliation/` updates advisor baselines, corpus, fixtures and skill-list copies to legitimate current behavior.
- `003-playbook-inventory-reconciliation/` aligns the playbook table and inventory test with the scenario files on disk.

### Out of Scope
- Reversing the code-graph retirement or fixing unrelated failures owned by concurrent work.
- Weakening advisor gates or adding and removing manual-testing scenarios.

### Files to Change
The rows below identify each child packet and the change it covers.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-code-graph-retirement-drift/` | Phase | 001-code-graph-retirement-drift | Guard the scorer against retired-skill entries and triage remaining failures |
| `002-advisor-suite-drift-reconciliation/` | Phase | 002-advisor-suite-drift-reconciliation | Reconcile suite expectations to legitimate current behavior |
| `003-playbook-inventory-reconciliation/` | Phase | 003-playbook-inventory-reconciliation | Align playbook links and inventory checks with actual scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-code-graph-retirement-drift/` | Guard scorer inputs and triage residual failures | Complete |
| 2 | `002-advisor-suite-drift-reconciliation/` | Reconcile suite fixtures and baselines to confirmed behavior | Complete |
| 3 | `003-playbook-inventory-reconciliation/` | Align playbook links and inventory checks with live scenarios | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` with a child folder path to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-code-graph-retirement-drift | 002-advisor-suite-drift-reconciliation | 001-code-graph-retirement-drift validates on its own | validate.sh --strict on 001-code-graph-retirement-drift |
| 002-advisor-suite-drift-reconciliation | 003-playbook-inventory-reconciliation | 002-advisor-suite-drift-reconciliation validates on its own | validate.sh --strict on 002-advisor-suite-drift-reconciliation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See the child folders for per-phase spec.md, plan.md and tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for advisor test and playbook drift reconciliation.
<!-- /ANCHOR:requirements -->
