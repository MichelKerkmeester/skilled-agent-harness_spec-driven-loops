---
title: "Iteration 4: Hermes vs the six runtimes — constraints and differences (Angle 9)"
trigger_phrases: []
---
# Iteration 4: Hermes vs the six existing runtimes

## Focus
Angle 9 — capability/constraint matrix across all seven runtimes on every surface the orchestration layer touches: install/runtime, headless dispatch, approval model, OS sandbox, repo-local config, skills, agents, commands, hooks, plugins, MCP, persona/memory, telemetry, web search, state isolation, and session semantics.

## Actions Taken
- Ran live read-only enumerations: `hermes hooks list` (none configured; schema at `website/docs/user-guide/features/hooks.md`), `hermes mcp list` (none configured; `mcp add` shape shown), `hermes tools list` (full toolset roster with enabled/disabled states).
- Read `~/.hermes/hermes-agent/hermes_cli/plugins.py:107-192` — the complete `VALID_HOOKS` set (~40 events) and `SHELL_UNSUPPORTED_HOOKS`; `agent/shell_hooks.py:211-234` — config.yaml `hooks:` section, event-keyed lists, consent allowlist with `hooks list` ✓/✗ status; `tools/mcp_tool_config.py:56-339` — `mcp_servers` in config.yaml, `${VAR}` interpolation, env-filtered stdio env, suspicious-config filter, plugin `portable_mcp_servers` extension.
- Read `~/.hermes/hermes-agent/hermes_cli/AGENTS.md` — command registry, config loader trio, profiles-as-islands doctrine, update pipeline.
- Cross-referenced `resource-map.md` §9 dotfolder inventory and per-runtime packet knowledge (already loaded; not re-derived).

## Findings

### F1. The comparison matrix

| Surface | cli-hermes (candidate) | cli-opencode | cli-claude-code | cli-codex | cli-cursor | cli-devin | cli-pi |
|---|---|---|---|---|---|---|---|
| Runtime | Python 3.11 venv + git checkout (`~/.hermes/hermes-agent`), `hermes` shim in `~/.hermes/bin` [src: main.py:398, ~/.hermes/bin] | Go binary + npm | Node/npm binary | Rust/Node binary | Closed-source `cursor-agent` | Hosted/cloud CLI | Node (llmgateway/cline fork) |
| Headless dispatch | `chat -Q -q/-z` + `--query-file`, `--oneshot`; stdin-close safe [src: _parser.py; iter-1] | `opencode run` | `claude -p` | `codex exec` | `cursor-agent -p` | `devin` non-interactive | `pi` one-shot |
| Write-permitting flag | `--yolo` (or `-z`); default gate = deny for writes in single_query [iter-1] | permissive default | `--dangerously-skip-permissions` | `--full-auto`/`--dangerously-bypass-approvals` | `-f`/permissions | `--permission-mode dangerous` | allowlist-based |
| OS sandbox | None [executor-config posture: false] | None (rejects non-danger-full) | none/OS-level per mode | sandbox modes | **Yes — OS-level** | None (post-hoc containment) | None |
| In-agent wall-clock | `--run-budget SECONDS` (80% wrap-up notice) — **unique among the seven** | runner timeout only | runner timeout only | runner timeout only | runner timeout only | runner timeout only | runner timeout only |
| Repo-local config dir | **None** — no project `.hermes/` support today; loads AGENTS.md/CLAUDE.md/.cursorrules/SOUL.md from cwd but config is home-scoped [resource-map §9] | `.opencode/` | `.claude/` | `.codex/` | `.cursor/` | `.devin/` | `.pi/` |
| Skills | `~/.hermes/skills/` + project `.hermes/skills`, `.agents/skills`; upward walk ≤64 dirs; injected as user message [hermes_cli/AGENTS.md; resource-map] | `.opencode/skills` | `.claude/skills` | n/a (AGENTS.md only) | `.cursor/rules` | `.devin/skills` | n/a |
| Sub-agents | `delegate_task` toolset (enabled by default), kanban worker spawn, profiles | subagents | Task tool | none | none | none | none (→ pi exemption) |
| Slash/custom commands | `COMMAND_REGISTRY` single source; skill slash-commands injected as user msgs; custom commands via plugins [hermes_cli/AGENTS.md] | `.opencode/commands` | `.claude/commands` | prompts | n/a | n/a | n/a |
| Hooks | `hooks:` in config.yaml — ~40 events (pre/post_tool_call, transform_*, pre_verify, session lifecycle, kanban, gateway); shell-hook consent allowlist; Python plugin hooks [plugins.py:107-192; shell_hooks.py:211] | hooks in config | hooks in settings.json | notify | hooks | injected hooks | hooks |
| Plugins | Python `plugins/<name>/` with `register(ctx)`; manifest, discovery, ledger, state; `plugins.enabled` in config.yaml [plugins_loader.py; config.yaml] | TS/JS plugins | plugins | none | none | none | none |
| MCP | `mcp_servers` in config.yaml; stdio+HTTP, `${VAR}` interp, env-filtered stdio, suspicious-config filter, plugin portable servers [mcp_tool_config.py:56-339] | mcp in config | `.mcp.json` + config | mcp in config | mcp | mcp | mcp |
| Persona/memory | SOUL.md persona + `memory` toolset + session_search + curator daemon — **heaviest injection surface of the seven**; `--ignore-rules`/`--safe-mode` kill it [iter-1,3] | rules | CLAUDE.md memory | AGENTS.md | rules | minimal | minimal |
| Telemetry/cost | Usage file (`api_usage`), session records, `hermes status`/`doctor` diagnostics; logs under `~/.hermes/logs` | usage | cost in output | usage | usage | usage dashboard | usage |
| Web search control | `-t/--toolsets` per dispatch incl. `web`,`x_search`; roster-dependent backends (Tavily/Perplexity/Firecrawl keys absent today) [tools list; iter-2] | per-config | per-run tools | search flag | on | n/a | n/a |
| State isolation | `HERMES_HOME` env + `--profile/-p` (pre-import) — **strongest isolation primitive of the seven** (only cursor's env + devin's file-config come close; claude/codex/opencode have config-dir flags too) [main.py:398-512] | `OPENCODE_CONFIG_DIR`-ish | `CLAUDE_CONFIG_DIR` | `CODEX_HOME` | `CURSOR_CONFIG_DIR` | file-only `--config` | config flag |
| Session semantics | `sessions/` DB + `--resume`/`--continue`/`--create-if-missing`; `session_id:` on stderr under `-Q` [iter-1] | sessions | sessions | sessions | sessions | sessions | sessions |
| Self-invocation marker | `HERMES_AGENT=true` + `HERMES_SESSION_ID` [main.py:3145; agent_init.py:1117] | `OPENCODE_*` | `CLAUDECODE`/`CLAUDE_CODE_*` | `CODEX_*` | `CURSOR_AGENT=1` | `DEVIN_*` | exempt (no delegation) |
| Git worktree | `--worktree` flag (in-agent `git worktree add` — containment hazard) [iter-3 F5] | n/a | n/a | n/a | n/a | n/a | n/a |
| Reasoning control | `--reasoning` = exact 8-level match to repo `REASONING_EFFORTS` [iter-2] | reasoning flag | thinking levels | `--reasoning` | thinking | model only | model only |

### F2. Where Hermes is strictly richer
- **Hook event breadth**: ~40 events spanning tool calls, LLM I/O transforms, API errors, session lifecycle, kanban, gateway platform events — deeper than any of the six. [plugins.py:107-188]
- **`--run-budget`**: no other runtime offers an in-agent wall-clock with cooperative wrap-up. [iter-1]
- **Profiles**: independent-island homes (config+secrets+sessions+skills) set before import — a true multi-tenancy primitive the others approximate with config-dir flags. [main.py:511-512; hermes_cli/AGENTS.md]
- **Plugin system**: full Python `register(ctx)` plugins with manifest/ledger/state — peers only opencode/claude have anything similar, and shallower. [plugins_loader.py:473 lines; plugins_manifest.py:485]

### F3. Where Hermes is strictly weaker for orchestration
- **No repo-local `.hermes/` config dir** — the single biggest gap: every other runtime has a checked-in or project-scoped config surface; Hermes reads cwd rule files but ALL config lives in `HERMES_HOME`. A repo-local contract must be designed (angle 10 decision). [resource-map §9]
- **Heaviest ambient injection** — SOUL.md + memory + session_search + skills + AGENTS.md + CLAUDE.md all fire by default; more bleed channels to suppress than any sibling (mitigated by `--ignore-rules`/`--safe-mode`). [iter-3 F9]
- **Python/venv startup** — heavier cold start than Go/Rust binaries; MCP cold-start bound waits before tool snapshot when servers configured. [cli.py:4384-4427]
- **`delegate_task` enabled by default** — sub-agent toolset is ON in the stock roster (`hermes tools list` shows ✓ enabled); leaf lineages must strip it via `-t` or config. [tools list 2026-09-14]
- **No OS sandbox** — matches devin/pi/opencode posture; only cursor has a real boundary. [executor-config.ts:117-125]

### F4. Constraint deltas the packet must encode
- Approval semantics differ: Hermes's `single_query` gate is deny-for-writes (needs `--yolo`), like claude/codex's permission prompts — unlike opencode's permissive default. [iter-1 F4]
- Hooks are **consent-gated** (allowlist persisted; `hooks list` shows ✓/✗) — in headless, unseen hooks block unless `--accept-hooks`; unique consent model vs claude/cursor hooks which just run. [shell_hooks.py:46-61]
- MCP is **home-scoped only** (config.yaml), no project `.mcp.json` equivalent — repo-level MCP sharing (claude's `.mcp.json`) has no Hermes analog. [mcp_tool_config.py:321-339]
- Session records/memories/checkpoints write to `HERMES_HOME` on every run — fine for containment (outside repo) but means every lineage run leaves residue in shared state unless profiled. [iter-3 F4-F5]

## Questions Answered
- Full seven-runtime comparison on all orchestration surfaces — done.

## Questions Remaining
- Whether `hermes` honors a project `.hermes/` at all (evidence says no — config.yaml is only read from HERMES_HOME; project dirs discovered are `skills/` only) — UNKNOWN→likely no; final pin in implementation spike.
- Cold-start latency measurement (no provider → can't time a real turn; `hermes --version` proxy only).

## Ruled Out
- Treating Hermes MCP as repo-shareable like `.mcp.json`: no such surface exists.
- Relying on default toolsets for leaf dispatches: `delegation` is enabled stock — must strip explicitly.

## Reflection
The matrix is fully populated — every cell has a source. The three findings that change the integration plan: (1) no repo-local config dir is THE design problem, (2) `--profile`/`HERMES_HOME` is a stronger isolation primitive than expected, (3) `delegation`-on-by-default is a fan-out footgun nobody would notice without `hermes tools list`.

## Assessment
- newInfoRatio: 0.75
- Novelty justification: The comparison table and the delegation-default/MCP-home-scoped/consent-gated-hooks deltas are new; per-runtime baseline knowledge was carried from resource-map.
- Confidence: high — all hermes cells cite live output or source lines; sibling-runtime cells cite executor-config/resource-map knowledge.

## Recommended Next Focus
Angle 10 — ranked recommendation and phased integration plan: repo-local `.hermes` contract decision, phase-2 build list (executor tables, buildHermesLineageCommand, audit env prefixes, containment rules), provider/auth pin, and residual UNKNOWNs.

## SCOPE VIOLATIONS
None.
