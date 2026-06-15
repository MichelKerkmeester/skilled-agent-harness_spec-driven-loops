---
title: "Context Node Kinds and Relations"
description: "Documents what each context node kind and relation type represents in the coverage graph and how they are populated during deep-context sweeps."
trigger_phrases:
  - "context node kinds"
  - "SLICE node"
  - "REUSE_CANDIDATE node"
  - "context graph relations"
  - "COVERED_BY edge"
  - "CONFIRMS edge context"
---

# Context Node Kinds and Relations

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents what each context node kind and relation type represents in the coverage graph and how they are populated during deep-context sweeps.

Understanding the node kind and relation semantics is essential for diagnosing blocked stops, interpreting dashboard metrics, and extending the graph schema for new use cases. Each kind has a distinct lifecycle: some are written at initialization (SLICE), some accumulate during sweeps (REUSE_CANDIDATE, SYMBOL), and some track gaps (GAP).

---

## 2. HOW IT WORKS

### Node Kinds

| Kind | When Created | What It Represents |
|---|---|---|
| `SLICE` | Frontier seeding (`step_seed_frontier`) | One scope unit from the ranked frontier; a target area for sweeps |
| `FILE` | Seat finding with `kind: file` | A source file read or cited by at least one seat |
| `SYMBOL` | Seat finding with `kind: symbol` | A specific `file:symbol` citation (function, type, constant, interface) |
| `PATTERN` | Seat finding with `kind: convention` | A codebase idiom observed by seats (naming, error handling, test layout) |
| `REUSE_CANDIDATE` | Promoted from seat finding after relevance gate | A symbol confirmed by multiple executors as reusable; the catalog's building block |
| `DEPENDENCY` | Seat finding with `kind: dependency` | A structural dependency edge within the touch radius |
| `CONSTRAINT` | Seat finding with `kind: constraint` | A hard boundary (API contract, interface, security rule) that implementation must respect |
| `GAP` | Unfound or unverified items after merge | Something the sweep could not locate or confirm; records what is unknown |

### Relation Types

| Relation | Direction | Meaning |
|---|---|---|
| `CONTAINS` | SLICE → FILE or SYMBOL | A slice contains a file or symbol |
| `REFERENCES` | SYMBOL → SYMBOL or FILE | One symbol references another |
| `IMPORTS` | FILE → FILE | Module import relationship |
| `DEPENDS_ON` | SYMBOL → DEPENDENCY | Symbol depends on another module or service |
| `IMPLEMENTS` | SYMBOL → CONSTRAINT | Symbol implements a contract or interface |
| `EXPOSES` | FILE → SYMBOL | File exposes a public symbol |
| `REUSES` | Host-written after merge | A code path reuses a confirmed reuse candidate |
| `CONSTRAINS` | CONSTRAINT → SYMBOL | A constraint bounds what this symbol may do |
| `COVERED_BY` | SLICE → covered node | Slice has been swept; the source is the SLICE and the target is an existing coverage node found while sweeping it. `sliceCoverage` counts SLICE nodes that are the source of a COVERED_BY edge |
| `CONFIRMS` | coverage node → SYMBOL or REUSE_CANDIDATE | Cross-executor confirmation of a unit. Agreement is usually recorded via the unit's `metadata.confirmations`; when a CONFIRMS edge is used both endpoints are real nodes. Agreement = max(`metadata.confirmations`, count of CONFIRMS in-edges) |
| `CONTRADICTS` | SYMBOL → SYMBOL (same unit_id) | Two seats assert incompatible contracts for the same unit |

> **FK constraint**: `coverage_edges` enforces foreign keys on BOTH `source_id` and `target_id` (each must reference an existing `coverage_nodes` row) and the DB opens with `PRAGMA foreign_keys = ON`. There is no `ITERATION` or `EXECUTOR`/`SEAT` node kind, so an iteration marker or a confirming seat must be modeled via node/edge **metadata** (e.g. `metadata.confirmations`, `metadata.iteration`), never as an edge endpoint — otherwise the upsert fails the FK check.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Shared | `ContextNodeKind`, `ContextRelation` type exports; `VALID_KINDS.context`, `VALID_RELATIONS.context` |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Script | Writes host-composed node/edge batches to the SQLite DB per iteration |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_graph_upsert` — `graph_nodes_json` and `graph_edges_json` outputs from `step_merge_findings` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/06--coverage-graph-schema/context-node-kinds-relations.md` | Manual playbook | Verifies SLICE nodes created at seeding, COVERED_BY edges after first sweep, CONFIRMS edges with agreement count, CONTRADICTS pair for a known conflict |

---

## 4. SOURCE METADATA

- Group: Coverage-Graph Schema
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--coverage-graph-schema/context-node-kinds-relations.md`

Related references:
- [loop-type-context-schema.md](loop-type-context-schema.md) — SQLite schema and relation weight table
- [context-convergence-signals.md](context-convergence-signals.md) — How evaluateContext reads these nodes/edges to compute the five signals
