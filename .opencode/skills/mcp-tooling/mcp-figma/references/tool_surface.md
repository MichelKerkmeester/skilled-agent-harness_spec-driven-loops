---
title: "Figma CLI Tool Surface"
description: "The figma-ds-cli command surface classified read-only / mutating / destructive / arbitrary, plus the surface / gate / omit policy, the explicit destructive set with per-command rollback, the eval/raw/run arbitrary-mutation rule, the local-export no-overwrite rule, and the live --help verification requirement."
trigger_phrases:
  - "figma cli command gating"
  - "figma-ds-cli tool surface"
  - "figma destructive commands"
  - "figma read-only vs mutating"
  - "figma eval raw run rule"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.3
---

# Figma CLI Tool Surface

> **IMPORTANT:** This taxonomy was built from a read-only source scan of the silships `figma-cli` repo (`main`, package `figma-ds-cli@1.2.0`) plus its `REFERENCE.md` / `CLAUDE.md`. The command surface **drifts** between `REFERENCE.md`, `CLAUDE.md`, and the actual `src/commands/*.js` (documented commands such as `voice`, `chat`, `prop combine`, and the `create rect/circle/...` primitives were NOT found in the source scan). **Always verify a command with `<bin> <command> --help` before relying on it**, and gate every mutating or destructive verb. The CLI was not installed or executed during this analysis, so every example below is **illustrative, so verify with `--help`**.

---

## 1. OVERVIEW

### Core Principle

Surface read-only commands freely, gate every mutating verb behind confirmation plus an explicit target plus a one-line rollback, treat the explicit destructive set as the strictest case (confirm + explicit target + rollback, prefer duplicate-first), and treat `eval` / `raw` / `run` as arbitrary mutation that must be reviewed before it runs. The canonical binary is **`figma-ds-cli`**, and the source surface is the only source of truth and it drifts from the docs.

### When to Use

- Decide whether a `figma-ds-cli` command is safe to call unprompted, must be gated, or is destructive and needs confirmation plus a rollback.
- Confirm the gating class of any command before authoring, modifying, deleting, or exporting in a Figma document.
- Reach for the destructive set and rollback table before any delete / clear / undo / unwrap / uninstall / unlink operation.

### Key Sources

- [figma_cli_reference.md](figma_cli_reference.md) - the binary identity, connect modes, daemon model, and command examples.
- [mcp_wiring.md](mcp_wiring.md) - the optional Framelink Figma MCP via Code Mode (a separate, opt-in surface, not part of this CLI gating).

Claims here are tagged **READ-ONLY**, **MUTATING**, **DESTRUCTIVE**, or **ARBITRARY** as defined in Section 2, and were read from a source scan of the silships figma-cli during the skill's build research. They are **source-verified for repo `main`**, not live-verified against an installed binary.

### The naming trap (read first)

The canonical binary is **`figma-ds-cli`** (silships, npm `figma-ds-cli`, MIT). The npm package literally named **`figma-cli` is an UNRELATED tool** (unic/figma-cli, bin `figma`). **NEVER `npm i -g figma-cli`.** The `figma-cli` command only exists when installed from the silships repo (`main` exposes both `figma-ds-cli` and `figma-cli`), while npm `latest` (`1.0.0`) exposes only `figma-ds-cli`. This document writes every command with `figma-ds-cli`.

---

## 2. THE FOUR CLASSES

Every command falls into exactly one gating class. The class drives the exposure policy in Section 4.

- **READ-ONLY**: reads Figma or local state, or writes an **export file**, without changing the Figma document or app/config state. Safe to surface. **Caveat:** any command that writes a local file (`extract`, `export*`, `verify --save`, `analyze-url --screenshot`, `api setup/index`) must use an **explicit output path and never silently overwrite** an existing file (see Section 5).
- **MUTATING**: changes the Figma document, the current selection, or local tool / app / plugin / config state. Gate behind confirmation + an explicit target + a one-line rollback. Includes all authoring, layout, token, binding, variant, import, app-level connect/patch/daemon, and `init-agent` verbs.
- **DESTRUCTIVE**: deletes Figma document content, variables, collections, annotations, grids, or removes an installed/local resource. The strictest case: confirm + **explicit target** + a stated rollback, and **prefer duplicating** the file/page/selection first. Never via an active-selection fallback. The explicit set + per-command rollback is Section 6.
- **ARBITRARY**: `eval`, `run`, and `raw` execute arbitrary Figma Plugin API code or arbitrary `figma-use` commands. They can do **anything** (read, mutate, or delete). Treat as MUTATING-at-minimum, **review the code/command before running**, and never run them on an exploratory hunch (Section 7).

> Tag meanings used in the table below: `READ-ONLY`, `MUTATING`, `DESTRUCTIVE`, `ARBITRARY`. Where a single command name has read-only and write sub-verbs (`component prop`, `dev`, `section`, `grid`, `annotate`), the per-sub-verb class is called out.

---

## 3. THE COMMAND SURFACE (CLASSIFIED BY GROUP)

Source-verified against repo `main` `src/commands/*.js`, `REFERENCE.md`, and `CLAUDE.md`. **Verify with `--help` before relying on any row**, since the surface drifts (Section 8).

| Group | Command | Class | Notes |
| ----- | ------- | ----- | ----- |
| Setup | `figma-ds-cli` (first run) | MUTATING | First-run wizard: checks Node, may patch Figma, starts Figma. App-level. |
| Setup | `init` / `setup` | MUTATING | Interactive setup; `setup` aliases `init`. App-level. |
| Setup | `connect [--safe]` | MUTATING | `--safe` = plugin bridge (no patch, DEFAULT). Bare `connect` = yolo `app.asar` patch (GATE: consent + rollback). App-level. |
| Setup | `unpatch` | MUTATING | Restores the original `app.asar` string (the yolo rollback). App-level. |
| Setup | `status` | READ-ONLY | Checks CDP + daemon status. |
| Setup | `diagnose` | READ-ONLY | System compatibility + connection status. |
| Daemon | `daemon status [--debug]` | READ-ONLY | Daemon health / token diagnostics. |
| Daemon | `daemon diagnose` | READ-ONLY | Full daemon troubleshooting. |
| Daemon | `daemon start [--force]` | MUTATING | Starts daemon, generates token. App-level. |
| Daemon | `daemon stop` | MUTATING | Stops daemon. App-level. |
| Daemon | `daemon restart` | MUTATING | Restarts daemon, regenerates token. App-level. |
| Daemon | `daemon reconnect` | MUTATING | Reconnects daemon to Figma. App-level. |
| Agent setup | `init-agent [--tool claude\|cursor\|both] [--force]` | MUTATING | Writes `AGENTS.md` and/or `.cursor/rules/figma-cli.mdc` into the **working repo**. Not default-run. |
| Design I/O | `extract [output] [--pages] [--sections] [--selection] [--split\|--no-split]` | READ-ONLY | Writes `DESIGN.md`; auto-splits large structure into `DESIGN-structure/`. Explicit output path; no overwrite. |
| Design I/O | `spec <component> [-f file] [--check nodeId] [--tolerance px]` | READ-ONLY | Reads `DESIGN.md` spec; `--check` measures a built node, non-zero exit on mismatch. |
| Design I/O | `import <source> [-c] [--save] [--type ...] [--print-context]` | MUTATING | Imports DESIGN.md / Tailwind / CSS / tokens.json / Storybook into variables. |
| Variables | `var list` / `var find <pattern>` | READ-ONLY | Lists / finds variables. |
| Variables | `var visualize [collection]` | MUTATING | Creates color swatches on canvas. |
| Variables | `var create <name> ...` / `var create-batch <json> -c` | MUTATING | Creates one / many variables. |
| Variables | `var bind-batch <json>` / `var set-batch <json>` / `var rename-batch <json>` | MUTATING | Batch bind / set / rename across nodes. |
| Variables | `var delete-all [-c collection]` | **DESTRUCTIVE** | Deletes all local variables/collections (or one collection's). |
| Variables | `var delete-batch <nodeIds>` | **DESTRUCTIVE** | Deletes multiple nodes by id. |
| Collections | `collections list` / `col list` | READ-ONLY | Lists collections. |
| Collections | `collections create <name>` / `col create <name>` | MUTATING | Creates a collection. |
| Tokens | `tokens overlap <collections...> [--json]` | READ-ONLY | Compares token names across collections. |
| Tokens | `tokens tailwind\|preset\|shadcn\|spacing\|radii\|ds\|components` | MUTATING | Creates token scales / presets / base design system. |
| Tokens | `tokens import <file>` / `tokens import-design-md <file>` | MUTATING | Imports JSON / DESIGN.md tokens. |
| Tokens | `tokens add <name> <value> [-c] [-t]` | MUTATING | Adds one token. |
| Binding | `bind list [-t COLOR\|FLOAT]` | READ-ONLY | Lists bindable variables. |
| Binding | `bind fill\|stroke\|radius\|gap\|padding <varName> [-n] [-s]` | MUTATING | Binds a node property to a variable. |
| Creation | `render <jsx> ...` / `render-batch <jsxArray> ...` | MUTATING | Renders JSX to Figma. Preferred over `eval` for visual nodes. |
| Creation | `undo` | **DESTRUCTIVE** | Removes the node(s) created by the latest render / render-batch. |
| Creation | `create frame\|icon\|image ...` | MUTATING | Creates a frame / Iconify icon / image-from-URL node. |
| Creation | `rect\|ellipse\|text\|line\|component\|group\|autolayout\|al` | MUTATING | Top-level primitive aliases (source-proven; `REFERENCE.md` `create rect/...` form is drift, so verify with `--help`). |
| Layout | `sizing hug\|fill\|fixed ...` | MUTATING | Sets auto-layout sizing. |
| Layout | `padding\|pad` / `gap` / `align` | MUTATING | Sets padding / gap / alignment. |
| Layout | `set autolayout\|al ...` / `set pin <edge> ...` | MUTATING | Applies auto-layout / constraints. |
| Layout | `arrange [-g] [-c]` | MUTATING | Rearranges all top-level frames (repositions; not a delete). |
| Layout | `unstack [-g] [--dry-run]` | MUTATING | Spreads overlapping nodes; `--dry-run` is READ-ONLY. |
| Modification | `set fill\|stroke\|radius\|size\|scale\|pos\|opacity\|name\|text ...` | MUTATING | Changes matched node properties. |
| Modification | `use <collection>` / `theme <collection> [--dry-run]` | MUTATING | Rebinds variable references; `--dry-run` is READ-ONLY. |
| Modification | `unwrap <nodeId> [--keep-wrapper]` | **DESTRUCTIVE** | Moves children out and **deletes the wrapper** unless `--keep-wrapper`. |
| Query | `canvas info` / `canvas next` | READ-ONLY | Canvas bounds / next free position. |
| Query | `find <name>` / `get [nodeId]` / `inspect <nodeId>` | READ-ONLY | Finds / reads node properties / spec. |
| Query | `select <nodeId>` | MUTATING | Changes current selection only. |
| Duplicate/delete | `duplicate\|dup [nodeId] [--offset]` | MUTATING | Duplicates a node/selection (this is the preferred pre-delete rollback). |
| Duplicate/delete | `delete\|remove [nodeId]` | **DESTRUCTIVE** | Deletes a node/selection. |
| Node | `node tree [nodeId]` / `node bindings [nodeId]` | READ-ONLY | Shows node tree / variable bindings. |
| Node | `node to-component <nodeIds...>` | MUTATING | Converts frames to components. |
| Node | `node delete <nodeIds...>` | **DESTRUCTIVE** | Deletes nodes by id. |
| Slots | `slot list [nodeId]` | READ-ONLY | Lists slots. |
| Slots | `slot create\|preferred\|reset\|convert\|add ...` | MUTATING | Creates / configures slots. |
| Variants | `sizes [nodeId]` / `variants from <ids> ...` | MUTATING | Generates size variants / a variant set. |
| Variants | `combos [nodeId] [--dry-run]` | MUTATING | Generates variant combinations; `--dry-run` is READ-ONLY. |
| shadcn | `shadcn list` | READ-ONLY | Lists available components. |
| shadcn | `shadcn add [names...] [--all]` | MUTATING | Adds shadcn/ui components to canvas. |
| Blocks | `blocks list` | READ-ONLY | Lists available blocks. |
| Blocks | `blocks create <id>` | MUTATING | Creates a prebuilt UI block. |
| Component props | `component prop list` | READ-ONLY | Lists component properties. |
| Component props | `component prop add\|combine` | MUTATING | Adds / combines component properties. |
| Component props | `component prop delete` | **DESTRUCTIVE** | Deletes a component property. |
| Dev resources | `dev list` | READ-ONLY | Lists dev resource links. |
| Dev resources | `dev link\|edit` | MUTATING | Adds / edits dev resource links. |
| Dev resources | `dev unlink` | **DESTRUCTIVE** | Removes a dev resource link. |
| Sections | `section list` | READ-ONLY | Lists sections. |
| Sections | `section create\|add` | MUTATING | Creates / assigns sections. |
| Grids | `grid list` | READ-ONLY | Lists layout grids. |
| Grids | `grid set` | MUTATING | Sets a layout grid. |
| Grids | `grid clear` | **DESTRUCTIVE** | Clears grid metadata. |
| Annotations | `annotate list` | READ-ONLY | Lists annotations. |
| Annotations | `annotate add` | MUTATING | Adds an annotation. |
| Annotations | `annotate clear` | **DESTRUCTIVE** | Clears annotations. |
| Export | `export screenshot\|node\|css\|tailwind ...` | READ-ONLY | Writes export files. Explicit output path; no overwrite. |
| Export | `export-jsx [nodeId] [-o] [--pretty]` / `export-storybook [nodeId] [-o]` | READ-ONLY | Writes JSX / Storybook files. Explicit output path; no overwrite. |
| Verify | `verify [nodeId] [--save path] [--measure]` | READ-ONLY | Returns / saves a screenshot + optional measurement JSON. No overwrite on `--save`. |
| Analysis | `analyze colors\|typography\|spacing\|clusters [--json]` | READ-ONLY | Reports usage / patterns. |
| Analysis | `lint [--json]` | READ-ONLY | Lints the design. |
| Analysis | `lint --fix` | MUTATING | `--fix` mutates the document. |
| A11y | `a11y contrast\|vision\|touch\|text\|focus\|audit ...` | READ-ONLY | Accessibility checks. |
| URL/image | `analyze-url <url> [--screenshot]` | READ-ONLY | Extracts webpage CSS; `--screenshot` writes a local file (no overwrite). |
| URL/image | `screenshot-url <url> ...` / `recreate-url <url> ...` | MUTATING | Imports a website screenshot / recreates a webpage **into Figma**. |
| URL/image | `remove-bg [nodeId] [--api-key]` | MUTATING | Removes an image background; needs a remove.bg key (network). |
| Gradient | `gradient extract <image> [--json]` (no `--apply-to`) | READ-ONLY | Extracts a gradient without applying. |
| Gradient | `gradient extract ... --apply-to <nodeId>` / `gradient mesh <colors> ...` | MUTATING | Applies / creates a gradient on a node. |
| FigJam | `fj list\|info\|nodes` | READ-ONLY | Lists FigJam pages / nodes. |
| FigJam | `fj sticky\|shape\|text\|connect\|move\|update ...` | MUTATING | Creates / edits FigJam content. |
| FigJam | `fj delete <nodeId> [-p]` | **DESTRUCTIVE** | Deletes a FigJam node. |
| FigJam | `fj eval <code> [-p]` | ARBITRARY | Arbitrary FigJam eval, review before running (Section 7). |
| Files | `files` | READ-ONLY | Lists open design files as JSON. |
| Plugins | `plugins list` | READ-ONLY | Lists available plugins. |
| Plugins | `plugins install\|setup <name>` | MUTATING | Installs / sets up a plugin. |
| Plugins | `plugins uninstall <name>` | **DESTRUCTIVE** | Removes an installed plugin resource. |
| Plugin API docs | `api index\|context\|list\|search\|gap\|age` | READ-ONLY | Reads the offline Plugin API docs. |
| Plugin API docs | `api setup [--update]` | MUTATING | Writes local docs/index files (no overwrite). |
| Config | `config get <key>` | READ-ONLY | Reads config. |
| Config | `config set <key> <value>` | MUTATING | Writes local config (e.g. a removebg key). |
| Raw/eval | `eval [code] [-f file]` | ARBITRARY | Arbitrary Figma Plugin API code, review before running (Section 7). |
| Raw/eval | `run <file>` | ARBITRARY | Alias for executing an eval file, review before running. |
| Raw/eval | `raw <command...>` | ARBITRARY | Arbitrary `figma-use` command, review before running. |

> The full per-flag table is large (~130 commands). Run `figma-ds-cli --help` and `figma-ds-cli <group> --help` for the live, version-accurate surface rather than a snapshot.

---

## 4. THE SURFACE / GATE / OMIT POLICY

This policy is the spine of how the skill exposes the surface.

### Surface freely (READ-ONLY)

Call these without ceremony, with one constraint: any read that **writes a local file** must use an explicit output path and must not overwrite (Section 5):

`status`, `diagnose`, `daemon status`, `daemon diagnose`, `var list`, `var find`, `collections list`, `bind list`, `tokens overlap`, `extract`, `spec`, `canvas info`, `canvas next`, `find`, `get`, `inspect`, `node tree`, `node bindings`, `slot list`, `shadcn list`, `blocks list`, `component prop list`, `dev list`, `section list`, `grid list`, `annotate list`, `files`, `plugins list`, `config get`, `export *`, `export-jsx`, `export-storybook`, `verify`, `analyze *`, `lint` (no `--fix`), `a11y *`, `analyze-url`, `gradient extract` (no `--apply-to`), `fj list\|info\|nodes`, `api index\|context\|list\|search\|gap\|age`, and the `--dry-run` forms of `unstack` / `use` / `theme` / `combos`.

### Surface but GATE (confirmation + explicit target + rollback note)

Before any of these, state the effect and a one-line rollback, name the explicit target node/file/collection, and stop for confirmation:

- **App-level:** `connect` (yolo patch, rollback `figma-ds-cli unpatch`), `unpatch`, `daemon start\|stop\|restart\|reconnect`, `config set`, `plugins install\|setup`, `api setup`, and **`init-agent`** (writes `AGENTS.md` / `.cursor/rules` into the working repo, never default-run).
- **Doc-level authoring:** all `create*` / `render*` / primitive aliases, `tokens *` writes, `var create\|create-batch\|bind-batch\|set-batch\|rename-batch\|visualize`, `bind *`, `set *`, layout verbs (`sizing\|padding\|gap\|align\|set autolayout\|set pin\|arrange\|unstack`), `duplicate`, `use\|theme`, `node to-component`, `slot` writes, `sizes\|variants\|combos`, `shadcn add`, `blocks create`, `component prop add\|combine`, `dev link\|edit`, `section create\|add`, `grid set`, `annotate add`, `import`, `lint --fix`, `screenshot-url`, `recreate-url`, `remove-bg`, `gradient extract --apply-to`, `gradient mesh`, and `fj` write verbs.

### OMIT from the default path (destructive + arbitrary, explicit request only)

Keep these out of the normal flow. Reach for them only on an explicit, specific user request, with the Section 6 / Section 7 ceremony:

- **Destructive:** `var delete-all`, `var delete-batch`, `delete\|remove`, `node delete`, `undo`, `unwrap`, `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear`, `annotate clear`.
- **Arbitrary mutation:** `eval`, `run`, `raw`, `fj eval`.

Where two readings of a command disagreed (e.g. `arrange` reads as "destructive" in one source comment but only repositions), the **stricter gating wins** in the SURFACE/GATE choice and the **accurate class wins** in the table, so `arrange` is MUTATING (repositions), not DESTRUCTIVE (no delete).

---

## 5. THE LOCAL-EXPORT NO-OVERWRITE RULE

Read-only does not mean side-effect-free on the local filesystem. `extract`, `export *`, `export-jsx`, `export-storybook`, `verify --save`, `analyze-url --screenshot`, and `api setup\|index` all **write files locally**.

1. **Always pass an explicit output path** (`-o file` / `[output]` / `--save path`). Do not rely on a default filename.
2. **Never silently overwrite.** Check for an existing file first, and if the target exists, choose a new path or ask before clobbering it.
3. **Handle multi-file output.** `extract` auto-splits a large structure into a `DESIGN-structure/` directory above ~50k tokens, so treat the export as a possible directory, not a single file.

These are local-filesystem mutations even though the Figma document is untouched. They never need Figma-side rollback, but they must not destroy prior local work.

---

## 6. THE DESTRUCTIVE SET (CONFIRM + EXPLICIT TARGET + ROLLBACK)

Never run any of these without an explicit target (id / name / collection) and a stated rollback. **Never via an active-selection fallback.** The strongest rollback is to **duplicate the file / page / selection first** (`figma-ds-cli duplicate`, or a Figma page/file duplicate). Figma's own **Undo (Cmd/Ctrl+Z)** and **version history** are the primary safety nets, and the per-command notes below name the most direct recovery.

| Destructive command | What it deletes | One-line rollback |
| ------------------- | --------------- | ----------------- |
| `var delete-all [-c collection]` | All local variables/collections (or one collection's) | Figma Undo immediately; otherwise restore from version history. Irreversible once the session closes, so **duplicate the file first**. |
| `var delete-batch <nodeIds>` | The listed nodes | Figma Undo; else version history. Confirm the exact id list before running. |
| `delete\|remove [nodeId]` | A node / current selection | Figma Undo (Cmd/Ctrl+Z); duplicate the node first for a safe copy. |
| `node delete <nodeIds...>` | Nodes by id | Figma Undo; duplicate the nodes first. Require the explicit id list, not the selection. |
| `undo` | The node(s) from the latest render / render-batch | Re-run the original `render` / `render-batch` to recreate; there is no "redo" for this CLI verb. |
| `unwrap <nodeId> [--keep-wrapper]` | The wrapper frame (children survive) | Pass `--keep-wrapper` to avoid the delete; else Figma Undo restores the wrapper. |
| `fj delete <nodeId> [-p]` | A FigJam node | Figma Undo on the FigJam page; duplicate the page first for large clears. |
| `plugins uninstall <name>` | An installed plugin resource | Re-install with `plugins install <name>` (re-runs setup; any local plugin config is lost). |
| `dev unlink` | A dev resource link | Re-create with `dev link` using the original URL, so record the URL before unlinking. |
| `component prop delete` | A component property | Re-create with `component prop add`; Figma Undo if still in-session. Note the prop name/type first. |
| `grid clear` | Layout grid metadata on a node | Figma Undo; else re-apply with `grid set` from the recorded grid spec. |
| `annotate clear` | Annotations | Figma Undo; else re-add with `annotate add`, copying the annotation text first. |

Rollback preference order, always: **(1) duplicate-first**, then **(2) Figma Undo (Cmd/Ctrl+Z) while still in-session**, then **(3) Figma version history**. State which one applies before you run the command.

---

## 7. THE ARBITRARY-MUTATION RULE (eval / raw / run / fj eval)

`eval`, `run`, `raw`, and `fj eval` execute arbitrary Figma Plugin API code or arbitrary `figma-use` commands. They are not classified by name because the **payload** decides what they do, whether read, mutate, or delete.

1. **Treat them as MUTATING at minimum, and as potentially DESTRUCTIVE.** Apply the GATE ceremony (confirm + target + rollback) by default, and the DESTRUCTIVE ceremony if the payload can delete.
2. **Review the exact code / command before running it.** Never run `eval`/`run`/`raw` on an exploratory hunch or because the prompt "sounds read-only."
3. **Prefer the purpose-built verb.** The upstream agent rules state: never use `eval` to create visual nodes (it bypasses positioning and guards), and use `render` / `render-batch`. Reach for arbitrary execution only when no dedicated command exists.
4. **Never delete existing user nodes** through arbitrary execution, because the upstream generated rules prohibit it.

---

## 8. THE HARD RULE: VERIFY LIVE, GATE MUTATIONS

The command surface drifts between `REFERENCE.md`, `CLAUDE.md`, and the actual `src/commands/*.js`. The investigation found documented-but-unregistered commands (`voice`, `chat`, `prop combine`) and primitive-name drift (`REFERENCE.md` shows `create rect/circle/...`; source proves `create frame/icon/image` plus top-level `rect|ellipse|text|line|component|group|autolayout`). All of it must be hedged.

1. **Verify with `<bin> <command> --help` before relying on a command.** A command in `REFERENCE.md`/`CLAUDE.md` may not exist in the installed binary, and flags differ between the npm `latest` (`1.0.0`) and repo `main` (`1.2.0`) builds. Examples in this skill are **illustrative, so verify with `--help`.**
2. **Verify the binary identity first.** Prefer `figma-ds-cli`, and only trust `figma-cli` after `--version`/`--help` confirms it is the silships tool (the npm `figma-cli` package is unrelated). **Never `npm i -g figma-cli`.**
3. **Gate every MUTATING verb** behind confirmation, an explicit target, and a one-line rollback.
4. **Apply the DESTRUCTIVE ceremony** (Section 6) to every command in the destructive set: confirm + explicit target + rollback, prefer duplicate-first, never via the active-selection fallback.
5. **Review every ARBITRARY payload** (Section 7) before it runs.
6. **Enforce the export no-overwrite rule** (Section 5) on every local-file write, including "read-only" exports.
7. **Never auto-apply the yolo `app.asar` patch** (`connect` without `--safe`) without explicit consent and a stated `figma-ds-cli unpatch` rollback. Prefer `connect --safe`.
8. **Never expose the daemon token** (`~/.figma-ds-cli/.daemon-token`) in user-facing output, and keep the daemon bound to `127.0.0.1`.

---

## 9. ESCALATION

- **A command is not in this table, or `--help` disagrees with it.** Stop and verify with `<bin> <command> --help`, and do not guess a class. The source drifts (Section 8).
- **A destructive verb, a broad delete/undo/unwrap, or an arbitrary `eval`/`raw`/`run` is requested.** Describe the effect and the rollback, name the explicit target, then stop and wait for confirmation.
- **The yolo patch is requested.** Surface the `app.asar` modification, the Figma-update fragility, and the `figma-ds-cli unpatch` rollback, prefer `connect --safe`, then wait for consent.
- **An export would overwrite an existing file.** Stop, name the conflicting path, and ask for a new path or explicit overwrite approval.
- **Figma Desktop is not open or the daemon is unhealthy.** None of these commands work without the live Desktop session and a healthy daemon, so escalate to setup before mutating.

---

## 10. REFERENCES

- [figma_cli_reference.md](figma_cli_reference.md) - binary identity, connect modes, daemon model, command examples.
- [mcp_wiring.md](mcp_wiring.md) - the optional Framelink Figma MCP via Code Mode (separate, opt-in surface).
- [troubleshooting.md](troubleshooting.md) - failure modes and fixes.
- [SKILL.md](../SKILL.md) - the skill contract this reference supports.
