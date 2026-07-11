# Iteration 1: Command Surface Broad Sweep

## Focus

Broadly inspect command entrypoints across create, deep, design, memory, speckit, doctor, and root commands, emphasizing dispatch targets, mode suffixes, asset references, allowed-tool grants, and adjacent instances of the nine recon seed defect classes. This iteration prioritized command Markdown and direct cross-surface references; exhaustive YAML/presentation/compiled-contract parity remains for later iterations.

## Actions Taken

1. Enumerated `.opencode/commands/**/*.md` and classified executable command entrypoints versus deep compiled and legacy Markdown assets.
2. Searched command Markdown for workflow/presentation links, mode suffixes, skill paths, agent references, and allowed-tool MCP grants.
3. Verified all five design routers and checked whether `/design:design-mcp-open-design` exists as a command.
4. Compared the doctor router's workflow table with its canonical `_routes.yaml` manifest and discovered workflow assets.
5. Verified the deep-research executor notes and the Claude/OpenCode deep-research path conventions against current nested skill and runtime locations.

## Findings

### P0

No P0 finding was established in this iteration.

### P1

1. **[commands] All five design routers send users to a nonexistent slash command.** The referrals occur at `.opencode/commands/design/interface.md:52`, `.opencode/commands/design/foundations.md:39`, `.opencode/commands/design/motion.md:39`, `.opencode/commands/design/audit.md:39`, and `.opencode/commands/design/md-generator.md:39`. No `.opencode/commands/design/design-mcp-open-design.md` exists, while the current transport is a nested `sk-design` packet. **Concrete fix:** replace the slash-command referrals with routing language that loads `sk-design` plus its nested `design-mcp-open-design` transport mode, or add a real thin command router if a public slash command is intended. [SOURCE: .opencode/commands/design/interface.md:44-54] [SOURCE: .opencode/commands/design/foundations.md:31-41] [SOURCE: .opencode/commands/design/motion.md:31-41] [SOURCE: .opencode/commands/design/audit.md:31-41] [SOURCE: .opencode/commands/design/md-generator.md:31-41] [INFERENCE: scoped Glob for `.opencode/commands/design/design-mcp-open-design.md` returned no file]

2. **[commands] The root `agent_router` is coupled to an unrelated Barter workspace contract and cannot discover this repository's current skill/agent topology by default.** It claims dynamic discovery, but requires an ancestor containing `z — Global (Shared)/` or named `Barter`, then searches for arbitrary `AGENTS.md` files and a singular `skill/SKILL.md`; this repository is the `Public` workspace with skills under `.opencode/skills/` and runtime agents under `.opencode/agents/` / `.claude/agents/`. Its frontmatter also grants `WebSearch` and `AskUserQuestion`, which are not among the current OpenCode command tool names evidenced by this runtime. **Concrete fix:** retire this workspace-specific command or rewrite it as a thin current-runtime router using Skill Advisor plus the checked-in runtime agent directories; replace non-current grants with supported tools. [SOURCE: .opencode/commands/agent_router.md:1-5] [SOURCE: .opencode/commands/agent_router.md:43-54] [SOURCE: .opencode/commands/agent_router.md:82-107]

3. **[agents] The Claude deep-research mirror has an OpenCode-localized self-reference.** `.claude/agents/deep-research.md:11` says to use only `.opencode/agents/*.md`, while the corresponding OpenCode agent correctly uses `.opencode/agents/*.md` at `.opencode/agents/deep-research.md:28`; the Claude runtime's own context-agent convention uses `.claude/agents/*.md`. **Concrete fix:** change the Claude mirror line to `.claude/agents/*.md` and include path localization in mirror-sync validation. [SOURCE: .claude/agents/deep-research.md:7-13] [SOURCE: .opencode/agents/deep-research.md:24-30]

### P2

4. **[doctor] The doctor router's human-facing workflow table omits a live canonical route.** `_routes.yaml` defines `skill-graph-freshness` and maps it to `doctor_skill-graph-freshness.yaml`, and that asset exists, but `.opencode/commands/doctor/speckit.md:29-40` lists only nine targets and omits it. The statement at line 41 that no workflow-asset gap exists is therefore misleading as route-table documentation, even though the underlying asset is present. **Concrete fix:** add the `skill-graph-freshness` row to the table and generate or validate this table from `_routes.yaml` to prevent recurrence. [SOURCE: .opencode/commands/doctor/speckit.md:25-41] [SOURCE: .opencode/commands/doctor/_routes.yaml:171-184] [SOURCE: .opencode/commands/doctor/assets/doctor_skill-graph-freshness.yaml:1-6]

5. **[cross-surface] Deep-research executor notes use an ambiguous top-level-style `cli-opencode SKILL.md` reference after the skill moved under the `cli-external` hub.** The notes at `.opencode/commands/deep/assets/deep_research_auto.yaml:1012` and `:1016` name `cli-opencode SKILL.md` without its owning hub path, while the actual file is `.opencode/skills/cli-external/cli-opencode/SKILL.md`. Execution is not broken because these are notes, but maintainers are pointed at an unresolved shorthand rather than a durable source path. **Concrete fix:** replace both shorthand references with the full nested path and describe `cli-opencode` as a `cli-external` workflow mode. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1010-1016] [SOURCE: .opencode/skills/cli-external/cli-opencode/SKILL.md:1]

## Questions Answered

- **Do all command dispatch paths resolve?** No. The five `/design:design-mcp-open-design` referrals are unresolved; the active transport is nested under `sk-design`.
- **Is the doctor router table consistent with its route manifest?** No. `skill-graph-freshness` exists in `_routes.yaml` and on disk but is absent from the router table.
- **Are current runtime self-references localized?** Not fully. The Claude deep-research agent retains an OpenCode path convention.
- **Did this sweep find renamed-skill fallout?** Yes. Deep-research executor notes retain ambiguous pre-hub `cli-opencode SKILL.md` wording.

## Questions Remaining

- Mechanically compare every command Markdown asset link with all 62 YAML and 35 presentation files, including mode and flag parity.
- Validate every allowed-tool grant against the active OpenCode tool registry, especially legacy root commands and MCP method-level names.
- Compare deep command Markdown, auto/confirm YAML, presentations, compiled contracts, and manifest records field by field.
- Audit all 12 Claude/OpenCode agent mirror pairs for body drift beyond the confirmed deep-research localization miss.
- Verify doctor route-to-YAML-to-script tri-existence and execute read-only doctor targets; this iteration checked manifest/table existence only.
- Confirm the `.codex/agents` README seed in the agent-focused iteration; README remediation remains out of scope.

## Next Focus

Iteration 2 should perform the workflow linkage pass: mechanically reconcile each command's advertised `:auto`/`:confirm` modes, argument flags, YAML paths, presentation paths, compiled-contract references, and allowed MCP tools, prioritizing deep and design assets where command-to-asset drift already exists.
