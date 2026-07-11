---
title: "Fan-out loop dispatch"
description: "Opt-in fan-out dispatch layer in the research loop: step_resolve_artifact_root artifact-dir override branch, step_fanout_spawn (CLI pool + native sequential agent dispatch), and step_fanout_merge at the top of phase_synthesis. Single-executor path unchanged."
trigger_phrases:
  - "fan-out loop dispatch"
  - "fanout dispatch"
  - "step_fanout_spawn"
  - "parallel lineage execution"
  - "multi-executor research"
version: 1.14.0.4
---

# Fan-out loop dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

When `config.fanout` is present, three new YAML steps activate in the research loop.

**`step_resolve_artifact_root`** gains a `branch_on: config.fanout_lineage_artifact_dir`
branch. When the override is present (set by a lineage subprocess), `artifact_dir` is bound
directly. When absent (single-executor mode), the `if_absent` branch runs the byte-identical
original `resolveArtifactRoot` command — zero behavior change for single-executor runs.

**`step_fanout_spawn`** (`skip_when: config.fanout is absent`) spawns CLI lineages via
`fanout-run.cjs` (pool-capped headless subprocesses) and dispatches native lineages as
sequential `agent: deep-research` runs with per-lineage isolated artifact dirs. When
complete, control jumps directly to `phase_synthesis`, skipping `phase_init` and
`phase_main_loop`.

**`step_fanout_merge`** (`skip_when: config.fanout is absent`) sits at the top of
`phase_synthesis`. It calls `fanout-merge.cjs --loop-type research` to produce a
consolidated `deep-research-findings-registry.json` from all lineage registries before the
existing `step_compile_research` runs.

### Why This Matters

These three YAML steps are the sole integration point between the research loop and the
fan-out runtime primitives. If any drift or lose their `skip_when` guard, single-executor
behavior breaks or lineage isolation fails.

---

## 2. HOW IT WORKS

Fully shipped in both `deep_research_auto.yaml` and `confirm.yaml`. Parity
gate: `if_absent` branch is byte-identical to the original command; `skip_when` guards
ensure zero behavioral change for single-executor mode. Full vitest suite (197/197) confirms
no single-executor regression. Command surface: `--executor` (repeatable, with
`--model/--count/--label/--iters`), `--executors <json>` escape hatch, `--concurrency N`.
Default policy: 0–1 executor → `config.executor`; 2+ / `--executors` / `count>1` →
`config.fanout`.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | `step_resolve_artifact_root` (if_present/if_absent branches), `step_fanout_spawn`, `step_fanout_merge` |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Same steps (confirm variant) |
| `.opencode/commands/deep/research.md` | `--executor`/`--executors`/`--concurrency` flag docs, default policy, fan-out examples |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | CLI lineage pool driver called by `step_fanout_spawn_cli` |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Cross-lineage merger called by `step_fanout_merge` |

### Validation

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Pool dispatch + lineage dir isolation |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Research registry dedup + attribution |

---

## 4. SOURCE METADATA

- Group: Loop Lifecycle
- Catalog source: `feature_catalog/loop-lifecycle/fanout-dispatch.md`
- Primary source files: `deep_research_auto.yaml`, `research.md`
Related references:
- [resource-map-emission.md](resource-map-emission.md) — Resource Map Emission
