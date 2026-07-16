# Iteration 7: conflicts_with Edge Authoring Criteria

## Focus
Angle 7. Decide whether to author `conflicts_with` edges into the live skill graph.

## Findings
1. The graph-causal lane supports negative propagation for `conflicts_with` at multiplier `-0.35`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:28]
2. Negative edges score but never expand, preventing negative evidence from becoming positive traversal support. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:118]
3. The target parent hubs have empty conflict arrays: sk-code, sk-design, and deep-loop-workflows all declare `conflicts_with: []`. [SOURCE: file:.opencode/skills/sk-code/graph-metadata.json:23] [SOURCE: file:.opencode/skills/sk-design/graph-metadata.json:28] [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:40]
4. Fusion only uses graph conflict adjustment in RRF mode, and reports a metric when graph conflict demotion applies. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:752]

## Proposal
Author `conflicts_with` only when all criteria hold:
- The pair is mutually exclusive for a concrete prompt class.
- A labeled fixture shows top-1 or margin failure without the edge.
- The conflict is directional or symmetric by documented intent, not by broad family membership.
- The edge improves the cross-hub ambiguity set without lowering full corpus, holdout, and bucket ratchets.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- Parent hub `graph-metadata.json` files

## Assessment
newInfoRatio: 0.41. Novelty: criteria over mechanism. Confidence: high that broad conflict edges are premature.

## Reflection
What worked: reading the lane implementation clarified that conflict edges are powerful but bounded.
What failed: no live conflict examples exist to reuse as a pattern.
Ruled out: broad peer-hub conflicts.

## Recommended Next Focus
Address hardcoded command bridge projection.
