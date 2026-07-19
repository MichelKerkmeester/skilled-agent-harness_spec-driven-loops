---
title: design-mcp-open-design
description: Drive the installed Open Design desktop app from the terminal through its od CLI and stdio MCP server, so a coding agent can read local design content, reuse it, and commission generation runs without the in-app chat.
trigger_phrases:
  - "open design"
  - "open-design"
  - "od mcp"
  - "od cli"
  - "drive open design from the terminal"
version: 1.4.0.11
---

# design-mcp-open-design

> Read, reuse, and commission Open Design's local projects and design-systems from your agent or terminal, through the `od` CLI and its stdio MCP server, without ever typing into the in-app chat.

> **⛔ MANDATORY: design work requires `sk-design`.** This skill is the transport, never the taste. Any UI/design work through Open Design — every generation run, and every read that feeds a design decision (grounding, reusing tokens/components) — must load `sk-design` and run its ground → token-system → critique first, then shape the brief and answers with it. You can never produce or shape an interface from Open Design without it. Pure transport (wiring the MCP server, bare project listing) is exempt.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Wiring Open Design's MCP server into a terminal agent, reading local projects and design-systems read-only, grounding a design in one resolved system, and commissioning headless generation runs |
| **Invoke with** | "open design", "open-design", "od mcp", "od cli", "drive open design from the terminal", or auto-routing on Open Design keywords |
| **Works on** | The installed Open Design desktop app (v0.9.0+) while it is running, since the app hosts the local daemon every tool call depends on. Needs Node.js; MCP install is CLI-driven for `claude`, `opencode`, `gemini`, and `kimi`, writes JSON config for `cursor`, `copilot`, `cline`, `opencode`, `openclaw`, `antigravity`, and `trae`, and prints manual setup snippets for `vibe`, `pi`, and `hermes` |
| **Produces** | A wired `open-design` MCP entry in your agent config, read-only design content (DESIGN.md, tokens.css, components.html, artifacts), and gated generation runs that land artifacts in your projects |

---

## 2. OVERVIEW

### Why This Skill Exists

Open Design is the official open-source, local-first Claude Design alternative, and its natural home is its own desktop chat UI. Reaching it from a coding agent is awkward without a contract. An agent needs to know that there is no global `od` command, that the real interface is a daemon CLI buried in the app bundle, that the running MCP server exposes far more tools than its help text admits, and that several of those tools mutate or delete. Guessing at any of that wastes a round-trip or, worse, fires a destructive verb against real work. This skill wraps the `od` CLI and its stdio MCP server behind one set of instructions so the agent always knows where the CLI is, which calls are safe, and exactly where the gates are.

### What It Does

The skill drives the installed Open Design app in three directions. The **wire direction** registers Open Design's stdio MCP server into a supported terminal agent so its tools appear to the agent, always after a dry-run that prints the exact config first. The **read direction** is the safe default: list projects, read the active context, read a design system's `DESIGN.md` and `tokens.css`, search files, and fetch artifacts, all read-only. The **run direction** commissions Open Design to spawn its own inner agent through a multi-turn flow, the headless equivalent of the chat box, behind explicit confirmation: turn 1 returns a discovery question-form, and the design is built only after that form is answered. Open Design's terminology is first-class throughout: a workspace is a **project**, a brand or style is a **design system**, a build is a **run**, and an output file is an **artifact**.

This is a real MCP surface, not a CLI-only one. The `od` CLI is `app/prebundled/daemon/daemon-cli.mjs` run under Node or the bundled Electron, and `od mcp install` wires its stdio server into your agent. The CLI and the MCP tools are two faces of the same daemon, so the skill uses whichever fits the step.

---

## 3. QUICK START

**Step 1: Locate the CLI and confirm the daemon.**

```bash
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is od
node "$OD_BIN" --help
# Expected: od usage text. The desktop app must be open so the daemon socket exists.
# There is no global `od` on PATH (bare `od` is the unrelated octal-dump tool).
```

**Step 2: MCP wiring -- already done in this repo.**

This repo wires Open Design through Code Mode (`.utcp_config.json`'s `open_design` manual), not native agent config. Skip the commands below unless you're using this skill in a different repo/environment.

```bash
node "$OD_BIN" mcp install opencode --print --json   # PREVIEW only, writes nothing
# Read the command array and environment it would write, then apply:
node "$OD_BIN" mcp install opencode                   # deep-merges opencode.json (mcp.open-design) -- NOT this repo's integration point, see references/mcp-wiring.md Section 5b
# For CLI and JSON-plan agents, use the target slug. `vibe`, `pi`, and `hermes` only print manual setup snippets.
```

**Step 3: Verify the live tool set.**

```bash
# After wiring, confirm the agent's live tools/list shows the Open Design tools.
# The help text lists about 8 tools. The running server registers roughly 18,
# including mutating and destructive ones. Always verify live before relying on a tool.
```

**Step 4: Read local content, the safe default.**

```bash
node "$OD_BIN" tools design-systems read --path <manifest-path>
# Expected: a 9-section DESIGN.md and a :root tokens.css. Read live, never cached into a repo.
```

For generation, the flow is multi-turn: `start_run` (or `od run start`) fires turn 1 and returns a discovery question-form with zero files, then `od ui respond` answers the form to fire the build, and `get_run` then `get_artifact` poll and fetch the result. Every mutating verb is a stop-and-confirm point with an explicit target and a rollback note.

---

## 4. HOW IT WORKS

### First Step Always

Every session starts by locating the CLI as `node "$OD_BIN" --help` (or the `ELECTRON_RUN_AS_NODE=1` form) and confirming the desktop app is open. The app hosts the daemon, and the daemon answers every tool call, so a closed app means the socket is gone and nothing works. The daemon is discovered over a Unix socket on an ephemeral loopback port, not a fixed `127.0.0.1:7456`, so the CLI is never pointed at a hardcoded address.

### The Wire Direction

`od mcp install <agent>` wires Open Design's stdio MCP server for supported agents, but it does not write config for every slug. Supported agent slugs include `claude`, `opencode`, `cursor`, `copilot`, `openclaw`, `antigravity`, `gemini`, `pi`, `vibe`, `hermes`, `cline`, `kimi`, `trae`, and `opencode`; `vibe`, `pi`, and `hermes` are manual setup targets where the installer returns a snippet instead of writing agent config. For opencode it deep-merges `~/.config/opencode/opencode.json` under `mcp.open-design`; for Claude Code it delegates to `claude mcp add --scope user open-design`. **This repo does not use the opencode native-registration path** -- it wires Open Design through Code Mode instead (`.utcp_config.json`'s `open_design` manual, already configured; see `references/mcp-wiring.md` Section 5b). The dry-run form `--print --json` writes nothing and prints the exact entry, so the operator reviews the command array and environment before anything lands. The written entry re-discovers the live daemon URL from the socket on each spawn, so it survives daemon restarts. The skill never pipes a remote install script to a shell.

### The Read Direction

After wiring, read-only means the tool does not write; it does not automatically mean unguarded (see [`references/tool-surface.md`](./references/tool-surface.md) for the full two-axis rule). Pure transport reads (`list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents`) are always safe to call, since they return inventory only. Design-feeding reads (`get_active_context`, `get_project`, `get_file`, `search_files`, `get_artifact`, `get_run`) are guarded: their output needs `sk-design`'s ground → token-system → critique before it shapes a design decision, except `get_file`/`search_files` with a non-design-use receipt. From the CLI, `od tools design-systems read` reads a registered design system's files. A design system is a `DESIGN.md`, a paste-ready `tokens.css`, and an optional `components.html`. Open Design content is read live and never copied into a repo, because reusing a system happens at build time in the target app rather than by vendoring its files, whose per-source licenses would attach.

### The Run Direction

Generation is multi-turn. `start_run(prompt, ...)` (MCP) or `od run start` (CLI) fires turn 1, which returns a GenUI discovery question-form with zero files and ends `awaiting_input`. Answering the form with `od ui respond` (or a follow-up message such as "use the recommended defaults") fires the build run that writes the design files, after which the project gains an `entryFile` and a `previewUrl` and renders. The agent then polls `get_run` and fetches with `get_artifact`. CLI run verbs are `od run start|watch|cancel|list|info`. `od artifacts create` only adds a file to a project and never produces a rendered design, so it is not the generation path. Other headless mutating verbs include `od automation` and `od media generate`. Every mutating verb is surfaced but gated behind explicit confirmation, an explicit target, and a one-line rollback note. The destructive verbs `delete_file` and `delete_project` are stricter still, requiring `confirm:true` plus approval and never the active-project fallback. Some verbs can return an auth error, since local reads work without a cloud account but generation and media may need a `vela login` or configured providers.

### Styles-Library Utilization

The transport accepts the canonical zero-hydration plan and converts mode-owned corpus influence into a recursively closed, metadata-only grounding receipt. Raw style and tool payloads are reduced to identifiers, hashes and digests inside the transport. The mode proposal is cloned and frozen before the first asynchronous call, then returned artifacts are reconciled against that snapshot.

The authority order is user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output. Open Design can surface alignment, divergence or unavailability, but it cannot accept a design decision or mutation on the selected mode's behalf.

### Design Grounding And Reuse

When a read or run feeds a design decision, the work becomes design work, and the judgment belongs to `sk-design` as a **hard precondition, not an option**. The agent MUST load it and run ground then token-system then critique BEFORE deciding, shape the brief and discovery-form answers with that judgment, and only then reuse one resolved system's tokens and components at build time. It can never produce or shape an interface from Open Design without `sk-design`; this skill owns the transport and that skill owns the non-negotiable taste. Only pure transport (wiring the MCP server, bare inventory that feeds no design decision) is exempt. The two skills share the reuse-before-generate protocol in the real-UI loop (`sk-design`'s `real-ui-loop.md`; this skill's Open Design transport for it is in `references/design-parity-transport.md`). Guardrails survive the integration: no style chooser across the roughly 150 systems, at most one system resolved from the brief, and Open Design as input to judgment rather than authority.

---

## 5. INTEGRATION AND NAVIGATION

### When To Use This Skill

Reach for this skill whenever a user mentions Open Design, wants to wire it into an agent, or wants to read, reuse, or generate from its local projects and design-systems. Use the **wire direction** to register the MCP server. Use the **read direction** to pull projects, files, and design-systems read-only, which is also how you ground a design. Use the **run direction** to commission a headless generation run behind its gates. Skip the skill when the user wants the in-app chat UI itself, when the work is the design judgment (that is `sk-design`), or when Open Design is not installed or not running.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | **MANDATORY partner for all design work.** Owns the design judgment; any generation run or design-feeding read MUST load it and run ground → token-system → critique first, and you can never produce or shape UI from Open Design without it. This skill is the transport, that skill is the non-negotiable taste. Pure transport (wiring, bare inventory) is exempt. The two share the real-UI loop (`real-ui-loop.md`). |
| `sk-code` | Owns application-code standards for adapting any reused tokens or components into a real app. |
| `mcp-figma` | The sibling terminal-driven design tool for Figma Desktop, a CLI plus optional MCP hybrid with the same daemon and gating shape. |
| `mcp-chrome-devtools` | A real-browser surface for a last-mile visual preview only. It is never the way to operate Open Design. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `od: command not found` | There is no global `od` on PATH, and bare `od` is the unrelated octal-dump tool | Invoke the CLI by bundle path: `node "$OD_BIN" ...` where `OD_BIN` is `daemon-cli.mjs` inside the app |
| Every tool call fails or hangs | The desktop app is closed, so the daemon socket is gone | Open the Open Design app, or start a standalone headless daemon with `od --no-open` |
| A tool you expected is missing from `tools/list` | The `od mcp --help` text lists only about 8 tools, but the running server registers roughly 18 | Verify the live `tools/list` against the running server, not the help text, before relying on a tool |
| `curl 127.0.0.1:7456` refused while the app is open | The desktop daemon is socket-discovered on an ephemeral port, not the fixed `:7456` | Use the socket at `OD_SIDECAR_IPC_PATH`. The `:7456` port is only the default for a standalone `od --no-open` daemon |
| A verb returns an auth error | Local reads work without a cloud account, but generation, media, or plugin-publish may need credentials | Surface the requirement (for example a `vela login` or configured providers). Never paste credentials into prompts |
| A mutating verb ran without you confirming | A gate was skipped | Every mutating verb requires confirmation plus an explicit target plus a rollback note. Destructive verbs also require `confirm:true` |
| `start_run` / `od run start` returned but no design rendered | Generation is multi-turn. Turn 1 only returns a discovery question-form with zero files (`awaiting_input`) | Answer the form with `od ui respond --run <runId> <surfaceId> --value ...` (or a follow-up message). That fires the build that writes the design and gives the project a `previewUrl`. `od artifacts create` only adds a file, it never renders a design |
| An HTTP `/api/*` call worked earlier but now connection-refused | The daemon's HTTP port is ephemeral and rotates on every daemon restart | Rediscover the live port from `GET /api/mcp/install-info` (`daemonUrl`) or the socket. Never hardcode the port. The socket-based `od` CLI is stable across restarts |

---

## 7. FAQ

**Q: Do I need to install anything first?**

A: You need the Open Design desktop app (v0.9.0+) installed and running, plus Node.js. There is no separate install for the `od` CLI, since it ships inside the app bundle and runs under Node or the bundled Electron. For wiring, the target agent CLI must be on PATH only for CLI-driven plans (`claude`, `opencode`, `gemini`, and `kimi`); JSON config targets (`cursor`, `copilot`, `cline`, `opencode`, `openclaw`, `antigravity`, and `trae`) are written directly, and `vibe`, `pi`, and `hermes` are manual setup snippet targets.

**Q: Why is there no `od` command on my PATH?**

A: Open Design does not install a global shim. The real CLI is `app/prebundled/daemon/daemon-cli.mjs` inside the app bundle, and bare `od` is the unrelated `/usr/bin/od` octal-dump tool. Always invoke the CLI by its bundle path.

**Q: The help text lists 8 tools. Why does the skill say there are more?**

A: The `od mcp --help` text shows a documentation subset. The running stdio server registers roughly 18 tools, including `write_file`, `create_project`, `start_run`, and the destructive `delete_file` and `delete_project`. Verify the live `tools/list` before promising a tool exists or is read-only.

**Q: Can it run without the desktop app open?**

A: The desktop daemon is a child of the app and dies with it, so normally the app must be open. For a headless path, a standalone `od --no-open` daemon binds `127.0.0.1:7456` and answers calls without the app.

**Q: I commissioned a run but no design appeared. What went wrong?**

A: Generation is multi-turn, not one-shot. A single `start_run` or `od run start` fires turn 1 only, which returns a GenUI discovery question-form and zero files, ending `awaiting_input`. You answer that form with `od ui respond` (or a follow-up message like "use the recommended defaults"), and that is what fires the build run that writes the design files and gives the project a `previewUrl`. Do not use `od artifacts create` to "make a design": it only adds a single file and never renders one.

**Q: How does this relate to `sk-design`?**

A: This skill is the transport that reads and writes Open Design content. `sk-design` is the judgment that decides what good design looks like, and it is **mandatory for any design work** — every generation run and every read that feeds a design decision must load it and run ground → token-system → critique first, and you can never produce or shape an interface from Open Design without it. It reads Open Design only through this skill. Pure transport (wiring, bare inventory) is exempt. The two never surface the roughly 150 systems as a pick-a-vibe menu.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-mcp-open-design/README.md --type readme` reports zero issues |
| SKILL.md frontmatter | `head -12 .opencode/skills/sk-design/design-mcp-open-design/SKILL.md` shows `name: design-mcp-open-design` and a `description` |
| Feature catalog structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-mcp-open-design/feature-catalog/feature-catalog.md` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-mcp-open-design/manual-testing-playbook/manual-testing-playbook.md` reports zero issues |
| CLI reachability | `node "$OD_BIN" --help` returns usage text with the Open Design desktop app open (Node.js required) |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory: wiring, reads, grounding, gated runs, and the daemon transport |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator validation matrix with the wire, read, gated-run, and failure-path scenarios |
| [`references/od-cli-reference.md`](./references/od-cli-reference.md) | Locating the CLI, the daemon socket model, and the full verb surface with read-only vs mutating classification |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | Wiring the MCP server into supported terminal agents, the written config shape, and the manual fallback |
| [`references/tool-surface.md`](./references/tool-surface.md) | The roughly 18 MCP tools, the surface, gate, and omit policy, and the live-verification requirement |
| [`references/design-parity-transport.md`](./references/design-parity-transport.md) | The Open Design transport mechanics for the real-UI loop (the loop itself lives in `sk-design`) |
| [Skills Library](../../README.md) | The skill catalog and routing front door |
