# Iteration 2: Runtime loading and context boundary

## Focus

Answer RQ-2 and RQ-3 by mapping how the seven configured runtimes expose or copy skills, whether supporting files are loaded automatically, and which routing details an agent must see.

## Actions Taken

Compared each runtime sync manifest with the installed directory shape; checked current Claude Code, OpenCode, Cursor, Pi, and Codex skill documentation; inspected the Hermes copy generator; compared the router authoring template with the live advisor router and replay parser.

## Findings

1. Workspace delivery differs by runtime: Claude, OpenCode, Pi, and Devin expose the canonical skills tree through directory symlinks; Hermes builds standalone SKILL.md copies; Codex has no .codex/skills tree; Cursor has no .cursor/skills tree but current Cursor docs also discover .claude/skills, which this checkout links to .skilled/skills. The local Cursor manifest records only its own skills location, so refresh that description alongside the migration. [SOURCE: .claude/SYNC.md:14,27] [SOURCE: .opencode/SYNC.md:14,26] [SOURCE: .codex/SYNC.md:14-35] [SOURCE: .cursor/SYNC.md:39] [SOURCE: .pi/SYNC.md:34] [SOURCE: .devin/SYNC.md:20,34] [SOURCE: .hermes/SYNC.md:16,24,27] [SOURCE: https://cursor.com/docs/skills]

2. The skill runtimes use progressive loading: they advertise metadata or a description, then load SKILL.md when selected; supporting-file contents are read only when the instructions call for them. OpenCode states this explicitly, while Claude, Pi, Cursor, and Codex document the same on-demand pattern. A sibling ROUTER.md therefore needs an explicit path and read instruction in SKILL.md; directory presence alone does not put its text in the model context. [SOURCE: https://code.claude.com/docs/en/skills] [SOURCE: https://opencode.ai/v2/docs/skills] [SOURCE: https://cursor.com/docs/skills] [SOURCE: https://pi.dev/docs/latest/skills] [SOURCE: https://developers.openai.com/blog/skills-agents-sdk/]

3. This checkout does not provision a Codex-native skills directory: its Codex sync manifest says there is no .codex/skills, and the root AGENTS.md routes through the skill-advisor hook or explicit advisor CLI. OpenAI documents repo-local Codex skills under .agents/skills, but that root is not present in this checkout; treat Codex loading here as explicit canonical-path routing, not automatic project skill discovery. [SOURCE: .codex/SYNC.md:14-35] [SOURCE: AGENTS.md:66-67] [SOURCE: https://developers.openai.com/blog/skills-agents-sdk/]

4. The Hermes sync walks only files named SKILL.md, writes one generated markdown file per skill, and rewrites relative Markdown links to point back to the canonical skill directory. It deliberately excludes references, scripts, assets, and other sibling files, so a relocated ROUTER.md will not be in the Hermes preload copy; the generator must either add that one sidecar or rewrite the pointer to its canonical .skilled path. [SOURCE: .hermes/SYNC.md:16,24,51,65-67] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:51-70,89-100,142-160]

5. Agents still need the intent-selection rule, exact route destinations, load levels, and low-confidence or ambiguity fallback when they choose skill resources; the canonical smart-router template explicitly describes discovery, path guards, conditional loads, a runtime key, and fallback as router behavior. Literal delimiters and assignment shapes are also consumed by replay, validation, measurement, and package tooling, but those parsers should read the sidecar directly instead of requiring the script syntax to remain inside SKILL.md. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:20-26,32-57] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:266-285,323-330,480-488] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:388-417]

6. Keep a short pointer in SKILL.md that names sibling ROUTER.md, says to read it before selecting or loading skill-local resources, and resolves it from the skill directory. This preserves progressive loading while keeping the route available on demand. The pointer policy conflicts with the current authoring template statement that mode packets never carry ROUTER.md, so the authoring template, creation workflows, parser checks, and tests must be revised together before migration. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:24-26] [SOURCE: .skilled/commands/create/assets/create-skill-auto.yaml:347,430] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:476,518,527] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:975-1009] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2037-2069]

## Questions Answered

- RQ-2: How do Claude Code, OpenCode, Codex, Cursor, Pi, Devin and Hermes load a skill, and do they load sibling files automatically? What does the Hermes copy step include?
- RQ-3: Which machine-router facts does an agent need in context at runtime, which facts only scripts need, and what pointer must remain in SKILL.md?

## Questions Remaining

- RQ-1: enumerate every MACHINE ROUTER reader, test and generator with exact file:line migration actions.
- RQ-4: determine how a hub router joins root ROUTER.md without changing replay projection.
- RQ-5: measure per-skill token savings and specify a migration that preserves the advisor baseline, router replay, and compiled hashes.

## Next Focus

Inventory the hub-root router parser and replay inputs, then measure current machine-router blocks across all skills and design staged baseline checks.

## Recorded Contract Conflict

The existing authoring template says no mode packet carries ROUTER.md and only the hub has a root ROUTER.md, while this research question asks for sibling ROUTER.md beside every skill. The lineage continues under the dispatcher’s conflict handling; implementation must change that contract before any production move.

## Workflow and Scope Notes

The canonical packet spec is outside this lineage's write authority, so this iteration records its answer here and makes no packet-level write. The standard runtime handoff file and memory save are likewise omitted because their paths are outside the authorized lineage.
