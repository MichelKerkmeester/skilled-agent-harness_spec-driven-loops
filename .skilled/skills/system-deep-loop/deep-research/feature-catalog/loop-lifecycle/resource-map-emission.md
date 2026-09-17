---
title: "Resource Map Emission"
description: "Emits a convergence-time resource-map.md from research delta evidence with a clean opt-out path."
trigger_phrases:
  - "resource map emission"
  - "emit resource map"
  - "resource-map.md"
  - "coverage ledger"
  - "delta evidence opt-out"
version: 1.14.0.7
---

# Resource Map Emission

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Emits a convergence-time `resource-map.md` from research delta evidence with a clean opt-out path.

This feature gives the research loop a compact coverage ledger beside `research.md`. Synthesis turns citation evidence from converged delta files into a template-shaped `resource-map.md`, grouped by category and annotated with per-file citation counts.

---

## 2. HOW IT WORKS

The live contract is workflow-owned. Research iterations keep using the reducer for registry, dashboard, and strategy refreshes, while synthesis triggers one explicit `--emit-resource-map` reducer pass that reads converged delta files and writes `{artifact_dir}/resource-map.md`.

The emitter is enabled by default through `config.resource_map.emit = true`. Operators can disable the write for a run with `--no-resource-map`, and the reducer will skip cleanly without mutating or partially creating the output file.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs` | Shared script | Normalizes research evidence and renders the ten-category resource map. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer | Adds the `--emit-resource-map` path and honors `config.resource_map.emit`. |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Workflow | Triggers emission during synthesis before final `research.md` compilation. |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Workflow | Mirrors the same synthesis-time emission path in confirm mode. |
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Reference | Documents the convergence-to-synthesis emission step and operator opt-out. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/tests/resource-map-extractor.vitest.ts` | Vitest | Covers research-shape normalization, category classification, and deterministic output. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md` | Manual playbook | Verifies synthesis emits the research resource map and that opt-out skips cleanly. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/resource-map-emission.md`
- Primary sources: `.skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs`, `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, `.skilled/commands/deep/assets/deep-research-auto.yaml`, `.skilled/commands/deep/assets/deep-research-confirm.yaml`
Related references:
- [memory-save.md](../../feature-catalog/loop-lifecycle/memory-save.md) — Memory save
- [fanout-dispatch.md](../../feature-catalog/loop-lifecycle/fanout-dispatch.md) — Fan-out loop dispatch
