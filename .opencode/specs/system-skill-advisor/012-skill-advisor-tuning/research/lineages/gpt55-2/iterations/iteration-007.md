# Iteration 7: conflicts_with Authoring Criteria

## Focus

Investigate charter angle 7: whether to author `conflicts_with` edges into the live skill graph.

## Findings

1. The graph-causal lane assigns `conflicts_with` a negative multiplier of `-0.35` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:28].
2. Negative edges score but never expand, so conflict edges suppress targets without propagating graph support through them [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:118].
3. The RRF conflict-rerank test confirms opt-in graph conflict demotions are counted and deterministic when RRF is enabled [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/conflict-query-rerank.vitest.ts:96].
4. The 003 benchmark found RRF needs the conflict-rerank seam when conflict edges exist, but the live corpus currently has zero `conflicts_with` edges [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md:67].

## Sources Consulted

- `lib/scorer/lanes/graph-causal.ts`
- `tests/scorer/conflict-query-rerank.vitest.ts`
- `003-advisor-rrf-fusion/benchmark-results.md`

## Assessment

- newInfoRatio: 0.31
- Novelty: separated edge authoring policy from RRF seam correctness.
- Confidence: high on mechanics; medium on exact edge list.

## Reflection

- Worked: graph lane code gives clear semantics.
- Failed: live edge authoring cannot be tested without mutation.
- Ruled out: broad sibling-to-conflict conversion.

## Recommended Next Focus

Derive command bridges from metadata rather than hardcoded projection literals.
