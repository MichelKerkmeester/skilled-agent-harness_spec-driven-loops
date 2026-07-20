---
title: "mcp-tooling: Feature Catalog"
description: "Current-state inventory for the mcp-tooling hub, covering its workflow-vs-transport two-axis registry routing and the opt-in compiled-routing fast path that resolves ahead of it."
trigger_phrases:
  - "mcp-tooling feature catalog"
  - "mcp-tooling hub capabilities"
  - "workflow vs transport routing"
  - "mcp-tooling compiled routing"
last_updated: "2026-07-21"
version: 1.0.0.0
---

# mcp-tooling: Feature Catalog

This catalog inventories the live `mcp-tooling` hub surface. The hub scores and dispatches six MCP-bridge packets across a workspace-mutating workflow axis (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`) and a non-mutating transport axis (`mcp-figma`, `mcp-refero`, `mcp-mobbin`). An opt-in, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `mcp-tooling` hub. The hub does not itself call any external tool — it scores intent, resolves one of its six packets (or an ordered bundle), and hands off to the resolved packet.

---

## 2. WORKFLOW-VS-TRANSPORT ROUTING

### Workflow-Vs-Transport Two-Axis Routing

#### Description

`mode-registry.json` and `hub-router.json` jointly resolve a request to a single mode, an ordered bundle, or a deferred disambiguation across the hub's six packets.

#### Current Reality

Workflow packets mutate this repository's workspace; transport packets bridge to an external tool and never mutate this workspace, with each transport packet carrying a mandatory cross-hub judgment pairing to `sk-design`. `routerPolicy.tieBreak` scores workflow packets before transport packets when both signal.

#### Source Files

See [`workflow-vs-transport-routing/workflow-vs-transport-routing.md`](workflow-vs-transport-routing/workflow-vs-transport-routing.md) for the two-axis model, routing rule, and outcome set.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

An opt-in, flag-gated, additive directive in `mcp-tooling`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the workflow-vs-transport routing above.

#### Current Reality

The directive is off by default: `SPECKIT_COMPILED_ROUTING` is unset in normal operation, so `mcp-tooling` continues to route entirely through `hub-router.json`/`mode-registry.json`. When the flag is force-enabled and `mcp-tooling`'s promoted activation manifest authorizes compiled serving, `node .opencode/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"` returns the authoritative decision instead; any error or a `{"servingAuthority":"legacy"}` sentinel leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.
