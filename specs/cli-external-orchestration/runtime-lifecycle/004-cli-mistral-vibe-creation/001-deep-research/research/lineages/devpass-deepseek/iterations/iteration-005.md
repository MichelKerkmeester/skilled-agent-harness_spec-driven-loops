# Iteration 5: skills, slash commands and subagents

## Focus

Angle 5: what skill format Vibe loads and from where, and how its slash-command skills and custom subagents map onto this repository's skills, commands and agent directories. While tracing the subagent surface this iteration also found and corrected an Angle 4 claim about Code Mode.

## Findings

1. The skill format is YAML frontmatter plus a markdown body, parsed by `parse_skill_markdown` into `SkillMetadata`: `name` (lowercase letters, digits and hyphens, max 64), `description` (max 1024), optional `license`, `compatibility`, `metadata`, `allowed-tools`, `user-invocable` and `disable-model-invocation`. The repository's `SKILL.md` files already use this shape. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:45-90] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/parser.py:116-153]

2. Skills are both model-invoked and user-invoked. The `skill` tool loads a named skill's full `<skill_content>` block plus a sample of its supporting files, and `user-invocable: false` hides a skill from the slash menu while `disable-model-invocation: true` makes it user-only. So **user-invocable skills are Vibe's slash commands** (`/skill-name`), which supersedes the narrow reading that Vibe has no slash-command surface. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/skill.py:35-45,60-95] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:72-90,100-135]

3. Discovery order is computed, not directory-walk order: `skill_paths` first (global scope), then project `.vibe/skills` and `.agents/skills`, then user-level skill dirs, deduped by resolved path; the first claimant of a name wins and the loser is reported as shadowed. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py:228-275]

4. Registry skills are an opt-in second source: `experimental_enable_registry_skills` pulls shared workspace skills from Mistral with version pins and a reserved `latest` alias, materialised on disk and loaded beside local skills. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:14-36] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:967-984]

5. Subagents are a first-class tool: `task(task, agent="explore")` runs a specialized subagent and returns `{response, turns_used, completed}`; the tool has a permission `allowlist` that defaults to `explore` and a `denylist`, so an executor must allow each custom agent explicitly. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py:15-60]

6. The subagent roster is the agent-profile roster filtered by `agent_type = "subagent"`, bounded by `enable_subagents` (default true), `max_subagents` (32) and `max_concurrent_subagents` (32). A governed fan-out pinning many subagents is therefore capped by config, not by the dispatch flag. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:1143-1162] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py:28-80]

7. Repository skills map with near-zero effort: point `skill_paths` at `.skilled/skills`, because every skill there is a `SKILL.md` with YAML frontmatter. Extra repository frontmatter keys (`trigger_phrases`, `importance_tier`) are tolerated as `metadata`, and names such as `sk-code` satisfy the name pattern. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:45-68] [INFERENCE: based on the `.skilled/skills/*/SKILL.md` frontmatter read in earlier iterations and the parser's permissive metadata handling]

8. Repository commands do **not** map one-to-one: `.opencode/commands/**/*.md` are argument-taking slash commands with `$ARGUMENTS` substitution, while Vibe's user-invocable unit is a skill whose body is instructions and has no documented argument placeholder. Converting a command to a skill preserves the workflow but loses argument interpolation. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:72-90] [SOURCE: .opencode/commands]

9. Repository agents map with a renderer: body → `instructions`, frontmatter → `display_name`/`description`/`safety`, and deep-loop or review leaves get `agent_type = "subagent"` plus an entry in the `task` tool allowlist. The `main` name is reserved for hook matching and may not be used by a profile. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py:33-80]

10. Correction to Angle 4: Vibe **does** have a Code Mode equivalent. `run_typescript` is a runtime builtin program tool; calls a program makes carry `parent_call_id` pointing at the `run_typescript` call, and tool descriptions tell the model to page through data "from a `run_typescript` program as `tools.vibe.list_sessions`" and to reach subagents as `tools.subagent`. Iteration 4's "Code Mode: none" verdict is superseded by "equivalent, low-medium porting cost". [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_session_peers.py:40-70] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/protocol.py:1074-1093]

## Ruled Out

- Treating the absence of `.vibe/commands` as proof that Vibe has no slash commands: user-invocable skills are the slash surface, so the correct verdict is "commands map to skills, without `$ARGUMENTS`".
- Reading the `task` tool as an unrestricted subagent dispatch: its default allowlist contains only `explore`, so a custom subagent is invisible until the allowlist names it.

## Dead Ends

- Searching for a command-argument templating feature in the skill parser: there is no `$ARGUMENTS` or equivalent placeholder in `SkillMetadata` or the skill tool.
- Searching the builtin tool directory for a Code Mode tool: `run_typescript` lives in the Unified Harness runtime, not in `core/tools/builtins`, which is why the first pass missed it.

## Edge Cases

- Ambiguous input: "slash-command skills" could mean builtin TUI commands or user-defined commands. Resolved as user-invocable skills, since that is the only user-extensible slash surface.
- Contradictory evidence: two claims about skill precedence. `_compute_search_paths` puts `skill_paths` first and `_discover_skills` keeps the first claimant, while the registry-skill config text says project skills win over global ones. Unresolved; the smallest next check is a two-skill collision fixture across `skill_paths` and `.vibe/skills`.
- Missing dependencies: no live `/skill-name` invocation was observed, so the slash-menu behaviour is source-documented, not observed.
- Partial success: the format and discovery contract are fully answered; command-argument loss and precedence are named gaps.

## Sources Consulted

- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/parser.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/skill.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_session_peers.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/protocol.py
- .opencode/commands
- .skilled/skills

## Assessment

- New information ratio: 0.95
- Questions addressed: What skill format does Vibe load, and from where? How do its slash-command skills and custom subagents map onto this repository's skills, commands and agent directories?
- Questions answered: The question as scoped in the strategy covers both halves; answered, with the `$ARGUMENTS` gap and the precedence contradiction named rather than smoothed over.

## Reflection

- What worked and why: reading the skill model's field descriptions answered the slash-command question that Angle 4 got wrong, because `user-invocable` explicitly names `/skill-name`.
- What did not work and why: searching `core/tools/builtins` for a TypeScript tool. Code Mode lives in the harness package, so the first verdict was a false negative that only surfaced while reading the `task` tool's neighbours.
- What I would do differently: when a verdict is "none", search the harness package and the binary strings before recording it; the strongest correction of this run came from that gap.

## Recommended Next Focus

Angle 6: hooks and safety. Read `core/hooks` plus the Claude/Kimi hook adapters, the sandbox and protected-path modules, and attempt one live `vibe --help`-safe probe of the hook docs URL to confirm the documented hook contract.
