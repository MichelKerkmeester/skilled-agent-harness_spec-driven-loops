---
name: mcp-tooling
description: "Parent hub for MCP tool bridges: routes to three workflow modes (mcp-chrome-devtools, mcp-click-up, mcp-aside-devtools) plus three design transports (mcp-figma, mcp-refero, mcp-mobbin) through mode-registry.json. Holds no per-mode logic; dispatches by workflowMode."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.3.0.0
metadata:
  author: OpenCode
  family: mcp
---

<!-- Keywords: mcp-tooling, mode-registry, hub-router, workflowMode, packetKind, transport-axis, mcp-chrome-devtools, chrome-devtools, cdp, browser-debugger-cli, bdg, mcp-click-up, clickup, cupt, task-management, mcp-aside-devtools, aside, aside-browser, agentic-browser, aside-mcp, mcp-refero, refero, design-reference, mcp-mobbin, mobbin, app-design-research, mcp-figma, figma-cli, figma-ds-cli, figma-desktop, mcp-code-mode -->

# MCP Tooling Hub (mcp-tooling)

One skill, three workflow bridges plus three design transports, one shared `family: mcp` identity. `mcp-tooling` is the public, advisor-routable home for every MCP tool bridge in this repo. Before routing, the hub reads `hub-router.json` to resolve a `workflowMode`, then delegates through `mode-registry.json`. This hub holds NO per-mode logic — each mode keeps its own contract in its packet, and the hub only routes by `workflowMode`. `mcp-code-mode` is the shared MCP execution substrate all modes reach through the unchanged `code_mode` registration key; it is external infrastructure, not a hub member, and stays a flat standalone skill.

---

## 1. WHEN TO USE

Use this skill (through the hub) for any MCP tool-bridge workflow. Invoke it as `mcp-tooling`; the hub classifies the request, resolves a mode key, and loads the matching nested packet.

| Mode | Kind | Use it for | Packet |
|------|------|-----------|--------|
| **mcp-chrome-devtools** | workflow | Browser debugging and automation: screenshots, DOM inspection, console/network capture, Lighthouse, via CLI (`bdg`) with an MCP fallback | `mcp-tooling/mcp-chrome-devtools/` |
| **mcp-click-up** | workflow | ClickUp task management: daily ops via `cupt` CLI, documents/goals/bulk ops via the official MCP | `mcp-tooling/mcp-click-up/` |
| **mcp-aside-devtools** | workflow | AI-browser automation via the Aside browser: agentic `aside` CLI tasks, deterministic `aside repl` evidence capture, `aside mcp` via Code Mode fallback | `mcp-tooling/mcp-aside-devtools/` |
| **mcp-figma** _(transport)_ | transport | Drive Figma Desktop from the terminal via `figma-ds-cli` — a bridge that writes only to Figma Desktop, never this workspace, always paired with `sk-design` for design judgment | `mcp-tooling/mcp-figma/` |
| **mcp-refero** _(transport)_ | transport | Search real-app UI design references via the Refero MCP (Code Mode, read-only) — screens, flows, styles; always paired with `sk-design` for design judgment | `mcp-tooling/mcp-refero/` |
| **mcp-mobbin** _(transport)_ | transport | App/screen/flow design research via the Mobbin MCP (Code Mode, read-only) — mobile UX patterns from real apps; always paired with `sk-design` for design judgment | `mcp-tooling/mcp-mobbin/` |

### When NOT to Use

- A single quick read/edit with no MCP tool-bridge need — use the relevant skill directly.
- Design judgment itself — `mcp-figma`, `mcp-refero`, and `mcp-mobbin` are transports, never the taste authority; load `sk-design` first (mandatory cross-hub pairing, ADR-002).
- Shared MCP orchestration infrastructure beyond these bridges — use `mcp-code-mode` directly; it is excluded from this hub and stays flat (ADR-005).

---

## 2. SMART ROUTING

Routing is registry-driven. `mode-registry.json` lists all six modes (three workflow, three transport) in one `modes[]` array. `hub-router.json` decides whether the result is a single mode, an ordered bundle, or a deferred disambiguation.

### Two-Axis Model

- `packetKind: "workflow"` — `mcp-chrome-devtools`, `mcp-click-up`, and `mcp-aside-devtools` mutate this repo's workspace (`mutatesWorkspace:true`).
- `packetKind: "transport"` — `mcp-figma` (Figma Desktop), `mcp-refero` (Refero remote MCP via Code Mode), and `mcp-mobbin` (Mobbin remote MCP via Code Mode) bridge to external tools and never mutate this workspace (`mutatesWorkspace:false`); declared on the `transport-axis` extension with a mandatory cross-hub judgment pairing to `sk-design`.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak (workflow modes first, transport last)
  -> read mode-registry.json for packetKind, backendKind, toolSurface, and advisorRouting
  -> load the selected packet(s)
```

### Outcomes

- `single`: one dominant tool signal routes to one mode.
- `orderedBundle`: multiple explicitly requested tools route in tie-break order.
- `defer`: unclear or contradictory tool intent asks for disambiguation — the router does not silently default to `mcp-chrome-devtools` on genuine ambiguity.

---

## 3. HOW IT WORKS

### Layout

```text
mcp-tooling/
  SKILL.md
  mode-registry.json
  hub-router.json
  description.json
  graph-metadata.json
  changelog/
  manual_testing_playbook/
  benchmark/
  mcp-chrome-devtools/
    SKILL.md
    README.md
    INSTALL_GUIDE.md
    changelog/
  mcp-click-up/
    SKILL.md
    README.md
    INSTALL_GUIDE.md
    changelog/
  mcp-aside-devtools/
    SKILL.md
    README.md
    INSTALL_GUIDE.md
    changelog/
  mcp-figma/
    SKILL.md
    README.md
    INSTALL_GUIDE.md
    changelog/
  mcp-refero/
    SKILL.md
    README.md
    INSTALL_GUIDE.md
    changelog/
  mcp-mobbin/
    SKILL.md
    README.md
    INSTALL_GUIDE.md
    changelog/
```

### Companion Metadata

- `mode-registry.json` owns `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet folder identity, alias phrases, and `advisorRouting`.
- `hub-router.json` owns `routerPolicy`, `routerSignals`, `vocabularyClasses`.
- `description.json` owns advisor-facing summary fields.
- `graph-metadata.json` owns the one skill-graph identity node for the whole hub (`family: mcp`), unioning the member packets' intent signals and outward edges (`mcp-figma depends_on sk-design`, the union of `enhances sk-code`), and recording `mcp-code-mode` as an external cross-skill dependency.

### Transport Cross-Hub Pairing

`mcp-figma`, `mcp-refero`, and `mcp-mobbin` never perform design judgment themselves. Their mandatory judgment partner is `sk-design` — a DIFFERENT hub — licensed by the `transport-axis` extension's `crossHubPairing` field (ADR-002). Load `sk-design`'s own workflow modes before any design-affecting Figma operation or Refero-grounded design decision; the transports never decide taste.

---

## 4. RULES

### ✅ ALWAYS

- Resolve packets through `mode-registry.json`; never hardcode packet roots in prose-only logic.
- Keep `SKILL.md` thin: routing, invariants, and navigation only.
- Keep every packet in `modes[]` and give every packet a `packetKind`.
- Keep every transport (`mcp-figma`, `mcp-refero`, `mcp-mobbin`) read-only in this workspace (`mutatesWorkspace:false`), paired with `sk-design` for judgment.
- Keep exactly one `graph-metadata.json`, at the hub root.
- Keep `hub-router.json` signal keys and registry `workflowMode` values bidirectionally aligned.

### ⛔ NEVER

- Never add a second packet array.
- Never grant a transport (`mcp-figma`, `mcp-refero`, `mcp-mobbin`) `Write`/`Edit`/`Task` — they forbid all three.
- Never add packet-local `graph-metadata.json` files.
- Never move `mcp-code-mode` into this hub — it is shared infrastructure serving consumers beyond these bridges (ADR-005).
- Never let a transport make a design decision without `sk-design`'s judgment.

### ⚠️ ESCALATE IF

- A packet cannot be classified as `workflow` or `transport`.
- A transport needs a design decision with no `sk-design` pairing available.
- Router signals, vocabulary classes, and registry modes cannot be made bidirectionally consistent.

---

## 5. REFERENCES

- Registry: `mode-registry.json`.
- Router: `hub-router.json`.
- Advisor description: `description.json`.
- Skill graph identity: `graph-metadata.json`.
- Workflow packets: `mcp-chrome-devtools/SKILL.md`, `mcp-click-up/SKILL.md`, `mcp-aside-devtools/SKILL.md`.
- Transport packets: `mcp-figma/SKILL.md`, `mcp-refero/SKILL.md`, `mcp-mobbin/SKILL.md`.
- Judgment partner for the transports: `../sk-design/SKILL.md`.
- Shared MCP execution substrate (external, not a hub member): `../mcp-code-mode/SKILL.md`.
