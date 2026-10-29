---
name: mcp-tooling
description: "Parent hub for eight modes: five workflow modes and three read-only design transports routed by workflowMode."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.9.2.0
metadata:
  family: mcp
---

<!-- Keywords: mcp-tooling, mode-registry, hub-router, workflowMode, packetKind, transport-axis, mcp-chrome-devtools, chrome-devtools, cdp, browser-debugger-cli, bdg, mcp-click-up, clickup, cupt, task-management, mcp-obsidian, obsidian, obsidian-vault, notesmd-cli, obsidian-mcp, note-management, markdown-notes, mcp-aside-devtools, aside, aside-browser, agentic-browser, aside-mcp, mcp-notion, notion, notion-mcp, notion-api, mcp-refero, refero, design-reference, mcp-mobbin, mobbin, app-design-research, mcp-figma, figma-cli, figma-ds-cli, figma-desktop, mcp-code-mode, mcp-tooling smart routing, mcp tool bridge surface router, mcp tool leaf routing, mcp tool bridge resource map -->

# MCP Tooling Hub (mcp-tooling)

One skill has eight modes: five workflow bridges and three read-only design transports. They share one `family: mcp` identity.
`mcp-tooling` is the public advisor-routable home for every MCP tool bridge in this repository. Before routing, the hub reads `hub-router.json` to resolve a `workflowMode`, then delegates through `mode-registry.json`.
The hub holds no per-mode logic. Each mode keeps its contract in its packet.

`mcp-code-mode` remains the shared MCP execution substrate for the modes that use Code Mode. It is external infrastructure, not a hub member.

**Version authority.** This file's `version` frontmatter is the hub release version and matches the newest entry under `changelog/`. Hub metadata files carry the same value unless a generated contract owns their format.

---

## 1. WHEN TO USE

Use this hub for any request that names one of its eight tool-bridge surfaces. The hub classifies the request, resolves a mode key, and loads the matching nested packet.

| Mode | Kind | Use it for | Packet |
|------|------|-----------|--------|
| **mcp-chrome-devtools** | workflow | Browser debugging and automation through `bdg`, with Code Mode MCP fallback | `mcp-tooling/mcp-chrome-devtools/` |
| **mcp-click-up** | workflow | ClickUp task management through `cupt` and the official MCP | `mcp-tooling/mcp-click-up/` |
| **mcp-obsidian** | workflow | Obsidian vault, markdown-note, and Iconic rulebook operations | `mcp-tooling/mcp-obsidian/` |
| **mcp-aside-devtools** | workflow | Agentic browser tasks through Aside CLI, REPL, and MCP fallback | `mcp-tooling/mcp-aside-devtools/` |
| **mcp-notion** | workflow | Notion workspace operations through Code Mode and direct API gap fills | `mcp-tooling/mcp-notion/` |
| **mcp-figma** _(transport)_ | transport | Figma Desktop reads and explicit-path exports | `mcp-tooling/mcp-figma/` |
| **mcp-refero** _(transport)_ | transport | Real-app web UI reference search through Refero MCP | `mcp-tooling/mcp-refero/` |
| **mcp-mobbin** _(transport)_ | transport | Mobile app screen, flow, and UX pattern research through Mobbin MCP | `mcp-tooling/mcp-mobbin/` |

### When NOT to Use

- A quick read or edit has no MCP tool-bridge need. Use the relevant skill directly.
- Shared MCP execution infrastructure is needed without a vendor bridge. Use `mcp-code-mode` directly.
- Chrome/CDP debugging belongs to `mcp-chrome-devtools`. Generic agentic browser work belongs to `mcp-aside-devtools`. Orca CLI work belongs to the standalone `cli-orca` skill.
- A measured Style Reference belongs to `sk-design-md-generator` for Figma, Refero, and Mobbin material.

---

## 2. SMART ROUTING

Stage one scores `hub-router.json` `routerSignals` against `vocabularyClasses` and reads `mode-registry.json` to select one mode, an ordered bundle, or a defer outcome.
Stage two lives in the root [`ROUTER.md`](./ROUTER.md), which maps each mode's tool intent to the packet-qualified leaf resources it loads.
The hub selects a mode, and `ROUTER.md` selects that mode's leaves.

The advisor routes every MCP tool-bridge request to the single identity `mcp-tooling`.
Resolve a mode with `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"`.
Follow the decision: `route` loads `targets`, and `clarify` or `defer` asks for the missing tool identity.
A scored route loads only the selected mode's resources, so the fallback resource is never added to it.
The directive and remaining routing detail live in the final `MACHINE ROUTER` section.

---

## 3. HOW IT WORKS

### Terms

- **`workflowMode`**: the public mode key this hub resolves to one tool-bridge packet.
- **`packetKind`**: the axis a mode sits on, `workflow` for a bridge that can change state and `transport` for a read-only design bridge.
- **`backendKind`**: which backend runs the mode, recorded per mode in `mode-registry.json`.
- **advisor routing class**: how the advisor finds a mode, which is `metadata` for every mode here, so the advisor routes this hub and the hub picks the mode.
- **`mode-registry.json`**: the registry that owns each mode's workflow mode, packet kind, backend kind, tool surface, aliases and advisor routing class.
- **`hub-router.json`**: stage one's policy, signals, vocabulary classes and tie-break order.
- **vocabulary classes**: the authored tool vocabulary that stage-one signals are matched against.
- **tie-break**: the `hub-router.json` order that ranks modes when more than one scores.
- **leaf resource**: a packet-qualified file inside the chosen mode, which the generated `leaf-manifest.json` represents.
- **`INTENT_SIGNALS` / `RESOURCE_MAP`**: the machine-readable block in `ROUTER.md` that maps an intent to the leaf resources it loads.
- **ordered bundle**: the stage-one result where several explicitly requested tools route in tie-break order.
- **`defer`**: the stage-one result where unclear or contradictory tool intent asks for disambiguation.

### Layout

```text
mcp-tooling/
  SKILL.md
  README.md
  mode-registry.json
  hub-router.json
  description.json
  graph-metadata.json
  changelog/
  feature-catalog/
  manual-testing-playbook/
  benchmark/
  leaf-manifest.json
  ROUTER.md
  mcp-chrome-devtools/
  mcp-click-up/
  mcp-obsidian/
  mcp-aside-devtools/
  mcp-notion/
  mcp-figma/
  mcp-refero/
  mcp-mobbin/
```

### Companion metadata

- `mode-registry.json` owns workflow mode, packet kind, backend kind, tool surface, packet identity, aliases, and advisor routing class.
- `hub-router.json` owns stage-one policy, signals, vocabulary classes, and tie-break order.
- `ROUTER.md` owns stage-two intent signals and packet-qualified leaf resources.
- `description.json` and the single hub `graph-metadata.json` provide advisor discovery without creating one identity per member.
- `leaf-manifest.json` is generated from packet resources. Never hand-edit it.

### Mode boundaries

Existing workflow and transport packets retain their own safety contracts: workflow packets keep explicit gates and transport packets stay read-only.

---

## 4. RULES

### ALWAYS

- Resolve packets through `mode-registry.json`; do not hardcode packet roots in routing logic.
- Keep this hub thin. Put command and provider behavior in the nested packet.
- Keep registry modes and router signal keys bidirectionally aligned.
- Keep every transport read-only in this workspace and keep its browser, design, or provider boundary explicit.
- Regenerate `leaf-manifest.json` through the canonical metadata command.
- Replay positive and negative routing cases whenever aliases or signal classes change.

### NEVER

- Never add a second packet array or a second advisor identity for a hub member.
- Never grant a transport `Write`, `Edit`, or `Task`.
- Never move `mcp-code-mode` into this hub.
- Never treat a transport result as a design verdict.

### ESCALATE IF

- A new member cannot be classified as workflow or transport.
- Registry modes, stage-one signals, stage-two resource keys, or generated manifest entries disagree.
- Browser ownership would overlap Chrome/CDP or Aside without a clear state boundary.

---

## 5. REFERENCES

- [`mode-registry.json`](mode-registry.json) — canonical mode identity and safety metadata.
- [`hub-router.json`](hub-router.json) — stage-one policy and signal classes.
- [`ROUTER.md`](ROUTER.md) — stage-two packet resource router.
- [`README.md`](README.md) — operator-facing hub overview.
- [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md) — live hub routing scenarios.
- [`feature-catalog/feature-catalog.md`](feature-catalog/feature-catalog.md) — current capability inventory.

---

## 6. MACHINE ROUTER

The compiled-routing directive and remaining routing detail live here.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode through the compiled router first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"
> ```
> Follow `route` targets. On `clarify` or `defer`, ask for the missing tool identity. On a `{"servingAuthority":"legacy"}` sentinel or any error, use the legacy hub-router contract. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide.

### Two-Axis Model

- `packetKind: workflow` — `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, and `mcp-notion` can change workspace or external workflow state and use explicit safety gates.
- `packetKind: transport` — `mcp-figma`, `mcp-refero`, and `mcp-mobbin` bridge external read or export surfaces and remain `mutatesWorkspace:false` in this workspace.
- Design transports never decide design on their own. Figma, Refero, and Mobbin pair with `sk-design-md-generator` for measured references.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak
  -> read mode-registry.json for packetKind, backendKind, toolSurface, and advisorRouting
  -> load the selected packet(s)
```

### Outcomes

- `single`: one dominant tool signal routes to one mode.
- `orderedBundle`: several explicitly requested tools route in tie-break order.
- `defer`: unclear or contradictory tool intent asks for disambiguation.

A scored route loads only the selected mode's resources. The default resource is fallback-only and must not be unioned into a scored route.

### Surface Router

The root `ROUTER.md` machine block keeps `INTENT_SIGNALS` and `RESOURCE_MAP` in sync. Every resource path is packet-qualified, resolves on disk, and is represented in the generated leaf manifest.
