# Review Resource Map: gpt-3 lineage

## Scope
- Target spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`.
- Artifact directory: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/review/lineages/gpt-3`.
- Resource-map coverage gate: skipped because no root `resource-map.md` exists at init.

## Evidence Map
| Finding | Primary Files | Iteration |
|---------|---------------|-----------|
| F001 | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | iteration-001 |
| F002 | `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-status.ts`, `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts`, `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts`, `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts` | iteration-002 |
| F003 | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/graph-metadata.json`, child implementation summaries | iteration-003 |

## Phase-5 Augmentation
- Novel logic gaps: F001 and F002 are schema/export gaps where implemented behavior is unavailable through public surfaces.
- Empty-result cases: no resource-map root inventory was available to classify untouched entries.
