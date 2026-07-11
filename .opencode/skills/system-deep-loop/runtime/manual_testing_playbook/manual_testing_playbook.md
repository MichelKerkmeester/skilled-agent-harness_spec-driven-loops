---
title: "runtime/: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review protocol, execution expectations, and per-feature validation files for the runtime/ skill."
version: 1.4.0.15
---

# runtime/: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against real files, scripts, and test fixtures. Use SKIP only when a concrete sandbox blocker prevents execution.

This document combines the operator-facing manual validation contract for the `runtime/` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide while per-feature files carry scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `executor/`
- `prompt-rendering/`
- `validation/`
- `state-safety/`
- `scoring/`
- `coverage-graph/`
- `script-entry-points/`
- `council/`
- `fanout/`
- `lifecycle/`
- `observability/`
- `testing/`

---

## 1. OVERVIEW

This playbook provides 52 deterministic scenarios across 12 categories validating the current `runtime/` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.

### REALISTIC TEST MODEL

1. Start from a user-visible operator or workflow need.
2. Inspect public skill docs before lower-level runtime files when that order matters.
3. Execute the real script, test, or source-inspection command named in the scenario.
4. Capture enough evidence for another operator to reproduce the verdict.
5. Return PASS, PARTIAL, FAIL, or SKIP with rationale.

---

## 2. GLOBAL PRECONDITIONS

- `runtime/` exists at `.opencode/skills/system-deep-loop/runtime/`.
- Runtime libraries exist under `lib/deep-loop/` and `lib/coverage-graph/`.
- Direct scripts exist under `scripts/` and emit JSON-only stdout.
- Runtime tests exist under `tests/{unit,integration,lifecycle}/`.
- Working directory is the repository root.
- Do not mutate sealed files while running manual validation.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Clear scenario verdict with reasoning.
- Command transcript or exact file excerpts.
- Exact prompt used when an AI orchestrator is part of the scenario.
- Output snippets proving JSON stdout shape, exit-code handling, or source anchors when relevant.
- Source path and test path evidence for every scenario.
- Triage notes for non-pass outcomes.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands are shown as `bash: <command>`.
- Script invocations use `node .opencode/skills/system-deep-loop/runtime/scripts/<name>.cjs ...`.
- Source inspections use `rg` and `sed` from the repository root.
- Test invocations use the existing Vitest surface when available.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map in section 14
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

1. Preconditions were satisfied.
2. The exact command or source-inspection sequence was executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. The final outcome references the user-visible runtime behavior.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed
- `SKIP`: concrete sandbox blocker prevents execution and is documented

Release is `READY` only when all 52 scenarios are `PASS` or documented `SKIP` with no critical-path script, state-safety, or schema blocker.

---

## 6. EXECUTOR

This category covers 4 scenarios while the linked feature files remain the canonical execution contract.

### DLR-001 | Executor config

#### Description
Parses and normalizes per-iteration executor configuration for native and CLI-backed deep-loop dispatch.

#### Scenario Contract
Prompt: `Validate Executor config and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-001](executor/executor-config.md)

### DLR-002 | Executor audit

#### Description
Records executor provenance and guards recursive external-CLI dispatch inside iteration state logs.

#### Scenario Contract
Prompt: `Validate Executor audit and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-002](executor/executor-audit.md)

### DLR-003 | Fallback router

#### Description
Chooses whether a failed model should fall back to a configured target or fail fast.

#### Scenario Contract
Prompt: `Validate Fallback router and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-003](executor/fallback-router.md)

---

### DLR-044 | Fallback-router typed reroute

#### Description
Adds typed fallback-route metadata, route trace fields, and startup graph validation for executor fallback routing.

#### Scenario Contract
Prompt: `Validate Fallback-router typed reroute and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Route trace metadata, preflight validation errors, cycle detection, and same-scope routing coverage.

#### Test Execution
> **Feature File:** [DLR-044](executor/fallback-router-typed-reroute.md)

---

## 7. PROMPT RENDERING

This category covers 1 scenario while the linked feature files remain the canonical execution contract.

### DLR-004 | Prompt pack

#### Description
Renders prompt-pack templates with checked placeholder variables.

#### Scenario Contract
Prompt: `Validate Prompt pack and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-004](prompt-rendering/prompt-pack.md)

---

## 8. VALIDATION

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### DLR-005 | Post-dispatch validate

#### Description
Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail.

#### Scenario Contract
Prompt: `Validate Post-dispatch validate and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-005](validation/post-dispatch-validate.md)

---

### DLR-045 | LLM-judge hardening

#### Description
Hardens LLM judge validation with retries, dual timeouts, format-strip parsing, neutral fallback cards, and quarantine gating.

#### Scenario Contract
Prompt: `Validate LLM-judge hardening and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Retry behavior, neutral fallback card shape, quarantine skip paths, and non-quarantined success coverage.

#### Test Execution
> **Feature File:** [DLR-045](validation/llm-judge-hardening.md)

---

### DLR-052 | mk-deep-loop-guard

#### Description
Detection-layer OpenCode plugin with two checks: flags/blocks a Task dispatch whose declared Deep Route mode disagrees with `mode-registry.json`'s entry for the resolved target agent, and flags/blocks a session-scoped loop-like repeated `orchestrate`-to-command-owned-loop-executor dispatch. Also sweeps/archives/prunes its own `.loop-guard-state` directory on `session.created` so it does not grow unbounded.

#### Scenario Contract
Prompt: `Verify mk-deep-loop-guard still detects a Deep Route mode mismatch and a loop-like repeated dispatch, and respects MK_DEEP_LOOP_GUARD_REJECT / MK_DEEP_LOOP_GUARD_REJECT_LOOP.`

Expected signals: Hook fires and logs a warning on mismatch or loop-repeat (default); throws and blocks the dispatch when the matching reject env var is set; stays silent on matching modes, command-driven iterations, non-deep/non-loop-executor `subagent_type` values, and when the registry/state directory is unreadable. A stale per-session state file is archived (not deleted) on the next `session.created` sweep.

#### Test Execution
> **Feature File:** [DLR-052](validation/mk-deep-loop-guard.md)

---

## 9. STATE SAFETY

This category covers 10 scenarios while the linked feature files remain the canonical execution contract.

### DLR-006 | Atomic state

#### Description
Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

#### Scenario Contract
Prompt: `Validate Atomic state and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-006](state-safety/atomic-state.md)

### DLR-007 | JSONL repair

#### Description
Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines.

#### Scenario Contract
Prompt: `Validate JSONL repair and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-007](state-safety/jsonl-repair.md)

### DLR-008 | Loop lock

#### Description
Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

#### Scenario Contract
Prompt: `Validate Loop lock and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-008](state-safety/loop-lock.md)

### DLR-009 | Permissions gate

#### Description
Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules.

#### Scenario Contract
Prompt: `Validate Permissions gate and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Deterministic mutation safety evidence from source and unit tests.

#### Test Execution
> **Feature File:** [DLR-009](state-safety/permissions-gate.md)

---

### DLR-030 | Atomic-state serialize-diff

#### Description
Adds `writeStateIfChangedAtomic()` so snapshot writers skip fsync and rename when canonical serialized state has not changed.

#### Scenario Contract
Prompt: `Validate Atomic-state serialize-diff and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Compare-before-write behavior from source plus unit coverage for first write, unchanged skip, and changed-state rewrite.

#### Test Execution
> **Feature File:** [DLR-030](state-safety/atomic-state-serialize-diff.md)

### DLR-031 | Atomic-state integrity helpers

#### Description
Adds SHA-256 integrity helpers for object and registry JSON without applying the contract to append-only JSONL.

#### Scenario Contract
Prompt: `Validate Atomic-state integrity helpers and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Integrity hash, stamping, stable key order, and mismatch warning behavior from unit tests.

#### Test Execution
> **Feature File:** [DLR-031](state-safety/atomic-state-integrity-helpers.md)

### DLR-032 | Atomic-state deferred writer

#### Description
Adds a per-path deferred atomic writer that coalesces superseded snapshot writes while keeping JSONL appends immediate.

#### Scenario Contract
Prompt: `Validate Atomic-state deferred writer and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Debounce, superseded-write coalescing, dirty-again reflush, flushNow, and close coverage in atomic-state unit tests.

#### Test Execution
> **Feature File:** [DLR-032](state-safety/atomic-state-deferred-writer.md)

### DLR-035 | JSONL lock-held merge

#### Description
Adds a lock-held JSONL merge path for fan-out salvage so recovered events are deduplicated before atomic rewrite.

#### Scenario Contract
Prompt: `Validate JSONL lock-held merge and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Merge dedupe, reread-under-lock behavior, atomic rewrite, and fanout-salvage integration tests.

#### Test Execution
> **Feature File:** [DLR-035](state-safety/jsonl-lock-held-merge.md)

### DLR-036 | Loop-lock heartbeat hardening

#### Description
Hardens loop-lock ownership with TTL-aware heartbeat refresh plus phase and last-activity metadata.

#### Scenario Contract
Prompt: `Validate Loop-lock heartbeat hardening and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Heartbeat refresh updates, metadata preservation, stale holder replacement, and loop-lock unit coverage.

#### Test Execution
> **Feature File:** [DLR-036](state-safety/loop-lock-heartbeat-hardening.md)

### DLR-037 | Loop-lock single-flight decision

#### Description
Adds opt-in host-local single-flight acquisition so concurrent acquire attempts for one lock collapse behind one live holder.

#### Scenario Contract
Prompt: `Validate Loop-lock single-flight decision and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Default file-lock behavior remains unchanged while opt-in host-local same-lock attempts refuse the second live holder.

#### Test Execution
> **Feature File:** [DLR-037](state-safety/loop-lock-single-flight-decision.md)

---

## 10. SCORING

This category covers 2 scenarios while the linked feature files remain the canonical execution contract.

### DLR-010 | Bayesian scorer

#### Description
Scores executor reliability and decides when enough evidence supports demotion.

#### Scenario Contract
Prompt: `Validate Bayesian scorer and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Runtime behavior matches the source contract and primary regression test.

#### Test Execution
> **Feature File:** [DLR-010](scoring/bayesian-scorer.md)

---

### DLR-040 | Convergence score-delta

#### Description
Adds a convergence score-delta signal comparing the current graph score with the prior snapshot.

#### Scenario Contract
Prompt: `Validate Convergence score-delta and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: First-iteration null delta, prior-snapshot delta, graph output bindings, and improvement-effect trace coverage.

#### Test Execution
> **Feature File:** [DLR-040](scoring/convergence-score-delta.md)

---

## 11. COVERAGE GRAPH

This category covers 6 scenarios while the linked feature files remain the canonical execution contract.

### DLR-011 | Coverage graph DB

#### Description
Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle.

#### Scenario Contract
Prompt: `Validate Coverage graph DB and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.

#### Test Execution
> **Feature File:** [DLR-011](coverage-graph/coverage-graph-db.md)

### DLR-012 | Coverage graph query

#### Description
Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

#### Scenario Contract
Prompt: `Validate Coverage graph query and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.

#### Test Execution
> **Feature File:** [DLR-012](coverage-graph/coverage-graph-query.md)

### DLR-013 | Coverage graph signals

#### Description
Computes convergence signals, node centrality signals, snapshots, and momentum for research and review graphs.

#### Scenario Contract
Prompt: `Validate Coverage graph signals and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.

#### Test Execution
> **Feature File:** [DLR-013](coverage-graph/coverage-graph-signals.md)

---

### DLR-041 | Observation-threshold guard

#### Description
Adds a default-off minimum-observations guard that blocks stop or promotion decisions until leading evidence repeats enough times.

#### Scenario Contract
Prompt: `Validate Observation-threshold guard and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Default-off parity, configured threshold parsing, sub-threshold STOP blocking, and passing-threshold evidence coverage.

#### Test Execution
> **Feature File:** [DLR-041](coverage-graph/observation-threshold-guard.md)

### DLR-042 | Coverage-graph time decay

#### Description
Adds optional time-decay weighting to coverage-graph signal ranking while preserving raw historical coverage counts.

#### Scenario Contract
Prompt: `Validate Coverage-graph time decay and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: No-decay full weight, half-life decay math, ranking integration, and convergence parity coverage.

#### Test Execution
> **Feature File:** [DLR-042](coverage-graph/coverage-graph-time-decay.md)

### DLR-043 | Coverage-graph fuzzy merge

#### Description
Adds deterministic fuzzy-merge query helpers for near-duplicate coverage nodes without mutating graph rows.

#### Scenario Contract
Prompt: `Validate Coverage-graph fuzzy merge and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Similarity thresholding, category guard, bounded namespace behavior, and query-only consolidation candidate tests.

#### Test Execution
> **Feature File:** [DLR-043](coverage-graph/coverage-graph-fuzzy-merge.md)

---

## 12. SCRIPT ENTRY POINTS

This category covers 4 scenarios while the linked feature files remain the canonical execution contract.

### DLR-014 | convergence.cjs

#### Description
Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

#### Scenario Contract
Prompt: `Validate convergence.cjs and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-014](script-entry-points/convergence-script.md)

### DLR-015 | upsert.cjs

#### Description
Stores coverage graph nodes and edges from JSON arrays or iteration graph event files.

#### Scenario Contract
Prompt: `Validate upsert.cjs and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-015](script-entry-points/upsert-script.md)

### DLR-016 | query.cjs

#### Description
Reads session-scoped coverage graph views through a direct JSON stdout script interface.

#### Scenario Contract
Prompt: `Validate query.cjs and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-016](script-entry-points/query-script.md)

### DLR-017 | status.cjs

#### Description
Reports session-scoped coverage graph health, counts, schema version, and current signals.

#### Scenario Contract
Prompt: `Validate status.cjs and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.

#### Test Execution
> **Feature File:** [DLR-017](script-entry-points/status-script.md)

---

## 13. COUNCIL

Per the Runtime Boundary Decision (ADR-001), `lib/council/` provides 5 durability primitives consumed by `deep-ai-council`. These scenarios validate the council surface.

### DLR-018 | Multi-seat dispatch

#### Description

Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts.

#### Test Execution
> **Feature File:** [DLR-018](council/multi-seat-dispatch.md)

### DLR-019 | Round-state JSONL

#### Description

Appends per-round JSONL records with a lock-file single-writer guard; repairs corrupt trailing JSONL before append; fsyncs writes; exposes round-state readers for resume.

#### Test Execution
> **Feature File:** [DLR-019](council/round-state-jsonl.md)

### DLR-020 | Adjudicator verdict scoring

#### Description

Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta.

#### Test Execution
> **Feature File:** [DLR-020](council/adjudicator-verdict-scoring.md)

### DLR-021 | Cost guards

#### Description

Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, max_topics_per_session, saturation_threshold, and seats_per_round; computes upper-bound seat-output budgets.

#### Test Execution
> **Feature File:** [DLR-021](council/cost-guards.md)

### DLR-022 | Session state hierarchy

#### Description

Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids.

#### Test Execution
> **Feature File:** [DLR-022](council/session-state-hierarchy.md)

---

## 14. FAN-OUT

This category covers 10 scenarios validating the opt-in multi-executor fan-out layer added in packet 124: config schema, pool primitive, CLI lineage driver, write-failure salvage, research merge, review strongest-restriction, and artifact-dir-override parity.

### DLR-023 | Fan-out config schema

#### Description
Validates `parseFanoutConfig` + `expandLineages`: unique-label enforcement, collision detection, count expansion, per-entry kind validation reuse, and `lineageId` byte-identity when absent.

#### Scenario Contract
Prompt: `Validate fan-out config schema and confirm the 9 fan-out tests pass and align with the executor-config.ts implementation.`

Expected signals: 36/36 executor-config tests pass; fan-out schema layer does not modify existing `executorConfigSchema`.

#### Test Execution
> **Feature File:** [DLR-023](fanout/fanout-config-schema.md)

### DLR-024 | Fan-out worker pool concurrency cap

#### Description
Validates `runCappedPool` respects the cap, isolates per-item failures, returns ordered results, and emits JSONL ledger events.

#### Scenario Contract
Prompt: `Validate the fan-out worker pool and confirm the 10 unit tests pass, verifying concurrency cap and per-item failure isolation.`

Expected signals: 10/10 pool tests pass; gated-worker confirms max N in flight; failure-isolation confirms pool continues after one rejection.

#### Test Execution
> **Feature File:** [DLR-024](fanout/fanout-pool-concurrency-cap.md)

### DLR-025 | Fan-out CLI lineage driver spawn and isolation

#### Description
Validates `fanout-run.cjs` creates distinct per-lineage dirs and `.executor-state` paths, saves stdout, and writes orchestration artifacts.

#### Scenario Contract
Prompt: `Validate the fan-out CLI lineage driver and confirm the 5 integration tests pass, verifying lineage isolation and orchestration artifact creation.`

Expected signals: 5/5 fanout-run tests pass; lineage dirs distinct; orchestration summary present.

#### Test Execution
> **Feature File:** [DLR-025](fanout/fanout-run-cli-lineage-spawn.md)

### DLR-026 | Fan-out write-failure salvage

#### Description
Validates `runSalvageSweep` recovers missing iteration files from stdout, `extractTextFromOpencodeJson` parses opencode JSON text parts, and per-sessionId coverage isolation holds.

#### Scenario Contract
Prompt: `Validate the fan-out salvage module and confirm the 11 unit tests pass, verifying opencode stdout parsing, iteration recovery, and per-sessionId coverage isolation.`

Expected signals: 11/11 fanout-salvage tests pass.

#### Test Execution
> **Feature File:** [DLR-026](fanout/fanout-salvage-recovery.md)

### DLR-027 | Fan-out merge: research dedup and attribution

#### Description
Validates `mergeResearchRegistries` deduplicates by `findingId`, builds `_lineages` attribution, and aggregates metrics.

#### Scenario Contract
Prompt: `Validate the research fan-out merge and confirm the 3 research unit tests pass, verifying deduplication, attribution, and metric aggregation.`

Expected signals: Research tests pass; duplicate `findingId` → single entry with `_lineages` array.

#### Test Execution
> **Feature File:** [DLR-027](fanout/fanout-merge-research.md)

### DLR-028 | Fan-out merge: review strongest-restriction

#### Description
Validates `mergeReviewRegistries` strongest-restriction: all 5 verdict combinations correct, duplicate findingId escalates to highest severity, non-active findings excluded.

#### Scenario Contract
Prompt: `Validate the review fan-out strongest-restriction merge and confirm all 5 review unit tests pass.`

Expected signals: 5/5 review tests pass; clean+P0 → FAIL; all clean → PASS; P1-only → CONDITIONAL.

#### Test Execution
> **Feature File:** [DLR-028](fanout/fanout-merge-review-strongest-restriction.md)

### DLR-029 | Artifact-dir override and single-executor parity

#### Description
Validates the YAML `if_absent` branch is byte-identical to the original resolver and both fan-out steps are fully skipped when `config.fanout` is absent.

#### Scenario Contract
Prompt: `Validate fan-out YAML parity: confirm single-executor behavior is unchanged by inspecting the if_absent branch and skip_when guards, then run 197/197 vitest.`

Expected signals: `if_absent` command unchanged; `step_fanout_spawn` and `step_fanout_merge` have `skip_when: "config.fanout is absent"`; vitest 197/197.

#### Test Execution
> **Feature File:** [DLR-029](fanout/artifact-dir-override-parity.md)

---

### DLR-039 | Fixed-rate overrun accounting

#### Description
Records fixed-rate scheduling overruns without replaying missed slots or violating single-flight dispatch semantics.

#### Scenario Contract
Prompt: `Validate Fixed-rate overrun accounting and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Fast-slot zero skip, overrun skip count, slot duration persistence, and no catch-up dispatch behavior.

#### Test Execution
> **Feature File:** [DLR-039](fanout/fixed-rate-overrun-accounting.md)

### DLR-046 | Fan-out stall watchdog

#### Description
Adds an opt-in fan-out stall watchdog that aborts and requeues lineages when pending lag crosses a configured ceiling.

#### Scenario Contract
Prompt: `Validate Fan-out stall watchdog and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: No-op default behavior, lag-ceiling event emission, abort-and-requeue handling, and required positive threshold validation.

#### Test Execution
> **Feature File:** [DLR-046](fanout/fanout-stall-watchdog.md)

### DLR-047 | Persisted-wait crash resume

#### Description
Persists a pre-dispatch wait checkpoint and resumes waiting state before dispatch after a crash restart.

#### Scenario Contract
Prompt: `Validate Persisted-wait crash resume and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Wait checkpoint persistence, resume-waiting startup branch, null legacy migration behavior, and fanout-run unit coverage.

#### Test Execution
> **Feature File:** [DLR-047](fanout/persisted-wait-crash-resume.md)

---

## 15. LIFECYCLE

This category covers 2 scenarios while the linked feature files remain the canonical execution contract.

### DLR-033 | Abortable chunked sleep

#### Description
Adds an abortable chunked sleep primitive for cancellable waits and executor-boundary abort-signal composition.

#### Scenario Contract
Prompt: `Validate Abortable chunked sleep and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Sleep resolves after chunked waits, rejects on abort, removes listeners, and supports composed abort-signal cancellation.

#### Test Execution
> **Feature File:** [DLR-033](lifecycle/abortable-chunked-sleep.md)

### DLR-034 | Lifecycle taxonomy guards

#### Description
Promotes loop lifecycle status and stop-reason taxonomy with legal transitions and a one-shot paused-wait resume gate.

#### Scenario Contract
Prompt: `Validate Lifecycle taxonomy guards and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Taxonomy export, legal-transition map, backward-compatible literals, and one-shot resume gate coverage.

#### Test Execution
> **Feature File:** [DLR-034](lifecycle/lifecycle-taxonomy-guards.md)

---

## 16. OBSERVABILITY

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### DLR-038 | Byte-offset log regions

#### Description
Stamps seekable byte-region metadata on iteration records and surfaces those offsets in the deep-research dashboard.

#### Scenario Contract
Prompt: `Validate Byte-offset log regions and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Stamped offset fields, readable byte slices, schema fields, and reducer dashboard output coverage.

#### Test Execution
> **Feature File:** [DLR-038](observability/byte-offset-log-regions.md)

### DLR-048 | Single-loop telemetry heartbeat

#### Description
Adds single-loop telemetry heartbeat rows for started, progress, and terminal lifecycle events with no-change write suppression.

#### Scenario Contract
Prompt: `Validate Single-loop telemetry heartbeat and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Started/progress/terminal heartbeat producers, single-loop row shape, no-change suppression, and YAML parse coverage.

#### Test Execution
> **Feature File:** [DLR-048](observability/single-loop-telemetry-heartbeat.md)

### DLR-049 | Unified observability event envelope

#### Description
Adds a unified observability event envelope and routes core runtime emitters through it without migrating legacy rows.

#### Scenario Contract
Prompt: `Validate Unified observability event envelope and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Envelope normalization, append behavior, core emitter wiring, and status/convergence parity coverage.

#### Test Execution
> **Feature File:** [DLR-049](observability/unified-observability-event-envelope.md)

---

## 17. TESTING

This category covers 2 scenarios while the linked feature files remain the canonical execution contract.

### DLR-050 | Hermetic test isolation

#### Description
Adds shared hermetic test environments so runtime tests can run in parallel without touching real HOME, temp, or database paths.

#### Scenario Contract
Prompt: `Validate Hermetic test isolation and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Per-test HOME/DB/temp isolation, child-env injection, cleanup behavior, and parallel fanout-run test coverage.

#### Test Execution
> **Feature File:** [DLR-050](testing/hermetic-test-isolation.md)

### DLR-051 | Record-replay cassette harness

#### Description
Adds record/replay helpers for script-level cassette regressions with redaction and hermetic environment integration.

#### Scenario Contract
Prompt: `Validate Record-replay cassette harness and report whether the current source, script surface, and tests agree with the runtime/ contract.`

Expected signals: Cassette recording, deterministic replay, redacted path/timestamp placeholders, and convergence/fanout regression coverage.

#### Test Execution
> **Feature File:** [DLR-051](testing/record-replay-cassette-harness.md)

---

## 18. AUTOMATED TEST CROSS-REFERENCE

| Surface | Tests | Purpose |
|---|---|---|
| Executor | `tests/unit/executor-config.vitest.ts`, `tests/unit/executor-audit*.vitest.ts`, `tests/unit/fallback-router.vitest.ts`, `tests/unit/cli-matrix.vitest.ts` | Executor parsing, audit, fallback, and CLI dispatch behavior. |
| Prompt and validation | `tests/unit/prompt-pack.vitest.ts`, `tests/unit/post-dispatch-validate.vitest.ts`, `tests/integration/review-depth-validator.vitest.ts` | Prompt rendering and post-dispatch validation. |
| State safety | `tests/unit/atomic-state.vitest.ts`, `tests/unit/jsonl-repair.vitest.ts`, `tests/unit/loop-lock.vitest.ts`, `tests/unit/permissions-gate.vitest.ts` | Atomic writes, repair, locking, and permissions. |
| Coverage graph scripts | `tests/integration/{convergence,query,status,upsert}-script.vitest.ts`, `tests/lifecycle/db-open-close.vitest.ts` | Direct script behavior and DB lifecycle. |
| Review-depth integration | `tests/integration/review-depth-*.vitest.ts` | Review graph, convergence, and validator fixtures. |
| Council | `tests/council/{multi-seat-dispatch,round-state-jsonl,adjudicator-verdict-scoring,cost-guards,session-state-hierarchy}.vitest.ts` | Council durability primitives: parallel dispatch, JSONL append + repair, verdict-delta scoring, cost guards, state-hierarchy validation. |
| Fan-Out | `tests/unit/executor-config.vitest.ts`, `tests/unit/fanout-pool.vitest.ts`, `tests/unit/fanout-run.vitest.ts`, `tests/unit/fanout-salvage.vitest.ts`, `tests/unit/fanout-merge.vitest.ts` | Fan-out config schema, pool concurrency, CLI lineage dispatch, write-failure salvage, research/review merge, stall watchdog, fixed-rate overrun, and persisted wait resume. |
| Lifecycle | `tests/unit/sleep.vitest.ts`, `tests/unit/lifecycle-taxonomy-guards.vitest.ts` | Abortable waits and lifecycle taxonomy guards. |
| Observability | `tests/unit/observability-events.vitest.ts`, `tests/unit/post-dispatch-validate.vitest.ts`, `tests/unit/deep-research-reduce-state.vitest.ts`, `tests/integration/status-script.vitest.ts` | Event envelopes, telemetry heartbeat wiring, and seekable log-region metadata. |
| Testing harness | `tests/helpers/spawn-cjs.ts`, `tests/integration/convergence-script.vitest.ts`, `tests/unit/fanout-run.vitest.ts` | Hermetic environments and record/replay cassettes for script regressions. |

---

## 19. FEATURE CATALOG CROSS-REFERENCE INDEX

| Scenario | Feature Catalog Entry | Scenario File |
|---|---|---|
| DLR-001 | [F001 Executor config](../feature_catalog/executor/executor-config.md) | [executor/executor-config.md](executor/executor-config.md) |
| DLR-002 | [F002 Executor audit](../feature_catalog/executor/executor-audit.md) | [executor/executor-audit.md](executor/executor-audit.md) |
| DLR-003 | [F003 Fallback router](../feature_catalog/executor/fallback-router.md) | [executor/fallback-router.md](executor/fallback-router.md) |
| DLR-004 | [F004 Prompt pack](../feature_catalog/prompt-rendering/prompt-pack.md) | [prompt-rendering/prompt-pack.md](prompt-rendering/prompt-pack.md) |
| DLR-005 | [F005 Post-dispatch validate](../feature_catalog/validation/post-dispatch-validate.md) | [validation/post-dispatch-validate.md](validation/post-dispatch-validate.md) |
| DLR-006 | [F006 Atomic state](../feature_catalog/state-safety/atomic-state.md) | [state-safety/atomic-state.md](state-safety/atomic-state.md) |
| DLR-007 | [F007 JSONL repair](../feature_catalog/state-safety/jsonl-repair.md) | [state-safety/jsonl-repair.md](state-safety/jsonl-repair.md) |
| DLR-008 | [F008 Loop lock](../feature_catalog/state-safety/loop-lock.md) | [state-safety/loop-lock.md](state-safety/loop-lock.md) |
| DLR-009 | [F009 Permissions gate](../feature_catalog/state-safety/permissions-gate.md) | [state-safety/permissions-gate.md](state-safety/permissions-gate.md) |
| DLR-010 | [F010 Bayesian scorer](../feature_catalog/scoring/bayesian-scorer.md) | [scoring/bayesian-scorer.md](scoring/bayesian-scorer.md) |
| DLR-011 | [F011 Coverage graph DB](../feature_catalog/coverage-graph/coverage-graph-db.md) | [coverage-graph/coverage-graph-db.md](coverage-graph/coverage-graph-db.md) |
| DLR-012 | [F012 Coverage graph query](../feature_catalog/coverage-graph/coverage-graph-query.md) | [coverage-graph/coverage-graph-query.md](coverage-graph/coverage-graph-query.md) |
| DLR-013 | [F013 Coverage graph signals](../feature_catalog/coverage-graph/coverage-graph-signals.md) | [coverage-graph/coverage-graph-signals.md](coverage-graph/coverage-graph-signals.md) |
| DLR-014 | [F014 convergence.cjs](../feature_catalog/script-entry-points/convergence-script.md) | [script-entry-points/convergence-script.md](script-entry-points/convergence-script.md) |
| DLR-015 | [F015 upsert.cjs](../feature_catalog/script-entry-points/upsert-script.md) | [script-entry-points/upsert-script.md](script-entry-points/upsert-script.md) |
| DLR-016 | [F016 query.cjs](../feature_catalog/script-entry-points/query-script.md) | [script-entry-points/query-script.md](script-entry-points/query-script.md) |
| DLR-017 | [F017 status.cjs](../feature_catalog/script-entry-points/status-script.md) | [script-entry-points/status-script.md](script-entry-points/status-script.md) |
| DLR-018 | [F018 Multi-seat dispatch](../feature_catalog/council/multi-seat-dispatch.md) | [council/multi-seat-dispatch.md](council/multi-seat-dispatch.md) |
| DLR-019 | [F019 Round-state JSONL](../feature_catalog/council/round-state-jsonl.md) | [council/round-state-jsonl.md](council/round-state-jsonl.md) |
| DLR-020 | [F020 Adjudicator verdict scoring](../feature_catalog/council/adjudicator-verdict-scoring.md) | [council/adjudicator-verdict-scoring.md](council/adjudicator-verdict-scoring.md) |
| DLR-021 | [F021 Cost guards](../feature_catalog/council/cost-guards.md) | [council/cost-guards.md](council/cost-guards.md) |
| DLR-022 | [F022 Session state hierarchy](../feature_catalog/council/session-state-hierarchy.md) | [council/session-state-hierarchy.md](council/session-state-hierarchy.md) |
| DLR-023 | [F023 Fan-out config schema](../feature_catalog/fanout/fanout-config-schema.md) | [fanout/fanout-config-schema.md](fanout/fanout-config-schema.md) |
| DLR-024 | [F024 Fan-out worker pool](../feature_catalog/fanout/fanout-pool.md) | [fanout/fanout-pool-concurrency-cap.md](fanout/fanout-pool-concurrency-cap.md) |
| DLR-025 | [F025 Fan-out CLI lineage driver](../feature_catalog/fanout/fanout-run.md) | [fanout/fanout-run-cli-lineage-spawn.md](fanout/fanout-run-cli-lineage-spawn.md) |
| DLR-026 | [F026 Fan-out write-failure salvage](../feature_catalog/fanout/fanout-salvage.md) | [fanout/fanout-salvage-recovery.md](fanout/fanout-salvage-recovery.md) |
| DLR-027 | [F027 Fan-out cross-lineage merge (research)](../feature_catalog/fanout/fanout-merge.md) | [fanout/fanout-merge-research.md](fanout/fanout-merge-research.md) |
| DLR-028 | [F027 Fan-out cross-lineage merge (review)](../feature_catalog/fanout/fanout-merge.md) | [fanout/fanout-merge-review-strongest-restriction.md](fanout/fanout-merge-review-strongest-restriction.md) |
| DLR-029 | [F023 Artifact-dir override / parity](../feature_catalog/fanout/fanout-config-schema.md) | [fanout/artifact-dir-override-parity.md](fanout/artifact-dir-override-parity.md) |
| DLR-030 | [F028 Atomic-state serialize-diff](../feature_catalog/state-safety/atomic-state-serialize-diff.md) | [state-safety/atomic-state-serialize-diff.md](state-safety/atomic-state-serialize-diff.md) |
| DLR-031 | [F029 Atomic-state integrity helpers](../feature_catalog/state-safety/atomic-state-integrity-helpers.md) | [state-safety/atomic-state-integrity-helpers.md](state-safety/atomic-state-integrity-helpers.md) |
| DLR-032 | [F030 Atomic-state deferred writer](../feature_catalog/state-safety/atomic-state-deferred-writer.md) | [state-safety/atomic-state-deferred-writer.md](state-safety/atomic-state-deferred-writer.md) |
| DLR-033 | [F031 Abortable chunked sleep](../feature_catalog/lifecycle/abortable-chunked-sleep.md) | [lifecycle/abortable-chunked-sleep.md](lifecycle/abortable-chunked-sleep.md) |
| DLR-034 | [F032 Lifecycle taxonomy guards](../feature_catalog/lifecycle/lifecycle-taxonomy-guards.md) | [lifecycle/lifecycle-taxonomy-guards.md](lifecycle/lifecycle-taxonomy-guards.md) |
| DLR-035 | [F033 JSONL lock-held merge](../feature_catalog/state-safety/jsonl-lock-held-merge.md) | [state-safety/jsonl-lock-held-merge.md](state-safety/jsonl-lock-held-merge.md) |
| DLR-036 | [F034 Loop-lock heartbeat hardening](../feature_catalog/state-safety/loop-lock-heartbeat-hardening.md) | [state-safety/loop-lock-heartbeat-hardening.md](state-safety/loop-lock-heartbeat-hardening.md) |
| DLR-037 | [F035 Loop-lock single-flight decision](../feature_catalog/state-safety/loop-lock-single-flight-decision.md) | [state-safety/loop-lock-single-flight-decision.md](state-safety/loop-lock-single-flight-decision.md) |
| DLR-038 | [F036 Byte-offset log regions](../feature_catalog/observability/byte-offset-log-regions.md) | [observability/byte-offset-log-regions.md](observability/byte-offset-log-regions.md) |
| DLR-039 | [F037 Fixed-rate overrun accounting](../feature_catalog/fanout/fixed-rate-overrun-accounting.md) | [fanout/fixed-rate-overrun-accounting.md](fanout/fixed-rate-overrun-accounting.md) |
| DLR-040 | [F038 Convergence score-delta](../feature_catalog/scoring/convergence-score-delta.md) | [scoring/convergence-score-delta.md](scoring/convergence-score-delta.md) |
| DLR-041 | [F039 Observation-threshold guard](../feature_catalog/coverage-graph/observation-threshold-guard.md) | [coverage-graph/observation-threshold-guard.md](coverage-graph/observation-threshold-guard.md) |
| DLR-042 | [F040 Coverage-graph time decay](../feature_catalog/coverage-graph/coverage-graph-time-decay.md) | [coverage-graph/coverage-graph-time-decay.md](coverage-graph/coverage-graph-time-decay.md) |
| DLR-043 | [F041 Coverage-graph fuzzy merge](../feature_catalog/coverage-graph/coverage-graph-fuzzy-merge.md) | [coverage-graph/coverage-graph-fuzzy-merge.md](coverage-graph/coverage-graph-fuzzy-merge.md) |
| DLR-044 | [F042 Fallback-router typed reroute](../feature_catalog/executor/fallback-router-typed-reroute.md) | [executor/fallback-router-typed-reroute.md](executor/fallback-router-typed-reroute.md) |
| DLR-045 | [F043 LLM-judge hardening](../feature_catalog/validation/llm-judge-hardening.md) | [validation/llm-judge-hardening.md](validation/llm-judge-hardening.md) |
| DLR-046 | [F044 Fan-out stall watchdog](../feature_catalog/fanout/fanout-stall-watchdog.md) | [fanout/fanout-stall-watchdog.md](fanout/fanout-stall-watchdog.md) |
| DLR-047 | [F045 Persisted-wait crash resume](../feature_catalog/fanout/persisted-wait-crash-resume.md) | [fanout/persisted-wait-crash-resume.md](fanout/persisted-wait-crash-resume.md) |
| DLR-048 | [F046 Single-loop telemetry heartbeat](../feature_catalog/observability/single-loop-telemetry-heartbeat.md) | [observability/single-loop-telemetry-heartbeat.md](observability/single-loop-telemetry-heartbeat.md) |
| DLR-049 | [F047 Unified observability event envelope](../feature_catalog/observability/unified-observability-event-envelope.md) | [observability/unified-observability-event-envelope.md](observability/unified-observability-event-envelope.md) |
| DLR-050 | [F048 Hermetic test isolation](../feature_catalog/testing/hermetic-test-isolation.md) | [testing/hermetic-test-isolation.md](testing/hermetic-test-isolation.md) |
| DLR-051 | [F049 Record-replay cassette harness](../feature_catalog/testing/record-replay-cassette-harness.md) | [testing/record-replay-cassette-harness.md](testing/record-replay-cassette-harness.md) |
| DLR-052 | [F050 mk-deep-loop-guard](../feature_catalog/validation/mk-deep-loop-guard.md) | [validation/mk-deep-loop-guard.md](validation/mk-deep-loop-guard.md) |
