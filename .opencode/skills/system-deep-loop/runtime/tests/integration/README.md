---
title: "Integration Tests"
description: "Script-invocation, council-graph, and review-depth fixture tests exercising the runtime/ .cjs entry points end to end."
---

# Integration Tests

---

## 1. OVERVIEW

End-to-end coverage that spawns the `.cjs` script entry points as child processes (via `tests/helpers/spawn-cjs.ts`) and asserts on their JSON stdout, exit codes, DB side effects, council graph behavior, and review-depth graph and convergence fixtures. Unlike unit tests these cross module boundaries and touch the runtime SQLite database under `database/`.

## 2. CONTENTS

| File | Surface under test |
|------|--------------------|
| `convergence-script.vitest.ts` | `scripts/convergence.cjs` |
| `upsert-script.vitest.ts` | `scripts/upsert.cjs` |
| `query-script.vitest.ts` | `scripts/query.cjs` |
| `status-script.vitest.ts` | `scripts/status.cjs` |
| `council-graph-script.vitest.ts` | council graph CLI behavior |
| `council-graph-value-scenarios.vitest.ts` | council graph value scenarios |
| `review-depth-graph.vitest.ts` | review node-kind allow-list against `coverage-graph-db.ts` |
| `review-depth-convergence.vitest.ts` | review convergence signals |
| `review-depth-validator.vitest.ts` | review-depth validation fixtures |

## 3. RELATED RESOURCES

- Parent tests README: `.opencode/skills/system-deep-loop/runtime/tests/README.md`
- Script interface contract: `.opencode/skills/system-deep-loop/runtime/references/script_interface_contract.md`
