# Resource Map: gpt55fast Claude Design Parity Lineage

## READMEs

- `.opencode/skills/sk-interface-design/README.md` - available but not needed after direct skill/reference reads.
- `.opencode/skills/mcp-magicpath/README.md` - available but not needed after direct skill/reference reads.

## Documents

- `https://support.claude.com/en/articles/14604416-get-started-with-claude-design` - Claude Design user flow, context, iteration, export, and limitations.
- `https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design` - design-system setup and extraction sources.
- `https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans` - rollout, RBAC, governance, and data-handling notes.

## Commands

- `.opencode/commands/deep/start-research-loop.md` - workflow entry contract.
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` - phase and state-file contract.

## Agents

- No agent definitions were read for this lineage; execution was direct inside the spawned `cli-opencode` lineage.

## Skills

- `.opencode/skills/deep-research/SKILL.md` - lineage workflow rules.
- `.opencode/skills/sk-interface-design/SKILL.md` - interface design process and boundaries.
- `.opencode/skills/mcp-magicpath/SKILL.md` - MagicPath CLI workflow and cross-skill dependency.

## Specs

- `.opencode/specs/skilled-agent-orchestration/143-sk-interface-design/005-claude-design-parity-research/spec.md` - packet scope, requirements, success criteria, and seeded context.

## Scripts

- `.opencode/skills/sk-interface-design/scripts/design_search.py` - identified as optional query-only design catalog search.
- `.opencode/skills/deep-research/scripts/reduce-state.cjs` - reducer contract reference; not run because the fan-out lineage artifact override must not resolve the parent artifact root.

## Tests

- No tests were executed; this is a research artifact lineage.

## Config

- `deep-research-config.json` - lineage configuration produced for `gpt55fast`.

## Meta

- Parent `resource-map.md` was absent, so this lineage emitted its own evidence map from read sources.
