---
title: "Iteration 6: D2 Security — provider factory, registry and custom-model dimensions"
trigger_phrases: []
---

# Iteration 6: D2 Security — provider factory, registry and custom-model dimensions

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`
- executor: `cli-codex model=gpt-5.6-luna`
- nested_dispatch: `false`

## Focus and method

Security and integrity review of the shared embedding registry/factory, startup profile dimension resolution, auto-selection and custom HF model adoption. Eight bounded source/test/document paths were directly re-read. F011 was independently confirmed by comparing the custom-model `dim=0` contract with the startup profile's unconditional HF-local fallback; no new auth or provider-fallback finding was opened beyond the carried model-identity issue.

## Scorecard

- Dimensions covered: security (provider configuration and model/dimension integrity)
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- Carried active findings: F001–F010
- New findings ratio: 1.0 for this pass
- Convergence: score 0, threshold 3; telemetry only under `max-iterations`

## Findings

### P0, Blocker

- None.

### P1, Required

- None new in this slice.

### P2, Suggestions

- **F011 — Custom HF model dimension semantics diverge between auto-selection and startup profile resolution.** The auto-selection path deliberately persists `dim: 0` for a non-canonical HF model because its true dimension is unknown until first embed at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:446-451]`; the provider tests confirm a custom model starts unknown and resolves a server-reported dimension such as `321` at `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/embedders/hf-local-client.vitest.ts:664-684]`. In contrast, `resolveActiveProfileDim` returns `768` for every `hf-local` model after only checking an explicit environment dimension at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/profile.ts:195-215]`, and `getStartupEmbeddingProfile` uses that value at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:696-713]`. A custom model can therefore receive a provisional profile/table identity that disagrees with the auto-selection/provider contract before its first vector is observed. No focused test covers a custom HF model through `getStartupEmbeddingProfile`.
  - Recommendation: use an explicit unknown/provisional representation consistently, require `EMBEDDING_DIM` for custom startup profile derivation, or defer profile/table materialization until the provider reports its dimension; add a custom-model cross-path test.

## Search and ruled-out checks

- The registry has one frozen canonical manifest and derives both local fallback names from `MANIFESTS[0]` at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/registry.ts:18-31,145-173]`; no stale legacy default was found in the current registry path.
- Factory provider-name validation rejects unsupported values and local-first resolution/fallback order remains explicit at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:626-668,748-806,1002-1055]`; no new provider-selection bypass was opened.
- The current HF client tests cover canonical dimensions and custom first-embed callbacks, but not startup profile parity for custom models at `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/embedders/hf-local-client.vitest.ts:640-684]`.
- The prior P1 model-identity boundary remains active: `canLoad` still does not consume its model option and readiness can return after a mismatch; this pass did not duplicate it.
- No test or repository validator was run because the user-bound write surface forbids commands that can write outside the lineage.

## Traceability checks

- `spec_code`: partial. The target packet names the embedding seam as preserved behavior; the custom-model cross-path contract remains incomplete.
- `checklist_evidence`: blocked. No root `checklist.md` exists; authoritative validation was not run under the lineage-only boundary.
- `feature_catalog_code`: not applicable to this focused slice.
- `playbook_capability`: not applicable to this focused slice.

## Adversarial self-check

- Hunter: traced the registry fallback, factory dimension fallback, startup profile, auto-select custom branch and first-embed callback as separate producers of dimension metadata.
- Skeptic: F011 is limited to unlisted custom HF models; canonical Nomic behavior remains consistently 768, and the current provider can eventually adopt the true server dimension.
- Referee: F011 remains P2 because it is a latent startup/profile seam requiring a custom model, while the active P1 model-identity finding covers a separate readiness authorization boundary.

## Next focus

Review retrieval ranking, determinism and trigger-index publication paths, carrying all active findings. Continue to treat convergence as telemetry until iteration 10.

Review verdict: CONDITIONAL
