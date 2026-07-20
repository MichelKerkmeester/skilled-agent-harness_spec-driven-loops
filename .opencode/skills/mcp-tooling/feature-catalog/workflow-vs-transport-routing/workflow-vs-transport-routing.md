---
title: "Workflow-Vs-Transport Two-Axis Routing"
description: "How the mcp-tooling hub scores and dispatches six MCP-bridge packets across a workspace-mutating workflow axis and a non-mutating transport axis."
trigger_phrases:
  - "workflow vs transport two-axis routing"
  - "mcp-tooling hub-router scoring"
  - "mode-registry.json six modes"
  - "mcp-tooling smart routing"
version: 1.0.0.0
---

# Workflow-Vs-Transport Two-Axis Routing (mcp-tooling)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`mcp-tooling` is registry-driven: `mode-registry.json` lists all six packets (three workflow, three transport) in one `modes[]` array, and `hub-router.json` decides whether a request resolves to a single mode, an ordered bundle, or a deferred disambiguation.

The hub's discriminator is `packetKind`, which separates packets that mutate this repository's workspace from packets that only bridge to an external tool.

---

## 2. HOW IT WORKS

### Two-Axis Model

`packetKind: "workflow"` covers `mcp-chrome-devtools`, `mcp-click-up`, and `mcp-aside-devtools`, all of which mutate this repository's workspace (`mutatesWorkspace: true`). `packetKind: "transport"` covers `mcp-figma` (Figma Desktop), `mcp-refero`, and `mcp-mobbin` (both Code-Mode-mediated remote MCP surfaces), none of which mutate this workspace (`mutatesWorkspace: false`); each transport packet is declared on a `transport-axis` extension carrying a mandatory cross-hub judgment pairing back to `sk-design`, since a transport moves or fetches artifacts but never supplies design judgment itself.

### Routing Rule

Resolution reads `hub-router.json`, scores `routerSignals` and `vocabularyClasses`, applies `routerPolicy.tieBreak` (workflow modes score before transport), then reads `mode-registry.json` for each candidate's `packetKind`, `backendKind`, `toolSurface`, and `advisorRouting` before loading the selected packet(s). A scored route loads exactly the selected mode's declared resources; `routerPolicy.defaultResource` is fallback-only — consulted solely in the zero-signal branch as a defer-time suggestion, never unioned into a scored route's resource set.

### Outcomes

The router resolves to `single` (one dominant tool signal), an `orderedBundle` (multiple explicit signals in tie-break order), or a `defer` (disambiguation) when no signal dominates.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/mcp-tooling/SKILL.md` | Shared | States the two-axis model, routing rule, and outcome set. |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Shared | Declarative registry for all six packets, including `packetKind` and `mutatesWorkspace`. |
| `.opencode/skills/mcp-tooling/hub-router.json` | Shared | Router signals, vocabulary classes, and tie-break policy. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the transport-axis cross-hub judgment-pairing requirement. |

---

## 4. SOURCE METADATA

- Group: Workflow-Vs-Transport Two-Axis Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow-vs-transport-routing/workflow-vs-transport-routing.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven routing when enabled.
