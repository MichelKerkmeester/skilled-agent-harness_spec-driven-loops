---
title: "Reverse image search (skvisionreverse)"
description: "No-API-key reverse search: local perceptual-hash near-duplicates plus Yandex web matches."
trigger_phrases:
  - "Reverse image search (sk_vision_reverse)"
  - "where does this image come from"
  - "sk_vision_reverse"
  - "find similar images locally"
version: 1.0.0.0
---

# Reverse image search (sk_vision_reverse)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

No-API-key reverse search: local perceptual-hash near-duplicates plus Yandex web matches.

`sk_vision_reverse` finds where an image already exists — in the local cache and directory tree, or on the web — without any API key.

---

## 2. HOW IT WORKS

The tool computes a 64-bit perceptual hash of the query image and compares it against every image in the sk-vision cache plus an optional `dir` (the hash distance, up to 6 bits, becomes a similarity score). Local matches are returned with their paths, similarity, and scan count, capped by `limit` (default 8, max 25).

When the `yandex` provider is enabled (default), the runtime uploads the image through the public Yandex image-search flow — no API key required — and returns matching page URLs plus a browser-ready fallback URL. Yandex requires a file path source, so inline data-URL queries run local-only.

### Edge Cases

Yandex can hit captcha or rate limits; those failures are returned gracefully with the fallback URL instead of crashing. The local scan skips cache, node_modules, and git directories.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `reverse` and `hashSearch` methods |
| `vision-runtime/python/runtime.py` | Script | `handle_reverse`, `handle_hash_search`, `_dhash64`, `_hamming`, `_yandex_reverse` |
| `pi/sk-vision.ts` | Handler | `sk_vision_reverse` registration and provider parsing |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Asserts local hash-search matches on a fixture directory |
| `references/runtime-reference.md` | Reference | Documents the reverse-search contract |

---

## 4. SOURCE METADATA

- Group: system-health
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `system-health/reverse.md`

Related references:
- [status.md](status.md) — the other system-level diagnostic capability
- [metadata.md](../pixel-analysis/metadata.md) — verify an image before searching for it
