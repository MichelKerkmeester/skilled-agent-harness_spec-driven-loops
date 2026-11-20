---
title: mcp-tooling
description: "One advisor identity routes eight MCP tool bridges: five workflow modes and three read-only design transports."
trigger_phrases:
  - "chrome devtools"
  - "clickup task"
  - "obsidian vault"
  - "aside browser"
  - "notion mcp"
  - "figma cli"
  - "mcp tool bridge"
version: 1.8.9.0
---

# mcp-tooling

> One hub picks the right MCP bridge for a request and loads only the files that bridge needs.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Browser debugging, task management, notes, workspace pages and design reference search across eight tool surfaces |
| **Invoke with** | A plain-language request that names the tool, routed by the skill advisor to one hub identity |
| **Works on** | Live browser sessions, ClickUp queues, Obsidian vaults, Aside runs, Notion workspaces and three design transports |
| **Produces** | The selected packet's evidence or state change, under that packet's own safety contract |

### What It Does

`mcp-tooling` is the routing hub for every MCP tool bridge in this repository. A request names one external tool. The hub resolves a mode and the matching packet does the work with its own commands and safety gates. Start with the routing command in section 2, then read the selected packet's `SKILL.md`.

`mcp-code-mode` is the shared MCP execution substrate for packets that call tools through Code Mode. It is infrastructure rather than a hub member, so a request for that substrate alone routes there directly.

### The Bridge Packet Map

Each packet owns one tool surface. The hub holds the routing decision and the packet holds the operating detail.

| Packet | What it operates |
|---|---|
| `mcp-chrome-devtools` | Chrome over CDP through `bdg`: screenshots, HAR export, console and network evidence, with performance audits through the MCP fallback |
| `mcp-click-up` | ClickUp tasks through `cupt` or the official MCP: mark done, add notes, log time and create tasks and documents |
| `mcp-obsidian` | Obsidian vaults and markdown notes through `notesmd-cli`, the `obsidian` CLI or MCP, plus Iconic icon rules |
| `mcp-aside-devtools` | Aside browser runs through the Aside CLI and REPL, with goal-driven tasks and captured evidence |
| `mcp-notion` | Notion pages, blocks, data sources, comments and search through MCP, with direct API gap fills |
| `mcp-figma` | Figma Desktop through `figma-ds-cli`: component renders, token exports and explicit-path local exports |
| `mcp-refero` | Read-only real-app web UI reference search through Refero MCP |
| `mcp-mobbin` | Read-only mobile app screen, flow and UX pattern research through Mobbin MCP |

---

## 2. QUICK START

**Step 1: Name the tool you need.** The hub routes on the tool named in the request.

```text
Use Chrome DevTools to capture a HAR for the staging dashboard.
```

**Step 2: Resolve the mode.**

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use Chrome DevTools to capture a HAR for the staging dashboard"
```

It prints one JSON line. For the request above, that line reports the `route` action for `mcp-chrome-devtools` with `selectionKind` set to `single`.

**Step 3: Load what the route returns.** On `route`, open the returned targets. On `clarify` or `defer`, name the missing tool identity and run the command again.

---

## 3. HOW IT WORKS

Routing runs in two stages. Stage one scores the request against `hub-router.json` and reads `mode-registry.json` to select a mode. Stage two reads `ROUTER.md` and loads the leaf files that mode declares, so a Chrome request opens the CDP pattern file and the session guide rather than the whole hub.

```text
┌──────────────────────┐
│ Tool request         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ hub-router.json      │
│ scores the signal    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ mode-registry.json   │
│ names the packet     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ROUTER.md selects    │
│ the leaf files       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Selected packet runs │
│ the work             │
└──────────────────────┘
```

### Two Axes

A mode sits on one of two axes. Workflow packets can change local or external state and apply the packet's own safety and verification gates. Transport packets bridge read or export surfaces and stay `mutatesWorkspace:false` in this workspace.

Design transports return reference material, not a design verdict. When a measured Style Reference is needed, the design transports pair with `sk-design-md-generator`.

### Outcomes

- `single` routes one dominant tool signal to one mode.
- `orderedBundle` routes several explicitly requested tools in tie-break order.
- `defer` asks for the missing tool identity when intent is unclear or contradictory.

A scored route carries only the selected mode's resources. The default resource set is fallback-only and never joins a scored route.

---

## 4. VERIFICATION

Hub structure and coupled metadata:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling
```

Each passing invariant prints a `PASS` line. A check with nothing to compare prints `INFO`. The run ends with an `OK: parent-skill-check` line reporting 0 warnings. The exit status is 0.

A positive route replay returns one target:

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use Chrome DevTools to capture a HAR for the staging dashboard"
```

The JSON reports `"action":"route"` and a `targets` array with `"workflowMode":"mcp-chrome-devtools"`.

Skill package check:

```bash
python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/mcp-tooling --check
```

It prints `Result: PASS` and exits 0.

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract: mode table, routing summary and rules |
| [`ROUTER.md`](./ROUTER.md) | Stage-two intent map and packet-qualified leaf resources |
| [`mode-registry.json`](./mode-registry.json) | Mode identity, packet kind, backend and tool surface |
| [`hub-router.json`](./hub-router.json) | Stage-one signals, vocabulary classes and tie-break order |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current capability inventory |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Live routing scenarios and holdouts |
| [`benchmark/README.md`](./benchmark/README.md) | Frozen benchmark reports, kept as historical evidence |
