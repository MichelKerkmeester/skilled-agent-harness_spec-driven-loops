---
title: "deep-context: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the deep-context iterative codebase-context-gathering loop."
trigger_phrases:
  - "deep-context"
  - "codebase context loop"
  - "feature catalog"
  - "gather context for feature"
  - "heterogeneous parallel sweep"
last_updated: "2026-06-06"
version: 1.2.0.5
---

# deep-context: Feature Catalog

This document combines the current feature inventory for the `deep-context` system into a single reference. The root catalog acts as the system-level directory: it summarizes the frontier seeding, by-model parallel sweep, agreement merge, convergence detection, context report synthesis, and coverage-graph schema capabilities, then points to the per-feature files that carry the deeper implementation and validation anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `deep-context` feature surface. The numbered sections below group the system by capability area so readers can move from a top-level summary into per-feature reference files without losing the implementation and validation context behind each loop behavior.

| Category | Coverage | Primary Runtime Surface |
|---|---:|---|
| Frontier seeding | 3 features | `deep_context_auto.yaml` phase_init, `code_graph_query`, `context.md` setup phase |
| By-model parallel sweep | 4 features | `phase_loop` YAML, `multi-seat-dispatch.cjs`, `fanout-run.cjs`, `sk-prompt-models` |
| Agreement merge | 3 features | `phase_loop` step_merge_findings, `reduce-state.cjs`, `fanout-merge.cjs` |
| Convergence detection | 5 features | `convergence.cjs`, `coverage-graph-signals.ts`, `convergence.md`, `phase_loop` step_check_convergence |
| Context report synthesis | 3 features | `phase_synthesis` YAML, `context_report_template.md`, `generate-context.js` |
| Coverage-graph schema | 4 features | `coverage-graph-db.ts`, `coverage-graph-signals.ts`, `coverage-graph-query.ts`, `upsert.cjs` |
| Runtime robustness | 5 features | `reduce-state.cjs`, `loop-lock.cjs`, `atomic-state.ts`, `jsonl-repair.ts`, `loop-lock.ts`, `executor-audit.ts`, YAML `cli_contract` |

---

## 2. FRONTIER SEEDING

These entries cover the code-graph-driven frontier initialization that bounds the first iteration's sweep and seeds all subsequent focus candidates.

### Frontier Initialization

#### Description

Classifies the context session and creates all canonical state files before the first parallel sweep runs.

#### Current Reality

On a fresh session, `step_classify_session` detects no existing state artifacts, creates `{artifact_dir}/deep-context-config.json` from the default config template, initializes `deep-context-state.jsonl` with a typed config record, seeds `deep-context-strategy.md` with the executor pool roster, and creates `findings-registry.json`. Resume detects existing consistent state artifacts and appends a typed `resumed` event to the JSONL log, skipping directly to `phase_loop`. Restart archives the current packet and mints a fresh session identifier.

#### Source Files

See [`01--frontier-seeding/frontier-initialization.md`](01--frontier-seeding/frontier-initialization.md) for full implementation and test file listings.

---

### Scope Binding and Code-Graph Seeding

#### Description

Extracts anchors from the operator-supplied scope and expands them via the System Code Graph into a ranked SLICE frontier before any executor sees the scope.

#### Current Reality

`step_seed_frontier` extracts paths, symbols, and domain terms from `{scope}`, calls `code_graph_query` on 2-5 word concept descriptions to get blast-radius / calls, and ranks the resulting SLICE nodes by anchor proximity. Glob + Grep are the fallback when the code graph is stale or unavailable. The frontier is written into `deep-context-strategy.md` as the first focus candidates. Whole-repo sweeps are never used.

#### Source Files

See [`01--frontier-seeding/scope-binding-and-code-graph-seeding.md`](01--frontier-seeding/scope-binding-and-code-graph-seeding.md) for full implementation and test file listings.

---

### Config Shape and Default Pool

#### Description

Defines the immutable loop contract, relevance and agreement thresholds, and the default heterogeneous executor pool written during initialization.

#### Current Reality

`deep_context_config.json` is the config template; the auto YAML's `step_create_config` populates it with the resolved `scope`, `specFolder`, `loopType: "context"`, `maxIterations`, `convergenceThreshold`, `relevanceGate` (0.55), `agreementMin` (2), `fanout.mode: "by-model-shared-scope"`, and the resolved `executor_pool`. The default pool is 2 native `@deep-context` seats + MiMo-v2.5-pro (cli-opencode) + gpt (cli-codex) + deepseek-v4-pro (cli-opencode). Config is treated as read-only after initialization; `config.status` is set to `"complete"` at synthesis.

#### Source Files

See [`01--frontier-seeding/config-shape-and-default-pool.md`](01--frontier-seeding/config-shape-and-default-pool.md) for full implementation and test file listings.

---

## 3. BY-MODEL PARALLEL SWEEP

These entries describe the defining characteristic of deep-context: every executor in the pool sweeps the same current focus concurrently, and cross-executor agreement is the confidence signal.

### Heterogeneous Pool Dispatch

#### Description

Dispatches all seats — native batch and CLI pool — over the same shared current focus concurrently, then barrier-joins before merging.

#### Current Reality

`step_parallel_sweep` launches `step_sweep_native_batch` and `step_sweep_cli_pool` together without waiting for either, then barrier-joins. Native seats run as a single parallel `Task` batch (one concurrent batch, not sequential). CLI seats run as one-shot read-only analysis calls via the council scaffold. Both groups start simultaneously and the host waits for all seats before step_merge_findings runs.

#### Source Files

See [`02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md`](02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md) for full implementation and test file listings.

---

### Native Task Batch

#### Description

Dispatches all native `@deep-context` seats as a single concurrent Task batch, not one-at-a-time.

#### Current Reality

`step_sweep_native_batch` skips when no native seats are in the config. Otherwise it emits all `@deep-context` Task dispatches in a single parallel batch where every seat receives the same rendered prompt (four-part lineage contract: gather-subject, shared current_focus, known-context, output schema) and the host writes each seat's structured findings JSON to `{seat_dir}/iter-{NNN}/{label}.json`. Native seats are read-only: they return structured findings to the host via stdout and never write merged state.

#### Source Files

See [`02--by-model-parallel-sweep/native-task-batch.md`](02--by-model-parallel-sweep/native-task-batch.md) for full implementation and test file listings.

---

### CLI Council Seats

#### Description

Dispatches all CLI executor seats as one-shot read-only analysis passes over the shared focus via the council scaffold.

#### Current Reality

`step_sweep_cli_pool` uses `multi-seat-dispatch.cjs#dispatchCouncilSeats` to fan CLI seats out with `Promise.all` and aggregate per-seat results. Each seat issues exactly one read-only CLI call (`opencode run` / `codex exec` / `claude -p`) carrying the four-part lineage contract. cli-opencode seats require closed stdin (`</dev/null`) and no top-level `--agent`; cli-codex seats use `--sandbox read-only`; cli-claude-code seats use `--permission-mode plan`. An optional `autonomous-lineage` mode exists but is operator-opt-in only and never the default per-iteration path.

#### Source Files

See [`02--by-model-parallel-sweep/cli-council-seats.md`](02--by-model-parallel-sweep/cli-council-seats.md) for full implementation and test file listings.

---

### Per-Model Prompt Framework

#### Description

Applies the correct prompt framework to each seat's rendered prompt based on its model identity before dispatch.

#### Current Reality

`step_render_seat_prompts` uses `sk-prompt-models` to apply per-seat prompt framing: MiMo seats use COSTAR, MiniMax and DeepSeek seats use TIDD-EC, native seats carry no framework wrapper. Each seat's rendered prompt is stored at `{prompt_dir}/iter-{NNN}/{seat.label}.md` and sourced verbatim as the CLI dispatch prompt body. The four-part lineage contract (gather-subject, shared current_focus, known-context, output schema) is mandatory in every seat prompt; a seat told only "analyze" returns generic noise.

#### Source Files

See [`02--by-model-parallel-sweep/per-model-prompt-framework.md`](02--by-model-parallel-sweep/per-model-prompt-framework.md) for full implementation and test file listings.

---

## 4. AGREEMENT MERGE

These entries cover the host-owned merge process that deduplicates findings by `file:symbol`, attributes per-executor contributions, and computes cross-executor agreement as the confidence signal.

### Finding Dedup by Symbol

#### Description

Deduplicates all findings from all surviving seats by `unit_id` (sha256 of path:symbol:kind), unions per-executor attribution, and derives the agreement count for each unit.

#### Current Reality

`step_merge_findings` computes `unit_id = sha256(path:symbol:kind)` for each finding, groups all findings across surviving seats by unit_id, unions per-executor attribution into `producedBy` (distinct seat labels), derives `agreement = count(distinct executors in producedBy)`, and marks units as agreement-eligible when `agreement >= config.agreementMin` (default 2). `fanout-merge.cjs` provides the canonical attribution shape; the host reuses it or mirrors its shape to keep the registry consistent with the runtime contract.

#### Source Files

See [`03--agreement-merge/finding-dedup-by-symbol.md`](03--agreement-merge/finding-dedup-by-symbol.md) for full implementation and test file listings.

---

### Cross-Executor Agreement

#### Description

Applies the relevance gate, marks agreement-eligible findings, verifies each unit's `file:symbol` against the code graph, and computes the agreement rate metric.

#### Current Reality

After dedup and attribution, `step_merge_findings` drops units whose max relevance across producers falls below `config.relevanceGate` (0.55). Near-misses in the range [0.40, 0.55) are tagged `marginal` and routed to the report's Gaps section. Each surviving unit is verified against the code graph; unverified units are labeled `freshness: unverified`. Agreement-eligible findings drive the `new_agreement_eligible_count` used in the per-iteration saturation check. `reduce-state.cjs` performs the same operations when running as a standalone reducer pass.

#### Source Files

See [`03--agreement-merge/cross-executor-agreement.md`](03--agreement-merge/cross-executor-agreement.md) for full implementation and test file listings.

---

### Contradiction Surfacing

#### Description

Detects and records contradictions when two seats assert incompatible contracts for the same `unit_id`.

#### Current Reality

When two seats emit findings for the same `unit_id` with incompatible signatures or reuse verbs, `step_merge_findings` records a `CONTRADICTS` pair in `contradictions_json`. These pairs are never silently resolved; the host surfaces them in the merged report and via `CONTRADICTS` edges in the coverage graph. The `findings-registry.json` `contradictions` array carries all active contradiction pairs, and `step_update_registry` refreshes it on each iteration.

#### Source Files

See [`03--agreement-merge/contradiction-surfacing.md`](03--agreement-merge/contradiction-surfacing.md) for full implementation and test file listings.

---

## 5. CONVERGENCE DETECTION

These entries cover the stop logic that combines per-iteration saturation checks with coverage-graph signals to decide CONTINUE, STOP_ALLOWED, or STOP_BLOCKED.

### Context Coverage Signals

#### Description

Tracks five convergence signals — `sliceCoverage`, `reuseCatalogCoverage`, `agreementRate`, `relevanceFloor`, and `dependencyCompleteness` — as the basis for stop decisions.

#### Current Reality

`coverage-graph-signals.ts` exports `ContextConvergenceSignals` with the five signal fields. `convergence.cjs` evaluates them via `evaluateContext` and returns `CONTINUE | STOP_ALLOWED | STOP_BLOCKED`. `sliceCoverage` tracks SLICE nodes with COVERED_BY outgoing edges; `reuseCatalogCoverage` tracks REUSE_CANDIDATE nodes with CONFIRMS edges from ≥2 executors; `agreementRate` is the fraction of agreement-eligible findings; `relevanceFloor` is the minimum per-finding relevance among surviving units; `dependencyCompleteness` tracks DEPENDS_ON / IMPORTS edges within the touch radius.

#### Source Files

See [`04--convergence-detection/context-coverage-signals.md`](04--convergence-detection/context-coverage-signals.md) for full implementation and test file listings.

---

### Relevance Gate

#### Description

Blocks a STOP decision when `relevanceFloor` or `agreementRate` fall below their thresholds, even if the host saturation check nominates STOP.

#### Current Reality

`step_check_convergence` combines the host per-iteration saturation check (low_progress_streak >= K=2 consecutive iterations below `convergenceThreshold`) with the graph decision from `convergence.cjs`. A stop is only accepted when `host_saturated AND graph_decision == "STOP_ALLOWED"`. When the graph returns `STOP_BLOCKED`, the workflow emits a `blocked_stop` event, records the blocker names, injects a recovery hint, and forces `decision = "CONTINUE"`. The default blocker conditions are `sliceCoverage < 0.70`, `relevanceFloor < 0.50`, and `agreementRate < 0.50`. See `convergence.md` for the full signal table and composite-score weights.

#### Source Files

See [`04--convergence-detection/relevance-gate.md`](04--convergence-detection/relevance-gate.md) for full implementation and test file listings.

---

### Agreement Gate

#### Description

Requires a minimum number of distinct executor confirmations before a finding is considered agreement-eligible, blocking convergence until the threshold is met.

#### Current Reality

`config.agreementMin` (default 2) is the minimum distinct-executor count for a finding to be agreement-eligible. Findings below this threshold are tracked but excluded from the `new_agreement_eligible_count` that feeds the saturation check. The graph's `agreementRate` signal tracks the fraction of all surviving findings that are agreement-eligible; `convergence.cjs` uses this as a blocking guard (rate < 0.50 → `STOP_BLOCKED`). A 1-seat pool produces no agreement signal; the command warns and continues but the agreement gate will perpetually block.

#### Source Files

See [`04--convergence-detection/agreement-gate.md`](04--convergence-detection/agreement-gate.md) for full implementation and test file listings.

---

### Evaluate Context

#### Description

Runs `convergence.cjs --loop-type context` to evaluate all five coverage signals and return a CONTINUE / STOP_ALLOWED / STOP_BLOCKED decision after each iteration.

#### Current Reality

`step_graph_convergence` runs `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "context" --session-id "{sessionId}" --iteration {N}`, which calls `evaluateContext` in `coverage-graph-signals.ts`. The script emits a `graph_convergence` event to the JSONL log with the decision, signals, and blockers. The host's `step_check_convergence` then combines this graph decision with its own low_progress_streak computation to produce the final `STOP | BLOCKED | STUCK_RECOVERY | CONTINUE` outcome. `convergence.cjs` exits 0 on success, 1 on script error, 2 on DB error, and 3 on input validation error.

#### Source Files

See [`04--convergence-detection/evaluate-context.md`](04--convergence-detection/evaluate-context.md) for full implementation and test file listings.

---

### Cross-Mode Anti-Convergence Contract

#### Description

Declares the shared two-iteration floor and fail-closed stop policy for context mode.

#### Current Reality

`deep_context_config.json` declares `antiConvergence.minIterations = 2`, `convergenceMode = "default"`, and `stopPolicy = "fail-closed"`. The context loop still requires host saturation plus `STOP_ALLOWED` from `convergence.cjs`; this block is the cross-mode floor/policy layer that prevents one-sweep stop assumptions and aligns context with the shared runtime and optimizer guard contract.

#### Source Files

See [`04--convergence-detection/cross-mode-anti-convergence-contract.md`](04--convergence-detection/cross-mode-anti-convergence-contract.md) for full implementation and test file listings.

---

## 6. CONTEXT REPORT SYNTHESIS

These entries cover the deliverable: the reuse-first Context Report compiled from merged findings, plus the machine-readable JSON companion and the continuity save.

### Reuse Catalog Generation

#### Description

Compiles the REUSE catalog — the highest-value section of the Context Report — from all agreement-eligible reuse candidates, with verified `file:symbol` citations, signatures, reuse verbs, confidence, and agreement counts.

#### Current Reality

`step_compile_report` reads `findings-registry.json` and all iteration files, then runs `step_verify_citations` to confirm every reuse candidate's `file:symbol` still resolves in the code graph (labeling stale refs `unverified`). The REUSE catalog leads the report with one entry per agreement-eligible reuse candidate: `id`, `symbol (file:line)`, `signature`, `reuse verb (extend|compose|wrap|import)`, `confidence`, `agreement (k/N executors)`, `freshness`, and `notes`. Pointers are shipped, not source bodies. The catalog is machine-readable via `context-report.json`.

#### Source Files

See [`05--context-report-synthesis/reuse-catalog-generation.md`](05--context-report-synthesis/reuse-catalog-generation.md) for full implementation and test file listings.

---

### Context Report Assembly

#### Description

Assembles all seven sections of the Context Report from merged findings and writes `context-report.md` and `context-report.json` at the packet root.

#### Current Reality

`step_compile_report` uses `context_report_template.md` to produce a seven-section report: (1) REUSE Catalog, (2) Integration Points with `[HARD]`/`[soft]` markers, (3) Touch List in implementation order, (4) Conventions with `file:line` exemplars, (5) Pruned Dependency Subgraph (edges within touch radius only), (6) Prior Art / Decisions, and (7) Gaps & Unknowns including marginal near-misses. `step_emit_report_json` writes the same merged findings as structured JSON with per-finding attribution. `step_convergence_report` appends the final signal summary. Config status is set to `"complete"` via `step_update_config_status`.

#### Source Files

See [`05--context-report-synthesis/context-report-assembly.md`](05--context-report-synthesis/context-report-assembly.md) for full implementation and test file listings.

---

### Reduce-State Merge

#### Description

Runs `reduce-state.cjs` to produce the agreement-weighted findings registry and human-readable dashboard from the host-written state log and per-seat findings.

#### Current Reality

`reduce-state.cjs` reads `deep-context-state.jsonl`, the per-seat findings under `seats/iter-{NNN}/`, and `findings-registry.json`, then recomputes: agreement-weighted bucket assignment (`reuseCandidates`, `integrationPoints`, `conventions`, `dependencies`, `gaps`), relevance-gating at `DEFAULT_RELEVANCE_GATE` (0.55), agreement-eligibility at `DEFAULT_AGREEMENT_MIN` (2), and the five coverage metrics. The dashboard is regenerated from JSONL + registry data. The reducer is the host writer; seats stay read-only. `step_update_registry` in the loop YAML calls an equivalent in-loop merge before each convergence check.

#### Source Files

See [`05--context-report-synthesis/reduce-state-merge.md`](05--context-report-synthesis/reduce-state-merge.md) for full implementation and test file listings.

---

## 7. COVERAGE-GRAPH SCHEMA

These entries document the SQLite-backed coverage graph that `deep-context` uses with `loop_type='context'`: the node kinds, relation types, convergence signal schema, and query helpers.

### Loop Type: Context Schema

#### Description

Defines the `context` loop type in the shared coverage graph database, including its node kinds, valid relations, relation weights, and the SQLite schema that backs all three loop types.

#### Current Reality

`coverage-graph-db.ts` exports `VALID_KINDS.context` (`SLICE`, `FILE`, `SYMBOL`, `PATTERN`, `REUSE_CANDIDATE`, `DEPENDENCY`, `CONSTRAINT`, `GAP`) and `VALID_RELATIONS.context` (`CONTAINS`, `REFERENCES`, `IMPORTS`, `DEPENDS_ON`, `IMPLEMENTS`, `EXPOSES`, `REUSES`, `CONSTRAINS`, `COVERED_BY`, `CONFIRMS`, `CONTRADICTS`). `CONTEXT_WEIGHTS` assigns the highest weight (1.5) to `REUSES` edges, reflecting that surfacing existing code to extend is the loop's primary value. The database uses WAL journaling, composite primary keys `(spec_folder, loop_type, session_id, id)`, and schema version 3 with auto-migration.

#### Source Files

See [`06--coverage-graph-schema/loop-type-context-schema.md`](06--coverage-graph-schema/loop-type-context-schema.md) for full implementation and test file listings.

---

### Context Node Kinds and Relations

#### Description

Documents what each context node kind and relation represents in the coverage graph and how they are populated during the sweep.

#### Current Reality

`SLICE` nodes are the frontier scope units seeded before the first sweep. `FILE` nodes are individual source files read by at least one seat. `SYMBOL` nodes are specific `file:symbol` citations (functions, types, constants). `PATTERN` nodes are codebase conventions observed by seats. `REUSE_CANDIDATE` nodes are symbols the host promotes from seat findings after relevance gating. `DEPENDENCY` and `CONSTRAINT` nodes record structural edges. `GAP` nodes track unfound or unverified items. `COVERED_BY` edges mark swept SLICE nodes. `CONFIRMS` edges record per-executor agreement on a unit. `CONTRADICTS` edges record incompatible seat assertions.

#### Source Files

See [`06--coverage-graph-schema/context-node-kinds-relations.md`](06--coverage-graph-schema/context-node-kinds-relations.md) for full implementation and test file listings.

---

### Context Convergence Signals

#### Description

Documents the `ContextConvergenceSignals` interface exported by `coverage-graph-signals.ts` and how `evaluateContext` computes each signal from the graph state.

#### Current Reality

`coverage-graph-signals.ts` exports `ContextConvergenceSignals { sliceCoverage, reuseCatalogCoverage, agreementRate, relevanceFloor, dependencyCompleteness }` and `evaluateContext(ns)` which queries the SQLite DB for node/edge counts and derives the five signals. The function also computes a `blendedScore` used as `graph_convergence_score` in the JSONL log. `getStats` provides node/edge count breakdowns by kind and relation. `createSnapshot` persists per-iteration signal snapshots for trend analysis and blocked-stop diagnosis.

#### Source Files

See [`06--coverage-graph-schema/context-convergence-signals.md`](06--coverage-graph-schema/context-convergence-signals.md) for full implementation and test file listings.

---

### Code-Graph Coverage Seed Bridge

#### Description

Seeds coverage-graph nodes from the frontier/code-graph phase before the first convergence check.

#### Current Reality

`deep_context_auto.yaml` builds coverage seed nodes and edges from `frontier_slices_json`, binds `coverage_seed_source` to `frontier_source`, and sets seed confidence to `0.55` for code-graph seeds or `0.35` for fallback-derived seeds. `upsert.cjs` requires both `--seed-source` and `--seed-confidence` for seeding paths, and `coverage-graph-db.ts` stores the values as `seed_source` and `seed_confidence` on seeded nodes.

#### Source Files

See [`06--coverage-graph-schema/code-graph-coverage-seed-bridge.md`](06--coverage-graph-schema/code-graph-coverage-seed-bridge.md) for full implementation and test file listings.

---

## 8. RUNTIME ROBUSTNESS

These entries cover the five safety and reliability mechanisms wired into the `deep-context` loop (gated to `loop_type='context'`): atomic file writes, JSONL tail repair, seat finding validation, session-scoped advisory locking, and CLI executor recursion guards.

### Atomic State

#### Description

`reduce-state.cjs` writes `findings-registry.json` via the runtime `writeStateAtomic` (or inline fallback) and `deep-context-dashboard.md` via `writeTextAtomic`, using a temp+fsync+rename sequence to prevent half-written outputs.

#### Current Reality

`loadStateSafety()` attempts to load `writeStateAtomic` from `atomic-state.ts` via the tsx CJS register. On success, `_stateSafety.source` is `'runtime'`. On failure, `writeStateAtomicInline` is used instead. Both paths implement the same temp-file → fsync → rename pattern. The dashboard always goes through `writeTextAtomic` (inline). Both writes occur at the end of `reduceContextState()` before the function returns, ensuring consistent paired outputs.

#### Source Files

See [`07--runtime-robustness/atomic-state.md`](07--runtime-robustness/atomic-state.md) for full implementation and test file listings.

---

### JSONL Repair

#### Description

Before reading the append-only state log, `reduce-state.cjs` calls `repairJsonlTail` to truncate any trailing malformed content left by a mid-write crash, recording `{ repaired, droppedBytes }` in `registry.stateLogRepair`.

#### Current Reality

`loadStateSafety()` loads `repairJsonlTail` from `jsonl-repair.ts` (runtime) or falls back to `repairJsonlTailInline`. The call to `stateSafety.repairJsonlTail(stateLogPath)` runs before the state log is parsed by `parseJsonlDetailed`. The repair result is stored in `registry.stateLogRepair` and also surfaced in the per-run summary as `stateLogRepaired` and `stateLogDroppedBytes`.

#### Source Files

See [`07--runtime-robustness/jsonl-repair.md`](07--runtime-robustness/jsonl-repair.md) for full implementation and test file listings.

---

### Post-Dispatch Validate (Seat Validation)

#### Description

`reduce-state.cjs` validates each raw seat finding via `validateSeatFinding` before merge: known kind, at least one of path or symbol, and numeric relevance when present. Invalid findings are captured in `registry.seatValidationWarnings` rather than silently merged.

#### Current Reality

`validateSeatFinding(raw)` returns a reason string on failure or `null` on success. It is called inside `loadSeatFindings` for every finding read from `seats/iter-{NNN}/*.json`. Invalid findings are pushed to `validationWarnings` (surfaced as `registry.seatValidationWarnings`) and skipped from the merge. The count is also emitted in the per-run summary. `VALID_FINDING_KINDS` is derived from `KIND_TO_BUCKET` keys so the kind gate stays in sync with the bucket routing table.

#### Source Files

See [`07--runtime-robustness/post-dispatch-validate.md`](07--runtime-robustness/post-dispatch-validate.md) for full implementation and test file listings.

---

### Loop Lock

#### Description

`loop-lock.cjs` wraps the runtime `acquireLoopLock`/`refreshLoopLock`/`releaseLoopLock` to provide single-writer advisory locking. Both auto and confirm YAMLs invoke it at `step_acquire_lock` (phase_init) and `step_release_lock` (phase_synthesis + all exit paths).

#### Current Reality

`loop-lock.cjs` loads `loop-lock.ts` in-process via the tsx CJS register and exposes an `acquire|refresh|release` CLI. `acquireLoopLock` reclaims stale locks (dead owner PID or heartbeat TTL × 2 exceeded) atomically. `step_acquire_lock` in both YAML files exits 1 on a live conflicting lock, halting the workflow. Lock release is wired into halt, cancel, and completed-session paths so the lock file is never orphaned on a clean exit.

#### Source Files

See [`07--runtime-robustness/loop-lock.md`](07--runtime-robustness/loop-lock.md) for full implementation and test file listings.

---

### Executor Audit

#### Description

The YAML `cli_contract` requires each CLI seat to be spawned with `SPECKIT_CLI_DISPATCH_STACK` appended for its executor kind via `buildExecutorDispatchEnv`, preventing a seat from recursively launching another deep-context loop.

#### Current Reality

`executor-audit.ts` exports `CLI_DISPATCH_STACK_ENV = 'SPECKIT_CLI_DISPATCH_STACK'` and `buildExecutorDispatchEnv(config, parentEnv)` which appends the executor kind to the colon-delimited stack and filters the parent env to allowed keys per kind. `validateExecutorDispatchAllowed` checks four recursion-guard layers (stack, ancestry, runtime-env, lockfile) and blocks the dispatch by emitting a `dispatch_failure` JSONL event when any layer triggers. The `cli_contract` block in both YAML `step_sweep_cli_pool` steps mandates this behavior for every CLI seat.

#### Source Files

See [`07--runtime-robustness/executor-audit.md`](07--runtime-robustness/executor-audit.md) for full implementation and test file listings.
