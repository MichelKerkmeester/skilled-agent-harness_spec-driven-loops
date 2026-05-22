---
title: "deep-loop-runtime: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality source anchors for the deep-loop-runtime skill."
trigger_phrases:
  - "deep-loop-runtime feature catalog"
  - "deep-loop runtime inventory"
importance_tier: "important"
---

# deep-loop-runtime: Feature Catalog

This document combines the current feature inventory for the `deep-loop-runtime` skill into a single reference. The root catalog acts as the system-level directory for the shared executor, prompt, validation, state-safety, scoring, coverage-graph, and script-entry surfaces.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. EXECUTOR](#2--executor)
- [3. PROMPT RENDERING](#3--prompt-rendering)
- [4. VALIDATION](#4--validation)
- [5. STATE SAFETY](#5--state-safety)
- [6. SCORING](#6--scoring)
- [7. COVERAGE GRAPH](#7--coverage-graph)
- [8. SCRIPT ENTRY POINTS](#8--script-entry-points)

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `deep-loop-runtime` feature surface. The 17 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-review, deep-research, `/doctor`, and adjacent validation docs.

| Category | Coverage | Primary Surfaces |
|---|---:|---|
| [01--executor](01--executor/) | 3 features | `lib/deep-loop/executor-config.ts`, `lib/deep-loop/executor-audit.ts`, `lib/deep-loop/fallback-router.ts` |
| [02--prompt-rendering](02--prompt-rendering/) | 1 features | `lib/deep-loop/prompt-pack.ts` |
| [03--validation](03--validation/) | 1 features | `lib/deep-loop/post-dispatch-validate.ts` |
| [04--state-safety](04--state-safety/) | 4 features | `lib/deep-loop/atomic-state.ts`, `lib/deep-loop/jsonl-repair.ts`, `lib/deep-loop/loop-lock.ts`, `lib/deep-loop/permissions-gate.ts` |
| [05--scoring](05--scoring/) | 1 features | `lib/deep-loop/bayesian-scorer.ts` |
| [06--coverage-graph](06--coverage-graph/) | 3 features | `lib/coverage-graph/coverage-graph-db.ts`, `lib/coverage-graph/coverage-graph-query.ts`, `lib/coverage-graph/coverage-graph-signals.ts` |
| [07--script-entry-points](07--script-entry-points/) | 4 features | `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/query.cjs`, `scripts/status.cjs` |

---

## 2. EXECUTOR

These entries cover executor configuration, provenance audit, recursion guards, and model fallback decisions for deep-loop dispatch.

### Executor config

#### Description

Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch.

#### Current Reality

Schema, parsing, defaults, supported flags, sandbox and permission-mode normalization.

#### Source Files

See [`01--executor/01-executor-config.md`](01--executor/01-executor-config.md) for full implementation and validation file listings.

---

### Executor audit

#### Description

Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

#### Current Reality

Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning.

#### Source Files

See [`01--executor/02-executor-audit.md`](01--executor/02-executor-audit.md) for full implementation and validation file listings.

---

### Fallback router

#### Description

Chooses whether a failed model should fall back to a configured target or fail fast.

#### Current Reality

Model registry lookup, fallback target selection, disabled fallback, and fail-fast reasons.

#### Source Files

See [`01--executor/03-fallback-router.md`](01--executor/03-fallback-router.md) for full implementation and validation file listings.

---

---

## 3. PROMPT RENDERING

This entry covers prompt-pack template rendering and placeholder validation before iteration dispatch.

### Prompt pack

#### Description

Renders prompt-pack templates with checked placeholder variables.

#### Current Reality

Template token extraction, strict variable names, missing-token failures, and render output.

#### Source Files

See [`02--prompt-rendering/01-prompt-pack.md`](02--prompt-rendering/01-prompt-pack.md) for full implementation and validation file listings.

---

---

## 4. VALIDATION

This entry covers post-dispatch artifact validation, optional verification confidence, and review-depth advisory enforcement.

### Post-dispatch validate

#### Description

Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail.

#### Current Reality

Iteration markdown, JSONL, delta validation, review-depth v2 enforcement, and verification confidence scoring.

#### Source Files

See [`03--validation/01-post-dispatch-validate.md`](03--validation/01-post-dispatch-validate.md) for full implementation and validation file listings.

---

---

## 5. STATE SAFETY

These entries cover atomic writes, JSONL repair, loop locking, and permission checks that keep loop state mutation controlled.

### Atomic state

#### Description

Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

#### Current Reality

Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure.

#### Source Files

See [`04--state-safety/01-atomic-state.md`](04--state-safety/01-atomic-state.md) for full implementation and validation file listings.

---

### JSONL repair

#### Description

Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines.

#### Current Reality

Valid-prefix detection, corrupt-tail truncation, byte accounting, and append-after-repair.

#### Source Files

See [`04--state-safety/02-jsonl-repair.md`](04--state-safety/02-jsonl-repair.md) for full implementation and validation file listings.

---

### Loop lock

#### Description

Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

#### Current Reality

Lock file schema, live-holder refusal, stale replacement, heartbeat refresh, and owner-only release.

#### Source Files

See [`04--state-safety/03-loop-lock.md`](04--state-safety/03-loop-lock.md) for full implementation and validation file listings.

---

### Permissions gate

#### Description

Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules.

#### Current Reality

Tool operation mapping, path resolution, glob specificity, default-deny, and allow/deny reasons.

#### Source Files

See [`04--state-safety/04-permissions-gate.md`](04--state-safety/04-permissions-gate.md) for full implementation and validation file listings.

---

---

## 6. SCORING

This entry covers the compact Bayesian scoring primitive used by runtime routing decisions.

### Bayesian scorer

#### Description

Scores executor reliability and decides when enough evidence supports demotion.

#### Current Reality

Smoothed success scoring and demotion threshold checks.

#### Source Files

See [`05--scoring/01-bayesian-scorer.md`](05--scoring/01-bayesian-scorer.md) for full implementation and validation file listings.

---

---

## 7. COVERAGE GRAPH

These entries cover the session-scoped SQLite graph store, graph read models, convergence signals, snapshots, and momentum.

### Coverage graph DB

#### Description

Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle.

#### Current Reality

Schema v2, node and edge CRUD, snapshots, stats, composite namespace keys, and DB lifecycle.

#### Source Files

See [`06--coverage-graph/01-coverage-graph-db.md`](06--coverage-graph/01-coverage-graph-db.md) for full implementation and validation file listings.

---

### Coverage graph query

#### Description

Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

#### Current Reality

Session-scoped query helpers for research and review coverage graph reads.

#### Source Files

See [`06--coverage-graph/02-coverage-graph-query.md`](06--coverage-graph/02-coverage-graph-query.md) for full implementation and validation file listings.

---

### Coverage graph signals

#### Description

Computes convergence signals, node centrality signals, snapshots, and momentum for research and review graphs.

#### Current Reality

Node degree/depth, research signals, review signals, snapshots, and momentum.

#### Source Files

See [`06--coverage-graph/03-coverage-graph-signals.md`](06--coverage-graph/03-coverage-graph-signals.md) for full implementation and validation file listings.

---

---

## 8. SCRIPT ENTRY POINTS

These entries cover the direct `.cjs` interfaces that replaced the removed `deep_loop_graph_*` MCP tools.

### convergence.cjs

#### Description

Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

#### Current Reality

Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings.

#### Source Files

See [`07--script-entry-points/01-convergence-script.md`](07--script-entry-points/01-convergence-script.md) for full implementation and validation file listings.

---

### upsert.cjs

#### Description

Stores coverage graph nodes and edges from JSON arrays or iteration graph event files.

#### Current Reality

Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops.

#### Source Files

See [`07--script-entry-points/02-upsert-script.md`](07--script-entry-points/02-upsert-script.md) for full implementation and validation file listings.

---

### query.cjs

#### Description

Reads session-scoped coverage graph views through a direct JSON stdout script interface.

#### Current Reality

Direct replacement for `deep_loop_graph_query`; serves gaps, claims, contradictions, provenance, and hot nodes.

#### Source Files

See [`07--script-entry-points/03-query-script.md`](07--script-entry-points/03-query-script.md) for full implementation and validation file listings.

---

### status.cjs

#### Description

Reports session-scoped coverage graph health, counts, schema version, and current signals.

#### Current Reality

Direct replacement for `deep_loop_graph_status`; reports counts, schema, DB size, and signals.

#### Source Files

See [`07--script-entry-points/04-status-script.md`](07--script-entry-points/04-status-script.md) for full implementation and validation file listings.

---

