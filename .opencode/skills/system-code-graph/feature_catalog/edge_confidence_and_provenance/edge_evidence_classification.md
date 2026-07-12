---
title: "Edge evidence classification"
description: "Shared read-path classification that recognizes AMBIGUOUS as weak evidence and scopes edge-confidence-differentiation normalization strictly to CALLS edges across query, scan and context handlers."
trigger_phrases:
  - "edge evidence classification"
  - "system-code-graph feature catalog"
  - "classifyEdgeEvidenceClass"
importance_tier: "important"
version: 1.3.0.0
---

# Edge evidence classification

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Three read-path handlers -- `code_graph_query`, `code_graph_scan` and `code_graph_context` -- each classify an edge's evidence strength for output (`edgeEvidenceClass: 'direct_call' | 'inferred_heuristic' | 'import' | 'type_reference' | 'test_coverage'`) and normalize its numeric confidence when `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` is off. All three treat an edge's `evidenceClass` of `AMBIGUOUS` as weak evidence, on par with `INFERRED`, and all three scope the flag-off legacy-tier substitution strictly to `CALLS` edges -- every other edge type (`IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `TESTED_BY`, `TYPE_OF`, `CONTAINS`, `DECORATES`, `OVERRIDES`) resolves its own constant classification by construction and is unaffected by the flag either way.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Runs inline inside each handler's response formatting whenever `code_graph_query`, `code_graph_scan` or `code_graph_context` is dispatched. There is no separate trigger; the classification is part of building the tool's normal output.

### Class

manual. Classification only fires inside a manually dispatched query/scan/context call; no ambient hook or watcher classifies edges outside a requested response.

### Caveats / Fallback

Before this fix, only `metadata?.evidenceClass === 'INFERRED'` counted as weak evidence in `query.ts`'s classifier; an `AMBIGUOUS` edge (the tier written for a same-name match against more than one candidate) fell through to `direct_call`, overstating its reliability. All three consumers now check `detectorProvenance === 'heuristic' || evidenceClass === 'INFERRED' || evidenceClass === 'AMBIGUOUS'` before classifying an edge as `inferred_heuristic`.

The flag-off legacy-tier substitution (`confidence: 0.8`, `evidenceClass: 'INFERRED'`, `detectorProvenance: 'heuristic'`) only applies when `edge.edgeType === 'CALLS'`. This matters because a database touched by a prior flag-on scan can carry differentiated confidence on `CALLS` edges specifically; the substitution guarantees flag-off reads see the pre-differentiation constant for exactly the edge type the flag differentiates, without touching any edge type the flag never wrote to. See [edge-confidence-differentiation.md](../edge_confidence_and_provenance/edge_confidence_differentiation.md) for the write-side values this substitution normalizes away, and ADR-001 in `011-edge-confidence-review-remediation/decision-record.md` for the full rationale.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:716-741` | Handler | `classifyEdgeEvidenceClass()`: recognizes `AMBIGUOUS` as weak evidence, keeps the legacy uniform tier for `CALLS` while the flag is off |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:752-782` | Handler | `edgeMetadataOutput()`: emits the flag-off legacy tier for `CALLS` edges, real persisted metadata otherwise |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:109-160` | Handler | `summarizeGraphEdgeEnrichment()`: mirrors the same `AMBIGUOUS`-as-weak-evidence and `CALLS`-only scoping for the scan response's edge-enrichment summary |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:460-480` | Library | `normalizedContextEdgeMetadata()`: the same `CALLS`-only flag-off substitution feeding `contextEdgeReliability`, `why_included` and formatted context edges |
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts` | Library | `isCodeGraphEdgeConfidenceDifferentiationEnabled()`, the single flag check all three handlers share |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/read_path_freshness/` | Manual Playbook | Operator-facing manual scenarios covering `code_graph_query` output |
| `../../manual_testing_playbook/manual_scan_verify_status/` | Manual Playbook | Operator-facing manual scenarios covering `code_graph_scan` output |
| `../../manual_testing_playbook/context_retrieval/` | Manual Playbook | Operator-facing manual scenarios covering `code_graph_context` output |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` | Automated test | AMBIGUOUS-CALLS-edge classified as `inferred_heuristic` |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Automated test | AMBIGUOUS-CALLS-edge classified as `inferred_heuristic` in the edge-enrichment summary |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Automated test | AMBIGUOUS-edge ambiguity flag, mid-session flag toggle and IMPORTS-edges-unaffected coverage |

## 4. SOURCE METADATA

- Group: Edge confidence and provenance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `edge-confidence-and-provenance/edge-evidence-classification.md`

Related references:

- [edge-confidence-differentiation.md](../edge_confidence_and_provenance/edge_confidence_differentiation.md)
- [seeded-ppr-impact-ranking.md](../edge_confidence_and_provenance/seeded_ppr_impact_ranking.md)
- [../read-path-freshness/query-self-heal.md](../read_path_freshness/query_self_heal.md)
- [../manual-scan-verify-status/code-graph-scan.md](../manual_scan_verify_status/code_graph_scan.md)
- [../context-retrieval/code-graph-context.md](../context_retrieval/code_graph_context.md)
