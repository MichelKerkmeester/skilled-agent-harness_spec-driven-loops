# Iteration 3: configuration and the repo-local runtime folder

## Focus

Angle 3: what Vibe reads from the working directory and from `~/.vibe/`, and what a repo-root `.vibe/` folder would contain if this repository generated one the way it generates `.pi/`, `.dsh/` and `.opencode/`.

## Findings

1. The project config root is `.vibe/config.toml`. Vibe starts at the working directory and walks up parents until it finds a trusted `.vibe/config.toml`; an untrusted project config is ignored unless the dispatch passes `--trust`. That makes trust a per-dispatch gate for project configuration, not a one-time install setting. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/project.py:14-25,44-70]

2. Project-local discovery is explicit and non-recursive. `find_local_config_dirs` inspects only the project root and collects `.vibe/tools/`, `.vibe/skills/`, `.vibe/plugins/`, `.vibe/agents/`, `.vibe/prompts/`, `.vibe/config.toml`, plus `.agents/skills/`. There is no `.vibe/commands/` directory in the discovery set. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py:28-104]

3. Configuration is a layered stack: `user-toml` (`~/.vibe/config.toml`), `user-supplied`, `project-toml`, `environment` (`VIBE_*`), and session `overrides`, with an agent-profile layer allowed to change settings but forbidden from touching the three credential-routing base URLs (`vibe_base_url`, `console_base_url`, `vibe_code_sessions_base_url`) so an untrusted checkout cannot redirect a key. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/agent_profile.py:20-44]

4. `AGENTS.md` is a real instruction surface on both levels: `$VIBE_HOME/AGENTS.md` is the user doc, and project docs are collected by walking up from the working directory to the open project root, outermost first, then rendered as one prompt section; a subdirectory `AGENTS.md` is injected lazily when a file below it is read. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/system_prompt.py:278-321] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py:200-270]

5. Custom agents are TOML profiles: `--agent NAME` resolves a builtin (`ask`, `accept-edits`, `smart-approve`, `auto-approve`) or `~/.vibe/agents/NAME.toml`, `.vibe/agents/` is discovered at the project root, `agent_paths` adds more directories, and `default_agent` defaults to `accept-edits` in both interactive and programmatic mode. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:46-47] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:876-910]

6. Skills load from `skill_paths` plus the discovered `.vibe/skills` and `.agents/skills`, filtered by `enabled_skills`/`disabled_skills` glob or `re:` patterns; the experimental registry mode pulls shared skills from Mistral and lets the project's skill win on a name collision. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:934-984]

7. The global home is a fixed tree: `$VIBE_HOME` holds `config.toml`, `AGENTS.md`, the global `.env`, `logs/` and `logs/session/`, `worktrees/`, `trusted_folders.toml`, `cache.toml`, `projects.toml`, `whoami_cache.json`, `model_catalog_cache.json` and the history file. None of these are repo-local, which is why a repo mirror must live in `.vibe/` rather than assume home-directory state. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_vibe_home.py:16-45]

8. Repo-mirror shape: today `.opencode/` carries `agents/`, `commands/`, `hooks/`, `plugins/`, `skills/`, `repo-rules/`, `scripts/` and `bin/`. The Vibe equivalent that discovery actually honours is `.vibe/config.toml` (providers, models, `default_agent`), `.vibe/agents/*.toml` (rendered from `.opencode/agents/*.md` and `.skilled/agents/*.md`), `.vibe/skills/` (rendered from `.skilled/skills/`), `.vibe/plugins/` (Vibe plugin format), `.vibe/prompts/` and `.vibe/tools/`. Command markdown has no `.vibe/commands/` counterpart and would have to become prompts or skills. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py:28-104] [INFERENCE: based on this repository's `.opencode/` directory listing and Vibe's documented discovery set]

## Ruled Out

- Assuming a `.vibe/commands/` directory: it is absent from `find_local_config_dirs`, so slash commands cannot be mirrored by dropping markdown into a commands folder.
- Assuming project config applies by presence: `ProjectConfigLayer` requires trust, so the repo mirror must also be trusted per worktree (`--trust`) or it is inert.

## Dead Ends

- Searching for a project-local plugin config file separate from `.vibe/config.toml`: plugin enablement (`enabled_plugins`/`disabled_plugins`) lives in the same layered config, so there is one config file to render, not two.

## Edge Cases

- Ambiguous input: "project config" could mean `.vibe/config.toml` or `AGENTS.md`. Both are project surfaces; recorded separately because they have different trust and merge behaviour.
- Contradictory evidence: none.
- Missing dependencies: no `.vibe/` exists in this repository yet, so the mirror shape is derived from the discovery code, not from a live rendered tree. Marked inference where it extrapolates.
- Partial success: the read side is fully answered; the generated-mirror contents are a design inference from the read side plus this repository's existing runtime folders.

## Sources Consulted

- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_vibe_home.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/conventions.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/project.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/agent_profile.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/system_prompt.py
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt
- .opencode (repository runtime tree)

## Assessment

- New information ratio: 1.0
- Questions addressed: What does Vibe read from the working directory and ~/.vibe/, and what would a generated repo-root .vibe/ mirror contain?
- Questions answered: What does Vibe read from the working directory and ~/.vibe/, and what would a generated repo-root .vibe/ mirror contain?

## Reflection

- What worked and why: `find_local_config_dirs` is the single function that answers "what does Vibe read at the project root", and reading it beat assembling the answer from individual loaders.
- What did not work and why: looking for a commands directory. Vibe 3.x has prompts and skills, not slash-command markdown, so the OpenCode command surface has no direct mirror path.
- What I would do differently: pair every "Vibe reads X" claim with the exact discovery function, because several directories (`.agents/skills`) are easy to miss and change the mirror design.

## Recommended Next Focus

Angle 4: feature parity with cli-opencode. Build the parity table surface by surface, starting with the plugin, agent, command, skill, MCP and permission surfaces already located, then read `.opencode/plugins/` for the hook behaviours each plugin carries.
