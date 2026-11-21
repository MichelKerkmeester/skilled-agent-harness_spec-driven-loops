---
title: "Coverage Graph Library"
description: "Schema, queries, and Bayesian signals for deep-loop convergence detection."
---

# Coverage Graph

---

## 1. OVERVIEW

Convergence-detection primitives for research, review, and context coverage graphs. Computes research/review signals plus context signals: slice coverage, reuse catalog coverage, agreement rate, relevance floor, and dependency completeness.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `better-sqlite3.d.ts` | Ambient `better-sqlite3` module declaration that types only the constructor and statement surface the coverage-graph files call |
| `coverage-graph-db.ts` | SQLite schema, node-kind allow-list, and connection lifecycle |
| `coverage-graph-query.ts` | Query builders for coverage gaps, unverified claims, contradictions, and hotspots |
| `coverage-graph-signals.ts` | Convergence signal extraction and decision scoring |

---

## 3. CONSUMERS

- review: convergence detection via `coverage-graph-signals`
- research: novelty-rate scoring and dead-end tracking
- context: graph node kinds, relations, and convergence signals for slice, reuse, agreement, relevance, and dependency coverage

---

## 4. VALIDATION

Run the three coverage graph suites from the runtime folder. They cover the database lifecycle, the graph queries and the convergence signals.

```bash
cd .skilled/skills/system-deep-loop/runtime
npx vitest run tests/unit/coverage-graph-db.vitest.ts tests/unit/coverage-graph-query.vitest.ts tests/unit/coverage-graph-signals.vitest.ts
```

Expected result: every test passes and the command exits 0.

---

## 5. RELATED RESOURCES

- `../deep-loop/` - shared state primitives used alongside coverage-graph
- `../../database/` - persistence layer. `coverage-graph-db.ts` opens deep-loop-graph.sqlite in this directory by default, and the `DEEP_LOOP_COVERAGE_DB_DIR` environment variable points it at another directory.
