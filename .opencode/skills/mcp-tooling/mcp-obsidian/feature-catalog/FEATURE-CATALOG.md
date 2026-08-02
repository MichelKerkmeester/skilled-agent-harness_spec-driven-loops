---
title: "mcp-obsidian: Feature Catalog"
description: "Unified current-state inventory for the headless notesmd-cli, official app-backed obsidian CLI, and cyanheads Obsidian MCP surfaces."
trigger_phrases:
  - "mcp-obsidian feature catalog"
  - "notesmd-cli features"
  - "obsidian MCP tools"
last_updated: "2026-08-02"
version: 1.0.0.0
---

# mcp-obsidian: Feature Catalog

Current feature inventory for the `mcp-obsidian` mode. The catalog covers the headless `notesmd-cli` filesystem surface, the official app-backed `obsidian` CLI, and the cyanheads `obsidian_*` MCP surface. Manual execution detail lives in the [manual testing playbook](../manual-testing-playbook/manual-testing-playbook.md).

The inventory records current behavior only. Exact `notesmd-cli` flags for `create` and `frontmatter`, exact official `obsidian` subcommands, and nine of the MCP server's fourteen tool names remain `VERIFY` boundaries in the current references.

---

## 1. OVERVIEW

The mode has 20 catalog entries: 11 headless CLI operations, 3 official app-backed CLI capabilities, 5 confirmed cyanheads MCP core tools, and 1 explicit inventory boundary for the remaining 9 MCP tools whose names were not captured. The headless profile is the default when no running app is available; the official CLI and MCP are app-backed surfaces.

---

## 2. NOTESMD-CLI — CREATE

### Create a note

`notesmd-cli create <note>` creates a note in the selected vault. The exact body-content input flags remain `VERIFY`.

See [`notesmd-cli-create/create-note.md`](notesmd-cli-create/create-note.md).

---

## 3. NOTESMD-CLI — SEARCH

### Search note names

`notesmd-cli search <query>` searches note titles or names.

See [`notesmd-cli-search/search-note-names.md`](notesmd-cli-search/search-note-names.md).

### Search note content

`notesmd-cli search-content <query>` scans note bodies for a term.

See [`notesmd-cli-search/search-note-content.md`](notesmd-cli-search/search-note-content.md).

---

## 4. NOTESMD-CLI — MOVE

### Move or rename a note

`notesmd-cli move <src> <dst>` moves or renames a note. Link-update behavior is marked `VERIFY` in the current reference.

See [`notesmd-cli-move/move-note.md`](notesmd-cli-move/move-note.md).

---

## 5. NOTESMD-CLI — DELETE

### Delete a note

`notesmd-cli delete <note>` deletes a note from the vault. It is destructive and requires target confirmation before execution.

See [`notesmd-cli-delete/delete-note.md`](notesmd-cli-delete/delete-note.md).

---

## 6. NOTESMD-CLI — FRONTMATTER

### Read or modify frontmatter

`notesmd-cli frontmatter <note>` reads or modifies YAML frontmatter; the exact get/set flags remain `VERIFY`.

See [`notesmd-cli-frontmatter/edit-frontmatter.md`](notesmd-cli-frontmatter/edit-frontmatter.md).

---

## 7. NOTESMD-CLI — DAILY

### Open today's daily note

`notesmd-cli daily` creates or opens today's daily note according to the vault's daily-note settings, which are marked `VERIFY`.

See [`notesmd-cli-daily/open-daily-note.md`](notesmd-cli-daily/open-daily-note.md).

---

## 8. NOTESMD-CLI — VAULTS

### Add a vault

`notesmd-cli add-vault <path>` registers a vault in `~/.config/obsidian/obsidian.json`.

See [`notesmd-cli-vaults/add-vault.md`](notesmd-cli-vaults/add-vault.md).

### Remove a vault

`notesmd-cli remove-vault <name>` unregisters a named vault.

See [`notesmd-cli-vaults/remove-vault.md`](notesmd-cli-vaults/remove-vault.md).

### List vaults

`notesmd-cli list-vaults` lists registered vaults and the configured default.

See [`notesmd-cli-vaults/list-vaults.md`](notesmd-cli-vaults/list-vaults.md).

### Set the default vault

`notesmd-cli set-default-vault <name>` selects the vault used when a command does not name one explicitly.

See [`notesmd-cli-vaults/set-default-vault.md`](notesmd-cli-vaults/set-default-vault.md).

---

## 9. OFFICIAL OBSIDIAN CLI — REGISTRATION

### Register the official CLI

The official `obsidian` CLI is shipped with Obsidian desktop v1.12.4+ and is enabled from Settings → General → Command line interface → Register CLI. It is not a separate npm or Homebrew package.

See [`obsidian-cli-registration/register-cli.md`](obsidian-cli-registration/register-cli.md).

---

## 10. OFFICIAL OBSIDIAN CLI — APP ACTIONS

### Open a note or vault in the app

The official `obsidian` binary remote-controls the desktop app and can launch it when it is not running. Exact subcommand and flag syntax remains `VERIFY`.

See [`obsidian-cli-app-actions/open-note-or-vault.md`](obsidian-cli-app-actions/open-note-or-vault.md).

### Trigger URI actions

`obsidian://` URI actions are the documented likely bridge for app/plugin actions; the exact official CLI form and supported action set remain `VERIFY`.

See [`obsidian-cli-app-actions/uri-actions.md`](obsidian-cli-app-actions/uri-actions.md).

---

## 11. MCP — HIGH PRIORITY

The cyanheads `obsidian-mcp-server` exposes confirmed core tools under the Code Mode namespace `obsidian.obsidian_*`. Each tool must be rechecked with `list_tools()` or `tool_info()` before use.

### Get a note

`obsidian_get_note` reads a note and its metadata from the live vault.

See [`mcp-high-priority/get-note.md`](mcp-high-priority/get-note.md).

### Write a note

`obsidian_write_note` creates or overwrites a note in the live vault.

See [`mcp-high-priority/write-note.md`](mcp-high-priority/write-note.md).

### Search notes

`obsidian_search_notes` searches notes by name and/or content through the live app-backed surface.

See [`mcp-high-priority/search-notes.md`](mcp-high-priority/search-notes.md).

### Delete a note

`obsidian_delete_note` deletes a note through the Local REST API-backed server and is destructive.

See [`mcp-high-priority/delete-note.md`](mcp-high-priority/delete-note.md).

---

## 12. MCP — MEDIUM PRIORITY

### Manage note tags

`obsidian_manage_tags` adds, removes, or lists note tags; exact argument names remain `VERIFY` until `tool_info()` confirms them.

See [`mcp-medium-priority/manage-tags.md`](mcp-medium-priority/manage-tags.md).

---

## 13. MCP — LOW PRIORITY / VERIFY BOUNDARY

### Remaining cyanheads tools (VERIFY)

The server reports 14 `obsidian_*` tools in total, while the current reference enumerates only 5 confirmed core names. The remaining 9 names, signatures, and capability groupings are not asserted here; enumerate them with `list_tools()` before adding a narrower feature claim.

See [`mcp-low-priority/additional-tools-verify.md`](mcp-low-priority/additional-tools-verify.md).
