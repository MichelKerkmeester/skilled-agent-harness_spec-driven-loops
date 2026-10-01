---
title: "runtime council value fixtures"
description: "Scenario modules and seed helpers for council graph value integration tests."
trigger_phrases:
  - "council value fixtures"
  - "graph value scenarios"
---

# Council Value Fixtures

---

## 1. OVERVIEW

This folder packages council graph scenarios used by value-oriented integration tests. The DAC scenario modules describe query workloads, `scenarios.cjs` builds each scenario's payload, and `seed-helpers.ts` creates the artifact tree, seeds graph data and prepares the runtime CLI inputs.

Each payload from `scenarios.cjs` carries a `graphSeed` of council nodes and edges, a simulated markdown `artifactTree`, the expected answers for the baseline file-read and runtime CLI approaches, and `baselineMinFileReads`. Scenario ids are matched case-insensitively.

---

## 2. DIRECTORY TREE

```text
council-value/
├── dac-027.ts … dac-032.ts   # Scenario fixtures
├── scenarios.cjs             # Scenario payload builders
└── seed-helpers.ts           # Seeding and fixture construction
```

---

## 3. FILES

| File | Responsibility |
|---|---|
| `dac-027.ts` | Scenario fixture for unresolved-disagreement query performance. |
| `dac-028.ts` | Scenario fixture for decision-support query performance. |
| `dac-029.ts` | Scenario fixture for convergence query performance. |
| `dac-030.ts` | Scenario fixture for convergence-blocker query performance. |
| `dac-031.ts` | Scenario fixture for hot-node query performance. |
| `dac-032.ts` | Scenario fixture for council graph status performance. |
| `scenarios.cjs` | CommonJS module exporting `getScenarioData(scenarioId)` and `listScenarioIds()`, backed by one builder per DAC scenario. Data only, no test logic. |
| `seed-helpers.ts` | Seeds artifact trees, upserts fixture graphs and builds scenario fixtures from `scenarios.cjs` through `require()`. |

---

## 4. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Scenario fixtures | `dac-027.ts` through `dac-032.ts` |
| Seed helpers | `seed-helpers.ts` |
| Scenario data | `getScenarioData` and `listScenarioIds` in `scenarios.cjs` |

Integration tests import the scenario modules and helpers. They are not production runtime entry points.

---

## 5. SPINE ROLE

These fixtures sit at the integration edge of the runtime spine. They create reproducible graph inputs so query, status, convergence and transaction behavior can be measured against known scenario shapes.

---

## 6. VALIDATION

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts tests/integration/council-graph-value-scenarios.vitest.ts
```

---

## 7. RELATED

- [Fixture index](../README.md)
- [Runtime test index](../../README.md)
- [Runtime library](../../../lib/README.md)
