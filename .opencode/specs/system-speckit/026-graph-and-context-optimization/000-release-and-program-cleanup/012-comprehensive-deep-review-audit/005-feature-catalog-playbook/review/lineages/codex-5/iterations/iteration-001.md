# Iteration 001 - Correctness

Focus: catalog traceability claims versus observed source coverage.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/spec.md`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md`
- `.opencode/skills/system-spec-kit/mcp_server/api/eval.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/index.ts`

## Findings

### F001 - P1 - Root catalog promises universal feature annotations even though current coverage is partial

The root catalog says feature catalog code references embed traceability comments in every source file, and that each file declares the catalog features it implements. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946]

The detailed feature page narrows that to a measured partial convention: 192 of 280 non-test TypeScript files at the time of that audit, with pure utility, type, and barrel files treated as exemptions. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md:26]

A sampled current source file starts with MODULE metadata and exports implementation API without a feature annotation in the opened header block. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/api/eval.ts:1]

Current broad review count: 195 annotated non-test TypeScript files out of 437 under `mcp_server/` and `shared/`.

Recommendation: revise the root catalog to state measured partial coverage, refresh the detailed metric, and either add missing annotations or document an exemption manifest.

## Claim Adjudication

```yaml
findingId: F001
claim: The root feature catalog overstates annotation coverage as universal while observed and detailed evidence show partial coverage.
evidenceRefs:
  - .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946
  - .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md:26
  - .opencode/skills/system-spec-kit/mcp_server/api/eval.ts:1
counterevidenceSought: Checked the detailed feature page and representative annotated files.
alternativeExplanation: Some unannotated files may be intentional exemptions, but the universal root sentence omits that qualification.
finalSeverity: P1
confidence: 0.88
downgradeTrigger: Downgrade if the root catalog is revised to say partial coverage or if an exemption manifest proves all unannotated files are intentionally out of scope.
```

## Verdict Rationale

P1 finding present. No P0 found.
Review verdict: CONDITIONAL
