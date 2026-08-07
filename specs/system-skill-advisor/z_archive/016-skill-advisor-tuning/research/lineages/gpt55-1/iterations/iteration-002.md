# Iteration 2: Angle 2 - Competing Vocabulary Authorities

## Focus

Separate vocabulary that should remain in frozen scorer code from vocabulary that should be reindex-refreshable metadata.

## Findings

1. `TOKEN_BOOSTS` and `PHRASE_BOOSTS` are frozen code authorities for many domains, including broad `audit`, `review`, slash commands, colon commands, and deep-loop terms. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:18]
2. The same explicit lane also consumes projected `skill.intentSignals` and `skill.keywords` for every skill, so metadata and hardcoded phrase boosts can stack before the lane is clamped to 1.0. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:327]
3. Derived generated scoring adds another lane over `derivedTriggers` and `derivedKeywords`, creating cross-lane double-counting for copied phrases even after explicit-lane clamping. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:61]
4. `projection.ts` deliberately split `derived.trigger_phrases` from `key_topics/entities/key_files/source_docs`, so the right contract is typed surface ownership, not a monolithic phrase list. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:204]
5. Syntax-bearing commands (`/deep:start-research-loop`, `:review:auto`, `/memory:save`) need code-level exactness; mode synonyms and hub vocab should live in graph metadata and hub-router vocabulary. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:101]

## Sources Consulted

- `lanes/explicit.ts`
- `lanes/derived.ts`
- `projection.ts`

## Assessment

`newInfoRatio: 0.86`

Novelty justification: connected the authority split to both pre-clamp explicit scoring and cross-lane derived evidence.

Confidence: high.

## Reflection

Worked: using projection semantics to define the contract.

Failed: a simple delete-list is not enough; each phrase needs an owner class.

Ruled out: moving all vocabulary out of code.

## Recommended Next Focus

Design a cross-hub collision guard that can enforce the ownership contract.
