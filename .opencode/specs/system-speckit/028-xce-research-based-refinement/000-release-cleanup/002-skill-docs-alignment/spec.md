---
title: "Feature Specification: Skill Docs Alignment"
description: "Align every skill SKILL.md, README, assets, and references with shipped flags and behaviors while preserving the narrative house voice. Reconcile ENV_REFERENCE flag completeness, including SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT."
trigger_phrases:
  - "skill docs alignment"
  - "027 release cleanup 002-skill-docs-alignment"
  - "shipped 027 alignment"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/002-skill-docs-alignment"
    last_updated_at: "2026-06-10T15:29:12Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Aligned stale skill documentation and ENV_REFERENCE to shipped 027 reality"
    next_safe_action: "Review validation evidence and proceed with release-cleanup sibling lanes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-skill-docs-alignment-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Feature Specification: Skill Docs Alignment

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
Align every skill SKILL.md, README, assets, and references with shipped flags and behaviors while preserving the narrative house voice. Reconcile ENV_REFERENCE flag completeness, including SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT.

### Purpose
Inventory the owned surface, align its current-state claims to shipped 027 reality, and verify that the resulting surface is coherent with schema v37, default-off flags, CLI front doors, constitutional rules, memory features, and doctrine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory current claims on .opencode/skills/**.
- Align references to schema v37 and the shipped default-off flags.
- Align references to phase 010 CLI front doors where this surface mentions tooling.
- Align references to the two new constitutional rules and shipped memory behaviors where applicable.
- Verify that peck, gem, memclaw, and openltm doctrine is represented only where relevant.
- Note: Broadest phase; it is itself sub-phaseable by skill group.

### Out of Scope
- Source-code changes.
- Command, agent, or YAML edits.
- Structural router or presentation split changes owned by 027/011.
- Claiming implementation before verification evidence exists.

### Files Changed
Only stale documentation surfaces were updated. Candidate skills that already matched shipped 027 reality were left untouched.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/SKILL.md | Modified | Added concise schema v37 and default-off hardening pointer |
| .opencode/skills/system-spec-kit/README.md | Modified | Updated schema history and memory-hardening feature narrative |
| .opencode/skills/system-spec-kit/references/memory/memory_system.md | Modified | Corrected schema baseline, 37-tool surface, tool table, and scan behavior |
| .opencode/skills/system-spec-kit/references/config/environment_variables.md | Modified | Corrected 37-tool count and added default-off 027 flag table |
| .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md | Modified | Added missing 027 flags and bumped documented variable count |
| .opencode/skills/system-spec-kit/feature_catalog/bug-fixes-and-data-integrity/schema-version-history-v28-v30.md | Modified | Updated current-state schema history from v30 to v37 |
| .opencode/skills/cli-opencode/SKILL.md | Modified | Added daemon-backed CLI front-door guidance for Spec Kit runtime handback |
| implementation-summary.md | Modified | Recorded drift inventory, evidence, and completion status |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Inventory before alignment | Existing outward claims were listed before edits began |
| R2 | Preserve scope | No source, command, agent, or YAML files were edited |

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
- Completion is 100% with implementation evidence recorded.
- The surface does not conflict with sibling lane ownership boundaries.
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
