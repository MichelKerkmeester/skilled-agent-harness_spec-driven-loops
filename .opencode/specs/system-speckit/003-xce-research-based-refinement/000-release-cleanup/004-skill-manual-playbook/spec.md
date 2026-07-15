---
title: "Feature Specification: Skill Manual Playbook"
description: "Add manual_testing_playbook scenarios for each 027 feature, flag, and CLI surface, then bump the drift-prone count self-check."
trigger_phrases:
  - "skill manual playbook"
  - "027 release cleanup 004-skill-manual-playbook"
  - "shipped 027 alignment"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/004-skill-manual-playbook"
    last_updated_at: "2026-06-10T16:12:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added release-hardening manual testing scenarios and reconciled the playbook count guard"
    next_safe_action: "Run the new manual scenarios in the later model-execution phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-skill-manual-playbook-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
      - "Operator approved manual playbook implementation scope and no-build constraint."
---
# Feature Specification: Skill Manual Playbook

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Add manual_testing_playbook scenarios for each 027 feature, flag, and CLI surface, then bump the drift-prone count self-check.

### Purpose
Inventory the owned surface, align its current-state claims to shipped 027 reality, and verify that the resulting surface is coherent with schema v37, default-off flags, CLI front doors, constitutional rules, memory features, and doctrine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory current claims on .opencode/skills/**/manual_testing_playbook/**.
- Align references to schema v37 and the shipped default-off flags.
- Align references to phase 010 CLI front doors where this surface mentions tooling.
- Align references to the two new constitutional rules and shipped memory behaviors where applicable.
- Verify that peck, gem, memclaw, and openltm doctrine is represented only where relevant.
- Note: Epic Phase-5 will run these via MiMo and DeepSeek.

### Out of Scope
- Source-code changes during this scaffold.
- Command, agent, skill, or YAML edits during this scaffold.
- Structural router or presentation split changes owned by 027/011.
- Claiming implementation before verification evidence exists.

### Files to Change
Planned future implementation scope; this scaffold only creates spec docs and metadata.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/**/manual_testing_playbook/** | Future Review/Modify | Inventory, align, and verify current-state documentation claims |
| implementation-summary.md | Created | Planned stub for strict validation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Inventory before alignment | Existing outward claims are listed before edits begin |
| R2 | Preserve scaffold scope | This phase does not edit source, command, agent, skill, or YAML files during scaffold creation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R3 | Align shipped 027 claims | Surface mentions schema v37, default-off flags, CLI front doors, constitutional rules, memory features, and doctrine only when accurate |
| R4 | Verify current-state coherence | Strict validation passes and implementation evidence names the checks used |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The phase has a clear inventory -> align -> verify handoff.
- Completion is 100% after implementation changes and verification evidence were recorded.
- The surface does not conflict with 027/011 ownership boundaries.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped 027 source of truth | Inaccurate outward docs if the current reality is misread | Inventory before alignment and cite verified checks |
| Risk | Scope collision with 027/011 | Command structural work could be duplicated | Keep this phase content-only and defer structural split to 027/011 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for scaffold. Implementation may discover surface-specific conflicts.
<!-- /ANCHOR:questions -->
