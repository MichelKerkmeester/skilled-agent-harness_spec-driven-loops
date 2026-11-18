---
title: Convergence Detection Reference
description: Live stop contract and navigation hub for deep-research convergence.
trigger_phrases:
  - "research convergence detection"
  - "research stop contract"
  - "research stopreason values"
  - "research legal stop gates"
  - "research convergence decision order"
importance_tier: important
contextType: implementation
version: 1.14.11.0
---

# Convergence Detection Reference

Live stop-contract hub for deep-research convergence and routed convergence references.

---

## 1. OVERVIEW

### Purpose

Keep the executable deep-research stop contract short enough to load during routing while pointing detailed signal, recovery, and graph behavior to focused references.

### When to Use

Load this hub when deciding whether a deep-research loop should continue, recover, or stop.

### Key Sources

- Command syntax: `.skilled/commands/deep/research.md`
- Workflow algorithm: `.skilled/commands/deep/assets/deep-research.yaml`
- Signal details: `references/convergence/convergence-signals.md`
- Recovery details: `references/convergence/convergence-recovery.md`
- Graph stop gates: `references/convergence/convergence-graph.md`

For iterative code review convergence, use `deep-review`. Review-mode algorithms and state are not part of the deep-research live contract.

### Live Decision Model

Convergence decides whether the loop should continue, recover from a stuck state, or stop. A STOP candidate is not legal until the legal-stop gate bundle passes. Novelty math can nominate STOP; gates authorize it.

The live deep-research algorithm evaluates:

| Stage | Outcome |
|-------|---------|
| Hard stop and completion candidate | Stop unconditionally on max iterations; nominate STOP when all key questions are answered |
| Stuck detection | Enter recovery after configured consecutive no-progress iterations |
| Composite convergence | Nominate STOP when weighted signal score is above `0.60` |
| Legal-stop gates | Allow or block the STOP candidate |
| Graph gates | Block every non-terminal STOP until a graph decision exists |

### Convergence Modes

The shared convergence runtime accepts four values. The workflow keeps hard terminal boundaries outside mode-specific convergence handling.

| Mode | Live Behavior |
|------|---------------|
| `default` | Uses the normal full-history convergence signals and sends a legal STOP to synthesis. This is the fallback when no mode is supplied. |
| `off` | Skips convergence-driven STOP candidates. Max iterations, pause or cancellation, manual stop, recovery halt, and unrecoverable error behavior remain active. |
| `sliding-window` | Uses a bounded graph-novelty window, defaulting to 5 snapshots, while preserving the ordinary legal-stop and synthesis path. |
| `divergent` | Computes convergence normally, but translates an eligible legal STOP into a three-seat direction-selection pivot and continues from the selected focus. |

#### Expansive Depth Mode

`--depth-mode=expansive` grows a frontier of follow-up questions beside the questions seeded at init. The value lands in `antiConvergence.depthMode`, and the caps live in `expansiveDepth`: `maxDepth` 3, `maxChildrenPerNode` 6, `budgetSplit` 0.5/0.35/0.15 for depths 1, 2 and 3, and `maxFrontierNodes`, which defaults to half of `maxIterations` unless the config sets a number. The run cap never prunes a depth-1 seed, which only the root-children cap bounds, but every seed that is not pruned, answered ones included, counts toward the live total that later admissions are checked against. When `--max-iterations` is left at its default, the run sizes its budget from the seed: `min(24, max(10, 2 × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes, 16 at the full six seeds, and the seed step prints the derived budget. A native fan-out lineage uses 12 in place of 10, so one dealt no seed node runs 12 iterations. The node cap stays half that budget, which leaves room for at least two nodes past depth 1. An explicit `--max-iterations`, marker, setup answer or fan-out matrix `iterations` value always wins, even below the derived value, and the seed warns when it leaves no room past depth 1. A fan-out parent seeds before any config exists, so its cap falls back to 10. An absent flag means `default`, which keeps the default behavior; `research-depth-mode-golden.vitest` proves it after stripping the expansive-only persona paragraph from the CLI lineage prompt, the one byte change.

After the `minIterations` floor, an expansive run with open or active frontier nodes turns a soft stop candidate into CONTINUE with reasonDetail `frontierOpen`. The veto never creates a stop of its own and never outranks the iteration cap, consecutive failures, stuck recovery, `--convergence-mode=off` or `--stop-policy=max-iterations`. Under `--convergence-mode=divergent` the pivot becomes eligible only once no frontier node is open or active.

Tested in `stop-decision.vitest`.

#### Divergent Pivot Contract

Research pivots are eligible only when the workflow decision is `STOP` and the exact internal reason is `composite_converged` or `all_questions_answered`. The legal-stop and quality gates run before this branch. `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `minIterationsNotReached`, `error`, `manualStop`, and `userPaused` are explicitly excluded. Max iterations, pause or cancellation, manual stop, and unrecoverable error therefore never dispatch a pivot Council.

Each eligible pivot runs one native, in-process Council round with exactly three distinct seats: analytical, critical, and pragmatic.
If that round misses quorum, because a seat fails to return or returns a report that does not parse, the pivot reopens once as attempt 2 with three fresh seat outputs. A second quorum miss, or three valid seats that do not agree, fails the pivot closed. `maxCouncilSeatOutputs` caps one council attempt at 3 seat outputs, so a pivot records at most 6.

- It does not use an external CLI.
- The transaction requires all three seat returns to be parse-valid and at least two seats to materially endorse the same candidate without a high-severity blocker.
- Research candidates come from persisted adjacent questions, contradiction or verification gaps, missing source classes, alternate evidence methods, and independent checks of recent findings.
- A completed pivot restores the selected candidate's focus and returns to the research loop; a failed pivot fails closed to synthesis.

Every pivot dispatches three seats, or six when its first attempt misses quorum, so a run that pivots has proportionally higher model cost and duration than the same run under `default`, `off`, or `sliding-window`. Pivot evidence is isolated under `<artifactRoot>/divergent/pivots/<pivotId>/council/**`, including config, append-only state, three seat artifacts, deliberation, and report, plus an attempt-2 folder with its own seat artifacts and deliberation after a retry. This path is distinct from ordinary planning Council artifacts under a spec packet's `ai-council/**` tree.

---

## 2. STOP CONTRACT

### stopReason Values

| Value | When It Is Used |
|-------|-----------------|
| `converged` | Legal-stop gates passed and the loop may exit normally |
| `maxIterationsReached` | The loop hit the configured iteration cap |
| `blockedStop` | A STOP candidate was blocked by legal-stop or graph gates |
| `manualStop` | The operator asked the run to stop |
| `error` | The loop hit an unrecoverable workflow or state error |
| `stuckRecovery` | Stuck detection triggered or failed recovery |
| `userPaused` | A pause sentinel or equivalent user pause request halted execution |
| `maxDurationReached` | The run hit the wall-clock limit set by `maxDurationMinutes` |

### Legacy Stop Labels

Legacy labels are normalized before persistence:

| Legacy label or phrase | New `stopReason` |
|------------------------|------------------|
| `composite_converged` | `converged` |
| `novelty below threshold` | `converged` |
| `all_questions_answered` | `converged` |
| `max_iterations_reached` | `maxIterationsReached` |
| `paused` | `userPaused` |
| `stuck_detected` | `stuckRecovery` |
| `stuck_unrecoverable` | `stuckRecovery` |

---

## 3. LIVE ALGORITHM

### Decision Order

```text
1. If iteration count >= maxIterations, STOP with maxIterationsReached.
2. After 3 consecutive failed iterations, STOP with stop reason error.
3. If stuckCount >= stuckThreshold, enter stuck recovery.
4. If convergenceMode is off or stopPolicy is max-iterations, CONTINUE.
5. If all key questions have evidence-backed answers, nominate STOP. Otherwise compute composite convergence signals and nominate STOP when the weighted stop score > 0.60. With no candidate, CONTINUE.
6. If iteration count < minIterations, CONTINUE with minIterationsNotReached.
7. If depthMode is expansive and a frontier node is open or active, CONTINUE with frontierOpen.
8. Evaluate the quality guards for every STOP candidate except hard max-iteration stop. A failed guard returns CONTINUE with qualityGuardFailed and emits no blocked_stop event.
9. Block every non-terminal STOP until a graph decision exists. A graph STOP_BLOCKED emits blockedStop and continues with recovery focus.
10. If the guards pass and the graph allows the stop, pivot for an eligible divergent reason or STOP normally.
```

### Composite Signal Weights

| Signal | Weight | Min Iterations | Measures |
|--------|--------|----------------|----------|
| Rolling Average | `0.30` | 3 evidence iterations | Recent information yield |
| MAD Noise Floor | `0.35` | 4 evidence iterations | Signal vs noise in `newInfoRatio` |
| Question Entropy | `0.35` | 1 key question | Evidence-backed question coverage |

The weighted stop score is normalized over active signals. STOP is nominated only when the normalized score is greater than `0.60`. See `convergence-signals.md` for exact signal rules and reporting.

---

## 4. LEGAL STOP GATES

Every non-terminal STOP candidate must pass the gate bundle before the workflow exits.

| Gate | Rule | Failure |
|------|------|---------|
| Convergence Gate | Low novelty holds for the required consecutive evidence iterations | Emit `blocked_stop`, continue |
| Coverage Gate | Every key question has an evidence-backed answer | Emit `blocked_stop`, continue |
| Quality Gate | Source diversity, focus alignment, and no single weak-source dominance pass | `CONTINUE` with `qualityGuardFailed`, no `blocked_stop` event |
| Graph Gate | A graph decision exists and graph coverage has no STOP blockers | Emit `graph_convergence`/`blocked_stop`, continue |

The reducer surfaces legal-stop evidence through the findings registry and dashboard. The JSONL event shapes live in `../state/state-jsonl.md`.

---

## 5. ROUTED REFERENCES

| Resource | Use When |
|----------|----------|
| `convergence-signals.md` | Need scoring, `newInfoRatio`, `stuckCount`, MAD, entropy, report fields, or threshold tuning |
| `convergence-recovery.md` | Need stuck recovery, recovery strategy selection, tiered errors, or escalation behavior |
| `convergence-graph.md` | Need graph-aware STOP gates, graph convergence events, or coverage graph fallback behavior |
| `convergence-reference-only.md` | Need future/reference-only models such as segment filtering, semantic convergence, or optimizer metadata |
| `../state/state-jsonl.md` | Need JSONL event shapes persisted by the convergence workflow |
| `../state/state-reducer-registry.md` | Need reducer-owned registry/dashboard fields derived from convergence |

---

## 6. NON-GOALS

- Do not copy `deep-review` convergence into this skill. Use the `deep-review` references for severity-weighted review convergence.
- Do not treat reference-only semantic or segment models as executable contracts.
- Do not change the YAML workflow by editing this document. This document describes and routes the live contract; workflow changes require command/YAML work.
