---
title: "Fan-out loop dispatch"
description: "Opt-in fan-out dispatch layer: `step_resolve_artifact_root` artifact-dir override branch, `step_fanout_spawn` (CLI pool + native sequential agent dispatch), and `step_fanout_merge` at the top of `phase_synthesis`. Single-executor path is byte-identical to pre-change behavior."
trigger_phrases:
  - "fan-out loop dispatch"
  - "fanout dispatch"
  - "step_fanout_spawn"
  - "parallel lineage execution"
  - "multi-executor research"
version: 1.14.8.0
---

# Fan-out loop dispatch

---

## 1. OVERVIEW

When `config.fanout` is present, three new YAML steps activate in the research loop.

**`step_resolve_artifact_root`** gains a `branch_on: config.fanout_lineage_artifact_dir`
branch. When the override is present (set by a lineage subprocess), `artifact_dir` is bound
directly. When absent (single-executor mode), the `if_absent` branch runs the byte-identical
original `resolveArtifactRoot` command — zero behavior change for single-executor runs.

**`step_fanout_spawn`** (`skip_when: config.fanout is absent`) spawns CLI lineages via
`fanout-run.cjs` (pool-capped headless subprocesses) and dispatches native lineages as
sequential `agent: deep-research` runs with per-lineage isolated artifact dirs. Its first
sub-step, `step_fanout_root_config`, writes the root config from `step_create_config`'s
template and the fan-out matrix before any lineage spawns. When
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

Fully shipped in `deep-research.yaml` for both execution modes. Parity
gate: `if_absent` branch is byte-identical to the original command; `skip_when` guards
ensure zero behavioral change for single-executor mode. Full vitest suite (197/197) confirms
no single-executor regression. Command surface: `--executor` (repeatable, with
`--model/--count/--label/--iters`), `--executors <json>` escape hatch, `--concurrency N`.
Default policy: 0–1 executor, or an `--executors` matrix that expands to exactly one lineage →
`config.executor`; 2+ executors, an `--executors` matrix that expands to two or more lineages,
or `count>1` → `config.fanout`. A direct runner call whose matrix expands to one research or review lineage is refused unless `--only-lineage` names its label,
and the refusal message names the single-executor workflow. `--only-lineage LABEL`, space-separated and not `=`, reruns
one lineage of the unedited matrix, without packet init, synthesis or save. A lineage whose config is `complete` and whose
artifacts pass the completion check is skipped before spawn and recorded as `skipped_complete`, under `--only-lineage`
too, so a forced rerun needs that lineage's `lineages/<label>/` folder archived first. A lineage that recorded a
terminal stop row is skipped only when that row also passes the post-attempt stop-reason and cap checks. A finished
lineage whose recorded topic or executor differs from this run's refuses the whole run before spawn (exit 3), with a
message naming `--restart`, so old and new lineages are never merged together.
The runner's stdout summary and `orchestration-summary.json` list each lineage as
`{label, status, failure_class, exit_code, rerun_command}`; only a failed lineage gets a
`rerun_command`, the run's own argv with `--only-lineage LABEL`, to run from the original
working directory. A failed lineage whose config is `complete` gets a null `rerun_command` and a
`rerun_note` that says to archive its folder first.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | `step_resolve_artifact_root` (if_present/if_absent branches), `step_fanout_spawn`, `step_fanout_merge` |
| `.skilled/commands/deep/research.md` | `--executor`/`--executors`/`--concurrency` flag docs, default policy, fan-out examples |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | CLI lineage pool driver called by `step_fanout_spawn_cli` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Cross-lineage merger called by `step_fanout_merge` |

### Validation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Pool dispatch + lineage dir isolation |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Research registry dedup + attribution |

---

## 4. SOURCE METADATA

- Group: Loop Lifecycle
- Catalog source: `feature-catalog/loop-lifecycle/fanout-dispatch.md`
- Primary source files: `deep-research.yaml`, `research.md`
Related references:
- [resource-map-emission.md](../../feature-catalog/loop-lifecycle/resource-map-emission.md) — Resource Map Emission
