---
title: "Depth mode flag (--depth-mode)"
description: "The --depth-mode flag on /deep:research and /deep:review selects default or expansive depth, and leaves the registry-driven workflowMode, runtimeLoopType and backendKind classification unchanged."
trigger_phrases:
  - "--depth-mode"
  - "depth mode flag"
  - "expansive depth flag"
  - "deep loop depth mode"
version: 1.0.2.0
---

# Depth mode flag (--depth-mode)

## 1. OVERVIEW

`--depth-mode` is a command-level option on `/deep:research` and `/deep:review`. It takes `default` or `expansive`. The flag is not part of `mode-registry.json`, so the hub classifies a request into the same workflow mode with or without it. The behavior the flag turns on lives in the research and review packets.

---

## 2. HOW IT WORKS

### Hub Classification Unchanged

`mode-registry.json` carries the `workflowMode`, `runtimeLoopType` and `backendKind` discriminator for `research` and `review`, and it has no depth field. Routing resolves the same packet whether the flag is present or not.

### Flag Routing

The command workflow reads `--depth-mode` and binds it as `depth_mode`. The runtime acts only on the value `expansive`. `runtime/scripts/convergence.cjs` adds `depthMode` to its stop-decision config only when the value is `expansive`, and `runtime/scripts/fanout-run.cjs` passes `depthMode` to fan-out lineages only when the value is `expansive`. A default run carries no depth key in either place.

### Packet Behavior

The expansive behavior is documented in the packet catalogs: [expansive depth mode for research](../../deep-research/feature-catalog/convergence/expansive-depth-mode.md) and [expansive depth mode for review](../../deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/mode-registry.json` | Registry | Holds the discriminator for `research` and `review`, with no depth field. |
| `.skilled/commands/deep/research.md` | Command doc | The `--depth-mode` flag row for research. |
| `.skilled/commands/deep/review.md` | Command doc | The `--depth-mode` flag row for review. |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Script | Adds `depthMode` to the stop-decision config only when expansive. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | Passes `depthMode` to lineages only when expansive. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | Manual playbook | DR-068: the flag defaults to `default` and a default run matches the baseline. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | Manual playbook | DRV-076: the review flag defaults to `default` and a default run matches the baseline. |

---

## 4. SOURCE METADATA

- Group: Deep-loop mode classification
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `deep-loop-mode-classification/depth-mode-flag.md`

Related references:
- [deep-loop-mode-classification.md](deep-loop-mode-classification.md) - Registry-driven mode classification
