# Iteration 002: Security And Public-Surface Safety

## Focus

Dimensions: security and maintainability. Reviewed code-graph trace output gates, schema validation, and default payload behavior.

## Scorecard

- Dimensions covered: security, maintainability
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.5000

## Findings

### P0, Blocker

None.

### P1, Required

- **F002**: `code_graph_query(includeTrace)` is implemented in the handler but rejected by the published schema. The handler type includes `includeTrace` [SOURCE: `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:47`] and passes it into `computeBlastRadius` [SOURCE: `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1533-1542`]. However, the published `code_graph_query` schema omits `includeTrace` while setting `additionalProperties: false` [SOURCE: `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-60`], and the dispatcher validates all known tools before dispatch [SOURCE: `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:67-70`]. The phase summary already documents this as an out-of-scope limitation [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included/implementation-summary.md:117-120`], but the phase spec's success criteria require `includeTrace` access. Public clients using the MCP/CLI schema cannot request the advertised `why_included` trace through `code_graph_query`.

#### Claim Adjudication Packet: F002

```json
{
  "findingId": "F002",
  "claim": "The code_graph_query includeTrace feature is not reachable through the validating public tool schema because includeTrace is absent from the code_graph_query schema and unknown properties are rejected.",
  "evidenceRefs": [
    ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts:47",
    ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1533-1542",
    ".opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-60",
    ".opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:67-70",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included/implementation-summary.md:117-120"
  ],
  "counterevidenceSought": "Checked tool-schemas.ts, code-graph-tools.ts validation, CLI manifest reuse of CODE_GRAPH_TOOL_SCHEMAS, and grep hits for includeTrace on code_graph_query. Only code_graph_context exposes includeTrace in the schema.",
  "alternativeExplanation": "Direct handler tests can pass includeTrace because they bypass validateToolArgs, but public MCP and CLI dispatch validate against the schema first.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if code_graph_query schema is updated to include includeTrace and validation tests cover the public path.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | partial | advisory | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-60` | Handler capability is not exposed through the published contract. |

## Assessment

- New findings ratio: 0.5000
- Dimensions addressed: security, maintainability
- Novelty justification: Found a public-surface reachability break that direct handler tests do not catch.

## Ruled Out

- Default trace leakage: compact `blast_radius` and `code_graph_context` paths omit `why_included` unless `includeTrace` is true in the inspected code/tests.

## Dead Ends

- No direct P0 security issue was confirmed in trace output sanitization.

## Recommended Next Focus

Run parent/child traceability checks and reconcile spec completion claims.
Review verdict: CONDITIONAL
