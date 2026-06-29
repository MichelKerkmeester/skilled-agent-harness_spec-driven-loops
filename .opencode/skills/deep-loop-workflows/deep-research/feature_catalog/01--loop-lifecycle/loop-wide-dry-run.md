---
title: "Loop-wide dry-run"
description: "Adds `--dry-run` preflight behavior that performs safe reads and halts at mutation boundaries."
trigger_phrases:
  - "loop-wide dry-run"
  - "--dry-run deep research"
  - "dry_run_halt"
  - "dry-run mutation boundary"
  - "confirm dry-run preview"
version: 1.14.0.13
---

# Loop-wide dry-run

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Adds `--dry-run` preflight behavior that performs safe reads and halts at mutation boundaries.

Dry-run is a flag on the confirm flow, not a third execution mode. It lets operators inspect setup, focus selection, prompt rendering, and convergence reads without dispatching executors or writing packet state.

---

## 2. HOW IT WORKS

`/deep:research` normalizes `--dry-run` into a boolean workflow input. When enabled, the confirm YAML keeps non-mutating setup and read work live, then emits terminal JSONL preview events instead of appending to the state log or touching persistent artifacts.

The dry-run control layer defines halt hooks for dispatch, state mutation, reducer refresh, and child-spawn boundaries. Each halted boundary emits a `dry_run_halt` event with the boundary label and step name, then stops before executor dispatch, reducer refresh, state or queue mutation, child-lineage spawn, or memory writes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/research.md` | Command | Documents `--dry-run` as a first-class flag and describes preflight semantics. |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Workflow | Defines dry-run halt hooks and terminal preview event policies. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/01--entry-points-and-modes/loop-wide-dry-run.md` | Manual playbook | Verifies dry-run reads, previews, and mutation-boundary halts. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/loop-wide-dry-run.md`
Related references:
- [iteration-dispatch.md](iteration-dispatch.md) - Iteration dispatch
- [fanout-dispatch.md](fanout-dispatch.md) - Fan-out loop dispatch
