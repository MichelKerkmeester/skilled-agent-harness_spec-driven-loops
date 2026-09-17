---
title: "runtime integration tests"
description: "Integration coverage for runtime scripts, graph queries, review depth and pivot recovery."
trigger_phrases:
  - "runtime integration tests"
  - "deep-loop integration suite"
---

# Integration Tests

---

## 1. OVERVIEW

This folder exercises the runtime across process, database and artifact boundaries. The suite invokes CLI scripts, seeds graph fixtures, checks review-depth projections and verifies divergent-pivot transaction recovery.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `convergence-script.vitest.ts` | Invokes the convergence CLI and checks typed graph decisions. |
| `council-graph-script.vitest.ts` | Checks council graph CLI behavior. |
| `council-graph-value-scenarios.vitest.ts` | Runs council graph value scenarios against seeded fixtures. |
| `divergent-pivot.vitest.ts` | Checks pivot transaction prepare, finalize, quorum and seat-resume recovery. |
| `query-script.vitest.ts` | Invokes the query CLI and checks returned graph data. |
| `review-depth-convergence.vitest.ts` | Checks review convergence signals across graph depth. |
| `review-depth-graph.vitest.ts` | Checks review node-kind and graph projection behavior. |
| `review-depth-validator.vitest.ts` | Checks review-depth validation fixtures and rejection paths. |
| `status-script.vitest.ts` | Invokes the status CLI and checks reported graph health. |
| `upsert-script.vitest.ts` | Invokes the upsert CLI and checks durable graph writes. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Script integration | Convergence, query, status and upsert command boundaries |
| Graph integration | Council graph and review-depth projections |
| Recovery integration | Divergent-pivot transaction and seat-resume behavior |

The files are executable integration checks. Their public contract is the runtime command and database boundary they exercise.

---

## 4. SPINE ROLE

Integration tests follow evidence from command input through graph storage, projection and recovery. They verify that process boundaries preserve the same durable contracts as direct module calls.

---

## 5. VALIDATION

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts tests/integration
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime scripts](../../scripts/README.md)
- [Council value fixtures](../fixtures/council-value/README.md)
- [Runtime database](../../database/README.md)
