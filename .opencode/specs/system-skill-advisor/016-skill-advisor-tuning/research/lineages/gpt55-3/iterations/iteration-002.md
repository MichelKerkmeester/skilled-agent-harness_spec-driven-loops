# Iteration 2: Vocabulary Authority Split

## Focus
Angle 2. Separate vocabulary that should be reindex-refreshable metadata from vocabulary that should remain frozen scorer logic.

## Findings
1. `TOKEN_BOOSTS` hardcodes broad terms like `audit`, `findings`, `review`, and `regression` to `sk-code`; these overlap with parent hub metadata and are not reindex-refreshable. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:18]
2. `PHRASE_BOOSTS` hardcodes many workflow phrases, including deep-loop phrases and sk-code review phrases, before the scorer iterates over projected skill metadata. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:101]
3. The explicit lane then adds author-projected `intentSignals` and `keywords` from every skill, which means hardcoded boosts and metadata can both vote for the same prompt before final clamping/ranking. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:321]
4. Projection already splits `derived.trigger_phrases` from `derived.key_topics/entities/key_files/source_docs`, making metadata a suitable owner for hub/mode phrasing and entity concepts. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:204]
5. Some hardcoded boosts encode scorer policy rather than vocabulary, for example write-intent code/doc surfaces and review-plus-write disambiguation; those should remain code until a separate policy DSL exists. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:279]

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`

## Assessment
newInfoRatio: 0.82. Novelty: turns the observed overlap into an ownership rule. Confidence: high for the contract, medium for exact migration list.

## Reflection
What worked: distinguishing user-facing hub vocabulary from scorer policy avoids a risky all-or-nothing migration.
What failed: treating all explicit boosts as stale would remove useful policy guards.
Ruled out: migrating every token/phrase boost into metadata.

## Recommended Next Focus
Design the cross-hub collision report that can enforce the vocabulary ownership rule across parent hubs.
