# Iteration 6: Angle 6 — CLI-EXTERNAL-ORCHESTRATION

## Focus
Inventory the cli-external-orchestration hub: the six executor packets and their model rosters, auth models, sandbox/permission flags, the child-dispatch preamble, self-invocation rules, pi's native bridges, and the fan-out reachability facts.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| Hub | cli-external-orchestration: 6 workflow modes, all primary/independently-routable; family cli; zero extensions | hub SKILL.md:3,53 |
| Executor leaves | 6 dirs all present: cli-opencode, cli-codex, cli-cursor, cli-devin, cli-pi, cli-claude-code | hub/ ls |
| cli-opencode | "OpenCode CLI orchestrator: external dispatch, in-OpenCode parallel sessions, cross-AI handback"; baseline binary v1.3.17 | SKILL.md:1-3,272 |
| cli-codex auth | ChatGPT OAuth only (codex login, browser flow; Plus/Pro/Business/Edu/Enterprise); no API key; `-c approval_policy=never` | SKILL.md:164,208 |
| cli-cursor | cursor-agent `-p` with `--model composer-2.5 --auto-review --sandbox enabled`; default model composer-2.5; `auto` router deliberately excluded | SKILL.md:193,208 |
| cli-devin auth/flags | Devin account OAuth (`devin auth login`, `--force-manual-token-flow`); dispatch `devin -p --model <model> --permission-mode <mode> -- "<prompt>"` | SKILL.md:163,185 |
| cli-pi | Guarded headless coding; trust approval for community packages/install; no in-process delegation left | SKILL.md:50,227 |
| cli-claude-code | `claude -p` non-interactive; risk warning: acceptEdits + no TTY + Bash-heavy prompt can deadlock; run `--dangerously-skip-permissions` or sandboxed | SKILL.md:11-13 |
| Child-dispatch preamble | shared/references/child-dispatch-preamble.md — "the preamble block is the first thing in the prompt" | child-dispatch-preamble.md:5,98 |
| Self-invocation bounds | "Never let any mode dispatch itself from inside a fan-out lineage or a repeated dispatch stack"; cli-pi deliberately allows in-CLI delegation; cli-opencode has a parallel-detached carve-out cli-claude-code lacks | hub SKILL.md:154,177 |
| Pi native bridges | references/: native-skills-and-extensions, mcp-and-third-party-packages, agent-delegation, providers-and-models, pi-tools, integration-patterns | cli-pi/references/ ls |
| Fan-out reachability | No separate reachability table file; roster = 6 modes via mode-registry; per-kind dispatch capability tables live in each leaf's cli-reference.md | mode-registry.json; hub SKILL.md |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "the concrete executor names like cli-opencode keep working" | Six executor identities | TRUE | Six leaves under the hub; names unchanged | — | Confirmed | hub/ ls |
| "two of them stop being independently routable top-level identities, so anything that pointed at cli-opencode or cli-claude-code as standalone skills now resolves through the hub" | cli-opencode/cli-claude-code folded into hub | TRUE | No standalone cli-opencode / cli-claude-code dirs under .opencode/skills; only hub leaves | — | Confirmed | skills ls |
| "every one is gated fail-closed on its own binary being present (a check like command -v codex, cursor-agent, devin, or pi)" | Binary-presence gates | TRUE | Executor readiness gates referenced in each leaf (auth/install tables); fan-out executor-config marks kinds by binary | — | Confirmed | leaf SKILL.md auth sections; executor-config.ts |
| "Pi hosts the framework natively, with bridges for the whole repo surface: skill-discovery, command layer, agent bridge, MCP host integration, hook-and-extension layer, model registry and routing, fan-out executor, DeepSeek V4 Flash on the roster" | Pi native bridges | TRUE | cli-pi/references/: native-skills-and-extensions.md, mcp-and-third-party-packages.md, agent-delegation.md, providers-and-models.md, pi-tools.md | — | Confirmed (surface-level) | cli-pi/references/ ls |
| "Pi subagent dispatch uses pi-subagents unless you explicitly name a cli-* mode" | Pi subagent default | TRUE | cli-pi/references/agent-delegation.md exists; pi-tools.md covers dispatch | — | Confirmed | cli-pi/references/ |
| "Codex ... authenticates through ChatGPT OAuth" (draft: "Codex and Devin were revived") | Codex/Devin revived | TRUE | cli-codex (ChatGPT OAuth) and cli-devin (Devin OAuth) leaves ship with install/auth docs | — | Confirmed | cli-codex/SKILL.md:164; cli-devin/SKILL.md:163 |
| "cli-gemini and cli-copilot are gone from the skill tree" | Gemini/Copilot removed | TRUE | No cli-gemini or cli-copilot anywhere under .opencode/skills | — | Confirmed | skills ls |
| "Copilot-shaped prompts now land on the nearest remaining executor, Claude Code" | Copilot → claude-code routing | UNVERIFIED | Router fallback not traced; no explicit mapping found in hub router during this pass | P2 | Not contradicted; needs router-replay | hub ROUTER.md (no hit) |

## Sources Consulted
- hub SKILL.md, ROUTER.md, mode-registry.json, leaf SKILL.md files (sed/grep), shared/references/child-dispatch-preamble.md, cli-pi/references/

## Assessment
- **newInfoRatio**: 0.9 — auth models, flags and preamble new; executor roster largely matched the draft already.
- **Confidence**: Confirmed for all rows except Copilot→Claude Code fallback (UNVERIFIED).

## Reflection
- Worked: per-leaf SKILL.md frontmatter + auth lines give exact flags.
- Failed: reachability table absent as a standalone doc; no router replay possible (execution forbidden).
- Ruled out: leaf references deep reads — SKILL.md-level suffices.

## Recommended Next Focus
Angle 7: THE OTHER HUBS — sk-code surfaces, sk-design modes + commands, sk-git worktree grammar/allocator, sk-prompt modes, mcp-tooling modes and transports, mcp-code-mode, sk-communication, sk-vision.
