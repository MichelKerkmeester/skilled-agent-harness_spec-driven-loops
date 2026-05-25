---
title: Convergence Detection Reference
description: Live stop contract and navigation hub for deep-research convergence.
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

- Command syntax: `.opencode/commands/deep/start-research-loop.md`
- Workflow algorithm: `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` and `_confirm.yaml`
- Signal details: `references/convergence/convergence_signals.md`
- Recovery details: `references/convergence/convergence_recovery.md`
- Graph stop gates: `references/convergence/convergence_graph.md`

For iterative code review convergence, use `deep-review`. Review-mode algorithms and state are not part of the deep-research live contract.

### Live Decision Model

Convergence decides whether the loop should continue, recover from a stuck state, or stop. A STOP candidate is not legal until the legal-stop gate bundle passes. Novelty math can nominate STOP; gates authorize it.

The live deep-research algorithm evaluates:

| Stage | Outcome |
|-------|---------|
| Hard stops | Stop on max iterations or all key questions answered |
| Stuck detection | Enter recovery after configured consecutive no-progress iterations |
| Composite convergence | Nominate STOP when weighted signal score is above `0.60` |
| Legal-stop gates | Allow or block the STOP candidate |
| Graph gates | Add STOP-blocking graph checks when `graphEvents` exist |

---

## 2. STOP CONTRACT

### stopReason Values

| Value | When It Is Used |
|-------|-----------------|
| `converged` | Legal-stop gates passed and the loop may exit normally |
| `maxIterationsReached` | The loop hit the configured iteration cap |
| `userPaused` | A pause sentinel or equivalent user pause request halted execution |
| `blockedStop` | A STOP candidate was blocked by legal-stop or graph gates |
| `stuckRecovery` | Stuck detection triggered or failed recovery |
| `error` | The loop hit an unrecoverable workflow or state error |

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
2. If all key questions have evidence-backed answers, nominate STOP.
3. If stuckCount >= stuckThreshold, enter stuck recovery.
4. Compute composite convergence signals.
5. If weighted stop score > 0.60, nominate STOP.
6. Evaluate legal-stop gates for every STOP candidate except hard max-iteration stop.
7. If graphEvents exist, evaluate graph-aware STOP blockers.
8. If gates pass, STOP; otherwise emit blockedStop and CONTINUE with recovery focus.
```

### Composite Signal Weights

| Signal | Weight | Min Iterations | Measures |
|--------|--------|----------------|----------|
| Rolling Average | `0.30` | 3 evidence iterations | Recent information yield |
| MAD Noise Floor | `0.35` | 4 evidence iterations | Signal vs noise in `newInfoRatio` |
| Question Entropy | `0.35` | 1 key question | Evidence-backed question coverage |

The weighted stop score is normalized over active signals. STOP is nominated only when the normalized score is greater than `0.60`. See `convergence_signals.md` for exact signal rules and reporting.

---

## 4. LEGAL STOP GATES

Every non-terminal STOP candidate must pass the gate bundle before the workflow exits.

| Gate | Rule | Failure |
|------|------|---------|
| Convergence Gate | Low novelty holds for the required consecutive evidence iterations | Emit `blocked_stop`, continue |
| Coverage Gate | Every key question has an evidence-backed answer | Emit `blocked_stop`, continue |
| Quality Gate | Source diversity, focus alignment, and no single weak-source dominance pass | Emit `blocked_stop`, continue |
| Graph Gate | When graph data exists, graph coverage has no STOP blockers | Emit `graph_convergence`/`blocked_stop`, continue |

The reducer surfaces legal-stop evidence through the findings registry and dashboard. The JSONL event shapes live in `../state/state_jsonl.md`.

---

## 5. ROUTED REFERENCES

| Resource | Use When |
|----------|----------|
| `convergence_signals.md` | Need scoring, `newInfoRatio`, `stuckCount`, MAD, entropy, report fields, or threshold tuning |
| `convergence_recovery.md` | Need stuck recovery, recovery strategy selection, tiered errors, or escalation behavior |
| `convergence_graph.md` | Need graph-aware STOP gates, graph convergence events, or coverage graph fallback behavior |
| `convergence_reference_only.md` | Need future/reference-only models such as segment filtering, semantic convergence, or optimizer metadata |
| `../state/state_jsonl.md` | Need JSONL event shapes persisted by the convergence workflow |
| `../state/state_reducer_registry.md` | Need reducer-owned registry/dashboard fields derived from convergence |

---

## 6. NON-GOALS

- Do not copy `deep-review` convergence into this skill. Use the `deep-review` references for severity-weighted review convergence.
- Do not treat reference-only semantic or segment models as executable contracts.
- Do not change the YAML workflow by editing this document. This document describes and routes the live contract; workflow changes require command/YAML work.
