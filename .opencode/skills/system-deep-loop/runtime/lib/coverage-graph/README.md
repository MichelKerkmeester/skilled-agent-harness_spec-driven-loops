---
title: "Coverage Graph Library"
description: "Schema, queries, and Bayesian signals for deep-loop convergence detection."
---

# Coverage Graph

---

## 1. OVERVIEW

Convergence-detection primitives for research, review, and context coverage graphs. Computes research/review signals plus context signals: slice coverage, reuse catalog coverage, agreement rate, relevance floor, and dependency completeness.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `coverage-graph-db.ts` | SQLite schema, node-kind allow-list, and connection lifecycle |
| `coverage-graph-query.ts` | Query builders for coverage gaps, unverified claims, contradictions, and hotspots |
| `coverage-graph-signals.ts` | Convergence signal extraction and decision scoring |

## 3. CONSUMERS

- review: convergence detection via `coverage-graph-signals`
- research: novelty-rate scoring and dead-end tracking
- context: graph node kinds, relations, and convergence signals for slice, reuse, agreement, relevance, and dependency coverage

## 4. RELATED RESOURCES

- `lib/deep-loop/` - shared state primitives used alongside coverage-graph
- `database/deep-loop-graph.sqlite` - persistence layer
