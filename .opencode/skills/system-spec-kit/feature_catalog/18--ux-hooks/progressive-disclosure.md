---
title: "Progressive disclosure with cursor pagination"
description: "Progressive disclosure adds a companion payload for search results consisting of a summary layer, snippet extraction, and continuation cursors for paginated retrieval, gated by the SPECKIT_PROGRESSIVE_DISCLOSURE_V1 flag."
trigger_phrases:
  - "progressive disclosure with cursor pagination"
  - "SPECKIT_PROGRESSIVE_DISCLOSURE_V1"
  - "cursor pagination"
  - "snippet extraction search results"
  - "progressive disclosure search"
version: 3.6.0.6
---

# Progressive disclosure with cursor pagination

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Progressive disclosure adds a companion payload to search results consisting of a summary layer, snippet extraction, and continuation cursors for paginated retrieval, gated by the `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` flag.

The live handler preserves full `data.results`, adds `data.progressiveDisclosure`, and serves follow-up pages through `memory_search({ cursor })`. The summary tells you the quality distribution (e.g., "3 strong, 2 moderate, 1 weak") so you can decide whether to dig deeper, while pagination uses opaque cursor tokens with a time-to-live so the system can serve additional pages from a cached result set.

---

## 2. HOW IT WORKS

The progressive disclosure module provides four layers:
1. **Summary layer**: compact digest of result quality distribution via confidence label counts (high/medium/low), formatted as "3 strong, 2 moderate, 1 weak".
2. **Snippet extraction**: short previews (max `SNIPPET_MAX_LENGTH = 100` characters) with `detailAvailable` flags.
3. **Continuation cursors**: base64-encoded opaque tokens containing offset, query hash (djb2), and timestamp. TTL is `DEFAULT_CURSOR_TTL_MS = 5 minutes`. Cursors resolve against an in-memory `cursorStore` keyed by query hash.
4. **Progressive response builder**: orchestrates all layers into a `ProgressiveResponse` used by the live handler to populate `data.progressiveDisclosure` while preserving full `data.results`.

Default page size is `DEFAULT_PAGE_SIZE = 5`. Cursor encoding/decoding uses JSON-in-base64 with strict field validation. The `cursorStore` is process-local (Map-based, no disk persistence).

Default ON (graduated). Set `SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false` to disable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/progressive-disclosure.ts` | Lib | Summary layer, snippet extraction, cursor pagination, progressive response builder |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isProgressiveDisclosureEnabled()` flag accessor |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/progressive-disclosure.vitest.ts` | Automated test | Flag behavior, summary generation, snippet extraction, cursor encode/decode, pagination |
| `mcp_server/tests/memory-search-ux-hooks.vitest.ts` | Automated test | Live handler integration for additive disclosure payloads and cursor-only continuation |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/progressive-disclosure.md`
Related references:
- [mode-aware-response-profiles.md](mode-aware-response-profiles.md) — Mode-aware response profiles
- [retrieval-session-state.md](retrieval-session-state.md) — Retrieval session state
