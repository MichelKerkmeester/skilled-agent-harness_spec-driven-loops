# Iteration 5: D3 Traceability — Feature Catalog vs Code Surface

## Focus
D3 Traceability — Verify feature catalog entries align with the actual code surface and that the feature inventory count is consistent.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P2 — Suggestion

- **F013**: The feature catalog states "17 runtime features across 8 groups" while the MCP tool surface has 10 tools. Features are more granular than tools (e.g., `ensure-ready` and `query-self-heal` share `code_graph_query`). The catalog does not explain this granularity difference, which could confuse consumers mapping catalog entries to tool IDs. — feature_catalog/feature_catalog.md:33

- **F014**: The feature catalog group `05--coverage-graph` lists 4 deep-loop features, but these tools dispatch through system-spec-kit, not mk-code-index (confirmed in tool-registrations.md:42-44). The catalog documents this boundary, but SKILL.md §2 does not include deep-loop entries, creating a traceability gap where catalog references tools not in the skill's own MCP surface. — feature_catalog/feature_catalog.md:89-94

## Assessment
- Feature catalog structure is consistent with directory naming
- 17 features verified: 2+3+1+2+4+1+3+1 = 17
- Coverage graph features correctly document system-spec-kit boundary

## Recommended Next Focus
D3 Traceability — playbook capability checks