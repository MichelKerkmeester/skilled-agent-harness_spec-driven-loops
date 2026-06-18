---
title: "mcp-open-design: Feature Catalog"
description: "Unified reference combining the complete capability inventory and current-reality reference for the mcp-open-design skill, covering od CLI wiring, read-only content access, design-system grounding, gated headless runs, and the daemon transport model."
trigger_phrases:
  - "open design"
  - "od mcp"
  - "feature catalog"
last_updated: "2026-06-14"
---

# mcp-open-design: Feature Catalog

This document combines the current capability inventory for the `mcp-open-design` skill into a single reference. The root catalog acts as the system-level directory: it summarizes each capability area, describes what the skill does today, and points to the per-feature files that carry the deeper behavior and verification anchors. The skill drives the installed Open Design desktop app from the terminal through its `od` CLI and stdio MCP server, so a coding agent can read local design content, reuse it, and commission generation runs without using the in-app chat.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `mcp-open-design` surface. The five numbered sections below group the skill by capability area so readers can move from a top-level summary into per-feature reference files without losing behavior or verification context.

The capability surface splits into three directions plus the foundations that make them work. The **wire** direction registers Open Design's MCP server into a terminal agent. The **read** direction pulls local projects, files, and design-systems read-only. The **run** direction commissions headless generation behind explicit gates. Underneath both sits the design-system grounding loop shared with `sk-interface-design`, and the daemon transport model that every tool call depends on.

A note on what stays out of scope. This skill is the terminal transport, not the design judgment and not an automator of the in-app chat. The look-and-feel decisions belong to `sk-interface-design`. The in-app chat UI is the thing this skill replaces, so it is never driven or browser-automated.

| Capability area | Direction | Default safety |
|---|---|---|
| MCP server wiring | WIRE | Dry-run preview first, then a config write the user reviews |
| Local content reads | READ | Always safe, nothing is written |
| Design-system grounding | READ feeding judgment | Read-only input to `sk-interface-design` |
| Headless runs and mutating verbs | RUN | Gated: confirmation, explicit target, rollback note |
| Daemon transport and live verification | Foundation | Read-only checks before any promise about the tool set |

---

## 2. MCP SERVER WIRING

Register Open Design's stdio MCP server into opencode or Claude Code so its tools appear to the agent. The skill always previews the exact config with a dry-run, then writes only after the user has seen the `command` and `environment` that will land.

### od mcp install

`node "$OD_BIN" mcp install <agent>` wires the Open Design MCP server into a terminal agent. For opencode it deep-merges `~/.config/opencode/opencode.json` under `mcp.open-design`. For Claude Code it delegates to `claude mcp add --scope user open-design`. The dry-run form `--print --json` writes nothing and prints the exact entry first.

See [`01--wiring/od-mcp-install.md`](01--wiring/od-mcp-install.md) for the full behavior and the manual-config fallback.

---

## 3. LOCAL CONTENT READS

List projects, read the active context, read a design system's files, and fetch artifacts, all without writing anything. These tools are the safe default and run before any decision about a mutating verb.

### Read-only content access

The read-only tools are always safe to call: `list_projects`, `get_active_context`, `get_project`, `get_file`, `search_files`, `list_files`, `get_artifact`, `list_skills`, `list_plugins`, `list_agents`, and `get_run`. From the CLI directly, `node "$OD_BIN" tools design-systems read --path <manifest-path>` reads a registered design system's pull-layer files. A design system is a `DESIGN.md` (9-section prose), a paste-ready `tokens.css` (a `:root` block), and an optional `components.html`.

See [`02--reading/read-only-content.md`](02--reading/read-only-content.md) for the tool list and the live-content rule.

---

## 4. DESIGN-SYSTEM GROUNDING AND REUSE

When an Open Design read feeds a design decision, the work becomes design work and `sk-interface-design` owns the judgment. This skill supplies the transport: it reads one resolved system live, and the design skill grounds, builds a token system, and critiques before deciding.

### Grounding and reuse loop

`sk-interface-design` is a hard precondition: any read or run that feeds a design decision MUST load it first (only pure transport — wiring, a bare inventory that feeds no design decision — is exempt). The agent loads its design principles and runs ground then token-system then critique before deciding, then reuses the resolved system's `tokens.css` and `components.html` at build time in the target app. Reuse happens live: Open Design content is never copied or cached into a repo, because its per-source licenses would attach. At most one system is resolved from the subject and brief, never surfaced as a pick-a-vibe menu across the roughly 150 available systems.

See [`03--grounding/design-system-grounding.md`](03--grounding/design-system-grounding.md) for the integration contract and the guardrails that must survive.

---

## 5. HEADLESS RUNS AND GATED MUTATING VERBS

Commission Open Design to spawn its own inner agent and produce a rendered design through a multi-turn flow, the headless equivalent of the chat box. Every mutating and destructive verb is a stop-and-confirm point with an explicit target and a one-line rollback note.

### Headless runs and mutating verbs

Generation is multi-turn. `start_run(prompt, [skill], [agent], ...)` (MCP) or `od run start` (CLI) fires turn 1, which returns a discovery question-form and zero files. Answering it with `od ui respond` (or a follow-up message) fires the build run that writes the design and gives the project a `previewUrl`, after which the agent polls `get_run(runId)` and fetches output with `get_artifact`. CLI run verbs are `od run start|watch|cancel|list|info`. Other headless mutating verbs include `od automation` (schedule or fire routines) and `od media generate`. `od artifacts create` only adds a file to a project and never produces a rendered design, so it is not the generation path. Each mutating verb is gated behind explicit user confirmation, an explicit target project or name, and a rollback note. Destructive verbs `delete_file` and `delete_project` additionally require `confirm:true` and are never reached through the active-project fallback.

See [`04--runs/headless-runs.md`](04--runs/headless-runs.md) for the surface, gate, and omit policy.

---

## 6. DAEMON TRANSPORT AND LIVE VERIFICATION

Every tool call proxies to a local daemon that the desktop app hosts. The CLI is socket-discovered, the live tool set is larger than the help text claims, and both facts must be checked before promising behavior.

### Daemon model and tool-surface verification

There is no global `od` on PATH (bare `od` is the unrelated octal-dump tool). The CLI is `app/prebundled/daemon/daemon-cli.mjs` run under Node or the bundled Electron with `ELECTRON_RUN_AS_NODE=1`. The daemon is discovered over a Unix socket (`OD_SIDECAR_IPC_PATH`) on an ephemeral loopback port, not a fixed `127.0.0.1:7456` (that port is only the default for a standalone `od --no-open` daemon). The `od mcp --help` text lists a documentation subset of about 8 tools, but the running server registers roughly 18, including mutating and destructive ones. The live `tools/list` is always verified before relying on a tool's name or read-only status.

See [`05--transport/daemon-and-verification.md`](05--transport/daemon-and-verification.md) for the locate-and-confirm sequence and the verification requirement.

---

## 7. FEATURE COUNT SUMMARY

| Section | Feature | Per-feature file |
|---|---|---|
| MCP Server Wiring | od mcp install | `01--wiring/od-mcp-install.md` |
| Local Content Reads | Read-only content access | `02--reading/read-only-content.md` |
| Design-System Grounding | Grounding and reuse loop | `03--grounding/design-system-grounding.md` |
| Headless Runs | Headless runs and mutating verbs | `04--runs/headless-runs.md` |
| Daemon Transport | Daemon model and tool-surface verification | `05--transport/daemon-and-verification.md` |
| **Total** | **5 features** | **5 per-feature files** |
