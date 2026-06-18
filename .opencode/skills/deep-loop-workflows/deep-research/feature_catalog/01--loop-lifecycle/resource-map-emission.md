---
title: "Resource Map Emission"
description: "Emits a convergence-time resource-map.md from research delta evidence with a clean opt-out path."
trigger_phrases:
  - "resource map emission"
  - "emit resource map"
  - "resource-map.md"
  - "coverage ledger"
  - "delta evidence opt-out"
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
| `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Shared script | Normalizes research evidence and renders the ten-category resource map. |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reducer | Adds the `--emit-resource-map` path and honors `config.resource_map.emit`. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Triggers emission during synthesis before final `research.md` compilation. |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Workflow | Mirrors the same synthesis-time emission path in confirm mode. |
| `.opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md` | Reference | Documents the convergence-to-synthesis emission step and operator opt-out. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | Vitest | Covers research-shape normalization, category classification, and deterministic output. |
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/027-resource-map-emission.md` | Manual playbook | Verifies synthesis emits the research resource map and that opt-out skips cleanly. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/resource-map-emission.md`
- Primary sources: `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs`, `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`, `.opencode/commands/deep/assets/deep_research_auto.yaml`, `.opencode/commands/deep/assets/deep_research_confirm.yaml`
Related references:
- [memory-save.md](memory-save.md) — Memory save
- [fanout-dispatch.md](fanout-dispatch.md) — Fan-out loop dispatch
