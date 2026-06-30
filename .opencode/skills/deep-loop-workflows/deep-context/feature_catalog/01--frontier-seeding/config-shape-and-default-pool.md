---
title: "Config Shape and Default Pool"
description: "Defines the immutable loop contract, convergence thresholds, and the default heterogeneous executor pool written to deep-context-config.json during initialization."
trigger_phrases:
  - "config shape"
  - "default executor pool"
  - "deep context config"
  - "deep_context_config.json"
  - "by-model shared scope pool"
  - "executor pool configuration"
version: 1.2.0.3
---

# Config Shape and Default Pool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Defines the immutable loop contract, convergence thresholds, and the default heterogeneous executor pool written to `deep-context-config.json` during initialization.

The config is the single source of truth for every tunable parameter in a context session. It is written once at initialization from the `deep_context_config.json` template with all resolved setup values, then treated as read-only for the remainder of the loop. The `config.status` field transitions from `"initialized"` to `"complete"` only at the end of synthesis.

---

## 2. HOW IT WORKS

### Config Fields

`step_create_config` populates the following fields from the resolved setup phase:

| Field | Default | Description |
|---|---|---|
| `scope` | — | Target feature/area (required) |
| `specFolder` | — | Spec folder path (required) |
| `loopType` | `"context"` | Fixed to `"context"` for this loop |
| `executionMode` | `"auto"` or `"interactive"` | From mode suffix |
| `maxIterations` | `8` | Maximum parallel sweep iterations |
| `convergenceThreshold` | `0.10` | Per-iteration new agreement-eligible findings floor |
| `relevanceGate` | `0.55` | Minimum per-finding relevance to survive the gate |
| `agreementMin` | `2` | Minimum distinct executors for agreement-eligible status |
| `fanout.mode` | `"by-model-shared-scope"` | Fixed; every seat sweeps the same focus |
| `fanout.concurrency` | `4` | CLI pool concurrency cap |
| `fanout.executors` | default pool | Executor pool array |

### Default Pool

When no `--executor` / `--executors` flags or marker are present, the default heterogeneous pool is used: 2 native `@deep-context` Task seats + 1 MiMo-v2.5-pro seat (`cli-opencode`) + 1 gpt seat (`cli-opencode`) + 1 deepseek-v4-pro seat (`cli-opencode`). All seats sweep the same focus and agreement is the confidence signal. A single-seat pool is legal but yields no agreement signal; the command warns and continues.

### Pool Precedence

CLI flags and `--executors` JSON take precedence over the `PRE-BOUND SETUP ANSWERS:` marker block, which takes precedence over the config file default. The pool is always written to `config.fanout.executors` with `config.fanout.mode = "by-model-shared-scope"`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` | Asset | Default config template shape with all fields and their defaults |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_create_config` — populates template fields from resolved setup values |
| `.opencode/commands/deep/context.md` | Command | Default Resolution Table (§0) defining each field, its resolution source, and its default value |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/01--frontier-seeding/config-shape-and-default-pool.md` | Manual playbook | Verifies config fields, pool resolution, and read-only invariant after initialization |

---

## 4. SOURCE METADATA

- Group: Frontier Seeding
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--frontier-seeding/config-shape-and-default-pool.md`

Related references:
- [frontier-initialization.md](frontier-initialization.md) — Initialization step that calls step_create_config
- [heterogeneous-pool-dispatch.md](../02--by-model-parallel-sweep/heterogeneous-pool-dispatch.md) — Parallel sweep that reads config.fanout.executors
