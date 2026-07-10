# Iteration 7: Angle 7 - conflicts_with Edge Authoring Criteria

## Focus

Define when live `conflicts_with` edges are appropriate and how to gate them.

## Findings

1. The graph-causal lane already supports `conflicts_with` with a negative multiplier of `-0.35`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:28]
2. Negative edges score but never expand onward, reducing blast radius. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:118]
3. Under RRF, graph conflict matches are kept separate and used as a comparator demotion, not mixed into positive ranks. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:770]
4. 003's conflict overlay corrected one top-1 in the conflict band, from 4/5 to 5/5, without writing live conflict edges. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/results/metrics.json:183]
5. Author criteria: a conflict edge must represent mutually exclusive operator intent, have at least one labeled prompt where the target is a proven wrong near-neighbor, and improve or hold all ratchet slices under an overlay before live graph authoring.

## Sources Consulted

- `graph-causal.ts`
- `fusion.ts`
- `003-advisor-rrf-fusion/results/metrics.json`

## Assessment

`newInfoRatio: 0.48`

Novelty justification: converted an inert seam into a cautious authoring protocol.

Confidence: medium-high.

## Reflection

Worked: negative graph edges have bounded propagation semantics.

Failed: generic hub overlap is not enough evidence for conflicts.

Ruled out: authoring conflicts for every overlap.

## Recommended Next Focus

Research command bridge hardcoding and metadata-derived replacement.
