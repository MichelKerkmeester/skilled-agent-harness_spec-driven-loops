---
title: "Feature Specification: Phase 1: canonical-rehome-and-ci-gate"
description: "The cli-devin skill owned five canonical pattern assets (context-budget, per-model-budgets, output-verification, confidence-scoring-rubric, "
trigger_phrases:
  - "cli-devin deprecation phase 1"
  - "canonical-rehome-and-ci-gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/022-cli-devin-deprecation/001-canonical-rehome-and-ci-gate"
    last_updated_at: "2026-06-08T17:34:13.174Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 1 complete: canonical-rehome-and-ci-gate executed and verified"
    next_safe_action: "Proceed to phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: canonical-rehome-and-ci-gate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None (first phase) |
| **Successor** | 002-runtime-code-and-executor-removal |
| **Handoff Criteria** | context-budget + per-model-budgets re-homed; CI gate green (exit 0) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the cli-devin deprecation specification. The verified, line-resolved edit list lives in ../context/context-report.md §2.

**Scope Boundary**: Re-home 5 canonical assets from cli-devin to sk-prompt-models (references/ + assets/)

**Dependencies**:
- Predecessor phase None (first phase) complete

**Deliverables**:
- Re-home 5 canonical assets from cli-devin to sk-prompt-models (references/ + assets/)
- Repoint consumers (cli-opencode sentinel + prompt_templates, sk-prompt-models SKILL.md + pattern-index)
- Patch check-prompt-quality-card-sync.sh (cli_cards + cli_skills) so deletion does not break CI

**Changelog**:
- Phase work recorded in implementation-summary.md.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-devin skill owned five canonical pattern assets (context-budget, per-model-budgets, output-verification, confidence-scoring-rubric, quota-fallback) that sk-prompt-models and cli-opencode reference as the source of truth, and two CI scripts referenced cli-devin paths. Deleting cli-devin without re-homing these orphans the canonical docs and breaks CI.

### Purpose
Re-home the five canonical assets into sk-prompt-models, repoint every consumer, and patch the CI gate so the skill directory can later be deleted without dangling references or CI failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-home 5 canonical assets from cli-devin to sk-prompt-models (references/ + assets/)
- Repoint consumers (cli-opencode sentinel + prompt_templates, sk-prompt-models SKILL.md + pattern-index)
- Patch check-prompt-quality-card-sync.sh (cli_cards + cli_skills) so deletion does not break CI

### Out of Scope
- Runtime executor code (phase 002)
- swe-1.6 registry removal (phase 003)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt-models/references/context-budget.md` | Create | Re-homed canonical budget engine (swe-1.6 dropped) |
| `sk-prompt-models/assets/per-model-budgets.json` | Create | Re-homed budgets (swe-1.6 dropped) |
| `sk-prompt-models/references/{output-verification,quota-fallback}.md + assets/confidence-scoring-rubric.md` | Create | Re-homed canonical assets |
| `cli-opencode/references/context-budget.md` | Modify | Sentinel repointed to new canonical home |
| `check-prompt-quality-card-sync.sh` | Modify | Removed cli-devin from cli_cards + cli_skills |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 canonical assets exist at sk-prompt-models paths | Files present + jq-valid + coherent |
| REQ-002 | No consumer points at a cli-devin canonical path | grep of active consumers = 0 dead links |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | CI gate passes after cli-devin removed from its arrays | check-prompt-quality-card-sync.sh exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: context-budget + per-model-budgets re-homed; CI gate green (exit 0)
- **SC-002**: output-verification + confidence-scoring-rubric + quota-fallback re-homed; consumers repointed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase None (first phase) | Blocks start | Completed before this phase |
| Risk | Dangling reference after edits | Med | Global grep verification + deep review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — phase complete and verified.
<!-- /ANCHOR:questions -->
