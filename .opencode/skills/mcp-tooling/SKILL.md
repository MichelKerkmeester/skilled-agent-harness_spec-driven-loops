---
name: mcp-tooling
description: "Parent hub for MCP tool bridges: routes to five workflow modes (mcp-chrome-devtools, mcp-click-up, mcp-obsidian for Obsidian vault note-management and markdown-note management via notesmd-cli, the official obsidian CLI, and the cyanheads MCP, mcp-aside-devtools, and mcp-notion for Notion workspace operations via the official @notionhq/notion-mcp-server over Code Mode) plus four design transports (mcp-figma, mcp-refero, mcp-mobbin, and mcp-magicpath for MagicPath component and design-system lookup over a UTCP cli manual, its provider shipping no MCP server) through mode-registry.json. Holds no per-mode logic; dispatches by workflowMode."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.6.1.0
metadata:
  author: OpenCode
  family: mcp
---

<!-- Keywords: mcp-tooling, mode-registry, hub-router, workflowMode, packetKind, transport-axis, mcp-chrome-devtools, chrome-devtools, cdp, browser-debugger-cli, bdg, mcp-click-up, clickup, cupt, task-management, mcp-aside-devtools, aside, aside-browser, agentic-browser, aside-mcp, mcp-refero, refero, design-reference, mcp-mobbin, mobbin, app-design-research, mcp-figma, figma-cli, figma-ds-cli, figma-desktop, mcp-code-mode, mcp-obsidian, obsidian, obsidian-vault, notesmd-cli, obsidian-mcp, note-management, markdown-notes, iconic, iconic-rulebook, icon-rules, icon-automation, file-icons, folder-icons, mcp-notion, notion, notion-mcp, notion-api, notion-database, notion-data-source, notion-page, notion-property, notion-relation, notion-rollup, notion-formula, notion-token, ntn_, notion-markdown, mcp-tooling smart routing, mcp tool bridge surface router, mcp tool leaf routing, mcp tool bridge resource map -->

# MCP Tooling Hub (mcp-tooling)

One skill, five workflow bridges plus four design transports, one shared `family: mcp` identity. `mcp-tooling` is the public, advisor-routable home for every MCP tool bridge in this repo. Before routing, the hub reads `hub-router.json` to resolve a `workflowMode`, then delegates through `mode-registry.json`. This hub holds NO per-mode logic — each mode keeps its own contract in its packet, and the hub only routes by `workflowMode`. `mcp-code-mode` is the shared MCP execution substrate all modes reach through the unchanged `code_mode` registration key; it is external infrastructure, not a hub member, and stays a flat standalone skill.

---

## 1. WHEN TO USE

Use this skill (through the hub) for any MCP tool-bridge workflow. Invoke it as `mcp-tooling`; the hub classifies the request, resolves a mode key, and loads the matching nested packet.

| Mode | Kind | Use it for | Packet |
|------|------|-----------|--------|
| **mcp-chrome-devtools** | workflow | Browser debugging and automation: screenshots, DOM inspection, console/network capture, Lighthouse, via CLI (`bdg`) with an MCP fallback | `mcp-tooling/mcp-chrome-devtools/` |
| **mcp-click-up** | workflow | ClickUp task management: daily ops via `cupt` CLI, documents/goals/bulk ops via the official MCP | `mcp-tooling/mcp-click-up/` |
| **mcp-obsidian** | workflow | Obsidian vault and note management plus Iconic `data.json` rulebook automation: headless `notesmd-cli`, app-backed `obsidian` CLI, and the cyanheads MCP | `mcp-tooling/mcp-obsidian/` |
| **mcp-aside-devtools** | workflow | AI-browser automation via the Aside browser: agentic `aside` CLI tasks, deterministic `aside repl` evidence capture, `aside mcp` via Code Mode fallback | `mcp-tooling/mcp-aside-devtools/` |
| **mcp-notion** | workflow | Notion workspace operations via the official `@notionhq/notion-mcp-server` (24 tools) over Code Mode, direct Notion API for 5 gaps, plus the data-source / property / relation / rollup knowledge layer | `mcp-tooling/mcp-notion/` |
| **mcp-figma** _(transport)_ | transport | Drive Figma Desktop from the terminal via `figma-ds-cli` — document mutation lands in Figma Desktop (local writes limited to explicit-path exports per the registry's workspaceWrites clarifier), always paired with `sk-design-md-generator` for a measured Style Reference | `mcp-tooling/mcp-figma/` |
| **mcp-refero** _(transport)_ | transport | Search real-app UI design references via the Refero MCP (Code Mode, read-only) — screens, flows, styles; always paired with `sk-design-md-generator` for a measured Style Reference | `mcp-tooling/mcp-refero/` |
| **mcp-mobbin** _(transport)_ | transport | App/screen/flow design research via the Mobbin MCP (Code Mode, read-only) — mobile UX patterns from real apps; always paired with `sk-design-md-generator` for a measured Style Reference | `mcp-tooling/mcp-mobbin/` |
| **mcp-magicpath** _(transport)_ | transport | Component, project, team, design-system and canvas lookup via the `magicpath-ai` Node CLI over Code Mode's UTCP cli transport (read-only; its provider ships no MCP server) | `mcp-tooling/mcp-magicpath/` |

### When NOT to Use

- A single quick read/edit with no MCP tool-bridge need — use the relevant skill directly.
- A measured Style Reference (extracted design tokens) — `mcp-figma`, `mcp-refero`, and `mcp-mobbin` are transports that surface or drive reference material, never a source of measured tokens; use `sk-design-md-generator` to extract a Style Reference from a live source (mandatory cross-hub pairing). `mcp-magicpath` is the exception: its themes already return named CSS variables and fonts, so it pairs unconditionally with `sk-design` (the decide skill) instead, and reaches for `sk-design-md-generator` only when the reference is an external live site.
- Shared MCP orchestration infrastructure beyond these bridges — use `mcp-code-mode` directly; it is excluded from this hub and stays flat (ADR-005).

---

## 2. SMART ROUTING

Routing is two-stage. Stage 1 (hub → mode): the compiled router / `hub-router.json` scores the request and resolves it to one workflow mode — or an ordered bundle — per `mode-registry.json`. Stage 2 (mode → leaves): the surface router below maps the request's tool-bridge intent to the exact packet-local leaf resources that mode loads. The two layers stay separate: the hub never emits leaf paths, and the surface router never re-decides the mode. The surface router is a first-class document at the hub root — `ROUTER.md` — carrying the intent model, the machine-readable `INTENT_SIGNALS` / `RESOURCE_MAP` block, and the how-to-read rules.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .opencode/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `mcp-tooling`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### Two-Axis Model

- `packetKind: "workflow"` — `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, and `mcp-notion` mutate this repo's workspace (`mutatesWorkspace:true`).
- `packetKind: "transport"` — `mcp-figma` (Figma Desktop), `mcp-refero` (Refero remote MCP via Code Mode), `mcp-mobbin` (Mobbin remote MCP via Code Mode), and `mcp-magicpath` (MagicPath vendor CLI via a Code Mode UTCP `cli` manual) bridge to external tools and never mutate this workspace (`mutatesWorkspace:false`); declared on the `transport-axis` extension, each with a mandatory cross-hub pairing that supplies the design judgment the transport never issues itself — `sk-design-md-generator` for the first three (measured design-reference extraction), `sk-design` for `mcp-magicpath` (decide, since its themes are already tokenised).

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak (workflow modes first, transport last)
  -> read mode-registry.json for packetKind, backendKind, toolSurface, and advisorRouting
  -> load the selected packet(s)
```

A scored route loads exactly the selected mode's declared resources. `routerPolicy.defaultResource` is **fallback-only**: it is consulted solely when no mode scores (the zero-signal branch), and then only as the defer-time suggestion — it is never unioned into a scored route's resource set. Hub-identity vocabulary (and other `routerPolicy.discoveryClasses`) is discovery/defer evidence only, never per-mode scoring signal.

### Outcomes

- `single`: one dominant tool signal routes to one mode.
- `orderedBundle`: multiple explicitly requested tools route in tie-break order.
- `defer`: unclear or contradictory tool intent asks for disambiguation — the router does not silently default to `mcp-chrome-devtools` on genuine ambiguity.

### Surface Router — per-mode leaf sets

Stage 2 of routing lives in `ROUTER.md` at the hub root, next to `SKILL.md` and `README.md`. It defines the per-mode leaf-intent model (all eight modes plus the two deliberate absences: a bare tool-bridge phrase fires no intent and defers at the hub; provider-neutral design-research phrasing defers between `mcp-refero` and `mcp-mobbin`), the machine-readable `DEFAULT_RESOURCE` / `INTENT_SIGNALS` / `RESOURCE_MAP` block that the deterministic router-replay and benchmarks parse, and the how-to-read rules (dominant intent → one leaf set; near-tied intents → deduped union, the `orderedBundle` outcome; no keyword match → hub `defer`, never a silent default to `mcp-chrome-devtools`). Every `RESOURCE_MAP` path is packet-qualified and converts to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

`ROUTER.md` stays a separate document on purpose: the router-replay contract resolves the hub's mode from `hub-router.json` and reads the leaf sets from the surface document — the machine block must not move into `SKILL.md` (the replay would treat it as the hub's own router and lose the mode projection) or into `hub-router.json` (schema handoff-ambiguity rule).

---

## 3. HOW IT WORKS

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
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
  mcp-click-up/
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
  mcp-obsidian/
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
  mcp-aside-devtools/
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
  mcp-notion/
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
  mcp-figma/
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
  mcp-refero/
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
  mcp-mobbin/
    SKILL.md
    README.md
    INSTALL-GUIDE.md
    changelog/
```

### Companion Metadata

- `mode-registry.json` owns `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet folder identity, alias phrases, and `advisorRouting`.
- `hub-router.json` owns `routerPolicy`, `routerSignals`, `vocabularyClasses`.
- `description.json` owns advisor-facing summary fields.
- `graph-metadata.json` owns the one skill-graph identity node for the whole hub (`family: mcp`), unioning the member packets' intent signals and outward edges (`mcp-figma depends_on sk-design-md-generator`, the union of `enhances sk-code`), and recording `mcp-code-mode` as an external cross-skill dependency.

### Transport Cross-Hub Pairing

`mcp-figma`, `mcp-refero`, and `mcp-mobbin` never produce a measured design reference themselves. Their cross-hub pairing is `sk-design-md-generator` — a DIFFERENT skill — licensed by the `transport-axis` extension's `crossHubPairing` field. Use `sk-design-md-generator` to extract a measured Style Reference (design tokens) from a live source when a design-affecting Figma operation or a Refero/Mobbin-grounded design decision needs measured ground truth; the transports themselves never decide taste or emit a Style Reference.

---

## 4. RULES

### ✅ ALWAYS

- Resolve packets through `mode-registry.json`; never hardcode packet roots in prose-only logic.
- Keep `SKILL.md` thin: routing, invariants, and navigation only.
- Keep every packet in `modes[]` and give every packet a `packetKind`.
- Keep every transport (`mcp-figma`, `mcp-refero`, `mcp-mobbin`) read-only in this workspace (`mutatesWorkspace:false`), paired with `sk-design-md-generator` for measured design-reference extraction.
- Keep exactly one `graph-metadata.json`, at the hub root.
- Keep `hub-router.json` signal keys and registry `workflowMode` values bidirectionally aligned.
- Keep the surface router's `RESOURCE_MAP` in sync with `leaf-manifest.json` — the leaf sets dual-read to canonical typed pairs at the one contract boundary (`sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`).
- Keep every `RESOURCE_MAP` path packet-qualified (`<packet>/references|assets/…`) and resolving on disk.

### ⛔ NEVER

- Never add a second packet array.
- Never grant a transport (`mcp-figma`, `mcp-refero`, `mcp-mobbin`) `Write`/`Edit`/`Task` — they forbid all three.
- Never add packet-local `graph-metadata.json` files.
- Never move `mcp-code-mode` into this hub — it is shared infrastructure serving consumers beyond these bridges (ADR-005).
- Never treat a transport's output as a measured Style Reference or a taste verdict — extract measured tokens with `sk-design-md-generator` from a live source instead.

### ⚠️ ESCALATE IF

- A packet cannot be classified as `workflow` or `transport`.
- A transport's reference material needs measured tokens but no live source is available for `sk-design-md-generator` to extract.
- Router signals, vocabulary classes, and registry modes cannot be made bidirectionally consistent.

---

## 5. REFERENCES

- Registry: `mode-registry.json`.
- Router: `hub-router.json`.
- Surface router: `ROUTER.md`.
- Advisor description: `description.json`.
- Skill graph identity: `graph-metadata.json`.
- Workflow packets: `mcp-chrome-devtools/SKILL.md`, `mcp-click-up/SKILL.md`, `mcp-obsidian/SKILL.md`, `mcp-aside-devtools/SKILL.md`, `mcp-notion/SKILL.md`.
- Transport packets: `mcp-figma/SKILL.md`, `mcp-refero/SKILL.md`, `mcp-mobbin/SKILL.md`.
- Measured design-reference partner for the transports: `../sk-design-md-generator/SKILL.md`.
- Shared MCP execution substrate (external, not a hub member): `../mcp-code-mode/SKILL.md`.
