---
title: "Contextual tree injection"
description: "Contextual tree injection prefixes returned chunks with hierarchical context headers using cached spec folder descriptions."
trigger_phrases:
  - "contextual tree injection"
  - "hierarchical context headers"
  - "SPECKIT_CONTEXT_HEADERS"
  - "chunk context prefix"
version: 3.6.0.18
---

# Contextual tree injection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Contextual tree injection prefixes returned chunks with hierarchical context headers using cached spec folder descriptions.

When search results come back, each piece of information now carries a short label showing where it belongs in the project, like "Project > Feature > Detail." Without this, you would see raw content with no clue about its context. It is like seeing a chapter heading at the top of a photocopied page so you know which part of the book it came from.

## 2. HOW IT WORKS

**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Injects contextual headers after Stage 4 truncation and builds the cached tail-description map |
| `mcp_server/lib/search/search-flags.ts` | Lib | Exposes the `SPECKIT_CONTEXT_HEADERS` runtime gate |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Automated test | Context header injection |
| `mcp_server/tests/search-flags.vitest.ts` | Automated test | Feature flag behavior |

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval-enhancements/contextual-tree-injection.md`

### MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `145` | Direct manual validation for enabled/disabled contextual header injection behavior |
Related references:
- [provenance-rich-response-envelopes.md](provenance-rich-response-envelopes.md) — Provenance-rich response envelopes
- [session-boost-graduated.md](session-boost-graduated.md) — Session attention boost (graduated default-ON)
