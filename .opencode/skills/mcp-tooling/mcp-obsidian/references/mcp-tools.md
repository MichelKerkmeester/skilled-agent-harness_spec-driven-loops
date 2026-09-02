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
version: 0.1.0.0
---

# Obsidian MCP Tools Reference

**MCP Server:** `obsidian`, the `obsidian-mcp-server` package (cyanheads) launched over **stdio** via `npx -y obsidian-mcp-server@latest`, registered as the `obsidian` manual in `.utcp_config.json`. It also supports Streamable HTTP on `127.0.0.1:3010/mcp`. On 2026-09-02 that `@latest` tag resolved to **v0.12.3**, so pin nothing to a version this document names.
**Auth:** `OBSIDIAN_API_KEY` (the Local REST API bearer token) plus `OBSIDIAN_BASE_URL` and `OBSIDIAN_VERIFY_SSL`, interpolated into `.utcp_config.json`. The token comes from the Obsidian **Local REST API** plugin, not from an OAuth flow.
**Invocation:** Code Mode `call_tool_chain({ code: "..." })` via `mcp__code_mode__call_tool_chain` — a single TypeScript code string with direct access to registered tools as hierarchical functions (not an array of `{tool, input}` records).
**Tool naming:** Code Mode namespaces every registered tool as `<manual_name>.<manual_name>_<tool_name>` — one dot then underscore. For this manual the pattern is `obsidian.obsidian_<tool_name>` (e.g. `obsidian.obsidian_get_note`). Do not guess a tool name — confirm every one with `tool_info()`/`list_tools()` before calling.

> **App-backed surface:** unlike `notesmd-cli` (headless, filesystem), this MCP server drives the vault through Obsidian's **Local REST API plugin**, which requires a **running Obsidian app**. If no app/token is available, route to the `notesmd-cli` CLI instead (see `obsidian-cli-commands.md`).

> **Verification status:** the server builds **14 tools** and exposes **12**. `obsidian_list_commands` and `obsidian_execute_command` are withheld while `enableCommands` is false, and calling either returns a JSON-RPC `-32602 Tool not found`. All twelve exposed tools were enumerated and exercised against a live vault on 2026-09-02, in [`cli-versus-mcp.md`](cli-versus-mcp.md). Reconfirm with a fresh `list_tools()` before relying on a signature, since the pinned `@latest` tag moves.

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

> **Registration note:** the `obsidian` manual is already registered in `.utcp_config.json` — this document describes that wiring but does not modify it.

---

## 3. AUTHENTICATION

`OBSIDIAN_API_KEY` is the bearer token issued by the Obsidian **Local REST API** plugin (Settings → Local REST API → copy the API key). It is interpolated into `.utcp_config.json` for the `obsidian` manual as `${obsidian_OBSIDIAN_API_KEY}`. There is no OAuth flow and no browser authorization step.

| Env var | Default | Purpose |
|---------|---------|---------|
| `OBSIDIAN_API_KEY` | — (required) | Local REST API bearer token |
| `OBSIDIAN_BASE_URL` | `http://127.0.0.1:27123` | Local REST API endpoint |
| `OBSIDIAN_VERIFY_SSL` | `false` | Whether to verify the plugin's self-signed TLS cert |

> **Security:** `OBSIDIAN_VERIFY_SSL=false` (and `curl -k`) is safe only because the Local REST API listens on **loopback** (`127.0.0.1`) with a self-signed cert. Never point `OBSIDIAN_BASE_URL` at a non-loopback host while verification is off — the bearer token would cross the network on an unverified connection.

---

## 4. WHEN TO USE MCP

**The official `obsidian` CLI is the default app-backed surface, not this server.** It needs only the running app, exposes 106 commands against this server's 12, and answers in about 38 ms per call with no process to keep warm. The measured comparison behind that default is [`cli-versus-mcp.md`](cli-versus-mcp.md).

Use the **Obsidian MCP** when the work needs one of the four things the CLI cannot do:
- Patch a heading, block or frontmatter section **in place** (`obsidian_patch_note`)
- Search and replace **inside** one note, literally or by regex (`obsidian_replace_in_note`)
- Add or remove a tag as a real YAML list (`obsidian_manage_tags`). The CLI has no tag-write command at all
- Set a JSON-typed frontmatter value: number, boolean, array or object (`obsidian_manage_frontmatter`)

Also use it for a batch over roughly 20 calls, where a warm session costs about 3 ms per call against the CLI's 38, after paying a one-time startup of 724 ms or more.

Before any of that, confirm the plugin is **enabled**, not merely installed. `tools/list` succeeds with the app closed and the plugin off, so it proves nothing:

```bash
obsidian plugin id=obsidian-local-rest-api        # look for: enabled  true
curl -sk -o /dev/null -w '%{http_code}\n' "$OBSIDIAN_BASE_URL/"   # expect 200
```

Use **`notesmd-cli`** (the headless CLI) when:
- **No app is running** (servers, CI, unattended agents) — the CLI operates the filesystem directly
- You want deterministic, greppable, diff-able file operations

> The router in SKILL.md §2 picks between them by whether a live app/token is available: app present → MCP; headless → CLI.

---

## 5. TOOL INVENTORY

The server exposes **12 tools** and withholds 2 more. All twelve below were called against a live vault. Run `tool_info()` to confirm a signature before scripting it.

> **Two different MCP servers — do not conflate the tool names.** This catalog is the **cyanheads `obsidian-mcp-server`** (`obsidian_*` tools, launched via `npx`). The `obsidian-local-rest-api` plugin (v5.1.0+) ALSO ships its **own** built-in MCP at `https://127.0.0.1:27124/mcp/` exposing **16 `vault_*` tools** (`vault_read` / `vault_write` / `vault_patch` / `vault_move` / `search_simple` / `search_query` / `tag_list` / `command_list` / … — validated live). If `OBSIDIAN_BASE_URL` points at the plugin's own `/mcp/`, expect `vault_*` names, not `obsidian_*`. Same Local REST API core, different server + tool surface — always confirm with `list_tools()`.

### The twelve exposed tools

| Tool (append to `obsidian.obsidian_`) | Description |
|------|-------------|
| `obsidian_get_note` | Read a note by path, active file or periodic note, in one of four projections: `content`, `full`, `document-map`, `section` |
| `obsidian_list_notes` | List notes and subdirectories at a vault path, with `depth` and extension filters |
| `obsidian_list_tags` | List vault tags with usage counts, ordered by count |
| `obsidian_open_in_ui` | Open a file in the running app, with `failIfMissing` controlling open-or-create |
| `obsidian_search_notes` | Search by text substring or a JSONLogic `logic` tree, paginated by opaque cursor |
| `obsidian_write_note` | Create or overwrite a note. Refuses a collision unless `overwrite: true` |
| `obsidian_append_to_note` | Append to a note, creating it when absent |
| `obsidian_patch_note` | Append to, prepend to or replace a heading, block reference or frontmatter field in place |
| `obsidian_replace_in_note` | Ordered literal or regex search-and-replace inside one note |
| `obsidian_manage_frontmatter` | Get, set or delete one frontmatter key, with JSON-typed values |
| `obsidian_manage_tags` | Add, remove or list a note's tags in frontmatter, inline, or both |
| `obsidian_delete_note` | Permanently delete a note. **Requires the client to declare the MCP `elicitation` capability**, otherwise the call fails with `Cannot request input 'confirm'` |

### The two withheld tools

`obsidian_list_commands` and `obsidian_execute_command` are constructed but not registered while the server's `enableCommands` setting is false. Set `OBSIDIAN_ENABLE_COMMANDS` for the manual and re-run `list_tools()` to expose them.

```typescript
const tools = await list_tools();      // Enumerate what this build actually exposes
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

## 9. MCP VS NOTESMD-CLI: QUICK DECISION

| Need | Use | Reason |
|------|-----|--------|
| Read a note (app running) | MCP | `obsidian_get_note` over Local REST API |
| Read a note (no app) | CLI | `notesmd-cli print` — filesystem |
| Write a note (app running) | MCP | `obsidian_write_note` |
| Write a note (no app / CI) | CLI | `notesmd-cli create` — headless |
| Search notes (app running) | MCP | `obsidian_search_notes` |
| Full-text search (no app) | CLI | `notesmd-cli search-content` |
| Manage tags (app running) | MCP | `obsidian_manage_tags`. The official CLI cannot write tags |
| Patch a section, or replace text inside a note | MCP | `obsidian_patch_note`, `obsidian_replace_in_note`. No CLI equivalent |
| Link graph, tasks, Bases, sync, history, plugins, UI (app running) | official `obsidian` CLI | The MCP server exposes none of these |
| Delete a note | official CLI, or `notesmd-cli` headless | MCP `obsidian_delete_note` needs client elicitation support and is permanent-only |
| Multi-vault config / set default | CLI | `notesmd-cli add-vault` / `set-default-vault` |

---

## 10. ALTERNATIVE MCP SURFACES (context)

- **Headless MCP alternative:** `obsidian-mcp` (StevenStavrakis, npm `@1.0.6`) is filesystem-based rather than REST-API-based. `VERIFY no-app/no-token` before asserting it runs without a running app or a token.
- **Later target:** the Local REST API plugin's own built-in Streamable HTTP `/mcp/` endpoint, reachable via `npx mcp-remote` (npm `@0.1.38`). Pursue once Code Mode proves HTTP-manual support. Both are out of scope for the default wiring documented here.
