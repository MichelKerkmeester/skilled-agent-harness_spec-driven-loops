---
title: mcp-tooling
description: "One advisor identity routes ten MCP tool bridges: six workflow modes and four read-only design transports."
trigger_phrases:
  - "chrome devtools"
  - "clickup task"
  - "obsidian vault"
  - "aside browser"
  - "notion mcp"
  - "orca cli"
  - "orca worktree"
  - "figma cli"
  - "magicpath components"
  - "mcp tool bridge"
version: 1.7.0.0
---

# mcp-tooling

> One advisor identity routes ten MCP tool bridges through the right workflow packet: six workflow bridges and four read-only design transports.

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Browser debugging, ClickUp, Obsidian, Aside, Notion, Orca-managed state, Figma Desktop, Refero, Mobbin, and MagicPath |
| **Invoke with** | Plain-language tool-specific requests through the hub and its two-stage router |
| **Routes to** | Ten packet directories via `mode-registry.json`, `hub-router.json`, and root `ROUTER.md` |
| **Workflow modes** | `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`, `mcp-orca-cli` |
| **Transport modes** | `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-magicpath` |
| **Produces** | External-tool evidence and state changes owned by the selected packet, with explicit safety boundaries |

## 2. OVERVIEW

External tools do not share one setup story or one safety model. The hub gives them one advisor identity while keeping each provider's command surface, credential boundary, mutation policy, and recovery rules in a nested packet.

The hub selects a `workflowMode` through `mode-registry.json` and `hub-router.json`. The root `ROUTER.md` then maps the selected mode to the exact packet-local references needed for the request. `mcp-code-mode` is shared infrastructure for packets that use Code Mode, not another hub member.

## 3. MODE DIRECTORY

| Mode | What the hub routes |
|---|---|
| [`mcp-chrome-devtools`](./mcp-chrome-devtools/README.md) | Developer-driven Chrome/CDP debugging, screenshots, network and console evidence, HAR export, and Lighthouse through `bdg` or its MCP fallback |
| [`mcp-click-up`](./mcp-click-up/README.md) | ClickUp task management through `cupt` for daily operations and the official MCP for heavier document, goal, and bulk work |
| [`mcp-obsidian`](./mcp-obsidian/README.md) | Obsidian vault and markdown-note management plus Iconic rulebook automation through CLI and MCP lanes |
| [`mcp-aside-devtools`](./mcp-aside-devtools/README.md) | Goal-driven Aside browser tasks and deterministic REPL evidence, with Code Mode composition when needed |
| [`mcp-notion`](./mcp-notion/README.md) | Notion pages, blocks, data sources, comments, users, search, and direct API gap fills |
| [`mcp-orca-cli`](./mcp-orca-cli/README.md) | Orca-managed worktrees, terminals, repositories, handoffs, automations, artifacts, skill sharing, comments, and embedded browser state through the version-matched CLI guide |
| [`mcp-figma`](./mcp-figma/README.md) | Figma Desktop transport through `figma-ds-cli`, with explicit-path local exports and design-reference handoff |
| [`mcp-refero`](./mcp-refero/README.md) | Read-only real-app web UI reference search through Refero MCP |
| [`mcp-mobbin`](./mcp-mobbin/README.md) | Read-only mobile app screen, flow, and UX pattern research through Mobbin MCP |
| [`mcp-magicpath`](./mcp-magicpath/README.md) | Read-only MagicPath component, project, team, theme, and canvas lookup through the vendor CLI over a UTCP `cli` manual |

## 4. QUICK START

Make a plain-language request that names the owning surface:

```text
Use Chrome DevTools to capture a HAR for the staging dashboard.

Mark the ClickUp task done and add a shipping note.

Create a daily note in my Obsidian vault.

Use the Orca CLI to inspect the current worktree and terminals.

Open the Orca-managed browser page and capture a fresh snapshot.

Query my Notion roadmap data source for in-progress rows.

Search MagicPath for the saved button component and show its source.
```

The hub routes a browser/CDP request to Chrome, a generic agentic browser request to Aside, and an Orca-managed browser request to Orca. It does not treat a bare `orca` mention as an Orca signal because unrelated OpenOrca model traffic must remain outside this hub mode.

For installation or debugging, use `/doctor:mcp`. The doctor route reports bridge state without changing configuration.

## 5. ROUTING AND BOUNDARIES

### Two-stage routing

Stage 1 resolves the workflow mode. Stage 2 resolves packet-local resources. Use the compiled route when it is serving:

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"
```

On a route, load only the returned targets. On `clarify` or `defer`, ask for the missing tool identity. The hub's default resources are fallback-only and are not unioned into scored routes.

### Workflow modes

Workflow packets may change local or external workflow state. Their packet contracts define the required authorization, rollback, and verification boundary. Orca is classified as workflow because worktrees, terminals, agents, automations, browser interactions, and publishing can change state.

### Transport modes

Transport packets bridge external tool surfaces and remain `mutatesWorkspace:false` in this workspace. Figma, Refero, and Mobbin use `sk-design-md-generator` when measured design-reference extraction is required. MagicPath is different: its read-only theme data already includes named CSS variables and fonts, so it pairs with `sk-design` for design judgment. Its vendor write commands remain unregistered.

### Shared Code Mode

`mcp-code-mode` owns the shared MCP execution substrate and manual registration mechanics. Packets that use it discover their live callables at runtime. The Orca packet does not use Code Mode because no native Orca MCP command was found in the inspected 1.4.205 registry.

## 6. VERIFICATION

Hub structure and coupled metadata:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling
```

Positive route replay:

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the Orca CLI to inspect the current worktree"
```

Advisor replay:

```bash
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "Use the Orca CLI to inspect the current worktree" --threshold 0.5
```

Generated metadata and leaf package:

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skills-dir .skilled/skills --fix
python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/mcp-tooling/mcp-orca-cli --check
```

## 7. RELATED SKILLS

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Shared MCP execution substrate for packets that use registered MCP or UTCP manuals |
| `mcp-chrome-devtools` | Chrome/CDP debugging owner |
| `mcp-aside-devtools` | Generic agentic browser owner |
| `mcp-orca-cli` | Orca-managed worktree, terminal, automation, publishing, and embedded-browser owner |
| `sk-design-md-generator` | Measured-reference partner for Figma, Refero, and Mobbin |
| `sk-design` | Design authority for MagicPath theme and component evidence |
| `sk-code` | Consumes external-tool evidence as implementation input |
| `sk-doc` | Documentation and nested-packet authoring precedent |
