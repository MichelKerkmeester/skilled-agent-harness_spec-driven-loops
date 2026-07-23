# Alignment Iteration 15

- Lane: sk-code::code::.opencode/skills/sk-design/design-md-generator/backend/scripts/, .opencode/skills/sk-design/styles/lib/database/, .opencode/skills/sk-design/shared/authored-brand/, .opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs
- Authority: sk-code / code
- Status: complete
- Findings: 7 (new ratio 1)

## Artifacts Checked

- .opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/framework-detect.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts

## Findings - P0

_none_

## Findings - P1

- P1: Public TypeScript APIs lack required TSDoc comments across the checked slice.
- P1: Catch handling does not explicitly type errors as unknown and narrow them before use.
- P1: guided-run resolves --design-md lexically but deletes and rewrites it without boundary validation.

## Findings - P2

- P2: extract.ts places section 5 before section 4 and omits the required constants section.
- P2: formatters-v3.ts and guided-run.ts lack the required numbered section-divider structure.
- P2: Several explanatory comments begin with lowercase text, violating comment-capitalization rules.
- P2: extract.ts uses an unjustified non-null assertion for candidate.css.

## Summary

Deterministic sk-code checks returned no findings; seven new reasoning-layer creation-standard findings remain, with no known-deviation matches.

## Next Focus

Resolved by partition-corpus on the next iteration.


_Narrative synthesized by the read-only-leaf writer from the structured iteration record._
