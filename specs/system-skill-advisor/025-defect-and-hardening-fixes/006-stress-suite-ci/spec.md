---
title: "Feature Specification: Run the skill advisor stress suite in CI"
description: "The skill advisor's stress suite runs only when SPECKIT_RUN_STRESS is set, and no CI workflow set it, so two of its tests failed for months unseen."
trigger_phrases:
  - "skill advisor stress ci"
  - "advisor stress suite workflow"
  - "speckit run stress ci"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Run the skill advisor stress suite in CI

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/079-doctor-command-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The stress suite is gated on `SPECKIT_RUN_STRESS` and uses its own Vitest config. No workflow set that variable, so the suite ran only when a developer remembered to. Two tests drifted from the code they test after a July rename and a September plugin change, and nobody saw it until a manual run.

### Purpose
A stress-suite failure shows up in CI on the push that causes it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A path-filtered workflow that installs what the suite loads and runs `npm run test:stress` with the stress config
- List the workflow in the workflows README

### Out of Scope
- Running the advisor's full unit suite in CI, which no workflow does either; CI runs only selected advisor test files
- Making the workflow a required check, which is a branch-rule setting

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/skill-advisor-stress.yml` | Create | Stress suite workflow |
| `.github/workflows/README.md` | Modify | List the workflow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The workflow runs the whole stress suite | Its command passes 64 of 64 locally and the first CI run passes |
| REQ-002 | Its path filters follow the repository rule | `check-gate-inputs.sh` reports 0 failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The README lists it | Both workflow tables name `skill-advisor-stress.yml` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The workflow's first run on main passes.
- **SC-002**: A change to the advisor runtime, launcher, launcher libraries or plugin triggers it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stress test depends on local state CI lacks | Low | The first CI run is watched; the suite takes about 30 seconds locally |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

