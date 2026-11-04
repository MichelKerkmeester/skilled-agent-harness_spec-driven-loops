---
title: Stripe DESIGN.md Writing Notes
description: Editorial notes explaining the measured data, fidelity decisions, and validation caveats in the Stripe v3 Style Reference example.
trigger_phrases:
  - Stripe DESIGN.md writing notes
  - Stripe style reference validation
  - Stripe extraction caveats
importance_tier: normal
contextType: general
version: 1.0.2.0
---

# Writing Notes: Stripe DESIGN.md

Open this beside the Stripe `DESIGN.md` when a value needs explaining: the notes record what the extractor measured, where the prose had to infer, and what the validator reported when the file was written.

## 1. OVERVIEW

This DESIGN.md is a v3 **Style Reference**, regenerated from the existing `tokens.json` with no re-crawl — all values are deterministically pre-rendered (Colors, Spacing & Shapes, Surfaces, Quick Start pasted unchanged) and the prose is authored from the build-write-prompt FACTS block only.

- **Validation at generation:** `validate.ts` PASS, score 99/100 (values 99, claims 100), zero critical failures. A current `validate.ts` run over the shipped pair reports **45/100, FAIL** (eleven hard failures: missing `## Motion` and ten missing Quick Start groups, plus two advisory warnings) until the exemplar is regenerated. The `unknown-font: ### Tailwind v4` warning is a parser false positive on the Quick Start code-block subheading, not a real font claim.
- **Elevation is real, not flat:** 3 shadow tokens, two navy/near-black tinted (`rgba(50,50,93,0.12)`, `rgba(23,23,23,0.08/0.06)`) — written as a genuine chromatic-depth section, with the 19 gradients kept decorative.
- **Focus per FACTS:** the FACTS block says "Focus: NOT captured," so no focus-ring consistency is asserted, even though `a11yTokens.focusIndicator.consistent` reads `true` against an empty style object (extractor artifact). Dark mode correctly omitted (not detected).
- **Data-quality caveat:** the single crawled page resolved to Stripe's Japanese locale, so all component `sampleTexts` are Japanese (`料金体系`, `始める`); component roles were inferred from style/position, not label text. `sohne-var` is the type-scale font; `SourceCodePro` (weight 500, mono) is loaded but absent from the scale, noted in the Typography block.
