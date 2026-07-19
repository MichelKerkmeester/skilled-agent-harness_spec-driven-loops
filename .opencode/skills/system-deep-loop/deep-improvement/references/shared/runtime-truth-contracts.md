---
title: Runtime Truth Contracts
description: Full audit-journal, stop-reason, gate-bundle, mutation-coverage, and reducer-consumer contracts for deep-improvement sessions.
trigger_phrases:
  - "stop reason taxonomy"
  - "audit journal protocol"
  - "legal-stop gate bundles"
  - "mutation coverage graph"
  - "session outcome enum"
importance_tier: important
contextType: implementation
version: 1.17.0.0
---

# Runtime Truth Contracts

Full detail behind the SKILL.md quick summary of session termination, journal emission, gate bundles, and reducer replay for `deep-improvement`. Use it when wiring or auditing orchestrator-side journal calls, when a session's stop reason or outcome looks wrong, or when the reducer's replay-derived registry fields need explaining.

---

## 1. OVERVIEW

### Purpose

Defines the exact contracts an orchestrator must honor when starting, running, and ending a deep-improvement session: which stop reasons and session outcomes are legal, how the append-only journal is emitted and replayed, which gate bundles must pass before `converged` can be claimed, and how mutation coverage, trajectory, trade-off, and lineage tracking behave.

### When to Use

Use this reference when:
- Wiring `session_start` / `session_end` emission into a new or modified orchestrator
- Debugging why a session's `stopReason` or `sessionOutcome` was rejected
- Explaining what the reducer's `journalSummary`, `candidateLineage`, or `mutationCoverage` registry fields mean
- Deciding whether a candidate mutation is a duplicate of one already tried

### Core Principle

Every session termination must be legible after the fact: why it ended (`stopReason`) and what happened to the candidate (`sessionOutcome`) are separate, both required, and both drawn from a small frozen enum. Journal emission is orchestrator-only — the target agent never writes journal rows.

---

## 2. STOP-REASON TAXONOMY

**stopReason** (WHY the session ended):

| Reason | Trigger Condition |
| --- | --- |
| `converged` | All legal-stop gate bundles pass and dimension trajectory is stable |
| `maxIterationsReached` | Iteration counter equals `maxIterations` config |
| `blockedStop` | One or more legal-stop gate bundles fail when convergence math would otherwise trigger stop |
| `manualStop` | Operator cancels the session |
| `error` | Infra failure, script crash, or unrecoverable condition |
| `stuckRecovery` | Session detected stuck state and exhausted recovery options |

**sessionOutcome** (WHAT happened to the candidate):

| Outcome | When Used |
| --- | --- |
| `keptBaseline` | Baseline was retained because candidate did not improve |
| `promoted` | Candidate was promoted to canonical target |
| `rolledBack` | Promoted candidate was rolled back to prior state |
| `advisoryOnly` | Session completed for assessment only; no mutation attempted |

### Frozen Helper Enums

`scripts/shared/improvement-journal.cjs` exports and validates exactly these two enums — `STOP_REASONS` (the six reasons above) and `SESSION_OUTCOMES` (the four outcomes above). Keep session-end emissions aligned to those helper-owned values until the helper contract itself changes. Labels such as `convergedImprovement`, `plateau`, `benchmarkPlateau`, `rejected`, `deferred`, `blocked`, or `errored` are NOT accepted by the current CLI validator. Plateau detection is a reducer/stop-rule condition; it must reconcile to one of the canonical stop reasons above when emitted as `details.stopReason`.

---

## 3. AUDIT JOURNAL PROTOCOL

All journal emission is orchestrator-only (ADR-001). The journal (`improvement-journal.jsonl`) is an append-only JSONL file capturing lifecycle events, separate from `agent-improvement-state.jsonl` (which tracks proposal/evaluation data).

**Script**: `scripts/shared/improvement-journal.cjs`

Event types: `session_start`, `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempt`, `promotion_result`, `rollback`, `rollback_result`, `trade_off_detected`, `mutation_proposed`, `mutation_outcome`, `session_ended`, `session_end`

### Journal Wiring Contract

The target agent being evaluated never writes journal rows directly. Only the visible YAML workflow or an operator-side wrapper invokes the helper. The CLI contract is:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs --emit <eventType> --journal <journal_path> --details '<json>'
```

The helper validates event type plus `session_end` or `session_ended` details, and the CLI entrypoint stores boundary context under `details`. Top-level `iteration` and `candidateId` fields are available only through the JS API, not through the CLI wrapper used by the YAML workflows.

### Boundary Points

Journal boundaries are `session_start` after baseline setup, per-iteration candidate/scoring/gate events, and `session_end` after synthesis or terminal stop. Required details include session id, target, iteration/candidate paths, scores, stop reason, session outcome, and total iterations.

### Orchestrator Ownership

- Auto mode emits `session_start` after `step_record_baseline`, then emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each loop iteration, and finally emits `session_end` after synthesis.
- Confirm mode mirrors the same boundaries, with `gate_evaluation` emitted after the operator-facing approval gate is resolved.
- Operators invoking the helper manually must use the same boundary order so replay and reducer consumers see a consistent journal shape.

---

## 4. LEGAL-STOP GATE BUNDLES

A session may NOT claim `converged` unless all five gate bundles pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate`. The orchestrator emits `legal_stop_evaluated` with nested `details.gateResults` before any `session_end`. Failures emit `blocked_stop` with `failedGates[]` and `stopReason:"blockedStop"`.

For legal-stop replay, the reducer consumes `details.gateResults` from the latest `legal_stop_evaluated` event and surfaces it as `journalSummary.latestLegalStop.gateResults` in `experiment-registry.json` plus the dashboard's latest legal-stop table.

---

## 5. STATIC BENCHMARK ASSETS

The reusable benchmark contract ships with the skill, not with each spec packet:

- Profile: `assets/model-benchmark/benchmark-profiles/default.json`
- Fixtures: `assets/model-benchmark/benchmark-fixtures/*.json`
- Materializer: `scripts/shared/materialize-benchmark-fixtures.cjs`
- Runner: `scripts/model-benchmark/run-benchmark.cjs`

`materialize-benchmark-fixtures.cjs` and `run-benchmark.cjs` are output-location-agnostic — both take a required `--outputs-dir` and write wherever the caller points them. Two callers use this contract for two distinct purposes with two distinct, fixed output conventions:

- **Lane A (`/deep:agent-improvement`, this session's own runtime):** every iteration's `step_materialize_benchmark-fixtures` + `step_run_benchmark` steps materialize `default.json`'s fixtures and run the benchmark spec-locally, into `{spec_folder}/improvement/benchmark-outputs/`. `benchmark_completed` may be emitted only after `{spec_folder}/improvement/benchmark-outputs/report.json` exists (both `auto` and `confirm` modes verify with `test -f {spec_folder}/improvement/benchmark-outputs/report.json`). The runner also appends a `benchmark_run` row to `{spec_folder}/improvement/agent-improvement-state.jsonl`. There is no sk-prompt/prompt-models hub path in this flow.
- **Lane B (standalone `/deep:model-benchmark` command):** materializes fixtures and runs the benchmark against the sk-prompt/prompt-models hub, keyed by the operator-supplied `run_label` — `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/{fixture.id}.md` for materialized fixtures, then `run-benchmark.cjs --outputs-dir .opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}`, writing `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/report.json` with `status:"benchmark-complete"`. `run_label` is a required identifier that distinguishes benchmark runs in the hub (e.g. `"minimax-tidd-ec"`, `"mimo-costar"`). This flow is not spec-local by design — Lane B compares models/frameworks across sessions, so results are meant to persist centrally rather than live under one packet.

Repeatability output from `benchmark-stability.cjs` is separate evidence and does not by itself prove benchmark completion.

---

## 6. RESUME/CONTINUATION SEMANTICS (current release)

Sessions support a single lineage mode today: `new`. Every invocation of the `/deep:agent-improvement` workflow starts a fresh session with a new session id and generation 1. Multi-generation lineage modes (`resume`, `restart`, `fork`, `completed-continue`) were described in earlier drafts but have no shipped runtime wiring in the deep-improvement workflow, reducer, or journal consumer.

Operators who want to continue evaluating an agent after a prior session SHOULD archive the prior session folder (e.g. move `improve/` to `improve_archive/{timestamp}/`) and re-invoke the command, which starts a new `new`-mode session. The reducer treats each session independently and does not carry ancestry across sessions.

If the long-form lineage feature is implemented later, it will arrive with first-class event emission in `deep_agent-improvement_{auto,confirm}.yaml`, reducer ancestry handling in `deep-improvement/scripts/shared/reduce-state.cjs`, and replay fixtures. Until then, treat every session as a standalone evaluation.

---

## 7. MUTATION COVERAGE GRAPH

**Script**: `scripts/shared/mutation-coverage.cjs`

Tracks explored dimensions, tried mutation types per dimension, and exhausted mutation sets using `loop_type: "improvement"` namespace isolation (ADR-002). The orchestrator skips mutation types already in the exhausted log.

### Mutation Signature Dedup

Each mutation entry in `mutation-coverage.json` carries a `signature` field computed as:

```text
signature = sha256(dimension + "\u001f" + mutationType + "\u001f" + targetSection + "\u001f" + normalizedBody64)
```

Where `normalizedBody64` = whitespace-collapsed, lowercased, first 64 characters of the mutation body.

**Dedup behavior:**
- Before proposing a new mutation, `isSignatureSeen()` scans existing `mutations[]` and `exhausted[]` arrays
- If the signature matches, the candidate is skipped with `reason: "EXHAUSTED-FROM: iter-NNN"` recorded in `exhausted[]`
- The `EXHAUSTED-FROM` format references the iteration where the original mutation was tried

**Bypass:**
```bash
export DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1  # Force re-evaluation of previously seen signatures
```
When set, `isSignatureSeen()` always returns `{ seen: false }`. Every mutation is considered fresh.

**Backward compatibility:** Legacy `mutation-coverage.json` entries without `signature` field fall back to the existing `dimension::mutationType` dedup in the reducer. No migration required.

**Authoritative storage:** `mutation-coverage.json` `mutations[]` array. `signature` is written by `recordMutation()` and read by `isSignatureSeen()` and `reduce-state.cjs`.

---

## 8. DIMENSION TRAJECTORY

Trajectory data records per-iteration dimension scores. Two distinct convergence signals run side by side and must not be conflated. `mutation-coverage.cjs` `checkConvergenceEligibility()` marks a profile convergence-eligible when it has at least 3 data points and every dimension delta across the last 3 points is within `DEFAULT_STABILITY_DELTA` (+/-2), a tolerance band. Separately, `reduce-state.cjs` `stopOnDimensionPlateau` fires the plateau stop only when a dimension's last 3 scores are identical (exact-repeat). The +/-2 trajectory eligibility and the exact-repeat plateau stop are different checks.

Stop-condition counters (`maxConsecutiveTies`, `maxInfraFailuresPerProfile`, `maxWeakBenchmarkRunsPerProfile`) default to disabled, with no cap, unless the runtime config sets them. Only configured counters can trigger `blockedStop`.

---

## 9. TRADE-OFF DETECTION

**Script**: `scripts/agent-improvement/trade-off-detector.cjs`

Detects Pareto trade-offs: flags when improvement > +3 in one dimension causes regression < -3 in hard dimensions (structural, integration, systemFitness) or < -5 in soft dimensions (ruleCoherence, outputQuality). Blocks promotion for Pareto-dominated candidates.

---

## 10. PARALLEL CANDIDATE WAVES (Optional)

**Script**: `scripts/agent-improvement/candidate-lineage.cjs`

Disabled by default (`parallelWaves.enabled: false` in config, ADR-004). When enabled, spawns 2-3 candidates with different mutation strategies. Activation requires: exploration-breadth score above threshold, 3+ unresolved mutation families, and 2 consecutive tie/plateau iterations.

---

## 11. WEIGHT OPTIMIZER (Advisory Only)

**Script**: `scripts/agent-improvement/benchmark-stability.cjs`

Reads historical session data and emits a weight-recommendation report. Recommendations do NOT auto-apply (ADR-005). Requires minimum session count threshold before producing recommendations.

---

## 12. REDUCER CONSUMER SIDE

The reducer is the consumer for replay artifacts on refresh, rather than a separate orchestrator-only synthesis step. Every `scripts/shared/reduce-state.cjs` pass attempts to read:

- `improvement-journal.jsonl` — to summarize last session boundaries, total replayed events, per-event counts, and terminal `stopReason` / `sessionOutcome`
- `candidate-lineage.json` — to summarize lineage depth, total candidate count, and the latest candidate leaf
- `mutation-coverage.json` — to summarize mutation coverage ratio and uncovered mutations

These inputs remain optional. Missing files do not fail the reducer. The corresponding registry field is set to `null` so dashboard and registry refreshes still complete.

The reducer writes these summaries into new top-level registry fields: `journalSummary`, `candidateLineage`, `mutationCoverage`.

Graceful degradation is required: if any artifact is missing, unreadable, or not yet generated for the current runtime, the reducer preserves the rest of the registry and records `null` for that field instead of throwing.

The dashboard also includes a dedicated **Sample Quality** section. This separates replay/stability sample sufficiency from benchmark failures so operators can tell the difference between a true regression and an iteration that simply lacked enough data for trade-off or replay-stability trust.

---

## 13. RELATED RESOURCES

- `loop-protocol.md`
- `quick-reference.md`
- `../model-benchmark/evaluator-contract.md`
- `../agent-improvement/mirror-drift-policy.md`
- `../../scripts/shared/improvement-journal.cjs`
- `../../scripts/shared/mutation-coverage.cjs`
- `../../scripts/shared/reduce-state.cjs`
