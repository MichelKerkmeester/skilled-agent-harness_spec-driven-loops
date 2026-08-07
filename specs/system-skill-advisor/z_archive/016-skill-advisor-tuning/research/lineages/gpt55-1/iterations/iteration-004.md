# Iteration 4: Angle 4 - Full Projection Surface Guard

## Focus

Close the typed-but-unprojected and projected-but-unguarded gap across `intent_signals`, `derived.trigger_phrases`, and `derived.key_topics`.

## Findings

1. The current guard reads graph trigger phrases from top-level `trigger_phrases` and `derived.trigger_phrases` only. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:130]
2. The advisor projection reads `intent_signals` from the DB row and phrase-expands them into `SkillProjection.intentSignals`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:231]
3. The same projection turns `derived.key_topics`, `derived.entities`, `derived.key_files`, and `derived.source_docs` into `derivedKeywords`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:216]
4. `scoreDerivedLane` scores `derivedTriggers` and `derivedKeywords` together, so key topics and entity-like fields can influence ranking. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:62]
5. `buildExecutorAliasTable` provides the right cautionary precedent: use name variants, intent signals, and derived trigger phrases for user aliases, but intentionally exclude derived keywords because file paths and doc names over-match. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:245]
6. Proposal: add a `projectionSurface` helper for guards with three buckets: `aliasSurface` (`intent_signals`, `derived.trigger_phrases`), `keywordSurface` (`derived.key_topics`, selected entities), and `entitySurface` (`key_files`, `source_docs`, object entities). Only aliasSurface must match mode aliases; keyword/entity surfaces get collision and overmatch checks.

## Sources Consulted

- `parent-hub-vocab-sync.cjs`
- `projection.ts`
- `derived.ts`
- `executor-delegation.ts`

## Assessment

`newInfoRatio: 0.74`

Novelty justification: identified that guard coverage and advisor scoring surfaces are materially different.

Confidence: high.

## Reflection

Worked: using scorer projection as source of truth instead of graph JSON shape alone.

Failed: treating `key_topics` as harmless metadata; it is a scoring input.

Ruled out: requiring every key file/source doc to be a typed alias.

## Recommended Next Focus

Define the labeled ambiguity set that proves the guards improved actual routing.
