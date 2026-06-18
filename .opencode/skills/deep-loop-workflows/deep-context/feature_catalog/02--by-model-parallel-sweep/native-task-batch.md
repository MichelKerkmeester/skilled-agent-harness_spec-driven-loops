---
title: "Native Task Batch"
description: "Dispatches all native @deep-context seats as a single concurrent Task batch, not one-at-a-time, each sweeping the same shared focus."
trigger_phrases:
  - "native task batch"
  - "native seats"
  - "deep-context agent seat"
  - "parallel Task dispatch"
  - "native concurrent batch"
  - "@deep-context agent"
---

# Native Task Batch

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dispatches all native `@deep-context` seats as a single concurrent Task batch, not one-at-a-time, each sweeping the same shared focus.

The native batch is the host-local counterpart to the CLI pool. Each native seat is an instance of the `@deep-context` LEAF agent — a read-only analyzer that receives a fully rendered four-part prompt, sweeps its assigned focus using `code_graph_query` / Grep / Read, and returns a structured finding set as its final message. The host writes each seat's findings to disk; the seat writes nothing.

---

## 2. HOW IT WORKS

### Batch Requirement

The critical constraint is that all native seats must be dispatched simultaneously in one parallel batch — not in a sequential for-each loop. Emitting Task calls one after another would serialize the sweeps and eliminate the concurrency benefit. The auto YAML enforces this with a `dispatch_mode: parallel_batch` directive.

### Per-Seat Prompt Contract

Every native seat receives a rendered prompt from `{prompt_dir}/iter-{NNN}/{seat.label}.md` that carries the four-part lineage contract:
1. `gather-subject` — the feature/area the pool is gathering context for
2. `scope/slice` — the shared current_focus for this iteration (identical for all seats)
3. `known-context` — prior-iteration confirmed reuse candidates (to avoid re-finding)
4. `output schema` — the structured finding JSON the host expects

A seat told only "analyze" returns generic noise. The full lineage contract is mandatory.

### Read-Only Enforcement

`@deep-context` is a LEAF agent with `write: deny`, `edit: deny`, `bash: deny`, and `task: deny` permissions. It uses only `Read`, `Grep`, `Glob`, `code_graph_query`, and `code_graph_context`. Allowed tool budget is 8-11 tool calls per seat, hard max 12. Findings are returned in stdout; the host writes each seat's result to `{seat_dir}/iter-{NNN}/{label}.json`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_sweep_native_batch` — parallel_batch dispatch_mode, per-seat prompt path, host_writes contract |
| `.opencode/agents/deep-context.md` | Agent | Full LEAF read-only analyzer contract: input validation, BINDING lines, analysis workflow, output schema, anti-patterns |
| `.opencode/commands/deep/context.md` | Command | `agent_config` block: model: opus, leaf_only: true, read_only_analyzer: true, tool budget |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/02--by-model-parallel-sweep/native-task-batch.md` | Manual playbook | Verifies all native seats dispatched simultaneously, per-seat prompt content, host-writes contract |

---

## 4. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--by-model-parallel-sweep/native-task-batch.md`

Related references:
- [heterogeneous-pool-dispatch.md](heterogeneous-pool-dispatch.md) — Parent dispatch step that launches native batch and CLI pool together
- [cli-council-seats.md](cli-council-seats.md) — CLI counterpart to the native batch
