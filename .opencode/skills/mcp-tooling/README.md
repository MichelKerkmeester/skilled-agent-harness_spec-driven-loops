---
title: mcp-tooling
description: Parent hub for MCP tool bridges — routes to mcp-chrome-devtools (browser inspection), mcp-click-up (ClickUp task management), and the mcp-figma transport (Figma Desktop) through mode-registry.json.
trigger_phrases:
  - "chrome devtools"
  - "clickup task"
  - "figma cli"
  - "mcp tool bridge"
version: 1.0.0.0
---

# mcp-tooling

> One advisor identity, two workflow packets plus one figma transport: browser debugging, ClickUp task management, and a read-only bridge to Figma Desktop.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Browser debugging/automation, ClickUp task operations, and driving Figma Desktop from the terminal |
| **Invoke with** | Keyword routing through Gate 2 — none of the three modes has a bound slash command; `/doctor:mcp` covers install/debug separately |
| **Routes to** | `mcp-chrome-devtools/` or `mcp-click-up/` (both mutating workflow packets) or `mcp-figma/` (read-only transport) via `mode-registry.json` |
| **Produces** | Browser captures/automation, ClickUp task state changes, or Figma Desktop reads/exports (never a design decision — pairs with `sk-design` for that) |

---

## 2. OVERVIEW

`mcp-tooling` is a parent hub: it holds no packet-local logic and routes every request to exactly one of three nested packets through `mode-registry.json` and `hub-router.json`.

- **`mcp-chrome-devtools/`** — browser debugging and automation via the `bdg` CLI (fast, token-efficient) with an MCP fallback through Code Mode. See `mcp-chrome-devtools/README.md`.
- **`mcp-click-up/`** — ClickUp task management: `cupt` CLI for daily ops, the official ClickUp MCP for documents/goals/bulk operations. See `mcp-click-up/README.md`.
- **`mcp-figma/`** _(transport)_ — drives Figma Desktop from the terminal via `figma-ds-cli`. Read-only in this workspace (`mutatesWorkspace:false`); writes land only in Figma Desktop. Mandatory cross-hub pairing with `sk-design` before any design-affecting operation — the transport never decides taste. See `mcp-figma/README.md`.

All three packets keep their own `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, and `changelog/`. The hub carries the single `graph-metadata.json` advisor identity for all three. `mcp-code-mode` — the shared MCP execution substrate all three reach through — is excluded and stays a flat standalone skill; it is not a hub member.

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
| `mcp-code-mode` | Shared MCP execution substrate all three modes reach via the unchanged `code_mode` registration key. External infrastructure, not a hub member. |
| `sk-design` | Mandatory cross-hub judgment partner for the `mcp-figma` transport — the transport never decides taste on its own. |
| `sk-code` | Consumes browser-debugging output (WEB stack route), ClickUp task context, and Figma exports/DESIGN.md as implementation input. |
| `sk-doc` | Documentation/component authoring — the sibling parent hub this one's structure mirrors. |

---

## 5. VERIFICATION

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/mcp-tooling
```

Expected: 0 invariant failures, 0 warnings (`PARENT_HUB_CHECK_STRICT=1`).
