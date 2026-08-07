# Alignment Iteration 16

- Lane: sk-code::code::.opencode/skills/sk-design/design-md-generator/backend/scripts/, .opencode/skills/sk-design/styles/lib/database/, .opencode/skills/sk-design/shared/authored-brand/, .opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs
- Authority: sk-code / code
- Status: complete
- Findings: 6 (new ratio 1.2)

## Artifacts Checked

- .opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/framework-detect.ts
- .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts

## Findings - P0

_none_

## Findings - P1

_none_

## Findings - P2

- P2: DOM collector exceeds the utility-module length guideline
- P2: DOM collector comments violate the capitalization rule
- P2: Extraction entry point exceeds the main-entry length guideline
- P2: Extraction entry-point comments violate the capitalization rule
- P2: Formatter module exceeds the utility-module length guideline
- P2: Formatter comments violate the capitalization rule

## Summary

Six new P2 conformance findings: three oversized modules and three files containing lowercase-starting comments; deterministic adapter checks found no P0/P1 drift, while framework-detect.ts and guided-run.ts were confirmed clean.

## Next Focus

Resolved by partition-corpus on the next iteration.


_Narrative synthesized by the read-only-leaf writer from the structured iteration record._
