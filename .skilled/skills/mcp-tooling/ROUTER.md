---
title: mcp-tooling Surface Router — per-mode leaf sets
description: First-class surface router document at the mcp-tooling hub root (ROUTER.md). hub-router.json selects the workflow mode; this doc maps a request's tool-bridge intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs. Relocated verbatim from shared/references/smart-routing.md (v1.0.0.0) as the ROUTER.md consolidation pattern.
trigger_phrases:
  - "mcp-tooling smart routing"
  - "mcp tool bridge surface router"
  - "mcp tool leaf routing"
  - "mcp tool bridge resource map"
importance_tier: important
contextType: general
version: 1.8.7.0
router_state: active
skill_pointer: SKILL.md
---

# mcp-tooling Surface Router — per-mode leaf sets

## 1. OVERVIEW

This is mcp-tooling's second-layer (surface) router, first-class at the hub root
as `ROUTER.md`. The hub selects a workflow
mode in [`hub-router.json`](hub-router.json) (`mcp-chrome-devtools`,
`mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`,
`mcp-figma`, `mcp-refero`, or `mcp-mobbin`); this doc maps a request's
tool-bridge intent to the exact packet-local leaf resources that mode
should load. Every path is
packet-qualified (`<packet>/references|assets/…`, where `<packet>` is the mode's
`mode-registry.json` `packet` field) and converts to the canonical
`(workflowMode, leafResourceId)` pair at the one contract boundary
(`sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.

---

## 2. INTENT MODEL

- **mcp-chrome-devtools leaves** — the CDP command patterns (screenshot/HAR/
  console/network/performance-trace flows) and the session-management guide a
  request to debug a live browser, capture a HAR or console/network evidence,
  run a Lighthouse or performance trace, or drive Chrome DevTools over CDP
  loads.
- **mcp-click-up leaves** — the `cupt` CLI command reference and the MCP
  tool-surface guide a request to work a ClickUp queue — mark tasks done, add
  notes, log time, or run bulk task operations — loads.
- **mcp-obsidian leaves** — the dual CLI command reference and the cyanheads
  MCP tool catalog a request to manage an Obsidian vault or markdown notes
  through `notesmd-cli`, the official `obsidian` CLI, or MCP loads.
- **mcp-aside-devtools leaves** — the Aside CLI command reference and the
  MCP-wiring guide a request to hand a browser task to the agentic Aside runtime
  (sign in, click through a flow autonomously, capture REPL evidence) loads.
- **mcp-notion leaves** — the 24-tool MCP catalog and the direct-API gap
  reference a request to create or query Notion pages and data sources, read or
  write page markdown, or reach a capability the MCP does not expose (file
  uploads, views, non-truncated property items) loads.
- **mcp-figma leaves** — the Figma CLI command reference and the MCP-wiring
  guide a request to render a component in Figma Desktop or export design tokens
  / assets over the local Figma daemon loads.
- **mcp-refero leaves** — the Refero tool-surface catalog and the MCP-wiring
  guide a request to search Refero for real-app / web-product reference screens
  and style references loads.
- **mcp-mobbin leaves** — the Mobbin tool-surface catalog and the MCP-wiring
  guide a request to research mobile-app UX flows and design patterns from real
  iOS / Android apps loads.

A bare tool-bridge phrase that names no tool (e.g. "use the MCP tool bridge for
this") names no mode, so it fires no intent and falls back to the hub default
(disambiguation) — the router does not silently default to `mcp-chrome-devtools`
on genuine ambiguity. Provider-neutral design-research phrasing ("screen
examples") is deliberately absent below so a request naming neither Refero nor
Mobbin defers between the two transports rather than fanning out to both.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is
the human-facing contract; this block is the byte-for-byte source the
deterministic router-replay parses. Keep them in sync: when a map row changes
above, update the matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path
resolves on disk and is registered in `leaf-manifest.json`, so each dual-reads to
a canonical typed pair.

```python
# No always-loaded preamble: tool-bridge routing loads only the selected mode's
# leaves so the hub default route stays minimal (disambiguation on no match).
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "CHROME_DEVTOOLS": {"weight": 4, "keywords": ["chrome devtools", "browser debug", "inspect the dom", "lighthouse", "bdg", "cdp", "cdp domain", "screenshot capture", "network requests", "har export", "performance trace", "chrome-devtools", "mcp-chrome-devtools", "console errors", "capture browser screenshots"]},
    "CLICK_UP":        {"weight": 4, "keywords": ["clickup", "cupt", "task management", "work queue", "mark done", "time tracking", "project tracker", "clickup task", "log time", "clickup documents", "bulk tasks", "mcp-click-up", "click-up", "process queue", "clickup goals", "complete task", "add note to task", "tag task", "start timer", "stop timer", "mark task done"]},
    "OBSIDIAN":        {"weight": 4, "keywords": ["obsidian", "mcp-obsidian", "obsidian vault", "notesmd-cli", "obsidian mcp", "note management", "markdown notes", "create note", "vault search", "backlinks", "daily note", "knowledge base", "note crud", "health", "health-md", "health md", "health.md", "health data", "apple health", "health chart", "health visualization", "iconic", "iconic rulebook", "icon rules", "icon automation", "file icons", "folder icons", "icon color", "iconic data json", "iconic ruleset", "excalidraw", "excalidraw.md", "drawing note", "embedded drawing", "whiteboard", "drawing script", "minimal theme", "css theme", "theme snippet", "style settings", "appearance", "snippets"]},
    "ASIDE_DEVTOOLS":  {"weight": 4, "keywords": ["aside", "aside browser", "aside cli", "aside mcp", "aside repl", "ai browser automation", "agentic browser", "agentic browser task", "browser agent", "aside daemon", "click through", "natural language browser", "aside account", "repl evidence capture"]},
    "NOTION":          {"weight": 4, "keywords": ["notion", "notion mcp", "notion api", "notion page", "notion token", "ntn_", "notion database", "notion data source", "query notion", "notion property", "notion relation", "notion rollup", "notion formula", "notion markdown", "notion search"]},
    "FIGMA":           {"weight": 4, "keywords": ["figma", "figma cli", "figma-ds-cli", "figma desktop", "render in figma", "figma tokens", "extract design.md", "figma mcp", "figma daemon", "export from figma", "design file", "connect to figma", "figma variables", "figma export"]},
    "REFERO":          {"weight": 4, "keywords": ["refero", "refero mcp", "refero.design", "design reference search", "ui reference", "real app screens", "reference styles", "web products", "real app screen search", "ui screens from real apps", "design inspiration search", "user flow references"]},
    "MOBBIN":          {"weight": 4, "keywords": ["mobbin", "mobbin mcp", "app design research", "ux flow references", "mobile design patterns", "mobile ux research", "onboarding flow examples", "ios app examples", "phone apps", "real app ux patterns", "screen examples", "real app screenshots", "app screen gallery", "design pattern research"]},
}

RESOURCE_MAP = {
    "CHROME_DEVTOOLS": [
        "mcp-chrome-devtools/references/cdp-patterns.md",
        "mcp-chrome-devtools/references/session-management.md"
    ],
    "CLICK_UP": [
        "mcp-click-up/references/cupt-commands.md",
        "mcp-click-up/references/mcp-tools.md"
    ],
    "OBSIDIAN": [
        "mcp-obsidian/references/obsidian-cli-commands.md",
        "mcp-obsidian/references/mcp-tools.md"
    ],
    "ASIDE_DEVTOOLS": [
        "mcp-aside-devtools/references/aside-cli-reference.md",
        "mcp-aside-devtools/references/mcp-wiring.md"
    ],
    "NOTION": [
        "mcp-notion/references/mcp-tools.md",
        "mcp-notion/references/api-gap-tools.md"
    ],
    "FIGMA": [
        "mcp-figma/references/figma-cli-reference.md",
        "mcp-figma/references/mcp-wiring.md"
    ],
    "REFERO": [
        "mcp-refero/references/tool-surface.md",
        "mcp-refero/references/mcp-wiring.md"
    ],
    "MOBBIN": [
        "mcp-mobbin/references/tool-surface.md",
        "mcp-mobbin/references/mcp-wiring.md"
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant tool intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit —
  the `orderedBundle` outcome `hub-router.json` declares.
- Each mode's leaves are its primary command / tool-surface reference plus its
  wiring guide; the deeper per-mode references (troubleshooting, tool catalogs,
  discovery fixtures, env templates) load on demand inside the packet, not on the
  first slice.
- No keyword match is the hub's `defer` fallback: confirm the target tool
  (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`, `mcp-notion`,
  `mcp-figma`, `mcp-refero`, or `mcp-mobbin`) before loading anything.

---

## 5. MACHINE ROUTER

The hub's routing prose, moved here from `SKILL.md` so the skill body keeps only the pointer. It sits last, after the stage-two map above, and it declares no map of its own: the `INTENT_SIGNALS` and `RESOURCE_MAP` block in section 3 stays the only replay source.

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

The machine block in section 3 of this file keeps `INTENT_SIGNALS` and `RESOURCE_MAP` in sync. Every resource path is packet-qualified, resolves on disk, and is represented in the generated leaf manifest.
