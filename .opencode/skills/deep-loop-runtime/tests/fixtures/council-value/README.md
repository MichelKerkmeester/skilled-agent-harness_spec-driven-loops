---
title: "Council Value Fixtures: Scenario Test Data and Helpers"
description: "Test fixtures for council graph value scenarios, providing scenario fixtures and shared helper utilities that compare runtime CLI graph performance against baseline file reads."
trigger_phrases:
  - "council value fixtures"
  - "DAC-027 DAC-032 scenarios"
  - "council graph performance"
  - "seed helpers council graph"
---

# Council Value Fixtures: Scenario Test Data and Helpers

> Layered fixture directory that provides scenario fixtures and shared seeding utilities for validating runtime council graph query performance against baseline file reading operations.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. KEY FILES](#2--key-files)
- [3. ENTRYPOINTS](#3--entrypoints)
- [4. VALIDATION](#4--validation)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tests/fixtures/council-value/` owns scenario fixtures and helper utilities for the council graph value demonstration system. Each scenario measures the performance improvement of runtime CLI council graph queries over baseline file reading approaches. The fixtures cover six council graph query types: unresolved disagreements, decision support, convergence, convergence blockers, hot nodes and status queries.

Current state:

- 7 TypeScript files and a `data/` subdirectory provide the full fixture surface.
- Six scenario fixture files (`dac-027.ts` through `dac-032.ts`) each export a fixture constant implementing the `ScenarioFixture` interface.
- `seed-helpers.ts` is the shared utility module providing runtime CLI seeding, artifact tree creation, baseline file counting and `buildScenarioFixture` construction.
- Each scenario fixture loads test data from `data/scenarios.cjs`, which defines graph seeds (nodes and edges), artifact trees and expected answers.
- Fixtures call `deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs --loop-type council` through the shared script helper, with direct DB reads only for fixture-side ranking normalization.
- The consumer test `tests/integration/council-graph-value-scenarios.vitest.ts` compares `graph.runtimeCalls` against `baseline.fileReads` and writes its performance metrics report to a temp path by default. Set `COUNCIL_VALUE_REPORT_PATH=.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json` only when intentionally refreshing the tracked report.
- External imports include `node:fs`, `node:path`, `node:url` and `node:module` for filesystem and CommonJS interop operations.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:key-files -->
## 2. KEY FILES

| File | Responsibility |
|---|---|
| `dac-027.ts` | Scenario fixture for unresolved disagreements query performance. |
| `dac-028.ts` | Scenario fixture for decision support query performance. |
| `dac-029.ts` | Scenario fixture for convergence query performance. |
| `dac-030.ts` | Scenario fixture for convergence blockers query performance. |
| `dac-031.ts` | Scenario fixture for hot nodes query performance. |
| `dac-032.ts` | Scenario fixture for council graph status performance. |
| `seed-helpers.ts` | Shared utilities for artifact tree seeding, runtime CLI graph upsert and scenario fixture construction. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `dac-027.ts` | Fixture | Exports the DAC-027 scenario fixture consumed by `tests/council-graph-value-scenarios.vitest.ts`. |
| `dac-028.ts` | Fixture | Exports the DAC-028 scenario fixture consumed by `tests/council-graph-value-scenarios.vitest.ts`. |
| `dac-029.ts` | Fixture | Exports the DAC-029 scenario fixture consumed by `tests/council-graph-value-scenarios.vitest.ts`. |
| `dac-030.ts` | Fixture | Exports the DAC-030 scenario fixture consumed by `tests/council-graph-value-scenarios.vitest.ts`. |
| `dac-031.ts` | Fixture | Exports the DAC-031 scenario fixture consumed by `tests/council-graph-value-scenarios.vitest.ts`. |
| `dac-032.ts` | Fixture | Exports the DAC-032 scenario fixture consumed by `tests/council-graph-value-scenarios.vitest.ts`. |
| `seed-helpers.ts` | Utility | Shared module providing `seedArtifactTree`, `upsertFixtureGraph` and `buildScenarioFixture`. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts
```

Expected result: exit code 0, all 6 tests pass.

To refresh the tracked metrics report intentionally:

```bash
COUNCIL_VALUE_REPORT_PATH=.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json \
  npm run --prefix .opencode/skills/system-spec-kit/mcp_server test:council
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [Data Subdirectory: data/](./data/README.md)
- [Parent: Fixtures](../README.md)
- [Tests: tests/](../../README.md)
- [Council Runtime Lib: lib/council/](../../../lib/council/README.md)

<!-- /ANCHOR:related -->
