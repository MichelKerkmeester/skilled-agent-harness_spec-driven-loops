---
title: "Feature Specification: Phase 3: stale-jev-canary"
description: "The cli-external-orchestration canary fixture kept a case for the cli-jev transport after that transport moved to the cli-classifier hub, so the hub canary always deferred on it."
trigger_phrases:
  - "stale jev canary"
  - "phase 3 stale jev canary"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: stale-jev-canary

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-admission-corpus-pin |
| **Successor** | 004-pi-ambiguous-denial |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md`.

**Scope Boundary**: Two byte-identical fixture files: the live cli-external canary fixture and its authored archive copy.

**Dependencies**:
- `../research/research.md` section 5

**Deliverables**:
- Both fixtures without the stale case
- Every hub canary at zero failures

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The case `jev-transport-single` expects the prompt "use jev choice to pick a queue" to route to mode cli-jev in the cli-external-orchestration hub. That hub's registry says the transport axis left with cli-jev, which is now a mode of cli-classifier, and the cli-classifier fixture already holds `jev-choice-single` for the same prompt. The all-canaries run printed `all hubs failures 1`, and the merge accepted that as the existing failure.

### Purpose
Remove the case the hub can no longer route, so a red canary again means a real regression.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the case from the live fixture
- Delete it from the authored archive copy, keeping the two identical

### Out of Scope
- The archived compiled `route-gold.typed.json`, a historical build output
- The cli-classifier fixture, which already covers the prompt

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | Modify | Remove `jev-transport-single` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | Modify | Same removal in the authored copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every hub canary passes | The all-canaries script prints `all hubs failures 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The live and authored fixtures stay identical | `diff` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cli-external hub canary runs 14 cases with 0 failures.
- **SC-002**: The guard stays fresh.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing a case loses coverage of the jev prompt | Low | The cli-classifier fixture's `jev-choice-single` covers it and passes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
