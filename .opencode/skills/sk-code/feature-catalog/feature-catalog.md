---
title: "sk-code: Feature Catalog"
description: "Current-state inventory for the sk-code hub, covering its two-axis workflow/surface registry-driven routing and the default-on compiled-routing fast path that resolves ahead of it."
trigger_phrases:
  - "sk-code feature catalog"
  - "sk-code hub capabilities"
  - "two-axis registry routing"
  - "sk-code compiled routing"
last_updated: "2026-07-21"
version: 1.0.0.0
---

# sk-code: Feature Catalog

This catalog inventories the live `sk-code` hub surface. The skill advisor routes any code-related prompt to the single identity `sk-code`; the hub resolves a WORKFLOW mode (`quality`, `code-review`) and bundles zero-or-more read-only SURFACE evidence packets (`code-webflow`, `code-opencode`) declaratively from `mode-registry.json`. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `sk-code` hub. The hub does not implement or debug code itself — it is a declarative router that hands the resolved workflow mode (plus bundled surface evidence) to the correct nested packet.

---

## 2. TWO-AXIS MODE ROUTING

### Two-Axis Registry-Driven Routing

#### Description

`mode-registry.json` is the single source of truth for dispatching a resolved WORKFLOW mode plus zero-or-more read-only SURFACE evidence packets, discriminated by `workflowMode`, `packetKind`, and `backendKind`.

#### Current Reality

`quality` and `code-review` are WORKFLOW modes that act; `code-webflow` and `code-opencode` are advisor-invisible SURFACE packets bundled alongside a workflow mode via `routerPolicy.outcomes.surfaceBundle`, workflow mode ordered first. The hub carries no root `references/<key>/` resource router — resource slicing lives inside the nested packets.

#### Source Files

See [`two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`](two-axis-registry-driven-routing/two-axis-registry-driven-routing.md) for the discriminator, bundling rule, and source anchors.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

A default-on, flag-gated, additive directive in `sk-code`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the two-axis registry-driven routing above.

#### Current Reality

The directive is on by default for `sk-code`, one of the seven activated hubs: with `SPECKIT_COMPILED_ROUTING` unset, `node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "<task>"` returns the authoritative decision and the hub follows it directly. Setting `SPECKIT_COMPILED_ROUTING=0` is the explicit kill-switch that forces legacy `mode-registry.json` routing; any error or a `{"servingAuthority":"legacy"}` sentinel also leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.
