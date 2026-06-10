---
title: "Feature Specification: Public Root README"
description: "Rewrite the repo-root README to current shipped reality: MCP and CLI dual-stack, memory capabilities, skill, command, and agent surfaces. This is the capstone and should be authored last."
trigger_phrases:
  - "public root readme"
  - "027 release cleanup 001-public-root-readme"
  - "shipped 027 alignment"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/001-public-root-readme"
    last_updated_at: "2026-06-10T16:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Rewrote the public root README to current framework state and reconciled phase evidence"
    next_safe_action: "Monitor README drift"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:67a618d91957ff4c7a0fce33d104f4ebba1dd63cd494ef2d25547ab73c042d63"
      session_id: "2026-06-10-001-public-root-readme-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator pre-approved this release-cleanup phase and scope."
---
# Feature Specification: Public Root README

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rewrite the repo-root README to current shipped reality: MCP and CLI dual-stack, memory capabilities, skill, command, and agent surfaces. This is the capstone and should be authored last.

### Purpose
Inventory the owned surface, align its current-state claims to shipped 027 reality, and verify that the resulting surface is coherent with schema v37, default-off flags, CLI front doors, constitutional rules, memory features, and doctrine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory current claims on README.md.
- Align references to schema v37 and the shipped default-off flags.
- Align references to phase 010 CLI front doors where this surface mentions tooling.
- Align references to the two new constitutional rules and shipped memory behaviors where applicable.
- Verify that peck, gem, memclaw, and openltm doctrine is represented only where relevant.
- Note: Capstone phase; verify after the other outward surfaces settle.

### Out of Scope
- Source-code changes during this scaffold.
- Command, agent, skill, or YAML edits during this scaffold.
- Structural router or presentation split changes owned by 027/011.
- Claiming implementation before verification evidence exists.

### Files to Change
Implemented capstone documentation scope only.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| README.md | Modified | Rewrote the public root entry point to current framework state |
| implementation-summary.md | Modified | Recorded delivered scope and verification evidence |
| tasks.md | Modified | Marked task completion with evidence |
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

- The phase followed an inventory -> align -> verify handoff.
- Completion is 100% with implementation evidence recorded.
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
