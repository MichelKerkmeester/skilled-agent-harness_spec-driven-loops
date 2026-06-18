# Iteration 001 — figma-cli capabilities

- **Wave:** 1 (of 3)
- **Executor:** `openai/gpt-5.5-fast --variant high` via cli-opencode (read-only seat, exit 0)
- **Seat id:** bx81nkrdl
- **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-001.txt`
- **Raw output (FULL per-command table lives here):** `../raw/iter-001.out`
- **Confidence (seat self-report):** high (verified from raw source + package metadata)

> Orchestrator note: seat scanned the repo's actual source (`src/commands/*.js`, `src/daemon.js`, `src/figma-patch.js`, `src/design-md.js`, `src/design-extract.js`, `docs/`) — not just READMEs. This is high-fidelity. The exhaustive ~130-row command-surface table is preserved verbatim in `../raw/iter-001.out`; this file digests the decision-relevant facts (install, connection/daemon, the gating-critical destructive set, design I/O, no-MCP).

---

## Install & prerequisites (KEY GOTCHA)
- **Package = `figma-ds-cli`**, repo `main` v1.2.0, `bin` exposes **both** `figma-ds-cli` and `figma-cli` → `src/index.js`.
- **⚠️ npm-vs-repo mismatch:** npm registry `latest` = **1.0.0**, whose `bin` exposes **only `figma-ds-cli`** (not `figma-cli`). So `npm i -g figma-ds-cli` from npm may NOT give a `figma-cli` command. **The skill must verify the actual binary on PATH** (`command -v figma-cli || command -v figma-ds-cli`) and prefer repo/current install, not assume `figma-cli`.
- Node **>=18** (CI: 18/20/22). **macOS is the documented baseline** (Windows/Linux helpers exist in source but docs frame them as "coming").
- Requires **Figma Desktop open with a file**; **no Figma API key** (uses the local Desktop session). Free Figma account works.

## Connection modes + daemon lifecycle
- **Yolo (default): `figma-cli connect`** — patches Figma Desktop `app.asar` (replaces `removeSwitch("remote-debugging-port")` → `removeSwitch("remote-debugXing-port")`), `codesign --force --deep --sign -` on macOS, restarts Figma with remote debugging, CDP on **fixed port 9222**, then starts the daemon.
- **Safe: `figma-cli connect --safe`** — plugin mode, **no patch**; import `plugin/manifest.json` once, then open `Plugins → Development → FigCli` each session (must stay open).
- **Revert: `figma-cli unpatch`** — restores the original `app.asar` string.
- **Daemon = HTTP server on `127.0.0.1`, default port `3456`** (NOT a Unix socket). Endpoints `/health`, `/exec`, `/reconnect`, WebSocket `/plugin` (safe-mode bridge). Auth via **`X-Daemon-Token`** header; token at `~/.figma-ds-cli/.daemon-token`; host-locked to localhost; PID at `~/.figma-cli-daemon.pid`; idle timeout 60 min; not reboot-persistent.
- **Daemon verbs:** `daemon status [--debug] | diagnose | start [--force] | stop | restart | reconnect`.

## Gating-critical command classification (for the skill's RULES)
Tags: READ-ONLY (reads / writes export files, no doc change) · MUTATING (changes the Figma doc or local app/config) · DESTRUCTIVE (deletes content/resources).

**DESTRUCTIVE (must gate behind explicit confirm + target + rollback):**
`var delete-all`, `var delete-batch <ids>`, `delete|remove [node]`, `node delete <ids>`, `undo` (removes last render), `unwrap <node>` (deletes wrapper), `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear`, `annotate clear`.

**MUTATING (changes Figma doc / app state — confirm for app-level):**
App-level patch/connect: `figma-cli` (first-run), `init/setup`, `connect [--safe]`, `unpatch`, `daemon start|stop|restart|reconnect`, `init-agent`, `config set`, `plugins install`, `api setup/index`.
Doc-level: all `create*`/`render*`/`tokens *`/`var create*|bind*|set*|rename*|visualize`, `bind *`, `sizing/padding/gap/align/set *`, `arrange/unstack`, `duplicate`, `use/theme`, `node to-component`, `slot *` (writes), `sizes/variants/combos`, `shadcn add`, `blocks create`, `section/grid/annotate` (writes), `screenshot-url`, `recreate-url`, `remove-bg`, `gradient mesh`/`gradient extract --apply-to`, `fj` writes, `eval`/`run`/`raw` (treat as MUTATING — can do anything), `lint --fix`.

**READ-ONLY (safe default):**
`status`, `diagnose`, `daemon status|diagnose`, `var list|find`, `collections list`, `bind list`, `tokens overlap`, `extract`, `spec`, `canvas info|next`, `find`, `get`, `inspect`, `node tree|bindings`, `slot list`, `shadcn list`, `blocks list`, `files`, `plugins list`, `config get`, `export *` (screenshot/node/css/tailwind), `export-jsx`, `export-storybook`, `verify`, `analyze *`, `a11y *`, `analyze-url`, `gradient extract` (no `--apply-to`), `fj list|info|nodes`, `api index|context|list|search|gap|age`, plus `--dry-run` variants of arrange/unstack/use/combos.

> Full per-command flag table: `../raw/iter-001.out` (≈130 rows).

## init-agent + generated files
- `figma-cli init-agent [--tool claude|cursor|both] [--force]` writes `.cursor/rules/figma-cli.mdc` (Cursor) and **`AGENTS.md`** (read by Claude Code / Cursor / Codex). Idempotent unless `--force`.
- **Correction:** `init-agent` does **NOT** write `DESIGN.md` (my earlier assumption was wrong). `DESIGN.md` is produced by `extract` or `import --save`.

## Design-system I/O
- **Export:** `figma-cli extract [output]` → `DESIGN.md` (11 sections: Identity, Structure, Color, Typography, Spacing & Layout, Depth & Motion, Components, States, Rules, Extending, **Machine-readable tokens**). Auto-splits structure >~50k tokens into `DESIGN-structure/` (skill must handle multi-file output). Flags: `--pages --sections --selection --split/--no-split`.
- **Machine-readable block:** `## 11. Machine-readable tokens` with a ```json design-tokens fence (color/typography/spacing/radius/shadow/fonts/meta).
- **Import:** `figma-cli import <source>` accepts DESIGN.md, `tailwind.config.{js,cjs,ts}`, CSS (`globals.css`/`styles.css`), W3C/Style-Dictionary `tokens.json`, Storybook URL, `./storybook-static/`. Options `-c/--collection --save --type <tailwind|css|tokens|storybook|designmd> --print-context`. Storybook import = component names/variants only (no variables).
- **Token binding:** `var:name` in `render`/`create`/`set` (e.g. `bg="var:card"`, `figma-cli set fill "var:primary"`); `var:collection:name` pins a collection; `render --collection <name>`.

## Does figma-cli ship/spawn its own MCP?  → NO (definitive)
Scanned repo tree, README/REFERENCE/CLAUDE/package.json, `src/**`, `plugin/**` for `mcp` / "model context protocol" — **zero hits**. The bundled daemon is figma-cli's own HTTP/WebSocket bridge, not an MCP server. **Therefore "install the MCP inside it" must mean the separate official Figma MCP server** (or another external MCP), NOT a figma-cli-owned MCP. (Confirms IT2's framing.)

## Auth / offline
No Figma API key (Desktop session + Plugin API). Local-LLM friendly (LM Studio/Ollama), "fully offline/no cloud". Exceptions that need network/keys: `remove-bg` (remove.bg key), Iconify/image/URL/Storybook commands.

## Gotchas / risks / platform
- **npm-vs-repo binary mismatch** (above) — the #1 install trap.
- **macOS baseline**; Yolo patch may need Full Disk Access/admin and **breaks when Figma updates** (re-`connect`); `unpatch` to revert.
- **Safe-mode friction** (manifest import + keep plugin open).
- **Doc drift:** `CLAUDE.md` mentions `voice`/`chat`/`prop combine` not found in source scan — verify with `--help` before emitting.
- **Primitive command drift:** REFERENCE shows `create rect/circle/...`; source proves `create frame/icon/image` + top-level aliases `rect|ellipse|text|line|component|group|autolayout` — prefer verified commands or test `--help`.
- **`eval` danger:** agent rules say never use `eval` for visual nodes (bypasses positioning); use `render`/`render-batch`.
- **Deletion guard:** generated rules say never delete existing user nodes.
- Daemon token mismatch → "Unauthorized"; remedy `daemon diagnose` then `daemon restart`.

## Confidence + unknowns
High for repo-`main` behavior (source-verified). Unknowns: exact published-npm install behavior for the `figma-cli` binary (registry latest 1.0.0 ≠ repo 1.2.0; no install/exec performed — read-only); Windows/Linux runtime; `voice`/`chat` reality. Official Figma MCP details were out of scope here (covered by IT2).
