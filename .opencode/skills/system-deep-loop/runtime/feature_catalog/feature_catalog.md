---
title: "runtime/: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality source anchors for the runtime/ skill."
trigger_phrases:
  - "runtime/ feature catalog"
  - "deep-loop runtime inventory"
importance_tier: "important"
version: 1.4.0.15
---

# runtime/: Feature Catalog

This document combines the current feature inventory for the `runtime/` skill into a single reference. The root catalog acts as the system-level directory for the shared executor, prompt, validation, state-safety, scoring, coverage-graph, and script-entry surfaces.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `runtime/` feature surface. The 50 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).

| Category | Coverage | Primary Surfaces |
|---|---:|---|
| [executor](executor/) | 4 features | `lib/deep-loop/executor-config.ts`, `lib/deep-loop/executor-audit.ts`, `lib/deep-loop/fallback-router.ts` |
| [prompt-rendering](prompt-rendering/) | 1 features | `lib/deep-loop/prompt-pack.ts` |
| [validation](validation/) | 3 features | `lib/deep-loop/post-dispatch-validate.ts`, `.opencode/plugins/mk-deep-loop-guard.js` |
| [state-safety](state-safety/) | 10 features | `lib/deep-loop/atomic-state.ts`, `lib/deep-loop/jsonl-repair.ts`, `lib/deep-loop/loop-lock.ts`, `lib/deep-loop/permissions-gate.ts` |
| [scoring](scoring/) | 2 features | `lib/deep-loop/bayesian-scorer.ts` |
| [coverage-graph](coverage-graph/) | 6 features | `lib/coverage-graph/coverage-graph-db.ts`, `lib/coverage-graph/coverage-graph-query.ts`, `lib/coverage-graph/coverage-graph-signals.ts` |
| [script-entry-points](script-entry-points/) | 4 features | `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/query.cjs`, `scripts/status.cjs` |
| [council](council/) | 5 features | `lib/council/multi-seat-dispatch.cjs`, `lib/council/round-state-jsonl.cjs`, `lib/council/adjudicator-verdict-scoring.cjs`, `lib/council/cost-guards.cjs`, `lib/council/session-state-hierarchy.cjs` |
| [fanout](fanout/) | 8 features | `scripts/fanout-pool.cjs`, `scripts/fanout-run.cjs`, `scripts/fanout-salvage.cjs`, `scripts/fanout-merge.cjs`, config schema in `lib/deep-loop/executor-config.ts` |
| [lifecycle](lifecycle/) | 2 features | `lib/deep-loop/sleep.ts`, `lib/deep-loop/lifecycle-taxonomy.cjs` |
| [observability](observability/) | 3 features | `lib/deep-loop/observability-events.cjs`, `lib/deep-loop/post-dispatch-validate.ts`, `.opencode/commands/deep/assets/deep_research_auto.yaml` |
| [testing](testing/) | 2 features | `tests/helpers/spawn-cjs.ts`, `tests/integration/convergence-script.vitest.ts`, `tests/unit/fanout-run.vitest.ts` |

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

See [`executor/executor-config.md`](executor/executor-config.md) for full implementation and validation file listings.

---

### Executor audit

#### Description

Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

#### How It Works

Recursion guard, executor audit record writing, dispatch-failure emission, and audited command spawning.

#### Source Files

See [`executor/executor-audit.md`](executor/executor-audit.md) for full implementation and validation file listings.

---

### Fallback router

#### Description

Chooses whether a failed model should fall back to a configured target or fail fast.

#### How It Works

Model registry lookup, fallback target selection, disabled fallback, and fail-fast reasons.

#### Source Files

See [`executor/fallback-router.md`](executor/fallback-router.md) for full implementation and validation file listings.

---

### Fallback-router typed reroute

#### Description

Adds typed fallback-route metadata, route trace fields, and startup graph validation for executor fallback routing.

#### How It Works

Fallback routes can declare success and failure targets, every decision can carry `routeGroupId` and `hopIndex`, and `validateFallbackGraph()` checks missing targets, cycles, scope widening, and hop limits before dispatch.

#### Source Files

See [`executor/fallback-router-typed-reroute.md`](executor/fallback-router-typed-reroute.md) for full implementation and validation file listings.

---

## 3. PROMPT RENDERING

This entry covers prompt-pack template rendering and placeholder validation before iteration dispatch.

### Prompt pack

#### Description

Renders prompt-pack templates with checked placeholder variables.

#### How It Works

Template token extraction, strict variable names, missing-token failures, and render output.

#### Source Files

See [`prompt-rendering/prompt-pack.md`](prompt-rendering/prompt-pack.md) for full implementation and validation file listings.

---

## 4. VALIDATION

This entry covers post-dispatch artifact validation, optional verification confidence, and review-depth advisory enforcement.

### Post-dispatch validate

#### Description

Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail.

#### How It Works

Iteration markdown, JSONL, delta validation, review-depth v2 enforcement, and verification confidence scoring.

#### Source Files

See [`validation/post-dispatch-validate.md`](validation/post-dispatch-validate.md) for full implementation and validation file listings.

---

### LLM-judge hardening

#### Description

Hardens LLM judge validation with retries, dual timeouts, format-strip parsing, neutral fallback cards, and quarantine gating.

#### How It Works

`post-dispatch-validate.ts` retries transient judge failures, strips markdown fences before fallback, emits a neutral `quarantined:true` card after exhausted parsing, and blocks quarantined cards from persistence, convergence, and coverage writes.

#### Source Files

See [`validation/llm-judge-hardening.md`](validation/llm-judge-hardening.md) for full implementation and validation file listings.

---

### mk-deep-loop-guard

#### Description

Detection-layer OpenCode plugin with two checks: flags/blocks a Task dispatch whose declared Deep Route mode disagrees with `mode-registry.json`'s entry for the resolved target agent, and flags/blocks a session-scoped loop-like repeated `orchestrate`-to-command-owned-loop-executor dispatch.

#### How It Works

A `tool.execute.before` hook resolves the real target agent (`orchestrate` always dispatches with `subagent_type: "general"`, so identity is parsed from `Agent: @X` / `Deep Route: ... target_agent=@X` prompt text) against `mode-registry.json` and compares it to any `mode=X` value declared in the dispatch prompt (Check 1). It also tracks per-session, per-target-agent dispatch counts for command-owned loop executors, exempting command-driven iterations, and flags non-command-driven repeats (Check 2). Default is mutate-and-warn for both; `MK_DEEP_LOOP_GUARD_REJECT=1` / `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1` independently switch each check to fail-closed (throws, blocking the dispatch — confirmed live against the installed OpenCode host). Fails open on its own internal errors. A separate `event` hook, throttled to once per hour on `session.created`, sweeps/archives/prunes the plugin's own `.loop-guard-state` per-session files and rotates `guard-warnings.log`, mirroring `mk-goal.js`'s retention pattern.

#### Source Files

See [`validation/mk-deep-loop-guard.md`](validation/mk-deep-loop-guard.md) for full implementation and validation file listings.

---

## 5. STATE SAFETY

These entries cover atomic writes, JSONL repair, loop locking, and permission checks that keep loop state mutation controlled.

### Atomic state

#### Description

Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

#### How It Works

Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure.

#### Source Files

See [`state-safety/atomic-state.md`](state-safety/atomic-state.md) for full implementation and validation file listings.

---

### JSONL repair

#### Description

Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines.

#### How It Works

Valid-prefix detection, corrupt-tail truncation, byte accounting, and append-after-repair.

#### Source Files

See [`state-safety/jsonl-repair.md`](state-safety/jsonl-repair.md) for full implementation and validation file listings.

---

### Loop lock

#### Description

Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

#### How It Works

Lock file schema, live-holder refusal, stale replacement, heartbeat refresh, and owner-only release.

#### Source Files

See [`state-safety/loop-lock.md`](state-safety/loop-lock.md) for full implementation and validation file listings.

---

### Permissions gate

#### Description

Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules.

#### How It Works

Tool operation mapping, path resolution, glob specificity, default-deny, and allow/deny reasons.

#### Source Files

See [`state-safety/permissions-gate.md`](state-safety/permissions-gate.md) for full implementation and validation file listings.

---

### Atomic-state serialize-diff

#### Description

Adds `writeStateIfChangedAtomic()` so snapshot writers skip fsync and rename when canonical serialized state has not changed.

#### How It Works

Canonicalizes and serializes the incoming state, compares it against a per-path cache keyed by canonical path, returns `false` for no-change skips, and keeps `writeStateAtomic()` available for callers that must force a durable write.

#### Source Files

See [`state-safety/atomic-state-serialize-diff.md`](state-safety/atomic-state-serialize-diff.md) for full implementation and validation file listings.

---

### Atomic-state integrity helpers

#### Description

Adds SHA-256 integrity helpers for object and registry JSON without applying the contract to append-only JSONL.

#### How It Works

`computeIntegrityHash()` hashes canonical JSON, `stampIntegrity()` writes `_integrity`, and `verifyIntegrity()` recomputes the digest, warns on mismatch, and returns `false` without fail-fast blocking.

#### Source Files

See [`state-safety/atomic-state-integrity-helpers.md`](state-safety/atomic-state-integrity-helpers.md) for full implementation and validation file listings.

---

### Atomic-state deferred writer

#### Description

Adds a per-path deferred atomic writer that coalesces superseded snapshot writes while keeping JSONL appends immediate.

#### How It Works

`createDeferredAtomicWriter()` debounces writes, flushes the newest pending state, performs a dirty-again reflush if content changes during an in-flight fsync, and exposes `flushNow()` plus `close()` for deterministic draining.

#### Source Files

See [`state-safety/atomic-state-deferred-writer.md`](state-safety/atomic-state-deferred-writer.md) for full implementation and validation file listings.

---

### JSONL lock-held merge

#### Description

Adds a lock-held JSONL merge path for fan-out salvage so recovered events are deduplicated before atomic rewrite.

#### How It Works

`mergeJsonlUnderLock()` rereads current JSONL, unions incoming records by stable identity, writes the merged file atomically under the lock, and `fanout-salvage.cjs` uses it instead of bare append.

#### Source Files

See [`state-safety/jsonl-lock-held-merge.md`](state-safety/jsonl-lock-held-merge.md) for full implementation and validation file listings.

---

### Loop-lock heartbeat hardening

#### Description

Hardens loop-lock ownership with TTL-aware heartbeat refresh plus phase and last-activity metadata.

#### How It Works

`startHeartbeat()` and `stopHeartbeat()` refresh the held lock on a cadence, write `phase` and `lastActivityIso`, and stop the heartbeat when refresh can no longer prove ownership.

#### Source Files

See [`state-safety/loop-lock-heartbeat-hardening.md`](state-safety/loop-lock-heartbeat-hardening.md) for full implementation and validation file listings.

---

### Loop-lock single-flight decision

#### Description

Adds opt-in host-local single-flight acquisition so concurrent acquire attempts for one lock collapse behind one live holder.

#### How It Works

`acquireLoopLock(..., { hostLocalSingleFlight: true })` probes a host-local lease before file-lock acquisition, refuses live same-host holders, and treats dead holder state as replaceable without changing the default durable file-lock path.

#### Source Files

See [`state-safety/loop-lock-single-flight-decision.md`](state-safety/loop-lock-single-flight-decision.md) for full implementation and validation file listings.

---

## 6. SCORING

This entry covers the compact Bayesian scoring primitive used by runtime routing decisions.

### Bayesian scorer

#### Description

Scores executor reliability and decides when enough evidence supports demotion.

#### How It Works

Smoothed success scoring and demotion threshold checks.

#### Source Files

See [`scoring/bayesian-scorer.md`](scoring/bayesian-scorer.md) for full implementation and validation file listings.

---

### Convergence score-delta

#### Description

Adds a convergence score-delta signal comparing the current graph score with the prior snapshot.

#### How It Works

`convergence.cjs` reads the prior snapshot before creating the new one, emits `scoreDelta` and `scoreDeltaNote`, and can add an opt-in `improvementEffect` trace when requested.

#### Source Files

See [`scoring/convergence-score-delta.md`](scoring/convergence-score-delta.md) for full implementation and validation file listings.

---

## 7. COVERAGE GRAPH

These entries cover the session-scoped SQLite graph store, graph read models, convergence signals, snapshots, and momentum.

### Coverage graph DB

#### Description

Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle.

#### How It Works

Schema v2, node and edge CRUD, snapshots, stats, composite namespace keys, and DB lifecycle.

#### Source Files

See [`coverage-graph/coverage-graph-db.md`](coverage-graph/coverage-graph-db.md) for full implementation and validation file listings.

---

### Coverage graph query

#### Description

Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

#### How It Works

Session-scoped query helpers for research and review coverage graph reads.

#### Source Files

See [`coverage-graph/coverage-graph-query.md`](coverage-graph/coverage-graph-query.md) for full implementation and validation file listings.

---

### Coverage graph signals

#### Description

Computes convergence signals, node centrality signals, snapshots, and momentum for research and review graphs.

#### How It Works

Node degree/depth, research signals, review signals, snapshots, and momentum.

#### Source Files

See [`coverage-graph/coverage-graph-signals.md`](coverage-graph/coverage-graph-signals.md) for full implementation and validation file listings.

---

### Observation-threshold guard

#### Description

Adds a default-off minimum-observations guard that blocks stop or promotion decisions until leading evidence repeats enough times.

#### How It Works

`convergence.cjs` reads `minObservations` from argv/config/env, `coverage-graph-signals.ts` exposes observation signals, and sub-threshold leading findings are flagged as blockers without changing default parity.

#### Source Files

See [`coverage-graph/observation-threshold-guard.md`](coverage-graph/observation-threshold-guard.md) for full implementation and validation file listings.

---

### Coverage-graph time decay

#### Description

Adds optional time-decay weighting to coverage-graph signal ranking while preserving raw historical coverage counts.

#### How It Works

`timeDecayWeight()` applies half-life decay when `decayDays` is enabled and returns full weight when disabled; signal ranking multiplies edge weight by the decay result without mutating stored graph counts.

#### Source Files

See [`coverage-graph/coverage-graph-time-decay.md`](coverage-graph/coverage-graph-time-decay.md) for full implementation and validation file listings.

---

### Coverage-graph fuzzy merge

#### Description

Adds deterministic fuzzy-merge query helpers for near-duplicate coverage nodes without mutating graph rows.

#### How It Works

`findSimilarNodes()` compares names inside one namespace and category, while `findConsolidationCandidates()` returns candidate clusters and leftovers; callers decide whether to merge results.

#### Source Files

See [`coverage-graph/coverage-graph-fuzzy-merge.md`](coverage-graph/coverage-graph-fuzzy-merge.md) for full implementation and validation file listings.

---

## 8. SCRIPT ENTRY POINTS

These entries cover the direct `.cjs` interfaces that replaced the removed `deep_loop_graph_*` MCP tools.

### convergence.cjs

#### Description

Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

#### How It Works

Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings.

#### Source Files

See [`script-entry-points/convergence-script.md`](script-entry-points/convergence-script.md) for full implementation and validation file listings.

---

### upsert.cjs

#### Description

Stores coverage graph nodes and edges from JSON arrays or iteration graph event files.

#### How It Works

Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops.

#### Source Files

See [`script-entry-points/upsert-script.md`](script-entry-points/upsert-script.md) for full implementation and validation file listings.

---

### query.cjs

#### Description

Reads session-scoped coverage graph views through a direct JSON stdout script interface.

#### How It Works

Direct replacement for `deep_loop_graph_query`; serves gaps, claims, contradictions, provenance, and hot nodes.

#### Source Files

See [`script-entry-points/query-script.md`](script-entry-points/query-script.md) for full implementation and validation file listings.

---

### status.cjs

#### Description

Reports session-scoped coverage graph health, counts, schema version, and current signals.

#### How It Works

Direct replacement for `deep_loop_graph_status`; reports counts, schema, DB size, and signals.

#### Source Files

See [`script-entry-points/status-script.md`](script-entry-points/status-script.md) for full implementation and validation file listings.

---

## 9. COUNCIL

These entries cover the 5 council durability primitives that downstream `deep-ai-council` consumes, per the Runtime Boundary Decision (ADR-001). The council surface mirrors the deep-loop durability contract in a council-scoped CJS surface.

### Multi-seat dispatch

#### Description

Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts.

#### Source Files

See [`council/multi-seat-dispatch.md`](council/multi-seat-dispatch.md) for full implementation and validation file listings.

---

### Round-state JSONL

#### Description

Appends per-round JSONL records with a lock-file single-writer guard; repairs corrupt trailing JSONL before append; fsyncs writes; exposes round-state readers for resume.

#### Source Files

See [`council/round-state-jsonl.md`](council/round-state-jsonl.md) for full implementation and validation file listings.

---

### Adjudicator verdict scoring

#### Description

Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta.

#### Source Files

See [`council/adjudicator-verdict-scoring.md`](council/adjudicator-verdict-scoring.md) for full implementation and validation file listings.

---

### Cost guards

#### Description

Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, max_topics_per_session, saturation_threshold, and seats_per_round; computes upper-bound seat-output budgets.

#### Source Files

See [`council/cost-guards.md`](council/cost-guards.md) for full implementation and validation file listings.

---

### Session state hierarchy

#### Description

Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids.

#### Source Files

See [`council/session-state-hierarchy.md`](council/session-state-hierarchy.md) for full implementation and validation file listings.

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

See [`fanout/fanout-config-schema.md`](fanout/fanout-config-schema.md) for full implementation and validation file listings.

---

### Fan-out worker pool

#### Description

Concurrency-capped pool primitive with injected worker, never-throws per-item settlement,
ordered results, and a JSONL status ledger.

#### Source Files

See [`fanout/fanout-pool.md`](fanout/fanout-pool.md) for full implementation and validation file listings.

---

### Fan-out CLI lineage driver

#### Description

TSX-bootstrapped entry point that spawns N headless CLI subprocesses (opencode, claude,
opencode), each running the full loop in an isolated `lineages/{label}/`
sub-packet, with per-kind state-dir isolation and a post-subprocess salvage sweep.

#### Source Files

See [`fanout/fanout-run.md`](fanout/fanout-run.md) for full implementation and validation file listings.

---

### Fan-out write-failure salvage

#### Description

Post-subprocess salvage that recovers missing or empty iteration `.md` files from captured
subprocess stdout (opencode `--format json` text parts or raw fallback).

#### Source Files

See [`fanout/fanout-salvage.md`](fanout/fanout-salvage.md) for full implementation and validation file listings.

---

### Fan-out cross-lineage merge

#### Description

Cross-lineage merge: research (dedup by `findingId` + cross-model attribution) or review
(strongest-restriction: any active P0 → merged FAIL). Writes consolidated registry and
`fanout-attribution.md`.

#### Source Files

See [`fanout/fanout-merge.md`](fanout/fanout-merge.md) for full implementation and validation file listings.

---

### Fixed-rate overrun accounting

#### Description

Records fixed-rate scheduling overruns without replaying missed slots or violating single-flight dispatch semantics.

#### How It Works

`fanout-run.cjs` measures each slot with monotonic `process.hrtime`, persists `slotDurationMs`, derives clamped `skippedCount`, and the YAML schema declares both fields for persisted state readers.

#### Source Files

See [`fanout/fixed-rate-overrun-accounting.md`](fanout/fixed-rate-overrun-accounting.md) for full implementation and validation file listings.

---

### Fan-out stall watchdog

#### Description

Adds an opt-in fan-out stall watchdog that aborts and requeues lineages when pending lag crosses a configured ceiling.

#### How It Works

`fanout-pool.cjs` accepts `lagCeilingMs` plus `lagCeilingAction:"abort-requeue"`, attaches abort handles per active slot, emits timeout failure-class ledger events, and leaves default pool behavior unchanged.

#### Source Files

See [`fanout/fanout-stall-watchdog.md`](fanout/fanout-stall-watchdog.md) for full implementation and validation file listings.

---

### Persisted-wait crash resume

#### Description

Persists a pre-dispatch wait checkpoint and resumes waiting state before dispatch after a crash restart.

#### How It Works

`fanout-run.cjs` writes nullable `nextRunAt` and `remainingDelayMs` at the wait boundary, classifies `resume-waiting` before dispatch startup logic, and treats missing legacy fields as null safe defaults.

#### Source Files

See [`fanout/persisted-wait-crash-resume.md`](fanout/persisted-wait-crash-resume.md) for full implementation and validation file listings.

---

## 11. LIFECYCLE

These entries cover cancellable waits and lifecycle status contracts shared by deep-loop consumers.

### Abortable chunked sleep

#### Description

Adds an abortable chunked sleep primitive for cancellable waits and executor-boundary abort-signal composition.

#### How It Works

`abortableSleep()` waits in `SLEEP_CHUNK_MS` slices, clears pending timeouts on abort, removes listeners on completion, rejects with `signal.reason`, and accepts composed abort signals for executor-run cancellation.

#### Source Files

See [`lifecycle/abortable-chunked-sleep.md`](lifecycle/abortable-chunked-sleep.md) for full implementation and validation file listings.

---

### Lifecycle taxonomy guards

#### Description

Promotes loop lifecycle status and stop-reason taxonomy with legal transitions and a one-shot paused-wait resume gate.

#### How It Works

`lifecycle-taxonomy.cjs` exports `LoopActiveStatus`, `LoopStopReason`, `LEGAL_TRANSITIONS`, and `createPausedWaitGate()` so consumers share the same active-state, terminal-reason, and resume-resolution contract.

#### Source Files

See [`lifecycle/lifecycle-taxonomy-guards.md`](lifecycle/lifecycle-taxonomy-guards.md) for full implementation and validation file listings.

---

## 12. OBSERVABILITY

These entries cover runtime telemetry, event envelopes, and seekable log-region metadata.

### Byte-offset log regions

#### Description

Stamps seekable byte-region metadata on iteration records and surfaces those offsets in the deep-research dashboard.

#### How It Works

`post-dispatch-validate.ts` records `logOffset`, `logSize`, and `logPath` after transcript writes; the YAML schema declares the optional fields; `reduce-state.cjs` displays the region values for dashboard lookup.

#### Source Files

See [`observability/byte-offset-log-regions.md`](observability/byte-offset-log-regions.md) for full implementation and validation file listings.

---

### Single-loop telemetry heartbeat

#### Description

Adds single-loop telemetry heartbeat rows for started, progress, and terminal lifecycle events with no-change write suppression.

#### How It Works

`deep_research_auto.yaml` emits heartbeat rows tagged `label:"single"` with fan-out-shaped gauges, while `atomic-state.ts` suppresses unchanged telemetry rows through serialized-diff gating.

#### Source Files

See [`observability/single-loop-telemetry-heartbeat.md`](observability/single-loop-telemetry-heartbeat.md) for full implementation and validation file listings.

---

### Unified observability event envelope

#### Description

Adds a unified observability event envelope and routes core runtime emitters through it without migrating legacy rows.

#### How It Works

`observability-events.cjs` normalizes payloads into `schema_version`, `event_id`, `producer`, `stream`, `subject`, `event`, `status`, and native `payload`; fanout-run, convergence, status, council round-state, and research YAML producers append through it.

#### Source Files

See [`observability/unified-observability-event-envelope.md`](observability/unified-observability-event-envelope.md) for full implementation and validation file listings.

---

## 13. TESTING

These entries cover shared runtime/ test harnesses used to keep script and fan-out behavior reproducible.

### Hermetic test isolation

#### Description

Adds shared hermetic test environments so runtime tests can run in parallel without touching real HOME, temp, or database paths.

#### How It Works

`createHermeticEnv()` returns an isolated HOME, DB path, tmp dir, child process environment, and cleanup function; fanout-run tests inject that environment per test and clean it after execution.

#### Source Files

See [`testing/hermetic-test-isolation.md`](testing/hermetic-test-isolation.md) for full implementation and validation file listings.

---

### Record-replay cassette harness

#### Description

Adds record/replay helpers for script-level cassette regressions with redaction and hermetic environment integration.

#### How It Works

`recordScriptRun()` captures normalized argv/stdin/stdout/exit envelopes, `replayScriptRun()` compares current script behavior against a cassette, and convergence/fanout tests use the helpers for pinned regressions.

#### Source Files

See [`testing/record-replay-cassette-harness.md`](testing/record-replay-cassette-harness.md) for full implementation and validation file listings.

---
