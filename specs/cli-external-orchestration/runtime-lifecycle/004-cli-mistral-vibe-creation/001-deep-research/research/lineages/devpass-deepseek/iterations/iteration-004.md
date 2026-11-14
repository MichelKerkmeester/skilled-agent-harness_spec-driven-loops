# Iteration 4: feature parity with cli-opencode

## Focus

Angle 4: for each OpenCode surface this repository actually uses, does Vibe have an equivalent, a partial one or none, and what would porting take. The comparison used the repository's `.opencode/` tree (agents, commands, hooks, plugins, skills) as the OpenCode side and Vibe 3.1.2's plugin, hook, agent, skill, MCP and permission modules as the Vibe side.

## Findings

1. Executable OpenCode plugins have no Vibe equivalent. Vibe's plugin unit is a declarative `plugin.json` package, and its OpenCode adapter imports only portable Agent Skills and declarative MCP servers from an OpenCode package; OpenCode executables and custom tools are retained as package data and "never imported or evaluated" (`foreign_code_execution_unsupported`, `opencode_executable_tool_unsupported`). Porting the repository's 21 JavaScript plugins therefore means rewriting each as a Vibe artifact, not packaging them. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_foreign.py:53-129,293-340] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_native.py:924-947]

2. Hook surface: Vibe declares seven hook types — `post_agent`, `pre_tool`, `post_tool`, `pre_agent`, `notification`, `session_start`, `session_end` — declared in `.vibe/hooks.toml` or `~/.vibe/hooks.toml`, with `strict` blocking allowed only on `pre_tool`, `post_tool` and `pre_agent`. The repository's plugins key off `tool.execute.before`/`after` and `session.*` events, so only the tool pair maps cleanly. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:19-41,80-100] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py:140-143]

3. Spec gate: partial. A strict `pre_tool` hook runs a command before a tool executes and can block it, which is the same enforcement point the OpenCode spec gate uses, but the port needs a hook script plus a TOML declaration and the hook payload contract is not the OpenCode `tool.execute.before` shape. Porting cost: medium per guard. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:28-41] [SOURCE: .opencode/plugins/system-spec-gate.js]

4. Dispatch preflight hooks: partial, same mechanism as the spec gate. Vibe has `pre_tool` and `pre_agent`; the repository's dispatch audit and preflight plugins would become hook commands, and their per-dispatch state files would have to move under `.vibe/` or the packet. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:19-41] [SOURCE: .opencode/plugins/cli-dispatch-audit.js]

5. Session-relaunch loop: none. The repository's relaunch plugin depends on `session.idle`, `session.compacted` and `session.resumed`; Vibe's hook set has `session_start`/`session_end`, `notification` and `post_agent`, with no idle, compaction or resume event. A Vibe port would need an external supervisor reading `export.json` outcomes rather than an in-process hook. Porting cost: high, and the loop's trigger semantics change. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:19-41] [SOURCE: .opencode/plugins/session-relaunch.js]

6. Goal and context bridges: partial. Context injection has a native equivalent (user and project `AGENTS.md` plus `.vibe/prompts`), but no goal-state surface exists, and the repository's goal plugin writes and reads a packet `goal.md` through OpenCode tool hooks. Porting cost: medium for context, high for goal state. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/system_prompt.py:278-321] [SOURCE: .opencode/plugins/opencode-goal.js]

7. Slash commands: none. There is no `.vibe/commands` discovery; `.vibe/prompts` is a prompt-template directory resolved by `system_prompt_id`/utility prompt ids, not a user-invoked command catalogue with `$ARGUMENTS` substitution. Commands would have to become skills or prompts. Porting cost: high for the repository's command tree. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py:28-104] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/prompts/__init__.py:63-100]

8. Custom agents: partial. Vibe has the concept and the roster: TOML profiles with `display_name`, `description`, `safety`, `agent_type`, `instructions` and arbitrary config `overrides`, discovered from `.vibe/agents`, `~/.vibe/agents` and `agent_paths`. The repository's agents are markdown with YAML frontmatter, so a renderer must map body→`instructions` and frontmatter→fields. Porting cost: low-medium per agent. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py:33-80]

9. Skills: equivalent. Vibe parses YAML-frontmatter markdown (`parse_skill_markdown`) and discovers skills from `skill_paths`, `.vibe/skills` and `.agents/skills`, with enable/disable patterns. The repository's `SKILL.md` convention is the same format, so pointing `skill_paths` at `.skilled/skills` is the lowest-cost port in the whole comparison. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/parser.py:116-153] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:934-960]

10. MCP: equivalent. Vibe configures MCP servers as stdio or streamable-HTTP with static auth or OAuth and exposes their tools to the model; the repository's MCP routing plugin has no Vibe analogue, but the server contract itself ports by config. Porting cost: low. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:225-260] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/auth/mcp_oauth.py:1-40]

11. MCP Code Mode: none. Vibe's builtin tool set is bash, edit, grep, read_file, write_file, skill, task, todo, web_fetch, web_search and ask_user_question; there is no script/execute/notebook tool that would run TypeScript over MCP tools the way the repository's Code Mode does. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins (directory listing)]

12. Permissions and the self-invocation guard: partial. Vibe has per-tool settings, approval agents with `SAFE`/`NEUTRAL`/`DESTRUCTIVE`/`SMART`/`YOLO` safety levels, `enable_auto_approve`, `bypass_tool_permissions` and a sandbox, which covers the permission model; a nested-CLI refusal would be a strict `pre_tool` hook rather than a dedicated guard. Porting cost: low for permissions, medium for the guard. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/agents.py:6-18] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:900-932]

## Parity Table

| OpenCode surface | Vibe equivalent | Verdict | Porting cost |
|---|---|---|---|
| JS plugins (`tool.execute.*`, `session.*`) | declarative `plugin.json`; OpenCode adapter imports skills+MCP only | none | high: rewrite each guard |
| Spec gate | strict `pre_tool` hook | partial | medium |
| Dispatch preflight | `pre_tool` / `pre_agent` | partial | medium |
| Session-relaunch loop | no idle/compact/resume events | none | high; needs external supervisor |
| Goal and context bridges | `AGENTS.md` + `.vibe/prompts`; no goal state | partial | medium / high |
| Slash commands | no `.vibe/commands`; prompts are templates | none | high |
| Custom agents | TOML profiles + `agent_paths` | partial | low-medium |
| Skills | same YAML-frontmatter markdown | equivalent | low |
| MCP | stdio/HTTP + OAuth config | equivalent | low |
| Code Mode | no execute/script tool | none | high |
| Permissions | per-tool settings + approval agents | partial | low |
| Self-invocation guard | strict `pre_tool` hook | partial | medium |

## Ruled Out

- Packaging the repository's `.opencode/plugins/*.js` as a Vibe plugin and expecting them to run: `_foreign.py` refuses executable OpenCode components by design.
- Mapping `session.compacted`/`session.idle` onto `post_agent`: the event timing and payload differ, so the relaunch loop's idempotency and context-withdrawal logic would not carry over.

## Dead Ends

- Looking for a Vibe command-markdown directory: none exists, and `.vibe/prompts` is resolved by prompt id, not by user invocation.
- Looking for a Code Mode equivalent among builtin tools: the tool list has no script/execute member.

## Edge Cases

- Ambiguous input: "plugins" could mean Vibe's native plugin packages or the repository's OpenCode plugins. Compared both, and the verdict differs sharply: native packages are a real surface, OpenCode JS plugins are not portable.
- Contradictory evidence: Vibe's binary changelog string says hooks are "three types" (`post_agent`, `pre_tool`, `post_tool`) while `hooks/models.py` declares seven. Resolution: the changelog describes the stable core three; the model also carries host-fired `notification`, `session_start`, `session_end` and an engine `pre_agent`. Both are cited; the seven-value enum is treated as the contract.
- Missing dependencies: no live `plugin inspect` run was attempted, so adapter behaviour is read from source rather than observed.
- Partial success: the table is complete for the named surfaces; per-guard payload compatibility remains unverified.

## Sources Consulted

- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_foreign.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_native.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/parser.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/agents.py
- .opencode/plugins (repository plugin tree)
- .opencode/agents (repository agent tree)

## Assessment

- New information ratio: 1.0
- Questions addressed: For each cli-opencode surface this repository uses, does Vibe have an equivalent, a partial equivalent or none, and what would porting take?
- Questions answered: For each cli-opencode surface this repository uses, does Vibe have an equivalent, a partial equivalent or none, and what would porting take?

## Reflection

- What worked and why: reading `_foreign.py` before designing the table settled the biggest question immediately — Vibe deliberately refuses executable OpenCode plugins — and prevented a table full of optimistic "partial" verdicts.
- What did not work and why: trying to find a slash-command directory. The absence is the finding, and it only surfaced by reading the discovery function rather than the feature docs.
- What I would do differently: pull the exact hook payload schema before grading the spec-gate port; the verdict (partial) is safe, but the per-guard cost is the least-grounded number in the table.

## Recommended Next Focus

Angle 5: skills, slash commands and subagents. Read `core/skills/registry` and `core/skills/manager.py` for the skill format and invocation surface, then map `.skilled/skills` and `.opencode/agents` onto Vibe's skill tool and `task` subagent tool.
