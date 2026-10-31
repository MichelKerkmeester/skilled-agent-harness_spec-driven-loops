---
title: "Feature Specification: Phase 28: advisor-stress-fixtures"
description: "Two skill-advisor stress tests failed because their fixtures predated code changes: one still spelled the future-skills folder z_future after the kebab-case migration, and one still read the advisor request from argv after the plugin moved it to stdin."
trigger_phrases:
  - "advisor stress test fixtures"
  - "z-future stress fixture"
  - "plugin bridge stress stdin request"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 28: advisor-stress-fixtures

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
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 28 |
| **Predecessor** | 027-derived-sanitizer-instruction-shape |
| **Successor** | None |
| **Handoff Criteria** | The full skill-advisor stress suite passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the doctor audit follow-ups. Phase 026 noted that stress test `sa-016` failed on main. Running the whole stress suite while fixing it surfaced a second stale test, `sa-034`. No CI workflow sets `SPECKIT_RUN_STRESS`, so neither failure showed in CI.

**Scope Boundary**: Two stress test files under `system-skill-advisor/runtime/stress-test/skill-advisor/`. No runtime code changes.

**Dependencies**:
- `lib/lifecycle/archive-handling.ts`, which classifies `/z-future/` paths as future
- The OpenCode advisor plugin, which writes its request to the child's stdin

**Deliverables**:
- `sa-016` fixture paths spelled `z-future`
- `sa-034` reading the request from stdin and checking that argv carries no prompt text

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The kebab-case migration renamed the code's future-folder check from `/z_future/` to `/z-future/` but left `sa-016` building `z_future` paths, so 160 future skills read as active. The plugin moved its advisor request from `--options` and `--prompt` arguments to stdin so the prompt never reaches the process table, but `sa-034` still parsed argv and threw on a path where it expected JSON.

### Purpose
A stress suite that tests the code as it is, so a real regression shows as the only failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Respell the two `sa-016` fixture paths
- Read the `sa-034` request from the mocked child's stdin, assert the byte budget against the whole request and assert argv carries no prompt text

### Out of Scope
- Accepting both `z_future` and `z-future` in the lifecycle code
- Adding the stress suite to CI

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts` | Modify | z-future paths |
| `stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Modify | stdin request |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The stress suite passes | `SPECKIT_RUN_STRESS=true vitest run --config vitest.stress.config.ts` reports every test passed |
| REQ-002 | The tests still assert the behavior | `sa-016` still requires 500 routable entries of 900; `sa-034` still requires the request to fit the byte budget |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The unit suite is unaffected | The advisor suite passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The stress suite moves from 2 failures to 0.
- **SC-002**: `sa-034` now also fails if prompt text appears in argv.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A fixture edit hides a real regression | Low | Both failures trace to a dated code change whose new behavior is intended; the assertions keep their thresholds |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

