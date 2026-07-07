---
title: "Feature Specification: deep-ai-council deep-mode docs + script tests (001)"
description: "Close the five deferred follow-ons from the 004 deep-ai-council release-cleanup phase-5 loop: document deep-mode session hierarchy + findings-registry, cross-link graph replay, reconcile the DAC-001 rename narrative, and add vitest coverage for 5 untested scripts."
trigger_phrases:
  - "deep-ai-council deep-mode docs"
  - "deep-ai-council follow-on"
  - "findings-registry reference"
  - "deep-ai-council script tests"
  - "DAC-001 narrative reconciliation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/012-deep-ai-council-deep-mode-docs-and-tests"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-spec-authored"
    next_safe_action: "author-plan-tasks-checklist-then-execute"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011001"
      session_id: "131-000-011-followon"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope: all 5 deferred items from 004 phase-5 (operator: 'All 5')"
      - "Mode: plan + execute autonomously (operator)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-ai-council deep-mode docs + script tests

---

## EXECUTIVE SUMMARY

The 004 deep-ai-council release-cleanup deep-research loop converged at iter 4 and deferred five follow-ons as net-new work beyond cleanup scope. This packet closes all five: two new references documenting deep mode and the findings registry, a cross-link from `graph_support.md` to the replay script, a narrative reconciliation of the DAC-001/002 rename entries, and vitest coverage for the five currently-untested scripts.

**Source**: `004-deep-ai-council/research/convergence-summary.md` + `resource-map.yaml` `phase_5_augmentation` (F-002, F-003, F-004, F-006, DAC-001 flag).

**Level**: 2 (additive, low-risk doc + test work; LOC trends higher but no architectural change — Level is soft guidance).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Packet** | `000-release-cleanup` (lean grouping node) |
| **Source Packet** | `004-deep-ai-council` (phase-5 deferrals) |
| **Target Skill** | `.opencode/skills/deep-ai-council/` (v2.1.0.0) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-ai-council skill documents single-round council behavior thoroughly, but the v2.0.0.0 deep-mode capability (session → topic → round, exposed via `/deep:ask-ai-council`) is implemented in `scripts/orchestrate-session.cjs` + `orchestrate-topic.cjs` + `scripts/lib/findings-registry.cjs` with no reference documentation. The replay script's derivation algorithm is undocumented. Five scripts lack tests. The DAC-001/002 catalog + playbook entries narrate a rename *to* `deep-ai-council` that v1.2.0.0 reverted to `ai-council.*`.

### Purpose

Close the five deferred follow-ons so the deep-ai-council skill's documentation covers deep mode end-to-end, its scripts are test-covered, and the runtime-rename narrative matches the current `ai-council.*` reality.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **F-002**: new `references/deep_mode.md` documenting the session→topic→round hierarchy, `session-state.jsonl` / `round-state.jsonl`, cost guards, and the `deep-loop-runtime/lib/council/` dependency.
- **F-003**: new `references/findings_registry.md` documenting the findings-registry schema, cross-topic priors, fingerprint dedup, and fs-locking.
- **F-004**: edit `references/graph_support.md` to cross-link `replay-graph-from-artifacts.cjs` and summarize its derivation algorithm.
- **F-006**: add vitest coverage for `lib/persist-artifacts.cjs`, `lib/rollback.cjs`, `lib/audit-trail.cjs`, `advise-council-completion.cjs`, `replay-graph-from-artifacts.cjs`.
- **DAC-001**: reconcile the `01--runtime-routing-and-rename` feature_catalog + playbook narrative with the current `ai-council.*` reality.
- Wire the 2 new references into `SKILL.md` §3 RESOURCE_MAP + §6 REFERENCES and `README.md` §9.

### Out of Scope

- Changing deep-mode runtime behavior or the scripts' logic (docs + tests only).
- The 004 packet (complete) or other 000-release-cleanup siblings.
- Renaming the agent files (declined in 004 AF-0008).

### Files Changed

| File Path | Change Type | Item |
|-----------|-------------|------|
| `.../011-.../spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create | Packet docs |
| `references/deep_mode.md` | Create | F-002 |
| `references/findings_registry.md` | Create | F-003 |
| `references/graph_support.md` | Modify | F-004 |
| `scripts/tests/{persist-artifacts,rollback,audit-trail,advise-council-completion,replay-graph}.vitest.ts` | Create | F-006 |
| `feature_catalog/01--runtime-routing-and-rename/**` + `manual_testing_playbook/01--runtime-routing-and-rename/**` | Modify | DAC-001 |
| `SKILL.md`, `README.md` | Modify | Wire new refs |
| `changelog/v2.1.1.0.md` | Create | Release note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec folder passes `validate.sh --strict` | Exit 0 |
| REQ-002 | New references conform to `skill_reference_template.md` + HVR ≥85 | sk-doc package validate passes; HVR scan clean |
| REQ-003 | New vitest files pass | `node -c` clean; tests run green (or documented skip if a harness dep is missing) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | The 2 new references are wired into SKILL §3 RESOURCE_MAP + §6 REFERENCES | grep shows both referenced |
| REQ-011 | DAC-001/002 narrative matches current `ai-council.*` reality | No claim that the agent identity is `deep-ai-council` file-named |
| REQ-012 | No deep-mode runtime/script logic changed | `git diff` on scripts shows only new test files, no edits to existing `.cjs` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validate exits 0; sk-doc package valid; HVR ≥85 on new references.
- **SC-002**: All 5 deferred items (F-002/003/004/006 + DAC-001) resolved and traced back to the 004 source.
- **SC-003**: 5 new vitest files cover the 5 scripts; existing scripts unchanged.
- **SC-004**: Advisor still surfaces deep-ai-council at threshold 0.8.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tests need a vitest harness/deps not present | Medium | Match the existing 4 vitest files' import style; document skip if a dep is missing |
| Risk | New references drift from script behavior | Medium | Cite file:line; read the scripts before documenting |
| Risk | Wiring new refs into SKILL §3 touches the Smart Router | Low | §3 RESOURCE_MAP additions only; preserve router pseudocode |
| Dependency | sk-doc `skill_reference_template.md` + `hvr_rules.md` | Reference authoring | Verified present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: Strict validator completes in <10s per invocation.
- **NFR-S01**: No secrets in any new reference or test file.
- **NFR-R01**: All changes are additive (new references + tests + narrative); no deep-mode runtime or script logic changes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **vitest harness dependency missing**: author the 5 test files matching the existing 4; if `vitest run` cannot execute locally, record the `node -c` syntax pass plus a documented skip as the evidence.
- **DAC-001 narrative**: correct the rename direction only; do not rewrite the feature's purpose. Paths already point to `ai-council.*` (closed by 004 F-001).
- **graph_support edit**: additive replay cross-link only; do not alter the documented node/edge kinds.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 2 new references + 1 edit + 5 tests + narrative reconcile |
| Risk | 6/25 | Additive docs/tests; no logic change |
| Coordination | 4/15 | Single skill, single session |
| **Total** | **~30/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope + mode confirmed by operator (all 5 items, plan + execute autonomously).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md`
- **Source**: `../004-deep-ai-council/research/convergence-summary.md`
- **Target Skill**: `.opencode/skills/deep-ai-council/`
