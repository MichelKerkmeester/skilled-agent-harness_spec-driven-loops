# mcp-magicpath Installation Guide

Complete installation and configuration guide for the MagicPath CLI (`magicpath-ai`), the single interface for finding, inspecting, installing, and authoring MagicPath UI components. Covers three install paths (global npm, in-skill vendor, and on-demand `npx`), browser-session authentication, and an end-to-end verification. MagicPath has no MCP server, so there is no platform MCP configuration to manage.

---

## 0. AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install the MagicPath CLI for the mcp-magicpath skill from https://github.com/MagicPathAI/agent-skills

Please help me:
1. Verify I have Node.js 16+ and npm installed
2. Install the magicpath-ai CLI (global, in-skill vendor, or npx)
3. Authenticate with my MagicPath account in the browser
4. Verify the install with `magicpath-ai info -o json`

My project is located at: [your project path]
Preferred install: [global / in-skill vendor / npx]
```

**What the AI will do:**
- Verify Node.js 16+ and npm are available
- Install `magicpath-ai` via the path you choose
- Walk you through the browser login
- Confirm `auth.authenticated` is true with a test call

**Expected setup time:** 3 minutes

---

## 1. OVERVIEW

`magicpath-ai` is the official CLI for MagicPath, a platform for building, sharing, and installing UI components with AI. The `mcp-magicpath` skill drives this CLI to discover components, read their source, install them into an app, and author components on the canvas.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Key Features

| Feature | Description |
|---|---|
| **Install direction** | Find, `inspect`, and `add` MagicPath components into a React or TypeScript app |
| **Author direction** | Create and edit canvas components from local code with the `code` subcommands |
| **CLI only** | No MCP server and no platform config. Everything runs through `magicpath-ai` |

### Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                      Agent / Terminal                           │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ runs
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                magicpath-ai CLI (Node.js)                       │
│  info / search / inspect / add / code start / code submit       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ authenticated browser session
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MagicPath backend                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PREREQUISITES

**Phase 1** confirms the required runtime is present.

### Required Software

1. **Node.js** (16.0.0 or newer)
   ```bash
   node --version
   # → v16.x or newer (for example v20.11.0)
   ```

2. **npm** (ships with Node.js)
   ```bash
   npm --version
   # → 8.x or newer
   ```

### Validation: `phase_1_complete`

```bash
node --version    # → v16+
npm --version     # → 8+
```

**Checklist:**
- [ ] `node --version` is v16 or newer?
- [ ] `npm --version` prints a version?

❌ **STOP if validation fails** - Install Node.js 16+ from https://nodejs.org/ before continuing.

---

## 3. INSTALLATION

This section covers **Phase 2 (Install)** and **Phase 3 (Verify the binary)**. Pick one of three paths.

### Option A: Global install (recommended)

```bash
bash .opencode/skills/mcp-magicpath/scripts/install.sh
# Installs magicpath-ai globally via npm and verifies the version.
```

### Option B: In-skill vendor (local node_modules)

```bash
bash .opencode/skills/mcp-magicpath/mcp-servers/magicpath-cli/setup.sh
# Vendors magicpath-ai into the skill's local node_modules.
```

### Option C: On demand with npx (no install)

```bash
npx -y magicpath-ai info -o json
# Fetches the package on first use. No global or local install needed.
```

### Validation: `phase_2_complete`

```bash
magicpath-ai --version
# → 2.3.2  (or, for the npx path: npx -y magicpath-ai --version)
```

**Checklist:**
- [ ] `magicpath-ai --version` prints a version (Option A or B)?
- [ ] Or `npx -y magicpath-ai --version` prints a version (Option C)?

❌ **STOP if validation fails** - Ensure your npm global bin directory is on PATH (`npm bin -g`), or use the npx path.

---

## 4. CONFIGURATION

Configuration for MagicPath is **authentication only**. There is no MCP server and no `opencode.json`, `.mcp.json`, or `claude_desktop_config.json` entry to add.

### Authenticate (Phase 4)

```bash
magicpath-ai login
# Opens the browser and completes login automatically when you authorize.
```

For a host with no browser, exchange a code directly:

```bash
magicpath-ai login --code <code>
```

### Validation: `phase_4_complete`

```bash
magicpath-ai whoami -o json
# → JSON with your user object
```

**Checklist:**
- [ ] `magicpath-ai whoami -o json` returns your user?

❌ **STOP if validation fails** - Re-run `magicpath-ai login` and complete the browser authorization.

---

## 5. VERIFICATION

Prove the CLI works end to end.

```bash
magicpath-ai info -o json
```

### Success Criteria (`phase_5_complete`)

- [ ] ✅ `info -o json` returns JSON with a `version` field
- [ ] ✅ `auth.authenticated` is `true`
- [ ] ✅ `teams` and `projects` arrays are present

❌ **STOP if validation fails** - If `auth.authenticated` is false, re-run `magicpath-ai login`.

---

## 6. USAGE

### Install a component into an app

```bash
# 1. Find a component across your workspaces
magicpath-ai search "card" -o json

# 2. Read its source read-only (safe in any project)
magicpath-ai inspect <generatedName> -o json

# 3. Install into a React or TypeScript app, then import it
magicpath-ai add <generatedName> -y
```

### Author a component on the canvas

```bash
# Start a pending revision and scaffold editable files
magicpath-ai code start --project <projectId> --dir ./mp --name "Hero Card" -o json

# Submit edits and wait for the build
magicpath-ai code submit --dir ./mp --wait -o json
```

See [`SKILL.md`](SKILL.md) and [`references/cli_reference.md`](references/cli_reference.md) for the full workflow and command surface.

---

## 9. TROUBLESHOOTING

### Common Errors

**❌ "command not found: magicpath-ai"**
- **Cause**: The global npm bin directory is not on PATH.
- **Fix**:
  ```bash
  export PATH="$(npm bin -g):$PATH"
  # Or use the npx path: npx -y magicpath-ai info -o json
  ```

**❌ First `npx` call hangs for several seconds**
- **Cause**: `npx` is downloading the package on first use.
- **Fix**: Wait for the download. Subsequent calls are fast. Pass `-y` so it never blocks on a prompt.

**❌ `auth.authenticated` is false**
- **Cause**: Not logged in, or the session expired.
- **Fix**:
  ```bash
  magicpath-ai login
  magicpath-ai whoami -o json   # confirm the user
  ```

**❌ Login cannot open a browser (headless host)**
- **Cause**: No browser on the machine.
- **Fix**:
  ```bash
  magicpath-ai login --code <code>   # exchange a browser authorization code
  ```

**❌ `add` failed or wrote nothing**
- **Cause**: The target is not a React or TypeScript project, or files already exist.
- **Fix**: Use `magicpath-ai inspect <generatedName> -o json` and translate by hand for non-JS targets, or add `--overwrite` to replace existing files.

**❌ Node version error during install**
- **Cause**: Node.js is older than 16.
- **Fix**: Upgrade Node.js to 16 or newer from https://nodejs.org/.

---

## 10. RESOURCES

### File Locations

| Path | Purpose |
|---|---|
| `scripts/install.sh` | Global `magicpath-ai` installer |
| `mcp-servers/magicpath-cli/` | In-skill CLI vendor (`package.json` + `setup.sh`) |
| `references/cli_reference.md` | Full command reference |
| `references/magicpath_operations.md` | Full operational playbook |

### CLI Command Reference

```bash
# Auth and context
magicpath-ai info -o json
magicpath-ai login
magicpath-ai whoami -o json

# Discover and install
magicpath-ai search "<query>" -o json
magicpath-ai inspect <generatedName> -o json
magicpath-ai add <generatedName> -y

# Author on the canvas
magicpath-ai code start --project <id> --dir <dir> -o json
magicpath-ai code submit --dir <dir> --wait -o json
```

### External Resources

- **GitHub Repository**: https://github.com/MagicPathAI/agent-skills
- **npm Package**: https://www.npmjs.com/package/magicpath-ai

---

## Quick Start Summary

```bash
# 1. Prerequisites
node --version   # v16+

# 2. Install (pick one)
bash .opencode/skills/mcp-magicpath/scripts/install.sh   # global
# or: bash .opencode/skills/mcp-magicpath/mcp-servers/magicpath-cli/setup.sh   # in-skill
# or: npx -y magicpath-ai info -o json                   # on demand

# 3. Authenticate
magicpath-ai login

# 4. Verify
magicpath-ai info -o json   # auth.authenticated == true
```

---

**Installation Complete!**

You now have the `magicpath-ai` CLI installed and authenticated. Ask the agent to find, inspect, install, or author MagicPath components, and the mcp-magicpath skill takes it from there.
