---
title: "Feature Specification: Retire memory-era tests and revive the phase tests"
description: "Spec-kit no longer keeps an embedding-backed memory database, but fourteen files in its test tree still target it, its removed modules or a removed template layout, and five tests for live features never run. The dead files go with their references, and the live ones load, run in throwaway repos and join the package test scripts. Reviving them exposed three phase defects in create.sh and validate.sh, fixed here. Follow-up fixes keep create.sh --json output to its payload, make a scaffold with no install match a tsx one, and fill the one phase map the marker defect left empty."
trigger_phrases:
  - "retire memory-era tests"
  - "dead spec-kit test files"
  - "test-phase-validation cannot load"
  - "manual playbook runner retired"
  - "memory-quality test never collected"
  - "phase map rows never filled"
  - "empty phase child skipped"
  - "no-tsx template fallback"
  - "level contract fallback"
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
| **Status** | Implemented |
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
- The manual playbook runner's fixture imports fourteen runtime modules, and thirteen of them no longer exist.

Five tests for live features check nothing. `test-phase-validation.js` and `test-phase-system.js` are CommonJS files in an ES-module package and throw at load, and when they last ran they wrote into the checkout's `.opencode/specs`, the legacy root removed on 2026-09-20. `test-phase-system.sh` stops at its first case, because `create.sh` needs a description generator that its throwaway repo lacks. The two `memory-quality-*.test.ts` files use a suffix the `cli` vitest project does not collect. No package script runs any of the five.

Reviving them exposed three defects in the code they cover:

- `create.sh --phase` never fills a new parent's phase map. Commit `81e26f770fa` renamed the template's row markers and left the script matching the old text, so since 2026-09-07 every new phase parent has an empty map with the marker still in it. `specs/sk-design/020-chart-and-diagram-review` is one.
- `create.sh --parent` prints appended rows after the blank line that ends the phase table, so they render outside the map.
- `validate.sh --recursive` skips a phase child with no packet docs. The shell engine validated every child, and when it was deleted on 2026-08-29 an empty child stopped being checked at all.

Running them green left three more in the same scripts:

- `create.sh --json` printed the description generator's status line ahead of the JSON, so a strict parser failed on its output.
- Without tsx at the skill root, the template renderer fell back to a regex that kept only the first level block and ignored `--out-dir`. From a tree with no install, `create.sh` wrote no `spec.md`, `plan.md` or `tasks.md`, put a stray template line into `CREATED_FILES` and exited 0.
- The level contract fallback in `template-utils.sh` returned only the required docs, so the same tree lost `acceptance-criteria.md` and `implementation-summary.md`, and it accepted a malformed manifest row.

### Purpose
Every test file left in spec-kit loads, tests code that exists and runs from a package script, and none of them writes into the checkout. The defects those tests uncover are fixed, including the ones that only show with no install.
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
- Fix the three defects the revived tests expose: the unfilled phase map, the appended rows outside it, and the unchecked empty phase child
- Keep `create.sh --json` stdout to the JSON payload
- Make the renderer and level contract fallbacks produce what their TypeScript sources produce, and have both renderers read a template path given before `--level`
- Fill the phase map of `specs/sk-design/020-chart-and-diagram-review`, the one parent the marker defect left empty, and give its `synthesis.md` the frontmatter it lacked
- Report on stderr each generated file `create.sh` skips because the build or install is missing

### Out of Scope
- The live embedding stack under `shared/embeddings/` and its advisor-owned tests. It still backs the skill advisor
- Released changelog entries that name the removed files. They are history
- Spec packet history under `specs/`, apart from the sk-design/020 map and synthesis frontmatter filled here. It records what was true then
- Other scripts in `runtime/cli/tests/` that no package script runs. They get their own review
- Writing the description and graph metadata of a scaffold made with no build. Both need compiled or tsx-run generators, so `create.sh` skips them and says so
- A numbered child that holds only loop artifacts such as `research/` or `review/`. It is not a phase and stays skipped

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
| `runtime/cli/spec/create.sh` | Modify | Match the template's row markers, and append rows where each table ends |
| `runtime/cli/spec/validate.sh` | Modify | Validate an empty phase child instead of skipping it |
| `runtime/cli/tests/test-phase-validation.js`, `test-phase-system.js` | Modify | ES-module header, create.sh work in a throwaway git repo, assertions brought up to date |
| `runtime/cli/tests/test-phase-system.sh` | Modify | Generator stub in every case, the real renderer, one work root the trap removes |
| `runtime/cli/tests/memory-quality-phase2-pr3.test.ts`, `memory-quality-phase6-migration.test.ts` | Rename | To `.vitest.ts` |
| `runtime/cli/package.json` | Modify | Run the revived phase tests |
| `runtime/cli/tests/test-five-checks.js` | Delete | Tests a removed template layout |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modify | Remove the archive folder entries |
| `runtime/cli/spec/create.sh`, `runtime/cli/tests/test-phase-system.js` | Modify | Generator output to stderr, and a strict parse of `--json` stdout |
| `runtime/cli/templates/inline-gate-renderer.sh`, `inline-gate-renderer.ts` | Modify | A plain-JavaScript copy of the renderer as the fallback, and a template path read before `--level` |
| `runtime/cli/lib/template-utils.sh` | Modify | A plain-JavaScript copy of the level contract resolver as the fallback |
| `runtime/cli/tests/inline-gate-renderer-fallback.vitest.ts`, `level-contract-fallback.vitest.ts` | Create | Hold each fallback to its TypeScript source |
| `runtime/cli/tests/inline-gate-renderer.vitest.ts` | Modify | Cover a template path given before `--level` |
| `specs/sk-design/020-chart-and-diagram-review/spec.md`, `synthesis.md` | Modify | Fill its phase map, and add the synthesis frontmatter |
| `runtime/cli/tests/create-without-build.vitest.ts` | Create | Fail if a scaffold with no build skips a generated file without a warning |

All paths are under `.skilled/skills/system-spec-kit/` unless they start with `sk-doc/` (under `.skilled/skills/`) or `specs/`, or are `CONTRIBUTING.md` (repo root).
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
| REQ-007 | A new phase parent's map lists its phases, and appended rows stay inside the table | The revived phase tests fail before the create.sh fixes and pass after |
| REQ-008 | An empty phase child is validated, and an artifact-only child is still skipped | The empty-child assertions fail before the validate.sh fix and pass after, and no current parent's recursive result changes |
| REQ-009 | `create.sh --json` prints the JSON payload and nothing else on stdout | The phase test parses stdout strictly and passes |
| REQ-010 | With no install, `create.sh` scaffolds the documents a tsx checkout does | Each fallback matches its TypeScript source in a parity test that failed before its port, and an install-free Level 2 and 3 scaffold differs from a tsx one only in timestamps |
| REQ-011 | No phase parent keeps the unfilled row markers | A search of `specs/` for the phase row marker finds no `spec.md` |
| REQ-012 | A scaffold that skips a generated file for want of a build says so, and a phase parent that cannot get its description stops | Level and appended-phase scaffolds with no build print a warning naming the missing generator; `--phase` and `--level phase-parent` both exit 1; the test fails without each |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fourteen dead files are gone and nothing outside history names them
- **SC-002**: Five live-feature tests run from package scripts and pass
- **SC-003**: The three defects they exposed are fixed, each proved by a revived test that failed before its fix
- **SC-004**: A tree with no install scaffolds the same documents as a tsx checkout, reports what it could not generate, and `--json` output parses strictly
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A deleted test still covered live behaviour | Med | Each deletion is traced to a removed module or layout, and the live embedding factory is confirmed covered by five vitest suites |
| Risk | A revived test exposes a real regression | Med | Keep the assertion rather than weaken it. Three did, and the operator chose to fix all three in this packet |
| Risk | The empty-child fix turns a current recursive run red | Med | Only a child with no files at all is newly validated. No parent in the tree has one, and the six parents with an artifact-only child keep their results |
| Risk | A fallback drifts from its TypeScript source | Med | Each has a parity test comparing its output with its source's, at every level |
| Dependency | The compiled description generator under `runtime/cli/dist/` | Low | `test:legacy` builds before it runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
