---
name: mcp-figma
description: "Figma CLI orchestrator: drives figma-ds-cli for terminal Figma design work, with an optional Figma MCP via Code Mode."
compatibility: Requires Figma Desktop (open with a file), Node.js >=18, and the silships figma-ds-cli on PATH. macOS is the supported baseline; the optional Figma MCP uses this project's Code Mode.
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.1.10.0
user-invocable: true
---

<!-- Keywords: figma, figma cli, figma-cli, figma-ds-cli, figma desktop, render in figma, figma tokens, figma variables, figma components, render jsx in figma, export from figma, extract design.md, figma design system, connect to figma, figma daemon, figma mcp, figma-developer-mcp, figma code mode -->

# Figma (mcp-figma)

Drive **Figma Desktop from the terminal** through the silships **figma-cli**, published as `figma-ds-cli`. A coding agent can read, author, modify and export designs, tokens and components through the CLI. It can also **optionally** pull design context out of Figma through a Figma **MCP via Code Mode**.
The CLI is the primary surface. The MCP is opt-in. Deep operational detail lives in [`references/figma-cli-reference.md`](references/figma-cli-reference.md).

> **Naming trap (read first).** The silships tool publishes to npm as **`figma-ds-cli`**, the unambiguous binary.
> The npm package literally named **`figma-cli` is an UNRELATED tool** (unic/figma-cli, bin `figma`). Never run `npm i -g figma-cli`.
> The `figma-cli` command exists only when installed from the silships repo's `main` branch. That branch exposes both `figma-ds-cli` and `figma-cli`. This skill uses **`figma-ds-cli`** as the canonical command throughout.
>
> **Version trap.** npm publishes only **`figma-ds-cli@1.0.0`**, a minimal build with **no `--safe`, no `daemon`, no `extract`** and ~12 commands.
> The full surface this skill documents includes safe connect, daemon, extract/import and ~130 commands. That surface is **1.2.0**, available only from the silships repo.
> Install through `scripts/install.sh` with `--source repo` or `--source auto`. The latter upgrades when npm is stale. Then confirm `figma-ds-cli --version` is `>= 1.2.0`.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:
- Drive Figma Desktop from the terminal: create/render frames, components, icons, layouts, or images.
- Work a design system in Figma: tokens, variables, collections, `var:name` binding, shadcn primitives.
- Inspect or export from Figma: `extract` to DESIGN.md, export PNG/SVG/JSX/CSS/Tailwind/Storybook, screenshots, a11y audits.
- Import a design system INTO Figma: from Tailwind config, CSS variables, `tokens.json`, or Storybook.
- Set up or troubleshoot the figma-cli connection or daemon (safe plugin vs yolo patch, daemon health).
- Optionally pull design context FROM Figma into the agent via a Figma MCP (Framelink `figma`) through Code Mode.

**Keyword Triggers**: "figma cli", "figma-ds-cli", "figma desktop", "render in figma", "figma tokens/variables", "extract DESIGN.md", "export from figma", "connect to figma", "figma daemon", "figma mcp".

### Use Cases

**Connect / setup (CLI).** Verify the binary, choose a connect mode (safe plugin vs yolo patch), bring up the daemon, confirm health.

**Inspect / export (CLI, read-only).** List/find nodes, get properties, `extract` a DESIGN.md, export assets/CSS/Tailwind/JSX/Storybook, run a11y audits, none of which change the Figma document.

**Author / modify (CLI, gated).** You can render JSX, create frames/components/icons, set properties, bind variables and generate variants.
Every operation changes the document, is gated and is design-affecting. Before authoring, pair with `sk-design-md-generator` for a measured Style Reference (extracted design tokens).
This transport moves and renders designs. It does not produce the measured reference itself.

**Design-system / tokens (CLI, gated).** Create token collections, import from Tailwind/CSS/tokens/Storybook, bind `var:name`. Ground token and variable choices in a measured reference: the `sk-design-md-generator` pairing (a measured Style Reference of extracted design tokens) applies before any token authoring, same as author/modify.

**Optional MCP context pull (Code Mode).** When the agent needs Figma design context as model input (design data, variables, screenshots), call the Framelink `figma` manual through Code Mode.

### When NOT to Use

**Skip this skill when:**
- The work is generic app coding with no Figma input: use `sk-code`.
- The work is extracting a measured Style Reference (design tokens) from a live website's real CSS. That is `sk-design-md-generator`, and this skill is the Figma transport.
- The task is browser debugging or visual preview of a built page. That is `mcp-chrome-devtools`.
- Figma Desktop is not installed or not open. The CLI drives the live Desktop session and cannot work without it.

---

## 2. SMART ROUTING

The `mcp-tooling` hub routes a Figma request here: the request names `figma`, `figma-ds-cli` or Figma Desktop with design work, and the hub's `mcp-figma` mode signal selects this packet.

The direction splits in two: the terminal CLI answers every create, inspect, export, token and connect task, and the optional Figma MCP through Code Mode is opt-in and only for pulling context out of Figma.

`references/figma-cli-reference.md` and `references/mcp-wiring.md` are the first leaves the hub `ROUTER.md` names for this mode, and `references/figma-cli-reference.md` is the baseline every scored route loads.

Both connect traps bind before any command: the canonical binary is `figma-ds-cli`, never the unrelated npm `figma-cli`, and npm publishes only a minimal 1.0.0 build, so the surface this packet documents comes from `scripts/install.sh`.

Every mutating or destructive command is gated, and `sk-design-md-generator` supplies the measured Style Reference first.

Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### First Step (Always): verify the binary + Figma Desktop

```bash
# Canonical binary = figma-ds-cli. The npm package 'figma-cli' is an UNRELATED tool (unic/figma-cli).
BIN=""
command -v figma-ds-cli >/dev/null && BIN="figma-ds-cli"
[ -z "$BIN" ] && command -v figma-cli >/dev/null && BIN="figma-cli"   # only if installed from silships repo
[ -z "$BIN" ] && { echo "figma-ds-cli not found, see INSTALL-GUIDE.md (do NOT 'npm i -g figma-cli')"; exit 1; }
"$BIN" --version; "$BIN" --help | head -1
```

Figma Desktop must be **open with a file**, since figma-cli drives the live Desktop session (no Figma API key). Node `>=18`. macOS is the supported baseline.

### Connect modes + daemon

- **Safe (default): `figma-ds-cli connect --safe`** runs the FigCli plugin bridge, with **no patch**. Import `plugin/manifest.json` once, then keep `Plugins → Development → FigCli` open each session.
- **Yolo (gated): `figma-ds-cli connect`** patches Figma Desktop `app.asar`, codesigns on macOS, restarts Figma with CDP on port `9222`. May need Full Disk Access/admin and **breaks when Figma updates**. **Never run without explicit consent + a stated rollback** (`figma-ds-cli unpatch`).
- **Daemon**: local HTTP server on `127.0.0.1:3456` (not a socket), auth via `X-Daemon-Token` at `~/.figma-ds-cli/.daemon-token`, PID `~/.figma-cli-daemon.pid`, idle ~60 min, not reboot-persistent. Verbs: `daemon status | diagnose | start | stop | restart | reconnect`. "Unauthorized" → `daemon diagnose` then `daemon restart` (never auto-delete the token).

### Command classes (gating)

The full per-command taxonomy lives in [`references/tool-surface.md`](references/tool-surface.md). Summary:
- **READ-ONLY** (safe default): `status`, `var list/find`, `get`, `find`, `inspect`, `node tree`, `extract`, `export*`, `export-jsx`, `export-storybook`, `analyze*`, `a11y*`, `files`, `--dry-run` variants. (Local exports still write files, so require an explicit output path, never silently overwrite.)
- **MUTATING (gate):** This class includes all `create*`/`render*`/`tokens *`/`var create|bind|set|rename|visualize`, `bind *`, `set *`, layout verbs, `duplicate`, `use/theme`, `node to-component`, `slot/sizes/variants/combos`, `shadcn add`, `import`, `lint --fix`, `screenshot-url`, `recreate-url` and `gradient mesh`.
  - App-level commands are `connect`, `unpatch`, `daemon start/stop/restart`, `config set` and `init-agent`.
  - Design-affecting MUTATING verbs cover authoring, tokens, binding and variants. All MUTATING verbs except app-level connection, daemon and config verbs require the `sk-design-md-generator` pairing precondition. A measured Style Reference (extracted design tokens) grounds them before you execute them here.
- **DESTRUCTIVE** (confirm + explicit target + rollback): `var delete-all`, `var delete-batch`, `delete/remove`, `node delete`, `undo`, `unwrap`, `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear`, `annotate clear`.
- **ARBITRARY** (treat as mutating, review first): `eval`, `raw`, `run`.

### Optional Figma MCP via Code Mode (opt-in)

The skill works **fully with the CLI alone**.
When you need to pull design context FROM Figma, use the **Framelink `figma` manual already registered in Code Mode** (`figma-developer-mcp`, stdio, needs a Figma personal token).
Calls go through `call_tool_chain()` with the name `figma.figma_<tool>`. Store the token in `.env` as `figma_FIGMA_API_KEY`; Code Mode prefixes the manual name.
Before invoking a tool, discover it with `search_tools()` or `tool_info()`. Find the full details and snippet in [`references/mcp-wiring.md`](references/mcp-wiring.md).

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS verify the binary first.** Prefer `figma-ds-cli`, and only use `figma-cli` if it resolves to the silships tool (`--version`/`--help`), since the npm `figma-cli` package is unrelated. Fail closed with install guidance if neither is the silships tool.
2. **ALWAYS require Figma Desktop open with a file** before any CLI or desktop operation, since the CLI drives the live session.
3. **ALWAYS confirm daemon health** before daemon-backed commands (`daemon status`/`diagnose`; endpoint `127.0.0.1:3456`, token present).
4. **ALWAYS prefer `connect --safe`** for setup, and treat the yolo patch as a gated, consented action.
5. **ALWAYS gate every DESTRUCTIVE verb** behind explicit user confirmation, an explicit target node/file, a command preview, and a one-line rollback (prefer duplicating the file/page/selection first).
6. **ALWAYS treat `eval`, `raw`, and `run` as arbitrary mutation**, reviewing the code/command before running, even when the prompt sounds exploratory.
7. **ALWAYS require an explicit output path for local exports** (`extract`/`export`/`export-jsx`) and never silently overwrite existing files.
8. **ALWAYS pair with `sk-design-md-generator` BEFORE any design-affecting operation.** Pair in both directions.
   - Pair when a Figma read/export feeds a design decision.
   - Pair before every design-affecting authoring path: render, create frames/components/icons, bind variables, generate variants and token/variable work.
   The mandatory cross-hub pairing (hub ADR-002, `crossHubPairing`) makes a measured Style Reference (extracted design tokens) the precondition, not an afterthought. This skill owns the transport. The companion skill produces the measured reference.

### ⛔ NEVER

1. **NEVER `npm i -g figma-cli`**, because that installs the unrelated unic/figma-cli. Install `figma-ds-cli` (npm) or the silships repo.
2. **NEVER auto-apply the yolo `app.asar` patch** without explicit consent and a stated `figma-ds-cli unpatch` rollback. Never patch during install or routine startup.
3. **NEVER run a destructive verb via the active-selection fallback**, and require an explicit target id/name.
4. **NEVER expose or paste the daemon token** (`~/.figma-ds-cli/.daemon-token`) in user-facing output, and keep all local services bound to `127.0.0.1`.
5. **NEVER run or recommend `init-agent` by default**, because it writes `AGENTS.md`/`.cursor/rules` into the working repo.
6. **NEVER claim the optional Figma MCP works** until Code Mode discovery (`list_tools()`/`tool_info()`) confirms the `figma` manual and its tool names.

### ⚠️ ESCALATE IF

1. **ESCALATE IF the binary is missing or ambiguous**, asking whether to install `figma-ds-cli` (npm) or the silships repo build. Do not guess.
2. **ESCALATE IF Figma Desktop is not running** or daemon diagnosis fails after a reconnect.
3. **ESCALATE IF a yolo patch, a destructive verb, a broad delete/undo/unwrap, or an arbitrary `eval/raw/run` is requested**, describing the effect + rollback, then wait for confirmation.
4. **ESCALATE IF the optional Figma MCP is requested but no Figma token / Code Mode manual is configured**, surfacing the `.env` (`figma_FIGMA_API_KEY`) requirement. Do not paste credentials.
5. **ESCALATE IF CLI and MCP results disagree** about a file/node/variable state, and ask which source prevails before mutating.

---

## 5. SUCCESS CRITERIA

**Connect complete when:**
- ✅ The binary was verified (`figma-ds-cli` or confirmed-silships `figma-cli`), Figma Desktop is open, the chosen connect mode ran, and `daemon status` is healthy.

**Read / export complete when:**
- ✅ The requested data/asset was captured to an explicit path with no overwrite, and no mutating or destructive command ran.

**Author / modify complete when:**
- ✅ The `sk-design-md-generator` pairing supplied a measured Style Reference (extracted design tokens) first (grounding what to render/bind/tokenize); the user confirmed the target and intent; mutating commands ran; destructive verbs had an explicit target + rollback; the result was verified (e.g. `get`/`verify`).

**Optional MCP context complete when:**
- ✅ Code Mode discovery confirmed the `figma` manual + tool names, the token was configured, and the context was pulled without claiming unverified tools.

**Always:**
- ✅ Figma Desktop was confirmed running; no yolo patch or destructive verb ran unconfirmed; the daemon token was never exposed.

---

## 6. INTEGRATION POINTS

### Tool Usage Guidelines

- **Bash** owns all `figma-ds-cli` operations (connect, daemon, inspect, export, author, tokens).
- **Code Mode** (`mcp__code_mode__call_tool_chain`) owns the optional Figma MCP calls (Framelink `figma`).
- **Read/Grep/Glob** load references and inspect CLI output / exported files.

### Cross-Workflow Contracts

- **`sk-design-md-generator`** produces a measured Style Reference (extracted design tokens) as a mandatory cross-hub pairing (hub ADR-002).
  - Apply it whenever a Figma read/export feeds a design decision, including grounding and token, type or layout choices.
  - Use it as a precondition before every design-affecting authoring path: render/create, variable binding, variants and token collections.
  This skill is the transport. The companion skill produces the measured reference.
- **`sk-code`** owns adapting extracted tokens / DESIGN.md / exported code into a real application, and verifying it.
- **`mcp-chrome-devtools`** is used only for a last-mile browser preview of an implemented page, never to operate Figma.

### External Tools

- **figma-ds-cli** (silships, MIT): install from npm (`figma-ds-cli`) or the silships repo, and see [INSTALL-GUIDE.md](INSTALL-GUIDE.md). Requires **Figma Desktop** open. Not vendored into this repo.
- **Figma MCP (optional)**: the Framelink `figma-developer-mcp` manual already in this project's Code Mode `.utcp_config.json`, which needs `figma_FIGMA_API_KEY` in `.env`.

### Knowledge Base Dependencies

**Required**: `references/figma-cli-reference.md` (binary/daemon/connect baseline). **Conditional**: `tool-surface.md` (gating), `mcp-wiring.md` (MCP), `troubleshooting.md` (errors).

---

## 7. REFERENCES AND RELATED RESOURCES

### Core References

- [figma-cli-reference.md](references/figma-cli-reference.md) - Binary identity + verification, Node/macOS baseline, Figma Desktop requirement, connect modes, daemon model, and command examples.
- [tool-surface.md](references/tool-surface.md) - The read-only / mutating / destructive command taxonomy, the destructive set, the `eval/raw/run` rule, and the export no-overwrite rule.
- [mcp-wiring.md](references/mcp-wiring.md) - The optional Figma MCP (Framelink `figma`) via Code Mode: the registered manual, the `.env` token, discovery, and a `call_tool_chain` example.
- [troubleshooting.md](references/troubleshooting.md) - Failure modes and fixes (binary collision, Desktop not running, daemon Unauthorized, port conflicts, Code Mode env-var prefix).

### Templates and Assets

- [utcp-figma-manual.md](assets/utcp-figma-manual.md) - Paste-ready Framelink `figma` `.utcp_config.json` manual entry, the `.env` note, and a `call_tool_chain` example for the optional Code Mode path.
- [env-template.md](assets/env-template.md) - The single prefixed `figma_FIGMA_API_KEY` `.env` line for the optional Figma MCP token.

### Reference Loading Notes

- References are the primary loaded resources. `figma-cli-reference.md` is the baseline (always). Load `tool-surface.md` for author/modify/token work, `mcp-wiring.md` only for MCP intent, `troubleshooting.md` for setup/errors.
- Load the `assets/` snippets only for MCP_CONTEXT intent, alongside `mcp-wiring.md`.
- Keep [`ROUTER.md`](./ROUTER.md) as the single routing authority.

### Related Resources

The router (in [`ROUTER.md`](./ROUTER.md)) discovers reference and asset docs dynamically. Start from `references/figma-cli-reference.md` for the CLI/daemon/connect model, load `references/tool-surface.md` for the gating taxonomy, `references/mcp-wiring.md` for the optional Code Mode path, and `references/troubleshooting.md` for failures. References stay the primary loaded resources.

Assets: `assets/utcp-figma-manual.md` (paste-ready Framelink `figma` `.utcp_config.json` manual + `.env` note) and `assets/env-template.md` (the prefixed `figma_FIGMA_API_KEY` line), loaded only for the optional MCP_CONTEXT path.

Scripts: `scripts/install.sh` (install + verify), `scripts/doctor.sh` (report-only diagnostics), `scripts/connect-safe.sh`, `scripts/connect-yolo.sh`, `scripts/daemon.sh`, `scripts/unpatch.sh`, `scripts/print-utcp-snippets.sh`.

Examples: [`examples/README.md`](examples/README.md) - safe worked walkthroughs mirroring the playbook scenarios (safe connect + daemon health, read-only inspect/export, optional MCP context pull). They live outside the `references/`/`assets/` discovery roots, so they are linked here rather than auto-loaded by the router.

Related skills: `sk-design-md-generator` (a measured Style Reference of extracted design tokens, applied whenever a read/export feeds a decision), `sk-code` (adapting exports into an app), `mcp-code-mode` (the optional MCP transport), `mcp-chrome-devtools` (browser preview only), and `system-spec-kit` when packet documentation or memory continuity applies.

Install guide: [INSTALL-GUIDE.md](INSTALL-GUIDE.md).

Upstream: figma-cli is [silships/figma-cli](https://github.com/silships/figma-cli) (npm `figma-ds-cli`, MIT). The optional MCP is the community Framelink `figma-developer-mcp`. This skill documents driving the installed tool from the terminal, and it does not vendor or redistribute it.
