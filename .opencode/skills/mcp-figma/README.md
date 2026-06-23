---
title: mcp-figma
description: Drive Figma Desktop from the terminal through the silships figma-ds-cli, so a coding agent can read, author, modify, and export designs, tokens, and components, with an optional Figma MCP pulled in through Code Mode.
trigger_phrases:
  - "figma cli"
  - "figma-ds-cli"
  - "figma desktop"
  - "render in figma"
  - "drive figma from the terminal"
  - "figma mcp"
version: 1.0.0.2
---

# mcp-figma

> Read, author, modify, and export Figma designs, tokens, and components from your agent or terminal through the `figma-ds-cli` binary, with an optional Figma MCP for pulling design context the other way, and never a Figma API key.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Driving Figma Desktop from the terminal: creating and rendering frames, working a design system, inspecting and exporting, importing tokens, and managing the connection and daemon |
| **Invoke with** | "figma cli", "figma-ds-cli", "render in figma", "figma tokens", "extract DESIGN.md", "connect to figma", "figma daemon", or auto-routing on Figma CLI keywords |
| **Works on** | The installed Figma **Desktop** app while it is open with a file, since the CLI drives the live Desktop session over a local daemon. Needs Node.js 18 or newer and the silships `figma-ds-cli` on PATH. macOS is the supported baseline |
| **Produces** | Rendered frames and components in the open file, design-system tokens and variables, read-only exports (DESIGN.md, PNG, SVG, JSX, CSS, Tailwind, Storybook, a11y audits), and optional design context pulled in through Code Mode |

---

## 2. OVERVIEW

### Why This Skill Exists

Figma's natural home is its own canvas, and reaching it from a coding agent is awkward without a contract. The silships CLI closes that gap by driving Figma Desktop directly, but an agent needs to know several things before it touches a real file. It needs to know that the canonical binary is `figma-ds-cli` and that the npm package literally named `figma-cli` is a different, unrelated tool. It needs to know there is no API key, so the live Desktop session is the source of truth and a closed app means nothing works. It needs to know that connecting has a safe default and a riskier patched mode, that a local daemon brokers every command, and that the command surface ranges from harmless reads to verbs that delete variables, nodes, or whole batches. Guessing at any of that wastes a round trip or, worse, fires a destructive verb against real work. This skill wraps the CLI, its daemon, and an optional Figma MCP behind one set of instructions so the agent always knows which binary is real, which calls are safe, and exactly where the gates are.

### What It Does

The skill drives Figma in two directions. The **CLI direction** is the primary surface and does the bulk of the work: it connects to Figma Desktop, brings up the daemon, inspects and exports content read-only, and authors or modifies frames, components, tokens, and variables behind gates. The **optional MCP direction** runs the other way, pulling design context out of Figma into the agent as model input through Code Mode, and it is opt-in rather than required. The skill works fully with the CLI alone. Throughout, the design judgment itself belongs to `sk-design-interface`: this skill owns the transport, that skill owns the taste, and any read or export that feeds a design decision is run through the design skill before deciding.

This is a CLI-primary surface with an optional MCP, not the reverse. The binary is the silships tool published to npm as `figma-ds-cli`, the daemon is a local HTTP server, and the optional MCP is a community Framelink manual already registered in this repo's Code Mode. The skill reaches for whichever face fits the step.

---

## 3. QUICK START

> Examples below are illustrative. Verify exact flags with `figma-ds-cli --help`. Do not run the patched yolo connect mode without explicit consent and a stated rollback.

**Step 1: Verify the binary and confirm Figma Desktop is open.**

```bash
# Canonical binary = figma-ds-cli. The npm package 'figma-cli' is an UNRELATED tool.
command -v figma-ds-cli && figma-ds-cli --version
# Expected: the silships version string. Figma Desktop must be OPEN with a file,
# because the CLI drives the live Desktop session and there is no API key.
# NEVER run `npm i -g figma-cli` (that installs the unrelated unic/figma-cli).
```

**Step 2: Connect with the safe default.**

```bash
figma-ds-cli connect --safe   # FigCli plugin bridge, no patch
# Import plugin/manifest.json once, then keep Plugins > Development > FigCli open each session.
# The riskier `figma-ds-cli connect` (no --safe) patches Figma's app.asar and is gated.
```

**Step 3: Confirm the daemon is healthy.**

```bash
figma-ds-cli daemon status     # local HTTP server on 127.0.0.1:3456
# "Unauthorized" -> run `daemon diagnose` then `daemon restart`.
# Never delete or paste the token at ~/.figma-ds-cli/.daemon-token.
```

**Step 4: Inspect or export, the safe default.**

```bash
figma-ds-cli extract --out DESIGN.md   # read-only, writes to an explicit path
# Read-only verbs (get, find, inspect, extract, export*, a11y*) never change the document.
# Local exports still write files, so always give an explicit path and never silently overwrite.
```

For authoring, every create, render, token, variable, or bind verb changes the open file and is gated behind explicit confirmation. Destructive verbs are stricter still, requiring an explicit target and a one-line rollback before they run.

---

## 4. HOW IT WORKS

### First Step Always

Every session starts by verifying the binary and confirming Figma Desktop is open with a file. The canonical command is `figma-ds-cli`. The npm package literally named `figma-cli` is an unrelated tool (unic/figma-cli, with a `figma` binary), so a bare `figma-cli` command should be trusted only when it resolves to the silships build, which exposes both names when installed from the repo `main` branch. There is no Figma API key in this model. The CLI drives the live Desktop session, so a closed app or a window with no file open means the daemon has nothing to broker and the work cannot proceed. Node 18 or newer is required, and macOS is the supported baseline. Linux and Windows are experimental and unverified.

### The Naming Trap

The single most important fact about installing this tool is that two different packages compete for the same short name. The silships tool publishes to npm as `figma-ds-cli`, which is the unambiguous binary the skill uses everywhere. The npm package literally named `figma-cli` is a completely separate project with its own `figma` binary, and installing it gives you the wrong tool. So the rule is firm: never `npm i -g figma-cli`. Install `figma-ds-cli` from npm or build the silships repo, where the `figma-cli` command exists only as a second name for the same tool.

### Connect Modes And The Daemon

Connecting has two modes and a sharp difference in risk. The **safe mode**, `figma-ds-cli connect --safe`, is the default. It runs the FigCli plugin bridge and patches nothing: you import `plugin/manifest.json` once, then keep `Plugins > Development > FigCli` open each session. The **yolo mode**, `figma-ds-cli connect` with no `--safe`, patches Figma Desktop's `app.asar`, codesigns on macOS, and restarts Figma with a CDP debug port on 9222. It may need Full Disk Access or admin rights, and it breaks when Figma updates. The skill never runs it without explicit consent and a stated rollback, which is `figma-ds-cli unpatch`. Behind both modes sits a local daemon, an HTTP server on `127.0.0.1:3456` authenticated by a token at `~/.figma-ds-cli/.daemon-token`, with verbs `status`, `diagnose`, `start`, `stop`, `restart`, and `reconnect`. The daemon is idle-timed and not reboot-persistent, the token is never exposed in output, and an "Unauthorized" error is diagnosed and restarted rather than fixed by deleting the token.

### The Command Safety Model

The CLI's verbs fall into classes, and the gate depends on the class. **Read-only** verbs are the safe default: `status`, `get`, `find`, `inspect`, the `var list` and `var find` queries, `extract`, every `export` form, the analyze and a11y audits, and dry-run variants. None of them change the Figma document, though the local exports do write files, so they still demand an explicit output path and never a silent overwrite. **Mutating** verbs change the open file and are gated behind confirmation: every `create`, `render`, and token or variable verb, the bind and set families, layout verbs, variant generation, imports, and the app-level `connect`, `unpatch`, and `config set`. **Destructive** verbs are gated more strictly, requiring explicit confirmation, an explicit target node or file, a command preview, and a one-line rollback. The destructive set is `var delete-all`, `var delete-batch`, `delete` and `remove`, `node delete`, `undo`, `unwrap`, `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear`, and `annotate clear`. Finally, `eval`, `raw`, and `run` execute arbitrary instructions, so the skill treats them as mutating and reviews the code or command before running it, even when the prompt sounds exploratory.

### The Optional Figma MCP

The skill is complete with the CLI alone, but when the agent needs to pull design context the other way, out of Figma and into the model, it can use the optional Figma MCP. The supported path for this release is the community Framelink manual, `figma-developer-mcp`, which is already registered in this repo's Code Mode as the manual named `figma`. It runs over stdio and needs a Figma personal token supplied through `.env` as `figma_FIGMA_API_KEY`, since Code Mode prefixes the environment variable with the manual name. Calls go through `call_tool_chain()` using the naming convention `figma.figma_<tool>`, and the agent always discovers the live tool set first with `search_tools()` or `tool_info()` before invoking, rather than assuming a tool exists or is read-only. The official Figma Dev Mode MCP is out of scope for this release and is not a documented or supported path here, though it remains a possible future option.

---

## 5. INTEGRATION AND NAVIGATION

### When To Use This Skill

Reach for this skill whenever a user wants to drive Figma Desktop from the terminal: create or render frames and components, work a design system of tokens and variables, inspect or export content, import a design system into Figma, or set up and troubleshoot the connection and daemon. Use it also when the agent needs to pull design context out of Figma through the optional Code Mode MCP. Skip it when the work is generic app coding with no Figma input, in which case use `sk-code`. Skip it when the work is the design judgment itself, the palette, the type, the anti-default critique, which belongs to `sk-design-interface` while this skill stays the transport. Skip it for a last-mile browser preview of a built page, which is `mcp-chrome-devtools`, and for the sibling design tool Open Design, which is `mcp-open-design`. And skip it entirely when Figma Desktop is not installed or not open, since the CLI cannot work without the live session.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design-interface` | Owns the design judgment and is applied whenever a Figma read or export feeds a design decision. This skill is the transport, that skill is the taste. |
| `sk-code` | Owns application-code standards for adapting extracted tokens, a DESIGN.md, or exported code into a real app, and verifying it. |
| `mcp-code-mode` | The transport for the optional Figma MCP. The Framelink `figma` manual is called through Code Mode's `call_tool_chain()`. |
| `mcp-open-design` | The sibling terminal-driven design tool, a CLI plus optional MCP hybrid with the same daemon and gating shape. |
| `mcp-chrome-devtools` | A real-browser surface for a last-mile visual preview only. It is never the way to operate Figma. |

---

## 6. TROUBLESHOOTING

> Symptoms and fixes below are drawn from the skill contract and research digest. Verify exact command output against your installed version.

| What you see | Why | Fix |
|---|---|---|
| `figma-ds-cli: command not found` | The binary is not installed, or only the unrelated `figma-cli` npm package is on PATH | Install `figma-ds-cli` from npm or the silships repo per INSTALL_GUIDE.md. Never `npm i -g figma-cli`, which is the unrelated unic/figma-cli |
| `bare figma-cli runs but behaves strangely` | The `figma-cli` name may resolve to unic/figma-cli rather than the silships build | Confirm the silships tool with `--version` or `--help`. The `figma-cli` command is only the silships tool when installed from the silships repo |
| Every command fails or hangs | Figma Desktop is closed, or open with no file, so there is no live session to drive | Open Figma Desktop with a file. The CLI drives the live Desktop session and has no API-key fallback |
| `Unauthorized` from a daemon command | The daemon token is stale or the daemon is unhealthy | Run `figma-ds-cli daemon diagnose` then `daemon restart`. Never auto-delete the token at `~/.figma-ds-cli/.daemon-token` |
| The yolo connect broke after a Figma update | The yolo mode patches `app.asar`, which a Figma update overwrites | Re-run `figma-ds-cli connect` only with consent, or prefer `connect --safe`. Roll a patch back with `figma-ds-cli unpatch` |
| A mutating or destructive verb ran without you confirming | A gate was skipped | Every mutating verb needs confirmation. Destructive verbs also need an explicit target and a one-line rollback before running |
| An export silently overwrote a file | An export was run without an explicit, unique output path | Always pass an explicit output path to `extract` and `export` verbs. The skill never silently overwrites |
| A Code Mode `figma.figma_<tool>` call fails | The Framelink manual or its token is not configured, or the tool name was assumed | Confirm `figma_FIGMA_API_KEY` is in `.env`, then discover the live tools with `search_tools()` or `tool_info()` before relying on any tool |

---

## 7. FAQ

**Q: Do I need a Figma API key?**

A: No, not for the CLI. The `figma-ds-cli` binary drives the live Figma Desktop session, so the app must be open with a file and there is no key involved. A key is only needed for the optional Figma MCP, where the Framelink manual reads `figma_FIGMA_API_KEY` from `.env` through Code Mode.

**Q: Which package do I install, `figma-cli` or `figma-ds-cli`?**

A: Install `figma-ds-cli`. The npm package literally named `figma-cli` is an unrelated tool (unic/figma-cli, with a `figma` binary), so never `npm i -g figma-cli`. The `figma-cli` command is the silships tool only when installed from the silships repo, which exposes both names for the same binary.

**Q: Is the optional MCP required?**

A: No. The skill works fully with the CLI alone. The optional Figma MCP runs the other direction, pulling design context out of Figma into the agent as model input, and you reach for it only when you need that. The supported path is the community Framelink `figma` manual through Code Mode. The official Figma Dev Mode MCP is out of scope for this release.

**Q: What is the difference between safe and yolo connect?**

A: Safe connect, `figma-ds-cli connect --safe`, runs the FigCli plugin bridge and patches nothing, so it is the default. Yolo connect, `figma-ds-cli connect` with no flag, patches Figma's `app.asar`, opens a CDP debug port, and breaks on Figma updates, so the skill runs it only with explicit consent and a stated `figma-ds-cli unpatch` rollback.

**Q: How does this relate to `sk-design-interface`?**

A: This skill is the transport that reads and writes Figma content. `sk-design-interface` is the judgment that decides what good design looks like. Whenever a Figma read or export feeds a design decision, the design skill is applied, and it reaches Figma only through this skill.

---

## 8. VERIFICATION

> The CLI reachability check requires `figma-ds-cli` installed and Figma Desktop open. The skill ships without vendoring the CLI source.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-figma/README.md --type readme` reports zero issues |
| SKILL.md frontmatter | `head -8 .opencode/skills/mcp-figma/SKILL.md` shows `name: mcp-figma`, a `description`, and `user-invocable: true` |
| Binary identity | `figma-ds-cli --version` returns the silships version (NOT the unrelated unic/figma-cli) |
| CLI reachability | `figma-ds-cli --help` returns usage text with Figma Desktop open (Node.js 18 or newer required) |
| Daemon health | `figma-ds-cli daemon status` reports healthy against `127.0.0.1:3456` with the token present |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Install and verify `figma-ds-cli`, the naming-trap warning, and the connect-mode setup (planned) |
| [`references/figma_cli_reference.md`](./references/figma_cli_reference.md) | Binary identity, the Node and macOS baseline, the Figma Desktop requirement, connect modes, the daemon model, and command examples |
| [`references/tool_surface.md`](./references/tool_surface.md) | The read-only, mutating, and destructive command taxonomy, the destructive set, the `eval/raw/run` rule, and the export no-overwrite rule |
| [`references/mcp_wiring.md`](./references/mcp_wiring.md) | The optional Figma MCP (Framelink `figma`) through Code Mode: the registered manual, the `.env` token, discovery, and a `call_tool_chain` example |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Failure modes and fixes for the binary collision, Desktop not running, daemon Unauthorized, port conflicts, and the Code Mode env-var prefix |
| [Skills Library](../README.md) | The skill catalog and routing front door |
