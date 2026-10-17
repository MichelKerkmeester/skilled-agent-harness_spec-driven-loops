---
title: "Feature Specification: Phase 11: remaining-limits"
description: "Four limits remain after phase 10: the adapter check misses an identifier default export, the drift guard reports 278 warnings that are mostly spec scratch, the advisor playbook carries 11 validator warnings, and a stress test fails on slow CI runners."
trigger_phrases:
  - "remaining limits"
  - "phase 11 remaining limits"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: remaining-limits

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-17 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-open-ends-cleanup |
| **Successor** | None |
| **Handoff Criteria** | Each of the four items is fixed with a check that fails on the old state, and every gate in plan.md passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the sk-git setup customization specification. It closes four limits left after phase 10 in the areas the doctor battery, sk-code, sk-doc and the advisor runtime own.

**Scope Boundary**: the four items below, and nothing beside them. The route-validate `--dry-run` informational warnings, released changelog entries, `barter/` and `system-deep-loop/deep-research/scripts/reduce-state.cjs` stay out.

**Dependencies**:
- None. Each item touches its own files.

**Deliverables**:
- A battery adapter check that resolves `export default <identifier>;` to its declaration, with one test per declaration form and a negative test.
- A drift guard that skips spec scratch and archive folders, with the real shipped files fixed at their source.
- Zero playbook validator warnings on the Skill Advisor package.
- A lease stress test whose time budget catches a hang, not a slow runner.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. The coordinator writes it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/doctor:git setup` battery reads only an inline default export, so an OpenCode or Pi adapter written as `export default plugin;` reads as unregistered even when `plugin` registers the advisory. The sk-code drift guards pass with 278 warnings, and 236 of them come from throwaway files in spec `scratch/` and `z_archive/` folders, which hides the six warnings on real files. The Skill Advisor playbook carries 11 validator warnings: ten backticked paths that resolve from nowhere and a missing result-persistence marker. The single-writer lease stress test asserts the 10-way race finishes under 250 ms, and CI runners took 414.7 ms and 431.8 ms while every correctness assertion passed.

### Purpose
Each check reports what is true: a registered adapter reads as registered, a drift warning names a file someone ships, the playbook names real paths, and the stress test fails only on a real fault.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Item 1: `adapterExportsBinding` in the git setup battery, plus its tests.
- Item 2: the spec-record skip in `verify_alignment_drift.py` and its test, plus the real files the guard flags.
- Item 3: the ten scenario paths and the index marker in the Skill Advisor playbook.
- Item 4: the time budget in `single-writer-lease-stress.vitest.ts`.

### Out of Scope
- The two `--dry-run` informational warnings from route-validate, which are by design.
- Released changelog entries, version bumps and commits, which the coordinator owns.
- Anything under `barter/` and `reduce-state.cjs`.
- The eight drift warnings on spec research and test files outside `scratch/` and `z_archive/`, which are packet records, not shipped files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Resolve an identifier default export to its top-level declaration |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | One test per declaration form and a negative test |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | Skip `scratch` and `z_archive` below `specs/` |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modify | Spec scratch and archive skip test |
| `.skilled/skills/mcp-code-mode/mcp-server/scripts/check-node.cjs` | Modify | Add `'use strict';` |
| `.skilled/skills/sk-design/shared/scripts/render-screenshots.cjs` | Modify | Add `'use strict';` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | Modify | Add `'use strict';` |
| `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js` | Modify | Add `'use strict';` |
| `.skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py` | Modify | Add the canonical shebang |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/**/*.py` | Modify | Shebang and docstring on 14 stand-in modules |
| `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js` | Untrack | Remove the ignored build artifact from the index, keep the file on disk |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/**` | Modify | Ten real paths and the result-persistence marker |
| `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts` | Modify | Time budget 250 ms to 2,000 ms |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The adapter check resolves `export default <identifier>;` to a top-level function declaration, function expression, arrow or object literal and applies the OpenCode and Pi rules to it | A test per form passes, a negative test fails the row, the battery never executes inspected code, and the new tests fail with the old function restored |
| REQ-002 | The drift guard skips spec scratch and archive folders and still scans shipped files | The verifier test passes, the warning count drops from 278, and no warning remains on a shipped file |
| REQ-003 | The Skill Advisor playbook passes the validator with no warnings | `violations=0 warnings=0` on the package, and the fleet keeps 52 PASS and 5 SKIP |
| REQ-004 | The lease stress test keeps its correctness assertions and gets a 2,000 ms budget | Five local runs pass and the single-winner assertions are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No regression in any gate named in plan.md | Every gate's result line matches or improves on its baseline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The item 1 tests fail when the old function is restored, shown by a mutation check.
- **SC-002**: The doctor runner, the drift guards, the playbook validator and every listed gate pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Identifier resolution accepts a declaration the module does not export | Med | Only top-level declarations count, and a nested-only and an imported identifier are negative cases |
| Risk | The spec skip hides shipped code | Low | Only folders below `specs/` are skipped, and a test proves `src/scratch/` is still scanned |
| Risk | `'use strict';` breaks a sloppy-mode script | Low | Each file is read for sloppy-mode code first and run after the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Each item was checked against the code before the first edit, and plan.md records the evidence.
<!-- /ANCHOR:questions -->

---
