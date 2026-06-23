---
title: "deep-loop-runtime: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality source anchors for the deep-loop-runtime skill."
trigger_phrases:
  - "deep-loop-runtime feature catalog"
  - "deep-loop runtime inventory"
importance_tier: "important"
version: 1.4.0.10
---

# deep-loop-runtime: Feature Catalog

This document combines the current feature inventory for the `deep-loop-runtime` skill into a single reference. The root catalog acts as the system-level directory for the shared executor, prompt, validation, state-safety, scoring, coverage-graph, and script-entry surfaces.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `deep-loop-runtime` feature surface. The 27 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).

| Category | Coverage | Primary Surfaces |
|---|---:|---|
| [01--executor](01--executor/) | 3 features | `lib/deep-loop/executor-config.ts`, `lib/deep-loop/executor-audit.ts`, `lib/deep-loop/fallback-router.ts` |
| [02--prompt-rendering](02--prompt-rendering/) | 1 features | `lib/deep-loop/prompt-pack.ts` |
| [03--validation](03--validation/) | 1 features | `lib/deep-loop/post-dispatch-validate.ts` |
| [04--state-safety](04--state-safety/) | 4 features | `lib/deep-loop/atomic-state.ts`, `lib/deep-loop/jsonl-repair.ts`, `lib/deep-loop/loop-lock.ts`, `lib/deep-loop/permissions-gate.ts` |
| [05--scoring](05--scoring/) | 1 features | `lib/deep-loop/bayesian-scorer.ts` |
| [06--coverage-graph](06--coverage-graph/) | 3 features | `lib/coverage-graph/coverage-graph-db.ts`, `lib/coverage-graph/coverage-graph-query.ts`, `lib/coverage-graph/coverage-graph-signals.ts` |
| [07--script-entry-points](07--script-entry-points/) | 4 features | `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/query.cjs`, `scripts/status.cjs` |
| [08--council](08--council/) | 5 features | `lib/council/multi-seat-dispatch.cjs`, `lib/council/round-state-jsonl.cjs`, `lib/council/adjudicator-verdict-scoring.cjs`, `lib/council/cost-guards.cjs`, `lib/council/session-state-hierarchy.cjs` |
| [09--fanout](09--fanout/) | 5 features | `scripts/fanout-pool.cjs`, `scripts/fanout-run.cjs`, `scripts/fanout-salvage.cjs`, `scripts/fanout-merge.cjs`, config schema in `lib/deep-loop/executor-config.ts` |

**Shared backend contracts (consolidation promotions).** Beyond the numbered entries above, the backend hosts a small set of generic plumbing the consumer modes import rather than duplicate: `lib/deep-loop/runtime-capabilities.cjs` (parameterized capability resolver, with byte-compatible per-skill shims), `lib/deep-loop/artifact-root.cjs` (canonical seam re-exporting `resolveArtifactRoot` from `system-spec-kit/shared/review-research-paths.cjs`), `lib/deep-loop/lifecycle-taxonomy.cjs` (terminal lifecycle enum: seven `stopReason` plus four `sessionOutcome` values) and `scripts/loop-lock.cjs` (CLI adapter over `loop-lock.ts`). These contracts register no MCP tools and carry no public workflow routing; resource-map emission stays in the workflow shared-synthesis layer, not in this runtime.

---

## 2. EXECUTOR

These entries cover executor configuration, provenance audit, recursion guards, and model fallback decisions for deep-loop dispatch.

### Executor config

#### Description

Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch.

#### How It Works

Schema, parsing, defaults, supported flags, sandbox and permission-mode normalization.

#### Source Files

See [`01--executor/executor-config.md`](01--executor/executor-config.md) for full implementation and validation file listings.

---

### Executor audit

#### Description

Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

#### How It Works

Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning.

#### Source Files

See [`01--executor/executor-audit.md`](01--executor/executor-audit.md) for full implementation and validation file listings.

---

### Fallback router

#### Description

Chooses whether a failed model should fall back to a configured target or fail fast.

#### How It Works

Model registry lookup, fallback target selection, disabled fallback, and fail-fast reasons.

#### Source Files

See [`01--executor/fallback-router.md`](01--executor/fallback-router.md) for full implementation and validation file listings.

---

## 3. PROMPT RENDERING

This entry covers prompt-pack template rendering and placeholder validation before iteration dispatch.

### Prompt pack

#### Description

Renders prompt-pack templates with checked placeholder variables.

#### How It Works

Template token extraction, strict variable names, missing-token failures, and render output.

#### Source Files

See [`02--prompt-rendering/prompt-pack.md`](02--prompt-rendering/prompt-pack.md) for full implementation and validation file listings.

---

## 4. VALIDATION

This entry covers post-dispatch artifact validation, optional verification confidence, and review-depth advisory enforcement.

### Post-dispatch validate

#### Description

Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail.

#### How It Works

Iteration markdown, JSONL, delta validation, review-depth v2 enforcement, and verification confidence scoring.

#### Source Files

See [`03--validation/post-dispatch-validate.md`](03--validation/post-dispatch-validate.md) for full implementation and validation file listings.

---

## 5. STATE SAFETY

These entries cover atomic writes, JSONL repair, loop locking, and permission checks that keep loop state mutation controlled.

### Atomic state

#### Description

Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

#### How It Works

Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure.

#### Source Files

See [`04--state-safety/atomic-state.md`](04--state-safety/atomic-state.md) for full implementation and validation file listings.

---

### JSONL repair

#### Description

Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines.

#### How It Works

Valid-prefix detection, corrupt-tail truncation, byte accounting, and append-after-repair.

#### Source Files

See [`04--state-safety/jsonl-repair.md`](04--state-safety/jsonl-repair.md) for full implementation and validation file listings.

---

### Loop lock

#### Description

Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

#### How It Works

Lock file schema, live-holder refusal, stale replacement, heartbeat refresh, and owner-only release.

#### Source Files

See [`04--state-safety/loop-lock.md`](04--state-safety/loop-lock.md) for full implementation and validation file listings.

---

### Permissions gate

#### Description

Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules.

#### How It Works

Tool operation mapping, path resolution, glob specificity, default-deny, and allow/deny reasons.

#### Source Files

See [`04--state-safety/permissions-gate.md`](04--state-safety/permissions-gate.md) for full implementation and validation file listings.

---

## 6. SCORING

This entry covers the compact Bayesian scoring primitive used by runtime routing decisions.

### Bayesian scorer

#### Description

Scores executor reliability and decides when enough evidence supports demotion.

#### How It Works

Smoothed success scoring and demotion threshold checks.

#### Source Files

See [`05--scoring/bayesian-scorer.md`](05--scoring/bayesian-scorer.md) for full implementation and validation file listings.

---

## 7. COVERAGE GRAPH

These entries cover the session-scoped SQLite graph store, graph read models, convergence signals, snapshots, and momentum.

### Coverage graph DB

#### Description

Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle.

#### How It Works

Schema v2, node and edge CRUD, snapshots, stats, composite namespace keys, and DB lifecycle.

#### Source Files

See [`06--coverage-graph/coverage-graph-db.md`](06--coverage-graph/coverage-graph-db.md) for full implementation and validation file listings.

---

### Coverage graph query

#### Description

Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

#### How It Works

Session-scoped query helpers for research and review coverage graph reads.

#### Source Files

See [`06--coverage-graph/coverage-graph-query.md`](06--coverage-graph/coverage-graph-query.md) for full implementation and validation file listings.

---

### Coverage graph signals

#### Description

Computes convergence signals, node centrality signals, snapshots, and momentum for research and review graphs.

#### How It Works

Node degree/depth, research signals, review signals, snapshots, and momentum.

#### Source Files

See [`06--coverage-graph/coverage-graph-signals.md`](06--coverage-graph/coverage-graph-signals.md) for full implementation and validation file listings.

---

## 8. SCRIPT ENTRY POINTS

These entries cover the direct `.cjs` interfaces that replaced the removed `deep_loop_graph_*` MCP tools.

### convergence.cjs

#### Description

Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

#### How It Works

Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings.

#### Source Files

See [`07--script-entry-points/convergence-script.md`](07--script-entry-points/convergence-script.md) for full implementation and validation file listings.

---

### upsert.cjs

#### Description

Stores coverage graph nodes and edges from JSON arrays or iteration graph event files.

#### How It Works

Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops.

#### Source Files

See [`07--script-entry-points/upsert-script.md`](07--script-entry-points/upsert-script.md) for full implementation and validation file listings.

---

### query.cjs

#### Description

Reads session-scoped coverage graph views through a direct JSON stdout script interface.

#### How It Works

Direct replacement for `deep_loop_graph_query`; serves gaps, claims, contradictions, provenance, and hot nodes.

#### Source Files

See [`07--script-entry-points/query-script.md`](07--script-entry-points/query-script.md) for full implementation and validation file listings.

---

### status.cjs

#### Description

Reports session-scoped coverage graph health, counts, schema version, and current signals.

#### How It Works

Direct replacement for `deep_loop_graph_status`; reports counts, schema, DB size, and signals.

#### Source Files

See [`07--script-entry-points/status-script.md`](07--script-entry-points/status-script.md) for full implementation and validation file listings.

---

## 9. COUNCIL

These entries cover the 5 council durability primitives that downstream `deep-ai-council` consumes, per the Runtime Boundary Decision (ADR-001). The council surface mirrors the deep-loop durability contract in a council-scoped CJS surface.

### Multi-seat dispatch

#### Description

Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts.

#### Source Files

See [`08--council/multi-seat-dispatch.md`](08--council/multi-seat-dispatch.md) for full implementation and validation file listings.

---

### Round-state JSONL

#### Description

Appends per-round JSONL records with a lock-file single-writer guard; repairs corrupt trailing JSONL before append; fsyncs writes; exposes round-state readers for resume.

#### Source Files

See [`08--council/round-state-jsonl.md`](08--council/round-state-jsonl.md) for full implementation and validation file listings.

---

### Adjudicator verdict scoring

#### Description

Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta.

#### Source Files

See [`08--council/adjudicator-verdict-scoring.md`](08--council/adjudicator-verdict-scoring.md) for full implementation and validation file listings.

---

### Cost guards

#### Description

Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, max_topics_per_session, saturation_threshold, and seats_per_round; computes upper-bound seat-output budgets.

#### Source Files

See [`08--council/cost-guards.md`](08--council/cost-guards.md) for full implementation and validation file listings.

---

### Session state hierarchy

#### Description

Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids.

#### Source Files

See [`08--council/session-state-hierarchy.md`](08--council/session-state-hierarchy.md) for full implementation and validation file listings.

---

## 10. FAN-OUT

These entries cover the opt-in multi-executor fan-out layer: config schema extensions, the
concurrency-capped pool primitive, the CLI lineage driver, write-failure salvage, and the
cross-lineage merge. Together they generalize the manual multi-model pattern proven in the
packet-122 prototype into a first-class command-driven feature.

### Fan-out config schema

#### Description

Adds `lineageExecutorSchema`, `fanoutConfigSchema`, `parseFanoutConfig`, and `expandLineages`
on top of the existing single-executor config without modifying it.

#### Source Files

See [`09--fanout/fanout-config-schema.md`](09--fanout/fanout-config-schema.md) for full implementation and validation file listings.

---

### Fan-out worker pool

#### Description

Concurrency-capped pool primitive with injected worker, never-throws per-item settlement,
ordered results, and a JSONL status ledger.

#### Source Files

See [`09--fanout/fanout-pool.md`](09--fanout/fanout-pool.md) for full implementation and validation file listings.

---

### Fan-out CLI lineage driver

#### Description

TSX-bootstrapped entry point that spawns N headless CLI subprocesses (codex, claude,
opencode), each running the full loop in an isolated `lineages/{label}/`
sub-packet, with per-kind state-dir isolation and a post-subprocess salvage sweep.

#### Source Files

See [`09--fanout/fanout-run.md`](09--fanout/fanout-run.md) for full implementation and validation file listings.

---

### Fan-out write-failure salvage

#### Description

Post-subprocess salvage that recovers missing or empty iteration `.md` files from captured
subprocess stdout (opencode `--format json` text parts or raw fallback).

#### Source Files

See [`09--fanout/fanout-salvage.md`](09--fanout/fanout-salvage.md) for full implementation and validation file listings.

---

### Fan-out cross-lineage merge

#### Description

Cross-lineage merge: research (dedup by `findingId` + cross-model attribution) or review
(strongest-restriction: any active P0 → merged FAIL). Writes consolidated registry and
`fanout-attribution.md`.

#### Source Files

See [`09--fanout/fanout-merge.md`](09--fanout/fanout-merge.md) for full implementation and validation file listings.

---
