---
title: "mcp-figma: Feature Catalog"
description: "Unified capability inventory for the mcp-figma skill, covering figma-ds-cli connect/daemon, inspect, design-system extract/import, render/create, tokens/variables, export, a11y/analysis, and the optional Figma MCP via Code Mode, with each capability tagged read-only, mutating, or destructive."
trigger_phrases:
  - "figma cli"
  - "figma-ds-cli"
  - "feature catalog"
last_updated: "2026-06-14"
version: 1.0.0.3
---

# mcp-figma: Feature Catalog

This document is the canonical capability inventory for the `mcp-figma` skill. The root catalog acts as the system-level directory: it summarizes each capability area, names the canonical `figma-ds-cli` command for each feature, and tags every command read-only, mutating, or destructive so the gating model is visible at a glance. The skill drives the installed Figma Desktop app from the terminal through the silships `figma-ds-cli` so a coding agent can connect, inspect, author, modify, and export designs, tokens, and components, and **optionally** pull design context out of Figma through a community Figma MCP via Code Mode. The CLI is the primary surface, and the MCP is opt-in.

> **Naming trap (read first).** The canonical binary is **`figma-ds-cli`** (silships, npm, MIT). The npm package literally named **`figma-cli` is an UNRELATED tool** (unic/figma-cli, bin `figma`), so **NEVER `npm i -g figma-cli`**. The `figma-cli` command exists only when installed from the silships repo. This catalog uses `figma-ds-cli` as the canonical command throughout.

> **Verification note.** Commands below are illustrative and sourced from the figma-cli capability research digest, so verify any exact verb, flag, or output with `figma-ds-cli <command> --help` before relying on it. The research flags known doc drift (REFERENCE shows `create rect/circle`, source proves `create frame/icon/image` plus top-level aliases; `voice`/`chat`/`prop combine` appear in docs but were not found in source). Do NOT run `figma-ds-cli` against a live document without verifying the command and its gating class first.

---

## 1. OVERVIEW

Use this catalog as the inventory for the live `mcp-figma` surface. The numbered sections below group the skill by capability area so readers can move from a top-level summary into the per-command detail without losing the gating context.

The capability surface has one hard prerequisite and three working directions, plus an optional context pull. Everything depends on a **connection**: figma-cli drives **Figma Desktop (open with a file)**, with no Figma API key, over a local daemon. From there the **read** direction inspects and exports without changing the document, the **write** direction authors, renders, sets tokens, and imports design systems behind gates, and a small **destructive** subset deletes content behind hard confirms. Underneath the optional last direction sits the community Figma MCP, reached through this repo's Code Mode rather than by anything figma-cli ships.

A note on what stays out of scope. This skill is the terminal transport, not the design judgment: the look-and-feel decisions belong to `sk-design`. figma-cli does **not** ship or spawn its own MCP (source-verified zero hits), and its daemon is a private HTTP/WebSocket bridge, not an MCP server. The OFFICIAL Figma Dev Mode MCP is out of scope for this release, and only the community Framelink `figma` manual is documented as a supported optional path.

### Command class tags

Every command below carries one tag. Local exports are read-only but still write files, so they require an explicit output path and never silently overwrite.

| Class | Meaning | Default handling |
|---|---|---|
| READ-ONLY | Reads the doc or writes only export files; no document change | Safe default; exports need an explicit output path, no overwrite |
| MUTATING | Changes the Figma document or local app/config state | Gate: confirmation + explicit target |
| DESTRUCTIVE | Deletes document content or resources | Confirm + explicit target + one-line rollback |
| ARBITRARY | `eval` / `raw` / `run` can do anything | Treat as mutating; review the code/command first |

### Capability areas

| Capability area | Direction | Default safety |
|---|---|---|
| Connect and daemon | Foundation | Safe `connect --safe` default; yolo patch gated; daemon checks read-only |
| Inspect | READ | Always safe, nothing is written to the document |
| Design-system extract and import | READ (extract) feeding judgment / MUTATING (import) | Extract read-only with explicit output; import gated |
| Render and create | WRITE | Gated: confirmation + explicit target |
| Tokens and variables | WRITE (+ destructive deletes) | Gated; `var delete-all` (variables) and `delete\|remove` (nodes) are destructive |
| Export | READ | Safe; explicit output path, no silent overwrite |
| A11y and analysis | READ | Always safe |
| Optional MCP context | READ (opt-in) | Code Mode; verify the manual and tools live first |

---

## 2. CONNECT AND DAEMON

Bring up and maintain the link between the terminal and Figma Desktop. Safe plugin mode is the default, and the yolo patch that edits Figma's `app.asar` is gated behind explicit consent and a stated rollback. The daemon is a local HTTP server on `127.0.0.1:3456` (not a Unix socket), authed with `X-Daemon-Token` from `~/.figma-ds-cli/.daemon-token`, idle ~60 min, not reboot-persistent. Daemon status/diagnose verbs are read-only, while start/stop/restart and connect/unpatch change app or daemon state.

| Feature | One-line description | Class | figma-ds-cli command |
|---|---|---|---|
| Safe connect (default) | FigCli plugin bridge, no patch; import `plugin/manifest.json` once, keep the plugin open | MUTATING (app-level) | `figma-ds-cli connect --safe` |
| Yolo connect (gated) | Patches Figma `app.asar` + codesigns + CDP port 9222; needs consent + rollback | MUTATING (app-level) | `figma-ds-cli connect` |
| Unpatch (rollback) | Restores the original `app.asar` string after a yolo patch | MUTATING (app-level) | `figma-ds-cli unpatch` |
| Connection status | Reports whether the CLI is connected to Desktop | READ-ONLY | `figma-ds-cli status` |
| Diagnose | Diagnoses the connection/setup without changing it | READ-ONLY | `figma-ds-cli diagnose` |
| Daemon status | Reports daemon health (HTTP `127.0.0.1:3456`, token present) | READ-ONLY | `figma-ds-cli daemon status [--debug]` |
| Daemon diagnose | Diagnoses daemon/token issues (e.g. "Unauthorized") | READ-ONLY | `figma-ds-cli daemon diagnose` |
| Daemon start / stop / restart | Brings the local daemon up, down, or recycles it | MUTATING (app-level) | `figma-ds-cli daemon start [--force] \| stop \| restart` |
| Daemon reconnect | Re-establishes the Desktop link without a full restart | MUTATING (app-level) | `figma-ds-cli daemon reconnect` |
| init-agent (off by default) | Writes `AGENTS.md` + `.cursor/rules/figma-cli.mdc` into the repo; never run by default | MUTATING (app-level) | `figma-ds-cli init-agent [--tool claude\|cursor\|both] [--force]` |

See [`connect-and-daemon/connect-and-daemon.md`](connect-and-daemon/connect-and-daemon.md) for the safe-vs-yolo gate, the daemon model, and the token-handling rules.

---

## 3. INSPECT

Read the live document without changing it: list and find nodes, get properties, walk a node tree and its bindings, list collections and slots. These are the safe default and the input to design work and to any later gated verb.

| Feature | One-line description | Class | figma-ds-cli command |
|---|---|---|---|
| Find nodes | Locates nodes matching a query | READ-ONLY | `figma-ds-cli find <query>` |
| Get node | Returns a node's properties | READ-ONLY | `figma-ds-cli get <node>` |
| Inspect node | Inspects a node's full property set | READ-ONLY | `figma-ds-cli inspect <node>` |
| Node tree | Prints the node hierarchy | READ-ONLY | `figma-ds-cli node tree [<node>]` |
| Node bindings | Lists variable bindings on a node | READ-ONLY | `figma-ds-cli node bindings <node>` |
| Canvas info / next | Reports canvas state / next placement slot | READ-ONLY | `figma-ds-cli canvas info \| next` |
| Spec | Emits a node/document spec | READ-ONLY | `figma-ds-cli spec [<node>]` |
| Files | Lists known files in the session | READ-ONLY | `figma-ds-cli files` |
| Slot list | Lists component slots | READ-ONLY | `figma-ds-cli slot list <component>` |
| Bind list | Lists existing variable bindings | READ-ONLY | `figma-ds-cli bind list` |

See [`inspect/inspect.md`](inspect/inspect.md) for the read-only inspect surface and its session prerequisite.

---

## 4. DESIGN-SYSTEM EXTRACT AND IMPORT

Move a design system out of Figma (read-only) or into Figma (gated). `extract` produces a `DESIGN.md` with 11 sections including a machine-readable `design-tokens` JSON block, and auto-splits very large structure into a `DESIGN-structure/` folder (handle multi-file output). `import` ingests Tailwind config, CSS variables, W3C/Style-Dictionary `tokens.json`, or a Storybook source. Extract is read-only but writes a file, so it needs an explicit output path and must not silently overwrite. Import changes the document and is gated.

| Feature | One-line description | Class | figma-ds-cli command |
|---|---|---|---|
| Extract DESIGN.md | Reads the design system to a `DESIGN.md` (11 sections + token JSON; auto-splits) | READ-ONLY (explicit output) | `figma-ds-cli extract [output] [--pages --sections --selection --split/--no-split]` |
| Import design system | Imports Tailwind/CSS/tokens.json/Storybook into Figma collections | MUTATING | `figma-ds-cli import <source> [-c <collection> --save --type <tailwind\|css\|tokens\|storybook\|designmd> --print-context]` |

See [`design-system-extract-and-import/design-system-extract-and-import.md`](design-system-extract-and-import/design-system-extract-and-import.md) for the extract output rule and the import gate.

---

## 5. RENDER AND CREATE

Author content in the document: render JSX-described nodes, create frames/icons/images and primitives, lay out, duplicate, convert to components, and generate variants and combos. Every verb here changes the document and is gated; `arrange` is gated more strictly and is DESTRUCTIVE (the binary's own `--help` labels it destructive). `--dry-run` variants of unstack/use/combos are read-only previews; `arrange` has no `--dry-run`. Prefer `render`/`render-batch` over `eval` for visual nodes (eval bypasses positioning).

| Feature | One-line description | Class | figma-ds-cli command |
|---|---|---|---|
| Render JSX | Renders a JSX-described node into the document | MUTATING | `figma-ds-cli render <jsx>` |
| Render batch | Renders multiple nodes in one pass | MUTATING | `figma-ds-cli render-batch <source>` |
| Create frame / icon / image | Creates a frame, icon, or image node (source-verified primitives) | MUTATING | `figma-ds-cli create frame\|icon\|image ...` |
| Create primitives (aliases) | Top-level shape/text/group aliases | MUTATING | `figma-ds-cli rect\|ellipse\|text\|line\|component\|group\|autolayout ...` |
| Set property | Sets a property (fill, etc.; supports `var:name`) | MUTATING | `figma-ds-cli set <prop> <value>` |
| Layout verbs | Sizing, padding, gap, align on a node | MUTATING | `figma-ds-cli sizing\|padding\|gap\|align <node> ...` |
| Unstack | Spreads overlapping nodes (preview with `--dry-run`) | MUTATING | `figma-ds-cli unstack [-g] [--dry-run]` |
| Arrange | Rearranges ALL top-level frames on canvas, sorted alphabetically; no `--dry-run` | **DESTRUCTIVE** | `figma-ds-cli arrange [-g] [-c]` |
| Duplicate | Duplicates a node | MUTATING | `figma-ds-cli duplicate <node>` |
| To component | Converts a node into a component | MUTATING | `figma-ds-cli node to-component <node>` |
| Variants / sizes / combos | Generates component variants, sizes, or combos | MUTATING | `figma-ds-cli variants\|sizes\|combos ... [--dry-run]` |
| shadcn add | Adds shadcn primitives into the document | MUTATING | `figma-ds-cli shadcn add <component>` |
| Screenshot/recreate from URL | Captures or recreates a design from a URL | MUTATING | `figma-ds-cli screenshot-url \| recreate-url <url>` |
| Arbitrary execution | Runs arbitrary code/commands, can do anything, review first | ARBITRARY | `figma-ds-cli eval\|raw\|run ...` |

See [`render-and-create/render-and-create.md`](render-and-create/render-and-create.md) for the authoring surface, the dry-run previews, and the arbitrary-execution caveat.

---

## 6. TOKENS AND VARIABLES

Manage Figma variables and collections, bind `var:name` references, and visualize tokens. Reads and binds are read-only or gated, create/bind/set/rename/visualize change the document, and bulk deletes are destructive and require an explicit target and rollback. Token binding uses `var:name` (e.g. `bg="var:card"`), `var:collection:name` to pin a collection, or `render --collection <name>`.

| Feature | One-line description | Class | figma-ds-cli command |
|---|---|---|---|
| List variables / collections | Lists variables, collections, or finds a variable | READ-ONLY | `figma-ds-cli var list \| var find <q> \| collections list` |
| Token overlap | Reports overlapping/conflicting tokens | READ-ONLY | `figma-ds-cli tokens overlap` |
| Create variable | Creates a variable | MUTATING | `figma-ds-cli var create <name> -c <collection> -t <type> [-v <value>]` |
| Bind variable | Binds a variable to a node property | MUTATING | `figma-ds-cli var bind <node> <prop> <var> \| bind <node> <var>` |
| Set / rename variable | Sets a variable value or renames it | MUTATING | `figma-ds-cli var set\|rename <name> ...` |
| Visualize tokens | Renders a token visualization | MUTATING | `figma-ds-cli var visualize` |
| Use / theme | Applies a collection or theme | MUTATING | `figma-ds-cli use\|theme <name> [--dry-run]` |
| Delete node | Deletes a node by id or current selection (node-scoped, not variable-scoped) | DESTRUCTIVE | `figma-ds-cli delete\|remove [nodeId]` |
| Delete all variables | Deletes every local variable, or one collection's with `-c`; the only variable-delete command, all-or-nothing | DESTRUCTIVE | `figma-ds-cli var delete-all [-c <collection>]` |

See [`tokens-and-variables/tokens-and-variables.md`](tokens-and-variables/tokens-and-variables.md) for the bind syntax and the destructive delete gate.

---

## 7. EXPORT

Write assets and code out of the document: PNG/SVG, CSS, Tailwind, JSX, and Storybook. Export is read-only with respect to the Figma document but writes local files, so it always requires an explicit output path and must never silently overwrite an existing file.

| Feature | One-line description | Class | figma-ds-cli command |
|---|---|---|---|
| Export screenshot | Exports the selected node or current page as a screenshot/PNG/SVG | READ-ONLY (explicit output) | `figma-ds-cli export screenshot [-o file] [-s scale] [-f png\|jpg\|svg\|pdf]` |
| Export node | Exports one specific node by id | READ-ONLY (explicit output) | `figma-ds-cli export node <nodeId> [-o file] [-s scale] [-f png\|svg\|pdf\|jpg]` |
| Export CSS / Tailwind | Exports the file's variables as CSS or a Tailwind config; no node or output argument | READ-ONLY | `figma-ds-cli export css \| export tailwind` |
| Export JSX | Exports a node (or the selection) as JSX; stdout unless `-o` names a file | READ-ONLY (explicit output) | `figma-ds-cli export-jsx [nodeId] [-o file] [--pretty]` |
| Export Storybook | Exports components as Storybook stories; stdout unless `-o` names a file | READ-ONLY (explicit output) | `figma-ds-cli export-storybook [nodeId] [-o file]` |

See [`export/export.md`](export/export.md) for the export surface and the explicit-output, no-overwrite rule.

---

## 8. A11Y AND ANALYSIS

Audit and analyze the document without changing it: accessibility checks, general analysis, gradient extraction (read-only when not applied), and URL analysis. All read-only. `gradient extract --apply-to` writes the gradient back and is therefore mutating, so it belongs to the render/create surface, not here.

| Feature | One-line description | Class | figma-ds-cli command |
|---|---|---|---|
| A11y audit | Runs accessibility checks on nodes/document | READ-ONLY | `figma-ds-cli a11y ...` |
| Analyze | Runs general analysis on the document | READ-ONLY | `figma-ds-cli analyze ...` |
| Analyze URL | Analyzes a design at a URL | READ-ONLY | `figma-ds-cli analyze-url <url>` |
| Verify | Verifies the result of a prior operation | READ-ONLY | `figma-ds-cli verify ...` |
| Gradient extract (read) | Extracts a gradient without applying it | READ-ONLY | `figma-ds-cli gradient extract <node>` |

See [`a11y-and-analysis/a11y-and-analysis.md`](a11y-and-analysis/a11y-and-analysis.md) for the read-only audit surface and the applied-gradient boundary.

---

## 9. OPTIONAL MCP CONTEXT

The skill works fully with the CLI alone. When the agent must pull design context FROM Figma as model input, use the **community Framelink `figma-developer-mcp` manual already registered as `figma` in this repo's Code Mode** (`.utcp_config.json`, stdio). It needs a Figma personal token in `.env` as `figma_FIGMA_API_KEY` (Code Mode prefixes the manual name). Calls go through `call_tool_chain()` with the naming `figma.figma_<tool>`. Always discover first with `search_tools()` / `tool_info()` before invoking, and never claim a tool works until discovery confirms it. The OFFICIAL Figma Dev Mode MCP is out of scope for this release and is not a supported path (a future option only).

| Feature | One-line description | Class | Invocation |
|---|---|---|---|
| Discover MCP tools | Confirms the `figma` manual and its tool names before use | READ-ONLY | `search_tools()` / `tool_info()` (Code Mode) |
| Pull design context | Calls a Framelink `figma` tool to pull design data into the agent | READ-ONLY (opt-in) | `call_tool_chain()` with `figma.figma_<tool>` |

See [`optional-mcp/optional-mcp-context.md`](optional-mcp/optional-mcp-context.md) for the Code Mode discovery-first contract and the Dev Mode out-of-scope boundary.

---

## 10. CAPABILITY COUNT SUMMARY

Each capability area maps to exactly one per-feature file in its numbered category folder. The command count is the decision-relevant command surface digested per area, not the per-feature file count.

| Section | Area | Commands listed | Per-feature file |
|---|---|---|---|
| 2 | Connect and daemon | 10 | `connect-and-daemon/connect-and-daemon.md` |
| 3 | Inspect | 10 | `inspect/inspect.md` |
| 4 | Design-system extract and import | 2 | `design-system-extract-and-import/design-system-extract-and-import.md` |
| 5 | Render and create | 14 | `render-and-create/render-and-create.md` |
| 6 | Tokens and variables | 9 | `tokens-and-variables/tokens-and-variables.md` |
| 7 | Export | 5 | `export/export.md` |
| 8 | A11y and analysis | 5 | `a11y-and-analysis/a11y-and-analysis.md` |
| 9 | Optional MCP context | 2 | `optional-mcp/optional-mcp-context.md` |
| **Total** | **8 capability areas** | **57 command rows** | **8 per-feature files** |

> Counts cover the decision-relevant commands digested in the figma-cli capability research; the full per-command flag surface (≈130 rows) lives in the research raw output and is not reproduced here. The per-feature file count MUST equal the 8 capability areas; keep them in sync as areas are added or revised. Verify any command, flag, or class against `figma-ds-cli --help` before relying on it.
