# Iteration 2: Nested Transport and Naming Drift

## Focus
This iteration investigated whether the current nested Open Design transport packet is reflected consistently across hub, registry, and mode-packet docs.

## Findings
1. **P1 drift — `design-md-generator/SKILL.md` still routes Open Design projects to obsolete `mcp-open-design` naming.** The current registry identifies the nested transport as `workflowMode: design-mcp-open-design` and `packet: design-mcp-open-design`, while md-generator says Open Design projects should use `mcp-open-design`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:145] [SOURCE: .opencode/skills/sk-design/mode-registry.json:154] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:48]
2. **P2 drift — md-generator's family-boundary and related-skills prose names `mcp-open-design` even though the hub names `design-mcp-open-design` as the nested transport.** The hub reference line points to `design-mcp-open-design/SKILL.md`, but md-generator refers to `mcp-open-design` as a transport and related skill. [SOURCE: .opencode/skills/sk-design/SKILL.md:232] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:14] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:496]
3. **P2 improvement — the sk-design graph metadata has Open Design trigger phrases but no edge/manual relation for the current nested transport.** `graph-metadata.json` lists only `sk-code` and `mcp-figma` as siblings/prerequisites/manual related skills, while its own causal summary says all six modes include `design-mcp-open-design`. [SOURCE: .opencode/skills/sk-design/graph-metadata.json:16] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:29] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:37] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:157]
4. **P2 improvement — version metadata is not synchronized across the hub packet's machine-readable surfaces.** `SKILL.md` frontmatter says version `1.1.0.0`, `mode-registry.json` says `1.4.0.0`, and `hub-router.json` says `1.3.0.0`, which makes release provenance hard to audit after transport/router changes. [SOURCE: .opencode/skills/sk-design/SKILL.md:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:3] [SOURCE: .opencode/skills/sk-design/hub-router.json:3]

## Ruled Out
- The nested Open Design packet is not missing: it exists under `.opencode/skills/sk-design/design-mcp-open-design/**`. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1]
- The `.claude/skills/sk-design/design-mcp-open-design/**` mirror was not present in this workspace, but the OpenCode path exists and is the canonical runtime path for this run. [SOURCE: glob:.claude/skills/sk-design/design-mcp-open-design/**/* returned no files] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1]

## Dead Ends
- No stale naming was edited; reducer/follow-up implementation owns fixes.

## Edge Cases
- Ambiguous input: `mcp-open-design` may refer to a retired external sibling in historical docs, but current registry evidence points to nested `design-mcp-open-design`.
- Contradictory evidence: current hub/registry naming conflicts with md-generator prose naming.
- Missing dependencies: none.
- Partial success: scope covered hub/registry/md-generator/graph metadata; other packet prose was not exhaustively link-checked.

## Sources Consulted
- `.opencode/skills/sk-design/SKILL.md:232`
- `.opencode/skills/sk-design/mode-registry.json:145`
- `.opencode/skills/sk-design/hub-router.json:84`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:14`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1`
- `.opencode/skills/sk-design/graph-metadata.json:157`

## Assessment
- New information ratio: 0.88
- Questions addressed: nested transport existence, naming consistency, graph metadata parity, version provenance.
- Questions answered: Open Design naming is inconsistent and graph/version metadata needs cleanup.

## Reflection
- What worked and why: comparing registry lines to packet prose isolated current-vs-stale naming quickly.
- What did not work and why: historical `mcp-open-design` references outside sk-design were noisy and not all in scope.
- What I would do differently: run a scoped markdown-link/name validator for `mcp-open-design` after fixes.

## Recommended Next Focus
Audit `.opencode/agents/design.md` against registry tool-surface constraints and mode behavior.
