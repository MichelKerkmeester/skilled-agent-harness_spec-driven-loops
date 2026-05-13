# Deep Review v4 Iteration 049 - new regressions and residual release blockers

## Focus

Look for regressions or oversights Codex 012 missed outside the named checks.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| P0-V3-SEC-001 | P0 | `.env:12` | Still valid and intentionally out of agent scope: `.env` still contains a full GitHub personal access token value. Token content intentionally omitted. | Rotate the token outside the agent flow, then replace/remove the local secret without copying it into docs or review artifacts. |
| P1-V4-VOYAGE-001 | P1 | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:350` | The new Voyage shadow warning exists, but `resolveStartupEmbeddingConfig()` calls `resolveProvider()` and awaits `validateApiKey()` before `getProviderInfoForResolution()` emits the warning at `factory.ts:361`. `getStartupEmbeddingProfile()` also calls `resolveProvider()` directly at `factory.ts:336` and does not call the pre-resolution shadow guard. This means at least one startup route still resolves or validates Voyage before warning about `auto` choosing it. | Call `warnIfVoyageWouldShadowLocal(validateConfiguredEmbeddingsProvider())` before any `resolveProvider()` call in startup/profile/config paths, especially before validation or DB-path derivation. |

## Notes

The v3 remediation materially improved the tree. The remaining release-blocking item is the live PAT; the highest code-level concern is warning timing around Voyage auto-resolution.
