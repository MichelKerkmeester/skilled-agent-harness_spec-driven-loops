---
name: mcp-tooling
description: "Parent hub for nine MCP tool bridges: five workflow modes and four read-only design transports routed by workflowMode."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.8.0.0
metadata:
  author: OpenCode
  family: mcp
---

<!-- Keywords: mcp-tooling, mode-registry, hub-router, workflowMode, packetKind, transport-axis, mcp-chrome-devtools, chrome-devtools, cdp, browser-debugger-cli, bdg, mcp-click-up, clickup, cupt, task-management, mcp-obsidian, obsidian, obsidian-vault, notesmd-cli, obsidian-mcp, note-management, markdown-notes, mcp-aside-devtools, aside, aside-browser, agentic-browser, aside-mcp, mcp-notion, notion, notion-mcp, notion-api, mcp-refero, refero, design-reference, mcp-mobbin, mobbin, app-design-research, mcp-figma, figma-cli, figma-ds-cli, figma-desktop, mcp-magicpath, magicpath, magicpath-ai, mcp-code-mode, mcp-tooling smart routing, mcp tool bridge surface router, mcp tool leaf routing, mcp tool bridge resource map -->

# MCP Tooling Hub (mcp-tooling)

One skill, five workflow bridges, four read-only design transports, and one shared `family: mcp` identity. `mcp-tooling` is the public advisor-routable home for every MCP tool bridge in this repository. Before routing, the hub reads `hub-router.json` to resolve a `workflowMode`, then delegates through `mode-registry.json`. The hub holds no per-mode logic. Each mode keeps its contract in its packet.

`mcp-code-mode` remains the shared MCP execution substrate for the modes that use Code Mode. It is external infrastructure, not a hub member.

**Version authority.** This file's `version` frontmatter is the hub release version and matches the newest entry under `changelog/`. Hub metadata files carry the same value unless a generated contract owns their format.

## 1. WHEN TO USE

Use this hub for any request that names one of its nine tool-bridge surfaces. The hub classifies the request, resolves a mode key, and loads the matching nested packet.

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
| **mcp-magicpath** _(transport)_ | transport | MagicPath component and design-system lookup through its read-only UTCP CLI manual | `mcp-tooling/mcp-magicpath/` |

### When NOT to Use

- A quick read or edit has no MCP tool-bridge need. Use the relevant skill directly.
- Shared MCP execution infrastructure is needed without a vendor bridge. Use `mcp-code-mode` directly.
- Chrome/CDP debugging belongs to `mcp-chrome-devtools`. Generic agentic browser work belongs to `mcp-aside-devtools`. Orca CLI work belongs to the standalone `cli-orca` skill.
- A measured Style Reference belongs to `sk-design-md-generator` for Figma, Refero, and Mobbin material. MagicPath themes already provide named variables and fonts, so its transport pairs with `sk-design` for design judgment.

## 2. SMART ROUTING

Routing is two-stage:

1. Stage 1 uses `hub-router.json` and `mode-registry.json` to select one workflow mode, an ordered bundle, or a defer outcome.
2. Stage 2 uses the root `ROUTER.md` surface map to select packet-qualified leaf resources within the chosen mode.

Use the compiled route first when it is serving:

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"
```

Follow `route` targets. On `clarify` or `defer`, ask for the missing tool identity. On a legacy sentinel or error, use the legacy hub-router contract. A scored route loads only the selected mode's resources. The default resource is fallback-only and must not be unioned into a scored route.

The root `ROUTER.md` machine block keeps `INTENT_SIGNALS` and `RESOURCE_MAP` in sync. Every resource path is packet-qualified, resolves on disk, and is represented in the generated leaf manifest.

## 3. TWO-AXIS MODEL

- `packetKind: workflow` — `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, and `mcp-notion` can change workspace or external workflow state and use explicit safety gates.
- `packetKind: transport` — `mcp-figma`, `mcp-refero`, `mcp-mobbin`, and `mcp-magicpath` bridge external read or export surfaces and remain `mutatesWorkspace:false` in this workspace.
- Design transports never decide design on their own. Figma, Refero, and Mobbin pair with `sk-design-md-generator` for measured references. MagicPath themes already carry named variables and fonts, so its packet pairs with `sk-design` for judgment.

## 4. HOW IT WORKS

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
  mcp-magicpath/
```

### Companion metadata

- `mode-registry.json` owns workflow mode, packet kind, backend kind, tool surface, packet identity, aliases, and advisor routing class.
- `hub-router.json` owns stage-one policy, signals, vocabulary classes, and tie-break order.
- `ROUTER.md` owns stage-two intent signals and packet-qualified leaf resources.
- `description.json` and the single hub `graph-metadata.json` provide advisor discovery without creating one identity per member.
- `leaf-manifest.json` is generated from packet resources. Never hand-edit it.

### Mode boundaries

`mcp-magicpath` remains a read-only synchronous UTCP CLI transport. Its unregistered vendor write commands stay unreachable from the registered surface. Existing workflow and transport packets retain their own safety contracts.

## 5. RULES

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

## 6. REFERENCES

- [`mode-registry.json`](mode-registry.json) — canonical mode identity and safety metadata.
- [`hub-router.json`](hub-router.json) — stage-one policy and signal classes.
- [`ROUTER.md`](ROUTER.md) — stage-two packet resource router.
- [`README.md`](README.md) — operator-facing hub overview.
- [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md) — live hub routing scenarios.
- [`feature-catalog/feature-catalog.md`](feature-catalog/feature-catalog.md) — current capability inventory.
- [`mcp-magicpath/SKILL.md`](mcp-magicpath/SKILL.md) — read-only vendor CLI transport contract.
