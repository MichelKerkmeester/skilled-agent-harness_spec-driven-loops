---
title: "aside-cli"
description: "Install pointer for the aside CLI, the primary macOS binary mcp-aside-devtools drives for agent tasks and the deterministic REPL."
trigger_phrases:
  - "aside cli install"
  - "install aside"
  - "aside binary"
  - "aside curl installer"
version: 1.0.0.0
---

# aside-cli

> Install and verify the `aside` binary that mcp-aside-devtools drives as its primary surface. Nothing is vendored here — the official distribution is a curl bootstrap installer.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Installing and verifying the `aside` CLI: agent tasks, deterministic REPL, account management, and the built-in MCP launcher. |
| **Invoke with** | `curl -fsSL https://releases.aside.com/install.sh \| bash`, then `aside --version`. |
| **Works on** | macOS (Darwin) arm64/aarch64 and x64 ONLY — the installer rejects Linux and Windows. |
| **Produces** | An `aside` shim at `~/.local/bin/aside` (default), signed in against an Aside account. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-aside-devtools drives real Aside surfaces (`aside "<task>"`, `aside exec`, `aside repl`, `aside account`, `aside mcp`) rather than reimplementing them. This folder is not vendored source — it is the install pointer the parent packet's `INSTALL_GUIDE.md` and `scripts/install.sh` align with. Distribution is a curl-piped macOS app-bundle installer; `npm install -g aside` and GitHub-package installs were researched and ruled out.

### What It Does

The official installer places the executable/shim at `~/.local/bin/aside` by default and honors the overrides `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, and `ASIDE_CLI_BIN_DIR`. The Developer settings page inside the Aside app can also install, update, or reinstall the CLI. The binary exposes `--update`; keep it operator-invoked — the parent packet never installs or updates implicitly.

---

## 3. INSTALL AND VERIFY

```bash
# Official installer (macOS only, operator-invoked)
curl -fsSL https://releases.aside.com/install.sh | bash

# Verify
command -v aside          # expect ~/.local/bin/aside
aside --version 2>&1      # capture as a fixture
aside --help 2>&1         # capture as a fixture — the surface is version-pinned

# Sign-in state (built-in models fail closed when signed out)
aside account list 2>&1
aside account status 2>&1
```

Or use the wrapper with platform gate and idempotency: `bash ../../scripts/install.sh`.

> Layout note: research descriptions of the installed bundle diverge (`Aside CLI.app` vs `~/.aside/cli`); both trace to the same installer. Capture your installed layout as a fixture if it matters.

---

## 4. RELATED DOCUMENTS

- [`../../INSTALL_GUIDE.md`](../../INSTALL_GUIDE.md) — full install, sign-in, and permission-tier walkthrough
- [`../../references/aside-cli-reference.md`](../../references/aside-cli-reference.md) — verified command surface
- [`../aside-mcp/README.md`](../aside-mcp/README.md) — the MCP server package (the `aside` manual is registered in `.utcp_config.json`)
- Source: https://releases.aside.com/install.sh · https://docs.aside.com/help/developers
