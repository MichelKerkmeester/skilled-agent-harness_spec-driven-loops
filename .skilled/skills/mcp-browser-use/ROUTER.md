---
title: "mcp-browser-use Router"
description: "Stage-two control document for mcp-browser-use. hub-router.json selects the browser mode; this file maps the request to the packet-local leaves that mode loads."
trigger_phrases:
  - "mcp-browser-use router"
  - "mcp-browser-use routing"
importance_tier: normal
contextType: general
version: 1.1.6.0
router_state: active
skill_pointer: SKILL.md
---

# mcp-browser-use Router

The stage-two control document for [`SKILL.md`](./SKILL.md). `hub-router.json` selects the browser mode. This file maps the request to the exact packet-local leaves that mode loads.

---

## 1. OVERVIEW

Routing has two stages. `hub-router.json` scores the request and selects one workflow mode, an ordered bundle, or a defer outcome, and `mode-registry.json` maps that mode to its packet folder. This file then picks the leaves inside the selected packet. It never re-decides the mode.

Every path below is packet-qualified (`<packet>/references|assets|feature-catalog/...`, where `<packet>` is the mode's `mode-registry.json` `packet` field), resolves on disk and is listed in the generated `leaf-manifest.json`.

---

## 2. INTENT MODEL

Generic browser-automation phrasing names no tool, so it fires no intent here and the hub defers. That covers "browser automation", "agentic browser" and "ai browser automation": a bare agentic request belongs to neither Aside nor Bladebro.

- **Chrome DevTools leaves.** The CDP patterns and session-management references load for inspection, console, network, screenshot and HAR work.
- **Lighthouse and performance-trace leaves.** A Lighthouse or performance-trace request loads the MCP-lane leaf and the registered manual snapshot. Core Web Vitals phrasing alone is shared with frontend code work. It selects this mode here and reaches the advisor through the generated intent signals, where sk-code still ranks first for it. `bdg` ships no Lighthouse command, so these run through Code Mode.
- **Aside leaves.** The Aside CLI reference and the MCP wiring guide load for deterministic signed-in REPL runs and captured REPL evidence.
- **Bladebro leaves.** The Bladebro CLI reference and the MCP wiring guide load for stealth browsing, agentic branching and work in a caller-owned or already-open browser.
- **Own Chrome versus a caller-owned browser.** A request that names the user's own Chrome, such as "my own chrome" or "signed-in chrome", goes to Chrome DevTools, whose live instance `chrome_devtools_live --autoConnect` attaches to the Chrome the user already has open. A request for a caller-owned or already-open browser that names no Chrome goes to Bladebro. A request that names both returns an ordered bundle, Chrome DevTools first by tie-break order.
- **Narrow aliases.** Ordinary English words never route on their own. Bare "aside", "lighthouse", "har" and "rb" each match unrelated prose, so the maps below carry verb or page forms instead, such as "use aside", "run lighthouse", "export a har of" and "bladebro rb".

---

## 3. MACHINE-READABLE ROUTER

The stage-two machine-readable projection of the intent model above. `hub-router.json` carries the stage-one vocabulary. Keep the two in sync: when a row changes above, update the matching entry here. `INTENT_SIGNALS` and `RESOURCE_MAP` carry the same keys.

```python
# No always-loaded preamble: a route loads only the selected mode's leaves, and
# a request that fires no intent takes the hub's defer fallback.
DEFAULT_RESOURCE = []

SHARED_CONTROL_RESOURCES = []

INTENT_SIGNALS = {
    "CHROME_DEVTOOLS":  {"weight": 4, "keywords": ["chrome devtools", "open devtools", "via devtools", "use devtools", "in devtools", "devtools console", "browser debug", "bdg", "cdp", "chrome-devtools", "mcp-chrome-devtools", "inspect the dom", "screenshot capture", "console errors", "network requests", "har export", "export a har of", "capture a har", "save a har", "as a har file", "export the network log", "cdp domain", "capture browser screenshots", "chrome_devtools_live", "chrome devtools live", "chrome live manual", "remote debugging", "chrome autoconnect", "my own chrome", "signed-in chrome", "logged in chrome"]},
    "LIGHTHOUSE_TRACE": {"weight": 4, "keywords": ["lighthouse audit", "run lighthouse", "run a lighthouse", "record a performance trace", "capture a performance trace", "chrome performance trace", "core web vitals"]},
    "ASIDE_DEVTOOLS":   {"weight": 4, "keywords": ["use aside", "run aside", "open aside", "with aside", "aside browser", "aside cli", "aside mcp", "aside repl", "aside daemon", "aside account", "aside devtools", "mcp-aside-devtools", "in aside", "capture repl evidence", "repl evidence capture", "deterministic signed-in proof", "sandboxed playwright repl", "replay this signed-in", "replay the signed-in", "signed-in replay", "fill out the form in my signed-in", "fill in the form in my signed-in"]},
    "BLADEBRO":         {"weight": 4, "keywords": ["bladebro", "bladebro cli", "bladebro mcp", "stealth browser", "bladebro rb", "mcp-bladebro", "agentic signed-in", "stealth signed-in", "agentic branching", "anti-detection browser", "attach to my open browser", "caller-owned browser", "browser i already have open", "already-open browser", "already open browser", "without getting flagged as a bot", "attach to the browser i have open", "without bot detection", "avoid bot detection"]},
}

RESOURCE_MAP = {
    "CHROME_DEVTOOLS": [
        "mcp-chrome-devtools/references/cdp-patterns.md",
        "mcp-chrome-devtools/references/session-management.md"
    ],
    "LIGHTHOUSE_TRACE": [
        "mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md",
        "mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md"
    ],
    "ASIDE_DEVTOOLS": [
        "mcp-aside-devtools/references/aside-cli-reference.md",
        "mcp-aside-devtools/references/mcp-wiring.md"
    ],
    "BLADEBRO": [
        "mcp-bladebro/references/cli-reference.md",
        "mcp-bladebro/references/mcp-wiring.md"
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant intent routes to one leaf set.
- `CHROME_DEVTOOLS` and `LIGHTHOUSE_TRACE` both belong to `mcp-chrome-devtools`, so a request that fires both loads the union of the two leaf sets.
- Each mode's deeper references (troubleshooting, browser lanes, install and verify, discovery fixtures) load on demand inside the packet, not on the first slice.
- No keyword match is the hub's defer fallback: confirm the browser mode before loading anything.

---

## 5. RELATED RESOURCES

- [`hub-router.json`](./hub-router.json): stage-one policy, signals, and vocabulary classes.
- [`mode-registry.json`](./mode-registry.json): the mode registry that maps each `workflowMode` to its packet.
- [`leaf-manifest.json`](./leaf-manifest.json): the generated inventory of routed leaves.
- [`SKILL.md`](./SKILL.md): the hub routing entry point.

---

## MACHINE ROUTER

The hub's routing directive. The stage-two maps live in section 3, so no second map belongs in this section.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt-stdin <<'TASK'
> <task>
> TASK
> ```
> Follow the returned decision: `route` uses its `targets`, `clarify` and `defer` ask for disambiguation, and `reject` refuses. On a `{"servingAuthority":"legacy"}` sentinel or any error, use the registry routing in `hub-router.json`. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing for every hub.

`mcp-browser-use` serves compiled routing by default, so the directive above returns a compiled decision. The legacy sentinel appears only when the kill flag is set, when the hub's activation manifest is stale or missing, or when the engine errors, and routing then uses `hub-router.json`. This hub returns `reject` only for a caller constraint, and the CLI front door takes none, so a CLI call never returns it. Prompt text alone never rejects.

```python
UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the browser outcome: inspection and debugging, deterministic signed-in proof, or stealth and agentic work",
    "Name the target page, and say whether it needs a signed-in account",
    "Confirm whether the request may change browser state or workspace files",
]
UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "resources": [],
    "checklist": UNKNOWN_FALLBACK_CHECKLIST,
}
```
