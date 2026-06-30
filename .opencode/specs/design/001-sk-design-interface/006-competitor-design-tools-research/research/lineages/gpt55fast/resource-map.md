# Resource Map - gpt55fast competitor design-tool research

Evidence-derived map for this lineage. Parent `resource-map.md` was absent at init, so this file records sources discovered during the loop.

## READMEs

- None discovered in the lineage artifact.

## Documents

- `deep-research-strategy.md` - lineage strategy, final questions, next focus, and negative knowledge.
- `research.md` - final lineage synthesis.
- `deep-research-dashboard.md` - reducer-style progress and convergence summary.

## Commands

- Deep-research command contract read from `.opencode/commands/deep/start-research-loop.md` and auto YAML.

## Agents

- `deep-research` skill contract loaded from `.opencode/skills/deep-research/SKILL.md`.

## Skills

- `sk-design-interface` local target. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md]
- `mcp-magicpath` local target. [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md]
- `deep-research` workflow source. [SOURCE: file:.opencode/skills/deep-research/SKILL.md]

## Specs

- Packet 006 spec. [SOURCE: file:.opencode/specs/design/001-sk-design-interface/006-competitor-design-tools-research/spec.md]
- Packet 005 baseline research. [SOURCE: file:.opencode/specs/design/001-sk-design-interface/005-claude-design-parity-research/research/research.md]

## Scripts

- Reducer and fanout scripts were inspected but not used for writes because the lineage was constrained to the override artifact directory and the default reducer resolves the parent packet path.

## Tests

- JSONL parse validation was run after artifact writing.

## Config

- `deep-research-config.json` - final lineage config.
- `deep-research-state.jsonl` - append-only state log.
- `deep-research-findings-registry.json` - reducer-style registry.

## Meta

- Primary sources: v0 docs, Lovable docs, Figma Help Center, Subframe docs, Anima docs, Builder docs.
- Key source families:
  - v0 live edit / Figma / registries: `https://vercel.com/docs/v0/*`
  - Lovable design guidance / preview toolbar / browser testing / design systems: `https://docs.lovable.dev/features/*`
  - Figma Make plan / kits / guidelines / local codebase: `https://help.figma.com/hc/en-us/articles/*`
  - Subframe deterministic design-to-code / MCP: `https://docs.subframe.com/*`
