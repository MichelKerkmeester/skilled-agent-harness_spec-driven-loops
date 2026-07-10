---
title: "Figma CLI Reference"
description: "How to identify and invoke the figma-ds-cli binary, the connect modes and HTTP daemon model, and the grouped command surface classified read-only vs mutating vs destructive."
trigger_phrases:
  - "figma cli reference"
  - "figma-ds-cli binary"
  - "figma cli daemon connect"
  - "figma-cli npm name collision"
  - "figma var name binding"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.3
---

# Figma CLI Reference

> **IMPORTANT:** The canonical binary is `figma-ds-cli` (silships, MIT). The npm package literally named `figma-cli` is an UNRELATED tool (unic/figma-cli, bin `figma`, "export and scaffold from Figma into style guides"), so **NEVER `npm i -g figma-cli`**. The `figma-cli` command only exists when installed from the silships repo, and even then it may shadow the unic package on PATH, so this skill invokes `figma-ds-cli` throughout.

---

## 1. OVERVIEW

### Core Principle
figma-ds-cli drives the live Figma **Desktop** session over a local HTTP daemon, so there is no Figma API key and nothing renders without Figma Desktop open on a file. Identify the binary first, confirm Figma Desktop is open and the daemon is healthy, then act, gating every command by its mutation class.

### When to Use
- Look up the exact binary identity, connect mode, daemon transport, and command surface before running anything.
- Confirm whether a given command is read-only, mutating, or destructive before promising it is safe.

### Key Sources
- [tool_surface.md](tool_surface.md) - the full read-only / mutating / destructive taxonomy and gating policy.
- [mcp_wiring.md](mcp_wiring.md) - the optional Figma MCP (Framelink `figma`) via Code Mode.
- [troubleshooting.md](troubleshooting.md) - failure modes and fixes.
- [INSTALL_GUIDE.md](../INSTALL_GUIDE.md) - install steps and binary verification (installation detail lives there, not here).

This skill is **version 1.0.0.0** and installs figma-ds-cli through the embedded `mcp-servers/figma-cli` scaffold rather than source-vendoring it.

All load-bearing claims below are tagged **[CONFIRMED]** (read from the upstream source or package metadata, or verified live with `npm view`) or **[INFERRED]** (reasoned from source, needs a live `--help` or run to close). The figma-ds-cli binary was verified live at 1.2.0 for this release, but the command examples below were drafted from source rather than transcribed from each subcommand, so treat them as **illustrative and verify the exact flags with `<bin> <group> --help`** before relying on them. The full uncertainty list is Section 8.

---

## 2. PACKAGE & BINARY IDENTITY

### The name collision (read this first)

There are two unrelated npm packages whose names look alike. Confusing them installs the wrong tool.

| npm package | Author / repo | bin it installs | What it is | Use it? |
|---|---|---|---|---|
| `figma-ds-cli` | silships, `git+https://github.com/silships/figma-cli.git`, intodesignsystems.com, MIT | **`figma-ds-cli`** (npm latest 1.0.0); repo `main` also exposes `figma-cli` | The silships terminal tool this skill drives. | **YES, canonical.** **[CONFIRMED: `npm view`]** |
| `figma-cli` | Fredi Bach / Unic AG, `git+https://github.com/unic/figma-cli.git` | **`figma`** | An UNRELATED tool that exports/scaffolds from Figma into style guides like Estatico. | **NEVER.** `npm i -g figma-cli` installs this wrong tool. **[CONFIRMED: `npm view`]** |

### Version drift: npm 1.0.0 vs repo 1.2.0

- The only version published to npm is **`figma-ds-cli@1.0.0`** (versions array = `["1.0.0"]`), and its `bin` exposes **only `figma-ds-cli`** → `src/index.js`. **[CONFIRMED: `npm view`, npm 11.9.0]**
- The repo `main` branch is **1.2.0**, whose `package.json` exposes **both** `figma-ds-cli` and `figma-cli`, both mapped to `src/index.js`. This version is **unpublished**, and `figma-ds-cli@1.2.0` returns E404 on npm. So "install the pinned `figma-ds-cli@1.2.0` from npm" is **impossible**, and the newer 1.2.0 only comes from the silships git repo. **[CONFIRMED: `npm view` E404 + repo `package.json`]**
- **The gap is functional, not cosmetic.** The published `1.0.0` is a much smaller tool: `figma-ds-cli@1.0.0 --help` lists only `init, setup, status, connect, var, collections, tokens, create, render, export, eval, raw`, its `connect` has **no `--safe`** (yolo-only), and there is **no `daemon`, no `unpatch`, no `extract`/`import`/`bind`/`a11y`/`slot`/`fj`** etc. The full surface this skill documents (safe connect, the daemon verbs, `extract`→DESIGN.md, and ~120 more commands) exists **only in 1.2.0 from the repo**. **[CONFIRMED: live install of both versions, 2026-06-14]**

### Practical consequence

- **Install 1.2.0 from the repo** (`install.sh --source repo`, or `--source auto` which auto-upgrades when npm is stale) to get the surface this skill describes. `npm i -g figma-ds-cli` alone lands the minimal 1.0.0.
- Prefer **`figma-ds-cli`** on PATH (unambiguous). It is the command this skill emits.
- A `figma-cli` command on PATH is **ambiguous**: it could be silships (repo install) or unic/figma-cli (the wrong npm package). If you must use it, confirm it resolves to silships with `figma-cli --version` / `--help` before trusting it. **[CONFIRMED: `npm view` + repo metadata]**

```bash
# Binary detection: canonical first, ambiguous fallback verified.
BIN=""
command -v figma-ds-cli >/dev/null && BIN="figma-ds-cli"
[ -z "$BIN" ] && command -v figma-cli >/dev/null && BIN="figma-cli"   # only if it resolves to silships
[ -z "$BIN" ] && { echo "figma-ds-cli not found, see INSTALL_GUIDE.md (do NOT 'npm i -g figma-cli')"; exit 1; }
"$BIN" --version          # illustrative; if BIN=figma-cli, confirm it is silships not unic
```

> Installation steps (npm vs silships repo vs clone + `npm link`, and the `figma-cli` collision warning) live in [INSTALL_GUIDE.md](../INSTALL_GUIDE.md). This reference assumes the binary is already on PATH.

---

## 3. PREREQUISITES & BASELINE

| Prerequisite | Requirement | Tag |
|---|---|---|
| **Node.js** | `engines.node` is `>=18`; setup exits below Node 18 (CI runs 18 / 20 / 22). | **[CONFIRMED: `package.json` + `src/commands/setup.js`]** |
| **OS** | **macOS is the supported baseline.** Source carries Windows/Linux platform helpers, but the docs treat those as "coming" / unverified, so do not promise non-macOS behavior. | **[CONFIRMED: `docs/ARCHITECTURE.md`, `src/platform.js`]** |
| **Figma Desktop** | Must be **open with a Figma file**. The CLI drives the live Desktop session via the local Plugin API / CDP; nothing works without it. | **[CONFIRMED: README, `docs/ARCHITECTURE.md`]** |
| **Figma API key** | **None.** No Figma REST key; a free Figma account with Figma Desktop works. | **[CONFIRMED: README, npm page]** |
| **Network exceptions** | Most operation is local/offline (local LLMs via LM Studio/Ollama are supported). Exceptions that need network or a key: `remove-bg` (a remove.bg key), plus Iconify / image / URL / Storybook commands. | **[CONFIRMED: README, `src/commands/url-tools.js`]** |

---

## 4. CONNECT MODES & THE DAEMON

Every command proxies to a local **daemon** the CLI starts. Bring up a connection first.

### Safe mode (DEFAULT, no patch)

```bash
figma-ds-cli connect --safe     # illustrative; verify with --help
```

Safe mode runs the **FigCli plugin bridge** and does **not** patch Figma. Import `plugin/manifest.json` once, then each session open `Plugins → Development → FigCli` and keep it open, since the plugin connects over a WebSocket (`ws://127.0.0.1:<port>/plugin`, the plugin UI scans ports `3456`–`3460`). This is the recommended default for setup. **[CONFIRMED: `REFERENCE.md`, `src/commands/setup.js`, `plugin/ui.html`]**

### Yolo mode (GATED, patches the Figma app)

```bash
figma-ds-cli connect            # illustrative; GATED, requires explicit consent + a stated rollback
```

Yolo mode **patches Figma Desktop's `app.asar`** (replaces `removeSwitch("remote-debugging-port")` with `removeSwitch("remote-debugXing-port")`), runs `codesign --force --deep --sign -` on macOS, restarts Figma with remote debugging, and connects over **CDP on fixed port `9222`**, then starts the daemon. It may need Full Disk Access / admin and **breaks when Figma updates** (re-run `connect`). **Never run without explicit consent and a stated rollback.** **[CONFIRMED: README, `src/figma-patch.js`, `docs/ARCHITECTURE.md`]**

```bash
figma-ds-cli unpatch            # illustrative; rollback that restores the original app.asar string
```

`unpatch` restores the original `app.asar` string and updates local config. It is the rollback for the yolo patch. **[CONFIRMED: `src/commands/setup.js`]**

### The daemon model

| Property | Value | Tag |
|---|---|---|
| Transport | **HTTP server on `127.0.0.1`, default port `3456`** (NOT a Unix socket). | **[CONFIRMED: `src/daemon.js`]** |
| Endpoints | `/health`, `/exec`, `/reconnect`, and WebSocket `/plugin` (the safe-mode plugin bridge). | **[CONFIRMED: `src/daemon.js`]** |
| Auth | `X-Daemon-Token` header; host validated as `localhost` / `127.0.0.1`; CORS preflight blocked. | **[CONFIRMED: `src/daemon.js`, `src/lib/cli-core.js`]** |
| Token file | `~/.figma-ds-cli/.daemon-token` (never expose or paste it). | **[CONFIRMED: `src/daemon.js`]** |
| PID file | `~/.figma-cli-daemon.pid`; spawned detached via Node. | **[CONFIRMED: `src/lib/cli-core.js`]** |
| Idle timeout | 60 minutes in executable code (a header comment says 10 minutes, but the code value wins). Not reboot-persistent. | **[CONFIRMED: `src/daemon.js`]** |

### Daemon verbs

```bash
figma-ds-cli daemon status [--debug]   # health / token diagnostics   (read-only)
figma-ds-cli daemon diagnose           # full troubleshooting          (read-only)
figma-ds-cli daemon start [--force]    # start + generate token        (mutating)
figma-ds-cli daemon stop               # stop                          (mutating)
figma-ds-cli daemon restart            # restart + regenerate token    (mutating)
figma-ds-cli daemon reconnect          # reconnect to Figma            (mutating)
```

All illustrative; verify with `figma-ds-cli daemon --help`. A token mismatch surfaces as "Unauthorized: Invalid or missing token", so run `daemon diagnose` then `daemon restart` (never auto-delete the token). **[CONFIRMED: `REFERENCE.md`]**

---

## 5. COMMAND CLASSIFICATION

Every command carries one mutation class. The full per-command taxonomy and gating rules live in [tool_surface.md](tool_surface.md); this is the policy summary.

| Class | Meaning | Skill rule |
|---|---|---|
| **READ-ONLY** | Reads Figma/local state, or writes export files without changing the Figma document. | Safe by default, **but local exports must use an explicit output path and never silently overwrite.** |
| **MUTATING** | Changes the Figma document or local app/config/plugin state. | **Gate** (confirm intent, especially app-level patch/connect). |
| **DESTRUCTIVE** | Deletes Figma content, variables, collections, or installed/local resources. | **Confirm + explicit target + a one-line rollback** (prefer duplicating the file/page/selection first). |
| **ARBITRARY** | `eval` / `raw` / `run` can do anything. | **Treat as mutating, and review the code/command first** even when the prompt sounds exploratory. |

### The destructive set (memorize for gating)

`var delete-all`, `var delete-batch <ids>`, `delete` / `remove [node]`, `node delete <ids>`, `undo` (removes the last render), `unwrap <node>` (deletes the wrapper), `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear`, `annotate clear`. **[CONFIRMED: `iter-001.out` per-command table, source-verified]**

### Arbitrary mutation

`eval [code] [-f file]`, `run <file>` (eval-file alias), `raw <command...>`, and `fj eval` are arbitrary Figma Plugin API / figma-use execution, so **review first**. Generated agent rules explicitly say never use `eval` to create visual nodes (it bypasses positioning/guards), so use `render` / `render-batch` instead. **[CONFIRMED: `CLAUDE.md`, per-command table]**

---

## 6. GROUPED COMMAND REFERENCE

From the source-verified per-command table (`iter-001.out`, ~130 rows). Examples are **illustrative, so verify exact flags with `<bin> <group> --help`** before running. Class tags: **RO** read-only · **MUT** mutating · **DESTR** destructive.

### 6.1 Connect / daemon / setup

| Command | Class | Purpose |
|---|---|---|
| `figma-ds-cli` (first run) | MUT | First-run wizard: checks Node, patches Figma if needed, starts Figma. |
| `init` / `setup` | MUT | Interactive setup (`setup` aliases `init`). |
| `connect [--safe]` | MUT | Safe plugin mode (`--safe`, default) or yolo CDP mode (gated). |
| `unpatch` | MUT | Restores the yolo `app.asar` patch (rollback). |
| `status` | RO | Checks CDP + daemon status. |
| `diagnose` | RO | Checks system compatibility + connection. |
| `daemon status\|diagnose` | RO | Daemon health / troubleshooting. |
| `daemon start\|stop\|restart\|reconnect` | MUT | Daemon lifecycle (see Section 4). |
| `init-agent [--tool claude\|cursor\|both] [--force]` | MUT | Writes `.cursor/rules/figma-cli.mdc` and/or `AGENTS.md` **into the working repo**. It does **NOT** write `DESIGN.md`. Do not run by default. |

```bash
figma-ds-cli connect --safe          # default setup: plugin bridge, no patch
figma-ds-cli daemon status --debug   # confirm health before daemon-backed work
figma-ds-cli status                  # CDP + daemon connection check
```

> **Note:** `init-agent` is correction-flagged: it writes `AGENTS.md` and Cursor rules, **not** `DESIGN.md` (that comes from `extract` / `import --save`). It is idempotent unless `--force`. **[CONFIRMED: `src/commands/init.js`]**

### 6.2 Inspect / get / find (read-only)

| Command | Class | Purpose |
|---|---|---|
| `find <name> [-t type] [-l limit]` | RO | Finds nodes by name. |
| `get [nodeId]` | RO | Properties of node/selection. |
| `inspect <nodeId> [--json] [--spec]` | RO | Positioning / spec properties. |
| `node tree [nodeId] [-d depth]` | RO | Node tree. |
| `node bindings [nodeId]` | RO | Variable bindings on a node. |
| `canvas info` / `canvas next [-g gap] [-d right\|below]` | RO | Canvas bounds / next free position. |
| `files` | RO | Lists open Figma design files as JSON. |
| `var list` / `var find <pattern>` | RO | Lists / finds variables. |
| `collections list` (`col list`) | RO | Lists variable collections. |
| `bind list [-t COLOR\|FLOAT]` | RO | Lists variables available for binding. |
| `slot list [nodeId]` · `shadcn list` · `blocks list` · `plugins list` | RO | List the respective surfaces. |
| `config get <key>` | RO | Reads local config. |

```bash
figma-ds-cli find "Button" -t FRAME -l 20
figma-ds-cli get <nodeId>
figma-ds-cli inspect <nodeId> --json
figma-ds-cli node tree <nodeId> -d 3
```

### 6.3 Extract / import (design-system I/O)

| Command | Class | Purpose |
|---|---|---|
| `extract [output] [--sections list] [--pages list] [--selection] [--split] [--no-split]` | RO | Exports the open file to a `DESIGN.md`. |
| `spec <component> [-f file] [--check nodeId] [--tolerance px]` | RO | Reads a DESIGN.md spec; `--check` measures a built node, exits non-zero on mismatch. |
| `import <source> [-c name] [--save file] [--type tailwind\|css\|tokens\|storybook\|designmd] [--print-context]` | MUT | Imports a design system INTO Figma variables. |

- **`extract`** writes a `DESIGN.md` with **11 sections** (Identity, Structure, Color, Typography, Spacing & Layout, Depth & Motion, Components, States, Rules, Extending this system, **Machine-readable tokens**). It **auto-splits** a structure section above ~50k tokens into a `DESIGN-structure/` directory, so handle multi-file output. Section 11 is a ```json design-tokens fence (color / typography / spacing / radius / shadow / fonts / meta). **[CONFIRMED: `src/design-extract.js`, `src/design-md.js`, `docs/COMMANDS.md`]**
- **`import`** accepts `DESIGN.md`, `tailwind.config.{js,cjs,ts}`, CSS (`globals.css` / `styles.css`), W3C / Style-Dictionary `tokens.json`, a Storybook URL, or `./storybook-static/`. A Storybook import yields component names/variants only (**no variables**), so combine with a Tailwind/CSS import for tokens. **[CONFIRMED: `docs/COMMANDS.md`, `src/commands/setup.js`]**

```bash
figma-ds-cli extract design-system.md           # RO; explicit output path, no overwrite
figma-ds-cli extract ds.md --pages "Home,Auth" --split
figma-ds-cli import ./tailwind.config.js -c brand --type tailwind   # MUT
figma-ds-cli import design-system.md --type designmd -c brand
```

> **No-overwrite rule:** `extract` (and every `export*`) writes local files, so always pass an explicit output path and never silently overwrite an existing file.

### 6.4 Render / create (mutating)

| Command | Class | Purpose |
|---|---|---|
| `render <jsx> [--parent id] [-x] [-y] [--fast] [--as-component] [--keep-wrapper] [-c collection] [--verify]` | MUT | Renders JSX to Figma. |
| `render-batch <jsxArray> [-g gap] [-d row\|col] [--as-component] [-c collection] [--verify]` | MUT | Renders multiple frames. |
| `create frame <name> [-w] [-h] [-x] [-y] [--fill] [--radius] [--smart] [-g]` | MUT | Creates a frame. |
| `create icon <name> [-s size] [-c color] [...]` | MUT | Creates an Iconify/Lucide-style SVG icon. |
| `create image <url> [-w] [-h] [...]` | MUT | Creates an image node from a URL. |
| top-level aliases: `rect\|rectangle`, `ellipse\|circle`, `text`, `line`, `component`, `group`, `autolayout\|al` | MUT | Convenience primitives (source-verified). |
| layout: `sizing`, `padding\|pad`, `gap`, `align`, `set autolayout\|al`, `set pin`, `arrange`, `unstack [--dry-run]` | MUT | Auto-layout / constraints (a `--dry-run` variant is RO). |
| `set fill\|stroke\|radius\|size\|scale\|pos\|opacity\|name\|text ... [-n] [-q]` | MUT | Changes node properties. |
| `duplicate\|dup [nodeId] [--offset n]` | MUT | Duplicates a node/selection. |
| `node to-component <nodeIds...>` | MUT | Converts frames to components. |
| `sizes` · `variants from` · `combos [--dry-run]` | MUT | Generates size variants / variant sets / combinations. |
| `shadcn add [names...] [--all]` · `blocks create <id>` | MUT | Adds shadcn primitives / prebuilt blocks. |
| `screenshot-url <url>` · `recreate-url <url>` · `remove-bg [nodeId]` | MUT | URL → image / webpage recreation / background removal (network). |
| `gradient mesh <colors> [--apply-to frameId] [...]` | MUT | Creates/applies a mesh wallpaper. |

```bash
figma-ds-cli render '<Frame bg="var:card"><Text>Hello</Text></Frame>' --verify   # MUT
figma-ds-cli create frame "Card" -w 320 -h 200 --radius 12 --smart
figma-ds-cli set fill "var:primary" -n <nodeId>
```

> **Primitive drift:** `REFERENCE.md` lists some primitives as `create rect/circle/...`, while the source scan proved `create frame/icon/image` **plus** the top-level aliases above. `CLAUDE.md` also mentions `voice` / `chat` / `prop combine`, which the source scan did **not** find. Prefer verified commands and confirm with `--help` before emitting any of these. **[CONFIRMED-as-uncertain: `REFERENCE.md` vs source scan]**

### 6.5 Tokens / variables + `var:name` binding

| Command | Class | Purpose |
|---|---|---|
| `var create <name> -c collection -t type [-v value]` | MUT | Creates one variable. |
| `var create-batch <json> -c collection` | MUT | Creates many variables. |
| `var bind-batch <json>` · `var set-batch <json>` · `var rename-batch <json>` | MUT | Batch bind / set / rename. |
| `var visualize [collection]` | MUT | Creates color swatches on canvas. |
| `var delete-all [-c collection]` | **DESTR** | Deletes all local variables/collections (or one collection's). |
| `var delete-batch <nodeIds>` | **DESTR** | Deletes multiple nodes. |
| `collections create <name>` (`col create`) | MUT | Creates a collection. |
| `tokens tailwind\|shadcn\|spacing\|radii [-c collection]` | MUT | Creates Tailwind / shadcn / spacing / radius variable sets. |
| `tokens preset <shadcn\|radix>` · `tokens ds` · `tokens components` | MUT | Adds a named preset / IDS base system / IDS base components. |
| `tokens add <name> <value> [-c collection] [-t type]` | MUT | Adds one token. |
| `tokens import <file> [-c collection] [--force-slash]` | MUT | Imports JSON tokens. |
| `tokens import-design-md <file> [-c collection] [--print-context]` | MUT | Imports DESIGN.md machine-readable tokens. |
| `tokens overlap <collections...> [--json]` | RO | Compares token names across collections. |
| `bind fill\|stroke\|radius\|gap <varName> [-n node]` · `bind padding <varName> [-n] [-s side]` | MUT | Binds a node property to a variable. |

**`var:name` binding syntax.** Token references use `var:name` in `render` / `create` / `set` (e.g. `bg="var:card"`, `color="var:foreground"`, `figma-ds-cli set fill "var:primary"`). `var:collection:name` pins a specific collection, and `render` / `render-batch` accept `--collection <name>` to pin the whole render. **[CONFIRMED: `CLAUDE.md`]**

```bash
figma-ds-cli var create primary -c brand -t COLOR -v "#3b82f6"      # MUT
figma-ds-cli set fill "var:primary" -n <nodeId>                     # bind via var:name
figma-ds-cli render '<Frame bg="var:brand:card"/>' --collection brand
figma-ds-cli var delete-all -c brand                               # DESTR: confirm + target + rollback
```

### 6.6 Export / export-jsx / export-storybook (read-only)

| Command | Class | Purpose |
|---|---|---|
| `export screenshot [-o file] [-s scale] [-f png\|jpg\|svg\|pdf]` | RO | Exports a selection/page screenshot. |
| `export node <nodeId> [-o file] [-s scale] [-f png\|svg\|pdf\|jpg]` | RO | Exports a node. |
| `export css` | RO | Exports variables as CSS. |
| `export tailwind` | RO | Exports color variables as a Tailwind config. |
| `export-jsx [nodeId] [-o file] [--pretty]` | RO | Exports a node as JSX/React. |
| `export-storybook [nodeId] [-o file]` | RO | Exports component Storybook stories. |
| `verify [nodeId] [-s scale] [--max px] [--save path] [--measure]` | RO | Returns/saves a screenshot + optional measurement JSON. |

```bash
figma-ds-cli export node <nodeId> -o ./out/card.png -s 2          # RO; explicit -o, no overwrite
figma-ds-cli export-jsx <nodeId> -o ./out/Card.tsx --pretty
figma-ds-cli export css                                            # variables → CSS
```

> Read-only, but these write files, so require an explicit `-o` path and never overwrite silently.

### 6.7 A11y (read-only)

| Command | Class | Purpose |
|---|---|---|
| `a11y contrast [nodeId] [--level AA\|AAA] [--json]` | RO | Contrast check. |
| `a11y vision [nodeId] [--type ...] [--json]` | RO | Color-blindness simulation. |
| `a11y touch [nodeId] [--min size] [--json]` | RO | Touch-target sizes. |
| `a11y text [nodeId] [--json]` | RO | Text accessibility. |
| `a11y focus [nodeId] [--json]` | RO | Reading / focus order. |
| `a11y audit [nodeId] [--level AA\|AAA] [--json]` | RO | Full accessibility audit. |

```bash
figma-ds-cli a11y audit --level AA --json
figma-ds-cli a11y contrast <nodeId> --level AAA
```

### 6.8 Lint / analyze (read-only; `lint --fix` mutates)

| Command | Class | Purpose |
|---|---|---|
| `lint [--json]` | RO | Lints the design. |
| `lint --fix [--json]` | MUT | Lints and **applies fixes**. |
| `analyze colors\|typography\|spacing\|clusters [--json]` | RO | Reports usage / patterns. |
| `analyze-url <url> [-w] [-h] [--screenshot]` | RO | Extracts webpage CSS values (`--screenshot` writes a local file). |
| `gradient extract <image> [...] [--apply-to nodeId]` | RO / MUT | Extracts a gradient (RO); mutates only with `--apply-to`. |

```bash
figma-ds-cli lint --json            # RO
figma-ds-cli analyze colors --json  # RO
figma-ds-cli lint --fix             # MUT, gate
```

### 6.9 Other groups (summary)

These groups mix classes per verb, so see [tool_surface.md](tool_surface.md) for the full per-verb tags.

- **Slots:** `slot list` (RO); `slot create\|preferred\|reset\|convert\|add` (MUT). **[CONFIRMED]**
- **Sections / grids / annotations:** `* list` (RO); `* create\|set\|add` (MUT); **`grid clear` / `annotate clear` (DESTR)**. **[CONFIRMED]**
- **Component / dev:** `component prop add\|combine` (MUT), `component prop list` (RO), **`component prop delete` (DESTR)**; `dev link\|edit` (MUT), `dev list` (RO), **`dev unlink` (DESTR)**. **[CONFIRMED]**
- **FigJam (`fj` / `figjam`):** `fj list\|info\|nodes` (RO); `fj sticky\|shape\|text\|connect\|move\|update` (MUT); `fj eval` (arbitrary MUT); **`fj delete` (DESTR)**. **[CONFIRMED]**
- **Plugins / API:** `plugins list` (RO), `plugins install\|setup` (MUT), **`plugins uninstall` (DESTR)**; `api index\|context\|list\|search\|gap\|age` (RO), `api setup` / `api index` write local docs (MUT). **[CONFIRMED]**
- **Selection / misc:** `select <nodeId>` (MUT: changes selection only); `use\|theme <collection> [--dry-run]` (MUT; `--dry-run` RO); **`unwrap <nodeId>` (DESTR)**; **`undo` (DESTR: removes the last render)**; `config set` (MUT). **[CONFIRMED]**

---

## 7. DOES figma-ds-cli SHIP ITS OWN MCP? → NO

A full read-only scan of the repo tree, `README` / `REFERENCE` / `CLAUDE.md` / `package.json`, `src/**`, and `plugin/**` for `mcp` / "model context protocol" returned **zero hits**. The bundled daemon is figma-ds-cli's own HTTP/WebSocket bridge to Figma Desktop, **not** an MCP server. **[CONFIRMED: repo + remote text scan]**

So an "MCP for Figma" means a **separate, external** MCP server, not a figma-ds-cli subcommand. In this repo that is the community **Framelink `figma-developer-mcp`** manual, already registered as the `figma` manual in Code Mode (`.utcp_config.json`, stdio, needs `figma_FIGMA_API_KEY` in `.env`; call via `call_tool_chain` with naming `figma.figma_<tool>`, discovered with `search_tools` / `tool_info` first). Full wiring is in [mcp_wiring.md](mcp_wiring.md).

> The **official Figma Dev Mode MCP is OUT OF SCOPE for this skill**, so do not document it as a supported path. It is at most a future option (e.g. via an `mcp-remote` stdio bridge), not part of this skill's contract.

---

## 8. UNCERTAIN / NEEDS LIVE VERIFICATION

Carry these forward and close them with a live, non-mutating `--help` / `--version` before relying on them. figma-ds-cli was **not executed** during research.

1. **Published-npm `figma-cli` binary behavior.** npm latest is `1.0.0` (only `figma-ds-cli` bin); repo `main` is `1.2.0` (both bins) and unpublished. Whether a `figma-cli` command exists after install depends entirely on the install source, so verify the binary on PATH and confirm silships, not unic. **[CONFIRMED gap]**
2. **`voice` / `chat` / `prop combine` commands.** `CLAUDE.md` references them, but the source command-registration scan did **not** find them. Likely docs ahead of registered CLI, so verify with `--help` before emitting. **[CONFIRMED gap]**
3. **Primitive command spelling** (`create rect/circle/...` in REFERENCE vs the `create frame/icon/image` + top-level `rect|ellipse|text|line|component|group|autolayout` aliases in source). Prefer source-verified forms; confirm with `--help`. **[CONFIRMED gap]**
4. **Windows / Linux runtime.** Source has platform helpers, but macOS is the only documented/supported baseline; non-macOS was not run. **[CONFIRMED gap]**
5. **Idle-timeout discrepancy** (60-minute code value vs a 10-minute comment). The code value is taken as truth, unconfirmed live. **[INFERRED]**
6. **Exact command examples.** Every `figma-ds-cli …` example here is illustrative and unrun, so confirm flags with `<bin> <group> --help` before use. **[CONFIRMED gap]**

---

## 9. REFERENCES

- [tool_surface.md](tool_surface.md) - the full read-only / mutating / destructive command taxonomy, the destructive set, the `eval/raw/run` rule, and the export no-overwrite rule.
- [mcp_wiring.md](mcp_wiring.md) - the optional Figma MCP (Framelink `figma`) via Code Mode: the registered manual, the `.env` token, discovery, and a `call_tool_chain` example.
- [troubleshooting.md](troubleshooting.md) - failure modes and fixes (binary collision, Desktop not running, daemon Unauthorized, port conflicts).
- [INSTALL_GUIDE.md](../INSTALL_GUIDE.md) - install steps and binary verification.
- [SKILL.md](../SKILL.md) - the skill contract this reference supports.
- Upstream: [silships/figma-cli](https://github.com/silships/figma-cli) (npm `figma-ds-cli`, MIT). This skill documents driving the installed tool from the terminal, and it does not vendor or redistribute it.
