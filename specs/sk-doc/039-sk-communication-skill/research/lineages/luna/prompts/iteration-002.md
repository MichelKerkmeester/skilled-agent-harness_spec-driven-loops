# Iteration 2 Research Prompt

## Focus

Quantify protection granularity and adjacent-span behavior, then inspect the prompt-profile contract, provider-control evidence, model-tier surfaces, and tests for few-shot or quality guidance.

## Questions

1. Which implementation choices cause technical prose to fragment into opaque tokens, and what grouping or aliasing strategies could reduce the model's copying burden without weakening local byte restoration?
2. What prompt/profile fields and provider controls are actually wired today? Can per-model instructions, examples, temperature, or thinking settings be applied to the DeepSeek smoke route, or would the current fail-closed evidence rules reject them?
3. What evidence exists for choosing a higher-capacity model tier, and what tests would distinguish a real readability gain from an unchanged or artifact-bearing rewrite?

## Required evidence

- Cite exact files and line ranges for range selection, token construction/restoration, adapter message shape, prompt validation, controls, provider presets, and fixtures.
- Run a read-only local protection probe with representative adjacent technical spans and record source/encoded lengths, span counts, kinds, and encoded text.
- Separate confirmed implementation facts from recommendations and model-quality inferences.

## Boundaries

Do not modify package or skill sources. Preserve the exact-original fallback, privacy routing, and ordered-token restoration invariants in every recommendation.
