---
title: "Completed-run extension flags (--extend, --extend-minutes)"
description: "The --extend=N and --extend-minutes=M flags on /deep:research and /deep:review reopen a completed single-executor run in place, and leave the registry-driven workflowMode, runtimeLoopType and backendKind classification unchanged."
trigger_phrases:
  - "--extend"
  - "--extend-minutes"
  - "completed run extension flag"
  - "extend a completed deep loop run"
version: 1.0.0.0
---

# Completed-run extension flags (--extend, --extend-minutes)

## 1. OVERVIEW

`--extend=N` and `--extend-minutes=M` are command-level options on `/deep:research` and `/deep:review`. They reopen a completed run in place. The flags are not part of `mode-registry.json`, so the hub classifies a request into the same workflow mode with or without them. The extension behavior lives in the research and review packets.

---

## 2. HOW IT WORKS

### Hub Classification Unchanged

`mode-registry.json` carries the `workflowMode`, `runtimeLoopType` and `backendKind` discriminator for `research` and `review`, and it has no extension field. Routing resolves the same packet whether the flags are present or not.

### Flag Routing

The command workflow binds `--extend=N` as `extend` with lineage mode `completed-continue`, and `--extend-minutes=M` as `extend_minutes`. Both take positive integers, and `--extend-minutes` is valid only with `--extend`. The extension step sets `maxIterations` to the iterations run so far plus N and keeps the session and generation. A config with fan-out executors is refused before any lineage spawns.

### Packet Behavior

The extension behavior is documented in the packet catalogs: [completed-run extension for research](../../deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md) and [completed-run extension for review](../../deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/mode-registry.json` | Registry | Holds the discriminator for `research` and `review`, with no extension field. |
| `.skilled/commands/deep/research.md` | Command doc | The `--extend` and `--extend-minutes` flag rows for research. |
| `.skilled/commands/deep/review.md` | Command doc | The `--extend` and `--extend-minutes` flag rows for review. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow | `step_reject_extend_with_fanout` and `step_extend_completed_run` for research. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Workflow | `step_reject_extend_with_fanout` and `step_extend_completed_run` for review. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | Manual playbook | DR-065: `--extend=N` on a completed research run. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | Manual playbook | DRV-070: `--extend=N` on a completed review run. |

---

## 4. SOURCE METADATA

- Group: Deep-loop mode classification
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `deep-loop-mode-classification/completed-run-extension-flag.md`

Related references:
- [deep-loop-mode-classification.md](deep-loop-mode-classification.md) - Registry-driven mode classification
- [depth-mode-flag.md](depth-mode-flag.md) - Depth mode flag
