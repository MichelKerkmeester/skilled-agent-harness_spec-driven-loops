---
title: "Heterogeneous Pool Dispatch"
description: "Dispatches all executor seats — native Task batch and CLI council pool — over the same shared current focus concurrently, then barrier-joins before merging."
trigger_phrases:
  - "heterogeneous pool dispatch"
  - "parallel sweep"
  - "barrier join"
  - "by-model shared scope"
  - "deep context parallel dispatch"
  - "native and CLI seats together"
---

# Heterogeneous Pool Dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dispatches all executor seats — native Task batch and CLI council pool — over the same shared current focus concurrently, then barrier-joins before merging.

This is the defining characteristic of `deep-context`. Unlike `deep-research` and `deep-review` which fan lineages out over disjoint slices, every executor in the `deep-context` pool sweeps the **same** current focus each iteration. Cross-executor agreement on the same `file:symbol` is the confidence signal, not volume. Both the native batch and the CLI pool start simultaneously and the host waits for all seats before any merge work begins.

---

## 2. HOW IT WORKS

### Concurrent Launch and Barrier Join

`step_parallel_sweep` declares two sub-steps — `step_sweep_native_batch` and `step_sweep_cli_pool` — under a `launch_together` directive and enforces a `barrier_join` before `step_merge_findings`. Both sub-steps start without waiting for each other. The host waits for both groups to settle (succeed or fail per seat) before merging any findings.

### Native Batch

`step_sweep_native_batch` is skipped when no native seats exist in `config.fanout.executors`. When native seats are present, it emits all `@deep-context` Task dispatches in a single concurrent batch — explicitly not a sequential for-each loop. Each native seat receives the same rendered four-part prompt from `{prompt_dir}/iter-{NNN}/{label}.md`. Seats are read-only analyzers that return structured finding JSON to the host; the host writes each result to `{seat_dir}/iter-{NNN}/{label}.json`.

### CLI Pool

`step_sweep_cli_pool` uses `multi-seat-dispatch.cjs#dispatchCouncilSeats` to fan all CLI seats out with `Promise.all`. Each CLI seat makes exactly one read-only analysis call — not an autonomous loop. A CLI seat's one-shot prompt carries the same four-part lineage contract (gather-subject, shared current_focus, known-context, seat_output_schema) and instructs the seat to return only the structured finding JSON for this single pass.

### Graceful Degradation

A failed seat does not abort the sweep. `step_collect_seat_findings` records `seats_failed` and the merge proceeds with surviving seats; agreement counts degrade proportionally. Three consecutive empty sweeps (all seats fail) trigger `phase_synthesis` with `reason: "error"`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Workflow | `step_parallel_sweep`, `step_sweep_native_batch`, `step_sweep_cli_pool`, `step_collect_seat_findings` |
| `.opencode/skills/deep-loop-runtime/lib/council/multi-seat-dispatch.cjs` | Shared | `dispatchCouncilSeats` — Promise.all fan-out with per-seat result aggregation |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Script | `buildLineageCommand` — per-kind CLI invocation builder reused for seat dispatch |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-context/manual_testing_playbook/02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md` | Manual playbook | Verifies concurrent launch, barrier join, and graceful seat degradation |

---

## 4. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md`

Related references:
- [native-task-batch.md](native-task-batch.md) — Native seat batch dispatch mechanics
- [cli-council-seats.md](cli-council-seats.md) — CLI seat one-shot analysis dispatch
