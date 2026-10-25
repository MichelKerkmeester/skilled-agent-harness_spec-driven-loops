---
title: "Fan-out loop dispatch"
description: "Opt-in fan-out dispatch layer: `step_resolve_artifact_root` artifact-dir override branch, `step_fanout_spawn` (CLI pool + native sequential agent dispatch), and `step_fanout_merge` with strongest-restriction verdict binding at the top of `phase_synthesis`. Single-executor path is byte-identical to pre-change behavior."
trigger_phrases:
  - "fan-out loop dispatch"
  - "fanout dispatch"
  - "step_fanout_spawn"
  - "strongest-restriction verdict"
  - "multi-executor review"
version: 1.11.1.0
---

# Fan-out loop dispatch

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

Fully shipped in both `deep-review-auto.yaml` and `confirm.yaml`. Parity gate:
`if_absent` branch is byte-identical to the original command; `skip_when` guards ensure
zero behavioral change for single-executor mode. Full vitest suite (197/197) confirms no
single-executor regression. Command surface: `--executor` (repeatable), `--executors <json>`,
`--concurrency N`. Review fan-out verdict note: strongest-restriction means any lineage
active P0 → merged FAIL.

An optional `--review-focus "TEXT"` (or a pre-bound `review_focus` answer) carries the
operator's focus to every lineage. `step_fanout_spawn_cli` passes it to `fanout-run.cjs`,
which collapses control characters to spaces, bounds it at 1000 characters and adds a
`review_focus:` line to each lineage's setup bindings. A native lineage also receives it
as a `--review-focus` flag and a pre-bound answer. Each lineage then stores it as
`reviewFocus` in its config, and the render step adds it under the dimensions of every
iteration prompt. Without a focus, the lineage prompts are byte-identical to the earlier
ones, and the iteration prompt differs only by one empty line under the dimensions.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | `step_resolve_artifact_root` (if_present/if_absent), `step_fanout_spawn`, `step_fanout_merge` (with `bind_from_output` for p0/p1/p2 counts) |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Same steps (confirm variant) |
| `.skilled/commands/deep/review.md` | `--executor`/`--executors`/`--concurrency` flag docs, strongest-restriction note, fan-out examples |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | CLI lineage pool driver called by `step_fanout_spawn_cli` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Strongest-restriction merger called by `step_fanout_merge` |

### Validation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Pool dispatch + lineage dir isolation |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Review strongest-restriction (5 tests) + attribution |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | Review focus in each lineage's setup bindings, native command input and rendered iteration prompt, plus the unchanged no-focus prompt |

---

## 4. SOURCE METADATA

- Group: Loop Lifecycle
- Catalog source: `feature-catalog/loop-lifecycle/fanout-dispatch.md`
- Primary source files: `deep-review-auto.yaml`, `review.md`
Related references:
- [executor-selection-contract.md](../../feature-catalog/loop-lifecycle/executor-selection-contract.md) — Executor Selection Contract
