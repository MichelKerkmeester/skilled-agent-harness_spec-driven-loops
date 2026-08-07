# Iteration 2: Resolve Reasonix identity and provider scope

## Focus

Compare the historical cache-first architecture with the current Reasonix project surface.

## Findings

- The historical `v1` architecture explicitly describes Reasonix as opinionated around DeepSeek economics and exact-prefix behavior. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md]
- Current Reasonix README text still calls the harness DeepSeek-native and tuned around DeepSeek prefix caching, but now documents configurable providers and any OpenAI-compatible endpoint. [SOURCE: https://github.com/esengine/deepseek-reasonix]
- DeepSeek’s curated agent repository describes Reasonix as a DeepSeek-native terminal agent that talks directly to `api.deepseek.com`; this validates the project’s origin and default integration, not permanent exclusivity. [SOURCE: https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/docs/reasonix.md]
- Verdict: “DeepSeek-native” is verified; “DeepSeek-only” is historically supported but refuted as an unqualified current capability claim.

## Sources Consulted

- `https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md`
- `https://github.com/esengine/deepseek-reasonix`
- `https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/docs/reasonix.md`

## Assessment

- newInfoRatio: 0.88
- Novelty justification: Version-aware reading resolves an apparent contradiction between old architecture and current provider configuration.
- Confidence: High for documented capabilities; medium for deployment prevalence.

## Reflection

- Worked: Pinning the architecture source to `v1` prevented old non-goals from being mistaken for the current contract.
- Failed/ruled out: A timeless “DeepSeek-only” label is ruled out.

## Recommended Next Focus

Audit the 99.82% and $61→$12 numbers and their provenance.
