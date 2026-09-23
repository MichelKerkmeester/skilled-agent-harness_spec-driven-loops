---
title: "Feature Specification: Retire memory-era tests and revive the phase tests"
description: "Spec-kit no longer keeps an embedding-backed memory database, but fourteen files in its test tree still target it, its removed modules or a removed template layout, and five tests for live features never run. The dead files go with their references, and the live ones load, run in throwaway repos and join the package test scripts."
trigger_phrases:
  - "retire memory-era tests"
  - "dead spec-kit test files"
  - "test-phase-validation cannot load"
  - "manual playbook runner retired"
  - "memory-quality test never collected"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retire memory-era tests and revive the phase tests

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-09-23 |
| **Branch** | None. Work on `main`, packet folder only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-kit dropped its embedding-backed memory database. Only the skill advisor keeps one now. The tests written for the old database outlived it, and so did tests for a template layout that has since changed:

- `test-bug-regressions.js` targets `memory-context.ts`, `memory-parser.ts` and `causal-edges.ts`, all removed. `test-utils.js` holds database helpers nothing imports.
- `test-embeddings-factory.cjs` and `test-embeddings-behavioral.js` load a `shared/dist/embeddings.js` facade that no longer exists. The factory test is a step in the skill's `test:root` script, so `npm test` at the skill root exits 1 there and never reaches either workspace suite.
- `runtime/tests/archive/` holds two suites that test only stubs defined inside themselves. The root vitest project still collects them.
- `test-memory-quality-lane.js` is marked legacy in the feature catalog, and the vitest suites cover the four modules it loads.
- `test-five-checks.js` reads `templates/level-1` through `level_3+` and `addendum`, which the manifest-backed templates replaced.
- The manual playbook runner's fixture imports eight memory-server modules that no longer exist.

Five tests for live features check nothing. `test-phase-validation.js` and `test-phase-system.js` are CommonJS files in an ES-module package and throw at load, and when they last ran they wrote into the checkout's `.opencode/specs`, the legacy root removed on 2026-09-20. `test-phase-system.sh` stops at its first case, because `create.sh` needs a description generator that its throwaway repo lacks. The two `memory-quality-*.test.ts` files use a suffix the `cli` vitest project does not collect. No package script runs any of the five.

### Purpose
Every test file left in spec-kit loads, tests code that exists and runs from a package script, and none of them writes into the checkout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the retired-code tests and the `runtime/tests/archive/` folder, and drop them from scripts, config and docs
- Retire the manual playbook runner, its fixture and the dist-alignment allowlist entries for them
- Revive the three phase tests and the two memory-quality tests, and wire them into `test:legacy`, `test:validation` and the `cli` vitest project
- Delete `test-five-checks.js`
- Refresh the sk-doc README snapshots that list the archive folder

### Out of Scope
- The live embedding stack under `shared/embeddings/` and its advisor-owned tests. It still backs the skill advisor
- Released changelog entries that name the removed files. They are history
- Spec packet history under `specs/`. It records what was true then
- Other scripts in `runtime/cli/tests/` that no package script runs. They get their own review

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/tests/test-bug-regressions.js`, `test-utils.js`, `test-embeddings-behavioral.js`, `test-embeddings-factory.cjs`, `test-memory-quality-lane.js` | Delete | Retired-code tests |
| `runtime/tests/archive/` | Delete | Two stub-only suites and their README |
| `package.json` | Modify | Drop the factory step from `test:root` and remove `test:embeddings` |
| `runtime/vitest.config.ts` | Modify | Drop the exclude for the deleted archive folder |
| `CONTRIBUTING.md` | Modify | Point the embedding check at the live vitest suites |
| `feature-catalog/tooling-and-scripts/session-capturing-pipeline-quality.md`, `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md` | Modify | Drop the quality-lane script |
| `runtime/cli/tests/manual-playbook-runner.{ts,js,vitest.ts}`, `runtime/cli/tests/fixtures/manual-playbook-fixture.{ts,js}` | Delete | Retired playbook runner |
| `runtime/cli/evals/check-source-dist-alignment.ts` | Modify | Drop the two runner allowlist entries |
| `runtime/cli/tests/fixtures/README.md`, `feature-catalog/retrieval/session-recovery-spec-kit-resume.md`, `manual-testing-playbook/manual-testing-playbook.md` | Modify | Drop the runner references |
| `runtime/cli/tests/test-phase-validation.js`, `test-phase-system.js` | Modify | ES-module header, create.sh work in a throwaway git repo |
| `runtime/cli/tests/test-phase-system.sh` | Modify | Install the generator stub in cases 1 and 2 |
| `runtime/cli/tests/memory-quality-phase2-pr3.test.ts`, `memory-quality-phase6-migration.test.ts` | Rename | To `.vitest.ts` |
| `runtime/cli/package.json` | Modify | Run the revived phase tests |
| `runtime/cli/tests/test-five-checks.js` | Delete | Tests a removed template layout |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modify | Remove the archive folder entries |

All paths are under `.skilled/skills/system-spec-kit/` unless they start with `sk-doc/` (under `.skilled/skills/`) or are `CONTRIBUTING.md` (repo root).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No deleted file is still referenced by live code, config or docs | A search outside `specs/` and the changelogs finds no mention |
| REQ-002 | The revived phase tests pass and write nothing into the checkout | Each exits 0, and `git status` shows no new path after a run |
| REQ-003 | The renamed memory-quality tests are collected and pass | The `cli` vitest project lists and passes both files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The package scripts run the revived tests | `test:legacy` and `test:validation` name the three phase tests |
| REQ-005 | The skill's `test:root` no longer stops at a deleted file | The script's first steps pass the point where the factory test ran |
| REQ-006 | The sk-doc README snapshots stay green | `test_readme_manifest.py` and `test_readme_verdict_parity.py` pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fourteen dead files are gone and nothing outside history names them
- **SC-002**: Five live-feature tests run from package scripts and pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A deleted test still covered live behaviour | Med | Each deletion is traced to a removed module or layout, and the live embedding factory is confirmed covered by five vitest suites |
| Risk | A revived test exposes a real regression | Med | Fix only what the first run exposes in the test itself, and report a product defect instead of weakening the assertion |
| Dependency | The compiled description generator under `runtime/cli/dist/` | Low | `test:legacy` builds before it runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
