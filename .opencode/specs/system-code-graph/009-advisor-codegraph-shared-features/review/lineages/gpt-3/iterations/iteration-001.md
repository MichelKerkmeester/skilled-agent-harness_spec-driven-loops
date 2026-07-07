# Iteration 1: Code Graph Query Trace Reachability

## Focus
Reviewed code-graph `blast_radius` trace support against the public tool schema and phase 008 claims.

## Scorecard
- Dimensions covered: correctness, traceability
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.000000

## Findings

### P0, Blocker
None.

### P1, Required
- **F001**: `code_graph_query` does not expose `includeTrace` in its public tool schema. Phase 008 says blast-radius breadcrumbs are available when callers opt into `includeTrace` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included/implementation-summary.md:59-64]. The handler type accepts `includeTrace` [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:37-48] and passes it into `computeBlastRadius` [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1533-1542], but the public JSON schema for `code_graph_query` has `additionalProperties: false` and omits `includeTrace` from properties [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:49-60]. MCP clients that validate against the schema cannot request the feature.

```json
{
  "findingId": "F001",
  "claim": "code_graph_query blast-radius why_included breadcrumbs are implemented in the handler but unreachable through the public tool schema because includeTrace is omitted while additionalProperties is false.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included/implementation-summary.md:59-64",
    ".opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:49-60",
    ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts:37-48",
    ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1533-1542"
  ],
  "counterevidenceSought": "Checked query handler, public tool schema, and handler tests for includeTrace exposure. Handler-only tests call handleCodeGraphQuery directly with includeTrace, but the exported tool schema omits it.",
  "alternativeExplanation": "The runtime could pass unknown arguments despite the schema, but the descriptor explicitly sets additionalProperties false, so schema-valid MCP callers are blocked.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "If the registered MCP surface is generated from a different schema that includes includeTrace and validation accepts it, downgrade to P2 descriptor drift.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | implementation-summary.md:59-64, tool-schemas.ts:49-60, query.ts:37-48, query.ts:1533-1542 | Implemented behavior is not exposed by the public schema. |

## Assessment
- New findings ratio: 1.000000
- Dimensions addressed: correctness, traceability
- Novelty justification: public schema reachability was not captured by handler-only tests.

## Ruled Out
- Handler absence: ruled out because `QueryArgs` and `computeBlastRadius` do consume `includeTrace`.

## Dead Ends
- Treating this as P0: rejected because default compact behavior remains intact and the failure is opt-in feature reachability.

## Recommended Next Focus
Review advisor observability exports for the same schema/descriptor drift pattern.
Review verdict: CONDITIONAL
