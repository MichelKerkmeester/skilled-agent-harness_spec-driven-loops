---
name: mcp-browser-use
description: "Parent hub for three browser modes: Chrome DevTools, Aside and Bladebro. Routes by workflowMode through mode-registry.json."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, mcp__code_mode__call_tool_chain]
version: 1.1.5.0
metadata:
  family: mcp
---

<!-- Keywords: mcp-browser-use, mode-registry, hub-router, workflowMode, packetKind, mcp-chrome-devtools, mcp-aside-devtools, mcp-bladebro, chrome-devtools, cdp, aside-repl, bladebro, stealth-browser -->

# MCP Browser Use Hub (mcp-browser-use)

One skill, three browser modes, one advisor identity. The hub reads `hub-router.json` to resolve a `workflowMode`. It then delegates through `mode-registry.json`. The hub holds no per-mode logic. Each mode keeps its contract in its own packet.

`mcp-code-mode` is the shared MCP execution substrate for the modes that use Code Mode. It is external infrastructure, not a hub member.

**Version authority.** This file's `version` matches the newest entry under `changelog/`. The hub metadata files carry the same value.

---

## 1. WHEN TO USE

Use this hub for a request that names one of its three browser modes. It also fits a browser task that matches one of their outcomes.

| Mode | Use it for | Packet |
|------|------------|--------|
| **mcp-chrome-devtools** | Chrome DevTools inspection, debugging, console evidence, performance traces and attaching to the user's own Chrome | `mcp-chrome-devtools/` |
| **mcp-aside-devtools** | Deterministic signed-in REPL runs and captured REPL evidence through Aside | `mcp-aside-devtools/` |
| **mcp-bladebro** | Stealth browsing, agentic branching and attachment to a caller-owned or already-open browser that names no Chrome, through Bladebro | `mcp-bladebro/` |

### Capability Matrix

Each mode owns a distinct band. A row marked **MCP lane only** runs through Code Mode even when the mode's CLI is installed, because the CLI ships no command for it. Confirm MCP tool names with Code Mode discovery before calling them; this hub freezes no tool count.

| Capability | mcp-chrome-devtools | mcp-aside-devtools | mcp-bladebro |
|------------|---------------------|--------------------|--------------|
| Page model and DOM reads | `bdg dom query` / `dom eval`; MCP element tools | Playwright `page` API in `aside repl` | `see` model, content, outline and find |
| Actions | `bdg` session, `bdg cdp <Method>`, MCP clicks and forms | `aside "<task>"`, deterministic `aside repl` | `act` verbs and `run` plans with branches |
| Console and network | `bdg console --list`, CDP network methods | Not offered: Aside 1.26.626.1517 rejects console and network event listeners | `see logs` rings |
| HAR export | `bdg network har <path>` | Not offered | Not offered |
| Raw CDP | 300+ methods across 53 domains | Not offered | Not offered |
| Lighthouse audit | `lighthouse_audit`, **MCP lane only**; excludes performance | Not offered | Not offered |
| Performance trace | `performance_start_trace` / `performance_stop_trace` / `performance_analyze_insight`, **MCP lane only** | Performance API timing only | Not offered |
| Signed-in profile | `chrome_devtools_live --autoConnect` | Signed-in account by default | Attach to, clone or profile the caller's browser |
| Stealth | Not offered | Not offered | Stealth browsing |

### When NOT to Use

- A generic request to automate the browser with no tool named. The hub defers, so ask which mode the reader means.
- A quick read or edit with no browser step. Use the relevant skill directly.
- Shared MCP execution infrastructure with no browser bridge. Use `mcp-code-mode` directly.

---

## 2. SMART ROUTING

`hub-router.json` scores the request against its vocabulary classes. It then selects one `workflowMode`, an ordered bundle or a defer outcome. `mode-registry.json` maps that mode to its packet folder. The root [`ROUTER.md`](./ROUTER.md) maps the request to the selected mode's leaves and holds the fallback checklist, so read it before selecting a packet.

Generic browser-automation phrasing defers. Debugging, Lighthouse and performance-trace requests go to Chrome DevTools, and so does a request naming the user's own Chrome, through its live instance. Deterministic signed-in proof goes to Aside. Agentic or stealth signed-in work goes to Bladebro, and so does a caller-owned or already-open browser that names no Chrome.

Take the mode from the compiled front door first: `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt-stdin <<'TASK'`, the task, then `TASK`. The quoted heredoc keeps the shell from running anything in the task. Act on the decision: `route` loads its targets, `clarify` and `defer` ask, `reject` refuses. On a `{"servingAuthority":"legacy"}` sentinel or any error, use the `hub-router.json` routing above. `SPECKIT_COMPILED_ROUTING=0` forces legacy routing fleet-wide.

---

## 3. HOW IT WORKS

### Terms

- **`workflowMode`**: the public mode key the hub resolves to one browser packet.
- **`packetKind`**: the axis a mode sits on. Every mode here is `workflow`.
- **`backendKind`**: which backend runs the mode. Every mode here is `cli-plus-mcp`.
- **advisor routing class**: how the advisor finds a mode. Every mode here is `metadata`, so the advisor routes this hub and the hub picks the mode.
- **`mode-registry.json`**: the registry for each mode's identity, tool surface, aliases and advisor routing class.
- **`hub-router.json`**: stage one's policy, signals, vocabulary classes and tie-break order.
- **tie-break**: the order that ranks modes when more than one scores. Chrome DevTools comes before Aside. Aside comes before Bladebro.
- **`defer`**: the outcome that asks for disambiguation when generic browser phrasing names no mode.

### Layout

```text
mcp-browser-use/
  SKILL.md
  README.md
  mode-registry.json
  hub-router.json
  ROUTER.md
  description.json
  graph-metadata.json
  leaf-manifest.json
  leaf-scopes.json
  changelog/
  manual-testing-playbook/
  benchmark/
  shared/
  mcp-chrome-devtools/
  mcp-aside-devtools/
  mcp-bladebro/
```

### Companion metadata

- `mode-registry.json` owns the workflow mode, packet kind, backend kind, tool surface, packet identity, aliases and advisor routing class.
- `hub-router.json` owns stage-one policy, signals, vocabulary classes and tie-break order.
- `ROUTER.md` owns the hub routing directive and the stage-two maps: `INTENT_SIGNALS` and `RESOURCE_MAP` pick the selected mode's leaves.
- `leaf-scopes.json` adds the Chrome DevTools Lighthouse and performance-trace catalog leaf to that mode's routable leaves.
- `description.json` and the single hub `graph-metadata.json` provide advisor discovery without a second identity for any mode.
- `leaf-manifest.json` is generated from packet resources. Never hand-edit it.

### Mode boundaries

Each mode keeps its own safety contract in its packet. This hub does not restate those contracts, so a reader who needs a mode's rules opens that mode's `SKILL.md`.

---

## 4. RULES

### ALWAYS

- Resolve packets through `mode-registry.json`. Packet roots are never hardcoded in routing logic.
- Keep this hub thin. Command and tool behavior belongs in the nested packet.
- Keep registry modes and router signal keys bidirectionally aligned.
- Replay positive and negative routing cases whenever aliases or signal classes change.

### NEVER

- Never add a second packet array or a second advisor identity for a hub member.
- Never route generic browser-automation phrasing to a mode. Defer instead.
- Never move `mcp-code-mode` into this hub.

### ESCALATE IF

- A new mode cannot be classified against the existing outcomes.
- Registry modes, stage-one signals or generated manifest entries disagree.
- A debugging request and a signed-in request need one packet, so the boundary between modes is no longer clear.

---

## 5. REFERENCES

- [`mode-registry.json`](mode-registry.json): canonical mode identity and tool surface.
- [`hub-router.json`](hub-router.json): stage-one policy and signal classes.
- [`ROUTER.md`](ROUTER.md): the hub routing directive and its fallback checklist.
- [`README.md`](README.md): operator-facing hub overview.
