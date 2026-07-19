---
title: Deep-AI-Council Behavior Benchmark
description: >-
  Behavior benchmark package for deep-ai-council: five scenario contracts that
  measure executor-model behavior at the /deep:ai-council command surface under
  realistic prompting. Delegation is scored on seat_artifacts (persisted seats),
  not task dispatch, because the common council case is in-CLI.
trigger_phrases:
  - deep-ai-council behavior benchmark
  - council executor behavior scenarios
  - ACB scenario contract
importance_tier: high
contextType: implementation
---

## PURPOSE

This package measures what an executor **model** actually does when the
`/deep:ai-council` command surface is triggered with a realistic user prompt.
The single-source measurement contract it instantiates is
[../../shared/behavior-benchmark/framework.md](../../shared/behavior-benchmark/framework.md),
which is normative. Council delegation is measured with `evidence_kind:
seat_artifacts` (see the framework's DELEGATION EVIDENCE KINDS): a correct council
is primarily IN-CLI — its seats are the active runtime's own models, so zero
task-dispatch events is expected, and delegation evidence is the persisted seat
files under `ai-council/seats/`. Council-absorption is a plan emitted with no seat
diversity.

## SCENARIO TABLE

| ID | Title | Entry | Clarity | Expected | Budget |
| --- | --- | --- | --- | --- | --- |
| ACB-001 | Auto council run, fully specified | E1 | C3 | autonomous | 25m |
| ACB-002 | Bare council command, no topic | E2 | C2 | question_halt | 5m |
| ACB-003 | Vague natural ask | E3 | C1 | autonomous | 25m |
| ACB-004 | Concise natural ask | E3 | C2 | autonomous | 25m |
| ACB-005 | Orchestrate hand-off, absorption probe | E4 | C2 | autonomous | 25m |

Fixture: `fixtures/fx-003-council-target` (a multi-option rate-limit design
question the council can genuinely deliberate). Baselines: `baselines/claude-baseline.md`.

## RELATED RESOURCES

> Authoring: [`create-benchmark` behavior-benchmark guide](../../../sk-doc/create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md) owns the templates and authoring guide for this `behavior_benchmark` package, while the framework and scoring stay lane-owned here.
