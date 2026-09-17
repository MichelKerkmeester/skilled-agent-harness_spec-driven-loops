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

This folder packages council graph scenarios used by value-oriented integration tests. The DAC scenario modules describe query workloads and `seed-helpers.ts` creates the artifact tree, seeds graph data and prepares the runtime CLI inputs.

The `data/` child contains the scenario payload reader used by the fixture modules.

---

## 2. DIRECTORY TREE

```text
council-value/
└── data/
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
| `seed-helpers.ts` | Seeds artifact trees, upserts fixture graphs and builds scenario fixtures. |

---

## 4. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Scenario fixtures | `dac-027.ts` through `dac-032.ts` |
| Seed helpers | `seed-helpers.ts` |
| Scenario data | [`data/README.md`](data/README.md) |

Integration tests import the scenario modules and helpers. They are not production runtime entry points.

---

## 5. SPINE ROLE

These fixtures sit at the integration edge of the runtime spine. They create reproducible graph inputs so query, status, convergence and transaction behavior can be measured against known scenario shapes.

---

## 6. VALIDATION

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts tests/integration/council-graph-value-scenarios.vitest.ts
```

---

## 7. RELATED

- [Fixture index](../README.md)
- [Runtime test index](../../README.md)
- [Runtime library](../../../lib/README.md)
