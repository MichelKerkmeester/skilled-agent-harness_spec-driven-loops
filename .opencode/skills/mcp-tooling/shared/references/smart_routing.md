---
title: mcp-tooling Surface Router — per-mode leaf sets
description: Second-layer (surface) router for the mcp-tooling hub. hub-router.json selects the workflow mode; this doc maps a request's tool-bridge intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs.
trigger_phrases:
  - "mcp-tooling smart routing"
  - "mcp tool bridge surface router"
  - "mcp tool leaf routing"
  - "mcp tool bridge resource map"
importance_tier: important
contextType: general
version: 1.0.0.0
---

# mcp-tooling Surface Router — per-mode leaf sets

This is mcp-tooling's second-layer (surface) router. The hub selects a workflow
mode in [`hub-router.json`](../../hub-router.json) (`mcp-chrome-devtools`,
`mcp-click-up`, `mcp-aside-devtools`, `mcp-figma`, `mcp-refero`, or
`mcp-mobbin`); this doc maps a request's tool-bridge intent to the exact
packet-local leaf resources that mode should load. Every path is
packet-qualified (`<packet>/references|assets/…`, where `<packet>` is the mode's
`mode-registry.json` `packet` field) and converts to the canonical
`(workflowMode, leafResourceId)` pair at the one contract boundary
(`sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.

---

## 1. INTENT MODEL

- **mcp-chrome-devtools leaves** — the CDP command patterns (screenshot/HAR/
  console/network/performance-trace flows) and the session-management guide a
  request to debug a live browser, capture a HAR or console/network evidence,
  run a Lighthouse or performance trace, or drive Chrome DevTools over CDP
  loads.
- **mcp-click-up leaves** — the `cupt` CLI command reference and the MCP
  tool-surface guide a request to work a ClickUp queue — mark tasks done, add
  notes, log time, or run bulk task operations — loads.
- **mcp-aside-devtools leaves** — the Aside CLI command reference and the
  MCP-wiring guide a request to hand a browser task to the agentic Aside runtime
  (sign in, click through a flow autonomously, capture REPL evidence) loads.
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

## 2. MACHINE-READABLE ROUTER (replay / benchmark source)

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
    "CHROME_DEVTOOLS": {"weight": 4, "keywords": ["chrome devtools", "browser debug", "dom inspect", "lighthouse", "bdg", "cdp", "cdp domain", "screenshot capture", "network requests", "har export", "performance trace"]},
    "CLICK_UP":        {"weight": 4, "keywords": ["clickup", "cupt", "task management", "work queue", "mark done", "time tracking", "project tracker", "clickup task", "log time", "clickup documents", "bulk tasks"]},
    "ASIDE_DEVTOOLS":  {"weight": 4, "keywords": ["aside", "aside browser", "aside cli", "aside mcp", "aside repl", "ai browser automation", "agentic browser", "agentic browser task", "browser agent", "aside daemon", "click through"]},
    "FIGMA":           {"weight": 4, "keywords": ["figma", "figma cli", "figma-ds-cli", "figma desktop", "render in figma", "figma tokens", "extract design.md", "figma mcp", "figma daemon", "export from figma", "design tokens", "design file"]},
    "REFERO":          {"weight": 4, "keywords": ["refero", "refero mcp", "refero.design", "design reference search", "ui reference", "real app screens", "reference styles", "web products"]},
    "MOBBIN":          {"weight": 4, "keywords": ["mobbin", "mobbin mcp", "app design research", "ux flow references", "mobile design patterns", "mobile ux research", "onboarding flow examples", "ios app examples", "phone apps"]},
}

RESOURCE_MAP = {
    "CHROME_DEVTOOLS": [
        "mcp-chrome-devtools/references/cdp_patterns.md",
        "mcp-chrome-devtools/references/session_management.md"
    ],
    "CLICK_UP": [
        "mcp-click-up/references/cupt_commands.md",
        "mcp-click-up/references/mcp_tools.md"
    ],
    "ASIDE_DEVTOOLS": [
        "mcp-aside-devtools/references/aside-cli-reference.md",
        "mcp-aside-devtools/references/mcp-wiring.md"
    ],
    "FIGMA": [
        "mcp-figma/references/figma_cli_reference.md",
        "mcp-figma/references/mcp_wiring.md"
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

## 3. How to read this

- One dominant tool intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit —
  the `orderedBundle` outcome `hub-router.json` declares.
- Each mode's leaves are its primary command / tool-surface reference plus its
  wiring guide; the deeper per-mode references (troubleshooting, tool catalogs,
  discovery fixtures, env templates) load on demand inside the packet, not on the
  first slice.
- No keyword match is the hub's `defer` fallback: confirm the target tool
  (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`, `mcp-figma`,
  `mcp-refero`, or `mcp-mobbin`) before loading anything.
