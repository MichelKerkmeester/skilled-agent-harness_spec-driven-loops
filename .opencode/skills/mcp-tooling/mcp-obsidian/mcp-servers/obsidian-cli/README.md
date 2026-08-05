---
title: "obsidian-cli (notesmd-cli + official obsidian)"
description: "Install pointer for the two Obsidian CLI profiles mcp-obsidian drives: headless notesmd-cli (filesystem, no app) and the official obsidian CLI (remote-controls a running app)."
trigger_phrases:
  - "obsidian cli"
  - "notesmd-cli install"
  - "notesmd cli"
  - "obsidian command line interface"
version: 0.1.0.0
---

# obsidian-cli (notesmd-cli + official obsidian)

> Install and verify the two CLI profiles mcp-obsidian's vault operations run on: headless `notesmd-cli` and the official `obsidian` CLI.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Installing `notesmd-cli` for headless vault operations, and enabling the official `obsidian` CLI to remote-control a running app. |
| **Invoke with** | `bash setup.sh`, then `notesmd-cli --help` and (once enabled in-app) `obsidian --help`. |
| **Works on** | macOS/Linux via Homebrew (`notesmd-cli`); Obsidian desktop **v1.12.4+** for the official `obsidian` CLI. |
| **Produces** | A `notesmd-cli` binary on `PATH` operating on the vault filesystem, plus an optional `obsidian` binary that controls a running Obsidian app. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-obsidian drives Obsidian vault operations through real third-party and first-party CLIs rather than reimplementing that surface. This folder is not vendored source. It is the install pointer and pinned identities that the parent skill's `SKILL.md` and `scripts/install.sh` read from.

The two profiles cover different runtime conditions, and the router picks by whether a live app is available:

- **Headless — `notesmd-cli`** (Yakitrak). Operates directly on the vault filesystem, so it works with **no running Obsidian app**. Use it for scripted, unattended, or app-less work.
- **App-backed — official `obsidian` CLI**. Ships with the Obsidian desktop app and **remote-controls a running app** (launching it if not running). Use it when a live app is already the source of truth.

### What Each Profile Is

**`notesmd-cli`** (binary name `notesmd-cli`) is an actively maintained Go CLI. It was renamed from "obsidian-cli" to avoid confusion with the official one. It exposes 14 subcommands and stores vault configuration at `~/.config/obsidian/obsidian.json`:

`open`, `daily`, `search`, `search-content`, `list`, `print`, `create`, `move`, `delete`, `frontmatter`, `add-vault`, `remove-vault`, `list-vaults`, `set-default-vault`.

**Official `obsidian` CLI** (binary name `obsidian`) shipped GA in Obsidian desktop **v1.12.4** (Feb 2026) and is free. It has no npm or Homebrew package — it ships inside the desktop app and is enabled from in-app settings, which registers the `obsidian` binary on `PATH` (macOS/Linux).

---

## 3. QUICK START

**Step 1: Install the headless CLI.**

```bash
bash setup.sh
```

Installs `notesmd-cli` via Homebrew when available, and no-ops if a `notesmd-cli` binary is already on `PATH`. If Homebrew is unavailable it prints the Scoop, AUR, and build-from-source instructions instead of installing. The same run then prints the steps to enable the official `obsidian` CLI — it never toggles anything inside the app for you.

**Step 2: Register a vault for `notesmd-cli`.**

```bash
notesmd-cli add-vault /path/to/your/Vault
notesmd-cli set-default-vault "Vault"
notesmd-cli list-vaults
```

Vault configuration is stored at `~/.config/obsidian/obsidian.json`. `notesmd-cli` reads and writes the vault as plain Markdown files — no running app or token is required.

**Step 3 (optional): Enable the official `obsidian` CLI.**

In the desktop app: **Settings → General → Command line interface → toggle on → "Register CLI"**. That auto-adds the `obsidian` binary to `PATH` on macOS/Linux. It requires Obsidian desktop **v1.12.4+** and a running app — the CLI is a remote control, not a filesystem tool.

**Step 4: Verify.**

```bash
notesmd-cli --help          # headless profile
obsidian --help             # app-backed profile (after Step 3)
```

Expected: `notesmd-cli` prints its subcommand list; `obsidian` prints its help only once the in-app CLI is enabled and registered.

---

## 4. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `notesmd-cli: command not found` after install | Homebrew's bin directory is not on `PATH`, or the fallback installer (Scoop/AUR/source) was never run | Re-run `bash setup.sh`, add Homebrew's bin to `PATH`, or follow the printed Scoop/AUR/source steps |
| `notesmd-cli` reports no default vault | No vault registered yet | `notesmd-cli add-vault <path>` then `notesmd-cli set-default-vault <name>` |
| `obsidian: command not found` | The in-app CLI is not enabled/registered, or the desktop app is older than v1.12.4 | Enable it in Settings → General → Command line interface → Register CLI; update Obsidian to v1.12.4+ |
| `obsidian` commands hang or error | The app-backed CLI needs a running app; it controls the desktop app rather than the filesystem | Launch Obsidian (or let the CLI launch it), then retry |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between the CLI profiles and the Obsidian MCP |
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Full command reference with agent patterns |
| [`../../INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md) | Step-by-step install with validation checkpoints |
