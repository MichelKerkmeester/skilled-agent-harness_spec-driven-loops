---
title: "MCP Server Stress Tests"
description: "Dedicated Vitest stress, load, matrix-cell, and performance validation suite for the MCP server."
trigger_phrases:
  - "stress test"
  - "mcp_server/stress_test"
  - "dedicated stress folder"
---

# MCP Server Stress Tests

---

## 1. OVERVIEW

`stress_test/` holds MCP server checks that are intentionally outside the default `tests/` suite. Use it for load checks, high-volume read and write behavior, matrix-cell remediation, degraded-state sweeps, and performance or capacity validation that operators run by choice.

Current state:

- `vitest.stress.config.ts` includes only `mcp_server/stress_test/**/*.{vitest,test}.ts`.
- Default `npm test` uses `vitest.config.ts`, which excludes `mcp_server/stress_test/**`.
- Stress suites should use temp directories or in-memory databases and must not mutate live DB files.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    MCP SERVER STRESS TESTS                       │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌──────────────────┐
│ Operator       │ ───▶ │ npm run stress     │ ───▶ │ vitest stress    │
│ or CI slice    │      │ stress:* scripts   │      │ config           │
└───────┬────────┘      └─────────┬──────────┘      └────────┬─────────┘
        │                         │                          │
        │                         ▼                          ▼
        │              ┌────────────────────┐       ┌──────────────────┐
        └──────────▶   │ Domain suites      │ ───▶  │ Temp fixtures    │
                       │ search, memory,    │       │ isolated DB and  │
                       │ graph, session     │       │ metrics output   │
                       └─────────┬──────────┘       └──────────────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ Cost notes and     │
                       │ benchmark signals  │
                       └────────────────────┘

Execution boundary: default tests do not import or run stress suites.
```

---

## 3. DIRECTORY TREE

```text
mcp_server/stress_test/
├── search-quality/                 # W3-W13 search-quality test grid, corpus, metrics, baseline
├── memory/                         # Memory search and trigger latency or throughput
├── skill-advisor/                  # Skill graph rebuild concurrency stress
├── code-graph/                     # Degraded readiness and large-input sweeps
├── session/                        # Session entry-limit and resume benchmarks
├── durability/                     # Checkpoint, recycle, and daemon re-election durability gate
├── matrix/                         # Synthetic search routing and latency comparison
├── substrate/                      # Local substrate runner and pure-logic stress gate
├── vitest.stress.config.ts         # Stress-only Vitest config
└── README.md
```

---

## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `vitest.stress.config.ts` | Limits Vitest discovery to stress suites. |
| `search-quality/` | Runs search-quality test-grid cells, corpus checks, metrics, and baseline comparisons. |
| `memory/` | Measures memory search and trigger pathway behavior under load. |
| `code-graph/` | Exercises degraded graph readiness and large input caps. |
| `session/` | Measures session limits and resume latency. |
| `matrix/` | Runs synthetic matrix routing and latency comparisons. |
| `substrate/` | Promotes the 045 shared-daemon substrate runner and covers query expansion, token-budget edges, and V-rule save floods. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Default verification | Keep small deterministic regressions in `mcp_server/tests/`, not here. |
| Data safety | Use temp directories, in-memory databases, or generated fixtures. |
| Runtime cost | Note expected cost near the top of long-running suites. |
| Ownership | Add suites here only for capacity, concurrency, degraded-state, matrix, or benchmark coverage. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Operator chooses explicit stress command │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Vitest loads vitest.stress.config.ts     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Matching stress suites run in isolation  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Metrics, timing, or regression signals   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Operator reviews stress-only result      │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `npm run stress` | npm script | Runs the full stress suite from `mcp_server/`. |
| `npm run stress:harness` | npm script | Runs the search-quality test-grid slice. |
| `npm run stress:matrix` | npm script | Runs the matrix stress slice. |
| `npm run stress:substrate` | npm script | Runs the substrate stress gate from `mcp_server/stress_test/substrate/`. |
| `npm run stress:durability` | npm script | Runs the durability gate from `mcp_server/stress_test/durability/` (checkpoint, recycle, daemon re-election). |
| `vitest.stress.config.ts` | Vitest config | Defines the stress-only test discovery boundary. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp_server` unless noted.

```bash
npm run stress
npm run stress:harness
npm run stress:matrix
npm run stress:substrate
npm run stress:durability
npx vitest run --config vitest.stress.config.ts stress_test/session/session-manager-stress.vitest.ts
```

Expected result: the selected stress slice exits with Vitest success or a clear benchmark failure.

---

## 8. RELATED

- [`../tests/README.md`](../tests/README.md)
- [`../matrix_runners/README.md`](../matrix_runners/README.md)
- [`../README.md`](../README.md)
