---
title: "Edge confidence differentiation"
description: "Opt-in CALLS edge write-path differentiation that replaces the legacy uniform 0.8/INFERRED/heuristic tier with resolution-specific confidence and evidence class."
trigger_phrases:
  - "edge confidence differentiation"
  - "system-code-graph feature catalog"
  - "SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION"
importance_tier: "important"
version: 1.3.0.0
---

# Edge confidence differentiation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` is a default-off write-path flag. Off, every `CALLS` edge keeps the legacy constant metadata (`confidence: 0.8`, `evidenceClass: 'INFERRED'`, `detectorProvenance: 'heuristic'`) regardless of how it was resolved. On, both `CALLS` resolution paths write resolution-specific confidence instead of the uniform constant: same-file name-matching in the structural indexer, and cross-file import-target matching in the cross-file edge resolver. No other edge type is affected by this flag.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Write-time only, inside an explicit `code_graph_scan`. There is no read-time toggle; the differentiated values are computed once, at edge-write time, during indexing and the post-index cross-file resolution pass.

### Class

manual. The flag only takes effect on the next `code_graph_scan`; existing persisted edge metadata does not change until a symbol's `CALLS` edges are rewritten by a subsequent scan.

### Caveats / Fallback

Same-file resolution (`structural-indexer.ts`) writes `0.75/INFERRED` for a single matching candidate and `0.35/AMBIGUOUS` when more than one candidate matches the called name. Cross-file resolution (`cross-file-edge-resolver.ts`) writes `0.75/INFERRED` for a single same-name candidate and `0.3/AMBIGUOUS` (with an explicit `detectorProvenance: 'heuristic'`) when multiple candidates match. The cross-file single-candidate tier was downgraded from an earlier `0.9/EXTRACTED` value during review remediation: a same-name-only cross-file match is an inference, not a verified ground-truth extraction, so `0.9/EXTRACTED` overstated its reliability.

Flag-off reads do not trust whatever confidence a prior flag-on scan already persisted. `contextEdgeReliability`/`why_included` in `code-graph-context.ts`, the relationship classifiers in `query.ts`, and the enrichment summarizer in `scan.ts` all substitute the legacy uniform tier for any `CALLS` edge while the flag is off, so toggling the flag back off restores byte-identical ranking and output even against a database that has residual differentiated metadata from an earlier flag-on scan (ADR-001, `011-edge-confidence-review-remediation/decision-record.md`). See [edge-evidence-classification.md](./edge-evidence-classification.md) for the read-side normalization contract.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts` | Library | owns `isCodeGraphEdgeConfidenceDifferentiationEnabled()`, the single flag check shared by every write and read consumer |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148-182` | Library | `buildEdgeMetadata`/`buildDifferentiatedCallsEdgeMetadata`: same-file `CALLS` resolution writes `0.75/INFERRED` (single candidate) or `0.35/AMBIGUOUS` (multiple candidates) |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1140-1170` | Library | wires `buildDifferentiatedCallsEdgeMetadata` into the same-file `CALLS` edge extraction loop, gated by the flag |
| `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:90-166` | Library | `resolveCrossFileCallEdges()`: cross-file import-target resolution writes `0.75/INFERRED` (single candidate, downgraded from the legacy `0.9/EXTRACTED`) or `0.3/AMBIGUOUS` with a guaranteed `detectorProvenance: 'heuristic'` (multiple candidates) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/manual-scan-verify-status/` | Manual Playbook | Operator-facing manual scenarios for scan-time write behavior |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts` | Automated test | cross-file `0.75/INFERRED` single-candidate and `0.3/AMBIGUOUS` multi-candidate confidence-tier assertions |

## 4. SOURCE METADATA

- Group: Edge confidence and provenance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `edge-confidence-and-provenance/edge-confidence-differentiation.md`

Related references:

- [edge-evidence-classification.md](./edge-evidence-classification.md)
- [seeded-ppr-impact-ranking.md](./seeded-ppr-impact-ranking.md)
- [../manual-scan-verify-status/code-graph-scan.md](../manual-scan-verify-status/code-graph-scan.md)
