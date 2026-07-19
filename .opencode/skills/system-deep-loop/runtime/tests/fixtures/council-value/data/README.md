---
title: "Council Value Data: Scenario Definition Module"
description: "Data layer for council graph value scenarios, providing builder functions that generate graph seeds, artifact trees and expected answers for DAC-027 through DAC-032 test cases."
trigger_phrases:
  - "scenarios.cjs"
  - "council value scenario data"
  - "getScenarioData"
  - "listScenarioIds"
---

# Council Value Data: Scenario Definition Module

> Data-only directory that provides a CommonJS module defining builder functions for all six council graph value demonstration scenarios.

---

## 1. OVERVIEW

`tests/fixtures/council-value/data/` owns the `scenarios.cjs` CommonJS module that defines builder functions for the six council graph value scenarios (DAC-027 through DAC-032). Each builder produces complete test data including graph seeds, artifact trees and expected answers for both baseline file-read and runtime CLI council graph approaches.

Current state:

- `scenarios.cjs` is the only file. It exports `getScenarioData` and `listScenarioIds`.
- The `BUILDERS` object contains entries for all six scenarios: DAC-027 (unresolved disagreements), DAC-028 (decision support), DAC-029 (convergence), DAC-030 (convergence blockers), DAC-031 (hot nodes) and DAC-032 (status and interrupted sessions).
- Each scenario includes `graphSeed` (nodes and edges representing council sessions, rounds, seats, claims, evidence, disagreements and decisions), `artifactTree` (simulated markdown files), `baselineExpectedAnswer`, `graphExpectedAnswer` and `baselineMinFileReads`.
- Node kinds use the standard council graph constants: `SESSION`, `ROUND`, `SEAT`, `CLAIM`, `EVIDENCE`, `DISAGREEMENT`, `DECISION` and `RECOMMENDATION`.
- Scenario IDs are normalized to uppercase internally for case-insensitive lookup.
- The module is consumed by `seed-helpers.ts` in the parent directory via CommonJS `require()`, which uses the scenario data to build `ScenarioFixture` objects.
- The file uses strict mode and has no executable test logic.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `scenarios.cjs` | Exports `getScenarioData(scenarioId)` and `listScenarioIds()`. Contains the `BUILDERS` object with builder functions for all six DAC scenarios that generate graph seeds, artifact trees and expected answers. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `getScenarioData` | Function | Takes a scenario ID (DAC-027 through DAC-032) and returns the complete `ScenarioData` object including graph seed, artifact tree and expected answers. |
| `listScenarioIds` | Function | Returns an array of all available scenario ID strings for enumeration and validation. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run ../../runtime//tests/integration/council-graph-value-scenarios.vitest.ts
```

Expected result: exit code 0, all 6 tests pass.

---

## 5. RELATED

- [Parent: Council Value Fixtures](../README.md)
- [Seed Helpers: ../seed-helpers.ts](../seed-helpers.ts)
- [Tests: tests/](../../../README.md)
