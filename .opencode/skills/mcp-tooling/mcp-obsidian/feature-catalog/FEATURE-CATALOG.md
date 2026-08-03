---
title: "mcp-obsidian: Feature Catalog"
description: "Unified current-state inventory for the headless notesmd-cli, official app-backed obsidian CLI, and cyanheads Obsidian MCP surfaces."
trigger_phrases:
  - "mcp-obsidian feature catalog"
  - "notesmd-cli features"
  - "obsidian MCP tools"
  - "Obsidian plugin file-layer operations"
last_updated: "2026-08-03"
version: 1.0.1.0
---

# mcp-obsidian: Feature Catalog

Current feature inventory for the `mcp-obsidian` mode. The catalog covers the headless `notesmd-cli` filesystem surface, the official app-backed `obsidian` CLI, and the cyanheads `obsidian_*` MCP surface. Manual execution detail lives in the [manual testing playbook](../manual-testing-playbook/manual-testing-playbook.md).

The inventory records current behavior only. Exact `notesmd-cli` flags for `create` and `frontmatter`, exact official `obsidian` subcommands, and nine of the MCP server's fourteen tool names remain `VERIFY` boundaries in the current references.

---

## 1. OVERVIEW

The mode has 25 catalog entries: 14 CLI cards (11 headless operations and 3 official app-backed capabilities), 6 MCP cards (5 confirmed cyanheads core tools plus 1 inventory boundary for the remaining 9 tools), and 5 plugin file-layer cards. The headless profile is the default when no running app is available; the official CLI and MCP are app-backed surfaces.

The catalog groups cards by execution surface: `cli/` (14), `mcp/` (6), and `plugins/` (5). Display order below preserves operating sequence and priority context without making directory names part of the contract.

---

## 2. CLI — NOTESMD: CREATE

### Create a note

`notesmd-cli create <note>` creates a note in the selected vault. The exact body-content input flags remain `VERIFY`.

See [`cli/create-note.md`](cli/create-note.md).

---

## 3. CLI — NOTESMD: SEARCH

### Search note names

`notesmd-cli search <query>` searches note titles or names.

See [`cli/search-note-names.md`](cli/search-note-names.md).

### Search note content

`notesmd-cli search-content <query>` scans note bodies for a term.

See [`cli/search-note-content.md`](cli/search-note-content.md).

---

## 4. CLI — NOTESMD: MOVE

### Move or rename a note

`notesmd-cli move <src> <dst>` moves or renames a note. Link-update behavior is marked `VERIFY` in the current reference.

See [`cli/move-note.md`](cli/move-note.md).

---

## 5. CLI — NOTESMD: DELETE

### Delete a note

`notesmd-cli delete <note>` deletes a note from the vault. It is destructive and requires target confirmation before execution.

See [`cli/delete-note.md`](cli/delete-note.md).

---

## 6. CLI — NOTESMD: FRONTMATTER

### Read or modify frontmatter

`notesmd-cli frontmatter <note>` reads or modifies YAML frontmatter; the exact get/set flags remain `VERIFY`.

See [`cli/edit-frontmatter.md`](cli/edit-frontmatter.md).

---

## 7. CLI — NOTESMD: DAILY

### Open today's daily note

`notesmd-cli daily` creates or opens today's daily note according to the vault's daily-note settings, which are marked `VERIFY`.

See [`cli/open-daily-note.md`](cli/open-daily-note.md).

---

## 8. CLI — NOTESMD: VAULTS

### Add a vault

`notesmd-cli add-vault <path>` registers a vault in `~/.config/obsidian/obsidian.json`.

See [`cli/add-vault.md`](cli/add-vault.md).

### Remove a vault

`notesmd-cli remove-vault <name>` unregisters a named vault.

See [`cli/remove-vault.md`](cli/remove-vault.md).

### List vaults

`notesmd-cli list-vaults` lists registered vaults and the configured default.

See [`cli/list-vaults.md`](cli/list-vaults.md).

### Set the default vault

`notesmd-cli set-default-vault <name>` selects the vault used when a command does not name one explicitly.

See [`cli/set-default-vault.md`](cli/set-default-vault.md).

---

## 9. CLI — OFFICIAL OBSIDIAN: REGISTRATION

### Register the official CLI

The official `obsidian` CLI is shipped with Obsidian desktop v1.12.4+ and is enabled from Settings → General → Command line interface → Register CLI. It is not a separate npm or Homebrew package.

See [`cli/register-cli.md`](cli/register-cli.md).

---

## 10. CLI — OFFICIAL OBSIDIAN: APP ACTIONS

### Open a note or vault in the app

The official `obsidian` binary remote-controls the desktop app and can launch it when it is not running. Exact subcommand and flag syntax remains `VERIFY`.

See [`cli/open-note-or-vault.md`](cli/open-note-or-vault.md).

### Trigger URI actions

`obsidian://` URI actions are the documented likely bridge for app/plugin actions; the exact official CLI form and supported action set remain `VERIFY`.

See [`cli/uri-actions.md`](cli/uri-actions.md).

---

## 11. MCP — CORE TOOLS

The cyanheads `obsidian-mcp-server` exposes confirmed core tools under the Code Mode namespace `obsidian.obsidian_*`. Each tool must be rechecked with `list_tools()` or `tool_info()` before use.

### Get a note

`obsidian_get_note` reads a note and its metadata from the live vault.

See [`mcp/get-note.md`](mcp/get-note.md).

### Write a note

`obsidian_write_note` creates or overwrites a note in the live vault.

See [`mcp/write-note.md`](mcp/write-note.md).

### Search notes

`obsidian_search_notes` searches notes by name and/or content through the live app-backed surface.

See [`mcp/search-notes.md`](mcp/search-notes.md).

### Delete a note

`obsidian_delete_note` deletes a note through the Local REST API-backed server and is destructive.

See [`mcp/delete-note.md`](mcp/delete-note.md).

---

## 12. MCP — TAG MANAGEMENT

### Manage note tags

`obsidian_manage_tags` adds, removes, or lists note tags; exact argument names remain `VERIFY` until `tool_info()` confirms them.

See [`mcp/manage-tags.md`](mcp/manage-tags.md).

---

## 13. MCP — INVENTORY BOUNDARY

### Remaining cyanheads tools (VERIFY)

The server reports 14 `obsidian_*` tools in total, while the current reference enumerates only 5 confirmed core names. The remaining 9 names, signatures, and capability groupings are not asserted here; enumerate them with `list_tools()` before adding a narrower feature claim.

See [`mcp/additional-tools-verify.md`](mcp/additional-tools-verify.md).

---

## 14. PLUGINS

The plugin category records file-layer operations for the five community plugins covered by the mode. Each card points to the slim plugin index, deep data/workflow/troubleshooting references, copyable assets, and its manual tie-in scenario.

### Beancount Ledger

Append, query, price, and validate the `beancount-finance` plugin's structured Beancount files.

See [`plugins/beancount-finance.md`](plugins/beancount-finance.md).

### Obsidian Tables

Create and edit the Tables plugin's `.table.md` Agentable JSON payload, then verify the rendered table.

See [`plugins/obsidian-tables.md`](plugins/obsidian-tables.md).

### BRAT

Stage GitHub beta-plugin assets, register the repository and release policy, and activate the manifest ID through the vault files.

See [`plugins/obsidian42-brat.md`](plugins/obsidian42-brat.md).

### Health.md Visualizations

Create, patch, and validate Apple Health export files (JSON/CSV/Markdown/Bases) in the vault data folder, and place render blocks.

See [`plugins/health-md.md`](plugins/health-md.md).

### Iconic

Add, edit, and disable Iconic icon rules and visibility toggles in `data.json` with backup-before-merge discipline.

See [`plugins/iconic.md`](plugins/iconic.md).
