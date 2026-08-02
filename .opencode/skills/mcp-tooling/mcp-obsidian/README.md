---
title: mcp-obsidian
description: Obsidian orchestrator that routes vault work between the headless notesmd-cli, the app-backed official obsidian CLI, and the cyanheads Obsidian MCP for live-app note operations.
trigger_phrases:
  - "obsidian"
  - "obsidian vault"
  - "notesmd-cli"
  - "obsidian mcp"
  - "local rest api"
version: 1.0.0.0
---

# mcp-obsidian

> Manage Obsidian vaults through a headless filesystem CLI by default, or through the live app when its UI or Local REST API is required.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Vault registration, note search and mutation, daily-note workflows, live-app note reads/writes, tag operations, and file-layer plugin data workflows |
| **Invoke with** | "obsidian", "notesmd-cli", "obsidian vault", "daily note", "local rest api", or the relevant `obsidian_*` MCP operation |
| **Works on** | `notesmd-cli` works directly on the vault filesystem with no running app; the official `obsidian` CLI and MCP paths require a live desktop app, and the MCP also needs Local REST API + a bearer token |
| **Produces** | Filesystem-native note operations, app-backed UI actions, and structured MCP results through three explicitly routed surfaces |

---

## 2. OVERVIEW

### Why This Skill Exists

Obsidian work has two incompatible runtime conditions. A server, CI job, or unattended agent needs to operate plain vault files without launching an app. A live note workspace sometimes needs the app's UI, plugins, or Local REST API instead. Treating those as one CLI leads to avoidable failures: the official `obsidian` binary is not headless, while a filesystem command cannot provide the structured, live-app MCP surface.

This mode keeps those paths separate and routes by what the request actually needs. `notesmd-cli` is the default for filesystem work. The official `obsidian` CLI is reserved for app-backed actions. Cyanheads' `obsidian-mcp-server@3.2.9` is the structured path for a running Obsidian app with Local REST API enabled.

### What It Does

`notesmd-cli` (Yakitrak) manages a vault directly on disk: vault registration, listing, search, content search, printing, creation, movement, deletion, frontmatter, and daily notes. It needs no token and no running app.

The official `obsidian` CLI ships with Obsidian desktop v1.12.4+ and remote-controls the app after you enable and register it in Settings. The cyanheads MCP server is launched through Code Mode over stdio with `npx -y obsidian-mcp-server@latest`; it reaches the live vault through the Local REST API plugin and exposes a 14-tool `obsidian_*` surface.

The MCP transport is owned by `mcp-code-mode`. This mode consumes Code Mode as a provider; it does not implement the transport or automatically modify its configuration.

---

## 3. QUICK START

**Step 1: Install or inspect the headless profile.**

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh
# Installs notesmd-cli through Homebrew when available, then prints the
# app-backed CLI and MCP setup steps without changing configuration files.

notesmd-cli --version
notesmd-cli list-vaults
```

**Step 2: Register and confirm a vault.**

```bash
notesmd-cli add-vault "/path/to/Vault"
notesmd-cli set-default-vault "Vault"
notesmd-cli list
notesmd-cli search "meeting"
```

`notesmd-cli` now works without launching Obsidian. Empty `list` or `search` output is valid; it means the default vault is empty or has no match.

**Step 3: Enable the app-backed CLI only when the live UI is the target.**

In Obsidian desktop v1.12.4+: **Settings → General → Command line interface → toggle on → Register CLI**. That registers `obsidian` on `PATH` on macOS/Linux. Confirm its current command surface with:

```bash
obsidian --help
```

**Step 4: Use the MCP for structured live-app operations.**

The MCP requires a running Obsidian app, the Local REST API plugin v4.0.0+ with an API key, and the `obsidian` Code Mode manual. The mode documents the manual and its environment variables; a later configuration phase registers it. Once it is reachable, enumerate tools before calling one:

```typescript
const tools = await list_tools();
const info = await tool_info("obsidian.obsidian_get_note");
```

---

## 4. HOW IT WORKS

### The Operation Router

The mode first chooses between filesystem work and live-app work. Headless note tasks use `notesmd-cli` unless the request truly needs app state. With a running app, Local REST API, and API key, structured reads, writes, searches, and tag operations route to the cyanheads MCP. The official `obsidian` CLI is for in-app opens and URI-driven actions; confirm its exact command shape with `obsidian --help` before scripting it.

| Need | Primary surface | Why |
|---|---|---|
| Vault registration, daily note, list, print, filename/content search | `notesmd-cli` | Filesystem-native and headless |
| Create, move, delete, or edit frontmatter with no app | `notesmd-cli` | Works directly on vault Markdown files |
| Open or control the live app | official `obsidian` CLI | App-backed remote control |
| Structured note reads/writes, tags, or live-vault search | `obsidian-mcp-server` via Code Mode | Local REST API returns structured MCP results |
| Plugin data operations | `notesmd-cli` or MCP at the file layer | The mode edits the files a plugin renders, rather than driving plugin UI |

### The Headless CLI Path

`notesmd-cli` is the default path. Its registered-vault configuration lives at `~/.config/obsidian/obsidian.json`, and it supports `open`, `daily`, `search`, `search-content`, `list`, `print`, `create`, `move`, `delete`, `frontmatter`, `add-vault`, `remove-vault`, `list-vaults`, and `set-default-vault`.

```bash
notesmd-cli list                          # List notes in the default vault
notesmd-cli search "roadmap"              # Search note names
notesmd-cli search-content "roadmap"      # Search note contents
notesmd-cli print "Inbox"                 # Read a note before changing it
notesmd-cli create "New Idea"             # Create a note
notesmd-cli daily                         # Open or append the daily note
```

Read and identify the exact note before a `move` or `delete`. Those changes are hard to reverse. For exact command flags that are not established here, run `notesmd-cli <command> --help` and treat it as authoritative.

### The App-Backed CLI Path

The official `obsidian` binary is included with Obsidian desktop v1.12.4+; there is no npm or Homebrew package for it. It launches or remote-controls the desktop app rather than operating the filesystem directly. Use it only after enabling **Command line interface** and clicking **Register CLI** in the app.

That distinction matters: `notesmd-cli` remains the right route for CI, SSH, scripts, and app-less automation. The official CLI is the right route when opening the note inside Obsidian or triggering an app-only action is the actual outcome.

### The Cyanheads MCP Path

The `obsidian` Code Mode manual launches cyanheads' `obsidian-mcp-server@3.2.9` over stdio. It needs a running Obsidian app with Local REST API v4.0.0+ enabled and a bearer token. Its 14-tool surface includes the confirmed core tools `obsidian_get_note`, `obsidian_write_note`, `obsidian_search_notes`, `obsidian_manage_tags`, and `obsidian_delete_note`.

```json
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "obsidian-mcp-server@latest"],
        "env": {
          "OBSIDIAN_API_KEY": "${obsidian_OBSIDIAN_API_KEY}",
          "OBSIDIAN_BASE_URL": "${obsidian_OBSIDIAN_BASE_URL}",
          "OBSIDIAN_VERIFY_SSL": "${obsidian_OBSIDIAN_VERIFY_SSL}"
        }
      }
    }
  }
}
```

Call tools through Code Mode as `obsidian.obsidian_<tool_name>` and confirm the callable name and argument schema with `list_tools()` / `tool_info()` first. The parameter shapes in examples are `VERIFY` until that runtime confirmation.

### Agent Safety Invariants

Start by resolving the surface. Do not start Obsidian merely to perform a headless filesystem operation. Confirm the default vault before a write, quote note names and paths in Bash, and read a note before moving or deleting it. An empty search result is a valid result, not a reason to invent a note.

For MCP work, do not assume the manual is registered or that all 14 tool names are known. Verify the live app, Local REST API reachability, `OBSIDIAN_API_KEY`, and the individual tool signature before issuing a write. Leave `OBSIDIAN_VERIFY_SSL=false` unless the endpoint is a trusted TLS deployment.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Use this mode for an Obsidian vault, a daily note, a note search, a Local REST API operation, or one of the supported plugin data formats. Use `notesmd-cli` whenever a vault-file outcome is enough. Use the official CLI when the live app is part of the intended result. Use the MCP when the live app is available and you need its structured note or tag API.

The three surfaces are complementary rather than interchangeable. The filesystem profile works when the app is closed. The app-backed profiles do not. The router deliberately prefers the headless path until a live-app capability is necessary.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the Code Mode MCP transport used by `obsidian.obsidian_*` calls. |
| `mcp-click-up` | Structural sibling: both document a CLI path and a Code Mode MCP path with operation-based routing. |
| `sk-code` | Owns application-code standards and tests when an application consumes or produces the notes. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `notesmd-cli: command not found` | The headless CLI is missing or its install prefix is not on `PATH` | Run the mode-root installer; use its printed Scoop, AUR, or source-build alternatives when Homebrew is unavailable |
| `notesmd-cli` has no default vault | No vault has been registered and selected | Run `notesmd-cli add-vault <path>` then `notesmd-cli set-default-vault <name>` |
| `obsidian: command not found` | The desktop CLI is not enabled or registered | In Obsidian v1.12.4+, enable Command line interface and click Register CLI |
| MCP connection refused | The app is closed, Local REST API is disabled, or the base URL is wrong | Start Obsidian with the target vault, enable Local REST API v4.0.0+, and check `OBSIDIAN_BASE_URL` |
| MCP returns 401/403 | `OBSIDIAN_API_KEY` is absent, wrong, or the plugin is disabled | Copy a fresh Local REST API token into the Code Mode environment and restart the AI client |
| MCP tool not found | The manual is not registered or the callable name was guessed | Run `list_tools()` and `tool_info()`; use `obsidian.obsidian_<tool>` after confirming it |
| Search returns no note | The query has no match, or the wrong vault is active | Try `search-content`, check `list-vaults`, and report the empty result if it remains empty |

Full recovery procedures: [`references/troubleshooting.md`](./references/troubleshooting.md).

---

## 7. FAQ

**Q: When should I use `notesmd-cli` instead of the official `obsidian` CLI?**

A: Use `notesmd-cli` for filesystem operations and any work that must run without the desktop app. Use the official CLI only for an app-backed outcome such as opening or controlling the live UI. They are different binaries with different runtime requirements.

**Q: When should I use the cyanheads MCP?**

A: Use it for structured note reads, writes, search, or tag operations against a running Obsidian app with Local REST API enabled. If the app or token is unavailable, use `notesmd-cli` instead.

**Q: Does the install script change `.utcp_config.json` or `.env`?**

A: No. `scripts/install.sh` prints the exact Code Mode manual and `obsidian_OBSIDIAN_*` environment keys. It never writes configuration files. The mode documents the wiring; its registration is owned by a later configuration phase.

**Q: Are all 14 MCP tool names documented here?**

A: No. Five core names are confirmed. Use `list_tools()` to enumerate the live 14-tool inventory and `tool_info()` to verify a particular signature before relying on it.

**Q: Is an empty note search an error?**

A: No. Empty output means the selected vault has no match. Verify the vault and query spelling, then report the absence rather than creating a fictional result.

---

## 8. VERIFICATION

The mode-root scripts are the first checks because they distinguish required headless pieces from optional app-backed pieces.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-obsidian/README.md --type readme` reports zero issues |
| Setup diagnostics | `bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh` reports the detected CLI, app, and MCP prerequisites without changing them |
| Headless CLI | `notesmd-cli --version && notesmd-cli list-vaults && notesmd-cli list` succeeds; an empty note list is valid |
| Official CLI | After in-app registration, `obsidian --help` prints its current command surface |
| MCP health | With the later manual registered, `list_tools()` shows `obsidian.obsidian_*` entries and `tool_info("obsidian.obsidian_get_note")` resolves a live schema |
| Example scripts | `mcp-roundtrip.sh` preflights and prints a Code Mode reference; run `headless-notes-workflow.sh` only against a chosen vault and `beancount-transaction.sh` against its scratch or designated ledger |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime router, agent invariants, quick reference, and resource map |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Step-by-step installation and configuration for both CLI profiles and the MCP |
| [`references/obsidian-cli-commands.md`](./references/obsidian-cli-commands.md) | Detailed `notesmd-cli` and official `obsidian` CLI reference, including `VERIFY` boundaries |
| [`references/mcp-tools.md`](./references/mcp-tools.md) | Cyanheads MCP prerequisites, confirmed core tools, and Code Mode invocation pattern |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | PATH, vault, Local REST API, auth, and MCP recovery guide |
| [`examples/README.md`](./examples/README.md) | Index for the headless notes, MCP roundtrip, and Beancount workflows |
| [`scripts/install.sh`](./scripts/install.sh) | Installs the headless CLI when possible and prints the official CLI/MCP setup steps |
| [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only environment diagnostics |

