---
title: "deep-review: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the deep-review review-loop system."
---

# deep-review: Feature Catalog

This document combines the current feature inventory for the `deep-review` system into a single reference. The root catalog acts as the system-level directory: it summarizes the loop lifecycle, state packet, review dimensions, and severity controls, and points to the per-feature files that carry the deeper protocol and source anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `deep-review` feature surface. The numbered sections below group the system by lifecycle, packet state, review coverage, and finding controls so readers can move from a top-level summary into per-feature reference files without losing the contract behind each review phase.

| Category | Coverage | Primary Surfaces |
|---|---:|---|
| Loop lifecycle | 9 features | `SKILL.md`, `references/protocol/loop_protocol.md`, deep-review workflows, fan-out runtime primitives |
| State management | 7 features | `references/state/state_format.md`, review packet files, reducer outputs |
| Review dimensions | 4 features | `assets/review_mode_contract.yaml`, `assets/deep_review_strategy.md` |
| Severity system | 7 features | `references/convergence/convergence.md`, `references/state/state_format.md`, review contract |

---

## 2. LOOP LIFECYCLE

These entries cover the end-to-end review loop from spec-folder initialization through dispatch, stop evaluation, synthesis, and continuity save.

### Initialization

#### Description

Creates the canonical review packet and seeds the first review charter.

#### How It Works

Initialization classifies the prior state, resolves the target into files, orders the four review dimensions by risk priority, plans applicable core and overlay traceability protocols, and writes the config, JSONL log, findings registry, and strategy packet under `review/`.

#### Source Files

See [`01--loop-lifecycle/001-initialization.md`](01--loop-lifecycle/001-initialization.md) for full implementation and validation file listings.

---

### Iteration dispatch

#### Description

Runs one fresh-context review cycle against the current focus.

#### How It Works

Each loop pass reads the packet state, generates a compact state summary, dispatches `@deep-review` with one focus dimension and file set, requires write-once iteration output plus JSONL and strategy updates, and keeps the agent leaf-only and read-only against the target code.

#### Source Files

See [`01--loop-lifecycle/002-iteration-dispatch.md`](01--loop-lifecycle/002-iteration-dispatch.md) for full implementation and validation file listings.

---

### Convergence check

#### Description

Determines whether the loop continues, recovers, or stops.

#### How It Works

The stop path combines hard stops, a three-signal weighted vote, blocked-stop persistence, graph-assisted review gates, and stuck recovery. STOP is legal only when convergence math and the review gate bundle agree.

#### Source Files

See [`01--loop-lifecycle/003-convergence-check.md`](01--loop-lifecycle/003-convergence-check.md) for full implementation and validation file listings.

---

### Synthesis

#### Description

Compiles iteration output into the final review report and terminal state.

#### How It Works

Synthesis deduplicates findings across iteration files, reconciles adjudicated severities, replays the JSONL audit trail, writes the nine-section `review-report.md`, determines PASS or CONDITIONAL or FAIL, and appends the terminal synthesis event.

#### Source Files

See [`01--loop-lifecycle/004-synthesis.md`](01--loop-lifecycle/004-synthesis.md) for full implementation and validation file listings.

---

### Memory save

#### Description

Preserves the completed review context for future recovery.

#### How It Works

The save phase treats `generate-context.js` as the supported handoff boundary, keeps the on-disk review packet as ground truth, and does not discard review results when the continuity save step fails.

#### Source Files

See [`01--loop-lifecycle/005-memory-save.md`](01--loop-lifecycle/005-memory-save.md) for full implementation and validation file listings.

---

### Resource map emission

#### Description

Emits a convergence-time `resource-map.md` from review delta evidence with a clean opt-out path.

#### How It Works

The reducer runs an explicit `--emit-resource-map` pass during synthesis that reads converged delta files and writes `{artifact_dir}/resource-map.md`, grouped by category and annotated with per-file P0/P1/P2 counts. Enabled by default via `config.resource_map.emit = true`. Operators can disable per run with `--no-resource-map`.

#### Source Files

See [`01--loop-lifecycle/006-resource-map-emission.md`](01--loop-lifecycle/006-resource-map-emission.md) for full implementation and validation file listings.

---

### Resource Map Coverage Gate

#### Description

Reports how well the review covered the artifacts declared in the spec folder's `resource-map.md` before a verdict is finalized.

#### How It Works

A conditional synthesis section emitted only when `config.resource_map_present == true`, inserted as section 8 of the review report. It reports touched entries, untouched entries (`expected-by-scope` vs `gap`), and implementation paths absent from the map. It is descriptive and does not by itself block STOP.

#### Source Files

See [`01--loop-lifecycle/007-resource-map-coverage-gate.md`](01--loop-lifecycle/007-resource-map-coverage-gate.md) for full implementation and validation file listings.

---

### Executor selection contract

#### Description

Resolves which executor runs each iteration and enforces per-kind flag compatibility before dispatch.

#### How It Works

`parseExecutorConfig` resolves `config.executor.kind` into one of four dispatch branches (`native`, `cli-codex`, `cli-gemini`, `cli-claude-code`). Unsupported flags throw `ExecutorConfigError` at parse time. All branches share prompt rendering, output validation, and executor audit append.

#### Source Files

See [`01--loop-lifecycle/008-executor-selection-contract.md`](01--loop-lifecycle/008-executor-selection-contract.md) for full implementation and validation file listings.

---

### Fan-out loop dispatch

#### Description

Opt-in fan-out dispatch layer: `step_resolve_artifact_root` artifact-dir override branch,
`step_fanout_spawn` (CLI pool + native sequential agent dispatch), and `step_fanout_merge`
with strongest-restriction verdict binding at the top of `phase_synthesis`. Single-executor
path is byte-identical to pre-change behavior.

#### How It Works

Three new YAML steps gated on `config.fanout` presence. CLI lineages run via `fanout-run.cjs`
(pool-capped headless subprocesses). Native lineages run as sequential `agent: deep-review`
dispatches. `step_fanout_merge` produces a consolidated `deep-review-findings-registry.json`
using strongest-restriction (any active P0 → `mergedVerdict=FAIL`) and binds
`p0_count/p1_count/p2_count` from the merged result for `step_derive_verdict`. This
binding is review-specific: without it, `step_derive_verdict` would read zero counts from an
empty single-executor state log. Command flags: `--executor` (repeatable), `--executors
<json>`, `--concurrency N`. Review verdict: strongest-restriction across all lineages.

#### Source Files

See [`01--loop-lifecycle/009-fanout-dispatch.md`](01--loop-lifecycle/009-fanout-dispatch.md) for full implementation and validation file listings.

---

## 3. STATE MANAGEMENT

These entries describe the review packet files, how they change over time, and how reducer-owned state feeds the loop, dashboard, and synthesis surfaces.

### JSONL state log

#### Description

Stores the append-only execution history for the review lineage.

#### How It Works

`deep-review-state.jsonl` begins with a config record, appends iteration records with severity-weighted findings and coverage data, records pause and blocked-stop and synthesis events, and can carry graph convergence and graph event payloads for review-aware coverage tracking.

#### Source Files

See [`02--state-management/010-jsonl-state-log.md`](02--state-management/010-jsonl-state-log.md) for full implementation and validation file listings.

---

### Strategy tracking

#### Description

Maintains the mutable review brain across fresh agent dispatches.

#### How It Works

`deep-review-strategy.md` tracks remaining and completed dimensions, running findings, worked and failed approaches, cross-reference status, files under review, and the next focus anchor that steers the next iteration.

#### Source Files

See [`02--state-management/011-strategy-tracking.md`](02--state-management/011-strategy-tracking.md) for full implementation and validation file listings.

---

### Config management

#### Description

Defines the immutable packet contract for the current review lineage.

#### How It Works

`deep-review-config.json` captures the topic, target type, configured dimensions, lineage fields, thresholds, protection levels, and reducer contract. It is written once during init and becomes the stable reference for the rest of the run.

#### Source Files

See [`02--state-management/012-config-management.md`](02--state-management/012-config-management.md) for full implementation and validation file listings.

---

### Findings registry

#### Description

Holds the reducer-owned view of active, resolved, repeated, and blocked findings.

#### How It Works

`deep-review-findings-registry.json` is regenerated after each iteration and lifecycle transition, keeps severity totals and dimension coverage, stores blocked-stop and graph convergence history, and fail-closes when corruption or missing machine-owned anchors break the reducer contract.

#### Source Files

See [`02--state-management/013-findings-registry.md`](02--state-management/013-findings-registry.md) for full implementation and validation file listings.

---

### Dashboard

#### Description

Publishes the current review status as a machine-owned summary surface.

#### How It Works

`deep-review-dashboard.md` is regenerated from the JSONL log, strategy file, and findings registry after each iteration. It surfaces the provisional verdict, findings deltas, coverage progress, trend signals, and active risks without becoming a manual editing surface.

#### Source Files

See [`02--state-management/014-dashboard.md`](02--state-management/014-dashboard.md) for full implementation and validation file listings.

---

### Graph convergence event

#### Description

A first-class `deep-review-state.jsonl` event recording the graph-assisted STOP decision before the inline vote can finalize STOP.

#### How It Works

The workflow appends a `graph_convergence` event carrying a `decision` enum (`STOP_ALLOWED`, `STOP_BLOCKED`, `CONTINUE`), a signal snapshot, and blockers. Final STOP is legal only when the inline decision says STOP and the latest graph decision is `STOP_ALLOWED`. The reducer rolls these into the findings-registry graph-convergence history.

#### Source Files

See [`02--state-management/015-graph-convergence-event.md`](02--state-management/015-graph-convergence-event.md) for full implementation and validation file listings.

---

### Pause sentinel

#### Description

File-based graceful suspension that halts the autonomous loop between iterations and emits a normalized `userPaused` event.

#### How It Works

Step 2a checks for `review/.deep-review-pause` before each dispatch. When present, the loop logs a `userPaused` event and halts until the operator deletes the file, then resumes from persisted state. A normalization rule rewrites raw `paused` and `stuck_recovery` conditions to `userPaused` and `stuckRecovery` before they are persisted.

#### Source Files

See [`02--state-management/016-pause-sentinel.md`](02--state-management/016-pause-sentinel.md) for full implementation and validation file listings.

---

## 4. REVIEW DIMENSIONS

These entries capture the four canonical audit dimensions that define loop coverage and shape findings, convergence, and the strategy checklist.

### Correctness

#### Description

Audits logic, invariants, and behavior against observable intent.

#### How It Works

Correctness is the first-priority dimension, covers logic and state transitions and edge cases, and is required for severity coverage and for a legal clean stop. It leads the default dimension ordering in both the strategy template and the review contract.

#### Source Files

See [`03--review-dimensions/017-correctness.md`](03--review-dimensions/017-correctness.md) for full implementation and validation file listings.

---

### Security

#### Description

Audits trust boundaries, exploit paths, and exposure risk.

#### How It Works

Security is the second-priority dimension, checks authn and authz behavior, input handling, secrets exposure, and exploitability, and is a required coverage dimension with direct impact on P0 and P1 classification.

#### Source Files

See [`03--review-dimensions/018-security.md`](03--review-dimensions/018-security.md) for full implementation and validation file listings.

---

### Traceability

#### Description

Audits whether claims and artifacts line up with shipped behavior.

#### How It Works

Traceability is the third review dimension and owns spec-to-code checks, checklist evidence, and overlay protocols such as skill-agent, feature-catalog, and playbook alignment. Its protocol results feed both convergence and final traceability status reporting.

#### Source Files

See [`03--review-dimensions/019-traceability.md`](03--review-dimensions/019-traceability.md) for full implementation and validation file listings.

---

### Maintainability

#### Description

Audits codebase clarity and the safety of follow-on change.

#### How It Works

Maintainability is the fourth default dimension and covers patterns, documentation quality, clarity, and change cost. It is still required for full coverage even though it carries lower default risk priority than correctness and security.

#### Source Files

See [`03--review-dimensions/020-maintainability.md`](03--review-dimensions/020-maintainability.md) for full implementation and validation file listings.

---

## 5. SEVERITY SYSTEM

These entries cover how the loop classifies findings, verifies blocker claims, adjudicates evidence, determines verdicts, and blocks premature stop attempts.

### Severity classification

#### Description

Assigns P0 or P1 or P2 meaning and severity weight to each finding.

#### How It Works

The review loop uses a three-level severity contract with weights `10.0 / 5.0 / 1.0`, requires file-line evidence for every level, uses severity-weighted `newFindingsRatio`, and applies the P0 override to prevent premature convergence when a new blocker is found.

#### Source Files

See [`04--severity-system/021-severity-classification.md`](04--severity-system/021-severity-classification.md) for full implementation and validation file listings.

---

### Adversarial self-check

#### Description

Re-reads blocker evidence before a P0 can shape the verdict.

#### How It Works

Every P0 must be rechecked before it is accepted as final. The rule appears in the skill contract, iteration checklist, and success criteria, and is treated as a required guard before a FAIL verdict is finalized.

#### Source Files

See [`04--severity-system/022-adversarial-self-check.md`](04--severity-system/022-adversarial-self-check.md) for full implementation and validation file listings.

---

### Claim adjudication

#### Description

Turns new P0 and P1 findings into typed, review-visible claims.

#### How It Works

Each new blocker or required finding must carry a typed adjudication packet with evidence, counterevidence search, alternative explanation, final severity, confidence, and transition history. Missing or failing packets trip `claimAdjudicationGate` and veto STOP.

#### Source Files

See [`04--severity-system/023-claim-adjudication.md`](04--severity-system/023-claim-adjudication.md) for full implementation and validation file listings.

---

### Verdicts

#### Description

Maps active finding state into FAIL or CONDITIONAL or PASS.

#### How It Works

Verdicts are derived from active findings plus gate state: unresolved P0 or failed required gates yield FAIL, active P1 without P0 yields CONDITIONAL, and PASS requires no active P0 or P1 while recording `hasAdvisories=true` when P2 remains.

#### Source Files

See [`04--severity-system/024-verdicts.md`](04--severity-system/024-verdicts.md) for full implementation and validation file listings.

---

### Quality gates

#### Description

Prevents the loop from stopping or passing on weak evidence.

#### How It Works

The legal-stop bundle combines evidence, scope, coverage, P0 resolution, evidence density, hotspot saturation, and claim adjudication checks. When a stop vote fails those checks, the loop persists a `blocked_stop` event and continues with a recovery hint instead of silently stopping.

#### Source Files

See [`04--severity-system/025-quality-gates.md`](04--severity-system/025-quality-gates.md) for full implementation and validation file listings.

---

### Semantic convergence signals

#### Description

Two supplementary stop signals (semanticNovelty and findingStability) that measure conceptual novelty and finding-set stability beyond the severity-weighted composite vote.

#### How It Works

`semanticNovelty` measures conceptually new insight per iteration, and a plateau below 0.15 for 2+ consecutive evidence iterations supports STOP as a diagnostic sub-check. `findingStability` measures unchanged-finding ratio across iterations, where 0.85 and above supports STOP and below 0.50 prevents it. Both feed the legal-stop gate evaluation rather than the composite stop-score.

#### Source Files

See [`04--severity-system/026-convergence-signals.md`](04--severity-system/026-convergence-signals.md) for full implementation and validation file listings.

---

### Security-sensitive fix overrides

#### Description

A spec-only contract for tighter convergence thresholds and closed-gate replay on review reruns after security-sensitive fixes.

#### How It Works

SPEC ONLY. The runtime does not auto-detect security sensitivity or apply these overrides today, and operators must enforce them manually. The target contract raises `minStabilizationPasses` to 2 and turns on `requiredClosedFindingReplay` and `requiredFixCompletenessGate`, requiring a closed-gate replay table before STOP once implemented.

#### Source Files

See [`04--severity-system/027-security-sensitive-fix-overrides.md`](04--severity-system/027-security-sensitive-fix-overrides.md) for full implementation and validation file listings.
