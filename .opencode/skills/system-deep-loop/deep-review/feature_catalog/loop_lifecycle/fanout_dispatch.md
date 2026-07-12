---
title: "Fan-out loop dispatch"
description: "Opt-in fan-out dispatch layer in the review loop: step_resolve_artifact_root artifact-dir override branch, step_fanout_spawn (CLI pool + native sequential agent dispatch), and step_fanout_merge with strongest-restriction verdict binding at the top of phase_synthesis. Single-executor path unchanged."
trigger_phrases:
  - "fan-out loop dispatch"
  - "fanout dispatch"
  - "step_fanout_spawn"
  - "strongest-restriction verdict"
  - "multi-executor review"
version: 1.11.0.4
---

# Fan-out loop dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

When `config.fanout` is present, three new YAML steps activate in the review loop — the
same structural pattern as the research loop, with one additional review-specific binding.

**`step_resolve_artifact_root`** gains a `branch_on: config.fanout_lineage_artifact_dir`
branch. When the override is present (set by a lineage subprocess), `artifact_dir` is bound
directly. When absent (single-executor mode), the `if_absent` branch runs the byte-identical
original `resolveArtifactRoot` command — zero behavior change for single-executor runs.

**`step_fanout_spawn`** (`skip_when: config.fanout is absent`) spawns CLI lineages via
`fanout-run.cjs` (pool-capped headless subprocesses) and dispatches native lineages as
sequential `agent: deep-review` runs with per-lineage isolated artifact dirs. When complete,
control jumps directly to `phase_synthesis`, skipping `phase_init` and `phase_main_loop`.

**`step_fanout_merge`** (`skip_when: config.fanout is absent`) sits at the top of
`phase_synthesis`. It calls `fanout-merge.cjs --loop-type review` to produce a consolidated
`deep-review-findings-registry.json` using strongest-restriction: any active P0 across any
lineage → `mergedVerdict=FAIL`. The step includes `bind_from_output: {p0_count: active_p0,
p1_count: active_p1, p2_count: active_p2}` so `step_derive_verdict` uses the merged counts
from the consolidated registry — not an empty single-executor state log.

### Why This Matters

The `bind_from_output` binding is review-specific and critical: without it, `step_derive_verdict`
would read zero counts from the base artifact dir's empty state log, producing an incorrect
PASS verdict even when lineages found P0 issues. The strongest-restriction policy ensures a
P0 in ANY lineage reaches the final verdict.

---

## 2. HOW IT WORKS

Fully shipped in both `deep_review_auto.yaml` and `confirm.yaml`. Parity gate:
`if_absent` branch is byte-identical to the original command; `skip_when` guards ensure
zero behavioral change for single-executor mode. Full vitest suite (197/197) confirms no
single-executor regression. Command surface: `--executor` (repeatable), `--executors <json>`,
`--concurrency N`. Review fan-out verdict note: strongest-restriction means any lineage
active P0 → merged FAIL.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | `step_resolve_artifact_root` (if_present/if_absent), `step_fanout_spawn`, `step_fanout_merge` (with `bind_from_output` for p0/p1/p2 counts) |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | Same steps (confirm variant) |
| `.opencode/commands/deep/review.md` | `--executor`/`--executors`/`--concurrency` flag docs, strongest-restriction note, fan-out examples |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | CLI lineage pool driver called by `step_fanout_spawn_cli` |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Strongest-restriction merger called by `step_fanout_merge` |

### Validation

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Pool dispatch + lineage dir isolation |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Review strongest-restriction (5 tests) + attribution |

---

## 4. SOURCE METADATA

- Group: Loop Lifecycle
- Catalog source: `feature_catalog/loop_lifecycle/fanout_dispatch.md`
- Primary source files: `deep_review_auto.yaml`, `review.md`
Related references:
- [executor-selection-contract.md](../loop_lifecycle/executor_selection_contract.md) — Executor Selection Contract
