# Iteration 4: Projection Surface Validation Gap

## Focus
Angle 4. Close the gap between parent-hub vocabulary guards and the actual advisor projection surface.

## Findings
1. SQLite projection reads `intent_signals` and `derived` from `skill_nodes`, then appends command bridges. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:600]
2. Filesystem projection reads `graph-metadata.json`, `SKILL.md` frontmatter, domains, intent signals, derived trigger phrases, derived keywords, lifecycle, redirect fields, and then appends command bridges. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:639]
3. The derived lane scores both `skill.derivedTriggers` and `skill.derivedKeywords`, plus affordances and doc triggers. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:61]
4. `parent-hub-vocab-sync` computes `triggerPhraseCoverage` only from graph trigger phrases against typed vocabulary/registry aliases; it does not validate that `intent_signals` or `derived.key_topics` cover every registry mode alias. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:397]

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs`

## Assessment
newInfoRatio: 0.64. Novelty: names the precise typed-but-unprojected gap. Confidence: high.

## Reflection
What worked: comparing projection consumers to guard outputs found a bounded missing check.
What failed: trigger phrase coverage alone is too narrow for current scorer behavior.
Ruled out: validating only `derived.trigger_phrases`.

## Recommended Next Focus
Build the ambiguity fixture design around parent-hub prompts most likely to hit this projection gap.
