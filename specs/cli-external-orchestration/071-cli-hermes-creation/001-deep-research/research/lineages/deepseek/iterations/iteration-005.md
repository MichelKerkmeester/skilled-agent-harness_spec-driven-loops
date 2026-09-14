# Iteration 5: Angle 5 — Agents, commands and persona

## Focus

How the repo's 13 agents (`.claude/agents/*.md`) and nested commands
(`.opencode/commands/**/*.md`) can be reached from Hermes: as profiles, as `delegate_task`
sub-agent presets, as skills, via `hermes import-agent`, or only by inlining the persona;
what `hermes import-agent claude-code --dry-run` would map; and whether it is useful or
harmful here.

## Actions Taken

- Read `hermes_cli/agent_import.py` lines 26-32 and 286-303: `SUPPORTED_AGENTS =
  ("claude-code", "codex")`, default dirs `.claude`/`.codex`, import surface (CLAUDE.md,
  permission allow/deny, MCP servers, skills into `claude-code-imports`/`codex-imports`
  categories, memories; never credentials).
- Ran `hermes import-agent --help` (exit 0): supported agents claude-code/codex, `--source`,
  `--dry-run`, `--overwrite`, `--yes`; "API keys and credentials are never imported".
- Read `hermes_cli/profiles.py` lines 133-280 and root AGENTS.md profile rule: profiles are
  whole-home independent islands (`HERMES_HOME` scoping), not personas.
- Read `tools/delegate_tool.py` lines 1-66 and 156-262: `delegate_task` roles
  `leaf`/`orchestrator`, child system prompt built from goal + context; no persona files.
- Read `hermes_cli/commands.py` (slash registry) and `agent/skill_commands.py` (skill slash
  commands scan `~/.hermes/skills/`, inject as a user message) — from hermes_cli/AGENTS.md.
- Compared with the cli-codex and cli-pi packets (persona always inlined; 36 commands
  flattened into `.pi/prompts/*.md`).

## Findings

1. **Profiles are the wrong tool for the repo's 13 agents.** A Hermes profile is a separate
   `HERMES_HOME` — an independent island with its own config, skills, memories, sessions and
   logs (profiles.py:133-280; root AGENTS.md: "Profiles are independent islands by design").
   13 profiles for 13 agents means 13 full homes with duplicated state, no live config
   inheritance, and per-lineage state isolation only at home granularity. Not a persona
   mechanism.
   [SOURCE: hermes_cli/profiles.py:133-280; ~/.hermes/hermes-agent/AGENTS.md profile rule]

2. **`delegate_task` sub-agents cannot consume the repo's agent files.** Children get a
   focused system prompt built from `goal` + `context` with roles `leaf`/`orchestrator`
   (delegate_tool.py:1-9, 57-66, 156-262). There is no preset file format and no loader for
   `.claude/agents/*.md`; the repo's `allowed-tools`/`description`/persona frontmatter is
   meaningless to it. Presets would have to be re-encoded as goal/context text.
   [SOURCE: tools/delegate_tool.py:57-66, 156-262]

3. **`hermes import-agent` does not import agent definition files.** It maps CLAUDE.md/
   AGENTS.md instructions, permission allowlists, MCP servers, skills and memories — for
   claude-code and codex only (agent_import.py:26-32, 294-303). `.claude/agents/*.md` is not
   in the mapping; the 13 agents would not be imported. What it WOULD map from this repo:
   root `CLAUDE.md` (rules), `.claude/mcp.json` servers, `.claude/skills` (the symlinked
   `.opencode/skills` tree), memories — i.e., a wholesale COPY of repo state into `~/.hermes`
   under `claude-code-imports`. Value assessment: harmful for this repo — it duplicates
   state the repo already manages, bypasses the trust/quarantine flow (angle 3), and would
   need `--overwrite` discipline on every repo change. Verdict: do NOT run `hermes
   import-agent` in the integration; keep the repo as the single source and use trust +
   symlinks.
   [SOURCE: hermes_cli/agent_import.py:26-32, 294-303; live `hermes import-agent --help`,
   2026-09-14]

4. **The viable persona routes are inline-prompt (cli-codex/cli-pi precedent) or a
   "persona skill".** (a) Inline the agent .md persona into the dispatch prompt — zero
   Hermes-side state, exactly what cli-codex ("persona always inlined") and cli-pi do. (b)
   Translate an agent .md into a Hermes skill: frontmatter name/description + body with the
   persona and procedure, preloaded per dispatch via `-s <skill>` (`--skills` preloads with
   the same partial-success contract as CLI chat; skill slash commands inject as a user
   message, `agent/skill_commands.py`). The skill route is the closest Hermes-native analog
   of a sub-agent persona and composes with the repo's skill tree (angle 3-4: loads with
   warnings). Cost: 13 translations to maintain; benefit: Hermes-native dispatch without
   prompt bloat. Recommendation: inline for the first integration phase (fewer moving
   parts), revisit persona-skills only if prompt bloat becomes measurable.
   [SOURCE: tools/delegate_tool.py:1-9; agent/skill_commands.py (hermes_cli/AGENTS.md);
   cli-codex/SKILL.md + cli-pi/SKILL.md (resource-map)]

5. **Nested `.opencode/commands/**/*.md` cannot register as Hermes slash commands.** Hermes
   slash commands come from `COMMAND_REGISTRY` (hermes_cli/commands.py) and skill slash
   commands scanning `~/.hermes/skills/`; opencode's YAML-workflow command format has no
   Hermes equivalent (no workflow engine). The established repo precedent is cli-pi, which
   flattened 36 commands into `.pi/prompts/*.md` prompt templates. For Hermes the same
   pattern applies: render each needed command as a prompt template (or a skill) under the
   future `.hermes/` folder; `--query-file` (angle 1) is the injection-safe carrier for the
   rendered prompt.
   [SOURCE: hermes_cli/commands.py + agent/skill_commands.py (hermes_cli/AGENTS.md);
   resource-map §Commands]

6. **`hermes profile` remains useful for ONE thing: per-lineage state isolation.** For
   deep-loop fan-out (angle 8), a dedicated profile (or `HERMES_HOME` override) can isolate
   sessions/memories/logs per lineage — the profile's purpose here is state isolation, not
   persona.
   [SOURCE: hermes_cli/profiles.py:133-280; root AGENTS.md profile rule]

## Questions Answered

- Q5 (agents/commands/persona): answered. Profiles = state islands (not personas);
  delegate_task = goal/context only; import-agent = config/mcp/skills/memories copy, does not
  import agent files and is harmful here; persona routes = inline or persona-skill; nested
  commands = prompt templates via `--query-file`/skills (cli-pi precedent).

## Questions Remaining

- Q6-Q10 (see strategy).

## Assessment

- newInfoRatio: 0.68 — the import-agent mapping surface, profile-island semantics, and the
  delegate preset gap are new; some overlap with angle 3/4 flattening context.
- Confidence: high (source + live help).

## Reflection

- What worked: reading import-agent's actual mapping before judging it — the dry-run would
  have looked harmless but is a repo-state COPY that bypasses trust/quarantine.
- What failed / ruled out: profiles as personas (islands, wrong granularity); import-agent as
  an onboarding path (duplicative, bypasses quarantine); direct slash-command registration
  for opencode commands (no workflow engine).
- Ruled-out direction: `hermes import-agent claude-code` in the integration plan.

## Recommended Next Focus

Angle 6: hooks and plugins (`hermes_cli/hooks.py`, `plugins/AGENTS.md`,
`hermes_cli/plugins*.py`, `hermes_cli/agent_plugins.py`,
`docs/rfcs/plugin-config-state-bridge.md`; events, payloads, consent allowlist,
`--accept-hooks`; bridging the repo's guard cores as hooks vs plugins vs Agent Plugins v1).
