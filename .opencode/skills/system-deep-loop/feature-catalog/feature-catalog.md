---
title: "system-deep-loop: Feature Catalog"
description: "Current-state inventory for the system-deep-loop hub, covering its registry-driven deep-loop mode classification and the opt-in compiled-routing fast path that resolves ahead of it."
trigger_phrases:
  - "system-deep-loop feature catalog"
  - "system-deep-loop hub capabilities"
  - "deep-loop mode classification"
  - "system-deep-loop compiled routing"
last_updated: "2026-07-21"
version: 1.0.0.0
---

# system-deep-loop: Feature Catalog

This catalog inventories the live `system-deep-loop` hub surface. The hub classifies a request into one of seven `workflowMode` packets (`research`, `review`, `ai-council`, `alignment`, and the three improvement lanes) through a three-tier discriminator, holding no per-mode logic itself. An opt-in, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven classification without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `system-deep-loop` hub. The hub classifies intent and loads the resolved packet; the `/deep:*` commands and native agent types are complementary surfaces that reach the same packets through their own static routers.

---

## 2. DEEP-LOOP MODE ROUTING

### Registry-Driven Deep-Loop Mode Classification

#### Description

`mode-registry.json` is the single source of truth for the hub's seven `workflowMode` packets, each carrying a `workflowMode`/`runtimeLoopType`/`backendKind` three-tier discriminator.

#### Current Reality

`runtimeLoopType` is the graph-backed convergence key consumed by `runtime/scripts/convergence.cjs`, explicitly `null` for the three improvement lanes rather than inferred; `backendKind` splits `runtime-loop-type` (research/review/ai-council/alignment) from `improvement-host` (the three improvement lanes). A second-layer surface router at `shared/references/smart-routing.md` supports router-replay benchmarking without re-deciding the mode.

#### Source Files

See [`deep-loop-mode-classification/deep-loop-mode-classification.md`](deep-loop-mode-classification/deep-loop-mode-classification.md) for the full discriminator and source anchors.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

An opt-in, flag-gated, additive directive in `system-deep-loop`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the deep-loop mode classification above.

#### Current Reality

The directive is off by default: `SPECKIT_COMPILED_ROUTING` is unset in normal operation, so `system-deep-loop` continues to classify entirely through `mode-registry.json`. When the flag is force-enabled and `system-deep-loop`'s promoted activation manifest authorizes compiled serving, `node .opencode/bin/compiled-route.cjs --hub system-deep-loop --prompt "<task>"` returns the authoritative decision instead; any error or a `{"servingAuthority":"legacy"}` sentinel leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.
