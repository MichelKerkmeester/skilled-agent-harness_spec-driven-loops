---
title: "Feature Specification: Skill Feature Catalog"
description: "Add one feature_catalog entry per new 027 feature, bump hand-maintained count self-checks, and keep SOURCE-FILES paths grep-traceable."
trigger_phrases:
  - "skill feature catalog"
  - "027 release cleanup 003-skill-feature-catalog"
  - "shipped 027 alignment"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/003-skill-feature-catalog"
    last_updated_at: "2026-06-10T16:15:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed feature catalog release cleanup"
    next_safe_action: "Report catalog additions"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-003-skill-feature-catalog-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
      - "Operator pre-approved implementation scope for feature_catalog and this phase's spec docs."
---
# Feature Specification: Skill Feature Catalog

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
Add one feature_catalog entry per new 027 feature, bump hand-maintained count self-checks, and keep SOURCE-FILES paths grep-traceable.

### Purpose
Inventory the owned surface, align its current-state claims to shipped 027 reality, and verify that the resulting surface is coherent with schema v37, default-off flags, CLI front doors, constitutional rules, memory features, and doctrine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory current claims on .opencode/skills/**/feature_catalog/**.
- Align references to schema v37 and the shipped default-off flags.
- Align references to phase 010 CLI front doors where this surface mentions tooling.
- Align references to the two new constitutional rules and shipped memory behaviors where applicable.
- Verify that peck, gem, memclaw, and openltm doctrine is represented only where relevant.
- Note: Feature catalog entries must trace to source-file paths.

### Out of Scope
- Source-code changes during this scaffold.
- Command, agent, skill, or YAML edits during this scaffold.
- Structural router or presentation split changes owned by 027/011.
- Claiming implementation before verification evidence exists.

### Files to Change
Implementation updated the system-spec-kit feature catalog and this phase's spec docs only.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/feature_catalog/** | Modified/Added | Add one current-state entry per missing shipped feature and reconcile count self-checks |
| implementation-summary.md | Modified | Record added/skipped entries and verification evidence |
| tasks.md | Modified | Mark tasks complete with evidence |
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
- Completion is 100% with implementation and verification evidence recorded.
- The surface does not conflict with sibling release-cleanup lanes.
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

- None.
<!-- /ANCHOR:questions -->
