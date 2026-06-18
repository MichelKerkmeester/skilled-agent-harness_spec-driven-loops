---
title: "CLI Council Seats"
description: "Dispatches all CLI executor seats as one-shot read-only analysis passes over the shared focus via the council scaffold using Promise.all fan-out."
trigger_phrases:
  - "CLI council seats"
  - "cli-opencode seat"
  - "cli-codex seat"
  - "council scaffold"
  - "one-shot analysis"
  - "multi-seat-dispatch"
  - "dispatchCouncilSeats"
---

# CLI Council Seats

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dispatches all CLI executor seats as one-shot read-only analysis passes over the shared focus via the council scaffold using `Promise.all` fan-out.

CLI seats are the non-native members of the heterogeneous pool. Each CLI seat is a different model (e.g. MiMo, gpt, deepseek) dispatched via a different executor runtime (cli-opencode, cli-codex, cli-claude-code). They sweep the same current focus as native seats and return structured findings in the same output schema. The council scaffold handles concurrent dispatch and per-seat result aggregation.

---

## 2. HOW IT WORKS

### One-Shot Analysis Contract

Each CLI seat performs exactly **one** read-only analysis pass per iteration — not an autonomous loop. This is the key distinction from the `deep-research` / `deep-review` fan-out model where each CLI lineage runs its own loop. For `deep-context`, CLI seats are analysis tools in the host's per-iteration sweep, not independent loops.

### Council Scaffold

`multi-seat-dispatch.cjs#dispatchCouncilSeats` fans seats out with `Promise.all` and aggregates fulfilled/rejected results by seat label. The injected `dispatchSeat` function issues a single one-shot read-only CLI call per seat. Each CLI invocation's flag shape is built by reusing `fanout-run.cjs#buildLineageCommand` (specifying `read-only` mode, not `buildLoopPrompt`).

### Per-Executor CLI Contracts

| Executor | Invocation | Read-Only Enforcement |
|---|---|---|
| `cli-opencode` | `opencode run` with `</dev/null` for closed stdin | No top-level `--agent` (rejects it); `read-only` sandbox |
| `cli-codex` | `codex exec --model X -c model_reasoning_effort -c approval_policy=never` | `--sandbox read-only` |
| `cli-claude-code` | `claude -p ... --model X` | `--permission-mode plan` |

### Optional Autonomous-Lineage Mode

An `autonomous-lineage` mode exists under `config.fanout.cliMode == "autonomous-lineage"` as an operator opt-in. In this mode, CLI seats run full end-to-end loops via `fanout-run.cjs` and the host merges lineage reports afterward via `fanout-merge.cjs`. This is NOT the default per-iteration path; it must be explicitly configured.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_sweep_cli_pool` — council dispatch, one-shot prompt contract, CLI invocation per executor kind |
| `.opencode/skills/deep-loop-runtime/lib/council/multi-seat-dispatch.cjs` | Shared | `dispatchCouncilSeats` — Promise.all fan-out with per-seat outcome aggregation |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Script | `buildLineageCommand` — per-kind CLI invocation flag builder |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/02--by-model-parallel-sweep/cli-council-seats.md` | Manual playbook | Verifies one-shot dispatch per seat, CLI contracts, and closed stdin for opencode seats |

---

## 4. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--by-model-parallel-sweep/cli-council-seats.md`

Related references:
- [native-task-batch.md](native-task-batch.md) — Native seat counterpart
- [per-model-prompt-framework.md](per-model-prompt-framework.md) — Prompt framing applied before CLI dispatch
