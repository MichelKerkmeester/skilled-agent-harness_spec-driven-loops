# Iteration 2: Advisor Observability Descriptor Reachability

## Focus
Reviewed advisor observability public descriptors against handler/schema support for semantic-lane health.

## Scorecard
- Dimensions covered: security, correctness
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.500000

## Findings

### P0, Blocker
None.

### P1, Required
- **F002**: `advisor_status` semantic health is implemented but blocked by public descriptors. The phase summary says `advisor_status` accepts `includeSemanticHealth` or `debug` to return `semanticLaneHealth` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/001-advisor-observability/implementation-summary.md:57-60]. The Zod input schema accepts both fields [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:231-237], and the handler emits semantic health when either is set [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:257-281]. The exported tool descriptor only permits `workspaceRoot` with `additionalProperties: false` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tools/advisor-status.ts:10-16], and the CLI manifest mirrors the same one-property shape [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts:57-65]. Public MCP/CLI callers therefore cannot request the diagnostic field promised by the implementation.

```json
{
  "findingId": "F002",
  "claim": "advisor_status semantic-lane health diagnostics are implemented behind includeSemanticHealth/debug, but public descriptors reject those options.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/001-advisor-observability/implementation-summary.md:57-60",
    ".opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:231-237",
    ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:257-281",
    ".opencode/skills/system-skill-advisor/mcp_server/tools/advisor-status.ts:10-16",
    ".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts:57-65"
  ],
  "counterevidenceSought": "Checked the Zod schema, handler, MCP tool descriptor, and daemon-backed CLI manifest. No public descriptor property exposes includeSemanticHealth or debug.",
  "alternativeExplanation": "An internal caller can call readAdvisorStatus directly, but the phase claim is specifically about advisor_status caller diagnostics, so public descriptor reachability is required.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "If descriptor generation elsewhere injects includeSemanticHealth/debug before registration, downgrade to stale source-file descriptor only.",
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
| spec_code | fail | hard | implementation-summary.md:57-60, advisor-tool-schemas.ts:231-237, advisor-status.ts:257-281, tools/advisor-status.ts:10-16 | Handler support does not reach public descriptors. |

## Assessment
- New findings ratio: 0.500000
- Dimensions addressed: security, correctness
- Novelty justification: repeated schema reachability pattern across a different daemon surface.

## Ruled Out
- Prompt exposure: ruled out because the missing descriptor fields block diagnostics rather than leaking prompt content.

## Dead Ends
- Treating `advisor_recommend` attribution as blocked: ruled out because its descriptor does expose `includeAttribution`.

## Recommended Next Focus
Check parent phase status and aggregate traceability now that child phases report completion.
Review verdict: CONDITIONAL
