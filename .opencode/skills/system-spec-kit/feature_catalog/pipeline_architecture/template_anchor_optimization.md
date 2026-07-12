---
title: "Template anchor optimization"
description: "Template anchor optimization parses anchor markers in memory files and attaches semantic type metadata to pipeline rows without modifying scores."
trigger_phrases:
  - "template anchor optimization"
  - "anchor marker parsing"
  - "semantic type metadata"
  - "pipeline row metadata"
  - "attach type without modifying scores"
version: 3.6.0.17
---

# Template anchor optimization

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Template anchor optimization parses anchor markers in memory files and attaches semantic type metadata to pipeline rows without modifying scores.

Memory files contain hidden markers that label sections as things like "decision" or "summary." This feature reads those markers and attaches the labels to search results as extra information. It does not change how results are ranked. It adds useful tags so that later steps in the pipeline know what content type they are looking at.

---

## 2. HOW IT WORKS

Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.

This is a pure annotation step wired into Stage 2 as step 8. It never modifies any score fields. The enrichment makes Stage 3 (rerank) and Stage 4 (filter) anchor-aware without score side-effects. No feature flag. Always active.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/anchor-metadata.vitest.ts` | Automated test | Anchor metadata tests |
| `mcp_server/tests/memory-types.vitest.ts` | Automated test | Memory type tests |
| `mcp_server/tests/pipeline-architecture-remediation.vitest.ts` | Automated test | Direct audit traceability coverage for anchor metadata ownership |
| `mcp_server/tests/retrieval-trace.vitest.ts` | Automated test | Retrieval trace tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Automated test | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Automated test | Folder scoring type tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Automated test | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Automated test | Transaction metric types |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `pipeline_architecture/template_anchor_optimization.md`
Related references:
- [chunk-ordering-preservation.md](chunk_ordering_preservation.md) — Chunk ordering preservation
- [validation-signals-as-retrieval-metadata.md](validation_signals_as_retrieval_metadata.md) — Validation signals as retrieval metadata
