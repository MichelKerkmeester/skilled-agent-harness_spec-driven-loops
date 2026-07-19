---
title: "Tier-2 fallback channel forcing"
description: "Tier-2 fallback channel forcing sets `forceAllChannels: true` during quality fallback so all retrieval channels execute regardless of simple-route reduction."
trigger_phrases:
  - "tier-2 fallback channel forcing"
  - "forceAllChannels"
  - "quality fallback channel override"
  - "simple-route channel bypass"
version: 3.6.0.16
---

# Tier-2 fallback channel forcing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tier-2 fallback channel forcing sets `forceAllChannels: true` during quality fallback so all retrieval channels execute regardless of simple-route reduction.

Normally the search system skips some search methods when a question seems simple. But when results come back poor, this fallback kicks in and forces every search method to run. It is a safety net that says "the shortcut did not work, so try everything before giving up."

---

## 2. HOW IT WORKS

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/search/hybrid-search.ts` | Lib | Tiered fallback orchestration that sets `forceAllChannels: true` during Tier-2 degradation for simple-routed queries |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/hybrid-search.vitest.ts` | Automated test | Regression `C138-P0-FB-T2` for Tier-2 forced-channel fallback |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval-enhancements/tier-2-fallback-channel-forcing.md`
Related references:
- [cross-document-entity-linking.md](../../feature-catalog/retrieval-enhancements/cross-document-entity-linking.md) — Cross-document entity linking
- [provenance-rich-response-envelopes.md](../../feature-catalog/retrieval-enhancements/provenance-rich-response-envelopes.md) — Provenance-rich response envelopes
