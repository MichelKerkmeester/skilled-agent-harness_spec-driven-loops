---
description: Install or inspect MCP servers through explicit subaction routing.
argument-hint: "<install|debug> [--server <name>]"
allowed-tools: Read, Bash
---

# /doctor:mcp Router

This command is a thin subaction router. It selects one workflow asset and leaves
all user-facing wording with the presentation contract.

## 1. ROUTER CONTRACT

Do not execute workflow steps from this Markdown file. Resolve the subaction,
load the selected workflow, and render visible text from the presentation asset.

## 2. OWNED ASSETS

| Purpose | Asset |
| --- | --- |
| Presentation | `.opencode/commands/doctor/assets/doctor_mcp_presentation.txt` |
| Install workflow | `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` |
| Debug workflow | `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` |

## 3. SUBACTION ROUTES

- `install` -> `.opencode/commands/doctor/assets/doctor_mcp_install.yaml`
- `debug` -> `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml`

Unknown subactions stop before any workflow loads.

## 4. PRESENTATION BOUNDARY

The presentation asset owns startup menus, progress displays, final reports, and
next-step wording. This router owns only route selection.
