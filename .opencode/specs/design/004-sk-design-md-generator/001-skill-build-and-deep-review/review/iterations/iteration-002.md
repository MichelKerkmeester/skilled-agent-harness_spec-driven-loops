# Iteration 2: correctness — clustering + validation

Reviewed: .opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts, .opencode/skills/sk-design-md-generator/tool/scripts/validate.ts, .opencode/skills/sk-design-md-generator/tool/scripts/css-analyzer.ts

Findings: 3 (P0=0 P1=2 P2=1)


## F002-01 [P1] Hue-grouping angular distance formula broken for negative JS modulo
- File: cluster.ts:779
- Evidence: The expression `Math.abs(((color.h - other.h + 180) % 360) - 180)` is the standard minimal-angular-distance formula, but it assumes a non-negative modulo. JavaScript's `%` operator preserves the dividend's sign. When `(color.h - other.h + 180) < 0` — which occurs when the anchor hue is smaller and the other hue wraps around 360° (e.g., anchor=5°, other=355°) — the result is negative (e.g., -170), making the computed "distance" 350° instead of the true 10°. This makes scale grouping across the 0°/360° boundary order-dependent: the same pair may or may not be grouped depending on iteration order.
- Fix: Replace with a sign-safe formula, e.g.: `const d = ((color.h - other.h) % 360 + 360) % 360; Math.min(d, 360 - d) <= 10`, or equivalently `((color.h - other.h + 180) % 360 + 360) % 360 - 180`.

```json
{
"claim": "Hue-grouping angular distance formula broken for negative JS modulo",
"evidenceRefs": [
"cluster.ts:779"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F002-02 [P1] parseTransitionShorthand misidentifies CSS property when transition shorthand omits property name
- File: css-analyzer.ts:229
- Evidence: Line 229 assigns `tokens[0]` as the `property`. When a transition shorthand omits the property name (valid CSS, e.g. `transition: 0.2s ease` where property defaults to `all`), the first whitespace-separated token is a time value like `0.2s`, not a property name. The extracted `TransitionInfo.property` will then incorrectly contain `'0.2s'` instead of `'all'`.
- Fix: Add logic to distinguish time values (matching `/^\d+\.?\d*(s|ms)$/`) from property names; if the first token is a time value, default `property` to `'all'` and shift remaining tokens.

```json
{
"claim": "parseTransitionShorthand misidentifies CSS property when transition shorthand omits property name",
"evidenceRefs": [
"css-analyzer.ts:229"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F002-03 [P2] Identical classifyShadow redefined locally, shadowing the exported version
- File: cluster.ts:1044
- Evidence: The exported `classifyShadow` at line 374 and the local one at line 1044 are character-for-character identical implementations. The local copy shadows the exported one inside `clusterTokens`. Future edits risk updating only one copy, causing silent behavioral divergence between the exported utility and the internal clustering pipeline.
- Fix: Delete the local copy at line 1044 and call the exported `classifyShadow` (line 374) directly within `clusterTokens`.
