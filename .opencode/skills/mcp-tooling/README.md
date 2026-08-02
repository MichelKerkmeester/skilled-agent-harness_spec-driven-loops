---
title: mcp-tooling
description: Parent hub for MCP tool bridges — routes to six registered transport/workflow modes through the hub manifest and mode registry.
trigger_phrases:
  - "chrome devtools"
  - "clickup task"
  - "figma cli"
  - "mcp tool bridge"
version: 1.0.0.0
---

# mcp-tooling

> One advisor identity across six registered modes: Aside, Chrome DevTools, ClickUp, Figma, Mobbin, and Refero.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Browser debugging, ClickUp task operations, Figma transport, and design-research retrieval through the registered MCP bridges |
| **Invoke with** | Keyword routing through Gate 2; `/doctor:mcp` covers install/debug separately |
| **Routes to** | `mcp-aside-devtools/`, `mcp-chrome-devtools/`, `mcp-click-up/`, `mcp-figma/`, `mcp-mobbin/`, or `mcp-refero/` via `leaf-manifest.json` and `mode-registry.json` |
| **Produces** | Browser captures/automation, ClickUp task state changes, Figma transport output, or design-research evidence (never a design decision — pairs with `sk-design` for that) |

---

## 2. OVERVIEW

`mcp-tooling` is a parent hub: it holds no packet-local logic and routes every request to one of six registered modes. The authoritative current list is the hub's `leaf-manifest.json`.

- **`mcp-aside-devtools/`** — Aside DevTools transport.
- **`mcp-chrome-devtools/`** — browser debugging and automation.
- **`mcp-click-up/`** — ClickUp task management.
- **`mcp-figma/`** — Figma transport; pair with `sk-design` for design judgment.
- **`mcp-mobbin/`** — Mobbin design-research transport.
- **`mcp-refero/`** — Refero design-research transport.

Each mode owns its packet-local contract and resources. `mcp-code-mode` — the shared MCP execution substrate the modes reach through — is excluded and stays a flat standalone skill; it is not a hub member. The six-mode topology is anchored by `.opencode/skills/mcp-tooling/leaf-manifest.json:2`.

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
