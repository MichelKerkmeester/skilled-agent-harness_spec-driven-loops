---
name: design-mcp-open-design
description: Open Design od CLI/MCP: wire opencode/Claude, read/reuse projects/systems, answer prompts, commission headless runs; sk-design.
compatibility: Requires the Open Design desktop app (v0.9.0+) installed and running (it hosts the local daemon), Node.js, and the target agent CLI (opencode or claude) for MCP install.
metadata:
  author: nexu-io (Open Design)
  source: https://github.com/nexu-io/open-design
  family: sk-design
  packetKind: transport
allowed-tools: [Read, Bash]
version: 1.5.0.0
---

<!-- keywords: open-design od-cli design-mcp-open-design design-systems local-first claude-design-alternative terminal-design daemon start-run -->

# Open Design (design-mcp-open-design)

Drive the installed **Open Design** desktop app (nexu-io/open-design, "the official open-source, local-first Claude Design alternative") from the terminal, so a coding agent (opencode / Claude Code) can read your local design projects and design-systems, reuse them, answer the app's prompts, and commission generation runs **without typing into the in-app chat**. The interface is the `od` CLI plus a stdio MCP server that Open Design exposes; deep operational detail lives in [`references/od_cli_reference.md`](references/od_cli_reference.md).

> ## ⛔ MANDATORY PAIRING — `sk-design`
>
> **This skill is the transport, never the taste.** For ANY UI/design work through Open Design — every generation/`start_run`, and every read that feeds a design decision (grounding in a system, reusing its tokens/components) — you **MUST** load [`sk-design`](../SKILL.md) and run its ground → token-system → critique FIRST, then shape the brief and every discovery-form answer with that judgment. **You may never produce or shape an interface from Open Design without it.** Open Design generates; `sk-design` decides. This is a hard precondition, not a recommendation. (Pure transport — wiring the MCP server, bare project listing that feeds no design decision — is exempt only with `openDesignExemption`, which forbids later design use of the returned artifact.)

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

**Wire** — register the MCP server so its tools appear to the agent. **Read** — list projects, read a design system's `DESIGN.md`/`tokens.css`/`components.html`, search files, fetch artifacts; all read-only, some guarded (Section 3). **Run** — commission headless generation: multi-turn and gated, mandatory-paired with `sk-design` (see the MANDATORY PAIRING banner above; full flow in Section 3).

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
    +- STEP 2 [HARD GATE]: if RUN, or READ that feeds a design decision -> LOAD sk-design and run ground -> token-system -> critique FIRST. No design output without it. (WIRE / bare inventory: exempt only with openDesignExemption.)
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

> Resilience pattern: see [sk-doc smart-router template](../../sk-doc/create-skill/assets/skill/skill_smart_router.md). This skill is a flat intent router (WIRE / READ / RUN), not a keyed `references/<key>/` or `assets/<key>/` resource router. Guard paths, discover current markdown resources at runtime, load only existing resources once, and fall back with an explicit checklist when unsure.

The full implementation — keyword-weighted `classify_intents()`, the `RESOURCE_MAP` per direction, the existence-guarded `discover_markdown_resources()`/`_guard_in_skill()` loader (falling back to the `UNKNOWN_FALLBACK_CHECKLIST` when intent is unclear), and the `design_gate()` hard-coupling check that blocks any RUN or design-feeding READ without a classified `openDesignPurpose` (`openDesignExemption` or `skDesignGate`) — lives in [`references/smart_router_pseudocode.md`](references/smart_router_pseudocode.md). Read it before implementing or modifying routing logic; this section is the contract, that file is the code.

---

## 3. HOW IT WORKS

### First Step (Always): locate the CLI and confirm the daemon

```bash
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is `od`
node "$OD_BIN" --help   # or the ELECTRON_RUN_AS_NODE=1 form (see references/od_cli_reference.md)
```

There is **no global `od` on PATH** (bare `od` is the unrelated `/usr/bin/od` octal-dump tool). Every tool call proxies to a **local daemon that the desktop app runs**, discovered over a Unix socket on an **ephemeral** loopback port, NOT a fixed `127.0.0.1:7456`. The daemon also exposes an HTTP API whose port rotates on every restart — rediscover it from `GET /api/mcp/install-info`, never hardcode it. Full socket, HTTP, and lifecycle detail: [`references/od_cli_reference.md`](references/od_cli_reference.md).

### Wire Direction (od mcp install)

```bash
node "$OD_BIN" mcp install opencode --print --json    # PREVIEW only, writes nothing
node "$OD_BIN" mcp install claude --print --json       # PREVIEW only
```

`--print --json` writes nothing and prints the exact `command`/`env` the install would write, sourced from `GET /api/mcp/install-info`; read it before running the non-preview form. Full entry shape and the manual-config fallback: [`references/mcp_wiring.md`](references/mcp_wiring.md).

> **This repo does not use `od mcp install opencode`.** These commands document the daemon CLI's general native-MCP-registration capability; this repo wires Open Design through Code Mode MCP instead (`.utcp_config.json`'s `open_design` manual call template, already configured with the same connection details). Never run `node "$OD_BIN" mcp install opencode` (without `--print --json`) in this repo — it deep-merges a redundant native entry into the user's global `~/.config/opencode/opencode.json`, which is not the intended integration point here.

### Read Direction (the safe default)

After wiring, the agent calls Open Design's MCP tools. Read-only means the tool does not write; it does not automatically mean unguarded. Pure transport reads (`list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents`) may use `openDesignExemption` and pass without a token because they provide inventory, not design substance. Design-bearing reads (`get_active_context`, `get_project`, `get_file`, `search_files`, `get_artifact`, `get_run`) use `skDesignGate` when their output shapes UI, design systems, artifacts, prototypes, motion, or briefs. From the terminal directly: `node "$OD_BIN" tools design-systems read --path <manifest-path>` reads a registered design system's pull-layer files. A design system is a `DESIGN.md` (9-section prose) + a paste-ready `tokens.css` (`:root` block) + an optional `components.html`.

### Run Direction (gated, multi-turn)

Generation is **multi-turn, not one-shot**: a single `start_run` (MCP) or `od run start` (CLI) fires **turn 1 only**, returning a GenUI discovery question-form (the inner agent asking about fidelity, data, and behaviour, with recommended defaults) and ending `awaiting_input` with **zero files**. A run that stops here produces no design.

> **⛔ MANDATORY before turn 1.** Load `sk-design` and run its ground → token-system → critique on the subject. The brief you pass to `start_run` (`--message`) and every `od ui respond` answer MUST be shaped by that judgment — Open Design generates, it does not decide the design. A run composed without `sk-design` is not permitted.

Answering the form (`od ui list` to find the `surfaceId`, then `od ui respond --run <runId> <surfaceId> --value ...` / `--value-json ...` / `--skip`, or a follow-up message such as "use the recommended defaults") fires the **build run** that writes the design files and gives the project an `entryFile` and a `previewUrl`. Poll `get_run(runId)` and fetch with `get_artifact`. The inner agent is `claude` / `opencode` / `gemini`, per `od run start --help`; `opencode` needs an explicit `--model <id>`. Other headless write verbs: `od automation` and `od media generate` — every one is **mutating** and a STOP-and-confirm point. Full multi-turn command sequence and every mutating verb: [`references/tool_surface.md`](references/tool_surface.md) §5, [`references/od_cli_reference.md`](references/od_cli_reference.md) §5.

> **Adding a file is not creating a design.** `od artifacts create --name <path> --input <file>` only **adds one file** to a project. It does NOT create a rendered design and does NOT update the project preview. To create a design that renders, use the multi-turn flow above, never `artifacts create`.

### Verify the live tool set

The `od mcp --help` text lists only a documentation subset (8 tools); the running server registers ~18 (including `write_file`, `create_project`, `start_run`, and destructive `delete_file`/`delete_project`). **Always verify the live `tools/list`** before promising a tool exists or is read-only, and gate every mutating/destructive one.

---

## 4. RULES

### ALWAYS

1. **ALWAYS locate the CLI as `node "<app>/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"`** (or the `ELECTRON_RUN_AS_NODE=1` form). Never assume a global `od` on PATH, and never hardcode `127.0.0.1:7456` or any HTTP port - the desktop daemon is socket-discovered, and its HTTP port is ephemeral and rotates on every daemon restart. Rediscover it from `GET /api/mcp/install-info` (`daemonUrl`) or the socket.
2. **ALWAYS confirm the Open Design desktop app is running first.** The daemon it hosts answers every tool call. If it is closed, the socket is gone and calls fail.
3. **ALWAYS verify the live `tools/list`** before relying on a tool's name or read-only status. The help text undercounts; the real surface is ~18 tools and includes mutating and destructive ones.
4. **ALWAYS gate every mutating or destructive verb** behind explicit user confirmation, an explicit target project/name, and a one-line rollback note. Covers `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`, and the `od artifacts/media/automation/ui/memory/plugin` write verbs. This gate is prose, not a structural interceptor — a live `start_run` can still fire against the real daemon. That is an accepted tradeoff, not an oversight: a hard structural stop would weaken the live-execution fidelity this transport exists to provide. A leaked project/run is a known, low-frequency risk; cleanup is a manual operator action through Open Design itself, never something this skill automates on its own initiative.
5. **ALWAYS run `sk-design` BEFORE and THROUGHOUT any design step — a hard precondition** (see the MANDATORY PAIRING banner above). Pure WIRE / bare inventory is exempt only with `openDesignExemption`.
6. **ALWAYS read Open Design content live; NEVER copy or cache it into a repo.** Reusing a system's `tokens.css`/`components.html` happens at build time in the target app, not by vendoring Open Design's files (its per-source Apache-2.0/MIT licenses would attach).
7. **ALWAYS run `mcp install ... --print --json` (dry-run) first** and read the exact `command`/`env` before writing an agent config.
8. **ALWAYS treat generation as multi-turn.** Turn 1 (`start_run` / `od run start`) returns a discovery question-form with zero files. Answer it (`od ui respond` or a follow-up message) to fire the build that writes the design and gives the project a `previewUrl`. `od artifacts create` only adds a file and never produces a rendered design.

### NEVER

1. **NEVER drive Open Design's in-app chat UI** or browser-automate its canvas. This skill is the terminal alternative to that, not an automator of it.
2. **NEVER run a destructive verb** (`delete_file`, `delete_project`) without an explicit project and `confirm:true` plus user approval, and never via the active-project fallback.
3. **NEVER surface Open Design's ~150 design-systems as a pick-a-vibe menu.** Resolve at most one system from the subject and brief (that is `sk-design`'s job); a style chooser is the templated default the design skill resists.
4. **NEVER pipe `https://open-design.ai/install.sh` to a shell.** Its contents are unverified; use the local `node "$OD_BIN" mcp install` form instead.
5. **NEVER claim a single `start_run` or `od run start` produced a finished, visible design.** Turn 1 only returns the discovery form. A design exists only after the form is answered and the build run writes files. Never present `od artifacts create` as a way to create a rendered design.
6. **NEVER produce or shape UI from Open Design without `sk-design`** loaded and its ground -> token-system -> critique applied (MANDATORY PAIRING banner above). Only pure WIRE / bare inventory with `openDesignExemption` is exempt.

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
- [smart_router_pseudocode.md](references/smart_router_pseudocode.md) - The Section 2 router's full implementation: intent classification, resource mapping, and the `design_gate` hard-coupling check.

### Reference Loading Notes

- Load only what the detected direction requires (see Section 2). `od_cli_reference.md` is the baseline; load `mcp_wiring.md` for WIRE, `tool_surface.md` for READ/RUN.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Wire complete when:**
- ✅ `mcp install ... --print --json` was reviewed, then the install wrote the `open-design` MCP entry into the target agent's config.
- ✅ The agent's live `tools/list` shows the Open Design tools and the desktop app is running.

**Read complete when:**
- ✅ The needed pure-transport reads used `openDesignExemption`, any design-feeding reads used `skDesignGate`, and nothing was written.

**Run complete when:**
- ✅ The mutating verb was confirmed with an explicit target and rollback note, turn 1 returned the discovery form, the form was answered (`od ui respond` or a follow-up message), and the build run wrote files so the project has an `entryFile` and a `previewUrl`. A run left `awaiting_input` produced no design and is not complete.

**Always:**
- ✅ The desktop app (daemon) was confirmed running before acting.
- ✅ The live `tools/list` was verified; no mutating verb ran unconfirmed.
- ✅ For any design step, `sk-design` was loaded and its ground → token-system → critique applied before the brief/answers were composed; no interface was produced or shaped from Open Design without it. (Pure WIRE / bare inventory is exempt only with `openDesignExemption`.)

---

## 7. INTEGRATION POINTS & RELATED RESOURCES

### Required Tool

**The Open Design desktop app** (`/Applications/Open Design.app`, v0.9.0+), which hosts the local daemon and ships the `od` CLI at `Contents/Resources/app/prebundled/daemon/daemon-cli.mjs`. There is no separate install for the CLI; it runs under Node or the bundled Electron (`ELECTRON_RUN_AS_NODE=1`). MCP wiring needs the target agent CLI (`opencode` or `claude`) on PATH.

### Related Skills

- **`sk-design`** owns the design judgment — the **MANDATORY partner for all design work** (see the MANDATORY PAIRING banner above). The two share the real-UI loop in `sk-design` (`real_ui_loop.md`), with this skill's Open Design transport for it in `references/design_parity_transport.md`.
- **`sk-code`** owns application-code standards for adapting any reused tokens/components into a real app.
- **`mcp-figma`** is the sibling terminal-driven design tool for Figma Desktop, a CLI plus optional MCP hybrid with the same daemon model and gating taxonomy.
- **`mcp-chrome-devtools`** can drive a real browser only if a last-mile visual preview is needed; it is never the way to operate Open Design.
- **`system-spec-kit`** when this skill's work needs packet documentation or memory continuity.

### Knowledge Base Dependencies

**Required**: `references/od_cli_reference.md` (CLI + daemon model). **Conditional**: `references/mcp_wiring.md` (WIRE), `references/tool_surface.md` (READ/RUN) per detected direction, `references/smart_router_pseudocode.md` when implementing or modifying the router.

Upstream: Open Design is [nexu-io/open-design](https://github.com/nexu-io/open-design), an open-source local-first design tool. This skill documents driving its installed desktop app from the terminal; it does not vendor or redistribute Open Design.
