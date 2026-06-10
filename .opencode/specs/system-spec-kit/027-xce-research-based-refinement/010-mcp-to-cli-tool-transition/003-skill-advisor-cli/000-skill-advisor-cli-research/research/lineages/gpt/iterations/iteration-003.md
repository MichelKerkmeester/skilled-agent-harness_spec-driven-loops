# Iteration 3: KQ3 Affordance Transfer

## Focus

Determine which generic CLI-over-daemon answers transfer from spec-memory and which need skill-advisor-specific deltas.

## Findings

1. Exported Zod schemas exist for the four advisor tools in `AdvisorToolInputSchemas`, which is the closest codegen sibling for a generated CLI registry [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:377].
2. The skill graph tools currently define JSON schemas inline in tool descriptors, so full 9-tool codegen needs both `AdvisorToolInputSchemas` and `skillGraphToolDefinitions` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:21].
3. Workspace-root bounding is stricter here than a generic CLI shell wrapper: schemas canonicalize and allow only repo root, temp dirs, or explicit allowlist entries [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:71].
4. Trusted-caller semantics are unique to mutating graph tools. `skill_graph_scan` and `skill_graph_propagate_enhances` reject untrusted callers [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:34], [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:40].
5. The public `advisor_recommend` schema intentionally excludes caller-supplied affordances to avoid prompt-stuffing input [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:123].

## Sources Consulted

- `schemas/advisor-tool-schemas.ts`
- `tools/skill-graph-tools.ts`
- `handlers/skill-graph/scan.ts`
- `handlers/skill-graph/propagate-enhances.ts`

## Assessment

`newInfoRatio`: 0.70. The generic pattern transfers, but the CLI cannot be schema-generated from one object today.

## Reflection

What worked: checking schema exports before inventing CLI contracts. What failed: assuming all tool schemas were in Zod. Ruled out: a hand-written schema fork.

## Recommended Next Focus

KQ4: inspect `skill_advisor.py` as prior art and measure local-vs-native scorer divergence.
