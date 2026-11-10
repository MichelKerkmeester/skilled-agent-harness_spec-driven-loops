---
title: "swe2 lineage synthesis: Hermes Agent as the seventh cli-external-orchestration runtime"
trigger_phrases: []
---
# swe2 Lineage Synthesis — Hermes Agent (v0.21.1) as Seventh Runtime

**Lineage**: `swe2` · session `fanout-swe2-1789402663119-cvvtf8` · executor `cli-devin model=swe-2-max`
**Iterations**: 5/5 (forced depth) · **stopReason**: `maxIterationsReached` · convergence threshold 0.05 (telemetry only)

## Verdict

**Integrate `cli-hermes` as the seventh runtime — gated on two pre-conditions.** Hermes satisfies every hard requirement of the dispatch contract and adds capabilities no existing runtime has (`--run-budget`, ~40-event hook surface, true profile isolation). The gate: (a) zero providers are configured on this machine, so no live `chat -Q` has ever run — the happy path is source-verified but live-unproven; (b) Hermes has no repo-local `.hermes/` config surface, so the integration must decide how repo-scoped settings are delivered. Both resolve in a single phase-002 pin.

## Iteration map

| Iter | Angle | newInfoRatio | Core result |
|---|---|---|---|
| 1 | Headless dispatch contract | 1.00 | Two headless modes: `-z` (auto-yolo, no session id) vs `chat -Q` (deterministic deny for writes, `session_id:` on stderr, 0/1/2/130). Non-TTY `chat` is naturally one-shot. `--yolo` is mandatory for write-capable dispatch. |
| 2 | Providers/models/reasoning | 0.90 | ~35-provider static catalog + plugin providers; 7 auth modes incl. Codex OAuth import (`~/.codex/auth.json` exists — the only zero-secret credential path); tri-state reasoning caps; `--reasoning` enum matches repo `REASONING_EFFORTS` exactly. |
| 3 | Fan-out fitness | 0.85 | `cli-hermes` maps onto all executor tables; `HERMES_AGENT`/`HERMES_SESSION_ID` are inherited self-invocation markers; `--profile` sets `HERMES_HOME` pre-import but drops credentials; `--worktree` writes inside the repo (containment hazard); `-t` gives per-dispatch toolset/web control. |
| 4 | Seven-runtime comparison | 0.75 | Full matrix: Hermes is richest on hooks/profiles/in-agent budget; weakest on repo-local config (none exists), ambient injection (SOUL+memory+session_search), and stock `delegation` toolset enabled. |
| 5 | Recommendation + phase plan | 0.60 | R1–R9 ranked recommendations each naming its prevented failure; phases 002–005; UNKNOWN register U1–U6. |

## Top-line answers to the four research questions

1. **Headless dispatch target**: `hermes chat -Q --query-file <prompt> --yolo --run-budget <T> --max-turns <N> --source tool --in <repo> </dev/null`. Response-only stdout, session id on stderr, hard `os._exit` exit codes. Never `-z` (un-auditable).
2. **Providers/config/skills/agents/commands/hooks/plugins/MCP vs the six**: richer on providers (~35), hooks (~40 events, consent-gated), plugins (full Python), isolation (profiles); weaker on repo-local config (absent), ambient injection (heaviest), and MCP is home-scoped only.
3. **Deep-loop fan-out fitness**: fit, with mitigations — explicit `-t` toolset list stripping `delegation`+`memory`, no `--worktree`, `--run-budget` < runner `timeoutSeconds`, not `SELF_PRESENCE_EXEMPT`, env prefixes `HERMES_` + rostered providers.
4. **Phase plan**: 002 contract pin + live smoke (gates everything) → 003 executor tables + `buildHermesLineageCommand` → 004 `cli-hermes` packet → 005 optional profile-per-lineage, terminal-backend sandbox, non-leaf delegation.

## Evidence base

- **Live commands** (all read-only, stdin closed): `hermes --help`, `chat --help`, `status`, `tools list`, `hooks list`, `mcp list`, `config show`. No smoke dispatch — `hermes status` reported no configured provider, so the pre-condition was unmet.
- **Installed source** (`~/.hermes/hermes-agent` @ v0.21.1): `_parser.py`, `main.py`, `cli.py`, `oneshot.py`, `agent_init.py`, `shell_hooks.py`, `plugins.py`, `mcp_tool_config.py`, `models_catalog_static.py`, `models_reasoning_caps.py`, `auth.py`, `hermes_cli/AGENTS.md` — all cited file:line in iterations.
- **Repo side**: `executor-config.ts:1-130`, `executor-audit.ts:75-153`, `resource-map.md` §9, six sibling runtime packets.
- No web fetches were needed beyond documented help output; no mutating commands were run; no writes outside the lineage directory.

## Residual UNKNOWNs (hand-off to phase 002)

U1 live `chat -Q` end-to-end (gating) · U2 `--run-budget` expiry stderr signature · U3 `delegate_task` internals (auto-approve/timeout/flag inheritance) · U4 definitive project-`.hermes` discovery depth · U5 `prompt-size`/`--max-turns` interplay · U6 plugin-supplied MCP under `--safe-mode`.

## Scope record

All artifacts written inside `research/lineages/swe2/` only: config, strategy, state.jsonl (13 records), 5 iterations, 5 deltas, research.md, findings-registry.json, deep-research-dashboard.md. Zero out-of-scope writes; zero nested dispatches; every iteration executed inline in this session.
