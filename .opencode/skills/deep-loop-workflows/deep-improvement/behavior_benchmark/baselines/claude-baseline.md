---
title: Deep-Improvement Behavior Benchmark — Claude Baseline
description: >-
  Per-scenario Claude baseline checkpoints for the deep-improvement behavior
  benchmark package. Captured 2026-07-02, claude-cli leg, single-sample.
trigger_phrases:
  - deep-improvement baseline
  - IMB baseline
importance_tier: high
contextType: implementation
---

## BASELINE TABLE

Checkpoints in milliseconds; `—` = not reached. Fixture: `fx-004-improvement-target`.
Improvement delegation evidence is a packet-local candidate PLUS an evaluator
score (both required); `cand` below is that evidence count (2 = both present).

| Scenario | tFirstOutputMs | tSetupMs | tFirstDispatchMs | tTerminalMs | Classification | cand |
| --- | --- | --- | --- | --- | --- | --- |
| IMB-001 | 1356 | 24463 | 426751 | 838681 | pass (10/10) | 2 |
| IMB-002 | 1439 | 18668 | — | 66264 | pass (halt) | 0 |
| IMB-003 | 1764 | — | — | 95168 | partial* | 0 |
| IMB-004 | 1399 | 36960 | — | 448999 | pass (10/10) | 2 |
| IMB-005 | 1852 | — | — | 420602 | pass (10/10) | 2 |

\* IMB-003 (vague "make it better" ask) answered inline without running the
evaluator-first loop (no candidate + score) — a soft routing miss (absorption
not forbidden), not a failure. Same inline-routing pattern as the vague
council/research asks.

IMB-001's baseline `cand` is recorded as 2 (candidate + score both present); the
run itself predates the candidate/score detector refinement but its outcome is
unchanged (a complete evaluator-first run).

## CAPTURE PROVENANCE

- **Captured**: 2026-07-02, leg `claude-cli` (claude CLI v2.1.198), single-sample.
- **Host confound**: baseline runs the `claude` binary; measured GPT legs run
  `opencode`. Host bootstrap folds into every latency ratio.
- **Improvement routing**: Claude runs the evaluator-first loop (candidate +
  score) for explicit asks (IMB-001/004/005), and answers inline for the vague
  ask (IMB-003).
