# Iteration 6: Stress-Test Advisor Projection And Corpus Migration

## Focus

Evaluate whether advisor migration is covered by ordinary reference replacement or needs staged handling for generated, hand-authored, graph, and corpus surfaces.

## Findings

- `skill_advisor.py` hardcodes the deep-loop mode registry path, so the Python advisor surface must be updated before routing validation [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83].
- The TypeScript scorer alias projection carries generated deep-loop entries and must be regenerated rather than hand-edited [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:21].
- The generated projection hash is a drift guard; changing generated fields without regeneration risks hash mismatch [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:23].
- The hand-authored `MERGED_DEEP_SKILL_ID` constant still targets `deep-loop-workflows`, so hand constants are a separate migration class [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109].
- Explicit scorer boosts also refer to `deep-loop-workflows`, which means routing scores can drift even if generated aliases are correct [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:28] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:31].

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json`

## Assessment

- `newInfoRatio`: 0.62.
- Novelty justification: identified the highest-risk migration bundle: generated projection/hash, hand constants, lexical boosts, graph edges, corpus, and divergence fixtures.
- Confidence: high, because the cited advisor code separates generated and hand-authored surfaces.

## Reflection

Advisor work is likely the riskiest child 003 segment. A green grep is not enough; generated projections, route accuracy, and divergence approvals need their own gates.

## Recommended Next Focus

Evaluate fallback-router wiring, because the question is whether it belongs in this merge or remains optional feature scope.
