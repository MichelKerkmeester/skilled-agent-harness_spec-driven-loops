---
title: "Feature Specification: Migrate High-Volume Skills (Wave B) [133/004-migrate-high-volume-skills/spec]"
description: "De-number ~548 per-feature snippet files across the seven highest-volume skills after system-spec-kit, running one MiMo agent per skill in parallel, each rewriting its own references and self-verifying."
trigger_phrases:
  - "migrate high volume skills denumber"
  - "wave B parallel mimo per skill"
  - "133 phase 004"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/004-migrate-high-volume-skills"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 004 spec during 133 scaffold"
    next_safe_action: "Populate per-skill tasks on entry; run after 002 green"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Migrate High-Volume Skills (Wave B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After system-spec-kit, seven skills carry the bulk of the remaining snippets (~548 files). Each is self-contained (its catalog/playbook references stay within the skill), making them ideal independent units for parallel migration.

### Purpose
Migrate the seven high-volume skills by dispatching one MiMo agent per skill in parallel (operator has authorized N-concurrent), each running the phase-002 tool over its skill, rewriting its own references, and self-verifying.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (skill | catalog | playbook | total)
- `mcp-click-up` — 96 + 39 = 135
- `system-skill-advisor` — 40 + 46 = 86
- `deep-review` — 27 + 49 = 76
- `deep-improvement` — 23 + 48 = 71
- `deep-ai-council` — 32 + 32 = 64
- `deep-research` — 16 + 44 = 60
- `deep-loop-runtime` — 27 + 29 = 56

### Out of Scope
- `deep-ai-council/feature_catalog/FEATURE_CATALOG.md` uppercase anomaly (frozen).
- Other skills (waves A/C).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `{mcp-click-up,system-skill-advisor,deep-review,deep-improvement,deep-ai-council,deep-research,deep-loop-runtime}/{feature_catalog,manual_testing_playbook}/**` | Rename | ~548 snippets de-numbered |
| each skill's root catalog/playbook docs | Modify | Link rewrites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero numbered snippet files remain in the 7 skills | per-skill `rg --files | rg '/[0-9]{2,3}-[a-z]'` = 0 |
| REQ-002 | Each skill's root entry count == feature file count | per-skill reconciliation passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No broken intra-skill links | per-skill link-check = 0 broken |
| REQ-004 | Parallel agents do not cross skill boundaries | each agent's diff is confined to its skill (+ shared referrers handled in 006) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ~548 files de-numbered across 7 skills; folders intact.
- **SC-002**: Each skill independently verified (grep + count + link-check).
- **SC-003**: Parallel dispatch completed without index races (scoped per-skill commits).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | N parallel agents share ONE worktree git index (D3) | Med | agents do file moves+edits only (NO staging); orchestrator stages+commits each skill scoped + sequentially in the worktree — file writes to different skills never conflict, only index ops |
| Risk | A skill links to another skill's snippet | Low | cross-skill referrers deferred to phase 006 sweep |
| Dependency | Phase 002 tool | Blocking | Must be green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Rename history preserved (git R-status); no data loss.

### Security
- **NFR-S01**: Renames performed in an isolated worktree; no secrets touched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Digit-initial slugs (e.g. `4-stage-pipeline-architecture.md`) preserved — only the leading NNN- sequence prefix is stripped.
- Category folders `NN--category-name` kept; never stripped.

### Error Scenarios
- A slug collision makes the tool abort (exit 2) with zero writes; resolved manually before the run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 548 files, 7 skills |
| Risk | 12/25 | Parallel coordination + index race |
| Research | 2/20 | Tool-driven |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Populate per-skill tasks/checklist on entry (7 sub-units from the phase-002 manifest).
<!-- /ANCHOR:questions -->
