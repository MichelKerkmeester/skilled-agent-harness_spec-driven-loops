---
name: mcp-figma
description: "Figma CLI orchestrator: drives figma-ds-cli for terminal Figma design work, with an optional Figma MCP via Code Mode."
compatibility: Requires Figma Desktop (open with a file), Node.js >=18, and the silships figma-ds-cli on PATH. macOS is the supported baseline; the optional Figma MCP uses this project's Code Mode.
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.0.0.0
user-invocable: true
---

<!-- Keywords: figma, figma-cli, figma-ds-cli, figma-desktop, design-tokens, variables, components, render-jsx, figma-export, design-system, figma-daemon, figma-mcp, figma-developer-mcp, code-mode -->

# Figma (mcp-figma)

Drive **Figma Desktop from the terminal** through the silships **figma-cli** (published as `figma-ds-cli`) so a coding agent can read, author, modify, and export designs, tokens, and components, and **optionally** pull design context out of Figma through a Figma **MCP via Code Mode**. The CLI is the primary surface. The MCP is opt-in. Deep operational detail lives in [`references/figma_cli_reference.md`](references/figma_cli_reference.md).

> **Naming trap (read first).** The silships tool publishes to npm as **`figma-ds-cli`** (the unambiguous binary). The npm package literally named **`figma-cli` is an UNRELATED tool** (unic/figma-cli, bin `figma`), so **never `npm i -g figma-cli`**. The `figma-cli` command only exists when installed from the silships repo (`main`, exposes both `figma-ds-cli` and `figma-cli`). This skill uses **`figma-ds-cli`** as the canonical command throughout.
>
> **Version trap.** npm publishes only **`figma-ds-cli@1.0.0`**, a minimal build with **no `--safe`, no `daemon`, no `extract`** and ~12 commands. The full surface this skill documents (safe connect, daemon, extract/import, ~130 commands) is **1.2.0, available only from the silships repo**. Install via `scripts/install.sh` (`--source repo`, or `--source auto` which upgrades when npm is stale), then confirm `figma-ds-cli --version` is `>= 1.2.0`.

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

**Author / modify (CLI, gated).** Render JSX, create frames/components/icons, set properties, bind variables, generate variants. Every one changes the document and is gated.

**Design-system / tokens (CLI, gated).** Create token collections, import from Tailwind/CSS/tokens/Storybook, bind `var:name`.

**Optional MCP context pull (Code Mode).** When the agent needs Figma design context as model input (design data, variables, screenshots), call the Framelink `figma` manual through Code Mode.

### When NOT to Use

**Skip this skill when:**
- The work is generic app coding with no Figma input: use `sk-code`.
- The work is the design judgment itself (palette, type, the anti-default critique). That is `sk-design`, and this skill is the transport.
- The task is browser debugging or visual preview of a built page. That is `mcp-chrome-devtools`.
- The task targets Open Design specifically: use `mcp-open-design`.
- Figma Desktop is not installed or not open. The CLI drives the live Desktop session and cannot work without it.

---

## 2. SMART ROUTING

### Primary Detection Signal

Detect the workflow **direction** first. Almost everything is the CLI, and the optional Figma MCP is opt-in and only when the agent must pull context FROM Figma.

```bash
# Direction detection (pseudo)
echo "$REQUEST" | grep -qiE 'mcp|code mode|design context|pull .*figma|get_design_context|figma-developer-mcp' && DIR="OPTIONAL_MCP"
# default for create/modify/export/tokens/connect/inspect:
: "${DIR:=CLI}"

# Binary detection (canonical = figma-ds-cli; figma-cli is ambiguous with an unrelated npm package)
command -v figma-ds-cli >/dev/null && BIN="figma-ds-cli"
[ -z "${BIN:-}" ] && command -v figma-cli >/dev/null && BIN="figma-cli"   # verify it's silships, not unic/figma-cli
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify the binary on PATH (figma-ds-cli, else silships figma-cli) + Figma Desktop open
    +- STEP 1: Score intent -> CREATE_RENDER | DESIGN_SYSTEM_TOKENS | INSPECT_EXPORT | CONNECT_SETUP_DAEMON | MCP_CONTEXT | TROUBLESHOOT
    +- Phase 1: Connect / daemon (safe default; yolo only on consent)            [CONNECT_SETUP_DAEMON]
    +- Phase 2: Inspect / export (read-only; explicit output paths, no overwrite) [INSPECT_EXPORT]
    +- Phase 3: Author / modify / tokens (MUTATING -> gate; DESTRUCTIVE -> confirm+target+rollback) [CREATE_RENDER / DESIGN_SYSTEM_TOKENS]
    +- Phase 4: Optional MCP context pull via Code Mode (Framelink figma)         [MCP_CONTEXT]
    +- Phase 5: Verify (daemon healthy, output captured, no unconfirmed mutation)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring. References are the primary loaded resources. Assets are paste-ready snippets for the optional MCP path.

```text
references/figma_cli_reference.md   # CLI/daemon/connect model + command examples
references/tool_surface.md          # read-only / mutating / destructive taxonomy + gating
references/mcp_wiring.md            # optional Figma MCP (Framelink) via Code Mode
references/troubleshooting.md       # failure modes + fixes
assets/utcp_figma_manual.md         # paste-ready Framelink figma .utcp_config.json manual + .env note
assets/env_template.md              # the prefixed figma_FIGMA_API_KEY .env line
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| ALWAYS | Every invocation | `references/figma_cli_reference.md` (binary/daemon/connect baseline) |
| CONDITIONAL | Author/modify/tokens intent | `references/tool_surface.md` (gating taxonomy) |
| CONDITIONAL | MCP_CONTEXT intent | `references/mcp_wiring.md` (Code Mode Framelink path) |
| CONDITIONAL | Setup / error intent | `references/troubleshooting.md` |
| ALWAYS (design work) | A read/export feeds a design decision | `sk-design` principles, applied before deciding |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../sk-doc/assets/skill/skill_smart_router.md). Guard paths, discover at runtime, score intents, fall back when unsure.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/figma_cli_reference.md"

INTENT_MODEL = {
    "CREATE_RENDER":        {"keywords": [("create", 3), ("render", 4), ("frame", 3), ("component", 3), ("icon", 3), ("layout", 3), ("import", 3)]},
    "DESIGN_SYSTEM_TOKENS": {"keywords": [("token", 4), ("variable", 4), ("var:", 4), ("collection", 3), ("shadcn", 3), ("design system", 4)]},
    "INSPECT_EXPORT":       {"keywords": [("inspect", 3), ("extract", 4), ("export", 4), ("screenshot", 3), ("DESIGN.md", 4), ("a11y", 3), ("audit", 3)]},
    "CONNECT_SETUP_DAEMON": {"keywords": [("connect", 4), ("safe", 3), ("patch", 4), ("unpatch", 4), ("daemon", 4), ("diagnose", 3), ("reconnect", 3)]},
    "MCP_CONTEXT":          {"keywords": [("mcp", 4), ("code mode", 4), ("design context", 4), ("figma-developer-mcp", 4), ("pull", 2)]},
    "TROUBLESHOOT":         {"keywords": [("error", 4), ("failed", 4), ("not connected", 4), ("binary not found", 4), ("unauthorized", 3)]},
}

RESOURCE_MAP = {
    "CREATE_RENDER":        ["references/figma_cli_reference.md", "references/tool_surface.md"],
    "DESIGN_SYSTEM_TOKENS": ["references/figma_cli_reference.md", "references/tool_surface.md"],
    "INSPECT_EXPORT":       ["references/figma_cli_reference.md", "references/tool_surface.md"],
    "CONNECT_SETUP_DAEMON": ["references/figma_cli_reference.md", "references/troubleshooting.md"],
    "MCP_CONTEXT":          ["references/mcp_wiring.md", "assets/utcp_figma_manual.md", "assets/env_template.md", "references/figma_cli_reference.md"],
    "TROUBLESHOOT":         ["references/troubleshooting.md", "references/figma_cli_reference.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the direction: drive the CLI (default) or pull context via the optional Figma MCP",
    "Confirm figma-ds-cli is on PATH (NOT the unrelated npm 'figma-cli') and Figma Desktop is open",
    "For any author/modify/delete, confirm the target node/file and that a mutation is intended",
    "For destructive verbs, confirm an explicit target and a one-line rollback before running",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)               # raises if path escapes the skill
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {d.relative_to(SKILL_ROOT).as_posix() for d in docs}

def classify_intents(request: str):
    text = (request or "").lower()
    scores = {i: 0 for i in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw, w in cfg["keywords"]:
            if kw in text:
                scores[intent] += w
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    primary, top = ranked[0]
    if top == 0:
        return ("CONNECT_SETUP_DAEMON", None, scores)   # unrouted -> start by verifying setup
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_figma_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [primary] + ([secondary] if secondary else [])
    loaded, seen = [], set()

    def load_if_available(rel: str):
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < 1:
        return {"intents": intents, "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

## 3. HOW IT WORKS

### First Step (Always): verify the binary + Figma Desktop

```bash
# Canonical binary = figma-ds-cli. The npm package 'figma-cli' is an UNRELATED tool (unic/figma-cli).
BIN=""
command -v figma-ds-cli >/dev/null && BIN="figma-ds-cli"
[ -z "$BIN" ] && command -v figma-cli >/dev/null && BIN="figma-cli"   # only if installed from silships repo
[ -z "$BIN" ] && { echo "figma-ds-cli not found, see INSTALL_GUIDE.md (do NOT 'npm i -g figma-cli')"; exit 1; }
"$BIN" --version; "$BIN" --help | head -1
```

Figma Desktop must be **open with a file**, since figma-cli drives the live Desktop session (no Figma API key). Node `>=18`. macOS is the supported baseline.

### Connect modes + daemon

- **Safe (default): `figma-ds-cli connect --safe`** runs the FigCli plugin bridge, with **no patch**. Import `plugin/manifest.json` once, then keep `Plugins → Development → FigCli` open each session.
- **Yolo (gated): `figma-ds-cli connect`** patches Figma Desktop `app.asar`, codesigns on macOS, restarts Figma with CDP on port `9222`. May need Full Disk Access/admin and **breaks when Figma updates**. **Never run without explicit consent + a stated rollback** (`figma-ds-cli unpatch`).
- **Daemon**: local HTTP server on `127.0.0.1:3456` (not a socket), auth via `X-Daemon-Token` at `~/.figma-ds-cli/.daemon-token`, PID `~/.figma-cli-daemon.pid`, idle ~60 min, not reboot-persistent. Verbs: `daemon status | diagnose | start | stop | restart | reconnect`. "Unauthorized" → `daemon diagnose` then `daemon restart` (never auto-delete the token).

### Command classes (gating)

The full per-command taxonomy lives in [`references/tool_surface.md`](references/tool_surface.md). Summary:
- **READ-ONLY** (safe default): `status`, `var list/find`, `get`, `find`, `inspect`, `node tree`, `extract`, `export*`, `export-jsx`, `export-storybook`, `analyze*`, `a11y*`, `files`, `--dry-run` variants. (Local exports still write files, so require an explicit output path, never silently overwrite.)
- **MUTATING** (gate): all `create*`/`render*`/`tokens *`/`var create|bind|set|rename|visualize`, `bind *`, `set *`, layout verbs, `duplicate`, `use/theme`, `node to-component`, `slot/sizes/variants/combos`, `shadcn add`, `import`, `lint --fix`, `screenshot-url`, `recreate-url`, `gradient mesh`. App-level: `connect`, `unpatch`, `daemon start/stop/restart`, `config set`, `init-agent`.
- **DESTRUCTIVE** (confirm + explicit target + rollback): `var delete-all`, `var delete-batch`, `delete/remove`, `node delete`, `undo`, `unwrap`, `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear`, `annotate clear`.
- **ARBITRARY** (treat as mutating, review first): `eval`, `raw`, `run`.

### Optional Figma MCP via Code Mode (opt-in)

The skill works **fully with the CLI alone**. When the agent must pull design context FROM Figma, use the **Framelink `figma` manual already registered in Code Mode** (`figma-developer-mcp`, stdio, needs a Figma personal token). Calls go through `call_tool_chain()` with naming `figma.figma_<tool>`. The token must be in `.env` as `figma_FIGMA_API_KEY` (Code Mode prefixes the manual name). Always discover first with `search_tools()` / `tool_info()` before invoking. Full detail + the snippet: [`references/mcp_wiring.md`](references/mcp_wiring.md).

---

## 4. RULES

### ALWAYS

1. **ALWAYS verify the binary first.** Prefer `figma-ds-cli`, and only use `figma-cli` if it resolves to the silships tool (`--version`/`--help`), since the npm `figma-cli` package is unrelated. Fail closed with install guidance if neither is the silships tool.
2. **ALWAYS require Figma Desktop open with a file** before any CLI or desktop operation, since the CLI drives the live session.
3. **ALWAYS confirm daemon health** before daemon-backed commands (`daemon status`/`diagnose`; endpoint `127.0.0.1:3456`, token present).
4. **ALWAYS prefer `connect --safe`** for setup, and treat the yolo patch as a gated, consented action.
5. **ALWAYS gate every DESTRUCTIVE verb** behind explicit user confirmation, an explicit target node/file, a command preview, and a one-line rollback (prefer duplicating the file/page/selection first).
6. **ALWAYS treat `eval`, `raw`, and `run` as arbitrary mutation**, reviewing the code/command before running, even when the prompt sounds exploratory.
7. **ALWAYS require an explicit output path for local exports** (`extract`/`export`/`export-jsx`) and never silently overwrite existing files.
8. **ALWAYS apply `sk-design`** when a Figma read/export feeds a design decision. This skill owns the transport, and that skill owns the taste.

### NEVER

1. **NEVER `npm i -g figma-cli`**, because that installs the unrelated unic/figma-cli. Install `figma-ds-cli` (npm) or the silships repo.
2. **NEVER auto-apply the yolo `app.asar` patch** without explicit consent and a stated `figma-ds-cli unpatch` rollback. Never patch during install or routine startup.
3. **NEVER run a destructive verb via the active-selection fallback**, and require an explicit target id/name.
4. **NEVER expose or paste the daemon token** (`~/.figma-ds-cli/.daemon-token`) in user-facing output, and keep all local services bound to `127.0.0.1`.
5. **NEVER run or recommend `init-agent` by default**, because it writes `AGENTS.md`/`.cursor/rules` into the working repo.
6. **NEVER claim the optional Figma MCP works** until Code Mode discovery (`list_tools()`/`tool_info()`) confirms the `figma` manual and its tool names.

### ESCALATE IF

1. **ESCALATE IF the binary is missing or ambiguous**, asking whether to install `figma-ds-cli` (npm) or the silships repo build. Do not guess.
2. **ESCALATE IF Figma Desktop is not running** or daemon diagnosis fails after a reconnect.
3. **ESCALATE IF a yolo patch, a destructive verb, a broad delete/undo/unwrap, or an arbitrary `eval/raw/run` is requested**, describing the effect + rollback, then wait for confirmation.
4. **ESCALATE IF the optional Figma MCP is requested but no Figma token / Code Mode manual is configured**, surfacing the `.env` (`figma_FIGMA_API_KEY`) requirement. Do not paste credentials.
5. **ESCALATE IF CLI and MCP results disagree** about a file/node/variable state, and ask which source prevails before mutating.

---

## 5. REFERENCES

### Core References

- [figma_cli_reference.md](references/figma_cli_reference.md) - Binary identity + verification, Node/macOS baseline, Figma Desktop requirement, connect modes, daemon model, and command examples.
- [tool_surface.md](references/tool_surface.md) - The read-only / mutating / destructive command taxonomy, the destructive set, the `eval/raw/run` rule, and the export no-overwrite rule.
- [mcp_wiring.md](references/mcp_wiring.md) - The optional Figma MCP (Framelink `figma`) via Code Mode: the registered manual, the `.env` token, discovery, and a `call_tool_chain` example.
- [troubleshooting.md](references/troubleshooting.md) - Failure modes and fixes (binary collision, Desktop not running, daemon Unauthorized, port conflicts, Code Mode env-var prefix).

### Templates and Assets

- [utcp_figma_manual.md](assets/utcp_figma_manual.md) - Paste-ready Framelink `figma` `.utcp_config.json` manual entry, the `.env` note, and a `call_tool_chain` example for the optional Code Mode path.
- [env_template.md](assets/env_template.md) - The single prefixed `figma_FIGMA_API_KEY` `.env` line for the optional Figma MCP token.

### Reference Loading Notes

- References are the primary loaded resources. `figma_cli_reference.md` is the baseline (always). Load `tool_surface.md` for author/modify/token work, `mcp_wiring.md` only for MCP intent, `troubleshooting.md` for setup/errors.
- Load the `assets/` snippets only for MCP_CONTEXT intent, alongside `mcp_wiring.md`.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Connect complete when:**
- ✅ The binary was verified (`figma-ds-cli` or confirmed-silships `figma-cli`), Figma Desktop is open, the chosen connect mode ran, and `daemon status` is healthy.

**Read / export complete when:**
- ✅ The requested data/asset was captured to an explicit path with no overwrite, and no mutating or destructive command ran.

**Author / modify complete when:**
- ✅ The user confirmed the target and intent; mutating commands ran; destructive verbs had an explicit target + rollback; the result was verified (e.g. `get`/`verify`).

**Optional MCP context complete when:**
- ✅ Code Mode discovery confirmed the `figma` manual + tool names, the token was configured, and the context was pulled without claiming unverified tools.

**Always:**
- ✅ Figma Desktop was confirmed running; no yolo patch or destructive verb ran unconfirmed; the daemon token was never exposed.

---

## 7. INTEGRATION POINTS

### Tool Usage Guidelines

- **Bash** owns all `figma-ds-cli` operations (connect, daemon, inspect, export, author, tokens).
- **Code Mode** (`mcp__code_mode__call_tool_chain`) owns the optional Figma MCP calls (Framelink `figma`).
- **Read/Grep/Glob** load references and inspect CLI output / exported files.

### Cross-Workflow Contracts

- **`sk-design`** owns the design judgment and is applied whenever a Figma read/export feeds a design decision (grounding, token/type/layout choices). This skill is the transport, and that skill is the taste.
- **`sk-code`** owns adapting extracted tokens / DESIGN.md / exported code into a real application, and verifying it.
- **`mcp-chrome-devtools`** is used only for a last-mile browser preview of an implemented page, never to operate Figma.

### External Tools

- **figma-ds-cli** (silships, MIT): install from npm (`figma-ds-cli`) or the silships repo, and see [INSTALL_GUIDE.md](INSTALL_GUIDE.md). Requires **Figma Desktop** open. Not vendored into this repo.
- **Figma MCP (optional)**: the Framelink `figma-developer-mcp` manual already in this project's Code Mode `.utcp_config.json`, which needs `figma_FIGMA_API_KEY` in `.env`.

### Knowledge Base Dependencies

**Required**: `references/figma_cli_reference.md` (binary/daemon/connect baseline). **Conditional**: `tool_surface.md` (gating), `mcp_wiring.md` (MCP), `troubleshooting.md` (errors).

---

## 8. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers reference and asset docs dynamically. Start from `references/figma_cli_reference.md` for the CLI/daemon/connect model, load `references/tool_surface.md` for the gating taxonomy, `references/mcp_wiring.md` for the optional Code Mode path, and `references/troubleshooting.md` for failures. References stay the primary loaded resources.

Assets: `assets/utcp_figma_manual.md` (paste-ready Framelink `figma` `.utcp_config.json` manual + `.env` note) and `assets/env_template.md` (the prefixed `figma_FIGMA_API_KEY` line), loaded only for the optional MCP_CONTEXT path.

Scripts: `scripts/install.sh` (install + verify), `scripts/doctor.sh` (report-only diagnostics), `scripts/connect-safe.sh`, `scripts/connect-yolo.sh`, `scripts/daemon.sh`, `scripts/unpatch.sh`, `scripts/print-utcp-snippets.sh`.

Related skills: `sk-design` (the design judgment, applied whenever a read/export feeds a decision), `sk-code` (adapting exports into an app), `mcp-code-mode` (the optional MCP transport), `mcp-open-design` (sibling terminal-driven design tool), `mcp-chrome-devtools` (browser preview only), and `system-spec-kit` when packet documentation or memory continuity applies.

Install guide: [INSTALL_GUIDE.md](INSTALL_GUIDE.md).

Upstream: figma-cli is [silships/figma-cli](https://github.com/silships/figma-cli) (npm `figma-ds-cli`, MIT). The optional MCP is the community Framelink `figma-developer-mcp`. This skill documents driving the installed tool from the terminal, and it does not vendor or redistribute it.
