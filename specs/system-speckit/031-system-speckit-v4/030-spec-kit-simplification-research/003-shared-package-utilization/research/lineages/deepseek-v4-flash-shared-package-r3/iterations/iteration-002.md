# Iteration 2 — Type duplication in consumer files

Angle: shared/context-types.ts + shared/types.ts (the type modules), then the type declarations at the top of consumer files in runtime/cli/core/*.ts and runtime/lib/validation/*.ts. A consumer re-declaring a shape shared already exports is a finding.

Shared type inventory (verified): context-types.ts exports CanonicalContextType, ContextType, CANONICAL_CONTEXT_TYPES, LEGACY_CONTEXT_TYPE_ALIASES, resolveCanonicalContextType, isLegacyContextType. types.ts exports EmbeddingProfileData, EmbeddingProfile, IEmbeddingProvider, EmbeddingProfileDtype, ProviderMetadata, UsageStats, ProviderInfo (+more). Shared also exports ParsedFrontmatter (frontmatter/parse-frontmatter.ts:18); post-009 config.ts now exports only TELEMETRY_STORE_DIR (config.ts:47).

## Findings

1. **R3-I2-01 (P2) Stale "re-export for backward compatibility" comment on the fixed tree-thinning import.**
   Claim side: runtime/cli/core/tree-thinning.ts:78-80 — "imported and re-exported for backward compatibility" / "Re-export for backward compatibility. Prefer direct import from @spec-kit/shared/utils/token-estimate."
   Actual side: grep of every `export` in the file and every `estimateTokenCount` occurrence shows only the import (line 79) and one use (line 228); no re-export exists. Census R7-02 recorded the re-export as removed and the test repointed (runtime/cli/tests/tree-thinning.vitest.ts:9 imports shared directly), but the two comment lines that announced the re-export survived the fix.
   Severity: P2 cosmetic (misleading comment on top of a fixed row). Recommendation: delete the two comment lines.

2. **R3-I2-02 (P2) Name collision: local `ParsedFrontmatter` in validation has a different shape than the shared export of the same name.**
   Claim side: runtime/lib/validation/spec-doc-structure.ts:95 declares `interface ParsedFrontmatter { rawBlock; error; memoryError; memoryBlock; continuityBlock; fingerprint }`.
   Actual side: shared/frontmatter/parse-frontmatter.ts:18 exports `ParsedFrontmatter { frontmatter; body; raw }`; orchestrator.ts imports the shared parseFrontmatter (line 10) and imports spec-doc-structure (line 14) in the same module, so two different `ParsedFrontmatter` shapes coexist in one module. This is the "same names, different fields" hazard — the local interface occupies the name of a shared export without being the shared shape.
   Severity: P2 (not P1: the local shape is not a duplicate of the shared one and nothing consumer-visible breaks; the name collision alone is the defect). Recommendation: rename the local interface (e.g. `SpecDocFrontmatter`) or import the shared shape and extend it.

## Verified correct (no finding)

- No consumer re-declares the shared context-type family: runtime/cli/lib/frontmatter-migration.ts:15 imports CANONICAL_CONTEXT_TYPES and LEGACY_CONTEXT_TYPE_ALIASES from `@spec-kit/shared/context-types` rather than re-declaring. The only other context-type strings in the tree are literals, not declarations.
- No consumer re-declares EmbeddingProfile/EmbeddingProfileData/IEmbeddingProvider/ProviderMetadata anywhere in runtime/ (grep of `interface EmbeddingProfile` / `interface ProviderMetadata` / `interface IEmbeddingProvider` across runtime/ returns zero hits; the advisor's re-exports are `export *` shims — census R5-01 recorded).
- runtime/cli/core/config.ts redefines WorkflowConfig/SpecKitConfig (lines 22/46); shared/config.ts now exports only TELEMETRY_STORE_DIR — no shared config shape is duplicated (census L2's runtime block was already removed).
- validation/orchestrator.ts ValidationEntry/ValidationReport/RegistrySeverity, spec-doc-structure.ts RuleResult/SpecDocRuleName/RuleDiagnostic, memory-metadata.ts MemoryClassificationContext/SessionDedupContext/CausalLinksContext and the Workflow*Evidence types have no shared counterpart.
- shared/parsing/memory-template-contract.ts:59 uses the distinct name `ParsedFrontmatterSection` — no collision.
- alignment-validator.ts:34's FileChangeWithMergeMetadata extends runtime's own session-types FileChange, not a shared shape.

## Open questions

- O3: Is the spec-doc-structure ParsedFrontmatter shape ever merged with a shared parse result in one expression? (orchestrator.ts:859/887 uses the shared one and the structure rules use the local one — no same-module merge found, so the collision is latent.)
