# Iteration 005: Adversarial router replay

## Focus

Correctness replay using one request family per plugin to confirm specific intents win over the generic plugin route and every selected resource path exists.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:163-333`
- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:383-421`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/`
- `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/`

## Scorecard

- Dimensions covered: correctness
- Files reviewed: eleven route/resource/card tuples
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=2 P2=2
- New findings ratio: 0.0

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Target packet lacks normative review inputs — `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3` — Carried forward; no target spec or checklist has appeared.
- **F002**: Shared plugin contract omits six newly covered plugins in its overview and relation note — `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:26` — Carried forward; router replay does not repair stale prose.

### P2, Suggestion

- **F003**: Newer data models retain explicit verification debt — `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133` — Carried forward; the markers remain bounded and explicit.
- **F004**: Playbook frontmatter and opening description still say three plugin tie-ins — `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3` — Carried forward; the indexed scenario count is eleven.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| feature_catalog_code | pass | advisory | `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:268-333` | All eleven route maps resolve to existing reference sets and cards. |

## Assessment

- All eleven explicit plugin intents appear in the signal table, resource map, and specific-intent selection tuple.
- No new router correctness issue was found.
- New findings ratio: 0.0.

## Ruled Out

- Health.md routing regression: `PLUGIN_HEALTH` is present in all three router structures.
- Generic-route shadowing: specific plugin matching is evaluated before `PLUGINS`.

## Recommended Next Focus

security replay of destructive and credential-sensitive scenarios

Review verdict: CONDITIONAL
