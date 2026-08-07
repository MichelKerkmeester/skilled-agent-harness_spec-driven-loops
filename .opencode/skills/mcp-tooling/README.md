---
title: mcp-tooling
description: "One routing identity for seven MCP tool bridges: browser debugging and automation, ClickUp task operations, Obsidian vault and markdown-note management, Aside agentic browser tasks and three design-research transports, resolved through mode-registry.json and hub-router.json."
trigger_phrases:
  - "chrome devtools"
  - "clickup task"
  - "obsidian vault"
  - "notesmd-cli"
  - "figma cli"
  - "mcp tool bridge"
version: 1.5.0.0
---

# mcp-tooling

> One advisor identity routes every request to the right MCP tool bridge: browser debugging, ClickUp task operations, Obsidian vault work and design research, all reached through plain language instead of a manual.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Browser debugging and automation, ClickUp task operations, Obsidian vault and markdown-note management, Aside agentic browser tasks, Figma Desktop transport, Refero web UI reference search and Mobbin mobile-app design research |
| **Invoke with** | Keyword routing through Gate 2 with no bound slash command for any of the seven modes, plus `/doctor:mcp` for install and debug |
| **Routes to** | All seven packet directories via `mode-registry.json` and `hub-router.json`: four mutating workflow bridges and three read-only design transports |
| **Produces** | Browser evidence, ClickUp task state changes, Obsidian note and vault operations, Aside browser evidence, Figma reads and exports plus Refero and Mobbin research, with design decisions paired to `sk-design` |

---

## 2. OVERVIEW

### Why This Skill Exists

Every external tool arrives with its own way in: a CLI, an MCP server or a desktop app, plus its own setup story and failure modes. Before the hub existed, an agent that wanted to debug a browser and update a ClickUp task had to hold each surface in mind separately while the manuals kept piling up. The hub removes that cost. One advisor identity fields the request, resolves the mode, picks the packet and hands over the work.

### What It Does

The hub holds no packet-local logic. It routes every request to exactly one of seven nested packets through `mode-registry.json` and `hub-router.json`, then lets the packet's own `SKILL.md` take over. Each packet keeps its own `SKILL.md`, `README.md`, `INSTALL-GUIDE.md` and `changelog/`. The hub carries the single `graph-metadata.json` advisor identity for all seven. `mcp-code-mode` is the shared execution substrate that the CLI-plus-MCP workflows and the design transports reach through. It is excluded from the hub on purpose and stays a flat standalone skill with no hub membership.

### The Routing Surface

| Mode | What the hub routes |
|---|---|
| [`mcp-chrome-devtools`](./mcp-chrome-devtools/README.md) | Browser debugging and automation through the `bdg` CLI (fast and token-efficient) with an MCP fallback through Code Mode |
| [`mcp-click-up`](./mcp-click-up/README.md) | ClickUp task management: the `cupt` CLI for daily operations and the official ClickUp MCP for the heavier document, goal and bulk work |
| [`mcp-obsidian`](./mcp-obsidian/README.md) | Obsidian vault and markdown-note management through headless `notesmd-cli`, the app-backed `obsidian` CLI and the cyanheads MCP |
| [`mcp-aside-devtools`](./mcp-aside-devtools/README.md) | Agentic browser tasks through the Aside CLI with deterministic REPL evidence capture and an MCP fallback |
| [`mcp-figma`](./mcp-figma/README.md) | Figma Desktop transport: drives Figma Desktop from the terminal through `figma-ds-cli`, read-only in this workspace with writes landing only in Figma Desktop |
| [`mcp-refero`](./mcp-refero/README.md) | Real-app web UI reference search through the Refero MCP, read-only through Code Mode |
| [`mcp-mobbin`](./mcp-mobbin/README.md) | Mobile app screen, flow and UX pattern research through the Mobbin MCP, read-only through Code Mode |

### The Transport Axis

Four modes are workflow bridges that mutate this workspace directly. The remaining three are read-only design transports that bridge to an external tool's surface and never perform design judgment or mutate this workspace. `mcp-figma` drives Figma Desktop over its local daemon with `mutatesWorkspace:false`: export commands write artifacts only to explicit output paths while document changes land in Figma Desktop. `mcp-refero` and `mcp-mobbin` run as remote MCP servers reached through Code Mode with no local writes at all. Every design-affecting operation runs with `sk-design` paired in, because the transport never decides taste on its own.

---

## 3. QUICK START

**Step 1: Make a plain request.** Keyword routing through Gate 2 matches the request to the single `mcp-tooling` identity. The hub then resolves the mode. No slash command binds any of the seven modes, so the request itself is the entry point.

**Step 2: Try a workflow bridge.**

```text
Use Chrome DevTools to capture a HAR for the staging dashboard.
```

The request reaches `mcp-chrome-devtools`, which runs the `bdg` CLI first and falls back to the Code Mode MCP when the CLI cannot serve the task.

```text
Mark the ClickUp task done and add a note that it shipped.
```

The request reaches `mcp-click-up`, which runs the `cupt` CLI for daily operations and the official ClickUp MCP for the heavy work like documents or bulk changes.

```text
Create a daily note for today in my Obsidian vault and register the vault.
```

The request reaches `mcp-obsidian`, which operates the vault through headless `notesmd-cli` without opening the app.

**Step 3: Route a design transport with its judgment partner.**

```text
Render this component in Figma and export the design tokens.
```

The request reaches `mcp-figma`, which drives Figma Desktop through `figma-ds-cli`. The transport pairs with `sk-design` before any design-affecting operation, because the transport never decides taste on its own.

**Step 4: Install or debug a bridge.** `/doctor:mcp` covers install and debug for every `mcp-*` skill, including every hub member. The doctor route reports the state of the target bridge without changing its configuration.

---

## 4. HOW IT WORKS

### The Routing Decision

Every request arrives as a plain phrase. Gate 2 keyword routing matches it to the single `mcp-tooling` advisor identity. The hub then resolves exactly one mode through `mode-registry.json` and `hub-router.json` before handing the work to that packet's `SKILL.md`.

### The Identity Split

The hub owns one `graph-metadata.json` advisor identity for all seven modes, while each packet keeps its own `SKILL.md`, `README.md`, `INSTALL-GUIDE.md` and `changelog/`. The split keeps routing centralized and packet ownership local: a mode can grow its own references and playbook without touching the hub's routing tables.

### The Code Mode Substrate

`mcp-code-mode` provides the shared execution substrate that the CLI-plus-MCP workflows and the remote transports reach through. It stays outside the hub as a flat standalone skill and keeps the unchanged `code_mode` registration key, so hub membership never re-routes its traffic.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for the hub whenever a request names one of its seven surfaces: browser debugging, ClickUp task operations, Obsidian vault work, agentic browser tasks, Figma Desktop, real-app UI references or mobile app design research. Design work always pairs a transport with `sk-design`. When a bridge needs install or debug help, `/doctor:mcp` is the route.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Shared MCP execution substrate for the CLI-plus-MCP workflows and the remote transports through the unchanged `code_mode` registration key. External infrastructure, not a hub member |
| `sk-design` | Mandatory cross-hub judgment partner for the three design transports. The transports never decide taste on their own |
| `sk-code` | Consumes browser-debugging output, ClickUp task context, Obsidian note context, Aside evidence, Figma exports and `DESIGN.md` plus Refero and Mobbin research as implementation input |
| `sk-doc` | Documentation and component authoring. The sibling parent hub whose structure this hub mirrors |

---

## 6. VERIFICATION

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/mcp-tooling
```

Expected: 0 invariant failures and 0 warnings with `PARENT_HUB_CHECK_STRICT=1`.

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime router, mode table and routing invariants for the hub |
| [`mode-registry.json`](./mode-registry.json) | Declarative registry that resolves a request to one mode |
| [`hub-router.json`](./hub-router.json) | Router policy and tie-break rules across the seven modes |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current-state inventory of every hub mode and capability |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate hub routing |
