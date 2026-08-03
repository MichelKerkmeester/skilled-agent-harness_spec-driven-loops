---
title: "Obsidian MCP Tools Reference"
description: "Reference for the cyanheads obsidian-mcp-server: the obsidian_* tool surface, Code Mode call_tool_chain invocation, env/prereqs (Local REST API v4+ + token + running app), and when to use MCP vs the notesmd-cli CLI."
trigger_phrases:
  - "obsidian mcp"
  - "obsidian_get_note"
  - "obsidian_write_note"
  - "obsidian search notes"
  - "obsidian mcp tools"
  - "obsidian rest api"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Obsidian MCP Tools Reference

**MCP Server:** `obsidian` — the `obsidian-mcp-server` package (cyanheads, npm `@3.2.9`) launched over **stdio** via `npx -y obsidian-mcp-server@latest`, registered as the `obsidian` manual in `.utcp_config.json`. It also supports Streamable HTTP on `127.0.0.1:3010/mcp`.
**Auth:** `OBSIDIAN_API_KEY` (the Local REST API bearer token) plus `OBSIDIAN_BASE_URL` and `OBSIDIAN_VERIFY_SSL`, interpolated into `.utcp_config.json`. The token comes from the Obsidian **Local REST API** plugin, not from an OAuth flow.
**Invocation:** Code Mode `call_tool_chain({ code: "..." })` via `mcp__code_mode__call_tool_chain` — a single TypeScript code string with direct access to registered tools as hierarchical functions (not an array of `{tool, input}` records).
**Tool naming:** Code Mode namespaces every registered tool as `<manual_name>.<manual_name>_<tool_name>` — one dot then underscore. For this manual the pattern is `obsidian.obsidian_<tool_name>` (e.g. `obsidian.obsidian_get_note`). Do not guess a tool name — confirm every one with `tool_info()`/`list_tools()` before calling.

> **App-backed surface:** unlike `notesmd-cli` (headless, filesystem), this MCP server drives the vault through Obsidian's **Local REST API plugin**, which requires a **running Obsidian app**. If no app/token is available, route to the `notesmd-cli` CLI instead (see `obsidian-cli-commands.md`).

> **Verification status:** the server exposes **14 tools total**. The five `obsidian_*` tools named below are the confirmed core surface; the remaining tools are **not enumerated in this pass**. Treat every tool name as unverified until reconfirmed with a fresh `list_tools()`/`tool_info()` call once the manual is reachable, and run `list_tools()` to enumerate the full 14 before assuming a capability is absent.

---

## 1. OVERVIEW

The Obsidian MCP server is the app-backed surface in mcp-obsidian, used when you want to operate a **running** vault through the Local REST API rather than the filesystem. Confirmed capabilities: read a note, write a note, search notes, manage tags, and delete a note.

Use this reference when:
- Routing a request to MCP (not the CLI) because a live app + Local REST API is available — see the router in SKILL.md §2
- Writing Code Mode `call_tool_chain({ code: "..." })` invocations
- Confirming whether a capability is supported before routing to it (enumerate with `list_tools()`)

---

## 2. PREREQUISITES

- Code Mode MCP configured, with the `obsidian` manual in `.utcp_config.json` (not `opencode.json`, `.mcp.json`, or `claude_desktop_config.json` — those are for native/non-Code-Mode MCP tools)
- Obsidian **Local REST API plugin v4.0.0+** installed and enabled in the vault
- A **running Obsidian app** with that vault open (the server talks to the app, not the disk)
- `OBSIDIAN_API_KEY` set to the Local REST API bearer token; `OBSIDIAN_BASE_URL` (default `http://127.0.0.1:27123`) and `OBSIDIAN_VERIFY_SSL` (default `false`) available to Code Mode
- Node.js 18+ and npx available (the manual launches `obsidian-mcp-server@latest` on demand via `npx -y`)
- AI client restarted after config change

> **Registration note:** the `obsidian` manual is added to `.utcp_config.json` by a later gated phase — this document describes the wiring but does not perform it.

---

## 3. AUTHENTICATION

`OBSIDIAN_API_KEY` is the bearer token issued by the Obsidian **Local REST API** plugin (Settings → Local REST API → copy the API key). It is interpolated into `.utcp_config.json` for the `obsidian` manual as `${obsidian_OBSIDIAN_API_KEY}`. There is no OAuth flow and no browser authorization step.

| Env var | Default | Purpose |
|---------|---------|---------|
| `OBSIDIAN_API_KEY` | — (required) | Local REST API bearer token |
| `OBSIDIAN_BASE_URL` | `http://127.0.0.1:27123` | Local REST API endpoint |
| `OBSIDIAN_VERIFY_SSL` | `false` | Whether to verify the plugin's self-signed TLS cert |

---

## 4. WHEN TO USE MCP VS notesmd-cli

Use the **Obsidian MCP** when:
- A **running app + Local REST API** is available and you want to operate the live vault
- You need the server's structured note read/write/search/tag surface over the REST API

Use **`notesmd-cli`** (the headless CLI) when:
- **No app is running** (servers, CI, unattended agents) — the CLI operates the filesystem directly
- You want deterministic, greppable, diff-able file operations

> The router in SKILL.md §2 picks between them by whether a live app/token is available: app present → MCP; headless → CLI.

---

## 5. TOOL INVENTORY

The server reports **14 tools total**. The five below are the confirmed `obsidian_*` core; the remaining nine are **not enumerated in this pass** — run `list_tools()` to enumerate them and `tool_info()` to confirm each signature before use.

> **Two different MCP servers — do not conflate the tool names.** This catalog is the **cyanheads `obsidian-mcp-server`** (`obsidian_*` tools, launched via `npx`). The `obsidian-local-rest-api` plugin (v5.1.0+) ALSO ships its **own** built-in MCP at `https://127.0.0.1:27124/mcp/` exposing **16 `vault_*` tools** (`vault_read` / `vault_write` / `vault_patch` / `vault_move` / `search_simple` / `search_query` / `tag_list` / `command_list` / … — validated live). If `OBSIDIAN_BASE_URL` points at the plugin's own `/mcp/`, expect `vault_*` names, not `obsidian_*`. Same Local REST API core, different server + tool surface — always confirm with `list_tools()`.

### Confirmed core (5 tools)

| Tool (append to `obsidian.obsidian_`) | Description |
|------|-------------|
| `obsidian_get_note` | Read a note's contents (and metadata) from the vault |
| `obsidian_write_note` | Create or overwrite a note |
| `obsidian_search_notes` | Search notes (by name and/or content) |
| `obsidian_manage_tags` | Add/remove/list tags on a note |
| `obsidian_delete_note` | Delete a note from the vault |

### Remaining tools (9) — `VERIFY against list_tools()`

The server exposes 9 further tools beyond the five above (14 total). Their names are **not confirmed** in this pass. Likely areas (append/patch content, list/browse vault, frontmatter/properties, active-note operations) are **inferences, not confirmations** — enumerate with `list_tools()` before relying on any of them:

```typescript
const tools = await list_tools();      // Enumerate the full 14
// Then confirm a specific signature:
const info = await tool_info("obsidian.obsidian_get_note");
```

---

## 6. INVOCATION PATTERN (CODE MODE)

`call_tool_chain` takes a single `code` string (TypeScript), not an array of `{tool, input}` records. It has direct access to every registered tool as a hierarchical function:

```typescript
// Single tool call — read a note
const result = await call_tool_chain({
  code: `
    const note = await obsidian.obsidian_get_note({
      path: "Projects/Launch.md",
    });
    return note;
  `,
});

// Chained tool calls in one code string — read, then write back
const result = await call_tool_chain({
  code: `
    const existing = await obsidian.obsidian_get_note({ path: "Daily/2026-08-02.md" });
    const updated = await obsidian.obsidian_write_note({
      path: "Daily/2026-08-02.md",
      content: existing.content + "\\n\\n## Follow-ups\\n- [ ] Ship the mode",
    });
    return updated;
  `,
});
```

> Parameter names above (`path`, `content`) are **representative — `VERIFY` against `tool_info()`** before hardcoding. Confirm every callable name and its argument shape with `tool_info()`/`list_tools()`; the doubled prefix (`obsidian.obsidian_obsidian_...`) does NOT apply here because the underlying tool names already start with `obsidian_`, so the callable form is `obsidian.obsidian_get_note` (one `obsidian_` prefix after the dot), NOT `obsidian.obsidian_obsidian_get_note`.

---

## 7. SEARCH & TAG OPERATIONS

```typescript
// Search notes, then tag the matches
const result = await call_tool_chain({
  code: `
    const hits = await obsidian.obsidian_search_notes({ query: "roadmap" });
    const tagged = [];
    for (const hit of hits) {
      const t = await obsidian.obsidian_manage_tags({
        path: hit.path,
        add: ["planning"],
      });
      tagged.push(t);
    }
    return { hits, tagged };
  `,
});
```

> Argument shapes (`query`, `path`, `add`) are `VERIFY` — confirm with `tool_info("obsidian.obsidian_search_notes")` and `tool_info("obsidian.obsidian_manage_tags")` first.

---

## 8. ERROR HANDLING

Common error patterns and recovery:

| Error | Code | Recovery |
|-------|------|---------|
| Connection refused / cannot reach server | — | Obsidian app not running, or Local REST API plugin disabled — start the app and enable the plugin |
| Not authorized | 401 | `OBSIDIAN_API_KEY` unset or wrong — copy a fresh token from Local REST API settings |
| SSL / certificate error | — | The plugin uses a self-signed cert — set `OBSIDIAN_VERIFY_SSL=false`, or point `OBSIDIAN_BASE_URL` at the HTTP port |
| Wrong port / no response | — | Confirm `OBSIDIAN_BASE_URL` matches the plugin's configured port (default `27123`) |
| Note not found | 404 | Check the `path` — vault-relative, includes the `.md` extension `VERIFY` |
| Tool not found | n/a | Manual not registered, or the callable name has changed — run `list_tools()`/`tool_info()` before retrying |

```typescript
// Error handling pattern
try {
  const result = await call_tool_chain({
    code: `return await obsidian.obsidian_get_note({ path: "${notePath}" });`,
  });
  return result;
} catch (error) {
  if (error.code === 401) {
    // Token missing/invalid — re-copy OBSIDIAN_API_KEY from Local REST API settings
  }
  throw error;
}
```

---

## 9. MCP VS notesmd-cli: QUICK DECISION

| Need | Use | Reason |
|------|-----|--------|
| Read a note (app running) | MCP | `obsidian_get_note` over Local REST API |
| Read a note (no app) | CLI | `notesmd-cli print` — filesystem |
| Write a note (app running) | MCP | `obsidian_write_note` |
| Write a note (no app / CI) | CLI | `notesmd-cli create` — headless |
| Search notes (app running) | MCP | `obsidian_search_notes` |
| Full-text search (no app) | CLI | `notesmd-cli search-content` |
| Manage tags (app running) | MCP | `obsidian_manage_tags` |
| Delete a note | Either | MCP `obsidian_delete_note` (app) or `notesmd-cli delete` (headless) |
| Multi-vault config / set default | CLI | `notesmd-cli add-vault` / `set-default-vault` |

---

## 10. ALTERNATIVE MCP SURFACES (context)

- **Headless MCP alternative:** `obsidian-mcp` (StevenStavrakis, npm `@1.0.6`) is filesystem-based rather than REST-API-based. `VERIFY no-app/no-token` before asserting it runs without a running app or a token.
- **Later target:** the Local REST API plugin's own built-in Streamable HTTP `/mcp/` endpoint, reachable via `npx mcp-remote` (npm `@0.1.38`). Pursue once Code Mode proves HTTP-manual support. Both are out of scope for the default wiring documented here.
