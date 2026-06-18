# mcp-figma Installation Guide

Complete installation and configuration guide for the `mcp-figma` skill, which drives Figma Desktop from the terminal through the silships CLI. Installs and verifies the silships **`figma-ds-cli`** binary (the primary tool), sets up the safe-default plugin connection and local daemon, and optionally wires the community Framelink Figma MCP through this project's Code Mode for pulling design context the other way. The CLI works fully on its own and the MCP is opt-in. No Figma API key is needed for the CLI.

> **Naming trap, read first.** Install **`figma-ds-cli`**, the unambiguous npm package for the silships tool. The npm package literally named **`figma-cli` is an UNRELATED tool** (unic/figma-cli, by Fredi Bach, which installs a bin named `figma`). **Never run `npm i -g figma-cli`.** A `figma-cli` command exists as a second name for the silships tool only when you build from the silships repo.
> **Package:** `figma-ds-cli` (silships) | **Dependencies:** Node.js 18+, Figma Desktop, macOS baseline

**Version:** 1.0.0.0 | **Updated:** 2026-06-15 | **Transport:** local daemon (HTTP 127.0.0.1:3456)

---

## 0. AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to set up the mcp-figma skill (the silships figma-ds-cli, plus the optional Code Mode Figma MCP).

Please help me:
1. Check that I have Node.js 18+ and npm installed
2. Run the skill's scripts/install.sh, which installs figma-ds-cli and auto-upgrades the stale npm 1.0.0 to the full repo 1.2.0
3. Verify the binary identity with scripts/doctor.sh (confirm figma-ds-cli resolved, not the unrelated unic figma-cli)
4. Open Figma Desktop with a file, then connect with the safe default (connect-safe.sh)
5. (Optional) Wire the Code Mode Framelink figma manual by adding figma_FIGMA_API_KEY to .env

My platform is: [macOS / Linux / Windows]

Guide me through each step with the exact commands needed. Never run `npm i -g figma-cli`.
```

The AI will:
- Verify Node.js 18 or newer is available on your system
- Run `scripts/install.sh`, which installs and verifies only and never connects or patches Figma
- Confirm `figma-ds-cli --version` is at least 1.2.0 and that the unrelated `figma-cli` is not the resolved binary
- Walk you through the safe-default plugin connection and a daemon health check
- Wire the optional Code Mode Figma MCP only if you ask for it

**Expected setup time:** 3 to 8 minutes

### Quick Success Check (30 seconds)

After installation, run these checks immediately:

1. Run `figma-ds-cli --version`. A version of `1.2.0` or higher means the full surface installed.
2. Run `./doctor.sh`. A clean report with `figma-ds-cli` resolved means the binary identity is correct.
3. Open Figma Desktop with a file, then run `./connect-safe.sh`. A successful plugin bridge means the live session is reachable.

Not working? Go to [Troubleshooting](#9-troubleshooting).

---

## 1. OVERVIEW

`mcp-figma` drives Figma Desktop from the terminal. Through `figma-ds-cli` you inspect, export, render, manage tokens, variables and components, and extract or import a design system, all against the live Figma Desktop session. Optionally, you pull Figma design data into the agent for codegen through the Code Mode `figma` manual, the community Framelink server.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Source Repository

| Property        | Value                                                                       |
| --------------- | --------------------------------------------------------------------------- |
| **GitHub**      | [silships/figma-cli](https://github.com/silships/figma-cli)                 |
| **npm (CLI)**   | `figma-ds-cli`                                                              |
| **npm (full)**  | `1.2.0` is repo `main` only, unpublished on npm                            |
| **npm (stale)** | `figma-ds-cli@1.0.0` is the only published build, minimal surface           |
| **Optional MCP**| `figma-developer-mcp` (community Framelink, via Code Mode)                  |
| **License**     | MIT                                                                          |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              CLI AI Agents (OpenCode / Claude Code)          │
└──────────────┬──────────────────────────────┬───────────────┘
               │ figma-ds-cli (primary)        │ Code Mode (optional)
               ▼                               ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  figma-ds-cli local daemon  │   │  Framelink figma manual     │
│  HTTP 127.0.0.1:3456        │   │  figma-developer-mcp, stdio │
│  token-authenticated        │   │  reads figma_FIGMA_API_KEY  │
└──────────────┬──────────────┘   └──────────────┬──────────────┘
               │ live Desktop session             │ Figma REST API
               ▼                                  ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  Figma Desktop (open file)  │   │  Figma cloud (read context) │
└─────────────────────────────┘   └─────────────────────────────┘
```

### Two Directions

| Direction               | Tool                       | When to Use                                          | Required   |
| ----------------------- | -------------------------- | ---------------------------------------------------- | ---------- |
| **CLI (primary)**       | `figma-ds-cli`             | Author, modify and export in Figma Desktop           | Yes        |
| **MCP (optional)**      | Framelink `figma` manual   | Pull Figma design data into the agent for codegen    | Opt-in     |

Default to the CLI. The optional MCP runs the other direction and the CLI does not require it.

---

## 2. PREREQUISITES

Phase 1 confirms the environment is ready before any install.

- [ ] **Node.js 18 or newer** installed (`node -v`)
- [ ] **npm** installed (`npm -v`)
- [ ] **Figma Desktop** installed and open with a file for any connect, daemon or CLI operation (no Figma API key needed for the CLI)
- [ ] **git** installed, needed only for installing from the silships repo (`--source repo`)
- [ ] **macOS** is the supported baseline. Linux and Windows are experimental and unverified for this tool.

### Validation: `phase_1_complete`

```bash
node -v
```

**Expected output**:
```
v18.x.x or higher
```

**Checklist**:
- [ ] `node -v` shows v18 or higher
- [ ] `npm -v` returns a version with no error
- [ ] Figma Desktop is open with a file

❌ **STOP if validation fails.** Fix prerequisites before continuing.

---

## 3. INSTALLATION

This section covers Phase 2 (install) and Phase 3 (binary identity). Run the scripts from the skill's `scripts/` directory.

### Step 1: Install figma-ds-cli

```bash
./install.sh
```

The default `--source auto` installs from npm, detects the stale `1.0.0`, and auto-upgrades to `1.2.0` from the silships repo. This is the recommended path. The installer installs and verifies only. It never connects to Figma and never patches Figma Desktop.

### Step 2: Choose a source if you need to

```bash
./install.sh --source repo   # build 1.2.0 from silships/figma-cli (full surface, also exposes figma-cli)
./install.sh --source npm    # npm only = MINIMAL 1.0.0 (no safe connect, no daemon, no extract), not recommended
./install.sh --force         # reinstall even if present
```

### Validation: `phase_2_complete`

```bash
figma-ds-cli --version
```

**Expected output**:
```
1.2.0 (or higher)
```

**Checklist**:
- [ ] `figma-ds-cli --version` returns `1.2.0` or higher
- [ ] The installer did not run `npm i -g figma-cli`

❌ **STOP if validation fails.** A version below `1.2.0` means the minimal npm build installed. Re-run `./install.sh` or `./install.sh --source repo`.

### Step 3: Confirm binary identity

```bash
./doctor.sh
```

`doctor.sh` is a read-only environment report. It checks Node and npm, the binary identity, Figma Desktop, the daemon, ports and the Code Mode `figma` manual. It flags whether a bare `figma` command (the unrelated unic tool) is on PATH and confirms whether `figma-ds-cli` resolved.

### Validation: `phase_3_complete`

```bash
figma-ds-cli --help | head -1
```

**Expected output**:
```
The silships figma-ds-cli usage line (not the unic/figma-cli tool)
```

**Checklist**:
- [ ] `doctor.sh` confirms `figma-ds-cli` resolved
- [ ] `doctor.sh` does not report the unrelated bare `figma` tool as the active binary

❌ **STOP if validation fails.** If only the unrelated `figma-cli` is on PATH, reinstall with `./install.sh --source repo`.

---

## 4. CONFIGURATION

Phase 4 connects the live session and confirms the daemon. The CLI configuration is the connection itself, not a JSON config file.

### Connect Modes

```bash
./connect-safe.sh            # DEFAULT, FigCli plugin bridge, NO patch
./connect-yolo.sh --i-understand-this-patches-figma   # GATED, patches Figma app.asar, CDP on 9222
```

**Safe** is the default and changes nothing in the Figma app bundle. Import `plugin/manifest.json` once, then keep `Plugins > Development > FigCli` open each session.

**Yolo** patches Figma Desktop's `app.asar` and exposes CDP on `127.0.0.1:9222`. It may need Full Disk Access or admin rights and **breaks when Figma updates**. It refuses to run without the explicit consent flag. Roll a patch back with `./unpatch.sh`.

### Daemon Lifecycle

```bash
./daemon.sh status           # health
./daemon.sh diagnose         # full troubleshooting
./daemon.sh restart          # after "Unauthorized" or token mismatch
./daemon.sh reconnect        # re-link to Figma
```

The daemon is an HTTP server on `127.0.0.1:3456`, authenticated by a token at `~/.figma-ds-cli/.daemon-token` (never expose it). It is idle-timed, exits after about 60 minutes, and is not reboot-persistent. On `Unauthorized`, run `diagnose` then `restart`. Do not delete the token.

### Validation: `phase_4_complete`

```bash
./daemon.sh status
```

**Expected output**:
```
Daemon healthy on 127.0.0.1:3456 with the token present
```

**Checklist**:
- [ ] `./connect-safe.sh` reports a successful plugin bridge
- [ ] `./daemon.sh status` reports healthy against `127.0.0.1:3456`
- [ ] The token at `~/.figma-ds-cli/.daemon-token` is present and untouched

❌ **STOP if validation fails.** Run `./daemon.sh diagnose` then `./daemon.sh restart`. Confirm Figma Desktop is open with a file.

---

## 5. VERIFICATION

Phase 5 proves the CLI drives the live session end to end.

### One-Command Health Check

```bash
./doctor.sh && figma-ds-cli --version && figma-ds-cli daemon status \
  && echo "SUCCESS: figma-ds-cli reachable" \
  || echo "FAILED: check error output above"
```

### Full Verification Checklist

| # | Check            | Command                                | Expected Result                              |
| - | ---------------- | -------------------------------------- | -------------------------------------------- |
| 1 | Binary version   | `figma-ds-cli --version`               | `1.2.0` or higher                            |
| 2 | Binary identity  | `./doctor.sh`                          | `figma-ds-cli` resolved, not unic/figma-cli  |
| 3 | CLI reachable    | `figma-ds-cli --help`                  | Usage text with Figma Desktop open           |
| 4 | Daemon health    | `figma-ds-cli daemon status`           | Healthy on `127.0.0.1:3456`, token present   |
| 5 | Read-only export | `figma-ds-cli extract --out DESIGN.md` | A 9-section DESIGN.md written to the path     |

### Validation: `phase_5_complete`

A read-only `extract` returns content against the open file, and the daemon stays healthy. The system is operational.

❌ **STOP if validation fails.** Review [Troubleshooting](#9-troubleshooting), confirm Figma Desktop is open with a file, then restart the daemon.

---

## 6. USAGE

### Daily Workflow

```bash
# 1. Open Figma Desktop with a file
# 2. Connect once per session with the safe default
./connect-safe.sh

# 3. Confirm the daemon is healthy
./daemon.sh status

# 4. Inspect or export read-only, the safe default
figma-ds-cli extract --out DESIGN.md
```

### Common Operations

```bash
# Read-only: never changes the document
figma-ds-cli get <target>            # inspect a node
figma-ds-cli export <target> --out <path>   # export to an explicit path

# Mutating: gated behind confirmation, changes the open file
figma-ds-cli create <spec>           # author a frame or component
figma-ds-cli render <spec>           # render into the file

# Daemon management
./daemon.sh restart                  # after "Unauthorized"
./unpatch.sh                         # roll back a yolo patch
```

---

## 7. OPTIONAL FIGMA MCP VIA CODE MODE

The optional Figma MCP is opt-in and runs the other direction, pulling design data into the agent for codegen. It is not required for the CLI.

### Step 1: Print the wiring snippet

```bash
./print-utcp-snippets.sh
```

This prints the Framelink `figma` manual and the `.env` line. It edits nothing. The Code Mode manual `figma` (Framelink `figma-developer-mcp`, stdio) is already registered in `.utcp_config.json`.

### Step 2: Add the prefixed token to .env

```bash
figma_FIGMA_API_KEY=figd_your_token_here
```

Code Mode prefixes the manual name onto the environment variable, so a bare `FIGMA_API_KEY` fails. The variable must be `figma_FIGMA_API_KEY`.

### Step 3: Discover before calling

```bash
# In Code Mode context, discover the live tools first
list_tools()
search_tools("figma")
tool_info("figma.figma_<tool>")
```

Calls go through `call_tool_chain()` using the naming convention `figma.figma_<tool>`. Live-confirmed tools include `get_figma_data` and `download_figma_images`. Always discover the live tool set before invoking, rather than assuming a tool exists or is read-only.

The **official** Figma Dev Mode MCP is out of scope for this release and is not a documented or supported path here. See `references/mcp_wiring.md` for the future-option note.

---

## 8. SAFETY MODEL

The CLI's verbs fall into classes, and the gate depends on the class.

- **Read-only** verbs are the safe default: `status`, `get`, `find`, `inspect`, `var list`, `var find`, `extract`, every `export` form, the analyze and a11y audits, and dry-run variants. None change the document. Local exports still write files, so always pass an explicit output path and never silently overwrite.
- **Mutating** verbs change the open file and are gated behind confirmation: every `create`, `render`, token and variable verb, the bind and set families, layout verbs, variant generation, imports, and the app-level `connect`, `unpatch` and `config set`.
- **Destructive** verbs are stricter still, requiring explicit confirmation, an explicit target, a command preview and a one-line rollback. The destructive set is `var delete-all`, `var delete-batch`, `delete` and `remove`, `node delete`, `undo`, `unwrap`, `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear` and `annotate clear`. Prefer duplicating the file or page first. Figma undo and version history are the fallback rollback.
- **Arbitrary** verbs `eval`, `raw` and `run` execute arbitrary instructions. The skill treats them as mutating and reviews the code or command before running it, even when the prompt sounds exploratory.
- **Never** auto-patch Figma (yolo is consent-gated) and **never** auto-delete.

Full taxonomy: `references/tool_surface.md`.

---

## 9. TROUBLESHOOTING

### Error/Cause/Fix Reference

| Error | Cause | Fix |
| ----- | ----- | --- |
| `command not found: figma-ds-cli` | The binary is not installed, or only the unrelated `figma-cli` npm package is on PATH | Run `./install.sh` (or `./install.sh --source repo`). Never `npm i -g figma-cli`, which installs the unrelated unic/figma-cli |
| `figma-ds-cli --version` is below `1.2.0` | The minimal npm `1.0.0` build installed, missing `--safe`, `daemon` and `extract` | Re-run `./install.sh` to auto-upgrade, or `./install.sh --source repo` to build `1.2.0` |
| A bare `figma` command behaves strangely | The bare `figma` bin is the unrelated unic/figma-cli, not the silships tool | Run `./doctor.sh` to confirm which binary resolved. The `figma-cli` name is the silships tool only when built from the silships repo |
| Every command fails or hangs | Figma Desktop is closed, or open with no file, so there is no live session | Open Figma Desktop with a file. The CLI drives the live Desktop session and has no API-key fallback |
| `Unauthorized` from a daemon command | The daemon token is stale or the daemon is unhealthy | Run `./daemon.sh diagnose` then `./daemon.sh restart`. Never delete the token at `~/.figma-ds-cli/.daemon-token` |
| The yolo connect broke after a Figma update | Yolo mode patches `app.asar`, which a Figma update overwrites | Re-run `./connect-yolo.sh` only with consent, or prefer `./connect-safe.sh`. Roll back with `./unpatch.sh` |
| Port `9222` already in use after yolo | Another process holds the CDP debug port | Run `lsof -i :9222` and free the port, or use `./connect-safe.sh`, which needs no debug port |
| An export silently overwrote a file | An export ran without an explicit, unique output path | Always pass an explicit output path to `extract` and `export` verbs. The skill never silently overwrites |
| A Code Mode `figma.figma_<tool>` call fails | The Framelink token is not configured, or the variable was not prefixed | Set `figma_FIGMA_API_KEY` in `.env` (the prefix is required), then run `list_tools()` or `search_tools("figma")` before relying on any tool |

See `references/troubleshooting.md` for the full symptom, cause and fix detail, including the binary collision, Figma not running, daemon `Unauthorized`, port conflicts, the Code Mode env-var prefix and tools-not-discovered.

---

## 10. RESOURCES

### File Locations

| Path                                  | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| `scripts/install.sh`                  | Install and verify, auto-upgrade stale npm 1.0.0   |
| `scripts/doctor.sh`                   | Read-only environment and binary-identity report   |
| `scripts/connect-safe.sh`            | Safe-default plugin bridge connection              |
| `scripts/connect-yolo.sh`            | Gated patched connection, consent flag required    |
| `scripts/daemon.sh`                   | Daemon status, diagnose, restart, reconnect        |
| `scripts/unpatch.sh`                  | Roll back the yolo `app.asar` patch                |
| `scripts/print-utcp-snippets.sh`     | Print the Code Mode wiring and `.env` line         |
| `~/.figma-ds-cli/.daemon-token`       | Daemon auth token, never expose                    |
| `~/.figma-ds-cli/source`              | External silships clone, figma-cli is not vendored |

### Related Documentation

| Document | Location | Purpose |
| -------- | -------- | ------- |
| README | `.opencode/skills/mcp-figma/README.md` | Human orientation and quick start |
| SKILL.md | `.opencode/skills/mcp-figma/SKILL.md` | Runtime instructions and routing |
| CLI Reference | `.opencode/skills/mcp-figma/references/figma_cli_reference.md` | Binary identity, daemon, connect modes |
| Tool Surface | `.opencode/skills/mcp-figma/references/tool_surface.md` | Read-only, mutating and destructive taxonomy |
| MCP Wiring | `.opencode/skills/mcp-figma/references/mcp_wiring.md` | Optional Framelink MCP through Code Mode |
| Troubleshooting | `.opencode/skills/mcp-figma/references/troubleshooting.md` | Full failure-mode table |

### Licensing and Upstream

The silships tool is **MIT** ([silships/figma-cli](https://github.com/silships/figma-cli), npm `figma-ds-cli`). This skill references upstream and installs from npm or an external clone. It does **not** vendor figma-cli source. The optional MCP is the community Framelink `figma-developer-mcp`.

### External Resources

- **GitHub Repository**: [silships/figma-cli](https://github.com/silships/figma-cli)
- **npm Package (CLI)**: `figma-ds-cli`
- **Optional MCP**: `figma-developer-mcp` (community Framelink)

---

## Quick Reference Card

### Install and Verify

```bash
./install.sh                 # install + auto-upgrade stale npm 1.0.0 to repo 1.2.0
./doctor.sh                  # read-only environment and binary-identity report
figma-ds-cli --version       # confirm 1.2.0 or higher
```

### Connect and Daemon

```bash
./connect-safe.sh            # DEFAULT, no patch
./connect-yolo.sh --i-understand-this-patches-figma   # GATED, patches app.asar
./daemon.sh status           # daemon health on 127.0.0.1:3456
./unpatch.sh                 # roll back the yolo patch
```

### Optional MCP

```bash
./print-utcp-snippets.sh     # print Framelink wiring + .env line
# Then add to .env:
figma_FIGMA_API_KEY=figd_your_token_here
```

### Validation Checkpoints Summary

| Checkpoint         | Meaning                              |
| ------------------ | ------------------------------------ |
| `phase_1_complete` | Prerequisites validated              |
| `phase_2_complete` | figma-ds-cli installed at 1.2.0+     |
| `phase_3_complete` | Binary identity confirmed            |
| `phase_4_complete` | Connection and daemon healthy        |
| `phase_5_complete` | Read-only export works, operational  |

---

## Version History

| Version | Date       | Changes                                                                    |
| ------- | ---------- | -------------------------------------------------------------------------- |
| 1.0.0.0 | 2026-06-15 | First stable release. Live verification against figma-ds-cli 1.2.0, embedded `mcp-servers/figma-cli` install scaffold, install and doctor parity with the other mcp skills, house-voice pass. |
| 0.1.0   | 2026-06-14 | Initial release. CLI-primary skill (figma-ds-cli), install and safety scripts, optional Framelink MCP via Code Mode. Pre-1.0 until live external verification is complete. |

---

**Need help?** See [Troubleshooting](#9-troubleshooting) or load the `mcp-figma` skill for detailed workflows.
