# Deep Research Strategy: sk-design Drift and Improvement Audit

## Known Context
- Target scope is limited to `.opencode/skills/sk-design/**`, `.opencode/agents/design.md`, and `.opencode/commands/design/**`, plus the Open Design nested packet discovered at `.opencode/skills/sk-design/design-mcp-open-design/**`.
- Fresh initialization was explicitly permitted by the dispatcher; artifacts are constrained to this packet's `research/` directory.
- The active code graph digest is stale, so this run used direct Glob/Grep/Read evidence and one bounded command-surface validation command instead of structural graph claims.

## Key Questions (remaining)
- [x] Do the design command routers/assets still pass their own command-surface validator?
- [x] Does registry/router documentation align with current nested `design-mcp-open-design` naming and command projection?
- [x] Are mode-packet docs stale relative to the current registry and transport naming?
- [x] Does `.opencode/agents/design.md` enforce the registry's per-mode tool-surface constraints?
- [x] Are there release/metadata drift signals that could mislead advisor/runtime consumers?

## Exhausted Approaches
- BLOCKED: code-graph structural answers were not used as primary evidence because startup reported stale graph freshness.
- PRODUCTIVE: direct file reads of hub, registry, command metadata, agent, and packet SKILL files.
- PRODUCTIVE: bounded command validation via `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`.

## Next Focus
Converged for this audit packet. Implementation follow-up should prioritize command metadata validator failures, then stale `mcp-open-design` naming, then agent/tool-surface enforcement and metadata version hygiene.

## Stop Conditions
- Stop when every scoped surface has at least one evidence-backed pass or finding.
- Stop when the newest iteration's newInfoRatio falls below 0.05 after prior findings already cover command, registry, packet, agent, and metadata surfaces.

## Non-Goals
- Do not implement fixes.
- Do not modify sk-design, commands, agent, or graph metadata during research.
- Do not write outside the resolved packet-local research directory.
