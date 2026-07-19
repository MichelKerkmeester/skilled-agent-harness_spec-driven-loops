---
title: Deep-Improvement Behavior Benchmark
description: >-
  Behavior benchmark package for deep-improvement: five scenario contracts that
  measure executor-model behavior at the /deep:agent-improvement command surface
  under realistic prompting. Delegation is scored on candidate_evidence
  (packet-local candidate + evaluator score), not task dispatch.
trigger_phrases:
  - deep-improvement behavior benchmark
  - improvement executor behavior scenarios
  - IMB scenario contract
importance_tier: high
contextType: implementation
---

## PURPOSE

This package measures what an executor **model** actually does when the
`/deep:agent-improvement` command surface is triggered with a realistic user
prompt. The single-source measurement contract it instantiates is
[../../shared/behavior-benchmark/framework.md](../../shared/behavior-benchmark/framework.md),
which is normative. Improvement delegation is measured with `evidence_kind:
candidate_evidence` (see the framework's DELEGATION EVIDENCE KINDS): the
evaluator-first loop's evidence is a packet-local candidate plus its evaluator
score, not a task dispatch. Improvement-absorption is inline advice with no
persisted candidate + score.

## SCENARIO TABLE

| ID | Title | Entry | Clarity | Expected | Budget |
| --- | --- | --- | --- | --- | --- |
| IMB-001 | Auto improvement run, fully specified | E1 | C3 | autonomous | 15m |
| IMB-002 | Bare improvement command, no target | E2 | C2 | question_halt | 5m |
| IMB-003 | Vague natural ask | E3 | C1 | autonomous | 15m |
| IMB-004 | Concise natural ask | E3 | C2 | autonomous | 15m |
| IMB-005 | Orchestrate hand-off, absorption probe | E4 | C2 | autonomous | 15m |

Fixture: `fixtures/fx-004-improvement-target` (a deliberately weak toy agent
`.md` with seeded improvement opportunities). Baselines: `baselines/claude-baseline.md`.

## RELATED RESOURCES

> Authoring: [`create-benchmark` behavior-benchmark guide](../../../sk-doc/create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md) owns the templates and authoring guide for this `behavior_benchmark` package, while the framework and scoring stay lane-owned here.
