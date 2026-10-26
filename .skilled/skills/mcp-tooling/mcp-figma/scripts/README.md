---
title: "scripts: Figma MCP Setup, Connect, and Diagnostics"
description: "Install, connect, daemon, and read-only diagnostic scripts for the mcp-figma transport, the Figma mode of the mcp-tooling hub."
version: 1.0.1.0
---

# scripts: Figma MCP Setup, Connect, and Diagnostics

---

## 1. OVERVIEW

`scripts/` holds the setup, connect, daemon, and diagnostic scripts for `mcp-figma`, the Figma transport mode of the `mcp-tooling` hub. Every script except `_common.sh` and `print-utcp-snippets.sh` sources `_common.sh` for its color helpers, its `figma_bin` resolver and its daemon paths, so all scripts that resolve `figma-ds-cli` agree on how to find the canonical binary. `print-utcp-snippets.sh` only prints static Code Mode wiring text, so it never needs those helpers. The canonical package is `figma-ds-cli` (the silships tool). A bare `figma` command belongs to the unrelated npm package `unic/figma-cli` and none of these scripts select it.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `_common.sh` | Shared helpers. Sourced by every other script except `print-utcp-snippets.sh`, never run directly. Resolves the `figma-ds-cli` binary in preference order, reports the Node major version, locates Figma Desktop without launching it, checks whether a TCP port is listening, and defines the daemon token, PID file, port and minimum Node version constants. |
| `install.sh` | Installs and verifies `figma-ds-cli`, trying npm first and falling back to a build of a pinned silships repo commit when the npm package is stale or missing. Never connects and never patches Figma. |
| `connect-safe.sh` | Guided SAFE connect using the FigCli Figma plugin bridge. Prompts for interactive confirmation, then runs `figma-ds-cli connect --safe`. Never patches Figma Desktop. |
| `connect-yolo.sh` | Guided YOLO connect that patches Figma Desktop's `app.asar` to expose Chrome DevTools Protocol on port 9222 and restarts Figma. Gated behind an explicit `--i-understand-this-patches-figma` consent flag, refuses without it. |
| `daemon.sh` | Thin wrapper over `figma-ds-cli daemon <verb>` for `status`, `diagnose`, `start`, `stop`, `restart`, and `reconnect`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node and npm versions, which `figma-ds-cli` or `figma-cli` binary resolves, whether Figma Desktop is found and running, daemon token and PID file presence, whether the daemon and CDP ports are listening, and whether a `figma` manual is registered in `.utcp_config.json`. Never exposes the daemon token and never connects or patches. |
| `print-utcp-snippets.sh` | Prints the optional Code Mode wiring for the Framelink `figma` MCP manual (`figma-developer-mcp`) and its `.env` token variable. Print only, never edits `.utcp_config.json` or `.env`. |
| `unpatch.sh` | Rolls back the YOLO patch by running `figma-ds-cli unpatch`, restoring Figma Desktop's original `app.asar`. |

---

## 3. VALIDATION

Run from the `mcp-figma` packet root, wherever the packet is installed.

```bash
bash scripts/doctor.sh
bash scripts/install.sh --skip-verify
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines. `install.sh` reports an existing `figma-ds-cli` binary and its version, or installs one when none is present (`--skip-verify` skips only the post-install check, so it is not read-only). `connect-safe.sh`, `connect-yolo.sh`, `daemon.sh`, and `unpatch.sh` require an interactive session or a running Figma Desktop and are not part of automated validation.

---

## 4. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md)
