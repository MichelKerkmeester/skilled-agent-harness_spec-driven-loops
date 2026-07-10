# Iteration 9: Query-Class, Hub-Router, And Eval-Bucket Crosswalk

## Focus
Angle 9. Align query-class, hub-router intent classes, and eval buckets without forcing one taxonomy to own all others.

## Findings
1. `classifyAdvisorQuery` is a coarse scorer-local classifier with classes `implementation`, `review`, `documentation`, `memory`, `tooling`, and `unknown`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:121]
2. Query class only changes lane multipliers when `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING` is enabled. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:638]
3. Hub routers define mode-level classes such as sk-code `code-review-aliases` and sk-design `audit-aliases`; these are richer and hub-specific. [SOURCE: file:.opencode/skills/sk-code/hub-router.json:48] [SOURCE: file:.opencode/skills/sk-design/hub-router.json:61]
4. Eval hardening separately computes buckets for review, memory_save, and delegation; those buckets are global diagnostics, independent of selected skill scope. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:646]

## Proposal
Add a crosswalk fixture, not runtime derivation:
- queryClass `review` maps to sk-code code-review, sk-design audit, and deep-loop review depending on loop/subject cues;
- queryClass `documentation` maps to sk-doc, design md-generator, and spec-kit docs depending on artifact noun;
- queryClass `tooling` maps to mcp-code-mode, mcp-chrome-devtools, mcp-figma, and command bridges;
- eval buckets define minimum coverage rows for high-risk crosswalk classes.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/sk-code/hub-router.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts`

## Assessment
newInfoRatio: 0.31. Novelty: crosswalk proposal, not new source facts. Confidence: medium-high.

## Reflection
What worked: separating top-level skill selection from hub-internal mode routing keeps responsibilities clean.
What failed: making query-class read hub routers at runtime would add coupling and duplicate hub responsibility.
Ruled out: full runtime derivation of query classes from hub routers.

## Recommended Next Focus
Finish with semantic_shadow mcp-neighbor hygiene.
