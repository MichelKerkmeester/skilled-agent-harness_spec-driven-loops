# Iteration 3: Angle 3 — configuration and the repo-local runtime folder

## Focus

What Vibe reads from the working directory and from `~/.vibe/` (agents as TOML, `AGENTS.md`, project config), what a repo-root `.vibe/` folder would contain, and which parts should be generated mirrors of `.skilled/` sources, as `.pi/`, `.dsh/` and `.opencode/` are.

## Actions Taken

1. Read local-config discovery (`core/paths/_local_config_files.py`) for the exact directory names Vibe inspects at a project root.
2. Read the project config layer (`core/config/layers/project.py`) for the walk-up and trust rules.
3. Read the global path table (`core/config/harness_files/_paths.py`, `core/paths/_agents_home.py`) for the `~/.vibe/` layout.
4. Read the harness-files manager (`_harness_manager.py`) for the `AGENTS.md` collection rules.
5. Read the agent-profile model (`core/agents/models.py`) and the built-in plugin manifest (`plugins/builtins/vibe/plugin.json`).
6. Read `.dsh/SYNC.md` §2 as the repository's own mirror-contract template, and listed the existing runtime mirrors at the repo root.

## Findings

1. Project config discovery looks for `.vibe/config.toml` starting at the working directory and walking up, nearest first, stopping at `VIBE_HOME`'s parent. A discovered file only applies when its directory is trusted, so the trust store is a gate on project config, not a formality. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/project.py:84-104]

2. The project-local directory set is fixed and root-only (no recursion): `.vibe/tools`, `.vibe/skills`, `.vibe/plugins`, `.vibe/agents`, `.vibe/prompts` and `.vibe/config.toml`, plus `.agents/skills` and `.agents/` itself. `.vibe/` is only treated as a config dir when it has content, a `prompts/` directory, or a `config.toml`. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py:20-27]

3. The global home mirrors that layout: `$VIBE_HOME/{tools,skills,plugins,agents,prompts,skills-registry-cache}`, `$VIBE_HOME/AGENTS.md`, `$VIBE_HOME/config.toml`, plus `~/.agents/skills`. `VIBE_HOME` is read from the environment, so a governed dispatch can point the entire home at a packet-local directory and leave the operator's `~/.vibe/` untouched. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_paths.py:1-12]

4. `AGENTS.md` is read twice over: the global `$VIBE_HOME/AGENTS.md`, and every `AGENTS.md` from the working directory up to its trust root, outermost-first so later (nearer) entries take priority. A subdirectory `AGENTS.md` is additionally injected lazily when a file below the project root is read. This repository's root `AGENTS.md` would therefore load with no extra wiring. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py:222-300]

5. An agent profile is a TOML file: `name`, `display_name`, `description`, `safety` (`safe`, `neutral`, `destructive`, `smart`, `yolo`), `agent_type` (`agent` or `subagent`), `overrides`, and `instructions`. Built-ins are `ask`, `accept-edits`, `smart-approve`, `auto-approve`, `explore` and `lean`; the name `main` is reserved for hook matching, and a profile named `main` is rejected at parse time. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py:17-52]

6. A plugin is a `plugin.json` manifest on the Agent Plugins 1.0.0 schema (`agent-plugins.org`), with a vendor extension block under `ai.mistral.vibe`, and it may ship skills as a `skills/` directory. The built-in `vibe` plugin ships five (`create-plugin`, `import`, `skill-creator`, `vibe`, `worktree`). [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/plugins/builtins/vibe/plugin.json:1-14]

7. This repository already carries seven runtime mirrors (`.opencode/`, `.pi/`, `.dsh/`, `.claude/`, `.codex/`, `.cursor/`, `.devin/`), each with a `SYNC.md` that classifies every surface as hand-authored, derived or generated. `.dsh/SYNC.md` §2 is the closest template for a `.vibe/` mirror because DSH, like Vibe, composes from a home directory plus explicit project layers. [SOURCE: .dsh/SYNC.md:1-40]

## Ruled Out

- Assuming Vibe reads a repo-root config file by default: it walks up to the trust root and stops at the home directory, and an untrusted directory's `.vibe/config.toml` does not apply. A mirror therefore needs the working directory trusted (`--trust` or the trust store) before any of it takes effect.
- Assuming `.vibe/` is recursive like `.opencode/`: discovery examines only the root, so nested `.vibe/` folders in subpackets are invisible.

## Dead Ends

- Confirming which of the seven mirrors' generation scripts would be reusable for Vibe. The scripts are per-runtime (`sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, and so on), so a Vibe mirror needs its own writers rather than a parameterised one. Out of scope for a research pass.

## Edge Cases

- Ambiguous input: "what would a repo-root `.vibe/` folder contain" could mean the minimum for a dispatch or the full mirror. Answered with the full surface map, then ranked by what a dispatch actually needs.
- Contradictory evidence: none.
- Missing dependencies: no `.vibe/` folder exists in this repository yet, so nothing could be exercised end to end. Fallback: the discovery code is definitive about what would be read.
- Partial success: the read surface is fully mapped; the generation scripts for a mirror are not designed. Status `complete` for the angle.

## Sources Consulted

- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/project.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_paths.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/plugins/builtins/vibe/plugin.json`
- `.dsh/SYNC.md`

## Questions Answered

- What does Vibe read from the working directory and from `~/.vibe/`, what would a repo-root `.vibe/` contain, and which parts should be generated mirrors of `.skilled/` sources? — Answered.

## Questions Remaining

- Whether a generated `.vibe/agents/*.toml` can carry this repository's agent personas without losing the frontmatter fields Vibe does not model.

## Assessment

- New information ratio: 1.0
- Questions addressed: Angle 3 (configuration and repo-local runtime folder)
- Questions answered: 3 of 8 strategy key questions

## Reflection

- What worked and why: reading `_local_config_files.py` before any doc. It is 96 lines and names every directory Vibe will ever look at, which turns "what would a `.vibe/` contain" from a guess into a transcription.
- What did not work and why: looking for a reusable mirror generator. Each runtime's sync scripts are bespoke, so the answer is "write one", not "reuse one" — worth knowing before a build phase estimates effort.
- What I would do differently: read `.dsh/SYNC.md` first. It already encodes the hand-authored/derived/generated taxonomy this repository expects, which would have framed the Vibe surface map in one pass instead of retrofitting it.

## Recommended Next Focus

Angle 4: feature parity with cli-opencode — the per-surface equivalent/partial/none table for plugins, the spec gate, dispatch preflight hooks, the session-relaunch loop, the goal and context bridges, slash commands, custom agents, skills, MCP and Code Mode, permissions, and the self-invocation guard.
