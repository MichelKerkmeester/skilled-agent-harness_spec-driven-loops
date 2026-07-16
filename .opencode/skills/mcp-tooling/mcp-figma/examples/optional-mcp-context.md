---
title: "Optional MCP Context Pull - Worked Walkthrough"
description: "Discovery-first walkthrough for the optional Framelink figma MCP via Code Mode, mirroring playbook scenario MCP-001. Read-only and opt-in."
trigger_phrases:
  - "figma mcp example"
  - "pull design context example"
  - "framelink discovery walkthrough"
version: 1.0.0.0
---

# Optional MCP Context Pull - Worked Walkthrough

The mcp-figma skill works fully with the CLI alone. This walkthrough covers the OPT-IN path only: pulling design context FROM Figma into the agent through the community Framelink `figma` manual registered in this repo's Code Mode. It mirrors playbook scenario MCP-001 and is read-only end to end.

> The official Figma Dev Mode MCP is out of scope (a future option only). Never present it as the supported wiring here.

---

## 1. PRECONDITIONS

- Code Mode is configured (`.utcp_config.json` contains the `figma` manual, stdio, `npx -y figma-developer-mcp --stdio`).
- A Figma personal access token is in `.env` as `figma_FIGMA_API_KEY`. Code Mode prefixes every manual's env vars with the manual name, so a bare `FIGMA_API_KEY` will NOT work.
- Never paste the token into user-facing output.

Snippets to verify or (re)create the manual and the `.env` line: [`../assets/utcp_figma_manual.md`](../assets/utcp_figma_manual.md) and [`../assets/env_template.md`](../assets/env_template.md).

---

## 2. STEP 1: DISCOVER, NEVER ASSUME

Confirm the manual and its tool names live before relying on any of them (SKILL.md NEVER rule 6):

```typescript
// In Code Mode
const tools = await list_tools();
// expect entries prefixed "figma." if the manual is registered

const info = await tool_info({ tool_name: "figma.figma_get_figma_data" });
// expect a concrete schema; a failure here means the manual or token is missing
```

Naming is `figma.figma_<tool>` (single dot plus underscore). The two live-confirmed tools are `figma.figma_get_figma_data` and `figma.figma_download_figma_images`. Verify the rest of the surface at runtime.

---

## 3. STEP 2: PULL DESIGN CONTEXT (READ-ONLY)

```typescript
call_tool_chain({
  code: `
    // 1) Confirm the tool exists before relying on it.
    const info = await tool_info({ tool_name: "figma.figma_get_figma_data" });
    // 2) Live-confirmed read tool: pull design data for a file/node.
    const data = await figma.figma_get_figma_data({ fileKey: "<file-key>" });
    return { ok: true, info };
  `
});
```

Treat both confirmed tools as read-only context pulls. The CLI (`figma-ds-cli`) remains the only surface for authoring or mutation, and every mutating or destructive CLI verb stays gated exactly as SKILL.md defines (confirmation, explicit target, rollback for destructive verbs).

---

## 4. FAILURE MODES

| What you see | Cause | Fix |
|---|---|---|
| `list_tools()` has no `figma` entries | Manual not registered in `.utcp_config.json` | Add the manual from [`../assets/utcp_figma_manual.md`](../assets/utcp_figma_manual.md), restart the session |
| `Variable 'figma_FIGMA_API_KEY' not found` | Bare `FIGMA_API_KEY` set instead of the prefixed key | Use `figma_FIGMA_API_KEY` in `.env` |
| A `figma.figma_<tool>` call fails | Tool name assumed instead of discovered | Run `search_tools()` / `tool_info()` first |

Full wiring detail: [`../references/mcp_wiring.md`](../references/mcp_wiring.md). Scenario contract: [`../manual_testing_playbook/optional_mcp/framelink_discovery.md`](../manual_testing_playbook/optional_mcp/framelink_discovery.md).
