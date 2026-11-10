# Iteration 4 — Skills

- Focus: Angle 4, skills
- Timestamp: 2026-11-05T22:25:43Z
- Findings count: 6
- Novelty: 0.95

## Focus

Check DSH’s native skill roots, frontmatter and traversal behavior against this repository’s nested skill tree; decide how much of the shared skill system can be exposed directly.

## Actions Taken

- Read the DSH skill registry, filesystem provider, tool-skill and base profile composition references, plus the Pi and Hermes runtime sync manifests.
- Read only shared skill metadata and manifests from this repository; did not open provider credentials or model configuration.

## Findings

1. The shipped base composition already mounts the skill registry, local filesystem provider and model-facing skill tool, so headless mode has a native path for local skills without importing Pi’s extension loader. [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:312-319] [SOURCE: dsh-src/packages/skill/skill/README.md:28-55]
2. DSH’s filesystem provider searches project .dsh/skills first, then project .agents/skills, configured custom roots, DSH_HOME/skills, DSH_AGENTS_HOME/skills, and an optional bundled root. The project root is the nearest .git ancestor; skill summaries are discovered on demand and bodies load only when requested. [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:28-56,67-77]
3. DSH accepts a top-level directory bundle name/SKILL.md or flat name.md, not recursive **/SKILL.md. Required frontmatter is name and description; supported optional fields include whenToUse, metadata, disable-model-invocation and user-invocable. Existing shared SKILL.md files carry allowed-tools and version, which DSH does not translate into model-tool permissions; retain instruction text but map permission behavior in the runtime/tool configuration. [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:34-42] [SOURCE: dsh-src/packages/skill/skill-filesystem/src/index.ts:811-852,1014-1055] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:1-5]
4. Linking the whole .skilled/skills tree into the DSH root exposes only the root’s direct children; it cannot load every nested cli mode. This repository has a cli-external-orchestration parent SKILL.md and seven nested runtime SKILL.md files. To expose each mode, generate flattened skill bundles or add one direct bundle link per desired mode under .dsh/skills; the parent hub remains a separate, optional skill. [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:34-40] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:1-5] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:1-5] [SOURCE: .pi/SYNC.md:8-31]
5. The filesystem provider follows symlinked skill entries and preserves their discovered paths; watcher follow-symlinks defaults to true. Unlike the Hermes security scanner, this provider documents invalid frontmatter as a per-skill warning and skip, with no quarantine. [SOURCE: dsh-src/packages/skill/skill-filesystem/src/index.ts:86,913-930] [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:40,79-85] [SOURCE: .hermes/SYNC.md:14-29]
6. DSH caps normalized skill descriptions shown in the session catalog at 500 characters, but loaded instruction bodies have no size cap. Prefer concise skill summaries and load references/assets only when relevant rather than injecting whole shared resources into every skill body. [SOURCE: dsh-src/packages/skill/tool-skill/README.md:38-54,261-266] [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:81]

## Questions Answered

- None; this identifies skill integration mechanics but leaves agents, commands, plugins, hooks, and MCP open.

## Questions Remaining

- How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode?
- Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped?
- What fan-out executor support and cross-repository touch points are required to integrate the mode safely?
- What constraints, unknowns, and dependency-ordered phases should guide implementation?

## Next Focus

Angle 5: agents, subagents, commands, and goal.

## Source Correction

The Angle 3 statement that no general .dsh config-folder auto-loader was documented remains scoped to profile configuration. This angle confirms that .dsh/skills is a first-class automatically scanned project root. Use explicit --patch for project profile configuration and the default skill root for portable skill bundles.

## Sources

- dsh-src/packages/bundle/base/cordis.patch.yml
- dsh-src/packages/skill/skill/README.md
- dsh-src/packages/skill/skill-filesystem/README.md and src/index.ts
- dsh-src/packages/skill/tool-skill/README.md
- .skilled/skills/cli-external-orchestration/SKILL.md and cli-pi/SKILL.md
- .pi/SYNC.md
- .hermes/SYNC.md
