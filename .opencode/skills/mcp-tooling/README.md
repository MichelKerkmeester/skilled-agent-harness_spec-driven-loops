---
title: mcp-tooling
<<<<<<< HEAD
description: Parent hub for MCP tool bridges — routes four workflow modes (including Obsidian vault and markdown-note management through mcp-obsidian) and three design transports through mode-registry.json.
=======
description: Parent hub for MCP tool bridges — routes to seven registered transport/workflow modes through the hub manifest and mode registry.
>>>>>>> origin/skilled/v4.0.0.0
trigger_phrases:
  - "chrome devtools"
  - "clickup task"
  - "obsidian vault"
  - "notesmd-cli"
  - "figma cli"
  - "mcp tool bridge"
version: 1.0.0.0
---

# mcp-tooling

<<<<<<< HEAD
> One advisor identity, seven modes: four workflow bridges plus three design transports.
=======
> One advisor identity across seven registered modes: Aside, Chrome DevTools, ClickUp, Figma, Mobbin, Obsidian, and Refero.
>>>>>>> origin/skilled/v4.0.0.0

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
<<<<<<< HEAD
| **Use it for** | Browser debugging/automation, ClickUp task operations, Obsidian vault and markdown-note management, Aside browser automation, Figma Desktop transport, Refero web UI reference search, and Mobbin mobile-app design research |
| **Invoke with** | Keyword routing through Gate 2 — none of the seven modes has a bound slash command; `/doctor:mcp` covers install/debug separately |
| **Routes to** | All seven packet directories via `mode-registry.json` and `hub-router.json`: four mutating workflow bridges and three read-only design transports |
| **Produces** | Browser evidence, ClickUp task state changes, Obsidian note/vault operations, Aside browser evidence, Figma reads/exports, and Refero/Mobbin research (design decisions pair with `sk-design`) |
=======
| **Use it for** | Browser debugging, ClickUp task operations, Obsidian vault and markdown-note management, Figma transport, and design-research retrieval through the registered MCP bridges |
| **Invoke with** | Keyword routing through Gate 2; `/doctor:mcp` covers install/debug separately |
| **Routes to** | `mcp-aside-devtools/`, `mcp-chrome-devtools/`, `mcp-click-up/`, `mcp-figma/`, `mcp-mobbin/`, `mcp-obsidian/`, or `mcp-refero/` via `leaf-manifest.json` and `mode-registry.json` |
| **Produces** | Browser captures/automation, ClickUp task state changes, Figma transport output, or design-research evidence (never a design decision — pairs with `sk-design` for that) |
>>>>>>> origin/skilled/v4.0.0.0

---

## 2. OVERVIEW

<<<<<<< HEAD
`mcp-tooling` is a parent hub: it holds no packet-local logic and routes every request to exactly one of seven nested packets through `mode-registry.json` and `hub-router.json`.

- **`mcp-chrome-devtools/`** — browser debugging and automation via the `bdg` CLI (fast, token-efficient) with an MCP fallback through Code Mode. See `mcp-chrome-devtools/README.md`.
- **`mcp-click-up/`** — ClickUp task management: `cupt` CLI for daily ops, the official ClickUp MCP for documents/goals/bulk operations. See `mcp-click-up/README.md`.
- **`mcp-obsidian/`** — Obsidian vault and markdown-note management through headless `notesmd-cli`, the official app-backed `obsidian` CLI, and the cyanheads MCP. See `mcp-obsidian/README.md`.
- **`mcp-aside-devtools/`** — agentic browser tasks through the Aside CLI, deterministic REPL evidence capture, and the MCP fallback. See `mcp-aside-devtools/README.md`.
- **`mcp-figma/`** _(transport)_ — drives Figma Desktop from the terminal via `figma-ds-cli`. Read-only in this workspace (`mutatesWorkspace:false`); writes land only in Figma Desktop. Mandatory cross-hub pairing with `sk-design` before any design-affecting operation — the transport never decides taste. See `mcp-figma/README.md`.
- **`mcp-refero/`** _(transport)_ — searches real-app web UI references through the Refero MCP, read-only via Code Mode, paired with `sk-design` for design judgment. See `mcp-refero/README.md`.
- **`mcp-mobbin/`** _(transport)_ — researches mobile app screens, flows, and UX patterns through the Mobbin MCP, read-only via Code Mode, paired with `sk-design` for design judgment. See `mcp-mobbin/README.md`.

All seven packets keep their own `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, and `changelog/`. The hub carries the single `graph-metadata.json` advisor identity for all seven. `mcp-code-mode` — the shared MCP execution substrate the CLI-plus-MCP workflows and design transports reach through — is excluded and stays a flat standalone skill; it is not a hub member.
=======
`mcp-tooling` is a parent hub: it holds no packet-local logic and routes every request to one of seven registered modes. The authoritative current list is the hub's `leaf-manifest.json`.

- **`mcp-aside-devtools/`** — Aside DevTools transport.
- **`mcp-chrome-devtools/`** — browser debugging and automation.
- **`mcp-click-up/`** — ClickUp task management.
- **`mcp-figma/`** — Figma transport; pair with `sk-design` for design judgment.
- **`mcp-mobbin/`** — Mobbin design-research transport.
- **`mcp-obsidian/`** — Obsidian vault and markdown-note management via a headless CLI and MCP.
- **`mcp-refero/`** — Refero design-research transport.

Each mode owns its packet-local contract and resources. `mcp-code-mode` — the shared MCP execution substrate the modes reach through — is excluded and stays a flat standalone skill; it is not a hub member. The seven-mode topology is anchored by `.opencode/skills/mcp-tooling/leaf-manifest.json:2`.
>>>>>>> origin/skilled/v4.0.0.0

---

## 3. QUICK START

**Browser debugging:**

```text
Use Chrome DevTools to capture a HAR for the staging dashboard.
```

**ClickUp task management:**

```text
Mark the ClickUp task done and add a note that it shipped.
```

**Figma (transport — pair with sk-design for design judgment):**

```text
Render this component in Figma and export the design tokens.
```

---

## 4. RELATED SKILLS

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Shared MCP execution substrate used by the CLI-plus-MCP workflows and remote transports via the unchanged `code_mode` registration key. External infrastructure, not a hub member. |
| `sk-design` | Mandatory cross-hub judgment partner for the three design transports — the transports never decide taste on their own. |
| `sk-code` | Consumes browser-debugging output, ClickUp task context, Obsidian note context, Aside evidence, Figma exports/DESIGN.md, and Refero/Mobbin research as implementation input. |
| `sk-doc` | Documentation/component authoring — the sibling parent hub this one's structure mirrors. |

---

## 5. VERIFICATION

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/mcp-tooling
```

Expected: 0 invariant failures, 0 warnings (`PARENT_HUB_CHECK_STRICT=1`).
