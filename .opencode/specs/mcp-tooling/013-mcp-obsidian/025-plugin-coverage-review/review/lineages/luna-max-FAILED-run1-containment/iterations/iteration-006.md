# Iteration 6: Router wiring

## Dimension

Correctness — intent signals, resource-map loading, and specific-plugin route selection.

## Evidence

The router has dedicated signals and resource-map entries for Finance, Tables, BRAT, Iconic, Charts, Dataview, Excalidraw, Git, Outliner, and Minimal. Health.md appears in activation prose and the resource-loading overview at [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:25] and [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:72-76], but no `PLUGIN_HEALTH_MD` entry exists in the `INTENT_SIGNALS`, `RESOURCE_MAP`, or the specific-intent selection tuple at [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:163-235], [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:262-322], and [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:378-380].

## Findings by severity

### P1 — F003

Health.md has no dedicated router intent or resource mapping. A health-specific request can activate the skill but cannot select the Health.md reference family through the specific routing contract. Add the dedicated signal, five-file resource map, and tuple entry.

F001 and F002 remain active.

## Typed adjudication

The absence was confirmed by comparing every 11-plugin row in the packet with the three router surfaces. Counterevidence was sought in activation prose and the on-demand list; those mention Health.md but do not create a route. Final severity P1, confidence 0.97.

Review verdict: CONDITIONAL
