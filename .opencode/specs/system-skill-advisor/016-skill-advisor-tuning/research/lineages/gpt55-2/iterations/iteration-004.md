# Iteration 4: Projection Surface Guard

## Focus

Investigate charter angle 4: the guard validates `trigger_phrases` but not all advisor-projected surfaces.

## Findings

1. SQLite projection reads `intent_signals` from `skill_nodes` and maps them to `SkillProjection.intentSignals` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:600] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:231].
2. `derived.trigger_phrases` becomes `derivedTriggers`, while `derived.key_topics`, `entities`, `key_files`, and `source_docs` become `derivedKeywords` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:213].
3. Filesystem fallback applies the same split and appends command bridges [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:639].
4. The derived extractor pushes graph `intent_signals` into its bucket pipeline and candidate triggers [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/derived/extract.ts:183].
5. Therefore a projection-surface guard should assert that every registry alias is visible in at least one consumed field: `intentSignals`, `derivedTriggers`, `derivedKeywords`, `keywords`, or an explicit exemption.

## Sources Consulted

- `lib/scorer/projection.ts`
- `lib/derived/extract.ts`
- `state_outputs.md` for output shape

## Assessment

- newInfoRatio: 0.58
- Novelty: converted a raw metadata validation problem into a projected-field validation problem.
- Confidence: high.

## Reflection

- Worked: reading both SQLite and filesystem projection paths.
- Failed: validating only graph JSON would miss fallback behavior and command bridges.
- Ruled out: trigger-only coverage.

## Recommended Next Focus

Build a labeled cross-hub ambiguity set and recapture path.
