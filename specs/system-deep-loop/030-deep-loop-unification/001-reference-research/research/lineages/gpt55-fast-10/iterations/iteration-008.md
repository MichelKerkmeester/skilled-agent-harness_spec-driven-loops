# Iteration 8: Check GLM And MiMo Model Registry Facts

## Focus

Verify whether model-profile data already authorizes GLM-5.2 to MiMo-v2.5-Pro fallback.

## Findings

- MiMo-v2.5-Pro is an active profile in a Xiaomi token-plan pool [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190].
- MiMo's profile uses `xiaomi-token-plan`, so it is not the same provider pool as GLM [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:203].
- MiMo does not declare a fallback target today [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:204].
- GLM-5.2 is an active profile in a Z.ai coding-plan pool [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:255].
- GLM uses `zai-coding-plan` and also has `fallback_target: null`, so automatic GLM-to-MiMo would be new policy rather than latent configuration [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:268] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:269].

## Sources Consulted

- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`

## Assessment

- `newInfoRatio`: 0.35.
- Novelty justification: mostly confirmed known fallback constraints, but clarified that registry approval is not already present.
- Confidence: high for model-profile facts, medium for fallback priority because provider reliability and operator preference remain external.

## Reflection

Cross-pool fallback is technically plausible, but profile metadata does not authorize it. The right implementation would add explicit policy and smoke tests, not infer fallback from pool separateness.

## Recommended Next Focus

Validate child 003's staging and exit gates to confirm whether external reference migration is already sufficiently planned.
