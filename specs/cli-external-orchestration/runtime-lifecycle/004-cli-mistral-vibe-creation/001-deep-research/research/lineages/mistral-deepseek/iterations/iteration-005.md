# Iteration 5: Angle 5 — skills, slash commands and subagents

## Focus

What skill format Vibe loads and from where, and how its slash-command skills and custom subagents map onto this repository's skills, commands and agent directories.

## Actions Taken

1. Read the skill metadata model (`core/skills/models.py`) for the frontmatter contract and the `user-invocable` / `disable-model-invocation` pair.
2. Read the skill manager's search-path computation and claimant order (`core/skills/manager.py`).
3. Read the `task` tool (`core/tools/builtins/task.py`) for the subagent invocation contract, allowlist and denylist.
4. Read the subagent bounds and agent filters from the captured config schema (`max_subagents`, `max_concurrent_subagents`, `enabled_agents`, `enabled_skills`, `disabled_skills`, `enable_subagents`).
5. Read the ACP command controller to confirm that user-invocable skills are emitted as slash commands beside the ten builtins.

## Findings

1. A skill is a directory holding `SKILL.md`, and its frontmatter is the Agent Skills shape: `name` (lowercase letters, digits and hyphens, ≤64 chars), `description` (≤1024), `license`, `compatibility`, `metadata`, `allowed-tools`, `user-invocable` and `disable-model-invocation`. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:33-80]

2. Skill discovery order is: directories named by the `skill_paths` config list, then the project skill directories (`.vibe/skills`, `.agents/skills`), then the user directories (`$VIBE_HOME/skills`, `~/.agents/skills`), then plugin skills, then optional registry skills. The first claimant of a name wins and every later one is recorded as shadowed rather than merged. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py:225-330]

3. `user-invocable` (default `true`) is exactly the switch that turns a skill into a slash command: when false the skill is model-only, hidden from the slash menu and not invocable as `/skill-name`. That is the whole mechanism behind "slash-command skills". [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py:72-78]

4. `enabled_skills` and `disabled_skills` are glob-or-`re:` filters, and `enabled_skills` wins outright when set — so a governed mode can pin a closed skill roster the same way it pins a model roster. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json]

5. A subagent is an agent profile with `agent_type = "subagent"`, invoked through the `task` tool. The tool's `agent` argument defaults to `explore` and is gated by an allowlist whose default is exactly `[explore]` plus a denylist of glob patterns. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py:15-35]

6. Subagent concurrency is bounded by config, not by the prompt: `enable_subagents` (default true), `max_subagents` (32 alive at once) and `max_concurrent_subagents` (32 running a turn at once). A spawn past either bound fails until a slot frees. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json]

7. `enabled_agents` is a glob-or-`re:` allowlist over agent names, and `installed_agents` records which opt-in builtins have been installed — so an agent roster is expressible the same way a skill roster is. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json]

8. Mapping to this repository is therefore: `.skilled/skills/**/SKILL.md` → a `.vibe/skills/<name>` symlink farm (the `.dsh/skills` pattern); `.skilled/commands/*.md` → skills, because there is no command-file format to mirror into; and `.opencode/agents/*.md` → `.vibe/agents/*.toml`, with `agent_type = "subagent"` for the personas that are only ever dispatched. [INFERENCE: based on findings 1-7 and the `.dsh/SYNC.md` mirror taxonomy]

## Ruled Out

- Mirroring `.skilled/commands/` into a `.vibe/commands/` directory: no such directory is read anywhere in the discovery code, and the slash-command registry is a closed builtin set plus skills.
- Assuming a same-name skill merges across scopes: the manager shadows the loser, so a project skill cannot extend a global one.

## Dead Ends

- Determining whether the 32-subagent default is a hard ceiling or a soft one under load. It is a config field with a documented failure mode ("a spawn beyond this fails"), so the answer is "hard until raised", and no live multi-subagent run was in budget.

## Edge Cases

- Ambiguous input: "slash-command skills" could mean skills invoked as commands or commands implemented as skills. They are the same thing here — `user-invocable` is the flag — so the two readings collapse.
- Contradictory evidence: none.
- Missing dependencies: no `.vibe/skills` farm exists, so discovery was read, not exercised. Fallback: the manager code is definitive about order and shadowing.
- Partial success: format, discovery, invocation and bounds are confirmed; the symlink farm is designed but not built. Status `complete` for the angle.

## Sources Consulted

- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/controller.py`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json`
- `.dsh/SYNC.md`

## Questions Answered

- What skill format does Vibe load and from where, and how do its slash-command skills and custom subagents map onto this repository's skills, commands and agent directories? — Answered.

## Questions Remaining

- Whether a symlinked `.vibe/skills/<name>` keeps the configured directory name in skill metadata, which matters for provenance in a generated farm.

## Assessment

- New information ratio: 1.0
- Questions addressed: Angle 5 (skills, slash commands, subagents)
- Questions answered: 5 of 8 strategy key questions

## Reflection

- What worked and why: reading `manager.py`'s claimant order rather than only the model. The frontmatter tells you what a skill *is*; the claimant order tells you which one you actually get, which is the part a mirror can silently break.
- What did not work and why: looking for a command directory. There is none, so the search produced a negative that had to be confirmed from the registry instead of from a path constant.
- What I would do differently: treat "no such directory" as a first-class finding earlier. Two of this iteration's four most useful facts are absences, and absences need the same citation discipline as presences.

## Recommended Next Focus

Angle 6: hooks and safety — the seven hook events, whether a hook can block a tool call, whether the eight repo guards the DeepSeek Harness plugin carries can be expressed there, and Vibe's approval and sandbox modes.
