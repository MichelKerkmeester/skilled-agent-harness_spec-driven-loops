# mcp-obsidian Installation Guide

Complete installation and configuration for Obsidian vault work through three routed surfaces. `notesmd-cli` is the primary headless CLI for filesystem operations. The official `obsidian` CLI is the optional app-backed profile. Cyanheads' `obsidian-mcp-server@3.2.9` is the structured live-app MCP path through Code Mode and Local REST API.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../../../install-guides/README.md) for complete setup.
> **Package:** `notesmd-cli` (Yakitrak) | **Dependencies:** a vault filesystem; Homebrew or a supported manual installer for the headless profile; Obsidian desktop v1.12.4+ for the official CLI; Node.js 18+ and npx for the MCP path
> **Validation:** run the mode-root scripts and the checks in this guide; detailed runtime recovery lives in [`references/troubleshooting.md`](references/troubleshooting.md).

**Version:** 1.0.0.0 | **Updated:** 2026-08-02

---

## 0. AI-FIRST INSTALL GUIDE

Copy and paste this prompt to your AI assistant to get installation help:

```
Run the embedded install script:
  bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh

It will:
  1. Install notesmd-cli through Homebrew when available, or print the
     Scoop, AUR, and source-build alternatives
  2. Print the in-app steps to enable the official obsidian CLI
  3. Print the cyanheads Obsidian MCP manual and obsidian_OBSIDIAN_* env keys

Then configure the headless vault profile:
  notesmd-cli add-vault "/path/to/Vault"
  notesmd-cli set-default-vault "Vault"

Verify:
  notesmd-cli --version
  notesmd-cli list-vaults
  notesmd-cli list

For the optional live-app profile, enable the official CLI in Obsidian:
  Settings → General → Command line interface → toggle on → Register CLI
  obsidian --help

For the optional MCP path, keep Obsidian running with Local REST API v4.0.0+
enabled and an API key. The later Code Mode configuration step registers the
printed `obsidian` manual in .utcp_config.json; this install script only prints
the manual and never writes configuration files.
```

### Quick Success Check (30 seconds)

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh --check-only
notesmd-cli --version && notesmd-cli list-vaults
```

The headless profile is ready when `notesmd-cli` resolves and a vault is registered. Not working? Go to [Troubleshooting](#6-troubleshooting).

---

## 1. OVERVIEW

| Component | Source | Package | Install | Required For |
|---|---|---|---|---|
| **Headless CLI** | Yakitrak | `notesmd-cli` | `bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh` or the listed Homebrew/Scoop/AUR/source path | Filesystem-native vault work with no running app |
| **App-backed CLI** | Obsidian desktop v1.12.4+ | `obsidian` | Enable Command line interface and Register CLI in the desktop app | Live UI, app context, and URI-driven operations |
| **Cyanheads MCP** | cyanheads | `obsidian-mcp-server@3.2.9` | Later Code Mode manual: `npx -y obsidian-mcp-server@latest` over stdio | Structured live-vault note, search, and tag operations |

### When to Install What

```
Need Obsidian access?
  │
  ├─ Vault files, daily notes, search, or automation with no app?
  │     → notesmd-cli only (Sections 2-3)
  │
  ├─ Need the live Obsidian UI or an app-only action?
  │     → notesmd-cli + official obsidian CLI (Sections 2-3)
  │
  └─ Need structured note reads/writes, tags, or live-vault search?
        → notesmd-cli + app + Local REST API + MCP manual (Sections 2-4)
```

### Architecture

```
Agent
  │
  ├── notesmd-cli list / search / create / print / daily
  │     └── Vault filesystem (no running app)
  │
  ├── obsidian --help and verified live-app commands
  │     └── Obsidian desktop v1.12.4+ (app-backed)
  │
  └── call_tool_chain("obsidian.obsidian_*")
        └── Code Mode MCP
              └── obsidian-mcp-server@3.2.9 via stdio
                    └── Local REST API plugin in the running Obsidian app
```

---

## 2. PREREQUISITES & INSTALLATION

### Prerequisites

- **For the headless CLI:** a vault directory and either Homebrew, Scoop, AUR, or Go 1.19+ for the documented source-build route
- **For the official CLI:** Obsidian desktop **v1.12.4+**
- **For the MCP only:** Node.js **18+** and npx, a running Obsidian app, Local REST API plugin **v4.0.0+**, and an API key

### Install `notesmd-cli`

```bash
# Recommended from this mode: installs through Homebrew when it is available
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh

# Direct Homebrew install for macOS / Linux
brew tap yakitrak/yakitrak && brew install yakitrak/yakitrak/notesmd-cli

# Verify
notesmd-cli --version
which notesmd-cli
```

When Homebrew is unavailable, use one verified alternative:

```bash
# Windows (Scoop)
scoop bucket add scoop-yakitrak https://github.com/yakitrak/scoop-yakitrak.git
scoop install notesmd-cli

# Arch Linux (AUR)
yay -S notesmd-cli-bin
```

For source builds, use Go 1.19+, clone `https://github.com/Yakitrak/obsidian-cli`, and build it with `go build`. `go install` is not supported.

---

## 3. VAULT & APP-BACKED CLI CONFIGURATION

### Register a Headless Vault

`notesmd-cli` stores registered vaults in `~/.config/obsidian/obsidian.json`. Register and pin the vault before a note write:

```bash
notesmd-cli add-vault "/path/to/your/Vault"
notesmd-cli set-default-vault "Vault"
notesmd-cli list-vaults
notesmd-cli list
```

Use `notesmd-cli search "query"` for note-name search and `notesmd-cli search-content "query"` for content search. Empty output is valid; verify the default vault and query before treating it as a problem.

### Enable the Official `obsidian` CLI (Optional)

The official CLI ships with the desktop app; it has no npm or Homebrew install. In Obsidian desktop v1.12.4+:

1. Open **Settings → General → Command line interface**.
2. Toggle the feature on.
3. Click **Register CLI**.
4. Open a new shell and run `obsidian --help`.

On macOS/Linux, registration adds `obsidian` to `PATH`. The official CLI remote-controls the app (and launches it if needed); it is not a headless filesystem replacement. Confirm any exact subcommand or flag with `obsidian --help` before scripting it.

---

## 4. MCP CONFIGURATION (OPTIONAL)

The cyanheads server runs over stdio as `npx -y obsidian-mcp-server@latest`. It reaches the vault through Obsidian's Local REST API plugin, so the app must be running with Local REST API v4.0.0+ enabled and an API key generated.

**Code Mode (`.utcp_config.json`, the path this mode uses):**

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

The environment values are:

```bash
obsidian_OBSIDIAN_API_KEY=
obsidian_OBSIDIAN_BASE_URL=http://127.0.0.1:27123
obsidian_OBSIDIAN_VERIFY_SSL=false
```

The `obsidian_` prefix matches the manual name. This documentation phase does not modify `.utcp_config.json` or `.env.example`; the later configuration phase owns that registration. Once it is registered, restart the AI client, enumerate `list_tools()`, then use the confirmed form `obsidian.obsidian_<tool_name>` through `call_tool_chain({ code })`.

---

## 5. VERIFICATION

```bash
# Read-only mode diagnostics
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh

# Confirm the installer sees the headless profile without installing
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh --check-only

# Headless vault health
notesmd-cli --version
notesmd-cli list-vaults
notesmd-cli list
notesmd-cli search "nonexistent"
```

The last search may return empty output and still pass. For the app-backed profile, `obsidian --help` must resolve after in-app registration. For the MCP profile, first confirm a live `obsidian.obsidian_*` tool with `list_tools()` and `tool_info()` before performing a real note operation.

---

## 6. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---|---|---|
| `command not found: notesmd-cli` | The CLI is not installed or its prefix is absent from `PATH` | Run the mode-root installer, then follow its Homebrew, Scoop, AUR, or source-build instructions |
| No default vault | A vault was not registered or selected | Run `notesmd-cli add-vault <path>` and `notesmd-cli set-default-vault <name>` |
| `command not found: obsidian` | The desktop CLI has not been registered | Enable it in Settings → General → Command line interface → Register CLI |
| Local REST API connection refused | App closed, plugin disabled, or base URL mismatch | Open the app and target vault, enable Local REST API v4.0.0+, and check `OBSIDIAN_BASE_URL` |
| 401 from MCP | Missing or invalid Local REST API token | Copy a fresh API key and expose it as `obsidian_OBSIDIAN_API_KEY` for the manual |
| npx cannot launch the MCP | Node/npx unavailable or registry fetch failed | Confirm Node.js 18+, npx, and the `obsidian-mcp-server@latest` launch command |
| Tool name fails | The tool name or schema was assumed | Run `list_tools()` then `tool_info()`; only the five core names are confirmed in the static reference |

Full diagnosis and recovery: [`references/troubleshooting.md`](references/troubleshooting.md).

---

## 7. RESOURCES

| Resource | Purpose |
|---|---|
| [`SKILL.md`](SKILL.md) | Router, agent invariants, and surface selection rules |
| [`README.md`](README.md) | Human-facing overview, FAQ, and verification checklist |
| [`references/obsidian-cli-commands.md`](references/obsidian-cli-commands.md) | Complete headless and app-backed CLI reference |
| [`references/mcp-tools.md`](references/mcp-tools.md) | Cyanheads MCP tool inventory, prerequisites, and invocation pattern |
| [`references/troubleshooting.md`](references/troubleshooting.md) | Diagnostics for PATH, vault, app, REST API, and MCP failures |
| [`examples/README.md`](examples/README.md) | Three example workflows: headless notes, MCP roundtrip, and Beancount transactions |
| [`mcp-servers/obsidian-cli/README.md`](mcp-servers/obsidian-cli/README.md) | Two-profile CLI install pointer |
| [`mcp-servers/obsidian-mcp/README.md`](mcp-servers/obsidian-mcp/README.md) | Config-only cyanheads MCP install pointer |

---

**Need help?** See [Troubleshooting](#6-troubleshooting) or load the `mcp-obsidian` skill for the detailed operation router.

