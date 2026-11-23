---
title: mcp-figma
description: Drives Figma Desktop from the terminal so an agent can read, author, modify and export designs, tokens, components and variables with no API key, plus an optional MCP that pulls design context into the agent through Code Mode.
trigger_phrases:
  - "figma cli"
  - "figma-ds-cli"
  - "figma desktop"
  - "render in figma"
  - "drive figma from the terminal"
  - "figma mcp"
version: 1.1.12.0
---

# mcp-figma

> Turn the Figma file you have open into something an agent can operate: read the design, build frames, manage tokens and export the result, with no API key to manage.

The work runs through a terminal CLI that drives the live desktop session. An optional bridge pulls design context back into the agent.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Reading and building design work in the Figma file you have open |
| **Invoke with** | "figma cli", "figma-ds-cli", "render in figma", "figma tokens", "figma mcp" |
| **Works on** | Figma Desktop with a file open, through `figma-ds-cli` and its local daemon |
| **Produces** | Frames and components in the open file, tokens and variables, export files, design context through the optional MCP |

### What It Does

The skill gives an agent a safe route into Figma Desktop from a terminal. It reads the open file, builds frames and components, manages tokens and variables and exports assets or code to a path you name. The canonical command is `figma-ds-cli`. It covers every task without a Figma API key.

It is the transport, not the design authority. A measured Style Reference of extracted design tokens belongs to the `sk-design-md-generator` mode in `sk-design`. This skill reaches Figma for it rather than producing one.

### Why This Skill Exists

The name collision catches people first. The tool publishes to npm as `figma-ds-cli`, while the npm package named `figma-cli` is a different project that installs a binary called `figma`. Install the wrong one and nothing in this skill matches what sits on your PATH.

The second problem is how much one verb can change. The command set runs from harmless reads to verbs that delete every variable in a collection. The skill states the class of a verb before it runs, so a read stays a read.

---

## 2. QUICK START

**Step 1: Confirm the binary.**

```bash
figma-ds-cli --version
command -v figma-ds-cli
```

This checkout prints `1.2.0`. The second command prints the path of the binary that answered. That path differs per machine. Any version at or above `1.2.0` carries safe connect, the daemon verbs, `extract` and `import`. npm publishes only a `1.0.0` build without them, so an older string means install from the silships repo first:

```bash
bash scripts/install.sh --source repo --force
```

The script reports the version it finds or installs, then verifies the binary. `--source auto` is the default and upgrades when the npm build is stale. The binary needs Node 18 or newer. macOS is the supported baseline.

**Step 2: Connect in safe mode and check the daemon.**

```bash
figma-ds-cli connect --safe
figma-ds-cli daemon status
```

Safe connect patches nothing. It starts the daemon in plugin mode and prints `✓ Daemon running in Safe Mode`, then waits up to 90 seconds for the plugin.

Import `plugin/manifest.json` from the figma-ds-cli install once through `Plugins → Development → Import plugin from manifest`, then keep `Plugins → Development → FigCli` open each session. A plugin that answers in time prints `✓ Plugin connected!` and `✓ Ready! Safe Mode active.` If it stays closed, connect warns `Plugin not detected yet` and the daemon keeps listening.

`daemon status` then prints `✓ Daemon is running on port 3456`.

**Step 3: Export a read-only snapshot.**

```bash
figma-ds-cli extract design-system.md
```

Expect a line like `✓ Extracted 1 page(s), 214 nodes → design-system.md`. The Figma document is unchanged. The verb writes a local file, so the skill always passes an explicit path and never overwrites an existing one. A structure section above roughly 50k tokens splits into a `DESIGN-structure/` folder, so a large file produces more than one output.

**Step 4: Gate every write.**

The write verbs change the open file: create, render, the token and variable verbs, binds, layout changes and imports. The skill confirms the target and the intent before one runs. A destructive verb also needs an explicit node or collection plus a one-line rollback. Section 3 carries the class table.

---

## 3. HOW IT WORKS

Every call follows the same shape. The agent checks the binary and confirms Figma Desktop holds an open file. It connects, which starts the daemon that brokers each command over `127.0.0.1:3456`. It classifies the verb before running it. A read returns data or writes an export file. A write changes the document behind a gate. The verbs that support verification report the result.

```text
┌──────────────────────────────┐
│ Check the binary             │
│ and the open file            │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Connect and start the daemon │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ Classify the verb            │ ─▶ │ Author behind a gate         │
└───────────────┬──────────────┘    └───────────────┬──────────────┘
                │                                   │
                ▼                                   ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ Read or export               │    │ A changed Figma document     │
└───────────────┬──────────────┘    └──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Data or a file at your path  │
└──────────────────────────────┘
```

### Two Connect Modes

Safe mode is the default and the one to use. `figma-ds-cli connect --safe` runs the FigCli plugin bridge over a WebSocket. The plugin scans ports `3456` to `3460`. It patches nothing, so there is no patch for a Figma update to overwrite.

Yolo mode is bare `figma-ds-cli connect`. It rewrites Figma Desktop's `app.asar`, codesigns the app on macOS and restarts Figma with a debug port on `9222`. It may need Full Disk Access or admin rights. A Figma update overwrites the patch. `figma-ds-cli unpatch` restores the original file. The skill runs this mode only on explicit consent with that rollback stated first.

### The Command Classes

| Class | What it covers | Gate |
|---|---|---|
| Read-only | `status`, `get`, `find`, `inspect`, `node tree`, `extract`, the `export` verbs, the a11y audits and the dry-run variants | None. A local export still needs an explicit output path |
| Mutating | `create`, `render`, the token and variable verbs, binds, layout changes, variants and imports | Confirm the target and the intent |
| Destructive | `var delete-all`, `var delete-batch`, `delete`, `node delete`, `undo`, `unwrap`, `arrange`, `fj delete` and `grid clear` | Confirm, name the target and state a one-line rollback |
| Arbitrary | `eval`, `raw` and `run` | Treat as mutating and read the code or command first |

The full per-command list lives in [`references/tool-surface.md`](./references/tool-surface.md). The destructive set there is wider than the rows above. Every member carries its own rollback.

### The Optional MCP Path

The CLI works alone. Most work ends there. When an agent needs Figma content as model input, the community Framelink `figma-developer-mcp` server is already registered in this repository's Code Mode as the `figma` manual. It runs over stdio through `npx` and reads a Figma personal access token from `.env`. Code Mode prefixes the manual name, so the key is `figma_FIGMA_API_KEY`.

Discovery comes before the first call. An agent lists the tools and confirms the name it wants before calling it through `call_tool_chain` as `figma.figma_<tool>`. Two tools were confirmed live, `figma.figma_get_figma_data` and `figma.figma_download_figma_images`. The wiring and a call example live in [`references/mcp-wiring.md`](./references/mcp-wiring.md). The official Figma Dev Mode MCP is outside this skill.

### Where The Files Sit

The packet keeps its depth in four reference files. `references/figma-cli-reference.md` is the baseline every scored route loads. `references/tool-surface.md` holds the gating taxonomy, `references/mcp-wiring.md` the Code Mode path and `references/troubleshooting.md` the failure fixes.

The two assets carry paste-ready snippets for the MCP path only. `scripts/doctor.sh` reports the environment without changing it and `scripts/install.sh` installs and verifies the binary. `scripts/connect-safe.sh` walks the safe connect with a confirmation prompt.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when a request lands in an open Figma file: build a frame, render a component, add or bind tokens, read the structure, export an asset or repair a connect problem. Reach for it too when an agent needs design context out of Figma and the optional MCP is wired.

Leave it to a sibling when Figma is not the surface. Generic app code with no design input is `sk-code`. A measured Style Reference from a live site's CSS is the `sk-design-md-generator` mode in `sk-design`. This skill stays the Figma transport behind it. A last-mile browser preview of a built page is the `mcp-browser-use` hub. If Figma Desktop is missing or no file is open, there is nothing to drive. The skill says so rather than reporting a read it never made.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-tooling` | The hub that routes a Figma request to this packet |
| `sk-design-md-generator` | Produces the measured Style Reference that grounds a design decision. It reaches Figma through this packet |
| `sk-code` | Owns application-code standards when an export becomes a real app |
| `mcp-code-mode` | Runs the optional Figma MCP calls through `call_tool_chain` |
| `mcp-browser-use` | Gives a real-browser preview of a built page through any installed browser mode, never a way to operate Figma |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `figma-ds-cli: command not found` | The binary is not on PATH. The unrelated npm package may be the only one installed | Run `bash scripts/install.sh` from the packet. Never `npm i -g figma-cli` |
| `figma-cli` runs but the verbs are missing | The unic npm package shadows the `figma-cli` name | Use `figma-ds-cli`, check `figma-ds-cli --version` for `1.2.0` or newer and reinstall with `--source repo --force` |
| `○ Daemon is not running` | No connect has run this session. The idle timer may also have closed the daemon | Run `figma-ds-cli connect --safe`. The daemon is idle-timed and not reboot-persistent |
| `Unauthorized` from a daemon verb | The CLI token and the daemon token differ | Run `figma-ds-cli daemon diagnose`, then `daemon restart`. Never delete the token file or print its contents |
| Every command hangs | Figma Desktop is closed or open with no file | Open a file in Figma. The CLI has no API-key fallback |
| The yolo connect stopped working after a Figma update | The update replaced the patched `app.asar` | Run `figma-ds-cli connect --safe` or re-run the patch with consent. `figma-ds-cli unpatch` restores the original |
| A `figma.figma_<tool>` call fails | The manual, the token or the tool name is not what the call assumed | Confirm `figma_FIGMA_API_KEY` in `.env`, then list the tools before the call |

Full recovery steps live in [`references/troubleshooting.md`](./references/troubleshooting.md).

---

## 6. FAQ

### Is a Figma API key needed?

No, not for the CLI. `figma-ds-cli` drives the live desktop session, so the app has to be open with a file and no key is involved. A key is needed only for the optional MCP, where the `figma` manual reads `figma_FIGMA_API_KEY` from `.env`.

### Which package belongs on PATH?

`figma-ds-cli`. The npm package named `figma-cli` is a separate project from unic that installs a `figma` binary, so `npm i -g figma-cli` puts the wrong tool on your PATH. The `figma-cli` command is the silships tool only when you build it from the silships repo.

### Is the optional MCP required?

No. The CLI covers every task. The MCP only pulls design context into the agent. Reach for it when code generation needs the design as input. Confirm the tool names with a discovery call first.

### What is the difference between safe and yolo connect?

Safe connect runs the FigCli plugin bridge and patches nothing, so it survives a Figma update. Yolo connect rewrites `app.asar` to open a debug port and breaks when Figma updates. The skill runs yolo only with explicit consent and a stated `figma-ds-cli unpatch` rollback.

### How does this relate to `sk-design-md-generator`?

This skill is the transport. It reads Figma and writes Figma. The `sk-design-md-generator` mode produces the measured Style Reference that grounds a design decision. It reaches Figma through this packet.

---

## 7. VERIFICATION

| Check | Pass looks like |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-tooling/mcp-figma/README.md --type readme` reports zero issues |
| Setup diagnostics | `bash .skilled/skills/mcp-tooling/mcp-figma/scripts/doctor.sh` prints a `✓` line for the platform, Node, the resolved binary, Figma Desktop and the registered `figma` manual. The daemon lines report no token, no PID file and a closed port until a connect runs |
| Binary identity | `figma-ds-cli --version` prints `1.2.0` or newer, not the `1.0.0` npm build |
| Daemon health | `figma-ds-cli daemon status` prints `✓ Daemon is running on port 3456` after a connect |
| Playbook | `manual-testing-playbook/manual-testing-playbook.md` holds 20 scenarios across 7 categories. The default set performs no destructive Figma write |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime contract: when to use, routing, rules and success criteria |
| [`ROUTER.md#3-machine-router`](./ROUTER.md#3-machine-router) | Intent map, resource map and loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Install and verification steps for `figma-ds-cli`, plus the connect-mode setup |
| [`references/figma-cli-reference.md`](./references/figma-cli-reference.md) | Binary identity, prerequisites, connect modes, the daemon and command examples |
| [`references/tool-surface.md`](./references/tool-surface.md) | The full read-only, mutating, destructive and arbitrary taxonomy |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | The optional Figma MCP through Code Mode, with the token and a call example |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Failure modes and fixes for the binary collision, a closed app, daemon auth and port conflicts |
| [`assets/utcp-figma-manual.md`](./assets/utcp-figma-manual.md) | Paste-ready `figma` manual entry for `.utcp_config.json` |
| [`assets/env-template.md`](./assets/env-template.md) | The prefixed `figma_FIGMA_API_KEY` line for `.env` |
| [`examples/README.md`](./examples/README.md) | Safe worked walkthroughs: connect, daemon health, read-only export and the MCP pull |
| [`scripts/README.md`](./scripts/README.md) | What each setup, connect, daemon and diagnostic script changes |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory tagged read-only, mutating, destructive or arbitrary |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator scenarios across detection, daemon health, read-only access, the gate and routing |
| [`mcp-servers/figma-cli/README.md`](./mcp-servers/figma-cli/README.md) | Install and verification notes for the binary the skill drives |
| [`mcp-servers/figma-mcp/README.md`](./mcp-servers/figma-mcp/README.md) | The optional MCP registration and its two confirmed tools |
| [Skills Library](../../README.txt) | The skill catalog and routing front door |

<!-- readme-check
allow-ref plugin/manifest.json | the FigCli plugin manifest inside the installed figma-ds-cli package, imported into Figma Desktop rather than a path in this repository
allow-ref design-system.md | the output file the reader names on the extract command, created in the working folder rather than kept in this repository
allow-ref DESIGN-structure/ | the folder extract creates beside its DESIGN.md output when a structure section is large, not a path in this repository
-->
