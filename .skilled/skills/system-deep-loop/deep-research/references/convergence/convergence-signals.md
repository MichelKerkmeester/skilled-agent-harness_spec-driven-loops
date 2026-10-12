---
title: Convergence Signals Reference
description: Signal definitions, scoring rules, and reports for deep-research convergence.
trigger_phrases:
  - "research convergence signals"
  - "research new info ratio"
  - "research stuck count"
  - "mad noise floor"
  - "question entropy"
  - "research composite score"
  - "convergence threshold tuning"
importance_tier: normal
contextType: implementation
version: 1.14.0.3
---

# Convergence Signals Reference

This reference defines the live deep-research convergence signals. The compact stop contract lives in `convergence.md`.

---

## 1. OVERVIEW

### Purpose

Define the live convergence signals, scoring rules, threshold semantics, and reporting shape used by deep-research loops.

### When to Use

Load this reference when calculating `newInfoRatio`, explaining a composite STOP vote, debugging stuck counts, or validating convergence dashboards.

### Core Principle

Signals nominate STOP; legal-stop and graph gates authorize or block it.

---

## 2. SIGNAL MODEL

The live model uses three weighted signals and normalizes by the weight of the signals that have enough data to run.

| Signal | Weight | Requires | STOP Vote |
|--------|--------|----------|-----------|
| Rolling Average | `0.30` | 3 evidence iterations | Average of last 3 `newInfoRatio` values is below `convergenceThreshold` |
| MAD Noise Floor | `0.35` | 4 evidence iterations | Latest `newInfoRatio` is at or below `MAD * 1.4826` |
| Question Entropy | `0.35` | At least 1 key question | Evidence-backed coverage is at least `0.85` |

`thought` iterations are excluded from rolling average, MAD, and stuck counting because they are analytical-only. `insight` iterations are included in convergence signals but do not count as stuck.

---

## 3. NEW INFO RATIO

`newInfoRatio` measures how much an iteration added relative to accumulated research knowledge.

| Ratio | Meaning |
|-------|---------|
| `1.0` | Mostly new findings or first broad pass |
| `0.7` | Several new findings plus some refinements |
| `0.5` | Mixed new and repeated material |
| `0.2` | Mostly confirmation or marginal novelty |
| `0.0` | No new information |

Agent assessment guidance:

- Fully new finding: count as `1.0`.
- Refinement of known finding: count as partial novelty.
- Ruled-out direction: count as valuable negative knowledge when it removes a plausible path.
- Tentative single-source finding: contribute less than verified or multi-source evidence.
- Simplicity bonus may add up to `0.10`, capped at `1.0`, when an iteration materially reduces the search space.

Every iteration record should include `newInfoRatio` and `noveltyJustification`; see `../state/state-jsonl.md`.

---

## 4. STUCK COUNT

`stuckCount` is consecutive no-progress evidence iterations.

```text
for each iteration from newest to oldest:
  skip status == "thought"
  stop counting when status == "insight"
  count if status == "stuck" or newInfoRatio <= noProgressThreshold
  stop counting on any productive evidence iteration
```

Default threshold behavior:

- `stuckThreshold`: `3`
- `noProgressThreshold`: implementation default aligned with the workflow's recovery check
- Recovery route: `convergence-recovery.md`

---

## 5. ROLLING AVERAGE

Rolling average uses the last three evidence iterations.

```text
evidenceIterations = iterations where status != "thought"
recent = last 3 evidenceIterations
rollingAvg = mean(recent.newInfoRatio)
rollingStop = rollingAvg < convergenceThreshold
```

This signal is unavailable before three evidence iterations. The composite vote normalizes over active signals, so early runs can still use question coverage without pretending the rolling signal exists.

---

## 6. MAD NOISE FLOOR

MAD compares the latest ratio against the noise floor in the accumulated evidence ratios.

```text
ratios = evidenceIterations.newInfoRatio
medianRatio = median(ratios)
mad = median(abs(ratio - medianRatio) for ratio in ratios)
noiseFloor = mad * 1.4826
madStop = latestEvidenceRatio <= noiseFloor
```

Interpretation:

| Condition | Meaning |
|-----------|---------|
| Latest ratio above floor | Signal still exceeds observed noise |
| Latest ratio within floor | New findings may be indistinguishable from noise |
| Very high floor | Iteration quality is unstable; narrow the focus before trusting STOP |

---

## 7. QUESTION ENTROPY

Question entropy is evidence-backed key-question coverage.

```text
answered = count(keyQuestions with evidence-backed answers)
total = count(keyQuestions)
coverage = answered / total
entropyStop = coverage >= 0.85
```

Tentative-only findings do not satisfy evidence-backed coverage. Graph events may add extra STOP blockers when graph coverage disagrees with inline question coverage; see `convergence-graph.md`.

---

## 8. COMPOSITE SCORE

```text
activeSignals = signals with enough data
stopScore = sum(signal.weight for active STOP votes) / sum(active signal weights)
stopCandidate = stopScore > 0.60
```

The score nominates STOP only. `convergence.md` defines the legal-stop gates that decide whether the loop may exit.

---

## 9. REPORTING

Every completed loop should report:

```text
CONVERGENCE REPORT
------------------
Stop reason: converged | maxIterationsReached | userPaused | stuckRecovery | error
Iterations completed: N
Questions answered: X/Y
Average newInfoRatio trend: [...]
Composite stop score: 0.XX
Signals:
  Rolling Avg (w=0.30): STOP|CONTINUE
  MAD Noise (w=0.35): STOP|CONTINUE
  Entropy (w=0.35): STOP|CONTINUE
Legal-stop gates: pass|blocked
Graph gates: pass|blocked|not_applicable
```

Dashboard and registry fields derived from these signals are documented in `../state/state-reducer-registry.md`.

---

## 10. THRESHOLD TUNING

| Goal | Adjustment |
|------|------------|
| Deeper research | Lower `convergenceThreshold`, raise `maxIterations` |
| Faster completion | Raise `convergenceThreshold`, lower `maxIterations` |
| More stuck recovery | Lower `stuckThreshold` cautiously |
| Fewer false stops | Keep legal-stop and graph gates enabled |

Optimizer-managed fields are described in `convergence-reference-only.md`. Optimizer proposals are advisory and do not override locked stop-contract fields.
