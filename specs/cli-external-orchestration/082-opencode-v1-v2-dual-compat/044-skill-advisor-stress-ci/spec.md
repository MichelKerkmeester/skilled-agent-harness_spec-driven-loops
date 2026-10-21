---
title: "Feature Specification: Phase 44: skill-advisor-stress-ci"
description: "The Skill Advisor Stress Tests workflow has failed on every run since 2026-10-19 because its OpenCode plugin stress harness still calls the advisor plugin's default export as a function, and that export has been a dual-export object since the hard-plugin port. Four of the 64 sa-034 tests die on `TypeError: default is not a function`."
trigger_phrases:
  - "skill advisor stress ci"
  - "phase 44 skill advisor stress ci"
  - "sa-034 default is not a function"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 44: skill-advisor-stress-ci

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/186-skill-advisor-stress-ci` |
| **Parent Spec** | ../spec.md |
| **Phase** | 44 of 44 |
| **Predecessor** | 042-hooks-and-plugins-held-fixes |
| **Successor** | None |
| **Handoff Criteria** | The stress suite passes 65 of 65 locally and on CI at the pushed main commit, and the dual-export object on the plugin's default export is unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 44** of the OpenCode v1 and v2 dual compatibility specification. It repairs the one workflow the plugin port broke, without touching the plugin the port produced.

**Scope Boundary**: the four advisor runtime test files named in Files to Change. `.opencode/plugins/system-skill-advisor.js` and `.opencode/plugins/lib/v2-bridge.js` are out of bounds: the dual-export object they produce is the contract both OpenCode versions load.

**Dependencies**:
- Commit `32e1f92687`, this packet's hard-plugin port, which made the advisor plugin's default export `{ id, setup, server }`.
- `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts`, which asserts that shape for every plugin in the folder.

**Deliverables**:
- The stress harness builds its hooks through `.server`, and one new test pins the shape of the default export.
- The three runtime tests that called the same export as a function go through `.server` too.
- A before and after count for the stress suite, the runtime vitest suite, the plugin suite and the dual-version battery.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.github/workflows/skill-advisor-stress.yml` has failed every run since 2026-10-19, last green at `be234e6f94` and first red at `fe1f8a9a53`. It fails 4 of 64 sa-034 tests with `TypeError: default is not a function`: the stress harness imports the advisor plugin's default export and calls it, but commit `32e1f92687` had already turned that export into the `{ id, setup, server }` object the dual-export contract requires. The plugin is right and the harness is stale, so a green workflow needs a test change, not a plugin change.

### Purpose
The Skill Advisor Stress Tests workflow goes green again, and a test keeps the harness on the `.server` factory the dual export actually carries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `opencode-plugin-bridge-stress.vitest.ts`: import the default export as the dual-export object and call its `server` factory.
- One new stress test that asserts the default export keeps `id`, `setup` and `server`.
- `compiled-routing-consumption.vitest.ts`, `skill-graph-diagnostic-redaction.vitest.ts` and `system-skill-advisor-plugin.vitest.ts`: the same `.server` call at their four call sites.

### Out of Scope
- The plugin and the bridge: `.opencode/plugins/system-skill-advisor.js` and `.opencode/plugins/lib/v2-bridge.js` keep the export both OpenCode versions load.
- The 8 remaining runtime vitest failures (python-compat, settings-driven-invocation-parity, advisor-corpus-parity, advisor-graph-health, python-ts-parity, ambiguity-slice, skill-advisor-cli-parity) - they assert scorer, corpus and settings behaviour, fail identically before this change, and belong to the advisor owner.
- Adding the advisor runtime's default vitest suite to a workflow - that is a CI-coverage decision, recorded as a follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Modify | `makePlugin` calls `skillAdvisorPlugin.server(...)`; adds the dual-export shape test |
| `.skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-consumption.vitest.ts` | Modify | Both call sites go through `.server` |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-diagnostic-redaction.vitest.ts` | Modify | The plugin call goes through `.server` |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | The extracted factory is `skillAdvisorPlugin.default.server` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The stress suite passes in full under its own config. | `SPECKIT_RUN_STRESS=true vitest run --config vitest.stress.config.ts` reports 65 passed of 65, against 60 of 64 before (`scratch/after/stress-after.txt`). |
| REQ-002 | The plugin's dual export is untouched. | `git diff` over `.opencode/plugins/system-skill-advisor.js` and `.opencode/plugins/lib/v2-bridge.js` is empty, and the purity test still passes 1 of 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A test pins the export shape the harness depends on. | The new test asserts `id`, `setup` and `server` on the default export, and reverting the harness to a direct call brings the four `default is not a function` failures back (`scratch/mutation/m1-call-default-directly.txt`). |
| REQ-004 | No runtime test calls the dual export as a function. | All four runtime call sites go through `.server`; runtime vitest moves from 108 failed / 1090 passed to 8 failed / 1190 passed, and the 8 left fail identically before the change. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Skill Advisor Stress Tests workflow passes on CI at the pushed main commit, after failing every run since 2026-10-19.
- **SC-002**: The stress suite reports 65 of 65 locally, and the runtime vitest failure count falls from 108 to the 8 unrelated assertions that predate this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The dual-export object stays what `dualPlugin` returns | High | The plugin and the bridge are out of scope, and the purity test fails if the shape changes |
| Risk | A `.server` call that satisfies the harness but weakens what it checks | Med | The behavioural assertions are untouched, and the mutation run proves they still catch a direct call |
| Risk | The 8 pre-existing runtime failures read as damage from this phase | Med | Both counts sit in `scratch/baseline/` and `scratch/after/`, and the same file list fails in each |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The two follow-ups for the advisor owner - the 8 runtime vitest failures and the absence of CI coverage for the runtime's default suite - are recorded under Known Limitations in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---
