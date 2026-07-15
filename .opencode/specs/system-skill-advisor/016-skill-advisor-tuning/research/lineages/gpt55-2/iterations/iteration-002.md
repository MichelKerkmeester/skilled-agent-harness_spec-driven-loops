# Iteration 2: Vocabulary Authority Split

## Focus

Investigate charter angle 2: competing authorities between `TOKEN_BOOSTS`/`PHRASE_BOOSTS` and graph metadata.

## Findings

1. The explicit lane hardcodes global token ownership such as `audit -> sk-code`, `review -> sk-code`, and `deep review -> deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:18] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:173].
2. The explicit lane also loops over every projected skill's `intentSignals` and frontmatter keywords, so metadata contributes to the same lane after hardcoded boosts [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:321].
3. The explicit lane clamps each skill score at 1, meaning duplicated metadata plus hardcoded boosts can saturate and hide smaller negative evidence [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:340].
4. Projection intentionally splits derived triggers from derived keywords to avoid direct value-by-reference double counting [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:204].
5. The derived lane recombines `derivedTriggers` and `derivedKeywords` for scoring, so duplicated author vocabulary can still appear in more than one scoring path even after projection split [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:61].

## Sources Consulted

- `lib/scorer/lanes/explicit.ts`
- `lib/scorer/projection.ts`
- `lib/scorer/lanes/derived.ts`

## Assessment

- newInfoRatio: 0.78
- Novelty: mapped the code/metadata double-count path and clamp effect.
- Confidence: high for the flow; medium for exact route impact until measured.

## Reflection

- Worked: following the scorer data path from projection to explicit and derived lanes.
- Failed: direct grep alone did not show how saturation interacts with projection.
- Ruled out: moving all hardcoded boosts into metadata, because command syntax and cross-skill disambiguators need code-owned semantics.

## Recommended Next Focus

Design a cross-hub collision report over normalized phrase owners.
