---
title: "Changelog: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster) [004-deep-loop/005-stop-input-corroboration]"
description: "Chronological changelog for the Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/005-stop-input-corroboration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop`

### Summary

C1 through C6 were implemented in .opencode/skills/deep-loop-runtime with deterministic tests. C7 remains already-shipped via packet 030 commit 46812f12a8 and was not re-implemented.

### Added

- Confirmed 030 did NOT ship newInfoRatio consumption: convergence.cjs:285 STOP reason still reads "pending newInfoRatio agreement" and the decision args (:298-322) exclude any novelty input — so C1/C2 are genuinely PENDING [verified current source]
- Implement computeGraphNoveltyDelta(nodes, edges, snapshots) = fraction of NEW FINDING/SOURCE/EVIDENCE_FOR nodes+edges since the prior persisted snapshot, from the graph state convergence already loads (never from the self-reported ratio); site it beside the compute*FromData emitters (coverage-graph-signals.ts) or inline in convergence.cjs [45m]
- Add the BLOCKING guard novelty_self_report_unverified: when STOP_ALLOWED would fire AND reportedNovelty < threshold BUT graphNoveltyDelta > floor → STOP_BLOCKED; an absent --reported-novelty is a strict no-op (byte-identical) (convergence.cjs:191-223,285,378-381) [30m]
- [P] Add lag_ceiling (default 5s, config-overridable) to the guard config and meter it against the SHIPPED oldest-pending-lag gauge; on breach the loop honors the tripwire (warn tier). Preserve the advisory evaluateCouncilCostGuards return shape unchanged — additive enforced path only (cost-guards.cjs:15-20,114-140; gauges fanout-pool.cjs:90,108,235-238). Evidence: cost-guard evaluator plus fanout-pool default-off warning event. [1h]
- [P] Add a periodic in-lineage progress event at a configurable cadence (default 0/disabled until benchmarked) in the fanout-run.cjs lineage worker; distinct from the lock-TTL heartbeat and the shutdown stopped marker (fanout-run.cjs worker, loop-lock.cjs:24-26) [45m]
- C1: computeGraphNoveltyDelta on synthetic snapshot pairs — new FINDING/SOURCE/EVIDENCE counted; insight-only delta exempted (deep-loop-runtime test suite) [30m]

### Changed

- Wave-0 Deep-Loop trio shipped: pool gauges (lag/pending/failed) + deterministic merge total-order + graceful-self-stop (fanout-pool.cjs, fanout-merge.cjs, fanout-run.cjs) [commit 46812f12a8; 58 fanout tests pass; §14 cand 12]
- C7 DONE — DL-shutdown-summary-heartbeat shipped: SIGINT/SIGTERM flushes a distinct stopped-marked partial summary (fanout-run.cjs:510-541 — writeStoppedSummary emits event:'stopped' to the ledger + writeOrchestrationSummary({stopped:true, status:'partial', ...gauges})) [commit 46812f12a8; verified current source]
- Source seams re-confirmed against current code: novelty non-consumption (convergence.cjs:285,298-322,330-331,378-381; snapshots :338,390-399), cost-guards advisory-only no lag_ceiling (cost-guards.cjs:15-20,114-140), merge first-seen-wins (fanout-merge.cjs:66-82), lock-TTL-only heartbeat (loop-lock.cjs:24-26) [verified — all spec seams accurate]
- Capture regression baseline: current deep-loop-runtime convergence + fanout test counts before any edit (regression-baseline rule). Evidence: baseline npm run typecheck failed with missing script; baseline broad related Vitest passed 6 files / 83 tests. [15m]
- Read the full convergence decision path before editing: convergence.cjs:280-400 (args, snapshot load/persist, evaluate + decisionReason) and the computeFromData emitters in coverage-graph-signals.ts [20m]
- Scope the delta to FINDING/SOURCE/EVIDENCE_FOR + mirror reduce-state's insight exemptions so legitimate low-novelty bookkeeping iterations are not penalized (convergence.cjs:338,390-399) [20m]

### Fixed

- C2 fixtures: gaming (high delta + --reported-novelty 0.01 → NOT STOP_ALLOWED + novelty_self_report_unverified blocker); legitimate-low (flat delta + low report → STOP_ALLOWED); no-op (omit --reported-novelty → byte-identical); insight-only delta (not spuriously blocked) [45m]
- C2 is byte-identical with --reported-novelty absent (SC-002); the gaming fixture does NOT STOP (SC-003)
- CHK-021 C2 gaming fixture blocks STOP when graph novelty disproves the self-report.
- CHK-FIX-001 Each candidate has a status and gate. Evidence: spec.md section 3.
- CHK-FIX-002 Same-class inventory recorded. Evidence: plan.md phases and affected seams.
- CHK-FIX-003 Consumer inventory recorded for convergence, cost guards, fan-out merge, fan-out run and reduce-state.

### Verification

- Baseline - PASS: broad related Vitest was 6 files / 83 tests; baseline npm run typecheck failed because no script existed
- node --check - PASS: convergence.cjs, cost-guards.cjs, fanout-merge.cjs, fanout-pool.cjs, fanout-run.cjs
- npm run typecheck - PASS: 0 errors
- Broad related Vitest - PASS: 7 files / 136 tests
- Dependency discipline - PASS: no candidate depends on D2 reliability
- Strict packet validation - PASS: 0 errors / 0 warnings
- Tasks complete - 29 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modified | Adds graph-observed novelty delta |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modified | Adds reported-novelty parsing, effective novelty and STOP blocker |
| `.opencode/skills/deep-loop-runtime/lib/council/cost-guards.cjs` | Modified | Adds lag-ceiling normalization/evaluator |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | Adds default-off fanout lag/heartbeat config |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | Emits lag-ceiling warning events when configured |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | Keeps both divergent same-id findings and marks conflicts |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Emits optional in-lineage progress events |
| `.opencode/skills/deep-loop-runtime/package.json` | Modified | Adds canonical npm run typecheck |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Added | Source-only runtime TypeScript check |
| `.opencode/skills/deep-loop-runtime/tests/...` | Modified | Adds deterministic coverage for C1-C6 |
| `spec.md, tasks.md, checklist.md, implementation-summary.md` | Modified | Reconciles runtime implementation status and remaining gates |

### Follow-Ups

- CHK-012 Error handling covers novelty gaming, lag boundary and downstream dedup clobber. Runtime fixtures cover novelty gaming and lag boundary; independent downstream persistence remains pending.
- CHK-FIX-004 Adversarial tests written for C2 anti-gaming and C5 dedup clobber. PENDING: deterministic fixtures exist, but no independent adversarial seat was run.
- CHK-FIX-007 Evidence pinned to scoped commits when built. PENDING: user requested no git commit.
- Confirm the orchestrator forwards the reducer's rolling-ratio to convergence.cjs; if not, extend reduce-state.cjs to pass --reported-novelty (OPEN QUESTION — iter-18 WHAT-BREAKS) (reduce-state.cjs) [30m]. PENDING gate: runtime arg/guard is implemented; workflow forwarding is outside the requested deep-loop-runtime scope and was left unchanged.
- Adversarial review seat (cli-codex / opus) tries to refute C2's anti-gaming max() + backward-safe no-op and C5's keep-both vs a downstream dedup clobber (the two highest-blast hunks) [30m]. PENDING gate: not run in this code+unit-test-only pass.
- C7 (shutdown-summary) reconciled as already-shipped (commit 46812f12a8), NOT re-implemented (SC-005)
