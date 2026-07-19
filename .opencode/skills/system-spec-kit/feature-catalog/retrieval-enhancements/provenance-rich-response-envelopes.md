---
title: "Provenance-rich response envelopes"
description: "Provenance-rich response envelopes expose internal pipeline scoring and retrieval trace data in search results when `includeTrace` is enabled."
trigger_phrases:
  - "provenance-rich response envelopes"
  - "retrieval trace data"
  - "pipeline scoring provenance"
  - "includeTrace search results"
  - "search result scoring transparency"
version: 3.6.0.12
---

# Provenance-rich response envelopes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Provenance-rich response envelopes expose internal pipeline scoring and retrieval trace data in search results when `includeTrace` is enabled.

When you search for something, the system normally just gives you the answer. With this feature turned on, it also shows you how it found the answer: which search methods it used, how it scored each result and where the information came from. It is like getting a receipt with your purchase that shows every step of the transaction.

---

## 2. HOW IT WORKS

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState) and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/formatters/search-results.ts` | Formatter | Defines `MemoryResultEnvelope` and conditionally adds `scores`, `source` and `trace` when `includeTrace` is enabled. |
| `mcp-server/handlers/memory-search.ts` | Handler | Resolves effective `includeTrace` (`SPECKIT_RESPONSE_TRACE` flag or request arg) and forwards it to response formatting. |
| `mcp-server/handlers/memory-context.ts` | Handler | Forwards `includeTrace` through internal `memory_search` calls so context responses can include provenance. |
| `mcp-server/lib/response/envelope.ts` | Lib | Builds and wraps the canonical MCP response envelope (`summary`, `data`, `hints`, `meta`) that carries formatted provenance payloads. |
| `mcp-server/schemas/tool-input-schemas.ts` | Schema | Admits `includeTrace` for `memory_search` and `memory_context` input validation. |
| `mcp-server/tool-schemas.ts` | Schema | Documents `includeTrace` in published tool JSON schemas. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/search-results-format.vitest.ts` | Automated test | Formatter-level validation for trace channels, query complexity fallback and envelope payload shaping. |
| `mcp-server/tests/mcp-response-envelope.vitest.ts` | Automated test | Protocol-level MCP envelope validation with `includeTrace` on/off provenance assertions. |
| `mcp-server/tests/envelope.vitest.ts` | Automated test | Core response envelope contract validation (`content[]`, `meta` and wrapper behavior). |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval-enhancements/provenance-rich-response-envelopes.md`
Related references:
- [tier-2-fallback-channel-forcing.md](../../feature-catalog/retrieval-enhancements/tier-2-fallback-channel-forcing.md) — Tier-2 fallback channel forcing
- [contextual-tree-injection.md](../../feature-catalog/retrieval-enhancements/contextual-tree-injection.md) — Contextual tree injection
