# Iteration 3 — Profiles, DSH_HOME, and repo-local configuration

- Focus: Angle 3, profiles, DSH_HOME, and repo-local configuration
- Timestamp: 2026-11-05T22:22:44Z
- Findings count: 6
- Novelty: 0.9

## Focus

Separate process-global harness state from project-local configuration, identify what is discovered from a checkout automatically, and derive a repo-local folder pattern that matches the existing Pi and Hermes conventions.

## Actions Taken

- Read DSH’s profile startup reference, agent-instruction package contract, and the repository’s .pi and .hermes sync manifests.
- Kept inspection to manifests and source documentation; did not read operator provider settings or credentials.

## Findings

1. DSH_HOME is process-wide state, defaulting to ~/.dsh unless the environment overrides it. DSH’s agent-instruction plugin reads global AGENTS.md from DSH_HOME and the shared agents root from DSH_AGENTS_HOME (default ~/.agents); these are not per-project config fields. [SOURCE: dsh-src/packages/context/agent-instructions/README.md:34-42]
2. Profile configuration lives under $DSH_HOME/profiles/<profile>. The composed config includes the bundle, profile cordis.patch.yml, home-level $DSH_HOME/cordis.patch.yml, and explicit --patch overlays; --patch is repeatable and overlay-relative plugin names resolve beside their patch file. [SOURCE: dsh-src/apps/cli/reference/README.md:45-55,60] [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:33-44]
3. Provider credentials are kept in the DSH_HOME credential store while profile configuration carries credential references such as apiKeyEnv. A tracked project overlay should therefore contain route/model metadata and references only; DSH_HOME and credential files should stay outside the repository. [SOURCE: dsh-src/docs/user/guide/providers.md:13,27-39,49-56] [SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:36-38]
4. The documented project auto-discovery is an instruction chain: from the .git-marked project root through the working directory, DSH reads AGENTS.md and CLAUDE.md plus additive AGENTS.local.md and CLAUDE.local.md. No automatic .dsh profile/config-folder loader is documented; treat that absence as documented, unconfirmed, and use explicit overlays. [SOURCE: dsh-src/packages/context/agent-instructions/README.md:28-42] [SOURCE: dsh-src/apps/cli/reference/README.md:30-33]
5. A repository-local .dsh/cordis.patch.yml is a workable tracked overlay only when the launch path passes it with --patch; it is not a replacement DSH_HOME or an auto-discovered profile. Keeping DSH_HOME outside the checkout avoids mixing operator credentials, sessions, and profile bootstrap files with portable repo assets. [SOURCE: dsh-src/apps/cli/reference/README.md:45-56] [SOURCE: dsh-src/apps/cli/src/profile-boot.ts:224-235,271-295]
6. Existing runtime manifests show the repo-specific sync pattern: .pi uses generated agent/prompt trees, shared-skill links, and hand-authored extensions/settings/MCP; .hermes has generated prompt and skill outputs plus a hand-authored repo plugin and SYNC.md, while provider and MCP configuration remains user-level. A future .dsh folder can state its generated/hand-authored/linked surfaces in SYNC.md, with its launcher overlay separate from DSH_HOME. [SOURCE: .pi/SYNC.md:1-45] [SOURCE: .hermes/SYNC.md:1-45]

## Questions Answered

- None; this angle establishes runtime-home and project-config boundaries but does not settle skills, agents, commands, plugins, hooks, or MCP representation.

## Questions Remaining

- How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode?
- Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped?
- What fan-out executor support and cross-repository touch points are required to integrate the mode safely?
- What constraints, unknowns, and dependency-ordered phases should guide implementation?

## Next Focus

Angle 4: skills.

## Uncertainties

- The source documents support explicit --patch overlays and workspace instruction loading. Whether any newer runtime enables auto-discovery of a repo-local DSH config directory remains UNKNOWN; confirm against the installed profile when implementation begins.
- Keep .dsh as a proposed project convention, not a claimed native DSH feature.

## Sources

- dsh-src/packages/context/agent-instructions/README.md
- dsh-src/apps/cli/reference/README.md
- dsh-src/apps/cli/src/profile-boot.ts
- dsh-src/docs/user/guide/providers.md
- dsh-src/packages/llm/llm-pi-ai/README.md
- .pi/SYNC.md
- .hermes/SYNC.md
- specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md
