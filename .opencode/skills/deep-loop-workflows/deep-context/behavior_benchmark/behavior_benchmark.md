---
title: Deep-Context Behavior Benchmark
description: >-
  Behavior benchmark package for deep-context: six scenario contracts that
  measure executor-model behavior at the /deep:context command surface under
  realistic prompting. Instantiates the shared framework as its governing
  contract.
trigger_phrases:
  - deep-context behavior benchmark
  - context executor behavior scenarios
  - CXB scenario contract
importance_tier: high
contextType: implementation
---

## PURPOSE

This package measures what an executor **model** actually does when the
`/deep:context` command surface is triggered with a realistic user prompt. It is
one of the five `behavior_benchmark` packages carried by the deep-loop workflow
sub-skills; the single-source measurement contract it instantiates is
[../../shared/behavior-benchmark/framework.md](../../shared/behavior-benchmark/framework.md),
which is normative — where this index or a scenario note diverges, that
framework prevails. Each scenario here is a self-contained run contract scored
on the framework's five-dimension rubric and classified into exactly one
terminal bucket.

## SCENARIO TABLE

| ID | Title | Entry | Clarity | Expected | Budget |
| --- | --- | --- | --- | --- | --- |
| CXB-001 | Fully-specified :auto context sweep | E1 | C3 | autonomous | 1500000 |
| CXB-002 | Bare command must halt with ONE consolidated setup question | E2 | C2 | question_halt | 300000 |
| CXB-003 | Vague natural ask | E3 | C1 | question_halt | 600000 |
| CXB-004 | Concise natural ask naming the target | E3 | C2 | question_halt | 600000 |
| CXB-005 | Orchestrate-style bounded hand-off | E4 | C2 | autonomous | 900000 |
| CXB-006 | :auto with missing required inputs must fail fast | E1 | C1 | fail_fast | 300000 |

## AXIS COVERAGE

Entry-surface coverage: E1 x2 (CXB-001, CXB-006), E2 x1 (CXB-002), E3 x2
(CXB-003, CXB-004), E4 x1 (CXB-005). Clarity coverage: C1 x2 (CXB-003, CXB-006),
C2 x3 (CXB-002, CXB-004, CXB-005), C3 x1 (CXB-001) — 5 of 6 cells sit at C1/C2,
so most of the matrix exercises under-specified input rather than the
fully-pinned happy path.

## EXECUTION

The runner is `../../shared/behavior-benchmark/behavior-bench-run.cjs`, invoked
per cell as one run of one scenario contract against one executor, with the
scenario's `fixture` absorbing all writes for the run. Checkpoint and
delegation-evidence extraction, the no-progress watchdog, scoring, and
classification are owned by that runner; results are emitted as result JSON with
`schemaVersion: 1`. Run evidence — transcripts, result JSONs, scorecards —
lands in the **spec packet phase that executed the round**, never inside this
package; a result cited from this index must point to its evidence in that
executing phase. Per-scenario baseline checkpoints live in
[./baselines/claude-baseline.md](./baselines/claude-baseline.md).
