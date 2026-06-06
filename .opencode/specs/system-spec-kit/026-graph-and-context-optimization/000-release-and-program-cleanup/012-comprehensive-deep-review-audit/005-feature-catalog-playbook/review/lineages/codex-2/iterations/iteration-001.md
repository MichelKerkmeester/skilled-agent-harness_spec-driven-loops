# Iteration 1: Correctness

## Focus
Dimension: correctness.

Reviewed the target spec, the master feature catalog entry for feature catalog code references, the split item 214 entry, and representative live source files named by catalog/playbook coverage.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required
- **F001**: Master catalog overstates universal feature annotation coverage. The master catalog says feature catalog references exist in "every source file" and that implementation files carry `// Feature catalog:` annotations [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3950]. The split item for the same feature says the convention is partial, with about 69% coverage and explicit exemptions [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md:26]. A sampled live feature file names `mcp_server/handlers/embedder-status.ts` as the implementation for embedder status [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/embedder-status-and-active-pointer.md:42], while the handler exports the live implementation without a nearby feature-catalog annotation in the reviewed header/handler range [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:117]. Command evidence recorded `195` annotated files out of `437` source files in the mcp_server/shared source scope [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/review/lineages/codex-2/logs/evidence-commands.md:6].

```json
{
  "findingId": "F001",
  "claim": "The master feature catalog overstates universal feature annotation coverage for item 214 even though the split catalog entry and sampled live source show partial coverage.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946",
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3950",
    ".opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md:26",
    ".opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/embedder-status-and-active-pointer.md:42",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:117"
  ],
  "counterevidenceSought": "Checked the split item 214 catalog file, sampled the embedder_status feature file and handler, counted annotated files in mcp_server/shared, and validated annotation-name matching separately.",
  "alternativeExplanation": "The master wording may intend implementation files only and allow exemptions, but it says every source file before narrowing to partial/exempt coverage elsewhere.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if the master catalog is updated to match partial measured coverage or an automated coverage proof shows all non-exempt implementation files are annotated.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

- **F002**: Catalog cleanup claim is false while phase-style labels remain in non-test source comments. Item 214 states that stale Sprint/Phase/spec-number references in non-test comments have been removed [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md:30], and the master catalog repeats that stale Sprint/Phase/spec-number references are gone [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3950]. Live non-test source still contains phase-style labels in comments, including `PI-B3` in the memory-context handler [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:54], `PI-A4` in the memory surface hook [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:372], and `PI-A2` in the hybrid-search module [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:202].

```json
{
  "findingId": "F002",
  "claim": "The catalog cleanup claim that stale phase/spec-style labels were removed from non-test source comments is contradicted by live non-test source comments.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/feature-catalog-code-references.md:30",
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3950",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:54",
    ".opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:372",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:202"
  ],
  "counterevidenceSought": "Searched representative non-test TypeScript comments across mcp_server, shared, and scripts for Sprint, Phase, spec-number, PI, ADR, REQ, and CHK-style labels.",
  "alternativeExplanation": "The cleanup claim may have targeted only exact Sprint/Phase/spec-number strings, but the project policy also treats phase/task labels as perishable tracking artifacts, and item 214 frames the replacement as name-only catalog references.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if the catalog narrows the claim to exact removed token classes and a separate comment-hygiene packet owns the remaining PI/CHK-style labels.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|
| spec_code | partial | hard | target spec:36, target spec:40 | The requested audit found unbacked/drifted catalog claims. |
| feature_catalog_code | partial | advisory | feature_catalog.md:3946, item 214:26, item 214:30 | Catalog claims do not reconcile with split item/live code. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: Two new required-fix drift classes were found, both backed by catalog text plus live code evidence.

## Ruled Out
- Treating the master catalog as merely shorthand was rejected because it uses universal language while the split file documents partial coverage.

Review verdict: CONDITIONAL
