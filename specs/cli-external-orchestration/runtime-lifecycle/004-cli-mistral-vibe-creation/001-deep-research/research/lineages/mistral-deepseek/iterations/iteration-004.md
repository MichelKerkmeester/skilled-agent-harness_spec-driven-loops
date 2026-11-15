# Iteration 4: Angle 4 — feature parity with cli-opencode

## Focus

For each OpenCode surface this repository uses, state whether Vibe has an equivalent, a partial one or none, and what porting it would take: plugins under `.opencode/plugins/`, the spec gate, the dispatch preflight hooks, the session-relaunch loop, the goal and context bridges, slash commands, custom agents, skills, MCP and Code Mode, permissions, and the self-invocation guard.

## Actions Taken

1. Inventoried the repository's OpenCode surfaces: 24 plugin files under `.opencode/plugins/`, the hook concern folders under `.opencode/hooks/`, the `.opencode/commands/` symlink farm into `.skilled/commands/`, and 11 agent personas under `.opencode/agents/`.
2. Read Vibe's plugin model (`core/plugins/_catalog.py`, `_paths.py`, the built-in `plugin.json`) for what a plugin can actually declare.
3. Read the hook model (`core/hooks/models.py`) for event types and blocking semantics.
4. Read the slash-command registry (`acp/commands/registry.py`, `controller.py`) for the built-in command set and how skills surface as commands.
5. Read the programmatic tool-calling configuration (`mistralai_vibe_local_harness/.../configuration.py`) for the Code Mode analogue.
6. Read the skill metadata model (`core/skills/models.py`) for the skill frontmatter contract.

## Findings

1. **Plugins.** OpenCode plugins are JavaScript modules that subscribe to runtime events and can mutate or block behaviour; this repository ships 24 of them. A Vibe plugin is a declarative `plugin.json` bundle that may contribute skills, MCP servers, connectors and hook definitions, but not arbitrary event-handler code. **Parity: partial.** Porting means re-expressing each plugin as either a hook command (for block/allow behaviour) or a skill (for injected instructions); anything that needs to inspect or rewrite tool arguments in process has no home. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_catalog.py:1-20]

2. **Spec gate.** `system-spec-gate.js` blocks a write that has no spec folder. Vibe has no built-in spec concept, but a `pre_tool` hook with `strict = true` can block a tool call, and `strict` is explicitly allowed for `pre_tool`, `post_tool` and `pre_agent`. **Parity: partial — mechanism exists, gate must be authored.** [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:20-40]

3. **Dispatch preflight hooks.** `cli-dispatch-audit.js` and `system-dist-freshness-guard.js` are the same shape as the spec gate: a pre-tool or pre-agent command hook that can refuse. **Parity: partial — same authoring cost, and the hook runs as an external command with a 60 s default timeout.** [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:57-80]

4. **Session-relaunch loop.** `session-relaunch.js` drives a fresh turn boundary inside one OpenCode session. Vibe instead offers session primitives: `--continue`, `--resume [SESSION_ID]`, `session/fork`, `session/relocate`, `session/move`, and `--worktree` for an isolated checkout. **Parity: partial.** A relaunch loop is expressible as an outer driver over repeated `vibe -p --resume` calls, not as an in-session hook. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:22-26]

5. **Goal bridge.** `opencode-goal.js` injects and tracks a session goal. Vibe has no goal object, no goal file, and no hook that rewrites the prompt. **Parity: none.** Porting means carrying the goal in `AGENTS.md` or in the prompt text and re-injecting it on every dispatch. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py:222-300]

6. **Context bridge.** `session-history-lookup.js` reaches back into prior session history. Vibe exposes session history through the app-server (`session/history/list`, `session/history/get`, `session/turns/list`) and through `--resume`, and it loads `AGENTS.md` plus a project-context block automatically. **Parity: partial** — the data exists, but only a protocol client can read it, not a CLI dispatch. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/protocol.py:827-899]

7. **Slash commands.** This repository's commands are markdown files under `.skilled/commands/`, symlinked into `.opencode/commands/`. Vibe's slash commands are a closed built-in set — `help`, `compact`, `reload`, `log`, `mcp`, `proxy-setup`, `retry`, `leanstall`, `unleanstall`, `data-retention` — plus every skill marked user-invocable. There is no user-authored command file format. **Parity: partial.** A command becomes a skill with the same body; commands that need argument templating have no direct equivalent. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/registry.py:53-105]

8. **Custom agents.** `.opencode/agents/*.md` are markdown personas with frontmatter. Vibe agent profiles are TOML with `name`, `description`, `safety`, `agent_type` (`agent` or `subagent`), `overrides` and `instructions`. **Parity: equivalent, different serialization.** Porting is a mechanical markdown-to-TOML transform, with the caveat that `safety` and `overrides` have no OpenCode counterpart and must be chosen deliberately. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py:17-52]

9. **Skills.** Vibe's skill metadata is the Agent Skills shape: `name` (lowercase-hyphen, ≤64), `description` (≤1024), `license`, `compatibility`, `metadata`, `allowed-tools`, `disable-model-invocation`. `.skilled/skills/**/SKILL.md` files already carry that frontmatter. **Parity: equivalent.** Porting is a symlink or copy farm, exactly as `.dsh/skills` and `.opencode/skills` already do. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:33-70]

10. **MCP and Code Mode.** MCP is a first-class config surface (`mcp_servers`, plus a `vibe mcp` subcommand). Code Mode has a direct analogue: `programmatic_tool_calling` defaults to true and exposes `run_typescript`, `search_tool_functions` and a `tools.<group>` catalog, with subagents exposed as `tools.agents`. **Parity: equivalent.** [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py:85-110]

11. **Permissions.** OpenCode's permission block is per-tool allow/ask/deny with path patterns. Vibe has agent `safety` levels (`safe`, `neutral`, `destructive`, `smart`, `yolo`), per-tool config blocks, an `outside_workdir` policy of `ask` or `deny`, path-grant allowlisting, and a global `bypass_tool_permissions`. **Parity: partial** — the primitives are there but they are configured per tool rather than as one matrix. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/permissions.py:41-49]

12. **Self-invocation guard.** This repository guards against a runtime dispatching itself. Vibe has no built-in guard; a `pre_tool` strict hook that inspects the command line for `vibe -p` would express it. **Parity: none built in, partial by hook.** [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:20-40]

### Parity table

| Surface | OpenCode mechanism in this repo | Vibe mechanism | Parity | Porting |
|---|---|---|---|---|
| Plugins | 24 JS event-handler modules | `plugin.json` declarative bundle (skills, MCP, connectors, hooks) | Partial | Re-express as hooks or skills; no in-process argument rewriting |
| Spec gate | `system-spec-gate.js` | `pre_tool` strict hook | Partial | Author one hook command |
| Dispatch preflight | `cli-dispatch-audit.js`, dist-freshness guard | `pre_tool` / `pre_agent` strict hooks | Partial | Author hook commands |
| Session relaunch | `session-relaunch.js` | `--continue`, `--resume`, `session/fork`, `--worktree` | Partial | Outer driver over repeated dispatches |
| Goal bridge | `opencode-goal.js` | none | None | Carry the goal in `AGENTS.md` or prompt text |
| Context bridge | `session-history-lookup.js` | session history API + `AGENTS.md` + project context | Partial | Protocol client for history reads |
| Slash commands | `.skilled/commands/*.md` symlinked | 10 built-ins + user-invocable skills | Partial | Commands become skills |
| Custom agents | `.opencode/agents/*.md` | `.vibe/agents/*.toml` | Equivalent | Mechanical transform |
| Skills | `.skilled/skills/**/SKILL.md` | same Agent Skills frontmatter | Equivalent | Symlink farm |
| MCP | `.utcp_config.json` + code-mode skill | `mcp_servers` + `vibe mcp` | Equivalent | Config translation |
| Code Mode | MCP code-mode launcher | `run_typescript` + `tools.<group>` | Equivalent | None |
| Permissions | per-tool allow/ask/deny matrix | safety levels + per-tool config + `outside_workdir` + path grants | Partial | Translate the matrix |
| Self-invocation guard | repo plugin | none built in | None | `pre_tool` strict hook |

## Ruled Out

- Treating Vibe plugins as an OpenCode plugin port target. A `plugin.json` bundle cannot run arbitrary code on runtime events, so the 24 JS plugins cannot be moved as plugins; they must be reclassified into hooks and skills first.
- Assuming slash commands port one-to-one. Vibe has no user command file format, so a command with argument templating has to become a skill with a different invocation contract.

## Dead Ends

- Finding a Vibe equivalent for the goal object. There is no goal model, no goal file, and no prompt-rewriting hook; the concept has no home in 3.1.2.

## Edge Cases

- Ambiguous input: "feature parity" could mean behavioural equivalence or API equivalence. Answered behaviourally — what the surface does for this repository — and named the mechanism in each row so an API-level follow-up can re-check.
- Contradictory evidence: none.
- Missing dependencies: no Vibe plugin or hook was authored or executed, so every "partial" row is a mechanism claim, not a demonstrated port. Marked as such.
- Partial success: the surface map is complete; no port was attempted. Status `complete` for the angle.

## Sources Consulted

- `.opencode/plugins/` (directory listing), `.opencode/hooks/` (directory listing), `.opencode/commands/` (symlink listing), `.opencode/agents/` (directory listing)
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_catalog.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/registry.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/controller.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/protocol.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt`

## Questions Answered

- For each OpenCode surface this repository uses, does Vibe have an equivalent, a partial one or none, and what porting would it take? — Answered with a 13-row table.

## Questions Remaining

- Whether a `pre_tool` hook can see enough of the tool call (path, command, agent name) to express the spec gate and the self-invocation guard without a wrapper.

## Assessment

- New information ratio: 1.0
- Questions addressed: Angle 4 (feature parity with cli-opencode)
- Questions answered: 4 of 8 strategy key questions

## Reflection

- What worked and why: reading the plugin catalog and the hook model before writing any row. The distinction that decides most of the table is "can a plugin run code on an event" — no — and "can a hook block a call" — yes for three event types. Everything else follows from those two facts.
- What did not work and why: looking for `run_typescript` in the Rust binary. It is a harness-provided tool documented in the local-harness package, not a string in the CLI binary, so the binary search was the wrong place.
- What I would do differently: build the parity table from the Vibe mechanism list first and map OpenCode onto it, rather than walking the OpenCode inventory. The OpenCode side has 24 plugins and the Vibe side has four mechanisms; starting from the smaller side would have halved the mapping work.

## Recommended Next Focus

Angle 5: skills, slash commands and subagents — the exact skill format and load paths, how user-invocable skills become slash commands, and how custom subagents map onto this repository's agent directories.
