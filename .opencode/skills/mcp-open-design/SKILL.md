---
name: mcp-open-design
description: Drive the installed Open Design desktop app from the terminal through its `od` CLI and stdio MCP server. Read local design projects and design-systems, reuse them, answer the app's prompts, and commission headless generation runs without using the in-app chat. Wires Open Design's MCP server into opencode or Claude Code. MANDATORY: any UI/design work through Open Design also requires sk-design — this skill is the transport, that skill is the non-negotiable design judgment.
compatibility: Requires the Open Design desktop app (v0.9.0+) installed and running (it hosts the local daemon), Node.js, and the target agent CLI (opencode or claude) for MCP install.
metadata:
  author: nexu-io (Open Design)
  source: https://github.com/nexu-io/open-design
allowed-tools: [Read, Bash]
version: 1.4.0.1
user-invocable: true
---

<!-- keywords: open-design od-cli mcp-open-design design-systems local-first claude-design-alternative terminal-design daemon start-run -->

# Open Design (mcp-open-design)

Drive the installed **Open Design** desktop app (nexu-io/open-design, "the official open-source, local-first Claude Design alternative") from the terminal, so a coding agent (opencode / Claude Code) can read your local design projects and design-systems, reuse them, answer the app's prompts, and commission generation runs **without typing into the in-app chat**. The interface is the `od` CLI plus a stdio MCP server that Open Design exposes; deep operational detail lives in [`references/od_cli_reference.md`](references/od_cli_reference.md).

> ## ⛔ MANDATORY PAIRING — `sk-design`
>
> **This skill is the transport, never the taste.** For ANY UI/design work through Open Design — every generation/`start_run`, and every read that feeds a design decision (grounding in a system, reusing its tokens/components) — you **MUST** load [`sk-design`](../sk-design/SKILL.md) and run its ground → token-system → critique FIRST, then shape the brief and every discovery-form answer with that judgment. **You may never produce or shape an interface from Open Design without it.** Open Design generates; `sk-design` decides. This is a hard precondition, not a recommendation. (Pure transport — wiring the MCP server, bare project listing that feeds no design decision — is exempt because it makes no design decision.)

> **Terminology.** Open Design calls a workspace a **project**, a brand/style a **design system** (DESIGN.md + tokens.css + components.html), a build a **run**, and an output file an **artifact**. The CLI brands itself **`od`** but is `app/prebundled/daemon/daemon-cli.mjs` run under Node - it is NOT the bundled `vela` binary (vela is the cloud auth client).

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user:
- Wants a terminal agent to use Open Design's local projects, design-systems, or artifacts.
- Wants to wire Open Design's MCP server into opencode or Claude Code ("connect open design", "od mcp install").
- Wants to ground a design in one of Open Design's ~150 design-systems, or reuse its tokens/components.
- Wants to commission an Open Design generation run headlessly, or answer a run's prompt from the terminal.

**Keyword Triggers**: "open design", "open-design", "od mcp", "od cli", "design system from open design", "drive open design from the terminal".

### Use Cases

**Wire direction (connect the app to your agent).** Register Open Design's stdio MCP server into opencode/Claude Code so its tools appear to the agent.

**Read direction (use local content).** List projects, read the active context, read a design system's `DESIGN.md`/`tokens.css`/`components.html`, search files, fetch artifacts - all read-only.

**Run direction (commission work headlessly).** Generation is multi-turn. `start_run` (or `od run start`) fires turn 1, which returns a discovery question-form and zero files. Answer the form with `od ui respond` (or a follow-up message) to fire the build that writes the design and gives the project a `previewUrl`. Gated. **Mandatory before any of this:** load `sk-design` and shape the brief and form answers with its judgment (see the MANDATORY PAIRING banner above).

### When NOT to Use

**Skip this skill when:**
- The user wants to work in Open Design's in-app chat UI directly (that is the thing this skill replaces, not automates).
- The work is generic app coding with no Open Design content (use `sk-code`).
- The work is the design judgment itself (the look, the anti-default critique) - that is `sk-design`; this skill is the transport.
- Open Design is not installed, or its desktop app is not running (the local daemon, and therefore every tool call, is unavailable).

---

## 2. SMART ROUTING

### Primary Detection Signal

Detect the workflow **direction**, since it selects both the commands and the references to load:

```bash
# Direction detection (pseudo)
echo "$REQUEST" | grep -qiE 'install|wire|connect|hook .* up|mcp add' && DIR="WIRE"
echo "$REQUEST" | grep -qiE 'run|generate|commission|build .* in open ?design|start_run' && DIR="RUN"
echo "$REQUEST" | grep -qiE 'read|list|search|design system|tokens|reuse|ground' && DIR="READ"
# default when only inspecting/listing: READ
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: locate the od CLI + confirm the daemon is reachable
    +- STEP 1: Score intent -> WIRE | READ | RUN
    +- STEP 2 [HARD GATE]: if RUN, or READ that feeds a design decision -> LOAD sk-design and run ground -> token-system -> critique FIRST. No design output without it. (WIRE / bare inventory: exempt.)
    +- Phase 1: Wire (od mcp install <agent>, or manual config) [WIRE]
    +- Phase 2: Read (list_projects / get_active_context / get_file / design-systems read) [READ]
    +- Phase 3: Run (turn 1 start_run -> answer discovery form -> build -> get_run / get_artifact, gated) [RUN]
    +- Phase 4: Verify (tools/list reflects what you used, the build wrote files and the project has a previewUrl)
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| ALWAYS | Every invocation | `references/od_cli_reference.md` (locate the CLI, daemon model, verb surface) |
| CONDITIONAL | WIRE intent | `references/mcp_wiring.md` (opencode + Claude Code config, manual fallback) |
| CONDITIONAL | READ / RUN intent | `references/tool_surface.md` (the MCP tools, the surface/gate/omit policy) |
| ⛔ MANDATORY (any design step) | ANY generation/RUN, or any READ feeding a design decision (grounding, reusing tokens/components) | `sk-design` — load it and run ground → token-system → critique BEFORE deciding. Hard precondition: a design step without it is blocked. |
| ⛔ MANDATORY (any design step) | Reuse-before-generate / fidelity / handoff | `references/design_parity_transport.md` (Open Design transport for the real-UI loop), applied with `sk-design`'s judgment |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../sk-doc/assets/skill/skill_smart_router.md). Guard paths, discover at runtime, derive a routing key, score intents, fall back when unsure.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references",)
DEFAULT_RESOURCE = "references/od_cli_reference.md"

INTENT_MODEL = {
    "WIRE": {"keywords": [("install", 4), ("wire", 4), ("connect", 3), ("mcp add", 4)]},
    "READ": {"keywords": [("read", 3), ("list", 3), ("search", 3), ("design system", 4), ("tokens", 3), ("reuse", 3), ("ground", 3)]},
    "RUN":  {"keywords": [("run", 3), ("generate", 4), ("commission", 4), ("start_run", 4), ("artifact", 3)]},
}

RESOURCE_MAP = {
    "WIRE": ["references/mcp_wiring.md", "references/od_cli_reference.md"],
    "READ": ["references/tool_surface.md", "references/od_cli_reference.md"],
    "RUN":  ["references/tool_surface.md", "references/od_cli_reference.md"],
}

# ⛔ HARD COUPLING: any RUN, or any READ that feeds a design decision, is design
# work and MUST load sk-design and run its ground -> token-system ->
# critique BEFORE any design output. mcp-open-design owns the transport; the
# judgment is sk-design's and is non-negotiable. A design step composed
# without it is blocked (see design_gate below). Pure WIRE / bare inventory is exempt.
DESIGN_INTENTS = {"READ", "RUN"}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the direction: wire the MCP server, read local content, or commission a run",
    "Confirm the Open Design desktop app is running (the daemon hosts every tool call)",
    "Confirm the od CLI path: node \"<app>/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs\"",
    "For RUN or any mutating verb, confirm the user wants a write and name the target project",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)            # raises if path escapes the skill
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
        return ("READ", None, scores)
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def design_gate(intents, feeds_design_decision):
    # ⛔ HARD precondition. RUN is always design work; a design-feeding READ is too.
    # Pure WIRE / bare inventory (feeds_design_decision=False) is exempt.
    if "RUN" in intents or ("READ" in intents and feeds_design_decision):
        require_sk_interface_design()   # load + run ground -> token-system -> critique;
                                        # RAISE/BLOCK if skipped. Never produce UI without it.

def route_open_design_resources(request: str, feeds_design_decision: bool = False):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [primary] + ([secondary] if secondary else [])
    design_gate(intents, feeds_design_decision)   # ⛔ blocks any design step missing sk-design
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

### First Step (Always): locate the CLI and confirm the daemon

```bash
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is `od`
# Either form works (system node, or the bundled Electron as node - no system node needed):
node "$OD_BIN" --help
ELECTRON_RUN_AS_NODE=1 "$APP/Contents/MacOS/Open Design" "$OD_BIN" --help
```

There is **no global `od` on PATH** (bare `od` is the unrelated `/usr/bin/od` octal-dump tool). Every tool call proxies to a **local daemon that the desktop app runs**, so the app must be open. The daemon is discovered over a Unix socket (`OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock`) on an **ephemeral** loopback port, NOT a fixed `127.0.0.1:7456` (that port is only the default for a standalone `od --no-open` daemon).

One daemon exposes **four interchangeable surfaces**: the `od` CLI, the stdio MCP server, an HTTP API (`http://127.0.0.1:<port>/api/*`), and the in-app Skills. The HTTP port is **ephemeral and rotates on every daemon restart**, so never hardcode it. Rediscover it from `GET /api/mcp/install-info` (the canonical config source) or the socket. The socket-based `od` CLI is stable across restarts, only the HTTP port moves. Full HTTP detail: [`references/od_cli_reference.md`](references/od_cli_reference.md).

### Wire Direction (od mcp install)

```bash
node "$OD_BIN" mcp install opencode --print --json    # PREVIEW only, writes nothing
node "$OD_BIN" mcp install opencode                    # deep-merges ~/.config/opencode/opencode.json (mcp.open-design)
node "$OD_BIN" mcp install claude --print --json       # PREVIEW
node "$OD_BIN" mcp install claude                       # runs: claude mcp add --scope user open-design ...
```

The installed entry is `{"type":"local","command":["<Open Design Helper electron>","<daemon-cli.mjs>","mcp"],"enabled":true,"environment":{"OD_DATA_DIR":"...","OD_SIDECAR_IPC_PATH":".../daemon.sock","ELECTRON_RUN_AS_NODE":"1"}}`. The canonical source for this entry is `GET /api/mcp/install-info`, where `command[0]` is the "Open Design Helper" Electron binary, `args` is `[<daemon-cli.mjs>, "mcp"]`, and `daemonUrl` is the live HTTP base. The MCP server re-discovers the live ephemeral daemon URL from the socket on each spawn, so the config stays valid across daemon restarts. Run `--print --json` first and read the exact `command`/`env` it will write. Full detail + manual config: [`references/mcp_wiring.md`](references/mcp_wiring.md).

### Read Direction (the safe default)

After wiring, the agent calls Open Design's MCP tools. The **read-only** tools are always safe: `list_projects`, `get_active_context` (what the user has open now), `get_project`, `get_file`, `search_files`, `list_files`, `get_artifact`, `list_skills`, `list_plugins`, `list_agents`, `get_run`. From the terminal directly: `node "$OD_BIN" tools design-systems read --path <manifest-path>` reads a registered design system's pull-layer files. A design system is a `DESIGN.md` (9-section prose) + a paste-ready `tokens.css` (`:root` block) + an optional `components.html`.

### Run Direction (gated, multi-turn)

Generation is **multi-turn, not one-shot**. A single `start_run` (MCP) or `od run start` (CLI) fires **turn 1 only**, which returns a GenUI discovery question-form (the inner agent asking about fidelity, data, and behaviour, with recommended defaults) and ends `awaiting_input` with **zero files**. A run that stops here produces no design.

> **⛔ MANDATORY before turn 1.** Load `sk-design` and run its ground → token-system → critique on the subject. The brief you pass to `start_run` (`--message`) and every `od ui respond` answer MUST be shaped by that judgment — Open Design generates, it does not decide the design. A run composed without `sk-design` is not permitted.

```bash
# Turn 1: commission the run. Returns a discovery question-form, 0 files, awaiting_input.
node "$OD_BIN" run start --project <id> --message "<brief>" \
  --plugin od-new-generation --agent claude --json
# Answer the form to fire the BUILD that writes the design:
node "$OD_BIN" ui list --run <runId> --json                 # find the surfaceId
node "$OD_BIN" ui respond --run <runId> <surfaceId> --value "use the recommended defaults"
#   --value-json <json> for structured answers, or --skip to accept the defaults.
#   A follow-up message ("use the recommended defaults") works too.
```

The inner agent is `claude` / `codex` / `gemini` (per `od run start --help`). `opencode` also works (verified live) and needs an explicit `--model <id>`, or the run uses opencode's default (shown as `"model":null` in the run's `events.jsonl` start event).

Answering the form fires a **build run** that writes the design files (`index.html` and friends). Only then does the project gain an `entryFile` and a `previewUrl` and actually render. Poll `get_run(runId)` and fetch with `get_artifact`. CLI run verbs: `od run start|watch|cancel|list|info`. Other headless write verbs: `od automation` (schedule or fire routines) and `od media generate`. Every one is **mutating** and a STOP-and-confirm point (see Rules + [`references/tool_surface.md`](references/tool_surface.md)).

> **Adding a file is not creating a design.** `od artifacts create --name <path> --input <file>` only **adds one file** to a project. It does NOT create a rendered design and does NOT update the project preview. To create a design that renders, use the multi-turn flow above, never `artifacts create`.

### Verify the live tool set

The `od mcp --help` text lists only a documentation subset (8 tools); the running server registers ~18 (including `write_file`, `create_project`, `start_run`, and destructive `delete_file`/`delete_project`). **Always verify the live `tools/list`** before promising a tool exists or is read-only, and gate every mutating/destructive one.

---

## 4. RULES

### ALWAYS

1. **ALWAYS locate the CLI as `node "<app>/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"`** (or the `ELECTRON_RUN_AS_NODE=1` form). Never assume a global `od` on PATH, and never hardcode `127.0.0.1:7456` or any HTTP port - the desktop daemon is socket-discovered, and its HTTP port is ephemeral and rotates on every daemon restart. Rediscover it from `GET /api/mcp/install-info` (`daemonUrl`) or the socket.
2. **ALWAYS confirm the Open Design desktop app is running first.** The daemon it hosts answers every tool call. If it is closed, the socket is gone and calls fail.
3. **ALWAYS verify the live `tools/list`** before relying on a tool's name or read-only status. The help text undercounts; the real surface is ~18 tools and includes mutating and destructive ones.
4. **ALWAYS gate every mutating or destructive verb** behind explicit user confirmation, an explicit target project/name, and a one-line rollback note. This covers `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`, and the `od artifacts/media/automation/ui/memory/plugin` write verbs.
5. **ALWAYS run `sk-design` BEFORE and THROUGHOUT any design step — a hard precondition.** For any generation/RUN, and any READ that feeds a design decision, load `sk-design`, run ground -> token-system -> critique, and shape the brief and discovery-form answers with it. This skill owns the transport; the design judgment is `sk-design`'s and is never skipped, inlined, or substituted. (Pure WIRE / bare inventory that feeds no design decision is exempt.)
6. **ALWAYS read Open Design content live; NEVER copy or cache it into a repo.** Reusing a system's `tokens.css`/`components.html` happens at build time in the target app, not by vendoring Open Design's files (its per-source Apache-2.0/MIT licenses would attach).
7. **ALWAYS run `mcp install ... --print --json` (dry-run) first** and read the exact `command`/`env` before writing an agent config.
8. **ALWAYS treat generation as multi-turn.** Turn 1 (`start_run` / `od run start`) returns a discovery question-form with zero files. Answer it (`od ui respond` or a follow-up message) to fire the build that writes the design and gives the project a `previewUrl`. `od artifacts create` only adds a file and never produces a rendered design.

### NEVER

1. **NEVER drive Open Design's in-app chat UI** or browser-automate its canvas. This skill is the terminal alternative to that, not an automator of it.
2. **NEVER run a destructive verb** (`delete_file`, `delete_project`) without an explicit project and `confirm:true` plus user approval, and never via the active-project fallback.
3. **NEVER surface Open Design's ~150 design-systems as a pick-a-vibe menu.** Resolve at most one system from the subject and brief (that is `sk-design`'s job); a style chooser is the templated default the design skill resists.
4. **NEVER pipe `https://open-design.ai/install.sh` to a shell.** Its contents are unverified; use the local `node "$OD_BIN" mcp install` form instead.
5. **NEVER claim a single `start_run` or `od run start` produced a finished, visible design.** Turn 1 only returns the discovery form. A design exists only after the form is answered and the build run writes files. Never present `od artifacts create` as a way to create a rendered design.
6. **NEVER produce or shape UI from Open Design without `sk-design`.** Do not fire `start_run` / `od run start`, answer a discovery form, ground a design in a system, or reuse its tokens/components unless `sk-design` is loaded and its ground -> token-system -> critique has been applied. The transport is here; the taste is non-negotiable and lives there. Only pure WIRE / bare inventory that feeds no design decision is exempt.

### ESCALATE IF

1. **ESCALATE IF the desktop app is not running** and the user expected tool calls to work - offer to have them open it, or to start a standalone daemon with `od --no-open` (headless, binds `127.0.0.1:7456`).
2. **ESCALATE IF a verb returns an auth error** - local reads work without a cloud account, but generation/media/research/plugin-publish may need a `vela login` or configured providers. Surface the requirement; do not paste credentials into prompts.
3. **ESCALATE IF a mutating or destructive run is requested** - describe the effect and the rollback, then stop and wait for confirmation.

---

## 5. REFERENCES

### Core References

- [od_cli_reference.md](references/od_cli_reference.md) - Locating the CLI, the daemon/socket model, and the full `od` verb surface with read-only vs mutating classification.
- [mcp_wiring.md](references/mcp_wiring.md) - Wiring the MCP server into opencode and Claude Code: the install commands, the written config shape, the manual fallback, and daemon-URL discovery.
- [tool_surface.md](references/tool_surface.md) - The ~18 MCP tools, the surface / gate / omit policy, and the live-verification requirement.

### Reference Loading Notes

- Load only what the detected direction requires (see Section 2). `od_cli_reference.md` is the baseline; load `mcp_wiring.md` for WIRE, `tool_surface.md` for READ/RUN.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Wire complete when:**
- ✅ `mcp install ... --print --json` was reviewed, then the install wrote the `open-design` MCP entry into the target agent's config.
- ✅ The agent's live `tools/list` shows the Open Design tools and the desktop app is running.

**Read complete when:**
- ✅ The needed projects/files/design-systems were read with read-only tools; nothing was written.

**Run complete when:**
- ✅ The mutating verb was confirmed with an explicit target and rollback note, turn 1 returned the discovery form, the form was answered (`od ui respond` or a follow-up message), and the build run wrote files so the project has an `entryFile` and a `previewUrl`. A run left `awaiting_input` produced no design and is not complete.

**Always:**
- ✅ The desktop app (daemon) was confirmed running before acting.
- ✅ The live `tools/list` was verified; no mutating verb ran unconfirmed.
- ✅ For any design step, `sk-design` was loaded and its ground → token-system → critique applied before the brief/answers were composed; no interface was produced or shaped from Open Design without it. (Pure WIRE / bare inventory is exempt.)

---

## 7. INTEGRATION POINTS

### Required Tool

**The Open Design desktop app** (`/Applications/Open Design.app`, v0.9.0+), which hosts the local daemon and ships the `od` CLI at `Contents/Resources/app/prebundled/daemon/daemon-cli.mjs`. There is no separate install for the CLI; it runs under Node or the bundled Electron (`ELECTRON_RUN_AS_NODE=1`). MCP wiring needs the target agent CLI (`opencode` or `claude`) on PATH.

### Related Skills

- **`sk-design`** owns the design judgment and is a **MANDATORY partner for all design work** — every generation/RUN and every read that feeds a design decision MUST load it and run ground → token-system → critique first. This skill is the transport; that skill is the non-negotiable taste, never skipped or substituted. Pure transport (wiring, bare inventory) is exempt. The two share the real-UI loop in `sk-design` (`real_ui_loop.md`), with this skill's Open Design transport for it in `references/design_parity_transport.md`.
- **`sk-code`** owns application-code standards for adapting any reused tokens/components into a real app.
- **`mcp-figma`** is the sibling terminal-driven design tool for Figma Desktop, a CLI plus optional MCP hybrid with the same daemon model and gating taxonomy.
- **`mcp-chrome-devtools`** can drive a real browser only if a last-mile visual preview is needed; it is never the way to operate Open Design.

### Knowledge Base Dependencies

**Required**: `references/od_cli_reference.md` (CLI + daemon model). **Conditional**: `references/mcp_wiring.md` (WIRE), `references/tool_surface.md` (READ/RUN) per detected direction.

---

## 8. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers reference docs dynamically. Start from `references/od_cli_reference.md` for the CLI and daemon model, load `references/mcp_wiring.md` to wire the MCP server, and load `references/tool_surface.md` for the tool surface and gating policy.

Related skills: `sk-design` (the MANDATORY design-judgment partner for any design work — never produce or shape UI from Open Design without it; only pure transport is exempt), `mcp-figma` (the sibling terminal-driven design tool for Figma Desktop), `sk-code` for adapting reused tokens/components into an app, and `system-spec-kit` when packet documentation or memory continuity applies.

Upstream: Open Design is [nexu-io/open-design](https://github.com/nexu-io/open-design), an open-source local-first design tool. This skill documents driving its installed desktop app from the terminal; it does not vendor or redistribute Open Design.
