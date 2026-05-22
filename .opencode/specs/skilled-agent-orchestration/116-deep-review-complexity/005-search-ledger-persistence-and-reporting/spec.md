---
title: "Feature Specification: 116/005 — Search Ledger Persistence and Reporting"
description: "Persist search ledger evidence, search debt, ruled-out candidates, and clean-search proof through reducer, dashboard, and report surfaces."
trigger_phrases:
  - "search ledger persistence"
  - "deep-review search debt reporting"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/005-search-ledger-persistence-and-reporting"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 005 planning packet."
    next_safe_action: "Persist search debt after v2 validator records are accepted."
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/scripts/reduce-state.cjs"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:1160050000000000000000000000000000000000000000000000000000000000"
      session_id: "116-005-search-ledger-persistence"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 116/005 — Search Ledger Persistence and Reporting

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
| **Phase** | 5 of 8 |
| **Predecessor** | `../004-validator-v2-enforcement/spec.md` |
| **Successor** | `../006-candidate-saturation-and-graphless-gates/spec.md` |
| **Handoff Criteria** | Reducer, dashboard, and final report expose candidate coverage and search debt. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase makes search proof visible to operators after validation accepts rich v2 records.

**Scope Boundary**: Reducer state, dashboard rendering, and final report synthesis.

**Dependencies**:
- Phase 004 validator enforcement.

**Deliverables**:
- `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage` reducer output.
- Dashboard Search Ledger section.
- Final report Search Ledger section before appendix.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Valid ledger rows are not enough if reducer, dashboard, and report outputs drop or hide them. Operators need to see search debt next to severity debt.

### Purpose
Persist and display search proof so no-finding dimensions carry cited clean-search evidence and remaining debt is visible.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reducer registry fields for candidate coverage and search debt.
- Dashboard Search Ledger output.
- Final report Search Ledger section.

### Out of Scope
- Stop-gate blocking behavior.
- Graph vocabulary changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Modify | Persist candidate/search state. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Include report Search Ledger section. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm workflow parity. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Persist candidate coverage. | Registry exposes covered, ruled-out, deferred, blocked, and debt counts. |
| REQ-002 | Preserve null-search evidence. | Clean dimensions show cited ledger rows, not only PASS labels. |
| REQ-003 | Report search debt. | Dashboard and report show search debt next to severity debt. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Reducer fixture proves ledger rows survive.
- Dashboard includes Search Ledger/Search Debt output.
- Final review report includes a first-class Search Ledger section.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Report grows noisy. | Summarize debt counts and link detailed rows to appendix. |
| Dependency | Valid v2 records. | Start after phase 004 validator behavior is stable. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
