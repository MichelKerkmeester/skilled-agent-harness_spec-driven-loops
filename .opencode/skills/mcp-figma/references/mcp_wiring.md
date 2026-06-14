---
title: "Figma MCP Wiring (optional, via Code Mode)"
description: "Wiring the OPTIONAL Figma MCP into this project's Code Mode: the already-registered Framelink figma manual, the prefixed .env token, the discover-first flow, and a runnable call_tool_chain example. The CLI works fully alone; the MCP is opt-in."
trigger_phrases:
  - "figma mcp"
  - "figma mcp code mode"
  - "figma-developer-mcp"
  - "pull figma design context"
  - "figma get_design_context"
importance_tier: "normal"
contextType: "implementation"
---

# Figma MCP Wiring (optional, via Code Mode)

> **IMPORTANT:** This skill works **fully with the `figma-ds-cli` alone** — the MCP is **opt-in**. Before invoking any Figma MCP tool, always **discover first** (`search_tools` / `tool_info`) and confirm the `figma` manual and its exact tool names are present. Never guess a tool name, and never claim the MCP works until discovery confirms it.

---

## 1. OVERVIEW

### Core Principle

Wiring here means the agent reaches Figma's **read** surface — design context, variables, metadata — through this project's **Code Mode** transport. The Code Mode manual named `figma` is **already registered** in `.utcp_config.json` (community Framelink `figma-developer-mcp`, stdio, `npx`); nothing new needs to be installed for the MCP path. The only setup step is a `.env` entry with a Figma personal access token.

### When to Use

- Pull Figma file/node data into the agent so it can generate or reconcile code against a design.
- The work is codegen-from-design, not authoring or exporting from the live Desktop session.

The CLI vs MCP routing line:

- **`figma-ds-cli` (CLI) = author/modify/export IN Figma.** It drives the live Figma Desktop session to create/render/modify nodes, manage tokens and variables, and export assets/JSX/CSS/screenshots. This is the primary surface.
- **Figma MCP (Code Mode) = pull design data INTO the agent for codegen.** Use it only when the agent needs Figma design context as model input (file/node data, variables, screenshots) to generate or align code. The MCP does not drive Figma Desktop.

### Key Sources

- [figma_cli_reference.md](figma_cli_reference.md) - the primary CLI surface (binary identity, connect modes, daemon model) for authoring and exporting in Figma.
- [tool_surface.md](tool_surface.md) - the CLI command gating taxonomy; the MCP path here is a separate, opt-in read surface, not part of that gating.
- Code Mode mechanics (naming, prefixed env, discovery): [mcp-code-mode SKILL.md](../../mcp-code-mode/SKILL.md).

Claims are tagged **[CONFIRMED]** (read from this repo's `.utcp_config.json` this session, or from the cited research digests) or **[INFERRED]** (reasoned, needs a live `tool_info()` / `list_tools()` to fix the exact string). The Framelink tool **names and input schemas are [INFERRED]** until a live discovery call confirms them, because the community server's per-tool schema is not pinned in this repo.

---

## 2. THE REGISTERED `figma` MANUAL

The `figma` manual is already present in `.utcp_config.json` under `manual_call_templates[]`. Read it before changing anything. **[CONFIRMED — read from `.utcp_config.json` this session]**

```json
{
  "name": "figma",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "figma": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "figma-developer-mcp@latest", "--stdio"],
        "env": { "FIGMA_API_KEY": "${FIGMA_API_KEY}" }
      }
    }
  }
}
```

What it provides: the Framelink `figma-developer-mcp` server (npm `figma-developer-mcp`, v0.12.0 confirmed published) wraps the Figma REST API and **simplifies Figma file data for coding agents** — i.e. design context an agent can turn into code. **[CONFIRMED — research digest, npm view]** It is a **third-party** server, not Figma's official MCP. **[CONFIRMED]**

Transport is **stdio** over `npx`, which matches every other manual registered here (`chrome_devtools_1/2`, `clickup_official`, `github` are all stdio). No HTTP manual exists in this repo, so the stdio Framelink path is the proven one. **[CONFIRMED — `.utcp_config.json` inspection]**

---

## 3. THE `.env` TOKEN (prefixed)

The manual's config references `${FIGMA_API_KEY}`, but **Code Mode prefixes every environment variable with the manual name**. So the `.env` entry must be the **prefixed** form, not the bare name. **[CONFIRMED — mcp-code-mode SKILL.md §4 "Critical: Prefixed Environment Variables"]**

```bash
# .env (project root)
figma_FIGMA_API_KEY=figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- The token is a **Figma personal access token** (begins `figd_`). Generate it in Figma → Settings → Security → personal access tokens. **[INFERRED — standard Figma token shape; verify in Figma]**
- Using bare `FIGMA_API_KEY=...` will fail with `Error: Variable 'figma_FIGMA_API_KEY' not found`. **[CONFIRMED — mcp-code-mode SKILL.md §4]**
- This is the **only** setup the MCP path needs — the manual is already registered (Section 2). Never paste the token into user-facing output; treat it as a credential.

| Manual name | Config reference   | `.env` variable        |
| ----------- | ------------------ | ---------------------- |
| `figma`     | `${FIGMA_API_KEY}` | `figma_FIGMA_API_KEY`  |

---

## 4. DISCOVER FIRST

Code Mode loads tools progressively. Always discover before calling, because the Framelink tool names and input schemas are not pinned in this repo and the `figma-developer-mcp@latest` surface can change. **[INFERRED — server is `@latest`; names unverified here]**

```typescript
// 1) Is the figma manual present, and what tools does it expose?
const all = await list_tools();
// group returned names by the prefix before the first dot; look for the "figma" group

// 2) Search by intent to find the right Figma tool
const tools = await search_tools({
  task_description: "get figma file or node design data for code generation",
  limit: 10
});

// 3) Confirm the exact callable syntax + input schema before invoking
const info = await tool_info({ tool_name: "figma.figma_get_figma_data" });
```

**Confirmed live surface (2026-06-14 `list_tools()`):** the `figma` manual currently exposes exactly two tools — **`figma.figma_get_figma_data`** (fetch a file/node's design data) and **`figma.figma_download_figma_images`** (download referenced images/SVGs). **[CONFIRMED — live Code Mode `list_tools()`]** Always re-run discovery, since `figma-developer-mcp@latest` can change its surface; treat input schemas as `tool_info()`-verified, not assumed.

`list_tools()` returns names in dotted (`a.b.c`) form; the **callable** form uses an underscore between the manual prefix and the tool: `figma.figma_<tool>`. `tool_info()` shows the correct calling syntax and the expected params. **[CONFIRMED — mcp-code-mode SKILL.md §3 naming + tool-name translation]**

---

## 5. CALL EXAMPLE (`call_tool_chain`)

> Illustrative — the exact tool name and params are placeholders. Run `tool_info()` (Section 4) to fix `<tool>` and its arguments before relying on this.

Naming pattern is `{manual}.{manual}_{tool}`, so every Framelink call is `figma.figma_<tool>`. Wrap calls in try/catch and return structured state. **[CONFIRMED — mcp-code-mode SKILL.md §3]**

```typescript
await call_tool_chain({
  code: `
    try {
      // Tool name confirmed via list_tools(); confirm the param schema with tool_info() first.
      const file = await figma.figma_get_figma_data({
        // fileKey / nodeId pulled from a Figma design URL:
        // https://www.figma.com/design/FILE_KEY/Name?node-id=NODE_ID
        fileKey: "FILE_KEY",
        nodeId: "NODE_ID",
        context: "Pull Figma node data to generate a matching component"
      });
      return { success: true, source: "figma_framelink", file };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  `
});
```

Notes:

- The Framelink server reads Figma via the REST API using the `.env` token — Figma Desktop does **not** need to be open for the MCP path (that requirement is the CLI's, not the MCP's). **[INFERRED — Framelink is API-backed, not Desktop-backed]**
- Static manuals registered in `.utcp_config.json` need no cleanup; only dynamically registered manuals (`register_manual`) require `deregister_manual`. **[CONFIRMED — research digest IT2]**
- MCP responses can be token-heavy. Prefer narrow, node-scoped calls over whole-file pulls when the schema allows it. **[CONFIRMED — research digest IT2 gotchas]**

---

## 6. OFFICIAL FIGMA DEV MODE MCP (out of scope this release)

Figma also ships an **official** Dev Mode MCP server (a remote `https://mcp.figma.com/mcp` server and a desktop-local `http://127.0.0.1:3845/mcp` server, both HTTP MCP with OAuth/desktop-session auth). **[CONFIRMED — research digest IT2]** It is **not a supported path in this release** and is **not documented here**:

- Code Mode has **no HTTP manual registered** in this repo — every manual is stdio — so the official HTTP transport is unproven here. **[CONFIRMED — `.utcp_config.json` inspection]**
- The remote server is **catalog/OAuth-gated**; whether this project's Code Mode client is admitted is **unverified**. **[CONFIRMED — research digest IT2 unknowns]**

Treat the official Dev Mode MCP as a **future option only**. Do not wire or recommend it as a supported route in this version; the registered Framelink `figma` manual (Sections 2–5) is the supported MCP path for now.

---

## 7. REFERENCES

- [figma_cli_reference.md](figma_cli_reference.md) - the primary CLI surface: binary identity, connect modes, daemon model, and command examples.
- [tool_surface.md](tool_surface.md) - the CLI read-only / mutating / destructive taxonomy and gating.
- [troubleshooting.md](troubleshooting.md) - failures including the Code Mode env-var prefix (`figma_FIGMA_API_KEY`) and tools-not-discovered cases.
- [utcp_figma_manual.md](../assets/utcp_figma_manual.md) - the runnable Code Mode manual companion (the `figma` manual entry and ready-to-run `call_tool_chain` snippets).
- [SKILL.md](../SKILL.md) - the skill contract these references support; see §3 "Optional Figma MCP via Code Mode".
- Code Mode mechanics (naming, prefixed env, discovery): [mcp-code-mode SKILL.md](../../mcp-code-mode/SKILL.md).
