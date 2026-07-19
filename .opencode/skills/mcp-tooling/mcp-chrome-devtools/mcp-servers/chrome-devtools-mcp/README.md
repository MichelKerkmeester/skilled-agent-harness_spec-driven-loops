---
title: "chrome-devtools-mcp"
description: "The Chrome DevTools MCP server behind the chrome_devtools_1 and chrome_devtools_2 Code Mode manuals. A manual registration, not a vendored server."
trigger_phrases:
  - "chrome devtools mcp server"
  - "chrome_devtools_1 server"
  - "chrome devtools code mode"
version: 1.0.0.0
---

# chrome-devtools-mcp

> Nothing to install here. The Chrome DevTools MCP server runs on demand via `npx`, configured entirely in `.utcp_config.json` behind the `chrome_devtools_1` and `chrome_devtools_2` manuals.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Confirming how the Chrome DevTools MCP fallback is configured. There is no local package to install. |
| **Invoke with** | Code Mode `call_tool_chain()` with `chrome_devtools_N.chrome_devtools_N_<tool_name>`. |
| **Works on** | `npx chrome-devtools-mcp` over stdio with `--isolated=true`, launched by Code Mode on demand. |
| **Produces** | 26 exposed browser tools (navigation, screenshots, console, viewport, clicks, page management) per registered instance. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-chrome-devtools routes multi-tool and parallel-browser work — the surfaces the sequential-only `bdg` CLI cannot reach — to the Chrome DevTools MCP server ([ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), Apache-2.0). The server is launched on demand by Code Mode and is not vendored as source in this repository, so nothing installs in this folder. It documents the registration instead.

### What It Does

Two manuals in `.utcp_config.json` (`chrome_devtools_1`, `chrome_devtools_2`) each launch the server over stdio via `npx` with `--isolated=true`, so each instance owns an independent browser process with isolated cookie/storage state. That is what enables parallel browser testing (e.g. production vs staging simultaneously) with no session conflicts. Your AI client sees only the 4 Code Mode tools instead of the 26 Chrome DevTools tools natively (~78k tokens avoided).

---

## 3. QUICK START

**Step 1: Confirm registration.**

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

Expected: both entries, matching the snapshot in [`../../assets/utcp-chrome-devtools-manuals.md`](../../assets/utcp-chrome-devtools-manuals.md). Verify, don't re-add.

**Step 2: Confirm tools through Code Mode.**

```typescript
const tools = await list_tools();
console.log(tools.filter(t => t.includes('chrome_devtools')));
// Expected: chrome_devtools_1_navigate_page, chrome_devtools_1_take_screenshot, ...
```

Never hardcode a tool name without confirming it via discovery first.

**Step 3: Smoke test one instance.**

```typescript
call_tool_chain(`
  await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "https://example.com" });
  const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
  return screenshot;
`)
```

Close pages in a `finally` block so no browser instance leaks.

---

## 4. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| chrome_devtools tools missing in Code Mode | UTCP config missing or manual disabled | Check `.utcp_config.json`, confirm the entries per the assets snapshot, restart your session |
| MCP server fails to start | Port conflict on 9222 or config error | `lsof -i :9222`, kill the conflicting process |
| Tool call fails on a guessed name | Names must be discovered, not assumed | Run `list_tools()` / `tool_info()` and use the exact `chrome_devtools_N.chrome_devtools_N_<tool>` form |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between the bdg CLI and this MCP fallback |
| [`../../assets/utcp-chrome-devtools-manuals.md`](../../assets/utcp-chrome-devtools-manuals.md) | Byte-true registered-state snapshot of both manuals |
| [`../../INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md) | §4 Code Mode configuration and §10 MCP tools reference |
| [`../bdg-cli/README.md`](../bdg-cli/README.md) | The primary CLI this MCP is a fallback to |
