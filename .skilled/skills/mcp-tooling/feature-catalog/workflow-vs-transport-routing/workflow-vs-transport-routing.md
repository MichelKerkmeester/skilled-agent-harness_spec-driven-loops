---
title: "Workflow-Vs-Transport Two-Axis Routing"
description: "How the mcp-tooling hub scores and dispatches ten MCP-bridge packets across six workflow modes and four read-only transports."
trigger_phrases:
  - "workflow vs transport two-axis routing"
  - "mcp-tooling hub-router scoring"
  - "mode-registry.json ten modes"
  - "mcp-tooling smart routing"
version: 1.1.0.0
---

# Workflow-Vs-Transport Two-Axis Routing (mcp-tooling)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`mcp-tooling` is registry-driven: `mode-registry.json` lists ten packets in one `modes[]` array, and `hub-router.json` decides whether a request resolves to a single mode, an ordered bundle, or deferred disambiguation.

The hub's discriminator is `packetKind`, which separates workflow packets that may change local or external workflow state from transports that only bridge an external design surface.

---

## 2. HOW IT WORKS

### Two-Axis Model

`packetKind: "workflow"` covers `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`, and `mcp-orca-cli`. Orca is a workflow member because worktrees, repositories, terminals, agent handoffs, automations, browser interactions, and publishing can change state. `packetKind: "transport"` covers `mcp-figma`, `mcp-refero`, `mcp-mobbin`, and `mcp-magicpath`; all remain `mutatesWorkspace: false` in this workspace.

Figma, Refero, and Mobbin use `sk-design-md-generator` when measured reference extraction is required. MagicPath theme evidence already carries named variables and fonts and therefore pairs with `sk-design` for design judgment. A transport never supplies the design verdict itself.

### Routing Rule

Resolution reads `hub-router.json`, scores `routerSignals` and `vocabularyClasses`, applies `routerPolicy.tieBreak`, then reads `mode-registry.json` for each candidate's packet and safety metadata before loading the selected packet(s). A scored route loads exactly the selected mode's declared resources; `routerPolicy.defaultResource` is fallback-only and is not unioned into a scored route.

### Outcomes

The router resolves to `single` for one dominant signal, `orderedBundle` for multiple explicit near-tied signals, or `defer` when no signal identifies a mode. A bare `orca` mention is intentionally not enough to select `mcp-orca-cli` because unrelated OpenOrca model traffic must remain outside the hub.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-tooling/SKILL.md` | Shared | States the two-axis model and packet boundaries. |
| `.skilled/skills/mcp-tooling/mode-registry.json` | Shared | Declarative registry for all ten packets. |
| `.skilled/skills/mcp-tooling/hub-router.json` | Shared | Router signals, vocabulary classes, and tie-break policy. |
| `.skilled/skills/mcp-tooling/ROUTER.md` | Shared | Stage-two leaf resource map. |

### Validation and tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance and registry/router consistency. |
| `.skilled/skills/mcp-tooling/manual-testing-playbook/` | Manual gold | Positive, negative, ambiguous, and holdout routing scenarios. |

---

## 4. SOURCE METADATA

- Group: Workflow-Vs-Transport Two-Axis Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow-vs-transport-routing/workflow-vs-transport-routing.md`
