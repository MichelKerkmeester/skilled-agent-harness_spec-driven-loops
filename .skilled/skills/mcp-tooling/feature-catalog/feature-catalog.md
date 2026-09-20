---
title: "mcp-tooling: Feature Catalog"
description: "Current-state inventory for the mcp-tooling hub, covering nine workflow-vs-transport modes, metadata routing, generated leaf resources, and the conditional compiled-routing front door."
trigger_phrases:
  - "mcp-tooling feature catalog"
  - "mcp-tooling hub capabilities"
  - "workflow vs transport routing"
  - "mcp-tooling compiled routing"
last_updated: "2026-09-20"
version: 1.2.0.0
---

# mcp-tooling: Feature Catalog

This catalog inventories the live `mcp-tooling` hub surface. The hub scores and dispatches nine MCP-bridge packets across a workspace-mutating workflow axis and a read-only external-transport axis. A conditional compiled-routing front door may resolve the same decision ahead of registry-driven routing when its activation manifest is fresh; otherwise the legacy hub router remains authoritative.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `mcp-tooling` hub. The hub does not call an external tool itself — it selects one of five workflow packets, one of four transports, an ordered bundle, or a deferred disambiguation, then hands off to the selected packet.

| Axis | Modes | Contract |
|---|---|---|
| Workflow | `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion` | May change local or external workflow state and must apply packet-specific authorization and verification gates |
| Transport | `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-magicpath` | External read or explicit-export surfaces; remain `mutatesWorkspace:false` in this workspace |

Orca CLI work left this hub for the standalone `cli-orca` skill, which owns Orca-managed worktrees, repositories, terminals, handoffs, automations, artifacts, skill sharing, comments, and embedded browser state.

---

## 2. WORKFLOW-VS-TRANSPORT ROUTING

### Workflow-Vs-Transport Two-Axis Routing

`mode-registry.json` and `hub-router.json` jointly resolve a request to a single mode, an ordered bundle, or a deferred disambiguation across the ten packets. `routerPolicy.tieBreak` keeps workflow modes before transports when signals are near-tied.

Workflow packets own state-changing lifecycle boundaries. Transport packets bridge external design surfaces and do not decide design themselves: Figma, Refero, and Mobbin pair with `sk-design-md-generator` when measured reference extraction is needed, while MagicPath theme evidence pairs with `sk-design` for design judgment.

See [`workflow-vs-transport-routing/workflow-vs-transport-routing.md`](workflow-vs-transport-routing/workflow-vs-transport-routing.md) for the two-axis model and source files.

---

## 3. COMPILED ROUTING

### Conditional Compiled Front Door And Legacy Fallback

`node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"` is the conditional front door. It may serve a compiled decision only when the runtime flag and the promoted activation manifest both authorize it. A legacy sentinel, stale-manifest status, or resolver error leaves registry-driven routing authoritative.

The activation manifest is not promoted by adding an ordinary packet. After a hub registry or router change, run the status command and record its `causeCode`; do not call a legacy result compiled-serving evidence.

```bash
node .skilled/bin/compiled-route-status.cjs --hub mcp-tooling
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use Chrome DevTools to capture a HAR for the staging dashboard"
```

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for the flag, activation, and fallback contract.

---

## 4. GENERATED RESOURCES AND VALIDATION

The root `ROUTER.md` maps each selected mode to packet-qualified leaf resources. `leaf-manifest.json` is generated from the registry and packet files; it must never be hand-edited. The single hub `graph-metadata.json` carries the advisor identity and the union of the hub's routing vocabulary.

Run the structural and generated-state checks from the repository root:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --check
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --skills-dir .skilled/skills --format json
```

---

## 5. SOURCE FILES

| File | Role |
|---|---|
| `mode-registry.json` | Canonical mode identity, packet kind, backend, tool surface, aliases, and advisor routing class |
| `hub-router.json` | Stage-one policy, signal classes, and tie-break order |
| `ROUTER.md` | Stage-two packet-qualified leaf routing |
| `graph-metadata.json` | Single advisor identity and graph/routing context |
| `leaf-manifest.json` | Generated mode-to-leaf inventory |
| `manual-testing-playbook/` | Hub routing scenarios and coverage claims |
| `benchmark/` | Historical Lane C archive plus dated current-run reports |
