---
title: "Coverage Graph Library"
description: "Schema, queries, and Bayesian signals for deep-loop convergence detection."
---

# Coverage Graph

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CONTENTS](#2--contents)
- [3. CONSUMERS](#3--consumers)
- [4. RELATED RESOURCES](#4--related-resources)

---

## 1. OVERVIEW

Convergence-detection primitives for deep-review and deep-research. Computes dimension coverage, finding stability, P0 resolution rate, evidence density, and hotspot saturation.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `coverage-graph-db.ts` | SQLite schema, node-kind allow-list, and connection lifecycle |
| `coverage-graph-query.ts` | Query builders for coverage gaps, unverified claims, contradictions, and hotspots |
| `coverage-graph-signals.ts` | Convergence signal extraction and decision scoring |

## 3. CONSUMERS

- deep-review: convergence detection via `coverage-graph-signals`
- deep-research: novelty-rate scoring and dead-end tracking

## 4. RELATED RESOURCES

- `lib/deep-loop/` - shared state primitives used alongside coverage-graph
- `database/deep-loop-graph.sqlite` - persistence layer
