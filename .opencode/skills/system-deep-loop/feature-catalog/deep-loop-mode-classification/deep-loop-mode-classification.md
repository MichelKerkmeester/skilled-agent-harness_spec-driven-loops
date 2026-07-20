---
title: "Registry-Driven Deep-Loop Mode Classification"
description: "How the system-deep-loop hub classifies a request into one of seven workflowMode packets via a three-tier discriminator, without holding any per-mode logic itself."
trigger_phrases:
  - "registry-driven deep-loop mode classification"
  - "system-deep-loop three-tier discriminator"
  - "workflowMode runtimeLoopType backendKind"
  - "system-deep-loop smart routing"
version: 1.0.0.0
---

# Registry-Driven Deep-Loop Mode Classification (system-deep-loop)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`system-deep-loop` is a registry-driven, invokable hub. `mode-registry.json` is the single source of truth for its seven `workflowMode` packets; the hub classifies a request, resolves the mode through the registry, and loads `registry[mode].packet` without re-deriving the mapping or holding per-mode logic itself.

The `/deep:*` commands and native agent types are complementary surfaces that reach the same packets through their own static routers or agent definitions — they do not bypass or duplicate the registry.

---

## 2. HOW IT WORKS

### Three-Tier Discriminator

Every packet carries `workflowMode` (the public mode key: `research`, `review`, `ai-council`, `alignment`, and the three improvement lanes `agent-improvement`, `model-benchmark`, `skill-benchmark`), `runtimeLoopType` (the graph-backed convergence key consumed by `runtime/scripts/convergence.cjs`, validated against active `research`/`review`/`council`, and explicitly `null` for all three improvement lanes rather than inferred from `workflowMode` — `ai-council` maps to `runtimeLoopType: council`, `alignment` maps to `runtimeLoopType: review`), and `backendKind` (`runtime-loop-type` for research/review/ai-council/alignment, `improvement-host` for the three improvement lanes, run via `deep-improvement/scripts/shared/loop-host.cjs --mode`).

### Intent Classification, Not Keyed Resource Discovery

The advisor routes any deep-loop query to the single identity `system-deep-loop`; the hub then classifies intent to a `workflowMode` (a mode hint like `"research: ..."` overrides), guards `mode-registry.json`, and loads the resolved packet. It omits `discover_markdown_resources` and never selects hub-level `references/<key>/` or `assets/<key>/` resources by runtime key. A second-layer surface router at `shared/references/smart-routing.md` (mirroring the equivalent surfaces in `sk-prompt` and `sk-code`) maps a resolved mode's intent to packet-qualified child leaves for router-replay benchmarking; it never re-decides the mode and is not itself a runtime discovery surface.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/SKILL.md` | Shared | States the registry-driven classification contract and the three-tier discriminator. |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Shared | Declarative registry for all seven `workflowMode` packets. |
| `.opencode/skills/system-deep-loop/shared/references/smart-routing.md` | Shared | Second-layer intent-to-leaf mapping consumed by router-replay benchmarking. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the tool-surface-union invariant this hub's broad `allowed-tools` grant satisfies. |

---

## 4. SOURCE METADATA

- Group: Registry-Driven Deep-Loop Mode Classification
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `deep-loop-mode-classification/deep-loop-mode-classification.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven classification when enabled.
