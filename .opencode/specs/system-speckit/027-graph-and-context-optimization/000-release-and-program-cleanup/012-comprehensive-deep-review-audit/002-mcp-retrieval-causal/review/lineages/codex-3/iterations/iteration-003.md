# Iteration 003 - Traceability Pass

## Scope

Focused on public MCP schema drift and causal read-path feature claims.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts`

## Findings

### F004 - P2 - `memory_causal_stats` implements `backfill` args that the public schema rejects

Claim: `memory_causal_stats` has a handler-level `backfill` capability and test-visible command hint, but its MCP input schema declares no properties and `additionalProperties: false`, so callers cannot invoke the implemented backfill option through the public tool contract.

Evidence:

- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:92] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:110] define `CausalStatsArgs.backfill`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:803] reads `args?.backfill`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:825] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:834] run `backfillRelationInference` from that option.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:898] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:912] emit user-visible dry-run or write hints when the backfill path runs.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:915] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:927] include `backfill` in the success payload.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts`:34] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts`:36] validate tool args before dispatching to `handleMemoryCausalStats`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`:454] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`:457] define `memory_causal_stats` with empty `properties` and `additionalProperties: false`.
- [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts`:71] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts`:75] assert the backfill job is advertised through `memory_causal_stats` hints.

Impact: the handler, tests, and user-facing hints advertise a backfill operation that the public schema blocks. Operators trying to run the suggested command cannot pass the documented option unless they bypass schema validation.

Concrete fix: either add the `backfill` object to `tool-schemas.ts` with its bounded fields, or remove the handler option and hints from the public path if backfill is meant to stay internal. Add a schema-level test that validates `{ backfill: { dryRun: true } }` if the feature is intended to be public.

Claim adjudication:

- Counterevidence sought: whether another tool schema file exposes the richer `CausalStatsArgs`.
- Counterevidence found: the tool definition used for MCP exposure has an empty object schema, and dispatch validates against the tool name before parsing.
- Alternative explanation: the backfill path is intentionally hidden. If so, the public hints should not tell operators to run it through `memory_causal_stats`.
- Final severity: P2.
- Confidence: medium-high.
- Downgrade trigger: downgrade to nit if there is an explicit internal-only route for backfill and the public hints are removed.

## Traceability Check

- `feature_catalog_code`: covered. Handler feature comments and output hints were compared with the tool schema and dispatch path.
- `playbook_capability`: covered for causal read-path capability claims.

## Reducer Delta

- New findings: F004.
- Dimensions covered: traceability.
- Severity delta: P2 +1.
- New findings ratio: 0.06.

Review verdict: CONDITIONAL
