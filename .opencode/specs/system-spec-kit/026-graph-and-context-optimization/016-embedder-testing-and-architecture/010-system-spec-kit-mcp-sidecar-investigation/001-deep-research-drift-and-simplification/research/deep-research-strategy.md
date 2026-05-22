# Deep-Research Strategy: System-Spec-Kit MCP Sidecar

## Charter

Investigate the system-spec-kit MCP server sidecar-related code for drift, dead code, security risks, over-engineering, simplification opportunities without function loss, and refinement candidates. The output is evidence and recommendations only; implementation is deferred to a later remediation packet.

## Scope

Primary files:
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
- `.opencode/bin/lib/ensure-rerank-sidecar.cjs`

Immediate dependencies:
- `execution-router.ts`
- `schema.ts`
- `registry.ts`

Intersecting sidecar surfaces:
- `.opencode/skills/system-rerank-sidecar/`
- `.opencode/skills/mcp-coco-index/` sidecar interfaces

## Investigation Angles

| Angle | Question |
|-------|----------|
| Drift detection | Where does implementation behavior diverge from docs, specs, config defaults, or sibling sidecar contracts? |
| Dead code | Which code paths, options, helpers, or tests no longer have live callers or reachable behavior? |
| Security risks | Where do local-service boundaries, auth, env propagation, path handling, process ownership, or logging leak trust? |
| Over-engineering | Which abstractions add state, branching, or lifecycle complexity without a current problem? |
| Simplification opportunities | Which changes would reduce code or state without losing behavior? |
| Refinement | Which small correctness, observability, typing, or ergonomics improvements should be queued for remediation? |

## Dimension Rotation

Iterations 1-20 cycle through the six angles:

1. Drift detection
2. Dead code
3. Security risks
4. Over-engineering
5. Simplification opportunities
6. Refinement
7. Drift detection
8. Dead code
9. Security risks
10. Over-engineering
11. Simplification opportunities
12. Refinement
13. Drift detection
14. Dead code
15. Security risks
16. Over-engineering
17. Simplification opportunities
18. Refinement
19. Drift detection
20. Dead code

## Evidence Rules

- Cite file paths and symbols for every actionable finding.
- Distinguish implemented behavior from inferred behavior.
- Mark negative findings explicitly when an angle yields no issue.
- Deduplicate by stable fingerprint: angle + file + symbol + failure mode.
- Do not modify implementation files or research artifacts outside this phase.
